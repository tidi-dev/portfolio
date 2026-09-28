import { type Camera, Color, type PointLight, Vector3 } from "three";
import type { HandshakeState } from "@/lib/handshake/machine";
import type { MotionTimings } from "@/lib/motion/tokens";
import { type HeroRig, MOTE_CEILING } from "./hero-rig";
import { easeBack, easeOutCubic, handshakeVisual } from "./hero-timeline";
import type { ScenePalette } from "./palette";

/** Everything one frame of the hero needs, gathered by the frame callback. */
export interface PoseInput {
  /** The ambient clock, in seconds; it stands still in the calm mode. */
  readonly t: number;
  /** This frame's clamped delta, in seconds. */
  readonly step: number;
  /** `performance.now()`, the handshake's clock. */
  readonly now: number;
  /** Milliseconds since the boot began (the full boot in the calm mode). */
  readonly bootElapsed: number;
  readonly motion: boolean;
  readonly finePointer: boolean;
  readonly pointer: { readonly x: number; readonly y: number };
  /** The chip's drag spin, in radians. */
  readonly drag: number;
  readonly handshake: HandshakeState;
  readonly timings: MotionTimings;
  readonly palette: ScenePalette;
  readonly glow: PointLight | null;
  readonly camera: Camera;
  readonly size: { readonly width: number; readonly height: number };
  readonly tags: {
    readonly host: HTMLElement | null;
    readonly chip: HTMLElement | null;
  };
}

// Where the tags pin: above the host, beside the chip (the preview's).
const HOST_TAG_OFFSET = new Vector3(0, 0.95, 0);
const CHIP_TAG_OFFSET = new Vector3(1.55, 0.7, 0);

// Per-frame scratch values (one hero scene per page), so frames allocate
// nothing.
const MIXED = new Color();
const HOST_POINT = new Vector3();
const CHIP_POINT = new Vector3();

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Boot (motion on only; DESIGN.md → Motion → Hologram boot): the rings
 * scale 0 → 1 staggered by `ring` with ease-back, the cone fades in, and
 * the chip materialises under one scan pass. Returns the scan height while
 * booting, or undefined once booted.
 */
function poseBoot(rig: HeroRig, input: PoseInput): number | undefined {
  const { bootElapsed, timings, palette } = input;
  const boot = timings.durations.boot;
  const stagger = timings.ringStagger;
  rig.rings.forEach((ring, index) => {
    const local = clamp01(
      (bootElapsed - index * stagger) / (boot - 2 * stagger),
    );
    ring.scale.setScalar(Math.max(0.001, easeBack(local)));
  });
  const outer = rig.rings[2];
  if (outer !== undefined) rig.ticks.scale.copy(outer.scale);
  const progress = clamp01(bootElapsed / boot);
  rig.coneUniforms.uOpacity.value =
    palette.coneOpacity * easeOutCubic(progress);
  const materialise = clamp01((bootElapsed - boot * 0.25) / (boot * 0.75));
  rig.chip.scale.setScalar(Math.max(0.001, easeBack(materialise)));
  return bootElapsed < boot ? 1.5 + easeOutCubic(progress) * 1.7 : undefined;
}

/**
 * Ambient (DESIGN.md → Motion → Tokens: rings 0.4 / −0.6 / 0.15 rad/s,
 * ticks −0.1, chip spin 0.35, bob ±0.08 at 1.3 rad/s, scan sin(1.1t), host
 * 0.8, motes 0.25–0.55 units/s), and the fine-pointer tilt (yaw ±0.25 rad,
 * pitch ±0.06, damping 4).
 */
