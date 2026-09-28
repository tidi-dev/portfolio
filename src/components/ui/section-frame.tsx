import type { ReactNode } from "react";
import type { Section } from "@/content/schema/sections";
import { SectionHeading } from "./section-heading";

/** A section's heading id, which labels the section. */
export function sectionTitleId(section: Section): string {
  return `${section.id}-title`;
}

/**
 * A page section (contrib-design §1.2; DESIGN.md → Layout → Rhythm): the
 * registry's anchor and h2, the section padding, and the 1240 px
 * container, heading to content `lg`.
 */
export function SectionFrame({
  section,
  focusTarget,
  children,
}: {
  readonly section: Section;
  /** The h2 takes focus from a control (Press A to continue → AFK). */
  readonly focusTarget?: true;
  readonly children: ReactNode;
}) {
  const titleId = sectionTitleId(section);
  return (
    <section
      id={section.id}
      aria-labelledby={titleId}
      className="section-y page-x"
    >
      <div className="mx-auto flex max-w-container flex-col gap-lg">
        {focusTarget === undefined ? (
          <SectionHeading id={titleId}>{section.label}</SectionHeading>
        ) : (
          <SectionHeading id={titleId} focusTarget>
            {section.label}
          </SectionHeading>
        )}
        {children}
      </div>
    </section>
  );
}
