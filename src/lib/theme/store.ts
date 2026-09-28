import { effectiveTheme, parseTheme, type Theme } from "./preference";

/**
 * The theme on screen as a `useSyncExternalStore` source, for the toggle and
 * the scenes (contrib-engineering §5.3). Browser-only: it is read by client
 * leaves after hydration. It changes when `data-theme` changes (any writer)
 * or when the system theme changes.
 */
const SYSTEM_DARK = "(prefers-color-scheme: dark)";

export function subscribeTheme(listener: () => void): () => void {
  const system = window.matchMedia(SYSTEM_DARK);
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  system.addEventListener("change", listener);
  return () => {
    observer.disconnect();
    system.removeEventListener("change", listener);
  };
}

/** `data-theme` (a stored choice), else the system's. */
export function themeSnapshot(): Theme {
  return effectiveTheme(
    parseTheme(document.documentElement.getAttribute("data-theme")),
    window.matchMedia(SYSTEM_DARK).matches,
  );
}

/** The server renders the light theme; hydration then reads the real one. */
export function serverThemeSnapshot(): Theme {
  return "light";
}

/**
 * The toggle: stores the visitor's choice and applies it at once. DESIGN.md
 * → Motion: "theme instant", so nothing transitions the swap.
 */
export function setTheme(theme: Theme, storageKey: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Storage is unavailable: the choice lasts for this page only.
  }
}
