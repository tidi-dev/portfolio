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
| 2 Tokens and fonts | in progress (2026-09-28) | |
| 3 Content layer | pending | |
| 4 Shell and hero | pending | |
| 5 Sheet anatomy and CyberRock, then Checkpoint 1 | pending | |
| 6 Handshake | pending | |
| 7 Remaining sheets and video | pending | |
| 8 Remaining drawings | pending | |
| 9 Remaining sections | pending | |
| 10 Résumé PDF | pending | |
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
