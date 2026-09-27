# Reference Analysis

Foundation steps 1–3: what the references recommend, where they agree or conflict, and what this project adopts.
This is the audit trail. `CLAUDE.md` holds the operative decisions; read this only to revisit one.

Sources read on 2026-09-27 (cloned at `main`):

| Listed in | Source | What it is |
|---|---|---|
| `ui-ref.md` | [tasteskill.dev](https://www.tasteskill.dev/) → `Leonxlnx/taste-skill` | "Anti-slop" frontend skills. Main skill v2 (experimental, 1,206 lines) plus 12 variants (style presets, redesign, output enforcement, Stitch export, image generation). |
| `ui-ref.md` | [VoltAgent/awesome-design-md](https://github.com/voltagent/awesome-design-md) | 74 `DESIGN.md` files extracted from brand sites, in the Google Stitch DESIGN.md format (linter: `@google/design.md` v0.4.0). |
| `ui-ref.md` | [anthropics/skills · frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | A short skill on distinctive, subject-grounded visual design with a plan → review → build → critique loop. |
| `skill-ref.md` | [skills.sh · vercel-labs/agent-skills](https://www.skills.sh/vercel-labs/agent-skills) | Vercel's skills: react-best-practices (70 rules), composition-patterns, web-design-guidelines (Web Interface Guidelines audit), react-view-transitions, deploy-to-vercel, writing-guidelines, vercel-optimize, plus React Native and CLI skills. |
| `skill-ref.md` | [obra/superpowers](https://github.com/obra/superpowers) | A development method as skills: brainstorming, writing-plans, subagent-driven development, TDD, systematic debugging, verification, code review, writing-skills. |

---

## 1. Strongest practices per source

### Taste Skill (ui-ref)
**Keep**
- **Brief inference before design.** Read page kind, audience, vibe words, references and constraints. State a one-line *Design Read*: "Reading this as: ⟨page kind⟩ for ⟨audience⟩, with a ⟨vibe⟩ language, leaning toward ⟨aesthetic family⟩." The audience picks the aesthetic.
- **Three dials** (VARIANCE / MOTION / DENSITY, 1–10) as a compact way to describe and compare directions. It suggests 6 / 5 / 4 for a developer portfolio.
- **Consistency locks:** one theme, one accent, one radius system, one icon family, one label per call-to-action intent.
- **Hero discipline:** fits the first viewport, headline of two lines or fewer, at most four text elements.
- **Layout mechanics:** explicit mobile collapse for every multi-column section, `100dvh` instead of `h-screen`, CSS grid instead of flex arithmetic, no layout family repeated across sections.
- **Motion guardrails:** motion must be motivated (hierarchy, story, feedback or state change). Animate transform and opacity only, reduced motion is mandatory, no scroll listeners, motion lives in isolated client leaves, effects are cleaned up.
- **AI tells that recur on portfolios:** section-number eyebrows, eyebrows on every section, scroll cues, decorative status dots, locale and time strips, fake-precise numbers, filled progress bars, fake screenshots built from divs, filler verbs, em dashes.
- **Discipline:** a copy self-audit, checking a dependency exists before importing it, testing both themes, and a pre-flight checklist as a hard gate.

**Leave**
- **Font, palette and icon whitelists** (Geist or Satoshi, zinc plus one accent, Phosphor). They have become a recognisable default of their own.
- **Image generation first and picsum placeholders.** Both are incompatible with a truthful personal site.
- **Material that doesn't apply here:**
  - the design-system map (Material, Fluent, Carbon and so on)
  - the block-library schema and the redesign protocol
  - landing-page rules (logo walls, pricing, spec sheets, testimonials)
  - GSAP scroll-hijack skeletons as a default
- **Size:** 1,200+ lines is too heavy to load for every UI task.
- **Internal contradictions:**
  - `stitch-skill` recommends Fraunces or Instrument Serif and "perpetual micro-loops on every active component"; v2 bans both.
  - v2's motion band 4–7 prescribes `transition: all`, which its own guardrails and Vercel both forbid.

### awesome-design-md (ui-ref)
**Keep**
- **`DESIGN.md` as the design contract,** kept beside the build instructions ("how it looks" next to "how to build").
- **The format:**
  - YAML token front matter: `colors`, `typography`, `rounded`, `spacing`, and `components` that reference tokens as `{colors.primary}`
  - ordered prose sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts
  - optional extra sections: Responsive Behavior, Iteration Guide, Known Gaps
- **Tooling:** `npx @google/design.md lint` checks broken references, contrast and section order. `export --format css-tailwind` emits a Tailwind v4 `@theme` block, so tokens flow from `DESIGN.md` into code without being copied by hand.
- **Calibration vocabulary:** existing files are useful while exploring ("Linear-like restraint").

**Leave**
- **Copying any brand's file.** The portfolio must look like its owner, not like Vercel or Linear.
- **500–700-line depth.** A portfolio has about ten components.
- **Single-theme schema.** The format has no native dark theme, so we add a naming convention.

### Anthropic frontend-design (ui-ref)
**Keep**
- **Ground the design in the subject.** The owner's real work, field and audience supply the visual vocabulary, and the hero opens with the most characteristic thing about them.
- **Two-pass process:**
  - First, a compact plan: 4–6 named hex colours, typefaces and their roles, a layout concept with ASCII wireframes and alignment, and principles.
  - Then review the plan for genericness ("would a similar prompt land here?"), revise it, and only then write code.
- **Calibration clusters of current AI design:**
  - cream background with a serif and terracotta accent
  - near-black background with one acid accent
  - broadsheet hairlines
  - SaaS card kit
  - template chrome: eyebrows, middle-dot meta strings, "WORD — fragment" labels, mono data labels, "→" on links
- **Typography carries personality:** a deliberate scale, lines under 80 characters, no single-word accent, no all-caps labels, no unnecessary labels. Structure encodes information, so numbering is only for real sequences.
- **Motion restraint:** one orchestrated moment. Per-section fade-ups read as generated. Motion that answers a user action is welcome.
- **Restraint and self-critique:** spend boldness in one place, hold a quality floor (mobile, focus, reduced motion, contrast), critique from screenshots, "remove one accessory".
- **Copy is design content:** active voice, specific labels, consistent vocabulary, sentence case.

**Leave:** nothing substantive. It is light on verification and engineering, which other sources supply.

### Vercel agent-skills (skill-ref)
**Keep**
- **web-design-guidelines.** Procedure: fetch the rules, check the files, report terse `file:line` findings. The Web Interface Guidelines are the most concrete rule set here. They cover accessibility, focus, forms, animation, typography, content handling, images, performance, URL state, touch, safe areas, dark mode, i18n, hydration and hover contrast, plus an anti-pattern list.
- **react-best-practices.** Rules are ordered by impact. The subset that matters for a static portfolio:
  - no barrel imports
  - dynamic imports for heavy client code
  - deferred third-party scripts
  - hoisted static I/O
  - minimal props passed to client components
  - a hydration-safe theme script
  - resource hints and deferred scripts
  - no components defined inside components
  - derive state during render instead of syncing it in effects
- **composition-patterns:** explicit variants instead of boolean props, children instead of render props, compound components only when needed, and React 19 without `forwardRef`.
- **react-view-transitions:** animate only to show continuity or a spatial relationship, and degrade gracefully.
- **deploy-to-vercel:** gather project state first, deploy as a preview by default, and go to production only on explicit request.
- **Skill authoring:** `SKILL.md` under 500 lines, trigger phrases in descriptions, detail in `references/` (progressive disclosure), scripts over inline code.

**Leave**
- SWR, server-action, LRU-cache and React Native rules.
- `vercel-optimize`, which needs production metrics.
- The CLI-token skill.
- The Guidelines' copy conventions (Title Case, avoid first person). They are product-UI rules and even contradict Vercel's own writing guideline, which uses sentence case.

### Superpowers (skill-ref)
**Keep**
- **Hard approval gates before implementation,** with process scaled to the work (spike, bounded or architectural).
- **Discovery:**
  - one question at a time, multiple choice when possible
  - 2–3 approaches with a recommendation
  - the design shown in digestible sections
  - spec self-review for placeholders, contradictions, ambiguity and scope
- **Plans are decisions, not transcripts.** They record the file map, interfaces, exact values and checks, plus Global Constraints and a Review Focus. Tasks are right-sized, and the plan gets a self-review for coverage, consistency and proportion.
- **Execution:**
  - fresh-context subagents with precise, file-based briefs
  - implementers never spawn subagents
  - no parallel implementers on shared files
  - a progress ledger that survives context compaction
  - "rulings, not stalls," with a short list of stop conditions
- **Verification before completion:** identify, run, read, verify, then claim.
- **Systematic debugging:** root cause first. After three failed fixes, question the approach.
- **Review:**
  - spec compliance first (missing, extra, misunderstood), then quality
  - severity levels: Critical, Important, Minor
  - the reviewer is read-only and does not trust the implementer's report
  - receiving review means verifying, then either fixing or pushing back with reasons
- **Skill writing:**
  - a description states *when to use*, never a summary of the workflow (agents follow a summary instead of the skill)
  - match the form to the failure: prohibitions for discipline, recipes for output shape, required slots for things that get omitted

**Leave**
- Git worktrees, per-plan workspaces and helper scripts.
- Five-round fix loops and two review seats per task.
- "Delete code written before tests" applied to presentational UI.
- The "1% chance, you must invoke" rule.
- The visual companion server and the platform ports.

---

## 2. Comparison by area

Each area: **ui** = ui-ref sources, **skill** = skill-ref sources, then overlap, conflict and decision.

**Planning & discovery**
- **ui:** infer the brief and state a Design Read, and ask one question only when the read genuinely diverges (Taste). Identify subject, audience and primary job, then confirm (frontend-design).
- **skill:** classify the work, ask one question at a time, offer 2–3 approaches, write a spec with self-review, hold hard gates, and plan as decisions (Superpowers).
- **Overlap:** understand intent before building. Propose, review, then build.
- **Conflict:** Taste says "don't ask if you can infer"; Superpowers requires explicit approval at every stage.
- **Decision (combined):**
  - Superpowers' gates govern direction and the plan.
  - Taste and frontend-design define what the brief must contain.
  - Personal facts are never inferred: they are asked for and recorded in `info.md`.
  - Low-stakes details are decided and logged as rulings.
  - *Why:* you mandated gates and a no-invention rule, so inference is safe only for reversible details.

**Workflow & orchestration**
- **ui:** one agent works in one pass, ending in a pre-flight gate or a plan → build → critique loop.
- **skill:** a fresh implementer and reviewer per task, ledgers, and a final whole-branch review.
- **Overlap:** build, check and fix before delivery.
- **Conflict:** per-task double review is heavy for a portfolio, while the UI references have no independent review at all.
- **Decision:**
  - The main session orchestrates three specialist agents.
  - Review happens once per phase, not per task, with two verdicts in one pass.
  - The fix loop is capped at two rounds, then the main session makes a ruling.
  - `docs/progress.md` is the ledger.
  - *Why:* this keeps the biggest quality win (fresh-eyes review) without enterprise overhead.

**Agents & skills (meta)**
- **ui:** rules are contextual ("pull only what fits"), yet Taste packs everything into one giant skill.
- **skill:** descriptions list triggering conditions only, skills stay short with references for detail, and briefs are handed over as files.
- **Decision:**
  - Nine focused skills, each around 150 lines or fewer, with "Use when…" descriptions.
  - Heavy checklists live in `references/`.
  - Agents preload only their own skills through the `skills:` frontmatter.
  - Subagents already receive `CLAUDE.md`, so agent files contain role-specific rules only.

**Visual design (UI/UX)**
- **ui:**
  - Taste: dials, locks, hero discipline, an anti-tell catalogue, whitelists
  - frontend-design: grounding, a compact plan with a genericness review, calibration clusters, restraint
  - awesome-design-md: the DESIGN.md format
- **skill:**
  - Web Interface Guidelines: contrast, hover states that increase contrast, `color-scheme` and `theme-color`, balanced headings, tabular numbers
  - Superpowers: 2–3 options with a recommendation
- **Overlap:** explicit written decisions, avoiding defaults, consistency.
- **Conflicts:**
  - Taste's whitelists (zinc plus one accent, mono labels) vs frontend-design, which lists near-black with one accent and mono labels among its AI clusters.
  - Taste says serif is "very discouraged"; frontend-design says any typeface choice is fine if it is deliberate.
  - Taste's own variants contradict each other.
- **Decision (combined):**
  - Directions are compact plans (frontend-design) plus a Design Read and dials (Taste), offered as 2–3 options with a recommendation (Superpowers).
  - The chosen direction is codified in a linted `DESIGN.md` (awesome-design-md).
  - Ban lists are adopted; whitelists are not. Every typeface and colour needs a reason tied to the owner or the audience.
  - *Why:* bans prevent known failures, while whitelists just create a new default.

**Motion**
- **ui:**
  - frontend-design: one orchestrated moment, and per-section fade-ups are a tell
  - Taste: motivation test, reduced motion, transform and opacity only, client-leaf isolation, "motion claimed = motion shown"
- **skill:**
  - Web Interface Guidelines: reduced motion, compositor-only properties, never `transition: all`, interruptible animations, a pause control for autoplay longer than five seconds
  - view-transitions: animate only to show continuity
- **Conflicts:**
  - Taste's `transition: all 0.3s` vs the Guidelines' ban on it.
  - Taste requires scroll reveals when MOTION > 4, which frontend-design calls a tell.
  - stitch-skill's perpetual loops.
- **Decision:**
  - A motion budget in `DESIGN.md`: one signature moment, feedback micro-interactions and state transitions.
  - No default scroll reveals and no perpetual loops.
  - CSS first. `motion/react` only in client leaves, and GSAP only if `DESIGN.md` approves a pinned sequence.
  - Every animation names what it communicates and has a reduced-motion variant.
  - *Why:* the restraint sources and the correctness sources agree. The conflicting rules are exactly the ones that produce generic output.

**Frontend implementation & responsive**
- **ui:**
  - Taste: server components by default, client leaves, Tailwind v4, self-hosted fonts, `100dvh`, grid, explicit mobile collapse
  - stitch-skill: 44 px touch targets, `clamp()` type
  - DESIGN.md: a Responsive Behavior section
- **skill:**
  - react-best-practices and composition-patterns
  - Web Interface Guidelines: semantic elements, image dimensions, safe areas, no JavaScript layout measurement, `touch-action`
- **Overlap:** server-first rendering, small client islands, semantics, mobile-first layout.
- **Conflict:** Taste suggests Zustand or Jotai for global state; nothing here needs it.
- **Decision (combined):**
  - Static, server-rendered pages. Client leaves only for the theme toggle, menu and motion.
  - Tokens generated from `DESIGN.md`, and composition instead of boolean props.
  - `DESIGN.md` defines the breakpoints and each section's collapse; touch targets are 44 px or larger.
  - Verified at 320, 375, 768, 1024, 1440 and 1920 px in both themes.

**Architecture & code quality**
- **ui:** verify dependencies before importing, one icon family, a z-index scale, no hand-drawn icons.
- **skill:** small focused files split by responsibility, DRY and YAGNI (Superpowers). No barrel files and statically analysable imports (Vercel).
- **Decision:**
  - A typed content layer derived from `info.md` is the only data source.
  - Feature folders, strict TypeScript, ESLint (including jsx-a11y) and Prettier.
  - No CMS, database, global state library or backend unless the plan justifies one.

**Accessibility**
- **ui:** a quality floor (focus, reduced motion, contrast) and button and form contrast checks.
- **skill:** the Web Interface Guidelines are the most complete and checkable set here: semantic HTML before ARIA, labels, alt text, skip link, heading order, `:focus-visible`, keyboard handlers, `aria-live`, never disabling zoom.
- **Decision:** WCAG 2.2 AA in both themes. A Guidelines-based checklist, axe with zero violations, a manual keyboard pass and an accessibility-tree check.

**Performance**
- **ui:** Taste's Core Web Vitals targets (LCP < 2.5 s, INP < 200 ms, CLS < 0.1), grain only on fixed pseudo-elements, lazy-loaded heavy libraries, and "run Lighthouse before done."
- **skill:** the bundle and rendering rules from react-best-practices, plus image dimensions, lazy loading or priority, `preconnect` and font preload with swap from the Guidelines.
- **Decision:** Lighthouse on mobile at 95+ for performance and 100 for accessibility, best practices and SEO. Core Web Vitals "good". No layout shift from media or fonts. A JavaScript budget set in the plan. Measured on the production build.

**SEO**
- **ui:** Taste mentions SEO only as a redesign risk (slugs, meta titles, structured data, OG cards).
- **skill:** not covered.
- **Gap, filled from project needs:**
  - unique title and description per page, a canonical URL, `lang`
  - Open Graph and Twitter images
  - JSON-LD `Person` and `WebSite`, with Person built from `info.md` only
  - `sitemap.xml`, `robots.txt` and a 404 page
  - one `h1` per page, descriptive links, server-rendered content, stable URLs

**Testing & verification**
- **ui:** a pre-flight checklist, both themes tested, Lighthouse, screenshot self-critique.
- **skill:** the TDD iron law and verification before completion (Superpowers), plus terse audit output (Vercel).
- **Conflict:** strict TDD for every line vs presentational UI, where the rendering *is* the behaviour.
- **Decision (combined): "define the check first."**
  - Unit tests are written first for logic: content schema, utilities, metadata and JSON-LD builders.
  - For UI, the Playwright and axe assertions and the screenshot matrix are defined before building.
  - Every "done" needs fresh evidence.

**Review**
- **ui:** self-critique only (pre-flight, screenshots).
- **skill:** an independent read-only reviewer, spec compliance before quality, severity levels, "don't trust the report," a disciplined response to feedback, and `file:line` findings.
- **Decision:**
  - `qa-reviewer` gives two verdicts plus a UI audit for every phase. Implementers verify each finding, then fix it or push back with evidence.
  - `design-lead` gives a separate subjective critique at two checkpoints only (first visual phase, pre-release). This keeps "conforms to the spec" apart from "has taste."

**Content & copy**
- **ui:**
  - frontend-design: words are design content, active voice, specific labels, sentence case
  - Taste: copy self-audit, no fake-precise numbers, no generic names, no filler verbs, one label per intent, no em dashes
- **skill:** the Guidelines' copy rules (active voice, numerals, specific labels, Title Case, second person) and Vercel's writing guideline (sentence case, no "easy/simple/quick", no em dashes as punctuation).
- **Conflicts:**
  - Title Case vs sentence case.
  - The Guidelines' second person vs first person, which is natural on a personal site.
  - Taste's total em-dash ban vs "not as punctuation".
- **Decision:**
  - `info.md` is the only source of personal facts.
  - Sentence case, first person for self-description, active voice.
  - No em or en dashes in UI copy we write; the owner's own approved wording is kept as given.
  - No invented metrics.

---

## 3. Conflicts resolved (summary)

| Conflict | Sources | Resolution | Why |
|---|---|---|---|
| Ask vs infer | Taste vs Superpowers | Gates for direction and plan; ask for facts; rule on reversible details | Your gates and no-invention rule |
| Font and palette whitelists vs "no defaults" | Taste vs frontend-design | Adopt bans, not whitelists; justify every choice | Whitelists become the new generic |
| `transition: all` | Taste (motion band) vs Web Interface Guidelines | List properties explicitly | Performance and correctness |
| Scroll reveals and perpetual loops | Taste v2, stitch-skill vs frontend-design | One signature moment plus feedback motion | Restraint reads as designed |
| Title Case vs sentence case | Guidelines vs frontend-design, Vercel writing | Sentence case | Majority, and calmer voice |
| Second vs first person | Guidelines vs personal-site norm | First person for self-description | It's a personal site |
| Em dash total ban vs limited | Taste vs Vercel writing | None in UI copy we write; keep the owner's approved words | AI tell; respects the owner's voice |
| TDD everywhere vs visual behaviour | Superpowers vs UI refs | Test-first for logic; checks-first for UI | Right tool per behaviour |
| Per-task double review vs self-check | Superpowers vs UI refs | One independent review per phase | Quality at portfolio scale |
| Real images required vs truthfulness | Taste vs project rules | Only owner-provided assets; typographic treatments otherwise | Never misrepresent the owner |

## 4. Gaps neither reference covers
- **Personal-data integrity:** traceability to `info.md`, owner approval of new copy, privacy of contact details.
- **SEO,** beyond a mention.
- **Language and i18n scope, analytics and privacy, domain and hosting.** These are decided in the interview and the plan.
- **Content maintenance:** the owner must be able to update facts in one place.

## 5. Resulting system
Nine skills and three agents, with the main session as orchestrator. See `CLAUDE.md` for the operative version and §6 for the validation that shaped it.

| Skill | Main sources |
|---|---|
| `portfolio-content` | project rules + frontend-design writing + Taste copy audit + Superpowers one-question-at-a-time |
| `design-direction` | frontend-design grounding and two-pass plan + Taste Design Read, dials and bans + Superpowers 2–3 options + awesome-design-md as vocabulary |
| `design-system` | awesome-design-md DESIGN.md format and `@google/design.md` tooling + Taste locks + frontend-design critique |
| `implementation-plan` | Superpowers writing-plans + your phase template |
| `frontend-build` | Vercel react-best-practices and composition + Taste implementation guardrails + Web Interface Guidelines |
| `ui-audit` | Web Interface Guidelines + Taste pre-flight (portfolio subset) + frontend-design quality floor |
| `perf-seo-audit` | Taste Core Web Vitals + Vercel bundle rules + project SEO requirements |
| `code-review` | Superpowers two-verdict review + Vercel `file:line` format |
| `verification` | Superpowers verification-before-completion + systematic debugging |

## 6. System validation (foundation step 8)

| Check | Result |
|---|---|
| Redundant agents? | No. Three agents with separate write areas: design docs (`design-lead`), code (`frontend-engineer`), review reports (`qa-reviewer`). |
| Overlapping responsibilities? | Two boundaries are drawn explicitly. Design critique is subjective and happens at two checkpoints; the UI audit is objective and happens every phase. Content work is shared through one skill, not duplicated across agents. |
| Too many agents? | No. Removed candidates: orchestrator (the main session does it, and only it can talk to you), content agent (the work splits naturally across existing roles through one skill), architecture agent (portfolio-sized, coupled to implementation), research agent (part of direction work). |
| Duplicated skills? | Merged: motion and responsive into design-system, frontend-build and ui-audit (decide, build, check). Debugging into verification. Discovery, copywriting and content verification into portfolio-content, which shares one invariant. Kept separate: code-review (reads the diff) vs ui-audit (runs the site); ui-audit (every phase) vs perf-seo-audit (milestones, different tools); design-direction vs design-system (split by a human gate). |
| Skills actionable? | Each has numbered steps, an output location and a checkable Definition of Done. |
| Handoffs clear? | Only the main session dispatches agents. Every handoff is a file with a named producer and consumer, and gates are listed in `CLAUDE.md`. Fix loops are capped at two rounds, so nothing loops indefinitely. |
| Verification defined? | Commands, test layers, budgets and phase and release Definitions of Done are in `CLAUDE.md`. |
| Portfolio-scale? | Yes. No worktrees, scripts, per-task double reviews or CMS. `CLAUDE.md` is the only always-loaded file; everything else loads on demand. |
