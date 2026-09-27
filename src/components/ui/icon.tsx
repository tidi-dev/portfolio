import {
  IconCheck,
  IconDownload,
  IconExternalLink,
  IconMenu2,
  IconMoon,
  IconPlayerPlay,
  IconSquare,
  IconSquareCheck,
  IconSun,
  IconX,
} from "@tabler/icons-react";

/** DESIGN.md → Shapes → Icons: the ten Tabler outline icons, and no others. */
const ICONS = {
  sun: IconSun,
  moon: IconMoon,
  "menu-2": IconMenu2,
  x: IconX,
  "external-link": IconExternalLink,
  download: IconDownload,
  "player-play": IconPlayerPlay,
  check: IconCheck,
  square: IconSquare,
  "square-check": IconSquareCheck,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  readonly name: IconName;
  /** Shown in one theme only (the theme toggle's sun and moon; globals.css). */
  readonly theme?: "light" | "dark";
}

/**
 * A Tabler outline icon at 20 px with stroke 1.5, square caps and miter
 * joins, in `currentColor`, hidden from assistive tech: every icon sits next
 * to text or inside a named control (DESIGN.md → Shapes → Icons). The sizes
 * come from tokens in CSS, which override Tabler's default attributes.
 */
export function Icon({ name, theme }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      aria-hidden="true"
      data-theme-icon={theme}
      className="size-icon shrink-0 stroke-icon icon-joins"
    />
  );
}
