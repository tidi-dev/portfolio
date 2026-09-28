"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { oppositeTheme, THEME_STORAGE_KEY } from "@/lib/theme/preference";
import {
  serverThemeSnapshot,
  setTheme,
  subscribeTheme,
  themeSnapshot,
} from "@/lib/theme/store";

interface ThemeToggleProps {
  /** Approved copy a11y.theme-toggle; `aria-pressed` carries the state. */
  readonly label: string;
  /** Server-rendered icons; CSS shows one per theme (show-in-lab / -deck). */
  readonly icons: ReactNode;
}

/**
 * The theme toggle (DESIGN.md → HUD bar): an icon button, pressed while
 * the Deck (dark) theme is on. It starts from the system theme and stores
 * the visitor's choice. Without JavaScript the <noscript> style hides it.
 */
export function ThemeToggle({ label, icons }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    themeSnapshot,
    serverThemeSnapshot,
  );

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      data-js-control=""
      onClick={() => {
        setTheme(oppositeTheme(themeSnapshot()), THEME_STORAGE_KEY);
      }}
      className="inline-flex size-target items-center justify-center text-primary transition-colors duration-feedback hover:text-accent-ink"
    >
      {icons}
    </button>
  );
}
