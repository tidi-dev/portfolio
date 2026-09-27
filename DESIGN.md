---
version: alpha
name: TiDi Portfolio
description: A work-first systems portfolio for technical hiring managers and tech-literate clients, with a precise, evidence-first language, leaning toward engineering documentation (system sheets and drawings).
colors:
  primary: "#14161B"              # Epoxy: text, headings, ink strokes
  surface: "#F4F4F8"              # Wafer: page
  surface-raised: "#FFFFFF"       # Plate: bench, drawing bands, video poster, avatar mat
  text-muted: "#525866"           # Lead: dates, facts terms, captions, subheads
  accent: "#5B3FD0"               # Attest violet: proof and action only
  accent-hover: "#4A2EB8"         # same hue, one step darker: hover, active
  on-accent: "#FFFFFF"            # labels on violet
  trace: "#737A87"                # construction lines: graphics only, never text
  rule: "#D9DAE2"                 # hairline dividers, plate borders (decorative)
  focus: "{colors.accent}"        # focus ring
  primary-dark: "#ECEAF4"         # Marking
  surface-dark: "#15131C"         # Darkroom
  surface-raised-dark: "#201D2A"  # Plate, dark
  text-muted-dark: "#A9A5BA"      # Lead, dark
  accent-dark: "#B7A6FF"          # UV glow
  accent-hover-dark: "#CEC3FF"
  on-accent-dark: "#15131C"
  trace-dark: "#827D96"
  rule-dark: "#3A3746"
  focus-dark: "{colors.accent-dark}"
typography:
  display: { fontFamily: Archivo, fontSize: 3.75rem, fontWeight: 800, lineHeight: "0.9", letterSpacing: -0.01em, fontVariation: "'wdth' 125" }
  heading-section: { fontFamily: Archivo, fontSize: 2rem, fontWeight: 700, lineHeight: "1.1", fontVariation: "'wdth' 125" }
  heading-sheet: { fontFamily: Archivo, fontSize: 1.5rem, fontWeight: 700, lineHeight: "1.15", fontVariation: "'wdth' 112" }
  name: { fontFamily: Archivo, fontSize: 1.5rem, fontWeight: 500, lineHeight: "1.2", fontVariation: "'wdth' 100" }
  lead: { fontFamily: Archivo, fontSize: 1.125rem, fontWeight: 400, lineHeight: "1.5", fontVariation: "'wdth' 100" }
  body: { fontFamily: Archivo, fontSize: 1rem, fontWeight: 400, lineHeight: "1.6", fontVariation: "'wdth' 100" }
  body-sm: { fontFamily: Archivo, fontSize: 0.9375rem, fontWeight: 400, lineHeight: "1.5", fontVariation: "'wdth' 100" }
  ui-strong: { fontFamily: Archivo, fontSize: 1rem, fontWeight: 700, lineHeight: "1.25", fontVariation: "'wdth' 100" }
  label: { fontFamily: Archivo, fontSize: 0.8125rem, fontWeight: 600, lineHeight: "1.3", fontVariation: "'wdth' 87.5", fontFeature: "'tnum' 1, 'lnum' 1" }
  label-strong: { fontFamily: Archivo, fontSize: 0.8125rem, fontWeight: 700, lineHeight: "1.3", fontVariation: "'wdth' 87.5", fontFeature: "'tnum' 1, 'lnum' 1" }
  wordmark: { fontFamily: Archivo, fontSize: 1.25rem, fontWeight: 800, lineHeight: "1", fontVariation: "'wdth' 125" }
rounded:
  base: 6px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  gutter: 24px
  edge: 20px
  edge-md: 32px
  edge-lg: 40px
  container: 1200px
  facts-label: 88px
  target: 44px
components:
  page: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.body}" }
  meta: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.label}" }
  plate: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", rounded: "{rounded.base}", padding: 16px }
  caption: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.body-sm}" }
  divider: { backgroundColor: "{colors.rule}", height: 1px }
  link: { textColor: "{colors.accent}" }
  link-hover: { textColor: "{colors.accent-hover}" }
  nav-link: { textColor: "{colors.primary}", typography: "{typography.label}", height: 44px }
  nav-link-hover: { textColor: "{colors.accent}" }
  icon-button: { textColor: "{colors.primary}", size: 44px, rounded: "{rounded.base}" }
  icon-button-hover: { textColor: "{colors.accent}" }
  focus-ring: { textColor: "{colors.focus}", size: 2px, padding: 2px }
  skip-link: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.ui-strong}", rounded: "{rounded.base}", height: 48px, padding: 16px }
  button-primary: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.ui-strong}", rounded: "{rounded.base}", height: 48px, padding: 20px }
  button-primary-hover: { backgroundColor: "{colors.accent-hover}", textColor: "{colors.on-accent}" }
  button-primary-active: { backgroundColor: "{colors.accent-hover}", textColor: "{colors.on-accent}" }
  button-toggle: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.ui-strong}", rounded: "{rounded.base}", height: 48px, padding: 16px }
  button-toggle-hover: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent}" }
  button-toggle-pressed: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}" }
  drawing-node: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.label}", rounded: "{rounded.base}", height: 40px }
  drawing-node-replaced: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.label}", rounded: "{rounded.base}", height: 40px }
  drawing-proof: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent}", typography: "{typography.label-strong}" }
  drawing-construction: { textColor: "{colors.trace}" }
  verdict-genuine: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent}", typography: "{typography.ui-strong}" }
  verdict-rejected: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.ui-strong}" }
  page-dark: { backgroundColor: "{colors.surface-dark}", textColor: "{colors.primary-dark}" }
  meta-dark: { backgroundColor: "{colors.surface-dark}", textColor: "{colors.text-muted-dark}" }
  plate-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.primary-dark}" }
  caption-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.text-muted-dark}" }
  divider-dark: { backgroundColor: "{colors.rule-dark}" }
  link-dark: { textColor: "{colors.accent-dark}" }
  link-hover-dark: { textColor: "{colors.accent-hover-dark}" }
  nav-link-dark: { textColor: "{colors.primary-dark}" }
  nav-link-hover-dark: { textColor: "{colors.accent-dark}" }
  icon-button-dark: { textColor: "{colors.primary-dark}" }
  icon-button-hover-dark: { textColor: "{colors.accent-dark}" }
  focus-ring-dark: { textColor: "{colors.focus-dark}" }
  skip-link-dark: { backgroundColor: "{colors.accent-dark}", textColor: "{colors.on-accent-dark}" }
  button-primary-dark: { backgroundColor: "{colors.accent-dark}", textColor: "{colors.on-accent-dark}" }
  button-primary-hover-dark: { backgroundColor: "{colors.accent-hover-dark}", textColor: "{colors.on-accent-dark}" }
  button-primary-active-dark: { backgroundColor: "{colors.accent-hover-dark}", textColor: "{colors.on-accent-dark}" }
  button-toggle-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.primary-dark}" }
  button-toggle-hover-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.accent-dark}" }
  button-toggle-pressed-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.primary-dark}" }
  drawing-node-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.primary-dark}" }
  drawing-node-replaced-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.text-muted-dark}" }
  drawing-proof-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.accent-dark}" }
  drawing-construction-dark: { textColor: "{colors.trace-dark}" }
  verdict-genuine-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.accent-dark}" }
  verdict-rejected-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.text-muted-dark}" }
