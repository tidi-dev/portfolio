---
name: code-review
description: Use when an implementation phase or fix is ready for review, before any plan phase is marked complete, or when asked to review a diff or files in the portfolio repository.
---

# Code Review

## Purpose
Give an independent, two-verdict review of a change:
1. Does it do exactly what was asked? (spec compliance)
2. Is it well built? (quality)

## When to Use
- After every implementation phase, together with `ui-audit`.
- After a fix round (scoped to the fixed findings).
- On request.

## Inputs
- The phase brief (tasks and acceptance criteria)
- The implementer's report
- The diff: a git range, or the changed-file list before git exists
- `DESIGN.md`, `CLAUDE.md` and `info.md`

## Responsibilities
- Read the change, verify its claims, and return verdicts and findings.
- Not in scope: editing code, or re-running the implementer's full suite without a specific doubt.

## Workflow
1. **Read the requirements first:** the brief, the acceptance criteria and `CLAUDE.md`'s Global Constraints. Then read the diff. Treat the report as unverified claims.
2. **Verdict 1: spec compliance.**
   - *Missing:* requirements skipped, or claimed but not implemented.
   - *Extra:* features, refactors or dependencies nobody asked for.
   - *Misunderstood:* the right thing built the wrong way.
   Mark each acceptance criterion `met` / `not met` / `can't verify from diff` (and say why).
3. **Verdict 2: quality.**
   - **Architecture:** server-first; client leaves are minimal with small props; composition over boolean props; each file has one responsibility; no dead code.
   - **Types and correctness:** strict types with no `any` or non-null guessing; edge cases handled (empty and missing optional content, long strings).
   - **Design fidelity in code:** tokens only, no magic numbers, z-index from the scale, the one icon library.
   - **Accessibility in markup:** semantic elements, labels, alt text, focus styles, reduced-motion paths.
   - **React/Next rules** from `frontend-build`: barrel files, dynamic imports, effect-synced state, inline components.
   - **Content integrity:** no personal facts hardcoded outside the content layer; approved copy verbatim.
   - **Tests:** they assert behaviour rather than implementation; no snapshot dumps; any warnings in the output are findings.
   - **Security and hygiene:** no secrets; `rel="noopener noreferrer"` on `target="_blank"`; no stray logs; each dependency justified.
4. **Run a focused check** only when reading raises a specific doubt, and name the doubt.
5. **Write the report.**

## Rules
- Every finding uses the form `file:line — issue — why it matters — fix direction`.
- **Severity:**
  - Critical: broken behaviour, untrue content, a security issue
  - Important: a spec deviation, an architecture problem, missing tests for logic, a token violation
  - Minor: style or polish
- Calibrate honestly. Not everything is Critical, and Minor findings don't block.
- The implementer's stated rationale never downgrades a finding; judge the code.
- Read-only on the checkout: never modify the working tree, index or branch. Write only under `docs/reviews/`. Do not spawn subagents.

## Expected Output
`docs/reviews/<phase>-code-review.md` containing:
- **Verdicts:** spec compliance ✅/❌ and quality ✅/❌
- **Strengths** (two or three lines)
- **Findings** grouped by severity
- **Declined to judge:** things considered and set aside, each with a reason
- **Checks run**

## Verification / Definition of Done
- Both verdicts are stated, and every acceptance criterion is marked.
- Every finding has a location and a fix direction.
- A FAIL on either verdict means the phase cannot be marked complete.
