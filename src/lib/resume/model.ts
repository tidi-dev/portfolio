import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import { experience } from "@/content/experience";
import { identity } from "@/content/identity";
import { factTerms, projects } from "@/content/projects";
import type { Term } from "@/content/schema/primitives";
import type { Project } from "@/content/schema/projects";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import {
  compactFacts,
  contactFacts,
  type FactRow,
  projectFacts,
  usageReadout,
} from "@/lib/content/facts";
import { formatPeriod } from "@/lib/format/period";

/*
 * The résumé view model (contrib-engineering §7): selected from src/content
 * only, so it adds no facts. The phone number, the second email, the
 * reference, availability, travel and photography are in no content
 * module, so they can't appear here. Text is stored raw; the document
 * applies typography at render, like the site. Section headings are
 * info.md → Approved copy, resume.section-labels, in that order.
 */

/** A labelled group of the owner's "Name — description" strings. */
export interface ResumeTerms {
  readonly heading: string;
  readonly items: readonly Term[];
}

export interface ResumeBullets {
  readonly heading: string;
  readonly items: readonly string[];
}

/** A Quest journal project: CyberRock, botmivivi, Quest @ NFQ Asia. */
export interface ResumeFullProject {
  readonly kind: "full";
  readonly id: string;
  readonly name: string;
  readonly status: string;
  /** The period, beside the name (the site's "When" row). */
  readonly period: string;
  readonly lede: string;
  /** Role, then Team, Scale and Users as the project has them. */
  readonly facts: readonly FactRow[];
  /**
   * botmivivi's figures (botmivivi.facts), in the site's order: Users,
   * Customers and Orders, the window that qualifies customers and orders,
   * then Impact.
   */
  readonly usage:
    | {
        readonly figures: readonly FactRow[];
        readonly window: string;
        readonly impact: FactRow;
      }
    | undefined;
  readonly stack: FactRow | undefined;
  readonly partyLead: Term | undefined;
  readonly body:
    | ({ readonly kind: "bullets" } & ResumeBullets)
    | ({ readonly kind: "terms" } & ResumeTerms);
}

/** A project listed under its employer: Lemonswan, Scania. */
export interface ResumeCompactProject {
  readonly kind: "compact";
  readonly id: string;
  readonly name: string;
  /** The employer, then the period where info.md has one. */
  readonly meta: readonly string[];
  readonly oneLiner: string;
  readonly facts: readonly FactRow[];
  readonly link: { readonly text: string; readonly url: string } | undefined;
}

export type ResumeProject = ResumeFullProject | ResumeCompactProject;

export interface ResumeModel {
  readonly lang: string;
  /** The PDF's document title (resume.title). */
  readonly title: string;
  readonly brand: string;
  readonly nativeName: { readonly text: string; readonly lang: string };
  readonly name: string;
  readonly role: string;
  readonly profile: {
    readonly heading: string;
    /** resume.summary (= hero.sentence). */
    readonly summary: string;
  };
  readonly experience: {
    readonly heading: string;
    readonly entries: readonly {
      readonly employer: string;
      readonly title: string;
      readonly period: string;
      readonly projects: readonly string[];
    }[];
  };
  readonly projects: {
    readonly heading: string;
    readonly entries: readonly ResumeProject[];
  };
  readonly skills: {
    readonly heading: string;
    readonly groups: readonly {
      readonly name: string;
      readonly items: readonly string[];
    }[];
    /** lists.scope: the PDF-only tools. */
    readonly more: readonly string[];
  };
  readonly education: {
    readonly heading: string;
    readonly degrees: readonly {
      readonly degree: string;
      readonly school: string;
      readonly years: string;
    }[];
    /** Certifications that aren't about a listed language (none today). */
    readonly certifications: readonly {
      readonly subject: string;
      readonly credentials: readonly string[];
    }[];
  };
  readonly languages: {
    readonly heading: string;
    /** Each language with its credentials (English: IELTS 6.0, EF SET C1). */
    readonly items: readonly {
      readonly language: string;
      readonly credentials: readonly string[];
    }[];
  };
  readonly contact: {
    readonly heading: string;
    readonly rows: readonly FactRow[];
  };
}

