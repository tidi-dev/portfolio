---
version: alpha
name: TiDi Portfolio
description: A work-first developer portfolio for technical hiring managers and tech-literate clients, with a sleek sci-fi RPG HUD language, leaning toward holographic game UI in the owner's GitHub-dark banner palette.
colors:
  primary: "#0D1117"          # Ink: text, headings
  surface: "#EEF2F6"          # Lab: page
  surface-raised: "#FFFFFF"   # Panel: panels, log, toast, menu sheet
  text-muted: "#57606A"       # Graphite: secondary text, control borders
  accent: "#E3B341"           # Gold: CTA fill, XP fill, speaker tag, current timeline node
  accent-hover: "#F0C75E"     # Gold, one step brighter: hover on gold fills
  on-accent: "#0D1117"
  accent-ink: "#7D5A00"       # Gold ink: the accent as text, state bars, focus
  holo: "#0B7285"             # Holo teal: hologram light, role line, Run fill, timeline
  on-holo: "#FFFFFF"
  success: "#1A7F37"          # Genuine, Active, training marker
  danger: "#CF222E"           # Rejected, counterfeit switch on
  line: "#0B728547"           # panel edges (decorative)
  rule: "#0D111714"           # hairlines, XP track (decorative)
  focus: "{colors.accent-ink}"
  scrim: "#070B14EB"          # avatar caption backing, both themes
  on-scrim: "#E6EDF3"
  scene-metal: "#C9D3DE"      # projector base (3D)
  scene-chip: "#121A2A"       # chip package (3D), both themes
  scene-pin: "#B8C4D6"        # chip pins (3D), both themes
  primary-dark: "#E6EDF3"     # Signal
  surface-dark: "#070B14"     # Void
  surface-raised-dark: "#0F1726" # Glass
  text-muted-dark: "#8B949E"  # Static
  accent-dark: "#E3B341"
  accent-hover-dark: "#F0C75E"
  on-accent-dark: "#070B14"
  accent-ink-dark: "#E3B341"
  holo-dark: "#4FD8E8"        # Holo cyan
  on-holo-dark: "#070B14"
  success-dark: "#3FB950"
  danger-dark: "#F85149"
  line-dark: "#4FD8E838"
  rule-dark: "#E6EDF314"
  focus-dark: "{colors.accent-ink-dark}"
  scene-metal-dark: "#0E1524"
typography:
  display: { fontFamily: Chakra Petch, fontSize: 3.5rem, fontWeight: 700, lineHeight: 0.9, letterSpacing: -0.01em }
  heading-section: { fontFamily: Chakra Petch, fontSize: 2rem, fontWeight: 700, lineHeight: 1.1 }
  heading-quest: { fontFamily: Chakra Petch, fontSize: 1.5rem, fontWeight: 700, lineHeight: 1.15 }
  heading-panel: { fontFamily: Chakra Petch, fontSize: 0.8125rem, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0.18em }
  stat-value: { fontFamily: Chakra Petch, fontSize: 1.75rem, fontWeight: 700, lineHeight: 1 }
  wordmark: { fontFamily: Chakra Petch, fontSize: 1.25rem, fontWeight: 700, lineHeight: 1, letterSpacing: 0.02em }
  role: { fontFamily: Chakra Petch, fontSize: 0.9375rem, fontWeight: 600, lineHeight: 1.2, letterSpacing: 0.06em }
  button: { fontFamily: Chakra Petch, fontSize: 0.9375rem, fontWeight: 700, lineHeight: 1, letterSpacing: 0.04em }
  nav: { fontFamily: Chakra Petch, fontSize: 0.875rem, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0.02em }
  label: { fontFamily: Chakra Petch, fontSize: 0.75rem, fontWeight: 600, lineHeight: 1.5, letterSpacing: 0.12em }
  name: { fontFamily: Mona Sans, fontSize: 1.125rem, fontWeight: 500, lineHeight: 1.25, fontVariation: "'wdth' 112" }
  body: { fontFamily: Mona Sans, fontSize: 1rem, fontWeight: 400, lineHeight: 1.6 }
  body-strong: { fontFamily: Mona Sans, fontSize: 1rem, fontWeight: 600, lineHeight: 1.6 }
  body-sm: { fontFamily: Mona Sans, fontSize: 0.9375rem, fontWeight: 400, lineHeight: 1.5 }
  slot: { fontFamily: Mona Sans, fontSize: 0.875rem, fontWeight: 500, lineHeight: 1.2 }
  caption: { fontFamily: Mona Sans, fontSize: 0.8125rem, fontWeight: 400, lineHeight: 1.4 }
rounded:
  none: 0px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section-sm: 56px
  section: 112px
  edge: 16px
  edge-lg: 56px
  gutter: 16px
  container: 1240px
  hud: 60px
  chamfer: 14px
  chamfer-sm: 8px
  bracket: 30px
  target: 44px
  control: 48px
  avatar: 200px
  avatar-xl: 264px
  stat-key: 96px
