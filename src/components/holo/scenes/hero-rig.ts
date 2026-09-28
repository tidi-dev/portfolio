import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  RingGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { buildChip } from "./chip";
import { type ConeUniforms, createConeMaterial } from "./cone-material";
import type { ScenePalette } from "./palette";

/**
 * The hero projector (DESIGN.md → 3D Scenes → Hero projector), built once
 * in scene units, procedural only. The preview's `HoloDeck` class is the
 * reference, and these numbers are its (and DESIGN.md's) geometry: 3D
 * data, not design tokens. Colours arrive through `applyPalette`, so a
 * theme change swaps materials and blending and never the geometry.
 */
export interface HeroRig {
  readonly rig: Group;
  readonly rings: readonly Mesh[];
  readonly ticks: InstancedMesh;
  readonly cone: Mesh;
  readonly coneUniforms: ConeUniforms;
  readonly chip: Group;
  readonly scan: Mesh;
  readonly scanDisc: Mesh;
  readonly host: Group;
  /** Host → chip (the challenge) and chip → host (the response). */
  readonly challengePath: QuadraticBezierCurve3;
  readonly responsePath: QuadraticBezierCurve3;
  /** The 7-sphere comet. */
  readonly packets: readonly Mesh<SphereGeometry, MeshBasicMaterial>[];
  readonly pulse: Mesh<RingGeometry, MeshBasicMaterial>;
  readonly motes: Points<BufferGeometry, PointsMaterial>;
  /** Materials that take the verdict colour: chip edges and die. */
  readonly verdictMaterials: readonly (LineBasicMaterial | MeshBasicMaterial)[];
  readonly dispose: () => void;
  /** Applies a theme's colours and blending in place. */
  readonly applyPalette: (palette: ScenePalette) => void;
}

const TICK_COUNT = 90;
const MOTE_COUNT = 150;
/** Where the motes rise, in the cone (DESIGN.md: 150 motes). */
export const MOTE_CEILING = 3.6;
const COMET_LENGTH = 7;

