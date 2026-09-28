# Progress ledger

Source of truth for workflow state. It survives context resets: trust this file over memory.

## Workflow
- [x] Read `ui-ref.md` and `skill-ref.md`: all 5 linked sources inspected (2026-09-27)
- [x] Extract, compare and select practices → `docs/reference-analysis.md`
- [x] Project skills (9) → `.claude/skills/`
- [x] Project agents (3) → `.claude/agents/`
- [x] Collaboration workflow → `CLAUDE.md`
- [x] `CLAUDE.md`
- [x] Validate and simplify the system → `docs/reference-analysis.md` §6
- [x] Research portfolio references → `docs/research/portfolio-references.md` (desktop only; mobile inferred from CSS)
- [x] Discovery interview (2026-09-27)
  - Sources: `profile.md`, `DaiHo Resume.pdf`, `answer.md`, 8 in-chat choices, and final chat answers.
  - Assets: `ava.PNG` and `banner.svg`.
- [x] `info.md` confirmed by owner (2026-09-27; treated as confirmed after the owner's final answers without corrections)
- [x] Design directions proposed → `docs/design/directions.md` and `directions-preview.html`
  - Verified by the main session: 12 contrast ratios recomputed (one exempt figure corrected, 1.85 → 1.95); preview strings checked against `info.md`.
  - Browser checks: A's route and B's handshake interactions work, fonts and Vietnamese diacritics render, no overflow at desktop. C was not browser-checked: the owner chose before that step.
- [x] **Owner selects direction: B · Proof** (2026-09-28, no modifications)
- [x] `DESIGN.md` drafted and linted (2026-09-28)
  - Lint re-run by the main session: 0 errors, 0 warnings.
  - 382 lines, with the reason recorded in Known Gaps 6.
  - `contrib-design.md` written.
- [x] Agents contribute; plan assembled → `docs/plan/implementation-plan.md` (2026-09-28)
  - Self-review: 13 phases, all 9 template fields each, no placeholders.
  - Owner decisions (2026-09-28):
    - O1 hosting: decide later
    - O2 repository: do not push for now
    - O3 toolchain: install Node 24 and pnpm 10
    - O4 location: résumé and site
  - Plan updated with Phase 13 on hold and errata. `DESIGN.md` amended for D3 (lint 0/0) and for the location.
  - `design-lead` → `contrib-design.md`
  - `frontend-engineer` → `contrib-engineering.md`
  - `qa-reviewer` → `contrib-verification.md`
  - All dispatched 2026-09-28, in parallel.
- [x] **Owner approves plan** (2026-09-28: "continueu", in reply to the approval request)
- [ ] Implementation (phases tracked below)
- [ ] Release audit
- [ ] Final verification, then **owner approves production**

## Phases
| Phase | Status | Evidence |
|---|---|---|
| 1 Foundation | **complete** (2026-09-28) | `docs/reports/phase-01-engineering.md`; main-session gate re-run green; QA PASS WITH MINOR (`docs/reviews/phase-01-code-review.md`). Minors routed: M1 and M2 to Phase 2, M5 to Phase 3, M3 and M4 to Phase 4 |
| 2 Tokens and fonts | QA **FAIL** (I1 token lint gaps, I2 stroke tokens in the wrong namespace); fix round 1 folded into the Phase 3 implementer's run (one implementer at a time); re-verified with the Phase 3 review | `docs/reports/phase-02-engineering.md`; main-session gate re-run green (`phase2-gate.log`) |
| 3 Content layer | built (2026-09-28); final verification in Phase 12 | `docs/reports/phase-03-engineering.md` (includes the Phase 2 fix round) |
| 4 Shell and hero | built (2026-09-28, with Phase 5); verified at the end | commits `6e3c244`..`6903f1d`; no report (the agent was stopped once the build was committed) |
| 5 Sheet anatomy and CyberRock | built (2026-09-28); Checkpoint 1 folded into the final design check | same commits as Phase 4 |
| 6 Handshake | built (2026-09-28) | `docs/reports/phase-06-engineering.md` |
| 7 Remaining sheets and video | built (2026-09-28) | `docs/reports/phase-07-08-engineering.md` |
| 8 Remaining drawings | built (2026-09-28) | same report as Phase 7 |
| 9 Remaining sections | built (2026-09-28) | `docs/reports/phase-09-engineering.md` |
| 10 Résumé PDF | built (2026-09-28) | `docs/reports/phase-10-engineering.md`; `public/tidi-resume.pdf` (2 pages, 74 KB) |
| 11 SEO, metadata, 404 | pending | |
| 12 Pre-release hardening, then the release audit and Checkpoint 2 | pending | |
| 13 Deployment | on hold (O1, O2) | |

**Copy batches**
- C1: **approved 2026-09-28** (rows 1–4, 6, 7, 11 are in `info.md` → Approved copy)
- C2: **approved 2026-09-28**, early (rows 5, 8, 9, 10, 12, 16)
- C3: **approved 2026-09-28**, early (rows 13–15, 17, 18 and extras; drawing step lists approved as a pattern, exact strings recorded as drafted)
- Phases 1–12 no longer wait on copy.

## Rulings
Format: `Ruling: what — why — cost if wrong`
- Ruling: the main session runs reference research instead of `design-lead` — only the main session has browser access and it feeds the interview — cost if wrong: `design-lead` may re-run the study from HTML later.
- Ruling: the banner's "STATUS accepting quests" line stays off the site — the owner chose not to show availability — cost if wrong: the owner can approve it later, a one-line change.
- Ruling: the résumé photo is not used; the illustrated avatar is the portrait — only the avatar was provided as a file — cost if wrong: add the photo if the owner supplies it.
- Ruling: Scania is shown under NFQ Asia without its own dates — the owner gave no dates — cost if wrong: add dates if the owner supplies them.
- Ruling: `info.md` is treated as confirmed — the owner answered the final questions without raising corrections — cost if wrong: re-open discovery for the corrected fields; directions stay revisable until the owner selects one.
- Ruling: B's handshake signature and violet-tinted dark theme are taken as chosen along with B — the owner picked B with no modifications — cost if wrong: swap the signature (they are portable) or retune the dark tokens.
- Ruling: the Quest video uses a click-to-load facade on youtube-nocookie with a styled poster, so no third-party request happens before a click — this matches the no-analytics, privacy-first stance and protects performance — cost if wrong: replace it with a plain link, a trivial change.
- Ruling: the owner's "Name — description" strings render as term and description, and middot strings as real lists; the words are unchanged — this avoids the banned template shapes — cost if wrong: render the strings as given.
- Ruling: numbers use en-US grouping via `Intl.NumberFormat` (2,951) — readability — cost if wrong: trivial.
- Ruling: the engineering and verification contributions run in parallel with `DESIGN.md`, using `directions.md` §3 and §5 as the design input; `DESIGN.md` wins on any conflict at assembly — saves wall-clock time — cost if wrong: a small reconciliation during assembly.

### Plan assembly rulings (2026-09-28)
- **Accepted:** engineering rulings 1–6 (`contrib-engineering.md` §12).
  1. Archivo via `next/font/local`, from a pinned OFL subset including "→".
  2. The theme layer is generated by the design.md parser; prose-only values are hand-mapped and tested.
  3. The toolchain set: TypeScript 6.0.3, ESLint 9.39.5, pnpm 10.34.5.
  4. The résumé is printed by Chromium as a tagged PDF with a hash lock.
  5. Client leaves follow the `*.client.tsx` convention.
  6. Checkpoint 1 comes after Phase 5.
  - Why: verified compatibility and owner-voice fidelity ("→" in the owner's strings). Cost if wrong: see each item's own cost line in contrib-engineering §12.
- Ruling: D1, controls may transition `color`, `background-color` and `border-color` at the feedback token; movement stays `transform`/`opacity` only (`CLAUDE.md` amended) — cheap paint-only feedback that `DESIGN.md` already specifies — cost if wrong: make state changes instant.
- Ruling: D3, `design-lead` amends `DESIGN.md` so labels are ≥ 14 px from 320 px and the wide-drawing threshold matches the table — `DESIGN.md` contradicted its own rule — cost if wrong: none, it is a correctness fix.
- Ruling: D4/D9, the Résumé link renders only once the PDF exists, and the PDF is tagged via Chromium — no dead link, accessible PDF — cost if wrong: generate the PDF earlier.
- Ruling: D6, perf-seo-audit measures JS on the network (budget spec plus the LHCI resource summary); the skill is amended — Next 16 removed build-output sizes — cost if wrong: none.
- Ruling: D7, copy is approved in three batches:
  - C1 (rows 1–4, 6, 7, 11) before Phase 4
  - C2 (rows 5, 8–10, 12, 16) before Phase 6
  - C3 (rows 13–15, 17, the résumé file name and title, the OG alt text, the Résumé size hint) before Phase 9
  - Drafting runs in parallel with the earlier phases.
  - Why: no phase ships unapproved copy. Cost if wrong: a phase waits on the owner.
- Ruling: D8, QA watches the Quest video in Phase 7. A manual English caption track exists. If information is carried only in the picture, the owner supplies a description or it becomes a link-out; we never author one — no invented content — cost if wrong: switch to a plain link.
- Ruling: D10, with a private repository, git tracks everything except `DaiHo Resume.pdf` (never tracked). If the owner picks public, `answer.md` is untracked and the second email is removed from `info.md` first — privacy — cost if wrong: history rewrite, so decide before the first push.
- Ruling: D11, `@google/design.md` is Apache-2.0 per its repository LICENSE, dev-only; `frontend-engineer` confirms in Phase 1 — cost if wrong: replace the linter/exporter.
- **Budgets:**
  - first-load JS ≤ 120 KB gzip per route, of which app-owned ≤ 15 KB (recalibrated in Phase 1 if the framework floor is > 105 KB)
  - fonts ≤ 100 KB; avatar variant ≤ 150 KB
  - LHCI mobile and desktop, `median-run`
  - Why: QA endorsed engineering's stricter numbers. Cost if wrong: a logged recalibration.
- Ruling: Playwright runs chromium desktop and mobile plus webkit mobile, and Firefox desktop for the layout and keyboard specs only — QA's request, at little cost — cost if wrong: drop Firefox.
- Ruling: the plan uses engineering's 13 phases, with QA's P-IDs mapped (P1→1, P2→2–5, P3→6, P4→7–8, P5→9, P6→11, P7→10, P8→12, P9→13) — keeps both contributions traceable — cost if wrong: renumbering.
- Ruling: with hosting deferred (O1), the build keeps engineering's prerendered-Next shape, verified with `next start`; host-specific work stays isolated in Phases 9, 11 and 13 — avoids re-planning, and Vercel needs zero change — cost if wrong: about 1 day of static-export conversion if Cloudflare is chosen.
- Ruling: with no push (O2), the local gate (`pnpm check`, `test:e2e`, `lhci`) is authoritative, and the CI workflow first runs on the first push — the owner's choice — cost if wrong: a CI-only failure surfaces at first push, mitigated by running the same commands locally.
- Ruling: the D3 `DESIGN.md` amendment (plate padding 16 px at base, 240/880-unit authoring, 880 px threshold) needs no owner approval — not a material visual change (md and lg unchanged) — cost if wrong: revert to the previous values.

### Phase 1 rulings (2026-09-28)
- **Owner instruction** (sent to `frontend-engineer` directly and relayed in its report; the owner had resumed that agent from its transcript view): "skip performance budget, scan, seo for now, focus on building porfolio".
  - Logged as a plan change: see implementation-plan → Owner deferral.
  - The privacy scan stays in the gate. It was already built and passing; "scan" is read as "no further scan work". To be confirmed with the owner.
- Ruling: the document `<title>` and meta description move to Phase 4 — WCAG 2.4.2, and the copy is already approved — cost if wrong: none (Phase 11 would wire them anyway).
- Ruling: the framework-floor ruling (133,646 B gzip; brotli 113,872 B) waits until budgets resume. The options on record: recalibrate to floor + 15 KB, or measure brotli — the owner deferred budgets — cost if wrong: none now.
- Ruling: Phase 3 trace rules:
  - site-configuration values (canonical `https://daiho.dev` from Site preferences → Domain; `lang` "en" from Language) go in the allowlist with their `info.md` source
  - structural ids (section ids) are exempt, as non-visible keys marked in the schema
  - Why: they are configuration, not claims about the owner. Cost if wrong: add them to `info.md`.
- Ruling: before the first push, CI must be green. Either Lighthouse is re-enabled and passing, or its CI step is disabled with a logged ruling. Added to the Phase 13 prerequisites — CI doesn't run until a push — cost if wrong: a red first CI run.
- Ruling: Phase 1's QA review runs in parallel with Phase 2. QA is read-only and runs no build or e2e. A Critical finding pauses Phase 2, and Important findings are fixed before Phase 2 closes — the owner asked to "focus on building", and Phase 1 is config-level, so later fixes are cheap — cost if wrong: minor rework in Phase 2.
- Phase 1 verified by the main session (2026-09-28): an independent gate run was green (74/74 unit, a static build, a 0-finding privacy scan, 52/52 e2e). The log is in the scratchpad `phase1-gate.log`. Status: verified; QA review pending.
- Owner decisions (2026-09-28):
  - **Git identity:** `tidi.dev1321@gmail.com`, repo-local (set 2026-09-28; the global setting is unchanged). The earlier commits get their author email rewritten once Phase 2's agent stops. Old hashes in reports are mapped after the rewrite.
  - **Privacy scan:** turned off. Removed from the local gate and CI; the script is kept. Phase 3 gets no separate privacy test; exclusion is structural.
- Was pending: which git identity commits use (now answered above).

### Stop point (owner, 2026-09-28): REACHED after Phase 10
Open for the final checks (awaiting the owner's go):
- **Test suite:** write the lean suite.
- **Checks and reviews:** the full gate; the QA review (including the Phase 2 fix round); content verification; the design check (Checkpoints 1 and 2).
- **Design calls to rule on:**
  - Phase 6: seven small calls
  - Phases 7–8: the botmivivi boundary; the "first 2 months" placement; the Quest label colour
  - Phase 9: the "Quest @ NFQ Asia" label; the avatar's WebP sizes
  - Phase 10: the PDF headings and the rejoined dashes
  - the About bio repetition
- **Before any push:** the CI privacy-scan step.

"stop after finishing phase 10": run Phases 6, 7+8, 9 and 10 back to back, then stop and report. The lean test suite, the final checks and fixes wait for the owner's go.

### Build-mode change (2026-09-28)
- **Owner instruction:** "no need to run every check after each phase. finish all phases and run all checks".
  - Per-phase verification, QA reviews and the mid-build checkpoint are suspended.
  - Phases 4–10 run back to back in fresh-agent chunks (4+5, 6, 7+8, 9, 10), with fast checks only.
  - The full gate, the complete QA review (including re-verifying the Phase 2 fix round), content verification and the design check run once in Phase 12, then fixes.
- Phase 3: done (`docs/reports/phase-03-engineering.md`), including the Phase 2 fix round (I1, I2 and three minors). Its verification is folded into the final checks.
- **Owner action and decision (2026-09-28):** the owner deleted `tests/` (37 files) and the test scripts in `package.json` during Phases 4+5, then chose **"Add tests back at the end"**.
  - Phases 6–10 build without writing tests. Fast checks are static only: design lint, tokens, fonts, lint, typecheck, build.
  - After Phase 10, a lean test suite is written, covering key flows (handshake, theme toggle, menu, skip link, video facade) and accessibility (axe in both themes, keyboard, overflow at key widths).
  - The final checks then run it together with the QA review, content verification and the design check.
  - The deleted tests stay in git history (commits before the deletion).
- Ruling: `info.md` gains three owner-sourced items that the build needs, with no new facts:
  - the owner's section labels (from `profile.md`)
  - the house-rule bold phrases (from `profile.md`)
  - a Quest stack list compiled from the résumé's Quest technologies
  - Why: flagged by Phase 3 as missing, and all are from owner-provided files. Cost if wrong: remove a line.
- Ruling: the About bio stays verbatim, even though it repeats the hero sentence. It is the owner's text and needs no approval; this is flagged for the final design check and the owner's review — cost if wrong: trim with the owner's approval.
- Ruling: Phase 3's concerns (the allowlist matches by value; the file-size formatter moved to Phase 10) and QA minors M3, M4, the focus-ring test and G5 are carried into the Phase 4+5 brief.

### Phase 2 rulings (2026-09-28)
- **Accepted:** `frontend-engineer`'s Phase 2 deviations 1–9 (`docs/reports/phase-02-engineering.md`):
  - Tailwind-namespace supplement names; full theme reset; the trimmed font features (94 KB)
  - the axe test pinning the two content-absence violations until Phase 4
  - lint restrictions beyond §4.3; `@source not` exclusions; the no-`harfbuzzjs` verifier
  - Why: each is explained and verified, with no visual change. Cost if wrong: per-item one-line reverts, noted in the report.
- Ruling: Phase 2's "axe 0 on the shell" moves to Phase 4 — the title and h1 land there — cost if wrong: none.
- **CI privacy-scan step:** still in `.github/workflows/ci.yml`. The permission system blocked the agent's edit because a relayed instruction isn't the owner's approval. The main session will not route around that denial. CI doesn't run before the first push, so it is left as is; resolve it with the owner before any push (Phase 13 prerequisite).
- **Process incident:** during Phase 2 the agent once ran a broad `pkill -f next-server` (around 04:34). That would have stopped any other Next.js server on the machine at that moment; it is surfaced to the owner. Rule added to `CLAUDE.md`, `frontend-build` and `ui-audit`: stop processes by PID only. The global identity is a work address; the choice is `tidi.dev1321@gmail.com` or unchanged. 12 local commits are cheap to rewrite before any push.

## Git history rewrite (2026-09-28)
Owner decision: commits use `tidi.dev1321@gmail.com`. All 27 commits had their author and committer email rewritten from the work address (`git filter-branch --env-filter`).
- Final tree byte-identical; messages and dates unchanged; backup ref removed; nothing was ever pushed.
- Reports written before this date cite the old IDs. Map:

| Old | New | Subject |
|---|---|---|
| 526b80a | 61f03ba | chore: add ignore rules before tracking anything |
| 5d1a550 | 5924e04 | docs: track project inputs, plan, design and agent system |
| 02d1a08 | 76b4ac3 | chore: pin the toolchain and Phase 1 dependencies |
| cc5f14d | fffdd43 | chore: add TypeScript, Next, PostCSS, ESLint and Prettier configs |
| f36ed48 | da5fe14 | feat: add the empty static shell |
| f60253e | 3fae915 | test: add the unit harness and the privacy scan |
| b76cefe | a2efaf0 | test: add the Playwright harness, smoke and budget specs |
| 6f3a8c4 | 4cee7c3 | ci: add Lighthouse CI configs for mobile and desktop |
| bff24fb | 2d4ff6d | ci: add the GitHub Actions workflow, actions pinned to commit SHAs |
| 3205919 | c8ef04a | fix(privacy): match encoded emails in place |
| b984894 | 3415ff3 | test: move the budget spec to pnpm test:budget, deferred by the owner |
| 4f8c11e | 4dcc1f6 | docs: add the Phase 1 engineering report |
| 7fce36e | ebe3877 | docs: record copy approvals, owner deferral and Phase 1 rulings |
| eaace46 | 632e7d9 | fix(lint): catch relative and bare built-in imports in client leaves |
| decdf43 | d4da82b | fix(lint): require content for alt, title and aria text attributes |
| a8655b1 | 4467953 | feat(design): add the design:lint wrapper with a warning policy |
| 02ecbb3 | 765a496 | feat(tokens): generate tokens and the theme from DESIGN.md, with sync checks |
| b3597f8 | 30ab713 | feat(lint): enforce token-only Tailwind classes |
| 2967098 | f001aac | chore(fonts): pin the Archivo variable source and its OFL licence |
| 20c8c26 | e909879 | feat(fonts): subset Archivo, write static instances and the manifest |
| b94f633 | 819b36c | feat(shell): load Archivo with next/font/local and paint the page tokens |
| 47e39ab | 7ebe994 | ci: run design:lint, tokens:check and fonts:check in the checks job |
| 432dda4 | 63dc216 | refactor(fonts): read any numeric feature tag from DESIGN.md |
| 3a5395e | 377f83b | test(e2e): resolve the token files from the spec's location |
| f5a56af | 2de7e17 | docs: add the Phase 2 engineering report |
| 7b4ff2a | f913e77 | docs: record Phase 1-2 rulings, owner decisions and process rules |
| c54e76d | 96bff80 | docs: add the Phase 1 QA code review |

## Restart (2026-09-28)
- **Owner:** "page is too ugly and boring, not trendy. not eyecatching, no 3d animations. please do again, remove all code. also remove performance budgets, Lighthouse, SEO and the privacy scan out of this project, update the plan".
- **Then:** "nên đảm bảo clean, modern, phù hợp phong cách Developer, cần thêm nhiều animations, 3d để làm website sinh động, thu hút, follow RPG game style".
- **Done:**
  - all code removed (commit "chore: remove all code…"); `ava.PNG` restored to the root
  - the `perf-seo-audit` skill deleted
  - `CLAUDE.md`, the agents and skills updated (the out-of-scope items removed; rich motion and 3D allowed; RPG game style)
  - `info.md` visual style updated
  - the old plan and Direction B marked superseded
- **Next:** `design-lead` proposes new directions with previews, and the owner selects. Then a new `DESIGN.md`, a new plan and the build.
- **Directions v2:** delivered and verified by the main session (screenshots reviewed). **The owner selected B · Holo Deck (2026-09-28)**, with the decisions recorded in `directions-v2.md` §12 and in `info.md` → Approved copy.
- **Next:** a new `DESIGN.md` (`design-lead`) plus the plan contributions (`design-lead`, `frontend-engineer`, `qa-reviewer`) in parallel. The plan is then assembled and needs the owner's approval.
- **Plan v2 approved by the owner (2026-09-28).** Phase 1 started.
- **v2 Phase 1 (Foundation) done (2026-09-28):** gate green, 8 commits `f7e1597`–`387a317`, report `docs/reports/v2-phase-1.md`. Rulings (main session):
  - Mona Sans subset renamed internally (OFL Reserved Font Name "Mona"); visuals unchanged. `OFL.txt` stays with the files.
  - `stat-value` `tnum`: Chakra Petch has no `tnum`, so digits stay proportional. Logged for the Phase F design check.
  - THREE.Clock deprecation warning: its source is noted in Phase 2. Phase 6 allowlists that exact warning only if no upgrade removes it.
- **v2 Phase 2 (Shell and Holo hero) started.**
- **v2 Phase 2 (Shell and Holo hero) done (2026-09-28):** gate green, commits `d6c2870`–`f7c85b5`, report `docs/reports/v2-phase-2.md`, screens `docs/reviews/v2/phase-2/screens/` (reviewed by the main session). Logged for F:
  - the focus ring is rectangular and doesn't follow the chamfer
  - Deck canvas edges are feathered to hide a Bloom seam
  - the verdict `<output>` has no explicit `role="status"`
  - `DESIGN.md` §voice says "used only where he used it": the owner's pronouns aren't stated, so `design-lead` changes it to neutral wording in F
- **v2 Phase 3 (Quest journal) started.**
- **v2 Phase 3 (Quest journal) done (2026-09-28):** gate green, commits `6ed3c47`–`d255783`, report `docs/reports/v2-phase-3.md`, screens `docs/reviews/v2/phase-3/screens/` (reviewed by the main session).
  - Ruling: the "Quest unlocked" toast stays `aria-hidden` (per `DESIGN.md`). An announcement goes to the live region only on activation, never on scroll. Why: announcing on scroll interrupts screen-reader users with repeated, decorative noise. Cost if wrong: small; QA can flip it in F.
  - Ruling: Motion isn't installed while CSS covers the effects (YAGNI). Phase 4 may add it if scroll motion needs it, and must say why in its report. Cost if wrong: one install later.
- **v2 Phase 4 (Remaining sections and scroll motion) started.**
- **v2 Phase 4 (Remaining sections and scroll motion) done (2026-09-28):** gate green, commits `5b374c3`–`d6cecec`, report `docs/reports/v2-phase-4.md`, 60 screens (git-ignored, as before; full-page capture reviewed by the main session).
  - Ruling: the power-on wipe uses a cover layer instead of clip-path on the panel. Why: IntersectionObserver never fires for a panel clipped to nothing (1 of 19 revealed, against 19 of 19 now). `design-lead` updates the `DESIGN.md` Motion table in F. Cost if wrong: none visible.
  - Ruling: no 3 s timeout reveal; panels hide only while the observer is running. Why: it fails open. Cost if wrong: none.
  - Ruling (fix in F): the speaker tag must not uppercase "TiDi". The owner's name keeps its casing everywhere (`info.md`), so the tag uses a non-uppercase label style.
  - Logged for F: the level-up sweep plays once per page load, not once per visit. Acceptable unless `design-lead` objects.
- **v2 Phase 5 (Résumé PDF and links) started.**
- **v2 Phase 5 (Résumé PDF and links) done (2026-09-28):** gate green, commits `972b79a`–`c9210e2`, report `docs/reports/v2-phase-5.md`. Main session checked: both PDF pages viewed (no phone, [private], reference, availability, travel or photography); the embedded fonts are ChakraPetch and PortfolioSans (0 "Mona"); `DaiHo Resume.pdf` is still ignored and untracked.
  - Ruling: interests and the Daniel, Guild, XP and Passive rows stay out of the PDF. Why: no approved PDF label exists, and we don't invent copy. Cost if wrong: the owner can approve a label later.
  - Logged for F: the PDF's "Term – description" separators are en dashes we wrote (the voice rule forbids them in our UI copy). Change to a colon, or rule.
- **v2 Phase 6 (Lean test suite) started.**
- **v2 Phase 6 (Lean test suite) dropped by the owner (2026-09-28):** the owner told the agent "skip test" mid-phase, then chose "Discard all test code". Uncommitted test files and dependencies were removed (Playwright stays; it was already a dependency, for screenshots). `CLAUDE.md` updated: automated tests are out of scope, and the gate is `pnpm check && pnpm build`. Owner: "Fix all 3" of the bugs the partial suite found, in F:
  1. the hero is blank for about 2 s after WebGL context loss (the poster should show at once)
  2. Space doesn't activate "Watch Quest by NFQ" (it's a link; it should be a button, or handle Space, per spec)
  3. a missing `/favicon.ico` logs a 404
- Gate re-run fresh by the main session after the removal: `pnpm check` and `pnpm build` both green (static).
- **Phase F started.**
- **F · design check (design-lead): SIGN-OFF WITH CHANGES.** Report `docs/reviews/v2/final/design-check.md`; `DESIGN.md` updated (lint 0/0; the 52 contrast pairs unchanged). Rulings: `tnum` dropped from `stat-value`; the square focus ring and the Deck feather accepted; the speaker tag uses `nav` type (names never uppercase); level-up once per load accepted; the power-on is a translateX cover (documented); the voice line is now neutral. Visual changes V1–V10 (5 Important, 5 Minor), all within direction B, so no owner approval is needed.
  - Correction: the résumé separators are the owner's own em dashes, verbatim from `info.md` (lines 163, 171, 174), so they stay. The Phase 5 "logged for F" note was wrong.
  - `DESIGN.md` front matter changed, so `frontend-engineer` must run `pnpm tokens` first in the fix round.
- **Owner (2026-09-28): "can we change the font? make it like rpg game style".** This is a material design change, so it needs the owner's choice. `design-lead` is preparing 3 RPG font options (retro pixel, fantasy, game HUD), with Vietnamese and licence checks, a preview page `docs/design/font-options.html`, and screenshots. The fix round waits for the owner's pick so the font change and the F fixes land together.
- **F · QA review (qa-reviewer): FAIL** (0 blocker, 3 major, 11 minor). Report `docs/reviews/v2/final/qa-review.md`, 79 screens. Gate green fresh; axe 0 violations in 44 runs; content verification clean.
  - Major: F1 the hero is blank for about 2 s plus a 1.2 s fade after context loss; F2 below 1280 px, focus escapes behind the open menu sheet; F3 the Mission log links "CyberRock" and "Quest" are 18 px high (target 44 px).
  - The verdict `<output>` and the PDF dashes are not defects.
  - The fix round (QA majors and minors plus design V1–V10 plus the owner's 3 bugs) waits for the owner's font pick.
- Ruling: start F fix round 1 now instead of waiting for the font pick. Why: the fixes don't depend on the font, and the font preview only touches `docs/design/font-options*`. Cost if wrong: small; the font swap is a separate follow-up task. Fix round 1 was dispatched (report `docs/reports/v2-fix-1.md`).
- **Owner selected font option A · Cartridge (2026-09-28):** Galmuri11 2.403 (OFL, retro pixel, one weight) for the wordmark, brand, headings, HUD, labels, stats, role, buttons, nav and speaker tag. Portfolio Sans stays for body text and names. Options: `docs/design/font-options.md` and `.html`.
  - Ruling: use the designer's 12 px pixel grid for buttons and nav (crisp multiples of 12). Why: it reads well at 1× and 2× in the screenshots. The owner can ask for a 24 px CTA later. Cost if wrong: one token change.
  - Ruling: the Galmuri subset is renamed internally (OFL Reserved Font Name "Galmuri"), as with Mona Sans.
  - For QA: "Customers" may overflow its stat cell at 320 px (flagged by `design-lead`).
  - Sequencing: after fix round 1, `design-lead` updates `DESIGN.md` for A, then `frontend-engineer` swaps the font; then QA and a design recheck.
- **F · fix round 1 done (2026-09-28):** 26 commits `47e6ecd`–`8d93d63`, report `docs/reports/v2-fix-1.md`. F1–F14 and V1–V10 fixed; gate green fresh; axe 0 in 12 runs; no horizontal scroll at 320–1920 px. Extra fix: a stale camera matrix that pinned the HOST and CHIP tags too high in reduced motion.
  - Ruling (F11): accept the upstream `THREE.Clock` deprecation warning. Why: R3F 9.8.1 is the latest stable, the warning is harmless, and there are no automated tests to guard against it. Cost if wrong: console noise only.
  - For `design-lead`, together with the font update: the 2 px holo edge shows as a line while a panel waits for its wipe; the Join party brackets show at every width; confirm the "T" favicon mark.
- **Font A design update done (design-lead):** `DESIGN.md` uses Portfolio Pixel (the Galmuri11 2.403 subset, renamed) on a 12 px grid; `tnum` restored; hard `shadow-pixel` for the brand; lint 0/0; 54 contrast pairs pass. Handoff `docs/design/font-a-handoff.md`. Rulings: the power-on edge shows only while moving; the Join party brackets from `lg` only; a pixel "T" favicon. Changes made within A, accepted by the main session as not material: ▸ ▼ ▲ as pixel glyphs; the ghost border at 1 px; the Lab brand shadow at 20 %; the botmivivi stat grid stacks below 375 px.
- **Owner (2026-09-28): the résumé PDF uses the plain font only** (Portfolio Sans for all text; no pixel type). `design-lead` records it in `DESIGN.md` at the recheck.
- **Owner (2026-09-28): "All text pixel".** They saw the hero sentence still in the body font and chose to put every piece of site text in the pixel font (body may go up one step for readability); the résumé PDF stays plain. The font-A engineer was told to finish the current scope and hand back. `design-lead` is writing the all-text spec (`docs/design/font-a-all-text.md`), then applies it to `DESIGN.md` after the engineer hands back. An engineer follow-up implements it.
- **All-text-pixel design done (design-lead):** `DESIGN.md` puts all site text in Portfolio Pixel (`body` 12/24, `body-compact` 12/20, `name` 24/40; measures 56ch and 50ch); Portfolio Sans is dropped from the site and kept for the résumé PDF (`print-*` tokens); Galmuri14 rejected (40/134 Vietnamese). Lint 0/0; contrast passes. Handoff §8 in `docs/font-a-handoff.md`.
  - Ruling: body stays at 12 px (its x-height is about that of a 16 px sans; 24 px would give 20–35 characters per line in the panels). Why: the owner allowed a step up but didn't require it. Cost if wrong: one token change if the owner wants it bigger.
- **Font A (all text pixel) implemented (2026-09-28):** commits `bebeb8e`–`d53f375`, report `docs/reports/v2-font-a.md`. Every site text node is "Portfolio Pixel Regular" (DOM check at 320, 375 and 1440 × both themes; whole-pixel sizes; no overflow; 0 console errors). The PDF is PortfolioSans only, and the privacy grep is clean. Gate re-run fresh by the main session: green.
  - Ruling: the string "Galmuri11" inside the bundled tokens JSON (`holo/scenes/palette.ts`) is accepted. Why: the OFL Reserved Font Name rule concerns the name of the modified font, not a metadata string; the served font and CSS names are "Portfolio Pixel". Cost if wrong: trim the JSON import later.
  - A stray server on :3600 (PID 92008) isn't this agent's; likely left by the stopped font agent. Left alone.
- **Next:** a lean QA re-check (fix round 1 plus font A; no screenshots), then the final report.
- **Owner (2026-09-28): "skip qa-check"**; write a simple README with a full-page screenshot, stating that this is a playground built entirely by AI in the owner's leisure time; commit; create a GitHub repo "portfolio". The owner chose **public, with [private email removed] scrubbed from all history** before the first push. Done: `README.md` plus `docs/screenshot.png` (1440 dark, full page); history rewritten with `filter-branch` (13 files, 21 lines); 0 revisions contain the address; a pre-scrub bundle is kept in the session scratchpad. The commit hashes listed above predate the rewrite.
- **Owner (2026-09-28): the Quest journal becomes 3 game cards** instead of stacked files you scroll through, with the active CyberRock highlighted. Chosen layout: "Card row + detail panel": 3 cards side by side; picking one shows its full details and hologram in one panel below; CyberRock is selected by default and glows as the active quest; the cards scroll sideways on phones. This overrides plan v2's "files all visible, no hidden tabs" ruling. Also done today: term descriptions and bullets on one line (`ce02841`, `6599a96`; not pushed).
- **Quest cards design done (design-lead):** `DESIGN.md` updated (tokens `quest-card*`, `success-wash`, `swap` 320 ms; `mission-item` and `flip` removed); lint 0/0; 59 contrast pairs pass. Handoff `docs/design/quest-cards-handoff.md`. Active = green edge, strip and aura; selected = 2 px gold edge plus "▸"; scan-cover swap (instant with reduced motion); "Quest unlocked" only when the visitor selects; no-JS stacks all panels; Mission log links select the card.
  - Ruling: the Quest card stat shows "~300" with the verbatim caption "users in Ha Noi, Da Nang, Sai Gon, Can Tho" and no separate "USERS" label. Why: it avoids repeating "users" without editing approved copy. Cost if wrong: one label.
  - Ruling: the handoff's "verbatim-rejoin test" becomes a Zod `refine` in the content schema (fails the build), not a test file. Why: automated tests are out of scope. Cost if wrong: none.
- **Quest cards built (2026-09-28):** commits `5a0dedd`, `62cdc21`, report `1d60f37` (`docs/reports/v2-quest-cards.md`). DOM and keyboard script passed 95/95 (all 10 handoff checks).
  - Ruling: exempt `role="tabpanel"` from `jsx-a11y/no-noninteractive-tabindex` (the WAI-ARIA tabs pattern gives panels `tabindex="0"`; the plugin's recommended preset does the same). Why: option (b), `tabIndex={-1}`, would stop Tab from reaching the panel. Narrow: only this role. Cost if wrong: none. The gate is green fresh (main session).
  - Logged: `DESIGN.md` still lists the removed `project` 700 ms token; cards fill their 4-column cell from `md` instead of the 312 px cap. `design-lead` syncs these at the next design touch.
