import {
  IconCaretRightFilled,
  IconCheck,
  IconDeviceFloppy,
  IconFileDownload,
  IconKey,
  IconMenu2,
  IconMoon,
  IconPlayerPause,
  IconPlayerPlay,
  IconStopwatch,
  IconSun,
  IconTool,
  IconWall,
  IconX,
} from "@tabler/icons-react";

/**
 * DESIGN.md → Shapes → Icons: Tabler, from the list there. Filled
 * caret-right renders the "▸" of "▸ PLAYER 1", which neither font has
 * (plan → Rulings → Glyphs). Phase 4 adds the rest of the list as it uses
 * them.
 */
const ICONS = {
  "caret-right-filled": IconCaretRightFilled,
  check: IconCheck,
  "device-floppy": IconDeviceFloppy,
  "file-download": IconFileDownload,
  key: IconKey,
  "menu-2": IconMenu2,
  moon: IconMoon,
  "player-pause": IconPlayerPause,
  "player-play": IconPlayerPlay,
  stopwatch: IconStopwatch,
  sun: IconSun,
  tool: IconTool,
  wall: IconWall,
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
