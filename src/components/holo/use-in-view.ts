import { type RefObject, useEffect, useState } from "react";

export interface InView {
  /** Any part is on screen: the scene renders. */
  readonly visible: boolean;
  /** At least half is on screen: the handshake may autoplay. */
  readonly half: boolean;
}

const HIDDEN: InView = { visible: false, half: false };

/** One IntersectionObserver on the stage (contrib-engineering §5.4). */
export function useInView(target: RefObject<HTMLElement | null>): InView {
  const [inView, setInView] = useState<InView>(HIDDEN);

  useEffect(() => {
    const element = target.current;
    if (element === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (entry === undefined) return;
        const visible = entry.isIntersecting;
        const half = visible && entry.intersectionRatio >= 0.5;
        setInView((current) =>
          current.visible === visible && current.half === half
            ? current
            : { visible, half },
        );
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [target]);

  return inView;
}
