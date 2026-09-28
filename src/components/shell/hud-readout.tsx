import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { hudKeyValue } from "@/lib/format/typography";
import { XpBar } from "./xp-bar";

const LEVEL = hudKeyValue(copy.hud.level);
const MAX = hudKeyValue(copy.hud.max);

/**
 * The HUD readout (DESIGN.md → HUD bar, Responsive Behavior): "▸ PLAYER 1"
 * (from 375 px) and the XP bar always; "LVL still leveling" from md; "XP ·
 * SYSTEM DESIGN" and "MAX not a thing" from 2xl. The owner's banner lines
 * (hud.banner), keys in `label` type, values as he cased them.
 */
export function HudReadout() {
  return (
    <div className="ml-auto flex min-w-0 items-center gap-sm whitespace-nowrap">
      <span className="hidden items-center gap-2xs type-label text-accent-ink xs:inline-flex">
        <Icon name="caret-right-filled" />
        {copy.ui.player}
      </span>
      <span className="hidden type-label text-text-muted 2xl:inline">
        {copy.hud.xpKey}
      </span>
      <XpBar />
      <span className="hidden items-baseline gap-xs md:inline-flex">
        <span className="type-label text-text-muted">{LEVEL.key}</span>
        <span className="type-nav text-primary">{LEVEL.value}</span>
      </span>
      <span className="hidden items-baseline gap-xs 2xl:inline-flex">
        <span className="type-label text-text-muted">{MAX.key}</span>
        <span className="type-nav text-primary">{MAX.value}</span>
      </span>
    </div>
  );
}
