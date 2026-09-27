---
name: ui-audit
description: Use when a page, section or component of the portfolio has been built or changed and needs a visual, responsive, accessibility, interaction or motion check, before a design checkpoint, or as part of the release audit.
---

# UI Audit

## Purpose
Independently verify, with evidence, that the running site matches `DESIGN.md` and meets the accessibility, responsive and interaction bar.

## When to Use
- After every implementation phase, together with `code-review`.
- Before a design checkpoint (the matrix feeds `design-lead`'s critique).
- As part of the release audit.

## Inputs
- The phase brief and its acceptance criteria
- `DESIGN.md`
- The production build served locally (see `CLAUDE.md` → Testing & Verification)
- The list of changed files
- [references/web-interface-checklist.md](references/web-interface-checklist.md)

## Responsibilities
- Capture evidence, run the checks, report findings with severity and a verdict.
- Not in scope: fixing code, or judging taste beyond `DESIGN.md` conformance (subjective critique belongs to `design-lead`).

## Workflow
1. **Build for production and serve locally.** Never audit the dev server.
2. **Screenshot matrix** (Playwright, full page): widths 320, 375, 768, 1024, 1440 and 1920, in light and dark. Add reduced-motion captures for animated sections. Save to `docs/reviews/<phase>/screens/`.
3. **Responsive:**
   - no horizontal overflow at any width; no clipped or overlapping text
   - each section collapses as `DESIGN.md` specifies
   - touch targets ≥ 44px; navigation works at every width
   - long titles and missing optional fields degrade cleanly
4. **Design conformance:**
   - no raw hex, px or ms values outside the tokens: `grep` the changed files
   - type scale, spacing rhythm, and the theme, accent and radius locks are respected
   - hover and focus states exist and increase contrast
   - mechanical generic-pattern checks on the rendered text:
     - em and en dashes
     - eyebrow count
     - numbered section labels
     - duplicate labels for one intent
     - decorative dots
     - scroll cues
5. **Accessibility:**
   - axe (`@axe-core/playwright`) on every page in both themes, with 0 violations
   - **keyboard:** the skip link comes first; tab order is logical; focus is visible on every control and never hidden by sticky elements; no traps; menus close on Escape
   - **structure:** heading outline, landmarks, and accessible names from an accessibility-tree snapshot; alt text says what the image shows
   - **resilience:** contrast in both themes; 200% zoom and 320px reflow; reduced motion honoured
6. **Interaction and motion:**
   - every animation matches the DESIGN.md motion table and its stated purpose
   - transform and opacity only; no `transition: all`; interruptible
   - no layout shift while animating; the theme loads with no flash
   - console errors and hydration warnings are findings
7. **Checklist:** apply `web-interface-checklist.md` to the changed files and report `file:line` findings.
8. **Write the report.**

## Rules
- Every finding carries evidence: a screenshot path, selector, `file:line` or tool output.
- **Severity:**
  - Critical: broken, inaccessible, or wrong or untrue content
  - Important: a `DESIGN.md` deviation, a non-blocking accessibility gap, a responsive defect
  - Minor: polish
- Don't trust the implementer's report; check for yourself. Don't soften findings.
- Read-only on source files. Write only under `docs/reviews/`.
- Stop the servers you start by their PID only. Never `pkill`, `killall` or pattern-kill.

## Expected Output
`docs/reviews/<phase>-ui-audit.md` containing:
- **Verdict:** PASS | PASS WITH MINOR | FAIL (any Critical or Important finding means FAIL)
- findings grouped by severity, each with its evidence
- the checks run, and any that were skipped, with the reason

## Verification / Definition of Done
- The full matrix is captured.
- axe ran on every page in both themes, and the keyboard pass is done.
- The checklist was applied to every changed file.
- A verdict is stated, and every finding is actionable (location plus fix direction).
