# Phase 2 · Tokens and fonts: code review (with a limited UI audit)

- **Date:** 2026-09-28
- **Reviewer:** `qa-reviewer` (`code-review`; `ui-audit` limited to the shell, from existing evidence only)
- **Scope:** `git diff ebe3877 2de7e17`: 12 commits (`632e7d9`..`2de7e17`, new IDs), 52 files. Everything was read at `2de7e17` with `git show`, so Phase 3 work in the same tree can't leak in. The engineering report cites pre-rewrite IDs, which map through `docs/progress.md` → Git history rewrite.
- **Inputs:**
  - the implementation plan: Phase 2, Global Constraints, Owner deferral, and Errata, including "From Phase 2"
  - contrib-verification G11 and P2-1 (with G5 and G9 for context); contrib-engineering §1.5 and §4
  - `DESIGN.md`, `CLAUDE.md`, and the Phase 2 rulings in `docs/progress.md`
  - `docs/reports/phase-02-engineering.md`
  - the main session's `phase2-gate.log` and `phase-02-screens/`
- **Constraints:** read-only while Phase 3 is built in the same tree. No build, e2e, install or full unit run. Every check below is one of these:
  - a `git` read, or a CLI run whose output went to stdout
  - `pnpm tokens:check` or `pnpm fonts:check`, which write only to the OS temp directory (removed afterwards)
  - an in-memory ESLint probe or Tailwind compile
  - a fontTools read in a scratch venv
  - a read of the main session's 04:42 build output

## Verdicts
- **Spec compliance: PASS.**
  - All four Phase 2 tasks are delivered.
  - Every acceptance criterion is met, except "axe 0 on the shell", which a ruling moved to Phase 4 (a test pins it).
  - G11 and P2-1 hold. Both were verified independently.
- **Quality: FAIL.** 2 Important findings (I1, I2) and 5 Minor.
- **UI audit (limited): PASS.** Tokens paint correctly in both themes, the focus ring matches its spec, and nothing overflows. Skipped checks are listed below.
- **Combined result: FAIL.**
  - The fix round should cover only I1 and I2. Both are small: `eslint.config.mjs`, `theme.supplement.css` and their tests.
  - The minors can be logged.

## Answers to the brief's focus checks
| Check | Result | Evidence |
|---|---|---|
| G11: generated files versus a fresh export | **holds** | <ul><li>`npx --no-install @google/design.md export --format css-tailwind DESIGN.md` is byte-identical to `tokens.generated.css` at `2de7e17` (`cmp` exit 0). The `--format dtcg` export equals `tokens.generated.json`.</li><li>`DESIGN.md` is unchanged in the range, and the token files are unchanged since the first token commit `765a496`. So G11 holds from that commit on (P2-1).</li><li>`pnpm tokens:check` → `the 3 token files match a fresh generation`.</li><li>Against a scratch copy with `focus-dark` edited, it reports 3 stale files and exits 1.</li></ul> |
| Supplement values equal DESIGN.md's tables | **27 of 27** | See the table below. Each value was also parsed from DESIGN.md's own sentences by `tests/support/design-md.ts`, run in a scratch script. |
| Dark swap, attribute and media query | **complete** | <ul><li>All 10 colours (`primary` … `focus`) take their `-dark` hex under `:root[data-theme="dark"]` (`theme.generated.css:143`).</li><li>They also do under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` (`:157`).</li><li>Each block sets `color-scheme: dark`.</li><li>The built CSS keeps both blocks intact.</li></ul> |
| Token-only lint bites | **partly** | <ul><li>**Rejected:** Tailwind defaults, bracket and paren escapes, `dark:`, `*-dark`, raw type, and raw z, duration, delay and stroke numbers. Also `ease-linear`, `transition-all`, tints and gradients.</li><li>**Accepted:** bare-value and static utilities (I1), and three stroke classes that emit invalid CSS (I2).</li></ul> |
| Font subset | **correct** | <ul><li>**Code points:** "Hồ Trọng Đại" (U+1ED3, U+1ECD, U+0110, U+1EA1) and ← → ↔ are mapped in the woff2 and in all 8 instances (344 code points each).</li><li>**Axes (`fvar`):** `wght` 400–800 (default 600), `wdth` 87.5–125 (default 100).</li><li>**Trimmed features:** see "Why the trimmed features change nothing" below.</li></ul> |
| Focus ring: 2 px `focus` at a 2 px offset | **matches** | <ul><li>`:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` (`theme.generated.css:177-179`), from `components.focus-ring`: size 2px, padding 2px, `colors.focus`.</li><li>The built CSS emits `--color-focus: #5b3fd0` in `:root` and `#b7a6ff` in both dark blocks.</li><li>Contrast is 6.24 (on the page) and 6.85 (on plates) in light, and 8.68 and 7.80 in dark, all ≥ 3:1.</li><li>No test pins it (M3).</li></ul> |

