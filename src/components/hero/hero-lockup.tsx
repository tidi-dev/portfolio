import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { typography } from "@/lib/format/typography";
import { CtaPair } from "./cta-pair";

export const HERO_TITLE_ID = "hero-title";

/**
 * The hero intro (DESIGN.md → Hero intro): "▸ PLAYER 1"; one h1 holding
 * "TiDi", "Hồ Trọng Đại" (lang="vi") and "Dai Ho Trong"; the role with its
 * holo lead line; hero.sentence; the CTA pair. Each of the five lines wipes
 * in on load (`hero-intro`).
 */
export function HeroLockup() {
  return (
    <div className="hero-intro flex flex-col items-start gap-md">
      <p className="inline-flex items-center gap-2xs type-label text-accent-ink">
        <Icon name="caret-right-filled" />
        {copy.ui.player}
      </p>
      <h1 id={HERO_TITLE_ID} className="flex flex-col gap-sm">
        <span className="type-display text-primary brand-glow">
          {identity.brand}
        </span>
        <span className="flex flex-wrap gap-x-md gap-y-2xs type-name text-text-muted">
          <span lang={identity.nativeName.lang}>
            {identity.nativeName.text}
          </span>
          <span>{identity.name}</span>
        </span>
      </h1>
      <p className="lead-line type-role text-holo">{identity.role}</p>
      <p className="max-w-measure-hero">{typography(copy.hero.sentence)}</p>
      <CtaPair />
    </div>
  );
}
