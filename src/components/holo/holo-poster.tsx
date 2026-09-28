/**
 * HoloPoster (contrib-engineering §5.2): the projector as a CSS-only
 * still (cone, base with its rings, chip, host), drawn from tokens. It holds
 * the stage before the scene loads and stays when WebGL is missing, fails
 * or is lost, so the hero is never blank. No image request, no icon.
 */
export function HoloPoster() {
  return (
    <div className="holo-poster holo-layer">
      <span className="poster-cone" />
      <span className="poster-base" />
      <span className="poster-chip" />
      <span className="poster-host" />
    </div>
  );
}
