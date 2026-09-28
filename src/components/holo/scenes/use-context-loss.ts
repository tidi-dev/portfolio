import { useEffect } from "react";
import type { WebGLRenderer } from "three";

// A context lost for longer than this unmounts the canvas for good
// (contrib-engineering §5.2).
const CONTEXT_RESTORE_WAIT = 2000;

/** What the stage does at each step of a context loss. */
export interface ContextLossHandlers {
  /** The context is gone: the poster shows at once, the canvas stays mounted. */
  readonly onContextLost: () => void;
  /** The browser restored the context in time: the scene is live again. */
  readonly onContextRestored: () => void;
  /** No restore within 2 s: the canvas unmounts and the poster stays. */
  readonly onLost: () => void;
}

/**
 * Context loss (contrib-engineering §5.2 step 5; QA spec "never blank"):
 * the stage hands over to its poster the moment the context is lost, and
 * allows the browser to restore it; if it doesn't within 2 s, `onLost`
 * gives the stage to the poster for good.
 */
export function useContextLoss(
  gl: WebGLRenderer,
  { onContextLost, onContextRestored, onLost }: ContextLossHandlers,
  invalidate: () => void,
): void {
  useEffect(() => {
    const canvas = gl.domElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const lost = (event: Event) => {
      event.preventDefault();
      onContextLost();
      clearTimeout(timer);
      timer = setTimeout(onLost, CONTEXT_RESTORE_WAIT);
    };
    const restored = () => {
      clearTimeout(timer);
      onContextRestored();
      invalidate();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      clearTimeout(timer);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl, onContextLost, onContextRestored, onLost, invalidate]);
}
