# Plan contribution v2: engineering

> Author: `frontend-engineer`, 2026-09-28, for the v2 `implementation-plan.md` (`implementation-plan` skill, engineering section).
> **Status: draft. The plan is not approved.** Nothing was scaffolded, installed or initialised. The only commands run were `npm view`, read-only fetches, and reads of the v1 code in git history (`e74b1cb^`).
> **Inputs:**
> - `info.md`, including the v2 Approved copy rows
> - `CLAUDE.md` (2026-09-28: performance, Lighthouse, SEO and the privacy scan are out of scope)
> - `docs/design/directions-v2.md`: §3 shared rules and tech, §5 B · Holo Deck, §12 selection record
> - `docs/design/directions-v2-preview.html`
> - `docs/plan/v2/contrib-verification.md`: spec list, phase IDs B1 to B6, T and F
> - v1: `docs/plan/contrib-engineering.md`, `docs/reports/phase-06-engineering.md` and `phase-10-engineering.md`
>
> **`DESIGN.md` has not landed.** Token, component and motion names below come from directions §5 and are **provisional**, marked *(prov.)*. When `DESIGN.md` lands, its names win and this file is renamed to match at assembly.
> Decisions only: no code bodies.

## 0. Decisions at a glance

| Area | Decision | Why |
|---|---|---|
| Framework | Next.js 16.3.6 App Router. Every route is prerendered. The root layout sets `dynamic = 'error'`. Default output, not `output: 'export'` | `next/image` keeps optimising the 3.1 MB avatar. Hosting is decided later, and a switch to export is small (§9.3) |
| 3D | three 0.186.1 + @react-three/fiber 9.8.1 + drei 10.7.9. Bloom from @react-three/postprocessing 3.1.3, in the dark theme only. Two canvases: the hero, and the Quest journal viewport | Directions §3 and §5. R3F makes each scene a declarative client island with cleanup built in |
| DOM motion | CSS plus one IntersectionObserver leaf for reveals. **Motion 13.4.4** (`LazyMotion` + `m`) only in the Quest journal, for the quest-file swap and the "Quest unlocked" toast. **No GSAP** | Reveals need to be HTML-first (content visible without JS), which CSS gives. Motion earns its place where exit animations and interruptible springs are needed. No sequence needs a GSAP timeline, and GSAP's licence is not OSI |
| Handshake | A pure reducer (reused from v1, extended with an autoplay guard). A timer schedule in the hero island drives both the HTML log and the 3D scene | One source of truth. The HTML story runs the same with or without WebGL |
| Content | Typed modules in `src/content/`, validated by Zod 4.6.5 at build. Restored from v1 and extended with the v2 rows | Proven in v1. Invalid content fails the build |
| Tokens | `@google/design.md export`: `css-tailwind` → CSS and `dtcg` → JSON for three.js colours. A thin hand-written `theme.css` holds the dark swap, type utilities, chamfer, motion, z-scale and glow | The `frontend-build` contract. The JSON lets scenes use tokens without literal hex values |
| Fonts | Chakra Petch 500/600/700 and Mona Sans variable (`wdth` 75–125, `wght` 200–900). Project subsets built from google/fonts OFL sources, loaded with `next/font/local` | The Fontsource and Google subsets both **omit U+2192 "→"**, which owner strings use ("DynamoDB → MySQL", "v1 → v2"). Verified today (§1.3) |
| Résumé | v1 approach: a React print layout printed by Playwright Chromium to a tagged A4 PDF, committed with a source-hash lock | It worked in v1: tagged PDF, text extracts cleanly, cannot go stale unnoticed |
| Tests | Built in the last phase only (owner build mode): one Vitest file and QA's Playwright specs, against the production build | Owner: static checks per phase, and a lean suite once at the end |
| Git and hosting | Local git from Phase 1, conventional commits. No remote, no CI workflow, no host config | Owner: local git only; hosting decided later |

## 1. Stack

### 1.1 Versions (`npm view`, 2026-09-28)
All pinned exactly; the lockfile is committed.

| Package | Version | Licence | Role |
|---|---|---|---|
| `next` | 16.3.6 | MIT | App Router, static prerendering, `next/font/local`, `next/image`, `next/dynamic` |
| `react`, `react-dom` | 19.3.0 | MIT | Within R3F's peer range `>=19 <19.4` |
| `three` | 0.186.1 | MIT | Renderer |
| `@types/three` | 0.186.0 | MIT | Types |
| `@react-three/fiber` | 9.8.1 | MIT | React renderer for three (peers: react <19.4, three ≥0.156) |
| `@react-three/drei` | 10.7.9 | MIT | Helpers: `Instances`, `shaderMaterial`. No `Html` (text never lives in the canvas) |
| `@react-three/postprocessing` | 3.1.3 | MIT | `EffectComposer` and `Bloom`, hero canvas only |
| `postprocessing` | 6.39.5 | Zlib | Peer of the above |
| `motion` | 13.4.4 | MIT | Quest journal only (§6) |
| `@tabler/icons-react` | 3.48.0 | MIT | The one icon library, imported per icon and rendered on the server |
| `zod` | 4.6.5 | MIT | Content schema, server and build only |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.3 | MIT | Styling |
| `postcss` | 8.5.28 | MIT | Compiles the résumé CSS in its script |
| `@google/design.md` | 0.4.0 | Apache-2.0 (repository LICENSE; the manifest has no field) | `lint` and `export` |
| `subset-font` | 2.9.0 | BSD-3-Clause | Dev only: font subsets (HarfBuzz) |
| `typescript` | **6.0.3** (latest 7.0.2) | Apache-2.0 | Strict |
| `@types/react`, `@types/react-dom` | 19.3.0 | MIT | |
| `@types/node` | 24.19.0 (latest 26.6.3) | MIT | Matches the Node 24 runtime |
| `eslint`, `@eslint/js` | **9.39.5** (latest 10.11.0) | MIT | Lint |
| `eslint-config-next` | 16.3.6 | MIT | Next, React, hooks, import, jsx-a11y |
| `eslint-plugin-jsx-a11y` | 6.10.2 | MIT | Strict preset |
| `typescript-eslint` | 8.70.1 | MIT | Type-checked rules |
| `eslint-plugin-better-tailwindcss` | 4.7.0 | MIT | Token-only classes |
| `eslint-config-prettier` | 10.1.8 | MIT | |
| `prettier`, `prettier-plugin-tailwindcss` | 3.9.9, 0.8.1 | MIT | Format |
| `tsx` | 4.23.15 | MIT | Runs the scripts |
| `vitest`, `vite` | 5.0.2, 8.3.1 | MIT | One unit file (Phase 6) |
| `@playwright/test` | 1.63.0 | Apache-2.0 | E2E (Phase 6), and PDF printing (Phase 5) |
| `@axe-core/playwright` | 4.13.0 | MPL-2.0 | Axe in E2E, dev only |
| `unpdf` | 1.8.1 | MIT | Extracts the PDF's text for the résumé content check |
| Node.js | 24.x LTS | | `engines`, `.nvmrc` |
| pnpm | **10.34.5** (latest 12.6.0) | MIT | `packageManager` |

