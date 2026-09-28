import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { type Camera, Vector3 } from "three";
import type {
  QuestModelId,
  QuestSceneProps,
} from "@/components/holo/quest-scene-props";
import { readMotionTimings } from "@/lib/motion/tokens";
import { DPR, GL } from "./canvas-config";
import { DeckBloom } from "./deck-bloom";
import { easeBack, easeOutCubic } from "./hero-timeline";
import { QUEST_CAMERA, questFraming } from "./quest-framing";
import { buildQuestRig, MODEL_FIT, type QuestRig } from "./quest-rig";
import { scenePalette } from "./palette";
import { useContextLoss } from "./use-context-loss";

// Quest select (DESIGN.md → Motion), over `swap`: the stage cuts to the new
// model, which projects in (scale 0.6 → 1, ease-back) with one scan-disc
// pass up the cone.
const SWEEP_FROM = 0.2;
const SWEEP_RISE = 2.4;

const MODEL_IDS: readonly QuestModelId[] = ["cyberrock", "botmivivi", "quest"];

// Per-frame scratch values, so frames allocate nothing.
const TAG_POINT = new Vector3();

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface Swap {
  to: QuestModelId;
  /** `performance.now()` at the swap's start; undefined once it is done. */
  start: number | undefined;
}

/** Pins a tag to a world point, in CSS pixels of the stage (holo.css). */
function placeTag(
  element: HTMLElement | null,
  world: Vector3,
  fade: number,
  camera: Camera,
  size: { readonly width: number; readonly height: number },
): void {
  if (element === null) return;
  world.project(camera);
  element.style.setProperty(
    "--tag-x",
    String((world.x * 0.5 + 0.5) * size.width),
  );
  element.style.setProperty(
    "--tag-y",
    String((-world.y * 0.5 + 0.5) * size.height),
  );
  element.style.setProperty("--tag-fade", String(fade));
}

/**
 * One quest projector (DESIGN.md → 3D Scenes → Quest holograms; Motion →
 * Quest select): the rig is built once, and a frame callback poses the
 * ambient loops and the swap. In the calm mode the clock stands still, the
 * swap is a cut, and the canvas renders on demand only.
 */
function QuestWorld({
  model,
  unlock,
  theme,
  motion,
  frameloop,
  tilt,
  tags,
  onReady,
  onContextLost,
  onContextRestored,
  onLost,
}: QuestSceneProps) {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const palette = scenePalette(theme);

  const rigRef = useRef<QuestRig | null>(null);
  const [timings] = useState(readMotionTimings);
  const clock = useRef({ t: 0, ready: false });
  const swap = useRef<Swap>({ to: model, start: undefined });
  const motionRef = useRef(motion);
  const seen = useRef({ model, unlock });

  useEffect(() => {
    const built = buildQuestRig(scenePalette("light"));
    rigRef.current = built;
    scene.add(built.rig);
    return () => {
      scene.remove(built.rig);
      built.dispose();
      rigRef.current = null;
    };
  }, [scene]);

  // Theme change: materials and blending swap in place.
  useEffect(() => {
    rigRef.current?.applyPalette(palette);
    invalidate();
  }, [palette, invalidate]);

  const size = useThree((state) => state.size);

  useEffect(() => {
    // Framed by width and pinned near the top of a tall stage (DESIGN.md
    // → Quest holograms → Framing), so the model keeps one size and place
    // whatever the quest's panel height.
    const { position, look } = questFraming(size.width, size.height);
    camera.position.copy(position);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
    // Current before the next frame callback projects the tags (see the
    // hero scene): in the calm mode that frame is the only one.
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, invalidate, size]);

  useEffect(() => {
    motionRef.current = motion;
    invalidate();
  }, [motion, frameloop, invalidate]);

  // A new selection: cut to the model and project it in (motion on), or
  // cut to its still frame.
  useEffect(() => {
    if (seen.current.model === model && seen.current.unlock === unlock) return;
    seen.current = { model, unlock };
    swap.current = {
      to: model,
      start: motionRef.current ? performance.now() : undefined,
    };
    invalidate();
  }, [model, unlock, invalidate]);

  useContextLoss(gl, { onContextLost, onContextRestored, onLost }, invalidate);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (rig === null) return;
    const frame = clock.current;
    const step = Math.min(delta, 0.05);
    if (motionRef.current) frame.t += step;
    const { t } = frame;

    // Ambient: the rings at 0.4 and −0.6 rad/s, each model's own loop.
    rig.rings[0]?.rotation.set(0, t * 0.4, 0);
    rig.rings[1]?.rotation.set(0, -t * 0.6, 0);
    for (const id of MODEL_IDS) rig.models[id].pose(t);

    // The swap: the new model alone, projecting in; the others are gone.
    const current = swap.current;
    const progress =
      current.start === undefined
        ? 1
        : clamp01((performance.now() - current.start) / timings.durations.swap);
    if (progress >= 1) current.start = undefined;
    for (const id of MODEL_IDS) {
      const target = rig.models[id];
      if (id === current.to) {
        target.group.scale.setScalar(
          MODEL_FIT[id] * (0.6 + 0.4 * easeBack(progress)),
        );
        target.setFade(easeOutCubic(progress));
      } else {
        target.setFade(0);
      }
    }
    rig.sweep.visible = progress > 0 && progress < 1;
    rig.sweep.position.y = SWEEP_FROM + progress * SWEEP_RISE;
    rig.sweep.material.opacity = Math.sin(progress * Math.PI) * 0.9;

    // Pointer tilt ±0.15 rad (fine pointers from lg), damping 4.
    if (tilt && motionRef.current) {
      const ease = (1 - Math.exp(-step * 4)) * 0.5;
      const rotation = rig.rig.rotation;
      rotation.set(
        rotation.x + (-state.pointer.y * 0.04 - rotation.x) * ease,
        rotation.y + (state.pointer.x * 0.15 - rotation.y) * ease,
        0,
      );
    }

    // Quest's tags follow its slabs and its fade.
    const questFade = current.to === "quest" ? easeOutCubic(progress) : 0;
    const [v1, v2] = rig.models.quest.anchors;
    const pins = [
      [tags.v1.current, v1],
      [tags.v2.current, v2],
    ] as const;
    for (const [element, anchor] of pins) {
      if (anchor === undefined) continue;
      anchor.getWorldPosition(TAG_POINT);
      placeTag(element, TAG_POINT, questFade, camera, state.size);
    }

    if (!frame.ready) {
      frame.ready = true;
      onReady();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color={palette.light} />
      <directionalLight
        position={[3, 6, 5]}
        intensity={1.6}
        color={palette.light}
      />
    </>
  );
}

/**
 * A quest hologram canvas: a dynamically imported client island
 * (contrib-engineering §5.1), rendered flat, with the hero's Bloom in Deck
 * only (DESIGN.md → 3D Scenes → Quest holograms), so the second 3D moment
 * glows like the first. Its stage makes it `aria-hidden`.
 */
export default function QuestScene(props: QuestSceneProps) {
  const bloom = scenePalette(props.theme).bloom;
  return (
    <Canvas
      frameloop={props.frameloop}
      dpr={DPR}
      flat
      gl={GL}
      camera={QUEST_CAMERA}
    >
      <QuestWorld {...props} />
      {bloom ? <DeckBloom /> : null}
    </Canvas>
  );
}
