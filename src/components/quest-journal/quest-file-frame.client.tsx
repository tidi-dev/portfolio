"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { PowerCover } from "@/components/ui/panel";
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
 * Like every panel, it powers on the first time it is reached
 * (`data-reveal`, reveal.css).
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
      data-reveal="panel"
      className="chamfer"
    >
      <PowerCover />
      {children}
    </article>
  );
}
