import { SectionHeading } from "@/components/ui/section-heading";
import { copy } from "@/content/copy";
import { holograms } from "@/content/holograms";
import { projects } from "@/content/projects";
import type { FullProject } from "@/content/schema/projects";
import type { Section } from "@/content/schema/sections";
import { MissionList, type MissionItem } from "./mission-list.client";
import { questAnchor, QuestFile, questHeadingId } from "./quest-file";
import { QuestHologram } from "./quest-hologram.client";
import {
  type QuestEntry,
  QuestJournalController,
} from "./quest-journal-controller.client";
import { StatusChip } from "./status-chip";

// The Quest journal holds the full projects: CyberRock, botmivivi and Quest
// (Approved copy, placement.nfq-projects). Lemonswan and Scania belong to
// the Mission log.
const QUESTS = projects.filter(
  (project): project is FullProject => project.kind === "full",
);

const ENTRIES: readonly QuestEntry[] = QUESTS.map((project) => ({
  id: project.id,
  name: project.name,
  anchor: questAnchor(project.id),
  headingId: questHeadingId(project.id),
  model: project.hologram,
}));

const MISSIONS: readonly MissionItem[] = QUESTS.map((project) => ({
  id: project.id,
  href: `#${questAnchor(project.id)}`,
  name: project.name,
  chip: <StatusChip status={project.status} />,
}));

/**
 * The Quest journal (DESIGN.md → Quest journal, Responsive Behavior;
 * contrib-design §3): every quest file visible and stacked (plan →
 * Rulings). From `lg`, the left 5 columns hold the sticky hologram
 * viewport and the mission list, and the right 7 the files; below `lg`
 * the files stack, each opening with its own hologram band, and there is
 * no mission list.
 */
export function QuestJournal({ section }: { readonly section: Section }) {
  const titleId = `${section.id}-title`;
  return (
    <section
      id={section.id}
      aria-labelledby={titleId}
      className="section-y page-x"
    >
      <div className="mx-auto flex max-w-container flex-col gap-lg">
        <SectionHeading id={titleId}>{section.label}</SectionHeading>
        <QuestJournalController
          quests={ENTRIES}
          toastLabel={copy.toast.questUnlocked}
        >
          <div className="quest-grid">
            <div className="quest-aside">
              <QuestHologram placement="viewport" tags={holograms.quest.tags} />
              <MissionList items={MISSIONS} />
            </div>
            <div className="quest-files">
              {QUESTS.map((project) => (
                <QuestFile key={project.id} project={project} />
              ))}
            </div>
          </div>
        </QuestJournalController>
      </div>
    </section>
  );
}
