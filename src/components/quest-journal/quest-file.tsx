import { VideoFacade } from "@/components/video-facade/video-facade";
import { holograms } from "@/content/holograms";
import type { FullProject } from "@/content/schema/projects";
import { projectFacts, usageReadout } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import { PartyLead, QuestBody } from "./quest-body";
import { QuestFacts } from "./quest-facts";
import { QuestFileFrame } from "./quest-file-frame.client";
import { QuestHologram } from "./quest-hologram.client";
import { QuestSteps } from "./quest-steps";
import { StatReadout } from "./stat-readout";
import { StatusChip } from "./status-chip";

/** A quest file's anchor, which the mission list links to. */
export function questAnchor(id: string): string {
  return `quest-${id}`;
}

export function questHeadingId(id: string): string {
  return `quest-${id}-title`;
}

/**
 * A quest file (DESIGN.md → Quest file): an article on a chamfered panel.
 * Below `lg` it opens with its hologram band. Then the status chip, the h3
 * (focusable from its mission item), the one-liner, the facts, botmivivi's
 * stat readout, the body (Quest: Party lead, then the achievements), the
 * hologram's steps, and Quest's video. A slot renders only when content
 * holds its fact.
 */
export function QuestFile({ project }: { readonly project: FullProject }) {
  const headingId = questHeadingId(project.id);
  const usage = project.facts.usage;
  return (
    <QuestFileFrame
      id={project.id}
      anchor={questAnchor(project.id)}
      headingId={headingId}
    >
      <div className="flex flex-col gap-lg p-md md:p-lg">
        <QuestHologram
          placement="band"
          questId={project.id}
          tags={holograms.quest.tags}
        />
        <header className="flex flex-col items-start gap-sm">
          <StatusChip status={project.status} />
          <h3
            id={headingId}
            tabIndex={-1}
            className="type-heading-quest text-primary"
          >
            {project.name}
          </h3>
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
      </div>
    </QuestFileFrame>
  );
}
