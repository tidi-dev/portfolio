import { InlineList } from "@/components/lists/inline-list";
import { Subhead } from "@/components/lists/subhead";
import { Section } from "@/components/ui/section";
import { about } from "@/content/about";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { typography } from "@/lib/format/typography";
import { AboutAvatar } from "./about-avatar";

/**
 * Education & certifications: each degree with its school and years, then
 * each certification subject with its credentials, as a term list (term in
 * `ui-strong`, the rest in `body` 4 px below, the years in `meta`), in the
 * owner's words with no joining punctuation added.
 */
function Education() {
  const { education } = about;
  return (
    <div>
      <Subhead level={3}>{education.label}</Subhead>
      <dl className="mt-xs flex max-w-measure-body flex-col gap-md">
        {education.degrees.map((entry) => (
          <div key={entry.degree}>
            <dt className="type-ui-strong">{entry.degree}</dt>
            <dd className="mt-2xs type-body">{entry.school}</dd>
            <dd className="type-label text-text-muted">{entry.years}</dd>
          </div>
        ))}
        {education.certifications.map((entry) => (
          <div key={entry.subject}>
            <dt className="type-ui-strong">{entry.subject}</dt>
            <dd className="mt-2xs type-body">
              <InlineList items={entry.credentials} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * About (DESIGN.md → About avatar; contrib-design §1.2): the two bio
 * paragraphs verbatim (the first repeats the hero sentence, as ruled), the
 * avatar, then Education & certifications and Languages as h3 subheads.
 * Below lg, in DOM order: bio, avatar (at most 320 px), education,
 * languages. From lg: the text on cols 1–7 and the avatar on cols 9–12,
 * its top level with the first line of the bio (rows-about, globals.css).
 */
export function AboutSection({ section }: { readonly section: SectionEntry }) {
  return (
    <Section section={section}>
      <div className="mt-xl grid grid-cols-1 gap-y-xl lg:grid-cols-12 lg:rows-about lg:gap-x-gutter">
        <div className="flex max-w-measure-body flex-col gap-md lg:col-span-7 lg:col-start-1 lg:row-start-1">
          {about.bio.map((paragraph) => (
            <p key={paragraph} className="type-body">
              {typography(paragraph)}
            </p>
          ))}
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
          <AboutAvatar />
        </div>
        <div className="flex flex-col gap-xl lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <Education />
          <div>
            <Subhead level={3}>{about.languages.label}</Subhead>
            <div className="mt-xs type-body">
              <InlineList items={about.languages.items} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