**Why the trimmed features change nothing.**
- **Source features:**
  - GSUB: `aalt case ccmp dnom frac liga lnum locl numr onum ordn pnum rvrn sinf subs sups tnum zero`
  - GPOS: `kern mark mkmk`
- **Kept in the subset:** `ccmp liga locl rvrn tnum`, plus `kern mark mkmk`.
- **Dropped:** every dropped feature is opt-in, through `font-variant-*` or `font-feature-settings`, and DESIGN.md uses none of them.
- **`lnum`:** it does nothing, because Archivo's default figures are already lining.
- **The one automatic trigger:** HarfBuzz shapes fractions around U+2044 without being asked, and U+2044 never occurs in `info.md` (0 hits). `info.md` is also NFC, with 0 combining marks.

### Supplement versus DESIGN.md
| Group | `theme.supplement.css` | Value | DESIGN.md | Match |
|---|---|---|---|---|
| Fluid type (8) | :13–20 | display, heading-section, heading-sheet, name (as heading-sheet), lead, body, label, label-strong (as label), each the table's `clamp()` exactly | Typography :179–188 | ✓. `tokens.test.ts` also re-derives the 375 px and 1440 px endpoints |
| Fixed type | none | body-sm 0.9375rem, ui-strong 1rem, wordmark 1.25rem, all kept from the export | :185, :186, :189 | ✓ |
| Rhythm | :23–24 | `clamp(4rem, 3.296rem + 3.005vw, 6rem)`; `clamp(3rem, 2.648rem + 1.502vw, 4rem)` | Layout :201 | ✓ |
| Durations | :28–33 | 120, 150, 160, 200, 240, 360 ms | Motion :327 | ✓ |
| Easings | :34–35 | `cubic-bezier(0.2, 0.7, 0.2, 1)`; `cubic-bezier(0.4, 0, 0.6, 1)` | Motion :327 | ✓ |
| Breakpoints | :38–39 | 48rem, 64rem | Responsive Behavior :343 | ✓ |
| Containers | :43–44 | bench 480px, drawing **880px** | :245, :272; Errata | ✓ |
| Layer | :47 | 100 | Layout :206 | ✓ |
| Strokes | :51–53 | ink 1.5px, proof 2px, dash `6 4` | Drawing grammar :266–270 | ✓ values; namespace wrong (I2) |
| Anchor margin | :56 | 24px | Layout :206 | ✓ |

**How each token compiles** (an in-memory Tailwind compile of `globals.css`):

| Class | Emits |
|---|---|
| `duration-feedback` | `transition-duration` |
| `ease-out`, `ease-in-out` | `transition-timing-function` |
| `md:`, `lg:` | `@media (width >= 48rem)`, `@media (width >= 64rem)` |
| `@bench:`, `@drawing:` | `@container (width >= 480px)`, `@container (width >= 880px)` |
| `z-skip-link` | `z-index: var(--z-index-skip-link)` |
| `max-w-bench` | `max-width: var(--container-bench)` |
| `scroll-mt-anchor`, `gap-section`, `py-sheet` | as named |
| `stroke-ink`, `stroke-proof` | `stroke-width` |
| `type-label` | `87.5%`, plus `tabular-nums lining-nums` |

Every class emits what its token intends, except the stroke traps in I2.

## Strengths
- **G11 holds byte for byte, and the rest of the front-matter layer is machine-derived.**
  - The generator refuses a colour without a `-dark` twin, a second family, an unreadable axis or feature, and a ring that isn't `colors.focus`.
  - `tokens:check` bites.
- **The supplement test reads DESIGN.md's own sentences.** It forbids undeclared values, so no new hand-mapped token can land without a test line.
- **The font pipeline is pinned, deterministic and self-verifying.**
  - The TTF and OFL blob hashes match google/fonts `95f4904`.
  - It reads its own woff2 back to verify it.
  - Trimming the features is sound and saves 8.6 KB.

## Spec compliance

