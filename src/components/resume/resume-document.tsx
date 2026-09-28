import type { ReactNode } from "react";
import type { Term } from "@/content/schema/primitives";
import type { FactRow, FactValue } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import type {
  ResumeCompactProject,
  ResumeFullProject,
  ResumeModel,
} from "@/lib/resume/model";

/*
 * The résumé PDF's A4 layout (contrib-design §2, row 36; contrib-engineering
 * §7.1): pure React with no next/* imports, rendered to static markup by
 * scripts/resume/build.ts and printed by Chromium. Light tokens only:
 * `primary` text, `text-muted` terms and dates, `rule` dividers, and
 * `accent` on links only. Archivo only, no drawings, no photo.
 *
 * The structure mirrors the facts-list language: every section is a row
 * with its h2 as the term in the 88 px `facts-label` column, and the
 * section's content as the value. Lists are joined with real commas (not
 * the site's CSS-generated ones), so text extraction reads them.
 */

// The owner's separator in the "Name — description" strings (info.md).
const OWNER_DASH = " — ";

function joined(items: readonly string[]): string {
  return items.map(typography).join(", ");
}

function PdfLink({
  href,
  children,
}: {
  readonly href: string;
  readonly children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-accent underline decoration-1 underline-offset-link"
    >
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
 * A facts list: terms in `label-strong`, `text-muted`, values in `body-sm`.
 * Contact's four short rows run in two columns.
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
          <dt className="w-facts-label shrink-0 type-label-strong text-text-muted">
            {row.term}
          </dt>
          <dd className="min-w-0 flex-1 type-body-sm tabular-nums">
            <Value value={row.value} />
            {row.qualifier === undefined ? null : (
              <>
                {" "}
                <span className="text-text-muted">
                  {typography(row.qualifier)}
                </span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The owner's "Name — description" strings (content splits them at the
 * dash): the term in `ui-strong`, then the description on the same line,
 * rejoined with the owner's own dash, so each item reads as info.md writes
 * it, in the layout and in extracted text.
 */
function Terms({ items }: { readonly items: readonly Term[] }) {
  return (
    <dl className="flex flex-col">
      {items.map((item) => (
        <div key={item.term} className="type-body-sm">
          <dt className="inline type-ui-strong">{typography(item.term)}</dt>
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
    <ul className="bullet-list flex flex-col type-body-sm">
      {items.map((item) => (
        <li key={item}>{typography(item)}</li>
      ))}
    </ul>
  );
}

/**
 * A section row: the h2 as the term, the content as the value. Headings
 * keep their spaces with `whitespace-pre-wrap`: Chromium builds the PDF
 * outline from the laid-out lines and drops a collapsed space at a line
 * break ("Education &certifications").
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
    <section
      aria-labelledby={headingId}
      className="flex gap-gutter border-t border-rule pt-sm"
    >
      <h2
        id={headingId}
        className="w-facts-label shrink-0 type-label-strong whitespace-pre-wrap text-text-muted"
      >
        {heading}
      </h2>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}

/**
 * Title (with an employer's job title beside it), then status and dates on
 * the same baseline, as on the sheets.
 */
function ProjectHead({
  name,
  subtitle,
  children,
}: {
  readonly name: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-md">
      <div className="flex items-baseline gap-sm">
        <h3 className="type-ui-strong">{name}</h3>
        {subtitle === undefined ? null : (
          <p className="type-body-sm">{subtitle}</p>
        )}
      </div>
      <p className="flex shrink-0 items-baseline gap-x-sm">{children}</p>
    </div>
  );
}

function FullProject({ project }: { readonly project: ResumeFullProject }) {
  return (
    <article>
      <ProjectHead name={project.name}>
        <span className="type-label-strong">{project.status}</span>{" "}
        <span className="type-label text-text-muted">{project.period}</span>
      </ProjectHead>
      <p className="type-body-sm">{typography(project.lede)}</p>
      <div className="mt-xs">
        <Facts rows={project.facts} />
      </div>
      {project.partyLead === undefined ? null : (
        <div className="mt-xs">
          <Terms items={[project.partyLead]} />
        </div>
      )}
      <h4 className="mt-xs type-label-strong text-text-muted">
        {project.body.heading}
      </h4>
      <div className="mt-2xs">
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
    <article className="break-inside-avoid">
      <ProjectHead name={project.name}>
        {project.meta.map((part) => (
          <span key={part} className="type-label text-text-muted">
            {part}
          </span>
        ))}
      </ProjectHead>
      <p className="type-body-sm">{typography(project.oneLiner)}</p>
      <div className="mt-xs">
        <Facts rows={project.facts} />
      </div>
      {project.link === undefined ? null : (
        <p className="mt-2xs type-body-sm">
          <PdfLink href={project.link.url}>{project.link.text}</PdfLink>
        </p>
      )}
    </article>
  );
}

/**
 * The document body. scripts/resume/render.ts wraps it in the html element,
 * with the title (Approved copy, resume.title, the PDF's title) and the
 * compiled print.css.
 */
export function ResumeDocument({ model }: { readonly model: ResumeModel }) {
  return (
    <body className="bg-surface-raised type-body-sm text-primary">
      <main className="flex flex-col gap-sm">
        <header>
          {/* whitespace-pre-wrap: see ResumeSection (the outline entry). */}
          <h1 className="whitespace-pre-wrap">
            <span className="type-heading-section">{model.brand}</span>{" "}
            <span className="block type-name">
              <span lang={model.nativeName.lang}>{model.nativeName.text}</span>{" "}
              <span className="text-text-muted">{model.name}</span>
            </span>
          </h1>
          <p className="mt-sm type-ui-strong">{model.role}</p>
          <p className="mt-2xs type-body-sm">{typography(model.summary)}</p>
        </header>

        <ResumeSection id="contact" heading={model.contact.heading}>
          <Facts rows={model.contact.rows} columns={2} />
        </ResumeSection>

        <ResumeSection id="experience" heading={model.experience.heading}>
          <div className="flex flex-col gap-xs">
            {model.experience.entries.map((entry) => (
              <article key={entry.employer}>
                <ProjectHead name={entry.employer} subtitle={entry.title}>
                  <span className="type-label text-text-muted">
                    {entry.period}
                  </span>
                </ProjectHead>
                <p className="type-body-sm">{joined(entry.projects)}</p>
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
                <dt className="w-facts-label shrink-0 type-label-strong text-text-muted">
                  {group.name}
                </dt>
                <dd className="min-w-0 flex-1 type-body-sm">
                  {joined(group.items)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2xs type-body-sm">{joined(model.skills.more)}</p>
        </ResumeSection>

        <ResumeSection id="education" heading={model.education.heading}>
          <dl className="flex flex-col">
            {model.education.degrees.map((entry) => (
              <div
                key={entry.degree}
                className="flex items-baseline gap-sm type-body-sm"
              >
                <dt className="type-ui-strong">{entry.degree}</dt>
                <dd className="flex flex-1 items-baseline justify-between gap-md">
                  <span>{entry.school}</span>
                  <span className="type-label text-text-muted">
                    {entry.years}
                  </span>
                </dd>
              </div>
            ))}
            {model.education.certifications.map((entry) => (
              <div
                key={entry.subject}
                className="flex items-baseline gap-sm type-body-sm"
              >
                <dt className="type-ui-strong">{entry.subject}</dt>
                <dd>{joined(entry.credentials)}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection id="languages" heading={model.languages.heading}>
          <p className="type-body-sm">{joined(model.languages.items)}</p>
        </ResumeSection>

        <ResumeSection id="interests" heading={model.interests.heading}>
          <p className="type-body-sm">{joined(model.interests.items)}</p>
        </ResumeSection>
      </main>
    </body>
  );
}
