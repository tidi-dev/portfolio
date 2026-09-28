import type { ReactNode } from "react";
import { BotmiviviDrawing } from "@/components/drawings/botmivivi-drawing";
import { CyberRockDrawing } from "@/components/drawings/cyberrock-drawing";
import { QuestDrawing } from "@/components/drawings/quest-drawing";
import { CompactSheet } from "@/components/sheets/compact-sheet";
import { FullSheet } from "@/components/sheets/full-sheet";
import { Section } from "@/components/ui/section";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import type { CompactProject, FullProject } from "@/content/schema/projects";
import type { Section as SectionEntry } from "@/content/schema/sections";

/** Each full sheet's drawing: its two static variants. */
const SHEET_DRAWINGS: Record<FullProject["drawing"], ReactNode> = {
  cyberrock: <CyberRockDrawing />,
  botmivivi: <BotmiviviDrawing />,
  quest: <QuestDrawing />,
};

const FULL_SHEETS = projects.filter(
  (project): project is FullProject => project.kind === "full",
);

/** The compact sheets, each with the employer whose project it was. */
const COMPACT_SHEETS = projects
  .filter((project): project is CompactProject => project.kind === "compact")
  .map((project) => {
    const employer = experience.find((entry) =>
      entry.projects.includes(project.id),
    )?.employer;
    if (employer === undefined) {
      throw new Error(`No experience entry lists the project ${project.id}`);
    }
    return { project, employer };
  });

/**
 * The Quest journal (contrib-design §1.3): the owner's projects as system
 * sheets, `sheet` rhythm apart, a `divider` between sheets. The three full
 * sheets come first, then the two compact sheets: stacked below lg, side by
 * side (6 | 6) from lg, where one divider runs above the pair.
 */
export function QuestJournal({ section }: { readonly section: SectionEntry }) {
  return (
    <Section section={section}>
      <div className="mt-xl flex flex-col gap-sheet">
        {FULL_SHEETS.map((project, index) => (
          <div
            key={project.id}
            className={
              index === 0 ? undefined : "border-t border-rule pt-sheet"
            }
          >
            <FullSheet
              project={project}
              drawing={SHEET_DRAWINGS[project.drawing]}
            />
          </div>
        ))}
        <div className="grid grid-cols-1 gap-y-sheet border-t border-rule pt-sheet lg:grid-cols-2 lg:gap-x-gutter">
          {COMPACT_SHEETS.map(({ project, employer }, index) => (
            <div
              key={project.id}
              className={
                index === 0
                  ? undefined
                  : "border-t border-rule pt-sheet lg:border-t-0 lg:pt-0"
              }
            >
              <CompactSheet project={project} employer={employer} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
