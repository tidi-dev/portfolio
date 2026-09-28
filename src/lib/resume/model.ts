import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import { experience } from "@/content/experience";
import { identity } from "@/content/identity";
import { interests } from "@/content/interests";
import { projects } from "@/content/projects";
import type { Term } from "@/content/schema/primitives";
import type { Project } from "@/content/schema/projects";
import type { SectionId } from "@/content/schema/sections";
import { sections } from "@/content/sections";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import {
  compactFacts,
  contactFacts,
  type FactRow,
  projectFacts,
} from "@/lib/content/facts";
import { formatPeriod } from "@/lib/format/period";

/**
 * The résumé view model (contrib-engineering §7.1): selected from
 * src/content only, so it adds no facts. The phone number, the second
 * email, the reference and the availability line are not in content, so
 * they can't appear here. Text is stored raw; the document applies
 * typography at render, like the site.
 */

export interface ResumeFullProject {
  readonly kind: "full";
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly period: string;
  readonly lede: string;
  readonly facts: readonly FactRow[];
  readonly partyLead: Term | undefined;
  readonly body:
    | {
        readonly kind: "bullets";
        readonly heading: string;
        readonly items: readonly string[];
      }
    | {
        readonly kind: "terms";
        readonly heading: string;
        readonly items: readonly Term[];
      };
}

export interface ResumeCompactProject {
  readonly kind: "compact";
  readonly id: string;
  readonly name: string;
  /** The employer, then the dates where info.md has them. */
  readonly meta: readonly string[];
  readonly oneLiner: string;
  readonly facts: readonly FactRow[];
  readonly link: { readonly text: string; readonly url: string } | undefined;
}

export type ResumeProject = ResumeFullProject | ResumeCompactProject;

export interface ResumeModel {
  readonly lang: string;
  /** The PDF's document title (Approved copy, resume.title). */
  readonly title: string;
  readonly brand: string;
  readonly nativeName: { readonly text: string; readonly lang: string };
  readonly name: string;
  readonly role: string;
  /** Approved copy, resume.summary (= hero.sentence). */
  readonly summary: string;
  readonly contact: {
    readonly heading: string;
    readonly rows: readonly FactRow[];
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
    /** Approved copy, lists.scope: the PDF-only tools. */
    readonly more: readonly string[];
  };
  readonly education: {
    readonly heading: string;
    readonly degrees: readonly {
      readonly degree: string;
      readonly school: string;
      readonly years: string;
    }[];
    readonly certifications: readonly {
      readonly subject: string;
      readonly credentials: readonly string[];
    }[];
  };
  readonly languages: {
    readonly heading: string;
    readonly items: readonly string[];
  };
  /** The profile AFK list plus the PDF-only interests (lists.scope). */
  readonly interests: {
    readonly heading: string;
    readonly items: readonly string[];
  };
}

function sectionLabel(id: SectionId): string {
  const section = sections.find((entry) => entry.id === id);
  if (section === undefined) {
    throw new Error(`The section registry has no ${id} entry`);
  }
  return section.label;
}

function projectName(id: string): string {
  const project = projects.find((candidate) => candidate.id === id);
  if (project === undefined) {
    throw new Error(`Experience lists an unknown project: ${id}`);
  }
  return project.name;
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

function resumeProject(project: Project): ResumeProject {
  if (project.kind === "full") {
    return {
      kind: "full",
      id: project.id,
      name: project.name,
      status: project.status,
      period: formatPeriod(project.period, copy.format.period),
      lede: project.lede,
      facts: projectFacts(project),
      partyLead: project.partyLead,
      body: project.body,
    };
  }
  return {
    kind: "compact",
    id: project.id,
    name: project.name,
    meta:
      project.period === undefined
        ? [employerOf(project.id)]
        : [
            employerOf(project.id),
            formatPeriod(project.period, copy.format.period),
          ],
    oneLiner: project.oneLiner,
    facts: compactFacts(project),
    link: project.link,
  };
}

export function buildResumeModel(): ResumeModel {
  return {
    lang: site.lang,
    title: copy.resume.title,
    brand: identity.brand,
    nativeName: identity.nativeName,
    name: identity.name,
    role: identity.role,
    summary: copy.resume.summary,
    contact: {
      heading: sectionLabel("contact"),
      // The PDF doesn't link to itself: no Résumé row.
      rows: contactFacts(contact),
    },
    experience: {
      heading: sectionLabel("experience"),
      entries: experience.map((entry) => ({
        employer: entry.employer,
        title: entry.title,
        period: formatPeriod(entry.period, copy.format.period),
        projects: entry.projects.map(projectName),
      })),
    },
    projects: {
      heading: sectionLabel("quest-journal"),
      entries: projects.map(resumeProject),
    },
    skills: {
      heading: sectionLabel("inventory"),
      groups: skills.groups,
      more: skills.resumeOnly,
    },
    education: {
      heading: about.education.label,
      degrees: about.education.degrees,
      certifications: about.education.certifications,
    },
    languages: {
      heading: about.languages.label,
      items: about.languages.items,
    },
    interests: {
      heading: sectionLabel("afk"),
      items: [...interests.afk, ...interests.resumeOnly],
    },
  };
}
