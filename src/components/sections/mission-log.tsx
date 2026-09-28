import { questAnchor } from "@/components/quest-journal/quest-file";
import { QuestFacts } from "@/components/quest-journal/quest-facts";
import { Icon } from "@/components/ui/icon";
import { Panel } from "@/components/ui/panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { copy } from "@/content/copy";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import type { Employment } from "@/content/schema/experience";
import type { Period } from "@/content/schema/primitives";
import type {
  CompactProject,
  FullProject,
  Project,
} from "@/content/schema/projects";
import type { Section } from "@/content/schema/sections";
import { compactFacts } from "@/lib/content/facts";
import { formatPeriod } from "@/lib/format/period";
import { typography } from "@/lib/format/typography";

const PROJECTS = new Map<string, Project>(
  projects.map((project) => [project.id, project]),
);

/** An employer's projects, in its order; an unknown id fails the build. */
function projectsOf(employment: Employment): Project[] {
  return employment.projects.map((id) => {
    const project = PROJECTS.get(id);
    if (project === undefined) {
      throw new Error(
        `experience.ts: ${employment.employer} lists "${id}", which projects.ts doesn't hold`,
      );
    }
    return project;
  });
}

function period(value: Period): string {
  return formatPeriod(value, copy.format.period);
}

/** A period line, when the project has one (Scania has none). */
function PeriodLine({ value }: { readonly value: Period | undefined }) {
  return value === undefined ? null : (
    <p className="type-body-sm text-text-muted">{period(value)}</p>
  );
}

/** A Quest journal project: its name links to its quest file. */
function QuestEntry({ project }: { readonly project: FullProject }) {
  return (
    <li className="flex flex-col gap-2xs">
      <h4 className="type-nav">
        <a
          href={`#${questAnchor(project.id)}`}
          className="target-inline text-link"
        >
          {project.shortName ?? project.name}
        </a>
      </h4>
      <PeriodLine value={project.period} />
    </li>
  );
}

/**
 * A project listed only here (Lemonswan, Scania; Approved copy,
 * placement.nfq-projects): its name, period, one-liner, what was built and
 * the stack, and its external link when it has one.
 */
function CompactEntry({ project }: { readonly project: CompactProject }) {
  return (
    <li className="flex flex-col gap-xs">
      <div className="flex flex-col gap-2xs">
        <h4 className="type-nav text-primary">{project.name}</h4>
        <PeriodLine value={project.period} />
      </div>
      <p className="max-w-measure type-body-sm">
        {typography(project.oneLiner)}
      </p>
      <QuestFacts rows={compactFacts(project)} />
      {project.link === undefined ? null : (
        <a
          href={project.link.url}
          className="inline-flex min-h-target items-center gap-2xs self-start type-body-sm text-link"
        >
          {project.link.text}
          <Icon name="external-link" />
        </a>
      )}
    </li>
  );
}

function ProjectEntry({ project }: { readonly project: Project }) {
  return project.kind === "full" ? (
    <QuestEntry project={project} />
  ) : (
    <CompactEntry project={project} />
  );
}

/**
 * One node: the employer (h3), the title and period, then its projects.
 * The current employer (an open period) gets the gold core.
 */
function MissionNode({ employment }: { readonly employment: Employment }) {
  const current = employment.period.end === "present";
  return (
    <li className="timeline-item">
      <span
        aria-hidden="true"
        data-current={current ? "" : undefined}
        className="timeline-node"
      />
      <Panel className="timeline-body">
        <div className="flex flex-col gap-2xs">
          <h3 className="type-heading-quest text-primary">
            {employment.employer}
          </h3>
          <p className="type-body-strong text-primary">{employment.title}</p>
          <p className="type-body-sm text-text-muted">
            {period(employment.period)}
          </p>
        </div>
        <ul className="flex flex-col gap-lg">
          {projectsOf(employment).map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </ul>
      </Panel>
    </li>
  );
}

/**
 * The Mission log (DESIGN.md → Mission log timeline; Responsive Behavior →
 * Mission log): a 2 px holo line with a square node per employer, newest
 * first. The line draws as the log scrolls through the view
 * (`animation-timeline`, reveal.css; with the observer as the fallback),
 * and each node's panel powers on as it is reached. Fully drawn in the
 * calm mode and without JavaScript.
 */
export function MissionLog({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section}>
      <div className="mission-log">
        <div data-reveal="line" className="timeline">
          <span aria-hidden="true" className="timeline-line" />
          <ol className="flex flex-col gap-gutter">
            {experience.map((employment) => (
              <MissionNode key={employment.employer} employment={employment} />
            ))}
          </ol>
        </div>
      </div>
    </SectionFrame>
  );
}
