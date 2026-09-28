import { useSyncExternalStore } from "react";

/**
 * Whether the Quest journal shows its wide layout (DESIGN.md → Responsive
 * Behavior → Quest journal: from `lg` the detail panel splits 5 / 7 with
 * the stage sticky), and whether a fine pointer may tilt the hologram
 * there (DESIGN.md → Quest holograms: pointer tilt from `lg`). The
 * breakpoint is read from the `--breakpoint-lg` token, so CSS and script
 * agree. Browser-only; the server knows neither.
 */
function query(): string {
  const lg = getComputedStyle(document.documentElement)
    .getPropertyValue("--breakpoint-lg")
    .trim();
  return `(min-width: ${lg})`;
}

const FINE_POINTER = "(pointer: fine)";

function subscribe(listener: () => void): () => void {
  const wide = window.matchMedia(query());
  const fine = window.matchMedia(FINE_POINTER);
  wide.addEventListener("change", listener);
  fine.addEventListener("change", listener);
  return () => {
    wide.removeEventListener("change", listener);
    fine.removeEventListener("change", listener);
  };
}

export type QuestLayout = "wide" | "wide-fine" | "narrow";

function snapshot(): QuestLayout {
  if (!window.matchMedia(query()).matches) return "narrow";
  return window.matchMedia(FINE_POINTER).matches ? "wide-fine" : "wide";
}

function serverSnapshot(): QuestLayout | undefined {
  return undefined;
}

export function useQuestLayout(): QuestLayout | undefined {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
