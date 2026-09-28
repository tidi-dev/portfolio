# Phase 6 · Signature, run the handshake: engineering report

- **Date:** 2026-09-28
- **Agent:** `frontend-engineer` (`frontend-build`, `verification`)
- **Brief:** Phase 6 of `docs/plan/implementation-plan.md`, under the owner override: no tests, static fast checks only.
- **Status: DONE.** Every "Must hold" item is met, with evidence below. The resume point (an uncommitted `src/lib/handshake/machine.ts`) was reviewed against the spec, completed and committed.

## What was built
- **`src/lib/handshake/machine.ts`** (reviewed and completed)
  - The pure reducer from the earlier agent was correct: run restarts with a new run id, the toggle cancels to idle, instant runs go straight to the verdict, and stale advances are ignored. It is kept.
  - Added three derivations:
    - `lineTones(step)`: each line proof or construction
    - `readout(step)`: empty, a step word, or a verdict
    - `stepEndedBy(animationName)`: the two travel keyframes that move a run on
  - Removed the old `readoutText`: the leaf renders from `readout` instead.
- **`handshake-bench.client.tsx`**, the only motion leaf:
  - `useReducer`, with no effects and no listeners, so there is nothing to clean up. Focus never moves.
  - Reduced motion is read at click time, as a `matchMedia` snapshot.
  - The drawing is remounted per run (`key={run}`), and the verdict node too, so a repeated instant verdict is announced again.
  - Props: the six labels and five server-rendered icons, with the drawing as `children`.
- **Controls:**
  - Run: `button-primary` with `player-play`.
  - Counterfeit: `button-toggle` with `aria-pressed`, `square` and `square-check`, and a constant label.
    - Hover gives an accent label and border. Pressed gives a 2 px `primary` border; pressed and hovered, a 2 px accent border.
  - Both are 48 px tall: stacked at full width below the 480 px container width, side by side from it.
  - They sit in `data-js-control`, so the existing head `<noscript>` style hides them.
- **Readout:** a polite live region, `min-h-lh`, so it never collapses.
  - Step words are announced but not shown, through an `sr-only` span.
  - Verdicts: "genuine" with `check` in accent; "rejected" in `text-muted`, with `x` in `trace`.
- **`bench.css`** (imported by `globals.css`), keyed off `data-step`, `data-challenge`, `data-response`, `data-counterfeit` and `data-instant`:
  - Tones: each line has a proof copy and a construction copy, and the chip has an ink outline and a construction outline. The state shows one of each.
  - Packets fade in over `feedback` and travel over `travel` (ease-out).
  - The chip pulses over `pulse` (ease-in-out), and the response packet waits for the pulse to finish before it sets off.
  - Exits run over `feedback`. The readout fades over `verdict`; a rejected verdict also shakes over `shake`: ±3 px, two cycles.
  - Reduced motion shows the numerals 1 and 2 (media query), and instant runs match no animation rule.
- **Drawing** (`bench-drawing.tsx`, `geometry/bench.ts`):
  - Each line is drawn in both tones, with its numeral.
  - The chip is a `data-chip` group, which the pulse scales about its own centre.
  - Two packets: circles of radius 4, in the proof colour. Their trip length goes into `--bench-travel` from the geometry.
  - `primitives.tsx`: `Node` is split into `NodeFrame` (ink, proof or construction) and `NodeLabel`. The CyberRock output is unchanged.
- **Supplement tokens**, from DESIGN.md prose:
  - `--bench-pulse-scale: 1.04` and `--bench-shake: 3px` (Motion table)
  - `--border-width-toggle: 1.5px` (Components → Conventions), as the `border-toggle` class

## Commits
- `9efaa43` feat(handshake): add the bench state machine
- `75c9d1b` feat(bench): run the handshake, with its states, keyframes and controls
- plus the commit adding this report

## Static checks
- `pnpm check` → exit 0:
  - `design:lint … passes: 0 errors, 0 warnings`
  - `fonts:check: the 12 font files match a fresh generation`
  - ESLint clean, and `All matched files use Prettier code style!`
  - `✓ Types generated successfully`, with `tsc` clean
- `pnpm build` → exit 0: `○ /`, `○ /_not-found`, no warnings.
  - The built CSS contains the bench keyframes, the tokens, `.border-toggle`, `.min-h-lh` and the `aria-pressed` variants.

## Behaviour evidence
A throwaway Playwright probe ran from the session scratchpad against `next start` on :3106, which was then stopped by its PID. It is not a test, and nothing from it is committed. Chromium / WebKit:

| Item | Result |
|---|---|
| Genuine run (keyboard) | Live region: `challenge` at 9 / 8 ms, `response` at 370 / 377 ms, `genuine` at 921 / 926 ms. The verdict fade ends at 1,153 / 1,142 ms (nominal 1,080, plus about one frame of commit latency per step) |
| Rejected run | `challenge`, then `rejected` at 384 / 376 ms. **1** shake, ending at 650 / 641 ms (nominal 600) |
| Toggle | `aria-pressed="true"`, icon `tabler-icon-square-check`, label still "Counterfeit chip", step `idle` |
| Focus | Stays on the pressed button after run and after toggle |
| Interruptions | Run during a run → `challenge` (restart), then `genuine`. Toggle mid-run (`response`) → `idle`, still `idle` 1.2 s later |
| Reduced motion | The live region logs only `genuine`, and only `rejected` in the counterfeit case. `document.getAnimations().length` is 0; numerals `1` and `2` are visible |
| No JS | Controls `display: none`; the readout reads "genuine"; step `rest` |
| Animated properties | `opacity` and `transform`, plus border, background and text colour on the controls (ruling D1) |
| CLS during runs | 0 |
| Targets | 213 × 48 and 184 × 48 px |
| Overflow at 375 px | 0, in light and dark |
| Console | 0 errors or warnings, and no hydration warnings |

The screenshots stay in the scratchpad and are not committed:
- 375, 768 and 1440 px, in light and dark, at rest
- 375 px with the toggle pressed, in both themes
- 1440 px rejected (WebKit)
- mid-challenge and mid-response frames

I compared them with DESIGN.md.

## Deviations
1. **Chip construction:** only the chip's outline turns construction; its label stays ink. DESIGN.md says "the chip outline is construction", and the replaced-node label colour isn't specified for this case.
2. **Response line timing:** the response line turns proof as the response step begins, while the chip pulses, not when the packet arrives. DESIGN.md lists both events in one sentence.
3. **Controls gap:** the gap between the two controls is `sm` (12 px). DESIGN.md gives no value.
4. **Packet size:** the packet radius is 4 units, 8 across like the arrowhead. DESIGN.md gives no size.
5. **Numerals under reduced motion:** they show in every state under reduced motion, including rest, not only after a run.
6. **Rejected fade:** the rejected readout fades in over `verdict` while it shakes (the Readout row, "the sequence ends"). The total stays 360 + 240 ms.
7. **Instant flag:** an instant run is decided at click time, per contrib-engineering §1.3. If reduced motion is switched on during an animated run, that run finishes animated.

## Gaps and notes
- No copy gaps: every string comes from `src/content/`, namely `copy.bench.*`, `drawings.bench.labels` and `verdicts`, and `a11y.steps.bench`.
- Not done, per build mode:
  - reducer and e2e tests, for the lean suite after Phase 10
  - the JS budget and the app-owned JS figure
  - the latency check at 4× CPU slowdown
  - a VoiceOver pass
  - the `design-lead` timing consultation
- The `tokens.test.ts` that the lean suite brings back should cover the three new supplement tokens.
