# Quest hologram stage and the botmivivi map · handoff for frontend-engineer

Source of truth: `DESIGN.md` → Components (Quest detail panel → Layout), Elevation & Depth (feather), 3D Scenes → Quest holograms, Responsive Behavior, changelog 2026-09-28. Owner, 2026-09-28: "Wider stage + bigger model", and the new `depiction.holograms` (botmivivi as its distribution flow). No screenshots or preview pages (owner rule). No token change: `pnpm tokens:check` stays green without a re-export.

## 1. Bigger holo from `lg`

**Split** (`src/styles/quest.css`): `quest-stage-slot` span 5 → **6**; `quest-panels` span 7 → **6**. Update the `quest-detail` comment (it still says "sticky"). The longest CyberRock bullet wraps; accepted.

**Camera** (`src/components/holo/scenes/quest-scene.tsx`, the size effect). Same direction and FOV; replace the back-off and add a pan:

```ts
const FRAME_FILL = 0.775;  // width-bound view = 4.0 units = 0.775 × the 4:3 view (5.165)
const HEAD_ROOM = 0.42;    // look-at this × stage width below the top
const SCREEN_UP = new Vector3(0, 7, -1.8).normalize(); // camera up, in world space

const aspect = w / h;
const back = Math.max(1, (FRAME_ASPECT / aspect) * FRAME_FILL);
const worldPerPx = (2 * OFFSET.length() * back * Math.tan((CAMERA.fov * Math.PI) / 360)) / h;
const shift = (h / 2 - Math.min(h / 2, HEAD_ROOM * w)) * worldPerPx; // ≥ 0
look = LOOK_AT − SCREEN_UP × shift;  camera.position = look + OFFSET × back;  camera.lookAt(look)
```
Below `lg` (16:10 band) this gives `back = 1` and `shift = 0`: unchanged. Checked by projection (three.js, both stage heights): at 584 × 700 and 584 × 1150 the base spans ≈ 75 % of the width, the botmivivi map ≤ 80 %, Quest (at 0.85) 80 %; the map's top sits at ≈ 113 px in both, below the 47 px feather and the toast.

**Envelope scale** (`quest-rig.ts` + `quest-scene.tsx`): `MODEL_FIT = { cyberrock: 1, botmivivi: 1, quest: 0.85 }`; the swap sets `group.scale.setScalar(MODEL_FIT[id] * (0.6 + 0.4 * easeBack(progress)))`. Quest's tags keep following their anchors (they're inside the group).

**Feather** (`src/styles/holo.css`, `src/styles/theme.css`): split the mask's vertical stop into `--canvas-feather-y` (default `var(--canvas-feather)`). In the quest stage from `lg`, the vertical feather is `8cqw` in Deck and `0` in Lab (e.g. a `--canvas-feather-cq` custom property beside `--canvas-feather`: `8cqw` in Deck, `0cqw` in Lab). The stage is already a size container.

**Poster frame** (`quest-poster.tsx`, `quest.css`): wrap the poster layers in `qp-frame`: `position: absolute; inset-inline: 0; top: 0; height: min(100%, 94cqw); container-type: size`. Define `--qp-k: 1` (1.35 from `lg`) and `--qp-u: calc(var(--qp-k) * 1cqmin)`; every poster size now in `cqmin` or `cqh` becomes a multiple of `var(--qp-u)` (e.g. `qp-base` width `calc(60 * var(--qp-u))`, `qp-cone` height `calc(46 * var(--qp-u))`); positions stay in %. Below `lg` the frame is the stage and `u = 1cqmin`: nothing moves.

## 2. botmivivi: the distribution map (replaces the ledger stack)

Build in `quest-rig.ts` as the `botmivivi` model. Scene units; **local** coordinates inside a `map` group; y 0 = the plate's top face.

**Group:** `map.position (0, 1.25, 0)`; `map.rotation.set(0.3, QUARTER_TURN + 0.1 * Math.sin(0.35 * t), 0)` (Euler XYZ: yaw, then tilt toward the camera). Flow runs along local +x (reads left → right on screen); local +z faces the camera.

