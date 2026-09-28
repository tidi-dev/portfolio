# CLAUDE.md

Operating guide for Claude on this repository.
- **Procedures:** `.claude/skills/`
- **Specialist workers:** `.claude/agents/`
- **Why each decision was made:** `docs/reference-analysis.md`
- **Current state:** `docs/progress.md`

# Project Overview
A personal developer portfolio for the owner described in `info.md`: a clean, modern, eye-catching site in an RPG game style, alive with animation and 3D, showing who they are, what they have built, and how to reach them.
- **Status (2026-09-28):** the owner rejected the first build ("too ugly and boring, not trendy, not eye-catching, no 3D animations"). All code was removed; its history remains in git.
- **Next:** new design directions, the owner's choice, a new `DESIGN.md` and plan, then the build.
- **No application code** until the new plan is approved.

# Project Goals
1. **Truthful:** every personal fact comes from `info.md`.
2. **Eye-catching:** clean, modern and developer-styled, following an RPG game style, lively with rich animation and 3D.
3. **Accessible:** WCAG 2.2 AA in both themes, with a reduced-motion experience that still tells the whole story.
4. **Maintainable:** content is updated in one place.

**Out of scope** (owner, 2026-09-28): performance budgets, Lighthouse, SEO and the privacy scan. Don't add tooling, tests or audits for them.

# Source of Truth
Precedence, highest first:
1. `info.md` (who)
2. `CLAUDE.md` (how we work)
3. `DESIGN.md` (how it looks, once approved)
4. skills
5. agents
6. `ui-ref.md` / `skill-ref.md`
7. external portfolios

Follow the higher source. If a lower one seems better, raise it with the owner; never deviate silently.

## info.md
Verified personal information and portfolio content: only what the owner explicitly provided or confirmed. Pending items go under "Open questions", declined ones under "Not included". Only the main session edits it, after the owner confirms. Template: `.claude/skills/portfolio-content/references/info-md-template.md`.

## ui-ref.md
UI/UX references (Taste Skill, awesome-design-md, Anthropic frontend-design). Already synthesised into the skills and this file; reopen only to revisit a decision.

## skill-ref.md
Agent/skill/workflow references (Vercel agent-skills, Superpowers). Already synthesised into the skills, agents and workflow here.

