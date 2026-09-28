# v2 Phase 3 · Quest journal: engineering report

> `frontend-engineer`, 2026-09-28. Plan: `docs/plan/v2/implementation-plan.md` → Phase 3, as ruled: every file visible and stacked, with no tabs.

**Status: DONE_WITH_CONCERNS.** The gate is green and every acceptance criterion has evidence. The concerns are three calls for the main session: the live-region reading, Motion not being added, and the count-up's rAF. None of them blocks Phase 4.

## Commits (local, on `main`)
| Commit | What |
|---|---|
| `6ed3c47` | refactor(holo): the chip (`chip.ts`), cone material, canvas config and context-loss hook, taken out of the hero so the quest scene shares them. The hero renders the same (compared against the Phase 2 capture). |
| `14ce2db` | feat(content): Quest's body becomes `kind: "achievements"`, each achievement with a structural icon (wall, stopwatch, key, tool). botmivivi's usage leaves the facts rows and becomes `usageReadout()` (the stat readout). No text changed. |
| `ed8366a` | feat(video): the v1 facade, restyled to DESIGN.md's 48 px `video-facade` with its caption. It is a real link to the watch URL; a plain click swaps in the youtube-nocookie player and focuses it. |
| `f7439c9` | feat(quest-journal): the section, the stacked files, the mission list, the quest projector (chip, ledger stack, data slabs) with CSS posters, "Quest unlocked", the count-up, the icons, and `quest.css`. |

## What was built
- **Section `#quest-journal`**: the h2 "Quest journal" (registry label), so the nav link `/#quest-journal` now lands.
- **Layout:**
  - **From `lg`:** the left 5 columns hold a sticky 4:3 hologram viewport and the mission list; the right 7 hold the three files.
  - **Below `lg`:** the files stack, each opening with its own 16:10 band (at most 320 px), and there is no mission list.
- **Quest files** (CyberRock, botmivivi, Quest @ NFQ Asia): an `<article>` each, with:
  - status chip, `h3` (`tabindex="-1"`), one-liner
  - facts `dl`: Role, When, Team, Scale, Users, Stack, present rows only
  - botmivivi only: the stat readout
  - the body: bullets, or terms as a `dl`
  - Quest only: Party lead (h4), then Achievements unlocked (h4, four badges)
  - the `a11y.steps.*` list in the log style
  - Quest only: the video facade
- **Holograms:**
  - one R3F scene (`quest-scene.tsx`): the small projector (base r 1.4, two rings, cone), FOV 30
  - the models: CyberRock (the shared chip at 0.7 scale, with its scan ring), botmivivi (five 1.6 × 0.08 × 1.1 slabs, gap 0.12, turning at 0.2 rad/s), Quest (v1 wireframe at 40 % and a solid v2 slab, a curved path, four packets on a 4 s loop, and the aria-hidden "v1" and "v2" tags)
  - pointer tilt of ±0.15 rad, fine pointers from `lg` only; no bloom
- **Loading and pausing:**
  - Only the stages of the layout on screen mount a canvas, and only once within about one viewport (`use-near.ts`).
  - The frameloop is `always` on screen, `demand` with motion off, and `never` off screen or in a hidden tab.
  - Posters: CSS-only, one per model, both themes. They are the fallback for missing WebGL, a render error, or a lost context.
- **"Quest unlocked":**
  - **Trigger:** a file becomes current when it crosses a band 40–45 % down the viewport. A band, so tall files still qualify. Activating its mission item also makes it current.
  - **Motion on:** over `project`, the old model scales to 0.6 and fades, a scan sweep crosses the cone, and the new model scales 0.6 → 1 (ease-back). The file's status chip flips (`rotateX`, `flip`). The toast wipes in, holds 1600 ms, and fades out.
  - **Achievements:** the badges wipe on with a glint the first time Quest is current.
  - **botmivivi:** its figures count up on first view (`count`).
  - **Motion off:** the model cuts, the toast fades in and out (`feedback`), and the figures show at once.
- **Mission list** (`lg`): in-page links. The current item gets `aria-current="true"` and the 3 px state bar. Activation:
  - scrolls to the file (instant with motion off)
  - focuses its h3
  - pushes the hash
  - holds scroll-driven changes until `scrollend`, so the files it passes don't unlock
  - without JavaScript, it is a plain anchor

