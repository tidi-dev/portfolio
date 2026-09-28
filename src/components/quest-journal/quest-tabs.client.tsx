"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";
import { motionSnapshot } from "@/lib/motion/store";
import {
  type QuestEntry,
  useQuestJournal,
} from "./quest-journal-controller.client";

// The detail panel a deep link scrolls into view (quest-journal.tsx).
const DETAIL = "[data-quest-detail]";

function scrollBehavior(): ScrollBehavior {
  return motionSnapshot() ? "smooth" : "instant";
}

function plainClick(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Deep links (DESIGN.md → Quest detail panel → Deep links): a
 * `#quest-{id}` hash on load or on a hash change, or a click on an in-page
 * link to one (the Mission log's project links), selects that quest, then
 * scrolls the detail panel into view and focuses its tabpanel once it
 * shows. Without JavaScript the links are plain anchors to the stacked
 * panels.
 */
function useDeepLinks(
  quests: readonly QuestEntry[],
  select: (id: string) => void,
  selected: string,
  seq: number,
): void {
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const byHash = new Map(quests.map((quest) => [`#${quest.anchor}`, quest]));
    const open = (hash: string): boolean => {
      const quest = byHash.get(hash);
      if (quest === undefined) return false;
      pending.current = quest.id;
      select(quest.id);
      return true;
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !plainClick(event)) return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const here = window.location;
      if (link.origin !== here.origin || link.pathname !== here.pathname) {
        return;
      }
      if (!open(link.hash)) return;
      event.preventDefault();
      if (here.hash !== link.hash) {
        window.history.pushState(null, "", link.hash);
      }
    };
    const onHashChange = () => {
      open(window.location.hash);
    };
    open(window.location.hash);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [quests, select]);

  // Once the deep-linked panel shows: bring the detail panel into view and
  // focus the tabpanel.
  useEffect(() => {
    const id = pending.current;
    if (id === null || id !== selected) return;
    pending.current = null;
    const quest = quests.find((entry) => entry.id === id);
    const panel =
      quest === undefined ? null : document.getElementById(quest.anchor);
    if (panel === null) return;
    panel.closest(DETAIL)?.scrollIntoView({
      behavior: scrollBehavior(),
      block: "start",
    });
    panel.focus({ preventScroll: true });
  }, [quests, selected, seq]);
}

/**
 * The quest card row (DESIGN.md → Quest card row): the tablist, labelled by
 * the section's h2, and the deep links. Below `md` it scrolls sideways;
 * swiping only scrolls, it never selects.
 */
export function QuestTabList({
  labelledBy,
  children,
}: {
  readonly labelledBy: string;
  readonly children: ReactNode;
}) {
  const { quests, select, selected, last } = useQuestJournal();
  useDeepLinks(quests, select, selected, last?.seq ?? 0);
  const rowRef = useRef<HTMLDivElement>(null);
  // Below md the row scrolls: open it on the selected (Active) card, which
  // sits second. Only the row's scrollLeft moves, never the page.
  useEffect(() => {
    const row = rowRef.current;
    if (row === null || row.scrollWidth <= row.clientWidth) return;
    const card = row.querySelector<HTMLElement>('[aria-selected="true"]');
    if (card === null) return;
    const inset =
      parseFloat(getComputedStyle(row).scrollPaddingInlineStart) || 0;
    row.scrollLeft +=
      card.getBoundingClientRect().left -
      row.getBoundingClientRect().left -
      inset;
    // Only on mount: later selections scroll their own card into view.
  }, []);
  return (
    <div
      ref={rowRef}
      role="tablist"
      aria-labelledby={labelledBy}
      data-quest-tabs=""
      className="quest-row"
    >
      {children}
    </div>
  );
}

/**
 * One quest card as a tab (DESIGN.md → Quest card, Quest card row): the
 * whole card is a button, named by its title and described by its chip,
 * one-liner and stat. Roving tabindex (0 on the selected card); automatic
 * activation: Left / Right select and focus the previous / next card,
 * wrapping, Home / End the first / last; the focused card scrolls into
 * view (nearest). A click or tap selects it.
 */
export function QuestTab({
  id,
  status,
  labelledBy,
  describedBy,
  children,
}: {
  readonly id: string;
  /** The quest's status: the Active card keeps its highlight (quest.css). */
  readonly status: string;
  readonly labelledBy: string;
  readonly describedBy: string;
  /** The card's face, server-rendered. */
  readonly children: ReactNode;
}) {
  const { quests, selected, select } = useQuestJournal();
  const index = quests.findIndex((quest) => quest.id === id);
  const quest = quests[index];
  if (quest === undefined) return null;
  const isSelected = selected === id;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const count = quests.length;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % count;
        break;
      case "ArrowLeft":
        next = (index - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const target = quests[next];
    if (target === undefined) return;
    select(target.id);
    const tab = document.getElementById(target.tabId);
    if (tab === null) return;
    tab.focus({ preventScroll: true });
    tab.scrollIntoView({
      behavior: scrollBehavior(),
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <button
      type="button"
      role="tab"
      id={quest.tabId}
      aria-controls={quest.anchor}
      aria-selected={isSelected}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={isSelected ? 0 : -1}
      data-status={status}
      data-reveal="panel"
      onClick={() => {
        select(id);
      }}
      onKeyDown={onKeyDown}
      className="chamfer quest-card"
    >
      {children}
    </button>
  );
}

/**
 * A quest's tabpanel (DESIGN.md → Quest detail panel → Tabpanel): id = the
 * quest anchor, labelled by its card, focusable; hidden unless selected.
 * `data-first-show` marks the panel the first time it shows (Quest's
 * achievements power on then, once). Without JavaScript every panel shows
 * (noscript-style.tsx).
 */
export function QuestTabPanel({
  id,
  children,
}: {
  readonly id: string;
  readonly children: ReactNode;
}) {
  const { quests, selected, shows } = useQuestJournal();
  const quest = quests.find((entry) => entry.id === id);
  if (quest === undefined) return null;
  const isSelected = selected === id;
  return (
    <div
      role="tabpanel"
      id={quest.anchor}
      aria-labelledby={quest.tabId}
      tabIndex={0}
      hidden={!isSelected}
      data-quest-panel=""
      data-first-show={isSelected && shows[id] === 1 ? "" : undefined}
      className="flex flex-col gap-lg"
    >
      {children}
    </div>
  );
}

/**
 * The swap cover (DESIGN.md → Motion → Quest select): on each change of
 * quest, a surface-raised layer over the tabpanel slides down out of its
 * clipping track, led by a holo scan edge shown only while it moves
 * (quest.css). Keyed by the swap count, so each change restarts it. In the
 * calm mode it rests out of sight: the swap is instant.
 */
export function QuestSwapCover() {
  const { swaps } = useQuestJournal();
  return (
    <span aria-hidden="true" className="power-track">
      {swaps > 0 ? <span key={swaps} className="swap-cover" /> : null}
    </span>
  );
}
