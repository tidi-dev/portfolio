"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import {
  effectiveTheme,
  oppositeTheme,
  parseTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme/preference";

const SYSTEM_DARK = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  const system = window.matchMedia(SYSTEM_DARK);
  listeners.add(listener);
  system.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    system.removeEventListener("change", listener);
  };
}

/** The theme on screen: `data-theme` (a stored choice), else the system's. */
function currentTheme(): Theme {
  return effectiveTheme(
    parseTheme(document.documentElement.getAttribute("data-theme")),
    window.matchMedia(SYSTEM_DARK).matches,
  );
}

/** The server renders light; hydration then reads the real theme, so the markup never mismatches. */
function serverTheme(): Theme {
  return "light";
}

function applyTheme(
  theme: Theme,
  pageColours: Readonly<Record<Theme, string>>,
) {
  const root = document.documentElement;
  // DESIGN.md: the theme "switches instantly". Transitions are off for the
  // one style change that swaps the tokens (globals.css), then back on.
  root.setAttribute("data-theme-switching", "");
  root.setAttribute("data-theme", theme);
  root.getBoundingClientRect();
  root.removeAttribute("data-theme-switching");

  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", pageColours[theme]);
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage is unavailable: the choice lasts for this page only.
  }
  for (const listener of listeners) listener();
}

interface ThemeToggleProps {
  /** Approved copy a11y.theme-toggle; `aria-pressed` carries the state. */
  readonly label: string;
  /** Server-rendered icons: `sun` for light, `moon` for dark (CSS picks one). */
  readonly icons: ReactNode;
  /** `surface` and `surface-dark`, for theme-color. */
  readonly pageColours: Readonly<Record<Theme, string>>;
}

/**
 * The theme toggle (DESIGN.md → Links and buttons): an `icon-button`,
 * pressed while dark. It starts from the system theme and stores the
 * visitor's choice. Without JavaScript the <noscript> style hides it.
 */
export function ThemeToggle({ label, icons, pageColours }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, currentTheme, serverTheme);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={theme === "dark"}
      data-js-control=""
      onClick={() => {
        applyTheme(oppositeTheme(currentTheme()), pageColours);
      }}
      className="inline-flex size-target items-center justify-center rounded-base text-primary transition-feedback hover:text-accent"
    >
      {icons}
    </button>
  );
}
