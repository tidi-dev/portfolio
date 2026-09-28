# v2 Phase 2 · Shell and Holo hero: engineering report

> `frontend-engineer`, 2026-09-28. Plan: `docs/plan/v2/implementation-plan.md` → Phase 2.

**Status: DONE_WITH_CONCERNS.** The gate is green and every acceptance criterion has evidence. The concerns below are interim states and small spec gaps for the main session and design-lead. None of them blocks Phase 3.

## Commits (local, on `main`)
| Commit | What |
|---|---|
| `d6c2870` | fix(fonts): the Mona Sans subset is served as "Portfolio Sans" (ruling). `pnpm fonts` renames name IDs 1, 3, 4, 6, 16 and 25 before subsetting, and fails if "Mona" appears in any record other than the copyright and licence ones. `OFL-mona-sans.txt` and the copyright record are unchanged. |
| `5fa4bff` | chore(deps): `@tabler/icons-react` 3.48.0 (MIT), `@react-three/postprocessing` 3.1.3 (MIT), `postprocessing` 6.39.5 (Zlib), all checked with `npm view` |
| `4344cce` | feat(shell): head script, noscript style, HUD strip, XP bar, readout, nav, popover menu sheet, Motion and theme toggles, skip link, corner brackets, footer, icons, button links |
| `5a753ae` | feat(handshake): the reducer with the autoplay guard and `settle`, the step schedule, and the motion-token reader |
| `4f9cf99` | feat(hero): lockup and CTAs, the hero stage leaf, the R3F projector, HoloPoster, the error boundary and context-loss fallback, not-found |

## Evidence (fresh, on the final tree)
- `pnpm check` → exit 0:
  - `design:lint … passes: 0 errors, 0 warnings`
  - `tokens:check: the 2 token files match`
  - `fonts:check: the 6 font files match` and `all 123 characters … are in all 3 font files`
  - eslint 0 problems; `All matched files use Prettier code style!`; typecheck exit 0
- `pnpm build` → exit 0 with no warnings. `○ /` and `○ /_not-found` are both static.
- **Raw-value grep** (hex, px, rem, ms, vw, em, rgb or hsl in `src/*.ts(x)`): 0 hits, apart from one comment. `'use client'` appears only in `*.client.tsx`.
- **Manual pass:** Playwright against `next start` in headless Chromium (Metal GPU), run again after the last commit.

## Acceptance
- ✅ **Static gate green** (above).
- ✅ **Screenshots** in `docs/reviews/v2/phase-2/screens/` (git-ignored):
  - `hero-{375,1440}-{light,dark}-motion-{on,off}.png`
  - `nowebgl-1440-dark.png` (run with `--disable-webgl --disable-3d-apis`)
  - extras: `contextlost-1440-dark.png`, `nojs-375-dark.png`, `menu-375-dark.png`, `rejected-1440-light.png`
- ✅ **Autoplay runs once:**
  - The stage goes live about 600 ms after load. Autoplay starts 1.41 s later (boot 1200 ms plus the 200 ms delay), then each leg takes 1004 ms.
  - The `<output>` held only "genuine" during autoplay, so nothing was announced.
  - It did not replay after a theme toggle, scrolling away and back.
  - It does not run under `prefers-reduced-motion` or with Motion off.
- ✅ **Run and Counterfeit:**
  - Run → verdict text `""` then `genuine`, steps `lit,lit,lit`. Run has `aria-disabled="true"` during the run.
  - Counterfeit (`aria-pressed="true"`) then Run → `""` then `rejected`, steps `lit,skipped,lit`, step 2 in `<del>`.
  - With motion off, the run is instant.
- ✅ **JavaScript off, the page is complete:**
  - h1 "TiDi | Hồ Trọng Đại | Dai Ho Trong", the sentence, the full log with "genuine", the footer.
  - The only visible button is Menu. It is a native popover and opens with all 5 links. All 4 `data-js-control` elements are `display: none`.
