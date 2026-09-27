import type { ReactNode } from "react";
import { CyberRockDrawing } from "@/components/drawings/cyberrock-drawing";
import { FullSheet } from "@/components/sheets/full-sheet";
import { Section } from "@/components/ui/section";
import { projects } from "@/content/projects";
import type { FullProject } from "@/content/schema/projects";
import type { Section as SectionEntry } from "@/content/schema/sections";

/**
 * The drawings built so far. A full sheet renders once its drawing exists:
 * CyberRock in Phase 5; botmivivi and Quest @ NFQ Asia join in Phases 7–8,
 * with Lemonswan and Scania as compact sheets.
 */
const SHEET_DRAWINGS: Partial<Record<FullProject["drawing"], ReactNode>> = {
  cyberrock: <CyberRockDrawing />,
};

/**
 * The Quest journal (contrib-design §1.3): the owner's projects as system
 * sheets, `sheet` rhythm apart, a `divider` between sheets.
 */
export function QuestJournal({ section }: { readonly section: SectionEntry }) {
  const sheets = projects.flatMap((project) => {
    if (project.kind !== "full") return [];
    const drawing = SHEET_DRAWINGS[project.drawing];
    return drawing === undefined ? [] : [{ project, drawing }];
  });

  return (
    <Section section={section}>
      <div className="mt-xl flex flex-col gap-sheet">
        {sheets.map(({ project, drawing }, index) => (
          <div
            key={project.id}
            className={
              index === 0 ? undefined : "border-t border-rule pt-sheet"
            }
          >
            <FullSheet project={project} drawing={drawing} />
          </div>
        ))}
      </div>
    </Section>
  );
}
