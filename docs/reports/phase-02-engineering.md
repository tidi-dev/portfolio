# Phase 2 · Tokens and fonts: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer`
- **Brief:** Phase 2 of `docs/plan/implementation-plan.md` (with the Owner deferral and Errata), contrib-engineering §1.5 and §4, contrib-verification G11 and P2-1. Mid-phase additions from the main session: two owner decisions (privacy scan off; git identity) and the Phase 1 review minors M1 and M2.
- **Status: DONE_WITH_CONCERNS.** The token pipeline, the font pipeline, token-only lint and the shell are in place, and the local gate is green, run fresh. Two items need the main session:
  1. **axe 0 on the shell can't pass in Phase 2.** The empty shell has exactly two axe violations, `document-title` and `page-has-heading-one`. Both need the title and the h1, which a ruling puts in Phase 4. A test pins exactly those two; the criterion is marked ❌ below.
  2. **The CI privacy-scan step is still there.** The permission system blocked the edit that removed it (see Owner decisions).

## Owner decisions relayed mid-phase

1. **Privacy scan off.** I left `pnpm privacy:scan` out of my gate. `scripts/privacy/` and its 42 unit tests are unchanged.
   - **Blocked:** removing the step from `.github/workflows/ci.yml`. The permission system refused it as "CI Bypass": a message from an agent doesn't count as the owner's approval. I reverted my edit, so the step is still in `ci.yml`. The owner, or the main session with the owner's approval, needs to make that change.
   - **Scanned once anyway**, for information only, because CI will still run the scan: `pnpm privacy:scan` → `0 findings` (src/ 11 text files, .next/ 142 text files). Phase 2's files don't trip it.
2. **Git identity.** Every Phase 2 commit is `dai.ho <tidi.dev1321@gmail.com>`, from the repo-local config. I changed no git config.

## Phase 1 review minors (folded in, `fix(lint):` commits)

- **M1** (`eaace46`): client leaves now reject content and SEO imports in relative form as well as the alias form. The two bans are regexes, `(^@/|/)content(/|$)` and `(^@/|/)lib/seo(/|$)`. Every bare Node built-in (`fs`, `fs/promises`, `path`) is banned alongside `node:*`.
- **M2** (`decdf43`): in `src/app` and `src/components`, `no-restricted-syntax` bans string and template literals in `alt`, `title`, `placeholder`, `aria-label`, `aria-description`, `aria-roledescription`, `aria-valuetext` and `aria-placeholder`. `alt=""` and `className` stay allowed.
- **Probes:** `tests/unit/lint-rules.test.ts` lints in-memory files through the repo's real `eslint.config.mjs`, with type-aware parsing off for probe paths only. The first 13 M1/M2 cases failed before the fixes. All 29 M1/M2 cases pass after them.

## What was built

**Token pipeline** (contrib-engineering §4)
- **`pnpm tokens`** writes three files to `src/styles/`:
  - `tokens.generated.css` and `.json`: the stdout of the pinned CLI, `design.md export --format css-tailwind` and `--format dtcg`, byte for byte (G11).
  - `theme.generated.css`, read with the package's parser (`@google/design.md/linter`):
    - font re-pointing to `--font-archivo`
    - one `type-*` utility per typography token: `font-stretch` from `wdth`, `tabular-nums lining-nums` from `tnum`/`lnum`. Roles without tracking or figures reset them, so nothing inherits.
    - the dark swap, under `:root[data-theme="dark"]` and under `prefers-color-scheme: dark` for `:root:not([data-theme="light"])`
    - the `:focus-visible` ring from `components.focus-ring`
  - The generator refuses a colour without a `-dark` twin, a second font family, an unknown axis or feature, and a focus ring that isn't `colors.focus`.
- **`theme-reset.css`**: `@theme { --*: initial; }`. Only DESIGN.md tokens exist as classes.
- **`theme.supplement.css`**, hand-mapped from the prose:
  - the 8 fluid clamps and the section and sheet rhythm
  - the 6 durations and 2 easings
  - `md` 48rem and `lg` 64rem
  - `--container-bench` 480px and `--container-drawing` **880px** (Errata)
  - `z-skip-link` 100
  - strokes: ink 1.5px, proof 2px, dash `6 4`
  - `scroll-mt-anchor` 24px, as a base rule on `:where([id])`