**Materials** (all registered for `setFade`, colours via `applyPalette`):
| Name | Material | Colour | Opacity |
|---|---|---|---|
| `solid` | the existing `chipBody()` | `scene-chip` | 1 |
| `edge` | `holoLine` | `holo` | 1 |
| `wire40`, `wire60`, `line30`, `line35`, `line50`, `line80` | `holoLine` | `holo` | 0.4, 0.6, 0.3, 0.35, 0.5, 0.8 |
| `awning` | `holoSurface` | `holo` | 0.6 |
| `bag0`, `bag1`, `bag2` (one per layer) | new `holoSolid`: `MeshBasicMaterial`, transparent, `FrontSide`, `depthWrite: true` | `holo` | 0.6 |
| `credit` | `LineDashedMaterial` (dash 0.05, gap 0.035), transparent | `palette.hostEdge` (Lab `accent-ink`, Deck `accent-dark`) | 0.7 |
| `coin` | `MeshBasicMaterial`, transparent | `palette.hostCore` (`accent`) | 1 |
Blending for every holo, credit and coin material follows `palette.blending`. "Solid + edges" below = a `Mesh(geometry, solid)` plus `LineSegments(EdgesGeometry(geometry), edge)` at the same transform.

**Geometry** (centres unless stated):
| Part | Geometry | Position | Look |
|---|---|---|---|
| Plate | Box 2.9 × 0.04 × 1.2 | (0, −0.02, 0.05) | edges only, `line35` |
| Supplier | Box 0.32³ | (−1.29, 0.16, −0.2) | edges only, `wire40` |
| Inbound line | 2-point line | (−1.13, 0.005, −0.2) → (−0.85, 0.005, −0.2) | `line50` |
| Warehouse body | Box 0.9 × 0.4 × 0.55 | (−0.4, 0.2, −0.225) | solid + edges |
| Warehouse roof | `CylinderGeometry(0.37, 0.37, 0.96, 3, 1).rotateZ(π/2).rotateX(−π/2).scale(1, 0.4, 1)` (apex up, eaves ±0.32 in z) | (−0.4, 0.474, −0.225); ridge at y 0.622 | solid + edges |
| Door | `EdgesGeometry(PlaneGeometry(0.34, 0.26))` | (−0.4, 0.13, 0.051) | `line80` |
| Pallet ×2 | Box 0.3 × 0.03 × 0.24 | (0.27, 0.015, −0.2), (0.62, 0.015, −0.2) | solid + edges |
| Bags, 12 per pallet | Box 0.13 × 0.06 × 0.1 (one `InstancedMesh` per layer, 4 bags × 2 pallets) | pallet x ± 0.07, pallet z ± 0.055, layer y 0.06 / 0.125 / 0.19 | `bag0` / `bag1` / `bag2` |
| Road | closed stadium, 96 points, `LineLoop` | straights x −0.3 → 0.8 at z 0.54 (front) and 0.18 (back), y 0.004; semicircle ends r 0.18 centred (−0.3, 0.36) and (0.8, 0.36); perimeter 3.331 | `line30` |
| Truck cargo | Box 0.2 × 0.11 × 0.11 | (−0.05, 0.07, 0) in the truck group | solid + edges |
| Truck cab | Box 0.08 × 0.085 × 0.11 | (0.095, 0.0575, 0) in the truck group (forward +x) | solid + edges |
| Shop ×2 | Box 0.34 × 0.26 × 0.34 | (1.25, 0.13, −0.3), (1.25, 0.13, 0.18) | edges only, `wire60` |
| Awning ×2 | Box 0.36 × 0.012 × 0.12, `rotation.x = 0.35` | (1.25, 0.2, shop z + 0.22) | `awning` |
| Credit line | `QuadraticBezierCurve3` (1.25, 0.34, −0.06) → (0.6, 1.0, −0.15) → (−0.1, 0.66, −0.225), 32 points, `Line` + `computeLineDistances()` | as given | `credit` |
| Coin | `CylinderGeometry(0.055, 0.055, 0.014, 20)`, `rotation.x = π/2` | on the credit curve | `coin` |

