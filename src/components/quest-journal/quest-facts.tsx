import type { CSSProperties } from "react";
import type { FactRow } from "@/lib/content/facts";
import { joinMiddot, typography } from "@/lib/format/typography";

/**
 * A quest's facts list (DESIGN.md → Quest detail panel: `facts-term`,
 * `facts-value`): a `dl` of present rows only, the term in accent-ink
 * labels at the 96 px stat-key width, the value in body-compact. Lists show as
 * the owner writes them, joined by middots. The rows tick in, in order,
 * when their panel powers on (`--i`, reveal.css).
 */
export function QuestFacts({ rows }: { readonly rows: readonly FactRow[] }) {
  return (
    <dl className="flex flex-col">
      {rows.map((row, index) => (
        <div
          key={row.term}
          style={{ "--i": index } as CSSProperties}
          className="facts-row"
        >
          <dt className="type-label text-accent-ink">{row.term}</dt>
          <dd className="type-body-compact text-primary">
            {row.value.kind === "list"
              ? joinMiddot(row.value.items.map(typography))
              : typography(row.value.text)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