- **`globals.css`** imports, in the §4.1 order. `src/styles/` and `src/assets/` are excluded from Tailwind's source scan.
- **`pnpm tokens:check`** regenerates into a temp directory and byte-compares. `--design <path>` checks against another file.
- **`pnpm design:lint`**: the same `lint` the CLI runs, plus the warning policy. It fails on errors, and on warnings not in an allowlist (empty; an entry needs a ruling).
- **`pnpm check`** is now: `design:lint`, `tokens:check`, `fonts:check`, `lint`, `typecheck`, `test`.

**Token-only lint** (§4.3), with names read from the DTCG export
- **Unknown classes:** the reset makes every non-token class unknown to `no-unknown-classes`.
- **`no-restricted-classes`** rejects:
  - arbitrary values, properties and variants, `[…]` and `(…)`
  - `dark:` and `*-dark` classes
  - `font-`, `text-`, `leading-` and `tracking-<typography token>`, and `font-stretch-*`
  - bare `z-`, `duration-`, `delay-` and `stroke-` numbers
  - `ease-linear`
  - `transition-all`
  - colour opacity modifiers (tints)
  - gradients
- **Probes:** 29 cases in `lint-rules.test.ts`, including a full accepted token set.

**Font pipeline** (§1.5)
- **Source:** `Archivo[wdth,wght].ttf` (658,596 B, SHA-256 `0e094a7d…b05053`) and `OFL.txt`, pinned from google/fonts at `95f4904fc8bcf26d3420fe315560c96417c6dec7`. Git blob hashes match the upstream tree. The build refuses any other file.
- **`pnpm fonts`** (subset-font 2.9.0, HarfBuzz WASM) writes:
  - `src/assets/fonts/archivo.woff2`:
    - Google's latin and vietnamese `unicode-range`s plus ← → ↔, 344 code points
    - axes `wght` 400–800 and `wdth` 87.5–125, derived from the typography tokens
  - 8 static TTF instances in `src/assets/og/`, one per weight/width pair of the tokens, for Satori and the résumé
  - `OFL.txt` beside each output
  - `archivo.manifest.json`: provenance, axes, features, sizes and hashes, and the code points, read back from the woff2 itself
- **Refusals:** the pipeline fails if the woff2 misses a requested code point the source has, if its axes differ, if an instance isn't static, or if the font lacks a required feature.
- **`pnpm fonts:check`** regenerates and byte-compares. The output is deterministic: identical SHA-256 across runs.

**Shell**
- `next/font/local`:
  - `--font-archivo`, `display: swap`, `preload: true`
  - `weight: "400 800"`, and a `font-stretch: 87.5% 125%` declaration
  - fallback `system-ui, sans-serif` with Arial metric adjustment
- The body wears `page`: `bg-surface text-primary type-body`. `main` stays empty.

## Evidence

### Gate (fresh: `node_modules/`, `.next/`, reports and tsbuildinfo deleted first; logs in the session scratchpad `gate/`)

| Command | Result line |
|---|---|
| `pnpm install --frozen-lockfile` | `Lockfile is up to date` · `Packages: +742` · `Done in 3.4s using pnpm v10.34.5` · **0 warnings** |
| `pnpm check` | exit 0 in 16.9 s. It runs the next five rows |
| ↳ `pnpm design:lint` | `DESIGN.md passes: 0 errors, 0 warnings (0 allowlisted), 1 infos` |
| ↳ `pnpm tokens:check` | `the 3 token files match a fresh generation` |
| ↳ `pnpm fonts:check` | `the 12 font files match a fresh generation` |
| ↳ `pnpm lint` | ESLint: no output (0 problems) · `All matched files use Prettier code style!` |
| ↳ `pnpm typecheck` · `pnpm test` | `✓ Types generated successfully`, tsc exit 0 · `Test Files 9 passed (9)` · `Tests 186 passed (186)` |
| `pnpm build` | `✓ Compiled successfully` · `○ /` · `○ /_not-found` · `○ (Static) prerendered as static content`, no warnings |
| `pnpm test:e2e` | **`73 passed (15.1s)`**: chromium-desktop, chromium-mobile and webkit-mobile 21 each; firefox-desktop 10. The 4 ✘ marks are the harness's expected-failure self-test (`test.fail()`), as in Phase 1 |
| `pnpm privacy:scan` (informational, not gated) | `0 findings` |

**Unit tests by file:** architecture 5, design-lint 6 (new), font-coverage 19 (new), lhci-config 6, lint-rules 58 (new), privacy-scan 42, tokens-check 4 (new), tokens 25 (new), traceability 21.

### Acceptance criteria (plan, Phase 2)