### Phase 2 tasks
| Task | Status | Evidence |
|---|---|---|
| `pnpm tokens`: exports to css-tailwind and DTCG; a parser-generated `theme.generated.css` (dark swap, `type-*` with `font-stretch` and `tnum`/`lnum`, font re-pointing, focus ring) | met | `scripts/tokens/*`; `theme.generated.css`; the G11 check above |
| Supplement (clamps, motion, breakpoints, container sizes, skip-link layer, strokes, scroll margin) and reset | met, with one defect | All values equal DESIGN.md (table above). The dash's namespace is I2. Reset: `theme-reset.css:9-11` (Errata) |
| Enforcement: token-only lint (unknown classes, arbitrary values, `dark:`); `tokens.test.ts` | met for the named categories | See I1 for what still passes. `tokens.test.ts`: 25 tests, green in the gate log |
| `pnpm fonts`: latin, vietnamese and arrows; `wdth` 87.5–125, `wght` 400–800; static instances; manifest; `fonts:check`; `font-coverage.test.ts` | met | fontTools read. `pnpm fonts:check` → `the 12 font files match a fresh generation`. See M1 and M2 |
| Phase 1 minors M1 and M2, folded in | met | `eslint.config.mjs` has the client-leaf regex patterns and the `no-restricted-syntax` selectors. Their probes in `lint-rules.test.ts` pass (gate log). Read, not re-probed |

### Acceptance criteria (plan, Phase 2)
| Criterion | Status | Evidence or reason |
|---|---|---|
| `pnpm design:lint`: 0 errors and 0 warnings | met | Gate log: `0 errors, 0 warnings (0 allowlisted), 1 infos` |
| `tokens:check` exits 0, and exits 1 after an unregenerated DESIGN.md edit | met | My run: match. Scratch copy: 3 × `stale`, `Command failed with exit code 1`. It stays checked by `tokens-check.test.ts:28` |
| `tokens.test.ts` passes, including the supplement-versus-DESIGN.md comparison | met | Gate log: `Tests 186 passed (186)`. Values re-checked by hand. The scan's limits are in M4 |
| woff2 ≤ 100 KB, size recorded | met (recorded; budgets deferred) | 94,168 B |
| `font-coverage.test.ts` passes on `info.md`, including "Hồ Trọng Đại" and "→" | met | Gate log. fontTools confirms the woff2 and all 8 instances |
| Lint rejects `bg-red-500` and `p-[13px]` | met | Probe: `no-unknown-classes` and `no-restricted-classes` |
| The shell renders `page` tokens in both themes | met | `tokens.spec.ts` in 3 projects × 2 themes (gate log); screenshots |
| axe finds 0 violations | moved to Phase 4 (ruling) | The pinned test expects exactly `document-title` and `page-has-heading-one`. It passes 6/6 in the gate log |
| QA: G11 | met | See the focus-check table |
| QA: P2-1 | met locally | <ul><li>The token files are unchanged since `765a496`.</li><li>`tokens:check` has been in `pnpm check` since `765a496`, and in CI since `7ebe994`.</li><li>CI hasn't run yet (O2).</li></ul> |

### Missing, extra, misunderstood
- **Missing:** nothing beyond the ruled axe move and the owner's deferrals.
- **Extra:** all of these are ruled (deviations 1–9) and cheap:
  - the `--design` flags
  - the extra lint restrictions
  - the `@source not` exclusions
  - the `sfnt.ts` verifier, used instead of `harfbuzzjs`
- **Misunderstood:** contrib-engineering §4.3 expects that "anything that isn't a token is unknown, thanks to the reset".
  - Under Tailwind 4 this isn't true for bare-value and static utilities.
  - The implementation's comments, and the report (lines 34 and 49), repeat the assumption (I1).

## Findings

### Critical
None.

### Important

**I1 · Token-only lint lets bare-value and static utilities through**
- **Where:**
  - `eslint.config.mjs:35-84`, the restriction list
  - the comments at `eslint.config.mjs:184-186` and `src/styles/theme-reset.css:4-7`
