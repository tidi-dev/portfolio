/**
 * The theme rules (DESIGN.md → Links and buttons, theme toggle; info.md →
 * Site preferences: "follow the system, with a toggle"). The page follows
 * the system until the visitor picks a theme; the choice is stored and wins
 * from then on.
 */

/** The localStorage key that holds the visitor's choice. */
export const THEME_STORAGE_KEY = "theme";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** A stored or attribute value, if it names a theme. */
export function parseTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

/** The theme on screen: the visitor's choice, else the system's. */
export function effectiveTheme(
  chosen: Theme | null,
  systemDark: boolean,
): Theme {
  return chosen ?? (systemDark ? "dark" : "light");
}

/** The theme a toggle press switches to. */
export function oppositeTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}