const PROJECTS = new Map<string, Project>(
  projects.map((project) => [project.id, project]),
);

function projectById(id: string): Project {
  const project = PROJECTS.get(id);
  if (project === undefined) {
    throw new Error(
      `experience.ts lists "${id}", which projects.ts doesn't hold`,
    );
  }
  return project;
}

function employerOf(id: string): string {
  const employer = experience.find((entry) =>
    entry.projects.includes(id),
  )?.employer;
  if (employer === undefined) {
    throw new Error(`No experience entry lists the project ${id}`);
  }
  return employer;
}

function period(value: Parameters<typeof formatPeriod>[0]): string {
  return formatPeriod(value, copy.format.period);
}

function resumeProject(project: Project): ResumeProject {
  if (project.kind === "compact") {
    return {
      kind: "compact",
      id: project.id,
      name: project.name,
      meta:
        project.period === undefined
          ? [employerOf(project.id)]
          : [employerOf(project.id), period(project.period)],
      oneLiner: project.oneLiner,
      facts: compactFacts(project),
      link: project.link,
    };
  }

  const rows = projectFacts(project);
  const usage =
    project.facts.usage === undefined
      ? undefined
      : usageReadout(project.facts.usage);
  const textRow = (term: string, text: string): FactRow => ({
    term,
    value: { kind: "text", text },
  });
  const { body } = project;
  return {
    kind: "full",
    id: project.id,
    name: project.name,
    status: project.status,
    period: period(project.period),
    lede: project.lede,
    facts: rows.filter(
      (row) => row.term !== factTerms.when && row.term !== factTerms.stack,
    ),
    usage:
      usage === undefined
        ? undefined
        : {
            figures: usage.stats.map((stat) =>
              textRow(stat.term, stat.display),
            ),
            window: usage.qualifier,
            impact: textRow(usage.impact.term, usage.impact.text),
          },
    stack: rows.find((row) => row.term === factTerms.stack),
    partyLead: project.partyLead,
    // Achievements print as terms: the badge icons are site decoration.
    body:
      body.kind === "bullets"
        ? { kind: "bullets", heading: body.heading, items: body.items }
        : {
            kind: "terms",
            heading: body.heading,
            items: body.items.map(({ term, description }) => ({
              term,
              description,
            })),
          },
  };
}

export function buildResumeModel(): ResumeModel {
  const labels = copy.resume.sectionLabels;
  const { education, languages } = about;
  return {
    lang: site.lang,
    title: copy.resume.title,
    brand: identity.brand,
    nativeName: identity.nativeName,
    name: identity.name,
    role: identity.role,
    profile: { heading: labels.profile, summary: copy.resume.summary },
    experience: {
      heading: labels.workExperience,
      entries: experience.map((entry) => ({
        employer: entry.employer,
        title: entry.title,
        period: period(entry.period),
        projects: entry.projects.map((id) => {
          const project = projectById(id);
          return project.shortName ?? project.name;
        }),
      })),
    },
    projects: {
      heading: labels.projects,
      entries: projects.map(resumeProject),
    },
    skills: {
      heading: labels.skills,
      groups: skills.groups,
      more: skills.resumeOnly,
    },
    education: {
      heading: labels.education,
      degrees: education.degrees,
      certifications: education.certifications.filter(
        (item) => !languages.items.includes(item.subject),
      ),
    },
    // As on the site (Character stats → Languages): a certification whose
    // subject is a listed language sits with that language.
    languages: {
      heading: labels.languages,
      items: languages.items.map((language) => ({
        language,
        credentials:
          education.certifications.find((item) => item.subject === language)
            ?.credentials ?? [],
      })),
    },
    // The PDF doesn't link to itself: no Résumé row.
    contact: { heading: labels.contact, rows: contactFacts(contact) },
  };
}
