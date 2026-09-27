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
      // DESIGN.md → Links: Contact's rows (Phase 9). No sheet fact is a link;
      // the 0.2em underline offset token arrives with the first one.
      return (
        <a
          href={value.href}
          className="text-accent underline decoration-1 transition-feedback hover:text-accent-hover hover:decoration-2"
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
 * (lib/content/facts.ts), so no `dd` is ever empty.
 */
export function FactsList({ rows }: { readonly rows: readonly FactRow[] }) {
  return (
    <dl className="flex flex-col gap-sm">
      {rows.map((row) => (
        <div key={row.term} className="flex items-baseline">
          <dt className="w-facts-label shrink-0 type-label-strong text-text-muted">
            {row.term}
          </dt>
          <dd className="min-w-0 flex-1 type-body-sm">
            <Value value={row.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
