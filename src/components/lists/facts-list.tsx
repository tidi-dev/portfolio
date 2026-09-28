import type { FactRow, FactValue } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import { InlineList } from "./inline-list";

function Value({ value }: { readonly value: FactValue }) {
  switch (value.kind) {
    case "text":
      return typography(value.text);
    case "list":
      return <InlineList items={value.items} />;
    case "link":
      // DESIGN.md → Links: Contact's rows (Phase 9). No sheet fact is a link.
      return (
        <a
          href={value.href}
          className="text-accent underline decoration-1 underline-offset-link transition-feedback hover:text-accent-hover hover:decoration-2"
        >
          {typography(value.text)}
        </a>
      );
  }
}

/**
 * Facts list (DESIGN.md → Sheets → Lists): a `dl` with the terms in
 * `label-strong`, `text-muted`, in the fixed 88 px `facts-label` column, the
 * values in `body-sm`, rows 12 px apart. Only present facts have rows
 * (lib/content/facts.ts), so no `dd` is ever empty. Figures take tabular
 * numerals. A qualifier follows its value in `text-muted`, on every row it
 * qualifies, so each row reads true on its own (botmivivi's "in the first
 * 2 months" qualifies both customers and orders).
 */
export function FactsList({ rows }: { readonly rows: readonly FactRow[] }) {
  return (
    <dl className="flex flex-col gap-sm">
      {rows.map((row) => (
        <div key={row.term} className="flex items-baseline">
          <dt className="w-facts-label shrink-0 type-label-strong text-text-muted">
            {row.term}
          </dt>
          <dd className="min-w-0 flex-1 type-body-sm tabular-nums">
            <Value value={row.value} />
            {row.qualifier === undefined ? null : (
              <>
                {" "}
                <span className="text-text-muted">
                  {typography(row.qualifier)}
                </span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
