# Plan contribution: verification

> Author: `qa-reviewer`, 2026-09-28, for `docs/plan/implementation-plan.md` (`implementation-plan` skill, verification section). Decisions only, no code bodies.
> **Inputs:** `CLAUDE.md` · `info.md` (confirmed 2026-09-27) · `docs/design/directions.md` §3, §5, §7, §11 (B · Proof, selected 2026-09-28) · `DESIGN.md` (version of 2026-09-28 01:19; lint 0 errors, 0 warnings) · `docs/plan/contrib-design.md` (2026-09-28) · skills `ui-audit` with its checklist, `perf-seo-audit`, `code-review`, `verification`, `portfolio-content` D.
> **Names** of tokens and components are `DESIGN.md`'s. Where `DESIGN.md` and directions §5 differ, `DESIGN.md` wins.
> **Phases** follow the cut `contrib-design.md` §6.1 requires: the first visual phase carries the shell, the hero with the bench at rest, and the CyberRock sheet. The bench motion follows it. If the assembled plan cuts differently, each criterion moves with its feature and keeps its ID.
> **Tool versions** (`npm view`, 2026-09-28; the engineering contribution owns the final pins): @playwright/test 1.63.0 (Apache-2.0), @axe-core/playwright 4.13.0 (MPL-2.0), vitest 5.0.2 (MIT), @lhci/cli 0.15.1 (Apache-2.0; bundles lighthouse 12.6.1), unpdf 1.8.1 (MIT), schema-dts 2.0.0 (Apache-2.0). For context: next 16.3.6, react 19.3.0.

## Summary for assembly
- **Layers:** static checks, unit (Vitest), e2e with axe (Playwright, five projects, both themes on every UI spec), a visual matrix (evidence for people, no pixel diffing), Lighthouse CI, automated content verification against `info.md`, and a deploy smoke test.
- **JS budget:** at most 130 kB gzip of first-load JS per HTML route, of which at most 25 kB is project code. It is measured on the network, because Next.js 16 no longer prints first-load sizes in `next build`.
- **Review Focus:** private data (P1), theme parity (P2), breakage between the checked widths (P2, extended in P4), facts and the name across surfaces (P6, extended in P7), and failures that only happen on production (P9).
- **Rulings needed before P2:** D1 (colour transitions vs `CLAUDE.md`), D2 (the latin-ext subset and the `→` glyph), D3 (two size conflicts in `DESIGN.md`), D4 (the Résumé link before the PDF exists), and D7 (copy approvals, including the date format). `contrib-engineering.md` already answers D2, D4 and D9 and proposes stricter JS, font and avatar budgets, which QA endorses (§11).

## 1. Test layers and tools

### 1.1 What each layer proves
| Layer | Tools | Proves |
|---|---|---|
| Static | ESLint with jsx-a11y; `tsc` strict; `npx @google/design.md lint DESIGN.md`; a raw-value scan; a token-export diff | Code rules and types; `DESIGN.md` is valid; no literal design values in code; exported tokens are not hand-edited |
| Unit | Vitest | Logic, written test-first: the content schema; the content trace (every content string exists in `info.md`); number and date formatters; metadata and JSON-LD builders; robots and noindex per environment; theme resolution; the bench state machine (sequence, restart, cancel, reduced motion) |
| E2E and accessibility | Playwright with @axe-core/playwright | Behaviour in real browsers against the production build: rendering, keyboard, theme, motion, network privacy, fonts, geometry and page weight; axe with 0 violations in both themes |
| Visual matrix | Playwright captures (§3) | Evidence for review: `DESIGN.md` conformance, section collapse, both themes, states. Never pixel-diffed, because baselines are brittle across machines and fonts and every phase gets a human review |
| Lighthouse CI | @lhci/cli | Scores, lab vitals, byte budgets, the LCP element |
| Content verification | Playwright specs tagged `@content`; unpdf (pdf.js) for PDF text | Rendered facts trace to `info.md`; placeholders, dashes, forbidden strings, links, and consistency across surfaces (§5) |
| Deploy smoke | Playwright specs tagged `@smoke`, read-only, against a URL | Host, canonical, social image, redirects, headers, PDF and video facade on the real deployment |

### 1.2 When each layer runs
| Moment | Who | What runs |
|---|---|---|
| Before hand-off | frontend-engineer | The full `CLAUDE.md` gate; at least the `chromium` e2e project; its own captures at 375, 768 and 1440 in both themes (`frontend-build` step 9) |
| CI, every push (once a remote exists) | GitHub Actions or an equivalent chosen by engineering | Static, unit, build, every e2e project, offline content checks, the privacy scan, and LHCI at the CI levels in §6. Until a remote exists, the main session runs the same gate locally before marking a phase complete |
| Phase review | qa-reviewer | A fresh gate run; code-review; ui-audit (full matrix, axe matrix, keyboard scripts with focus captures, checklist on changed files); a read of any new copy |
| Milestone audit | qa-reviewer | perf-seo-audit (§7): median of 3, mobile and desktop, quiet machine |
| Release audit | qa-reviewer | All of the above for the whole site, plus external link status and JSON-LD validation, on the local production build and the preview deployment |
| After deploy | qa-reviewer | `@smoke` and LHCI against https://daiho.dev |

### 1.3 Harness decisions (built in P1, extended by each phase)
- **Production only.** Playwright's web server is the production build. Runs against a URL (preview or production) are read-only.
- **Projects** (names provisional):
  - `chromium`: everything, including axe and the Chromium-only APIs (CDP fonts, layout shift, Event Timing).
  - `firefox` and `webkit`: layout at 320, 375 and 1440, plus the theme, menu, bench and facade specs.
  - `chromium-nojs`: JavaScript disabled.
  - `chromium-rm`: reduced motion.
  - `smoke`: targets `BASE_URL`.
- **Both themes by default.** A shared fixture runs every UI spec in light and dark by emulating the system scheme. Theme specs add the stored-choice cases.
- **Guards.** A shared fixture fails a test on any of:
  - a console error or warning
  - an uncaught page error or a hydration warning
  - a same-origin response ≥ 400, except the deliberate 404 probe
  - a request to another origin before an interaction allowed to cause one (only the video facade)
- **Helpers:**
  - an axe runner
  - a network log: script, font and document bytes as served, gzip, plus a third-party count
  - targeted accessibility-tree assertions (`toMatchAriaSnapshot` on headings, landmarks and figures, never whole-page dumps)
  - a runtime theme-switch re-check
  - a WCAG 1.4.12 text-spacing injector
  - delayers for JS chunks and fonts
  - a live-region logger
  - a whole-page focus walk
  - a width sweep (RF3)
- **Determinism.** Zero retries: a flaky test is a bug to root-cause, never retried to green. No fixed sleeps except the deliberate network delays. Tests wait on web-first assertions and `Animation.finished`, and read durations from the Web Animations API, not the clock.
- **WebKit.** Whether Tab reaches links depends on a platform setting, so WebKit specs focus a control directly and then press Enter, Space or Escape.
- **Guard self-tests.** Each guard has a permanent self-test against a `page.setContent` fixture: a console error, a foreign request, an unlabelled button, and a 400 px block at 320 px. Each self-test proves its guard can fail.

### 1.4 Blind spots, and what covers each
| Blind spot | Effect | Covered by |
|---|---|---|
| Next.js 16 removed `size` and `First Load JS` from the `next build` output (upgrade guide) | perf-seo-audit step 1 cannot read JS sizes from the build | LHCI `resource-summary` byte assertions and the e2e network log (D6) |
| LHCI's default `aggregationMethod` is `optimistic`, which takes the best run | "Median of 3" silently becomes "best of 3" | Set `median` or `median-run` explicitly |
| Lighthouse on loopback gets fonts instantly | A font-swap shift never shows locally, yet `DESIGN.md` Known Gap 4 predicts one on the width-125 lockup | The delayed-font test (P2-18) |
| Lighthouse refuses documents that aren't 2xx | The 404 page gets no Lighthouse run | e2e, axe and SEO specs on the 404 |
| Shared CI runners vary in CPU | Performance, LCP and TBT move by several points | CI warns; audits on a quiet machine enforce (§6) |
| CLS ignores layout shifts within 500 ms of an input | Bench jank can hide from CLS | Box-geometry checks (P3-4, P4-8) |
| axe doesn't check SVG stroke contrast, SVG text clipping, text spacing, reflow, focus obscuring, or captions inside iframes | AA gaps pass axe | P2-7, P2-20, P2-24, P4-6, P5-10, D8 |
| The six matrix widths miss thresholds that fall between them | Container-query and breakpoint defects slip through | Width sweep (P2-28, P4-12; RF3) |