- **Issue:**
  - The reset removes every class that depends on the theme. But Tailwind 4 utilities that take bare values, or are static, don't need the theme.
  - An in-memory probe through the repo config accepted every one of these:
    - radius: `rounded-full`
    - borders: `border-4`, `border-8`
    - outline: `outline`, `outline-4`, `outline-offset-8`, `outline-none`, `outline-hidden`
    - rings: `ring-2`, `inset-ring-2`
    - opacity: `opacity-50`
    - transforms: `scale-105`, `hover:scale-105`, `rotate-3`
    - filters: `grayscale`, `brightness-110`
    - underline: `underline-offset-4`, `decoration-4`
    - type: `italic`, `uppercase`, `leading-none`
    - viewport units: `h-screen`, `w-screen`
    - transitions: bare `transition`
  - The comments claim the opposite: "so only DESIGN.md tokens exist as classes", and "any class that isn't a DESIGN.md token is unknown".
- **Why it matters:**
  - Several of these break DESIGN.md locks and bans directly:
    - radius 6 on every rectangle (lock 3)
    - no shadows
    - nothing lifts or scales
    - no rotation or filter on the avatar
    - no italics or all caps
    - `min-h-dvh`, never `h-screen` (Global Constraints)
    - the focus ring: `outline-*` utilities override it from the utilities layer (G9; the checklist always flags `outline-none`)
  - Lint is the only mechanical guard on class names. QA's G5 grep looks for hex, px and ms values, and `rounded-full` or `border-4` contain none of them. The comments invite later reviewers to trust lint.
  - The plan's three named categories are met. The gap is against the phase goal ("token-only", "the sync checks bite"), not its letter.
- **Fix direction:**
  - Add these entries to `TOKEN_CLASS_RESTRICTIONS`.
    - They keep every DESIGN.md value usable: `border` (1 px), `border-2` (the pressed toggle), `rounded-none`, `opacity-0` and `opacity-100` (the fade), and `decoration-1` and `decoration-2`.
    - An in-memory probe (scratchpad `qa-p2-lintfix.mjs`) flagged 27 of the 27 classes above. It flagged none of 36 legitimate classes, including the implementer's accepted token set.
    ```js
    `${VARIANTS}rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-full${END}`,
    `${VARIANTS}(?:border|divide)(?:-[xytrblse])?-(?:[3-9]|\\d{2,})${END}`,
    `${VARIANTS}outline(?:-(?:none|hidden|\\d+)|-offset-\\d+)?${END}`,
    `${VARIANTS}(?:inset-)?ring(?:-\\d+)?${END}`,
    `${VARIANTS}opacity-(?!(?:0|100)${END})\\d+${END}`,
    `${VARIANTS}-?(?:scale|rotate|skew)(?:-[xyz])?-`,
    `${VARIANTS}(?:backdrop-)?(?:grayscale|sepia|invert|brightness|contrast|saturate|hue-rotate)(?:-|${END})`,
    `${VARIANTS}(?:italic|uppercase|capitalize|leading-(?:none|\\d+)|underline-offset-\\d+|decoration-(?:[03-9]|\\d{2,}))${END}`,
    `${VARIANTS}(?:min-|max-)?[hw]-screen${END}`,
    `${VARIANTS}transition${END}`,
    ```
  - Add each rejected class to `lint-rules.test.ts`, and correct the two comments.
  - When the 1.5 px toggle border and the 0.2em underline offset land, they will need supplement tokens, because arbitrary values are banned.

**I2 · The stroke tokens create three lint-approved classes that emit invalid CSS, and the dash can't be applied**
- **Where:**
  - `src/styles/theme.supplement.css:51-53`
  - the header claim at `:5-7`
  - `tests/unit/tokens.test.ts:217,239`
- **Issue:**
  - Tailwind 4 reads every `--stroke-*` key as a stroke colour. An in-memory compile of `globals.css` gives:
    ```css
    .stroke-dash        { stroke: var(--stroke-dash); }        /* stroke: 6 4 */
    .stroke-width-ink   { stroke: var(--stroke-width-ink); }   /* stroke: 1.5px */
    .stroke-width-proof { stroke: var(--stroke-width-proof); } /* stroke: 2px */
    ```
  - These are invalid paints, and lint accepts all three classes (probe: ACCEPTED).
  - `stroke-ink` and `stroke-proof` compile correctly to `stroke-width`.
  - Nothing can apply `stroke-dasharray` from the token:
    - Tailwind has no dasharray utility.
    - Lint bans `[stroke-dasharray:…]` and `stroke-(--stroke-dash)`.
