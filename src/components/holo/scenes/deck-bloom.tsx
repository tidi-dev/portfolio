import { Bloom, EffectComposer } from "@react-three/postprocessing";

/**
 * Deck's Bloom (DESIGN.md → Elevation → Glow; 3D Scenes): intensity 0.9,
 * threshold 0.2, smoothing 0.3, mipmap blur. Shared by the hero and the
 * quest projectors; Lab renders without it. The stage's canvas layer
 * feathers the halo's edges (holo.css, --canvas-feather).
 */
export function DeckBloom() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
    </EffectComposer>
  );
}
