import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  InstancedMesh,
  Line,
  type LineBasicMaterial,
  LineDashedMaterial,
  LineLoop,
  LineSegments,
  type Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  type MeshStandardMaterial,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import type { ScenePalette } from "./palette";

/**
 * botmivivi's hologram (DESIGN.md → 3D Scenes → Quest holograms →
 * botmivivi; depiction.holograms): a floating map of the distribution flow,
 * read left → right. A supplier (wire, 40 %) feeds the warehouse, whose
 * flour-bag pallets load a truck that laps a road to a bakery and a shop
 * (wire, 60 %); credit runs back in gold, a coin riding it. Solid
 * `scene-chip` with `holo` edges is the business, wireframe its partners.
 * Local scene units, y 0 = the plate's top face; numbers are 3D data, not
 * tokens (DESIGN.md → Known Gaps 5).
 */

/** The rig's material factories, so the map fades and recolours with it. */
export interface MapKit {
  readonly track: <T extends BufferGeometry>(geometry: T) => T;
  readonly own: <T extends Material>(material: T) => T;
  readonly holoLine: (opacity: number) => LineBasicMaterial;
  readonly holoSurface: (opacity: number) => MeshBasicMaterial;
  /** Front faces only, with depth write (the flour bags). */
  readonly holoSolid: (opacity: number) => MeshBasicMaterial;
  readonly chipBody: () => MeshStandardMaterial;
}

export interface DistributionMap {
  readonly group: Group;
  /** Every material, for the swap fade. */
  readonly materials: readonly Material[];
  /** Per-frame opacity multipliers set by `pose` (coin, bag pulse). */
  readonly gains: ReadonlyMap<Material, number>;
  readonly truck: Group;
  readonly pose: (t: number) => void;
  /** The gold pair: credit Lab `accent-ink`, Deck `accent-dark`; coin `accent`. */
  readonly applyPalette: (palette: ScenePalette) => void;
  readonly dispose: () => void;
}

/** Floats above the base, tilted 0.3 rad toward the camera, swaying ±0.1. */
const MAP_Y = 1.25;
const TILT = 0.3;
const SWAY = 0.1;
const SWAY_RATE = 0.35;

/** The truck laps the road, and the coin rides the credit line, every 8 s. */
const LOOP = 8;
const COIN_EDGE = 0.1;
const BAG_PERIOD = 2.4;
const BAG_PHASE = 0.9;

// The road: a stadium with straights x −0.3 → 0.8 at z 0.54 (front,
// outbound) and 0.18 (back, return), semicircle ends r 0.18.
const ROAD_Y = 0.004;
const ROAD_LEFT = -0.3;
const ROAD_RIGHT = 0.8;
const ROAD_FRONT = 0.54;
const ROAD_BACK = 0.18;
const ROAD_MID_Z = (ROAD_FRONT + ROAD_BACK) / 2;
const ROAD_RADIUS = (ROAD_FRONT - ROAD_BACK) / 2;
const ROAD_START = 0.25;
const STRAIGHT = ROAD_RIGHT - ROAD_LEFT;
const ARC = Math.PI * ROAD_RADIUS;
const LEAD = ROAD_RIGHT - ROAD_START;
/** 3.331 units. */
export const ROAD_LENGTH = 2 * STRAIGHT + 2 * ARC;
const ROAD_POINTS = 96;

/**
 * The point `distance` along the road from the front lane's middle,
 * heading +x (constant speed by arc length), written into `target` at
 * y 0; returns the heading as a yaw, `atan2(−tangent.z, tangent.x)`.
 */
export function roadAt(distance: number, target: Vector3): number {
  let d = ((distance % ROAD_LENGTH) + ROAD_LENGTH) % ROAD_LENGTH;
  if (d < LEAD) {
    target.set(ROAD_START + d, 0, ROAD_FRONT);
    return 0;
  }
  d -= LEAD;
  if (d < ARC) {
    const angle = d / ROAD_RADIUS;
    target.set(
      ROAD_RIGHT + ROAD_RADIUS * Math.sin(angle),
      0,
      ROAD_MID_Z + ROAD_RADIUS * Math.cos(angle),
    );
    return angle;
  }
  d -= ARC;
  if (d < STRAIGHT) {
    target.set(ROAD_RIGHT - d, 0, ROAD_BACK);
    return Math.PI;
  }
  d -= STRAIGHT;
  if (d < ARC) {
    const angle = d / ROAD_RADIUS;
    target.set(
      ROAD_LEFT - ROAD_RADIUS * Math.sin(angle),
      0,
      ROAD_MID_Z - ROAD_RADIUS * Math.cos(angle),
    );
    return Math.PI + angle;
  }
  target.set(ROAD_LEFT + (d - ARC), 0, ROAD_FRONT);
  return 0;
}