External portfolios (e.g. https://tiendinh.dev/) are pattern inspiration only, never a source of facts, copy, images or code.

# Design Principles
- **Ground it in the owner.** Their real work, their RPG and quest voice ("Player 1", quests, XP, inventory, AFK) and their audience drive every choice.
- **RPG game world, clean execution.** Game style (HUD, quest log, character sheet, inventory, level-ups) rendered with modern, developer-grade polish: crisp type, disciplined spacing, never cluttered or kitsch.
- **Alive by default.** Animation and 3D are core to the experience, not garnish. Every section has motion; the hero has a 3D scene.
- **Readable first.** Motion and 3D never block reading, scanning or reaching contact. Content is real HTML over or beside the 3D.
- **Decide deliberately.** Each typeface, colour and motion choice has a reason recorded in `DESIGN.md`. `generic-patterns.md` still applies, except where it conflicts with the owner's requested RPG and 3D style.
- **Consistency locks:** one theme strategy, accent system, radius system, icon family, type pairing, and label per intent.
- **DESIGN.md is the contract** once approved.

# Engineering Principles
- Plan before code. Make the smallest change that meets the task (YAGNI).
- Evidence before claims, and root cause before fixes (`verification`).
- Small files with one responsibility, organised by feature. Static and server-first; JavaScript only for real interactivity.
- Verify each dependency (existence, version, licence) with `npm view`, and justify it in the plan.
- Never weaken tests or lint rules to get green.

# Architecture Guidelines
The new plan confirms the stack. Default proposal:
- **Stack:** Next.js App Router, TypeScript strict, Tailwind CSS v4, pnpm.
- **3D and motion:** React Three Fiber (Three.js) for 3D scenes, and Motion and/or GSAP for UI and scroll animation, with versions verified in the plan.
- **Content:** typed modules derived from `info.md` (`src/content/`). Components never hardcode personal facts.
- **Tokens:** from `DESIGN.md`. No literal design values elsewhere.
- **Client islands:** 3D scenes and animated components are client islands, loaded dynamically. The page stays usable before they load.
- **Hosting:** decided later by the owner. No CMS, database or backend unless the plan justifies it.

# Frontend Guidelines
- Semantic HTML first, and ARIA only to fill gaps.
- Composition over boolean props; heavy client code (3D, animation libraries) dynamically imported.
- **Images:** explicit dimensions. **Fonts:** self-hosted, at most 2 families, with Vietnamese support ("Hồ Trọng Đại").
- **Icons:** one library, chosen in `DESIGN.md`.
- **3D canvases:** decorative ones are `aria-hidden`; any information they carry also exists as text.
- Build rules in full: `frontend-build`. Audit checklist: `ui-audit/references/web-interface-checklist.md`.

# Responsive Design Guidelines
- Mobile-first. `DESIGN.md` defines the breakpoints and how each multi-column section collapses.
- 320 px to 1920 px+ with no horizontal scroll and no clipped or overlapping text.
- Fluid type and spacing from the `DESIGN.md` scale (`clamp()`); body text 45–75 characters per line.
- Use `min-h-dvh` (never `h-screen`) and grid for two-dimensional layout. No JavaScript layout measurement.
- Touch targets ≥ 44×44 px; safe-area insets respected; hover never hides essential content.
- Verify at 320, 375, 768, 1024, 1440 and 1920 px, in light and dark.

# Accessibility Requirements
- WCAG 2.2 AA in both themes.
- **Structure:** landmarks, one `h1`, ordered headings, skip link, descriptive links, `lang`.
- **Keyboard:** everything operable in logical order; visible `:focus-visible`; no traps; sticky elements never cover focus.
- **Contrast:** text ≥ 4.5:1 (large ≥ 3:1); UI and focus indicators ≥ 3:1.
- **Alternatives:** meaningful `alt`; icon-only buttons labelled.
- **Zoom:** never disabled; content reflows at 200% and at 320 px.
- **Motion:** `prefers-reduced-motion` honoured everywhere.
- **Verified by:** axe with 0 violations, a keyboard pass, and an accessibility-tree check.

# Motion Guidelines
- **Rich motion is wanted:** 3D scenes, scroll-driven reveals, game-like transitions (level-up, quest unlocked), hover and cursor reactions, animated HUD elements. `DESIGN.md` defines the motion system and its tokens.
- **Purpose still matters:** motion guides attention, rewards interaction or tells the RPG story. Avoid random noise.
- **Technique:**
  - DOM movement prefers `transform` and `opacity`; never `transition: all`
  - animations are interruptible
  - no scroll-event listeners (use IntersectionObserver, CSS scroll-driven animation, or the library's scroll hooks)
  - clean up effects and render loops
- **Safety:** nothing flashes more than 3 times a second (WCAG 2.3.1). Autoplaying motion longer than 5 s has a pause control or honours reduced motion.
- **Reduced motion:** every animation and 3D scene has a calm variant (static or opacity-only), and the content stays complete.

# Content Rules
- `info.md` is the only source of personal information. Never invent, embellish or estimate facts, numbers, dates, titles, employers, testimonials or availability.
- If something is missing, ask (main session) or omit it. Placeholders and "TBD" never ship.
- New wording about the owner needs the owner's approval. Approved copy is stored in `info.md`.
- **Voice:** first person, sentence case, active voice, no filler, one label per intent, no em or en dashes in UI copy we write.
- **Images:** only owner-provided assets with usage rights; nothing stock or generated presented as the owner's work or likeness.

# Available Project Skills
| Skill | Use it to |
|---|---|
| `portfolio-content` | Interview, maintain `info.md`, approve copy, map and verify content |
| `design-direction` | Study references, propose 2–3 directions, get a choice |
| `design-system` | Write and maintain `DESIGN.md`; critique built screens |
| `implementation-plan` | Assemble the phased plan from agent contributions |
| `frontend-build` | Implement a phase, component or fix |
| `ui-audit` | Visual, responsive, accessibility, interaction and motion review |
| `code-review` | Two-verdict review (spec compliance, quality) |
| `verification` | Evidence gate before claims; root-cause debugging |

# Available Project Agents
| Agent | Owns | Preloaded skills |
|---|---|---|
| `design-lead` | Look, feel, motion, `DESIGN.md`, critiques | design-direction, design-system, portfolio-content |
| `frontend-engineer` | Architecture, all code, tests, fixes | frontend-build, verification |
| `qa-reviewer` | Independent reviews and audits | code-review, ui-audit, verification |

The **main session** orchestrates. There is no orchestrator, content or architecture agent.

# Agent Responsibilities
- **Main session:** the only one who talks to the owner. Runs research (it has the browser) and the interview, edits `info.md`, writes briefs, assembles the plan, makes rulings, keeps `docs/progress.md`.
- **design-lead:** directions, `DESIGN.md`, copy options, checkpoint critiques. Never edits app code or `info.md`.
- **frontend-engineer:** the plan's engineering section, all code, tests and config, content files, fixes. Never edits `info.md` or `DESIGN.md`.
- **qa-reviewer:** the plan's verification section, phase reviews, audits, content verification. Read-only on code; writes only `docs/reviews/`.

# Agent Collaboration Workflow
| # | Phase | Lead | Receives | Produces | Gate |
|---|---|---|---|---|---|
| 1 | Research | main | reference URLs | `docs/research/portfolio-references.md` | none |
| 2 | Discovery | main | owner's answers | `info.md` | Owner confirms |
| 3 | Directions | design-lead | `info.md`, research | `docs/design/directions.md` | **Owner selects** |
| 4 | Design system | design-lead | selected direction | `DESIGN.md`, linted | Reviewed with plan |
| 5 | Plan | main + all agents | `info.md`, `DESIGN.md` | `docs/plan/implementation-plan.md` | **Owner approves** |
| 6 | Build, per phase | frontend-engineer | phase brief | code + report | Gate green |
| 7 | Review, per phase | qa-reviewer | report, diff, build | `docs/reviews/<phase>-*.md` | PASS |
| 8 | Checkpoint | design-lead | screenshot matrix | critique, `DESIGN.md` updates | Owner, if look changes |
| 9 | Release audit | qa-reviewer | whole site | UI, accessibility, content reports | PASS |
| 10 | Final verification | main | all reports | final report | **Owner approves production** |

The checkpoint (row 8) runs after the first visual phase and again before release.

**Handoff rules**
- Only the main session dispatches agents. Agents never call each other or spawn subagents.
- Briefs contain the task, acceptance criteria, input paths and output path, never session history. Agents hand back files.
- **Fix loop:** QA findings go to `frontend-engineer`, then QA re-checks only those. After at most 2 rounds, the main session rules or asks the owner.
- **Moving on:** a phase advances only when the gate is green, QA returns PASS or PASS WITH MINOR (minors logged), and any checkpoint is signed off.
- **Owner approval** is needed for:
  - `info.md` facts and new copy about the owner
  - the direction and the plan
  - material design or scope changes
  - paid services, domains, production deploys
  - anything irreversible
- Everything else: the main session rules and logs `Ruling: what — why — cost if wrong` in `docs/progress.md`.

# Development Workflow
1. Mark the next approved-plan phase as in progress in `docs/progress.md`.
2. Brief `frontend-engineer`. On its report, check the diff and re-run the gate yourself.
3. Brief `qa-reviewer`. On FAIL, run the fix loop. Run the checkpoint when the phase is one.
4. Mark the phase complete with evidence links, and log rulings.

**Git** is initialised in the plan's first phase. Small commits with conventional messages. No push to shared branches or production deploy without the owner's approval.

# Testing & Verification
The new plan defines the tooling and commands; list them here once it's approved.
- **Gate:** lint, typecheck, build, plus a lean test suite covering key flows and accessibility (axe in both themes, keyboard, reduced motion).
- **Visual QA:** screenshots at key widths in both themes, including the 3D and animated states (`ui-audit`).
- **Content:** every visible fact verified against `info.md` before release (`portfolio-content` D).
- **Out of scope:** performance budgets, Lighthouse, SEO checks, privacy scan.

Agents stop only the processes they started, by PID. Never kill by name or pattern (`pkill`, `killall`).

# Definition of Done
A task or phase is done only when:
- every acceptance criterion has evidence
- the full gate passes, run fresh
- `qa-reviewer` returns PASS (or PASS WITH MINOR, minors logged)
- there are no token violations, unsourced content or placeholders
- the checkpoint is signed off, if the phase is one
- `docs/progress.md` is updated

A release also needs clean content verification, the reduced-motion experience checked, and the owner's approval.

# Important Constraints
- No application code, scaffolding or installs before the owner approves the plan.
- Never invent personal information or copy anything personal from reference portfolios.
- Subagents cannot reach the owner; questions go through the main session.
- One implementer at a time. No nested agents.
- Keep the system small. Add a skill or agent only for a proven, repeated need, and update this file when the workflow changes.
