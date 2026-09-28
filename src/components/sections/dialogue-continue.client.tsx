"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { motionSnapshot } from "@/lib/motion/store";

interface DialogueContinueProps {
  /** The next section's anchor (`#afk`): the link without JavaScript. */
  readonly href: string;
  /** Its heading's id, which takes focus. */
  readonly targetId: string;
  /** Approved copy ui.profile-labels, "Press A to continue". */
  readonly label: string;
  /** The server-rendered "▼" pixel glyph (aria-hidden). */
  readonly icon: ReactNode;
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * The dialogue box's "Press A to continue ▼" (DESIGN.md → Dialogue box;
 * contrib-design §1.2): it moves on to AFK, focusing its heading and
 * scrolling there (at once in the calm mode). The A key does the same, and
 * only while the control has focus: it is the box's one focusable element.
 * Without JavaScript it is a plain in-page link.
 */
export function DialogueContinue({
  href,
  targetId,
  label,
  icon,
}: DialogueContinueProps) {
  function proceed() {
    const target = document.getElementById(targetId);
    if (target === null) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: motionSnapshot() ? "smooth" : "instant",
      block: "start",
    });
    window.history.pushState(null, "", href);
  }

  return (
    <a
      href={href}
      onClick={(event) => {
        if (!isPlainClick(event)) return;
        event.preventDefault();
        proceed();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) => {
        if (
          event.key.toLowerCase() !== "a" ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        proceed();
      }}
      className="inline-flex min-h-target items-center gap-2xs self-end type-nav text-link"
    >
      {label}
      {icon}
    </a>
  );
}
