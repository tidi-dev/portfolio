import type { ReactNode } from "react";
import type { Term } from "@/content/schema/primitives";
import type { FactRow, FactValue } from "@/lib/content/facts";
import { joinMiddot, typography } from "@/lib/format/typography";
import type {
  ResumeCompactProject,
  ResumeFullProject,
  ResumeModel,
} from "@/lib/resume/model";

/*
 * The résumé PDF's A4 layout (plan → Phase 5; contrib-engineering §7):
 * pure React with no next/* imports, rendered to static markup by
 * scripts/resume/render.ts and printed by Chromium. The Lab (light) tokens
 * only: Chakra Petch headings and labels, Mona Sans text, `primary` text,
 * `text-muted` names, dates and notes, holo `line` under each section
 * heading, `accent-ink` for the owner's labels and links, `holo` for the
 * role and statuses. No 3D, glow, chamfer or avatar.
 *
 * Lists are joined with real separators (not CSS-generated ones), so text
 * extraction reads them.
 */

// The owner's separator in the "Name — description" strings (info.md).
const OWNER_DASH = " — ";

const LIST_SEPARATOR = ", ";

function joined(items: readonly string[]): string {
  return items.map(typography).join(LIST_SEPARATOR);
}

function PdfLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <a href={href} className="text-accent-ink underline">
      {children}
    </a>
  );
}

function Value({ value }: { readonly value: FactValue }) {
  switch (value.kind) {
    case "text":
      return typography(value.text);
    case "list":
      return joined(value.items);
    case "link":
    case "download":
      return <PdfLink href={value.href}>{typography(value.text)}</PdfLink>;
  }
}

/**
 * A facts list: the term in `nav` type, accent-ink, at the stat-key width.
 * The PDF uses no upper-case or tracked type, so its text extracts exactly
 * as content stores it.
 */
