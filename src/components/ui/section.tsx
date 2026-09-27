import type { ReactNode } from "react";
import type { Section as SectionEntry } from "@/content/schema/sections";

/**
 * A page section (contrib-design §1.2): a `section` at its stable anchor from
 * the registry, labelled by its h2 in `heading-section`. Anchor targets keep
 * 24 px above them when the nav jumps (theme.supplement.css).
 */
export function Section({
  section,
  children,
}: {
  readonly section: SectionEntry;
  readonly children: ReactNode;
}) {
  const headingId = `${section.id}-heading`;
  return (
    <section id={section.id} aria-labelledby={headingId}>
      <h2 id={headingId} className="type-heading-section">
        {section.label}
      </h2>
      {children}
    </section>
  );
}
