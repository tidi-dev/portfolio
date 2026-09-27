import { factTerms } from "@/content/projects";
import type { Contact } from "@/content/schema/contact";
import type { FullProject } from "@/content/schema/projects";
import { formatNumber } from "@/lib/format/number";

/** One value in a facts list (DESIGN.md → Sheets → Lists). */
export type FactValue =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "list"; readonly items: readonly string[] }
  | { readonly kind: "link"; readonly text: string; readonly href: string };

export interface FactRow {
  readonly term: string;
  readonly value: FactValue;
  /**
   * A phrase that qualifies this value. Consecutive rows may share one: in
   * the approved botmivivi set, "in the first 2 months" qualifies both
   * customers and orders.
   */
  readonly qualifier?: string;
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
 * A full sheet's facts-list rows, in DESIGN.md's order, for present fields
 * only: an absent optional field yields no row, so nothing renders empty
 * (contrib-engineering §3.3).
 */
export function projectFacts(project: FullProject): FactRow[] {
  const { facts } = project;
  const rows: FactRow[] = [
    { term: factTerms.role, value: listOrText(facts.role) },
  ];

  if (facts.team !== undefined)
    rows.push({ term: factTerms.team, value: text(facts.team) });
  if (facts.scale !== undefined)
    rows.push({ term: factTerms.scale, value: text(facts.scale) });
  if (facts.users !== undefined)
    rows.push({ term: factTerms.users, value: text(facts.users) });
  if (facts.usage !== undefined) {
    const { users, customers, orders, window, impact } = facts.usage;
    rows.push(
      { term: factTerms.users, value: text(formatNumber(users)) },
      {
        term: factTerms.customers,
        value: text(formatNumber(customers)),
        qualifier: window,
      },
      {
        term: factTerms.orders,
        value: text(formatNumber(orders)),
        qualifier: window,
      },
      { term: factTerms.impact, value: text(impact) },
    );
  }
  if (facts.stack !== undefined) {
    rows.push({
      term: factTerms.stack,
      value: { kind: "list", items: facts.stack },
    });
  }
  return rows;
}

/**
 * The Contact facts list (DESIGN.md → Contact): each opted-in channel as a
 * link, then the location as plain text. The Résumé row joins before the
 * location once the PDF exists (Phase 10).
 */
export function contactFacts(contact: Contact): FactRow[] {
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
    { term: location.label, value: text(location.text) },
  ];
}