components:
  page: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.body}" }
  hud-bar: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.label}", height: 60px }
  hud-player: { backgroundColor: "{colors.surface}", textColor: "{colors.accent-ink}", typography: "{typography.label}" }
  wordmark: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.wordmark}" }
  xp-track: { backgroundColor: "{colors.rule}", height: 10px, width: 170px }
  xp-fill: { backgroundColor: "{colors.accent}", height: 10px }
  nav-link: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.nav}", height: 44px }
  nav-link-hover: { backgroundColor: "{colors.surface}", textColor: "{colors.accent-ink}" }
  state-bar: { backgroundColor: "{colors.accent-ink}", width: 3px }
  icon-button: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", rounded: "{rounded.none}", size: 44px }
  icon-button-hover: { backgroundColor: "{colors.surface}", textColor: "{colors.accent-ink}" }
  menu-sheet: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.heading-quest}", padding: 24px }
  skip-link: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.button}", height: 48px, padding: 16px }
  focus-ring: { textColor: "{colors.focus}", size: 2px, padding: 3px }
  corner-bracket: { textColor: "{colors.holo}", size: 30px }
  brand-name: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.display}" }
  alt-names: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.name}" }
  role-line: { backgroundColor: "{colors.surface}", textColor: "{colors.holo}", typography: "{typography.role}" }
  button-primary: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 24px }
  button-primary-hover: { backgroundColor: "{colors.accent-hover}", textColor: "{colors.on-accent}" }
  button-ghost: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 24px }
  button-holo: { backgroundColor: "{colors.holo}", textColor: "{colors.on-holo}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 20px }
  switch: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.nav}", height: 44px, padding: 14px }
  switch-thumb: { backgroundColor: "{colors.text-muted}", size: 12px }
  switch-thumb-on: { backgroundColor: "{colors.danger}", size: 12px }
  step-log: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.body-sm}", padding: 16px }
  step-on: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}" }
  step-numeral-on: { backgroundColor: "{colors.holo}", textColor: "{colors.on-holo}", typography: "{typography.label}", size: 20px }
  verdict-genuine: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.success}", typography: "{typography.button}" }
  verdict-rejected: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.danger}", typography: "{typography.button}" }
  scene-tag: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.holo}", typography: "{typography.label}", padding: 6px }
  scene-base: { backgroundColor: "{colors.scene-metal}" }
  scene-chip: { backgroundColor: "{colors.scene-chip}" }
  scene-pins: { backgroundColor: "{colors.scene-pin}" }
  panel: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", rounded: "{rounded.none}", padding: 24px }
  panel-edge: { backgroundColor: "{colors.line}", size: 1px }
  divider: { backgroundColor: "{colors.rule}", height: 1px }
  panel-heading: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.heading-panel}" }
  section-heading: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.heading-section}" }
  quest-title: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.heading-quest}" }
  status-active: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.success}", typography: "{typography.label}", height: 28px, padding: 10px }
  status-side: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.label}", height: 28px, padding: 10px }
  status-cleared: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.label}", height: 28px, padding: 10px }
  mission-item: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.nav}", height: 56px, padding: 16px }
  facts-term: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.label}", width: 96px }
  facts-value: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body-sm}" }
  stat-readout: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.stat-value}" }
  achievement-badge: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body-sm}", padding: 16px }
  toast: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.heading-panel}", padding: 12px }
  video-facade: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.button}", height: 48px }
  timeline-line: { backgroundColor: "{colors.holo}", width: 2px }
  timeline-node-current: { backgroundColor: "{colors.accent}", size: 16px }
  rule-lead: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.body-strong}" }
  inventory-slot: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.slot}", padding: 8px }
  training-marker: { textColor: "{colors.success}", size: 12px }
  avatar-caption: { backgroundColor: "{colors.scrim}", textColor: "{colors.on-scrim}", typography: "{typography.caption}" }
  speaker-tag: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.nav}", padding: 8px }
  contact-row: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body}", height: 56px, padding: 16px }
  link: { textColor: "{colors.accent-ink}" }
  footer-line: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.label}" }
  page-dark: { backgroundColor: "{colors.surface-dark}", textColor: "{colors.primary-dark}" }
  hud-bar-dark: { backgroundColor: "{colors.surface-dark}", textColor: "{colors.text-muted-dark}" }
  panel-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.primary-dark}" }
  panel-edge-dark: { backgroundColor: "{colors.line-dark}" }
  divider-dark: { backgroundColor: "{colors.rule-dark}" }
  panel-heading-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.accent-ink-dark}" }
  focus-ring-dark: { textColor: "{colors.focus-dark}" }
  button-primary-dark: { backgroundColor: "{colors.accent-dark}", textColor: "{colors.on-accent-dark}" }
  button-primary-hover-dark: { backgroundColor: "{colors.accent-hover-dark}", textColor: "{colors.on-accent-dark}" }
  button-holo-dark: { backgroundColor: "{colors.holo-dark}", textColor: "{colors.on-holo-dark}" }
  verdict-genuine-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.success-dark}" }
  verdict-rejected-dark: { backgroundColor: "{colors.surface-raised-dark}", textColor: "{colors.danger-dark}" }
  scene-base-dark: { backgroundColor: "{colors.scene-metal-dark}" }
---

# TiDi Portfolio · Design system

> Direction **B · Holo Deck**, selected by the owner on 2026-09-28 (`docs/design/directions-v2.md` §12). Codified by `design-lead` from §3 and §5 of that file and the B tab of `directions-v2-preview.html`, which is the look of record. Facts and copy come only from `info.md`. A slot marked `[copy: to draft & approve]` waits for the owner and never renders as a marker.

## Overview
**Design Read.** A work-first developer portfolio for technical hiring managers\* and tech-literate clients\*, with a sleek sci-fi RPG HUD language, leaning toward holographic game UI in the owner's GitHub-dark banner palette. (\* = inferred, directions §1.)

**Concept.** Player 1's command deck. The owner's banner HUD becomes the page frame, and his hardest quest, proving a chip is genuine, floats as a live hologram the visitor can rotate and run. Every section is a HUD panel that powers on.

**Dials.** VARIANCE 6: a split hero and 12-column bentos varied by span, one panel anatomy for scanning. MOTION 9: a continuously alive hologram, a scripted handshake, power-on wipes, the XP bar and "Quest unlocked". DENSITY 6: HUD panels group information tightly behind clear labels.

**Signature moment: run the handshake.** The hero chip plays the owner's challenge-response once on load, then waits for "Run the handshake". "Counterfeit chip" makes the next run end "rejected". (3D Scenes → Hero; Motion → Handshake.)

