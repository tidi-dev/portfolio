import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { PointLight } from "three";
import type { HeroSceneProps } from "@/components/holo/hero-scene-props";
import { readMotionTimings } from "@/lib/motion/tokens";
import { DPR, GL } from "./canvas-config";
import { DeckBloom } from "./deck-bloom";
import { buildHeroRig, type HeroRig } from "./hero-rig";
import { poseHero } from "./hero-pose";
import { scenePalette } from "./palette";
import { useContextLoss } from "./use-context-loss";

// DESIGN.md → 3D Scenes → Hero projector: camera FOV 34.
const CAMERA = {
  fov: 34,
  near: 0.1,
  far: 200,
  position: [0, 3.6, 11.6],
} as const;
const HALF_FOV = (CAMERA.fov / 2) * (Math.PI / 180);

// The host in rig space (DESIGN.md → Host: at x −4.3, z 0.4), and the room
// it needs left of its centre: its radius (0.55) and room for its tag, so
// the framing at 375 px and wider is unchanged.
const HOST = { x: -4.3, z: 0.4, room: 0.9 } as const;

/**
 * The hero projector's world (DESIGN.md → 3D Scenes → Hero projector;
 * Motion → Hologram boot, ambient, Handshake): one rig built once, one
 * frame callback that poses it from the ambient clock, the boot and the
 * handshake state. In the calm mode the clock stands still and the canvas
 * renders on demand only.
 */
function HeroWorld({
  handshake,
  theme,
  motion,
  frameloop,
  tags,
  onReady,
  onBooted,
  onContextLost,
  onContextRestored,
  onLost,
}: HeroSceneProps) {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const palette = scenePalette(theme);

  const rigRef = useRef<HeroRig | null>(null);
  const [timings] = useState(readMotionTimings);
  const [finePointer] = useState(
    () => window.matchMedia("(pointer: fine)").matches,
  );
  const glow = useRef<PointLight>(null);
  const clock = useRef({
    t: 0,
    bootStart: undefined as number | undefined,
    booted: false,
    ready: false,
  });
  const drag = useRef(0);

  // The rig is built once (geometry never swaps) and disposed with the
  // scene. Its palette arrives from the effect below, in the same commit.
  useEffect(() => {
    const built = buildHeroRig(scenePalette("light"));
    rigRef.current = built;
    scene.add(built.rig);
    return () => {
      scene.remove(built.rig);
      built.dispose();
      rigRef.current = null;
    };
  }, [scene]);

  // Theme change: materials, blending and bloom swap in place.
  useEffect(() => {
    rigRef.current?.applyPalette(palette);
    invalidate();
  }, [palette, invalidate]);

  // Camera: FOV 34 at (0, 3.6, 11.6) looking at (0, 2, 0), rig x +1.25;
  // when aspect < 0.95, at (1.1, 3.6, 17) looking at (1.1, 2, 0), rig x +1.9.
  // On the narrowest stages (320 px), where that framing would cut the host
  // and its tag at the left edge (QA F10), the camera backs off along z just
  // enough to keep them in frame; elsewhere the framing is DESIGN.md's.
  useEffect(() => {
    const aspect = size.width / size.height;
    const narrow = aspect < 0.95;
    const x = narrow ? 1.1 : 0;
    const rigX = narrow ? 1.9 : 1.25;
    const reach = x - (HOST.x + rigX) + HOST.room;
    const fit = HOST.z + reach / (Math.tan(HALF_FOV) * aspect);
    camera.position.set(x, 3.6, Math.max(narrow ? 17 : 11.6, fit));
    camera.lookAt(x, 2, 0);
    camera.updateProjectionMatrix();
    if (rigRef.current !== null) {
      rigRef.current.rig.position.x = rigX;
    }
    invalidate();
  }, [camera, size, invalidate]);

  // Any input change paints a frame, which "demand" needs.
  useEffect(() => {
    invalidate();
  }, [handshake, motion, frameloop, invalidate]);

  // Context loss: the poster at once; allow a restore; if none comes in
  // time, the canvas unmounts.
  useContextLoss(gl, { onContextLost, onContextRestored, onLost }, invalidate);

  // A horizontal drag spins the chip; the canvas keeps touch-action: pan-y,
  // so a vertical swipe still scrolls the page.
  useEffect(() => {
    const canvas = gl.domElement;
    let lastX: number | undefined;
    const down = (event: PointerEvent) => {
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (lastX === undefined) return;
      drag.current += (event.clientX - lastX) * 0.01;
      lastX = event.clientX;
      invalidate();
    };
    const up = () => {
      lastX = undefined;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [gl, invalidate]);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (rig === null) return;
    const frame = clock.current;
    const now = performance.now();
    const step = Math.min(delta, 0.05);
    if (motion) frame.t += step;

    // The boot clock starts on the second frame: the first one compiles
    // the shaders and can take long enough to swallow the boot.
    if (frame.ready) frame.bootStart ??= now;
    const bootElapsed = motion
      ? now - (frame.bootStart ?? now)
      : timings.durations.boot;
    const booting = bootElapsed < timings.durations.boot;
    poseHero(rig, {
      t: frame.t,
      step,
      now,
      bootElapsed,
      motion,
      finePointer,
      pointer: state.pointer,
      drag: drag.current,
      handshake,
      timings,
      palette,
      glow: glow.current,
      camera,
      size: state.size,
      tags: { host: tags.host.current, chip: tags.chip.current },
    });

    if (!frame.ready) {
      frame.ready = true;
      onReady();
    }
    if (!booting && !frame.booted) {
      frame.booted = true;
      onBooted();
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
      <pointLight
        ref={glow}
        position={[0, 2.4, 1.2]}
        intensity={10}
        distance={9}
        decay={1.4}
      />
    </>
  );
}

/**
 * The hero canvas: a dynamically imported client island
 * (contrib-engineering §5.1), rendered flat (no tone mapping, as the
 * preview), with Bloom in Deck only (intensity 0.9, threshold 0.2,
 * smoothing 0.3, mipmap blur). The stage makes it `aria-hidden`.
 */
export default function HeroScene(props: HeroSceneProps) {
  const bloom = scenePalette(props.theme).bloom;
  return (
    <Canvas frameloop={props.frameloop} dpr={DPR} flat gl={GL} camera={CAMERA}>
      <HeroWorld {...props} />
      {bloom ? <DeckBloom /> : null}
    </Canvas>
  );
}