---

# TiDi Portfolio · Design system

> Direction B · Proof, selected by the owner on 2026-09-28 with no modifications (`docs/design/directions.md` §11). Created by `design-lead` on 2026-09-28 from §3 and §5 of that file and the main-session rulings in `docs/progress.md`. Facts and copy come only from `info.md`. A slot marked `[copy: to draft & approve]` waits for the owner.

## Overview
**Design Read.** Reading this as: a work-first systems portfolio for technical hiring managers and tech-literate clients, with a precise, evidence-first language, leaning toward engineering documentation (system sheets and drawings). The audience roles are inferred (directions §1).

**Concept.** Show the mechanism. Each quest is a system sheet, explained by a drawing of the system that makes it trustworthy, and the page opens on a handshake the visitor can run. Everything else is light, quiet and exact.

**Dials.** VARIANCE 6: a split hero and full-width drawing bands break the column, but every sheet shares one anatomy, so scanning holds. MOTION 5: one sequence of about 1.1 s, only when asked. DENSITY 4: few, deep sheets, with details in a facts column.

**Signature moment: Run the handshake.** The hero bench shows a host challenging a chip. Run sends the challenge, the chip answers, the response returns and the verdict reads "genuine". The counterfeit toggle makes the next run fail. See Components → Handshake bench, and Motion.

**Consistency locks**
1. **Theme:** light-first; follows the system, with a toggle. Dark swaps colour tokens only (`-dark`), never layout, type or motion.
2. **Accent:** Attest violet (UV glow in dark) means proof or action: the proof element of a drawing, links, the CTA, the run button, the focus ring. Nothing else is violet.
3. **Radius:** 6 px on every rectangle. The only circle is the handshake packet.
4. **Icons:** Tabler outline, stroke 1.5, square caps and miter joins, 20 px.
5. **Type:** Archivo variable, one family. Roles differ by the width and weight axes. No mono, no italics.
6. **Drawings:** one grammar (Components → Drawing grammar).
7. **Labels:** one per intent. "Résumé" names the PDF everywhere; the nav's "Contact" and the hero CTA both land on `#contact`.
8. **Controls:** one button height, 48 px; every target at least 44 × 44 px.

**B's documented risks, answered:** "cool and impersonal; the avatar clashes" → About avatar. "Leans on CyberRock" → Sheets (facts only) and the drawing table. "Build effort" → Drawing grammar: four drawings, one grammar, two static variants each, script only in the bench.

## Colors
Palette names and hex values are §5's. Added only the roles §5 left open: `accent-hover`, `rule`, and `on-accent` as a named token.

| Token | Light | Dark | Name | Role, and why |
|---|---|---|---|---|
| `surface` | `#F4F4F8` | `#15131C` | Wafer / Darkroom | Page. A silicon-wafer grey with a violet cast; dark is the room where a UV check happens. |
| `surface-raised` | `#FFFFFF` | `#201D2A` | Plate | The bench, drawing bands, video poster and avatar mat. Nothing else is boxed. |
| `primary` | `#14161B` | `#ECEAF4` | Epoxy / Marking | Text, headings, ink strokes: chip-package black, laser-etched marking. |
| `text-muted` | `#525866` | `#A9A5BA` | Lead | Dates, facts terms, captions, subheads, replaced-node labels. |
| `accent` | `#5B3FD0` | `#B7A6FF` | Attest violet / UV glow | The one accent (lock 2). UV security ink is the everyday proof that a label or a note is genuine. |
| `accent-hover` | `#4A2EB8` | `#CEC3FF` | Violet, one step | Hover and active on violet fills and links. Same hue. |
| `on-accent` | `#FFFFFF` | `#15131C` | | Labels on violet. |
| `trace` | `#737A87` | `#827D96` | Trace | Construction lines: audit trail, replaced parts, the counterfeit chip, the toggle border. Graphics only: it fails 4.5:1 as text. |
| `rule` | `#D9DAE2` | `#3A3746` | Rule | Hairline dividers and plate borders. Decorative. |
| `focus` | = `accent` | = `accent-dark` | | The focus ring. |

