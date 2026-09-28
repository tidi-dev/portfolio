"use client";

import type { PointerEvent, ReactNode } from "react";
import { motionSnapshot } from "@/lib/motion/store";

// DESIGN.md → Avatar frame: "it tilts up to 6° toward the pointer".
const MAX_TILT = 6;

function setTilt(element: HTMLElement, x: number, y: number): void {
  element.style.setProperty("--tilt-x", `${String(x)}deg`);
  element.style.setProperty("--tilt-y", `${String(y)}deg`);
}

/**
 * The avatar's tilt (DESIGN.md → Avatar frame; Motion → Avatar tilt): on a
 * fine pointer (a mouse) with motion on, the frame turns up to 6° toward
 * the pointer and settles back when it leaves (feedback, ease-out; the
 * transform is sections.css's). Touch and the calm mode get no tilt. It
 * reads the pointer only while it is over the frame: no scroll listeners.
 */
export function AvatarTilt({ children }: { readonly children: ReactNode }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const frame = event.currentTarget;
    if (event.pointerType !== "mouse" || !motionSnapshot()) {
      setTilt(frame, 0, 0);
      return;
    }
    const box = frame.getBoundingClientRect();
    // -0.5 … 0.5 across the frame, from its centre.
    const across = (event.clientX - box.left) / box.width - 0.5;
    const down = (event.clientY - box.top) / box.height - 0.5;
    setTilt(frame, -down * 2 * MAX_TILT, across * 2 * MAX_TILT);
  }

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={(event) => {
        setTilt(event.currentTarget, 0, 0);
      }}
      className="avatar-tilt"
    >
      {children}
    </div>
  );
}
