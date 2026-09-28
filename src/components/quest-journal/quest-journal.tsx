import { PowerCover } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { copy } from "@/content/copy";
import { holograms } from "@/content/holograms";
import { projects } from "@/content/projects";
import type { FullProject } from "@/content/schema/projects";
import type { Section } from "@/content/schema/sections";
import { QuestCard } from "./quest-card";
import { questAnchor, QuestFile, questTabId } from "./quest-file";
import { QuestHologram } from "./quest-hologram.client";
import {
  type QuestEntry,
  QuestJournalController,
} from "./quest-journal-controller.client";
import { QuestSwapCover, QuestTabList } from "./quest-tabs.client";

// The Quest journal holds the full projects: CyberRock, botmivivi and Quest
// (Approved copy, placement.nfq-projects). Lemonswan and Scania belong to
// the Mission log.
const QUESTS = projects.filter(
  (project): project is FullProject => project.kind === "full",
);

// The card row reads Cleared, Active, Side: the Active quest in the middle
// and larger (quest.css), so the keyboard order matches what is seen. The
// panels keep content order, which is also the stacked no-JS order.
const CARD_ORDER: Record<FullProject["status"], number> = {
  Cleared: 0,
  Active: 1,
  Side: 2,
};
const CARDS = [...QUESTS].sort(
  (a, b) => CARD_ORDER[a.status] - CARD_ORDER[b.status],
);

const ENTRIES: readonly QuestEntry[] = CARDS.map((project) => ({
  id: project.id,
  name: project.name,
  anchor: questAnchor(project.id),
  tabId: questTabId(project.id),
  model: project.hologram,
  active: project.status === "Active",
}));

/**
 * The Quest journal (DESIGN.md → Quest card, Quest card row, Quest detail
 * panel; Responsive Behavior → Quest journal): the card row (a tablist),
 * then one detail panel holding the hologram stage and the three
 * tabpanels, of which only the selected one shows. From `lg` the panel
 * splits 5 / 7 (the stage sticky); below it the stage band sits above the
 * tabpanel. Without JavaScript the row and the stage are hidden and every
 * tabpanel shows, stacked (noscript-style.tsx).
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
          <QuestTabList labelledBy={titleId}>
            {CARDS.map((project) => (
              <QuestCard key={project.id} project={project} />
            ))}
          </QuestTabList>
          <div
            data-reveal="panel"
            data-quest-detail=""
            className="chamfer p-md md:p-lg"
          >
            <PowerCover />
            <div className="quest-detail">
              <div data-quest-stage="" className="quest-stage-slot">
                <QuestHologram tags={holograms.quest.tags} />
              </div>
              <div data-quest-panels="" className="quest-panels">
                {QUESTS.map((project) => (
                  <QuestFile key={project.id} project={project} />
                ))}
                <QuestSwapCover />
              </div>
            </div>
          </div>
        </QuestJournalController>
      </div>
    </section>
  );
}