- No colour carries meaning alone: every proof element is labelled, construction lines are dashed, and the pressed toggle swaps its icon.
- No gradients, glows, blurs or violet tints anywhere. Violet on dark reads as crypto the moment they appear.

**Contrast** (WCAG 2.x relative luminance, computed by a node script on 2026-09-28): **22 required checks, 0 failures.**

| Pair | Tokens | Light | Dark | Needs | Result |
|---|---|---|---|---|---|
| Body text, headings | `primary` on `surface` | 16.50 | 15.45 | 4.5 | Pass |
| Text on plates | `primary` on `surface-raised` | 18.10 | 13.88 | 4.5 | Pass |
| Dates, facts terms, subheads | `text-muted` on `surface` | 6.50 | 7.69 | 4.5 | Pass |
| Captions, replaced labels | `text-muted` on `surface-raised` | 7.13 | 6.91 | 4.5 | Pass |
| Links, nav and icon hover, focus ring | `accent` on `surface` | 6.24 | 8.68 | 4.5 | Pass |
| Proof labels, verdict, toggle hover | `accent` on `surface-raised` | 6.85 | 7.80 | 4.5 | Pass |
| Link hover | `accent-hover` on `surface` | 8.06 | 11.28 | 4.5 | Pass |
| Link hover on plates | `accent-hover` on `surface-raised` | 8.85 | 10.13 | 4.5 | Pass |
| Button label | `on-accent` on `accent` | 6.85 | 8.68 | 4.5 | Pass |
| Button label, hover or active | `on-accent` on `accent-hover` | 8.85 | 11.28 | 4.5 | Pass |
| Construction lines, replaced nodes, toggle border | `trace` on `surface-raised` | 4.32 | 4.19 | 3 | Pass |

