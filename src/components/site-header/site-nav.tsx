import type { NavLink } from "@/components/page/page-sections";

/**
 * The inline nav from md (DESIGN.md → Header): `nav-link`s in ink with no
 * underline; hover turns them `accent` with a 1 px underline; 44 px targets.
 * Below md the menu disclosure shows the same links.
 */
export function SiteNav({
  label,
  links,
}: {
  readonly label: string;
  readonly links: readonly NavLink[];
}) {
  return (
    <nav aria-label={label} className="hidden md:mr-md md:block">
      <ul className="flex items-center gap-lg">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex min-h-target items-center type-label text-primary decoration-1 transition-feedback hover:text-accent hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
