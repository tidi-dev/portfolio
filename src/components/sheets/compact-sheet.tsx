import { FactsList } from "@/components/lists/facts-list";
import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import type { CompactProject } from "@/content/schema/projects";
import { compactFacts } from "@/lib/content/facts";
import { formatPeriod } from "@/lib/format/period";
import { typography } from "@/lib/format/typography";

interface CompactSheetProps {
  readonly project: CompactProject;
  /** The employer whose project it was (experience.ts): the meta line. */
  readonly employer: string;
}

/**
 * A compact sheet (DESIGN.md → Sheets; contrib-design §1.4): the h3, a meta
 * line (the employer, plus dates where info.md has them), the approved
 * one-liner, what was built and the stack as a facts list, and the link
 * where info.md has one. Absent slots render nothing: Scania has no dates
 * and no link. The link opens in the same tab, with `external-link`, on its
 * own 44 px row.
 */
export function CompactSheet({ project, employer }: CompactSheetProps) {
  const titleId = `${project.id}-title`;

  return (
    <article aria-labelledby={titleId}>
      <h3 id={titleId} className="type-heading-sheet">
        {project.name}
      </h3>
      <p className="mt-2xs flex flex-wrap items-baseline gap-x-sm type-label text-text-muted">
        <span>{employer}</span>
        {project.period === undefined ? null : (
          <span>{formatPeriod(project.period, copy.format.period)}</span>
        )}
      </p>
      <p className="mt-xs max-w-measure-lead type-lead">
        {typography(project.oneLiner)}
      </p>
      <div className="mt-lg">
        <FactsList rows={compactFacts(project)} />
      </div>
      {project.link === undefined ? null : (
        <p className="mt-sm">
          <a
            href={project.link.url}
            className="group inline-flex min-h-target items-center gap-xs type-body text-accent transition-feedback hover:text-accent-hover"
          >
            <span className="underline decoration-1 underline-offset-link group-hover:decoration-2">
              {project.link.text}
            </span>
            <Icon name="external-link" />
          </a>
        </p>
      )}
    </article>
  );
}