**Consistency locks**
1. **Theme:** follows the system, with a toggle. Deck (dark) is the design lead; Lab (light) is designed, not inverted. Themes swap colour tokens (`-dark`), 3D blending and bloom, never layout, type or timing.
2. **Accent:** Gold is the one UI accent (CTA, ▸ PLAYER 1, panel headings, stat keys, links, state bars, focus). Holo is light, not an accent: 3D, lines, the role line and the one control that drives the hologram (Run). Success and danger mean verdict and status only.
3. **Shape:** chamfer, 0 radius. Panels and buttons cut two corners at 45°; everything else is square.
4. **Icons:** Tabler outline, stroke 1.5, 20 px (24 px in Join party and AFK).
5. **Type:** Chakra Petch (HUD, display, controls) + Mona Sans (reading). No mono, no italics.
6. **Labels:** one per intent. "Résumé" names the PDF everywhere; the hero CTA and the nav's "Join party" both land on `#contact`.
7. **Controls:** buttons 48 px high; every target ≥ 44 × 44 px.

## Colors
Hex values are §5's, plus roles §5 left open (`accent-hover`, `on-holo`, `line`, `rule`, `scrim`, scene materials).

| Token | Lab | Deck | Role, and why |
|---|---|---|---|
| `surface` | `#EEF2F6` | `#070B14` | Page. The banner's `#0D1117` pushed deeper so the hologram glows; Lab is the deck with the lights on. |
| `surface-raised` | `#FFFFFF` | `#0F1726` | Panels, log, toast, menu. Over 3D or content it is 92 % opaque with an 8 px blur (Elevation). |
| `primary` | `#0D1117` | `#E6EDF3` | Text and headings; the banner's own ink and text colour. |
| `text-muted` | `#57606A` | `#8B949E` | Secondary text, pending steps, control borders (≥ 3:1). The banner's grey. |
| `accent` / `-hover` | `#E3B341` / `#F0C75E` | same | Gold fills: CTA, skip link, XP fill, speaker tag, current timeline node. The banner's gold. |
| `on-accent` | `#0D1117` | `#070B14` | Labels on gold. |
| `accent-ink` | `#7D5A00` | `#E3B341` | Gold as text and state: ▸ PLAYER 1, panel headings, stat keys, links, state bars, focus. Gold can't be text on white. |
| `holo` / `on-holo` | `#0B7285` / `#FFFFFF` | `#4FD8E8` / `#070B14` | Projector light. Lab uses teal with normal blending, because cyan washes out on white. |
| `success` / `danger` | `#1A7F37` / `#CF222E` | `#3FB950` / `#F85149` | Verdicts; Active chip and training marker (success); switch on (danger). |
| `line`, `rule` | teal 28 %, ink 8 % | cyan 22 %, signal 8 % | Panel edges, hairlines, XP track. Decorative, exempt. |
| `scrim` / `on-scrim` | `#070B14` 92 % / `#E6EDF3` | same | Avatar caption, both themes. |
| `scene-*` | metal `#C9D3DE`, chip `#121A2A`, pin `#B8C4D6` | metal `#0E1524` | 3D materials only, never behind text. |

**Contrast (WCAG 2.x, computed by script, no rounding): 52 pairs, 0 failures.** Translucent layers were checked against the worst backdrop (glass over full `holo`; the HUD strip over gold or ink).

| Pair | Lab | Deck | Needs |
|---|---|---|---|
| `primary` on `surface` / `surface-raised` | 16.82 / 18.92 | 16.66 / 15.18 | 4.5 |
| `text-muted` on `surface` / `surface-raised` | 5.68 / 6.39 | 6.40 / 5.83 | 4.5 |
| `accent-ink` on `surface-raised` / `surface` | 6.30 / 5.60 | 9.22 / 10.11 | 4.5 |
| `on-accent` on `accent` / `accent-hover` | 9.72 / 11.75 | 10.11 / 12.22 | 4.5 |
| `on-holo` on `holo` (Run, lit step numerals) | 5.59 | 11.55 | 4.5 |
| `holo` text on `surface` / `surface-raised` (role line, tags) | 4.96 / 5.59 | 11.55 / 10.52 | 4.5 |
| `success` / `danger` on `surface-raised` | 5.08 / 5.36 | 7.06 / 5.35 | 4.5 |
| `primary` / `text-muted` on 92 % glass over `holo` | 16.93 / 5.72 | 13.07 / 5.02 | 4.5 |
| `accent-ink` (toast) / `holo` (tags) on the same glass | 5.64 / 5.00 | 7.93 / 9.06 | 4.5 |
| `success` / `danger` on the same glass | 4.54 / 4.79 | 6.08 / 4.61 | 4.5 |
| `text-muted` on the 92 % HUD strip, worst | 4.82 | 5.76 | 4.5 |
| `on-scrim` on 92 % scrim over white | 13.97 | 13.97 | 4.5 |
| Focus ring on `surface` / `surface-raised` | 5.60 / 6.30 | 10.11 / 9.22 | 3 |
| Control border, switch thumb off (`text-muted` on raised) | 6.39 | 5.83 | 3 |
| State bar (`accent-ink` on `surface`) | 5.60 | 10.11 | 3 |
| Switch thumb on (`danger` on raised) | 5.36 | 5.35 | 3 |

## Typography
| Family | Role | Source, licence | Weights, subsets | Why |
|---|---|---|---|---|
| **Chakra Petch** | Display, headings, HUD, labels, buttons, numerals | `@fontsource/chakra-petch` 5.3.0, OFL-1.1 (Cadson Demak) | 600, 700; latin, latin-ext, vietnamese | Squared, chamfered letterforms that match the chamfered panels: game HUD without novelty. |
| **Mona Sans** | Body, names, slots, captions | `@fontsource-variable/mona-sans` 5.3.0, OFL-1.1 (GitHub) | wght 400–600, wdth 100–112; latin, latin-ext, vietnamese | GitHub's typeface, where the owner's RPG README and banner live. Width 112 gives the names their stance. Replaces mono. |

