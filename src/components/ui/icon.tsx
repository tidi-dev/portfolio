import {
  IconCaretRightFilled,
  IconDeviceFloppy,
  IconFileDownload,
  IconMenu2,
  IconMoon,
  IconPlayerPause,
  IconPlayerPlay,
  IconSun,
  IconX,
} from "@tabler/icons-react";

/**
 * DESIGN.md → Shapes → Icons: Tabler, from the list there. Filled
 * caret-right renders the "▸" of "▸ PLAYER 1", which neither font has
 * (plan → Rulings → Glyphs). Phases 3–4 add the rest of the list as they
 * use them.
 */
const ICONS = {
  "caret-right-filled": IconCaretRightFilled,
  "device-floppy": IconDeviceFloppy,
  "file-download": IconFileDownload,
  "menu-2": IconMenu2,
  moon: IconMoon,
  "player-pause": IconPlayerPause,
  "player-play": IconPlayerPlay,
  sun: IconSun,
  x: IconX,
} as const;

export type IconName = keyof typeof ICONS;

// DESIGN.md → Consistency locks 4: outline, stroke 1.5, 20 px.
const SIZE = 20;
const STROKE = 1.5;

interface IconProps {
  readonly name: IconName;
  /** Extra classes, e.g. the show-in-deck / show-motion-on switches. */
  readonly className?: string;
}

/**
 * An icon in `currentColor`, hidden from assistive tech: every icon sits
 * beside text or inside a named control.
 */
export function Icon({ name, className }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      size={SIZE}
      stroke={STROKE}
      className={className === undefined ? "shrink-0" : `shrink-0 ${className}`}
    />
  );
}
