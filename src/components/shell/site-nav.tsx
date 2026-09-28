export interface NavLink {
  readonly href: string;
  readonly label: string;
}

/**
 * The nav from xl (DESIGN.md → HUD bar): `nav-link`s in primary, hover
 * accent-ink, 44 px targets. Below xl the menu sheet holds the same links.
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
      <ul className="flex items-center gap-md">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex min-h-target items-center type-nav whitespace-nowrap text-primary transition-colors duration-feedback hover:text-accent-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
