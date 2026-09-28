# Font A · Cartridge: handoff to frontend-engineer

- **From:** design-lead, 2026-09-28. **Contract:** `DESIGN.md` (Typography, Shapes, Components, Motion, Responsive, Changelog row "Font A · Cartridge"). Where this file and `DESIGN.md` differ, `DESIGN.md` wins; tell the main session.
- **Decision:** the owner chose A · Cartridge (`docs/design/font-options.md`). Main-session rulings: the 12 px pixel grid (buttons, nav and labels at 12 px), and the Galmuri subset renamed.
- **Order:** `pnpm tokens`, then `pnpm fonts`, then code, then `pnpm resume:pdf`, then the gate (`pnpm check && pnpm build`).

## 1. Source file (verified by design-lead, 2026-09-28)

| Item | Value |
|---|---|
| Package | npm `galmuri@2.40.3`, licence field `OFL-1.1`, repository `github.com/quiple/galmuri` |
| Tarball | `https://registry.npmjs.org/galmuri/-/galmuri-2.40.3.tgz`, shasum `8eaa5ee9761d19030807254c5cf357a08958c05e`, integrity `sha512-eXflXih1AWy2J+jWeT5sGVj4PUCb1bMK7lnwKDKMzEd3lx+F6myuxqp6c0eZlD7EMXOicUYaM+FH7DAoQ7mWbw==` |
| Font | `package/dist/Galmuri11.ttf`: 5,376,428 B, sha256 `2c709890595668f7bdb6df408420fda957dde0288e95b31a1cc17a2ab98b4b4f` |
| Name table | family `Galmuri11` (ID 1 "Galmuri11 Regular", ID 16 "Galmuri11"), PostScript `Galmuri11-Regular`, ID 3 `2.403;QPLE;Galmuri11-Regular`, ID 5 "Version 2.403", ID 0 "Copyright (c) 2019-2025 Lee Minseo (quiple@quiple.dev)" |
| Licence | `package/ofl.md`: 4,266 B, sha256 `9a9e5a342c430c3fcf01a408b680f4405d5bf4ac659c931be35f8a1b27ea69c9` |
| RFN | Declared in `package/dist/galmuri.css` (lines 1 to 5): 'with Reserved Font Name "Galmuri"'. Record that in the manifest. |

- **Regular only.** Don't use `Galmuri11-Bold` (32/134 Vietnamese letters), `Galmuri11-Condensed`, `Galmuri14` (40/134) or the `*Bitmap-*.ttf` files.
- **Checked with fontTools 4.60.1:**
  - metrics: upm 1200, one font pixel = 100 units; hhea 1200 / −200, win 1400 / 200, `USE_TYPO_METRICS` off; weight class 400
  - coverage: Vietnamese 134/134; printable ASCII plus `· é – — ‘ ’ “ ” … →`, 0 missing; U+25B2 ▲, U+25B8 ▸ and U+25BC ▼ present
  - features: GPOS `kern` (values −100 and −200 only, so whole pixels); GSUB `tnum`, `zero`, `vert`
  - grid: every outline point and advance of the 103 glyphs checked is a multiple of 100 units
- **Trial subset** (pyftsubset, woff2; ranges and features as in §2): 358 code points, 8,024 B. Every character in `info.md` and `src/content/**` is covered.
- The pipeline pins google/fonts today. Add a second pinned source kind for the npm tarball (URL, shasum or integrity, the in-tarball path, bytes, sha256), in the same way `config.ts` pins files now.

## 2. Subset

- **Ranges:** the existing `UNICODE_RANGES` (`latin`, `vietnamese`, `arrows`), plus a `shapes` range for this family only: `U+25B2, U+25B8, U+25BC`. Portfolio Sans doesn't need it.
- **Features:** `DEFAULT_FEATURES` that the font has (`kern`), plus `tnum`, which `stat-value` asks for through `fontFeature`. Drop `zero` and `vert`.
- **Coverage check:** `ICON_GLYPHS` (▸ ▲ ▼) stay exempt from the all-fonts check, because Portfolio Sans lacks them. Add one assertion: the pixel subset contains all three. Update the comment: they now render as Portfolio Pixel glyphs, not Tabler icons.
- **Remove Chakra Petch:** its sources, both woff2 files, `OFL-chakra-petch.txt`, and its `KNOWN_FEATURE_GAPS` entry (`tnum`). Galmuri has `tnum`, so no gap is left.

