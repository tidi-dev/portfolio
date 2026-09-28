"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import {
  motionSnapshot,
  serverMotionSnapshot,
  setMotion,
  subscribeMotion,
} from "@/lib/motion/store";

interface MotionToggleProps {
  /** Approved copy a11y.motion-toggle, "Motion"; `aria-pressed` carries the state. */
  readonly label: string;
  /** Server-rendered icons; CSS shows one per mode (show-motion-on / -off). */
  readonly icons: ReactNode;
}

/**
 * The motion toggle (DESIGN.md → HUD bar, Motion; WCAG 2.2.2): pressed
 * while motion is on. Releasing it sets `data-motion="off"`, which pauses
 * every loop and gives every calm variant; the choice persists across
 * visits. It starts from prefers-reduced-motion. Without JavaScript the
 * <noscript> style hides it (nothing moves then).
 */
export function MotionToggle({ label, icons }: MotionToggleProps) {
  const on = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      data-js-control=""
      onClick={() => {
        setMotion(motionSnapshot() ? "off" : "on");
      }}
      className="inline-flex size-target items-center justify-center text-primary transition-colors duration-feedback hover:text-accent-ink"
    >
      {icons}
    </button>
  );
}
