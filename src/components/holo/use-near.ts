import { type RefObject, useEffect, useState } from "react";

// How early a stage mounts its scene: about one viewport ahead.
const AHEAD = "100% 0px";

/**
 * True once the target has come within about a viewport of the screen, and
 * from then on. A quest stage mounts its canvas (and requests the scene
 * chunk) only then; `useInView` still pauses it whenever it is off screen.
 */
export function useNear(target: RefObject<HTMLElement | null>): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (element === null || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: AHEAD },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [target, near]);

  return near;
}
