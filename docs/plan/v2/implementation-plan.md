# Portfolio implementation plan v2: Holo Deck

> **Status: Approved by owner, 2026-09-28** ("approved"). Phases 1–6, then F, run back to back.
> **Inputs:**
> - `info.md`: facts and Approved copy, including the v2 rows
> - `DESIGN.md`: B · Holo Deck; lint 0 errors, 0 warnings; 52 contrast pairs pass
> - `docs/design/directions-v2.md`: B selected 2026-09-28, with its working mock `directions-v2-preview.html`
> - `CLAUDE.md`
>
> **Details (this plan wins on conflict):**
> - [`contrib-design.md`](contrib-design.md): `design-lead`
> - [`contrib-engineering.md`](contrib-engineering.md): `frontend-engineer`
> - [`contrib-verification.md`](contrib-verification.md): `qa-reviewer`

**Goal:** a clean, modern, RPG-game-styled developer portfolio, alive with 3D and animation: the Holo Deck. Built only from `info.md` and `DESIGN.md`.

**Architecture:**
- **Page:** an HTML-first, statically prerendered Next.js page. Every word is real HTML.
- **3D:** React Three Fiber scenes (the hero hologram chip with the handshake; the quest holograms) are dynamically loaded client islands that sit over the HTML.
- **Resilience:** a poster fallback when WebGL is missing or lost; scenes pause off-screen and in hidden tabs; a reduced-motion or paused variant for everything.

**Stack** (`npm view`, 2026-09-28; pins in contrib-engineering §1.1):

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.6, React 19.3.0, TypeScript 6.0.3 |
| Styling | Tailwind CSS 4.3.3 |
| 3D | three 0.186.1, @react-three/fiber 9.8.1, @react-three/drei 10.7.9, @react-three/postprocessing 3.1.3 (Bloom, dark theme only) |
| Motion | Motion 13.4.4. No GSAP. |
| Other | Zod 4.6.5; @tabler/icons-react 3.48.0; Chakra Petch and Mona Sans self-hosted subsets with Vietnamese and "→" |
| Tests | Playwright 1.63.0 with axe 4.13.0, and Vitest 5.0.2, used in Phase 6 only |
| Runtime | Node 24 (already installed via nvm), pnpm 10.34.5 via Corepack |

## Global Constraints
- **Truth:**
  - every visible string traces to `info.md` (facts or Approved copy); new wording ships only after the owner approves it
  - never shown: the phone number, [private email removed], the reference, availability, travel and photography
- **Look and motion:** `DESIGN.md` is the contract.
  - Tokens only, for both themes: dark Deck and light Lab, following the system with a toggle.
  - The handshake auto-plays once, then waits.
  - Nothing flashes more than 3 times a second; there is a visible motion pause control; every animation and scene has a calm variant that keeps all content.
- **Accessibility:** WCAG 2.2 AA in both themes.
  - Text sits on panels or scrims, never directly on 3D.
  - Canvases are `aria-hidden`, and their information also exists as text.
  - Focus is visible and never hidden behind a canvas or the HUD.
  - Targets are ≥ 44 px; no horizontal scroll from 320 px.
- **Out of scope** (owner): performance budgets, Lighthouse, SEO, the privacy scan.
- **Build mode** (owner):
  - phases run back to back; the gate per phase is `pnpm check && pnpm build`
  - no per-phase QA
  - the lean test suite and all checks run once at the end
  - local git only; hosting is decided later
  - agents stop only their own processes, by PID

## Rulings (main session, 2026-09-28)
- **Quest journal:** every quest file stays visible and stacked, and the mission list scrolls or links to them. This is `DESIGN.md`'s version, with no hidden tab panels, so no content is hidden. It overrides contrib-engineering §6.2.
- **Checkpoints:** the Phase 2 design checkpoint is removed, because the owner chose one check after the build. `design-lead` reviews everything in phase F.
- **Glyphs:** "▸", "▲" and "▼" render as Tabler filled icons, because neither font has them. Pause scope follows engineering's D2–D4 as adopted in `DESIGN.md`.
- **Accepted engineering rulings R1–R5:**
  - fonts built from Google's source files
  - no GSAP
  - `clip-path` wipes allowed (`CLAUDE.md` says DOM motion "prefers" transform and opacity)
  - unit tests only for the handshake machine
  - no SEO or security-header work
- **Reuse from git history:** the v1 content layer, handshake machine, theme script and résumé generator, adapted to `DESIGN.md`.

