"use client";

import type { NavLink } from "./site-nav";
import { useCurrentSection } from "./use-current-section";

/**
 * The HUD strip's nav links (DESIGN.md → HUD bar): the link of the section
 * in view gets `aria-current="true"` and the 2 px state-bar underline
 * (shell.css). Before hydration, and without JavaScript, no link is
 * current.
 */
export function NavList({ links }: { readonly links: readonly NavLink[] }) {
  const current = useCurrentSection();
  return (
    <ul className="flex items-center gap-md">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            aria-current={current === link.id ? "true" : undefined}
            className="nav-link inline-flex min-h-target items-center type-nav whitespace-nowrap text-primary transition-colors duration-feedback hover:text-accent-ink"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
