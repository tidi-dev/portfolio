import {
  BoxGeometry,
  type BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  QuadraticBezierCurve3,
  RingGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import type { QuestModelId } from "@/components/holo/quest-scene-props";
import { buildChip } from "./chip";
import { type ConeUniforms, createConeMaterial } from "./cone-material";
import type { ScenePalette } from "./palette";

/**
 * The quest projector and its three models (DESIGN.md → 3D Scenes → Quest
 * holograms; depiction.holograms), built once in scene units, procedural
 * only. Numbers are 3D data, not design tokens; DESIGN.md → Known Gaps 5
 * calls the quest-hologram sizes starting points. Colours arrive through
 * `applyPalette`, so a theme change never swaps geometry.
 */
export interface QuestModel {
  readonly group: Group;
  /** 0 (gone) to 1 (fully shown): scales every material's opacity. */
  readonly setFade: (fade: number) => void;
  /** The ambient pose at the ambient clock `t`, in seconds. */
  readonly pose: (t: number) => void;
  /** Where the scene tags pin (Quest: v1, v2). */
  readonly anchors: readonly Object3D[];
}

export interface QuestRig {
  readonly rig: Group;
  readonly rings: readonly Mesh[];
  readonly coneUniforms: ConeUniforms;
  /** The scan sweep that crosses the cone when a quest is selected. */
  readonly sweep: Mesh<RingGeometry, MeshBasicMaterial>;
  readonly models: Readonly<Record<QuestModelId, QuestModel>>;
  readonly applyPalette: (palette: ScenePalette) => void;
  readonly dispose: () => void;
}

/** A fixed three-quarter view of each model (DESIGN.md: "fixed three-quarter view"). */
export const QUARTER_TURN = -0.6;

/** Where the models float, above the base. */
const MODEL_Y = 1.5;

/** Quest's packets cross left → right in a loop every 4 s. */
const PACKET_LOOP = 4;
const PACKET_COUNT = 4;

interface Faded {
  readonly material: Material;
  readonly base: number;
}

export function buildQuestRig(palette: ScenePalette): QuestRig {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const holoMaterials: (MeshBasicMaterial | LineBasicMaterial)[] = [];
  const chipBodies: MeshStandardMaterial[] = [];
  const track = <T extends BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const own = <T extends Material>(material: T): T => {
    materials.push(material);
    return material;
  };
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
  // A solid `scene-chip` body that can still fade out during a swap.
  const chipBody = () => {
    const material = own(
      new MeshStandardMaterial({
        metalness: 0.55,
        roughness: 0.32,
        transparent: true,
        opacity: 1,
      }),
    );
    chipBodies.push(material);
    return material;
  };

  const rig = new Group();

  // A smaller projector: base r 1.4, two rings, the cone.
  const baseMaterial = own(
    new MeshStandardMaterial({
      metalness: palette.baseMetalness,
      roughness: palette.baseRoughness,
    }),
  );
  rig.add(
    new Mesh(track(new CylinderGeometry(1.4, 1.52, 0.12, 64)), baseMaterial),
  );
  // Two rings, then a holo rim at the base's edge (r 1.4), so the Deck base
  // never reads as a black disc.
  const rings = [
    { radius: 0.8, width: 0.02, opacity: 0.9, arc: Math.PI * 2 },
    { radius: 1.22, width: 0.025, opacity: 0.6, arc: Math.PI * 1.35 },
    { radius: 1.37, width: 0.03, opacity: 0.9, arc: Math.PI * 2 },
  ].map((spec, index) => {
    const ring = new Mesh(
      track(
        new RingGeometry(
          spec.radius,
          spec.radius + spec.width,
          96,
          1,
          0,
          spec.arc,
        ),
      ).rotateX(-Math.PI / 2),
      holoSurface(spec.opacity),
    );
    ring.position.y = 0.065 + index * 0.005;
    rig.add(ring);
    return ring;
  });
  const { material: coneMaterial, uniforms: coneUniforms } = createConeMaterial(
    1.8,
    palette.holo,
    palette.coneOpacity,
  );
  own(coneMaterial);
  const cone = new Mesh(
    track(new CylinderGeometry(1.05, 0.55, 1.8, 40, 1, true)),
    coneMaterial,
  );
  cone.position.y = 0.96;
  rig.add(cone);

  const sweep = new Mesh(
    track(new RingGeometry(1.05, 1.1, 64)).rotateX(-Math.PI / 2),
    holoSurface(0),
  );
  sweep.visible = false;
  rig.add(sweep);

  // Collects a model's materials with their resting opacity, for setFade.
  const fader = (group: Group, list: readonly Material[]) => {
    const faded: Faded[] = list.map((material) => ({
      material,
      base: material.opacity,
    }));
    return (fade: number) => {
      group.visible = fade > 0.001;
      for (const { material, base } of faded) material.opacity = base * fade;
    };
  };

  // CyberRock: the hero chip at 0.7 scale, with its scan ring.
  const cyberrock = (() => {
    const group = new Group();
    const chipModel = buildChip(palette);
    for (const material of chipModel.materials) material.transparent = true;
    const spin = new Group();
    spin.scale.setScalar(0.7);
    spin.add(chipModel.group);
    group.add(spin);
    const scanMaterial = holoSurface(0.9);
    const scan = new Mesh(
      track(new RingGeometry(1.05, 1.09, 64)).rotateX(-Math.PI / 2),
      scanMaterial,
    );
    group.add(scan);
    rig.add(group);
    return {
      chipModel,
      model: {
        group,
        setFade: fader(group, [...chipModel.materials, scanMaterial]),
        // Ambient (DESIGN.md → Motion → Tokens): chip spin 0.35 rad/s,
        // bob ±0.08 at 1.3 rad/s (scaled), scan sin(1.1t).
        pose: (t: number) => {
          spin.rotation.set(0, QUARTER_TURN + t * 0.35, 0);
          spin.position.y = MODEL_Y + Math.sin(t * 1.3) * 0.08 * 0.7;
          scan.position.y = MODEL_Y + Math.sin(t * 1.1) * 0.6;
        },
        anchors: [],
      } satisfies QuestModel,
    };
  })();

  // botmivivi: a ledger stack of five slabs (1.6 × 0.08 × 1.1, gap 0.12,
  // holo edges), turning at 0.2 rad/s.
  const botmivivi = (() => {
    const group = new Group();
    const stack = new Group();
    const slab = track(new BoxGeometry(1.6, 0.08, 1.1));
    const edges = track(new EdgesGeometry(slab));
    const body = chipBody();
    const edge = holoLine(1);
    for (let index = 0; index < 5; index++) {
      const y = (index - 2) * 0.2;
      const mesh = new Mesh(slab, body);
      mesh.position.y = y;
      const outline = new LineSegments(edges, edge);
      outline.position.y = y;
      stack.add(mesh, outline);
    }
    stack.position.y = MODEL_Y;
    group.add(stack);
    rig.add(group);
    return {
      group,
      setFade: fader(group, [body, edge]),
      pose: (t: number) => {
        stack.rotation.set(0, QUARTER_TURN + t * 0.2, 0);
      },
      anchors: [],
    } satisfies QuestModel;
  })();

  // Quest: two linked data slabs (1.2 × 0.5 × 1.2): v1 a holo wireframe at
  // 40 %, v2 a solid scene-chip slab with holo edges; a curved path joins
  // them and four packets cross left → right, in a loop every 4 s.
  const quest = (() => {
    const group = new Group();
    const box = track(new BoxGeometry(1.2, 0.5, 1.2));
    const edges = track(new EdgesGeometry(box));
    const wire = holoLine(0.4);
    const left = new LineSegments(edges, wire);
    left.position.set(-1.05, MODEL_Y - 0.1, 0);
    left.rotation.y = QUARTER_TURN;
    const body = chipBody();
    const edge = holoLine(1);
    const right = new Group();
    right.add(new Mesh(box, body), new LineSegments(edges, edge));
    right.position.set(1.05, MODEL_Y - 0.1, 0);
    right.rotation.y = QUARTER_TURN;
    group.add(left, right);

    const path = new QuadraticBezierCurve3(
      new Vector3(-1.05, MODEL_Y + 0.2, 0),
      new Vector3(0, MODEL_Y + 1.0, 0),
      new Vector3(1.05, MODEL_Y + 0.2, 0),
    );
    const pathMaterial = holoSurface(0.25);
    group.add(
      new Mesh(track(new TubeGeometry(path, 48, 0.012, 6)), pathMaterial),
    );
    const packetMaterial = holoSurface(1);
    const packetGeometry = track(new SphereGeometry(0.06, 12, 8));
    const packets = Array.from({ length: PACKET_COUNT }, () => {
      const packet = new Mesh(packetGeometry, packetMaterial);
      group.add(packet);
      return packet;
    });

    const v1 = new Object3D();
    v1.position.set(-1.05, MODEL_Y - 0.75, 0.9);
    const v2 = new Object3D();
    v2.position.set(1.05, MODEL_Y - 0.75, 0.9);
    group.add(v1, v2);
    rig.add(group);
    return {
      group,
      setFade: fader(group, [wire, body, edge, pathMaterial, packetMaterial]),
      pose: (t: number) => {
        packets.forEach((packet, index) => {
          const along = (t / PACKET_LOOP + index / PACKET_COUNT) % 1;
          path.getPoint(along, packet.position);
        });
      },
      anchors: [v1, v2],
    } satisfies QuestModel;
  })();

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
    baseMaterial.metalness = next.baseMetalness;
    baseMaterial.roughness = next.baseRoughness;
    for (const material of chipBodies) material.color.copy(next.chip);
    cyberrock.chipModel.applyPalette(next);
  };
  applyPalette(palette);

  return {
    rig,
    rings,
    coneUniforms,
    sweep,
    models: { cyberrock: cyberrock.model, botmivivi, quest },
    applyPalette,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      cyberrock.chipModel.dispose();
    },
  };
}
