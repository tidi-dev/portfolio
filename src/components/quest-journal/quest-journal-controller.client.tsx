"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { QuestModelId } from "@/components/holo/quest-scene-props";
import { motionSnapshot } from "@/lib/motion/store";

/** One quest file, as the journal's client leaves need it. */
export interface QuestEntry {
  readonly id: string;
  /** The quest's name, for the toast. */
  readonly name: string;
  /** The article's id (`#quest-…`) and its heading's id. */
  readonly anchor: string;
  readonly headingId: string;
  readonly model: QuestModelId;
}

/** The latest "Quest unlocked": which quest, and a running count. */
export interface QuestUnlock {
  readonly id: string;
  readonly seq: number;
}

interface JournalState {
  /** The current quest file, once one has been reached. */
  readonly current: string | null;
  readonly last: QuestUnlock | null;
  /** How many times each quest has been unlocked. */
  readonly unlocks: Readonly<Record<string, number>>;
  /** A quest whose mission item was just activated, to announce. */
  readonly announced: string | null;
}

interface QuestJournalValue {
  readonly quests: readonly QuestEntry[];
  readonly current: string | null;
  /** The quest the viewport shows: the current one, else the first. */
  readonly shown: string;
  readonly last: QuestUnlock | null;
  readonly unlocks: Readonly<Record<string, number>>;
  /** Approved copy toast.quest-unlocked. */
  readonly toastLabel: string;
  readonly register: (id: string, element: HTMLElement) => () => void;
  readonly select: (id: string) => void;
}

const QuestJournalContext = createContext<QuestJournalValue | null>(null);

export function useQuestJournal(): QuestJournalValue {
  const value = useContext(QuestJournalContext);
  if (value === null) {
    throw new Error(
      "Quest journal leaves render inside QuestJournalController",
    );
  }
  return value;
}

// A quest file is current while it crosses this band, a little above the
// viewport's middle (DESIGN.md → Motion → Quest unlocked: "≥ 50 % in
// view"). A band, not an area ratio, so a file taller than the screen still
// becomes current.
const CURRENT_BAND = "-40% 0px -55% 0px";

// After a mission item is activated, scroll-driven changes wait for the
// scroll to end, so the files it passes don't unlock on the way.
const SETTLE_FALLBACK = 1500;

const INITIAL: JournalState = {
  current: null,
  last: null,
  unlocks: {},
  announced: null,
};

/**
 * The Quest journal's state (DESIGN.md → Quest journal; contrib-design §3:
 * every file stays visible and stacked, plan → Rulings). The current quest
 * is the file crossing the band above the middle of the viewport, or the
 * one whose mission item was activated. Each change is a "Quest unlocked":
 * the viewport or band projects the model in and shows the toast, the
 * file's status chip flips, and the mission item takes `aria-current`.
 * The toast is `aria-hidden`; a polite status region announces an unlock
 * only when the visitor activates a mission item, so scrolling never
 * chatters.
 */
export function QuestJournalController({
  quests,
  toastLabel,
  children,
}: {
  readonly quests: readonly QuestEntry[];
  readonly toastLabel: string;
  readonly children: ReactNode;
}) {
  const [state, setState] = useState<JournalState>(INITIAL);
  const elements = useRef(new Map<string, HTMLElement>());
  const crossing = useRef<string[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const settling = useRef(false);

  const reach = useCallback((id: string, selected: boolean) => {
    setState((previous) => {
      if (previous.current === id) return previous;
      const last: QuestUnlock = { id, seq: (previous.last?.seq ?? 0) + 1 };
      return {
        current: id,
        last,
        unlocks: { ...previous.unlocks, [id]: (previous.unlocks[id] ?? 0) + 1 },
        announced: selected ? id : null,
      };
    });
  }, []);

  const reachCrossing = useCallback(() => {
    const latest = crossing.current.at(-1);
    if (latest !== undefined) reach(latest, false);
  }, [reach]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.questId;
          if (id === undefined) continue;
          crossing.current = crossing.current.filter((other) => other !== id);
          if (entry.isIntersecting) crossing.current.push(id);
        }
        if (!settling.current) reachCrossing();
      },
      { rootMargin: CURRENT_BAND },
    );
    observer.current = io;
    for (const element of elements.current.values()) io.observe(element);
    return () => {
      io.disconnect();
      observer.current = null;
    };
  }, [reachCrossing]);

  const register = useCallback((id: string, element: HTMLElement) => {
    elements.current.set(id, element);
    observer.current?.observe(element);
    return () => {
      elements.current.delete(id);
      observer.current?.unobserve(element);
      crossing.current = crossing.current.filter((other) => other !== id);
    };
  }, []);

  // A mission item: the file becomes current, its heading takes focus, and
  // the page scrolls to it (at once in the calm mode).
  const select = useCallback(
    (id: string) => {
      const entry = quests.find((quest) => quest.id === id);
      const article = elements.current.get(id);
      if (entry === undefined || article === undefined) return;
      reach(id, true);
      settling.current = true;
      const settle = () => {
        settling.current = false;
        clearTimeout(timer);
        window.removeEventListener("scrollend", settle);
        reachCrossing();
      };
      window.addEventListener("scrollend", settle);
      const timer = setTimeout(settle, SETTLE_FALLBACK);
      document.getElementById(entry.headingId)?.focus({ preventScroll: true });
      article.scrollIntoView({
        behavior: motionSnapshot() ? "smooth" : "instant",
        block: "start",
      });
      window.history.pushState(null, "", `#${entry.anchor}`);
    },
    [quests, reach, reachCrossing],
  );

  // The provider re-renders only when the journal's state changes (its
  // children are server-rendered), so the value needs no memo.
  const value: QuestJournalValue = {
    quests,
    current: state.current,
    shown: state.current ?? quests[0]?.id ?? "",
    last: state.last,
    unlocks: state.unlocks,
    toastLabel,
    register,
    select,
  };

  const announcedName = quests.find(
    (quest) => quest.id === state.announced,
  )?.name;
  const announcement =
    announcedName === undefined ? "" : [toastLabel, announcedName].join(" ");

  return (
    <QuestJournalContext value={value}>
      {children}
      <output className="sr-only">{announcement}</output>
    </QuestJournalContext>
  );
}
