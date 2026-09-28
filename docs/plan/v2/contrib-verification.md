# Plan contribution v2: verification

> Author: `qa-reviewer`, 2026-09-28, for the v2 implementation plan (`implementation-plan` skill, verification section). Decisions only, no code bodies.
> **Inputs:** `CLAUDE.md` (updated 2026-09-28) · `info.md` (Approved copy incl. v2 rows) · `docs/design/directions-v2.md` §3, §5, §7, §11, §12 (B · Holo Deck, selected 2026-09-28) · `directions-v2-preview.html`. `DESIGN.md` v2 is being written in parallel: where this file names a visual rule, `DESIGN.md` wins once approved, and the check follows it.
> **Owner build mode:** no per-phase QA. All build phases run first; then the lean test suite (phase T); then one round of final checks (phase F); then fixes (phase X). The acceptance criteria in §3 are written now and checked in F.
> **Out of scope (owner):** performance budgets, Lighthouse, SEO checks, the privacy scan. None appear below. The DPR cap and the off-screen pause in §1.2 are the directions' 3D correctness rules, asserted as behaviour, not as budgets.
> **Tool versions** (`npm view`, 2026-09-28; engineering owns the final pins): `@playwright/test` 1.63.0 (Apache-2.0), `@axe-core/playwright` 4.13.0 (MPL-2.0), `vitest` 5.0.2 (MIT).

## Summary for assembly
- **Suite (phase T):** one Vitest file for the handshake state machine, and about ten Playwright specs against the production build: handshake, theme, mobile menu, skip link, video facade, résumé link, axe, keyboard, reduced motion and complete content, overflow, WebGL fallback, and mobile 3D.
- **Final checks (phase F), in order:** gate → code review → UI audit (with the screenshot set) → content verification → design check. Then one consolidated fix list, and a scoped re-check (at most 2 rounds).
- **Review Focus:** text over 3D losing contrast; motion that ignores reduced motion or hides content; WebGL failure leaving a blank hero; mobile GPU and touch (DPR, off-screen loop, drag hijacking scroll); focus hidden behind the canvas or the fixed HUD.

---

## 1. The lean test suite (phase T)