function Facts({
  rows,
  columns = 1,
}: {
  readonly rows: readonly FactRow[];
  readonly columns?: 1 | 2;
}) {
  return (
    <dl
      className={
        columns === 1 ? "flex flex-col" : "grid grid-cols-2 gap-x-gutter"
      }
    >
      {rows.map((row) => (
        <div key={row.term} className="flex items-baseline gap-sm">
          <dt className="w-stat-key shrink-0 type-nav text-accent-ink">
            {row.term}
          </dt>
          <dd className="min-w-0 flex-1 type-caption text-primary tabular-nums">
            <Value value={row.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The owner's "Name — description" strings: the term in `nav` type,
 * then the description on the same line, rejoined with the owner's own
 * dash, so each item reads as info.md writes it.
 */
function Terms({ items }: { readonly items: readonly Term[] }) {
  return (
    <dl className="flex flex-col gap-2xs">
      {items.map((item) => (
        <div key={item.term} className="type-caption text-primary">
          <dt className="inline type-nav">{typography(item.term)}</dt>
          <dd className="inline">
            {OWNER_DASH}
            {typography(item.description)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Bullets({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2xs ps-md type-caption text-primary">
      {items.map((item) => (
        <li key={item}>{typography(item)}</li>
      ))}
    </ul>
  );
}

/**
 * A section: its h2 in `heading-quest` over a holo `line`, then the
 * content.
 * The heading keeps the approved sentence case (resume.section-labels): no
 * upper-case type, so the PDF's text and outline read the label exactly.
 * Headings keep their spaces with `whitespace-pre-wrap`: Chromium builds
 * the PDF outline from the laid-out lines and drops a collapsed space at a
 * line break.
 */
function ResumeSection({
  id,
  heading,
  children,
}: {
  readonly id: string;
  readonly heading: string;
  readonly children: ReactNode;
}) {
  const headingId = `resume-${id}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-xs">
      <h2
        id={headingId}
        className="border-b border-line pb-2xs type-heading-quest whitespace-pre-wrap text-primary"
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

/** A name with a note beside it, and the period or meta at the right. */
function EntryHead({
  name,
  note,
  aside,
}: {
  readonly name: string;
  readonly note?: ReactNode;
  readonly aside?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-md">
      <div className="flex items-baseline gap-sm">
        <h3 className="type-body-strong text-primary">{name}</h3>
        {note === undefined ? null : note}
      </div>
      {aside === undefined ? null : (
        <p className="shrink-0 type-caption text-text-muted">{aside}</p>
      )}
    </div>
  );
}

function FullProject({ project }: { readonly project: ResumeFullProject }) {
  return (
    <article className="flex break-inside-avoid flex-col gap-xs">
      <div>
        <EntryHead
          name={project.name}
          note={<p className="type-nav text-holo">{project.status}</p>}
          aside={project.period}
        />
        <p className="type-caption text-primary">{typography(project.lede)}</p>
      </div>
      <div>
        <Facts rows={project.facts} />
        {project.usage === undefined ? null : (
          <>
            <Facts rows={project.usage.figures} />
            <p className="type-caption text-text-muted">
              {typography(project.usage.window)}
            </p>
            <Facts rows={[project.usage.impact]} />
          </>
        )}
        {project.stack === undefined ? null : <Facts rows={[project.stack]} />}
      </div>
      {project.partyLead === undefined ? null : (
        <Terms items={[project.partyLead]} />
      )}
      <div className="flex flex-col gap-2xs">
        <h4 className="type-nav text-accent-ink">{project.body.heading}</h4>
        {project.body.kind === "bullets" ? (
          <Bullets items={project.body.items} />
        ) : (
          <Terms items={project.body.items} />
        )}
      </div>
    </article>
  );
}

function CompactProject({
  project,
}: {
  readonly project: ResumeCompactProject;
}) {
  return (
    <article className="flex break-inside-avoid flex-col gap-xs">
      <div>
        <EntryHead name={project.name} aside={joinMiddot(project.meta)} />
        <p className="type-caption text-primary">
          {typography(project.oneLiner)}
        </p>
      </div>
      <Facts rows={project.facts} />
      {project.link === undefined ? null : (
        <p className="type-caption">
          <PdfLink href={project.link.url}>{project.link.text}</PdfLink>
        </p>
      )}
    </article>
  );
}

/**
 * The document body. scripts/resume/render.ts wraps it in the html element,
 * with the title (resume.title, the PDF's title) and the compiled
 * print.css.
 */
export function ResumeDocument({ model }: { readonly model: ResumeModel }) {
  return (
    <body className="bg-surface-raised type-caption text-primary">
      <main className="flex flex-col gap-md">
        <header className="flex flex-col gap-xs">
          {/* One line. Each space sits inside its span, and pre-wrap keeps
              it: Chromium builds the outline entry from the laid-out text
              and drops the spaces between elements. */}
          <h1 className="whitespace-pre-wrap">
            <span className="type-heading-section text-primary">
              {model.brand}{" "}
            </span>
            <span
              lang={model.nativeName.lang}
              className="me-xs type-name text-text-muted"
            >
              {model.nativeName.text}{" "}
            </span>
            <span className="type-name text-text-muted">{model.name}</span>
          </h1>
          <p className="type-body-strong text-holo">{model.role}</p>
        </header>

        <ResumeSection id="profile" heading={model.profile.heading}>
          <p className="max-w-measure type-body-sm text-primary">
            {typography(model.profile.summary)}
          </p>
        </ResumeSection>

        <ResumeSection id="experience" heading={model.experience.heading}>
          <div className="flex flex-col gap-sm">
            {model.experience.entries.map((entry) => (
              <article key={entry.employer}>
                <EntryHead
                  name={entry.employer}
                  note={
                    <p className="type-caption text-primary">{entry.title}</p>
                  }
                  aside={entry.period}
                />
                <p className="type-caption text-text-muted">
                  {joined(entry.projects)}
                </p>
              </article>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection id="projects" heading={model.projects.heading}>
          <div className="flex flex-col gap-md">
            {model.projects.entries.map((project) =>
              project.kind === "full" ? (
                <FullProject key={project.id} project={project} />
              ) : (
                <CompactProject key={project.id} project={project} />
              ),
            )}
          </div>
        </ResumeSection>

        <ResumeSection id="skills" heading={model.skills.heading}>
          <dl className="flex flex-col">
            {model.skills.groups.map((group) => (
              <div key={group.name} className="flex items-baseline gap-sm">
                <dt className="w-stat-key shrink-0 type-nav text-accent-ink">
                  {group.name}
                </dt>
                <dd className="min-w-0 flex-1 type-caption text-primary">
                  {joined(group.items)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="type-caption text-primary">
            {joined(model.skills.more)}
          </p>
        </ResumeSection>

        <ResumeSection id="education" heading={model.education.heading}>
          <div className="flex flex-col gap-2xs">
            {model.education.degrees.map((entry) => (
              <EntryHead
                key={entry.degree}
                name={entry.degree}
                note={
                  <p className="type-caption text-primary">{entry.school}</p>
                }
                aside={entry.years}
              />
            ))}
            {model.education.certifications.map((entry) => (
              <article key={entry.subject}>
                <h3 className="type-body-strong text-primary">
                  {entry.subject}
                </h3>
                <p className="type-caption text-primary">
                  {joinMiddot(entry.credentials)}
                </p>
              </article>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection id="languages" heading={model.languages.heading}>
          <ul className="flex flex-col gap-2xs">
            {model.languages.items.map((item) => (
              <li
                key={item.language}
                className="flex items-baseline gap-sm type-caption"
              >
                <span className="type-nav text-primary">{item.language}</span>
                {item.credentials.length === 0 ? null : (
                  <span className="text-text-muted">
                    {joinMiddot(item.credentials)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection id="contact" heading={model.contact.heading}>
          <Facts rows={model.contact.rows} columns={2} />
        </ResumeSection>
      </main>
    </body>
  );
}
