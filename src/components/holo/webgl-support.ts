let supported: boolean | undefined;

/**
 * Whether this browser can create a WebGL context (webgl2, then webgl),
 * probed once (contrib-engineering §5.2 step 3). When it can't, the scene
 * chunk is never requested and the poster stays. Browser-only.
 */
export function webglSupported(): boolean {
  if (supported !== undefined) return supported;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    supported = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}
