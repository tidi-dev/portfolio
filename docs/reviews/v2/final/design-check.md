# v2 Phase F design check · B · Holo Deck

- **Reviewer:** design-lead (`design-system`, critique). **Date:** 2026-09-28.
- **Inputs:** `DESIGN.md`, `docs/design/directions-v2.md` §5, `info.md`, screens in `docs/reviews/v2/phase-2/` to `phase-5/screens/`, including the full-page captures. No fresh captures were needed.
- **Also read:** `src/styles/reveal.css`, `holo.css`, `theme.css`, `sections.css`, `resume-document.tsx`, `docs/reviews/v2/phase-5/raw/pdf-text.txt` and the font manifest. I read these only to confirm the rulings and edited none of them.

## Verdict: SIGN-OFF WITH CHANGES

v2 clearly answers v1's rejection.
- **The hero lands.** In Deck it is eye-catching and alive: a bloomed projector, a gold host, a comet packet, a live log, and a HUD strip with the XP bar. It reads as a sci-fi RPG command deck rendered with developer-grade restraint. The signature moment (run the handshake) is legible at 1440 and 375.
- **Consistency.** It is consistent with `DESIGN.md`: one gold accent, holo used as light, 0-radius chamfers everywhere, and one type pairing. There are no eyebrows, no mono and no terminal chrome.
- **Clean, not kitsch.** The one noisy area, the facts plus the steps list in quest files, is still well ordered.

It has three weaknesses:
1. Below the Quest journal, the page loses energy. The sections become static dark panels, the power-on wipe reads as a black curtain, and AFK and Join party end the page flat.
2. In Lab, the 3D base renders as a heavy grey slab, so Lab looks dull next to Deck.
3. The second 3D moment (the quest hologram) has no glow in Deck.

V1 to V10 below fix all three within the approved direction. None is a material change to the look, so no owner approval is needed. The owner sees the result at release.

`DESIGN.md` is updated for every ruling and change below. Lint: 0 errors, 0 warnings. No colour pair changed, so all 52 contrast pairs still pass. **Heads-up:** `pnpm tokens:check` now reports stale generated tokens, because the front matter changed (`avatar-xl`, `stat-value`, `speaker-tag`). `frontend-engineer` runs `pnpm tokens` as the first step of the fixes.

## Rulings on the open items