**Held below latest on purpose:**
- **TypeScript 6.0.3:** typescript-eslint 8.70.1 declares `typescript >=4.8.4 <6.1.0`.
- **ESLint 9.39.5:** eslint-plugin-jsx-a11y 6.10.2 declares ESLint ≤ 9. ESLint 10 would mean dropping the a11y lint.
- **pnpm 10:** the widest native host support while hosting is undecided.

**This machine today:** Node 22.13.0, pnpm 8.15.5. The owner approved installing Node 24 and pnpm 10 in v1 (O3), but it hasn't happened yet. This is a Phase 1 prerequisite (§12).

**Considered and not added:**
- `gsap`: no timeline need, and a non-OSI licence
- `next-themes`: the v1 head script is about 300 bytes and needs no provider
- `@react-pdf/renderer`: it would need a second layout, and it emits untagged PDFs
- `maath`, `leva`, `r3f-perf`: not needed
- `@react-three/a11y`: the canvases are decorative and `aria-hidden`
- the v1 `@lhci/cli`, `schema-dts` and privacy-scan scripts: out of scope per CLAUDE.md

### 1.2 Rendering
- **Prerendered:** `/` and the not-found page. Nothing reads the request, and `dynamic = 'error'` turns any request-time API into a build error.
- **Metadata:** `<title>` and the meta description only, from `meta.title` and `meta.description`. The title is needed for WCAG 2.4.2.
- **Not built** (SEO out of scope): OG images, JSON-LD, sitemap, robots and security headers. The approved `og.alt` stays in `info.md` for later.
- **Not enabled:** React Compiler, `cacheComponents`, typed routes.

### 1.3 Fonts
**Verified today:**
- Fontsource `@fontsource/chakra-petch` 5.3.0 and `@fontsource-variable/mona-sans` 5.3.0 have Vietnamese subsets. Their latin `unicode-range` covers U+2191 and U+2193, but **not U+2192**.
- The full google/fonts sources do contain "→" and all the Vietnamese letters checked: `ChakraPetch-*.ttf` (726 code points) and `MonaSans[wdth,wght].ttf` (547 code points).
- **Neither face has "▸" (U+25B8)**, which is in the approved label "▸ PLAYER 1". Mona Sans also lacks "▲" (§12, D2).

**Decision:**
- **Sources:** google/fonts at `23e54b5` (2026-09-24), with `OFL.txt` alongside:
  - `ChakraPetch-Medium.ttf`, `-SemiBold.ttf` and `-Bold.ttf`
  - `MonaSans[wdth,wght].ttf`
- **`pnpm fonts`:**
  - Tool: `subset-font`. This reuses the subset step of v1's `scripts/fonts/build.ts`, without v1's static-instance and Satori parts.
  - Output: woff2 files covering Basic Latin, Latin-1, the Vietnamese ranges, General Punctuation and U+2190–2193. Mona Sans keeps both axes.
  - It also writes a code-point manifest.
- **`next/font/local`:**
  - `display: 'swap'` and CSS variables
  - preload Chakra Petch 700 and Mona Sans only
  - Mona Sans declares `font-stretch: 75% 125%`, so the `wdth` axis works through `font-stretch`
- **`pnpm fonts:check`:** a static check.
  - It regenerates the woff2 files and compares them byte for byte.
  - It asserts that every character in `info.md` → Approved copy and in `src/content/` is in the manifest. That covers "Hồ Trọng Đại" and "→".

## 2. Project structure and file map

```text
/
├─ DESIGN.md · info.md · CLAUDE.md       inputs (engineering never edits them)
├─ assets/fonts/source/                  pinned OFL TTFs + OFL.txt (not served)
├─ public/tidi-resume.pdf                generated, committed
├─ resume.lock.json
├─ scripts/{tokens,fonts,resume}/        dev-time generators and checks (tsx)
├─ src/
│  ├─ app/                               layout, page, not-found, globals.css
│  ├─ components/<feature>/              Server Components; client leaves are *.client.tsx
│  ├─ components/holo/scenes/            the only place three / R3F may be imported
│  ├─ content/                           typed modules mirroring info.md, and schema/
│  ├─ lib/                               pure logic: format, content, handshake, theme, motion, resume
│  ├─ styles/                            generated tokens, theme.css, reset, print
│  └─ assets/{fonts,images}/
└─ tests/{unit,e2e}/                     Phase 6 only
```

