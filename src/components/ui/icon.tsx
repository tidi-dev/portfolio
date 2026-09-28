import {
  IconBallFootball,
  IconBrandGithub,
  IconBrandTelegram,
  IconCheck,
  IconCoffee,
  IconDeviceFloppy,
  IconDeviceGamepad2,
  IconExternalLink,
  IconFeather,
  IconFileDownload,
  IconKey,
  IconMail,
  IconMapPin,
  IconMenu2,
  IconMoon,
  IconPlayerPause,
  IconPlayerPlay,
  IconStopwatch,
  IconSun,
  IconSwimming,
  IconTool,
  IconWall,
  IconX,
} from "@tabler/icons-react";

/**
 * DESIGN.md → Shapes → Icons: Tabler, from the list there. The game glyphs
 * ▸ ▼ ▲ are Portfolio Pixel glyphs, not icons (pixel-glyph.tsx).
 */
const ICONS = {
  "ball-football": IconBallFootball,
  "brand-github": IconBrandGithub,
  "brand-telegram": IconBrandTelegram,
  check: IconCheck,
  coffee: IconCoffee,
  "device-floppy": IconDeviceFloppy,
  "device-gamepad-2": IconDeviceGamepad2,
  "external-link": IconExternalLink,
  feather: IconFeather,
  "file-download": IconFileDownload,
  key: IconKey,
  mail: IconMail,
  "map-pin": IconMapPin,
  "menu-2": IconMenu2,
  moon: IconMoon,
  "player-pause": IconPlayerPause,
  "player-play": IconPlayerPlay,
  stopwatch: IconStopwatch,
  sun: IconSun,
  swimming: IconSwimming,
  tool: IconTool,
  wall: IconWall,
  x: IconX,
} as const;

export type IconName = keyof typeof ICONS;

/**
 * DESIGN.md → Consistency locks 4: 20 px by default, 24 px in Join party
 * and AFK.
 */
const SIZES = { base: 20, large: 24 } as const;

// Consistency locks 4: outline, stroke 1.5.
const STROKE = 1.5;

interface IconProps {
  readonly name: IconName;
  readonly size?: keyof typeof SIZES;
  /** Extra classes, e.g. the show-in-deck / show-motion-on switches. */
  readonly className?: string;
}

/**
 * An icon in `currentColor`, hidden from assistive tech: every icon sits
 * beside text or inside a named control.
 */
export function Icon({ name, size = "base", className }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      size={SIZES[size]}
      stroke={STROKE}
      className={className === undefined ? "shrink-0" : `shrink-0 ${className}`}
    />
  );
}