- ✅ **Design lint:** `pnpm design:lint` → `0 errors, 0 warnings (0 allowlisted), 1 infos`.
  - **Policy shown on a scratch copy with an unused colour:** the plain CLI reports `"warnings": 1` and exits 0; `pnpm design:lint <copy>` → `warning [orphaned-tokens] colors.spare …` · `fails: 0 errors, 1 warnings` · exit 1.
- ✅ **Token sync:**
  - `pnpm tokens:check` → `the 3 token files match a fresh generation` (exit 0).
  - **After an unregenerated DESIGN.md edit:** a scratch copy with `accent-dark` `#B7A6FF` changed to `#B8A6FF`. `pnpm tokens:check --design <copy>` reports `stale src/styles/tokens.generated.css`, `stale …tokens.generated.json` and `stale …theme.generated.css`, then `the generated tokens are out of date: run pnpm tokens`, exit 1. Afterwards `git diff --quiet HEAD -- DESIGN.md` passes: DESIGN.md was never touched (Deviation 4).
  - **Permanent regression:** `tokens-check.test.ts`, "reports every affected file as stale after an unregenerated DESIGN.md edit".
- ✅ **`tokens.test.ts`:** 25 tests pass. Every supplement value is compared with DESIGN.md's own wording (Typography table, Layout rhythm, Motion tokens line, breakpoints, container thresholds, layer, strokes, anchor margin), and nothing else may be declared.
  - Also covered: dark twins for colours and components, the `type-*` utilities, and a scan of hand-written CSS, TS, TSX and SVG for raw colours, durations and z-index.
  - **The tests can fail**, checked by mutation, each reverted:
    - a clamp → 1 fail
    - a duration → 1 fail
    - an extra declaration → 1 fail
    - `--container-drawing: 896px` → 1 fail
    - `tnum` dropped from `type-label` → 1 fail
    - a dark hex → 1 fail
    - `#fff` and `150ms` in `globals.css` → 1 fail
- ✅ **Fonts:**
  - **woff2 = 94,168 B** (91.96 KiB; ≤ 100 KB; recorded, not gated).
  - `font-coverage.test.ts` passes (19 tests):
    - every character of info.md's content sections
    - "Hồ Trọng Đại", ← → ↔, DESIGN.md's 102 Vietnamese code points
    - ‘ ’ “ ” … and the no-break space
    - `src/content/` strings (none yet)
    - the woff2's axes equal DESIGN.md's stated `wdth` 87.5–125 and `wght` 400–800
    - `tnum` kept
    - 8 static instances
    - the `next/font` literals pinned to the manifest
  - **Mutation, reverted:** dropping U+2192 from the subset fails 3 tests with `U+2192 →`.
  - **`fonts:check`:** it exits 1 after an unregenerated config edit (`stale src/assets/fonts/archivo.woff2` and 9 more), then exits 0 once restored.
- ✅ **Lint:** a temporary `src/components/lint-demo/lint-demo.tsx` with `className="bg-red-500 p-[13px]"`. `pnpm lint` reports:
  - `2:26 error Unknown class detected: bg-red-500 better-tailwindcss/no-unknown-classes`
  - `2:37 error Arbitrary values, properties and variants bypass DESIGN.md tokens: use a token class better-tailwindcss/no-restricted-classes`
  - `✖ 2 problems (2 errors, 0 warnings)`, exit 1

  After removing the file, `pnpm lint` exits 0.
- ✅ **Shell renders `page` tokens in both themes:** `tests/e2e/tokens.spec.ts` on chromium desktop and mobile and webkit mobile:
  - body background `surface` / `surface-dark` and colour `primary` / `primary-dark`, as rgb from the DTCG JSON
  - `color-scheme` light / dark
  - weight 400, stretch 100%, letter-spacing normal
  - font size equal to the `--text-body` clamp at the viewport width, line height 1.6×
  - family `archivo, archivo Fallback, system-ui, sans-serif`
  - a stored `data-theme` wins over the system theme, in both directions
  - one preloaded, same-origin woff2 that loads with `display: swap`, weight `400 800`, stretch `87.5% 125%`
- ❌ **axe finds 0 violations:** axe finds exactly `document-title` and `page-has-heading-one`, in both themes. Both come from the missing `<title>` and h1, which the Phase 1 ruling puts in Phase 4. The test "axe: the shell's only violations are the two that need Phase 4 content" pins exactly those two: any other violation fails it, and it must become `[]` in Phase 4. **Ruling needed** (Question 1).
- ✅ **G11 / P2-1:**
  - `npx --no-install @google/design.md export --format css-tailwind DESIGN.md | cmp - src/styles/tokens.generated.css` → identical, cmp exit 0. The DTCG file is identical too.
  - `tokens:check` has run in `pnpm check` since the first token commit (`02ecbb3`), and in CI's checks job since `47e39ab`.
  - The hand-mapped layer holds only DESIGN.md values (`tokens.test.ts`, "declares nothing beyond the values checked here").