| Path | Responsibility | Phase |
|---|---|---|
| `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `.gitignore` | Exact pins, scripts (§9.1), Node 24, pnpm 10. `.gitignore` keeps out `DaiHo Resume.pdf`, `.next` and test reports | 1 |
| `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` | `images.formats` AVIF and WebP; `poweredByHeader: false`. Strict TS with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and `@/*` | 1 |
| `eslint.config.mjs`, `prettier.config.mjs` | The rules in §5.1 | 1 |
| `scripts/tokens/{build,check}.ts` | Both `design.md export`s. The check regenerates to a temp directory and compares byte for byte | 1 |
| `scripts/fonts/{build,check}.ts` | Subsets, manifest and coverage (§1.3) | 1 |
| `src/styles/tokens.generated.css`, `tokens.generated.json` | Exports of `DESIGN.md` | 1 |
| `src/styles/theme.css`, `reset.css` | The thin mapping layer (§4.2). `reset.css` removes Tailwind's default scales | 1 |
| `src/assets/fonts/*` | Subset woff2 files, manifest, `OFL.txt` | 1 |
| `src/content/schema/*.ts`, `src/content/*.ts` | The content layer (§3) | 1 |
| `src/lib/format/{typography,period,number,file-size}.ts` | Reused from v1 | 1 |
| `src/lib/content/{facts,sections}.ts` | Present-only rows and the section registry, reused from v1 | 1 |
| `src/app/layout.tsx` | `<html lang="en">`, fonts, head script, `<noscript>` style, skip link, HUD strip, footer, metadata, `dynamic = 'error'` | 1, 2 |
| `src/app/page.tsx`, `globals.css` | Composes the sections from the registry. `globals.css` imports tokens, theme and reset | 1 onward |
| `src/app/not-found.tsx` | `not-found.heading` and `not-found.link` | 2 |
| `src/lib/theme/{preference,theme-script}.ts` | Reused from v1. The head script also sets `data-motion` (§6.4) | 2 |
| `src/lib/motion/preference.ts` | Stored pause choice + `prefers-reduced-motion` → `motionAllowed`; a `useSyncExternalStore` source | 2 |
| `src/components/theme/{theme-script,noscript-style}.tsx`, `theme-toggle.client.tsx`, `motion-toggle.client.tsx` | Theme and motion controls | 2 |
| `src/components/shell/{hud-strip,xp-bar,corner-brackets,site-nav,skip-link,site-footer}.tsx`, `menu-disclosure.client.tsx` | HUD frame *(prov.)*, navigation, footer | 2 |
| `src/components/ui/{section,panel,panel-heading,status-chip,icon,facts-list,term-list,inline-list,bullet-list}.tsx` | Shared presentational parts *(prov. names)* | 2, 3 |
| `src/components/hero/{hero,hero-lockup,cta-pair}.tsx` | `h1` lockup, `hero.sentence`, CTA pair | 2 |
| `src/components/hero/hero-stage.client.tsx` | Owns the handshake state, schedule and autoplay; loads the hero scene; renders the controls, log and verdict | 2 |
| `src/components/hero/{handshake-controls,handshake-log}.tsx` | Controls (`bench.run`, `bench.toggle`) and the step list with the `<output>` verdict; rendered inside the stage leaf | 2 |
| `src/lib/handshake/{machine,schedule}.ts` | Reducer with an autoplay guard; step durations from motion tokens | 2 |
| `src/components/holo/holo-canvas.client.tsx` | Shared `<Canvas>` wrapper (§5.4) | 2 |
| `src/components/holo/{holo-poster.tsx,webgl-support.ts,use-frameloop.ts,scene-error-boundary.client.tsx}` | Fallback and poster, capability check, pause logic, error boundary | 2 |
| `src/components/holo/scenes/{hero-scene,projector,chip,host-node,packets,motes}.tsx`, `cone-material.ts`, `palette.ts` | The hero hologram | 2 |
| `src/components/holo/scenes/{quest-scene,ledger-stack,data-slabs}.tsx` | Quest viewport models; the chip is shared with the hero | 3 |
| `src/components/quest-journal/{quest-journal,quest-file,compact-quest,achievements}.tsx` | Server-rendered mission list and quest files | 3 |
| `src/components/quest-journal/{quest-tabs,quest-viewport,quest-unlocked-toast}.client.tsx` | Tabs enhancement, hologram viewport, toast | 3 |
| `src/components/video-facade/{video-facade.tsx,video-facade.client.tsx}`, `src/lib/content/youtube.ts` | Reused from v1 | 3 |
| `src/components/sections/{mission-log,house-rules,inventory,leveling-up,character-stats,avatar-frame,afk,join-party}.tsx` | The remaining sections | 4 |
| `src/components/motion/reveal-observer.client.tsx` | One IntersectionObserver for panel power-on, stat rows, achievements and the level-up sweep | 4 |
| `src/assets/images/ava.png` | The owner's original, byte for byte | 4 |
| `src/components/sections/resume-link.tsx`, `src/lib/resume/{model,file}.ts`, `src/components/resume/resume-document.tsx` | Résumé link and model; A4 layout. Reused from v1 and restyled | 5 |
| `scripts/resume/{build,render,lock,check}.ts`, `src/styles/print.css` | PDF generation and lock (§7) | 5 |
| `vitest.config.ts`, `playwright.config.ts`, `tests/unit/handshake-machine.test.ts`, `tests/e2e/*.spec.ts`, `tests/e2e/fixtures.ts` | The lean suite (§8) | 6 |

## 3. Content model

**Reuse:** restore v1's content layer from `e74b1cb^`: `src/content/**`, `schema/**` and `lib/format/**`. It was built from the same `info.md` and passed a content check. Then:
- **Add the v2 rows** to `copy.ts`:
  - `heading.experience` ("Mission log") and `heading.contact` ("Join party")
  - `toast.quest-unlocked`
  - `ui.profile-labels`, split into named fields: Character stats, Class, Base, XP, Quests, Role, When, Press A to continue, progress saved, ▸ PLAYER 1
- **Add** the banner HUD strings ("XP · SYSTEM DESIGN", "LVL still leveling", "MAX not a thing") to `identity.ts`. They are verbatim in `info.md` → Visual assets.
- **Add** the Character stats rows (Class, Guild, Base, XP, Quests, Passive). Each one points to an existing fact; none is new text.
- **Add** `a11y.steps.*` as the text alternative for each hologram (bench, cyberrock, quest, botmivivi).
- **Remove** v1-only content: the drawing geometry, and the "Proof" section labels that v2 no longer uses.

**Principles kept from v1:**
- **Verbatim storage.** Typography is applied at render time. "Term — description" strings are stored as `{term, description}`, and middot strings as arrays.
- **Values:**
  - Periods are `YYYY-MM` strings, displayed per `format.period`.
  - Numbers use en-US grouping.
  - Names carry `lang` (`Hồ Trọng Đại` → `vi`).
- **Required approved copy:** copy fields are required, so a missing string fails the build. There are no placeholders.
- **Absent optional fields render nothing.** Present-only rows come from `lib/content/facts.ts`, and ternaries return `null`. Examples: Scania has no period, and only Lemonswan has a link.
- **Section registry:** stable ids `quest-journal`, `experience`, `house-rules`, `inventory`, `about`, `afk`, `contact`. Nav and page read the same list. Labels come from copy ("Mission log", "Join party").
- **Exclusion by construction:** the phone number, `[private email removed]`, the reference and "STATUS accepting quests" exist in no module. `contact.ts` holds exactly email, Telegram and GitHub, plus Location.

**Checks:**
- Zod parse at build: invalid content fails `next build` with the path.
- `fonts:check` covers glyphs.
- Content traceability is verified once, in F (`portfolio-content` D), per QA §1.3. The v1 traceability test is not restored (lean).

## 4. Tokens

### 4.1 Flow
`DESIGN.md` → `pnpm tokens`:
1. `design.md export --format css-tailwind` writes `tokens.generated.css`, the `@theme` variables.
2. `design.md export --format dtcg` writes `tokens.generated.json`. It is read by `holo/scenes/palette.ts` (three.js colours for both themes) and by `lib/handshake/schedule.ts` (durations), if `DESIGN.md` puts motion in the front matter. Otherwise see §4.2.

`pnpm tokens:check` regenerates and compares byte for byte. It is part of `pnpm check`. `pnpm design:lint` runs `npx @google/design.md lint DESIGN.md`.

### 4.2 The thin layer (`theme.css`, hand-written from DESIGN.md)
- **Dark swap:** every colour with an `-dark` twin is redeclared under `:root[data-theme="dark"]`, and under `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`, together with `color-scheme`. Components never use `dark:` classes.
- **Type utilities:** `type-*` per typography token, including `font-stretch` for Mona Sans width.
- **Shape:** the chamfer as a utility on a `::before` background layer, not on the element (§11, R4).
- **Also:** motion durations and easings, the z-index scale, glow, and focus-ring width and offset.
- **Prose-only motion values:** if `DESIGN.md` keeps motion values only in prose, they are hand-mapped here, and `schedule.ts` reads them as CSS custom properties at run time (`getComputedStyle`, once on mount), so there is still one source.

### 4.3 Provisional token names (from directions §5; `DESIGN.md` renames)
| Group | Names *(prov.)* | Directions source |
|---|---|---|
| Colour, light base with `-dark` twins | `page` (Lab / Void), `panel` (Panel / Glass), `text` (Ink / Signal), `text-muted` (Graphite / Static), `accent` (Gold fill), `accent-ink` (Gold ink / Gold), `on-accent`, `holo` (Holo teal / Holo), `genuine`, `rejected`, `focus` | Palette tables |
| Type | `type-brand`, `type-h2`, `type-panel-heading`, `type-body`, `type-stat-key` | Scale table |
| Motion | `duration-brackets`, `duration-boot`, `duration-xp`, `duration-wipe`, `stagger-panel`, `duration-unlock`, `duration-achievement`, `stagger-achievement`, `duration-level-up`, `duration-hover`, `delay-autoplay`, handshake step durations, `ease-wipe` | Motion system table |
| Shape | `chamfer`, `focus-width`, `focus-offset` | Shape; §3 quality floor |
| Layer | `z-canvas`, `z-panel`, `z-hud`, `z-toast`, `z-skip-link` | New; `DESIGN.md` to confirm |

**Enforcement** (lint, no tests):
- `better-tailwindcss`: `no-unknown-classes` (with the reset, only tokens exist) and `no-restricted-classes` (arbitrary `[...]` values and `dark:`).
- A raw-value grep in F (QA B1.2).
- **Exemption:** scene geometry (sizes, counts, speeds in scene units) is 3D data, not design tokens. Scene colours and durations must come from `palette.ts` and `schedule.ts`.

## 5. 3D architecture

### 5.1 Rules
- **Client leaves:** a client leaf is a file named `*.client.tsx`. `'use client'` appears nowhere else.
- **Where three lives:**
  - `three`, `@react-three/*` and `postprocessing` may be imported only under `src/components/holo/scenes/**`. ESLint `no-restricted-imports` enforces this.
  - Scenes are reached only through `next/dynamic(..., { ssr: false })` in a client leaf.
  - So no 3D code is in the server HTML or in the initial chunks.
- **Content stays out of client files:** client files may not import `@/content/*`. Strings arrive as props from Server Components.
- **The canvas is decorative:**
  - Every `<canvas>` wrapper is `aria-hidden`, has no focusable descendants, and never carries text.
  - Everything it shows is real HTML beside it: the step list, the verdict, the quest file and `a11y.steps.*`.
  - Text never sits on the canvas; panels and scrims carry contrast.

### 5.2 HTML-first order of events
1. **Server HTML** holds the complete hero: the `h1` lockup, `hero.sentence`, the CTAs, and the handshake log in its **rest state** (all three steps visible, verdict "genuine"). The stage shows `HoloPoster`.
   - `HoloPoster` is a CSS-only still: projector rings, a chip block and the cone, drawn with gradients from tokens. No image request, no SVG icon.
   - With JS off, a `<noscript>` style hides the handshake controls and the motion toggle, so no control is dead. The page is complete.
2. **Hydration:** the controls work at once, with or without WebGL.
3. **Capability check:** `webgl-support.ts` probes `webgl2`, then `webgl`, once. If both fail, the scene chunk is never requested and the poster stays: this is the WebGL-unavailable fallback.
4. **Load:** the scene chunk loads after hydration. The canvas mounts invisible over the poster and cross-fades in on its first rendered frame (`onCreated` + first frame), so nothing shifts.
5. **Failure paths → poster:**
   - a render error: `scene-error-boundary.client.tsx` catches it
   - a chunk-load error
   - `webglcontextlost`: `preventDefault` to allow restore; if not restored within 2 s, the canvas unmounts to the poster (QA WebGL-fallback spec b)

   None of these throws to the page.

### 5.3 Scenes
- **Hero** (`hero-scene.tsx`):
  - the projector: base disc, three counter-rotating rings, tick ring via `Instances`
  - the cone: a `shaderMaterial`, additive in dark and normal blending in light
  - motes; the chip, with 40 pins via `Instances` and a procedural die, bobbing and crossed by a scan ring
  - the gold host node with two paths; the packets
  - Bloom in the dark theme only. Procedural geometry, no model files.
- **Quest viewport** (`quest-scene.tsx`): one canvas that swaps models by the selected quest:
  - CyberRock: the shared `chip.tsx`
  - botmivivi: `ledger-stack.tsx`
  - Quest: `data-slabs.tsx`, per `depiction.holograms`

  It animates a short "project in" on a swap. No bloom (lean, and it reads fine without).
- **Theme:** scenes read the theme from the same `useSyncExternalStore` source as the toggle. A theme change swaps `palette.ts` colours and blending in place, without a remount, and requests one frame.
- **Interaction:**
  - The pointer tilts the rig.
  - Drag spins the chip horizontally only. The canvas has `touch-action: pan-y`, so a vertical swipe scrolls the page (QA mobile 3D).
  - Interaction is decorative, so there is no keyboard equivalent; the information is in HTML.
- **Resolution:** `dpr={[1, 1.75]}`, per directions §3.

### 5.4 Pausing and cleanup (`holo-canvas.client.tsx` + `use-frameloop.ts`)
- **Frameloop inputs:**
  - an IntersectionObserver on the stage wrapper (visible)
  - `visibilitychange` (tab shown)
  - `motionAllowed` (§6.4)
  - handshake activity (running)
- **The rule:**
  - visible, tab shown and motion allowed: `frameloop="always"`
  - otherwise `"demand"`, which renders only on `invalidate()` (theme swap, resize, a user-run handshake under reduced motion)
  - when not visible or tab hidden: `"never"`

  With nothing invalidated, R3F's loop stops, so off-screen rAF callbacks approach 0 (QA: ≤ 5 per second).
- **Observable state:** the wrapper carries `data-holo-stage="hero|quest"` and `data-frameloop="always|demand|never"`. These are the stable hooks QA asked for.
- **Cleanup:**
  - R3F disposes JSX-created geometries, materials and the renderer on unmount.
  - Anything created imperatively (the cone material, instanced buffers) is disposed in effect cleanup.
  - Observers, listeners and the handshake timers are removed in effect cleanup.
  - No `requestAnimationFrame` outside R3F's `useFrame`.

### 5.5 Reduced motion (and the pause toggle)
- **When `motionAllowed` is false**, the frameloop is `demand`: one still frame, with rings still and no motes, scan or bob.
- **Handshake:** "Run the handshake" dispatches an instant run. The final state is painted in one invalidated frame (chip green or red, and the colour holds), and the HTML log shows the verdict at once.
- **No autoplay** (`behaviour.handshake-autoplay`).
- **No boot sequence:** the canvas appears without the materialise pass.

## 6. Animation architecture

### 6.1 Scroll reveals (HTML-first)
- **Visible by default:** the server HTML renders every panel visible.
- **Pre-reveal state:** the head script sets `data-js` on `<html>`. CSS applies the pre-reveal state (`clip-path` inset for the power-on wipe, and opacity plus translate for stat rows and ▲ markers) **only** under `[data-js][data-motion="on"]` and `prefers-reduced-motion: no-preference`.
- **`reveal-observer.client.tsx`:**
  - one IntersectionObserver for all `[data-reveal]` elements
  - sets `data-revealed` once per element, then unobserves it; CSS transitions run from tokens, with a stagger via a `--i` index custom property set on the server
- **Failure safety:** if JS or the observer fails, content stays visible. As a belt and braces, a CSS timeout reveal also runs 3 s after `data-js` is set (QA Review Focus 2).
- **Level up:** the observer marks `#inventory`'s Leveling up block. That drives the HUD strip's single gold sweep (once per page load) and the ▲ marker rise.
- **XP bar:** a CSS animation on load, decorative and `aria-hidden`. The labels are real text, and there is no number.
- **`clip-path` wipes:** these animate a property other than transform and opacity. CLAUDE.md says DOM motion "prefers" transform and opacity, and the wipe is specified by the chosen direction, so it is allowed where `DESIGN.md` specifies it. Ruling R3.

### 6.2 "Quest unlocked" (Quest journal)
- **Server HTML:** every quest file is rendered, stacked, each an `<article>` with its heading. Without JS, all are readable.
- **Enhancement (`quest-tabs.client.tsx`):** the mission list becomes an APG tablist with manual activation. The quest files are the tabpanels, passed in as server-rendered children, and hidden panels use `hidden`. Whether mobile keeps the stacked layout is a `DESIGN.md` call.
- **On select:**
  - `m` + `AnimatePresence mode="wait"` swaps the file, interruptibly
  - the status chip flips
  - the viewport's model projects in
  - the achievement badges power on, with stagger
  - `quest-unlocked-toast.client.tsx` shows `toast.quest-unlocked` for less than 5 s, through `AnimatePresence`
- **The toast's announcement:** a persistent polite live region (QA B4.3) holds the "Quest unlocked" text. It never moves focus.
- **Reduced motion:** `MotionConfig reducedMotion="user"` plus the `motionAllowed` source. The file and toast appear without movement; the announcement still happens.

### 6.3 Handshake state machine with autoplay once
- **Reducer** (`lib/handshake/machine.ts`, extended from v1):
  - **Steps:** `rest` (the server state: complete, genuine) · `idle` · `challenge` · `response` · `genuine` · `rejected`.
  - **State:** `{ step, counterfeit, run, instant, autoplayed, userActed }`.
  - **Events:**
    - `run{instant}`: restarts from `challenge`, or goes straight to the verdict when instant
    - `toggle`: flips counterfeit and cancels to `idle`
    - `advance{from}`: ignored when stale
    - `autoplay`: acts only if `!autoplayed && !userActed`, then sets `autoplayed`. `run` and `toggle` set `userActed`, so a visitor who clicks first never gets a surprise replay
  - The counterfeit path fails after the challenge: `challenge → rejected`, with step 2 marked failed.
- **Schedule** (`lib/handshake/schedule.ts`):
  - A timer per step, with durations from the motion tokens.
  - The hero stage leaf dispatches `advance` when each timer ends. Timers are cleared on every new run, toggle or unmount.
  - The 3D scene is a pure view of `{step, counterfeit, run, stepStartedAt}`: `useFrame` interpolates packets by elapsed time over the step duration.
  - So the HTML log and the scene cannot desync, and the log runs identically without WebGL.
- **Autoplay trigger** (hero stage leaf): dispatch `autoplay` once per page load, when all of these hold:
  - hydrated
  - `motionAllowed`
  - the stage at least 50 % visible
  - the scene has reported its first frame, or the poster is final (no WebGL)
  - then after `delay-autoplay` *(prov.; directions: +1.4 s)*

  The guard lives in reducer state, and the stage never remounts, so scrolling away and back or toggling the theme cannot replay it (QA auto-play spec).
- **HTML semantics:**
  - The steps are an `ol` using `a11y.steps.bench` text. The current step is marked with `aria-current="step"`, and a failed step 2 is wrapped in `<del>`, which is semantic and not strike-through alone.
  - The verdict is an `<output>`, whose implicit role is status. It announces "genuine" or `bench.verdict-rejected`, and nothing per step (this avoids chatter).
  - The toggle uses `aria-pressed` with a constant label. Focus stays on the pressed button.

### 6.4 Motion preference and pause
- **`motionAllowed`** = not `prefers-reduced-motion: reduce` and not paused by the visitor.
  - The pause choice is stored in `localStorage` and applied by the same head script as the theme, as `data-motion="on|off"` on `<html>`, so there is no flash of motion.
- **One source for everything that moves:**
  - CSS ambient animations and reveals key off `data-motion` and the media query.
  - JS reads the same source (`lib/motion/preference.ts`) for the frameloop, autoplay and `MotionConfig`.
- **The pause control:** `motion-toggle.client.tsx` is a visible button in the HUD strip with `aria-pressed`. It is required because the hologram's ambient motion runs longer than 5 s (WCAG 2.2.2). **Its label is not approved copy yet (§12, D1).**
- **Technique rules:** transitions list their properties (never `all`); everything is interruptible; there are no scroll listeners; nothing flashes more than 3 times a second. The rejected flash is one pulse plus one short shake.

## 7. Résumé PDF

- **Reuse v1** (`e74b1cb^`: `scripts/resume/*`, `lib/resume/{model,file}.ts`, `resume-document.tsx`, `print.css`). Restyle it for the v2 tokens:
  - light theme only
  - Chakra Petch headings, Mona Sans body
  - no 3D, no glow, no chamfer, no avatar
- **Model:** selected from `src/content/` only, and it adds no facts.
  - Summary = `resume.summary` (= `hero.sentence`).
  - Contact = the opted-in email, Telegram, GitHub and Location.
  - PDF-only extras per `lists.scope`.
  - The phone number, second email and reference are **excluded by construction**: they exist in no module.
- **`pnpm resume:pdf`:**
  1. `renderToStaticMarkup`.
  2. PostCSS compiles `print.css`, and the subset woff2 files are inlined as `@font-face` data URLs.
  3. Playwright Chromium in print media, with a guard that axe reports 0 violations on the source HTML.
  4. `page.pdf({ tagged, outline, preferCSSPageSize, printBackground })` at A4, with a guard of at most 2 pages.
  5. Writes `public/tidi-resume.pdf` (`resume.file`), titled `resume.title` "TiDi, Résumé", plus `resume.lock.json`: SHA-256 of the model, sources, tokens and fonts.
- **`pnpm resume:check`:** static, no browser, part of `pnpm check`. It fails with "run pnpm resume:pdf" when any locked input has changed.
- **Links:**
  - The hero "Résumé" (`resume.link`) and the Contact "PDF, {size}" (`resume.contact-link`) render only when the file exists.
  - The size is computed from the file at build.
- **Content check:** Phase 6 uses `unpdf` to assert the name (including "Hồ Trọng Đại"), the role and every employer. It also asserts the absence of a phone pattern, `[private]`, "accepting quests" and reference data. This is the brief's own requirement, not a privacy scan.

## 8. Lean test suite (Phase 6, run once at the end)
QA's contribution §1.2 is the spec list; engineering builds it as written.

| Layer | Files | Covers |
|---|---|---|
| Unit (Vitest, node) | `tests/unit/handshake-machine.test.ts` | Every transition: genuine and counterfeit paths, re-run, toggle mid-run, instant, stale `advance`, and the autoplay guard (fires once; never after `userActed`) |
| E2E (Playwright + axe) | `fixtures.ts`: runs each UI spec in light and dark, and fails a test on any console error, page error or hydration warning | |
| | `handshake-autoplay`, `handshake-run`, `handshake-counterfeit`, `handshake-reduced` | Key flow 1: the signature, in every mode |
| | `theme`, `mobile-menu`, `skip-link`, `keyboard` | Key flow 2: shell and keyboard path, including no focus under the HUD and a monotonic focus order |
| | `video-facade`, `resume-link` (+ the `unpdf` content check) | Key flow 3: the Quest file and the résumé |
| | `axe`, `reduced-motion-content` (including JS disabled), `motion-pause`, `overflow` | Accessibility and complete content |
| | `webgl-fallback` (null context, forced context loss), `mobile-3d` (DPR cap, touch scroll, off-screen rAF) | 3D robustness |

- **Target:** the production build via Playwright `webServer: pnpm build && pnpm start`.
- **Projects:** `desktop`, Chromium 1440 × 900; `mobile`, WebKit 375 × 812, DPR 3, touch.
- **External stubs:** YouTube routes are stubbed. No network.
- **Not in the suite** (per CLAUDE.md and QA §1.3): performance, Lighthouse, SEO, privacy scan, pixel baselines, content-trace tests.
- **Commands:** `pnpm test` (Vitest) and `pnpm test:e2e` (Playwright).

## 9. Tooling, scripts, git

### 9.1 Scripts
| Script | Runs |
|---|---|
| `dev`, `build`, `start` | `next` |
| `lint` | `eslint .`, then `prettier --check .` |
| `format` | `prettier --write .` |
| `typecheck` | `next typegen`, then `tsc --noEmit` |
| `design:lint` | `design.md lint DESIGN.md` |
| `tokens`, `tokens:check` | §4.1 |
| `fonts`, `fonts:check` | §1.3 |
| `resume:pdf`, `resume:check` | §7 |
| `check` | `design:lint`, `tokens:check`, `fonts:check`, `resume:check` (from Phase 5), `lint`, `typecheck`: every static gate |
| `test`, `test:e2e` | Phase 6 |

- **Per-phase gate** (owner build mode): `pnpm check && pnpm build`, both exit 0 with no warnings.
- **UI phases** also capture 375 and 1440 px screenshots in both themes for the report. This is evidence, not a test.
- The main session adds the commands to CLAUDE.md → Testing & Verification after Phase 1.

### 9.2 ESLint rules that carry the plan
- `eslint-config-next` (core-web-vitals and typescript), jsx-a11y strict, typescript-eslint type-checked
- `better-tailwindcss` (token-only classes)
- `react/jsx-no-literals` in `src/components` and `src/app`: no hardcoded visible strings or facts
- `no-restricted-imports`:
  - three, R3F and postprocessing only in `holo/scenes/**`
  - `@/content/*` banned in `*.client.tsx`
  - `motion/*` only in `quest-journal/*.client.tsx`
- Prettier last

### 9.3 Git and hosting
- **Git:** `git init` in Phase 1 (the repository has `.git` metadata from before the restart, so Phase 1 confirms the state first and never rewrites history). Conventional commits, with a small commit per task. No remote, no push.
- **No CI workflow and no host config** until the owner picks hosting.
- **If the host turns out to be static-only** (for example Cloudflare Pages, where the DNS already is): switch to `output: 'export'` and pre-generate avatar variants. That is about half a day of work (§12, D5).

## 10. Phases
Six phases, run back to back. Gate per phase: `pnpm check && pnpm build`, fresh. QA's criteria IDs are in brackets. **Responsible agent for every phase: `frontend-engineer`.** Review happens in F (QA), except Checkpoint 1.

### Phase 1 · Foundation: toolchain, tokens, fonts, content [B1]
- **Deliverable:**
  - Node 24 and pnpm 10 active; git confirmed or initialised; the scaffold per §2
  - all configs, `pnpm tokens` and `pnpm fonts` with their checks
  - the restored and extended content layer
  - a bare prerendered `/` showing `page` tokens in both themes, with the fonts loaded
  - **a throwaway R3F spike**: one spinning mesh in a `dynamic` island, then deleted. It proves that R3F 9.8.1 runs under Next 16.3.6's bundled React
- **Acceptance:**
  - `pnpm check` exits 0: design lint 0/0, tokens and fonts in sync, glyph coverage of `info.md` passes, lint 0, typecheck 0
  - `pnpm build`: every route static
  - Zod: an invalid content edit fails the build with its path (shown, then reverted)
  - the spike renders with 0 console errors (report screenshot), then is removed
  - `git log` shows the initial commits
  - B1.2 grep: 0 raw values

### Phase 2 · Shell and Holo hero (design checkpoint 1) [B2, B3]
- **Deliverable:**
  - skip link, HUD strip with the XP bar (desktop and mobile variants), corner brackets, nav with the menu disclosure, theme toggle with the head script, motion toggle, `<noscript>` style, footer, not-found page, page metadata
  - the hero lockup and CTAs
  - `hero-stage.client.tsx` with the machine, schedule, autoplay, controls, log and `<output>`
  - `HoloPoster`; `holo-canvas`, `use-frameloop`, the error boundary and context-loss handling
  - the full hero scene with boot, ambient motion, handshake, theme palettes, Bloom in dark, and reduced and paused variants
- **Acceptance:**
  - static gate green
  - report screenshots at 375 and 1440 × light and dark × motion on and off, plus a WebGL-disabled capture (`--disable-webgl`)
  - a manual pass recorded in the report:
    - autoplay runs once
    - Run and Counterfeit reach "genuine" and "rejected"
    - with JS disabled, the page is complete and no control shows
    - `data-frameloop` reads `never` when scrolled away and `demand` when paused
    - 0 console errors or hydration warnings
- **Checkpoint:** `design-lead` critiques the screenshots against `DESIGN.md` before Phase 3 starts.

### Phase 3 · Quest journal [B4]
- **Deliverable:**
  - the mission list and quest files: CyberRock, botmivivi and Quest in full; Lemonswan and Scania compact
  - status chips; `dt`/`dd` facts; Party lead; the achievements
  - the tabs enhancement, the quest viewport scene (chip, ledger stack, data slabs), the "Quest unlocked" toast with its live region
  - `a11y.steps.*` text
  - the video facade
- **Acceptance:**
  - static gate green
  - screenshots of each quest selected, both themes
  - a manual pass: with JS off, all files are visible; selection swaps the file and the model; the toast shows and announces; no YouTube request before activation

### Phase 4 · Remaining sections and scroll motion [B5]
- **Deliverable:**
  - Mission log, House rules, Inventory with Leveling up, Character stats with the avatar frame (`alt=""` plus `avatar.caption`), AFK, Join party
  - `reveal-observer`: panel power-on, stat rows and the level-up sweep
- **Acceptance:**
  - static gate green
  - full-page screenshots at 375 and 1440 × both themes × motion on and off
  - a manual pass: with JS off and under reduced motion, every panel is visible; the level-up sweep plays once; no horizontal overflow at 320 px

### Phase 5 · Résumé PDF and links [B6]
- **Deliverable:** `pnpm resume:pdf` and `resume:check`, `public/tidi-resume.pdf`, the lock, and both Résumé links.
- **Acceptance:**
  - `pnpm resume:pdf` reports 0 axe violations, A4, at most 2 pages
  - `resume:check` exits 0, and exits 1 after an unregenerated content edit (shown, then reverted)
  - the report quotes the extracted text: title "TiDi, Résumé", "Hồ Trọng Đại" present, no phone number, second email or reference
  - the links serve `/tidi-resume.pdf` with 200

### Phase 6 · Lean test suite and full gate [T]
- **Deliverable:** §8 exactly: the Vitest file, the Playwright config, fixtures and specs.
- **Acceptance** (QA §1.4):
  - `pnpm check`, `pnpm build`, `pnpm test` and `pnpm test:e2e` all exit 0, with 0 failed, 0 skipped, no `.only` and no retries
  - the suite passes twice in a row
  - failures found while writing the suite are fixed at the root cause, never by weakening a spec

Then **F** (final checks, QA and main session): the screenshot matrix, UI audit, content verification and Checkpoint 2.

## 11. Risks
| # | Risk | Mitigation | Phase |
|---|---|---|---|
| R1 | R3F 9.8.1 misbehaves under Next 16.3's bundled React canary | The Phase 1 spike, before any scene work. Fallback: pin to the React range R3F supports, or wrap the scene island to keep it isolated | 1 |
| R2 | Timers and 3D drift, or a stale verdict after interrupts | The timer schedule is the only clock; the scene is a pure view; stale `advance` is ignored; unit test in Phase 6 | 2, 6 |
| R3 | Reveals leave content hidden (a broken observer, JS off) | Visible by default; the pre-reveal state only under `[data-js][data-motion="on"]`; a 3 s CSS safety reveal | 4 |
| R4 | A chamfer `clip-path` on buttons and panels clips the focus ring | The chamfer goes on a `::before` layer. The element keeps an unclipped `:focus-visible` outline, 2 px with a 3 px offset; `DESIGN.md` confirms the ring shape | 2 |
| R5 | The mobile hero `order` swap breaks the focus order (QA Review Focus 5) | Only the decorative, non-focusable canvas moves visually above the `h1`. The controls and log stay after the text in both DOM and visual order. **This differs from the mock, where the controls sit under the canvas above the `h1`** (§12, D3) | 2 |
| R6 | Bloom or the cone washes out text contrast | Text only on panels or scrims; Bloom limited to the hero canvas in dark; UI audit pixel sampling in F | 2 |
| R7 | WebKit at DPR 3: memory use and context loss | DPR cap 1.75; the context-loss handler falls back to the poster; `mobile-3d` spec | 2, 6 |
| R8 | ESLint 9 is past end of life | Development only, exact pins; upgrade when jsx-a11y supports ESLint 10 | 1 |
| R9 | Glyph gaps ("▸", "▲") | Decided in D2; `fonts:check` catches any other gap | 1 |

## 12. Open decisions
**For design-lead (`DESIGN.md`) and the owner, via the main session:**
- **D1. Pause control label.** A visible pause control is needed (WCAG 2.2.2; directions §3), but no label is approved. The preview used "Motion" with `aria-pressed`, following the `a11y.theme-toggle` pattern. Owner copy approval is needed by Phase 2.
- **D2. "▸" in "▸ PLAYER 1".** Neither Chakra Petch nor Mona Sans has U+25B8.
  - Proposal: render it as a decorative Tabler filled caret beside the text "PLAYER 1". The words are unchanged; only the glyph becomes an icon.
  - The same applies to the Leveling up "▲" markers (an icon, not text).
  - Needed by Phase 2.
- **D3. Mobile hero order** (R5): keep the controls after the text, or accept the mock's order and its focus-order jump. Needed by Phase 2.
- **D4. Pause scope:** does "motion off" also make a user-run handshake instant, as proposed (same as reduced motion)? And does the pause choice persist across visits, as proposed? Needed by Phase 2.
- **D5. Hosting:** decided later. It only matters if the host is static-only (§9.3).
- **D6. Résumé section labels** (carried over from v1, Phase 10): "Quest journal", "Mission log", "Inventory" and "AFK" may read poorly to recruiters, and the PDF-only skills have no approved label. The PDF reuses the site labels unless the owner approves others. Needed by Phase 5.
- **Toolchain:** Node 24 and pnpm 10 are still not installed (this machine has Node 22.13.0 and pnpm 8.15.5). This was approved in v1 as O3, and the owner or main session confirms before Phase 1.

**Rulings for the main session** (format `Ruling: what — why — cost if wrong`):
- **R1.** Fonts: subsets from google/fonts sources via `next/font/local`, instead of Fontsource — Fontsource lacks U+2192, which owner strings use; same families, same OFL — cost if wrong: switch to Fontsource and accept a fallback arrow.
- **R2.** No GSAP; Motion is scoped to the Quest journal; reveals are CSS plus IntersectionObserver — HTML-first reveals, no non-OSI licence, fewest moving parts — cost if wrong: add Motion's `whileInView` later, after an SSR-visibility check.
- **R3.** `clip-path` wipes are allowed where `DESIGN.md` specifies them, although the `frontend-build` skill says "transform and opacity only" — CLAUDE.md (higher) says "prefers", and the chosen direction specifies the wipe — cost if wrong: swap it for an opacity and translate entrance.
- **R4.** Only the handshake machine gets a unit test, and content traceability is checked once in F — QA §1.3 and the owner's lean mode — cost if wrong: restore v1's traceability test (it exists in git).
- **R5.** SEO artefacts (OG, JSON-LD, sitemap, robots) and security headers are not built — CLAUDE.md scope; hosting undecided — cost if wrong: v1's `lib/seo` is in git, about half a day.

**Ideas, not in scope:** a single shared canvas via drei `View` for both scenes, which would use one WebGL context instead of two. Worth it only if context limits show up on mobile.
