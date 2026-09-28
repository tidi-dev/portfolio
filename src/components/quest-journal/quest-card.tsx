import { PixelGlyph } from "@/components/ui/pixel-glyph";
import { PowerCover } from "@/components/ui/panel";
import { factTerms } from "@/content/projects";
import type { FullProject } from "@/content/schema/projects";
import { typography } from "@/lib/format/typography";
import { questTabId } from "./quest-file";
import { QuestTab } from "./quest-tabs.client";
import { StatusChip } from "./status-chip";

// The rarity strip's colour: the status chip's (DESIGN.md → Quest card →
// Frame: Active success, Side accent-ink, Cleared text-muted).
const STRIP: Record<FullProject["status"], string> = {
  Active: "quest-card-strip status-active",
  Side: "quest-card-strip status-side",
  Cleared: "quest-card-strip status-cleared",
};

/**
 * A quest card (DESIGN.md → Quest card): one game card per full project,
 * the whole card a tab. Top to bottom: the rarity strip, the status chip,
 * the title, the one-liner, a rule pushed down so the stats align across
 * the row, then the key stat (its key when it has one, the value, the
 * qualifier), all from content. Selected, it shows the "▸" cursor and the
 * gold edge; an Active quest keeps its success edge, strip and aura
 * whether or not it is selected. It powers on like a panel.
 */
export function QuestCard({ project }: { readonly project: FullProject }) {
  const tabId = questTabId(project.id);
  const ids = {
    title: `${tabId}-title`,
    chip: `${tabId}-chip`,
    lede: `${tabId}-lede`,
    stat: `${tabId}-stat`,
  };
  const stat = project.cardStat;
  return (
    <QuestTab
      id={project.id}
      status={project.status}
      labelledBy={ids.title}
      describedBy={`${ids.chip} ${ids.lede} ${ids.stat}`}
    >
      <PowerCover />
      {project.status === "Active" ? (
        <span aria-hidden="true" className="quest-card-aura" />
      ) : null}
      <span aria-hidden="true" className={STRIP[project.status]} />
      <span className="relative flex flex-1 flex-col items-start gap-sm">
        <span id={ids.chip} className="flex">
          <StatusChip status={project.status} />
        </span>
        <span className="relative">
          <span aria-hidden="true" className="quest-card-cursor">
            <PixelGlyph name="caret-right" />
          </span>
          <span id={ids.title} className="type-heading-quest text-primary">
            {project.name}
          </span>
        </span>
        <span id={ids.lede} className="type-body-compact text-text-muted">
          {typography(project.lede)}
        </span>
        <span aria-hidden="true" className="quest-card-rule" />
        <span id={ids.stat} className="flex flex-col gap-2xs">
          {stat.key === undefined ? null : (
            <span className="type-label text-accent-ink">
              {factTerms[stat.key]}
            </span>
          )}
          <span className="type-stat-value text-primary">{stat.value}</span>
          <span className="type-body-compact text-text-muted">
            {typography(stat.qualifier)}
          </span>
        </span>
      </span>
    </QuestTab>
  );
}
