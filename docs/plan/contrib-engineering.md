# Plan contribution: engineering

> Author: `frontend-engineer`, 2026-09-28, for `docs/plan/implementation-plan.md` (`implementation-plan` skill, engineering section).
> **Status: draft. The plan is not approved.** Nothing has been scaffolded, installed or initialised. Only `npm view`, documentation lookups and read-only fetches were run.
> Inputs: `info.md` (confirmed 2026-09-27) · `CLAUDE.md` · `DESIGN.md` (created 2026-09-28, lint 0 errors, 0 warnings) · `docs/plan/contrib-design.md` · `docs/design/directions.md` §3, §5, §11 (B · Proof) · rulings in `docs/progress.md`.
> Component and token names are `DESIGN.md`'s. File names are proposals. Where this file departs from `DESIGN.md`, it says so and asks for a ruling (§12).
> Versions were verified on 2026-09-28 with `npm view` (§1.1). Framework, host and tool behaviour was checked against current docs and source (§13).
> Decisions only: no code bodies.

## 0. Decisions at a glance

| Area | Decision | Why |
|---|---|---|
| Rendering | Next.js 16.3.6 App Router. Every route is prerendered on Vercel (default output, not `output: 'export'`), and the root layout sets `dynamic = 'error'` | Keeps default `next/image` optimisation, `headers()` and build-time OG images. The build fails if anything turns dynamic |
| Language | TypeScript **6.0.3**, strict | typescript-eslint 8.70.1 supports `<6.1.0`. TypeScript 7.0.2 (the native port) would break type-aware linting |
| Styling | Tailwind CSS 4.3.3. Themes come only from generated `DESIGN.md` tokens, plus a hand-mapped supplement that a test checks | CLAUDE.md's token contract. `DESIGN.md` Known Gaps 1 |
| Font | Archivo through **`next/font/local`**, from a project subset (latin, vietnamese and arrows; `wdth` 87.5–125, `wght` 400–800) | Google's and Fontsource's subsets both omit U+2192 "→", which appears in rendered owner strings. **Departs from DESIGN.md → Typography source line** |
| Motion | **CSS only, no library** | Four transform and opacity steps, with no springs, gestures, layout or exit animation |
| Content validation | **Zod 4.6.5**, at build | Strong inference and readable error paths. It runs on the server only, so its size never ships |
| Client JS | Four leaves: theme toggle, handshake bench, video facade, menu disclosure | Everything else is a Server Component |
| JS budget | **≤ 120 KB gzip of first-load JS per HTML route**, of which app-owned leaves are ≤ 15 KB | The framework floor is about 90–105 KB. A Playwright byte-count test enforces it |
| Résumé | A print layout rendered by a script and printed to a **tagged A4 PDF by Playwright's Chromium**. The PDF is committed with a source-hash lock that CI checks | Accessible PDF, same tokens as the site, and it can't go stale unnoticed |
| Hosting | Vercel Git integration. Builds of `main` are **staged**; promotion happens only on the owner's approval | Separates merging from releasing |
| Lint | ESLint **9.39.5** with eslint-config-next 16.3.6 and jsx-a11y strict | ESLint 10 still crashes eslint-config-next's plugins (vercel/next.js#89764). ESLint 9 is past end of life but runs only in development |
| Toolchain | Node **24** LTS, pnpm **10.34.5** | Node 24 is Vercel's default and the Active LTS. Vercel detects pnpm 10 at most, natively |

## 1. Stack

### 1.1 Versions (verified 2026-09-28)
All versions are pinned exactly in `package.json` and the lockfile is committed. Any new dependency needs `npm view` and a line here.

| Package | Version | Licence | Role |
|---|---|---|---|
| `next` | 16.3.6 | MIT | App Router, static prerendering, `next/font`, `next/image`, `next/og` |
| `react`, `react-dom` | 19.3.0 | MIT | The App Router runs Next's bundled React canary. This copy serves scripts (`react-dom/server`) and tests |
| `typescript` | 6.0.3 (latest is 7.0.2) | Apache-2.0 | Strict typing |
| `@types/react`, `@types/react-dom` | 19.3.0 | MIT | |
| `@types/node` | 24.19.0 (latest is 26.6.3) | MIT | Matches the Node 24 runtime |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | MIT | Styling |
| `postcss` | 8.5.28 | MIT | Compiles the résumé CSS in a script (a direct dependency, not a transitive one) |
| `@tabler/icons-react` | 3.48.0 | MIT | The ten icons in DESIGN.md → Shapes, imported per icon |
| `zod` | 4.6.5 | MIT | Content schema |
| `@google/design.md` | 0.4.0 | Apache-2.0 (the repository LICENSE; the npm manifest has no licence field) | Lint, `export`, and its parser (`/linter` export) |
| `subset-font` | 2.9.0 | BSD-3-Clause | Font subsetting and instancing, dev-time only (HarfBuzz) |
| `tsx` | 4.23.15 | MIT | Runs the TS/TSX scripts |
| `vitest` | 5.0.2 | MIT | Unit tests, node environment |
| `vite` | 8.3.1 | MIT | Vitest's peer dependency |
| `@playwright/test` | 1.63.0 | Apache-2.0 | E2E tests, and PDF printing (`tagged`, `outline`, `preferCSSPageSize`) |
| `@axe-core/playwright` | 4.13.0 | MPL-2.0 | Axe in E2E, dev-only |
| `@lhci/cli` | 0.15.1 | Apache-2.0 | Lighthouse CI. It bundles Lighthouse 12.6.1 |
| `unpdf` | 1.8.1 | MIT | Extracts the committed PDF's text in tests |
| `schema-dts` | 2.0.0 | Apache-2.0 | Types for JSON-LD only; nothing ships |
| `eslint`, `@eslint/js` | 9.39.5 (latest is 10.11.0) | MIT | Lint |
| `eslint-config-next` | 16.3.6 | MIT | Brings the react, react-hooks, import, jsx-a11y and `@next` plugins |
| `eslint-plugin-jsx-a11y` | 6.10.2 | MIT | The strict preset, on the same plugin instance |
| `typescript-eslint` | 8.70.1 | MIT | Type-checked rules |
| `eslint-plugin-better-tailwindcss` | 4.7.0 | MIT | Enforces token-only classes |
| `eslint-config-prettier` | 10.1.8 | MIT | |
| `prettier`, `prettier-plugin-tailwindcss` | 3.9.9, 0.8.1 | MIT | |
| Node.js | 24.x LTS (24.21.0 current) | | `engines.node: "24.x"` and `.nvmrc` |
| pnpm | 10.34.5 (latest is 12.6.0) | MIT | `packageManager` field |

