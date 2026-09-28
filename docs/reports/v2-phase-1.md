# v2 Phase 1 · Foundation: engineering report

> `frontend-engineer`, 2026-09-28. Plan: `docs/plan/v2/implementation-plan.md` → Phase 1.

**Status: DONE_WITH_CONCERNS.** The gate is green. Four concerns need a decision (below); none of them blocks Phase 2.

## Commits (local, on `main`)
| Commit | What |
|---|---|
| `f7e1597` | chore: `.nvmrc` 24, `packageManager` pnpm@10.34.5, exact pins, tsconfig, Next, PostCSS and Prettier configs |
| `4a8d178` | feat(tokens): `pnpm tokens` / `tokens:check` (css-tailwind + dtcg exports), `design:lint`, `reset.css`, thin `theme.css`, token-only ESLint |
| `91f0821` | feat(fonts): pinned google/fonts sources (`23e54b5`), `pnpm fonts` / `fonts:check` (freshness and glyph coverage), subsets and manifest |
| `1e79bd2` | feat(content): v1 content layer restored and extended with the v2 Approved copy |
| `f4ec96a` | feat(app): bare prerendered `/` (layout, fonts, metadata, `dynamic = 'error'`) |
| `5ea5ad8` → `a65949b` | chore(spike): R3F spinning mesh in a `next/dynamic` client island, then removed |

## Evidence (run fresh after the last commit)
- `pnpm check` → exit 0:
  - `design:lint: … passes: 0 errors, 0 warnings (0 allowlisted), 1 infos`
  - `tokens:check: the 2 token files match a fresh generation`
  - `fonts:check: the 6 font files match a fresh generation`
  - `fonts:check: all 123 characters of 27 files (info.md, src/content/) are in all 3 font files` ("▸" is exempted as a Tabler icon, per the Glyphs ruling)
  - `eslint .` 0 problems; `All matched files use Prettier code style!`; `next typegen && tsc --noEmit` exit 0
- `pnpm build` → exit 0, no warnings: `○ /` and `○ /_not-found`, `○ (Static) prerendered as static content`.
- **Invalid content** (`projects.ts`, `start: "2024-13"`) → build exit 1: `ContentError: Invalid content in src/content/projects.ts ✖ Use YYYY-MM → at [0].period.start`. Reverted with `git checkout`; the tree is clean.
- **Spike:** WebGL2 canvas rendered, 1440 px in dark and light, **0 console errors, 0 page errors** (the warnings are listed under Concerns). Then removed.
- **Bare page:** 375, 768 and 1440 px × light and dark. 0 console messages, no horizontal overflow, fonts loaded (`chakraPetch 600`, `chakraPetch 700`, `monaSans 400 600 100% 112%`). "Hồ Trọng Đại" renders in Mona Sans.
- **Lint probe** (a temporary file, then deleted): the content import in a client leaf, the three import outside `holo/scenes/`, `bg-red-500`, `p-[3px]`, `dark:`, `transition-all`, `z-10`, `*-dark` and a JSX literal each fail with their message.
- **Raw-value grep** (hex, px, rem, ms, vw, em, rgb or hsl in `src/`, outside `src/styles/`): 0 hits.

## Acceptance
- ✅ `pnpm check` exits 0, covering design lint 0/0, tokens and fonts in sync, glyph coverage, lint and typecheck (evidence above).
- ✅ `pnpm build`: every route is static.
- ✅ An invalid content edit fails the build with its path.
- ✅ Spike screenshots: `docs/reviews/v2/phase-1/screens/spike-1440-{dark,light}.png` (git-ignored). Bare page: `…/screens/page-{375,768,1440}-{light,dark}.png`.

## Deviations
1. **Fonts follow `DESIGN.md`:**
   - Chakra Petch 600 and 700 only (contrib §1.3 listed 500–700).
   - Mona Sans axes cut to wght 400–600 and wdth 100–112, derived from the typography tokens.
   - Both Chakra weights are preloaded, because `next/font` preloads per call.
2. **Glyph coverage checks all of `info.md`**, not just Approved copy, plus `src/content/`.
3. **Content changes:**
   - `holograms.ts` replaces v1 `drawings.ts`. It keeps the scene tags, the verdicts and `a11y.steps.*`; the v1 drawing labels and captions are dropped.
   - `site.ts` drops the canonical URL (SEO is out of scope).
   - `hud.banner` lives in `copy.ts`, because it is an Approved copy row.
   - The Character stats rows live in `about.ts`.
   - `ui.small-labels` resolves "Companions" (the Inventory group), "Achievements unlocked" (Quest) and "Education".
4. **The bare page lists the nav section labels as plain text**, so every content module is parsed at build.
5. **`type-*` utilities are hand-written in `theme.css`**, as the plan says. I tried generating them, but `design.md` 0.4.0's parser silently drops the unitless `lineHeight`.

## Concerns and questions (for the main session)
1. **Chakra Petch has no `tnum`, and its digits are proportional**, so `stat-value`'s `'tnum' 1` can't apply (a count-up would jitter). This is recorded in `scripts/fonts/config.ts` as `KNOWN_FEATURE_GAPS`; any other gap still fails. **design-lead** should decide: accept it, or use tabular Mona Sans for the readouts.
2. **Licence:** Mona Sans's OFL reserves the font name "Mona", and the OFL treats a subset as a Modified Version. Strict compliance means renaming the subset's name table, or getting permission. Chakra Petch has no reserved name. **This needs a ruling.**
3. **Console warning:** with three 0.186.1, R3F 9.8.1 logs "THREE.Clock: This module has been deprecated". It is a warning, not an error. It matters if the Phase 6 fixtures fail on warnings.
4. **Content trace for F:** the XP value "In production since 2020" joins `info.md`'s "In production since: 2020" the way `profile.md` writes it.
5. **CLAUDE.md:** add the commands to Testing & Verification: `pnpm check`, `pnpm build`, `pnpm tokens`, `pnpm fonts`.