- **Why it matters:**
  - Phase 5 draws construction lines and replaced nodes dashed `6 4` (DESIGN.md Drawing grammar :267 and :270). P2-24 checks the computed dasharray in both themes.
  - Right now the only classes the names suggest pass lint and break the element's stroke: the declaration wins the cascade, then computes to `unset`. `stroke-width-ink` is a natural thing to type.
  - The header comment promises that every supplement value is a class.
- **Fix direction:**
  - Move the dash to a name that no utility reads (check with a compile; for example `--dash-construction`). Give it a class path with a supplement `@utility` that sets `stroke-dasharray` (for example `dash-construction`).
  - Keep `--stroke-width-*`, because `stroke-ink` needs it, and ban the traps in lint: `` `${VARIANTS}stroke-(?:width-|dash)` ``.
  - Extend `tokens.test.ts`: its "declares nothing beyond" check reads only `@theme` blocks. The utility's value should be pinned to DESIGN.md's "dashed 6 4", with a probe or compile check that it emits `stroke-dasharray: 6 4`.
  - Update the header comment.

### Minor

**M1 · The served woff2 drops the OFL licence fields**
- **Where:** `scripts/fonts/pipeline.ts:164-168`, the variable-font `subsetFont` call.
- **Issue:**
  - HarfBuzz keeps name IDs 0–6 by default. The woff2 keeps the copyright (ID 0), but loses the licence description and URL (IDs 13 and 14).
  - `OFL.txt` isn't served alongside it.
  - Google's own served Archivo subset keeps ID 14 (`http://scripts.sil.org/OFL`).
- **Why it matters:**
  - The woff2 is the one copy the site distributes.
  - OFL 1.1 condition 2 asks every copy to carry the licence, either in the font's metadata or next to it.
- **Fix direction:**
  - Pass `preserveNameIds: [13, 14]`. subset-font 2.9.0 supports it, at a cost of about 0.2 KB.
  - Assert the fields in `font-coverage.test.ts`, then run `pnpm fonts`.
  - Do this before any deploy at the latest.

**M2 · Every static instance is named "Archivo SemiBold"**
- **Where:** `scripts/fonts/pipeline.ts:224-228`.
- **Issue:**
  - All 8 TTFs keep the default instance's names: ID 1 and ID 4 "Archivo SemiBold", ID 2 "Regular", ID 6 "Archivo-SemiBold".
  - Their `usWeightClass` (400–800), `usWidthClass` (4–7) and advances are correct.
- **Why it matters:**
  - Any consumer that picks faces by name gets the wrong one.
  - The résumé PDF (Phase 10) will list every embedded face as SemiBold.
- **Fix direction:** either:
  - write per-instance names in the pipeline, or
  - record in the manifest, and in the Phase 10 and 11 briefs, that consumers register weight and width explicitly (Satori `fonts[].weight`, résumé `@font-face` descriptors).

**M3 · Nothing pins the generated focus ring**
- **Where:**
  - `scripts/tokens/theme.ts:222-257`
  - `tests/unit/tokens.test.ts`, which has no focus-ring case
  - `tests/unit/tokens-check.test.ts:50-68`, which covers two of the four refusals
- **Issue:**
  - `tokens:check` proves that the committed file equals the generator's output. It doesn't prove that the output equals DESIGN.md's `focus-ring`.
  - The dark swap and `type-*` have tests; the ring doesn't.
  - The refusals for an unknown axis or feature, and for a ring that isn't `colors.focus`, are untested.
- **Why it matters:** G9 rests on this rule, and the first runtime check comes only in Phase 4, when a focusable element exists.
- **Fix direction:**
  - In `tokens.test.ts`, assert that the `:focus-visible` block equals `outline: <size> solid var(--color-focus); outline-offset: <padding>`, read from `components.focus-ring`.
  - Add the two missing refusal cases to `tokens-check.test.ts`.

**M4 · The literal scan covers less than G5**
- **Where:** `tests/support/token-literals.ts:18-38`, `tests/unit/tokens.test.ts:221-244`, `tests/support/design-md.ts:195`.
- **Issue:**
  - The scan finds colours, durations and numeric z-index, which is exactly contrib-engineering §4.3's list.
  - G5 also names sizes, radii and easings, "including SVG attributes and inline styles". A raw `stroke-width="2"`, `border-radius: 4px` or `cubic-bezier(…)` in a hand-written file passes.
  - `theme.supplement.css` is excluded from the scan, and "declares nothing beyond" parses only its `@theme` blocks. So a raw value added to its `@layer base` block (`:59-63`) escapes both checks.
