import {
  BoxGeometry,
  type BufferGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { createDieTexture } from "./die-texture";
import type { ScenePalette } from "./palette";

const PIN_COUNT_PER_SIDE = 10;

/**
 * The security chip (DESIGN.md → 3D Scenes → Hero projector → Chip): a
 * 2.1 × 0.26 × 2.1 `scene-chip` body with `holo` edges, 40 `scene-pins`
 * (10 per side, metalness 0.9) and the procedural circuit die tinted
 * `holo`. Shared by the hero and the CyberRock quest hologram ("the hero
 * chip at 0.7 scale"). Scene units are 3D data, not design tokens.
 */
export interface ChipModel {
  readonly group: Group;
  /** The holo edges and die, which the hero tints with the verdict. */
  readonly edgeMaterial: LineBasicMaterial;
  readonly dieMaterial: MeshBasicMaterial;
  /** Every material the chip owns, e.g. to fade it. */
  readonly materials: readonly Material[];
  readonly applyPalette: (palette: ScenePalette) => void;
  readonly dispose: () => void;
}

export function buildChip(palette: ScenePalette): ChipModel {
  const geometries: BufferGeometry[] = [];
  const track = <T extends BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };

  const group = new Group();
  const body = track(new BoxGeometry(2.1, 0.26, 2.1));
  const bodyMaterial = new MeshStandardMaterial({
    metalness: 0.55,
    roughness: 0.32,
  });
  group.add(new Mesh(body, bodyMaterial));

  const edgeMaterial = new LineBasicMaterial({ transparent: true, opacity: 1 });
  group.add(new LineSegments(track(new EdgesGeometry(body)), edgeMaterial));

  const pinMaterial = new MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.25,
  });
  const pins = new InstancedMesh(
    track(new BoxGeometry(0.09, 0.05, 0.3)),
    pinMaterial,
    PIN_COUNT_PER_SIDE * 4,
  );
  const placer = new Object3D();
  for (let side = 0, pin = 0; side < 4; side++) {
    for (let index = 0; index < PIN_COUNT_PER_SIDE; index++, pin++) {
      const along = -0.81 + index * 0.18;
      const angle = (side * Math.PI) / 2;
      placer.position.set(
        Math.cos(angle) * 1.18 + Math.sin(angle) * along,
        -0.05,
        Math.sin(angle) * 1.18 - Math.cos(angle) * along,
      );
      placer.rotation.set(0, -angle + Math.PI / 2, 0);
      placer.updateMatrix();
      pins.setMatrixAt(pin, placer.matrix);
    }
  }
  group.add(pins);

  const dieTexture = createDieTexture(`#${palette.light.getHexString()}`);
  const dieMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: DoubleSide,
    map: dieTexture,
  });
  const die = new Mesh(
    track(new PlaneGeometry(1.7, 1.7)).rotateX(-Math.PI / 2),
    dieMaterial,
  );
  die.position.y = 0.135;
  group.add(die);

  const materials: Material[] = [
    bodyMaterial,
    edgeMaterial,
    pinMaterial,
    dieMaterial,
  ];

  const applyPalette = (next: ScenePalette) => {
    for (const material of [edgeMaterial, dieMaterial]) {
      material.color.copy(next.holo);
      material.blending = next.blending;
      material.needsUpdate = true;
    }
    bodyMaterial.color.copy(next.chip);
    pinMaterial.color.copy(next.pin);
  };
  applyPalette(palette);

  return {
    group,
    edgeMaterial,
    dieMaterial,
    materials,
    applyPalette,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      dieTexture.dispose();
      pins.dispose();
    },
  };
}