- ✅ **The canvas pauses:**
  - Off screen: `data-frameloop="never"`, 0 draw calls per second.
  - Paused with Motion: `demand`, 0 draw calls per second. Reduced motion: `demand`, 0.
  - On screen with motion on: about 1,740 draw calls per second.
  - Hidden tabs use `visibilitychange`, the same `never` path. This was not exercised in headless.
- ✅ **0 console errors or hydration warnings:**
  - Production: only the known `THREE.Clock` warning. The one `404` resource error is the deliberate `/nope` request for the not-found check.
  - `next dev`: no hydration warnings across 3 storage combinations (light/none, dark/off, stored dark in a light system).
  - **THREE.Clock source:** `@react-three/fiber` 9.8.1 `createStore` (`dist/events-9ce18a08.esm.js:1054`, `clock: new THREE.Clock()`). 9.8.1 is the latest stable release; only the 10.0 alpha/canary line differs.
- ✅ **Also checked:**
  - No horizontal overflow at 320 and 375. The HUD fits on one row at 320, 768, 1024, 1280, 1440 and 1920.
  - The first Tab reaches "Skip to content". Focus order: skip link → wordmark → nav → Motion → theme → CTA → Run → switch.
  - The menu moves focus in; Esc closes it and returns focus to Menu, with `aria-expanded` following.
  - The theme and motion choices persist across a reload.
  - Not-found: 404, "Nothing here", "Back to TiDi" → `/`.
  - `<title>` is `meta.title`.
- ✅ **WebGL fallbacks:**
  - Without WebGL, the poster stays, the 1 MB scene chunk is never requested (8 chunks against 9), and autoplay and Run drive the HTML log.
  - Forced `loseContext()` → the poster after 2 s, and the log keeps working. In this failure path three logs "Context Lost." and warns "WEBGL_lose_context extension not supported" on unmount.

## Deviations
1. **The Résumé CTA doesn't render yet.** contrib-engineering §7: it renders only once `public/tidi-resume.pdf` exists (Phase 5). The code is in place (`RESUME_FILE`).
2. **Nav targets land in Phases 3–4.** The nav, the menu and "Bring me a pain point" link to `/#quest-journal` … `/#contact`, which don't exist yet. Scroll-spy (`aria-current` plus the state bar) is deferred to Phase 4, when there are sections to observe.
3. **The menu sheet is a native `popover`** rather than a JavaScript-only disclosure, so it works without JavaScript and gives no-JS visitors the nav below `xl`.
4. **The verdict `<output>` has no explicit `role="status"`.** jsx-a11y `no-redundant-roles` rejects it, because the implicit role is status. I didn't weaken the rule.
5. **The Motion toggle:** a stored choice wins in both directions, so a reduced-motion visitor can turn motion on and the toggle is never dead. The system setting applies until the toggle is pressed.
6. **Stage layout at `lg`:**
   - The stage bleeds right to the viewport edge (the hero clips it), so the camera gets the preview's width and the host clears the left edge.
   - In Deck the canvas edges feather by 8 % (`--canvas-feather`, 0 in Lab). Bloom over a transparent canvas otherwise showed a seam at the canvas edge.
7. **The boot clock starts on the second frame.** The first frame compiles shaders and otherwise used up most of the boot.
8. **`@react-three/drei` is not added.** Nothing in the hero needs it.
9. **The footer renders the tagline verbatim** ("still learning, always solving." with its period). `DESIGN.md` writes it without the period.

## Concerns (for the main session and design-lead)
1. **The focus ring is a rectangle** (2 px, 3 px offset, unclipped) around chamfered controls. It doesn't follow the 45° cut, because doing that needs a third pseudo layer. This is for design-lead to accept or specify, in F.
2. **Bloom look:** the values are DESIGN.md's starting values. The feather hides the seam; tuning belongs to the checkpoint (Known Gaps 5).
3. **Mobile:** Run and the switch wrap onto two rows at 375 px (about 390 px is needed). The calm still frame shows the chip edge-on (t = 0).
4. **Note:** another `next dev` (PID 6878, not mine) is serving this repository on :3000. I used it read-only for the hydration check. I stopped only my own `next start` (by PID), and my dev attempt exited on its own.