## 3. Rename (OFL Reserved Font Name "Galmuri")

| | From | To |
|---|---|---|
| Family (IDs 1, 16) | `Galmuri11` | `Portfolio Pixel` |
| Full name (ID 4) | `Galmuri11 Regular` | `Portfolio Pixel Regular` |
| PostScript (ID 6), unique ID (ID 3) | `Galmuri11-Regular` | `PortfolioPixel-Regular` |
| Slug, file | none | `portfolio-pixel`, `src/assets/fonts/portfolio-pixel-400.woff2` (or `staticFile`'s pattern) |
| Licence file | `ofl.md` | `src/assets/fonts/OFL-portfolio-pixel.txt`, verbatim (it names the original, as the Mona Sans licence does) |
| CSS variable | none | `--font-portfolio-pixel` (next/font `localFont`, weight `"400"`, style normal) |

- **Name records:** keep ID 0 (the copyright notice) as it is. Keep 13 and 14 (`LICENCE_NAME_IDS`).
- **Rule:** no served font name, CSS family or PDF font name may contain "Galmuri". The only place the word may appear is the source-pinning config and its comments.
- **Tokens:** `DESIGN.md` names the source family (`fontFamily: Galmuri11`), as it does for Mona Sans. The pipeline maps the source family to the renamed family.

## 4. Token changes (`pnpm tokens` generates them; the hand mapping is in `theme.css`)

| Token | Before (Chakra Petch) | After (Portfolio Pixel, 400) | Hand-mapped in `theme.css` |
|---|---|---|---|
| `display` | 700, `clamp(3.5rem, 7vw, 6.5rem)`, lh 0.9, −0.01em | 3.75rem (60 px); **6rem (96 px) from `lg`**; lh 1; tracking 0 | step at `lg`; `--tracking-display` no longer exists, so use `normal`; sprite shadow |
| `heading-section` | 700, clamp 2 → 2.75rem, lh 1.1 | 2.25rem (36 px); **3rem (48 px) from `md`**; lh 1.3333 | step at `md`; drop the clamp |
| `heading-quest` | 700, clamp 1.5 → 1.75rem, lh 1.15 | 1.5rem (24 px), fixed; lh 1.3333 | drop the clamp |
| `stat-value` | 700, clamp 1.75 → 2rem, lh 1, proportional | 1.5rem (24 px); **2.25rem (36 px) from `md`**; lh 1; `tnum` | step at `md`; `font-variant-numeric: tabular-nums` |
| `wordmark` | 700, 1.25rem, 0.02em | 1.5rem (24 px); lh 1; tracking 0 | `--tracking-wordmark` no longer exists, so use `normal` |
| `heading-panel` | 700, 0.8125rem, 0.18em, lh 1.2 | 0.75rem (12 px); lh 1.5; 1px; uppercase | lh 1.5 |
| `label` | 600, 0.75rem, 0.12em | 0.75rem; lh 1.5; 1px; uppercase | none |
| `role` | 600, 0.9375rem, 0.06em, lh 1.2 | 0.75rem; lh 1.5; 1px; uppercase | lh 1.5 |
| `button` | 700, 0.9375rem, 0.04em, lh 1 | 0.75rem; lh 1.5; 1px | lh 1.5 |
| `nav` | 600, 0.875rem, 0.02em, lh 1.3 | 0.75rem; lh 1.5; 1px | lh 1.5 |
| new colour `shadow-pixel` / `-dark` | none | `#0B728533` / `#4FD8E859` | the sprite shadow |
| new components | none | `brand-shadow` (+ `-dark`), `favicon` | none |
| body tokens (`name`, `body*`, `slot`, `caption`) | Mona Sans | unchanged | none |

- **Every pixel `type-*` utility sets:** `font-family: var(--font-portfolio-pixel)`, `font-weight: 400`, `font-synthesis: none`, `font-stretch: normal`, `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`.
- **Mobile-first steps:** use `@media (width >= 48rem)` and `(width >= 64rem)`, or the theme breakpoints. No `clamp()`, `vw` or `calc()` on a pixel size.
- **Speaker tag:** it keeps `nav`, and there is no separate token.

## 5. What changes, by component

| Component, file (as of fix-1) | Change |
|---|---|
| Fonts: `scripts/fonts/config.ts`, `pipeline.ts`, `coverage.ts`, `src/app/layout.tsx` | §1 to §3. `layout.tsx`: replace `chakraPetch` with `portfolioPixel` (one `src`, weight 400, `display: "swap"`), and update the comment |
| `src/styles/theme.css` | §4: the pixel `type-*` utilities, stepped sizes, and the fluid `--text-*` lines removed for display, heading-section, heading-quest and stat-value (body stays fluid) |
| `src/styles/print.css` | `--font-chakra-petch: "Chakra Petch"` becomes `--font-portfolio-pixel: "Portfolio Pixel"`. The résumé follows the type tokens, so its headings and labels become pixel type. Regenerate it (`pnpm resume:pdf`) and check that the embedded font names are PortfolioPixel and PortfolioSans only |
| Brand "TiDi" (`hero.css`, the `brand-name` element) | Remove the Deck 32 px holo glow. Add `text-shadow: calc(1em / 12) calc(1em / 12) 0 var(--color-shadow-pixel)` in both themes, with the `-dark` swap. No blur |
| HUD readout (`shell/hud-readout.tsx`) | The `caret-right-filled` icon becomes `<span aria-hidden="true">▸</span>` in the readout's `label` type. Keep the text node "PLAYER 1" as it is |
| Dialogue continue (`sections/dialogue-continue.client.tsx`) | The `caret-down-filled` icon becomes an `aria-hidden` "▼" span in the button's type. The button's accessible name must stay "Press A to continue" |
| Training card (`sections/inventory.tsx`) | The `triangle-filled` icon becomes an `aria-hidden` "▲" span, `success`, at 12 px, first line, gap `xs` |
| `ui/icon.tsx`, `content/schema/copy.ts` comment | Remove the three filled icons and their names. Update the comment about how "▸" renders |
| Ghost buttons (`shell.css`) | Inset border 1.5 px becomes **1 px** `text-muted` |
| Buttons, skip link, verdict, video facade | Nothing to do beyond the tokens: 48 px high, padding 24 px (Run 20 px), 12 px label, focus ring 2 px with a 3 px offset |
| Stat readout (`quest.css` `stat-grid`) | 1 column below `xs` (375 px), 3 columns from `xs`. At 320 px "CUSTOMERS" is 84 px against a 77 px column |
| Power-on edge (`reveal.css`) | Ruling 1, below |
| Join party brackets (`join-party.tsx`, `sections.css`, `reveal.css`) | Ruling 2, below |
| Site icon (`brand/monogram.tsx`) | Ruling 3, below |

Unchanged: colours, layout, radius and chamfer, the 3D, motion timings, and every Portfolio Sans role.

## 6. The three rulings as specs

**Ruling 1: the power-on edge shows only while moving** (report V4 concern)
- **While the panel waits** (`[data-reveal="panel"]:not([data-revealed])`): the cover sits at `translateX(0)` as now, and `.power-cover::before` has `opacity: 0`.
- **When revealed** (`[data-revealed]`): `::before` has `opacity: 0.7` (move the 70 % from `color-mix` to `opacity`; the colour becomes plain `--color-holo`).
  - Transition: `opacity 0ms linear <the slide's delay>`, where the delay is `calc(var(--reveal-order, 0) * var(--stagger-panel))`.
  - The edge appears in the same frame the slide starts, never during a stagger wait.
- **After the wipe:** the cover rests at `translateX(100%)`, and the edge sits just outside the track, clipped. No change is needed there.
- **Calm mode and no JS:** no edge, ever. The resting rule already leaves the cover outside the track; keep it that way.
- **Accept:** the V4 captures show no vertical holo line on any unrevealed panel (`quest-journal-1440-dark` files 2 and 3). A mid-wipe capture still shows the edge.

**Ruling 2: Join party brackets from `lg` only** (report deviation 3)
- Below `lg` (1024 px) the four Join party brackets are not rendered: `display: none` on their container, or don't mount them. From `lg` they behave as now.
- The hero brackets still show at every width.
- Why: below `lg` the pair stacks, and brackets 8 px outside the grid sit in the 16 px page edge around one tall column (`contact-375-*`). From `lg` they frame the side-by-side pair, which is the "frame closes" moment.
- **Accept:** `contact-375-*` and `contact-768-*` show no brackets. `contact-1024-*` and `contact-1440-*` show them drawn after the reveal, and present at once in the calm mode.

**Ruling 3: the favicon is the pixel "T"** (report deviation 4, replacing the current mark)
- **Canvas:** 32 × 32. **Tile:** polygon `0,0 24,0 32,8 32,32 8,32 0,24`, filled `accent` (Lab value, `#E3B341`).
- **The "T":** the Galmuri11 "T" glyph (7 × 11 font pixels, a 1 px bar and a 1 px stem in column 4) at 2×, filled `on-accent` (`#0D1117`). Draw it as two rectangles:
  - bar: `x="9" y="5" width="14" height="2"`
  - stem: `x="15" y="5" width="2" height="22"`
- **Crisp edges:** integer coordinates only; `shape-rendering="crispEdges"` on the rectangles.
- **Colours:** from the tokens, as now. There is no dark variant (the tab doesn't theme). Contrast is 9.72:1.
- **Serving:** same routes as now (`/icon`, `/favicon.ico`), PNG, 32 × 32. No artwork of the owner.
- **Accept:** the PNG at 800 % zoom shows a symmetric T with hard edges, centred (bar 9 to 23, stem 15 to 17, top 5, bottom 27).

## 7. Watch list: pixel crispness

- **Sizes:** only 12, 24, 36, 48, 60 and 96 px (0.75, 1.5, 2.25, 3, 3.75 and 6rem). Never a fractional or fluid size, and no `scale()` or `zoom` on pixel text at rest. Animations may transform it in motion (the status-chip flip, the toast) but must end at the identity transform.
- **Line heights** resolve to even whole pixels: 18, 32, 48, 64, and 24 / 36 / 60 / 96 at lh 1. That keeps baselines whole under both the Mac and the Windows metrics. **Tracking** is 1 px at 12 px and 0 above.
- **No synthetic styles:** `font-synthesis: none`, `font-weight: 400` everywhere; no `<strong>` or `<b>` inside pixel roles, no italics. A faux bold smears the 1 px stroke.
- **Smoothing:** `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on pixel roles only. Leave Portfolio Sans at the default. Don't set `text-rendering: optimizeSpeed` (it disables kerning).
- **Horizontal position:** glyph advances and kerning are whole pixels at every size on the grid. Keep pixel text starting on a whole pixel: avoid `translate(-50%)` centring and odd-remainder centring on pixel labels; prefer padding or `justify-content: center` with even widths. If a label looks soft at 1×, check its x position first.
- **Diacritics:** stacked tones reach 17/12 em. Don't put `overflow: hidden` or a tight `height` on a pixel line box; chips and buttons centre an 18 px line inside their own height.
- **Loading:** the subset is about 8 KB and preloaded by next/font. Keep `display: "swap"`. Keep `adjustFontFallback` if next/font accepts it for this face, so the swap doesn't shift layout much. The page is complete in the fallback face.
- **Verification (for your report):**
  - DevTools `CSS.getPlatformFontsForNode` shows "Portfolio Pixel" for pixel roles and "Portfolio Sans" for the rest, with 0 fallback glyphs, including "Hồ Trọng Đại" and "→"
  - no overflow at 320 to 1920 px
  - a DPR 1 screenshot of the HUD, a button and a panel heading at 400 % zoom shows hard pixel edges
  - `fonts:check` lists the new family
  - no "Galmuri" in the served woff2 name table, the CSS or the PDF fonts
