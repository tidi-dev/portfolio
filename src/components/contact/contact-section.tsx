import { FactsList } from "@/components/lists/facts-list";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { contactFacts } from "@/lib/content/facts";
import { fillSize } from "@/lib/format/file-size";
import { typography } from "@/lib/format/typography";
import { RESUME_FILE } from "@/lib/resume/file";

// The Résumé row joins only when the PDF exists, with its real size.
const ROWS = contactFacts(
  contact,
  RESUME_FILE === undefined
    ? undefined
    : {
        term: copy.resume.link,
        text: fillSize(copy.resume.contactLink, RESUME_FILE.bytes),
        href: RESUME_FILE.href,
      },
);

/**
 * Contact (DESIGN.md → Contact, footer, other surfaces): the h2 is the
 * owner's sign-off in `heading-section`, and it carries the section's anchor
 * (`id="contact"`), where the nav's "Contact" and the hero's call to action
 * land. Then the facts list with 48 px rows: Email, Telegram and GitHub as
 * links, the Résumé row ("PDF, {size}", downloading the PDF) when the PDF
 * exists, and last the location as plain text, shown nowhere else on the
 * page (O4). Stacked
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