### Other observations
- **CSS:** 5,470 B raw, 1,990 B gzip. It contains the three utilities in use, preflight, the dark swap, the focus ring and the anchor margin.
- **Unused preload:** the empty shell has no text, so the preloaded woff2 goes unused. I probed for the resulting console warning: 0 console messages after 4.5 s, in chromium, webkit and firefox. The guard can't flake on it.
- **Static instances:** 55.6–56.0 KB each (447 KB in the repo). They are build inputs and are not served.

## Screenshots
Session scratchpad `phase-02-screens/`: `shell-{375,768,1440}-{light,dark}.png`. Each is a blank page, `rgb(244, 244, 248)` (Wafer) in light and `rgb(21, 19, 28)` (Darkroom) in dark, which is the whole shell until Phase 4.

## Commits (local only, no remote)

```text
3a5395e test(e2e): resolve the token files from the spec's location
432dda4 refactor(fonts): read any numeric feature tag from DESIGN.md
47e39ab ci: run design:lint, tokens:check and fonts:check in the checks job
b94f633 feat(shell): load Archivo with next/font/local and paint the page tokens
20c8c26 feat(fonts): subset Archivo, write static instances and the manifest
2967098 chore(fonts): pin the Archivo variable source and its OFL licence
b3597f8 feat(lint): enforce token-only Tailwind classes
02ecbb3 feat(tokens): generate tokens and the theme from DESIGN.md, with sync checks
a8655b1 feat(design): add the design:lint wrapper with a warning policy
decdf43 fix(lint): require content for alt, title and aria text attributes
eaace46 fix(lint): catch relative and bare built-in imports in client leaves
```

This report is committed on top. The main session's uncommitted edits to `CLAUDE.md`, the plan and `docs/progress.md`, and QA's `docs/reviews/`, were left alone.

## Files (51 changed, 4,085 insertions)

- **Config:**
  - `package.json`: `subset-font` 2.9.0 exact; scripts `design:lint`, `tokens`, `tokens:check`, `fonts`, `fonts:check`; `check`
  - `pnpm-lock.yaml`, `eslint.config.mjs`, `.prettierignore` (generated files), `.github/workflows/ci.yml`
- **Scripts:**
  - `scripts/design/{lint,policy}.ts`
  - `scripts/tokens/{build,check,export,outputs,theme}.ts`
  - `scripts/fonts/{build,check,config,pipeline,sfnt}.ts`, `subset-font.d.ts`
  - `scripts/lib/{freshness,repo}.ts`
- **Generated and committed:**
  - `src/styles/tokens.generated.{css,json}`, `theme.generated.css`
  - `src/assets/fonts/{archivo.woff2,archivo.manifest.json,OFL.txt}`
  - `src/assets/og/archivo-wght*-wdth*.ttf` (8), `OFL.txt`
- **Hand-written:** `src/styles/theme.supplement.css`, `theme-reset.css`; `src/app/globals.css`, `layout.tsx`.
- **Source:** `assets/fonts/source/Archivo[wdth,wght].ttf`, `OFL.txt`.
- **Tests:**
  - `tests/unit/{design-lint,font-coverage,lint-rules,tokens,tokens-check}.test.ts`
  - `tests/e2e/tokens.spec.ts`
  - support: `tests/support/{design-md,lint-probe,token-literals}.ts`
  - `tests/support/content-trace/corpus.ts`: split into `contentLines` (raw) and `corpusLines` (normalised); behaviour unchanged, 21/21 traceability tests pass

## Deviations (each with its reason)

1. **Supplement names follow Tailwind's theme namespaces:** `--transition-duration-<name>`, `--z-index-skip-link`, `--stroke-width-{ink,proof}`, `--scroll-margin-anchor`, and `--spacing-{section,sheet}`. §4.2 wrote `--duration-*` and `--z-skip-link`.
   - **Why:** Tailwind 4.3 reads `duration-<name>` from `--transition-duration-*` (verified in its source), `z-*` from `--z-index-*`, and so on. With §4.2's names, `duration-feedback` or `z-skip-link` wouldn't exist as classes, and later phases would need arbitrary values, which lint now bans.
   - The token values are unchanged.
