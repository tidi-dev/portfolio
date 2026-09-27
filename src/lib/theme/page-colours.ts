import tokens from "@/styles/tokens.generated.json" with { type: "json" };
import type { Theme } from "./preference";

/**
 * The page colour of each theme, `surface` and `surface-dark`, from the DTCG
 * export of DESIGN.md. `theme-color` follows the theme with these values
 * (DESIGN.md → Links and buttons; contrib-engineering §6).
 */
export const PAGE_COLOURS: Readonly<Record<Theme, string>> = {
  light: tokens.color.surface.$value.hex,
  dark: tokens.color["surface-dark"].$value.hex,
};
