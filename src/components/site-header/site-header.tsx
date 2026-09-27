import { NAV_LINKS } from "@/components/page/page-sections";
import { ThemeToggle } from "@/components/theme/theme-toggle.client";
import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { PAGE_COLOURS } from "@/lib/theme/page-colours";
import { MenuDisclosure } from "./menu-disclosure.client";
import { SiteNav } from "./site-nav";

/**
 * The header (DESIGN.md → Header, navigation, skip link): the wordmark
 * "TiDi" linking to the top of the page (`#top`, the shell's wrapper), the
 * nav, and the theme toggle; 56 px tall, 64 px from lg; not sticky. Below md the nav folds behind the menu button, and its
 * panel opens in flow under this row. The nav lists only sections the page
 * renders (page-sections.ts).
 */
export function SiteHeader() {
  const hasNav = NAV_LINKS.length > 0;

  return (
    <header className="flex flex-wrap items-center">
      <a
        href="#top"
        className="mr-auto inline-flex h-header items-center type-wordmark text-primary transition-feedback hover:text-accent lg:h-header-lg"
      >
        {identity.brand}
      </a>
      {hasNav ? <SiteNav label={copy.a11y.nav} links={NAV_LINKS} /> : null}
      <ThemeToggle
        label={copy.a11y.themeToggle}
        pageColours={PAGE_COLOURS}
        icons={
          <>
            <Icon name="sun" theme="light" />
            <Icon name="moon" theme="dark" />
          </>
        }
      />
      {hasNav ? (
        <MenuDisclosure
          label={copy.a11y.menuButton}
          navLabel={copy.a11y.nav}
          links={NAV_LINKS}
          openIcon={<Icon name="menu-2" />}
          closeIcon={<Icon name="x" />}
        />
      ) : null}
    </header>
  );
}