## 2. Acceptance criteria

### 2.1 Template
```text
P<n>-<k>  One observable outcome
  Measure:  an exact value or threshold (a number or exact string, never an adjective)
  Where:    route · widths · themes · motion and JavaScript state
  Evidence: command → result line | test title | capture path | report section
```
- One outcome per criterion. "Fast", "clean" and "looks right" are not criteria.
- UI checks are written before the UI. Logic tests fail first.
- The global criteria G1–G11 apply to every phase, on top of its own.
- If the build can't prove a criterion (an approval, for example), the criterion names the document that does.

### 2.2 Global criteria (every phase)
| ID | Criterion | Evidence |
|---|---|---|
| G1 | The gate passes on a fresh run: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` and `npx @google/design.md lint DESIGN.md` exit 0 with 0 warnings, and `pnpm lhci` passes its CI levels | command → result lines |
| G2 | axe finds 0 violations in every matrix cell the phase touches (§3.5), and the ui-audit report resolves every `incomplete` item | e2e + report |
| G3 | 0 console errors or warnings, page errors or hydration warnings | guard fixture |
| G4 | 0 px horizontal overflow at 320, 375, 640 (200 % zoom of 1280), 768, 1024, 1440 and 1920, in both themes | e2e |
| G5 | No raw colour, size, radius, duration, easing or z-index outside the token files, including SVG attributes and inline styles. The only z-index is the skip link's 100 | scan output |
| G6 | 0 unsourced strings, placeholders or forbidden strings (§5); no `[copy:` marker renders | `@content` |
| G7 | 0 requests to other origins before interaction; the privacy scan is clean | guard + scan |
| G8 | B8 and B9 hold; every new dependency is in the plan, with version and licence checked by `npm view` | LHCI + network log + diff |
| G9 | Every control is a native `<a>` or `<button>` and at least 44 × 44 px (no inline exemption, since `DESIGN.md` puts every link on its own row). Each shows `focus-ring` on `:focus-visible`: 2 px `focus` at a 2 px offset, at ≥ 3:1 in both themes. Nothing is `disabled` or `aria-disabled` (`DESIGN.md`) | e2e |
| G10 | Animations use only `transform` and `opacity`, with `DESIGN.md` motion tokens. Transitions list their properties (never `all`), and control transitions follow ruling D1. Every animation has its `DESIGN.md` reduced-motion variant | Web Animations API + code review |
| G11 | The Tailwind `@theme` output equals a fresh `npx @google/design.md export --format css-tailwind DESIGN.md`. The hand-mapped layer (dark swap, `font-stretch`, `tnum`/`lnum`, clamps, motion, breakpoints, skip-link layer, strokes and dashes, focus ring; see `DESIGN.md` Known Gaps 1 and contrib-design §9) holds only values from `DESIGN.md`'s tables | CI diff + code review |

### 2.3 Phase criteria

#### P1 · Setup and tooling
| ID | Criterion | Evidence |
|---|---|---|
| P1-1 | All seven `CLAUDE.md` commands exist and pass on the skeleton (G1) | result lines |
| P1-2 | The §1.3 harness exists: five projects plus `smoke`, the two-theme fixture, and the guards with their passing self-tests | `pnpm test:e2e --list` + test titles |
| P1-3 | LHCI runs mobile and `preset: desktop`, 3 runs each, with `aggregationMethod` set to `median` or `median-run` (never the default), filesystem upload and the §6 assertion levels | config + first run |
| P1-4 | The framework baseline is recorded: first-load JS of the bare shell in gzip bytes, from the network log and LHCI (feeds B8) | a line in the P1 report |
| P1-5 | The schema rejects a fixture that lacks a required field. The content-trace unit test passes: every string leaf in `src/content/` is a normalised substring of `info.md` or a sourced allowlist entry (§5.4) | test titles |
| P1-6 | `DaiHo Resume.pdf` is git-ignored and absent from `git ls-files`. The privacy scan covers `src/`, `public/` and the whole build output, client chunks included, and finds 0 phone-shaped numbers, 0 `tel:`, 0 emails other than tidi.dev1321@gmail.com and 0 banner-only strings. It runs in CI | `git check-ignore -v`, scan output |
| P1-7 | `.gitignore` also covers build output, `test-results/`, `playwright-report/`, `.lighthouseci/`, `docs/reviews/**/screens/`, `docs/reviews/**/raw/` and `.env*` | `git check-ignore -v` lines |
| P1-8 | Every dependency is in the plan, with version and licence from `npm view` | `package.json` vs plan |

#### P2 · First visual phase: tokens, fonts, shell, hero with the bench at rest, CyberRock sheet (Checkpoint 1)

*Tokens and theme*

| ID | Criterion | Evidence |
|---|---|---|
| P2-1 | G11 holds from the first token commit | CI diff |
| P2-2 | First paint, tested from four starts (system light or dark, with no stored choice or the opposite choice stored). With every `/_next/static/**/*.js` response delayed 3 s, at `DOMContentLoaded`: the page background equals `surface` or `surface-dark` as expected, `color-scheme` matches, and the applicable `theme-color` equals the page background | e2e |
| P2-3 | The theme script is inline and parser-blocking in `<head>`, before the stylesheets. There are 0 hydration warnings from any of the four starts | server HTML + guard |
| P2-4 | K4 passes. A stored choice survives reload. With no stored choice, changing the emulated system scheme updates the page without a reload. Immediately after a switch, `document.getAnimations()` is empty (the 120 ms control transitions don't fire; `DESIGN.md` says the theme "switches instantly") | e2e |
| P2-5 | Without JavaScript, the system theme applies and the theme toggle is hidden (contrib-design §4). At 320 and 375 every nav link is visible and works, and no dead menu button shows | `chromium-nojs` |

*Shell and navigation*

| ID | Criterion | Evidence |
|---|---|---|
| P2-6 | K1 passes; K2 passes at 768 and wider; K3 passes at 320 and 375; all in both themes | e2e + focus captures |
| P2-7 | Whole-page focus walk: at every stop the ring is visible and the focused box is fully in the viewport and uncovered. The order follows reading order. Focus never lands on `<body>`, a hidden element or a visually hidden list. Later phases inherit this check | e2e |
| P2-8 | No element except the focused skip link is `fixed` or `sticky`. `scroll-behavior` computes to `auto` in every mode. After a nav jump, the target heading's top sits 24 px (±1) from the viewport top, wherever the page can scroll that far | e2e |
| P2-9 | One `banner`, one `main#main` and one `contentinfo`; the nav has an accessible name; `lang="en"`; exactly one `h1` from this phase on | aria snapshot + axe |
| P2-10 | Only the ten Tabler icons `DESIGN.md` names are used. Each is `aria-hidden="true"`, with computed square caps and miter joins | DOM check |

*Fonts and the hero lockup*

| ID | Criterion | Evidence |
|---|---|---|
| P2-11 | Only same-origin woff2 font files load, with `font-display: swap`, one family, the subsets ruled in D2, and within B12. Width is set through `font-stretch`, never `font-variation-settings` | network log + code review |
| P2-12 | One `h1` holds "TiDi", "Hồ Trọng Đại" (inside an element with `lang="vi"`) and "Dai Ho Trong". Both its text content and its accessible name separate the three with whitespace | aria snapshot |
| P2-13 | The name is NFC: it contains U+0110, U+1EA1, U+1ECD and U+1ED3, and no combining mark in U+0300–U+036F | e2e |
| P2-14 | Every glyph in the `lang="vi"` element renders from the Archivo web font: CDP `CSS.getPlatformFontsForNode` reports only custom-font entries | `chromium` |
| P2-15 | The name's computed line height is ≥ 1.15 × its font size, and it never uses the `display` style. It never clips. h1 crops at 320 and 1920, both themes, are reviewed at DSF 2 | e2e + crops |
| P2-16 | The hero follows `DESIGN.md`: three text groups plus the bench, split 5 \| 7 from 1024 and stacked below. The contrib-design §3 checks hold: at 1440 × 900 the whole hero is in view; at 375 × 667 the hero text and the top of the bench are in view; at 1024 the sentence runs 36–48 characters per line. Measures hold: body ≤ 68ch, `lead` ≤ 60ch | e2e + matrix |
| P2-17 | The LCP element is text (the lockup or the sentence), never an image or the bench | e2e LCP observer + LHCI `largest-contentful-paint-element` |
| P2-18 | On a cold load with every woff2 response delayed 2 s, the summed layout shift is ≤ 0.1. The value is recorded; the target is 0 | `chromium` |

*The bench at rest*

| ID | Criterion | Evidence |
|---|---|---|
| P2-19 | The server HTML is the rest state: the completed handshake, both lines proof, the readout "genuine" with `check`, and the caption. Its text and capture are identical before and after hydration | e2e + capture |
| P2-20 | Variants switch by container query: compact below a 480 px content box (at most 1.5×, 384 px), wide from 480 px (at most 1.35×, 648 px). No label renders below 14 px, or above 21 px compact or 18.9 px wide (font size × SVG scale), at any sweep width (D3a). Every SVG `<text>` box lies inside its SVG's viewBox | width sweep |
| P2-21 | No run or counterfeit control is rendered yet; they arrive with their behaviour in P3, so nothing is dead | e2e |

*CyberRock sheet and drawing*

| ID | Criterion | Evidence |
|---|---|---|
| P2-22 | The sheet follows contrib-design §1.2 and §1.4: an `article` with an `h3`; status as bold text; dates in the approved format; the lede; the drawing; a facts `dl` (My role as an inline list, Team, Scale, Stack); "What I built" as an `h4` over three bullets | aria snapshot + `@content` |
| P2-23 | The drawing is a `figure`: both SVGs `aria-hidden="true"`, a visible `figcaption` ("chip authentication and lifecycle") and a visually hidden ordered list. Each step appears once in the accessibility tree, and no SVG label appears there | aria snapshot |
| P2-24 | The drawing follows the grammar: exactly one proof element (2 px `accent`), labelled; ink strokes 1.5 px `primary`; construction 1.5 px `trace` with `stroke-dasharray` "6 4". Computed strokes equal the `drawing-*` tokens in both themes and after a runtime switch. In a grayscale capture, proof, ink and construction stay distinct | e2e + capture |
| P2-25 | Every label and step traces to `info.md`; anomaly detection is not drawn (`DESIGN.md`) | `@content` |
| P2-26 | Both variants are in the HTML. Exactly one renders at every sweep width, and it flips where `DESIGN.md` says (D3b). Labels stay between 14 and 18.2 px (at most 1.3×) | width sweep |

*Copy, budgets and Review Focus*

| ID | Criterion | Evidence |
|---|---|---|
| P2-27 | contrib-design §7 rows 1–4, 6, 7 and 11 are in `info.md` → Approved copy (row 11 is needed here because CyberRock's dates ship in P2) | `info.md` + C6 |
| P2-28 | B8, B9, B10 and B12 hold. The two-theme fixture and the runtime-switch helper are used by every UI spec (RF2). The width sweep exists and covers the bench and the CyberRock drawing (RF3) | LHCI + `--list` |

#### P3 · Bench motion
| ID | Criterion | Evidence |
|---|---|---|
| P3-1 | K5 passes at 320, 768 and 1440, in both themes, with motion on and reduced | e2e |
| P3-2 | The live-region log reads: "challenge", "response", then the verdict for a genuine run; "challenge", then the rejected verdict for a rejected run; the verdict alone under reduced motion. Each message appears once, and nothing from a run is announced after a restart or cancel | live-region logger |
| P3-3 | Motion matches the `DESIGN.md` table. Only `transform` and `opacity` animate, and durations equal `duration-travel`, `-pulse`, `-verdict`, `-shake` and `-feedback`. A genuine run totals 1,080 ms and a rejected run 600 ms. Under reduced motion, `document.getAnimations()` stays empty through a run and step numerals 1 and 2 show | Web Animations API |
| P3-4 | The bench box and the next section's top move 0 px through rest, idle, running and verdict, at every width | geometry |
| P3-5 | Run is a `button-primary` with `player-play`. The counterfeit control is a `button-toggle` using `aria-pressed`, with a constant label, the `square` / `square-check` icon swap and a 2 px `primary` border when pressed. Below a 480 px content box the controls stack at full width; from 480 px they sit side by side. They are never disabled, and focus stays on the pressed button | e2e |
| P3-6 | Interaction latency: the Event Timing duration for run and the toggle is ≤ 200 ms at 4× CPU slowdown | `chromium` |
| P3-7 | With JS chunks delayed 3 s, a click on run made before hydration runs once hydration completes. It is never silently lost | e2e |
| P3-8 | Without JavaScript, a `<noscript>` style hides the controls (`display: none`), the rest state shows, and nothing shifts | `chromium-nojs` |
| P3-9 | A theme switch mid-run or after a verdict updates the computed colours. In a grayscale capture, genuine and rejected differ by text and icon, not colour alone | e2e + capture |
| P3-10 | B9 holds with the bench added; it is the only motion leaf | LHCI + network log |
| P3-11 | contrib-design §7 row 5 is approved, and every bench string traces to `info.md` | `@content` |

#### P4 · Project sheets: botmivivi, Quest with the video facade, Lemonswan, Scania
| ID | Criterion | Evidence |
|---|---|---|
| P4-1 | The order and outline follow contrib-design §1.2: CyberRock, botmivivi, Quest @ NFQ Asia, Lemonswan, Scania, each an `article` with an `h3`, subheads as `h4`, and status as bold text | aria snapshot |
| P4-2 | "Name — description" strings render as term lists with both fragments verbatim. Middot strings render as inline lists with no "·" in the text | e2e |
| P4-3 | Missing optional fields render nothing: Scania has no date element; botmivivi has no link. No "undefined", "null", "NaN" or "Invalid Date" appears anywhere | e2e + `@content` |
| P4-4 | Numbers use en-US grouping (2,951; 107,786; 89,945) and `tnum` in facts, and each traces to `info.md` | unit (formatter) + `@content` |
| P4-5 | The Quest and botmivivi drawings meet P2-23 to P2-26 in full (grammar, figure, tokens, trace, variants, label sizes, SVG text inside the viewBox) | e2e + sweep |
| P4-6 | Facts terms in the 88 px column wrap without clipping at 320 and under the text-spacing override | e2e |
| P4-7 | K6 passes. Before activation there are 0 foreign requests and no `preconnect`, `dns-prefetch`, `prefetch` or `preload` to YouTube or Google hosts, including after hovering and focusing the poster | network log + DOM |
| P4-8 | After activation, an iframe on `https://www.youtube-nocookie.com/embed/yLJZXvO_ARU` with `title="Quest by NFQ"` fades in with `duration-fade`. The poster box and the content after it move 0 px. The referrer policy is `strict-origin-when-cross-origin`, because YouTube requires a Referer from embedded players | e2e |
| P4-9 | Without JavaScript, the poster is a working link to https://www.youtube.com/watch?v=yLJZXvO_ARU | `chromium-nojs` |
| P4-10 | With network access (review and production), the player loads without an error overlay, and its captions include the manual "English (United States)" track | Playwright frame access |
| P4-11 | Lemonswan links to https://lemonswan.com/ in the same tab, with the `external-link` icon. No `target="_blank"` exists anywhere | `@content` |
| P4-12 | The width sweep (RF3) runs from 320 to 1920 px in 8 px steps, plus each breakpoint and each width where a container query flips, ±1 px (with the current numbers: 570, 768, 1024, 1026 and 1280). At every width: no overflow, one variant per drawing, labels 14 px or larger, and no overlap in sheet heads (title vs status and dates) | e2e |
| P4-13 | The HTML document stays within B10 with every inline SVG in place | LHCI |
| P4-14 | contrib-design §7 rows 8–10, 12 and 16 are approved | `info.md` + C6 |

#### P5 · Remaining sections: Experience, House rules, Inventory, About, AFK, Contact
| ID | Criterion | Evidence |
|---|---|---|
| P5-1 | Experience lists Sunbytes and NFQ Asia, each an `h3` with title, dates and projects exactly as in `info.md` ("2024-03 to present", "2020-03 to 2024-03"; Tech lead on Quest). It is rows, not a table, with no header row | aria snapshot + `@content` |
| P5-2 | House rules: both intro lines and the four rules verbatim, with the owner's em dashes kept, as an ordered list in the owner's order | `@content` |
| P5-3 | Inventory shows the five profile groups, items verbatim from "Skills & tools", then Leveling up as one inline list of four. No logos, levels, bars or percentages | e2e + `@content` |
| P5-4 | About: both bio paragraphs verbatim (with "Daniel"); two education entries with years; English (IELTS 6.0, EF SET C1); languages Vietnamese and English | `@content` |
| P5-5 | The avatar is one `img`: AVIF or WebP, with explicit width and height, lazy, not prioritised, using `DESIGN.md`'s `sizes`, within B15. If row 13 is approved, the visible caption equals the `info.md` alt text and the image has `alt=""`, so the description is read once. The 3.1 MB PNG is never requested | network log + aria snapshot |
| P5-6 | AFK uses the profile interests only; no travel or photography | `@content` |
| P5-7 | Contact: the sign-off verbatim as the `h2` with `id="contact"`. Email is `mailto:tidi.dev1321@gmail.com`, Telegram https://t.me/tidi1321 and GitHub https://github.com/tidi-dev, in 48 px rows. No phone, `tel:` or [private email removed]. The email address doesn't overflow at 320 | `@content` + e2e |
| P5-8 | The footer holds "still learning, always solving." verbatim and nothing else | `@content` |
| P5-9 | The heading outline equals contrib-design §1.2 | targeted aria snapshot |
| P5-10 | With the WCAG 1.4.12 text-spacing override at 320 and 1440, no text clips or overlaps | e2e |
| P5-11 | A page-wide glyph sweep shows every text node rendering from the Archivo face, except the exceptions ruled in D2 | `chromium` CDP |
| P5-12 | Mechanical pattern checks on the rendered text: dashes only in the owner's wording; 0 eyebrows; numbering only on the house rules and bench steps; one label per intent; no decorative dots, scroll cues or appended `→` | `@content` + ui-audit |
| P5-13 | The focus walk (P2-7) passes with every section present | e2e |
| P5-14 | contrib-design §7 rows 13 and 14 are approved | `info.md` + C6 |

#### P6 · Release surfaces: metadata, social image, JSON-LD, sitemap, robots, 404, icons
| ID | Criterion | Evidence |
|---|---|---|
| P6-1 | Each route's `<title>` is ≤ 60 characters and its description ≤ 160, both unique and from Approved copy (row 17) | e2e + `@content` |
| P6-2 | One canonical string on https://daiho.dev is byte-identical in `link[rel=canonical]`, `og:url`, JSON-LD `url` and the sitemap `<loc>` | e2e |
| P6-3 | Open Graph and Twitter tags are present: title, description, type, url, image (absolute, on daiho.dev), image width 1200, image height 630, image alt, and `twitter:card` `summary_large_image` | e2e |
| P6-4 | The social image returns 200 as PNG or JPEG, decodes to exactly 1200 × 630 and stays within B17. Its strings trace to `info.md`. The lockup uses static Archivo instances (contrib-design §9), and its Vietnamese glyphs are correct, checked by QA at 100 % and saved as evidence | e2e + capture |
| P6-5 | JSON-LD parses, with `@context` https://schema.org, one `Person` and one `WebSite`. Every Person value equals the content layer's and passes §5. It has no `telephone`, `faxNumber`, `birthDate`, address or location (contrib-design §1.5), and no email except the opted-in one. `<` is escaped in the script body | unit (builder) + e2e |
| P6-6 | validator.schema.org reports 0 errors and 0 warnings on the preview URL (release audit; the main session's browser if QA can't reach it) | capture |
| P6-7 | `sitemap.xml` parses and lists exactly the public HTML routes on daiho.dev. The production `robots.txt` allows crawling and names the sitemap. Previews are kept out of the index by a noindex header, not by robots (P9-2) | e2e |
| P6-8 | An unknown path returns status 404 with the custom page (header, one `h1`, a link home), noindex, and axe 0 in both themes | e2e |
| P6-9 | The favicon (SVG, with a dark variant under `prefers-color-scheme`), its fallback, and the 180 px `apple-icon` all return 200 with correct types | e2e |
| P6-10 | Without JavaScript, every section heading and every fact on the page is in the HTML | `chromium-nojs` |
| P6-11 | Names match across surfaces (RF4): the same names in the `h1`, `<title>` (if it names the owner), JSON-LD `name` and `alternateName`, and the social image. Every text surface is NFC. `<meta charset="utf-8">` is the first element in `<head>` | e2e |
| P6-12 | LHCI SEO is 100 with the production flag set | LHCI |

#### P7 · Résumé PDF
| ID | Criterion | Evidence |
|---|---|---|
| P7-1 | The build generates the PDF from the content layer. If it is committed instead, CI regenerates it and compares the text. It is never hand-made | build log or CI step |
| P7-2 | It is served at one stable path with status 200 and type `application/pdf`. Every link to it reads "Résumé" and carries the `download` icon (`DESIGN.md` lock 7) | e2e |
| P7-3 | pdf.js extracts the text in reading order: name (NFC) and role; the three contact channels shown on the site; experience with dates equal to `info.md`; projects; skills; education; languages (contrib-design §2, row 36) | `@content` |
| P7-4 | Nothing forbidden appears: 0 phone-shaped numbers, 0 `tel:` annotations, 0 emails except tidi.dev1321@gmail.com, no "Reference" or "References" heading, no location, and no availability, travel or photography | `@content` |
| P7-5 | Every fact traces to `info.md` through the same normaliser as the site | `@content` |
| P7-6 | Every link annotation is an absolute `https:` or `mailto:` URL to an opted-in destination; none points to localhost, 127.0.0.1 or `*.vercel.app` | `@content` |
| P7-7 | The page size is A4 (595 × 842 pt). Every font is embedded. Page captures show correct Vietnamese glyphs, light tokens only (`accent` on links only), and no drawing or photo | pdf.js + capture |
| P7-8 | Metadata: Title and Author come from the content layer and the language is `en`. No local path, username or localhost appears in any metadata field | `@content` |
| P7-9 | The PDF is tagged (a structure tree is present) if the generator supports it (D9) | pdf.js |
| P7-10 | B16 holds, and contrib-design §7 row 15 is approved | `@content` + C6 |
| P7-11 | QA only, at the release audit: if the original résumé is still on disk (git-ignored), none of its phone or reference tokens appear in the build output or the new PDF. The tokens stay in memory and never reach a report | audit note |

#### P8 · Performance pass (Checkpoint 2 follows)
| ID | Criterion | Evidence |
|---|---|---|
| P8-1 | perf-seo-audit on `/`, mobile and desktop, median of 3, on a quiet machine with its benchmark index recorded: B1–B3 met | `docs/reviews/p8-perf-perf-seo.md` |
| P8-2 | Lab vitals B4–B6 met; the LCP element is named and is text | LHCI |
| P8-3 | Byte budgets B8–B14 met | LHCI `resource-summary` |
| P8-4 | P2-18 (delayed fonts) and B7 (interaction latency for every client-leaf control) re-run on the final page | e2e |
| P8-5 | Only same-origin requests happen before interaction, with no third-party resource hints; only the font files ruled in D2 are preloaded | network log + HTML |
| P8-6 | `/_next/static/` assets are served with long-lived, immutable caching | response headers |
| P8-7 | Every number is compared with the M1 and M2 audits, and any change beyond noise has a named cause | audit report |

#### P9 · Deploy
| ID | Criterion | Evidence |
|---|---|---|
| P9-1 | The owner's approval for the domain and the production deploy is in `docs/progress.md` before any production step | progress.md |
| P9-2 | Preview: the read-only e2e and `@smoke` specs pass against the preview URL; preview responses carry `X-Robots-Tag: noindex` (or a noindex meta), and `robots.txt` doesn't block them, because a blocked crawler never sees the noindex | smoke report |
| P9-3 | Production on https://daiho.dev: `/` returns 200. Canonical, `og:url` and `og:image` are absolute on daiho.dev, and the image returns 200 at 1200 × 630. Sitemap and robots are correct, an unknown path returns 404, the résumé returns 200 as `application/pdf`, and no noindex appears anywhere | smoke report |
| P9-4 | `http://` goes to `https://`, and `www` to the apex (or the ruled canonical host), each in one 301 or 308 hop. TLS is valid for both names. The `*.vercel.app` production alias redirects to daiho.dev or serves the daiho.dev canonical | `curl -I` lines |
| P9-5 | The video facade plays on production, which catches header or CSP differences | smoke |
| P9-6 | LHCI against the production URL (mobile, median of 3) meets B1–B6 | LHCI |
| P9-7 | The social preview renders in at least one real unfurler, such as Telegram or LinkedIn Post Inspector (main session, in its browser) | capture |
| P9-8 | There are no old URLs to preserve: on 2026-09-28, neither daiho.dev nor www had A, AAAA or CNAME records (Cloudflare nameservers only) | §10 |

## 3. Screenshot and axe matrix

### 3.1 Cells
| Width | Viewport (CSS px) | Why |
|---|---|---|
| 320 | 320 × 568 | Smallest supported width; reflow (1280 at 400 %) |
| 375 | 375 × 667 | The contrib-design §3 first-viewport check |
| 640 | 640 × 400 at DSF 2 | 1280 × 800 at 200 % zoom; confirms the container-query switches (contrib-design §9) |
| 768 | 768 × 1024 | md breakpoint |
| 1024 | 1024 × 768 | lg breakpoint |
| 1440 | 1440 × 900 | Desktop reference |
| 1920 | 1920 × 1080 | Widest checked |

- **Themes:** light and dark, set by emulating the system scheme. Theme specs cover the stored-choice path.
- **Routes:** `/` from P2; the 404 page from P6.
- **Scope:** "the six widths" in `CLAUDE.md` are all of the above except 640. The 640 zoom cell is captured at P2, P4, Checkpoint 2 and release, and its overflow is asserted in every run.

### 3.2 Per-width must-hold checks (contrib-design §3, in measurable form)
| Width | Must hold | Measured as |
|---|---|---|
| 320 | Bench compact at scale 1 with 14 px labels; tall drawings legible; names wrap cleanly; no overflow from "microservices", "daisy-chain" or the email address; the menu works | Rendered label size ≥ 14 px; SVG text inside the viewBox; no overflow; K3. `DESIGN.md`'s current numbers give scale 0.898 here (D3a) |
| 375 | Hero text and the top of the bench in 375 × 667 | Lockup, role, sentence, CTA and the bench's top edge inside the first viewport |
| 640 (zoom) | Reflow; the container queries pick the right variants | No overflow; wide bench (550 px content box); tall drawings |
| 768 | Nav inline; bench wide, at most 648 px; tall drawing beside the facts | Nav links visible; bench SVG ≤ 648 px wide; drawing and facts share a row |
| 1024 | Hero split 5 \| 7; the sentence at 36–48 characters per line; drawings switch to wide at an 896 px content box | Column geometry; characters per rendered line; which variant shows at the flip width (D3b) |
| 1440 | The whole hero in 1440 × 900; drawing labels at most 1.3× (18.2 px), bench at most 1.35× (18.9 px); facts readable | Hero bottom ≤ 900; label size caps; no clipped facts terms |
| 1920 | Container capped at 1200 px; nothing stretches | Content width ≤ 1200; measures hold |

### 3.3 Capture sets
| Set | Cells | Phases |
|---|---|---|
| Full page | 6 widths × 2 themes, per route | every UI phase; Checkpoint 2; release |
| Section crops | changed sections × 6 × 2 | every UI phase |
| 200 % zoom | 640 cell, full page, 2 themes | P2, P4, Checkpoint 2, release |
| Lockup crops (DSF 2) | 320 and 1920 × 2 | P2, release |
| Bench states | rest, idle, idle with the toggle pressed, genuine, rejected; at 320, 768 and 1440 × 2 themes; with motion and with reduced motion | P2 (rest only), P3, Checkpoint 2 |
| Drawings | each drawing at 320, flip width − 1, flip width, and 1920 × 2 | P2 (CyberRock), P4, release |
| Grayscale | the rejected bench and each drawing at 1440, light | P2, P3, P4 |
| Menu open | 320, 375 × 2 | P2, release |
| Video facade | poster and loaded, at 375 and 1440 × 2 | P4, Checkpoint 2 |
| No JavaScript | the hero (the Checkpoint 1 input) and the full page at 375 and 1440 × 2 | P2 (hero), P3, P4, release |
| Focus stops | every stop at 375 and 1440 × 2 | P2–P5, release |
| Favicon | 16, 32 and 180 px, light and dark | P6, Checkpoint 2 |
| Social image | as served | P6, Checkpoint 2 |
| PDF pages | each page at 100 % (pdf.js render) | P7, Checkpoint 2 |

### 3.4 Naming and storage
- **Path:** `docs/reviews/<phase>/screens/<route>__<set>__w<width in 4 digits>__<theme>[__<state>].png`, for example `docs/reviews/p3-bench/screens/home__bench__w0320__dark__rm-rejected.png`.
- **Phase folders** (provisional): `p1-setup`, `p2-first-visual`, `p3-bench`, `p4-sheets`, `p5-sections`, `p6-surfaces`, `p7-resume`, `p8-perf`, `pre-release` (Checkpoint 2), `release`, `p9-deploy`.
- **Screens are git-ignored** (`docs/reviews/**/screens/`), and so are the raw axe and LHCI outputs (`docs/reviews/**/raw/`).
  - Why: 50 to 150 PNGs per phase, at up to several MB each, would bloat the history, and every set can be regenerated. Each report records the commit SHA and the capture command.
  - Reports themselves are committed. design-lead reads checkpoint sets in place.

### 3.5 Capture rules
- Captures run in Chromium: DSF 1 for full pages and sections, DSF 2 for crops and the zoom cell.
- Before capturing, wait for `document.fonts.ready`, network idle and finished animations, and hide the caret.
- A full page taller than 16,000 px is replaced by its section crops, because of Chromium's capture limits.
- The matrix spec lives in the repo: frontend-engineer builds it in P2 and QA runs it. QA checks its cell list against this section in code review, so the evidence tool can't drift.

### 3.6 axe matrix
- **Cells:** the full-page set for each route, the 640 zoom cell, and these states:
  - menu open
  - bench genuine and rejected
  - reduced motion
  - video loaded, with `iframes: false`, so YouTube's document is excluded but the frame's `title` is still checked
  - no JavaScript. If axe can't be injected with JavaScript disabled, QA runs it on the no-JS DOM snapshot and says so.
- **Rules:** tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`. No rule is disabled without a ruling in `docs/progress.md`.
- **Pass:** 0 violations per cell. `incomplete` results don't fail CI, but QA resolves each one by hand in the ui-audit report (usually text over SVG).
- **Output:** a count table per cell in the ui-audit report, and raw JSON in `docs/reviews/<phase>/raw/axe/`.

## 4. Keyboard test scripts
- **Automation:** the scripts run in Playwright on `chromium` and `firefox`, and on `webkit` with direct focus.
- **Manual pass:** QA also runs them at every UI phase review and at release, with a focus capture at every stop, and reads the captures.

**K1 · Skip link** (P2; every width; both themes)
1. Load `/` and press Tab. Expect: the skip link is focused, shown as `skip-link` at its 8 px inset, fully in the viewport, with the ring visible.
2. Press Enter. Expect: focus is in `main#main`, and the start of `main` is visible.
3. Press Tab. Expect: the first control inside `main` (the hero CTA), not a header control.

**K2 · Header navigation, 768 px and wider** (P2; both themes)
1. Tab on from the skip link. Expect: the wordmark, the four nav links in visual order, then the theme toggle; each shows the ring and is at least 44 px tall.
2. Press Enter on each nav link. Expect: the hash updates; the target heading's top sits 24 px from the viewport top; the next Tab lands on the first control in or after that section.
3. Shift+Tab back through the header. Expect: no stop skipped or repeated.

**K3 · Menu, below 768 px** (P2; 320 and 375; both themes)
1. Tab to the menu control. Expect: a native `<button>` (or a `<summary>`, if a native disclosure is used) with the approved name, the expanded state exposed as false, the panel referenced, and 44 × 44 px.
2. Press Enter; on a fresh load, press Space instead. Expect: the panel opens in flow under the header with no overlay; expanded is true; four 48 px rows.
3. Tab through the rows and past the last. Expect: visual order, then on into the page, because it is a disclosure, not a trap. Rows in a closed panel are never focusable.
4. Press Escape. Expect: the panel closes and focus returns to the menu control.
5. Reopen it and press Enter on a link. Expect: the panel closes, the target heading sits 24 px from the top, and the next Tab starts from the target.
6. Resize to 1440 with the panel open. Expect: the nav shows inline, with no leftover panel and no focusable hidden rows.

**K4 · Theme toggle** (P2; every width; start once from system light and once from system dark)
1. Tab to the toggle. Expect: an `icon-button`, 44 × 44 px, with the approved name; `aria-pressed` is true only in dark; the icon is `aria-hidden`.
2. Press Enter. Expect: an instant switch. The page background, `color-scheme` and `theme-color` follow; `document.getAnimations()` is empty; focus stays; the ring meets 3:1 in the new theme; the name doesn't change.
3. Press Space. Expect: it switches back, once per press.
4. Reload. Expect: the choice persists with no flash (P2-2).
5. From P3 on, switch during a bench run. Expect: the run continues, and its colours follow the new theme.

**K5 · Handshake bench** (P3; 320, 768 and 1440; both themes; motion on and reduced; toggle off at the start)
1. Tab past the hero CTAs. Expect: run, then the counterfeit toggle. DOM order equals visual order, the rings are visible, and both are 48 px tall. Below a 480 px content box they stack at full width; from 480 px they sit side by side.
2. Press Enter on run. Expect: idle, challenge, response, then "genuine" (1,080 ms). The log reads "challenge", "response", then the verdict, each once, and focus stays on run. Under reduced motion: no packet, pulse or shake; step numerals 1 and 2 show; the final state appears at once; the log reads only the verdict; `document.getAnimations()` stays empty.
3. Press Space on run about 400 ms into a run. Expect: it restarts from idle; nothing from the interrupted run is announced afterwards; exactly one verdict.
4. Tab to the toggle and press Space. Expect: `aria-pressed="true"` with the name unchanged, the `square-check` icon and a 2 px `primary` border; the chip outline turns construction.
5. Shift+Tab to run and press Enter. Expect: the run stops after the challenge (about 600 ms); the response line stays construction (computed `trace`); the rejected verdict (approved copy) shows with `x` and shakes once, ±3 px, 240 ms (no shake under reduced motion). The log reads "challenge", then the rejected verdict.
6. Press Space on the toggle during a run. Expect: the run is cancelled, the bench returns to idle, and no verdict is announced.
7. Turn the toggle off and run. Expect: "genuine" again.
8. Press Enter five times within 500 ms. Expect: one final verdict, and never more than one packet animating.
9. Throughout: the bench box and the next section's top move 0 px.
10. Tab past the toggle. Expect: focus continues into the next section, and Escape does nothing harmful.

**K6 · Video facade** (P4; 375 and 1440; both themes)
1. Before any interaction. Expect: 0 foreign requests, no iframe, and no resource hints to YouTube or Google hosts, still none after hovering and focusing the poster.
2. Tab to the poster. Expect: one stop, a link (contrib-design §4), with the ring around the whole poster. Its accessible name contains "Quest by NFQ" and says it plays the video (approved copy, row 16). At least 44 px.
3. Press Enter. Expect: the iframe replaces the poster in the same box and fades in; YouTube requests start only now (P4-8).
4. After activation. Expect: focus is on the iframe, never on `<body>`.
5. Tab out of the player. Expect: the next control after the video; no trap.
6. Without JavaScript. Expect: a working link to the watch URL.

The poster stays a link after hydration. The checklist prefers `<button>` for in-page actions, so QA accepts the link only if its accessible name says it plays the video. That wording is covered by the row 16 approval.

## 5. Automated content verification

### 5.1 Surfaces
1. **Server HTML** (JavaScript off):
   - block text: headings, `p`, `li`, `dt`, `dd`, `figcaption`, `a`, `button`, `label`
   - the `alt`, `aria-label` and `title` attributes
   - SVG `<text>`, `<title>` and `<desc>`
   - the document `<title>`, the meta description, and the Open Graph and Twitter content
   - JSON-LD
2. **Hydrated DOM** after the scripted interactions: bench announcements and verdicts (from the live-region log), control names, the facade label, and the iframe title.
3. **The 404 page.**
4. **`sitemap.xml` and `robots.txt`.**
5. **The résumé PDF** through unpdf (pdf.js): text in reading order, metadata, link annotations, page count and size, structure tree, and fonts.
6. **The social image:** no OCR. The P6 report lists its intended strings, which are traced like any other text, and QA checks the image by eye.

### 5.2 Corpus and normalisation
- **Corpus:** the content sections of `info.md`: Identity, Goals & audience, About, Experience, Projects, Skills & tools, Education & certifications, Interests, Contact & links, and Approved copy.
- **Excluded from the corpus:** the header notes, Visual assets (except the avatar alt text), Site preferences, Open questions and Not included.
- **Normalisation, on both sides:**
  - Unicode NFC
  - curly quotes become straight, and `…` becomes `...`
  - whitespace collapsed, markdown markers stripped
  - middots and the owner's "Name — description" separator treated as boundaries
  - digit grouping removed (2,951 becomes 2951)
  - case-insensitive, for tracing only

### 5.3 Checks
| # | Check | Rule | CI | Audit |
|---|---|---|---|---|
| C1 | Trace | Every text block is a normalised substring of the corpus or an allowlist entry | fail | fail |
| C2 | Numbers | Every number token appears as a whole number token in the corpus, which catches invented metrics in short nodes | fail | fail |
| C3 | Placeholders | 0 hits for: lorem, ipsum, TODO, TBD, FIXME, XXX, "Your Name", example.com, `href="#"`, `javascript:`, undefined, null, NaN, "Invalid Date", "[object Object]", "[copy:", "{{" | fail | fail |
| C4 | Dashes | An em or en dash may appear only in a block of the owner's wording, meaning a block that passes C1 against the corpus alone, without the allowlist. A spaced hyphen used as a dash in our copy is also flagged | fail | fail |
| C5 | Forbidden | These override C1, because `info.md` records some of them as "no": [private email removed], and any email except tidi.dev1321@gmail.com; phone-shaped numbers (9–15 digits with spaces, dots, hyphens or brackets, optional +, ISO dates excluded); `tel:`; banner-only strings (accepting quests, STATUS, PLAYER 1, XP, LVL, MAX); travel or photography as interests; a "Reference" heading; "Ho Chi Minh City" (no opt-in; D5) | fail | fail |
| C6 | Approved copy | Every Approved copy row appears verbatim where it belongs, with no variant spellings | fail | fail |
| C7 | One label per intent | Every link to the PDF reads "Résumé". Every action link to `#contact` carries the approved CTA label; the nav's "Contact" is a destination name, which `DESIGN.md` lock 7 allows | fail | fail |
| C8 | Links | Fragments resolve to an id and internal paths return 200. External hosts are limited to lemonswan.com, t.me, github.com, www.youtube.com and daiho.dev. No `target="_blank"`. `mailto:` is exactly the opted-in address. No "click here" or bare "read more", and no link text ends in `→` | fail | fail |
| C9 | External status | Each external URL ends at 2xx or 3xx after redirects (HEAD, then GET, one retry). A 403 or 429 from a bot-hostile host becomes a manual check in the main session's browser | — | fail |
| C10 | Across surfaces | Names, role, dates and the contact set are identical in the page, `<title>` and description, JSON-LD, the social image's strings and the PDF | fail | fail |
| C11 | Typography | No straight quotes or `...` in visible text | fail | fail |
| C12 | Voice (heuristic) | Title Case headings, and filler words (passionate, seamless, cutting-edge, elevate, leverage, unleash, next-gen, revolutionize) outside the owner's wording. The owner's own wording does contain "seamless" and "cutting-edge" | report | QA judges |

### 5.4 Allowlist
- It is a committed file beside the content specs (path per the engineering file map). Each entry holds the exact string, its source (an `info.md` section, an Approved copy key, a `DESIGN.md` label, or "generic UI label, not about the owner"), and the date added.
- QA reviews every added entry in code review. An entry with no source, or one that states a personal fact, is Critical.

### 5.5 JSON-LD
- It parses as JSON, with `@context` https://schema.org and exactly one `Person` and one `WebSite`.
- Every Person value equals the content layer's and passes C1 and C5. `url` equals the canonical string (C10).
- These are absent: `telephone`, `faxNumber`, `birthDate`, `address`, `homeLocation`, and any email except the opted-in one.
- The builder is typed with schema-dts (types only; a recommendation to engineering), and validated on validator.schema.org at release (P6-6).

### 5.6 Output
`docs/reviews/<phase>-content.md` uses the `portfolio-content` D format, one line per finding: `location — string — issue — info.md reference or "no source"`. Zero findings is a pass.

## 6. Budgets and thresholds
| ID | Budget | Threshold | Measured by | CI | Audits |
|---|---|---|---|---|---|
| B1 | Lighthouse performance, mobile, median of 3 | ≥ 95 | LHCI | warn | error |
| B2 | Lighthouse accessibility, best practices and SEO, mobile and desktop | 100 | LHCI | error | error |
| B3 | Lighthouse performance, desktop | ≥ 95 | LHCI `preset: desktop` | warn | error |
| B4 | LCP, mobile lab | ≤ 2.5 s, and the element is text | LHCI | warn | error |
| B5 | CLS | ≤ 0.1 (target 0) in LHCI and in the delayed-font test; 0 px from bench runs and the facade swap | LHCI + e2e | error | error |
| B6 | TBT, mobile lab | ≤ 200 ms | LHCI | warn | error |
| B7 | Interaction latency (a proxy for INP) | Event Timing duration ≤ 200 ms at 4× CPU slowdown, for every client-leaf control | e2e `chromium` | error | error |
| B8 | First-load JS, each HTML route | ≤ 130 kB gzip (130,000 bytes) | LHCI `resource-summary:script:size` + network log | error | error |
| B9 | Project-owned first-load JS | ≤ 25 kB gzip (B8's measure minus the P1 baseline) | same | error | error |
| B10 | HTML document, `/` | ≤ 60 kB gzip | `resource-summary:document:size` | error | error |
| B11 | CSS | ≤ 20 kB gzip | `resource-summary:stylesheet:size` | error | error |
| B12 | Fonts on first load | ≤ 130 kB; one family, woff2, self-hosted | `resource-summary:font:size` | error | error |
| B13 | Third-party requests before interaction | 0 | `resource-summary:third-party:count` + guard | error | error |
| B14 | Total transfer, cold load of `/`, no interaction | ≤ 350 kB | `resource-summary:total:size` | error | error |
| B15 | Avatar | ≤ 200 kB for the candidate chosen at 375 px (DPR 3) and at 1440 px (DPR 2) | network log after scrolling | error | error |
| B16 | Résumé PDF | ≤ 300 kB, ≤ 2 pages | `@content` | error | error |
| B17 | Social image | exactly 1200 × 630, ≤ 200 kB | e2e | error | error |
| B18 | axe and console | 0 violations per cell; 0 errors, warnings or hydration warnings | e2e | error | error |
| B19 | Title and description | ≤ 60 and ≤ 160 characters | e2e | error | error |
| B20 | Contrast | The `DESIGN.md` table in both themes: text ≥ 4.5:1; UI, focus and meaningful graphics ≥ 3:1 | axe for text; computed tokens for strokes and the ring | error | error |

**The JS budget and why.**
- **The number.** 130 kB assumes a framework baseline of about 100–105 kB, roughly what Next.js 15's build output reported for a bare App Router page. Next.js 16.3's baseline is unmeasured, because nothing can be installed before the plan is approved.
- **Calibration.** P1 measures the real baseline on the bare shell. If it is over 105 kB, the main session resets B8 to baseline + 25 kB, with a logged ruling, before P2 starts. From P2 on, neither number moves; problems are escalated instead.
- **What 25 kB covers.** At most four client leaves (theme toggle, bench, facade and, if a native disclosure isn't enough, the menu), written with CSS transitions or the Web Animations API, as contrib-design §4 expects. A full animation runtime doesn't fit, which keeps the bench a small client leaf.
- **Ownership.** contrib-design §4 assigns the final JS budget to frontend-engineer. If the engineering contribution proposes a different number, the main session rules; QA recommends the stricter one.

**Why the font number.**
- Archivo v25 with both axes: latin is 90,096 B, latin-ext 85,856 B and vietnamese 34,364 B.
- `next/font` preloads every subset it lists, and `DESIGN.md` lists all three (210,316 B).
- On this content, latin-ext would serve only "Đ". Latin plus vietnamese is 124,460 B and covers every character in `info.md` except "→", which no subset has (D2).

**CI levels.** Shared runners are noisy on CPU. B1, B3, B4 and B6 therefore warn in CI and are enforced at milestone and release audits on a quiet machine, where they can be measured reliably. The thresholds are the same in both places. A CI warning triggers a scoped performance check in that phase's review.

## 7. Audit checkpoints
| After | code-review + ui-audit | perf-seo-audit | Content | Design checkpoint |
|---|---|---|---|---|
| P1 | code-review; ui-audit limited to axe and overflow on the skeleton | none; the baseline is recorded | trace unit test | no |
| P2 | both | scoped: fonts (B12), LCP element, delayed-font shift, HTML (B10) | automated, plus a read of the hero and CyberRock copy | **Checkpoint 1** (contrib-design §6.1): matrix, no-JS hero, 200 % zoom |
| P3 | both | **M1, full:** the hero is complete (LCP, fonts, the bench leaf) | automated, plus a read of the bench copy | no |
| P4 | both | **M2, full:** the heaviest HTML (inline SVG in two variants, plus the inline RSC payload) and facade privacy | automated, plus a read of the sheets and drawings | no |
| P5 | both | scoped: avatar (B15) | automated + read | no |
| P6 | both | **M3, full:** the SEO checklist, JSON-LD, sitemap, robots, 404 and icons, plus performance | automated, plus a read of the metadata and social image | no |
| P7 | code-review; ui-audit limited to links and labels | scoped: PDF (B16) | automated, plus a read of the PDF | no |
| P8 | both | **full:** this is the phase's own evidence | automated | **Checkpoint 2** (contrib-design §6.2) on the final local build |
| Release audit | ui-audit over all files, the full matrix, the axe matrix and K1–K6; code-review of anything not yet reviewed | full, on the local production build and the preview URL; validator.schema.org | full, including C9 | Checkpoint 2 signed off |
| P9 | code-review of the config | against https://daiho.dev, after the owner's approval | C9 on production | no |

- **Scoped perf checks.** Any phase that adds a dependency, font, image set, third-party script or route gets one (the skill's trigger), as does any phase whose CI run warned.
- **Release sequence.**
  1. P8, then Checkpoint 2 (`docs/reviews/pre-release-design-critique.md`).
  2. P9's preview half.
  3. The release audit (`docs/reviews/release-*.md`).
  4. Final verification by the main session.
  5. The owner approves production.
  6. P9's production half, then the post-deploy smoke test.
- **Report paths:**
  - `docs/reviews/<phase>-code-review.md`
  - `docs/reviews/<phase>-ui-audit.md`
  - `docs/reviews/<phase>-content.md`
  - `docs/reviews/<milestone>-perf-seo.md`
  - `docs/reviews/<phase>-design-critique.md` (design-lead)

## 8. Review Focus
These are the five conditions most likely to break a visitor's experience that no single phase's own tests catch. Each is pinned to one phase.

1. **Private data ships through a channel nobody is watching.**
   - The old résumé, which holds the phone number and a third party's name and contact details, sits in the repo root today, and git starts in P1.
   - The phone number or the second email could also reach the PDF, JSON-LD, the PDF's metadata, a client chunk (for example, if `info.md` were bundled whole) or `public/`.
   - Each phase only looks at its own output.
   - **Pinned by P1:** the ignore rule and a privacy scan of `src/`, `public/` and the whole build output, run in CI (P1-6). P7 adds the PDF's text, metadata and links.
2. **The dark theme breaks what was built after it.**
   - The theme lands in P2, but the bench motion, two drawings and the facade land in P3 and P4.
   - What can break:
     - a returning visitor with a stored choice sees a flash
     - strokes keep their light values on the dark plate
     - the focus ring loses contrast
     - a mid-session switch leaves stale colours, or fires every control's colour transition
   - **Pinned by P2:** every UI spec runs in both themes through the shared fixture, and the runtime-switch helper re-checks computed colours against the tokens (P2-2, P2-4, P2-28). P3 and P4 reuse both.
3. **Layouts break between the six checked widths.**
   - The bench switches at a 480 px content box and the drawings at 896 px, and neither matches a matrix width.
   - `DESIGN.md`'s current numbers already predict two defects (D3):
     - labels at 12.6–13.9 px on viewports narrower than 346 px, although contrib-design §3 expects scale 1 at 320
     - the tall drawing variant at 1024–1025 px, where the Responsive table promises the wide one
   - **Pinned by P2:** the width sweep, 320 to 1920 px in 8 px steps plus every flip width ±1 px, covering the bench and the CyberRock drawing (P2-20, P2-26, P2-28). P4 extends it to the other two drawings (P4-12).
4. **Facts and the name disagree or render wrongly across surfaces.**
   - The page, `<title>` and description, JSON-LD, the social image and the PDF are built in P2, P6 and P7, with three different renderers (the browser, `next/og` with static instances, and the PDF generator).
   - Diacritics can fall back to another font, turn NFD, clip, show as tofu in the image, or lose their text layer in the PDF. A date or the contact set can also differ between surfaces.
   - **Pinned by P6:** the cross-surface test (P6-11, C10). P7 adds the PDF to the same test.
5. **It works on localhost and breaks on daiho.dev.**
   - What can break:
     - canonical or `og:image` built from localhost or the preview host, which breaks share cards
     - preview deployments open to indexing
     - missing `www` or `http` redirects
     - the PDF or the social image missing on the CDN
     - a referrer or CSP header that breaks the YouTube player
     - performance that differs on the CDN
   - No local test can see these.
   - **Pinned by P9:** `@smoke` on the preview, then on production, plus LHCI against the production URL (P9-2 to P9-6).

## 9. Risks and open decisions
| # | Item | Proposal | Owner | Needed by |
|---|---|---|---|---|
| D1 | `CLAUDE.md` says "animate transform and opacity only". `DESIGN.md` transitions `color`, `background-color` and `border-color` on controls (120 ms) and calls colour "not motion" | Rule on it explicitly: allow exactly those three properties at `duration-feedback` on controls, and only transform and opacity everywhere else. G10 checks whichever way it's ruled | main session | P2 |
| D2 | Font subsets vs B12: latin-ext adds 85,856 B, is preloaded, and serves only "Đ". Separately, "→" (U+2192) appears five times in `info.md`, including the Quest drawing's caption, and no Archivo subset includes it, so it renders in the fallback face | Drop latin-ext. For "→", pick one: accept the fallback glyph (an allowed exception in P5-11), use a custom subset through `next/font/local`, or reword (needs owner approval) | design-lead + frontend-engineer; main session rules | P2 |
| D3 | Size conflicts, assuming bands and the bench use `plate` padding (24 px) with a 1 px border. (a) At 320–345 px, the 256-unit compact bench and the tall drawings render 14-unit labels at 12.6–13.9 px. That breaks "labels never render below 14 px" and contrib-design §3's "scale 1 at 320". (b) The band's content box reaches 896 px only at a 1026 px viewport, but the Responsive table says "from 1024: wide" | design-lead amends `DESIGN.md`. For (a): base plate padding ≤ 11 px, or a compact authoring width ≤ 230 units. For (b): an 880 px threshold, or the table reworded | design-lead | P2 |
| D4 | The hero's Résumé link would point at a PDF that only exists in P7, and the internal link check would fail from P2 on | Render the link only when the PDF exists (an absent optional field renders nothing), so Checkpoint 1 captures the hero without it; or generate the PDF earlier | main session | P2 |
| D5 | Location: `info.md` lists Ho Chi Minh City with no display opt-in, and contrib-design §1.5 omits it | Keep it off the site, JSON-LD and PDF (enforced by C5). Ask the owner only if a city on the résumé is wanted | main session with the owner | P7 |
| D6 | Nothing measures JS weight in the `next build` output anymore (Next.js 16) | Log a ruling that the network measure (LHCI plus the e2e log) replaces perf-seo-audit step 1 | main session | P1 |
| D7 | The 17 copy slots in contrib-design §7 gate acceptance: C1, C3 and C6 fail until each is in Approved copy. Row 11 (date format) is needed by P2, because CyberRock's dates ship there | Schedule the copy step before P2 for rows 1–4, 6, 7 and 11, and before each later phase for the rest | main session | P2 |
| D8 | Video accessibility: a manual English caption track exists (checked 2026-09-28), but audio description (WCAG 1.2.5 AA) can't be verified by tools | QA watches the 162 s video at P4. If it carries information only in the picture, the main session rules: a transcript or description from the owner, or a link out instead of the embed | qa-reviewer, then main session | P4 |
| D9 | A tagged PDF (P7-9) depends on the generator: browser print can tag, some libraries can't. contrib-design §2 allows "build time or one-off" | Engineering states which in its contribution; if tagging is lost, the main session rules. A one-off PDF also needs the CI text comparison (P7-1) | frontend-engineer | P7 |
| D10 | Which owner source files are tracked: `profile.md`, `answer.md` and `prompt.md` contain no phone-shaped numbers or third-party data (checked 2026-09-28) | A main-session ruling in P1. `DaiHo Resume.pdf` is never tracked, whatever the ruling | main session | P1 |
| D11 | `@google/design.md` 0.4.0 has no licence in its registry metadata | Engineering confirms before pinning it in CI | frontend-engineer | P1 |

## 10. Evidence gathered for this contribution (2026-09-28)
- **Registry (`npm view`):** the versions and licences in the header. `@lhci/cli@0.15.1` depends on `lighthouse: 12.6.1`. `@google/design.md` is 0.4.0, with no licence field.
- **Lighthouse default configs (unpkg):** `resource-summary` and `total-byte-weight` exist in 12.6.1 and 13.5.0; `largest-contentful-paint-element` exists in 12.6.1 only.
- **LHCI docs:** `aggregationMethod` is one of median, optimistic, pessimistic and median-run, defaulting to optimistic. `resource-summary` sizes are in bytes.
- **Next.js docs:** the 16 upgrade guide says "Next.js 16 removes the `size` and `First Load JS` metrics from the `next build` output". The next/font docs say every listed subset gets a preload tag when `preload` is true, which is the default.
- **Archivo subsets:** the Google Fonts CSS for Archivo (wdth 62–125, wght 100–900) gives the woff2 sizes in §6. I checked every character in `info.md` against each subset's `unicode-range`, checking the later-declared face first as the CSS Fonts spec does:
  - "Đ" resolves to latin-ext
  - "ạ", "ọ" and "ồ" resolve to vietnamese
  - "→" resolves to no subset
  - `info.md` has no combining marks (it is NFC).
- **`DESIGN.md` arithmetic** (node, assuming `plate` padding 24 px, a 1 px border and edges of 20, 32 and 40 px):
  - At 320 px the content box is 230 px, so the scale is 0.898 and labels render at 12.6 px. Labels reach 14 px only from 346 px.
  - The drawing band's content box is 894 px at 1024, 895 at 1025 and 896 at 1026.
  - The hero bench at lg has a 490.7 px content box, so it is wide at 1.02×.
- **DNS (`dig`):** daiho.dev has nameservers ingrid and ishaan.ns.cloudflare.com, and no A, AAAA or CNAME record for either the apex or www.
- **YouTube:** the watch page for yLJZXvO_ARU shows the title "Quest by NFQ", 162 s, playable, with caption tracks "English (auto-generated)" and "English (United States)" (manual). YouTube's Required Minimum Functionality says embedded players must send an HTTP Referer and recommends `strict-origin-when-cross-origin`.
- **Owner files:** a scan of the markdown sources found no phone-shaped numbers. Per `info.md`, the phone number and the reference exist only in `DaiHo Resume.pdf`.
- **Timeline:** `DESIGN.md` was absent when this work started, present at 01:14, and last changed at 01:19 (the compact bench's 1.5× cap; the theme toggle hidden without JavaScript). `contrib-design.md` was read after the main session's note. This file is aligned to both as of 01:29. `contrib-engineering.md` landed at 01:28 and was not read; reconciling budgets and tooling with it is left to assembly.

## 11. Reconciliation with `contrib-engineering.md`
That file landed at 01:28 and was read by searching it, not in full. Where the two contributions differ, these are QA's positions, so assembly starts from a short list.

| Topic | Engineering proposes | QA position |
|---|---|---|
| JS budget | ≤ 120 KB gzip per HTML route; app-owned ≤ 15 KB; the same calibration rule for a floor above 105 KB | Adopt it, the stricter pair: B8 = 120 kB and B9 = 15 kB. Nothing else in this file changes |
| Fonts | `next/font/local` with a project subset (latin, vietnamese, arrows; `wdth` 87.5–125, `wght` 400–800); ≤ 100 KB, one preloaded file | Adopt it: this settles D2, including "→". B12 becomes 100 kB, and P5-11 needs no glyph exception |
| Résumé link before the PDF | The link renders only when the PDF exists | Same as D4's proposal; D4 is settled |
| Résumé PDF | A script prints a tagged A4 PDF with Playwright's Chromium; it is committed with a source-hash lock that CI checks | Settles D9 and satisfies P7-1 and P7-9 |
| Avatar | ≤ 150 KB for any served variant | Adopt it: B15 becomes 150 kB |
| LHCI | Mobile, 3 runs, `median-run`, filesystem upload | Accept `median-run`. Keep a desktop run as well, because perf-seo-audit measures desktop (P1-3, B3) |
| Playwright projects | chromium desktop, chromium mobile, webkit mobile; no-JS and reduced motion as specs | Either shape works if every check in §2 runs. QA asks for Firefox on the layout and keyboard specs only (P2-6, P2-7, K1–K6) |
| Preview indexing | Vercel's `X-Robots-Tag: noindex` on previews; no robots switch per environment | Accept it; P6-7 and P9-2 now say this |

