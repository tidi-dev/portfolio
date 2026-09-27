---
name: verification
description: Use when about to claim that a task, fix, phase or release is done, working or passing, before handing work to a reviewer or the owner, and whenever a check fails, a build breaks, or behavior is unexpected.
---

# Verification

## Purpose
No completion claim without fresh evidence, and no fix without a root cause.

## When to Use
- Before every "done", "fixed" or "passes" statement, including agent reports and the main session's progress updates.
- Whenever something fails or behaves unexpectedly.

## Inputs
- The claim being made
- The standard commands in `CLAUDE.md` → Testing & Verification
- The task's acceptance criteria

## Responsibilities
- Run the gate, read the output, and state only what it shows.
- When the gate fails, find the root cause before changing code.

## Workflow

### Gate
1. **Identify** the commands that prove the claim: the standard set, plus any task-specific check (a screenshot, a Lighthouse run, a content verification).
2. **Run** them fresh and in full. Not a subset, and not an earlier run.
3. **Read** the output: exit codes, failure and warning counts, skipped tests.
4. **Claim** only what the output shows, and quote the evidence (`command → result line`). Map each acceptance criterion to its evidence.

### When something fails
1. Read the whole error and stack trace, then reproduce the failure reliably.
2. Find the root cause:
   - what changed (the diff)
   - where the bad value comes from (trace it back)
   - how a working equivalent differs
3. Test one hypothesis at a time, with the smallest change that tests it.
4. Fix the cause. Add a regression check that fails without the fix, then re-run the full gate.
5. **After three failed fixes, stop.** The approach is wrong. Report to the main session what you tried and what you learned.

## Rules
- "Should work", "looks fine" and "probably" are not evidence. Neither is an agent's report: the main session checks the diff and re-runs the gate before marking a phase complete.
- Never skip, delete, weaken or `.skip` a test, and never disable a lint rule or relax a budget to get green. Escalate instead.
- Warnings in test or build output are findings, not noise.
- Report the real state, even when it is "partially done" or "blocked".

## Expected Output
An **Evidence** block in the report or message:
- each command and its result line
- the acceptance criteria, each marked ✅ with its evidence or ❌ with the gap
- for failures: the root cause, the fix, and the regression check

## Verification / Definition of Done
- Every claim in the message is backed by output produced in this session.
- The gate is fully green, or the message clearly states what is failing and why.
