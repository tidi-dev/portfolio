# v2 · Quest hologram stage and the botmivivi map: engineering report

**Status: DONE.** Spec: `docs/design/botmivivi-holo-handoff.md`. No screenshots or preview pages were made (owner rule).

## Files
- **Added:**
  - `src/components/holo/scenes/quest-framing.ts`: the camera constants and the pure `questFraming(w, h)` (0.775 fill, 0.42 head room, screen-up pan)
  - `src/components/holo/scenes/botmivivi-map.ts`: the distribution map, the `roadAt` arc-length stadium, the gain-driven pulses and the gold pair
- **Changed:**
  - `quest-scene.tsx`: framing by `questFraming`; the swap scale is multiplied by `MODEL_FIT`
  - `quest-rig.ts`: `MODEL_FIT`, `holoSolid`, fader gains (base × fade × gain), the map in place of the ledger stack
  - `quest-poster.tsx`: `qp-frame` and the 10 map spans; `LEDGER_SLABS` removed
  - `quest.css`: 6 / 6, `qp-frame`, `--qp-k`/`--qp-u`, poster sizes in u, the map classes; `qp-slab` removed
  - `holo.css`, `theme.css`: `--canvas-feather-y`, and `--canvas-feather-cq` (Lab 0cqw, Deck 8cqw)
  - `public/tidi-resume.pdf`, `resume.lock.json`: regenerated, because `resume:check` hashes `theme.css` (no visible change)

## Evidence (fresh, Node 24)
- `pnpm check`:
  - design:lint → "0 errors, 0 warnings"
  - tokens:check → "the 2 token files match a fresh generation"
  - resume:check → "matches its 11 locked inputs"
  - lint → "All matched files use Prettier code style!" (ESLint silent)
  - typecheck → "Types generated successfully"
  - exit 0
- `rm -rf .next && pnpm build` → "Compiled successfully", exit 0, no warnings.
- **Node harness** (tsx, the real rig and framing) → **ALL PASS**:
  - framing: view 4.0024 u; look-at y 245.28 px = 0.42 × 584; at 512 × 320, back 1 and shift 0
  - botmivivi span 74.4–78.6 % at yaw −0.72 / −0.6 / −0.48 and over a 72 s sweep, top ≥ 85 px (the limit is 0.08w, 35–47 px); Quest at 0.85 spans 80.2–80.5 %; all inside the stage at 584 × 700 and 441 × 800 and at the 6 measured stage sizes (584 × 713/722/1017, 441 × 733/830/1097)
  - truck: (0.25, 0, 0.54) at t = 0; the shops' end at 2 s; constant speed
  - fade 0 zeroes all 14 map materials and hides the group
  - `dispose` releases 20 geometries, 14 materials and 3 instanced meshes
- **DOM script** (Playwright on `next start -p 3630`, PIDs stopped) → **ALL PASS**:
  - 1440 and 1024, both themes, all 3 quests: slot and panels are `span 6 / span 6`, and the stage is as wide and as tall as the panel. Deck's vertical feather resolves to 46.72 px (8cqw).
  - Below lg, at 320 / 375 / 768 / 1023: one column, 16:10, ≤ 320 px.
  - botmivivi canvas: motion on, it is `live`, `frameloop` is `always` and the canvas hash changes; reduced motion, it is `demand`, `data-motion="off"` and the hash is identical over 1.4 s and after a swap away and back (both themes). The hash is read in memory; no image was written.
  - WebGL disabled, at 1440 / 1024 / 768 / 375 in both themes: the poster stays; `qp-frame` height = min(stage height, 0.94 × stage width); the botmivivi map has 10 spans, all inside the stage; CyberRock and Quest posters render.
  - No overflow at 320–1920 in both themes. axe: 0 violations on `#quest-journal` for all 3 quests at 375 and 1440 in both themes. 0 console errors.

## Acceptance checks
1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ✅ · 6 ✅ · 7 ✅ · 8 ✅ · 9 ✅ · 10 ✅

- **Check 5:** the only colour words added are `black` in mask gradients (the existing feather mask, and the credit's dash mask, which the handoff wrote as `#000`). Masks use alpha only.
- **Check 6:** `grep "Loader\|Texture"` finds nothing in `quest-rig.ts` or `botmivivi-map.ts`; the die texture lives in `chip.ts`.

## Deviations
- **Map module:** the map lives in its own module, `botmivivi-map.ts`, and the framing in `quest-framing.ts` (the handoff put them in `quest-rig.ts` and `quest-scene.tsx`). This keeps each file to one responsibility and lets the node harness import the maths without R3F.
- **Road maths:** the road and truck use an analytic arc-length function rather than a `CurvePath`, so frames allocate nothing and the speed is exactly constant.
- **Yaws:** DESIGN's ±0.1 sway gives yaws of −0.70 to −0.50. The −0.72 and −0.48 yaws of check 4 were also tested, by setting them directly.

## Notes for the checkpoint
- CyberRock (0.7 chip, `MODEL_FIT` 1) spans only about 53 % of the stage, and its top sits at about 372 px of a 713 px stage, lower than the other two models. That follows the spec; it may be worth a look at the checkpoint.
- Known Gaps 14 (the flow in text) is still open. By owner decision, no copy was added.
