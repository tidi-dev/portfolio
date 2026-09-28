"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format/number";
import { motionSnapshot } from "@/lib/motion/store";
import { readMotionTimings } from "@/lib/motion/tokens";

/**
 * A stat readout figure (DESIGN.md → Motion → botmivivi readouts): the
 * first time it is half in view, with motion on, it counts 0 → value over
 * `count` (ease-out). The final text stays in the DOM for assistive tech
 * and holds the width; the counting digits sit over it, aria-hidden. In
 * the calm mode, and without JavaScript, the final value simply shows.
 */
export function CountUp({
  value,
  display,
}: {
  readonly value: number;
  /** The final value, formatted ("2,951"). */
  readonly display: string;
}) {
  const figure = useRef<HTMLSpanElement>(null);
  const [counting, setCounting] = useState<string | null>(null);

  useEffect(() => {
    const element = figure.current;
    if (element === null) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (!motionSnapshot()) return;
        const duration = readMotionTimings().durations.count;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          if (progress >= 1) {
            setCounting(null);
            return;
          }
          const eased = 1 - (1 - progress) ** 3;
          setCounting(formatNumber(Math.round(value * eased)));
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span
      ref={figure}
      data-counting={counting === null ? undefined : ""}
      className="count-up"
    >
      <span className="count-final">{display}</span>
      {counting === null ? null : (
        <span aria-hidden="true" className="count-live">
          {counting}
        </span>
      )}
    </span>
  );
}