| # | Item | Ruling | `DESIGN.md` |
|---|---|---|---|
| 1 | `stat-value` `'tnum' 1` | **Drop it; keep Chakra Petch.** The readouts are the HUD's numerals, and each stands alone (no column to align). The count-up already overlays the final text, which holds the width, so proportional digits cause no layout shift. Set `font-variant-numeric: normal` in `type-stat-value`. | front matter `stat-value`; Typography table |
| 2 | Rectangular focus ring | **Accept.** A 2 px square ring, offset 3 px, reads as a HUD selection frame, keeps one ring for every control, passes 3:1, and is never clipped. A chamfer-following ring would need a two-polygon pseudo-element on every control for no gain in clarity. | Components → Skip link and focus ring |
| 3 | Feathered Deck canvas edges | **Accept, as specified:** Deck only, 8 % per side, inside the stage, never under text; Lab has no feather. That matches the build (`--canvas-feather`). | Elevation → Glow |
| 4 | Speaker tag uppercases "TiDi" | **`speaker-tag` uses `nav` type** (Chakra Petch 600, 0.875rem, 0.02em, no transform), cased "TiDi". **New principle:** names (TiDi, Hồ Trọng Đại, Dai Ho Trong, project and employer names) never take an uppercase style. On gold, `on-accent` is still 9.72 / 10.11. | front matter `speaker-tag`; Typography principles; Components → Dialogue box |
| 5 | Level-up once per load | **Accept; the spec now says "once per page load (no storage)".** On a one-page site, a reload is a new visit, and session storage would add state for a 0.8 s sweep. | Motion table → Level up |
| 6 | Power-on is a cover layer | **Motion table updated.** A `surface` cover slides `translateX(0 → 100%)` inside its own clipping track (`inset: 0; overflow: clip`, not the panel, so focus rings aren't cut), with a 2 px `holo` leading edge (see V4). The table records why it isn't `clip-path`: IntersectionObserver never reports an element clipped to nothing. The build currently uses `scaleX(1 → 0)`, origin right. Switch to `translateX`, because `scaleX` would squash the edge line. | Motion table → Panel power-on |
| 7 | §Voice "where he used it" | **Changed to "where the owner used it".** | Voice |
| 8 | Résumé "Term – description" separator | **Keep as is: it is the owner's own em dash.** In `pdf-text.txt`, all 9 separators are U+2014 from the owner's `info.md` strings (for example "Debt ledger — every order…"), rejoined verbatim by `OWNER_DASH`. Portfolio Sans draws its em dash narrow, so it looks like an en dash. The voice rule keeps the owner's wording as given. **Rule for separators we write:** a colon ("Term: value"), or a middle dot in lists. The only U+2013 characters in the PDF are the education years "2017–2020" and "2013–2017", copied from `info.md`, which the site also shows. That is a QA content note, not a design change. | Voice |

## Visual changes, prioritised

| # | Severity | Screen | Issue | Exact fix | `DESIGN.md` |
|---|---|---|---|---|---|
| V1 | Important | hero@1440 and @375, light; journal@1440/light (`unlocked-1440-light`) | The Lab projector base renders as a dark grey metallic slab that dominates the stage (no environment map), and the cone almost vanishes. Lab looks dull next to Deck. | Lab base material: metalness 0.15, roughness 0.6 (Deck keeps 0.7 / 0.35). Lab cone opacity 0.16 → 0.22. Apply the same to the quest projector. | 3D Scenes → Hero projector (Base, Cone); Quest holograms |
| V2 | Important | journal@1440/dark (`journal-`, `unlocked-1440-dark`) | The second 3D moment has no glow: the quest projector base is a black disc with faint rings, so "Quest unlocked" feels flat after the hero. | Give the quest canvas the hero's Deck Bloom (0.9 / 0.2 / 0.3, mipmap blur) and the Deck feather, plus a `holo` rim ring at r 1.4 on the base. | 3D Scenes → Quest holograms |
| V3 | Important | house-rules@1440 and @375, both themes | Rule 1 splits the owner's sentence: "There's no perfect system" on one line, then a line starting "— only trade-offs…". | Make the lead phrase run in: an inline `rule-lead`, then the rest of the sentence in the same paragraph. Replace the `::after` `scaleX` underline with `text-decoration` 2 px, offset 4 px, `accent-ink`, which wraps with the text. Its colour transitions `transparent → accent-ink` over `sweep` after the wipe; in the calm mode it is present at once. | Components → Rule panel; Motion budget and the House rules row |
| V4 | Important | `power-on-mid-1440-dark`, every section | The power-on reads as a black curtain sliding away rather than a panel coming online. | Give the cover a 2 px `holo` leading edge at 70 %, and move the cover with `translateX(0 → 100%)` inside an `overflow: clip` track (ruling 6). | Motion table → Panel power-on |
| V5 | Important | `experience-1440-dark-motion-on` versus `-motion-off` | The Mission log line stops at the NFQ node, about 60 % drawn, while the whole section is in view. The career line looks broken. | Set `animation-range: entry 10% cover 45%` on the `view()` timeline, so the line is complete before the section's middle passes the viewport's middle. | Motion table → Mission log line |
| V6 | Minor | about@1440, both themes | The stats panel has about 180 px of dead space under a small 200 px avatar, which is the owner's only image, because the dialogue panel is taller. | Avatar width `avatar-xl` (264 px) from `xl`; keep 200 px at `lg`. | spacing `avatar-xl`; Components → Avatar frame; Responsive → Character stats |
| V7 | Minor | contact@1440, both themes | The owner's sign-off sits in a short panel with about 220 px of empty space below it, and the page ends flat. | From `lg`, stretch the sign-off panel to the rows panel's height (sign-off at the top). Frame the Join party grid with the hero's four corner brackets, drawn on (`brackets`, ease-out) when the sign-off panel powers on; in the calm mode they are present at once. The same frame then opens and closes the page. | Shapes → Corner brackets; Components → Contact row; Motion → Join party brackets |
| V8 | Minor | `hero-resume-375-*` | The four hero controls stack at four different widths (CTA, Résumé, Run, switch), which looks ragged. The spec's "controls in a row" doesn't fit at 375. | Below `sm`, the CTA pair and the console controls each stack at full width; from `sm`, each pair sits in a row. | Responsive → Hero |
| V9 | Minor | inventory@1440, both themes | Each Leveling up card spends a whole line on its triangle, so the cards look half empty. | Put the triangle inline before the topic: 12 px, gap `xs`, centred on the first line, 16 px padding. | Components → Training card |
| V10 | Minor | afk@1440 and @375 | AFK is the one section with no reward moment, only the wipe. | With its panel, each icon rises 4 px and fades in once (`row`, stagger `row`); in the calm mode, present at once. No loop. | Motion table → AFK |

## Copy requests
None. Every change reuses approved strings. The speaker tag keeps "TiDi" as cased.

## Checks
- `npx @google/design.md lint DESIGN.md`: 0 errors, 0 warnings, 1 info. `pnpm design:lint` passes.
- **Contrast:** no colour token or pair changed, so the Colors table (52 pairs, 0 failures) stands. The speaker tag keeps `on-accent` on `accent`, 9.72 (Lab) and 10.11 (Deck).
- **Tokens:** `pnpm tokens:check` reports stale files, as expected after a front-matter change. Regenerate with `pnpm tokens`.