| Token | 375 → 1440 px | Line height | Tracking, case | Use |
|---|---|---|---|---|
| `display` | `clamp(3.5rem, 7vw, 6.5rem)` | 0.9 | −0.01em | "TiDi" only. Dark: holo `text-shadow` 0 0 32px at 45 %; none in Lab |
| `heading-section` | `clamp(2rem, 1.6rem + 1.7vw, 2.75rem)` | 1.1 | sentence case | h2 per section |
| `heading-quest` | 1.5 → 1.75rem | 1.15 | sentence case | Quest, employer and menu titles |
| `stat-value` | 1.75 → 2rem | 1 | proportional figures (Chakra Petch has no `tnum`) | botmivivi readouts. Each stands alone, and the count-up overlays the final text, which holds the width |
| `heading-panel` | 0.8125rem | 1.2 | 0.18em, uppercase | Panel h3, toast. The one all-caps system, for the owner's labels only |
| `label` | 0.75rem | 1.5 | 0.12em, uppercase | Stat keys, HUD keys, status chips, step numerals |
| `role`, `button`, `nav`, `wordmark` | 0.9375 / 0.9375 / 0.875 / 1.25rem | 1.2 / 1 / 1.3 / 1 | per front matter; role uppercase | Role line, buttons, nav and controls, wordmark |
| `name` | 1.125rem | 1.25 | wdth 112 | "Hồ Trọng Đại" (`lang="vi"`) and "Dai Ho Trong" |
| `body` / `body-strong` | 1 → 1.0625rem | 1.6 | none | Reading; the bold lead phrases of House rules |
| `body-sm`, `slot`, `caption` | 0.9375 / 0.875 / 0.8125rem | 1.5 / 1.2 / 1.4 | none | Facts, log steps; inventory items; avatar caption |

Principles: ratio ≈ 1.333. Measure ≤ 52ch in the hero and ≤ 68ch elsewhere. Vietnamese text keeps a line height ≥ 1.15. Uppercase is CSS (`text-transform`), never typed; the DOM keeps the owner's casing. Names (TiDi, Hồ Trọng Đại, Dai Ho Trong, project and employer names) never take an uppercase style. Curly quotes; the owner's em dashes stay.

## Layout
- **Breakpoints:** `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440 px, plus a 375 px rule for the HUD strip.
- **Container:** 1240 px, centred; side padding `clamp(edge, 3.4vw, edge-lg)`. **Grid:** 12 columns, 16 px gutter from `lg`; one column below.
- **Rhythm:** sections pad `clamp(section-sm, 8vw, section)` vertically; heading to content `lg`; panels gap `gutter`; panel padding 16 px below `md`, 24 px from `md`.
- **Alignment:** every panel heading has a trailing `rule` line to the panel edge. The hero intro and the handshake log share the stage baseline.
- **Fixed HUD strip:** 60 px; `scroll-padding-top: 76px`, so anchors and focus are never covered.
- **Z-index:** `canvas` 0 · `content` 1 · `console` 2 · `hud` 40 · `toast` 50 · `menu` 60 · `skip-link` 70.

## Elevation & Depth
Depth is light and glass, never drop shadows.
- **Glass:** `surface-raised` at 92 % with `backdrop-filter: blur(8px)` wherever a panel sits over 3D or scrolled content (HUD strip, log, toast, tags, menu). Elsewhere panels are opaque.
- **Glow (Deck only):** Bloom inside canvases, whose edges feather out over 8 % of the canvas on each side (a mask), so the halo never ends in a seam. The feather stays inside the stage and never sits under text; Lab has no Bloom and no feather; the brand's text shadow; the hero backdrop, radial `holo` 16 % at 72 % 50 % and `accent` 8 % at 10 % 90 %, over `surface`. Lab keeps the backdrop at half strength with no glow.
- **Edges:** 1 px `line`, following the chamfer, including the 45° cut. Glow never sits behind body text.

## Shapes
- **Chamfer:** `clip-path` cuts the top-right and bottom-left corners: `chamfer` (14 px) on panels and buttons, `chamfer-sm` (8 px) on chips, the toast and the switch. `rounded.none` elsewhere.
- **Corner brackets:** four 30 px L-marks, 2 px `holo` at 70 %, framing the hero viewport and the Join party grid only, so the same frame opens and closes the page.
- **Icons:** Tabler (`@tabler/icons-react` 3.48.0, MIT): sun, moon, menu-2, x, player-pause, player-play, file-download, external-link, mail, brand-telegram, brand-github, map-pin, ball-football, feather (Badminton: Tabler has no shuttlecock), swimming, device-gamepad-2, coffee, check, wall, stopwatch, key, tool, device-floppy. Filled: caret-right for the "▸" of "▸ PLAYER 1", caret-down for the "▼" after "Press A to continue", and triangle for training markers. Neither family has these glyphs, so the icon renders them (`aria-hidden`) and the text node keeps the words.
- **Images:** the avatar is 3:4 (the source is 1086 × 1448), shown whole, never cropped to a sticker.

## Components
States not listed as tokens are described here; colours always come from the tokens named.

**HUD bar** (`hud-bar`, `wordmark`, `hud-player`, `xp-track`, `xp-fill`, `nav-link`, `state-bar`, `icon-button`). A fixed glass strip: wordmark "TiDi" · nav (from `xl`) · readout "▸ PLAYER 1", the XP bar, "LVL still leveling" (from `md`); "XP · SYSTEM DESIGN" and "MAX not a thing" join from `2xl` · motion toggle · theme toggle · menu button (below `xl`). XP bar: 10 segments (2 px `surface` gaps), fill gradient `accent` → `success`, fixed at 70 %, `aria-hidden`, never a number. Nav items: Quest journal, Mission log, House rules, Inventory, Join party; hover `accent-ink`; the current section (scroll-spy) gets a 2 px `state-bar` underline and `aria-current="true"`. Icon buttons: theme toggle ("Dark theme", `aria-pressed`, moon/sun swap), motion toggle (name `[copy: to draft & approve]`, `aria-pressed`, pause/play swap; the choice persists across visits), menu ("Menu", `aria-expanded`). Below 375 px the "▸ PLAYER 1" label hides.

**Menu sheet** (`menu-sheet`). Below `xl`: a full-height glass sheet under the strip, nav links at `heading-quest` size, 56 px rows. Focus moves in, Esc and the "x" close it, and focus returns to the button.

**Skip link** ("Skip to content") and **focus ring**: 2 px `focus`, offset 3 px, a square outline on the element's box, also on chamfered controls. It reads as a HUD selection frame and stays one ring for every control. The chamfer is drawn on a pseudo-element, so `clip-path` never cuts the outline.

**Hero intro** (`hud-player`, `brand-name`, `alt-names`, `role-line`). "▸ PLAYER 1"; one `h1` holding "TiDi", "Hồ Trọng Đại" and "Dai Ho Trong"; the role with a 28 × 2 px `holo` lead line; `hero.sentence`; the CTA pair.

**Buttons.** `button-primary`: gold, chamfered; hover `accent-hover` plus a light sweep; active `translateY(1px)`. `button-ghost`: 1.5 px inset border in `text-muted`, `holo` on hover. `button-holo`: "Run the handshake" only; `aria-disabled` at 55 % opacity while a run plays. Hero CTA "Bring me a pain point" → `#contact`; "Résumé" → the PDF (file-download icon).

