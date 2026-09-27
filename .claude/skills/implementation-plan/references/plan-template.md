# Implementation plan template

```md
# Portfolio Implementation Plan

> Status: Draft | Approved by owner, YYYY-MM-DD
> Inputs: info.md (last confirmed …) · DESIGN.md (changelog …) · docs/design/directions.md (selected …)

**Goal:** one sentence.
**Architecture:** 2–3 sentences.
**Stack:** framework, language, styling, motion, testing, hosting (versions verified YYYY-MM-DD).

## Global Constraints
One line each, copied verbatim from CLAUDE.md, DESIGN.md and info.md: budgets, a11y level, content rules, locks, supported widths. Every phase implicitly includes these.

## File Map
| Path | Responsibility | Created in phase |

## Phases

## Phase N: ⟨name⟩

### Goal
### Responsible Agent
### Skills Used
### Inputs
### Tasks
- [ ] Task: files · interface/decision · check that proves it
### Expected Outputs
### Acceptance Criteria
- Measurable; each names its evidence (command, screenshot, report).
### Dependencies
### Review
qa-reviewer (code-review + ui-audit) · design checkpoint: yes | no

## Review Focus
Five conditions most likely to break the experience that no single phase's tests cover, each assigned to the phase whose tests pin it.

## Risks & Open Decisions
| Item | Owner | Needed by phase |
```

## Coverage checklist (every item maps to a phase)
Project initialization · technical stack · information architecture · data/content architecture · design system (tokens pipeline) · page structure · component architecture · responsive behavior · interactions · motion · accessibility · SEO · performance · testing · visual QA · deployment · final verification.
