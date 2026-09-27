# Portfolio implementation plan

> **Status: Approved by owner, 2026-09-28** ("continueu", in reply to "Reply 'approved' to start Phase 1, or tell me what to change"). Phases 1–12 are authorised. Phase 13 is on hold (O1, O2).
> **Inputs:**
> - `info.md` (confirmed 2026-09-27)
> - `DESIGN.md` (created 2026-09-28; amended the same day for D3 and the location; lint 0 errors, 0 warnings)
> - `docs/design/directions.md` (B · Proof selected 2026-09-28)
> - `CLAUDE.md`
>
> **Contributions (the detail behind this plan):**
> - [`contrib-design.md`](contrib-design.md): `design-lead`
> - [`contrib-engineering.md`](contrib-engineering.md): `frontend-engineer`
> - [`contrib-verification.md`](contrib-verification.md): `qa-reviewer`
>
> Where this plan and a contribution differ, this plan wins. Rulings are logged in `docs/progress.md`.

**Goal:** ship daiho.dev: a fast, accessible, truthful one-page portfolio in Direction B · Proof, built only from `info.md` and `DESIGN.md`.

**Architecture:**
- One statically prerendered Next.js App Router page, plus a 404, crawl files and build-time social images.
- **Rendering:** Server Components everywhere, except four small client leaves: theme toggle, handshake bench, video facade, menu.
- **Content:** Zod-validated modules mirroring `info.md`.
- **Tokens:** generated from `DESIGN.md`.
- **Résumé:** printed from the same content to a tagged PDF.

**Stack** (versions verified with `npm view` 2026-09-28; full pins in contrib-engineering §1.1):

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.6, React 19.3.0, TypeScript 6.0.3 (strict) |
| Styling and assets | Tailwind CSS 4.3.3, Zod 4.6.5, `@tabler/icons-react` 3.48.0, `@google/design.md` 0.4.0; Archivo via `next/font/local` (project subset) |
| Motion | CSS only |
| Testing | Vitest 5.0.2, Playwright 1.63.0 with `@axe-core/playwright` 4.13.0, `@lhci/cli` 0.15.1 |
| Lint and format | ESLint 9.39.5 with jsx-a11y, Prettier 3.9.9 |
| Runtime | Node 24 LTS, pnpm 10.34.5 |
| Hosting | Deferred: the owner will decide later (O1). The build runs locally via `next start`, as prerendered by Next. |

## Global Constraints
Every phase includes these implicitly. Values are copied from `CLAUDE.md`, `DESIGN.md` and `info.md`.
- **Accessibility:** WCAG 2.2 AA in both themes; axe finds 0 violations in every matrix cell; keyboard-operable; visible `:focus-visible` ring (2 px `focus`, 2 px offset); targets ≥ 44 × 44 px.
- **Performance:**
  - Lighthouse (mobile and desktop, production build, `median-run` of 3): performance ≥ 95; accessibility, best practices and SEO = 100.
  - Lab vitals: LCP ≤ 2.5 s (the LCP element is text); CLS ≤ 0.1 (target 0); TBT ≤ 200 ms.
- **Budgets:**
  - first-load JS ≤ 120 KB gzip per HTML route, of which app-owned ≤ 15 KB (recalibrated once in Phase 1 if the framework floor is > 105 KB)
  - CSS ≤ 20 KB gzip; fonts ≤ 100 KB (one preloaded woff2); avatar variant ≤ 150 KB
  - 0 third-party requests before interaction
- **Layout:** works from 320 to 1920 px with 0 horizontal overflow; reflows at 200 % zoom; `min-h-dvh`, never `h-screen`.
- **Content:**
  - Every visible string traces to `info.md`, and new wording ships only from `info.md` → Approved copy.
  - No placeholders, and no `[copy:` marker ever renders.
- **Privacy:**
  - Never shown anywhere (page, JSON-LD, PDF, build output): the phone number, [private email removed], the reference, the "accepting quests" line, travel and photography.
  - The location "Ho Chi Minh City, Vietnam" appears only in Contact, the résumé and JSON-LD (O4).
- **Design:**
  - Colours, sizes, radii, durations, easings and z-index come only from `DESIGN.md` tokens: the export, plus the generated theme and a supplement checked by a test.
  - Locks: one theme strategy, violet only for proof and action, radius 6, Tabler outline stroke 1.5, Archivo only.
- **Motion:**
  - Movement uses `transform`/`opacity` only; control feedback may transition `color`, `background-color` and `border-color` at `duration-feedback` (CLAUDE.md, ruling D1).
  - Never `transition: all`; every animation has its `DESIGN.md` reduced-motion variant; no scroll listeners.
- **Voice:** first person, sentence case, active voice, one label per intent, no em or en dashes in UI copy we write. The owner's own words are kept as given, rendered per directions §3.
- **Theme and language:** English only (`lang="en"`, and `lang="vi"` on "Hồ Trọng Đại"). The theme follows the system with a toggle, and there is no flash. No analytics. YouTube loads only after activation, on youtube-nocookie.
- **Process:**
  - One implementer at a time. Every phase passes the `verification` gate and a `qa-reviewer` review before the next one starts.
  - Dependencies are exactly pinned; any addition needs `npm view` and a plan line.

