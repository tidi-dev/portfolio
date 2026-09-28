import { sections } from "@/content/sections";
import { sectionHref } from "@/lib/content/sections";
import type { NavLink } from "./site-nav";

/**
 * The nav's sections, in page order (contrib-design §1.2: Quest journal,
 * Mission log, House rules, Inventory, Join party): the registry's nav
 * sections that have content, each with its id for scroll-spy.
 */
export const NAV_LINKS: readonly NavLink[] = sections
  .filter((section) => section.nav && section.present)
  .map((section) => ({
    id: section.id,
    href: sectionHref(section.id),
    label: section.label,
  }));
