import { InlineList } from "@/components/lists/inline-list";
import { Section } from "@/components/ui/section";
import { copy } from "@/content/copy";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { formatPeriod } from "@/lib/format/period";

/** Each employer row, with its projects' names (the Quest journal's titles). */
const ROWS = experience.map((entry) => ({
  entry,
  projectNames: entry.projects.map((id) => {
    const project = projects.find((candidate) => candidate.id === id);
    if (project === undefined) {
      throw new Error(`${entry.employer} lists an unknown project: ${id}`);
    }
    return project.name;
  }),
}));

/**
 * Experience (DESIGN.md → Experience, House rules, Inventory, AFK): each
 * employer with its h3 in `ui-strong`, the title, the dates in `meta` and
 * the projects as an inline list. Stacked below lg; from lg, aligned rows on
 * cols 1–3, 4–6, 7–8 and 9–12, split by a `divider`. No header row, so no
 * invented column labels.
 */
export function ExperienceSection({
  section,
}: {
  readonly section: SectionEntry;
}) {
  return (
    <Section section={section}>
      <div className="mt-xl flex flex-col gap-lg">
        {ROWS.map(({ entry, projectNames }, index) => (
          <div
            key={entry.employer}
            className={index === 0 ? undefined : "border-t border-rule pt-lg"}
          >
            <div className="grid grid-cols-1 gap-y-2xs lg:grid-cols-12 lg:items-baseline lg:gap-x-gutter">
              <h3 className="type-ui-strong lg:col-span-3">{entry.employer}</h3>
              <p className="type-body lg:col-span-3">{entry.title}</p>
              <p className="type-label text-text-muted lg:col-span-2">
                {formatPeriod(entry.period, copy.format.period)}
              </p>
              <div className="type-body lg:col-span-4">
                <InlineList items={projectNames} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