// A seeded PRNG (mulberry32) for the motes, as in the preview.
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildHeroRig(palette: ScenePalette): HeroRig {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const track = <T extends BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const own = <T extends Material>(material: T): T => {
    materials.push(material);
    return material;
  };

  // Holo light: every material tinted `holo` and blended per theme.
  const holoMaterials: (
    MeshBasicMaterial | LineBasicMaterial | PointsMaterial
  )[] = [];
  const holoSurface = (opacity: number) => {
    const material = own(
      new MeshBasicMaterial({
        transparent: true,
        opacity,
        depthWrite: false,
        side: DoubleSide,
      }),
    );
    holoMaterials.push(material);
    return material;
  };
  const holoLine = (opacity: number) => {
    const material = own(new LineBasicMaterial({ transparent: true, opacity }));
    holoMaterials.push(material);
    return material;
  };

  const rig = new Group();

  // Base: a cylinder r 2.6 → 2.85, h 0.2.
  const baseMaterial = own(
    new MeshStandardMaterial({ metalness: 0.7, roughness: 0.35 }),
  );
  rig.add(
    new Mesh(track(new CylinderGeometry(2.6, 2.85, 0.2, 64)), baseMaterial),
  );

  // Three rings at r 1.15, 1.9 (a 243° arc) and 2.5.
  const ringSpecs = [
    { radius: 1.15, width: 0.025, opacity: 0.9, arc: Math.PI * 2 },
    { radius: 1.9, width: 0.02, opacity: 0.55, arc: Math.PI * 1.35 },
    { radius: 2.5, width: 0.03, opacity: 0.8, arc: Math.PI * 2 },
  ];
  const rings = ringSpecs.map((spec, index) => {
    const geometry = track(
      new RingGeometry(
        spec.radius,
        spec.radius + spec.width,
        128,
        1,
        0,
        spec.arc,
      ),
    ).rotateX(-Math.PI / 2);
    const ring = new Mesh(geometry, holoSurface(spec.opacity));
    ring.position.y = 0.11 + index * 0.005;
    rig.add(ring);
    return ring;
  });

  // A tick ring of 90 ticks at r 2.2, every fifth double length.
  const ticks = new InstancedMesh(
    track(new BoxGeometry(0.025, 0.02, 0.16)),
    holoSurface(0.7),
    TICK_COUNT,
  );
  const placer = new Object3D();
  for (let index = 0; index < TICK_COUNT; index++) {
    const angle = (index / TICK_COUNT) * Math.PI * 2;
    placer.position.set(Math.cos(angle) * 2.2, 0.12, Math.sin(angle) * 2.2);
    placer.rotation.set(0, -angle, 0);
    placer.scale.set(1, 1, index % 5 === 0 ? 2 : 1);
    placer.updateMatrix();
    ticks.setMatrixAt(index, placer.matrix);
  }
  rig.add(ticks);

  // Cone: an open cylinder r 1.9 (top) → 1.0, h 3.4, fading upward.
  const { material: coneMaterial, uniforms: coneUniforms } = createConeMaterial(
    3.4,
    palette.holo,
    palette.coneOpacity,
  );
  own(coneMaterial);
  const cone = new Mesh(
    track(new CylinderGeometry(1.9, 1.0, 3.4, 48, 1, true)),
    coneMaterial,
  );
  cone.position.y = 1.8;
  rig.add(cone);

  // Chip: a 2.1 × 0.26 × 2.1 body with holo edges, 40 pins and the die
  // (chip.ts, shared with the CyberRock quest hologram).
  const chipModel = buildChip(palette);
  const chip = chipModel.group;
  chip.position.y = 2.3;
  rig.add(chip);

  // Scan ring (r 1.5) and its faint disc; they sweep y 1.5 ↔ 3.2.
  const scan = new Mesh(
    track(new RingGeometry(1.5, 1.56, 64)).rotateX(-Math.PI / 2),
    holoSurface(0.9),
  );
  const scanDisc = new Mesh(
    track(new CircleGeometry(1.5, 64)).rotateX(-Math.PI / 2),
    holoSurface(0.06),
  );
  rig.add(scan, scanDisc);

  // Host: a wireframe octahedron (r 0.55) with an icosahedron core at
  // (−4.3, 2.9, 0.4), and a faint stem line.
  const host = new Group();
  host.position.set(-4.3, 2.9, 0.4);
  rig.add(host);
  const hostEdgeMaterial = own(new LineBasicMaterial());
  host.add(
    new LineSegments(
      track(new EdgesGeometry(track(new OctahedronGeometry(0.55)))),
      hostEdgeMaterial,
    ),
  );
  const hostCoreMaterial = own(new MeshBasicMaterial());
  host.add(new Mesh(track(new IcosahedronGeometry(0.2)), hostCoreMaterial));
  host.add(
    new Line(
      track(
        new BufferGeometry().setFromPoints([
          new Vector3(0, -0.6, 0),
          new Vector3(0, -2.9, 0),
        ]),
      ),
      holoLine(0.35),
    ),
  );

  // Paths: two quadratic curves as holo tubes at 25 %.
  const hostPoint = host.position.clone();
  const challengePath = new QuadraticBezierCurve3(
    hostPoint.clone(),
    new Vector3(-2.2, 4.4, 0.3),
    new Vector3(0, 2.5, 0),
  );
  const responsePath = new QuadraticBezierCurve3(
    new Vector3(-0.6, 2.2, 0.3),
    new Vector3(-2.3, 1.2, 0.8),
    hostPoint.clone(),
  );
  for (const path of [challengePath, responsePath]) {
    rig.add(
      new Mesh(track(new TubeGeometry(path, 64, 0.012, 6)), holoSurface(0.25)),
    );
  }

  // The packet: a 7-sphere comet, shrinking and fading along its tail.
  const packets = Array.from({ length: COMET_LENGTH }, (_, index) => {
    const packet = new Mesh(
      track(new SphereGeometry(0.1 - index * 0.011, 12, 8)),
      own(
        new MeshBasicMaterial({ transparent: true, opacity: 1 - index * 0.13 }),
      ),
    );
    packet.visible = false;
    rig.add(packet);
    return packet;
  });

  // The verdict pulse ring, at the chip.
  const pulseMaterial = holoSurface(0);
  const pulse = new Mesh(
    track(new RingGeometry(1.2, 1.3, 64)).rotateX(-Math.PI / 2),
    pulseMaterial,
  );
  pulse.position.y = 2.3;
  rig.add(pulse);

  // 150 motes rising in the cone.
  const random = seeded(9);
  const positions = new Float32Array(MOTE_COUNT * 3);
  for (let index = 0; index < MOTE_COUNT; index++) {
    const angle = random() * Math.PI * 2;
    const radius = random() * 1.5;
    positions.set(
      [
        Math.cos(angle) * radius,
        random() * MOTE_CEILING,
        Math.sin(angle) * radius,
      ],
      index * 3,
    );
  }
  const moteGeometry = track(new BufferGeometry());
  moteGeometry.setAttribute("position", new BufferAttribute(positions, 3));
  const moteMaterial = own(
    new PointsMaterial({
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  );
  holoMaterials.push(moteMaterial);
  const motes = new Points(moteGeometry, moteMaterial);
  rig.add(motes);

  const applyPalette = (next: ScenePalette) => {
    for (const material of holoMaterials) {
      material.color.copy(next.holo);
      material.blending = next.blending;
      material.needsUpdate = true;
    }
    coneUniforms.uColor.value.copy(next.holo);
    coneUniforms.uOpacity.value = next.coneOpacity;
    coneMaterial.blending = next.blending;
    coneMaterial.needsUpdate = true;
    baseMaterial.color.copy(next.metal);
    chipModel.applyPalette(next);
    hostEdgeMaterial.color.copy(next.hostEdge);
    hostCoreMaterial.color.copy(next.hostCore);
  };
  applyPalette(palette);

  return {
    rig,
    rings,
    ticks,
    cone,
    coneUniforms,
    chip,
    scan,
    scanDisc,
    host,
    challengePath,
    responsePath,
    packets,
    pulse,
    motes,
    verdictMaterials: [chipModel.edgeMaterial, chipModel.dieMaterial],
    applyPalette,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      chipModel.dispose();
      ticks.dispose();
    },
  };
}