### 1.1 Tools and harness decisions
| Decision | Choice | Why |
|---|---|---|
| Unit | Vitest, one file: the handshake state machine | It is the one piece of pure logic, shared by the 3D scene and the HTML log. Everything else is proven in the browser |
| E2E and accessibility | Playwright + `@axe-core/playwright` | Real browsers, keyboard, emulated media, WebGL stubbing |
| Target | The production build served locally (Playwright `webServer`), never the dev server | Matches what ships; dev-only warnings are noise |
| Projects | `desktop`: Chromium 1440 × 900. `mobile`: WebKit 375 × 812, `isMobile`, `hasTouch`, DPR 3 | Chromium covers everything; WebKit at DPR 3 is the closest local stand-in for the iPhone GPU path and touch. No Firefox: lean |
| Themes | A fixture runs every UI spec twice, `colorScheme` light and dark | Both themes are real designs (Deck, Lab), not inversions |
| Motion | `reducedMotion: 'reduce'` per spec where stated; default is motion on | |
| Locators | By role and accessible name, using the approved strings from `info.md`. One stable hook is allowed: the hero stage container (name agreed with engineering) | Tests prove what a visitor and a screen reader get, and survive refactors |
| Handshake state | Read only from the HTML: the step list and the `<output role="status">` | The canvas is `aria-hidden`; the HTML is the contract |
| Waiting | On state (text, `aria-*`), never fixed sleeps. A ceiling per wait derived from the `DESIGN.md` motion tokens (boot + autoplay delay + sequence, plus 2 s) | Animation timing is not flaky if you wait on the result |
| Canvas stillness | Two screenshots of the stage 1 s apart are pixel-identical | Implementation-agnostic proof that the render loop is stopped |
| Guards | A shared fixture fails any test on a console error or warning, an uncaught page error, a hydration warning, or a same-origin response ≥ 400 (except the deliberate 404 visit) | Warnings are findings (`verification`) |
| Guard allowlist | Only exact, known software-GL messages from headless Chromium (for example SwiftShader's software-WebGL notice), in one file, each with a reason | Headless has no GPU; anything else stays a failure |
| Commands | `pnpm test` (Vitest), `pnpm test:e2e` (Playwright). Names final in the engineering contribution | |

### 1.2 Specs
Each row is one spec file. "Both" means both themes via the fixture.

| Spec | Projects | Proves (assertions) |
|---|---|---|
| **unit: handshake machine** | Vitest | Genuine path idle → challenge → response → verdict `genuine`. Counterfeit fails after the challenge → `rejected`, step 2 marked failed. Re-run from a final state restarts cleanly. Toggling Counterfeit mid-run cancels and resets. Reduced mode jumps straight to the final state. The autoplay guard fires once per page load and never again |
| **handshake: auto-play once** | desktop, mobile · both | Fresh load: steps 1 to 3 light in order and the output reads "genuine" within the ceiling. Then it stays final: no second run after twice the sequence time, after scrolling the hero away and back, or after a theme toggle. Autoplay never moves focus |
| **handshake: run** | desktop, mobile · both | "Run the handshake" works by click, Enter and Space. One sequence, one verdict "genuine" in the status output. Pressing it again mid-run gives exactly one final verdict (no doubled or stale verdict) |
| **handshake: counterfeit** | desktop · both | "Counterfeit chip" keeps its label; `aria-pressed` flips false → true. Run: step 2 is marked failed in text or semantics (not by strike-through alone), and the verdict reads "rejected". Toggle off and run again: "genuine" |
| **handshake: reduced motion** | desktop, mobile · both · reduce | No autoplay on load (`behaviour.handshake-autoplay`); the three steps (`a11y.steps.bench`) are visible as text. "Run the handshake" shows the final state within 300 ms, both genuine and counterfeit. The stage is still (pixel-identical over 1 s), and still after a run |
| **theme** | desktop · both | With no stored choice, the theme follows the emulated system scheme. "Dark theme" toggles and `aria-pressed` matches the theme. The choice persists across reload. With a stored choice opposite to the system, the root already carries it at `DOMContentLoaded` (no flash). The stage re-renders in the new theme's palette (stage screenshot differs before and after) |
| **mobile menu** | mobile · both | "Menu" has `aria-expanded` false → true. Nav landmark "Main" becomes visible; its links are reachable by Tab. Escape closes it and returns focus to "Menu". Choosing a link scrolls to the section and closes the menu. At 1440 the nav is visible and "Menu" is absent |
| **skip link** | desktop, mobile · both | The first Tab focuses "Skip to content", which is visible (in viewport, opacity 1, not under the HUD strip). Enter moves focus to `main`; the next Tab lands on the first control inside `main` |
| **video facade** | desktop · both | In the Quest file, a button named "Watch Quest by NFQ" with the caption "Opens the YouTube player." No `iframe` and no request to a YouTube or ytimg host before activation. Click, Enter or Space inserts one titled `iframe` for video `yLJZXvO_ARU` (YouTube routes are stubbed so the run is offline) |
| **résumé link** | desktop · both | Hero "Résumé" and Contact "PDF, {size}" both point to `/tidi-resume.pdf`. The file returns 200 with `application/pdf`. `{size}` equals the served file size in the approved format. Any `target="_blank"` carries `rel="noopener noreferrer"` |
| **axe** | desktop, mobile · both | 0 violations, tags WCAG 2.0, 2.1 and 2.2 A and AA, on these states: home after boot; handshake verdict "genuine"; counterfeit verdict "rejected"; Quest file with the facade; each quest selected; the mobile menu open (mobile only); the WebGL fallback; the 404 page. axe `incomplete` colour-contrast nodes are written to a JSON artefact for the UI audit (they are not a pass) |
| **keyboard** | desktop, mobile · both | A whole-page Tab walk: every stop shows a focus ring (computed outline style not `none`, width at least the `DESIGN.md` focus width); at the centre of each focused element, `elementFromPoint` returns that element or a descendant (not the canvas, not the HUD strip, not a scrim); no stop sits inside the canvas; no trap (the walk returns to the top). Successive stops never move up the page, except into the fixed HUD strip (this catches the mobile CSS `order` swap in the hero) |
| **reduced motion: complete content** | desktop, mobile · both · reduce | After one scroll to the bottom: every section heading and panel is visible, with opacity 1, no clip, and no transform offset. No running infinite animations (`document.getAnimations()`). The hero stage is still. The avatar caption, the quest files and the achievements are all readable. **JS disabled** (one case, both themes): every section heading, the hero text, the handshake steps and the contact links are visible, so no content waits for a reveal script |
| **motion pause** | desktop · both | The visible pause control (named in `DESIGN.md`) stops the hologram: the stage is pixel-identical over 1 s. Pressing it again resumes (the pixels differ) |
| **overflow** | desktop, mobile · both | `scrollWidth ≤ innerWidth` at 375 and 1440 at four moments: mid-boot (500 ms after load), after the verdict, with the mobile menu open, and after scrolling to the bottom (pre-reveal offsets caused a 5 px overflow in the preview) |
| **WebGL fallback** | desktop, mobile · both | (a) An init script makes `getContext` return `null` for `webgl`, `webgl2` and `experimental-webgl`. The hero stage shows the `DESIGN.md` fallback: non-zero size, not blank (more than one distinct colour in the stage screenshot). No uncaught error. "Run the handshake" and "Counterfeit chip" still drive the HTML log to "genuine" and "rejected". axe 0 and no overflow. (b) After load, force a context loss (`WEBGL_lose_context`): the stage either restores or shows the fallback within 2 s; it is never blank, and there is no uncaught error |
| **mobile 3D** | mobile · both | The canvas backing store is at most 1.75 × its CSS size at DPR 3. A vertical swipe that starts on the canvas scrolls the page (drag-to-spin must not trap touch scrolling). With the hero scrolled out of view and reveals finished, `requestAnimationFrame` callbacks over 1 s are ≤ 5 (the loop is paused off-screen) |

### 1.3 Deliberately not in the suite
| Left out | Why | Covered by |
|---|---|---|
| Pixel-diff baselines | Brittle across fonts and GPUs; the owner asked for lean | Screenshot set, reviewed by people in F |
| Contrast of text over the live 3D | axe cannot read canvas pixels | UI audit pixel sampling (§2.1 step 3), fed by the axe `incomplete` artefact |
| Content trace tests | One final verification is enough for a single page | `portfolio-content` D in F |
| Firefox, 768, 1024, 320, 1920 in the suite | Lean | Screenshot set and UI audit in F |
| Per-section entrance tests (wipes, level-up, achievements) | Visual timing, not logic | UI audit motion pass in F |

### 1.4 T phase acceptance
- `pnpm test` and `pnpm test:e2e` exit 0, with 0 failed, 0 skipped, 0 `.only`, 0 retries used, and no warnings beyond the allowlist.
- Each of the 17 rows in §1.2 exists and runs in the stated projects and themes.
- The suite is run twice in a row and passes both times (no flakes).

---

## 2. Final checks (phase F)

### 2.1 Order, proof and pass criteria
All steps run on one frozen commit. `qa-reviewer` writes to `docs/reviews/v2-final/`.

| # | Step | Who | Proves | Pass criteria |
|---|---|---|---|---|
| 1 | **Gate**, run fresh | main session, then `qa-reviewer` re-runs | The build and the suite are green on this commit | lint, typecheck, `pnpm test`, build and `pnpm test:e2e` all exit 0; 0 skipped; no warnings in any output beyond the allowlist. Evidence quoted `command → result line` |
| 2 | **Code review** (`code-review`), the whole codebase against the plan | `qa-reviewer` | Spec compliance (every §3 criterion marked `met` / `not met` / `can't verify`) and quality (server-first, islands dynamically imported, tokens only, canvases `aria-hidden`, effects and render loops cleaned up, no scroll listeners, no `transition: all`, no hardcoded personal facts) | Both verdicts ✅: no Critical or Important findings |
| 3 | **UI audit** (`ui-audit`), full | `qa-reviewer` | The running site matches `DESIGN.md` and the accessibility, responsive and motion bar | 0 Critical or Important findings. Specifically: the screenshot set (§2.2) captured; axe 0 in both themes; a manual keyboard pass and an accessibility-tree snapshot (one `h1`, landmarks, names); 200 % zoom and 320 px reflow; every axe `incomplete` contrast node over the hero resolved by sampling the rendered pixels at the brightest frame (verdict flare, bloom peak), text ≥ 4.5:1 and UI ≥ 3:1 in both themes; each animation matches the `DESIGN.md` motion table; the counterfeit flash and shake stay at or under 3 flashes per second; the generic-pattern checks on rendered text; the checklist applied |
| 4 | **Content verification** (`portfolio-content` D) | `qa-reviewer` | Everything visible is true and traceable | 0 unmatched facts, 0 placeholders, 0 broken links, across the home page, the 404, alt text and captions, accessible names, `<title>` and meta description, and the text of `tidi-resume.pdf`. Every Approved-copy string is verbatim. Absent: the phone number, `[private email removed]`, the reference, any availability status, travel and photography, and any number the owner did not give (no "LVL n", percentages or skill bars; the XP bar is labelled "still leveling" with no number). No em or en dashes in UI copy we wrote |
| 5 | **Design check** (`design-system` critique) | `design-lead` | The build reads as B · Holo Deck and follows `DESIGN.md` | `design-lead` signs off, or lists findings. It uses the screenshot set from step 3, so it can start as soon as the captures exist |

**Why this order:** a red gate makes every later step wasted work; code review finds root causes before the audit reports symptoms; truth outranks taste, so content comes before the design check; the design check reuses step 3's captures.

**Combined verdict:** PASS only if all five pass. `qa-reviewer` merges steps 2 to 4 (and the design findings passed on by the main session) into one fix list, `docs/reviews/v2-final/fix-list.md`, each item with `location — issue — severity — fix direction`.

**Fixes (phase X):** `frontend-engineer` fixes the list in one round. `qa-reviewer` re-verifies only the fixed items, plus a fresh gate. At most 2 rounds, then the main session rules or asks the owner. Minor findings are logged, and they do not block.

### 2.2 Screenshot set
Production build, Playwright, full page unless stated. Stored as `docs/reviews/v2-final/screens/<surface>-<state>-<width>-<theme>-<motion>.png`. "Motion on" captures are taken after boot, the autoplay verdict and one scroll pass, so entrances are finished; ambient motion is live.

| Set | Widths | Themes | Motion | Count |
|---|---|---|---|---|
| Whole page | 375, 768, 1440 | dark, light | on, off | 12 |
| Whole page, responsive only | 320, 1024, 1920 | dark, light | on | 6 |
| Hero, 3D states: boot mid-frame (500 ms), idle after autoplay "genuine", counterfeit "rejected", reduced-motion still, WebGL fallback | 375, 1440 | dark, light | on (reduced still: off) | 20 |
| Quest journal: CyberRock, botmivivi, Quest selected (each hologram), with "Quest unlocked" and achievements visible | 375, 1440 | dark, light | on | 12 |
| Mobile menu open | 375 | dark, light | on | 2 |
| Focus states: skip link, "Run the handshake", "Counterfeit chip", a link beside the canvas, the video facade | 375, 1440 | dark | on | 10 |
| 200 % zoom (at 1440) and 320 reflow of the hero and Quest journal | 1440 at 200 %, 320 | light | off | 4 |

---

## 3. Acceptance criteria per build phase
Checked in F (step 2 marks each; step 3 or the suite supplies the evidence). **The phase cut is provisional:** if the assembled plan cuts differently, each criterion moves with its feature and keeps its ID. Every phase also inherits the Global Constraints.

**B1 · Setup, tokens, fonts**
- B1.1 lint, typecheck and build exit 0; git initialised with conventional commits. *Evidence:* gate output, `git log`.
- B1.2 No literal colour, px, ms or z-index values outside the token source. *Evidence:* raw-value grep with 0 hits.
- B1.3 Chakra Petch and Mona Sans are self-hosted and loaded; `document.fonts.check` passes for both with "Hồ Trọng Đại". *Evidence:* suite log, hero screenshot.

**B2 · Shell: HUD strip, nav, theme, mobile menu, skip link, footer, 404**
- B2.1 The theme, mobile menu and skip link specs pass in both themes.
- B2.2 One `h1`, landmarks (`header`, nav "Main", `main`, `footer`), and `lang="en"` with `lang="vi"` on "Hồ Trọng Đại". *Evidence:* accessibility-tree snapshot.
- B2.3 The fixed HUD strip never covers a focused element. *Evidence:* keyboard spec.
- B2.4 The HUD shows "▸ PLAYER 1", "XP · SYSTEM DESIGN", "LVL still leveling" and "MAX not a thing" at desktop; Player 1 and the XP bar only at mobile; the XP bar has no number. *Evidence:* screenshots.
- B2.5 404: "Nothing here" and "Back to TiDi", axe 0 in both themes.

**B3 · Hero: 3D hologram and handshake**
- B3.1 All handshake specs (unit, auto-play once, run, counterfeit, reduced motion) pass.
- B3.2 The canvas is `aria-hidden` and dynamically imported; with JS disabled the hero text, CTAs and steps are visible.
- B3.3 The WebGL fallback and mobile 3D specs pass (fallback, context loss, DPR cap, touch scroll, off-screen pause).
- B3.4 The motion pause spec passes.
- B3.5 No hero text sits directly on the canvas: it sits on a panel or scrim, and the sampled contrast passes in both themes at the brightest frame. *Evidence:* UI audit.

**B4 · Quest journal**
- B4.1 Selecting a quest updates the quest file and its mini hologram; the status chips read Active, Side, Cleared; details are `dt`/`dd`. *Evidence:* screenshots, accessibility tree.
- B4.2 Each hologram has its text steps (`a11y.steps.cyberrock`, `.quest`, `.botmivivi`) verbatim.
- B4.3 "Quest unlocked" is announced politely (a status region) and never moves focus.
- B4.4 The video facade spec passes.

**B5 · Remaining sections: Mission log, House rules, Inventory, Leveling up, Character stats, AFK, Join party**
- B5.1 The reduced-motion complete-content spec passes, including the JS-disabled case.
- B5.2 Headings "Mission log" and "Join party"; periods in `format.period`; the avatar has `alt=""` with the visible `avatar.caption`.
- B5.3 Contact shows only the opted-in channels (tidi.dev1321@gmail.com, Telegram @tidi1321, GitHub) and "Location"; external links carry `rel="noopener noreferrer"` when they open a new tab.
- B5.4 Level up plays once per visit; panel wipes follow the `DESIGN.md` motion tokens. *Evidence:* UI audit motion pass.

**B6 · Résumé PDF and page metadata**
- B6.1 The résumé link spec passes.
- B6.2 The PDF title is "TiDi, Résumé"; the summary is `hero.sentence`; no phone number and no reference. *Evidence:* content verification.
- B6.3 `<title>` and meta description equal `meta.title` and `meta.description` verbatim (checked as copy only).

**T · Lean test suite** and **F · Final checks:** §1.4 and §2.1.

---

## 4. Review Focus
The five ways a visitor is most likely to get a broken experience on this site, each pinned to where it is caught.

| # | Failure | Why it slips through | Caught by | Phase |
|---|---|---|---|---|
| 1 | **Text over 3D loses contrast**: bloom, the verdict flare, the cone or the light theme's teal wash behind the name, steps or verdict | axe cannot read canvas pixels, and glow peaks are momentary | axe `incomplete` artefact → UI audit pixel sampling at the brightest frame, both themes; B3.5 | B3 |
| 2 | **Motion ignores reduced motion or hides content**: autoplay still runs, the hologram keeps moving, or panels stay clipped because a reveal never fires | Reveals look fine with motion on; a broken observer leaves content invisible | Reduced-motion specs (handshake, complete content, JS disabled), motion pause spec; B3.1, B5.1 | B3, B5 |
| 3 | **WebGL failure leaves a blank hero or crashes the island**: no WebGL, a blocklisted GPU, or a lost context on a phone | Every dev machine has WebGL | WebGL fallback spec (null context and forced context loss); B3.3 | B3 |
| 4 | **The mobile GPU and touch**: DPR 3 backing stores, a render loop that never pauses off-screen, and drag-to-spin trapping vertical scroll | Desktop Chromium hides all three | Mobile 3D spec on WebKit at DPR 3 (DPR cap, swipe scrolls, off-screen rAF count); B3.3 | B3 |
| 5 | **Focus hidden or out of order**: focus under the fixed HUD strip, a canvas or scrim layered over controls, or the mobile CSS `order` swap making Tab jump up the page | Visual order and DOM order diverge only at mobile, and overlays pass axe | Keyboard spec (`elementFromPoint`, monotonic focus order, no stops in the canvas), skip link spec; B2.3 | B2, B3 |

---

## 5. Needs from the other contributions
| Item | Owner | Needed by |
|---|---|---|
| The WebGL fallback visual for the hero stage, and what shows during context loss | design-lead (`DESIGN.md`) | B3 |
| The pause control's name, placement and whether it persists; it must be visible because the hologram's ambient motion runs longer than 5 s | design-lead | B3 |
| The mobile hero order: the hologram shows first while the `h1` stays first in the DOM. Focus order must still move down the page (Review Focus 5), so the handshake controls' DOM position has to match their visual position | design-lead + frontend-engineer | B3 |
| Touch behaviour on the canvas: drag-to-spin may use horizontal drag only, or be disabled on touch, so vertical swipes scroll | design-lead + frontend-engineer | B3 |
| The stable hook name for the hero stage container, and the pnpm script names | frontend-engineer | T |
