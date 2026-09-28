import { NavList } from "./nav-list.client";

export interface NavLink {
  /** The section's id, which scroll-spy reports. */
  readonly id: string;
  readonly href: string;
  readonly label: string;
}

/**
 * The nav from xl (DESIGN.md → HUD bar): `nav-link`s in primary, hover
 * accent-ink, 44 px targets; the current section (scroll-spy) takes the
 * 2 px state-bar underline and `aria-current`. Below xl the menu sheet
 * holds the same links.
 */
export function SiteNav({
  label,
  links,
}: {
  readonly label: string;
  readonly links: readonly NavLink[];
}) {
  return (
    <nav aria-label={label} className="hidden xl:block">
      <NavList links={links} />
    </nav>
  );
}