## Evidence (fresh, on the final tree, Node 24.21.0, pnpm 10.34.5)
- `pnpm check` → exit 0:
  - `design:lint … passes: 0 errors, 0 warnings`
  - `tokens:check: the 2 token files match`
  - `fonts:check: the 6 font files match` and `all 123 characters of 27 files … are in all 3 font files`
  - eslint 0 problems; `All matched files use Prettier code style!`; typecheck exit 0
- `pnpm build` → exit 0, with 0 lines matching warn or error in the log. `○ /` and `○ /_not-found` are both static.
- **Raw-value grep** (hex, px, rem, ms, vw, em, rgb and hsl in the changed `src/*.ts(x)`):
  - Two hits, both IntersectionObserver `rootMargin` strings (`"100% 0px"`, `"-40% 0px -55% 0px"`). They are observer geometry, not design values.
  - One hit in a comment.
  - `'use client'` appears only in `*.client.tsx`.
- **Manual pass:** Playwright (headless Chromium shell, Metal GPU) against my own `next start` on :3113, run after the final build.

## Acceptance
- ✅ **Static gate green** (above).
- ✅ **Screenshots** in `docs/reviews/v2/phase-3/screens/` (git-ignored):
  - `journal-{375,1440}-{light,dark}-motion-{on,off}.png`: the whole section, after each file had become current once. At 375 all three bands are live.
  - `nowebgl-1440-dark.png` and `nowebgl-375-light.png`: run with `--disable-webgl --disable-3d-apis`. 0 canvases, the scene chunk never requested (8 chunks), posters in every stage.
  - extras:
    - `unlocked-1440-{dark,light}-motion-on.png`: Quest selected from its mission item; toast mid-hold, focus ring on the h3, models swapped
    - `unlocked-1440-dark-motion-off.png`: the cut and the fading toast
    - `unlocked-375-{dark-motion-on,light-motion-off}.png`: the toast in the botmivivi band
    - `nojs-375-dark.png`
- ✅ **JavaScript off, content complete:**
  - All 3 articles are visible, with h3, facts (5, 10 and 5 terms) and steps (4, 2, 3).
  - The mission links point to `#quest-cyberrock`, `#quest-botmivivi` and `#quest-quest`.
  - "Watch Quest by NFQ" is a link to the watch URL. 0 iframes.
  - Every stage shows its poster.
- ✅ **Scenes pause off screen** (`data-frameloop` on each `[data-holo-stage]`):
  - At the top: hero `always`, every quest stage `never`.
  - In the journal: hero `never`, viewport `always`.
  - Back at the top: viewport `never`.
  - Draw calls in 1 s at the top: hero 2,760, quest 0.
  - With motion off: `demand`.
  - Hidden tabs use the same `visibilitychange` path as the hero; not exercised headless.
- ✅ **Keyboard order is logical; focus is never hidden:**
  - At 1440, Tab order: skip link → TiDi → nav (5) → Motion → Dark theme → CTA → Run → Counterfeit → the 3 mission items → "Watch Quest by NFQ".
  - At 375: … → Menu → CTA → Run → Counterfeit → "Watch Quest by NFQ".
  - For every focus stop in the journal, `elementFromPoint` at its centre hit the element itself (not the canvas, stage or header), with top ≥ 60 px: 0 problems at both widths.
  - Enter on a mission item focuses the h3 (outline visible), and `aria-current` moves.
