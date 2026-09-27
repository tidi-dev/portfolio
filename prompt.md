I want to build a modern personal developer portfolio website.

Use this website as a **reference and source of inspiration only**:

https://tiendinh.dev/

Before doing any implementation, you must inspect and follow the local reference files:

- `ui-ref.md` — frontend/UI/UX design references, patterns, skills, agents, and guidelines
- `skill-ref.md` — available agents, skills, tools, workflows, and implementation guidelines

However, **do not simply copy every agent, skill, rule, or workflow from these files.**

First, analyze them, identify the strongest practices, remove duplication or unnecessary complexity, and use them to build a **project-specific Claude workflow** for this portfolio.

---

# 1. Build the Project Agent & Skill System First

Before researching implementation details or writing application code, deeply inspect:

- `ui-ref.md`
- `skill-ref.md`

Extract and summarize the useful:

- agents
- skills
- workflows
- frontend practices
- UI/UX practices
- accessibility practices
- architecture practices
- testing practices
- review practices
- performance practices
- SEO practices
- code-quality practices
- planning practices

Do not assume everything in the reference files should be used.

Evaluate the recommendations based on this project's actual needs.

---

# 2. Select the Best Practices

After analyzing both files, create a concise comparison of the useful approaches.

For each important area, determine:

1. What `ui-ref.md` recommends
2. What `skill-ref.md` recommends
3. Where they overlap
4. Where they conflict
5. Which approach is stronger for this project
6. Why
7. Whether the ideas should be combined into a better project-specific approach

Prefer:

- simplicity
- clear responsibilities
- minimal overlap
- maintainability
- good frontend engineering
- strong UX
- accessibility
- performance
- reusable workflows
- useful verification

Avoid creating agents or skills merely because they exist in the reference files.

---

# 3. Build Custom Project Skills

Using the best ideas extracted from `ui-ref.md` and `skill-ref.md`, create our own project-specific skills.

These skills should represent reusable engineering procedures rather than vague instructions.

Examples might include:

- portfolio UI design
- responsive implementation
- component architecture
- frontend implementation
- accessibility review
- motion design
- content verification
- performance review
- SEO review
- visual QA
- code review

These are examples only.

Determine the actual skills based on the reference files and project requirements.

Each custom skill should have:

```md
# Skill Name

## Purpose

## When to Use

## Inputs

## Responsibilities

## Workflow

## Rules

## Expected Output

## Verification / Definition of Done
```

Skills should be focused and composable.

Avoid creating multiple skills that perform essentially the same task.

---

# 4. Build Custom Project Agents

After defining the skills, create a small set of specialized project agents.

Each agent should have a clear responsibility.

Possible examples include:

- Design / UX agent
- Frontend implementation agent
- Content agent
- Architecture agent
- QA / review agent

Again, these are examples only.

Determine the appropriate agents after analyzing `ui-ref.md` and `skill-ref.md`.

For each agent define:

```md
# Agent Name

## Role

## Goal

## Responsibilities

## Skills Used

## Inputs

## Outputs

## Constraints

## Definition of Done
```

Agents should use the custom skills created in the previous step.

Avoid:

- agents with overlapping responsibilities
- an agent for every tiny task
- excessive orchestration
- unnecessary multi-agent complexity

Prefer a **small number of strong specialized agents**.

---

# 5. Define Agent Collaboration

Define how the agents work together.

For example:

```text
Research
   ↓
Portfolio / UX Design
   ↓
Architecture
   ↓
Frontend Implementation
   ↓
Visual + Accessibility + Performance Review
   ↓
Fix
   ↓
Final Verification
```

Do not blindly use this example.

Determine the best workflow based on the selected agents.

Explicitly define:

- which agent starts each phase
- what information it receives
- what artifact it produces
- which agent consumes that artifact
- where review occurs
- when implementation can continue
- when human approval is required

Avoid circular or ambiguous agent handoffs.

---

# 6. Create `CLAUDE.md`

After creating the project-specific skills and agents, create:

`CLAUDE.md`

This becomes the primary operating guide for Claude while working on this repository.

`CLAUDE.md` should summarize the final decisions derived from:

- `ui-ref.md`
- `skill-ref.md`
- project requirements

It should **not simply concatenate those files**.

Synthesize them into concise, actionable project instructions.

Include at least:

```md
# Project Overview

# Project Goals

# Source of Truth

## info.md
Verified personal information and portfolio content.

## ui-ref.md
Reference material for UI/UX and frontend practices.

## skill-ref.md
Reference material for agents, skills, tools, and workflows.

# Design Principles

# Engineering Principles

# Architecture Guidelines

# Frontend Guidelines

# Responsive Design Guidelines

# Accessibility Requirements

# Motion Guidelines

# Performance Requirements

# SEO Requirements

# Content Rules

# Available Project Skills

# Available Project Agents

# Agent Responsibilities

# Agent Collaboration Workflow

# Development Workflow

# Testing & Verification

# Definition of Done

# Important Constraints
```

Keep `CLAUDE.md` useful and operational.

Do not make it an enormous dump of reference material.

Claude should be able to read `CLAUDE.md` later and understand how this project should be developed without repeatedly interpreting all of the original references.

---

# 7. Preserve the Source Hierarchy

