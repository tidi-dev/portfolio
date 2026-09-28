# CLAUDE.md

Operating guide for Claude on this repository.
- **Procedures:** `.claude/skills/`
- **Specialist workers:** `.claude/agents/`
- **Why each decision was made:** `docs/reference-analysis.md`
- **Current state:** `docs/progress.md`

# Project Overview
A personal developer portfolio for the owner described in `info.md`: a fast, accessible, distinctive static site showing who they are, what they have built, and how to reach them.
- **Status:** the foundation (skills, agents, this file) is done.
- **Next:** research, discovery interview, `info.md`, directions, plan.
- **No application code** until the plan is approved.

# Project Goals
1. **Truthful:** every personal fact comes from `info.md`.
2. **Distinctive:** it reads as designed for this person, not templated.
3. **Accessible:** WCAG 2.2 AA in both themes.
4. **Fast:** Lighthouse mobile ≥ 95 performance, 100 for accessibility, best practices and SEO; Core Web Vitals "good".
5. **Findable:** complete metadata, social previews, structured data.
6. **Maintainable:** content is updated in one place.

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
- **Ground it in the owner.** Their real work and audience drive every choice, and the hero opens with the most characteristic thing about them.
- **Decide deliberately.** Each typeface, colour and layout choice has a reason recorded in `DESIGN.md`. Avoid `.claude/skills/design-direction/references/generic-patterns.md`.
- **Spend boldness once.** One signature moment, everything else quiet.
- **Consistency locks:** one theme strategy, accent, radius system, icon family, type pairing, and label per intent.
- **Structure is information.** Number things only when they are a real sequence. No decorative labels, dots or chrome.
- **DESIGN.md is the contract.** Once approved, tokens reach code only via `npx @google/design.md export`.

# Engineering Principles
- Plan before code. Make the smallest change that meets the task (YAGNI).
- Evidence before claims, and root cause before fixes (`verification`).
- Small files with one responsibility, organised by feature. Static and server-first; JavaScript only for real interactivity.
- Verify each dependency (existence, version, licence) with `npm view`, and justify it in the plan.
- Never weaken tests, lint rules or budgets to get green.

# Architecture Guidelines
The plan confirms the stack. Default proposal:
- **Stack:** Next.js App Router with static generation, TypeScript strict, Tailwind CSS v4, pnpm. Hosting is decided later by the owner (Vercel or Cloudflare). Pinned versions live in the approved plan.
- **Content:** typed modules derived from `info.md` (`src/content/`), schema-validated at build. Components never hardcode personal facts.
- **Tokens:** generated from `DESIGN.md` into a Tailwind `@theme` file, plus a thin dark-theme mapping. No literal design values elsewhere.
- **Client code:** small leaves only (theme toggle, mobile menu, motion islands).
- **Not included** unless the plan justifies it: CMS, database, global state library, backend.
- **Structure:** `src/app/`, `src/components/<feature>/`, `src/content/`, `src/lib/`, `tests/`.

# Frontend Guidelines
- Semantic HTML first, and ARIA only to fill gaps.
- Server Components by default, with minimal props to client leaves.
- Composition over boolean props; no barrel files; heavy client code dynamically imported; third-party scripts deferred or omitted.
- **Images:** explicit dimensions, and only the LCP image prioritised.
- **Fonts:** self-hosted and subset (`next/font`), `swap`, at most 2 families.
- **Icons:** one library, chosen in `DESIGN.md`.
- **Typography:** `…`, curly quotes, `tabular-nums`, balanced headings. Hydration-safe theme with no flash.
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
- Every animation must communicate something: hierarchy, feedback, a state change or continuity. If you can't name it in one sentence, cut it.
- **Budget** (in `DESIGN.md`): one signature moment, feedback micro-interactions and state transitions. No scroll-reveal on every section, no perpetual loops, no scroll hijacking unless `DESIGN.md` approves it.
- **Technique:**
  - Movement animates `transform` and `opacity` only.
  - Control state feedback may transition `color`, `background-color` and `border-color`, at the feedback duration token only.
  - List transition properties (never `all`); animations are interruptible; durations and easings come from tokens.