- ✅ **0 console errors or hydration warnings**, except the known `THREE.Clock` warning (R3F 9.8.1's store; 38 across the matrix run, one per canvas mount).
  - All runs were in production. React reports hydration mismatches there as console errors, and there were none.
  - I did not start `next dev`: PID 6878 already serves this repository on :3000, and a second dev server would share `.next`.
- ✅ **No YouTube request before activation:**
  - All `youtube|ytimg|googlevideo` requests were intercepted: 0 before the click.
  - After the click: one request, to `https://www.youtube-nocookie.com/embed/yLJZXvO_ARU`. The iframe's title is "Quest by NFQ", and it has focus.
- ✅ **Every visible fact maps to `info.md`.** Checked against the accessibility tree of `#quest-journal`:
  - **Names, statuses, periods:** Projects headings and `format.period`.
  - **One-liners:** Projects → One line, the profile's first phrase.
  - **Roles, team, scale:** Projects and answer.md. CyberRock's role is the profile's middot list.
  - **Users:** `quest.users`.
  - **botmivivi figures:** `botmivivi.facts` in its order. Labels Users, Customers, Orders, Impact; "in the first 2 months". The purchase receipts and import/export figures aren't shown.
  - **Stacks:** Projects → Stack.
  - **Bullets, terms, Party lead and achievements:** verbatim from the profile. Heading "Achievements unlocked" (`ui.small-labels`).
  - **Steps:** `a11y.steps.cyberrock`, `.botmivivi` and `.quest`.
  - **Tags:** "v1" and "v2" (Quest facts).
  - **Toast:** `toast.quest-unlocked` plus the quest's name.
  - **Video:** `video.name` and `video.caption`; the title "Quest by NFQ" (info.md).
  - **Facts labels:** Role, When (`ui.profile-labels`); Team, Scale, Stack (`ui.small-labels`).
  - No string was written by me.
- ✅ Also: no horizontal overflow at 320 px or 375 px.

## Deviations
1. **The live region.** DESIGN.md makes the toast `aria-hidden`, but the plan's Phase 3 says "the toast with its live region" and "the toast announces". A persistent polite `<output class="sr-only">` announces "Quest unlocked {name}" **only when a mission item is activated**. Scroll-driven unlocks stay silent, as DESIGN.md wants, so nothing chatters. Mission items exist from `lg` only, so on mobile nothing is announced.
2. **Motion (`motion` 13.4.4) was not added.** The plan scoped it to the tab swap (`AnimatePresence`), which the ruling removed. The toast, chip flip, badge wipe and glint are CSS keyframes, restarted by React `key` or by `data-current`. This is one fewer dependency. The ESLint Motion boundary stays in place for later.
3. **The count-up uses `requestAnimationFrame`** in `count-up.client.tsx`. It is cleaned up and runs once per figure, for 900 ms. contrib-engineering §5.4 says "no rAF outside useFrame", in its 3D-pausing section. I read that as scoped to scenes. If it isn't, the alternative is Motion's `animate`.
4. **Refactor of Phase 2 files** (commit `6ed3c47`). The chip, cone shader (now with a height uniform), DPR and GL config, and the context-loss handler moved into shared modules, per the file map's "the chip is shared with the hero". The behaviour is unchanged; the hero was checked visually and autoplay still ends "genuine".
5. **Content model:** Quest's body `kind` is `achievements`, with structural icon ids, so the icons follow the achievements if the owner reorders them. `FactRow.qualifier` was removed because nothing used it.
6. **Quest hologram geometry** follows DESIGN.md's sizes. Camera, positions and the path apex are my tuning (Known Gaps 5, "starting points"): camera (0, 3, 7) looking at (0, 1.2, 0); models at y 1.5; each model yawed −0.6 rad for the three-quarter view. The v1 and v2 tags sit under their slabs.
7. **The steps list has no heading**, and the bullets have none, as DESIGN.md says. `body.heading` ("What I built" / "What it does") stays in content, unused.

## Concerns and open questions
1. **Deviation 1 needs a ruling:** keep the selection-only announcement, drop it (pure DESIGN.md), or announce scroll unlocks too (the plan's wording, at the cost of chatter).
2. **Glow and contrast over 3D:** the toast is glass at 92 % over the canvas, and axe can't read canvas pixels (Review Focus 1). Worth QA pixel sampling in F.
3. **WebGL contexts on mobile:** up to four (the hero and three bands) once the visitor has scrolled the whole journal. Each band pauses off screen, but contexts stay alive. If WebKit shows context loss in Phase 6, the fallback is drei `View` over one canvas (contrib-engineering "Ideas").
4. **`data-frameloop` on a stage without a canvas** (no WebGL, or the other layout's stage) still reports the loop it would use. The hero does the same. QA should read it together with `data-holo-state`.
5. **The first "Quest unlocked" fires for CyberRock** when it first reaches the band: the viewport shows CyberRock before then, and the model projects in again. That's intended as the journal's opening reward, but design-lead may prefer no toast for the first file.
6. **The quest heading `h3`s are focusable** (`tabindex="-1"`, so not in the Tab order) so the mission item can move focus there.