- **Why it matters:** Phase 5's SVGs are the likeliest place for raw widths and dashes.
- **Fix direction:**
  - Add easing functions and raw length literals to the scan: in CSS declarations and SVG presentation attributes, outside the token files and `var()`.
  - Require `var(--…)` values in the supplement's rules outside `@theme`.

**M5 · Zero-valued spacing classes don't exist**
- **Where:** `src/styles/theme-reset.css:9-11`.
- **Issue:**
  - The full reset removes `--spacing`, so `min-w-0`, `m-0`, `p-0`, `top-0`, `gap-0` and `translate-x-0` are unknown classes (probe).
  - Grids are unaffected, because `grid-cols-*` still uses `minmax(0, 1fr)`.
- **Why it matters:**
  - `min-w-0` on flex children is the checklist's standard guard for long strings (G4 at 320 px).
  - Without a zero, a later phase will reach for a banned arbitrary value or an unruled token.
- **Fix direction:** rule a structural zero now, either:
  - as a supplement token (for example `--spacing-0: 0px`) with its line in `tokens.test.ts`, or
  - as an approved alternative recorded in `frontend-build`.

## UI audit (limited: tokens in both themes, the focus ring, no overflow; existing evidence only)
**Verdict: PASS.** No findings.

| Check | Result | Evidence |
|---|---|---|
| Tokens, light | ✓ | `shell-{375,768,1440}-light.png`: every pixel is `rgb(244, 244, 248)`, which is `surface` #F4F4F8 (PNG decode) |
| Tokens, dark | ✓ | `shell-{375,768,1440}-dark.png`: every pixel is `rgb(21, 19, 28)`, which is `surface-dark` #15131C |
| Tokens at runtime | ✓ | <ul><li>`tokens.spec.ts` runs "the shell paints the page tokens" and "a stored theme choice (data-theme) wins" in chromium-desktop, chromium-mobile and webkit-mobile, light and dark: 12/12 (gate log).</li><li>Prerendered HTML: `<body class="bg-surface type-body text-primary">`, and one woff2 preload.</li></ul> |
| Focus ring | ✓ (static evidence) | <ul><li>Built CSS `.next/static/chunks/252q5tp3yc-hk.css` (BUILD_ID `9Xm0Z_qAWxOL6UlFLdgW_`, 04:42:38): `:focus-visible{outline:2px solid var(--color-focus);outline-offset:2px}`.</li><li>It comes after preflight's `:-moz-focusring` in the same layer, so it wins in Firefox.</li><li>`--color-focus` is `#5b3fd0` in light and `#b7a6ff` in both dark blocks.</li><li>Contrast, recomputed: 6.24 and 6.85 in light, 8.68 and 7.80 in dark.</li></ul> |
| Overflow | ✓ | The smoke spec "no horizontal overflow at the device width or 320 px" passes in 3 projects × 2 themes: 6/6 (gate log) |
| Checklist (`layout.tsx`, `globals.css`) | ✓ pass | <ul><li>Present: `lang`, `color-scheme` per theme, a global `:focus-visible` style, `display: swap` and one preload. No console errors.</li><li>The title, `theme-color` and the no-flash script belong to Phase 4 (P2-2, P2-3; ruled).</li></ul> |

**Skipped, with reasons:**
- **The 320, 1024 and 1920 px captures, and reduced-motion captures:** they aren't in the existing evidence, and the brief limits the audit to it. The shell is a blank page, and the smoke spec covers overflow at 320 px.
- **axe:** ruled to Phase 4. The pinned test shows exactly the two content-absence rules, in both themes. `incomplete` items weren't inspected, since no fresh run was allowed.
- **The keyboard pass and focus captures:** the shell has no focusable element yet.
- **Generic-pattern checks:** nothing renders text yet.

## Declined to judge
- **axe 0 on the shell:** moved to Phase 4 by ruling. The pinned test must flip to `[]` there.
- **The CI privacy-scan step** (`ci.yml`): covered by the Owner deferral. The ruling resolves it with the owner before any push.
- **Budgets, Lighthouse, SEO and the privacy scan:** suspended by the owner. The woff2 size (94,168 B) and the CSS size (5,470 B) are recorded, not judged.
- **Stale commit IDs in the engineering report:** mapped in `docs/progress.md`.
- **Tokens that later phases will add:** none of these is in Phase 2's list. Each must arrive as a supplement token with its test line, since arbitrary values are banned.
  - the 68ch and 60ch measures
  - the 360, 648 and 1144 px caps
  - the 320 px avatar
  - the 56 and 64 px header heights
  - the 20 px icon
  - the 1.5 px toggle border
  - the 0.2em underline offset
