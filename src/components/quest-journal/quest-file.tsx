import { VideoFacade } from "@/components/video-facade/video-facade";
import { holograms } from "@/content/holograms";
import type { FullProject } from "@/content/schema/projects";
import { projectFacts, usageReadout } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import { PartyLead, QuestBody } from "./quest-body";
import { QuestFacts } from "./quest-facts";
import { QuestSteps } from "./quest-steps";
import { QuestTabPanel } from "./quest-tabs.client";
import { StatReadout } from "./stat-readout";
import { StatusChip } from "./status-chip";

/** A quest's tabpanel id, the deep-link target the Mission log links to. */
export function questAnchor(id: string): string {
  return `quest-${id}`;
}

/** A quest card's (tab's) id. */
export function questTabId(id: string): string {
  return `quest-tab-${id}`;
}

/**
 * A quest's tabpanel (DESIGN.md → Quest detail panel → Tabpanel): the
 * status chip, the h3, the one-liner, the facts, botmivivi's stat readout,
 * the body (Quest: Party lead, then the achievements), the hologram's
 * steps, and Quest's video. A slot renders only when content holds its
 * fact.
 */
export function QuestFile({ project }: { readonly project: FullProject }) {
  const usage = project.facts.usage;
  return (
    <QuestTabPanel id={project.id}>
      <header className="flex flex-col items-start gap-sm">
        <StatusChip status={project.status} />
        <h3 className="type-heading-quest text-primary">{project.name}</h3>
        <p className="max-w-measure text-text-muted">
          {typography(project.lede)}
        </p>
      </header>
      <QuestFacts rows={projectFacts(project)} />
      {usage === undefined ? null : (
        <StatReadout readout={usageReadout(usage)} />
      )}
      {project.partyLead === undefined ? null : (
        <PartyLead lead={project.partyLead} />
      )}
      <QuestBody body={project.body} />
      <QuestSteps steps={holograms[project.hologram].steps} />
      {project.video === undefined ? null : (
        <VideoFacade video={project.video} />
      )}
    </QuestTabPanel>
  );
}
