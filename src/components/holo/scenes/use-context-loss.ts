import { useEffect } from "react";
import type { WebGLRenderer } from "three";

// A context lost for longer than this falls back to the poster
// (contrib-engineering §5.2).
const CONTEXT_RESTORE_WAIT = 2000;

/**
 * Context loss (contrib-engineering §5.2 step 5): allow the browser to
 * restore the context; if it doesn't within 2 s, `onLost` hands the stage
 * back to its poster.
 */
export function useContextLoss(
  gl: WebGLRenderer,
  onLost: () => void,
  invalidate: () => void,
): void {
  useEffect(() => {
    const canvas = gl.domElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const lost = (event: Event) => {
      event.preventDefault();
      timer = setTimeout(onLost, CONTEXT_RESTORE_WAIT);
    };
    const restored = () => {
      clearTimeout(timer);
      invalidate();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      clearTimeout(timer);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl, onLost, invalidate]);
}
