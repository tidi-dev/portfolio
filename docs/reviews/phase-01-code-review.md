# Phase 1 · Foundation: code review

- **Date:** 2026-09-28
- **Reviewer:** `qa-reviewer` (`code-review` skill)
- **Scope:** `526b80a..4f8c11e` (full change: `git diff 4b825dc 4f8c11e`). Reviewed: `package.json`, lockfile, `.nvmrc`, `.gitignore`, `.prettierignore`, every config, `src/`, `tests/`, `scripts/`, `.github/`. `5d1a550` only tracks pre-existing docs (ruling D10).
- **Inputs:** implementation plan (Phase 1, Global Constraints, Owner deferral, Errata), contrib-verification P1-1 to P1-8 with §1.3 and §3.6, contrib-engineering §1, §2, §5.1 and §9, `CLAUDE.md`, `docs/progress.md` rulings (including `7fce36e`), the engineering report `docs/reports/phase-01-engineering.md`, and the main session's gate log `…/scratchpad/phase1-gate.log`.
- **Constraints:** read-only while Phase 2 is being built in the same tree. No build, e2e, install or unit run. Every check below is a read, a `git` query, a `gh api` read, or an in-memory ESLint probe that wrote nothing to the repo.
- **Mid-review update from the main session:** the owner turned the privacy scan off (deferred). Its precision and coverage are not reviewed here (see Declined to judge).

## Verdicts
- **Spec compliance: PASS.** Every Phase 1 task is delivered. Every acceptance criterion is met, except the lines the owner deferred.
- **Quality: PASS**, with 5 Minor findings. There are no Critical or Important findings.
- **Code review result: PASS WITH MINOR.** Log the minors. The UI-audit part of the Phase 1 review (axe and overflow on the skeleton) was outside this brief (see Declined to judge).

## Strengths
- **Privacy order is right.** `.gitignore` is the only file in the root commit. `DaiHo Resume.pdf` is in no commit or object, and the ignore rules hold at nested depths.
- **Pins and CI are exact.** All 26 dependencies are pinned exactly, match the plan, and are installed at those versions. All five action SHAs match their tags. CI runs with `contents: read` and `persist-credentials: false`.
- **The harness tests itself honestly.** The self-tests assert the guard's recorded problems and its `assertClean()` throw, not just pass or fail. In the main session's run, the teardown guard failed its test for the right reason in all 4 engines. Strict TypeScript and `strictTypeChecked` lint cover scripts and tests too.

## Spec compliance

### Phase 1 tasks
| Task | Status | Evidence |
|---|---|---|
| Toolchain (O3) | met | `.nvmrc` = `24`; `packageManager: pnpm@10.34.5`; `engines.node: 24.x`; gate log `node v24.21.0 pnpm 10.34.5` |
| Repository (O2): `git init`, `.gitignore` | met | Root commit `526b80a` holds only `.gitignore`. `git check-ignore -v` matched all 21 probed paths (list under Checks run) |
| Scaffold: exact pins, no template content, strict `tsconfig` with `types: ["node"]` | met | 26/26 exact. No `public/`, favicon, Geist or "Create Next App". Template-marker grep: 0 hits. `tsconfig.json:8-20` |
| Configs: ESLint (next, jsx-a11y strict, typescript-eslint, better-tailwindcss, `jsx-no-literals`, leaf import bans), Prettier, Vitest, Playwright, `lighthouserc` | met | `eslint.config.mjs:25-101`; `playwright.config.ts:32-60`; `lighthouserc*.json` (see M1 and M2 for two gaps in the lint guards) |
| CI workflow, actions pinned to SHAs | met | `.github/workflows/ci.yml`. `gh api` tag dereference: 5/5 SHAs equal their tags |
| Harness: guard fixture, two-theme fixture, budget spec, privacy scan, architecture test, content-trace scaffold | met | `tests/e2e/fixtures.ts`, `support/guard.ts`, `budget.spec.ts`, `scripts/privacy/*`, `tests/unit/architecture.test.ts`, `tests/support/content-trace/*` |
| Shell: `<html lang="en">`, `dynamic = 'error'`, empty `main` | met | `src/app/layout.tsx:6,12`; `src/app/page.tsx:3` |
| Measure and confirm: floor; `@google/design.md` licence | met | Floor 133,646 B (report; `budgets.ts:30`). `node_modules/@google/design.md/LICENSE` is Apache-2.0; the manifest has no licence field, as the plan says |
| Commands added to `CLAUDE.md` | met | Main session, `7fce36e` |

