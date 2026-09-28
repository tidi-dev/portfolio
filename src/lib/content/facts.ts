import { copy } from "@/content/copy";
import { factTerms } from "@/content/projects";
import type { Contact } from "@/content/schema/contact";
import type { CompactProject, FullProject } from "@/content/schema/projects";
import { formatNumber } from "@/lib/format/number";
import { formatPeriod } from "@/lib/format/period";

/** One value in a facts list (DESIGN.md → Quest file, Contact row). */
export type FactValue =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "list"; readonly items: readonly string[] }
  | { readonly kind: "link"; readonly text: string; readonly href: string }
  | {
      /** A file to download: the Résumé PDF (DESIGN.md → Contact row). */
      readonly kind: "download";
      readonly text: string;
      readonly href: string;
    };

export interface FactRow {
  readonly term: string;
  readonly value: FactValue;
}

function text(value: string): FactValue {
  return { kind: "text", text: value };
}

function listOrText(value: string | readonly string[]): FactValue {
  return typeof value === "string"
    ? text(value)
    : { kind: "list", items: value };
}

/**
 * A quest file's facts-list rows, in DESIGN.md's order (Role, When, then
 * Team, Scale, Users or Stack as the quest has them), for present fields
 * only: an absent optional field yields no row, so nothing renders empty
 * (contrib-engineering §3). botmivivi's usage figures are its stat readout
 * instead (`usageReadout`).
 */
export function projectFacts(project: FullProject): FactRow[] {
  const { facts } = project;
  const rows: FactRow[] = [
    { term: factTerms.role, value: listOrText(facts.role) },
    {
      term: factTerms.when,
      value: text(formatPeriod(project.period, copy.format.period)),
    },
  ];

  if (facts.team !== undefined)
    rows.push({ term: factTerms.team, value: text(facts.team) });
  if (facts.scale !== undefined)
    rows.push({ term: factTerms.scale, value: text(facts.scale) });
  if (facts.users !== undefined)
    rows.push({ term: factTerms.users, value: text(facts.users) });
  if (facts.stack !== undefined) {
    rows.push({
      term: factTerms.stack,
      value: { kind: "list", items: facts.stack },
    });
  }
  return rows;
}

/** One figure of a stat readout: its term, its value and how it shows. */
export interface Stat {
  readonly term: string;
  readonly value: number;
  /** The value in en-US grouping, e.g. "2,951". */
  readonly display: string;
}

/**
 * botmivivi's stat readout (DESIGN.md → Stat readout), exactly the approved
 * botmivivi.facts: Users, Customers and Orders as figures, the qualifier
 * "in the first 2 months" (which qualifies customers and orders), then
 * Impact as a text line.
 */
export interface UsageReadout {
  readonly stats: readonly Stat[];
  readonly qualifier: string;
  readonly impact: { readonly term: string; readonly text: string };
}

export function usageReadout(
  usage: NonNullable<FullProject["facts"]["usage"]>,
): UsageReadout {
  const stat = (term: string, value: number): Stat => ({
    term,
    value,
    display: formatNumber(value),
  });
  return {
    stats: [
      stat(factTerms.users, usage.users),
      stat(factTerms.customers, usage.customers),
      stat(factTerms.orders, usage.orders),
    ],
    qualifier: usage.window,
    impact: { term: factTerms.impact, text: usage.impact },
  };
}

/**
 * A Mission log project's facts-list rows (Lemonswan, Scania): what was
 * built, then the stack. The one-liner, period and link render outside the
 * list.
 */
export function compactFacts(project: CompactProject): FactRow[] {
  return [
    { term: factTerms.built, value: text(project.built) },
    { term: factTerms.stack, value: { kind: "list", items: project.stack } },
  ];
}

/** The Résumé row's parts, present only once the PDF exists (Phase 5). */
export interface ResumeRow {
  readonly term: string;
  readonly text: string;
  readonly href: string;
}

/**
 * The Join party rows (DESIGN.md → Contact row): each opted-in channel as a
 * link, the Résumé row when the PDF exists, then the location as plain
 * text, last.
 */
export function contactFacts(contact: Contact, resume?: ResumeRow): FactRow[] {
  const { email, telegram, github, location } = contact;
  return [
    {
      term: email.label,
      value: {
        kind: "link",
        text: email.address,
        href: `mailto:${email.address}`,
      },
    },
    {
      term: telegram.label,
      value: { kind: "link", text: telegram.handle, href: telegram.url },
    },
    {
      term: github.label,
      value: { kind: "link", text: github.text, href: github.url },
    },
    ...(resume === undefined
      ? []
      : [
          {
            term: resume.term,
            value: {
              kind: "download",
              text: resume.text,
              href: resume.href,
            } as const,
          },
        ]),
    { term: location.label, value: text(location.text) },
  ];
}
