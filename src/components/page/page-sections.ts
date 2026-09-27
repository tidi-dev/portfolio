import type { ComponentType } from "react";
import { QuestJournal } from "@/components/quest-journal/quest-journal";
import { sections } from "@/content/sections";
import type { Section, SectionId } from "@/content/schema/sections";
import { site } from "@/content/site";
import { renderedSections, sectionHref } from "@/lib/content/sections";

type SectionComponent = ComponentType<{ readonly section: Section }>;

/**
 * The section components built so far, by registry id. Experience, House
 * rules, Inventory, About, AFK and Contact join in Phase 9; until then the
 * nav doesn't link to them and the hero's call to action waits for Contact.
 */
const SECTION_COMPONENTS: Partial<Record<SectionId, SectionComponent>> = {
  "quest-journal": QuestJournal,
};

/** The page's sections, in DESIGN.md's order, each with its component. */
export const PAGE_SECTIONS = renderedSections(
  sections,
  new Set(Object.keys(SECTION_COMPONENTS) as SectionId[]),
).flatMap((section) => {
  const Component = SECTION_COMPONENTS[section.id];
  return Component === undefined ? [] : [{ section, Component }];
});

export interface NavLink {
  readonly href: string;
  readonly label: string;
}

/** The nav: the rendered sections the registry puts in it. */
export const NAV_LINKS: readonly NavLink[] = PAGE_SECTIONS.filter(
  ({ section }) => section.nav,
).map(({ section }) => ({
  href: sectionHref(section.id),
  label: section.label,
}));

/** The hero CTA's target, once its section renders (site.primaryAction: Contact). */
export const PRIMARY_ACTION_HREF: string | undefined = PAGE_SECTIONS.some(
  ({ section }) => section.id === site.primaryAction,
)
  ? sectionHref(site.primaryAction)
  : undefined;
