# Phase 1 · Foundation: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer`
- **Brief:** Phase 1 of `docs/plan/implementation-plan.md`, with contrib-engineering §1, §2, §9 and contrib-verification §1.3, §6, P1-1 to P1-8.
- **Status: DONE_WITH_CONCERNS.** The toolchain, repository, configs, harness, shell and CI workflow are in place. The non-browser gate and `pnpm test:e2e` are green, run fresh. Two items can't pass on a shell with no text, and the owner has deferred both (see below):
  - the performance budget: the framework floor is 133,646 B, over the 120,000 B route budget;
  - `pnpm lhci`: Lighthouse stops with `NO_FCP`.

## Owner instruction received mid-phase

While I was working, the owner wrote: *"skip performance budget, scan, seo for now, focus on building porfolio"*. The message reached this subagent directly. I'm relaying it here so the main session can log a ruling. What I did with it:

- **Performance budget:** stopped all budget work. I moved the budget spec out of `pnpm test:e2e` into `pnpm test:budget`. The spec itself is unchanged and still fails. `BUDGETS` is still 120,000 B and 15,000 B, and the floor ruling is open.
- **Privacy scan:** no further work. It was already finished and clean, so it stays in place.
- **SEO and Lighthouse:** no further work. `pnpm lhci` is not part of this phase's gate.
- **Next step:** the report is kept short so the build phases can start.

## Installed

| Tool | Result |
|---|---|
| Node | **v24.21.0** via `nvm install 24` (npm 11.19.0). nvm default before and after: `default -> 22 (-> v22.13.0)`, unchanged. v24.13.0 was already present and was not used |
| Corepack | 0.36.0, bundled with Node 24.21.0. `corepack enable` added pnpm, pnpx, yarn and yarnpkg shims in `~/.nvm/versions/node/v24.21.0/bin` only. Node 22 and Homebrew's pnpm 8.15.5 are untouched |
| pnpm | **10.34.5** via Corepack (`"packageManager": "pnpm@10.34.5"`). Run `nvm use` in the repo first (`.nvmrc` = `24`) |
| Playwright 1.63.0 browsers | Chrome for Testing 153.0.8010.12: 182.1 MiB · Chrome Headless Shell 153.0.8010.12: 94.3 MiB · WebKit 26.6: 77.5 MiB · Firefox 155.0: 104.3 MiB · FFmpeg: 1.0 MiB. **Total download 459.2 MiB (481,589,813 B); 1.1 GB on disk** in `~/Library/Caches/ms-playwright` |
| Dependencies | 26 packages, exact pins, lockfile 9.0. LHCI uses the system Google Chrome |
| actionlint 1.7.12 | Downloaded to the session scratchpad only, with a verified checksum. Not installed |

## Files

