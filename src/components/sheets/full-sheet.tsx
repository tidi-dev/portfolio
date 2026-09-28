import type { ReactNode } from "react";
import { BulletList } from "@/components/lists/bullet-list";
import { FactsList } from "@/components/lists/facts-list";
import { Subhead } from "@/components/lists/subhead";
import { TermList } from "@/components/lists/term-list";
import { VideoFacade } from "@/components/video-facade/video-facade";
import { drawings } from "@/content/drawings";
import type { FullProject } from "@/content/schema/projects";
import { projectFacts } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import { DrawingFigure } from "@/components/drawings/drawing-figure";
import { SheetHead } from "./sheet-head";

interface FullSheetProps {
  readonly project: FullProject;
  /** The sheet's drawing: its two static variants. */
  readonly drawing: ReactNode;
}

/**
 * A full sheet (DESIGN.md → Sheets), in DOM order: the head, the lede (the
 * owner's one-liner), the drawing band, the facts list and the body: Party
 * lead where info.md has it, the subhead over bullets or terms, and the
 * video facade closing the sheet where there is a video. No box, no card,
 * no numbering; only slots whose fact is in info.md render.
 *
 * Responsive Behavior: stacked below md; from md the tall drawing sits
 * beside the facts with the body below; from lg the band spans 12 columns
 * (the wide drawing), the body takes cols 1–7 and the facts cols 9–12.
 */
export function FullSheet({ project, drawing }: FullSheetProps) {
  const titleId = `${project.id}-title`;
  const figure = drawings[project.drawing];

  return (
    <article
      aria-labelledby={titleId}
      className="grid grid-cols-1 md:grid-cols-2 md:gap-x-gutter lg:grid-cols-12"
    >
      <div className="md:col-span-2 lg:col-span-12">
        <SheetHead project={project} titleId={titleId} />
        <p className="mt-xs max-w-measure-lead type-lead">
          {typography(project.lede)}
        </p>
      </div>
      <div className="mt-lg lg:col-span-12">
        <DrawingFigure caption={figure.caption} steps={figure.steps}>
          {drawing}
        </DrawingFigure>
      </div>
      <div className="mt-lg lg:col-span-4 lg:col-start-9 lg:row-start-3 lg:mt-xl">
        <FactsList rows={projectFacts(project)} />
      </div>
      <div className="mt-lg md:col-span-2 lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:mt-xl">
        {project.partyLead === undefined ? null : (
          <div className="mb-lg">
            <TermList items={[project.partyLead]} />
          </div>
        )}
        <Subhead level={4}>{project.body.heading}</Subhead>
        <div className="mt-xs">
          {project.body.kind === "bullets" ? (
            <BulletList items={project.body.items} />
          ) : (
            <TermList items={project.body.items} />
          )}
        </div>
        {project.video === undefined ? null : (
          <div className="mt-lg">
            <VideoFacade video={project.video} />
          </div>
        )}
      </div>
    </article>
  );
}
