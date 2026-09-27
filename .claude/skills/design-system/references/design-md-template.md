# DESIGN.md template

Format: Google Stitch DESIGN.md (`version: alpha`), linted with `npx @google/design.md lint DESIGN.md`.

Schema facts:
- **Front-matter keys:** `version`, `name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `components`.
- **Component properties:** `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.
- **Token references:** `"{colors.accent}"`.
- **Dimensions:** `px`, `em` or `rem` only. Fluid `clamp()` ranges go in the Typography prose.
- **Themes:** there is no native dark mode. Dark values use the `-dark` suffix, and dark component variants reference them (`page-dark`, `button-primary-dark`).
- **Orphan warnings:** every colour must be referenced by at least one component, or the linter warns. Every colour needs a job.
- **Section order:** canonical sections come first, in this order. Extra sections come after Do's and Don'ts.

Replace every ⟨…⟩. Delete components the site does not use.

```md
---
version: alpha
name: ⟨Owner⟩ Portfolio
description: ⟨Design Read, one sentence⟩
colors:
  primary: "⟨hex⟩"          # headings / ink (light)
  on-primary: "⟨hex⟩"
  surface: "⟨hex⟩"          # page background
  surface-raised: "⟨hex⟩"   # only if elevation is used
  text: "⟨hex⟩"
  text-muted: "⟨hex⟩"
  border: "⟨hex⟩"
  accent: "⟨hex⟩"           # the single accent
  on-accent: "⟨hex⟩"
  focus: "⟨hex⟩"
  primary-dark: "⟨hex⟩"     # …repeat every role with -dark
typography:
  display:  { fontFamily: ⟨family⟩, fontSize: ⟨rem⟩, fontWeight: ⟨n⟩, lineHeight: ⟨n⟩, letterSpacing: ⟨em⟩ }
  heading:  { fontFamily: ⟨family⟩, fontSize: ⟨rem⟩, fontWeight: ⟨n⟩, lineHeight: ⟨n⟩ }
  body:     { fontFamily: ⟨family⟩, fontSize: 1rem, fontWeight: 400, lineHeight: ⟨n⟩ }
  body-sm:  { fontFamily: ⟨family⟩, fontSize: ⟨rem⟩, fontWeight: 400, lineHeight: ⟨n⟩ }
  label:    { fontFamily: ⟨family⟩, fontSize: ⟨rem⟩, fontWeight: ⟨n⟩, lineHeight: ⟨n⟩ }
  code:     { fontFamily: ⟨mono family⟩, fontSize: ⟨rem⟩, fontWeight: 400, lineHeight: ⟨n⟩ }
rounded:
  ⟨one shape system, e.g. none / sm / full⟩
spacing:
  xs: ⟨px⟩
  sm: ⟨px⟩
  md: ⟨px⟩
  lg: ⟨px⟩
  xl: ⟨px⟩
  section: ⟨px⟩
components:
  page:                { backgroundColor: "{colors.surface}", textColor: "{colors.text}", typography: "{typography.body}" }
  page-dark:           { backgroundColor: "{colors.surface-dark}", textColor: "{colors.text-dark}" }
  heading:             { textColor: "{colors.primary}", typography: "{typography.heading}" }
  link:                { textColor: "{colors.accent}" }
  button-primary:      { backgroundColor: "{colors.accent}", textColor: "{colors.on-accent}", typography: "{typography.label}", rounded: "{rounded.⟨x⟩}", padding: ⟨px⟩, height: 44px }
  button-primary-hover: { backgroundColor: "⟨token⟩" }
  ⟨nav, footer, project-entry, experience-entry, tag, theme-toggle… as needed⟩
---

## Overview
Design Read · dials (VARIANCE / MOTION / DENSITY with reasons) · concept in 2–3 sentences · the signature moment · consistency locks (theme strategy, accent, radius system, icon family, type pairing).

## Colors
| Token | Light | Dark | Role / usage |
|---|---|---|---|

Contrast (AA): | Pair | Light ratio | Dark ratio | Pass |

## Typography
Families: role · source · licence · weights · subsets. Hierarchy: | Token | Mobile → desktop size (clamp) | Line height | Weight | Tracking | Use |. Principles: measure 45–75ch, numerals, emphasis rules.

## Layout
Grid and container widths · section rhythm (spacing tokens per breakpoint) · alignment rules · z-index layers (named scale).

## Elevation & Depth
How depth is expressed (tint, border, shadow values), and where it is not used.

## Shapes
Radius system (the lock) · icon library and stroke width · image aspect ratios.

## Components
Per component: purpose · anatomy · states (default / hover / focus-visible / active / disabled) · responsive behaviour · accessibility notes.

## Do's and Don'ts
Project-specific rules and the applicable bans from generic-patterns.md.

## Motion
Budget (signature moment + feedback + state changes) · tokens (durations, easings) ·
| Element | Trigger | Property | Duration / easing | Communicates | Reduced-motion variant |

## Responsive Behavior
| Breakpoint | Width | Key changes | · per-section collapse table · touch targets ≥ 44px · image behaviour · type scaling.

## Voice
Direction-specific tone notes. Rules live in the portfolio-content skill.

## Known Gaps

## Changelog
| Date | Change | Why |
```
