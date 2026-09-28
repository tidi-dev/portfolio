# v2 Phase F · QA review (code review, UI audit, content verification)

> `qa-reviewer`, 2026-09-28. Scope: the whole site as built by v2 Phases 1–5, commits `f7e1597`..`bd6848b` (HEAD), clean tree.
> Judged against `docs/plan/v2/implementation-plan.md` (Phase F, Review Focus), `contrib-verification.md`, `DESIGN.md` at HEAD, `info.md`, `CLAUDE.md`.
> **Note:** `DESIGN.md` gained uncommitted edits during this review (design-lead's Phase F pass: square focus ring, `nav` speaker tag, run-in House-rule lead, proportional `stat-value`, brackets around Join party, `avatar-xl`). Findings are judged against HEAD; where the working copy changes a finding, the finding says so.
> Automated tests, performance, Lighthouse, SEO and the privacy scan are out of scope (`CLAUDE.md`).

## Verdict: **FAIL**
3 major, 0 blocker, 11 minor. The fixes are all small, and no finding touches content truth. The majors are: the blank hero after a WebGL context loss (Review Focus 3), focus moving behind the open menu sheet (Review Focus 5), and Mission log links 18 px high (target lock).

| Check | Result |
|---|---|
| Gate `pnpm check && pnpm build` (fresh, Node 24.21.0) | ✅ exit 0 |
| Code review: spec compliance | ❌ (context-loss fallback, video Space, touch-target lock) |
| Code review: quality | ✅ (minors only) |
| UI audit | ❌ (3 major) |
| Content verification (`portfolio-content` D) | ✅ 0 unmatched facts, 0 placeholders, 0 broken links |

---

## Findings

Format: `ID · severity · location · issue · evidence · suggested fix`.

### Major

**F1 · major · `src/components/holo/scenes/use-context-loss.ts:21-24`, `src/styles/holo.css:42-64` · The hero is blank for about 2 s after a WebGL context loss (known item 1, confirmed).**
- **Issue:** on `webglcontextlost` the stage stays `data-holo-state="live"`, so the poster stays at opacity 0 over a dead, transparent canvas. `onLost` fires only after `CONTEXT_RESTORE_WAIT` (2000 ms). Then the poster cross-fades in over `boot` (1200 ms). The "host" and "chip" tags float over an empty stage the whole time.
- **Evidence:**
  - Stage samples at 1440 dark: 5,724 distinct colours before the loss; 533 at +50, 300, 700 and 1200 ms (backdrop gradient only, state `live`); poster by +1800 ms. Light: the same pattern, with the poster at +1200 to 1800 ms.
  - Screens `hero-contextlost-700ms-1440-{dark,light}.png` (blank) and `hero-contextlost-2300ms-1440-*.png` (poster).
  - Console: `THREE.WebGLRenderer: WEBGL_lose_context extension not supported.`
  - This fails contrib-verification §1.2 "WebGL fallback (b)": "never blank".
- **Fix:** split "lost" from "failed". On `webglcontextlost`, call an immediate `onContextLost` that sets the stage to `poster` (the poster shows at once, with no cross-fade on this path) and hides the tags. Keep the canvas mounted. On `webglcontextrestored`, go back to `live`. After 2 s with no restore, unmount as now (`onLost`). Apply the same to the quest stages (`quest-hologram.client.tsx`), which share the hook.

**F2 · major · `src/components/shell/menu-sheet.client.tsx:65-70` · Tabbing past the last menu link moves focus behind the open sheet.**
- **Issue:** the sheet is a non-modal `popover="auto"`. After "Join party", Tab goes on to the hero's "Bring me a pain point", then "Résumé", while the full-height glass sheet stays open over them.
- **Evidence:**
  - 375 px dark: menu opened, then 6 × Tab → `activeElement` "Résumé". `elementFromPoint` at its centre returns `DIV.menu-sheet`, so it is covered, with the sheet still `:popover-open`.
  - Screen: `menu-focus-behind-sheet-375-dark.png`.
  - This affects every width below `xl` (1280 px), including narrow desktop windows.
  - WCAG 2.4.11's user-opened-content exception arguably applies (Esc still closes the popover). It still breaks Review Focus 5 ("focus hidden behind … the HUD") and contrib-verification's keyboard criterion.
- **Fix:** on `focusout` from the sheet, if the `relatedTarget` is outside the sheet and the Menu button, call `hidePopover()`. Alternatively, make the sheet a modal `<dialog>`, keeping the no-JS popover as the fallback.

**F3 · major · `src/components/sections/mission-log.tsx:53-56` · The Mission log's "CyberRock" and "Quest" links are 75 × 18 and 40 × 18 px.**
- **Issue:** `DESIGN.md` Consistency locks 7 and `CLAUDE.md` require every target to be ≥ 44 × 44 px. The sibling Lemonswan link (`:82`) already uses `inline-flex min-h-target`.
- **Evidence:** a target scan at 320, 375, 768, 1024 and 1440 px flags these two links at every width (`out/interact.json`, `targets-*`). The keyboard walk lists `CyberRock[75x18]` and `Quest[40x18]`.
- **Fix:** give the h4 links `inline-flex min-h-target items-center`, as the Lemonswan link has.

### Minor

**F4 · minor · `src/components/video-facade/video-facade.client.tsx:43-79` · Space doesn't activate "Watch Quest by NFQ" (known item 2, confirmed).**
- **Issue:** the facade is a link, so Space scrolls the page.
- **Evidence:** Space gives 0 iframes and `scrollY` 3283 → 4067. Enter inserts one iframe titled "Quest by NFQ" and focuses it. There are 0 YouTube requests before activation (routes stubbed).
- **Severity:** the link semantics are correct and Enter works, so this is not a WCAG failure. It misses contrib-verification's "Click, Enter or Space", and the owner asked for it to be fixed.
- **Fix:** after hydration, handle `onKeyDown` for `" "` (preventDefault, then activate) and add `role="button"`. Or swap to a `<button>` once hydrated, keeping the link for no-JS visitors.

**F5 · minor · `src/components/sections/character-stats.tsx:90` · The speaker tag renders "TIDI" (known item 3, confirmed).**
- **Issue:** `type-label` is `text-transform: uppercase` (`theme.css:293`). The DOM text is "TiDi", and the accessibility tree reads `text: TiDi`.
- **Why it matters:** the Phase 4 ruling says the owner's name keeps its casing everywhere. The `DESIGN.md` working copy now sets `speaker-tag` to `nav` type and adds "Names never take an uppercase style".
- **Fix:** use `type-nav` for the tag.

**F6 · minor · `src/styles/theme.css:174-177` · The focus ring is a rectangle on chamfered controls (known item 4, confirmed).**
- **Issue:** HEAD `DESIGN.md` says "following the chamfer".
- **Evidence:** `focus-run-the-handshake-1440-dark.png`. The ring is 2 px `accent-ink`, offset 3 px, visible, and ≥ 3:1 (5.60–10.11 per the Colors table), so there is no accessibility impact.
- **Status:** the `DESIGN.md` working copy now specifies the square ring. The finding closes when design-lead's edit is committed; no code change is needed.

**F7 · minor · no `src/app/icon.*` or `public/favicon.ico` · `/favicon.ico` returns 404 (known item 5, confirmed).**
- **Evidence:** `GET /favicon.ico` → 404. Real browsers request it on every load, which logs a console 404. Headless Chromium doesn't, so the matrix logs were clean.
- **Fix:** add an icon approved by design-lead (a new visual asset). As a stopgap, add `<link rel="icon" href="data:,">` through `metadata.icons`.

**F8 · minor · `src/lib/handshake/machine.ts:71-80`, `:178-184` · In the calm mode, "Run the handshake" from rest announces nothing.**
- **Issue:** an instant run lands on the verdict the `<output>` already shows ("genuine"), so its text doesn't change and no polite announcement fires. With motion on, a user run clears the verdict, then sets it (announced). The same happens when the previous verdict equals the new one.
- **Evidence:** reduced motion, 1440 px: a MutationObserver on the `<output>` recorded `[]` after the click.
- **Fix:** on an instant run, clear the verdict for one tick before setting it. For example, key the `<output>` text on `state.run`, or dispatch a `run` that passes through an empty verdict before the instant `settle`.

**F9 · minor · `src/components/shell/hud-strip.tsx:24-29` · The "TiDi" wordmark link is 38 × 44 px.**
- **Issue:** it misses the 44 × 44 lock by 6 px of width.
- **Fix:** add `min-w-target` (or `justify-center` with `min-w-target`).

**F10 · minor · `src/components/holo/scenes/hero-scene.tsx:80-89` · At 320 px the host octahedron and its "HOST" tag are cut by the viewport's left edge.**
- **Evidence:** `page-320-light-motion-off.png` (top). At 375 px the host clears the edge.
- **Scope:** decorative (the stage is `aria-hidden`), and the text log carries the story.
- **Fix:** design-lead tunes the narrow-aspect rig offset or camera (Known Gaps 5), for example with a stronger `rig.x` or a wider camera z when `width < 360`.

**F11 · minor · console · Warnings on every page load.**
- **Issue:** each canvas mount logs `THREE.Clock: This module has been deprecated` (R3F 9.8.1 `createStore`): 2–4 per load across the matrix. The context-loss path adds `WEBGL_lose_context extension not supported`. `ui-audit` treats console warnings as findings. They are third-party and harmless.
- **Evidence:** `out/matrix.json` → `clockWarnings`.
- **Fix:** record them as accepted upstream warnings (a ruling), and re-check when R3F ships a Timer-based store. The second warning goes away with F1's fix if the canvas isn't unmounted in the lost state.

**F12 · minor · raw design values outside the token layer.**
- **Locations:**
  - `src/components/sections/character-stats.tsx:21-22`: `sizes` repeats the `lg`/`sm` breakpoints and the 200/160/220 px widths as literals.
  - Component CSS repeats `DESIGN.md` component dimensions as literals instead of tokens: `shell.css:55-77` (XP 56/120/170 px), `:200` (`btn-holo` 20 px), `:250-266` (switch 34/18/12/16 px), `:309` (56 px rows), `:316` (14 px); `quest.css:304-305`, `:329`, `:347`, `:134`; `sections.css:58`, `:74-75`, `:120-121`, `:237`, `:269`.
- **Why it matters:** each literal matches `DESIGN.md` today, but a token change won't reach it (`CLAUDE.md`: "No literal design values elsewhere").
- **Fix:** where `DESIGN.md` has the value as a spacing token, use it (`--spacing-avatar`, the new `avatar-xl`, `--spacing-target`). For the rest, ask design-lead to add the few missing spacing tokens (56, 160, 220), or accept them in a ruling.

**F13 · minor · DESIGN working-copy sync, for after design-lead commits.**
- **Items:**
  - The House rules lead phrase sits on its own line, so the second line begins with the owner's "—" (`house-rules.tsx:54-57`, `sections.css:127-145`, Phase 4 deviation 4). The working copy now wants the lead run in inline, with a 2 px `text-decoration` underline.
  - `type-stat-value` still sets `tabular-nums` (`theme.css:237`); the working copy says proportional.
  - The working copy adds corner brackets around the Join party grid.
- **Fix:** implement these in the fix round once `DESIGN.md` is committed.

**F14 · minor · `src/components/quest-journal/quest-journal-controller.client.tsx:161-184` · `select()` isn't cleaned up on unmount.**
- **Issue:** `select()` adds a `window` `scrollend` listener and a 1.5 s timeout, and nothing clears them if the controller unmounts mid-scroll. There is no practical impact on this single page.
- **Fix:** keep the pending `settle` in a ref, and clear it in an effect cleanup.

### Known items: summary
| Known item | Result | Severity |
|---|---|---|
| Hero blank about 2 s after context loss | Confirmed (F1) | major |
| Space doesn't activate "Watch Quest by NFQ" | Confirmed (F4) | minor |
| `/favicon.ico` 404 | Confirmed (F7) | minor |
| Speaker tag uppercases "TiDi" | Confirmed (F5) | minor |
| Rectangular focus ring on chamfered controls | Confirmed (F6); resolved by the `DESIGN.md` working copy | minor |
| Verdict `<output>` without `role="status"` | **Not a defect.** The accessibility tree exposes it as `status: genuine` (implicit role), and jsx-a11y rightly rejects the redundant role. Optional hardening for older Safari/VoiceOver: `aria-live="polite"` (not a role). | none |
| En dash separators in the résumé PDF ("Term – description") | **Not reproduced.** Fresh extraction shows the separators are em dashes (" — "), and every one is the owner's own "Name — description" string from `info.md` (Debt ledger, Price whitelist, Tonnage payroll, Party lead, the four achievements, the CyberRock bullet). The only en dashes are the years "2017–2020" and "2013–2017", verbatim from `info.md` → Education. Both are owner wording, so exempt. | none |

---

## Declined to judge
- **`scrollend` listener** (quest-journal-controller `:174`): a one-shot end-of-scroll event, not a per-frame scroll-position listener, so it is within the spirit of "no scroll listeners".
- **`requestAnimationFrame` in `count-up.client.tsx`:** it is cleaned up, runs once for 900 ms, and only with motion on. contrib-engineering §5.4 is scoped to scenes.
- **The power-on cover instead of `clip-path`,** and the level-up bar playing per load rather than per visit: already ruled (Phase 4); design-lead updates the Motion table.
- **Taste** (hero composition, empty space in the stats panel at `lg`, bloom strength): design-lead's check.
- **The disabled "Run the handshake"** at 55 % opacity measures 2.5:1 (Lab) and 4.2:1 (Deck) while a run plays. It is an inactive control (`aria-disabled`), which WCAG 1.4.3 exempts.

## What passed (evidence in this session)
- **Gate:**
  - `pnpm check` → `design:lint … 0 errors, 0 warnings`
  - `tokens:check` 2 files match
  - `fonts:check` 6 files match, 123 characters covered
  - `resume:check … matches its 13 locked inputs`
  - eslint and Prettier clean; typecheck exit 0
  - `pnpm build` → `○ /`, `○ /_not-found` static, no warnings
- **Code review, quality:**
  - `'use client'` appears only in the 15 `*.client.tsx` files.
  - three, R3F and postprocessing load only from `holo/scenes/` via `next/dynamic({ ssr: false })`, and only when WebGL exists.
  - Every effect, observer, timer, listener and pointer handler has a cleanup. Rigs dispose their geometries, materials and textures.
  - The frameloop is `never` off screen or in a hidden tab and `demand` in the calm mode.
  - No `transition: all`; no scroll or wheel listeners; no raw hex, rgb or hsl outside the token files.
  - No personal facts outside `src/content/`; every visible string comes from content. The lint bans JSX literals.
  - No `target="_blank"`, so no `rel` is needed.
- **Responsive:** `scrollWidth` equals `clientWidth` at 320, 375, 768, 1024, 1440 and 1920 px, light and dark, motion on and off, both mid-boot and after scrolling to the bottom (24 cases, 0 offenders). Also at 200 % zoom (720 CSS px at DPR 2) and at 320 px reflow.
- **Reduced motion:**
  - No autoplay: the log stays `genuine|lit,lit,lit`.
  - The stage is pixel-identical over 1 s, before and after a run. An instant run lands on "rejected" in 50–64 ms.
  - 0 running animations; all 18 panels revealed.
  - The Motion toggle sets the frameloop to `demand` with 0 draw calls/s, and resumes when pressed again. The choice persists.
- **Motion on:**
  - Autoplay runs once (challenge, response, genuine, with the `<output>` held at "genuine"). It doesn't replay after scrolling away and back.
  - The Mission log line is scroll-linked.
  - Off screen, every stage reports `never` and there are 0 rAF calls/s.
- **No-WebGL:** 0 canvases, the poster is shown (444–1,198 distinct colours), no errors, "genuine" and "rejected" still work, no overflow, axe 0.
- **No-JS:** all 7 h2s, the full log with "genuine", every panel at opacity 1. The only visible control is the popover Menu (below `xl`).
- **Mobile GPU and touch:**
  - The canvas backing store is 1.75 × its CSS size at DPR 3.
  - `touch-action: pan-y`: a vertical touch swipe starting on the canvas scrolled the page 301 px, and a horizontal swipe didn't scroll.
- **axe 4.13** (WCAG 2.0, 2.1, 2.2 A and AA): **0 violations** in 44 runs. That covers home, genuine, rejected, menu open, video active, no-WebGL and 404, at 375 and 1440, in light and dark, with motion on and off.
- **Contrast** (axe couldn't resolve the backgrounds: about 240 nodes sit on pseudo-element chamfers, reported as `incomplete`, so I sampled the rendered pixels with the text hidden):
  - 0 text failures across 284–321 text runs per case (375 and 1440, both themes).
  - The hero log, tags, toast and v1/v2 tags were sampled per frame at ambient, the comet, the verdict flare, the pulse and the counterfeit.
  - Worst readings:
    - log text 5.62:1; verdict "rejected" 5.94:1
    - toast 5.63:1 (Lab)
    - "host" tag 5.37:1 (p2)
    - the moving "chip" tag reached 3.4:1 in one counterfeit frame. That is a sampling offset from the shaking tag; computed, holo on 92 % glass over `scene-chip` or `danger` is ≥ 4.7:1.
- **Flashing:** the stage's mean relative luminance varied by ≤ 0.008 through a counterfeit and a genuine run (69–90 samples over 3 s), with 0 opposing changes ≥ 0.1. That is far below 3 flashes/s.
- **Keyboard:**
  - 25 stops at 1440 and 18 at 375, all in page order (0 backwards). The skip link comes first.
  - Every stop shows a 2 px solid focus outline, offset 3 px. Every stop was un-occluded (`elementFromPoint` hit the element itself) and never under the HUD. The one exception is the menu case, F2.
  - The menu moves focus in; Esc closes it and returns focus to Menu, and `aria-expanded` follows; choosing a link closes it and lands at 76 px.
  - Press A focuses `afk-title` at 76 px.
- **Accessibility tree:**
  - One h1, named "TiDi Hồ Trọng Đại Dai Ho Trong", with `lang="vi"` on the Vietnamese name.
  - Banner, navigation "Main", main, contentinfo; ordered h2, h3 and h4.
  - The avatar figure is named by its caption, and the `img` has `alt=""` (1086 × 1448).
  - The verdict is a status; the toggles use `aria-pressed`.
- **Theme:** follows the system; the choice persists; `data-theme` is already dark at DOMContentLoaded (no flash); `aria-pressed` matches.
- **Content (`portfolio-content` D):**
  - `<title>` and meta description equal `meta.title` and `meta.description`.
  - 207 unique visible lines. Every one is verbatim in `info.md`, except 7 formatted joins of `info.md` facts (middot lists, "In production since 2020" per the Phase 1 trace, "PDF, 140 KB" from the approved template).
  - 0 placeholders. None of the phone number, [private], the reference, availability, travel or photography.
  - Dashes in the rendered copy are all the owner's wording.
  - 6 off-site links, all live (Phase 5 curl 200). `/tidi-resume.pdf` → 200, `application/pdf`, 139,949 B.
  - 404: "Nothing here" and "Back to TiDi".
  - PDF: title "TiDi, Résumé", 2 pages; the text matches content; privacy grep clean.

## Acceptance criteria (contrib-verification §3)
- **B1** (setup, tokens, fonts):
  - B1.1 met
  - B1.2 met, except minors in F12
  - B1.3 met by screenshots (Chakra Petch and Mona Sans render, Vietnamese included); `document.fonts.check` was not run
- **B2** (shell):
  - B2.1 met (manual)
  - B2.2 met
  - B2.3 not met: F2, the menu sheet rather than the HUD
  - B2.4 met
  - B2.5 met
- **B3** (hero and handshake):
  - B3.1 met (manual; Vitest dropped by the owner), except F8
  - B3.2 met
  - B3.3 not met: F1 context loss. The DPR cap, touch scroll and off-screen pause are met.
  - B3.4 met
  - B3.5 met
- **B4** (Quest journal):
  - B4.1 met
  - B4.2 met
  - B4.3 met: selection announces through the sr-only status region, as ruled, and focus moves only on a visitor's activation
  - B4.4 not met: F4, Space
- **B5** (remaining sections):
  - B5.1 met
  - B5.2 met
  - B5.3 met
  - B5.4 met (level-up per load, as ruled)
- **B6** (résumé and metadata):
  - B6.1 met
  - B6.2 met
  - B6.3 met

## Checks run and skipped
- **Run:**
  - The gate
  - Source read of `src/**`, the configs and the styles; greps for listeners, transitions, raw values and client boundaries
  - The Playwright scripts in the scratchpad (not committed), against my own `next start` on :3300 (PID 69360, stopped by PID). PID 6878 on :3000 was untouched.
- **Screenshots:** 79 in `docs/reviews/v2/final/screens/`:
  - the whole-page matrix: 6 widths × 2 themes × motion on and off (24)
  - hero boot, genuine, rejected, reduced, no-WebGL and context loss at 375 and 1440 in both themes
  - no-JS
  - the menu, and the menu focus leak
  - focus states: skip link, Run, Counterfeit, video, Lemonswan, Press A
  - 404
  - 200 % zoom and 320 reflow
- **Skipped:**
  - Separate per-quest journal captures with the toast. The journal is covered in the full-page matrix, the 200 % zoom capture and the Phase 3 captures.
  - Firefox and WebKit engines: lean scope. Touch was emulated in Chromium via CDP.
  - Hidden-tab pause: `visibilitychange` is covered by code read only.
- **Raw data:** in the scratchpad (`qa/out/*.json`, `aria.yml`, `pdf-text.txt`).