- **Fallback metrics:** next/font derives the Arial overrides from the variable font's default instance (weight 600). Weight-400 text may therefore change width on swap. This is Known Gaps 4, and P2-18 measures it (Phases 4–5).
- **The unused preload on the empty shell:** the text arrives in Phase 4.
- **Firefox doesn't run `tokens.spec.ts`:** this matches the Firefox ruling (layout and keyboard specs only).
- **Taste:** that is `design-lead`'s call.

## Checks run
- **Read in full at `2de7e17`:** every file in the diff, except the binary fonts. For the lockfile, the diff for the 6 new packages was read.
- **Git:**
  - `git diff --stat ebe3877 2de7e17`
  - authors: every commit is `tidi.dev1321@gmail.com`
  - `git diff ebe3877 2de7e17 -- DESIGN.md`: 0 lines
  - `git diff 765a496 2de7e17 -- src/styles/`: empty
  - every read used `git show 2de7e17:…`. During the checks `git status` showed only the main session's `docs/progress.md`. Phase 3 edits under `tests/` appeared at the end; none touches a file in this diff
- **G11:** `npx --no-install @google/design.md export --format css-tailwind DESIGN.md`, compared with `cmp` against `git show 2de7e17:src/styles/tokens.generated.css`: identical. The same holds for `--format dtcg`.
- **Freshness checks:**
  - `pnpm tokens:check` → `the 3 token files match a fresh generation from …/DESIGN.md`
  - `pnpm tokens:check --design <scratch copy with focus-dark set to #CEC3FF>` → 3 × `stale`, `ELIFECYCLE Command failed with exit code 1`. The temp directory was removed.
  - `pnpm fonts:check` → `the 12 font files match a fresh generation`
- **DESIGN.md prose:** parsed with `tests/support/design-md.ts` (a tsx scratch script). The results are the values in the supplement table.
- **ESLint:** the Node API's `lintText` with the repo config, and type-aware parsing switched off for the virtual `__lint-probe__` paths only.
  - 108 class probes (a few classes repeat across runs).
  - A second probe tested the candidate fix: 27/27 flagged, 0/36 false positives.
  - Scratch scripts: `qa-p2-lintprobe.mjs` and `qa-p2-lintfix.mjs`.
- **Tailwind:** `@tailwindcss/node` `compile()` of `globals.css`, in memory: the classes listed under the supplement table, plus `stroke-dash`, `stroke-width-ink` and `stroke-width-proof`.
- **Build output** (the main session's, read only): the CSS chunk, and `.next/server/app/index.html` (the font-variable class, the body's token classes, one woff2 preload).
- **Fonts:** fontTools 4.66.0 in the scratch venv, with `brotli` added there.
  - source versus woff2: features, scripts, `fvar` and cmap
  - each instance's `OS/2`, `hmtx` and names
  - name IDs
  - the Google-served Archivo vietnamese woff2, for comparison
- **Provenance:**
  - `git hash-object` of the TTF (`cc64253d…`) and of `OFL.txt` (`8597481e…`) equal the blobs in `gh api repos/google/fonts/git/trees/95f4904…:ofl/archivo`.
  - The SHA-256 equals the pin.
  - `OFL.txt` names no Reserved Font Name.
- **`info.md`:** NFC; 0 combining marks; 0 U+2044; the code points of the name.
- **Contrast:** the WCAG 2.x formula, in a node one-liner.
- **Screenshots:** PNG decode, counting the distinct colours in each capture.
- **Dependencies:**
  - `subset-font` 2.9.0, BSD-3-Clause, as in plan §1.1
  - transitive: harfbuzzjs 1.6.2 (MIT), fontverter 2.0.0 (BSD-3-Clause), wawoff2 2.0.1 (MIT), woff2sfnt-sfnt2woff 1.0.0 (MIT), pako 1.0.11 (MIT AND Zlib)
- **Gate:** taken from the main session's log, not re-run.
  - `pnpm check` exits 0: `Tests 186 passed (186)`.
  - `pnpm build`: `○ /` and `○ /_not-found`.
  - `pnpm test:e2e`: `73 passed (14.6s)`, `GATE_EXIT=0`.
  - No warnings in any of the output.
