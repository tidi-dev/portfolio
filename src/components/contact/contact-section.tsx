import { FactsList } from "@/components/lists/facts-list";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { contactFacts } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";

const ROWS = contactFacts(contact);

/**
 * Contact (DESIGN.md → Contact, footer, other surfaces): the h2 is the
 * owner's sign-off in `heading-section`, and it carries the section's anchor
 * (`id="contact"`), where the nav's "Contact" and the hero's call to action
 * land. Then the facts list with 48 px rows: Email, Telegram and GitHub as
 * links, and last the location as plain text, shown nowhere else on the
 * page (O4). The Résumé row joins in Phase 10, once the PDF exists. Stacked
 * below lg; from lg the sign-off takes cols 1–7 and the list cols 9–12.
 */
export function ContactSection({
  section,
}: {
  readonly section: SectionEntry;
}) {
  return (
    <section
      aria-labelledby={section.id}
      className="grid grid-cols-1 gap-y-xl lg:grid-cols-12 lg:gap-x-gutter"
    >
      <h2 id={section.id} className="type-heading-section lg:col-span-7">
        {typography(about.signOff)}
      </h2>
      <div className="lg:col-span-4 lg:col-start-9">
        <FactsList rows={ROWS} variant="contact" />
      </div>
    </section>
  );
}
