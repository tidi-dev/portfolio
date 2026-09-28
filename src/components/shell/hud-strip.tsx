import Link from "next/link";
import { MotionToggle } from "@/components/theme/motion-toggle.client";
import { ThemeToggle } from "@/components/theme/theme-toggle.client";
import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { HudReadout } from "./hud-readout";
import { MenuSheet } from "./menu-sheet.client";
import { NAV_LINKS } from "./nav-links";
import { SiteNav } from "./site-nav";

/**
 * The HUD strip (DESIGN.md → HUD bar): a fixed 60 px glass strip that
 * slides down on load. Wordmark "TiDi" (to the top of the home page) · nav
 * (from xl) · readout · motion toggle · theme toggle · menu (below xl).
 * Along its bottom edge runs the level-up bar, which sweeps across once
 * when Leveling up is reached (DESIGN.md → Motion → Level up).
 */
export function HudStrip() {
  return (
    <header className="fixed inset-x-0 top-0 z-hud hud-enter border-b border-rule glass">
      <span aria-hidden="true" data-levelup-bar="" className="levelup-bar" />
      <div className="flex h-hud items-center gap-xs page-x md:gap-md">
        <Link
          href="/#top"
          className="inline-flex min-h-target min-w-target shrink-0 items-center type-wordmark text-primary transition-colors duration-feedback hover:text-accent-ink"
        >
          {identity.brand}
        </Link>
        <SiteNav label={copy.a11y.nav} links={NAV_LINKS} />
        <HudReadout />
        <div className="flex shrink-0 items-center">
          <MotionToggle
            label={copy.a11y.motionToggle}
            icons={
              <>
                <Icon name="player-pause" className="show-motion-on" />
                <Icon name="player-play" className="show-motion-off" />
              </>
            }
          />
          <ThemeToggle
            label={copy.a11y.themeToggle}
            icons={
              <>
                <Icon name="moon" className="show-in-lab" />
                <Icon name="sun" className="show-in-deck" />
              </>
            }
          />
          <MenuSheet
            label={copy.a11y.menuButton}
            navLabel={copy.a11y.nav}
            links={NAV_LINKS}
            openIcon={<Icon name="menu-2" />}
            closeIcon={<Icon name="x" />}
          />
        </div>
      </div>
    </header>
  );
}
