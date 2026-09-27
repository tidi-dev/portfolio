import type { Section, SectionId } from "@/content/schema/sections";

/**
 * The sections the page renders, in the registry's order: those with content
 * (`present`) whose component is built. The nav and the hero's call to action
 * read the same list, so no link can point at a section that isn't on the
 * page (contrib-engineering §3.1; the Phase 4 brief: no dangling anchors).
 */
export function renderedSections(
  sections: readonly Section[],
  built: ReadonlySet<SectionId>,
): Section[] {
  return sections.filter((section) => section.present && built.has(section.id));
}

/** A section's link, which works from any route: the home page's anchor. */
export function sectionHref(id: SectionId): string {
  return `/#${id}`;
}