## File Map
The full, authoritative map with phases is contrib-engineering §2. Top level:

| Path | Responsibility | Phase |
|---|---|---|
| `package.json`, lockfile, `.nvmrc`, configs, `.github/workflows/ci.yml` | Toolchain, gates, CI | 1 |
| `scripts/{design,tokens,fonts,resume}/` | Generators and freshness checks | 2, 10 |
| `src/styles/` | Generated tokens (CSS, DTCG JSON), generated theme, supplement, reset, print CSS | 2, 10 |
| `src/assets/fonts/`, `assets/fonts/source/` | Archivo subset, static instances, manifest; pinned OFL source | 2 |
| `src/content/` | Typed, validated modules mirroring `info.md`; `copy.ts` (approved copy); `drawings.ts` | 3 onward |
| `src/lib/` | Format, facts, theme, handshake reducer, SEO builders, résumé model | 3 onward |
| `src/app/` | Layout, page, not-found, metadata files, OG images, icons, sitemap, robots | 1, 4, 11 |
| `src/components/<feature>/` | Server Components; client leaves are `*.client.tsx` | 4–11 |
| `public/<résumé>.pdf`, `resume.lock.json` | The committed, hash-locked résumé | 10 |
| `tests/unit/`, `tests/e2e/` | Checks-first tests per phase, plus the QA harness | 1 onward |

## Owner decisions
Answered 2026-09-28.

| # | Decision | Answer | Effect |
|---|---|---|---|
| O1 | Hosting | **Decide later** | The build follows contrib-engineering: prerendered Next, verified locally with `next start`. Host-specific work is isolated in Phase 9 (avatar serving), Phase 11 (headers) and Phase 13 (deploy). If Cloudflare is chosen, a static-export conversion task (about 1 day) is added before Phase 13. |
| O2 | Repository | **Do not push for now** | Local git only. The CI workflow is written in Phase 1 but first runs on the first push; until then the local gate (`pnpm check`, `test:e2e`, `lhci`) is authoritative. Visibility is decided with the push; private is recommended. |
| O3 | Local toolchain | **Install Node 24 and pnpm 10** | Phase 1: Node 24 via nvm, alongside 22 (the default is unchanged); pnpm 10.34.5 via Corepack, per project. |
| O4 | Location | **Résumé and site** | "Ho Chi Minh City, Vietnam" appears in Contact, on the résumé and in JSON-LD (`address`). The privacy test allows it; the label is a C3 copy slot. |

The DNS changes are made by the owner, from exact steps, once hosting is chosen. `DaiHo Resume.pdf` is never tracked by git.

## Owner deferral (2026-09-28)
During Phase 1 the owner wrote to `frontend-engineer`: *"skip performance budget, scan, seo for now, focus on building porfolio"*. The agent relayed it in its report; the owner had resumed that agent from its transcript view.

**Suspended until the owner re-enables them:**
- byte budgets (`pnpm test:budget`, and every acceptance line that reads "the budget passes")
- `pnpm lhci`, Lighthouse scores and lab vitals
- every `perf-seo-audit` run (the milestone audits M1–M3 and the scoped checks)
- the framework-floor ruling (the floor is 133.6 KB gzip)
- Phase 11, except the items moved to Phase 4
- Phase 12's performance criteria

**Also suspended:** the build-output privacy scan (the owner, 2026-09-28: "Turn it off too"). The script and its unit tests stay for re-enabling. Private details stay out structurally: the content model holds only the opted-in channels, so Phase 3 gets no separate privacy test.

**Kept, because they are the build itself:**
- accessibility gates: axe, keyboard, focus
- the layout matrix and width sweep
- design checkpoints, code review, content traceability

**Moved:** the document `<title>` and meta description, both approved in `info.md`, move to Phase 4. They are WCAG 2.4.2, not only SEO, and Phase 4 requires axe 0.

**Order:** Phases 2–10 run as planned, then Phase 12 as a UI, accessibility and content release check with Checkpoint 2. Phase 11 and the performance parts of 12 wait for the owner. Phase 13 stays on hold.

## Copy approval batches
Run by the main session with the owner, through `portfolio-content` B. Options are drafted from `info.md` facts only. Approved text goes to `info.md` → Approved copy, then to `src/content/copy.ts`. Rows refer to contrib-design §7.