## File map
See contrib-engineering §2. Top level: `src/app/`, `src/components/<feature>/` (client islands named `*.client.tsx`), `src/scenes/` (R3F), `src/content/`, `src/lib/`, `src/styles/`, `scripts/{tokens,fonts,resume}/`, `public/tidi-resume.pdf`, `tests/` (Phase 6).

## Execution
- **One implementer:** `frontend-engineer` builds Phases 1–5, then writes and passes the test suite in Phase 6.
- **Phase F (final checks):**
  - the full gate
  - `qa-reviewer`'s code review and UI audit, including about 66 screenshots across widths, themes, motion on and off, 3D states and no-WebGL
  - content verification against `info.md`
  - `design-lead`'s design check
  - then one merged fix list, with at most 2 rounds
- **When the owner is needed:** the copy slots listed below, and anything that changes the approved look.

---

## Phase 1: Foundation
### Goal
A working toolchain, tokens, fonts and content layer, plus proof that 3D runs in this stack.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
- contrib-engineering §1–4, §9
- `DESIGN.md` front matter
- `info.md`
- v1 git history (content layer)
### Tasks
- [ ] **Toolchain:** `.nvmrc` 24; Corepack pnpm 10.34.5; the scaffold; configs; scripts (`check`, `build`, `tokens`, `fonts`).
- [ ] **Tokens:** from `DESIGN.md`, plus the thin `theme.css`.
- [ ] **Fonts:** Chakra Petch and Mona Sans subsets, with Vietnamese and "→".
- [ ] **Content layer:** restore and extend it with the v2 approved copy.
- [ ] **3D spike:** a throwaway R3F spinning mesh in a dynamic island, then removed.
### Expected Outputs
A bare prerendered `/` in both themes, with fonts loaded.
### Acceptance Criteria
- `pnpm check` exits 0: design lint 0/0, tokens and fonts in sync, glyph coverage of `info.md`, lint, typecheck.
- `pnpm build`: every route static.
- An invalid content edit fails the build with its path.
- The spike renders with 0 console errors (screenshot), then is removed.
### Dependencies
Plan approval.

## Phase 2: Shell and Holo hero
### Goal
The first viewport, alive: the HUD, the hologram chip, the handshake.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
- `DESIGN.md`: HUD, hero, handshake, 3D spec, motion, both themes
- contrib-engineering §5–6
- contrib-design §2–3
### Tasks
- [ ] **Shell:** skip link, the HUD strip with the XP bar, corner brackets, nav and menu, the theme toggle with a no-flash head script, the motion toggle, the `<noscript>` style, footer, not-found, and a basic `<title>`.
- [ ] **Hero:** the lockup and the CTAs "Bring me a pain point" and "Résumé".
- [ ] **Handshake:** the state machine (auto-play once, Run, Counterfeit, verdict, log, live region).
- [ ] **Scene and fallback:** the hero scene with boot, ambient motion, handshake animation, theme palettes and Bloom in dark. `HoloPoster` is the fallback on WebGL failure or context loss. Pausing via `frameloop`.
### Expected Outputs
The complete hero at every width and theme.
### Acceptance Criteria
- The static gate is green.
- **Screenshots:** 375 and 1440 × light and dark × motion on and off, plus a WebGL-disabled capture.
- **Manual pass:**
  - auto-play runs once; Run and Counterfeit reach "genuine" and "rejected"
  - with JavaScript off the page is complete, with no dead controls
  - the canvas pauses off-screen and when paused
  - 0 console errors or hydration warnings
### Dependencies
Phase 1.

## Phase 3: Quest journal
### Goal
Projects as missions, each with a hologram, plus "Quest unlocked" and the video.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
- `DESIGN.md`: mission item, quest file, quest holograms, toast, video facade
- contrib-engineering §6.2 (as ruled: stacked, visible)
### Tasks
- [ ] **Quest files:** the mission list, and the files for CyberRock, botmivivi and Quest, all visible and stacked, with status chips, facts, Party lead and achievements.
- [ ] **Holograms:** the chip, the ledger stack and the data slabs, each with its `a11y.steps.*` text.
- [ ] **"Quest unlocked":** the toast with its live region.
- [ ] **Video facade:** "Watch Quest by NFQ", which loads nothing until activated.
- [ ] **Lemonswan and Scania:** under NFQ Asia in the Mission log (Phase 4), not in the journal.
### Expected Outputs
The Quest journal in both themes, with motion on and off.
### Acceptance Criteria
- The static gate is green; screenshots per quest in both themes.
- With JavaScript off, every file is visible.
- The toast announces.
- No YouTube request before activation.
### Dependencies
Phase 2.