- **Toolchain:** `package.json`, `pnpm-lock.yaml`, `.nvmrc`.
- **Configs:** `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `prettier.config.mjs`, `.prettierignore`, `.gitignore`.
- **Shell:** `src/app/layout.tsx` (`<html lang="en">`, `dynamic = 'error'`), `src/app/page.tsx` (empty `<main />`), `src/app/globals.css` (Tailwind, scanning `src/` only).
- **Unit harness:**
  - `vitest.config.ts`
  - tests: `tests/unit/{architecture,traceability,privacy-scan,lhci-config}.test.ts`
  - support: `tests/support/{repo,architecture}.ts`, `tests/support/content-trace/{normalise,corpus,allowlist,trace}.ts`, `allowlist.json` (empty)
- **Privacy scan:** `scripts/privacy/{rules,source-maps,walk,scan}.ts`.
- **E2E harness:**
  - `playwright.config.ts`, `tests/e2e/fixtures.ts`
  - support: `tests/e2e/support/{guard,axe,overflow,network-log,budgets}.ts`
  - specs: `tests/e2e/{harness,smoke,budget}.spec.ts`
- **Lighthouse and CI:** `lighthouserc.json` (mobile), `lighthouserc.desktop.json`, `.github/workflows/ci.yml`.

## Commits (local only, no remote)

```text
b984894 test: move the budget spec to pnpm test:budget, deferred by the owner
3205919 fix(privacy): match encoded emails in place
bff24fb ci: add the GitHub Actions workflow, actions pinned to commit SHAs
6f3a8c4 ci: add Lighthouse CI configs for mobile and desktop
b76cefe test: add the Playwright harness, smoke and budget specs
f60253e test: add the unit harness and the privacy scan
f36ed48 feat: add the empty static shell
cc5f14d chore: add TypeScript, Next, PostCSS, ESLint and Prettier configs
02d1a08 chore: pin the toolchain and Phase 1 dependencies
5d1a550 docs: track project inputs, plan, design and agent system
526b80a chore: add ignore rules before tracking anything
```

This report is committed on top of these. `.gitignore` was committed before anything else was added. The main session's uncommitted edits to `info.md` and `docs/progress.md` were left alone.

## Gate (fresh: `node_modules/`, `.next/` and reports deleted first)

| Command | Result line |
|---|---|
| `pnpm install --frozen-lockfile` | `Lockfile is up to date` · `Packages: +736` · `Done in 4s using pnpm v10.34.5`. **0 warnings** |
| `npx @google/design.md lint DESIGN.md` | `"errors": 0, "warnings": 0, "infos": 1` (the info is the token summary). It resolves to the pinned 0.4.0: `--no-install` succeeds |
| `pnpm lint` | ESLint: 0 problems. `All matched files use Prettier code style!` |
| `pnpm typecheck` | `✓ Types generated successfully`, then `tsc --noEmit` exits 0 |
| `pnpm test` | `Test Files 4 passed (4)` · `Tests 74 passed (74)`. Content trace: `0 modules, 0 leaves checked` |
| `pnpm build` | `▲ Next.js 16.3.6 (Turbopack)` · `○ /` · `○ /_not-found` · `○ (Static) prerendered as static content` |
| `pnpm privacy:scan` | `src/ 3 text files` · `public/ absent` · `.next/ 142 text files … 28 source maps: 22 first-party sources scanned, 354 node_modules sources skipped` · **`0 findings`** |
| `pnpm check` | exit 0 (design lint, lint, typecheck, test) |
| `pnpm test:e2e` | **`52 passed`**: 4 projects; chromium desktop, chromium mobile and webkit mobile 14 each, firefox desktop 10 |
| `pnpm test:budget` (deferred) | `first-load JS 133646 B gzip (133.6 kB, 5 files, 0 uncompressed)` · `CSS 1374 B` · `fonts 0 B` · `document 1581 B` · `third-party requests 0` · `1 failed` (133,646 > 120,000) |
| `pnpm lhci` (deferred) | `Healthcheck passed!` · `Run #1...failed!` · `Runtime error encountered: The page did not paint any content. … (NO_FCP)` |

**Extra evidence**
- **Clean-clone CI rehearsal.** `git clone` into the scratchpad, then the CI steps in order: install, design lint, lint, typecheck, test, build, privacy scan. Every step exits 0. Its client chunks are byte-identical to the repo's, so the floor is reproducible.
- **actionlint 1.7.12** on `ci.yml`: exit 0, no findings. Shellcheck isn't installed, so the `run:` one-liners weren't shell-checked.
- **Guards bite on the real pipeline.** Temporary probes, all removed afterwards; the tree was restored and rebuilt, and the scan returned 0 findings.
  - **Privacy scan:** a client leaf holding a fictional email and phone gave 10 masked findings, exit 1. They were in `src/`, `.next/server/app/index.html`, the SSR chunk, the SSR source map's first-party source, and the client chunk `.next/static/chunks/*.js`.
  - **ESLint:** `react/jsx-no-literals` fired twice. `no-restricted-imports` fired on `node:fs` and on `@/content/identity` in a `*.client.tsx`.
  - **Architecture test:** it failed on a `'use client'` in a file that isn't `*.client.tsx`.
- **Guard wiring.** The self-test "fails the test from its teardown when a problem is left unhandled" uses `test.fail()`. In all 4 engines the JSON report shows `status=failed expected=failed`, with `guard: 1 problem(s) - console error: left unhandled`.
- **LHCI pipeline.** Run on a temporary build with one text node, then reverted.
  - It ran 3 runs each for mobile and desktop, `median-run`, with reports in `.lighthouseci/{mobile,desktop}`, and evaluated its assertions.
  - Passing: performance 1.00 on both; LCP 1,897 ms mobile and 427 ms desktop; CLS 0; TBT 35 ms and 0 ms.
  - Failing: accessibility 0.94 (`document-title`); best practices 0.96 (`errors-in-console`: `/favicon.ico` returns 404); SEO 0.8 (`document-title`, `meta-description`); `resource-summary:script:size` 135,543 > 120,000.
- **axe on the skeleton, both themes.** Two violations, both caused by the shell having no text: `document-title` (serious, WCAG A) and `page-has-heading-one` (best practice). 0 incomplete, 20 passes. No axe spec runs on the shell yet; the `a11y` spec is Phase 4 in the file map.