**Switch** (`switch`, `switch-thumb`, `-on`). "Counterfeit chip", `aria-pressed`. A 34 × 18 px track with a `text-muted` border; the thumb slides 16 px and turns `danger` when on. State shows by position, not colour alone.

**Handshake log** (`step-log`, `step-on`, `step-numeral-on`, `verdict-*`). A glass `<ol>` of three `a11y.steps.bench` lines, numerals in 20 px chips. Pending: `text-muted`. Lit: `primary`, with numeral `on-holo` on `holo`. Skipped (counterfeit): `text-muted` with a line-through, no opacity. Verdict: `<output role="status">`, "genuine" (`success`) or "rejected" (`danger`), uppercase `button`.

**Scene tags** (`scene-tag`). "host" and "chip", glass chips pinned to 3D anchors, `aria-hidden`.

**Panel** (`panel`, `panel-edge`, `panel-heading`, `divider`). The chamfered glass block that every section is made of. The heading is an h3 in `heading-panel` with a trailing rule. Panels aren't interactive and get no hover.

**Section heading** (`section-heading`). An h2 per section, with a 2 px × 28 px `holo` lead line.

**Status chip** (`status-active`, `-side`, `-cleared`). "Active", "Side", "Cleared" with a 1 px border in the text colour. Cleared adds a check icon.

**Mission item** (`mission-item`, `state-bar`). An in-page link to a quest file: status chip + name. Hover: `holo` edge. Current: a 3 px `state-bar` at the left and `aria-current="true"`.

**Quest file** (`panel`, `quest-title`, `facts-term`, `facts-value`). An article: status chip, h3, one-liner, facts `dl` (Role, When as `format.period`, then Team, Scale, Users or Stack as the quest has them), the "What I built" / "What it does" bullets with no heading, and the steps `<ol>` in the log style (`a11y.steps.*`). A slot renders only when `info.md` holds its fact.

**Stat readout** (`stat-readout`). botmivivi: Users 10, Customers 646, Orders 2,951, the qualifier "in the first 2 months", and Impact as a text line, exactly `botmivivi.facts`.

**Achievement badge** (`achievement-badge`). Quest's four: icon (wall, stopwatch, key, tool) + name in `body-strong` + description. A 2 × 2 grid from `sm`.

**Toast** (`toast`). A glass chip with a 1 px `accent-ink` edge in the hologram viewport's top-left: "Quest unlocked" plus the quest name in `body-sm` `primary`. `aria-hidden`; the state is carried by `aria-current`.

**Video facade** (`video-facade`). "Watch Quest by NFQ" with a player-play icon and the caption "Opens the YouTube player."; the iframe loads only on activation.

