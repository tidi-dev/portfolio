/**
 * The motion mode (DESIGN.md → Motion: "A single motion mode exists:
 * prefers-reduced-motion, or the HUD motion toggle, sets data-motion="off"";
 * contrib-engineering §6.4). The system preference applies until the
 * visitor presses the toggle; the choice is stored and wins from then on,
 * in both directions, so the toggle is never a dead control.
 */

/** The localStorage key that holds the visitor's choice. */
export const MOTION_STORAGE_KEY = "motion";

/** The <html> attribute every animated element and scene reads. */
export const MOTION_ATTRIBUTE = "data-motion";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type MotionMode = "on" | "off";

/** A stored or attribute value, if it names a mode. */
export function parseMotion(value: unknown): MotionMode | null {
  return value === "on" || value === "off" ? value : null;
}

/** The mode on screen: the visitor's choice, else the system's. */
export function effectiveMotion(
  chosen: MotionMode | null,
  systemReduce: boolean,
): MotionMode {
  return chosen ?? (systemReduce ? "off" : "on");
}
