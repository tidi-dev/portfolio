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
  shadow-pixel: "#0B728533"   # the brand's hard pixel shadow: holo 20 % (decorative)
  success-wash: "#1A7F3714"   # the active quest's aura: success 8 % (decorative)
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
  shadow-pixel-dark: "#4FD8E859" # holo cyan 35 % (decorative)
  success-wash-dark: "#3FB9501F" # success 12 % (decorative)
typography:
  display: { fontFamily: Galmuri11, fontSize: 3.75rem, fontWeight: 400, lineHeight: 1 }
  heading-section: { fontFamily: Galmuri11, fontSize: 2.25rem, fontWeight: 400, lineHeight: 1.3333 }
  heading-quest: { fontFamily: Galmuri11, fontSize: 1.5rem, fontWeight: 400, lineHeight: 1.3333 }
  heading-panel: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.5, letterSpacing: 1px }
  stat-value: { fontFamily: Galmuri11, fontSize: 1.5rem, fontWeight: 400, lineHeight: 1, fontFeature: "'tnum' 1" }
  wordmark: { fontFamily: Galmuri11, fontSize: 1.5rem, fontWeight: 400, lineHeight: 1 }
  role: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.5, letterSpacing: 1px }
  button: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.5, letterSpacing: 1px }
  nav: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.5, letterSpacing: 1px }
  label: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.5, letterSpacing: 1px }
  name: { fontFamily: Galmuri11, fontSize: 1.5rem, fontWeight: 400, lineHeight: 1.6667 }
  body: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 2 }
  body-compact: { fontFamily: Galmuri11, fontSize: 0.75rem, fontWeight: 400, lineHeight: 1.6667 }
  print-name: { fontFamily: Mona Sans, fontSize: 1.125rem, fontWeight: 500, lineHeight: 1.25, fontVariation: "'wdth' 112" }
  print-body-strong: { fontFamily: Mona Sans, fontSize: 1rem, fontWeight: 600, lineHeight: 1.6 }
  print-body-sm: { fontFamily: Mona Sans, fontSize: 0.9375rem, fontWeight: 400, lineHeight: 1.5 }
  print-caption: { fontFamily: Mona Sans, fontSize: 0.8125rem, fontWeight: 400, lineHeight: 1.4 }
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
  quest-card: 312px
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
  brand-shadow: { textColor: "{colors.shadow-pixel}" }
  alt-names: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.name}" }
  role-line: { backgroundColor: "{colors.surface}", textColor: "{colors.holo}", typography: "{typography.role}" }
  button-primary: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 24px }
  button-primary-hover: { backgroundColor: "{colors.accent-hover}", textColor: "{colors.on-accent}" }
  button-ghost: { backgroundColor: "{colors.surface}", textColor: "{colors.primary}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 24px }
  button-holo: { backgroundColor: "{colors.holo}", textColor: "{colors.on-holo}", typography: "{typography.button}", rounded: "{rounded.none}", height: 48px, padding: 20px }
  switch: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.nav}", height: 44px, padding: 14px }
  switch-thumb: { backgroundColor: "{colors.text-muted}", size: 12px }
  switch-thumb-on: { backgroundColor: "{colors.danger}", size: 12px }
  step-log: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-muted}", typography: "{typography.body-compact}", padding: 16px }
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
  quest-card: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.heading-quest}", rounded: "{rounded.none}", padding: 24px, width: 312px }
  quest-card-hover: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.holo}", size: 1px }
  quest-card-selected: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", size: 2px }
  quest-card-active: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.success}", size: 1px }
  quest-card-aura: { backgroundColor: "{colors.success-wash}" }
  facts-term: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.label}", width: 96px }
  facts-value: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body-compact}" }
  stat-readout: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.stat-value}" }
  achievement-badge: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body-compact}", padding: 16px }
  toast: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.heading-panel}", padding: 12px }
  video-facade: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.button}", height: 48px }
  timeline-line: { backgroundColor: "{colors.holo}", width: 2px }
  timeline-node-current: { backgroundColor: "{colors.accent}", size: 16px }
  rule-lead: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.accent-ink}", typography: "{typography.body}" }
  inventory-slot: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.nav}", padding: 8px }
  training-marker: { textColor: "{colors.success}", size: 12px }
  avatar-caption: { backgroundColor: "{colors.scrim}", textColor: "{colors.on-scrim}", typography: "{typography.body-compact}" }
  speaker-tag: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.nav}", padding: 8px }
  contact-row: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.primary}", typography: "{typography.body}", height: 56px, padding: 16px }
  link: { textColor: "{colors.accent-ink}" }
  footer-line: { backgroundColor: "{colors.surface}", textColor: "{colors.text-muted}", typography: "{typography.label}" }
  favicon: { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", size: 32px }
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
  brand-shadow-dark: { textColor: "{colors.shadow-pixel-dark}" }
  quest-card-aura-dark: { backgroundColor: "{colors.success-wash-dark}" }
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
4. **Icons:** Tabler outline, stroke 1.5, 20 px (24 px in Join party and AFK). The three game glyphs ▸ ▼ ▲ are Portfolio Pixel glyphs, not icons.
5. **Type:** one family on the site: Portfolio Pixel, the renamed Galmuri11 subset, sets every word (owner, 2026-09-28: "all text pixel"). One weight on its 12 px grid; hierarchy comes from size steps, colour, case and spacing. No mono, no italics, no bold. Portfolio Sans, the renamed Mona Sans subset, sets only the résumé PDF.
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
| `shadow-pixel` | holo 20 % | cyan 35 % | The brand's hard sprite shadow (Typography). Decorative. |
| `success-wash` | success 8 % | success 12 % | The active quest card's aura, light from its strip. Decorative; the text on it is in the table below. |

**Contrast (WCAG 2.x, computed by script, no rounding): 59 pairs, 0 failures** (quest cards add 5 on 2026-09-28: text on the aura, worst case at the top of the gradient, and the Active edge) (re-run 2026-09-28 for the font change; colours unchanged). All text pixel (2026-09-28) adds no pair: the reading roles use `primary`, `text-muted`, `accent-ink` and `on-scrim` on the backgrounds below (17 of these pairs re-run, 0 failures). Translucent layers were checked against the worst backdrop (glass over full `holo`; the HUD strip over gold or ink).

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
| Brand (`primary`) over its `shadow-pixel` tint, where the shadow sits under a glyph | 12.76 | 7.22 | 3 (large) |
| Focus ring on `surface` / `surface-raised` | 5.60 / 6.30 | 10.11 / 9.22 | 3 |
| Control border, switch thumb off (`text-muted` on raised) | 6.39 | 5.83 | 3 |
| State bar (`accent-ink` on `surface`) | 5.60 | 10.11 | 3 |
| Switch thumb on (`danger` on raised) | 5.36 | 5.35 | 3 |
| Quest card text on the Active aura: `primary` / `text-muted` / `accent-ink` (stat key) / `success` (chip) | 17.04 / 5.75 / 5.67 / 4.57 | 12.58 / 4.83 / 7.64 / 5.85 | 4.5 |
| Quest card edges on `surface`: selected `accent-ink` / Active `success` / hover `holo` | 5.60 / 4.51 / 4.96 | 10.11 / 7.75 / 11.55 | 3 |

## Typography
| Family | Role | Source, licence | Weights, subsets | Why |
|---|---|---|---|---|
| **Portfolio Pixel** (Galmuri11, renamed) | Every word on the site: brand, headings, names, reading text, facts, captions, HUD, labels, stats, controls; the ▸ ▼ ▲ glyphs | npm `galmuri` 2.40.3, `dist/Galmuri11.ttf` ("Version 2.403"), OFL-1.1, © 2019–2025 Lee Minseo. Reserved Font Name "Galmuri", so the subset ships renamed | 400 only (Bold covers 32/134 Vietnamese letters); latin, vietnamese, arrows, U+25B2 U+25B8 U+25BC. 134/134 Vietnamese | A proportional 16-bit console-menu face: "▸ PLAYER 1", "Press A to continue" and "progress saved" read as a game UI at a glance, set against a live hologram. Owner's pick, A · Cartridge. |
| **Portfolio Sans** (Mona Sans, renamed) | The résumé PDF only; the site doesn't load it. Owner, 2026-09-28: the PDF stays plain | google/fonts `ofl/monasans`, OFL-1.1 (GitHub); RFN "Mona", so renamed | wght 400–600, wdth 100–112; latin, vietnamese, arrows | GitHub's typeface, where the owner's RPG README and banner live. Width 112 gives the names their stance. |

Front-matter tokens name the source families (`Galmuri11`, `Mona Sans`); the font pipeline serves them under the renamed families. The `print-*` tokens belong to the résumé and never appear on the site.

| Token | Size (stepped) | Line height | Tracking, case | Use |
|---|---|---|---|---|
| `display` | 60 px; 96 px from `lg` | 1 (60 / 96 px) | 0, as cased | "TiDi" only. A hard sprite shadow, `calc(1em / 12)` right and down, no blur, in `shadow-pixel`, both themes (5 px / 8 px). It replaces the soft glow |
| `heading-section` | 36 px; 48 px from `md` | 1.3333 (48 / 64 px) | 0, sentence case | h2 per section |
| `heading-quest` | 24 px | 1.3333 (32 px) | 0, sentence case | Quest, employer and menu titles |
| `stat-value` | 24 px; 36 px from `md` | 1 | 0, tabular figures (`tnum`) | botmivivi readouts; the count-up no longer shifts width |
| `wordmark` | 24 px | 1 | 0 | HUD "TiDi" |
| `heading-panel` | 12 px | 1.5 (18 px) | 1 px, uppercase | Panel h3, toast. The owner's labels only |
| `label` | 12 px | 1.5 | 1 px, uppercase | Stat keys, HUD keys, status chips, step numerals, footer |
| `role` | 12 px | 1.5 | 1 px, uppercase | Role line |
| `button` | 12 px | 1.5 | 1 px, as written; the verdict alone is uppercase | Buttons, skip link, verdict, video facade |
| `nav` | 12 px | 1.5 | 1 px, as cased | Nav, switch, training topics, speaker tag. The menu sheet uses `heading-quest` |
| `name` | 24 px | 1.6667 (40 px) | 0, as cased | "Hồ Trọng Đại" (`lang="vi"`) and "Dai Ho Trong", `text-muted` |
| `body` | 12 px, every width | 2 (24 px) | 0, as written | Paragraphs, the hero sentence, bullets, contact rows, House rules |
| `body-compact` | 12 px | 1.6667 (20 px) | 0, as written | Facts values, log steps, badges, the toast's quest name, the stat qualifier, the avatar caption |
| `print-*` | name 1.125rem (wdth 112), body-strong 1rem at 600, body-sm 0.9375rem, caption 0.8125rem | 1.25 / 1.6 / 1.5 / 1.4 | none | Résumé PDF only, Portfolio Sans, the values the site used before |

**Pixel principles** (Portfolio Pixel only)
- **The grid.** 1200 units per em at 100 units per font pixel, so one font pixel is size ÷ 12. Sizes are only 12, 24, 36, 48, 60 and 96 px (written in rem at the 16 px root), stepped at breakpoints: no `clamp()`, `vw` or `calc()` on a pixel role, and no scale transform at rest.
- **Whole pixels.** Line heights resolve to even whole pixels (the table), which keeps baselines on whole pixels under both the Mac (hhea) and Windows (win) metrics. Tracking is 1 px at 12 px and 0 above. Shadow offsets are one font pixel.
- **One weight.** Regular 400 with `font-synthesis: none`: hierarchy comes from size, colour and case, never bold or italic.
- **Diacritics.** Stacked tones reach 17/12 em (Ồ), 5 font pixels above the ascent. In `body` they fit the 24 px line; in `body-compact` and `name` they rise 2 and 4 px above the line box and still clear the line above by ≥ 1 px. So no container clips pixel text vertically (`overflow: hidden`, fixed heights), the name block keeps `2xs` (4 px) above its first line, clear of the brand's sprite shadow, and a heading carrying Vietnamese takes the `name` leading (40 px at 24 px).
- **Emphasis.** No bold or italic exists: `strong`, `b` and `em` render at 400, upright, in `accent-ink`. The House rules lead phrase is `accent-ink` plus its underline.
- **Case.** Uppercase only on `heading-panel`, `label`, `role` and the verdict. Names never take it.

**Reading on the grid.** Body stays 12 px at every width, and the step up goes to names and titles, not paragraphs. Galmuri11's x-height is 8 of 12 font pixels, so at 12 px it matches a 16 px sans; a character of the owner's copy averages 6.57 px (all 13,269 prose characters of `info.md`, measured with fontTools). At 24 px that doubles: a 320 px panel line would hold about 20 characters and a 5-column panel about 35.
- **Measure:** `measure` 56ch for paragraphs (1ch is the 8 px "0", so 448 px, about 68 characters); `measure-hero` 50ch (400 px, about 61; the hero sentence runs 4 lines). A 320 px panel line holds about 39 characters, 375 px about 47.
- **Rhythm:** paragraphs are `lg` (24 px, one line) apart; a label sits `xs` above what it names; list items are `2xs` apart.
- **Bullets:** a 4 × 4 px `text-muted` square on whole pixels, centred on the first line's x-height, `sm` before the text. Not the browser's disc, which renders soft at this size.

**Hierarchy without a second face**
| Level | Size | Set apart by |
|---|---|---|
| Brand | 96 / 60 px | Size, sprite shadow |
| Section | 48 / 36 px | Size, `primary`, the holo lead line |
| Titles, names, stats, wordmark | 24 px | Size; names in `text-muted` |
| Reading (`body`, `body-compact`) | 12 px | Sentence case, no tracking, 24 or 20 px leading; `primary`, secondary text `text-muted` |
| Labels (`heading-panel`, `label`, `role`) | 12 px | Uppercase, 1 px tracking, 18 px leading, colour (`accent-ink`, `holo`; HUD keys and footer `text-muted`) |
| Controls (`button`, `nav`) | 12 px | As cased, 1 px tracking, inside a 44 to 48 px box or a filled tag |

General: every size is on the pixel grid (12 × 1, 2, 3, 4, 5, 8); nothing is fluid. Uppercase is CSS (`text-transform`), never typed; the DOM keeps the owner's casing. Names (TiDi, Hồ Trọng Đại, Dai Ho Trong, project and employer names) never take an uppercase style. Curly quotes; the owner's em dashes stay.

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
- **Glow (Deck only):** Bloom inside canvases, whose edges feather out over 8 % of the canvas on each side (a mask), so the halo never ends in a seam. The feather stays inside the stage and never sits under text; Lab has no Bloom and no feather; the hero backdrop, radial `holo` 16 % at 72 % 50 % and `accent` 8 % at 10 % 90 %, over `surface`. Lab keeps the backdrop at half strength with no glow.
- **Edges:** 1 px `line`, following the chamfer, including the 45° cut. Glow never sits behind body text.
- **Sprite shadow (both themes):** the brand's hard one-font-pixel shadow in `shadow-pixel` (Typography). The only text shadow.

## Shapes
- **Chamfer:** `clip-path` cuts the top-right and bottom-left corners: `chamfer` (14 px) on panels and buttons, `chamfer-sm` (8 px) on chips, the toast and the switch. `rounded.none` elsewhere.
- **Corner brackets:** four 30 px L-marks, 2 px `holo` at 70 %, framing the hero viewport (every width) and the Join party grid (from `lg` only, where the pair sits side by side; below `lg` they would crowd the 16 px page edge around one tall column), so the same frame opens and closes the page.
- **Icons:** Tabler (`@tabler/icons-react` 3.48.0, MIT): sun, moon, menu-2, x, player-pause, player-play, file-download, external-link, mail, brand-telegram, brand-github, map-pin, ball-football, feather (Badminton: Tabler has no shuttlecock), swimming, device-gamepad-2, coffee, check, wall, stopwatch, key, tool, device-floppy. **Game glyphs:** "▸" (before PLAYER 1), "▼" (after Press A to continue) and "▲" (training markers) are Portfolio Pixel glyphs (U+25B8, U+25BC, U+25B2), each in an `aria-hidden` span, so the text node keeps only the words. They replace the Tabler filled caret-right, caret-down and triangle.
- **Images:** the avatar is 3:4 (the source is 1086 × 1448), shown whole, never cropped to a sticker.

## Components
States not listed as tokens are described here; colours always come from the tokens named.

**HUD bar** (`hud-bar`, `wordmark`, `hud-player`, `xp-track`, `xp-fill`, `nav-link`, `state-bar`, `icon-button`). A fixed glass strip: wordmark "TiDi" · nav (from `xl`) · readout "▸ PLAYER 1", the XP bar, "LVL still leveling" (from `md`); "XP · SYSTEM DESIGN" and "MAX not a thing" join from `2xl` · motion toggle · theme toggle · menu button (below `xl`). XP bar: 10 segments (2 px `surface` gaps), fill gradient `accent` → `success`, fixed at 70 %, `aria-hidden`, never a number. Nav items: Quest journal, Mission log, House rules, Inventory, Join party; hover `accent-ink`; the current section (scroll-spy) gets a 2 px `state-bar` underline and `aria-current="true"`. Icon buttons: theme toggle ("Dark theme", `aria-pressed`, moon/sun swap), motion toggle (name `[copy: to draft & approve]`, `aria-pressed`, pause/play swap; the choice persists across visits), menu ("Menu", `aria-expanded`). Below 375 px the "▸ PLAYER 1" label hides. Every HUD word is Portfolio Pixel: the wordmark at 24 px, the rest at 12 px.

**Menu sheet** (`menu-sheet`). Below `xl`: a full-height glass sheet under the strip, nav links at `heading-quest` size, 56 px rows. Focus moves in, Esc and the "x" close it, and focus returns to the button.

**Skip link** ("Skip to content") and **focus ring**: 2 px `focus`, offset 3 px (whole pixels, so the ring stays as crisp as the pixel type), a square outline on the element's box, also on chamfered controls. It reads as a HUD selection frame and stays one ring for every control. The chamfer is drawn on a pseudo-element, so `clip-path` never cuts the outline.

**Hero intro** (`hud-player`, `brand-name`, `brand-shadow`, `alt-names`, `role-line`). "▸ PLAYER 1"; one `h1` holding "TiDi" (pixel, with the sprite shadow), "Hồ Trọng Đại" and "Dai Ho Trong" (pixel `name`, 24 px); the role with a 28 × 2 px `holo` lead line; `hero.sentence` in `body` at `measure-hero`; the CTA pair.

**Buttons.** A 12 px pixel label, 48 px high, padding 24 px (Run: 20 px), icon 20 px with an `xs` gap. 24 px is the next crisp label step if the owner asks for a larger CTA. `button-primary`: gold, chamfered; hover `accent-hover` plus a light sweep; active `translateY(1px)`. `button-ghost`: 1 px inset border in `text-muted` (whole pixels; the 12 px pixel stroke is 1 px), `holo` on hover. `button-holo`: "Run the handshake" only; `aria-disabled` at 55 % opacity while a run plays. Hero CTA "Bring me a pain point" → `#contact`; "Résumé" → the PDF (file-download icon).

**Switch** (`switch`, `switch-thumb`, `-on`). "Counterfeit chip", `aria-pressed`. A 34 × 18 px track with a `text-muted` border; the thumb slides 16 px and turns `danger` when on. State shows by position, not colour alone.

**Handshake log** (`step-log`, `step-on`, `step-numeral-on`, `verdict-*`). A glass `<ol>` of three `a11y.steps.bench` lines, numerals in 20 px chips. Pending: `text-muted`. Lit: `primary`, with numeral `on-holo` on `holo`. Skipped (counterfeit): `text-muted` with a line-through, no opacity. Verdict: `<output role="status">`, "genuine" (`success`) or "rejected" (`danger`), uppercase `button`. The step-numeral chip centres its 18 px line in 20 px.

**Scene tags** (`scene-tag`). "host" and "chip", glass chips pinned to 3D anchors, `aria-hidden`.

**Panel** (`panel`, `panel-edge`, `panel-heading`, `divider`). The chamfered glass block that every section is made of. The heading is an h3 in `heading-panel` with a trailing rule. Panels aren't interactive and get no hover.

**Section heading** (`section-heading`). An h2 per section, with a 2 px × 28 px `holo` lead line.

**Status chip** (`status-active`, `-side`, `-cleared`). "Active", "Side", "Cleared" with a 1 px border in the text colour. Cleared adds a check icon.

**Quest card** (`quest-card`, `-hover`, `-selected`, `-active`, `quest-card-aura`, `status-*`). One game card per full project, in content order (owner, 2026-09-28; replaces the stacked files and plan v2's "no hidden tabs" ruling).
- *Anatomy* (top to bottom, gaps `sm`, padding `lg`): rarity strip; status chip; title (`heading-quest`, `primary`, the project `name`, may wrap); one-liner (`lede`, `body-compact`, `text-muted`); a 1 px `rule` divider pushed down (`margin-top: auto`, so the stats align across the row); the key stat: key (`label`, `accent-ink`), value (`stat-value`, `primary`), qualifier below (`body-compact`, `text-muted`). No period, stack or icons on the card.
- *Key stat*, existing content only; the keys are the approved `factTerms` labels, and value + space + qualifier rejoins the source verbatim: CyberRock: Scale, "13", "services across Azure and AWS" (`facts.scale`). botmivivi: Customers, "646", "in the first 2 months" (`usage.customers`, `botmivivi.facts.window`). Quest: Users, "~300", "users in Ha Noi, Da Nang, Sai Gon, Can Tho" (`quest.users`). Static on the card (no count-up).
- *Frame:* opaque `surface-raised`, chamfer 14 px, a 1 px `line` edge along the cut (pseudo-element, so the focus ring is never clipped). Rarity strip: a 4 px bar along the top, from the left corner to the start of the cut, in the status colour (Active `success`, Side `accent-ink`, Cleared `text-muted`). No corner brackets (they belong to the hero and Join party).
- *Sizes:* layout on the 12 px grid (padding 24, gaps 12, max width `quest-card` 312 px), strokes in whole pixels (1, 2, 4). Cards in a row share one height (stretch). The whole card is the target.
- *States:* **hover** (`@media (hover: hover)`): edge `holo`; no lift, no fill change. **Focus-visible:** the site's square ring. **Selected** (`aria-selected="true"`): a 2 px `accent-ink` edge along the cut, plus the menu cursor "▸" (pixel glyph, 12 px, `accent-ink`, `aria-hidden`) absolutely placed in the left padding on the title's first line, so nothing reflows. Width and cursor carry the state, not colour alone.
- *Active quest* (every card whose status is Active, so CyberRock; data-driven, never an id check): a 1 px `success` edge and the aura, `linear-gradient(to bottom, success-wash, transparent 50%)` over the fill. Permanent: it stays when another card is selected; when the Active card is selected, the gold edge takes the outline and the strip, aura and "Active" chip keep it reading. No loop.

**Quest card row** (tablist). `role="tablist"`, `aria-labelledby` the section h2. Each card is a `<button type="button" role="tab">`: id `quest-tab-{id}`, `aria-controls` its panel, `aria-selected`, roving `tabindex` (0 selected, −1 others); name from the title (`aria-labelledby`), description from chip, one-liner and stat (`aria-describedby`). Order (owner, 2026-09-28): Cleared, Active, Side, left to right, so the Active quest sits in the middle; the keyboard order matches. CyberRock (Active) is selected on load. Automatic activation: Left / Right move focus and select (wrapping), Home / End go to the first / last; Tab moves on into the panel. Below `md`: a horizontal scroll-snap row (`x mandatory`, cards snap `start`, `overscroll-behavior-x: contain`), full bleed with the page edge as `padding-inline` and `scroll-padding-inline`; cards `min(100% − 48px, 312px)` wide, so the next card peeks (52 px at 320 px); `padding-block` `xs` so rings aren't clipped; a thin native scrollbar (thumb `text-muted`); a focused card scrolls into view (`nearest`). Swiping never changes the selection; on load the row opens on the Active card (the row's `scrollLeft` only). From `md`: a 3-column grid, no scroll, `1fr 1.2fr 1fr` (`1fr 1.4fr 1fr` from `lg`), cards centred; side cards `md` padding, the Active card `2xl` block and `lg` inline, so it stands wider and taller.

**Quest detail panel** (`panel`, `quest-title`, `facts-term`, `facts-value`). One chamfered panel under the row: the stage plus three tabpanels.
- *Stage:* `aria-hidden`, outside the tabpanels; one live canvas (Quest holograms) that swaps its model on selection. The quest's poster holds it until the scene is ready, and for good without WebGL. The toast sits at its top-left.
- *Tabpanel:* `role="tabpanel"`, id = the existing quest anchor (`quest-{id}`), `aria-labelledby` its tab, `tabindex="0"`; the other two carry `hidden`. Contents, as the former quest file: status chip, h3 (`quest-title`), one-liner (`body`, `text-muted`), facts `dl` (Role, When as `format.period`, then Team, Scale, Users or Stack as the quest has them; botmivivi's stat readout), the "What I built" / "What it does" bullets with no heading, Party lead, achievements, video facade, and the steps `<ol>` in the log style (`a11y.steps.*`). A slot renders only when `info.md` holds its fact.
- *Layout:* from `lg`, 5 / 7 inside the panel: stage and tabpanel; the stage stretches to the tabpanel's full height (owner, 2026-09-28), and the camera backs off by 4:3 ÷ aspect so the model keeps its 4:3 width framing with room above and below. Below `lg`: the stage band (16:10, ≤ 320 px) above the tabpanel, one column.
- *Deep links:* a `#quest-{id}` hash on load, or a Mission log link, selects that quest, scrolls the panel into view and focuses the tabpanel.
- *No JS:* the server markup already has the roles and CyberRock selected. The existing `noscript` style hides the card row and the stage and shows every tabpanel, so all three stack in content order, `lg` apart, each opening with its own chip and h3.

**Stat readout** (`stat-readout`). botmivivi: Users 10, Customers 646, Orders 2,951, the qualifier "in the first 2 months", and Impact as a text line, exactly `botmivivi.facts`. Three columns from `xs`, one below (Responsive).

**Achievement badge** (`achievement-badge`). Quest's four: icon (wall, stopwatch, key, tool) + name in `primary` + description in `text-muted`, both `body-compact`. A 2 × 2 grid from `sm`.

**Toast** (`toast`). A glass chip with a 1 px `accent-ink` edge in the stage's top-left: "Quest unlocked" plus the quest name in `body-compact` `primary`. It fires on each selection the visitor makes (click, tap, arrow key, deep link), never for the default on load. `aria-hidden`; the state is carried by `aria-selected`.

**Video facade** (`video-facade`). "Watch Quest by NFQ" with a player-play icon and the caption "Opens the YouTube player."; the iframe loads only on activation.

**Mission log timeline** (`timeline-line`, `timeline-node-current`). A 2 px `holo` line with 16 px square nodes rotated 45°: `holo` outline, and a gold core for the current employer. Each node: h3 employer, title, period, and the projects as a list (links that select the quest's card; Lemonswan's external link).

**Rule panel** (`panel`, `rule-lead`). A House rule: a numeral chip (1–4; the owner's list is ordered) and the rule as one paragraph. The lead phrase is run in (inline, `rule-lead`), and the rest of the owner's sentence follows on the same line, so no line starts with the owner's dash. Underline: `text-decoration` 2 px, offset 4 px, in `accent-ink`, which wraps with the phrase.

**Inventory slot** (`inventory-slot`). A square list item with a 1 px `rule` edge and a `holo` 5 % tint; hover: `holo` edge and 14 % tint, no lift, no pointer cursor.

**Training card** (`panel`, `training-marker`). A Leveling up topic in `nav` type, led inline by the "▲" glyph in `success` at 12 px (gap `xs`, on the first line), 16 px padding.

**Avatar frame** (`avatar-caption`). A 3:4 image, `avatar` wide (`avatar-xl` from `xl`) in a 1 px `line` frame, `alt=""`; `avatar.caption` sits visibly on the `scrim` at the bottom. On fine pointers it tilts up to 6° toward the pointer.

**Dialogue box** (`panel`, `speaker-tag`, `link`). The bio as an RPG dialogue: a gold speaker tag "TiDi" in `nav` type (12 px pixel), as cased (never uppercase), both paragraphs always visible in `body`, and at the end "Press A to continue ▼" as a button (the ▼ is the pixel glyph) that moves to `#afk`. The A key works only while the box has focus.

**AFK list.** Five items, each a 24 px icon + label, 56 px high, in an idle panel.

**Contact row** (`contact-row`, `button-primary`, `button-ghost`). Rows beside the sign-off: Email (the address as `button-primary`), Telegram and GitHub (`button-ghost`, external), Résumé ("PDF, {size}"), Location (plain text). From `lg` the sign-off panel stretches to the rows panel's height, the sign-off at the top, and corner brackets frame the pair.

**Link** (`link`). `accent-ink`, underlined 1 px (one font pixel) and clear of the 2 px descenders; hover `primary`. External links open in the same tab and add the external-link icon (`aria-hidden`).

**Footer** (`footer-line`). device-floppy icon + "progress saved · still learning, always solving".

**Site icon** (`favicon`). A 32 × 32 px `accent` tile with the chamfer cut 8 px at the top-right and bottom-left (polygon 0,0 24,0 32,8 32,32 8,32 0,24), and the Portfolio Pixel "T" traced at 2× (a font pixel is 2 px) in `on-accent`: bar at x 9, y 5, 14 × 2; stem at x 15, y 5, 2 × 22. Integer rectangles, `shape-rendering: crispEdges`, Lab colours only (the tab doesn't theme), 9.72:1. Served at `/icon` and `/favicon.ico`. No artwork of the owner.

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

**Quest holograms** (Quest journal). A smaller projector (base r 1.4, two rings, the cone), with the hero's materials per theme (Lab base included), the hero's Deck Bloom, and a `holo` rim ring at r 1.4 so the Deck base never reads as a black disc. FOV 30, fixed three-quarter view, pointer tilt ±0.15 rad from `lg`. One canvas, in the detail panel's stage; selection swaps the model in place. One model per quest (`depiction.holograms`):
- **CyberRock:** the hero chip at 0.7 scale with its scan ring.
- **botmivivi:** a ledger stack of five slabs (1.6 × 0.08 × 1.1, gap 0.12, `holo` edges) turning at 0.2 rad/s.
- **Quest:** two linked data slabs (1.2 × 0.5 × 1.2): the left slab is `holo` wireframe at 40 %, the right a solid `scene-chip` slab with `holo` edges. A curved path joins them, and four packets cross left → right in a loop, every 4 s.
- `aria-hidden` tags "v1" and "v2" on Quest's slabs. The HTML equivalent is the steps list in each quest panel.

## Motion
**Budget.** The hero lives (a looping hologram and one autoplayed handshake). Every section powers on once when first seen and has one reward moment. Only `transform`, `opacity`, `clip-path`, the colour of 3D materials and the House rules underline colour animate; transitions name their properties; everything is interruptible; there are no scroll listeners (IntersectionObserver, `animation-timeline: view()`). A single **motion mode** exists: `prefers-reduced-motion`, or the HUD motion toggle, sets `data-motion="off"`, which gives the reduced variants below and pauses every loop (WCAG 2.2.2).

**Tokens.** Durations: `feedback` 150 · `verdict` 250 · `toast-in` 300 / `toast-out` 250 / `toast-hold` 1600 · `swap` 320 · `row`, `brackets`, `hud` 400 · `shake` 450 · `sweep`, `release` 500 · `project` 700 · `levelup` 800 · `wipe`, `pulse`, `count` 900 · `packet` 1000 · `boot`, `line` 1200 · `scan` 1400 · `xp`, `verdict-hold` 2200 ms. Staggers: `line` 80 · `row` 100 · `badge`, `ring` 120 · `panel` 160 ms. Delays: `autoplay` 200 (after boot) · `xp` 500 · `rows` 550 · `scan` 600 ms. Easings: `ease-out` `cubic-bezier(0.2, 0.8, 0.2, 1)` · `ease-power` `cubic-bezier(0.7, 0, 0.2, 1)` · `ease-back` `cubic-bezier(0.34, 1.56, 0.64, 1)` · `ease-in-out` `cubic-bezier(0.4, 0, 0.6, 1)` · `linear` for loops. 3D rates are listed in 3D Scenes; ambient: rings 0.4 / −0.6 / 0.15 rad/s, ticks −0.1, chip spin 0.35, bob ±0.08 at 1.3 rad/s, scan `sin(1.1t)`, host 0.8, motes 0.25–0.55 units/s.

| Element | Trigger | Property | Timing | Communicates | Reduced (`data-motion="off"`) |
|---|---|---|---|---|---|
| HUD strip, hero brackets | Load | strip `translateY(−100%→0)`; brackets draw (`scale` from the corner) | hud, brackets, ease-out | System online | Present at once |
| XP bar | Load | fill `scaleX(0→0.7)` | xp, delay xp, ease-out | Still leveling | Rests at 0.7 |
| Hero intro lines | Load | `clip-path` wipe left → right | wipe, stagger line, ease-power | Player 1 loads in | Present at once |
| Hologram boot | Canvas ready | rings `scale 0→1` (stagger ring), cone opacity, chip materialises with one scan pass | boot, ease-back | The projector powers up | One still composed frame |
| Hologram ambient | Continuous while visible | rings, ticks, scan, motes, bob, host spin | linear | A live hologram | Still; renders on demand only |
| Handshake, genuine | Autoplay once, or Run | 0–1000 gold comet host → chip, step 1 lit; 1000–2000 holo comet back, step 2; 2000: step 3, verdict, chip lerps to `success`, pulse ring scale 1 → 2.4 fading; hold, then release to `holo` | packet ×2, verdict, pulse, verdict-hold, release | The chip proves it's genuine | Final state at once; colour holds until the next run |
| Handshake, counterfeit | Run with the switch on | challenge only; at 1000 step 2 struck, "rejected", chip lerps to `danger`, one decaying ±0.06 shake | packet, verdict, shake | A fake fails after the challenge | Final state at once, no shake |
| Panel power-on | ≥ 25 % in view, once | a `surface` cover layer over the content slides `translateX(0 → 100%)` inside its own clipping track (`inset: 0; overflow: clip`, never the panel itself, so focus rings aren't cut); its leading left edge is a 2 px `holo` line at 70 %, shown only while the cover moves: `opacity: 0` while the panel waits, then 0.7 with 0 ms duration and the slide's own delay (stagger), so the edge appears exactly as the slide starts and never stands as a line at rest; after the wipe it sits just outside the track, clipped. Not `clip-path` on the panel: IntersectionObserver never reports an element clipped to nothing | wipe, stagger panel, ease-power | Panels come online | Present at once; no edge |
| Stat rows, facts | With their panel | opacity + `translateX(−10px→0)` | row, delay rows, stagger row | Stats tick in | Present at once |
| Avatar scan | With its panel | a `holo` band `translateY` top → bottom, once | scan, delay scan | Character scanned | None |
| Quest select (panel swap) | Selection changes | the new tabpanel shows and the old hides at once; a `surface-raised` cover in the panel's clipping track slides `translateY(0 → 100%)`, its top edge a 2 px `holo` line at 70 % shown only while moving (the scan); the stage cuts to the new model, which projects in (scale 0.6 → 1) with one scan-disc pass; the cursor `translateX(−4px → 0)` + fade; card edges change colour | swap, ease-power (model ease-back); cursor and edges feedback | Opening a quest | Instant: no cover, model cut to a still frame, cursor and edges at once |
| Quest unlocked | A selection by the visitor, not the default on load | toast wipe in, hold, out; a new selection restarts it | toast-in / hold / out | A quest opened | Toast fades in and out (feedback) |
| Active quest lights | With the row's power-on, once | after its card's wipe, the Active strip `scaleX(0 → 1)` from the left and the aura opacity 0 → 1 | sweep, ease-out | The quest in progress | Present at once |
| Achievements | First time Quest's panel shows | each badge wipes on + one glint `translateX` | row, stagger badge | Achievements | Present at once |
| botmivivi readouts | First time its panel shows | numbers count 0 → value (text stays final for AT) | count, ease-out | Live numbers | Final values |
| Mission log line | Scroll | line `scaleY(0→1)` via `view()`, `animation-range: entry 10% cover 45%`, so it is complete before the section's middle passes the viewport's (IO fallback: line); nodes power on as reached | line, wipe | Career progress | Fully drawn |
| House rules | In view | panels wipe on in reading order; then the lead phrase's underline colour transitions `transparent → accent-ink` | wipe, stagger panel, sweep | The rules of play | Present at once |
| Level up | Leveling up in view, once per page load (no storage) | a 2 px `accent` bar sweeps across the HUD strip; triangles rise 6 px + fade | levelup, row, stagger row | Skills in training | None; triangles present |
| AFK | With its panel | each icon rises 4 px + fades in, once | row, stagger row | Idle, then back | Present at once |
| Join party brackets (from `lg`) | With the sign-off panel | brackets draw (`scale` from the corner) | brackets, ease-out | The frame closes | Present at once |
| Buttons | Hover | colour; light sweep `translateX(−120%→120%)` | feedback, sweep | Clickable | Colour only |
| Slots, quest cards, links | Hover | colour, edge | feedback | Responsive surface | Same (colour isn't motion) |
| Avatar tilt | Fine pointer over the frame | `rotateX/Y` ≤ 6° | feedback, ease-out | A physical card | Off |
| Menu, theme | Toggle | menu opacity + `translateY(−8px→0)`; theme instant | feedback | Open / close | Opacity only |

Safety: nothing flashes more than once per verdict and never above 3 Hz; the shake moves the chip without changing its luminance. Autoplay runs once per load, only when the hero is ≥ 50 % in view, and keeps the DOM text at "genuine", so nothing is announced; user runs clear, then set, the verdict (announced). Pressing Run or the switch during autoplay cancels it.

## Responsive Behavior
| Section | < `md` | `md`–`lg` | ≥ `lg` |
|---|---|---|---|
| HUD bar | TiDi · ▸ PLAYER 1 (≥ 375) · XP 56 px · motion · theme · menu | + "LVL still leveling", XP 120 px | nav from `xl`; XP key and MAX from `2xl` |
| Hero | Canvas band `min(48svh, 400px)` first (non-focusable, so it may lead), then intro, then console (log full width). Below `sm` the CTA pair and the console controls stack at full width; from `sm` each pair sits in a row | same | 5 / 7 split, `min-height: 100dvh`; stage `min(74svh, 700px)`, ≥ 440 px; console over the stage's bottom edge, log ≤ 360 px |
| Quest journal | Card row scrolls sideways (snap, cards `min(100% − 48px, 312px)`, next card peeks; the page itself never scrolls sideways at 320 px); the detail panel below: stage band (16:10, ≤ 320 px), then the tabpanel. Stat readout: 3 columns from `xs`, 1 below ("CUSTOMERS" in `label` is 84 px; a column at 320 px is 77 px) | cards in 3 columns, no scroll; panel as below `md` | cards `1fr 1.4fr 1fr` (Cleared · Active · Side); panel 12: stage 5 (full tabpanel height) · tabpanel 7 (bullets and terms on one line at 1440 px; owner, 2026-09-28) |
| Mission log | Line at the left; node bodies in one column | node body in 2 columns (role and period, projects) | same, in 8 columns, offset 2 |
| House rules | 1 column | 2 × 2 | 2 × 2 |
| Inventory | Stacked; Leveling up 1 column, 2 × 2 from `sm` | same | Inventory 8 + Leveling up 4 (stacked cards) |
| Character stats | Stacked; avatar ≤ 220 px above the stats; stats side by side with the avatar (160 px) from `sm` | same | Stats 7 (avatar 200 px, 264 px from `xl`, + rows) · dialogue 5; education 7 · languages 5 |
| AFK | 2 columns | 3 columns | one row of 5 |
| Join party | Stacked, no brackets | same | sign-off 5 · rows 7, corner brackets |

Touch targets ≥ 44 px (buttons 48, rows 56). Pixel sizes step at `md` (section headings, stats) and `lg` (the brand), never fluidly; reading text is 12 px at every width. Coarse pointers get no tilt and no hover effects. Safe-area insets pad the strip and the edges. No horizontal scroll from 320 px; content reflows at 200 % zoom.

## Voice
The owner's RPG vocabulary is the UI ("▸ PLAYER 1", Quest journal, Party lead, AFK, progress saved), used only where the owner used it. Our own strings are short, sentence case, no em or en dashes. Where a split owner string is rejoined (a term and its description), the owner's own separator is kept verbatim; where we write a separator, it is a colon (Term: value) or, in lists, a middle dot. Rules: `portfolio-content`.

## Known Gaps
1. **Schema limits.** The format has no groups for motion, breakpoints, z-index, borders, opacity or 3D, and `export` drops `fontVariation` and `fontFeature`. Those values live in the tables above and are mapped by hand into the theme file; code review checks them against this file.
2. **Dark variants.** Every colour-bearing component has a Deck variant formed by adding `-dark` to each colour reference. Only the entries covering each `-dark` token are written out (lint: no orphans), to keep the file readable.
3. **Lint coverage.** The linter checks contrast only where a component has both colours, and it doesn't composite alpha. Graphic-only entries (`xp-*`, `state-bar`, `switch-thumb*`, `timeline-*`, `scene-*`, `panel-edge`, `focus-ring`, `link`) are covered by the Colors table.
4. **Mobile hero order.** Only the aria-hidden canvas leads; the controls and log follow the intro in both DOM and visual order, so focus order matches what's seen. The preview put the console above the intro; the owner may choose that instead (plan D3), at the cost of a focus-order jump.
5. **Starting values.** Bloom settings and the quest-hologram sizes are starting points; tune them at the checkpoint without changing the tokens.
6. **Waiting for the owner:** the `[copy: to draft & approve]` slots (see `docs/plan/v2/contrib-design.md` §5).
7. **Length:** about 495 lines, past the 300-line target. The front matter alone is about 195 lines (38 colours, 76 component entries), and the brief requires both themes, the 3D spec and the motion table.
8. **Glyph coverage.** "→" appears in the owner's strings (Five-Minute Window). Both subsets include U+2192; the pixel subset adds U+25B2, U+25B8 and U+25BC for the game glyphs. The engineers' font check verifies it.
9. **One pixel weight.** Galmuri11 Bold and Galmuri14 fail Vietnamese, so there is no bold pixel face; `font-synthesis: none` forbids a faux one.
10. **Crispness at other root sizes.** Pixel sizes are rem, so a visitor who raises the browser's default font size gets larger, possibly softer pixel type. Honouring their setting beats crispness.
11. **Body size.** The owner allowed body one step up; it stays 12 px (Reading on the grid). 24 px paragraphs would need wider panels to reach 45 characters per line, a layout change for the owner.
12. **Résumé tokens.** `print-*` have no component entries (the linter doesn't require them); only the résumé components use them.
13. **Card row reflow.** Below `md` the quest cards scroll sideways (owner, 2026-09-28). Each card is narrower than the viewport, so no single card needs two-way scrolling (1.4.10); the page never scrolls sideways.

## Changelog
| Date | Change | Why |
|---|---|---|
| 2026-09-28 | Created from B · Holo Deck (directions-v2 §3, §5, §12; the preview's B tab). | The owner selected B on 2026-09-28. |
| 2026-09-28 | Phase F design check (`docs/reviews/v2/final/design-check.md`): `stat-value` drops `'tnum' 1`; square focus ring accepted; Deck canvas feather (8 %) specified; speaker tag in `nav` type, names never uppercase; level-up once per page load; power-on is a sliding cover with a `holo` leading edge; the Mission log line range; House rules lead run in, with a `text-decoration` underline; Lab base material and cone; quest hologram Bloom and rim; `avatar-xl`; training marker inline; mobile hero controls full width; AFK icon rise; Join party brackets and stretched sign-off; neutral voice wording; separator rule. | Rulings 1 to 8 and changes V1 to V10 of the check: font capability, build constraints the spec hadn't foreseen, and making the lower page as alive and finished as the hero. |
| 2026-09-28 | Differences from the preview and §5: (1) Run keeps its holo fill (preview), limited to the hologram's own control; (2) glass raised from 70–86 % to 92 %; (3) control borders use `text-muted`; (4) the skipped step uses `text-muted` plus a line-through, not 60 % opacity; (5) slots lose the 1 px lift; (6) the Lab host uses `accent-ink` / `accent`, not the preview-only `#9A6E00` / `#B8860B`; (7) the HUD strip gains the nav and a motion toggle, with the readout disclosed by width; (8) icons are `feather` and `wall` (Tabler has no shuttlecock or brick); (9) on mobile the console follows the intro; (10) ▸ ▼ ▲ render as Tabler filled icons. | (1) The preview is the look of record; the lock keeps gold the only action colour elsewhere. (2)–(4) Contrast: at 86 %, muted text over the cone measured 4.34:1; faint borders and faded text failed 3:1 and 4.5:1. (5) Slots aren't interactive, and the ban on hover lift applies. (6) Token-only colours. (7) The preview had no nav; 2.2.2 needs a pause control for the looping hologram. (8) The icon library has none. (9) The focus order matches the visual order (QA Review Focus 5; engineering R5). (10) Neither font has the glyphs. |
| 2026-09-28 | Font A · Cartridge: Portfolio Pixel (Galmuri11 2.403 subset, renamed) replaces Chakra Petch on every game role, at 400 only, on a 12 px grid with stepped sizes, even whole-pixel line heights and 1 px tracking at 12 px; `stat-value` regains `tnum`; the brand's soft Deck glow becomes a hard one-font-pixel sprite shadow (`shadow-pixel`, both themes); ▸ ▼ ▲ become pixel glyphs; ghost border 1.5 → 1 px; the stat readout stacks below `xs`. Fix-round rulings: the power-on edge shows only while moving; Join party brackets from `lg`; the favicon is the pixel "T" at 2× (`favicon`). | The owner chose A (`docs/design/font-options.md`); main-session rulings on the 12 px grid and the rename. Fractional sizes, tracking or borders blur pixel type. Rulings answer `docs/reports/v2-fix-1.md` (V4 edge, V7 deviation 3, F7 deviation 4). |
| 2026-09-28 | All text pixel: `name`, `body` and the new `body-compact` move to Portfolio Pixel on the 12 px grid (name 24 / 40 px; body 12 / 24 px; compact 12 / 20 px); `body-strong`, `body-sm`, `slot` and `caption` leave the site (`rule-lead` uses `body`, `inventory-slot` uses `nav`, the rest `body-compact`); their Sans values move to `print-*` for the résumé; `measure` 56ch and `measure-hero` 50ch; a hierarchy table, emphasis by colour, square bullets, 1 px link underline. Portfolio Sans is no longer loaded by the site. | Owner, 2026-09-28: every word on the site in the pixel font, the résumé PDF plain. Galmuri14 fails Vietnamese (40/134), so Galmuri11 sets body; 12 px keeps 39 to 68 characters per line. |
| 2026-09-28 | Quest cards: the Quest journal becomes a tabbed card row plus one detail panel. Adds `quest-card` (and `-hover`, `-selected`, `-active`, `quest-card-aura`), `success-wash`, spacing `quest-card` 312 px and duration `swap` 320 ms; removes `mission-item`, the sticky aside, the per-file bands and duration `flip`. CyberRock carries a permanent Active aura, distinct from the gold selection edge and "▸" cursor; the panel swaps with a sub-400 ms scan cover (instant when reduced); "Quest unlocked" fires only on the visitor's selections; WAI-ARIA tabs with automatic activation, deep links, and a `noscript` stacked fallback; a scroll-snap row below `md`. | Owner, 2026-09-28: the three projects as game cards, CyberRock highlighted, picked "Card row + detail panel". Overrides plan v2's "files all visible, no hidden tabs" ruling. |