### Acceptance criteria (plan, Phase 1)
| Criterion | Status | Evidence or reason |
|---|---|---|
| Install: no unexplained peer warnings | met | Gate log: frozen install with no warnings. The report's cold-install claim was not re-run (it would need `pnpm install`) |
| Gate: `lint`, `typecheck`, `test` clean | met | Gate log: `All matched files use Prettier code style!` · `✓ Types generated successfully` · `Tests 74 passed (74)` |
| Gate: every route static | met | Gate log: `○ /` · `○ /_not-found` |
| Gate: smoke has 0 console errors | met | The guard is `auto: true` (`fixtures.ts:25-32`); smoke 12/12 across 3 projects × 2 themes |
| Gate: `pnpm lhci` runs its assertions | deferred by the owner | Not judged |
| Budget: floor printed; 120/15 ruling | deferred by the owner | Floor recorded; the ruling waits (Owner deferral) |
| Privacy: `DaiHo Resume.pdf` ignored and absent from `git ls-files` | met | `.gitignore:3:DaiHo Resume.pdf	DaiHo Resume.pdf`; no match in `git ls-files`, `git log --all` or `git rev-list --all --objects` |
| Privacy: the scan runs in CI and is clean | deferred (mid-review) | The CI step exists (`ci.yml:55-56`) and the gate log shows `0 findings`. Precision and coverage not judged |

### QA criteria (contrib-verification)
| ID | Status | Evidence or reason |
|---|---|---|
| P1-1 | met, lhci deferred | 6 of 7 commands pass in the gate log. `pnpm lhci` is deferred |
| P1-2 | met (plan shape) | 4 projects per the plan's ruling (`playwright.config.ts:32-60`). The 6 guard self-tests, 2 helper self-tests and the two-theme self-test are green in the gate log (52/52). The `smoke` project against `BASE_URL` belongs to Phase 13 (P9) and is not in the plan's Phase 1 list. See M3 and M4 |
| P1-3 | met (config); first run deferred | `median-run` on every assertion, 3 runs, filesystem upload, desktop `preset`, §6 levels (B1, B3, B4 and B6 warn; the rest error). Pinned by `lhci-config.test.ts` |
| P1-4 | met; ruling deferred | 133,646 B from the network log, and 135,543 B LHCI `transferSize` on a probe build (report) |
| P1-5 | met (Phase 1 form) | "the schema rejects an entry that lacks a source (P1-5)" uses the allowlist schema. The content-schema rejection is a Phase 3 acceptance line ("invalid content fails `next build` … shown"). The trace test passes on 0 modules (M5) |
| P1-6 | ignore part met; scan part deferred | See the privacy rows above |
| P1-7 | met | `.next/`, `out/`, `build/`, `test-results/`, `playwright-report/`, `.lighthouseci/`, `docs/reviews/**/screens/` (including zero depth), `docs/reviews/**/raw/`, `.env*` all match. Review reports are not ignored |
| P1-8 | met | Every package's version and licence match contrib-engineering §1.1. Five are deferred until the phase that uses them (Declined to judge) |

### Missing, extra, misunderstood
- **Missing:** nothing outside the owner's deferrals.
- **Extra, all justified and cheap:**
  - Firefox also runs `harness.spec.ts`. The Firefox ruling says layout and keyboard specs "only", but the guards those specs rely on are then proven in Gecko: 10 tests.
  - `pnpm.ignoredBuiltDependencies`: lint and build work without those install scripts.
  - `lhci-config.test.ts`.
- **Misunderstood:** nothing material. The two-theme "fixture" is an opt-in wrapper rather than something every UI spec gets automatically (M4).

## Findings

### Critical
None.

### Important
None.

### Minor

**M1 · The client-leaf import ban misses relative paths**
- **Where:** `eslint.config.mjs:67-85`.
- **Issue:** the ban matches alias specifiers only. An in-memory probe of `src/components/probe/leaf.client.tsx` flagged `@/content/identity`, `@/lib/seo/json-ld` and `node:fs`. It did not flag `../../content/contact`, `../../lib/seo/metadata` or a bare `fs`.
- **Why it matters:**
  - This rule is the mechanical guard that keeps content modules and SEO builders out of client chunks (contrib-engineering §5.1; Review Focus 1).
  - A relative import walks straight past it, and editors often insert one automatically.