| Batch | Rows | Contents | Drafted during | Approved before |
|---|---|---|---|---|
| C1 | 1, 2, 3, 4, 6, 7, 11 | CTA label and casing; hero sentence; Résumé label; accessible names (toggle, menu, nav, skip link); host/chip framing check; CyberRock drawing structure check; date format | Phases 1–3 | Phase 4 |
| C2 | 5, 8, 9, 10, 12, 16 | Handshake run, toggle and rejected labels, and step wording; Quest carried-data labels; botmivivi replaced-steps label; botmivivi figures and impact wording; Quest users label; Lemonswan and Scania one-liners; video facade name and caption | Phases 4–5 | Phase 6 |
| C3 | 13, 14, 15, 17, plus extras | Avatar caption; "Languages" label and the AFK source; résumé wording (its summary contains "seamless"); 404 text; page title and description; OG alt text; résumé file name and title; Résumé size hint; location label | Phases 6–8 | Phase 9 |

## Execution
- **Per phase:**
  1. The main session briefs `frontend-engineer` (phase text, acceptance criteria, paths).
  2. The engineer implements checks first, then code, and returns a report with evidence.
  3. The main session verifies the diff and re-runs the gate.
  4. `qa-reviewer` runs `code-review` and `ui-audit` (and `perf-seo-audit` where listed).
  5. Fix loop: at most 2 rounds, then the main session rules.
  6. Design checkpoints run where listed. The phase is marked complete in `docs/progress.md`.
- **Continuous:** Phases 1–12 run without pausing, except for:
  - copy batches C1–C3 (the owner)
  - a framework-floor recalibration (the main session rules)
  - material design or scope changes (the owner)
  - anything destructive or irreversible
- **Phase 13 is on hold** until the owner decides hosting (O1) and the first push (O2). After Phase 12 the site is release-ready locally.
- **QA criteria IDs** (contrib-verification §2) map to these phases:

  | QA ID | Phase(s) |
  |---|---|
  | P1 | 1 |
  | P2 | 2–5 |
  | P3 | 6 |
  | P4 | 7–8 |
  | P5 | 9 |
  | P6 | 11 |
  | P7 | 10 |
  | P8 | 12 |
  | P9 | 13 |

  The global criteria G1–G11 (contrib-verification §2.2) apply to every phase.

---

## Phase 1: Foundation

### Goal
A verified toolchain and an empty shell, with every gate command in place and passing.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- this plan; contrib-engineering §1, §2, §9; contrib-verification §1.3 and §6
- owner decisions O2 and O3 (answered)

### Tasks
- [ ] **Toolchain (O3):** Node 24 via `nvm install 24` (the default stays 22; the project uses `.nvmrc`); pnpm 10.34.5 via Corepack and the `packageManager` field.
- [ ] **Repository (local only, O2):**
  - `git init`
  - `.gitignore` covering build output, `test-results/`, `playwright-report/`, `.lighthouseci/`, `docs/reviews/**/screens/`, `docs/reviews/**/raw/`, `.env*` and `DaiHo Resume.pdf`
- [ ] **Scaffold:**
  - the scaffold from the file map, with exact pins and no template content
  - `tsconfig` strict with explicit `types: ["node"]`
- [ ] **Configs:**
  - ESLint flat config: next, jsx-a11y strict, typescript-eslint, better-tailwindcss, `jsx-no-literals`, client-leaf import bans
  - Prettier; Vitest
  - Playwright: chromium desktop and mobile, webkit mobile, and Firefox desktop for the layout and keyboard specs
  - `lighthouserc`: mobile and desktop, 3 runs, `median-run`
- [ ] **CI workflow** (contrib-engineering §9.2), with actions pinned to commit SHAs. It is written and committed now, and first runs on the owner's first push (O2).
- [ ] **Harness:**
  - a console and page-error guard fixture; a two-theme fixture; the budget spec
  - a privacy scan of `src/`, `public/` and the build output
  - the architecture test; the content-trace test scaffold
- [ ] **Shell:** `<html lang="en">`, `dynamic = 'error'`, an empty `main`.
- [ ] **Measure and confirm:**
  - record the framework JS floor
  - confirm the `@google/design.md` licence (Apache-2.0 per its repository)
- [ ] The main session adds the new commands to CLAUDE.md → Testing & Verification.

### Expected Outputs
A repository with a passing gate on an empty shell, and a Phase 1 report containing the framework floor.

### Acceptance Criteria
- **Install:** `pnpm install --frozen-lockfile` shows no unexplained peer warnings.
- **Gate:** `pnpm lint`, `typecheck` and `test` are clean; `pnpm build` shows every route static (○); the e2e smoke test has 0 console errors; `pnpm lhci` runs its assertions.
- **Budget:** the budget spec prints the framework floor in KB. The main session confirms 120/15 KB, or rules on a recalibration if the floor is > 105 KB.
- **Privacy:**
  - `git check-ignore "DaiHo Resume.pdf"` confirms it is ignored, and it is absent from `git ls-files`
  - the privacy scan runs in CI and is clean
- **QA:** P1-1 to P1-8.

### Dependencies
Plan approval. O3 is approved; no remote and no push (O2).

### Review
`qa-reviewer`: code review; UI audit limited to axe and overflow on the skeleton. No checkpoint.

## Phase 2: Tokens and fonts

