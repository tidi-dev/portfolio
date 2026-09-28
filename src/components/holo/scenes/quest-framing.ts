import { Vector3 } from "three";

/**
 * The quest camera (DESIGN.md → 3D Scenes → Quest holograms → Framing):
 * FOV 30, a fixed direction from (0, 3, 7) to (0, 1.2, 0). Pure maths, so a
 * node script can check the framing without a canvas.
 */
export const QUEST_CAMERA = {
  fov: 30,
  near: 0.1,
  far: 100,
  position: [0, 3.0, 7.0],
} as const;
export const QUEST_LOOK_AT = new Vector3(0, 1.2, 0);

const OFFSET = new Vector3(...QUEST_CAMERA.position).sub(QUEST_LOOK_AT);
// The framing is authored at 4:3 (a 5.165-unit view). Where the stage is
// taller than about 1:1, the camera backs off along its line of sight so
// the view is 0.775 of that: 4.0 units across, the ±1.6 envelope at 80 %.
const FRAME_ASPECT = 4 / 3;
const FRAME_FILL = 0.775;
// On a stage taller than 0.84 × its width, the look-at point sits this
// fraction of the stage width below the stage top (otherwise mid-height).
const HEAD_ROOM = 0.42;
// The camera's up axis in world space (perpendicular to OFFSET).
const SCREEN_UP = new Vector3(0, 7, -1.8).normalize();

export interface QuestFraming {
  /** How far the camera backs off along OFFSET (1 = the authored view). */
  readonly back: number;
  /** How far the view pans down its screen-up axis, in scene units. */
  readonly shift: number;
  readonly look: Vector3;
  readonly position: Vector3;
}

/** The camera for a stage of `width` × `height` CSS pixels. */
export function questFraming(width: number, height: number): QuestFraming {
  const look = QUEST_LOOK_AT.clone();
  if (width <= 0 || height <= 0) {
    return { back: 1, shift: 0, look, position: look.clone().add(OFFSET) };
  }
  const aspect = width / height;
  const back = Math.max(1, (FRAME_ASPECT / aspect) * FRAME_FILL);
  const worldPerPx =
    (2 *
      OFFSET.length() *
      back *
      Math.tan((QUEST_CAMERA.fov * Math.PI) / 360)) /
    height;
  const shift =
    (height / 2 - Math.min(height / 2, HEAD_ROOM * width)) * worldPerPx;
  look.addScaledVector(SCREEN_UP, -shift);
  const position = look.clone().addScaledVector(OFFSET, back);
  return { back, shift, look, position };
}
