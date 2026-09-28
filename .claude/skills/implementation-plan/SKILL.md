---
name: implementation-plan
description: Use when the design direction is approved and the build needs a phased plan, when scope changes and the plan must be revised, or when a new feature is large enough to need phases and agent assignments.
---

# Implementation Plan

## Purpose
Produce a phased plan that the project agents can execute and verify. It is assembled from each agent's own contribution, never written alone and retrofitted.

## When to Use
- Prerequisites are met: the owner has confirmed `info.md` is sufficient, a direction is selected, and `DESIGN.md` is drafted and linted.
- Scope changes that invalidate phases, or a large new feature.

## Inputs
`info.md`, `docs/design/directions.md`, `DESIGN.md`, `CLAUDE.md`, [references/plan-template.md](references/plan-template.md).

## Responsibilities
- **Main session:** briefs contributors, assembles, self-reviews, presents, and holds the approval gate.
- **design-lead:** writes `docs/plan/contrib-design.md`:
  - page structure and information architecture
  - component inventory (mapped to `DESIGN.md`)
  - responsive, interaction and motion strategy
  - design checkpoints
- **frontend-engineer:** writes `docs/plan/contrib-engineering.md`:
  - stack with versions verified by `npm view`
  - project structure and file map
  - content model and schema
  - component architecture
  - animation and 3D implementation (libraries, client islands, reduced motion)
  - tooling, CI and deployment
- **qa-reviewer:** writes `docs/plan/contrib-verification.md`:
  - test layers and tools
  - screenshot and axe matrix
  - acceptance criteria per phase
  - audit checkpoints
  - a Review Focus (the five most likely ways a visitor gets a broken experience)

## Workflow
1. **Brief contributors.** They can run in parallel, because each reads only the inputs. Each brief carries the input paths, the section it owns (from Responsibilities), the output path, and "decisions only: no code bodies".
2. **Resolve conflicts** between contributions: the higher source in `CLAUDE.md` wins. Record each ruling as `Ruling: what — why — cost if wrong`.
3. **Assemble** `docs/plan/implementation-plan.md` from the template: header, Global Constraints, file map, phases, Review Focus, risks and open decisions.
4. **Shape the phases:**
   - each phase ends in a verifiable deliverable
   - each is small enough for one review pass
   - UI phases define their checks before the build
   - the first visual phase is a design checkpoint
   - phases run in dependency order
5. **Self-review:**
   - *Coverage:* every item in the template's coverage list maps to a phase.
   - *Consistency:* paths, names and interfaces match across phases.
   - *Step scan:* no "TBD", "handle edge cases" or "add tests" without naming them.
   - *Proportion:* decisions, not transcribed code.
6. **Present** a short summary with the path. WAIT for explicit approval, then record "Approved by owner, ⟨date⟩" at the top. Any later scope change needs re-approval.

## Rules
- Every phase has exactly one responsible agent. Reviewers are listed separately.
- Every phase uses the template's fields; nothing is left implicit.
- Dependencies are verified at planning time (existence, current major version, licence), not recalled from memory.
- No application code, scaffolding or installs before approval.
- The plan cites `DESIGN.md` token and component names and `info.md` sections rather than restating their values.

## Expected Output
`docs/plan/implementation-plan.md`, with the three contribution files kept in `docs/plan/`.

## Verification / Definition of Done
- Every phase has all template fields filled.
- The coverage checklist is complete, and every item names its phase.
- Self-review is done, with issues fixed inline.
- The owner's approval is recorded with the date.
