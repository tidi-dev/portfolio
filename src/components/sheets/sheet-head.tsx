import { copy } from "@/content/copy";
import type { FullProject } from "@/content/schema/projects";
import { formatPeriod } from "@/lib/format/period";

/**
 * The sheet head (DESIGN.md → Sheets): the h3 in `heading-sheet` on the
 * left; the status in `label-strong` (bold text, never a chip or a colour)
 * and the dates in `meta` on the right, on the same baseline. Stacked below
 * md (Responsive Behavior).
 */
export function SheetHead({
  project,
  titleId,
}: {
  readonly project: FullProject;
  readonly titleId: string;
}) {
  return (
    <div className="flex flex-col gap-2xs md:flex-row md:items-baseline md:justify-between md:gap-md">
      <h3 id={titleId} className="type-heading-sheet">
        {project.name}
      </h3>
      <p className="flex flex-wrap items-baseline gap-x-sm">
        <span className="type-label-strong">{project.status}</span>{" "}
        <span className="type-label text-text-muted">
          {formatPeriod(project.period, copy.format.period)}
        </span>
      </p>
    </div>
  );
}
