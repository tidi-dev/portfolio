---
name: design-direction
description: Use when the portfolio's visual direction is undecided or being reconsidered, when studying reference portfolios for design patterns, or when the owner asks for design options, a moodboard, or a new look.
---

# Design Direction

## Purpose
Turn the owner's goals, audience and real content into 2–3 distinct, subject-grounded visual directions, with a clear recommendation, so the owner can choose one before any design system or code exists.

## When to Use
- After `info.md` confirms who the site is for (role, goals, audience, content inventory, likes and dislikes).
- When the owner wants a substantially different look.

## Inputs
- `info.md`
- Reference URLs from the owner, and `docs/research/portfolio-references.md` if it is current
- [references/generic-patterns.md](references/generic-patterns.md)
- `CLAUDE.md` design principles

## Responsibilities
- Reference study (patterns only), the Design Read, 2–3 directions, a genericness review and a recommendation.
- Not in scope: writing `DESIGN.md` (that is `design-system`), writing code, or choosing on the owner's behalf.

## Workflow
1. **Reference study.** The main session runs this step because it has browser access; `design-lead` may refresh it later from text and HTML. For each reference, record:
   - layout and information architecture
   - type, colour, motion and interactions
   - what works, what to avoid
   - its implied dials
   Patterns only: no names, facts, copy or images. Save to `docs/research/portfolio-references.md`.
2. **Design Read** (one line): "Reading this as: ⟨portfolio kind⟩ for ⟨primary audience⟩, with a ⟨vibe⟩ language, leaning toward ⟨aesthetic family⟩." Mark anything inferred rather than stated in `info.md`.
3. **Ground in the subject.** List 3–5 things characteristic of the owner's actual work, taken from `info.md`, that could drive the hero and the visual vocabulary.
4. **Draft 2–3 directions** that differ on at least two axes (layout family, typography, colour temperature, motion). Each direction states:
   - Name and a one-sentence concept
   - Design Read, plus dials VARIANCE / MOTION / DENSITY (1–10) with a reason for each
   - Palette: 4–6 named hex values with roles, for light and dark
   - Typefaces and their roles, with licence and source (self-hostable)
   - Home page ASCII wireframes at desktop and mobile, with alignment rules
   - Hero treatment, and the **signature moment** (the one bold thing)
   - Motion budget: what moves, and what each motion communicates
   - Content it needs (for example project screenshots) and whether `info.md` has it
   - Risks and trade-offs
5. **Genericness review.** Check each direction against `generic-patterns.md` and ask "would a similar prompt land here?" Revise, and note what changed and why.
6. **Contrast sanity check.** Text on background ≥ 4.5:1, large text and UI ≥ 3:1, in both themes.
7. **Recommend** one direction in a single paragraph tied to the audience and the available content.
8. **Present** (main session): a comparison table plus the wireframes, and optionally a visual preview page. Wait for the owner's choice. Record "Selected: ⟨name⟩ + modifications, ⟨date⟩" in `docs/design/directions.md`.

## Rules
- References supply patterns, never content, names, images or copy.
- No choice by familiarity: every typeface and colour has a reason tied to the owner or the audience.
- Bans in `generic-patterns.md` apply unless the owner explicitly asks for one.
- A direction must work with the content that exists. Don't design a screenshot grid for an owner without screenshots.
- The quality floor holds in every direction: AA contrast, visible focus, reduced motion, mobile first.
- No code and no dependency installs.

## Expected Output
- `docs/research/portfolio-references.md`: a patterns table and takeaways.
- `docs/design/directions.md`: the Design Read, 2–3 directions in the format above, a comparison table, the recommendation, and after the gate, the selection record.

## Verification / Definition of Done
- Every field in step 4 is filled for each direction, and the wireframes cover desktop and mobile.
- Directions differ on two or more axes, and none trips a ban without a stated reason.
- Palette pairs pass contrast in both themes.
- The owner explicitly selected a direction, and it is recorded with the date.
