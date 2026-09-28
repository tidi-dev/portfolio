# v2 · Font A (all text Portfolio Pixel): engineering report

- **Status:** DONE_WITH_CONCERNS (the concerns are below, none blocking)
- **Brief:** `docs/design/font-a-handoff.md` §1–8, `DESIGN.md` (Typography, Components, Shapes). No screenshots or preview pages, per the owner.
- **Continued from:** the stopped engineer's uncommitted tree. I kept the font pipeline (npm-tarball origin, rename, `shapes` range, glyph assertion), the pixel glyphs, the favicon "T", the power-on edge, the brackets from `lg`, the 1 px ghost border, the stat grid and the pixel `type-*` utilities. I finished §8 and the résumé. The Chakra Petch deletion was already committed in `d992142`.

## Changes
- **Fonts:** `pnpm fonts` builds `portfolio-pixel-400.woff2` (8,172 B, 358 code points) and `portfolio-sans.woff2` (unchanged). `fonts:check` labels them "site" and "résumé only".
- **Site type:** `layout.tsx` loads only Portfolio Pixel. `theme.css` sets up:
  - `type-name` (24/40), `type-body` (12/24) and `type-body-compact` (12/20), all pixel
  - `type-print-*` on Portfolio Sans
  - measures of 56ch and 50ch
  - `font-synthesis: none` and the smoothing on `html`
  - `strong`, `b` and `em` at 400, upright, in `accent-ink`
  - the unused `--font-<token>` theme variables cleared, so no served CSS says "Galmuri" or "Mona"
- **Components:** every `body-sm`, `caption`, `body-strong` and `slot` use now maps to `body`, `body-compact` or `nav`, as the §8 table says. Other changes:
  - the name block gets `mt-2xs`
  - bullets are 4 × 4 `text-muted` squares, `2xs` apart
  - links are underlined 1 px at a 3 px offset
  - badge descriptions are `text-muted`
- **Résumé:** it uses `type-print-*`. `print.css` maps both font variables to Portfolio Sans and adds `--container-measure: 68ch`. The PDF was regenerated.
- **Globals:** the résumé components are excluded from the site's Tailwind scan.
- **Removed from the tree:** the previous engineer's untracked screenshot script `scripts/_qa.ts`. It failed lint and broke the no-screenshots rule. I moved it to my scratch area rather than deleting it.

## Evidence (fresh runs, Node 24.21.0)
- `pnpm check`: exit 0.
  - `design:lint`: 0 errors, 0 warnings
  - `tokens:check`: match
  - `fonts:check`: "the 5 font files match a fresh generation"; "game glyphs ▸ ▲ ▼ are in …portfolio-pixel-400.woff2"; "all 123 characters … in all 2 font files"
  - `resume:check`: matches its 11 inputs
  - Prettier: clean
  - `tsc`: clean
- `pnpm build`: exit 0, with 3 static routes.
- **DOM check** (scratch script, `next start` on :3610; stopped afterwards by its PIDs). It ran at 320, 375 and 1440 px, in light and dark, with reduced motion both on and off:
  - 239 to 257 visible text elements per run
  - every computed `font-family` starts with `portfolioPixel`; weight 400, style normal, whole-pixel sizes and line heights
  - sizes: 320 px {12, 24, 36, 60}; 1440 px {12, 24, 36, 48, 96}
  - CDP platform fonts: only "Portfolio Pixel Regular" (70,192 glyphs), with 0 fallback glyphs
  - `scrollWidth` equals `innerWidth` in all 12 runs
  - console: 0 errors. There were 4 warnings, all Chromium GL driver lines ("GPU stall due to ReadPixels", headless); THREE.Clock was excluded as accepted
  - problems: 0
- **Spot checks:**
  - the name line box is 40 px with a 4 px top margin
  - the hero sentence is 400 px wide and runs 4 lines
  - the sprite shadow is 8 px 8 px 0 in `shadow-pixel`
  - bullet squares sit at top 11 px, 4 × 4, in `text-muted`
  - Join party brackets are hidden at 768 px and shown at 1440 px
  - the `/icon` PNG has ink at x 9–23 and y 5–27, 68 px, a crisp T
- **PDF** (`pypdf`): 2 pages, 3,328 characters extracted.
  - fonts: `PortfolioSans-*` only; "galmuri", "chakra", "mona" and "portfoliopixel" each 0
  - [private email removed], "reference", "availab", "travel", "photograph" and phone-like numbers: each 0
  - `DaiHo Resume.pdf` was not touched
- The served woff2 name table says "Portfolio Pixel Regular" and "PortfolioPixel-Regular", with no "Galmuri".

## Deviations and decisions
1. **The résumé's pixel roles** (brand, section headings, terms in `nav`) have no `print-*` twin. They render in Portfolio Sans at their token sizes, weighted like `print-body-strong`, untracked, with a line height of 1.25 on the headings (`print.css`). The terms are therefore 12 px against 13 px values, where the old PDF had 14 px.
2. **Quest terms** (botmivivi): without bold, the term is `body` `primary` and the description is `body` `text-muted`, following DESIGN.md's rule that secondary text is `text-muted`.
3. **Bullet rhythm:** items are `2xs` apart (Reading on the grid → Rhythm); they were `sm`.

## Concerns
- `src/components/holo/scenes/palette.ts` imports all of `tokens.generated.json`, so a client chunk carries `fontFamily:"Galmuri11"` as a string. This predates my work: it held "Chakra Petch" and "Mona Sans" before. It isn't a font or CSS name, but the handoff §3 wording is strict. A fix would import only the colours.
- The subset's name ID 1 reads "Portfolio Pixel Regular", because the source's own ID 1 is "Galmuri11 Regular". Subsetting drops ID 16. next/font serves the family as `portfolioPixel`, so the page is unaffected.
- Port 3600 is held by PID 92008, which isn't mine and which I left alone.