**Motion** (`pose(t)`, `t` the ambient clock in seconds; all rates are 3D data, not tokens):
- *Truck:* `s = (t / 8) % 1`; distance `d = s × 3.331` along the stadium by arc length (constant speed, e.g. a `CurvePath` of two `LineCurve3` and two semicircle curves with `getPointAt` / `getTangentAt`), starting at the front lane's midpoint (0.25, 0, 0.54) heading +x, so outbound runs on the front lane and the return on the back lane. `truck.rotation.y = Math.atan2(-tangent.z, tangent.x)`. It reaches the shops' end (s = 0.25) at t = 2 s.
- *Coin:* `u = (t / 8 + 0.5) % 1`; position `credit.getPoint(u)` (shop → warehouse); opacity multiplier `Math.min(1, u / 0.1, (1 - u) / 0.1)`. It leaves the shops at t = 4 s, 2 s after the truck arrives.
- *Bags:* layer `k` opacity multiplier `0.8 + 0.2 * Math.sin((2 * Math.PI * t) / 2.4 - 0.9 * k)` (the pulse rises up the stacks).
- *Sway:* the group yaw above.
- The multipliers apply on top of the swap fade: `setFade` writes `base × fade × multiplier` (store the multipliers in `pose`, which runs first each frame), never `base × multiplier` alone.
- *Calm mode:* the clock stands at 0: the truck mid front lane heading to the shops, the coin mid-arc, bags at their t = 0 values. No other variant needed.
- Remove the ledger stack and its geometry. `anchors: []`; no scene tags, no new DOM.

## 3. botmivivi poster (`quest-poster.tsx`, `quest.css`)

