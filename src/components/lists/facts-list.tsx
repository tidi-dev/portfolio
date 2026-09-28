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
      // DESIGN.md → Links: Contact's rows. No sheet fact is a link. The link
      // is a 44 px target on its own row; the underline sits on the text.
      return (
        <a
          href={value.href}
          className="group inline-flex min-h-target items-center text-accent transition-feedback hover:text-accent-hover"
        >
          <span className="underline decoration-1 underline-offset-link group-hover:decoration-2">
            {typography(value.text)}
          </span>
        </a>
      );
  }
}

/**
 * The row rhythm: sheet facts sit 12 px apart; Contact's rows are 48 px tall
 * (DESIGN.md → Contact; Responsive Behavior → Targets).
 */
const VARIANTS = {
  sheet: { list: "flex flex-col gap-sm", row: "flex items-baseline" },
  contact: { list: "flex flex-col", row: "flex min-h-2xl items-center" },
} as const;

/**
 * Facts list (DESIGN.md → Sheets → Lists): a `dl` with the terms in
 * `label-strong`, `text-muted`, in the fixed 88 px `facts-label` column, the
 * values in `body-sm`. Only present facts have rows (lib/content/facts.ts),
 * so no `dd` is ever empty. Figures take tabular numerals. A qualifier
 * follows its value in `text-muted`, on every row it qualifies, so each row
 * reads true on its own (botmivivi's "in the first 2 months" qualifies both
 * customers and orders). Contact reuses it with 48 px rows.
 */
export function FactsList({
  rows,
  variant = "sheet",
}: {
  readonly rows: readonly FactRow[];
  readonly variant?: keyof typeof VARIANTS;
}) {
  const classes = VARIANTS[variant];
  return (
    <dl className={classes.list}>
      {rows.map((row) => (
        <div key={row.term} className={classes.row}>
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
