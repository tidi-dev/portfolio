import { useSyncExternalStore } from "react";
import {
  sectionSnapshot,
  serverSectionSnapshot,
  subscribeSection,
} from "@/lib/nav/scroll-spy";

/** The section in view (scroll-spy), for the nav's `aria-current`. */
export function useCurrentSection(): string | null {
  return useSyncExternalStore(
    subscribeSection,
    sectionSnapshot,
    serverSectionSnapshot,
  );
}