## Framework floor

**133,646 B gzip (133.6 kB; 130.5 KiB)** of first-load JS on the bare shell. It is 5 files, all gzip, measured on the network by the budget spec (chromium desktop, cold, `next start`). It is identical across rebuilds and in a clean clone.

- **What it is made of:** React DOM with the hydration runtime, 71.7 kB; the App Router runtime, 48.5 kB; three small chunks, 13.5 kB. There is no app code.
- **Independent checks:**
  - gzip level 6 of the raw files: 133,485 B
  - LHCI `transferSize`: 135,543 B
  - brotli 11: 113,872 B
  - a `next build --webpack` build: 131,664 B, so the bundler doesn't fix it
- **Against the plan:** it is over the 105 kB recalibration threshold and over the 120 kB route budget itself. As the brief says, I stopped before tightening anything:
  - `BUDGETS` is unchanged.
  - The floor is recorded in `tests/e2e/support/budgets.ts` as `FRAMEWORK_FLOOR_BYTES = 133_646`, so app-owned JS reads 0.
  - The ruling is deferred by the owner.

## Acceptance criteria

**Plan, Phase 1**
- ✅ **Install:** the frozen install shows 0 warnings. The non-frozen install showed only the expected ones:
  - `deprecated eslint@9.39.5` (plan risk 2);
  - `5 deprecated subdependencies` (glob 7, inflight, rimraf 2 and 3, uuid 8), all through `@lhci/cli@0.15.1`;
  - no peer warnings.
- ✅ **Gate:** `lint`, `typecheck` and `test` are clean. The build shows every route ○. Smoke has 0 console errors (3 projects × 2 themes, enforced by the guard).
- ⏸ **Gate, LHCI:** `pnpm lhci` can't evaluate its assertions on a page that paints nothing (`NO_FCP`, inherent). They were shown evaluating on a contentful probe. Deferred by the owner.
- ⏸ **Budget:** the spec prints the floor (133.6 kB). It is > 105 kB, so a ruling is needed; deferred by the owner.
- ✅ **Privacy:**
  - `git check-ignore -v "DaiHo Resume.pdf"` → `.gitignore:3:DaiHo Resume.pdf	DaiHo Resume.pdf`
  - The file is in no `git ls-files` output and in no commit.
  - The scan is clean, and it runs in CI (the `build-e2e` step after `pnpm build`).

**QA**
- **P1-1** · all seven CLAUDE.md commands exist. Six pass: lint, typecheck, test, build, test:e2e, design lint. `pnpm lhci` doesn't pass (`NO_FCP`, deferred).
- ✅ **P1-2** · `pnpm test:e2e --list` gives `Total: 52 tests in 2 files`, plus the budget spec through `pnpm test:budget`.
  - The guard self-tests cover: console error, console warning, page error, third-party request, same-origin ≥ 400, and teardown wiring.
  - The helper self-tests cover: axe finding an unlabelled button, and overflow catching a 400 px block at 320 px.
  - The two-theme fixture checks light and dark.
  - **Project shape:** the plan's ruling has 4 projects, not QA's five plus `smoke`. No-JS and reduced motion are set per spec. `smoke` against `BASE_URL` belongs to Phase 13.
- ✅ **P1-3** · mobile and `preset: desktop` configs: 3 runs, `median-run` on every assertion, filesystem upload, the §6 CI levels. `lhci-config.test.ts` pins all of this; the first run is the probe above.
- ✅ **P1-4** · baseline: 133,646 B from the network log; 135,543 B `transferSize` from LHCI (probe build).
- ✅ **P1-5** · passing tests:
  - "the schema rejects an entry that lacks a source (P1-5)";
  - "every string and number leaf in src/content/ traces to info.md or the allowlist";
  - 19 more trace, corpus and allowlist tests.
- ✅ **P1-6** · check-ignore line above. The scan covers `src/`, `public/` and all of `.next/`, client chunks included, and finds 0. It is in CI.
- ✅ **P1-7** · `git check-ignore -v` matches all ten patterns: `.next/`, `out/`, `build/`, `test-results/`, `playwright-report/`, `.lighthouseci/`, `docs/reviews/**/screens/`, `docs/reviews/**/raw/`, `.env` and `.env.local` (via `.env*`).
- ✅ **P1-8** · all 26 dependencies are exact, in the plan, and installed at the pinned version.
  - Versions and licences were re-checked with `npm view` on 2026-09-28 for all 31 packages in the plan, and for pnpm.
  - `@google/design.md`: Apache-2.0, confirmed from the repository's LICENSE at the published commit `9bf8eae` and from the identical LICENSE in the 0.4.0 tarball (SHA-256 `1bdd0399…c66e`). The npm manifest still has no licence field.