function poseAmbient(
  rig: HeroRig,
  input: PoseInput,
  bootScan: number | undefined,
): void {
  const { t, step, motion } = input;
  rig.rings[0]?.rotation.set(0, t * 0.4, 0);
  rig.rings[1]?.rotation.set(0, -t * 0.6, 0);
  rig.rings[2]?.rotation.set(0, t * 0.15, 0);
  rig.ticks.rotation.set(0, -t * 0.1, 0);
  rig.chip.rotation.set(0, t * 0.35 + input.drag, 0);
  const scanY = bootScan ?? 1.5 + (Math.sin(t * 1.1) * 0.5 + 0.5) * 1.7;
  rig.scan.position.setY(scanY);
  rig.scanDisc.position.setY(scanY);
  rig.host.rotation.set(0, t * 0.8, 0);
  if (motion) {
    const positions = rig.motes.geometry.getAttribute("position");
    for (let index = 0; index < positions.count; index++) {
      let y = positions.getY(index) + step * (0.25 + (index % 7) * 0.05);
      if (y > MOTE_CEILING) y = 0;
      positions.setY(index, y);
    }
    positions.needsUpdate = true;
  }
  if (motion && input.finePointer) {
    const ease = (1 - Math.exp(-step * 4)) * 0.5;
    const rotation = rig.rig.rotation;
    rotation.set(
      rotation.x + (-input.pointer.y * 0.06 - rotation.x) * ease,
      rotation.y + (input.pointer.x * 0.25 - rotation.y) * ease,
      0,
    );
  }
}

/**
 * The handshake as a view of the state (DESIGN.md → Motion → Handshake):
 * the comet, the chip's verdict colour (edges, die and the holo point
 * light), the pulse ring and the counterfeit shake. The chip bobs, and
 * shakes along x only when rejected.
 */
function poseHandshake(rig: HeroRig, input: PoseInput): void {
  const { palette, motion, t } = input;
  const visual = handshakeVisual(input.handshake, input.now, input.timings);
  const comet = visual.comet;
  const path =
    comet?.leg === "challenge" ? rig.challengePath : rig.responsePath;
  const cometColour =
    comet?.leg === "challenge" ? palette.accent : palette.holo;
  rig.packets.forEach((packet, index) => {
    const along = (comet?.progress ?? -1) - index * 0.025;
    const shown = comet !== undefined && along >= 0 && along <= 1;
    packet.visible = shown;
    if (!shown) return;
    path.getPoint(along, packet.position);
    packet.material.color.copy(cometColour);
  });

  const verdictColour =
    visual.verdict === "rejected" ? palette.danger : palette.success;
  MIXED.copy(palette.holo).lerp(verdictColour, visual.verdictMix);
  for (const material of rig.verdictMaterials) material.color.copy(MIXED);
  input.glow?.color.copy(MIXED);

  const pulse = motion ? visual.pulse : undefined;
  rig.pulse.material.opacity = pulse === undefined ? 0 : (1 - pulse) * 0.9;
  rig.pulse.scale.setScalar(1 + (pulse ?? 0) * 1.4);
  rig.pulse.material.color.copy(verdictColour);

  rig.chip.position.set(
    motion ? visual.shake : 0,
    2.3 + Math.sin(t * 1.3) * 0.08,
    0,
  );
}

/** Pins a tag to a world point, in CSS pixels of the stage (holo.css). */
function placeTag(
  element: HTMLElement | null,
  world: Vector3,
  input: PoseInput,
): void {
  if (element === null) return;
  world.project(input.camera);
  element.style.setProperty(
    "--tag-x",
    String((world.x * 0.5 + 0.5) * input.size.width),
  );
  element.style.setProperty(
    "--tag-y",
    String((-world.y * 0.5 + 0.5) * input.size.height),
  );
}

/** Poses the whole rig for one frame. */
export function poseHero(rig: HeroRig, input: PoseInput): void {
  poseAmbient(rig, input, poseBoot(rig, input));
  poseHandshake(rig, input);
  rig.host.getWorldPosition(HOST_POINT).add(HOST_TAG_OFFSET);
  rig.chip.getWorldPosition(CHIP_POINT).add(CHIP_TAG_OFFSET);
  placeTag(input.tags.host, HOST_POINT, input);
  placeTag(input.tags.chip, CHIP_POINT, input);
}