Decorative and exempt: `rule` on `surface` 1.27 / 1.59 and on `surface-raised` 1.39 / 1.43; Plate against the page 1.10 / 1.11 (the rule border draws the plate's edge). Proof and ink strokes contrast with each other at only 2.64 / 1.78, so labels and stroke width, not colour, tell them apart.

## Typography
**Family:** Archivo, variable (`wdth` 62–125, `wght` 100–900), by Omnibus-Type. Licence SIL OFL 1.1, with no Reserved Font Name, so subsets are allowed. Source: `next/font/local` (`display: "swap"`), built from the pinned `Archivo[wdth,wght].ttf` (google/fonts `95f4904`), subset to the latin and vietnamese ranges plus the arrows ← → ↔, with axes cut to `wdth` 87.5–125 and `wght` 400–800, which cover every role (engineering ruling 1, contrib-engineering §1.5). Google's and Fontsource's subsets omit U+2192 "→", which the owner's strings use (the Quest caption, the Five-Minute Window). latin-ext is dropped: it served only "Đ", which the vietnamese range covers. All 102 tested Vietnamese code points are in the file (directions §3). Why: a grotesque built for technical and editorial work; its width axis gives the name an engineered stance and the drawing labels a compact register from one file, so no mono is needed. Fallback: `system-ui, sans-serif`, with next/font's metric adjustment.

**Hierarchy.** Fluid from 375 to 1440 px. Tokens hold the 375 px size; code uses the clamp.

| Token | px, 375 → 1440 | `clamp()` | Line height | Weight | Width | Use |
|---|---|---|---|---|---|---|
| `display` | 60 → 112 | `clamp(3.75rem, 2.606rem + 4.883vw, 7rem)` | 0.9 | 800 | 125 | "TiDi" in the h1 only |
| `heading-section` | 32 → 44 | `clamp(2rem, 1.736rem + 1.127vw, 2.75rem)` | 1.1 | 700 | 125 | h2, and the Contact sign-off |
| `heading-sheet` | 24 → 32 | `clamp(1.5rem, 1.324rem + 0.751vw, 2rem)` | 1.15 | 700 | 112 | Sheet titles (h3) |
| `name` | 24 → 32 | as `heading-sheet` | 1.2 | 500 | 100 | "Hồ Trọng Đại" (`lang="vi"`), "Dai Ho Trong" |
| `lead` | 18 → 20 | `clamp(1.125rem, 1.081rem + 0.188vw, 1.25rem)` | 1.5 | 400 | 100 | Hero sentence, sheet ledes, house rules |
| `body` | 16 → 17 | `clamp(1rem, 0.978rem + 0.094vw, 1.0625rem)` | 1.6 | 400 | 100 | Running text, lists, term descriptions |
| `body-sm` | 15 | fixed | 1.5 | 400 | 100 | Facts values, captions, footer |
| `ui-strong` | 16 | fixed | 1.25 | 700 | 100 | Buttons, role line, readout, terms, Experience h3 |
| `label` | 13 → 14 | `clamp(0.8125rem, 0.79rem + 0.094vw, 0.875rem)` | 1.3 | 600 | 87.5 | Dates, nav; drawing labels at 14 units |
| `label-strong` | 13 → 14 | as `label` | 1.3 | 700 | 87.5 | Status, facts terms, subheads, proof labels |
| `wordmark` | 20 | fixed | 1 | 800 | 125 | Header "TiDi" |

- **Scale:** ratio 1.25 at 375 px, rising to about 1.333 at 1440 px, with half steps for `lead` and `label`. Desktop sizes are rounded to the 4 px grid (within 7 %).
- **Axes:** width through `font-stretch` (125 %, 112 %, 100 %, 87.5 %), weight through `font-weight`; never `font-variation-settings`, which breaks inheritance.
- **Figures:** `label` and `label-strong` turn on `tnum` and `lnum`, so dates and figures align digit by digit. Running text keeps the default figures.
- **Measure:** body at most 68ch, `lead` at most 60ch. In the split hero the sentence may run 36–48 characters per line.
- **Vietnamese:** line height at least 1.15 wherever "Hồ Trọng Đại" appears; `display` (0.9) never holds it.
- **Rules:** sentence case; no all caps, letter-spaced labels or italics; emphasis by weight only. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`, and `hyphens: manual`. Curly quotes and `…` as in directions §3.

## Layout
- **Container:** content at most `container` (1200 px). Page edges: `edge` 20 px, `edge-md` 32 px from 768 px, `edge-lg` 40 px from 1024 px, plus safe-area insets.
- **Grid:** one column below 1024 px (768–1023 pairs the blocks named in Responsive Behavior); 12 columns with `gutter` (24 px) from 1024 px.
- **Rhythm:** sections sit `clamp(4rem, 3.296rem + 3.005vw, 6rem)` apart (64 → 96 px), sheets `clamp(3rem, 2.648rem + 1.502vw, 4rem)` (48 → 64 px). Inside a sheet: head to lede 8, lede to drawing 24, drawing to columns 24 (32 from lg), list items 8, facts rows 12. Every gap is a spacing token.
- **Alignment:**
  - Hero from lg: split 5 | 7. The bench's top edge meets the cap height of "TiDi"; the CTA baseline meets the bench caption.
  - Sheets from lg: the drawing band spans all 12 columns with one inner padding. The body takes cols 1–7 and the facts cols 9–12 (col 8 is air), with terms in the fixed `facts-label` column (88 px). In the sheet head, the title sits left; status and dates sit right on the same baseline.
  - Drawings follow an 8-unit grid.
- **Layers:** only the skip link (z-index 100) rises above content. No sticky element, overlay or modal: the header scrolls away, and anchor targets get `scroll-margin-top: 24px`.

## Elevation & Depth
Flat, with no shadows anywhere. Depth has a single step: Plate on Wafer, edged by a 1 px `rule` border (Plate dark on Darkroom in the dark theme). Nothing lifts, scales or glows on hover; state shows through colour, border weight and icons.

## Shapes
- **Radius:** `rounded.base`, 6 px, on plates, nodes, boundaries, buttons, the menu panel and the avatar mat; focus outlines follow it. Images keep square corners inside their mat.
- **Icons:** Tabler Icons, outline set (MIT; tabler.io/icons; `@tabler/icons-react` 3.48.0, checked 2026-09-28; `frontend-engineer` verifies and installs). Stroke 1.5; `stroke-linecap: square` and `stroke-linejoin: miter` set in CSS over Tabler's round default; 20 px; `currentColor`; `aria-hidden`. The set: `sun`, `moon`, `menu-2`, `x`, `external-link`, `download`, `player-play`, `check`, `square`, `square-check`. No brand marks: contact links are text.
- **Ratios:** avatar 3:4 (1086 × 1448 source), video poster 16:9, social image 1200 × 630.

## Components
**Conventions.** States are separate entries (`-hover`, `-active`, `-pressed`). Every interactive element shows `focus-ring` on `:focus-visible`: 2 px solid `focus` at a 2 px offset (`size` is the width, `padding` the offset). Nothing is ever disabled. `-dark` twins swap colours and inherit everything else. The schema has no border property, so borders are specified here: plates 1 px `rule`, the toggle 1.5 px `trace`. Plates pad 16 px below md and 24 px from md; the avatar mat sets its own. In drawings, `textColor` is also the stroke: SVG strokes use `currentColor`.

### Header, navigation, skip link
- Wordmark "TiDi" (`wordmark`, links to the top); nav with Quest journal, Experience, House rules and Contact (`nav-link`); theme toggle. 56 px tall, 64 px from lg. Not sticky.
- `nav-link`: ink, no underline. Hover: `nav-link-hover`, with a 1 px underline. Targets are 44 px tall.
- Below 768 px the nav folds behind an `icon-button` (`menu-2`, `x` when open; `aria-expanded`, `aria-controls`; name `[copy: to draft & approve]`). The panel opens in flow under the header, with no overlay: four 48 px rows split by `divider`. Escape closes it and returns focus to the button; choosing a link closes it. The links stay reachable without JavaScript.
- Skip link: the first focusable element, targeting `main`, shown as `skip-link` at an 8 px inset when focused. Label `[copy: to draft & approve]`.

### Links and buttons
- `link`: underlined (1 px, 0.2em offset); hover `link-hover` with a 2 px underline. External links open in the same tab. Only the Lemonswan link carries `external-link`; "Résumé" carries `download`. Never an appended `→`. Every link sits on its own line or row, so every target can reach 44 px.
- `button-primary`: the hero CTA (a link to `#contact`), the run button, and the video play mark (48 × 48, icon only). 48 px tall, 20 px padding, `ui-strong`, an optional 20 px leading icon with an 8 px gap. Hover and active use `accent-hover`; no transform.
- `button-toggle`: the counterfeit toggle only. 1.5 px `trace` border, leading `square`. Hover: label and border turn `accent`. Pressed (`aria-pressed="true"`): a 2 px `primary` border and `square-check`; the label never changes. Pressed and hovered: accent label, 2 px accent border.
- Theme toggle: an `icon-button`, 44 × 44, showing `sun` in light and `moon` in dark, with `aria-pressed="true"` while dark; hover `icon-button-hover`; name `[copy: to draft & approve]`. It starts from the system theme, stores the visitor's choice, never flashes on load and switches instantly. `color-scheme` and `theme-color` (`surface`, `surface-dark`) follow it. Without JavaScript it is hidden, like the bench controls, and the system theme applies.

### Hero
- **Left column, three groups:** the h1 lockup ("TiDi" in `display`, then "Hồ Trọng Đại" with `lang="vi"` and "Dai Ho Trong" in `name`, the second in `text-muted`, wrapping as needed); the role "Full-stack Developer" (`ui-strong`) with the positioning sentence (`lead`); the CTA pair, `button-primary` `[copy: CTA label]` and `link` `[copy: Résumé label]`.
- **Right column:** the bench. No avatar, no background decoration. The LCP element is text.

### Handshake bench (signature)
- **Anatomy:** a `plate` figure. The drawing has a "host" node on the left, a "chip" node on the right (square, with short ink pins on each side), and two lines between them: "challenge" on top (host → chip) and "response" below (chip → host). Under it sit the readout (`verdict-genuine` or `verdict-rejected`, a polite live region), the controls (run: `button-primary` with `player-play`, `[copy: run label]`; counterfeit: `button-toggle`, `[copy: toggle label]`) and the caption (`caption`): "prove a device is genuine before anything trusts it".
- **States:**
  - *Rest:* the completed handshake, with both lines proof and the readout "genuine" with `check`. It is the server HTML and stays after hydration.
  - *Idle:* lines construction, labels `text-muted`, readout empty.
  - *Challenge:* the challenge line turns proof and the packet travels. *Response:* the chip pulses, the response line turns proof and the packet returns. *Genuine:* the readout fades in.
  - *Rejected:* with the toggle pressed, the chip outline is construction. A run stops after the challenge: the response line stays construction and the readout shows `[copy: rejected verdict]` with `x` in `trace`, shaking once.
- **Behaviour:** run always restarts from idle, interrupting any run in progress; the toggle cancels a run and returns to idle. The readout announces "challenge", "response", then the verdict. Focus stays on the pressed button.
- **Reduced motion:** no packet, pulse or shake. The lines show the step numerals 1 and 2 (a real sequence), the final state appears at once, and the readout announces only the verdict.
- **No JavaScript:** the rest state and its caption. A `<noscript>` style sets the controls to `display: none`, so no button is dead and nothing shifts.
- **Variants,** by container query on the plate's inner width: compact, authored 240 units wide, below 480 px, rendered at most 1.5× (360 px); wide, authored 480 units, from 480 px, rendered at most 1.35× (648 px). Both stay horizontal. The controls sit side by side from 480 px and stack at full width below it.
- **Text alternative:** the caption, plus a visually hidden ordered list of the steps (challenge, response, verdict); its connecting words are `[copy: to draft & approve]`.
- **Code:** the only client leaf with motion. "host", "chip", "challenge", "response" and "genuine" come from `info.md`; the host/chip framing waits for the owner's technical check.

### Sheets
- **Full sheet** (CyberRock, botmivivi, Quest @ NFQ Asia), in DOM order: the head (h3 in `heading-sheet`; status in `label-strong` and dates in `meta`, on the right, same baseline); the lede (`lead`, the owner's one-liner); the drawing band; the facts list; the body (What I built, What it does or Achievements; Party lead for Quest; the video facade closes the Quest sheet). A `divider` separates sheets. No box, no card, no numbering.
- **Facts only:** a slot renders only when `info.md` holds its fact. There is no problem, approach and result scaffold, and no "view project" link unless `info.md` has a link. CyberRock renders its lede, drawing, three bullets and facts, and implies nothing more. Outcomes sit in facts columns as evidence (Quest's "~5 min of downtime"; botmivivi's figures once approved), grouped with `Intl.NumberFormat("en-US")`.
- **Status** (Active, Side, Cleared) is bold text, never a chip or a colour.
- **Compact sheet** (Lemonswan, Scania): h3, a meta line ("NFQ Asia", plus dates where `info.md` has them; Scania has none), what was built, the stack, and the Lemonswan link ("lemonswan.com"). Side by side from lg, stacked below.
- **Lists:**
  - *Facts list* (`dl`): terms in `label-strong`, `text-muted`, in the 88 px column; values in `body-sm`; rows 12 px apart. Contact reuses it.
  - *Term list* (`dl`), for the owner's "Name — description" strings: the term in `ui-strong`, the description in `body` 4 px below, items 16 px apart.
  - *Inline list* (`ul`), for middot strings: items run inline, separated by a comma generated in CSS, and wrap. No middots, no pills.
  - *Bullets:* an 8 × 1.5 px `primary` dash, 16 px indent.
  - *Subheads* (What I built, What it does, Achievements, Leveling up, Education & certifications, Languages) are real headings in `label-strong`, `text-muted`.

### Drawing grammar
Applies to the bench and the three sheet drawings. There are no other diagrams, illustrations or decorative SVGs.

| Element | Spec |
|---|---|
| Node | `drawing-node`: Plate fill, 1.5 px `primary` stroke, radius 6, 40 units tall, 12-unit padding, a centred 14-unit label (`label` weight and width) |
| Replaced node | `drawing-node-replaced`: 1.5 px `trace` stroke dashed 6 4; label in `text-muted` |
| Ink line | 1.5 px `primary`. Arrowhead: a filled 8 × 8-unit triangle, the only arrowhead |
| Proof | `drawing-proof`: 2 px `accent`, same arrowhead, label in `label-strong` accent. Exactly one proof per drawing, always labelled |
| Construction | `drawing-construction`: 1.5 px `trace`, dashed 6 4; its label is `text-muted` |
| Boundary | a labelled radius-6 region around nodes, drawn as ink, construction or proof |
| Size | 8-unit grid. Wide variant authored at 880 units, shown when the plate's inner width is at least 880 px (from lg, where it is 894 px or more), rendered at most 1.3× (1144 px). Tall variant authored at 240 units, shown below that, at most 1.5× (360 px). Labels never render below 14 px (Responsive Behavior → Variant sizes) |
| Text alternative | a `figure`: each SVG `aria-hidden="true"`, a visible `figcaption` (`caption`), and a visually hidden ordered list of the steps, built from the owner's strings |
| Code | static, server-rendered SVG with no JavaScript. Both variants are in the HTML; a container query hides one |

| Drawing | Proof | Ink | Construction | Wide / tall | Caption |
|---|---|---|---|---|---|
| CyberRock | "the field" → "Challenge-response auth" → "genuine"; under the auth node, "token, host, mutual, daisy-chain and secure-boot attestation" | "manufacturing" → "the field"; a branch off that line to "supplier exports", drawn as an output, not a stage | "full audit trail", dashed under the lifecycle, with ticks to its three nodes | Wide: one row; the branch drops below; the trail runs under everything. Tall: top to bottom; the branch steps right; the trail runs down the right edge, labelled at its foot | "chip authentication and lifecycle" |
| Quest | "DynamoDB" → "MySQL", labelled "~5 min of downtime", with the carried data beside it: `[copy: users, quest collection, award, status]` | territory "v2": NestJS, Prisma, MySQL | territory "v1", replaced nodes Lambda, EventBridge, DynamoDB | Wide: v1 left, v2 right, data stores on the bottom row so the proof runs level. Tall: v1 above, ending in DynamoDB; proof down; v2 below, starting with MySQL | "DynamoDB → MySQL migration with ~5 min of downtime" |
| botmivivi | a boundary labelled "the same transaction", around "order", "return" and "payment", each with an ink arrow into "balance" | the three inputs and "balance" | replaced nodes "creating order", "write report", "customer debt", "inventory", under `[copy: replaced-steps label]` | Wide: replaced steps (2 × 2) left, transaction right. Tall: replaced steps above, transaction below, inputs stacked | "numbers that keep themselves correct" |

- **Step lists come from:** CyberRock: "from manufacturing to the field", "with supplier exports and a full audit trail", the challenge-response bullet and "prove a device is genuine before anything trusts it". Quest: the v1 and v2 technology lines, the Five-Minute Window achievement and the owner's migration note. botmivivi: the debt-ledger description and the owner's "replace manual step from …" line. Any connecting words are `[copy: to draft & approve]`.
- **Not drawn:** CyberRock's anomaly detection, which is outside "chip auth and lifecycle"; it stays a bullet.

### Video facade (Quest)
- A `plate` poster at 16:9: the title "Quest by NFQ" (`ui-strong`), the 48 px play mark (`button-primary`, `player-play`) and a `caption` line `[copy: says YouTube loads on play]`. No thumbnail and no request to YouTube before activation.
- The server HTML is a real link to the watch URL, so it works without JavaScript. With JavaScript, activation swaps in the youtube-nocookie iframe (autoplay after the click, `title="Quest by NFQ"`), fades it in and moves focus to it. The poster keeps its box, so nothing shifts.
- States: hover shows `button-primary-hover` on the mark; the focus ring wraps the whole poster. Name `[copy: video facade label]`. Width: the body column from lg, full width below.

### Experience, House rules, Inventory, AFK
- **Experience:** Sunbytes and NFQ Asia, each with an h3 (`ui-strong`), the title, the dates (`meta`) and the projects (inline list). From lg: aligned rows on cols 1–3, 4–6, 7–8 and 9–12, split by `divider`; stacked below. No header row, so no invented column labels.
- **House rules:** the intro (both owner lines, `body`), then the four rules as an ordered list in the owner's order: the numeral in `label-strong`, `text-muted`, in a 32 px column; the rule in `lead`, its first phrase in weight 700 as in the owner's profile; a `divider` between rules. From lg: intro cols 1–4, rules cols 5–12.
- **Inventory:** a `dl` of the five groups (term in `label-strong`, `text-muted`; value an inline list in `body`), in 1, 2 and 3 columns at base, md and lg; then "Leveling up" as a subhead over one inline list. No logos, levels, bars or percentages.
- **AFK:** an h2 and one inline list.

### About avatar
- **Placement:** About only, where the page turns from the work to the person. From lg: cols 9–12, its top level with the first line of the bio (cols 1–7). Below lg: after the two bio paragraphs, before Education & certifications, at most 320 px wide.
- **Mat:** a `plate` with 12 px padding (16 px from lg), a 1 px `rule` border and radius 6. The image keeps square corners and its native 3:4. No shadow, rotation, tape, crop, filter, tint or duotone: it appears exactly as provided.
- **Caption:** `caption` style, under the mat: the owner's alt text, "Illustrated avatar of TiDi coding, gaming, playing football and drinking coffee", shown as the visible caption. The `img` then takes `alt=""`, so the description is read once. `[copy: confirm]`
- **Why it reads as intentional:** it is mounted like an exhibit in a technical document and captioned plainly. It is the only warm, textured object on the page and nothing else borrows its colours, so the contrast reads as a decision rather than a near-miss. The first-person bio sits beside it, and AFK (football, games) follows it.
- **Loading:** below the fold, lazy, responsive AVIF or WebP with explicit dimensions. Never the LCP.

### Contact, footer, other surfaces
- **Contact:** the h2 is the sign-off, "Got a pain point? Bring the constraints — I'll bring the trade-offs." (`heading-section`, `id="contact"`), followed by a facts list with 48 px rows: Email → tidi.dev1321@gmail.com (`mailto:`), Telegram → @tidi1321 (https://t.me/tidi1321), GitHub → github.com/tidi-dev (https://github.com/tidi-dev), Résumé → `[copy: link text]` (the PDF), and last `[copy: to draft & approve]` → "Ho Chi Minh City, Vietnam": plain text with no link or icon, shown nowhere else on the page. From lg: sign-off cols 1–7, list cols 9–12.
- **Footer:** a `divider`, then "still learning, always solving." in `body-sm`, `text-muted`. Nothing else.
- **Not found:** the header, an h1 and a link home, both `[copy: to draft & approve]`, in page tokens.
- **Social image:** 1200 × 630, light: Wafer, the lockup in `display` metrics with the role, and the completed handshake (wide variant).
- **Favicon:** the bench's chip mark in `primary` (`primary-dark` under `prefers-color-scheme: dark`); a 180 px apple-touch icon on Wafer.

## Do's and Don'ts
- Do draw only what an `info.md` sentence states, labelled in its own words, and flag inferred structure for the owner.
- Do spend violet once per drawing, on the proof, and elsewhere only on action.
- Do render "Name — description" strings as term and description, and middot strings as lists (directions §3). The words never change.
- Do keep numbers as evidence, inside facts columns.
- Do keep the avatar exactly as provided: matted, captioned, in About only.
- Don't use `trace` for text, or grey for a proof.
- Don't add gradients, glows, blurs, shadows, or decorative grids, dots and crosshairs (the blueprint and dark-tech clichés).
- Don't use mono type, terminal or window chrome, all-caps or letter-spaced labels, eyebrows, or numbering that isn't a real sequence. Only the house rules (the owner's order) and the handshake steps are numbered.
- Don't add a stats strip, a logo wall, skill bars, pills for stacks, three equal cards, or a locale, time or weather strip. Plates hold only drawings, the bench, the poster and the avatar.
- Don't animate on scroll, loop, self-animate drawings, lift on hover or smooth-scroll.
- Don't append `→` to links, repeat the CTA with new wording, or show availability, travel, photography, the phone number or the second email.
- The one stated ban exception: the violet-tinted near-black dark theme, because the UV check happens in the dark. It was approved with B.

## Motion
**Budget:** the handshake sequence (only on run), colour feedback on controls, and one loading fade (the video). Nothing moves on its own; theme and menu changes are instant. Only `transform` and `opacity` animate, transitions list their properties (never `all`), and every animation is interruptible.

**Tokens,** mapped by hand (Known Gaps): `duration-feedback` 120 ms, `duration-fade` 150 ms, `duration-pulse` 160 ms, `duration-verdict` 200 ms, `duration-shake` 240 ms, `duration-travel` 360 ms; `ease-out` `cubic-bezier(0.2, 0.7, 0.2, 1)`, `ease-in-out` `cubic-bezier(0.4, 0, 0.6, 1)`.

| Element | Trigger | Property | Timing | Communicates | Reduced motion |
|---|---|---|---|---|---|
| Challenge packet | Run | `transform` host → chip, `opacity` in | travel, ease-out | The host asks the chip to prove itself | No packet; line 1 turns proof at once |
| Chip frame | The packet arrives | `transform` scale 1 → 1.04 → 1 | pulse, ease-in-out | The chip answers | None |
| Response packet | After the pulse | `transform` chip → host | travel, ease-out | The proof comes back | No packet; line 2 turns proof at once |
| Packet exit | A trip ends | `opacity` 1 → 0 | feedback | Delivered | None |
| Readout | The sequence ends | `opacity` 0 → 1 | verdict, ease-out | Genuine, or rejected | Appears at once |
| Rejected readout | A run with the toggle pressed | `transform` ±3 px, 2 cycles | shake, ease-in-out | The proof failed | None |
| Controls | Hover, `:focus-visible` | `color`, `background-color`, `border-color` | feedback, ease-out | Feedback | Same: colour is not motion |
| Video iframe | Activation | `opacity` 0 → 1 | fade, ease-out | The video is ready | Instant |

A genuine run takes 1,080 ms (360 + 160 + 360 + 200); a rejected run about 600 ms (360 + 240).

## Responsive Behavior
Breakpoints: base 320–767 px, md from 768 px (48rem), lg from 1024 px (64rem); content caps at 1200 px from a 1280 px viewport. The drawings, the bench and its controls switch by container query on their own width (Components), not by viewport.

| Section | Below 768 | 768–1023 | From 1024 |
|---|---|---|---|
| Header | wordmark, theme toggle, menu button | nav inline | 64 px tall |
| Hero | stacked: lockup, role, sentence, CTA full width, Résumé, bench (compact; wide from 554 px) | stacked; CTA at auto width; bench wide, at most 648 px | split 5 \| 7; bench wide |
| Full sheet | head stacked, lede, drawing (tall), facts, body | head in one row; tall drawing (at most 360 px) beside the facts; body below | band on 12 cols (wide); body 1–7, facts 9–12 |
| Compact sheets | stacked | stacked | 6 \| 6 |
| Experience | stacked | stacked | aligned rows |
| House rules | intro, then rules | same | intro 1–4, rules 5–12 |
| Inventory | 1 column | 2 columns | 3 columns |
| About | bio, avatar (at most 320 px), education, languages | same | text 1–7, avatar 9–12 |
| Contact | sign-off, then list | same | sign-off 1–7, list 9–12 |
| AFK, footer | one wrapping row | same | same |

- **Variant sizes.** Plate inner width = viewport − 2 × edge − 2 × 1 px border − 2 × plate padding.
  - At 320: 320 − 2 × 20 − 2 × 1 − 2 × 16 = 246 px ≥ 240 units, so the compact bench and tall drawings render at 1.025× (labels 14.35 px).
  - At 1024: the band gets 1024 − 2 × 40 − 2 × 1 − 2 × 24 = 894 px ≥ 880 (wide, 1.016×, labels 14.2 px). The hero bench, 7 of 12 columns (540.7 px), gets 490.7 px ≥ 480 (wide, 1.022×).
  - Below 768 the bench turns wide from 554 px (554 − 74 = 480).
- **Targets:** every control is at least 44 × 44 px: buttons 48, nav links and icon buttons 44, menu rows and contact rows 48. Hover never reveals content.
- **Reflow:** no horizontal scroll from 320 px; content reflows at 200 % zoom; edges respect `env(safe-area-inset-*)`.
- **Images:** the avatar is the only raster image on the page: explicit width and height, lazy, with `sizes="(min-width: 1024px) 352px, min(calc(100vw - 40px), 320px)"`.
- **Type:** fluid, per the Typography table. Use `min-h-dvh`, never `h-screen`.

## Voice
- B reads like good documentation: nouns and verbs, facts instead of adjectives. The owner's sentences carry the personality; interface labels stay plain.
- The owner's fragments keep their case and punctuation where they appear as ledes and captions ("prove IoT devices are genuine").
- The only themed words are the owner's: Quest journal; Active, Side, Cleared; Party lead; Achievements; House rules; Inventory; Leveling up; AFK.
- Numbers appear only as evidence, in facts columns, with en-US grouping.
- Copy we write: first person for the owner, sentence case, no em or en dashes, one label per intent. The full rules are in `portfolio-content`.

## Known Gaps
1. **Schema limits.** The format has no groups for motion, breakpoints, z-index, borders or strokes, and `design.md export` 0.4.0 drops `fontVariation` and `fontFeature`. Those values live in this file's tables (Typography, Layout, Drawing grammar, Motion, Responsive Behavior) and are mapped by hand into the thin theme file; code review checks them against these tables. The export carries colours, font family, size, weight, line height, tracking, radius and spacing.
2. **Conventions forced by the schema:** `textColor` doubles as the stroke colour in drawings; `focus-ring` uses `size` for width and `padding` for offset; typography tokens store the 375 px size, and the clamp comes from the Typography table; `plate` stores its base padding, and 24 px from md is in Components → Conventions.
3. **Lint coverage:** the linter checks contrast only where a component has both a background and a text colour. Line-only and text-only pairs (`trace`, `link`, `nav-link`, the focus ring) are covered by the Colors table.
4. **Font swap:** fallback metrics can't imitate the width axis, so display lines may change width (not height) when Archivo arrives. Check CLS in the performance audit.
5. **Waiting for the owner:** the host/chip framing; supplier exports drawn as an output; the Quest carried-data labels (the owner's note reads "uers"); the botmivivi replaced-steps label; one date format for sheets; the avatar caption; every `[copy: to draft & approve]` slot. None of these ships before approval.
6. **Length:** this file runs to about 390 lines, past the 300-line target, because both themes carry state entries (50 components) and each of the four drawings needs two variants and a text alternative, as briefed.

## Changelog
| Date | Change | Why |
|---|---|---|
| 2026-09-28 | Created from Direction B · Proof (directions §3, §5, §7) and the main-session rulings. Added `accent-hover`, `rule`, the `lead` role and every state entry. | Owner selected B on 2026-09-28. The new tokens fill roles §5 left open. |
| 2026-09-28 | Changes from §5: (1) the CyberRock drawing shows supplier exports as an output and leaves anomaly detection to the bullets; (2) one violet proof per drawing, so lifecycle arrows are ink; (3) status labels, bullets and the role line are ink, not violet; (4) the pressed toggle swaps its icon and thickens its border; (5) the bench rests on the completed handshake, and its readout is HTML with Tabler icons; (6) middot lists read inline with commas. | (1) `info.md` scopes the drawing to chip auth and lifecycle and gives no order. (2)–(4) Violet stays proof and action, and no state rests on colour alone. (5) The server and hydrated states match, and no icon is hand-drawn. (6) Multi-word items stay distinct. |
| 2026-09-28 | (1) `plate` pads 16 px below md (24 px from md); the compact bench and tall drawings are authored at 240 units, with the 1.5× cap kept (360 px). (2) Wide drawings are authored at 880 units and shown from an 880 px inner width, capped at 1.3× (1144 px). The Responsive table says the bench turns wide from 554 px and is wide at lg; Responsive Behavior gains the worked sizes. (3) Typography source: `next/font/local` from the pinned OFL file, latin and vietnamese plus ← → ↔, axes cut to `wdth` 87.5–125 and `wght` 400–800; latin-ext dropped. | Main-session rulings on QA's D3 (contrib-verification §9, §10) and engineering ruling 1. (1) With 24 px padding, 256-unit drawings rendered 14-unit labels at 12.6–13.9 px on 320–345 px viewports. 240 units keeps an even cell count on the 8-unit grid, and every tall row still fits (HarfBuzz at `wdth` 87.5: the widest node, "Challenge-response auth", is 171 units). (2) The band reaches 896 px only at a 1026 px viewport, and an 880 px threshold alone would render 896 units at 13.97 px. The table said "compact" below 768, but the bench turned wide at 570 px. (3) Google's and Fontsource's subsets omit U+2192. No colour or visible type change. |
| 2026-09-28 | Contact gains a last facts row, `[copy: to draft & approve]` → "Ho Chi Minh City, Vietnam": plain text with no link or icon, shown nowhere else on the page. Don'ts now name the locale, time or weather strip. | `info.md` → Contact & links records the owner's opt-in (2026-09-28): the location shows on the résumé and the site (Contact and search metadata). Last, so the rows that act stay first under the sign-off. The strip ban was implicit (`generic-patterns.md`); it is explicit now that the city is shown, so the fact never becomes decoration. No token change. |