## Deviations

1. **Dependencies:** only the packages Phase 1 files use were added. Deferred to the phases that use them: `@tabler/icons-react` (4), `subset-font` (2), `unpdf` (10), `schema-dts` (11) and `postcss` (10). Next's bundled PostCSS runs the Tailwind plugin, so `postcss` isn't needed yet.
2. **Install scripts:** `pnpm.ignoredBuiltDependencies: [esbuild, unrs-resolver]`. Both scripts only download a platform binary that pnpm already installs as an optional dependency. esbuild was checked working.
3. **Privacy scan precision:** needed for it to run over minified framework code. Each point has a test.
   - A plain digit run counts as a phone number only if it starts with `0` or `+`.
   - Formatted groups need at least 2 digits each.
   - The digit alphabet `0123456789` is not a number. It appears in object-assign's feature test in a client chunk.
   - `tel:` matches only a `tel:` URI. React's `{tel:!0}` input-type key is not one.
   - Emails are matched in place, including encoded `@` forms.
   - Inside source maps, only first-party and bundler-runtime sources are scanned. The 354 `node_modules` sources are skipped, because their compiled code is scanned in the chunks. One of them holds `me@traviswebb.com`, an author credit in Next's `etag.js`.
   - `.next/cache` (Turbopack's build cache) is excluded.
   - `XP` is allowed only inside the owner's house rule 4. C5 lists `XP` as banner-only, but the owner's house rule uses it.
4. **P1-5 "the schema":** Phase 1 has no content schemas yet (Phase 3), so the allowlist entry schema (Zod) carries that check.
5. **Firefox also runs the harness self-tests**, so the guards its layout and keyboard specs will rely on are proven in Gecko. CI installs Firefox as well, because the ruling added it after §9.2 was written.
6. **Lint presets:** typescript-eslint `strictTypeChecked`; the plan says "type-checked". For better-tailwindcss, the `correctness-error` preset; its stylistic presets conflict with Prettier's class sorting.
7. **LHCI config:** two config files. `pnpm lhci` runs mobile, then desktop.
8. **Tailwind scope:** `@import "tailwindcss" source("..")`, so prose in `docs/` and `DESIGN.md` never becomes CSS.
9. **`pnpm check`** calls the plain `design.md lint` until Phase 2's `design:lint` wrapper replaces it.

## Questions and rulings needed (main session)

1. **Owner deferral:** log it as a ruling. When budgets resume, the floor needs a decision:
   - recalibrate B8 to floor + 15 kB = 148.6 kB (the plan's rule);
   - or measure brotli: 113.9 kB, which fits 120 kB but leaves only about 6 kB for app code.
2. **Title and axe in Phase 4:** Phase 4 requires axe 0, but `document-title` fails until a `<title>` exists, and the plan wires metadata only in Phase 11. `meta.title` is now approved in `info.md`. Wire it in Phase 4? It is WCAG 2.4.2, not only SEO.
3. **Git identity:** commits use the global identity `dai.ho <daniel.ho@repeat.gg>`, a work address. If the owner wants `tidi.dev1321@gmail.com`, set it before the first push; rewriting 12 local commits is cheap now.
4. **Phase 3 trace rules:**
   - The canonical URL and `lang` come from Site preferences, which the §5.2 corpus excludes.
   - Section ids such as `quest-journal` won't trace.
   - Both need a rule: allowlist entries, or exempt `id` keys.
5. **CI:** its `pnpm lhci` step will fail until performance and SEO resume. CI doesn't run before the first push.
6. **Favicon blind spot:** Chrome requests `/favicon.ico` (404 in Lighthouse). Playwright never does, so the guard can't catch it. It is Phase 11 (P6-9).

## New commands for CLAUDE.md → Testing & Verification

- `nvm use` (reads `.nvmrc` = 24). Corepack then supplies pnpm 10.34.5.
- `pnpm check`: design lint, lint, typecheck, unit tests.
- `pnpm privacy:scan`: after `pnpm build`; scans `src/`, `public/` and `.next/`.
- `pnpm test:budget`: the deferred byte budget (chromium desktop).
- `pnpm format`: Prettier write.
- `pnpm lhci`: mobile, then desktop. It runs once the page paints text.
- **Local gate order:** `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm build` → `pnpm privacy:scan` → `pnpm test:e2e`. Add `pnpm lhci` and `pnpm test:budget` when they are re-enabled.