**Held below latest on purpose:**
- **TypeScript 6.0.3 instead of 7.0.2:** typescript-eslint 8.70.1 declares `typescript >=4.8.4 <6.1.0`. TypeScript 6.0 is the last JavaScript-based release.
- **ESLint 9.39.5 instead of 10.11.0:** eslint-plugin-react 7.37.5, eslint-plugin-import 2.32.0 and eslint-plugin-jsx-a11y 6.10.2 declare peers up to ESLint 9 only. On ESLint 10, eslint-config-next still fails with `contextOrFilename.getFilename is not a function` (vercel/next.js#89764, open, last activity 2026-09-16). Reaching ESLint 10 would mean dropping jsx-a11y and eslint-plugin-react, which weakens the lint the plan requires. ESLint 9 has been past end of life since 2026-08-06 (eslint.org). It runs only on our own source in development and CI. **Upgrade trigger:** #89764 closes.
- **pnpm 10.34.5 instead of 12.6.0:** Vercel's package-manager table lists pnpm 6 to 10 (lockfile 9.0). pnpm 11 and 12 would need Corepack, which Vercel marks experimental.
- **@types/node 24.x instead of 26.x:** it matches the runtime.

**Considered and not added:**
- `motion` 13.4.4: §1.3.
- `next-themes` 0.4.6: the no-flash script is about 300 bytes of our own, and a provider would wrap the tree.
- `@react-pdf/renderer` 4.9.0: §7.
- `valibot` 1.5.0: equivalent to Zod, and its size advantage doesn't matter at build time.
- `jsdom` and `happy-dom`: unit tests need no DOM (§9.1).
- `server-only`: replaced by the `*.client.tsx` convention and a lint rule (§5.1), which also keeps scripts and Vitest free of export-condition workarounds.
- `@vercel/analytics` and Speed Insights: the owner chose no analytics.
- `sharp`: Next manages its own optimiser. There is no custom image script.
- `pdf-lib`: not needed.

### 1.2 Rendering: static prerendering on Vercel, not static export
- **Prerendered at build:** `/`, the not-found page, `sitemap.xml`, `robots.txt`, the OG and Twitter images, and the icons. Nothing reads the request.
- **Why not `output: 'export'`:** the 16.3.6 docs list the default `next/image` loader, `headers()` and redirects as unsupported in export mode. We would have to pre-generate the avatar's variants and move security headers into host config, for no gain: Vercel serves prerendered pages from its CDN either way.
- **Guard:** `export const dynamic = 'error'` in the root layout turns any request-time API into a build error. This is the same check the docs compare static export to.
- **OG image:** `app/opengraph-image.tsx`, built with `ImageResponse` from `next/og`. The docs state generated images are statically optimised at build unless they use request-time APIs.
  - Satori reads neither woff2 nor variable axes, so the card uses static Archivo TTF instances (§1.5), read at module scope.
  - Colours come from the DTCG token JSON, because Satori has no stylesheet.
  - Text comes from content.
- **Not enabled:** `cacheComponents` (PPR), `reactCompiler` and typed routes. None of them buys anything on one static page.
- **Cost if wrong:** switching to export later means a custom image loader or pre-generated variants, and headers moved to `vercel.json`. About a day's work.

### 1.3 Motion: CSS first, no library
- **What moves:** the handshake, per DESIGN.md → Motion. Packet travel 360 ms, chip pulse 160 ms, packet return 360 ms, readout 200 ms, rejected shake 240 ms, packet exit 120 ms, video fade 150 ms. Only `transform` and `opacity` animate, with no springs, drag, layout or exit animation.
- **Implementation:**
  - CSS keyframes are keyed off `data-step` and `data-mode` attributes on the bench.
  - A pure reducer (`src/lib/handshake/machine.ts`) holds the state: rest, idle, challenge, response, genuine, rejected.
  - The client leaf advances on `animationend`, filtered by animation name. Only the visible variant animates, because the hidden one is `display: none`, so only it fires events.
  - Run restarts from idle with a new run id, which remounts the drawing so CSS animations restart from zero.
  - Durations and easings are the Motion tokens, as CSS custom properties. No duration lives in JS.
- **Reduced motion:** the click handler reads `matchMedia('(prefers-reduced-motion: reduce)')` at click time and dispatches an instant run. CSS hides the packets and shows the step numerals 1 and 2. No subscription and no extra state.
- **Why no library:** Motion's own figures are 34 KB gzip for the `motion` component, 4.6 KB plus 15 KB for `m` with `LazyMotion` and `domAnimation`, and 2.3 KB for `useAnimate` mini, which only wraps WAAPI. Native CSS, or WAAPI at 0 KB, covers every step.
- **Fallback:** if `animationend` sequencing proves unreliable in WebKit, the same leaf drives the steps with `Element.animate()` (WAAPI, 0 KB). Adding `motion` would need a new justification and a ruling.

### 1.4 Content validation: Zod 4
- **Needs:**
  - required and optional fields, and non-empty strings
  - `YYYY-MM` periods with start ≤ end
  - https URLs and email
  - status enums (Active, Side, Cleared)
  - discriminated unions
  - errors with paths that fail the build
- **Zod 4.6.5 covers them:** `z.infer`, `z.url()`, `z.email()`, refinements and `z.prettifyError`.
- **Where it runs:** at module evaluation during `next build`, and in Vitest. Client leaves can't import content (§5.1), so bundle size is irrelevant, which removes Valibot's main advantage.
- **Why not plain types:** TypeScript alone can't check URL formats, date order or empty strings.

### 1.5 Fonts: Archivo through next/font/local, from a project subset
**Verified today:**
- Google Fonts serves variable Archivo in three subsets: latin 90,096 B, latin-ext 85,856 B and vietnamese 34,364 B (woff2). It returns the full axis ranges even when a narrower range is requested.
- `@fontsource-variable/archivo` 5.3.0 uses the same three `unicode-range`s.
- **None of them includes U+2192 "→".** The full font has it: 653 code points in a Google-served static instance, including → ← ↔ and all the Vietnamese letters checked.
- "→" is rendered text: DESIGN.md's Quest caption ("DynamoDB → MySQL migration with ~5 min of downtime"), the Five-Minute Window achievement, and possibly sheet dates ("2024 → now", copy row 11). With either source DESIGN.md names, the arrow would fall back to a system font.

**Decision:**
- **Source:** `Archivo[wdth,wght].ttf` (658,596 B) from google/fonts at commit `95f4904`, dated 2026-03-03. The OFL 1.1 has no Reserved Font Name, so subsets and instances are allowed. `OFL.txt` is committed next to every derived file.
- **`pnpm fonts`** (`subset-font`, HarfBuzz) writes:
  - one variable woff2 covering Google's latin and vietnamese ranges plus ← → ↔, with axes cut to the ranges DESIGN.md uses (`wdth` 87.5–125, `wght` 400–800);
  - static TTF instances for Satori and the résumé, one per weight/width pair in DESIGN.md → Typography: 800/125, 700/125, 700/112, 500/100, 400/100, 700/100, 600/87.5 and 700/87.5;
  - a code-point manifest.
- **`next/font/local` settings:**
  - `variable: '--font-archivo'` and `display: 'swap'`
  - preload on (one file)
  - a `font-stretch` range declared in `declarations`, so DESIGN.md's `font-stretch: 125%` selects the width axis
  - fallback `system-ui, sans-serif`, with `adjustFontFallback` providing the metric adjustment DESIGN.md asks for
- **Checks:**
  - `fonts:check` regenerates and byte-compares.
  - `font-coverage.test.ts` asserts that every character in `info.md` and in `src/content/` is in the manifest, which catches missing and fallback glyphs, including Vietnamese marks.
- **Target:** at most 100 KB of woff2. Google's latin and vietnamese pair is 124 KB. Measured in E2.
- **Alternative if the main session wants no font tooling:** `next/font/google` (`subsets: ['latin', 'vietnamese']`, `axes: ['wdth']`). Cost: about 124 KB preloaded, and a fallback arrow unless DESIGN.md renders arrows another way.

### 1.6 Tooling notes
- **TypeScript 6.0 changes defaults:** `types` is `[]`, and `strict` and `noUncheckedSideEffectImports` are on. `tsconfig.json` sets `types: ["node"]` explicitly, and E1 verifies CSS side-effect imports.
- **`next lint` is gone and `next build` no longer lints:** `pnpm lint` calls ESLint directly.
- **No build-time size report:** Next 16 removed `First Load JS` from the build output, so the budget is measured in the browser (§8).
- **`@google/design.md` is alpha (0.4.0):** pinned exactly, so an upgrade shows up as a token-sync diff.

## 2. Project structure and file map

```text
/
├─ DESIGN.md · info.md · CLAUDE.md       inputs (engineering never edits them)
├─ assets/fonts/source/                  Archivo variable TTF + OFL.txt (not served)
├─ public/<résumé file>.pdf              generated by pnpm resume:pdf, committed
├─ scripts/{design,tokens,fonts,resume}/ dev-time generators and checks (tsx)
├─ src/
│  ├─ app/                               routes and metadata files
│  ├─ components/<feature>/              Server Components; client leaves are *.client.tsx
│  ├─ content/                           typed modules mirroring info.md, and schema/
│  ├─ lib/                               pure logic: format, content, theme, handshake, seo, resume
│  ├─ styles/                            generated token CSS and JSON, supplement, reset, print
│  └─ assets/{fonts,og,images}/          build inputs imported by code
├─ tests/{unit,e2e}/
└─ .github/workflows/ci.yml
```

| Path | Responsibility | Phase |
|---|---|---|
| `package.json`, `pnpm-lock.yaml`, `.nvmrc` | Exact pins, scripts (§9.1), `engines.node: "24.x"`, `packageManager: "pnpm@10.34.5"` | E1 |
| `.gitignore` | Build outputs, reports, `.env*`, and `DaiHo Resume.pdf` (it holds the phone number and a third party's contact details) | E1 |
| `next.config.ts` | `images.formats: ['image/avif','image/webp']`, `poweredByHeader: false`; `headers()` in E11 | E1, E11 |
| `tsconfig.json` | Strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `types: ["node"]`, `@/*` → `src/*` | E1 |
| `postcss.config.mjs` | `@tailwindcss/postcss` | E1 |
| `eslint.config.mjs` | Flat config: eslint-config-next (core-web-vitals, typescript), jsx-a11y strict, typescript-eslint type-checked, better-tailwindcss, `react/jsx-no-literals` in components, client-leaf import bans, prettier last | E1, tightened in E2 |
| `prettier.config.mjs` | Tailwind plugin with `tailwindStylesheet` | E1 |
| `vitest.config.ts` | Node environment, `@` alias | E1 |
| `playwright.config.ts` | Projects: chromium desktop, chromium mobile, webkit mobile; `webServer: pnpm start` | E1 |
| `lighthouserc.json` | Mobile, 3 runs, `median-run` assertions, filesystem upload | E1 |
| `.github/workflows/ci.yml` | §9.2 | E1 |
| `scripts/design/lint.ts` | Runs `design.md lint`; fails on errors, and on warnings not in an allowlist | E2 |
| `scripts/tokens/build.ts`, `check.ts` | Runs both `design.md export`s and the theme generator; the check regenerates to a temp directory and byte-compares | E2 |
| `scripts/tokens/theme.ts` | Reads DESIGN.md through `@google/design.md/linter`; writes `theme.generated.css` (§4.2) | E2 |
| `scripts/fonts/build.ts`, `check.ts` | Subset, instance, manifest; the check byte-compares | E2 |
| `scripts/resume/build.ts`, `check.ts` | Render, compile CSS, axe, print the PDF, write the lock; the check recomputes the hash | E10 |
| `src/app/layout.tsx` | `<html lang="en">`, font variable, theme script, `<noscript>` style, skip link, header, footer, `metadata`, `viewport`, `dynamic = 'error'` | E1, E4, E11 |
| `src/app/page.tsx` | Composes the sections from the section registry; renders JSON-LD | E4 to E9, E11 |
| `src/app/not-found.tsx` | Not found (h1 and a link home) | E11 |
| `src/app/globals.css` | Imports Tailwind, the reset, the generated tokens, the generated theme, the supplement; base rules use tokens only | E1, E2 |
| `src/app/opengraph-image.tsx`, `twitter-image.tsx` | 1200 × 630 PNGs at build, from `og-card.tsx` | E11 |
| `src/app/icon.svg`, `apple-icon.tsx` | Chip-mark favicon (dark-aware); 180 px apple-touch icon on Wafer | E11 |
| `src/app/sitemap.ts`, `robots.ts` | Crawl files | E11 |
| `src/components/site-header/site-header.tsx`, `site-nav.tsx`, `skip-link.tsx` | Header, navigation, skip link | E4 |
| `src/components/site-header/menu-disclosure.client.tsx` | Menu disclosure below 768 px (§5.3) | E4 |
| `src/components/theme/theme-script.tsx`, `noscript-style.tsx`, `theme-toggle.client.tsx` | No-flash script, the no-JS style, the theme toggle | E4 |
| `src/components/site-footer/site-footer.tsx` | Footer | E4 |
| `src/components/ui/section.tsx`, `icon.tsx` | Section with a stable id and heading; Tabler wrapper (20 px, stroke 1.5, `aria-hidden`) | E4 |
| `src/components/hero/hero.tsx`, `hero-lockup.tsx` | Hero, hero lockup, CTA pair | E4 |
| `src/components/handshake-bench/handshake-bench.tsx`, `bench-drawing.tsx` | Bench in its rest state: `plate`, compact and wide drawings, readout, caption, step list | E4, E6 |
| `src/components/handshake-bench/handshake-bench.client.tsx`, `bench.css` | State, controls, live region, keyframes | E6 |
| `src/components/sheets/full-sheet.tsx`, `sheet-head.tsx`, `compact-sheet.tsx` | Full sheet, compact sheet | E5, E7 |
| `src/components/lists/facts-list.tsx`, `term-list.tsx`, `inline-list.tsx`, `bullet-list.tsx`, `subhead.tsx` | Sheets → Lists | E5, E7 |
| `src/components/drawings/drawing-figure.tsx`, `primitives.tsx`, `geometry/*.ts` | Drawing figure shell; `drawing-node`, `drawing-node-replaced`, `drawing-proof`, `drawing-construction`, boundary, arrowhead; geometry shared with the OG card | E5 |
| `src/components/drawings/cyberrock-drawing.tsx` | CyberRock, wide and tall | E5 |
| `src/components/drawings/quest-migration-drawing.tsx`, `botmivivi-ledger-drawing.tsx` | Quest, botmivivi, wide and tall | E8 |
| `src/components/video-facade/video-facade.client.tsx` | Video facade | E7 |
| `src/components/experience/experience-rows.tsx`, `house-rules/house-rules-list.tsx`, `inventory/inventory-groups.tsx`, `afk/afk.tsx` | Experience, House rules, Inventory, AFK | E9 |
| `src/components/about/about-block.tsx`, `avatar-figure.tsx` | About block and the avatar in its mat | E9 |
| `src/components/contact/contact-block.tsx`, `resume-link.tsx` | Contact (facts list); the Résumé link, rendered only when the PDF exists | E9, E10 |
| `src/components/seo/json-ld.tsx`, `og/og-card.tsx` | JSON-LD script; the social image card | E11 |
| `src/components/resume/resume-document.tsx` | A4 print layout; pure React with no `next/*` imports | E10 |
| `public/<résumé file>.pdf`, `resume.lock.json` | The committed PDF; the SHA-256 of its sources, which `resume:check` compares | E10 |
| `assets/fonts/source/Archivo[wdth,wght].ttf`, `OFL.txt` | Pinned source font (google/fonts `95f4904`), not served | E2 |
| `src/content/schema/*.ts` | Zod schemas per domain, and shared primitives (`YearMonth`, `Period`, `HttpsUrl`, `NonEmpty`) | E3 |
| `src/content/{site,identity,projects,experience,house-rules,skills,about,interests,contact,sections}.ts` | Typed facts (§3) | E3 |
| `src/content/copy.ts` | Approved UI copy, copied from `info.md` → Approved copy; fields added per phase | E4 onward |
| `src/content/drawings.ts` | Captions, step lists and labels for the bench and the three drawings | E4 to E8 |
| `src/lib/format/{typography,period,number,file-size}.ts` | Curly quotes and `…`; periods; `Intl.NumberFormat('en-US')`; size hints | E3 |
| `src/lib/content/facts.ts` | Builds the present-only facts-list rows | E3 |
| `src/lib/theme/{theme-script,preference}.ts` | Script string; preference rules | E4 |
| `src/lib/handshake/machine.ts` | Bench reducer | E6 |
| `src/lib/seo/{metadata,json-ld}.ts` | Metadata and JSON-LD builders | E11 |
| `src/lib/resume/model.ts` | Résumé view model, selected from content | E10 |
| `src/styles/tokens.generated.css`, `tokens.generated.json` | `design.md export --format css-tailwind` and `--format dtcg` | E2 |
| `src/styles/theme.generated.css` | Parser-generated: dark swap, type utilities, font re-pointing, focus ring (§4.2) | E2 |
| `src/styles/theme.supplement.css` | Hand-mapped from DESIGN.md prose: clamps, motion, breakpoints, container sizes, layer, strokes, scroll margin (§4.2) | E2 |
| `src/styles/theme-reset.css`, `print.css` | Removes Tailwind's default scales; résumé `@page` and print rules | E2, E10 |
| `src/assets/fonts/*`, `src/assets/og/*` | Subset woff2 and manifest; static TTF instances | E2 |
| `src/assets/images/ava.png` | The owner's original, moved byte for byte (SHA-256 checked) | E9 |
| `tests/unit/*.test.ts` | `architecture` (E1); `tokens`, `font-coverage` (E2); `content`, `traceability`, `privacy`, `format`, `facts` (E3); `theme` (E4); `handshake-machine` (E6); `resume-model`, `resume-pdf` (E10); `metadata`, `json-ld` (E11) | per phase |
| `tests/e2e/*.spec.ts` | `fixtures` (a console error or page error fails the test), `smoke`, `budget` (E1); `a11y`, `layout`, `keyboard`, `theme`, `no-js` (E4); `sheets`, `drawings` (E5 onward); `handshake` (E6); `video-facade` (E7); `sections` (E9); `seo` (E11) | per phase |

`qa-reviewer` owns the verification matrix. The tests above are the implementer's checks-first files for each phase.

## 3. Content model

### 3.1 Principles
- **One module per `info.md` section.** Data is written `as const satisfies` the schema input, then parsed at module load, so invalid content fails `next build` with the Zod path.
- **Verbatim strings:**
  - Text is stored exactly as in `info.md`. Typography (curly quotes, `…`) is applied at render by `format/typography.ts`, so stored text stays comparable to `info.md`.
  - "Name — description" strings are stored as `{ term, description }`, both fragments verbatim, and render as a term list.
  - Middot strings are stored as arrays and render as inline lists (directions §3; DESIGN.md → Sheets → Lists).
- **Values and formatting:**
  - Periods are `YYYY-MM` strings, with `'present'` for an open end. The display format is copy row 11. `format/period.ts` supports both candidates.
  - Numbers are stored as numbers and rendered with `Intl.NumberFormat('en-US')` (ruling: 2,951).
  - Names carry their language: `{ text: 'Hồ Trọng Đại', lang: 'vi' }`.
- **Approved copy:**
  - Approved UI copy lives in `copy.ts`, copied verbatim from `info.md` → Approved copy.
  - Its fields are required, so a phase that renders a string cannot build until the owner approves it. No placeholders.
- **Section registry:** `sections.ts` lists sections in DESIGN.md's order, with stable ids (`quest-journal`, `experience`, `house-rules`, `inventory`, `about`, `afk`, `contact`), labels and a derived `present` flag. The nav and the page both read it, so a missing section can't leave a dangling link.

### 3.2 Mapping
| `info.md` | Module | Contents (*optional*) |
|---|---|---|
| Identity | `identity.ts` | Brand "TiDi"; the Vietnamese name with `lang`; the résumé name; the alias for the bio; role; positioning; tagline; since 2020; trait; current field; avatar file and alt. Location is kept out: no opt-in (contrib-design §1.5) |
| Goals & audience | `site.ts` | The primary CTA target (`#contact`) |
| About | `about.ts` | Bio (2 paragraphs); résumé summary (used by the PDF only); sign-off; Leveling up; education; languages; certifications |
| About → House rules | `house-rules.ts` | Intro lines; the four rules in the owner's order |
| Experience | `experience.ts` | Employer; title; *project role*; period; project references; *responsibilities*; *technologies* |
| Projects, and Experience → NFQ projects | `projects.ts` | id; name; kind (full or compact); status; *period* (Scania has none); lede; role (list); *team*; *scale*; *usage figures* (after copy row 10); built items (bullets or terms); stack; *achievements*; *Party lead*; *link* (Lemonswan only); *video* (Quest only: id, title); *drawing* reference |
| Skills & tools | `skills.ts` | The five profile groups; *résumé extras* (the PDF only) |
| Interests | `interests.ts` | The AFK list (profile source, copy row 14) |
| Contact & links | `contact.ts` | Only the opted-in channels: email tidi.dev1321@gmail.com, Telegram, GitHub. The second email and the phone number are in no module |
| Site preferences | `site.ts` | Canonical `https://daiho.dev`, `lang: 'en'`, the résumé file name (copy) |
| Not included | none | The privacy test forbids known values |

### 3.3 Absent optional fields omit elements
1. **Schema:** optional keys use `.optional()`; strings use `.min(1)`; optional arrays use `.nonempty()` when present. Absence is the only way to have nothing, so an empty string can't produce an empty box.
2. **View models return present entries only:** `lib/content/facts.ts` builds facts-list rows only for present fields, and `sections.ts` computes `present`.
3. **Components** render optional parts with explicit ternaries that return `null`, never `&&` on values that can be `0`. A section with no data disappears together with its nav link.
4. **Tests:**
   - `facts.test.ts`: a fixture without team or scale yields no rows.
   - E2E: Scania has no period, CyberRock and botmivivi have no link, there are no empty `dd`, and there is no `href="#"`.

### 3.4 Guards
- **`traceability.test.ts`:** every string leaf in `src/content/` must appear in `info.md` after case, whitespace and quote normalisation. That includes URLs, numbers, and approved copy, which lives in `info.md`. Any invented or edited wording fails, which runs `portfolio-content` D continuously.
- **`privacy.test.ts`:** no module contains `[private email removed]`, a phone-number pattern, "accepting quests", reference details or the location. `contact.ts` holds exactly the three opted-in channels.
- **`content.test.ts`:** every module parses; cross-field rules hold (period order; experience references resolve; every section id is unique).

### 3.5 Copy dependencies
Rows refer to contrib-design §7.
- **Timing changes from contrib-design:**
  - E5 needs **row 11** (date format), earlier than its "project sheets" timing, because the CyberRock sheet head is in checkpoint 1.
  - E6 needs **row 5** (run, toggle, rejected verdict, step-list wording).
- **Slots engineering needs that contrib-design doesn't list:**
  - the OG image alt text
  - the résumé file name and PDF title
  - the format and size hint on the Résumé link (for example "PDF, 96 KB"), which could fold into row 3

## 4. Token pipeline

### 4.1 Flow
`DESIGN.md` → `pnpm tokens`, which runs three steps:
1. `design.md export --format css-tailwind DESIGN.md` writes `src/styles/tokens.generated.css`. It is an `@theme` block of `--color-*` (each `-dark` as its own variable), `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*`, `--radius-base` and `--spacing-*`. I read this in the exporter source on `main`, and design-lead confirmed it by running 0.4.0 (contrib-design §9).
2. `design.md export --format dtcg DESIGN.md` writes `src/styles/tokens.generated.json`. It serves TypeScript consumers that can't read CSS variables: `ImageResponse` and `viewport.themeColor`.
3. `scripts/tokens/theme.ts` writes `src/styles/theme.generated.css`, reading DESIGN.md with the package's own parser (`@google/design.md/linter`). It is needed because neither export carries `fontVariation`, `fontFeature` or components, and the dark theme is only a naming convention.

`globals.css` imports, in order: `tailwindcss`, `theme-reset.css`, `tokens.generated.css`, `theme.generated.css`, `theme.supplement.css`. Base rules come after, and use tokens only.

### 4.2 The thin mapping layer, split in two
**`theme.generated.css`** is generated from the front matter, so nothing is hand-copied:
- **Dark swap:** for every colour `X` with an `X-dark` token, `--color-X` is redeclared with the dark value in two places: under `:root[data-theme="dark"]`, and under `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`. Each place also sets `color-scheme`.
  - It uses literal values, not `var(--color-X-dark)`, because Tailwind 4.3 emits only theme variables that are used.
  - Components never use `dark:` or `*-dark` classes: themes switch by swapping tokens only.
- **Type utilities:** one `@utility type-<token>` per typography token (`type-display`, `type-heading-section`, …, `type-wordmark`). Each sets:
  - family `var(--font-archivo)`, plus size, line height, tracking and weight from the exported variables;
  - `font-stretch` from `fontVariation` (`'wdth' 125` → `125%`);
  - `font-variant-numeric` from `fontFeature` (`tnum` → `tabular-nums`, `lnum` → `lining-nums`).

  This also removes the `font-<name>` ambiguity between `--font-display` and `--font-weight-display`.
- **Font re-pointing:** `--font-<token>` is redeclared as `var(--font-archivo)` with the fallback, in `@theme inline`, so the exported family "Archivo" resolves to next/font's generated face.
- **Focus ring:** `focus-ring` and `focus-ring-dark` give 2 px width, a 2 px offset and the `focus` colour.

**`theme.supplement.css`** is hand-mapped from DESIGN.md prose (Known Gaps 1):
- the `clamp()` sizes (Typography table), overriding the exported 375 px sizes for fluid roles
- `--duration-*` (120, 150, 160, 200, 240, 360 ms) and `--ease-out`, `--ease-in-out` (Motion)
- `--breakpoint-md: 48rem` and `--breakpoint-lg: 64rem`
- `--container-bench: 480px` and `--container-drawing: 896px`, so container-query variants are tokens rather than arbitrary values
- `--z-skip-link: 100`
- drawing strokes: 1.5 px ink, 2 px proof, dash 6 4
- `scroll-margin-top: 24px` for anchor targets
- section rhythm clamps (Layout)

**`theme-reset.css`** sets Tailwind's default colour, font, text, leading, tracking, weight, radius, shadow, ease, animate, breakpoint and container namespaces, plus the numeric spacing scale, to `initial`. Only DESIGN.md tokens exist as classes.

### 4.3 Enforcement
- **`eslint-plugin-better-tailwindcss`:**
  - `no-unknown-classes`: anything that isn't a token is unknown, thanks to the reset.
  - `no-restricted-classes`: arbitrary values `[…]`, `dark:`, `*-dark`, and raw type utilities outside `type-*`.
  - `no-conflicting-classes`.
- **`tokens.test.ts`:**
  - every colour has its `-dark` twin, or is listed as theme-invariant;
  - every typography token has a `type-*` utility;
  - the supplement's clamps and Motion tokens equal the values parsed from DESIGN.md's Typography table and Motion tokens line;
  - hand-written CSS, TSX and SVG contain no hex, `rgb()`, `hsl()` or `oklch()` literals, no `ms` or `s` literals and no numeric `z-index`. The exception is `src/app/icon.svg`, whose two colours the same test pins to `primary` and `primary-dark`.
- **Checked in code review against DESIGN.md (Known Gaps 1):** breakpoints, layers and strokes.
- **SVG:** geometry (`viewBox` coordinates) is drawing data and exempt. Stroke colour uses `currentColor` from token classes; width and dash come from the supplement.

### 4.4 Sync check
- `pnpm tokens:check` regenerates the three generated files into a temp directory and byte-compares them with the committed ones. On a mismatch it exits 1 with "run pnpm tokens".
- CI runs it after `pnpm design:lint`.
- **Ruling needed:** reading DESIGN.md through the package's parser for the parts `export` drops. CLAUDE.md says tokens reach code only via `export`. This keeps every front-matter value machine-copied. Cost if wrong: the whole layer becomes hand-mapped, plus a comparison test.

## 5. Component architecture

### 5.1 Rules
- **Server-first:** Server Components by default, and every page is static.
- **Client leaves:** a client leaf is a file named `*.client.tsx` that starts with `'use client'`.
  - `architecture.test.ts` fails if `'use client'` appears anywhere else, or is missing from a `*.client.tsx` file.
  - ESLint `no-restricted-imports` in `*.client.tsx` bans `@/content/*`, `@/lib/seo/*` and `node:*`.
  - Leaves receive only small serialisable props: strings, booleans, and server-rendered icon elements.
- **Composition:** no root providers, no barrel files, no components defined inside components, no `forwardRef`, and variants as explicit components.
- **Strings:** every visible string comes from `src/content/`. `react/jsx-no-literals` is on in `src/components` and `src/app`.
- **Icons:** only DESIGN.md's ten Tabler outline icons (`IconSun`, `IconMoon`, `IconMenu2`, `IconX`, `IconExternalLink`, `IconDownload`, `IconPlayerPlay`, `IconCheck`, `IconSquare`, `IconSquareCheck`), imported per icon.
  - They are rendered in Server Components and passed to leaves as elements, so no icon code ships.
  - Square caps and miter joins come from CSS. They are 20 px, stroke 1.5 and `aria-hidden`.
- **No-JS behaviour:** one `<noscript><style>` in the head hides the theme toggle, the menu button and the bench controls, and shows the menu panel's links inline (DESIGN.md → Handshake bench and Header). Nothing is dead, and nothing shifts when JS is on.

### 5.2 Server and client map
| DESIGN.md component | Rendering | Client props |
|---|---|---|
| Page shell and section; skip link; site header and nav; footer | Server | |
| Theme toggle | **Client** (`theme-toggle.client.tsx`) | accessible name; sun and moon icons; the `surface` and `surface-dark` values |
| Menu disclosure (< 768 px) | **Client** (`menu-disclosure.client.tsx`) | accessible name; menu and x icons; the panel id |
| Hero lockup, CTA pair | Server | |
| Handshake bench | Server shell (rest state), with a **client** wrapper from E6 (`handshake-bench.client.tsx`) | step labels; run, toggle and verdict labels; icons; the drawings as `children` |
| Full sheet, compact sheet, facts, term, inline and bullet lists, subheads | Server | |
| Drawing figure shell, primitives, the three drawings | Server (static SVG, both variants in the HTML) | |
| Video facade | **Client** (`video-facade.client.tsx`) | video id, title, name, caption line, play icon |
| Experience rows, house rules list, inventory groups, AFK, about block, avatar figure, contact block | Server | |
| Résumé link | Server (a build-time `fs.stat` gives the size and whether the file exists) | |
| JSON-LD, OG card, icons | Server, at build | |

### 5.3 The client leaves
1. **Theme toggle** (`icon-button`, 44 × 44):
   - **State:** `useSyncExternalStore` over `localStorage` and `prefers-color-scheme`. The server snapshot is "light", so hydration never mismatches.
   - **Icon:** chosen by CSS from `[data-theme]` or the media query, so the right one shows before hydration.
   - **Behaviour:** `aria-pressed="true"` while dark. A click flips the effective theme and stores the choice (DESIGN.md). It also updates `<meta name="theme-color">`.
   - **Head script:** about 300 bytes, server-rendered in `<head>`. It applies a stored `light` or `dark` to `data-theme` before the body parses, and system mode is plain CSS. `suppressHydrationWarning` sits on `<html>` only.
2. **Handshake bench** (the only motion leaf; §1.3):
   - **Rest state:** the completed handshake, identical to the server HTML, so hydration changes nothing.
   - **Controls:** run (`button-primary`) always restarts from idle. The counterfeit toggle (`button-toggle`, `aria-pressed`, constant label) cancels a run and returns to idle.
   - **Readout:** a polite live region announcing "challenge", "response", then the verdict; in reduced motion, the verdict only.
   - **Behaviour:** focus stays on the pressed button. Targets are 48 px. There are no scroll listeners, and effects clean up on unmount.
   - **Variants:** compact and wide switch by container query at 480 px, and so do the controls.
3. **Video facade:**
   - **Without JS:** the server markup is a real link to the watch URL, styled as the `plate` poster.
   - **With JS:** activation swaps in `https://www.youtube-nocookie.com/embed/<id>?autoplay=1` with `title="Quest by NFQ"`. The iframe fades in (`duration-fade`), focus moves to it, and the 16:9 box doesn't shift.
   - **Privacy:** no request reaches YouTube before activation (no thumbnail, no preconnect).
   - **Referrer:** the site keeps `Referrer-Policy: strict-origin-when-cross-origin`, because YouTube embeds fail with error 153 without a referrer.
4. **Menu disclosure:**
   - A button with `aria-expanded` and `aria-controls` toggles an in-flow panel, with no overlay and no focus trap (DESIGN.md → Header).
   - Escape closes it and returns focus. Choosing a link closes it.
   - A native `<details>` can't close on Escape or on link choice, so the leaf is justified (contrib-design §4). It weighs about 0.5 KB.

## 6. SEO
- **Metadata API** (root layout, via `lib/seo/metadata.ts`):
  - `metadataBase: https://daiho.dev`, from content
  - title and description from approved copy (row 17), unit-tested at ≤ 60 and ≤ 160 characters
  - `alternates.canonical: '/'`
  - `openGraph`: `type: 'website'`, site name, locale `en_US`
  - `twitter.card: 'summary_large_image'`, with no handle because `info.md` has none
  - `robots`: index, follow
  - `viewport`: `themeColor` for light and dark from the DTCG JSON (`surface`, `surface-dark`) and `colorScheme: 'light dark'`; never `maximum-scale` or `user-scalable`
- **Social image:**
  - `opengraph-image.tsx` and `twitter-image.tsx` share `og-card.tsx`. Each file declares its own static `alt`, `size` and `contentType`, which Next parses statically.
  - The card follows DESIGN.md → Social image: light, Wafer, the lockup in `display` metrics, the role, and the completed bench drawing (wide), taken from the shared geometry module with inline token colours.
  - It uses the static Archivo instances (§1.5). Availability is verified: Google serves `wdth` 125 / `wght` 800 as TTF, and the OFL allows instancing.
- **JSON-LD** on `/` only: one `@graph` built by `lib/seo/json-ld.ts` from content, rendered as `<script type="application/ld+json">` with `<` escaped and typed with `schema-dts`.
  - `Person` (`@id` `https://daiho.dev/#person`):
    - `name` "Dai Ho Trong"
    - `alternateName`: TiDi, Hồ Trọng Đại, Daniel
    - `jobTitle`, `url`, `image` (the avatar), `email` (the opted-in address)
    - `sameAs`: GitHub, Telegram
    - `worksFor`: Sunbytes; `alumniOf`: the two schools
    - `knowsLanguage`: vi, en; `knowsAbout`: the Main group
    - no `address`, because the location isn't shown
  - `WebSite` (`#website`): name, url, `inLanguage: 'en'`, and `publisher` → Person. No SearchAction.
  - `ProfilePage` (`#profilepage`): `mainEntity` → Person.
    - **Justified:** Google lists an "About Me" page as a valid use, only `mainEntity` is required, and it ties the page to the Person entity.
    - No `dateCreated` or `dateModified`, because no reliable source exists.
- **Crawl files:**
  - `sitemap.ts` lists `/`.
  - `robots.ts` allows all and points to the sitemap. Vercel adds `X-Robots-Tag: noindex` to every preview deployment, so `robots.txt` needs no environment switch and Lighthouse SEO passes in CI.
- **Not found:** `app/not-found.tsx` (copy row 17). It returns status 404 on Vercel and `next start`, checked by E2E.
- **Icons:**
  - `icon.svg`: the bench's chip mark in `primary`, with `primary-dark` under `prefers-color-scheme: dark`.
  - `apple-icon.tsx`: 180 px, built at build time on Wafer.
  - No manifest (YAGNI).
- **Headers** (`next.config.ts` → `headers()`):
  - CSP: `default-src 'self'`; `script-src 'self' 'unsafe-inline'`; `style-src 'self' 'unsafe-inline'`; `img-src 'self' data:`; `font-src 'self'`; `frame-src https://www.youtube-nocookie.com`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`
  - `Permissions-Policy`: camera, microphone and geolocation off

  Why `'unsafe-inline'` for scripts: Next's inline flight data and the theme script need it, and a nonce CSP would force dynamic rendering. E2E asserts zero CSP violations.
- **Stable URLs:** nothing was ever deployed on daiho.dev, so there are no legacy URLs. The public URL surface is `/`, the section anchors (ids from `sections.ts`, which are keys rather than labels) and the PDF path. Changing any of them needs a ruling.

## 7. Résumé PDF

### 7.1 Approach
- **What it is:** `ResumeDocument` renders `lib/resume/model.ts`, a view model selected from `src/content/`, as A4 with light tokens, Archivo, no drawings and no photo (contrib-design §2, row 36). It adds no facts. The phone number, the second email, the reference and the availability line are excluded by construction (they aren't in content) and by test.
- **`pnpm resume:pdf`** (`scripts/resume/build.ts`):
  1. Render with `renderToStaticMarkup`.
  2. Compile the CSS with PostCSS and `@tailwindcss/postcss` from `print.css`, which imports the tokens and limits `@source` to the résumé components. The static Archivo instances are embedded as data URLs.
  3. Open the page in Playwright Chromium, run axe (0 violations), and wait for `document.fonts.ready`.
  4. Call `page.pdf({ tagged: true, outline: true, preferCSSPageSize: true, printBackground: true })`, with `@page` set to A4. The output goes to `public/<file name>.pdf`.
  5. Write `resume.lock.json`: a SHA-256 of the model JSON, the résumé component sources, `print.css`, the token files and the font files.
- **Why not `@react-pdf/renderer`:** Chromium produces a tagged PDF with an outline from semantic HTML. That makes it accessible and readable by applicant-tracking text extraction, and it shares layout and tokens with the site. react-pdf needs a second layout in its own style system and emits untagged PDFs.
- **Why not print a Next route at build:** Vercel's build image (Amazon Linux) isn't a supported Playwright host. A standalone script also avoids a public duplicate page and a full `next build` for every regeneration.

### 7.2 Staying in sync
- **One source:** the content modules.
- **Freshness gate:** CI's `pnpm resume:check` recomputes the hash. Any change to content, template, tokens or fonts without regeneration fails with "run pnpm resume:pdf".
- **Artifact test:** `resume-pdf.test.ts` extracts the committed PDF's text with `unpdf`.
  - It must contain the name (including "Hồ Trọng Đại", which also proves the fonts extract correctly), the role, and every employer and period.
  - It must contain no phone pattern, no `[private email removed]`, no "accepting quests" and no reference data.
- **No broken link:** the Résumé link (hero and Contact) renders only when the PDF exists. So nothing links to a missing file before E10, and the "PDF, N KB" hint is computed from the real file.
- **Waiting on copy:** the wording (row 15), the file name and the PDF title (§3.5).

## 8. Performance

### 8.1 Budgets
| Metric | Budget | Measured by | On miss |
|---|---|---|---|
| First-load JS, each HTML route (`/`, not found) | **≤ 120 KB gzip transfer** | `budget.spec.ts` | fail |
| App-owned client JS | ≤ 15 KB gzip (route total minus the E1 floor) | same, reported every phase | fail |
| Framework floor (bare page in E1) | expected 90–105 KB | E1 report | above 105 KB, the main session rules before E2 |
| Fonts on first load | ≤ 100 KB, one preloaded file | `budget.spec.ts` | fail |
| CSS | ≤ 20 KB gzip | `budget.spec.ts` | fail |
| Third-party requests before interaction | 0 | `budget.spec.ts` (origins) | fail |
| Lighthouse mobile, median of 3 | performance ≥ 95; accessibility, best practices and SEO = 100 | `pnpm lhci` | fail |
| LCP, CLS, TBT (lab, mobile) | ≤ 2.5 s; ≤ 0.1 (target 0); ≤ 200 ms | `pnpm lhci` | fail |
| Avatar, any served variant | ≤ 150 KB | `sections.spec.ts` | fail |

### 8.2 How the JS budget is enforced
- **The test:** Next 16 no longer prints first-load JS. So `tests/e2e/budget.spec.ts`:
  - loads each HTML route in a fresh Chromium context with the cache off, against `next start`;
  - waits for network idle;
  - sums `request.sizes().responseBodySize` over script responses (gzip, which is conservative next to Vercel's brotli);
  - asserts the budget, then does the same for fonts, CSS and request origins.
- **Where it runs:** it's part of `pnpm test:e2e`, so every phase gate and every CI run enforces it. The number is never raised without a ruling.
- **What keeps it low:**
  - four small leaves and no providers
  - no `<Link>` prefetch targets, because the page has in-page anchors and a plain PDF link
  - no analytics
  - YouTube only after activation
  - icons rendered on the server

### 8.3 Avatar (`ava.PNG`: 1086 × 1448, 3.1 MB, exactly 3:4)
- **Source file:** the unmodified original, moved to `src/assets/images/ava.png` and imported statically, so `next/image` gets its intrinsic size and nothing shifts.
- **Serving:**
  - `images.formats: ['image/avif', 'image/webp']`. Next 16's default is WebP only.
  - Quality 75, the only value Next 16 allows unless `images.qualities` changes.
  - DESIGN.md's `sizes="(min-width: 1024px) 352px, min(calc(100vw - 40px), 320px)"`, so a 2× desktop gets a variant of about 750 px instead of 3.1 MB.
- **Loading:** DESIGN.md places it in About, below the fold, and says it is never the LCP. So it uses the default `loading="lazy"`, with no preload.
- **If a layout ever puts it above the fold:** it becomes that layout's only prioritised image, with `loading="eager"` and `fetchPriority="high"`. Next 16 deprecates `priority` and its docs prefer these over `preload`.
- **Checks:** the served type is AVIF in Chromium and each variant stays within budget. An LCP observer asserts that the LCP element on `/` is hero text.

### 8.4 Fonts
- **Delivery:** §1.5. One preloaded variable woff2, `swap`, with a metric-matched fallback.
- **Known Gaps 4:** the fallback can't imitate the width axis, so display lines may change width when Archivo arrives. CLS is measured from E4 onward, with a target of 0.

### 8.5 Other
- No scroll listeners and no JavaScript layout measurement.
- Drawings are inline SVG in the server HTML, so they cost no requests.
- `content-visibility` isn't used (YAGNI).

## 9. Tooling, CI and deployment

### 9.1 Scripts
`dev`, `build` and `start` wrap `next`. The rest:

| Script | Runs |
|---|---|
| `lint` | `eslint .` then `prettier --check .` |
| `format` | `prettier --write .` |
| `typecheck` | `next typegen`, then `tsc --noEmit` |
| `test` | `vitest run`. Node environment only: the theme script is tested in a `node:vm` context with small fakes, and the reducer and builders are pure |
| `test:e2e` | `playwright test` |
| `lhci` | `lhci autorun` |
| `design:lint` | The wrapper script. CLAUDE.md's `npx @google/design.md lint DESIGN.md` stays valid; the wrapper adds the warning policy |
| `tokens`, `tokens:check`, `fonts`, `fonts:check`, `resume:pdf`, `resume:check` | Generators and freshness checks |
| `check` | Every non-browser gate, in CI order |

- Each script and its CI step arrive in the phase that creates them.
- The main session adds the new commands to CLAUDE.md → Testing & Verification during E1.

### 9.2 GitHub Actions (`.github/workflows/ci.yml`)
- **Workflow settings:**
  - triggers: pull requests, and pushes to `main`
  - `permissions: contents: read`, and no secrets
  - concurrency cancels superseded runs
  - actions pinned to commit SHAs
- **Job `checks`** (ubuntu-latest, Node 24, pnpm from `packageManager`, pnpm store cache):
  1. `pnpm install --frozen-lockfile`
  2. `design:lint`, then `tokens:check`, then `fonts:check`
  3. `lint`, then `typecheck`, then `test`
  4. `resume:check`
- **Job `build-e2e`** (runs in parallel):
  1. install, then `build`
  2. install the Playwright browsers (chromium, webkit), cached by version
  3. `test:e2e`, which includes axe in both themes and the budget spec
  4. `lhci`
  5. upload the Playwright report and `.lighthouseci` as artifacts, never to public storage
- **Gate:** both jobs must be green on a commit before its staged deployment can be promoted.

### 9.3 Vercel
- **Project:**
  - Git integration with the GitHub repository
  - Next.js preset, Node 24.x from `engines`
  - install with `pnpm install --frozen-lockfile` (pnpm 10 is detected from lockfile 9.0), build with `pnpm build`
  - no environment variables
  - Web Analytics and Speed Insights stay off
- **Previews:** every push to a branch other than `main` gets a `*.vercel.app` preview, protected by Vercel Authentication. Vercel adds `X-Robots-Tag: noindex` automatically.
- **Production:**
  - `main` is the production branch, with **Auto-assign Custom Production Domains off**, so every build of `main` is Staged.
  - Promotion (dashboard "Promote", or `vercel promote <url>`, with no rebuild) happens only after three things: CI is green on that commit, the release audit passes, and the owner approves.
  - Recovery: Instant Rollback to the previous production deployment.
- **Why not Vercel Deployment Checks:** they require automatic aliasing to be on, so every merge that passed checks would release. Staging keeps the owner's explicit release gate.
- **Plan:** Hobby is for non-commercial use only, and Vercel counts "advertising the sale of a product or service" as commercial. Pro costs $20 a month per seat. Owner decision (§12).

### 9.4 DNS at Cloudflare
The owner performs these steps after approval.

**In Vercel:** add `daiho.dev` and `www.daiho.dev`, and set `www` to redirect with a 308 to the apex, which is the canonical host.

**In Cloudflare DNS for `daiho.dev`**, with proxy status **DNS only** and TTL Auto:

| Type | Name | Content | Note |
|---|---|---|---|
| A | `@` | the value on the Vercel domain card (usually `76.76.21.21`) | Remove other A and AAAA records on `@` |
| CNAME | `www` | the project-specific target on the card (e.g. `<hash>.vercel-dns-017.com`; generic `cname.vercel-dns-0.com`) | Remove other records on `www` |
| CAA | `@` | `0 issue "letsencrypt.org"` | Only if a CAA record already exists |
| TXT | `_vercel` | the value Vercel shows | Only if Vercel asks for verification |

- **Email:** leave MX and TXT records alone. The shown email is a Gmail address, so nothing is needed.
- **Why DNS only:** Vercel issues the certificate itself. With Cloudflare's proxy on, Vercel's guide requires SSL mode Full and may still need DNS only to verify, so DNS only is simpler.
- **HTTPS:** `.dev` is on the HSTS preload list, so the domain serves nothing until the certificate is issued, a few minutes after DNS resolves.
- **Verify with:**
  - `vercel domains inspect daiho.dev` → valid configuration
  - `dig +short daiho.dev A`
  - `curl -I https://daiho.dev` → 200
  - `curl -I https://www.daiho.dev` → 308 to `https://daiho.dev/`

### 9.5 Approval gates
Each of these needs the owner's approval, relayed by the main session:
- creating the GitHub repository and choosing its visibility, and every push;
- creating the Vercel project and choosing its plan;
- the DNS changes at Cloudflare;
- promoting a staged deployment to production.

Everything else follows the phase workflow.

## 10. Phases
Each phase's gate is the full `verification` run (every command that exists by then), plus the checks listed. One implementer; phases run in this order.

### E1 · Foundation
- **Goal:** a verified toolchain and an empty shell, with every gate command in place and passing.
- **Deliverable:**
  - a local git repository, and the scaffold from §2 with no template content
  - all configs, the CI workflow, the console-error fixture, the budget spec and the architecture test
  - the shell: `<html lang="en">`, `dynamic = 'error'` and an empty `main`. It holds no text, so no placeholders
- **Acceptance (evidence):**
  - install: `pnpm install --frozen-lockfile` shows no unexplained peer warnings
  - `pnpm lint`: 0 problems
  - `pnpm typecheck`: 0 errors
  - `pnpm test`: passes
  - `pnpm build`: every route static (○)
  - `pnpm test:e2e`: the smoke test passes with 0 console errors, and the budget spec prints the framework floor in KB (the main session confirms 120 KB or rules)
  - `pnpm lhci`: runs its assertions
  - git: `git check-ignore "DaiHo Resume.pdf"` confirms it is ignored, and the initial commit exists
- **Depends on:** plan approval; the owner's OK for the local toolchain (§12).
- **Review:** `qa-reviewer` code review. No checkpoint.

### E2 · Tokens and fonts
- **Goal:** DESIGN.md tokens and Archivo reach code only through generators, and the sync checks bite.
- **Deliverable:**
  - the generated token CSS and JSON, `theme.generated.css`, the supplement and the reset
  - the font subset, static instances and manifest
  - token-only lint
- **Acceptance (evidence):**
  - `pnpm design:lint`: 0 errors and 0 warnings
  - `pnpm tokens:check`: exits 0, and exits 1 after an unregenerated DESIGN.md edit (shown in the report, then reverted)
  - `tokens.test.ts` passes, including the supplement-versus-DESIGN.md comparison
  - `pnpm fonts:check`: exits 0; the woff2 size is recorded (≤ 100 KB)
  - `font-coverage.test.ts` passes on `info.md`
  - lint: `bg-red-500` and `p-[13px]` fail it (shown)
  - the shell renders `page` tokens in both themes; axe shows 0 violations in light and dark
- **Depends on:** E1; rulings on §4.4 and the font source (§12).
- **Review:** code review.

### E3 · Content layer
- **Goal:** every `info.md` fact the site uses exists exactly once, typed and validated.
- **Deliverable:** `src/content/*`, the schemas, `lib/format/*`, `lib/content/facts.ts`, the section registry and their tests.
- **Acceptance (evidence):**
  - the report maps each `info.md` section to its module
  - `pnpm test` passes: content, traceability, privacy, format and facts
  - an unsourced string makes the traceability test fail (shown)
  - invalid content fails the build with a readable Zod path (shown, then reverted)
  - font coverage passes on the content modules
- **Depends on:** E1.
- **Review:** code review, plus a content check (`portfolio-content` C).

### E4 · Shell and hero (first visual milestone, part 1)
- **Goal:** the first viewport in both themes, accessible, with the bench in its rest state.
- **Deliverable:**
  - skip link, header and nav, menu disclosure, theme toggle and head script, `<noscript>` style, footer, section wrapper
  - the hero lockup and CTA pair
  - the bench's static rest state: `plate`, both drawing variants, the readout "genuine" with `check`, and the caption. Controls and the step list arrive in E6, so no button is ever dead.
- **Checks first:** the `smoke`, `a11y`, `layout` (320, 375, 768, 1024, 1440 and 1920 px × light and dark), `keyboard`, `theme` and `no-js` specs; `theme.test.ts`.
- **Acceptance (evidence):**
  - structure:
    - one `h1` holding TiDi, Hồ Trọng Đại (`lang="vi"`) and Dai Ho Trong
    - all landmarks present
    - the skip link is the first Tab stop and moves focus to `main`
    - a visible focus ring on every control
  - theme:
    - a stored dark theme is dark at the first frame (probed with `addInitScript` and the first `requestAnimationFrame`)
    - the toggle persists across reloads, with `aria-pressed` correct after hydration
    - `color-scheme` and `theme-color` follow the theme
    - 0 hydration warnings
  - menu:
    - opens and closes from its button
    - Escape closes it and returns focus
    - choosing a link closes it
    - without JS, the links are visible and the button is hidden
  - bench:
    - the variant switches at a 480 px container width
    - with JS off, the server HTML holds all hero text and the rest state
  - quality bars:
    - no horizontal overflow at the 6 widths
    - axe 0 in both themes
    - the budget spec passes; `pnpm lhci` passes; CLS is 0
  - screenshots: 375, 768 and 1440 × both themes
- **Depends on:** E2 and E3; copy rows 1–4 and 6 approved.
- **Review:** code review and UI audit. Checkpoint 1 follows E5.

### E5 · Sheet anatomy and the CyberRock drawing (first visual milestone, part 2)
- **Goal:** the parts contrib-design §6.1 requires before checkpoint 1: the sheet language and the drawing grammar, proved on CyberRock.
- **Deliverable:**
  - full sheet, sheet head, facts list, bullet list, subheads
  - the drawing figure shell and primitives, with geometry modules
  - the CyberRock drawing (wide and tall) with its text alternative
  - the Quest journal section
- **Acceptance (evidence):**
  - sheet: renders only present slots (no link; the period shown per row 11)
  - drawing: one proof and labels ≥ 14 px; the wide variant shows at a plate inner width ≥ 896 px, the tall one below it
  - text alternative: a visible `figcaption` and a visually hidden `ol`, with each SVG `aria-hidden`
  - copy: traceability passes for every label
  - quality bars: no overflow at 320 px; axe 0 in both themes; the budget passes; the 6 × 2 matrix is captured
- **Depends on:** E4; copy rows 7 and 11.
- **Review:** code review and UI audit. **Design checkpoint 1** (contrib-design §6.1) covers E4 and E5. A `perf-seo-audit` milestone checks the framework, fonts and CLS early. If one review pass can hold both, the main session may merge E4 and E5.

### E6 · Signature: run the handshake
- **Goal:** the bench as DESIGN.md specifies, in every mode.
- **Deliverable:** `machine.ts`, `handshake-bench.client.tsx`, `bench.css` keyframes, the controls, the live region and the step list.
- **Checks first:** reducer tests (every transition, including interrupt, toggle-cancel, rejected and instant); `handshake.spec.ts` on chromium and webkit.
- **Acceptance (evidence):**
  - genuine run: a keyboard-only run ends "genuine", the live region passes through each step, and it takes about 1,080 ms
  - rejected run: with the toggle pressed (`aria-pressed`, icon swap, constant label), the run ends in the rejected verdict with one shake, in about 600 ms
  - interruptions: a run during a run restarts; the toggle during a run returns to idle
  - reduced motion: after a run, `document.getAnimations()` is empty, numerals 1 and 2 show, and only the verdict is announced
  - with JS off: the rest state shows and no controls render
  - animations touch only `transform` and `opacity`
  - CLS during a run is 0; targets are ≥ 44 px
  - the budget passes, and the report states app-owned JS
- **Depends on:** E5; copy row 5.
- **Review:** code review and UI audit. `design-lead` is consulted on timing, with no formal checkpoint.

### E7 · Remaining sheets and the video facade
- **Goal:** botmivivi and Quest @ NFQ Asia (full sheets), Lemonswan and Scania (compact), and the video facade.
- **Acceptance (evidence):**
  - term lists and inline lists render verbatim fragments; traceability passes
  - Scania has no period; only Lemonswan has a link (same tab, with `external-link`); there are no empty `dd`
  - usage figures are grouped en-US
  - video: 0 requests to youtube, ytimg or googlevideo before activation (network log); activation loads the nocookie iframe with its title and moves focus to it; with JS off, it is a link to the watch URL
  - quality bars: axe 0 in both themes; no overflow at the 6 widths; the budget passes
- **Depends on:** E6; copy rows 10–12 and 16.
- **Review:** code review and UI audit.

### E8 · Remaining drawings
- **Goal:** the Quest migration and botmivivi ledger drawings, wide and tall, with text alternatives.
- **Acceptance (evidence):**
  - each drawing follows the grammar (one proof; replaced nodes dashed; boundary as specified)
  - variants switch at 896 px
  - labels are ≥ 14 px, and none reach beyond `info.md` (traceability)
  - the token test finds no raw colours
  - no overflow at 320 px; axe 0
- **Depends on:** E7; copy rows 8 and 9.
- **Review:** code review and UI audit.

### E9 · Remaining sections
- **Goal:** Experience, House rules, Inventory with Leveling up, About with the avatar, AFK and Contact.
- **Acceptance (evidence):**
  - content traces to `info.md`
  - avatar:
    - the visible caption is the owner's alt text and the `img` has `alt=""` (row 13)
    - AVIF is served within budget, lazily, at its intrinsic size (CLS 0)
    - `sizes` matches DESIGN.md at 375, 768 and 1440 px
  - links:
    - `mailto:` and `t.me` links are well formed
    - external links return 2xx or 3xx
    - nav links resolve to existing ids
  - quality bars: axe 0; no overflow; the budget passes
- **Depends on:** E7; copy rows 13 and 14.
- **Review:** code review and UI audit.

### E10 · Résumé PDF
- **Goal:** a new, accessible résumé generated from content that can't go stale.
- **Acceptance (evidence):**
  - `pnpm resume:pdf` writes an A4 PDF (tagged, outlined, fonts embedded) and the lock
  - `pnpm resume:check` passes, and fails after a content edit without regeneration (shown)
  - `resume-pdf.test.ts` passes
  - axe shows 0 violations on the résumé HTML
  - the Résumé links appear with their format and size hint and download the file
- **Depends on:** E2 and E3; copy row 15 plus the file name and title.
- **Review:** code review, plus a content check of the PDF.

### E11 · SEO, metadata and not found
- **Goal:** complete metadata, social previews, structured data, crawl files, the not-found page and headers.
- **Checks first:** `metadata.test`, `json-ld.test` and `seo.spec`.
- **Acceptance (evidence):**
  - the title is ≤ 60 characters, the description ≤ 160, and the canonical is `https://daiho.dev/`
  - OG and Twitter tags point to a 1200 × 630 PNG with alt text
  - JSON-LD parses, every Person value traces to `info.md`, and there is no address
  - `/sitemap.xml` and `/robots.txt` are correct
  - `/does-not-exist` returns 404 with the custom page
  - the icons and `theme-color` are present
  - the security headers are present, with 0 CSP violations
  - Lighthouse SEO is 100
- **Depends on:** E9; copy row 17 and the OG alt text.
- **Review:** code review and the SEO part of `perf-seo-audit`.

### E12 · Pre-release hardening
- **Goal:** every budget met and measured on the production build.
- **Acceptance (evidence):**
  - `pnpm lhci` (mobile, median of 3) meets CLAUDE.md's numbers, and the LCP element is named
  - the budget spec passes, with the numbers reported
  - 0 third-party requests before interaction
  - the full E2E suite is green on chromium and webkit
  - `pnpm check` is green
- **Depends on:** E11.
- **Review:** release `perf-seo-audit`, UI audit and content verification. **Design checkpoint 2** (contrib-design §6.2).

### E13 · Deployment and release
- **Goal:** a verified preview, then the domain live on the owner's approval.
- **Acceptance (evidence):**
  - repository and CI: the repository is pushed (with approval) and CI is green on GitHub
  - preview: the preview renders and carries `X-Robots-Tag: noindex`
  - staging: the production build is staged
  - DNS: the records match §9.4, `vercel domains inspect` reports a valid configuration, and the certificate is issued
  - release: after the owner's approval, the deployment is promoted; `curl -I https://daiho.dev` returns 200 and `www` returns 308; a Lighthouse spot check runs on production
- **Depends on:** E12; the owner's approvals (repository, Vercel plan, DNS, promotion).
- **Review:** the main session's final verification.

## 11. Risks

| # | Risk | Mitigation | Phase |
|---|---|---|---|
| 1 | The Next 16.3 and React 19.3 framework floor is above 105 KB | Measured in E1; the main session rules before E2; never raised silently | E1 |
| 2 | ESLint 9 is past end of life, and future plugins may drop it | Development only, exact pins; upgrade when vercel/next.js#89764 closes | E1 |
| 3 | TypeScript 6.0's defaults (`types: []`, `noUncheckedSideEffectImports`) clash with Next's generated config | Explicit `tsconfig.json`, verified in E1 | E1 |
| 4 | Hand-mapped supplement values drift from DESIGN.md prose | `tokens.test.ts` parses the Typography and Motion tables; everything else is checked in code review (Known Gaps 1) | E2 |
| 5 | `@google/design.md` is alpha, and its output changes on upgrade | Exact pin; `tokens:check` shows any change | E2 |
| 6 | The subset exceeds 100 KB, or HarfBuzz instancing misbehaves | Measured in E2; fall back to `next/font/google` (§1.5) with a ruling | E2 |
| 7 | Copy approval lags, and the schema blocks the phase | Two batches following contrib-design §7, with rows 5 and 11 moved earlier (§3.5) | E4 onward |
| 8 | `animationend` sequencing differs in WebKit | E2E on webkit, reducer tests, a WAAPI fallback (0 KB) | E6 |
| 9 | Screen readers merge fast live-region updates, so steps are missed | VoiceOver check in E6; if needed, announce one summary at the verdict (with `design-lead`'s OK) | E6 |
| 10 | The committed PDF goes stale, or its reading order is poor | Hash lock in CI, text test, axe on the source HTML, manual check at release | E10 |
| 11 | The CSP needs `'unsafe-inline'` for scripts | Accepted: static pages, no user input. A nonce CSP would force dynamic rendering | E11 |
| 12 | LHCI bundles Lighthouse 12.6.1 while PageSpeed Insights runs 13.x | The release audit also runs `npx lighthouse@13.5.0` for comparison | E12 |
| 13 | Vercel's Hobby terms versus a client-facing CTA | The owner chooses the plan before E13 | E13 |
| 14 | Repository visibility exposes non-public data: `info.md` holds the second email, and `DaiHo Resume.pdf` the phone number and a reference | A private repository is recommended; `DaiHo Resume.pdf` is never committed | E1 |
| 15 | The `<noscript>` style inside the head renders differently under React 19 hydration | The `no-js` spec and a check of the hydrated DOM in E4 | E4 |

## 12. Open decisions

**For the owner:**
1. **Vercel plan:** Hobby is free, but for non-commercial use only; the "bring me your pain point" CTA to clients may count as advertising a service. Pro costs $20 a month. Needed by E13.
2. **GitHub repository visibility:** private is recommended, because `info.md` holds data not meant for publication. Public would showcase the code, but those files would first have to be kept out. Needed by E1 (the first push, not git init).
3. **Local toolchain:** install pnpm 10.34.5 (this machine has 8.15.5) and preferably Node 24 LTS (it has 22.13.0, which every tool supports, but CI and Vercel use 24). Needed by E1.
4. **DNS:** who makes the Cloudflare changes (the owner, or someone the owner grants access), and approval of the `www` → apex redirect. Needed by E13.

**Rulings for the main session** (format `Ruling: what — why — cost if wrong`):
1. Archivo through `next/font/local` from the pinned OFL source, instead of DESIGN.md's `next/font/google` or Fontsource. Google's and Fontsource's subsets lack U+2192, which DESIGN.md's own Quest caption uses; the typeface is identical. Cost if wrong: switch to `next/font/google` and accept a fallback arrow. `design-lead` updates DESIGN.md's source line; nothing changes visually.
2. The theme layer is generated from the front matter by the package's own parser; only the prose-only values are hand-mapped, with a test. This keeps every value in the front matter machine-copied. Cost if wrong: the layer becomes fully hand-mapped.
3. ESLint 9.39.5 past end of life, TypeScript 6.0.3, pnpm 10.34.5: the verified compatibility set. Cost if wrong: a toolchain bump, about half a day.
4. The résumé is printed by Chromium and committed with a hash lock, instead of `@react-pdf/renderer` generating it during the build. The Chromium PDF is tagged and shares the site's tokens. Cost if wrong: a second layout in react-pdf.
5. Client leaves follow the `*.client.tsx` convention with lint and test guards, instead of `server-only`. Cost if wrong: add `server-only` and aliases in Vitest and tsx.
6. Checkpoint 1 follows E5, so that E4 and E5 form the first visual milestone that contrib-design §6.1 requires. Cost if wrong: merge E4 and E5 into one larger review.

**Ideas, not in scope:** the theme toggle could clear the stored choice when a visitor picks the OS theme, so the site follows the OS again. It's a behaviour change, so it's `design-lead`'s call.

## 13. Sources
- Next.js 16.3.6 docs: [static exports](https://nextjs.org/docs/app/guides/static-exports), [upgrading to 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [Image](https://nextjs.org/docs/app/api-reference/components/image)
- Tailwind CSS 4.3: [theme variables](https://tailwindcss.com/docs/theme), [dark mode](https://tailwindcss.com/docs/dark-mode)
- `@google/design.md` source: [export command](https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/commands/export.ts), [Tailwind v4 serializer](https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/linter/tailwind/v4/serialize.ts), [DTCG handler](https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/linter/dtcg/handler.ts), [unknown-key rule](https://github.com/google-labs-code/design.md/blob/main/packages/cli/src/linter/linter/rules/unknown-key.ts)
- ESLint: [version support](https://eslint.org/version-support/); Next.js issue [#89764](https://github.com/vercel/next.js/issues/89764)
- TypeScript: [6.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- Vercel: [custom domain](https://vercel.com/docs/domains/set-up-custom-domain), [A record and CAA](https://vercel.com/kb/guide/a-record-and-caa-with-vercel), [promoting deployments](https://vercel.com/docs/deployments/promoting-a-deployment), [Deployment Checks](https://vercel.com/docs/deployment-checks), [preview indexing](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines), [package managers](https://vercel.com/docs/package-managers), [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [fair use](https://vercel.com/docs/limits/fair-use-guidelines), [pricing](https://vercel.com/pricing)
- [Playwright `page.pdf`](https://playwright.dev/docs/api/class-page#page-pdf); [Google ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page); [Motion bundle sizes](https://motion.dev/docs/react-reduce-bundle-size); [YouTube error 153](https://til.simonwillison.net/youtube/fixing-153-embed)
- Measured on 2026-09-28: the Google Fonts CSS2 API for Archivo (subset sizes, `unicode-range`s, the U+2192 cmap check); [Fontsource wdth.css](https://unpkg.com/@fontsource-variable/archivo@5.3.0/wdth.css); google/fonts [ofl/archivo](https://github.com/google/fonts/tree/main/ofl/archivo); [Node release index](https://nodejs.org/dist/index.json)