- **Fix direction:**
  - Replace the two groups with regex patterns: `{ regex: "(^@/|/)content(/|$)" }` and `{ regex: "(^@/|/)lib/seo(/|$)" }`. A probe confirmed that these flag both the alias and the relative forms and leave `@/lib/format/contents` alone.
  - Or ban parent-relative imports under `src/`, so the alias is the only path.

**M2 · `jsx-no-literals` lets visible attribute text through**
- **Where:** `eslint.config.mjs:54-57`.
- **Issue:** the rule runs with `ignoreProps: true`. In the probe, JSX text was flagged, but `aria-label="Open the menu"`, `title="Menu"` and a literal `alt` were not. eslint-plugin-react 7.37.5 has no per-attribute option; `noAttributeStrings` would also fail `className`.
- **Why it matters:**
  - Accessible names, alt text and titles are visible strings, which §5.1 routes through `src/content/`.
  - The Phase 3 trace test reads content modules only. A hardcoded attribute is caught only if it also fails the rendered-content trace. If it happens to match `info.md`, it duplicates copy outside the one place it should live.
- **Fix direction:**
  - Keep `ignoreProps`.
  - In `src/app` and `src/components`, add `no-restricted-syntax` with the selector `JSXAttribute[name.name=/^(alt|title|placeholder|aria-label|aria-description)$/] > Literal`. A probe confirmed that it flags both attributes and leaves `className` alone.

**M3 · The teardown self-test can pass for the wrong reason**
- **Where:** `tests/e2e/harness.spec.ts:85-92`, `tests/e2e/support/guard.ts:15-16,37-38`, `tests/e2e/fixtures.ts:27`.
- **Issue:**
  - The test relies on `test.fail()`, which turns any failure into a pass: a timed-out `waitForEvent`, or an error in `setContent`. The permanent test doesn't show that the guard caused the failure.
  - The main session's run shows the right reason today. Four `test-results/*/error-context.md` files each read `Error: guard: 1 problem(s)` / `- console error: left unhandled`. But no assertion pins it.
  - The log-level `hydrat` branch (`guard.ts:37-38`) has no self-test.
  - `allowedErrorPaths` can't be set through the fixture.
- **Why it matters:** §1.3 and P1-2 ask each self-test to prove its guard can fail. This one would stay green if the guard's teardown wiring broke and something else failed first.
- **Fix direction:**
  - Test the teardown directly. Either unit-test the exported fixture body (after `provide`, it must reject with `guard: 1 problem(s)`), or run a fixture spec in a child Playwright process with the JSON reporter and assert the error text.
  - Add a self-test for a `console.log` that mentions hydration.
  - Expose `allowedErrorPaths` as a fixture option when the 404 probe needs it (Phase 11), or drop it until then.

**M4 · Nothing enforces the two-theme fixture**
- **Where:** `tests/e2e/fixtures.ts:39-46`.
- **Issue:** `forEachTheme` is an opt-in wrapper, and nothing fails if a UI spec skips it.
- **Why it matters:** §1.3 and Review Focus 2 rely on every UI spec running in both themes. A Phase 4+ spec that forgets the wrapper silently runs light only, which is Playwright's default scheme.
- **Fix direction:**
  - Add a unit check beside `architecture.test.ts`: every `tests/e2e/*.spec.ts` except `harness` and `budget` must register its tests through `forEachTheme`.
  - Or move `colorScheme` into theme-suffixed projects.

**M5 · The content-trace test can pass on no content**
- **Where:** `tests/support/content-trace/trace.ts:73` and `tests/unit/traceability.test.ts:213-226`.
- **Issue:** the test passes with 0 modules when `src/content/` is absent, and nothing asserts `modules > 0`.
- **Why it matters:** this is correct for Phase 1. After Phase 3, though, a moved or renamed content directory would turn the P1-5 guard green without checking anything.
- **Fix direction:** in Phase 3, when the first module lands, assert in the same test that the directory exists and `modules > 0`.

## Declined to judge
- **Privacy scan precision and coverage** (`scripts/privacy/*`, `tests/unit/privacy-scan.test.ts`, the CI step, the scan half of P1-6):
  - Deferred by the owner, relayed by the main session during this review. Not reviewed.
  - When it is re-enabled, it needs its own scoped review: the rules against the owner's formats and the known forbidden values.
