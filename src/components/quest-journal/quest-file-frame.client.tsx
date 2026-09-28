"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { useQuestJournal } from "./quest-journal-controller.client";

interface QuestFileFrameProps {
  readonly id: string;
  /** The article's id (`#quest-…`), and its heading's id. */
  readonly anchor: string;
  readonly headingId: string;
  /** The file itself, server-rendered. */
  readonly children: ReactNode;
}

/**
 * A quest file's <article> (DESIGN.md → Quest file): always rendered and
 * visible. It reports itself to the journal, which marks it
 * `data-current` while it is the current quest (the status chip flips) and
 * `data-unlocked` once it has been (Quest's achievements power on, once).
 */
export function QuestFileFrame({
  id,
  anchor,
  headingId,
  children,
}: QuestFileFrameProps) {
  const { current, unlocks, register } = useQuestJournal();
  const article = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = article.current;
    if (element === null) return;
    return register(id, element);
  }, [id, register]);

  return (
    <article
      ref={article}
      id={anchor}
      aria-labelledby={headingId}
      data-quest-id={id}
      data-current={current === id ? "" : undefined}
      data-unlocked={(unlocks[id] ?? 0) > 0 ? "" : undefined}
      className="chamfer"
    >
      {children}
    </article>
  );
}