- **Implementation:** CSS first; `motion/react` only in client leaves; no scroll listeners.
- **Reduced motion:** every animation has a static or opacity-only variant.

# Performance Requirements
- **Lighthouse** (mobile, production build, median of 3): performance ≥ 95; accessibility, best practices and SEO = 100.
- **Lab vitals** (mobile): LCP ≤ 2.5 s, CLS ≤ 0.1 (target 0), TBT ≤ 200 ms.
- **JavaScript:** first-load budget set in the plan.
- **Loading:** no layout shift from media or fonts; lazy below the fold; no render-blocking third parties.

# SEO Requirements
- A unique title and description on every page, plus a canonical URL and `lang`.
- Open Graph and Twitter tags with a 1200×630 image.
- JSON-LD `Person` (from `info.md` only) and `WebSite`, validated.
- `sitemap.xml`, `robots.txt` and a real 404. Stable URLs; a replaced site's URLs keep working.
- One `h1`, content in the server HTML, favicon, app icons, `theme-color`.

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
| `perf-seo-audit` | Measure performance, verify SEO |
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
| 9 | Release audit | qa-reviewer | whole site | perf/SEO, UI, content reports | PASS |
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
Run `nvm use` first. `.nvmrc` is 24, and Corepack supplies pnpm 10.34.5.

**Current mode** (owner, 2026-09-28): tests were removed during the build and a lean suite returns after Phase 10. Until then the gate is static: design lint, tokens, fonts, lint, typecheck, build. The test commands below apply again once the suite is back.

Local gate, in order:
1. `pnpm install --frozen-lockfile`
2. `pnpm check`: `design:lint`, `tokens:check`, `fonts:check`, lint (ESLint + Prettier), typecheck, unit tests (Vitest)
3. `pnpm build`
4. `pnpm test:e2e`: Playwright + axe; chromium desktop and mobile, webkit mobile, Firefox for layout and keyboard

**Deferred by the owner** (2026-09-28, "skip performance budget, scan, seo for now"), re-enabled before release:
- `pnpm test:budget` (byte budgets)
- `pnpm lhci` (Lighthouse, mobile then desktop)
- `pnpm privacy:scan` (build-output privacy scan; the script is kept)

Other commands:
- `pnpm tokens` and `pnpm fonts`: regenerate the token and font files after a `DESIGN.md` or font change. The `:check` variants verify them.
- `pnpm design:lint`: the DESIGN.md linter with the warning policy.
- `pnpm resume:pdf`: regenerates `public/tidi-resume.pdf` and its lock. `pnpm resume:check` (part of `pnpm check`) fails if the content changed without regenerating.
- `pnpm format`: Prettier write.

Agents stop only the processes they started, by PID. Never kill by name or pattern (`pkill`, `killall`).

Test layers:
- **Unit** (test-first): content schema, utilities, metadata and JSON-LD builders, state logic.
- **E2E:** every route renders; keyboard path; theme without flash; no overflow at 320 px; axe clean in both themes.
- **Visual:** 6 widths × 2 themes per UI phase (`ui-audit`).
- **Audits:** `perf-seo-audit` at milestones and release; content verification before release.

# Definition of Done
A task or phase is done only when:
- every acceptance criterion has evidence
- the full gate passes, run fresh
- `qa-reviewer` returns PASS (or PASS WITH MINOR, minors logged)
- there are no token violations, unsourced content or placeholders
- the checkpoint is signed off, if the phase is one
- `docs/progress.md` is updated

A release also needs the Lighthouse and vitals budgets met, the SEO checklist passing, clean content verification, and the owner's approval.

# Important Constraints
- No application code, scaffolding or installs before the owner approves the plan.
- Never invent personal information or copy anything personal from reference portfolios.
- Subagents cannot reach the owner; questions go through the main session.
- One implementer at a time. No nested agents.
- Keep the system small. Add a skill or agent only for a proven, repeated need, and update this file when the workflow changes.