2. **The reset clears the whole default theme (`--*: initial`)** rather than §4.2's list of namespaces. This is Tailwind's documented way, and a superset of the list: it also removes blurs, shadows, perspectives, `aspect-video` and the `--default-*` transition, which DESIGN.md bans or doesn't define. A later phase that needs a ratio adds a supplement token.
3. **Layout features:** the subset keeps the features browsers apply by default (CSS Fonts 4 §7.1), plus the features DESIGN.md's tokens switch on (`tnum`, `lnum`).
   - **Dropped:** `aalt`, `case`, fractions, ordinals, superiors, `onum`, `pnum` and `zero`. No DESIGN.md role uses them.
   - **Size:** 94,168 B, against 102,748 B with every feature. Code points are identical, and no DESIGN.md role renders differently.
   - **`lnum`:** HarfBuzz prunes it because Archivo's default figures are already lining; its lookups act only on the oldstyle glyphs `onum` brings in. The pipeline allows a pruned required feature only when a full-feature subset shows the font has it, and the manifest records it under `prunedNoEffect`.
   - **Fallback:** if the main session prefers every feature, one config line changes.
4. **`tokens:check` was shown against a scratch copy of DESIGN.md** through `--design`. DESIGN.md is hands-off, and QA was reading the repo concurrently, so I didn't edit it and revert. The same logic runs on every `pnpm test` (`tokens-check.test.ts`).
5. **The axe test pins the two content-absence violations** instead of asserting 0. It is stricter than no test and flags the fix in Phase 4, but it doesn't meet the criterion (❌ above).
6. **Lint restrictions beyond §4.3's list:** bare z, duration, delay and stroke numbers; `ease-linear`; `transition-all`; colour opacity modifiers; gradients. Each encodes an explicit rule: G5 (raw durations and z-index), CLAUDE.md → Motion (never `all`), DESIGN.md → Colors (no tints, no gradients).
7. **`@source not "../styles"` and `"../assets"` in `globals.css`.** Tailwind scanned the DTCG JSON's `"container"` key and emitted a stray `.container` utility.
8. **No `harfbuzzjs` dependency.** A small reader, `scripts/fonts/sfnt.ts` (cmap formats 4 and 12, fvar, GSUB/GPOS tags, WOFF2 via Node's brotli), verifies the outputs. It adds nothing beyond the plan's `subset-font`.
9. **Other details:**
   - `design:lint` accepts an optional path; `tokens` and `tokens:check` accept `--design`.
   - The focus ring is a generated global `:focus-visible` rule, not a class, so no control can miss it.
   - The bench and drawing caps (360, 648 and 1144 px) aren't tokens yet. The phases that render them add them.

## Questions for the main session

1. **axe 0 in Phase 2.** The empty shell can't reach 0 without the `<title>` and h1, which the ruling moved to Phase 4. I recommend moving Phase 2's "axe 0" to Phase 4, where the pinned test flips to `[]`. The alternative is wiring the approved `meta.title` early, which needs content modules (Phase 3). Even then `page-has-heading-one` stays until the hero.
2. **CI privacy step.** It is still in `ci.yml` because the permission system blocked its removal. The owner, or the main session with the owner's approval, should decide whether to remove it. As of now it passes (0 findings).
3. **Layout features (Deviation 3):** keep the trimmed set, or restore every feature at 102.7 KB? Optionally, `design-lead` records the feature policy in DESIGN.md → Typography.
4. **contrib-engineering §4.2 errata:** the supplement names in Deviation 1 differ from its wording; worth an erratum line.
5. **New commands for CLAUDE.md → Testing & Verification:**
   - `pnpm design:lint`: DESIGN.md lint with the warning policy
   - `pnpm tokens` / `pnpm tokens:check`: generate / verify the token files
   - `pnpm fonts` / `pnpm fonts:check`: generate / verify the font files
   - `pnpm check` now runs `design:lint`, `tokens:check`, `fonts:check`, `lint`, `typecheck`, `test`
   - The local gate is unchanged: install → `pnpm check` → `pnpm build` → `pnpm test:e2e`, with `privacy:scan` deferred.

## Ideas (not built)
- A unit test that recomputes DESIGN.md's 22-pair contrast table from the tokens. It would cover the text-only and line-only pairs that design lint skips (Known Gaps 3).
- Banning `outline-none` and `outline-hidden` in lint, so no control can hide the focus ring (G9).

## Process note
To stop my screenshot server, I once ran a broad `pkill -f next-server`, which would also have stopped any other Next server on this machine at that moment. If the main session had one running around 04:34, that is why it stopped. Later runs stop only the PIDs I start.
