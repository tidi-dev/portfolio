import { PixelGlyph } from "@/components/ui/pixel-glyph";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { typography } from "@/lib/format/typography";
import { CtaPair } from "./cta-pair";

export const HERO_TITLE_ID = "hero-title";

/**
 * The hero intro (DESIGN.md → Hero intro): "▸ PLAYER 1"; one h1 holding
 * "TiDi" (display, with its sprite shadow), "Hồ Trọng Đại" (lang="vi") and
 * "Dai Ho Trong" (pixel `name`, 2xs below the brand's shadow so the
 * stacked tones clear it); the role with its holo lead line;
 * hero.sentence in `body` at measure-hero; the CTA pair. Each of the five
 * lines wipes in on load (`hero-intro`).
 */
export function HeroLockup() {
  return (
    <div className="hero-intro flex flex-col items-start gap-md">
      <p className="inline-flex items-center gap-2xs type-label text-accent-ink">
        <PixelGlyph name="caret-right" />
        {copy.ui.player}
      </p>
      <h1 id={HERO_TITLE_ID} className="flex flex-col gap-sm">
        <span className="type-display text-primary brand-shadow">
          {identity.brand}
        </span>
        <span className="mt-2xs flex flex-wrap gap-x-md gap-y-2xs type-name text-text-muted">
          <span lang={identity.nativeName.lang}>
            {identity.nativeName.text}
          </span>
          <span>{identity.name}</span>
        </span>
      </h1>
      <p className="lead-line type-role text-holo">{identity.role}</p>
      <p className="max-w-measure-hero type-body">
        {typography(copy.hero.sentence)}
      </p>
      <CtaPair />
    </div>
  );
}
