import { AdditiveBlending, type Blending, Color, NormalBlending } from "three";
import type { Theme } from "@/lib/theme/preference";
import tokens from "@/styles/tokens.generated.json";

type ColourToken = Exclude<keyof typeof tokens.color, "$type">;

function colour(name: ColourToken): Color {
  return new Color(tokens.color[name].$value.hex);
}

/**
 * The hero scene's colours per theme, from DESIGN.md's tokens (the DTCG
 * export), never literal hex (DESIGN.md → 3D Scenes: "Colours come from the
 * tokens; lights are white (surface-raised, Lab value)").
 */
export interface ScenePalette {
  readonly holo: Color;
  readonly success: Color;
  readonly danger: Color;
  /** The challenge comet. */
  readonly accent: Color;
  /** Host: Deck accent; Lab edge accent-ink, core accent. */
  readonly hostEdge: Color;
  readonly hostCore: Color;
  readonly metal: Color;
  readonly chip: Color;
  readonly pin: Color;
  readonly light: Color;
  /** Deck blends holo light additively; Lab uses normal blending. */
  readonly blending: Blending;
  /** The cone: 0.28 in Deck, 0.16 in Lab. */
  readonly coneOpacity: number;
  /** Bloom in Deck only. */
  readonly bloom: boolean;
}

const LAB: ScenePalette = {
  holo: colour("holo"),
  success: colour("success"),
  danger: colour("danger"),
  accent: colour("accent"),
  hostEdge: colour("accent-ink"),
  hostCore: colour("accent"),
  metal: colour("scene-metal"),
  chip: colour("scene-chip"),
  pin: colour("scene-pin"),
  light: colour("surface-raised"),
  blending: NormalBlending,
  coneOpacity: 0.16,
  bloom: false,
};

const DECK: ScenePalette = {
  holo: colour("holo-dark"),
  success: colour("success-dark"),
  danger: colour("danger-dark"),
  accent: colour("accent-dark"),
  hostEdge: colour("accent-dark"),
  hostCore: colour("accent-dark"),
  metal: colour("scene-metal-dark"),
  chip: colour("scene-chip"),
  pin: colour("scene-pin"),
  light: colour("surface-raised"),
  blending: AdditiveBlending,
  coneOpacity: 0.28,
  bloom: true,
};

export function scenePalette(theme: Theme): ScenePalette {
  return theme === "dark" ? DECK : LAB;
}