**Mission log timeline** (`timeline-line`, `timeline-node-current`). A 2 px `holo` line with 16 px square nodes rotated 45°: `holo` outline, and a gold core for the current employer. Each node: h3 employer, title, period, and the projects as a list (links to quest files; Lemonswan's external link).

**Rule panel** (`panel`, `rule-lead`). A House rule: a numeral chip (1–4; the owner's list is ordered) and the rule as one paragraph. The lead phrase is run in (inline, `rule-lead`), and the rest of the owner's sentence follows on the same line, so no line starts with the owner's dash. Underline: `text-decoration` 2 px, offset 4 px, in `accent-ink`, which wraps with the phrase.

**Inventory slot** (`inventory-slot`). A square list item with a 1 px `rule` edge and a `holo` 5 % tint; hover: `holo` edge and 14 % tint, no lift, no pointer cursor.

**Training card** (`panel`, `training-marker`). A Leveling up topic in `nav` type, led inline by a `success` filled triangle (12 px, gap `xs`, centred on the first line), 16 px padding.

**Avatar frame** (`avatar-caption`). A 3:4 image, `avatar` wide (`avatar-xl` from `xl`) in a 1 px `line` frame, `alt=""`; `avatar.caption` sits visibly on the `scrim` at the bottom. On fine pointers it tilts up to 6° toward the pointer.

**Dialogue box** (`panel`, `speaker-tag`, `link`). The bio as an RPG dialogue: a gold speaker tag "TiDi" in `nav` type, as cased (never uppercase), both paragraphs always visible, and at the end "Press A to continue ▼" as a button that moves to `#afk`. The A key works only while the box has focus.

**AFK list.** Five items, each a 24 px icon + label, 56 px high, in an idle panel.

**Contact row** (`contact-row`, `button-primary`, `button-ghost`). Rows beside the sign-off: Email (the address as `button-primary`), Telegram and GitHub (`button-ghost`, external), Résumé ("PDF, {size}"), Location (plain text). From `lg` the sign-off panel stretches to the rows panel's height, the sign-off at the top, and corner brackets frame the pair.

**Link** (`link`). `accent-ink`, underlined; hover `primary`. External links open in the same tab and add the external-link icon (`aria-hidden`).

**Footer** (`footer-line`). device-floppy icon + "progress saved · still learning, always solving".

**Not-found.** A `section-heading` with "Nothing here" and a `button-primary` "Back to TiDi", on the page backdrop.

## Do's and Don'ts
- **Do** put every word on a panel, slab or scrim; never directly on the 3D.
- **Do** mirror everything a canvas shows in HTML; canvases are `aria-hidden`.
- **Do** keep gold for action and the owner's labels, and holo for light. One gold primary button per view.
- **Do** keep honesty locks: no level numbers, percentages or skill bars; the XP bar has no number. No availability line ("STATUS accepting quests"). Travel and photography aren't shown.
- **Don't** fade-and-slide every section: panels power on with the wipe, and each section has its own reward (Motion).
- **Don't** add perpetual pulse, float or shimmer to static content. Ambient loops live only in canvases.
- **Don't** use cursor spotlights, custom cursors, scroll-jacking, parallax, scroll cues, marquees or particle backgrounds outside the projector.
- **Don't** use the banner's terminal chrome (window dots, `$` prompt, typing cursor) or mono labels.
- **Don't** add eyebrows, `01 /` markers or `A · B · C` strings beyond the owner's own labels ("▸ PLAYER 1", the footer line).
- **Don't** add hover lift to cards; only buttons and the avatar respond physically.
- **Cluster 2 (near-black + bright accent)** is used with a reason: it is the owner's banner palette; the accent is gold, and cyan is light inside the 3D.

## 3D Scenes
Two R3F canvases, each a dynamically imported client island, `aria-hidden`, rendering only while on screen and the tab is visible. DPR capped at 1.75. Procedural geometry only. Colours come from the tokens; lights are white (`surface-raised`, Lab value).

**Hero projector** (scene units; the preview's `HoloDeck` class is the reference).
- **Base:** a cylinder r 2.6 → 2.85, h 0.2, `scene-base`; Deck metalness 0.7, roughness 0.35; Lab metalness 0.15, roughness 0.6, because without an environment map a metallic Lab base renders as a dark slab instead of `scene-metal`. Three `holo` rings at r 1.15, 1.9 (a 243° arc) and 2.5; a tick ring of 90 ticks at r 2.2, every fifth tick double length.
- **Cone:** an open cylinder r 1.9 (top) → 1.0, h 3.4, with a vertical alpha fade; opacity 0.28 in Deck (additive), 0.22 in Lab (normal).
- **Chip:** a 2.1 × 0.26 × 2.1 `scene-chip` body with `holo` edges, 40 `scene-pins` (10 per side, metalness 0.9), and a procedural circuit-die texture tinted `holo`. A scan ring (r 1.5) and disc sweep y 1.5 ↔ 3.2. 150 motes rise in the cone.
- **Host:** a wireframe octahedron (r 0.55) with an icosahedron core at (−4.3, 2.9, 0.4): Deck `accent`; Lab edge `accent-ink`, core `accent`. A faint stem line.
- **Paths:** two quadratic curves, host → chip and chip → host, as `holo` tubes at 25 %. The packet is a 7-sphere comet: `accent` for the challenge, `holo` for the response.
- **Lighting:** ambient 0.5; a key directional light at 1.6 from (3, 6, 5); a `holo` point light (10, distance 9, decay 1.4) at (0, 2.4, 1.2), which takes the verdict colour. Deck adds Bloom (intensity 0.9, threshold 0.2, smoothing 0.3, mipmap blur); Lab has none.
- **Camera:** FOV 34, at (0, 3.6, 11.6) looking at (0, 2, 0), rig offset x +1.25. When aspect < 0.95: at (1.1, 3.6, 17), look (1.1, 2, 0), rig x +1.9.
- **Interaction:** a fine pointer tilts the rig (yaw ±0.25 rad, pitch ±0.06, damping 4). Horizontal drag spins the chip (`touch-action: pan-y`, so vertical scroll is kept). Run and the switch drive one state machine shared with the HTML log.
- **Theme change:** swaps materials, blending and bloom in place; geometry never swaps.

**Quest holograms** (Quest journal). A smaller projector (base r 1.4, two rings, the cone), with the hero's materials per theme (Lab base included), the hero's Deck Bloom, and a `holo` rim ring at r 1.4 so the Deck base never reads as a black disc. FOV 30, fixed three-quarter view, pointer tilt ±0.15 rad from `lg`. One model per quest (`depiction.holograms`):
- **CyberRock:** the hero chip at 0.7 scale with its scan ring.
- **botmivivi:** a ledger stack of five slabs (1.6 × 0.08 × 1.1, gap 0.12, `holo` edges) turning at 0.2 rad/s.
- **Quest:** two linked data slabs (1.2 × 0.5 × 1.2): the left slab is `holo` wireframe at 40 %, the right a solid `scene-chip` slab with `holo` edges. A curved path joins them, and four packets cross left → right in a loop, every 4 s.
- `aria-hidden` tags "v1" and "v2" on Quest's slabs. The HTML equivalent is the steps list in each quest file.

## Motion
**Budget.** The hero lives (a looping hologram and one autoplayed handshake). Every section powers on once when first seen and has one reward moment. Only `transform`, `opacity`, `clip-path`, the colour of 3D materials and the House rules underline colour animate; transitions name their properties; everything is interruptible; there are no scroll listeners (IntersectionObserver, `animation-timeline: view()`). A single **motion mode** exists: `prefers-reduced-motion`, or the HUD motion toggle, sets `data-motion="off"`, which gives the reduced variants below and pauses every loop (WCAG 2.2.2).

**Tokens.** Durations: `feedback` 150 · `verdict` 250 · `toast-in` 300 / `toast-out` 250 / `toast-hold` 1600 · `flip`, `row`, `brackets`, `hud` 400 · `shake` 450 · `sweep`, `release` 500 · `project` 700 · `levelup` 800 · `wipe`, `pulse`, `count` 900 · `packet` 1000 · `boot`, `line` 1200 · `scan` 1400 · `xp`, `verdict-hold` 2200 ms. Staggers: `line` 80 · `row` 100 · `badge`, `ring` 120 · `panel` 160 ms. Delays: `autoplay` 200 (after boot) · `xp` 500 · `rows` 550 · `scan` 600 ms. Easings: `ease-out` `cubic-bezier(0.2, 0.8, 0.2, 1)` · `ease-power` `cubic-bezier(0.7, 0, 0.2, 1)` · `ease-back` `cubic-bezier(0.34, 1.56, 0.64, 1)` · `ease-in-out` `cubic-bezier(0.4, 0, 0.6, 1)` · `linear` for loops. 3D rates are listed in 3D Scenes; ambient: rings 0.4 / −0.6 / 0.15 rad/s, ticks −0.1, chip spin 0.35, bob ±0.08 at 1.3 rad/s, scan `sin(1.1t)`, host 0.8, motes 0.25–0.55 units/s.

| Element | Trigger | Property | Timing | Communicates | Reduced (`data-motion="off"`) |
|---|---|---|---|---|---|
| HUD strip, hero brackets | Load | strip `translateY(−100%→0)`; brackets draw (`scale` from the corner) | hud, brackets, ease-out | System online | Present at once |
| XP bar | Load | fill `scaleX(0→0.7)` | xp, delay xp, ease-out | Still leveling | Rests at 0.7 |
| Hero intro lines | Load | `clip-path` wipe left → right | wipe, stagger line, ease-power | Player 1 loads in | Present at once |
| Hologram boot | Canvas ready | rings `scale 0→1` (stagger ring), cone opacity, chip materialises with one scan pass | boot, ease-back | The projector powers up | One still composed frame |
| Hologram ambient | Continuous while visible | rings, ticks, scan, motes, bob, host spin | linear | A live hologram | Still; renders on demand only |
| Handshake, genuine | Autoplay once, or Run | 0–1000 gold comet host → chip, step 1 lit; 1000–2000 holo comet back, step 2; 2000: step 3, verdict, chip lerps to `success`, pulse ring scale 1 → 2.4 fading; hold, then release to `holo` | packet ×2, verdict, pulse, verdict-hold, release | The chip proves it's genuine | Final state at once; colour holds until the next run |
| Handshake, counterfeit | Run with the switch on | challenge only; at 1000 step 2 struck, "rejected", chip lerps to `danger`, one decaying ±0.06 shake | packet, verdict, shake | A fake fails after the challenge | Final state at once, no shake |
| Panel power-on | ≥ 25 % in view, once | a `surface` cover layer over the content slides `translateX(0 → 100%)` inside its own clipping track (`inset: 0; overflow: clip`, never the panel itself, so focus rings aren't cut); its leading left edge is a 2 px `holo` line at 70 %. Not `clip-path` on the panel: IntersectionObserver never reports an element clipped to nothing | wipe, stagger panel, ease-power | Panels come online | Present at once |
| Stat rows, facts | With their panel | opacity + `translateX(−10px→0)` | row, delay rows, stagger row | Stats tick in | Present at once |
| Avatar scan | With its panel | a `holo` band `translateY` top → bottom, once | scan, delay scan | Character scanned | None |
| Quest unlocked | A quest file becomes current (≥ 50 % in view, or its mission item) | old model scale → 0.6 + fade; scan sweep; new model scale 0.6 → 1; status chip `rotateX(90°→0)`; toast wipe in, hold, out | project (ease-back), flip, toast-in / hold / out | Opening a quest file | Model cut; toast fades in and out (feedback) |
| Achievements | First time Quest is current | each badge wipes on + one glint `translateX` | row, stagger badge | Achievements | Present at once |
| botmivivi readouts | First view | numbers count 0 → value (text stays final for AT) | count, ease-out | Live numbers | Final values |
| Mission log line | Scroll | line `scaleY(0→1)` via `view()`, `animation-range: entry 10% cover 45%`, so it is complete before the section's middle passes the viewport's (IO fallback: line); nodes power on as reached | line, wipe | Career progress | Fully drawn |
| House rules | In view | panels wipe on in reading order; then the lead phrase's underline colour transitions `transparent → accent-ink` | wipe, stagger panel, sweep | The rules of play | Present at once |
| Level up | Leveling up in view, once per page load (no storage) | a 2 px `accent` bar sweeps across the HUD strip; triangles rise 6 px + fade | levelup, row, stagger row | Skills in training | None; triangles present |
| AFK | With its panel | each icon rises 4 px + fades in, once | row, stagger row | Idle, then back | Present at once |
| Join party brackets | With the sign-off panel | brackets draw (`scale` from the corner) | brackets, ease-out | The frame closes | Present at once |
| Buttons | Hover | colour; light sweep `translateX(−120%→120%)` | feedback, sweep | Clickable | Colour only |
| Slots, mission items, links | Hover | colour, edge | feedback | Responsive surface | Same (colour isn't motion) |
| Avatar tilt | Fine pointer over the frame | `rotateX/Y` ≤ 6° | feedback, ease-out | A physical card | Off |
| Menu, theme | Toggle | menu opacity + `translateY(−8px→0)`; theme instant | feedback | Open / close | Opacity only |

Safety: nothing flashes more than once per verdict and never above 3 Hz; the shake moves the chip without changing its luminance. Autoplay runs once per load, only when the hero is ≥ 50 % in view, and keeps the DOM text at "genuine", so nothing is announced; user runs clear, then set, the verdict (announced). Pressing Run or the switch during autoplay cancels it.

## Responsive Behavior
| Section | < `md` | `md`–`lg` | ≥ `lg` |
|---|---|---|---|
| HUD bar | TiDi · ▸ PLAYER 1 (≥ 375) · XP 56 px · motion · theme · menu | + "LVL still leveling", XP 120 px | nav from `xl`; XP key and MAX from `2xl` |
| Hero | Canvas band `min(48svh, 400px)` first (non-focusable, so it may lead), then intro, then console (log full width). Below `sm` the CTA pair and the console controls stack at full width; from `sm` each pair sits in a row | same | 5 / 7 split, `min-height: 100dvh`; stage `min(74svh, 700px)`, ≥ 440 px; console over the stage's bottom edge, log ≤ 360 px |
| Quest journal | Files stacked; each file opens with its hologram band (16:10, ≤ 320 px); no mission list | same | Left 5: sticky viewport (4:3) + mission list; right 7: stacked files |
| Mission log | Line at the left; node bodies in one column | node body in 2 columns (role and period, projects) | same, in 8 columns, offset 2 |
| House rules | 1 column | 2 × 2 | 2 × 2 |
| Inventory | Stacked; Leveling up 1 column, 2 × 2 from `sm` | same | Inventory 8 + Leveling up 4 (stacked cards) |
| Character stats | Stacked; avatar ≤ 220 px above the stats; stats side by side with the avatar (160 px) from `sm` | same | Stats 7 (avatar 200 px, 264 px from `xl`, + rows) · dialogue 5; education 7 · languages 5 |
| AFK | 2 columns | 3 columns | one row of 5 |
| Join party | Stacked | same | sign-off 5 · rows 7 |

Touch targets ≥ 44 px (buttons 48, rows 56). Coarse pointers get no tilt and no hover effects. Safe-area insets pad the strip and the edges. No horizontal scroll from 320 px; content reflows at 200 % zoom.

## Voice
The owner's RPG vocabulary is the UI ("▸ PLAYER 1", Quest journal, Party lead, AFK, progress saved), used only where the owner used it. Our own strings are short, sentence case, no em or en dashes. Where a split owner string is rejoined (a term and its description), the owner's own separator is kept verbatim; where we write a separator, it is a colon (Term: value) or, in lists, a middle dot. Rules: `portfolio-content`.

## Known Gaps
1. **Schema limits.** The format has no groups for motion, breakpoints, z-index, borders, opacity or 3D, and `export` drops `fontVariation` and `fontFeature`. Those values live in the tables above and are mapped by hand into the theme file; code review checks them against this file.
2. **Dark variants.** Every colour-bearing component has a Deck variant formed by adding `-dark` to each colour reference. Only the entries covering each `-dark` token are written out (lint: no orphans), to keep the file readable.
3. **Lint coverage.** The linter checks contrast only where a component has both colours, and it doesn't composite alpha. Graphic-only entries (`xp-*`, `state-bar`, `switch-thumb*`, `timeline-*`, `scene-*`, `panel-edge`, `focus-ring`, `link`) are covered by the Colors table.
4. **Mobile hero order.** Only the aria-hidden canvas leads; the controls and log follow the intro in both DOM and visual order, so focus order matches what's seen. The preview put the console above the intro; the owner may choose that instead (plan D3), at the cost of a focus-order jump.
5. **Starting values.** Bloom settings and the quest-hologram sizes are starting points; tune them at the checkpoint without changing the tokens.
6. **Waiting for the owner:** the `[copy: to draft & approve]` slots (see `docs/plan/v2/contrib-design.md` §5).
7. **Length:** about 420 lines, past the 300-line target. The front matter alone is about 190 lines (36 colours, 73 component entries), and the brief requires both themes, the 3D spec and the motion table.
8. **Glyph coverage.** "→" appears in the owner's strings (Five-Minute Window). The font subset must include U+2192, and the engineers' font check verifies it.

## Changelog
| Date | Change | Why |
|---|---|---|
| 2026-09-28 | Created from B · Holo Deck (directions-v2 §3, §5, §12; the preview's B tab). | The owner selected B on 2026-09-28. |
| 2026-09-28 | Phase F design check (`docs/reviews/v2/final/design-check.md`): `stat-value` drops `'tnum' 1`; square focus ring accepted; Deck canvas feather (8 %) specified; speaker tag in `nav` type, names never uppercase; level-up once per page load; power-on is a sliding cover with a `holo` leading edge; the Mission log line range; House rules lead run in, with a `text-decoration` underline; Lab base material and cone; quest hologram Bloom and rim; `avatar-xl`; training marker inline; mobile hero controls full width; AFK icon rise; Join party brackets and stretched sign-off; neutral voice wording; separator rule. | Rulings 1 to 8 and changes V1 to V10 of the check: font capability, build constraints the spec hadn't foreseen, and making the lower page as alive and finished as the hero. |
| 2026-09-28 | Differences from the preview and §5: (1) Run keeps its holo fill (preview), limited to the hologram's own control; (2) glass raised from 70–86 % to 92 %; (3) control borders use `text-muted`; (4) the skipped step uses `text-muted` plus a line-through, not 60 % opacity; (5) slots lose the 1 px lift; (6) the Lab host uses `accent-ink` / `accent`, not the preview-only `#9A6E00` / `#B8860B`; (7) the HUD strip gains the nav and a motion toggle, with the readout disclosed by width; (8) icons are `feather` and `wall` (Tabler has no shuttlecock or brick); (9) on mobile the console follows the intro; (10) ▸ ▼ ▲ render as Tabler filled icons. | (1) The preview is the look of record; the lock keeps gold the only action colour elsewhere. (2)–(4) Contrast: at 86 %, muted text over the cone measured 4.34:1; faint borders and faded text failed 3:1 and 4.5:1. (5) Slots aren't interactive, and the ban on hover lift applies. (6) Token-only colours. (7) The preview had no nav; 2.2.2 needs a pause control for the looping hologram. (8) The icon library has none. (9) The focus order matches the visual order (QA Review Focus 5; engineering R5). (10) Neither font has the glyphs. |