const PALLETS_X = [0.27, 0.62] as const;
const STOCK_Z = -0.2;
const BAG_LAYERS_Y = [0.06, 0.125, 0.19] as const;
const SHOPS_Z = [-0.3, 0.18] as const;
const SHOP_X = 1.25;

export function buildDistributionMap(
  kit: MapKit,
  yaw: number,
): DistributionMap {
  const { track, own } = kit;
  const map = new Group();
  map.position.y = MAP_Y;

  const solid = kit.chipBody();
  const edge = kit.holoLine(1);
  const wire40 = kit.holoLine(0.4);
  const wire60 = kit.holoLine(0.6);
  const line30 = kit.holoLine(0.3);
  const line35 = kit.holoLine(0.35);
  const line50 = kit.holoLine(0.5);
  const line80 = kit.holoLine(0.8);
  const awning = kit.holoSurface(0.6);
  const credit = own(
    new LineDashedMaterial({
      dashSize: 0.05,
      gapSize: 0.035,
      transparent: true,
      opacity: 0.7,
    }),
  );
  const coin = own(new MeshBasicMaterial({ transparent: true, opacity: 1 }));

  const edgesOf = (geometry: BufferGeometry) =>
    track(new EdgesGeometry(geometry));
  const place = <T extends Mesh | Line>(
    object: T,
    x: number,
    y: number,
    z: number,
  ): T => {
    object.position.set(x, y, z);
    return object;
  };
  /** A solid body and its holo edges at one transform. */
  const body = (
    geometry: BufferGeometry,
    edges: BufferGeometry,
    x: number,
    y: number,
    z: number,
  ) => [
    place(new Mesh(geometry, solid), x, y, z),
    place(new LineSegments(edges, edge), x, y, z),
  ];
  const line = (points: readonly Vector3[]) =>
    track(new BufferGeometry().setFromPoints([...points]));

  // Plate and supplier: edges only.
  const plate = track(new BoxGeometry(2.9, 0.04, 1.2));
  map.add(place(new LineSegments(edgesOf(plate), line35), 0, -0.02, 0.05));
  const supplier = track(new BoxGeometry(0.32, 0.32, 0.32));
  map.add(
    place(new LineSegments(edgesOf(supplier), wire40), -1.29, 0.16, STOCK_Z),
  );
  map.add(
    new Line(
      line([
        new Vector3(-1.13, 0.005, STOCK_Z),
        new Vector3(-0.85, 0.005, STOCK_Z),
      ]),
      line50,
    ),
  );

  // Warehouse: body, gable roof (a 3-sided cylinder laid along x, apex up,
  // eaves at ±0.32 in z, ridge y 0.622) and the door's outline.
  const hall = track(new BoxGeometry(0.9, 0.4, 0.55));
  map.add(...body(hall, edgesOf(hall), -0.4, 0.2, -0.225));
  const roof = track(
    new CylinderGeometry(0.37, 0.37, 0.96, 3, 1)
      .rotateZ(Math.PI / 2)
      .rotateX(-Math.PI / 2)
      .scale(1, 0.4, 1),
  );
  map.add(...body(roof, edgesOf(roof), -0.4, 0.474, -0.225));
  const door = track(new PlaneGeometry(0.34, 0.26));
  map.add(place(new LineSegments(edgesOf(door), line80), -0.4, 0.13, 0.051));

  // Stock: two pallets, each with 12 flour bags (2 × 2 × 3); one instanced
  // mesh per layer, so each layer pulses on its own.
  const pallet = track(new BoxGeometry(0.3, 0.03, 0.24));
  const palletEdges = edgesOf(pallet);
  for (const x of PALLETS_X) {
    map.add(...body(pallet, palletEdges, x, 0.015, STOCK_Z));
  }
  const bag = track(new BoxGeometry(0.13, 0.06, 0.1));
  const matrix = new Matrix4();
  const layers = BAG_LAYERS_Y.map((y) => {
    const material = kit.holoSolid(0.6);
    const mesh = new InstancedMesh(bag, material, 8);
    let index = 0;
    for (const x of PALLETS_X) {
      for (const dx of [-0.07, 0.07]) {
        for (const dz of [-0.055, 0.055]) {
          mesh.setMatrixAt(
            index++,
            matrix.makeTranslation(x + dx, y, STOCK_Z + dz),
          );
        }
      }
    }
    mesh.computeBoundingBox();
    map.add(mesh);
    return { mesh, material };
  });

  // The road loop, and the truck (forward +x) on it.
  const roadPoint = new Vector3();
  const road = Array.from({ length: ROAD_POINTS }, (_, index) => {
    roadAt((index / ROAD_POINTS) * ROAD_LENGTH, roadPoint);
    return new Vector3(roadPoint.x, ROAD_Y, roadPoint.z);
  });
  map.add(new LineLoop(line(road), line30));
  const truck = new Group();
  const cargo = track(new BoxGeometry(0.2, 0.11, 0.11));
  truck.add(...body(cargo, edgesOf(cargo), -0.05, 0.07, 0));
  const cab = track(new BoxGeometry(0.08, 0.085, 0.11));
  truck.add(...body(cab, edgesOf(cab), 0.095, 0.0575, 0));
  map.add(truck);

  // The bakery and the shop: wire boxes, each with an awning.
  const shop = track(new BoxGeometry(0.34, 0.26, 0.34));
  const shopEdges = edgesOf(shop);
  const shade = track(new BoxGeometry(0.36, 0.012, 0.12));
  for (const z of SHOPS_Z) {
    map.add(place(new LineSegments(shopEdges, wire60), SHOP_X, 0.13, z));
    const cover = place(new Mesh(shade, awning), SHOP_X, 0.2, z + 0.22);
    cover.rotation.x = 0.35;
    map.add(cover);
  }

  // Credit: a dashed gold line from the shops back to the warehouse, and
  // the coin that rides it, facing the camera.
  const creditCurve = new QuadraticBezierCurve3(
    new Vector3(1.25, 0.34, -0.06),
    new Vector3(0.6, 1.0, -0.15),
    new Vector3(-0.1, 0.66, -0.225),
  );
  const creditLine = new Line(line(creditCurve.getPoints(32)), credit);
  creditLine.computeLineDistances();
  map.add(creditLine);
  const token = new Mesh(
    track(new CylinderGeometry(0.055, 0.055, 0.014, 20)),
    coin,
  );
  token.rotation.x = Math.PI / 2;
  map.add(token);

  const gains = new Map<Material, number>();

  return {
    group: map,
    materials: [
      solid,
      edge,
      wire40,
      wire60,
      line30,
      line35,
      line50,
      line80,
      awning,
      ...layers.map((layer) => layer.material),
      credit,
      coin,
    ],
    gains,
    truck,
    // The truck starts mid front lane heading to the shops (it reaches
    // their end at 2 s); the coin runs half a lap behind, fading in and out
    // over its first and last 10 %; the bag pulse rises up the stacks.
    pose: (t: number) => {
      map.rotation.set(TILT, yaw + SWAY * Math.sin(SWAY_RATE * t), 0);
      const heading = roadAt(((t / LOOP) % 1) * ROAD_LENGTH, truck.position);
      truck.rotation.set(0, heading, 0);
      const along = (t / LOOP + 0.5) % 1;
      creditCurve.getPoint(along, token.position);
      gains.set(coin, Math.min(1, along / COIN_EDGE, (1 - along) / COIN_EDGE));
      layers.forEach(({ material }, layer) => {
        gains.set(
          material,
          0.8 +
            0.2 * Math.sin((2 * Math.PI * t) / BAG_PERIOD - BAG_PHASE * layer),
        );
      });
    },
    applyPalette: (palette: ScenePalette) => {
      credit.color.copy(palette.hostEdge);
      coin.color.copy(palette.hostCore);
      for (const material of [credit, coin]) {
        material.blending = palette.blending;
        material.needsUpdate = true;
      }
    },
    dispose: () => {
      for (const { mesh } of layers) mesh.dispose();
    },
  };
}
