/**
 * A hologram stage's scene status (contrib-engineering §5.2): loading
 * (the poster holds the stage), live (the canvas is on screen), lost (the
 * WebGL context is gone and may come back; the canvas stays mounted while
 * the poster holds the stage), failed (no WebGL scene for good).
 */
export type SceneStatus = "loading" | "live" | "lost" | "failed";

/**
 * The stage's `data-holo-state` (holo.css): "live" shows the canvas and
 * its tags; "poster" and "lost" show the poster, and on "lost" it cuts in
 * at once, with no cross-fade, so the stage is never blank.
 */
export function holoState(
  scene: SceneStatus,
  sceneWanted: boolean,
): "live" | "lost" | "poster" {
  if (!sceneWanted) return "poster";
  if (scene === "live") return "live";
  return scene === "lost" ? "lost" : "poster";
}
