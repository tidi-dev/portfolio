import { useSyncExternalStore } from "react";

function subscribe(listener: () => void): () => void {
  document.addEventListener("visibilitychange", listener);
  return () => {
    document.removeEventListener("visibilitychange", listener);
  };
}

function snapshot(): boolean {
  return document.visibilityState === "visible";
}

function serverSnapshot(): boolean {
  return true;
}

/** False while the tab is hidden, so scenes stop rendering (DESIGN.md → 3D Scenes). */
export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