Use the following hierarchy:

### `info.md`

**Source of truth for who I am.**

Contains only personal information I explicitly provide or confirm.

Never invent missing information.

### `CLAUDE.md`

**Source of truth for how Claude should work on this project.**

Contains the synthesized project workflow, engineering principles, agent responsibilities, and development rules.

### Custom Skills

**Reusable procedures for performing specific types of work correctly.**

### Custom Agents

**Specialized workers that apply the appropriate skills.**

### `ui-ref.md`

**Reference material used to derive frontend/UI/UX best practices.**

### `skill-ref.md`

**Reference material used to derive agent/skill/tool best practices.**

### External portfolios

Including:

https://tiendinh.dev/

These are **research and inspiration only**.

Never use them as sources for my personal information.

---

# 8. Validate the Agent System Before Planning

Before creating the implementation plan, review the generated system.

Check:

- Are any agents redundant?
- Are responsibilities overlapping?
- Are there too many agents?
- Are any skills duplicated?
- Are skills actionable?
- Are agent handoffs clear?
- Are verification steps defined?
- Does the system fit a portfolio project rather than an enterprise application?
- Are we adding complexity without meaningful benefit?

Simplify where necessary.

The goal is **not to build the most sophisticated multi-agent system**.

The goal is to build the **smallest effective agent/skill system that produces a high-quality portfolio**.

---

# 9. Then Create the Implementation Plan

Only after:

1. `ui-ref.md` has been analyzed
2. `skill-ref.md` has been analyzed
3. best practices have been summarized
4. the best practices have been selected
5. custom project skills have been created
6. custom project agents have been created
7. agent collaboration has been defined
8. `CLAUDE.md` has been created
9. `info.md` contains sufficient verified information
10. the portfolio direction has been agreed upon
11. the agent/skill system has been reviewed and simplified

should you create the implementation plan.

**Use the newly created project agents and skills to produce the plan.**

Do not create the plan independently and then retrofit agents onto it.

The agents should actively contribute according to their responsibilities.

For example:

- Design agent → design architecture and UI strategy
- Architecture agent → technical structure and data model
- Frontend agent → component and implementation strategy
- QA agent → testing, accessibility, responsive and performance criteria

Use the actual agents you created rather than assuming these examples.

---

# 10. Plan Requirements

The implementation plan should cover:

- project initialization
- technical stack
- information architecture
- data/content architecture
- design system
- page structure
- component architecture
- responsive behavior
- interactions
- motion
- accessibility
- SEO
- performance
- testing
- visual QA
- deployment
- verification

For every implementation phase define:

```md
## Phase

### Goal

### Responsible Agent

### Skills Used

### Inputs

### Tasks

### Expected Outputs

### Acceptance Criteria

### Dependencies
```

This allows the implementation plan to be executed later by the same project agents.

---

# 11. Required Workflow

Follow this order strictly:

```text
Read ui-ref.md
      +
Read skill-ref.md
      ↓
Extract best practices
      ↓
Compare / deduplicate / evaluate
      ↓
Select best approaches
      ↓
Create project-specific skills
      ↓
Create project-specific agents
      ↓
Define agent collaboration
      ↓
Create CLAUDE.md
      ↓
Validate & simplify agent system
      ↓
Research portfolio references
      ↓
Interview me
      ↓
Create / update info.md
      ↓
Propose portfolio directions
      ↓
I select / approve direction
      ↓
Agents collaborate on implementation plan
      ↓
Present plan
      ↓
WAIT FOR MY APPROVAL
      ↓
Implementation
      ↓
Agent reviews
      ↓
Fixes
      ↓
Final verification
```

**Do not skip directly from reading the reference files to implementation.**

---

# 12. Important Rules

1. Do not blindly copy agents from `skill-ref.md`.
2. Do not blindly copy skills from `ui-ref.md` or `skill-ref.md`.
3. Extract the principles behind them.
4. Compare overlapping approaches.
5. Select the strongest ideas.
6. Build project-specific versions.
7. Prefer fewer, well-defined agents over many weak agents.
8. Prefer composable skills over giant generic skills.
9. Agents should have clearly separated responsibilities.
10. Skills should define repeatable procedures.
11. `CLAUDE.md` should orchestrate the overall development approach.
12. `info.md` remains the only source of truth for my personal information.
13. Never invent personal information.
14. Never copy personal data from portfolio references.
15. Do not implement before the implementation plan is approved.
16. The implementation plan must be produced using the custom agents and skills.
17. Keep the system appropriate for the size of a personal portfolio project.
18. Challenge unnecessary complexity and simplify whenever possible.

---

# Start

Start by reading:

1. `ui-ref.md`
2. `skill-ref.md`

Then:

1. Summarize the strongest practices from each.
2. Compare overlapping or conflicting recommendations.
3. Select the practices most appropriate for this portfolio.
4. Propose the custom project skills.
5. Propose the custom project agents.
6. Explain how those agents collaborate.
7. Create `CLAUDE.md`.
8. Validate and simplify the system.
9. Show me what was created and why.

**Do not create the portfolio implementation plan or write application code yet.**

After this foundation is established, continue with portfolio research, user discovery, `info.md`, design direction selection, and finally use the custom agents and skills to create the implementation plan.
