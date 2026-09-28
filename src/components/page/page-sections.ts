import type { ComponentType } from "react";
import { AboutSection } from "@/components/about/about-section";
import { AfkSection } from "@/components/afk/afk-section";
import { ContactSection } from "@/components/contact/contact-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { HouseRulesSection } from "@/components/house-rules/house-rules-section";
import { InventorySection } from "@/components/inventory/inventory-section";
import { QuestJournal } from "@/components/quest-journal/quest-journal";
import { sections } from "@/content/sections";
import type { Section, SectionId } from "@/content/schema/sections";
import { site } from "@/content/site";
import { renderedSections, sectionHref } from "@/lib/content/sections";

type SectionComponent = ComponentType<{ readonly section: Section }>;

/**
 * Each section's component, by registry id. A section still renders only
 * when its content is present, and the nav and the hero's call to action
 * read the same list, so no link can dangle.
 */
const SECTION_COMPONENTS: Partial<Record<SectionId, SectionComponent>> = {
  "quest-journal": QuestJournal,
  experience: ExperienceSection,
  "house-rules": HouseRulesSection,
  inventory: InventorySection,
  about: AboutSection,
  afk: AfkSection,
  contact: ContactSection,
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