Replace the five `qp-slab` spans with one `qp-map` origin inside `qp-frame`: `position: absolute; left: 50%; bottom: calc(12% + 29.5 * var(--qp-u)); width: 0; height: 0` (22 u above the base's centre, where the 3D plate floats). Children are `position: absolute` with `left` and `bottom` in `u` from that origin (`u` = `var(--qp-u)`), in this DOM order:

| Class | left, bottom | width × height | Drawing |
|---|---|---|---|
| `qp-ground` | −29.5, 0 | 60u × 2px | `holo` 40 % |
| `qp-supplier` | −29, 0 | 6u × 6u | 2 px border `holo` 40 %, no fill |
| `qp-warehouse` | −20, 0 | 15u × 8u | `scene-chip` fill, 2 px `holo` border; `::before` gable 17u × 4.5u sitting on the walls, eaves 1u past each side, `holo`, `clip-path: polygon(50% 0, 100% 100%, 0 100%)`; `::after` the same triangle inset by the 2 px stroke in `scene-chip` |
| `qp-pallet` ×2 (`--pallet` 0, 1) | `−3 + 6 × pallet`, 0 | 5u × 6u | `border-bottom: calc(0.8 * u) solid scene-chip`; three bag layers: `repeating-linear-gradient(to top, holo 60 % 0 1.6u, transparent 1.6u 1.8u)` |
| `qp-truck` | 10, 0.8 | 6u × 4u | `scene-chip`, 2 px `holo` border; `::after` cab 2.5u × 3u, 0.3u right of the box, bottoms aligned, same fill and border |
| `qp-shop` back (`--shop` 1) | 24.5, 2.5 | 5u × 5u | 2 px border `holo` 40 % |
| `qp-shop` front (`--shop` 0) | 20.5, 0 | 5u × 5.5u | 2 px border `holo` 60 % |
| (each shop) `::after` awning | top 1u, 0.5u past each side | height 1.2u | `holo` 60 % |
| `qp-credit` | −12.5, 12.5 | 35.5u × 9u | `radial-gradient(farthest-side at 50% 100%, transparent calc(100% - 3px), var(--color-accent-ink) calc(100% - 3px) calc(100% - 1px), transparent 100%)`, dashed by `mask-image: repeating-linear-gradient(90deg, #000 0 1.2u, transparent 1.2u 2u)`; runs from the warehouse ridge to above the front shop |
| `qp-coin` | 3.95, 20.2 (centre 5.25, 21.5: the arc's apex) | 2.6u × 2.6u | `radial-gradient(circle closest-side, var(--color-accent) 0 75%, var(--color-accent-ink) 76% 99%, transparent 100%)` |

Colours are the token custom properties (`--color-holo`, `--color-scene-chip`, `--color-accent`, `--color-accent-ink`) with `color-mix(in srgb, …, transparent)` for the percentages, as the other posters do. No `border-radius` (the curve and coin are gradients). `aria-hidden` comes from the stage.

## Files to touch
- `src/styles/quest.css`: split 6 / 6, `qp-frame`, `--qp-k` / `--qp-u`, existing `qp-*` sizes in `u`, the botmivivi poster classes; remove `qp-slab`.
- `src/styles/holo.css`, `src/styles/theme.css`: vertical feather variable; `8cqw` in the quest stage from `lg` (Deck).
- `src/components/holo/scenes/quest-scene.tsx`: framing, pan, `MODEL_FIT` in the swap.
- `src/components/holo/scenes/quest-rig.ts`: the map model, `holoSolid`, credit and coin materials in `applyPalette`, multipliers in the fader; header comment and the botmivivi comment.
- `src/components/holo/quest-poster.tsx`: `qp-frame`, the map spans; drop `LEDGER_SLABS`.
- Not touched: content, copy, `noscript-style.tsx`, the tag DOM, tokens.

## Acceptance checks (code or DOM level, no screenshots)
1. `pnpm check` and `pnpm build` green; `DESIGN.md` lint still 0 / 0; `pnpm tokens:check` green with no token diff.
2. From `lg`, `getComputedStyle` of the stage slot and of the tabpanels column each report `grid-column` span 6; below `lg`, one column and the band keeps `aspect-ratio: 16 / 10`, ≤ 320 px.
3. Framing, checked with a node script importing `three` (the repo has no test runner; export the framing maths as a pure function): for w 584 and h 700 / 1150, the view width at the look-at depth is 4.0 ± 0.01 units and the look-at projects to y = 0.42 × w ± 1 px; for 512 × 320, `back = 1` and `shift = 0` (unchanged band).
4. Projection check (same harness): the botmivivi group's world-space bounding box, at yaw −0.72, −0.6 and −0.48, spans ≤ 80.5 % of the stage width at 584 × 700 and 441 × 800, and its top is below `0.08 × w`; Quest at `MODEL_FIT` 0.85 ≤ 80.5 %.
5. No literal hex or colour in the diff: the map's colours come from `ScenePalette` fields (`holo`, `chip`, `hostEdge`, `hostCore`), the poster's from `--color-*`.
6. The map uses only `BoxGeometry`, `CylinderGeometry`, `PlaneGeometry` edges, `EdgesGeometry`, lines and curves; no loaders, no textures (`grep -n "Loader\|Texture" quest-rig.ts` finds only the existing chip die texture).
7. With `data-motion="off"`, `pose` receives t = 0 on every frame (the clock doesn't advance) and the canvas `frameloop` is `demand`; the truck sits at (0.25, 0, 0.54) local.
8. Swapping to and from botmivivi fades every map material, including bags and coin, to 0 (the model's `group.visible` false after the swap); `dispose` releases every new geometry and material.
9. `document.documentElement.scrollWidth === clientWidth` at 1024 and 1440; axe 0 violations on the section in both themes (unchanged roles).
10. Without WebGL at `lg`, the poster's `qp-frame` height equals `min(stage height, 0.94 × stage width)` and `qp-map` renders 10 child spans for botmivivi; CyberRock and Quest posters still render.

## Waiting for the owner (main session)
The canvas now shows the distribution flow, but no HTML says it (`DESIGN.md` Known Gaps 14; CLAUDE.md: information in a canvas also exists as text). Proposed new first step for `a11y.steps.botmivivi`, from the business-domain description only:
- A: "1. Flour and baking ingredients come in from suppliers, wait in the warehouse, and go out on the business's own trucks to bakeries and shops, on credit."
- B: "1. Suppliers deliver to the warehouse; its own trucks deliver to bakeries and shops, who buy on credit."
- C: no new step; the one-liner "back office for a flour distributor" stays the only text.
The existing steps renumber to 2 and 3. Nothing ships until the owner picks.
