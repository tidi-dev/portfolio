---
name: design-system
description: Use when an approved visual direction must be codified, when DESIGN.md needs a new or changed token or component, when other agents raise design questions, or when built screens need a design critique at a checkpoint.
---

# Design System

## Purpose
Codify the approved direction into `DESIGN.md`, the single contract for how the site looks, moves and responds, and keep the build faithful to it.

## When to Use
- **Create:** right after the owner selects a direction, before the plan is finalised.
- **Extend:** a phase needs a token or component that `DESIGN.md` lacks.
- **Critique:** at design checkpoints (the first visual phase, and before release).

## Inputs
- `docs/design/directions.md` (the selected direction and its modifications)
- `info.md` (content inventory)
- [references/design-md-template.md](references/design-md-template.md)
- For critique: the screenshot matrix from `qa-reviewer` (`docs/reviews/<phase>/screens/`)

## Responsibilities
- Author and maintain `DESIGN.md`, answer design questions, critique at checkpoints.
- Not in scope: implementing components, or objective accessibility and performance audits (those belong to `qa-reviewer`).

## Workflow

### Create or extend
1. Start from the template. Keep the canonical section order.
2. **Tokens** (front matter):
   - colour roles for light, and for dark with the `-dark` suffix
   - the type scale
   - spacing
   - radii (one shape system)
   - components referencing tokens, with states as separate entries (`button-primary-hover`)
3. **Prose sections:**
   - Overview: Design Read, dials, concept, signature moment, consistency locks
   - Colors: roles and a contrast table
   - Typography: families with licence and source, hierarchy from mobile to desktop, principles
   - Layout: grid, containers, section rhythm, z-index layers
   - Elevation & Depth
   - Shapes: radius, icon family and stroke, image ratios
   - Components: only the ones the site uses, each with states, responsive behaviour and accessibility notes
   - Do's and Don'ts: project-specific, plus the applicable bans from `design-direction/references/generic-patterns.md`
   - Motion: budget, tokens, a per-animation table
   - Responsive Behavior: breakpoints, per-section collapse, touch targets, images
   - Voice, Known Gaps, Changelog
4. **State the consistency locks explicitly:** one theme strategy, one accent, one radius system, one icon family, one type pairing.
5. **Validate:**
   - `npx @google/design.md lint DESIGN.md`: 0 errors. Resolve every warning; an unavoidable one gets a note in Known Gaps.
   - Contrast of every text/background pair in both themes (≥ 4.5:1 text, ≥ 3:1 large text, UI and focus), recorded in the Colors table.
   - Body measure 45–75 characters, and a coherent type-scale ratio.
6. **Changelog:** add an entry with date, what changed and why. Tokens reach code only through `npx @google/design.md export --format css-tailwind DESIGN.md`, never by copying by hand.

### Critique (checkpoints)
1. Review the screenshot matrix (widths × themes) against the selected direction and `DESIGN.md`.
2. Judge:
   - hierarchy and scanning order
   - spacing rhythm and typographic polish
   - whether the signature moment lands
   - restraint (remove one accessory)
   - drift toward generic patterns
3. Record each finding as: `screen@width/theme — issue — DESIGN.md reference — suggested change — severity` (Critical / Important / Minor). Save to `docs/reviews/<phase>-design-critique.md`.
4. If a fix changes the system, update `DESIGN.md` first, then hand the finding off through the main session.

## Rules
- `DESIGN.md` is the only design source. Code introduces no colour, size, radius, shadow, duration or easing that is not a token.
- Document only the components the site uses (YAGNI). Target 300 lines or fewer.
- Every typeface and colour carries a one-line reason tied to the direction.
- A material change to the approved look needs the owner's approval, routed through the main session.
- Fonts must be licensed for the web and self-hostable. Icons come from one library.
- The critique judges design quality. Accessibility, performance and code are `qa-reviewer`'s domain; point there instead of duplicating.

## Expected Output
- `DESIGN.md` at the repo root, linted, with the contrast table and changelog.
- Critique notes in `docs/reviews/`.

## Verification / Definition of Done
- Lint shows 0 errors, and every warning is resolved or justified.
- All token pairs meet AA in both themes, and the table shows the ratios.
- Every component in the plan's inventory exists with states and responsive behaviour.
- No TBD or placeholder values remain.
- The changelog entry is added.