### Goal
`DESIGN.md` tokens and Archivo reach code only through generators, and the sync checks bite.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` (including the D3 amendment)
- contrib-engineering §1.5 and §4

### Tasks
- [ ] **`pnpm tokens`:**
  - `design.md export` to css-tailwind and to DTCG
  - a parser-generated `theme.generated.css`: dark swap, `type-*` utilities with `font-stretch` and `tnum`/`lnum`, font re-pointing, focus ring
- [ ] **Supplement and reset:**
  - `theme.supplement.css`, hand-mapped from DESIGN.md prose: clamps, motion tokens, breakpoints, container sizes, skip-link layer, strokes, scroll margin
  - `theme-reset.css`
- [ ] **Enforcement:** token-only lint (unknown classes, arbitrary values, `dark:`); `tokens.test.ts`.
- [ ] **`pnpm fonts`:** a subset of latin, vietnamese and arrows (`wdth` 87.5–125, `wght` 400–800); static instances for Satori and the résumé; a manifest; `fonts:check`; `font-coverage.test.ts`.

### Expected Outputs
Committed generated files that the checks can regenerate, and one preloaded woff2.

### Acceptance Criteria
- **Design lint:** `pnpm design:lint` shows 0 errors and 0 warnings.
- **Token sync:** `pnpm tokens:check` exits 0, and exits 1 after an unregenerated DESIGN.md edit (shown in the report, then reverted). `tokens.test.ts` passes, including the supplement-versus-DESIGN.md comparison.
- **Fonts:** the woff2 is ≤ 100 KB (size recorded). `font-coverage.test.ts` passes on `info.md`, including "Hồ Trọng Đại" and "→".
- **Lint:** lint rejects `bg-red-500` and `p-[13px]` (shown).
- **Shell:** it renders `page` tokens in both themes; axe finds 0 violations.
- **QA:** G11; the token part of P2 (P2-1).

### Dependencies
Phase 1. The D3 amendment to `DESIGN.md` is done (2026-09-28).

### Review
Code review.

## Phase 3: Content layer

### Goal
Every `info.md` fact the site uses exists exactly once, typed and validated.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `portfolio-content` (C: map), `verification`

### Inputs
- `info.md`, contrib-engineering §3
- owner decision O4

### Tasks
- [ ] **Modules:** `src/content/*`, one module per `info.md` section, written `as const satisfies` the Zod schemas.
- [ ] **Formatting:** `lib/format/*` (typography, period, en-US numbers).
- [ ] **Builders:** `lib/content/facts.ts`; the section registry.
- [ ] **Tests:** content, traceability, format and facts. There is no privacy test (owner deferral).

### Expected Outputs
Content modules, their schemas and tests, and a report mapping each `info.md` section to its module.

### Acceptance Criteria
- **Tests:** `pnpm test` passes.
- **Guards:**
  - an unsourced string fails traceability (shown)
  - invalid content fails `next build` with a readable Zod path (shown, then reverted)
- **Structural privacy:** `contact.ts` holds only the opted-in channels (email tidi.dev1321@gmail.com, Telegram, GitHub) and the location (O4). The schema has no fields for the phone number, the second email or the reference.
- **Fonts:** font coverage passes on the content modules.

### Dependencies
Phase 1 (runs after Phase 2, one implementer).

### Review
Code review, plus a content check (`portfolio-content` C).

## Phase 4: Shell and hero (first visual milestone, part 1)

### Goal
The first viewport in both themes, accessible, with the bench in its static rest state.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Header, Links and buttons, Hero, Handshake bench (rest state)
- contrib-engineering §5; approved C1 copy

### Tasks
- [ ] **Checks first:** the `smoke`, `a11y`, `layout` (6 widths × 2 themes), `keyboard`, `theme` and `no-js` specs; `theme.test.ts`.
- [ ] **Shell:** skip link, header and nav, menu disclosure (client), theme toggle (client) with the head script, the `<noscript>` style, footer, section wrapper.
- [ ] **Hero:** the lockup (h1: TiDi / Hồ Trọng Đại `lang="vi"` / Dai Ho Trong), the role and sentence, the CTA pair.
- [ ] **Title and description** (moved from Phase 11 by the owner deferral): wire the approved `meta.title` and `meta.description` through the Metadata API, so axe's `document-title` passes.
- [ ] **Bench, static rest state:** `plate`, compact and wide drawings, the readout "genuine" with `check`, the caption. The controls arrive in Phase 6, so no button is ever dead.

### Expected Outputs
The first viewport, and screenshots at 375, 768 and 1440 px in both themes.

### Acceptance Criteria
- **Structure:**
  - one `h1` with the three names; every landmark present
  - the skip link is the first Tab stop and moves focus to `main`
  - a focus ring on every control
- **Theme:**
  - a stored dark theme is dark at the first frame
  - the toggle persists across reloads, with `aria-pressed` correct
  - `color-scheme` and `theme-color` follow the theme
  - 0 hydration warnings (P2-2 to P2-4)
- **Menu:** Escape closes it and returns focus; choosing a link closes it; without JS the links are visible and the button hidden.
- **Bench:**
  - the variant switches at the `DESIGN.md` threshold
  - with JS off, the server HTML holds all hero text and the rest state
- **Quality bars:** 0 overflow at the 6 widths; axe 0 in both themes; the budget passes; `pnpm lhci` passes; CLS 0.

### Dependencies
Phases 2–3; C1 rows 1–4 and 6 approved.

### Review
Code review and UI audit. Checkpoint 1 follows Phase 5.

## Phase 5: Sheet anatomy and the CyberRock drawing (first visual milestone, part 2)

### Goal
The sheet language and the drawing grammar, proved on CyberRock, completing what Checkpoint 1 needs.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Sheets, Drawing grammar (CyberRock row)
- contrib-design §1.4; approved C1 rows 7 and 11

### Tasks
- [ ] **Sheet components:** full sheet, sheet head, facts list, bullet list, subheads.
- [ ] **Drawing base:** the drawing figure shell, primitives and geometry modules.
- [ ] **CyberRock drawing:** wide and tall, with a text alternative (visible `figcaption`, a visually hidden `ol`, each SVG `aria-hidden`).
- [ ] **Section:** the Quest journal section.

### Expected Outputs
The CyberRock sheet in both themes and at every width, plus the 6 × 2 capture matrix.

### Acceptance Criteria
- **Sheet:** only present slots render (no link; the date format per C1 row 11).
- **Drawing:**
  - one proof; labels ≥ 14 px from 320 px
  - wide at the corrected container threshold, tall below it
  - traceability passes for every label
- **Width sweep:** 320 to 1920 px in 8 px steps, plus each flip width ±1 px, for the bench and the CyberRock drawing (Review Focus 3).
- **Quality bars:** axe 0 in both themes; the budget passes.

### Dependencies
Phase 4; C1 rows 7 and 11.

### Review
- Code review and UI audit.
- **Design Checkpoint 1** (`design-lead`, contrib-design §6.1) covering Phases 4–5: the matrix, the no-JS hero, 200 % zoom at 1280 px.
- A scoped `perf-seo-audit`: fonts, LCP element, delayed-font shift, HTML size.

## Phase 6: Signature, run the handshake

### Goal
The bench exactly as `DESIGN.md` specifies, in every mode.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Handshake bench, Motion
- contrib-engineering §1.3 and §5.3; approved C2 row 5

### Tasks
- [ ] **Checks first:** reducer tests (every transition, including interrupt, toggle-cancel, rejected and instant); `handshake.spec.ts` on chromium and webkit.
- [ ] **Logic and wiring:** `machine.ts`, the bench client leaf, `bench.css` keyframes keyed off data attributes, the controls, the polite live region, the step list.

### Expected Outputs
A working bench, and a report stating the app-owned JS.

### Acceptance Criteria
- **Genuine run:** a keyboard-only run ends "genuine" in about 1,080 ms, with the live region passing through each step.
- **Rejected run:** with the toggle pressed (`aria-pressed`, icon swap, constant label), the run ends rejected in about 600 ms, with one shake.
- **Interruptions:** a run during a run restarts; the toggle during a run returns to idle.
- **Reduced motion:** `document.getAnimations()` is empty after a run; numerals 1 and 2 show; only the verdict is announced.
- **Without JS:** the rest state shows and no controls render.
- **Motion:** only `transform` and `opacity` animate, plus the D1 colours on controls.
- **Quality bars:**
  - CLS 0 during a run; targets ≥ 44 px
  - interaction latency ≤ 200 ms at 4× CPU slowdown (B7)
  - the budget passes
  - a VoiceOver pass of the live region

### Dependencies
Phase 5; C2 row 5.

### Review
Code review and UI audit. `perf-seo-audit` M1, full. `design-lead` is consulted on timing.

## Phase 7: Remaining sheets and the video facade

### Goal
The botmivivi and Quest @ NFQ Asia full sheets, the Lemonswan and Scania compact sheets, and the video facade.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Sheets, Video facade
- approved C2 rows 10, 12 and 16

### Tasks
- [ ] **Sheets:** the two full sheets (term lists, inline lists, facts) and the two compact sheets.
- [ ] **Video facade:** the client leaf (a server link without JS; the youtube-nocookie iframe on activation).

### Expected Outputs
All five sheets and the facade.

### Acceptance Criteria
- **Content:**
  - verbatim fragments throughout, and traceability passes
  - Scania has no period; only Lemonswan has a link (same tab, `external-link` icon); there are no empty `dd`
  - figures use en-US grouping
- **Video:**
  - 0 requests to youtube, ytimg or googlevideo before activation (network log)
  - activation loads the nocookie iframe with its title and moves focus to it; with JS off, it is a link to the watch URL
  - QA watches the video (D8)
- **Quality bars:** axe 0 in both themes; 0 overflow at the 6 widths; the budget passes.

### Dependencies
Phase 6; C2 rows 10, 12 and 16.

### Review
Code review and UI audit.

## Phase 8: Remaining drawings

### Goal
The Quest migration and botmivivi ledger drawings, wide and tall, with text alternatives.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Drawing grammar (Quest and botmivivi rows)
- approved C2 rows 8 and 9

### Tasks
- [ ] Build both drawings, and extend the width sweep to them.

### Expected Outputs
Both drawings, in both themes and at every width.

### Acceptance Criteria
- **Grammar:** one proof; replaced nodes dashed; the boundary as specified.
- **Variants:** they switch at the threshold; labels are ≥ 14 px; no label reaches beyond `info.md` (traceability).
- **Tokens:** the token test finds no raw colours.
- **Quality bars:** 0 overflow; axe 0; the extended width sweep passes (Review Focus 3).

### Dependencies
Phase 7; C2 rows 8 and 9.

### Review
Code review and UI audit. `perf-seo-audit` M2, full: the heaviest HTML (inline SVG variants) and facade privacy.

## Phase 9: Remaining sections

### Goal
Experience, House rules, Inventory with Leveling up, About with the avatar, AFK and Contact.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- `DESIGN.md` → Experience, House rules, Inventory, AFK, About avatar, Contact
- approved C3 rows 13 and 14

### Tasks
- [ ] **Sections:** the six sections. Contact includes the location row "Ho Chi Minh City, Vietnam" (O4), with its label from C3.
- [ ] **Avatar:** `ava.PNG` moved byte for byte (SHA-256 checked); served as AVIF or WebP through `next/image` (Vercel) or pre-generated variants (Cloudflare, O1).

### Expected Outputs
The complete page, in both themes and at every width.

### Acceptance Criteria
- **Content:** traces to `info.md`.
- **Avatar:**
  - the caption and `alt` follow C3 row 13
  - lazy-loaded, at its intrinsic size, with CLS 0
  - `sizes` matches DESIGN.md at 375, 768 and 1440 px
  - each variant is ≤ 150 KB
- **Links:**
  - `mailto:` and `t.me` links are well formed; external links return 2xx or 3xx
  - nav links resolve to existing ids
- **Quality bars:** axe 0; 0 overflow; the budget passes.

### Dependencies
Phase 8; C3 rows 13 and 14.

### Review
Code review and UI audit; a scoped `perf-seo-audit` of the avatar.

## Phase 10: Résumé PDF

### Goal
A new, accessible résumé generated from content that can't go stale. `DaiHo Resume.pdf` is never reused.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `portfolio-content` (C), `verification`

### Inputs
- contrib-engineering §7; contrib-design §2 (row 36)
- approved C3 row 15, the file name and the title

### Tasks
- [ ] **Model and layout:** the résumé model from content; the A4 print layout.
- [ ] **`resume:pdf`:** render, compile CSS, axe, then Chromium `page.pdf` (tagged, outlined), then the lock.
- [ ] **`resume:check`:** the freshness check.
- [ ] **Link:** the Résumé link renders only when the PDF exists, with a format and size hint.

### Expected Outputs
`public/<résumé>.pdf` and `resume.lock.json`.

### Acceptance Criteria
- **PDF:** A4, tagged, outlined, fonts embedded, ≤ 2 pages, ≤ 300 KB.
- **Freshness:** `resume:check` passes, and fails after a content edit without regeneration (shown).
- **Text test:** the PDF contains the name (including "Hồ Trọng Đại"), the role, the location (O4), and every employer and period. It contains no phone pattern, no [private email removed], no "accepting quests" and no reference data.
- **Accessibility and links:** axe finds 0 violations on the résumé HTML; the links download the file.

### Dependencies
Phases 2–3 and 9; C3 row 15.

### Review
Code review, plus a content check of the PDF; a scoped `perf-seo-audit` of the PDF size.

## Phase 11: SEO, metadata and not found

### Goal
Complete metadata, social previews, structured data, crawl files, the 404 page, icons and security headers.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`

### Inputs
- contrib-engineering §6; `DESIGN.md` → other surfaces
- approved C3 row 17 and the OG alt text

### Tasks
- [ ] **Checks first:** `metadata.test`, `json-ld.test`, `seo.spec`.
- [ ] **Metadata and images:** the Metadata API; OG and Twitter images built with static Archivo instances.
- [ ] **Structured data:** JSON-LD `Person`, `WebSite` and `ProfilePage`.
- [ ] **Crawl, 404 and icons:** `sitemap`, `robots`, `not-found`, icons.
- [ ] **Headers:** CSP and security headers via `headers()`, verified under `next start`. They move to host config only if Cloudflare is chosen later (O1).

### Expected Outputs
The SEO surfaces, and a cross-surface consistency test.

### Acceptance Criteria
- **Metadata:** title ≤ 60 characters and description ≤ 160; canonical `https://daiho.dev/`.
- **Social image:** OG and Twitter point to a 1200 × 630 PNG, ≤ 200 KB, with alt text.
- **Structured data:** JSON-LD parses and validates; every Person value traces to `info.md`. The `address` is `addressLocality` "Ho Chi Minh City" and `addressCountry` "Vietnam" (O4), with no street-level data.
- **Crawl and 404:** `sitemap` and `robots` are correct; `/does-not-exist` returns 404 with the custom page.
- **Headers and SEO:** icons and `theme-color` present; security headers present with 0 CSP violations; Lighthouse SEO = 100.
- **Cross-surface:** the name and facts agree across the page, metadata, JSON-LD and the social image (Review Focus 4).

### Dependencies
Phase 9; C3 row 17.

### Review
Code review; `perf-seo-audit` M3, full.

## Phase 12: Pre-release hardening

### Goal
Every budget met and measured on the production build; the release audit and Checkpoint 2 passed.

### Responsible Agent
`frontend-engineer`

### Skills Used
`frontend-build`, `verification`. The reviewers use `perf-seo-audit`, `ui-audit`, `portfolio-content` (D) and `design-system` (critique).

### Inputs
Everything above.

### Tasks
- [ ] A full budget pass: fix regressions.
- [ ] The full e2e suite on chromium and webkit (Firefox for layout and keyboard).
- [ ] The cross-surface test extended to the PDF.
- [ ] `pnpm check` green.

### Expected Outputs
The release audit reports and the Checkpoint 2 critique.

### Acceptance Criteria
- **Lighthouse:** `pnpm lhci` (mobile and desktop, median) meets the Global Constraints; the LCP element is text.
- **Budgets:** the numbers are reported; 0 third-party requests before interaction.
- **Tests:** the full suite is green.
- **Audits:**
  - release `perf-seo-audit` PASS
  - `ui-audit` PASS over the full matrix and the K1–K6 keyboard scripts
  - `portfolio-content` D: 0 unmatched facts, 0 placeholders, 0 broken links
  - Checkpoint 2 signed off

### Dependencies
Phases 10–11.

### Review
The release audit (contrib-verification §7), then **Design Checkpoint 2** (contrib-design §6.2).

## Phase 13: Deployment and release (on hold)

> **On hold until the owner decides hosting (O1) and the first push (O2).**
> - Vercel: the tasks below apply as written.
> - Cloudflare: first add the static-export conversion task, about 1 day (`output: 'export'`, pre-generated avatar variants, security headers in the host's headers file, `www` redirect rule), then its DNS equivalent.

### Goal
A verified preview, then daiho.dev live, only with the owner's approval.

### Responsible Agent
`frontend-engineer`. The owner performs the account and DNS actions.

### Skills Used
`verification`

### Inputs
- contrib-engineering §9.3–9.5, or its Cloudflare variant (O1)
- O1 and O2

### Tasks
- [ ] **Repository** (with approval): create it with the O2 visibility, then push.
- [ ] **Hosting project:** previews protected and `noindex`; production staged.
- [ ] **DNS:** the owner applies the DNS records.
- [ ] **Release:** promote on the owner's approval.
- [ ] **Post-deploy:** the smoke suite, plus LHCI against production.

### Expected Outputs
https://daiho.dev live.

### Acceptance Criteria
- **Repository:** CI is green on GitHub.
- **Preview:** it renders and carries `noindex`.
- **Staging and DNS:** production is staged; DNS is valid; the certificate is issued.
- **Release** (after the owner's approval):
  - `curl -I https://daiho.dev` returns 200, and `www` returns 308 to the apex
  - the smoke suite passes on production (Review Focus 5)
  - a Lighthouse spot check runs on production

### Dependencies
Phase 12; owner approvals for the repository, hosting, DNS and promotion.

### Review
The main session's final verification; `qa-reviewer` reviews the deploy config.

---

## Review Focus
These are the conditions most likely to break the experience that no single phase's own tests catch (contrib-verification §8).

| # | Condition | Pinned by | Extended in |
|---|---|---|---|
| 1 | Private data ships through an unwatched channel: the old résumé in the repo root, a client chunk, the PDF, JSON-LD | Phase 1: the ignore rule and a privacy scan of `src/`, `public/` and the build output, in CI | Phase 10: PDF text, metadata and links |
| 2 | The dark theme breaks parts built after it: flash for returning visitors, strokes and focus ring losing contrast, stale colours after a switch | Phase 4: two-theme fixture on every UI spec, runtime-switch colour checks | Phases 6–9 reuse both |
| 3 | Layouts break between the checked widths, at the container flips (bench, drawings) | Phase 5: the 320 to 1920 px sweep in 8 px steps, plus each flip ±1 px | Phase 8 |
| 4 | Facts or the name differ or render wrongly across surfaces: page, meta, JSON-LD, social image, PDF (diacritics, dates, contact set) | Phase 11: cross-surface test | Phases 10 and 12: the PDF |
| 5 | It works on localhost and breaks on daiho.dev: canonical or `og:image` host, preview indexing, redirects, missing assets, headers breaking YouTube | Phase 13: smoke on preview and production, plus LHCI on production | none |

## Risks and open decisions

| # | Risk or decision | Mitigation | Phase |
|---|---|---|---|
| 1 | The Next 16.3 framework floor is above 105 KB | Measured in Phase 1; the main session recalibrates once, with a logged ruling | 1 |
| 2 | ESLint 9 is past end of life; TypeScript 6 defaults clash with Next's generated config | Exact pins, used in development only; upgrade when vercel/next.js#89764 closes; explicit `tsconfig` verified in Phase 1 | 1 |
| 3 | `@google/design.md` is alpha; the hand-mapped supplement drifts from DESIGN.md | Exact pin; `tokens:check` diff; `tokens.test.ts` parses DESIGN.md's tables | 2 |
| 4 | The font subset exceeds 100 KB, or instancing misbehaves | Measured in Phase 2; fall back to `next/font/google` with a ruling (a fallback "→" glyph) | 2 |
| 5 | Copy approval lags and blocks a phase | Batches C1–C3 drafted ahead, while earlier phases run | 4, 6, 9 |
| 6 | `animationend` sequencing differs in WebKit; screen readers merge fast live-region updates | Webkit e2e, reducer tests, a WAAPI fallback (0 KB); VoiceOver pass, with a one-summary announcement if needed (with `design-lead`'s OK) | 6 |
| 7 | The committed PDF goes stale | Hash lock in CI, text test, manual read at release | 10 |
| 8 | The CSP needs `'unsafe-inline'` for scripts | Accepted: static pages with no user input; a nonce CSP would force dynamic rendering | 11 |
| 9 | Hosting is undecided (O1); Vercel Hobby's terms versus a client-facing CTA | Host-specific work isolated (Phases 9, 11, 13); a conversion task if Cloudflare; Hobby not recommended | 13 |
| 10 | `DESIGN.md` D3 amendment | **Resolved 2026-09-28:** lint 0/0; labels ≥ 14.00 px across 320–1920 px (see Errata) | 2 |

## Errata to the contributions
From the `DESIGN.md` amendment and O4, both 2026-09-28. This plan wins over the contributions.

**DESIGN.md changes:**
- `plate` padding is 16 px below md and 24 px from md.
- The compact bench and the tall drawings are authored at **240** units. At 320 px: 320 − 40 − 2 − 32 = 246, so 1.025× and labels at 14.35 px.
- Wide drawings are authored at **880** units and shown from an **880 px** inner width, so they are wide at 1024 px (894 px, 1.016×, 14.2 px).
- The bench turns wide from a 554 px viewport. The caps are 360 px (compact) and 1144 px (wide).

**Corrections to the contributions:**
- **contrib-verification:**
  - P2-20: 384 px becomes **360 px**
  - §3.2: the scale at 320 px becomes **1.025** (was 0.898)
  - the bench box at 640 px becomes **566 px**
  - the drawing flip is at **880 px** (was 896)
- **contrib-engineering:**
  - §4.2 `--container-drawing` becomes **880px**
  - §3.4 privacy test: the location is allowed (O4) and appears only in `contact.ts`
  - §6 JSON-LD: `address` allowed (locality and country only)
- **contrib-design:** updated by `design-lead` (§3, §9; §1.3, §1.5 and §7 for the location).

**From Phase 2 (2026-09-28):**
- **contrib-engineering §4.2:** supplement tokens use Tailwind's theme namespaces, so utilities exist without arbitrary values:
  - `--transition-duration-*`
  - `--z-index-skip-link`
  - `--stroke-width-{ink,proof}`
  - `--scroll-margin-anchor`
  - `--spacing-{section,sheet}`
  - Values are unchanged.
- **The reset** clears the whole default theme (`--*: initial`).
- **Font subset:** it keeps the browser-default layout features plus `tnum`/`lnum` (94,168 B; every feature would be 102,748 B). No DESIGN.md role renders differently.
- **Phase 2's "axe 0 on the shell"** moves to Phase 4. The shell's two content-absence violations (`document-title`, `page-has-heading-one`) are pinned exactly until the title and h1 exist.

## Coverage checklist
| Item | Phase(s) |
|---|---|
| Project initialization | 1 |
| Technical stack | 1 (pins), 2 (tokens, fonts) |
| Information architecture | 4, 5, 9 (section order per contrib-design §1.3) |
| Data/content architecture | 3 |
| Design system (token pipeline) | 2 |
| Page structure | 4–9 |
| Component architecture | 4–9 (contrib-engineering §5) |
| Responsive behaviour | 4, 5, 8, 9 (matrix and width sweep) |
| Interactions | 4 (theme, menu), 6 (handshake), 7 (video) |
| Motion | 6 |
| Accessibility | every phase (G2, G9), 12 (full matrix and keyboard scripts) |
| SEO | 11 |
| Performance | every phase (budget spec), 5, 6, 8, 11 (milestone audits), 12 (release) |
| Testing | 1 (harness), every phase (checks first) |
| Visual QA | 5 (Checkpoint 1), 12 (Checkpoint 2), every UI phase (matrix) |
| Deployment | 13 |
| Final verification | 12 (release audit), 13 (production smoke, main session) |
