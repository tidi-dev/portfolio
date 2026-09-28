"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import type { QuestModelId } from "@/components/holo/quest-scene-props";

/** One quest, as the journal's client leaves need it. */
export interface QuestEntry {
  readonly id: string;
  /** The quest's name, for the toast. */
  readonly name: string;
  /** The tabpanel's id (`quest-…`), the deep-link target. */
  readonly anchor: string;
  /** The card's (tab's) id (`quest-tab-…`). */
  readonly tabId: string;
  readonly model: QuestModelId;
}

/** The latest visitor selection, for the toast: which quest, and a count. */
export interface QuestUnlock {
  readonly id: string;
  readonly seq: number;
}

interface JournalState {
  readonly selected: string;
  /** Selection changes so far: each one runs the panel swap. */
  readonly swaps: number;
  /** How many times each panel has shown (the default counts once). */
  readonly shows: Readonly<Record<string, number>>;
  /** The visitor's latest selection; null until they make one. */
  readonly last: QuestUnlock | null;
}

interface QuestJournalValue extends JournalState {
  readonly quests: readonly QuestEntry[];
  /** Approved copy toast.quest-unlocked. */
  readonly toastLabel: string;
  /** A selection the visitor made: a card, an arrow key, a deep link. */
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

function initialState(quests: readonly QuestEntry[]): JournalState {
  const first = quests[0]?.id ?? "";
  return { selected: first, swaps: 0, shows: { [first]: 1 }, last: null };
}

/**
 * The Quest journal's selection (DESIGN.md → Quest card row, Quest detail
 * panel, Toast; Motion → Quest select, Quest unlocked, Achievements). The
 * first quest in content order (CyberRock) is selected on load, which
 * counts as its panel's first show but is not a visitor selection, so no
 * toast. Every visitor selection restarts the toast; a change of quest
 * also runs the swap (the cover, the model projecting in) and counts a
 * show, whose first time powers on Quest's achievements.
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
  const [state, setState] = useState<JournalState>(() => initialState(quests));

  const select = useCallback(
    (id: string) => {
      if (!quests.some((quest) => quest.id === id)) return;
      setState((previous) => {
        const last = { id, seq: (previous.last?.seq ?? 0) + 1 };
        if (previous.selected === id) return { ...previous, last };
        return {
          selected: id,
          swaps: previous.swaps + 1,
          shows: { ...previous.shows, [id]: (previous.shows[id] ?? 0) + 1 },
          last,
        };
      });
    },
    [quests],
  );

  // The provider re-renders only when the journal's state changes (its
  // children are server-rendered), so the value needs no memo.
  const value: QuestJournalValue = { ...state, quests, toastLabel, select };

  return <QuestJournalContext value={value}>{children}</QuestJournalContext>;
}