## Phase 4: Remaining sections and scroll motion
### Goal
Mission log, House rules, Inventory with Leveling up, Character stats, AFK and Join party, with scroll-driven power-ons.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
- `DESIGN.md`: the timeline, rule panel, inventory slot, training card, avatar frame, dialogue box, AFK list, contact row
- contrib-engineering §6.1
### Tasks
- [ ] **Sections:** the six sections, including the location row in Join party and the avatar with its caption and `alt=""`.
- [ ] **Scroll motion:** `reveal-observer` (panel power-on, stat rows, level-up sweep), visible by default, with a CSS safety reveal.
### Expected Outputs
The full page.
### Acceptance Criteria
- The static gate is green.
- **Screenshots:** full-page at 375 and 1440 × themes × motion.
- With JavaScript off and under reduced motion, every panel is visible.
- No overflow at 320 px.
### Dependencies
Phase 3.

## Phase 5: Résumé PDF and links
### Goal
A fresh `tidi-resume.pdf`, generated from content and styled to the Lab theme.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
- contrib-engineering §7
- Approved copy (`resume.*`, `lists.scope`)
- the v1 generator in git history
### Tasks
- [ ] **Scripts:** `pnpm resume:pdf` and `resume:check`.
- [ ] **Output:** `public/tidi-resume.pdf` and its lock.
- [ ] **Links:** the hero "Résumé" link and the Join party row "PDF, {size}".
### Expected Outputs
The PDF, and working links.
### Acceptance Criteria
- A4, ≤ 2 pages, tagged, fonts embedded.
- It contains "Hồ Trọng Đại" and the title "TiDi, Résumé".
- No phone number, second email or reference.
- `resume:check` fails after an unregenerated content edit.
### Dependencies
Phase 4.

## Phase 6: Lean test suite
### Goal
Automated proof of the key flows and of accessibility.
### Responsible Agent
`frontend-engineer`
### Skills Used
`frontend-build`, `verification`
### Inputs
contrib-verification §1 (17 checks); contrib-engineering §8.
### Tasks
- [ ] **Playwright with axe**, on desktop Chromium at 1440 and mobile WebKit at 375, covering:
  - the handshake: auto-play, run, counterfeit, reduced motion
  - the theme toggle, the menu, the skip link, the video facade, the résumé link
  - axe in both themes, the keyboard walk, reduced motion with complete content, the pause control, no overflow
  - the WebGL fallback: none available, and a lost context
  - the mobile 3D checks
- [ ] **Vitest** for the handshake machine.
### Expected Outputs
`pnpm test` and `pnpm test:e2e`.
### Acceptance Criteria
- All suites exit 0: 0 failed, 0 skipped, no retries.
- They pass twice in a row.
- Failures are fixed at the root cause, never by weakening a spec.
### Dependencies
Phase 5.

## Phase F: Final checks (then fixes)
- **Order:**
  1. the gate
  2. code review
  3. UI audit (the screenshot matrix)
  4. content verification
  5. design check
- **Then:** one merged fix list; a scoped re-check, at most 2 rounds; the owner's review.
- **Responsible:** `qa-reviewer` and `design-lead` for the checks; `frontend-engineer` for the fixes.

## Review Focus
1. Text over 3D losing contrast (axe can't read canvas pixels).
2. Reduced motion or pause not honoured, or content left hidden.
3. WebGL failure leaving a blank hero.
4. The mobile GPU and touch: canvas resolution, loops not pausing, drag trapping scroll.
5. Focus hidden behind the canvas or HUD, or out of order on mobile.

## Copy slots
All resolved by the owner on 2026-09-28 and recorded in `info.md` → Approved copy:
- motion toggle "Motion"
- the banner HUD lines
- Lemonswan and Scania under NFQ Asia in the Mission log
- the small labels, in the profile's wording
- the résumé section labels

## Coverage checklist
Initialization 1 · stack 1 · IA 2–4 · content 1 · design system 1 · page structure 2–4 · components 2–4 · responsive 2–4 · interactions 2–3 · motion and 3D 2–4 · accessibility 2–4 and 6 · testing 6 · visual QA F · deployment on hold (hosting decided later) · final verification F.
