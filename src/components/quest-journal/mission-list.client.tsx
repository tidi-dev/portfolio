"use client";

import type { MouseEvent, ReactNode } from "react";
import { useQuestJournal } from "./quest-journal-controller.client";

export interface MissionItem {
  readonly id: string;
  readonly href: string;
  readonly name: string;
  /** The server-rendered status chip. */
  readonly chip: ReactNode;
}

/**
 * The mission list (DESIGN.md → Mission item; from `lg`): in-page links to
 * the quest files, each a status chip and the quest's name. The current
 * quest's item takes a 3 px state bar and `aria-current="true"`.
 * Activating one makes its file current, moves focus to its heading and
 * scrolls there; without JavaScript it is a plain anchor.
 */
export function MissionList({
  items,
}: {
  readonly items: readonly MissionItem[];
}) {
  const { current, select } = useQuestJournal();

  return (
    <ul className="flex flex-col gap-xs">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            aria-current={current === item.id ? "true" : undefined}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }
              event.preventDefault();
              select(item.id);
            }}
            className="chamfer mission-item type-nav text-primary"
          >
            <span aria-hidden="true" className="mission-bar" />
            <span className="relative flex items-center gap-sm">
              {item.chip}
              {item.name}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