- **Deferred items:** the byte budget (`budget.spec.ts`, `budgets.ts`, `network-log.ts`; floor 133.6 KB), `pnpm lhci` with its first run, and SEO.
  - CI's `pnpm lhci` step will fail until then. This is ruled: CI must be green before the first push.
  - The favicon 404 is ruled (Phase 11).
- **Skeleton `<title>` and axe:** `document-title` fails until Phase 4 (ruled: title and description moved there).
  - With Phase 11 suspended, Next's default `/_not-found` text also ships until the owner re-enables it. That is framework boilerplate, not template content from this diff.
- **UI audit on the skeleton** (axe and overflow): outside this brief, which forbids builds and e2e runs. Overflow at the device width and at 320 px is covered by the smoke spec in the gate log, in 3 projects × 2 themes.
- **Deferred dependencies:** `@tabler/icons-react`, `subset-font`, `unpdf`, `schema-dts` and `postcss` wait for their phases. This is YAGNI and matches "any addition needs a plan line". Check the plan pins when each lands.
- **CI lists `pnpm check`'s steps one by one** (`ci.yml:33-38`), as contrib-engineering §9.2 specifies, and it matches the local gate today. Phase 2 must add `design:lint`, `tokens:check` and `fonts:check` to both `check` and CI.
- **Tracked owner files** (`info.md` with the second email, `answer.md`, `profile.md`, `prompt.md`, `banner.svg`, `ava.PNG`): covered by ruling D10 for a private repository. Revisit at the push and visibility decision (O2).
- **Git identity:** pending the owner (Phase 1 rulings).
- **better-tailwindcss preset** (`correctness-error`): Phase 2 tightens it to token-only.
- **Not re-run:** the report's clean-clone rehearsal and actionlint run. Both would need an install; the SHAs and the YAML were checked independently.

## Checks run
- **Read in full at `4f8c11e`:** every code, config, test and script file in the diff, plus the requirement sections listed above.
- **Git:**
  - `git show --stat 526b80a`: the only file is `.gitignore`.
  - `git log --all -- "DaiHo Resume.pdf"`: 0 commits. `git rev-list --all --objects | grep -ic resume`: 0. `git ls-files | grep -i resume`: none.
  - `git check-ignore -v` on 21 paths: all matched, including `sub/DaiHo Resume.pdf`, `docs/reviews/screens/`, `docs/reviews/phase-01/screens/x.png`, `docs/reviews/a/b/raw/y.json`, `.env`, `.env.local` and `.env.production`.
  - `git check-ignore` on `docs/reviews/phase-01-code-review.md`, `docs/reviews/phase-01-ui-audit.md` and `src/app/layout.tsx`: exit 1, so none are ignored.
  - `GIT_OPTIONAL_LOCKS=0 git status --porcelain --ignored`: nothing is untracked without being ignored.
- **Pins:** `package.json` against each installed `node_modules/<pkg>/package.json` gave 26/26 exact, versions equal, licences matching §1.1. `eslint-plugin-jsx-a11y` has one resolution (6.10.2) in the lockfile, so the config's "same plugin instance" comment holds. The lockfile resolves from the registry only; importer specifiers are exact.
- **Actions:** `gh api repos/<action>/git/ref/tags/<tag>`, dereferenced. OK for checkout v7.0.1, pnpm/action-setup v6.1.0, setup-node v7.0.0, cache v6.1.0 and upload-artifact v7.0.1.
- **Template content:** `git grep` for create-next-app markers and placeholders (Create Next App, Geist, `vercel.svg`, lorem, TODO, TBD, FIXME) in code: 0 hits.
- **Lint guards:** the ESLint Node API `lintText` with the repo's `eslint.config.mjs`, with type-aware parsing disabled for the probe paths only. Scratch script, nothing written to the repo. Results are in M1 and M2. A second probe confirmed the two fix directions.
- **Guard wiring:** the main session's `test-results/harness-guard-self-tests-*-{chromium-desktop,chromium-mobile,webkit-mobile,firefox-desktop}/error-context.md`, 4/4 with `Error: guard: 1 problem(s)` and `- console error: left unhandled`.
- **Gate:** from the main session's log, not re-run. `pnpm check` exits 0 (design lint `"errors": 0, "warnings": 0`; Prettier clean; types generated; `Tests 74 passed (74)`). `pnpm build`: `○ /`, `○ /_not-found`. `pnpm test:e2e`: `52 passed (13.4s)`, `GATE_EXIT=0`. No warnings in any of the output.
