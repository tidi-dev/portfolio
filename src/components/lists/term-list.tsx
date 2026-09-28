import type { Term } from "@/content/schema/primitives";
import { typography } from "@/lib/format/typography";

/**
 * Term list (DESIGN.md → Sheets → Lists), for the owner's "Name —
 * description" strings: a `dl` with the term in `ui-strong` and the
 * description in `body` 4 px below, items 16 px apart. Both fragments are
 * the owner's words, verbatim (directions §3).
 */
export function TermList({ items }: { readonly items: readonly Term[] }) {
  return (
    <dl className="flex max-w-measure-body flex-col gap-md">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="type-ui-strong">{typography(item.term)}</dt>
          <dd className="mt-2xs type-body">{typography(item.description)}</dd>
        </div>
      ))}
    </dl>
  );
}
