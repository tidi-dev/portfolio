import { typography } from "@/lib/format/typography";

/**
 * Bullets (DESIGN.md → Sheets → Lists): an 8 × 1.5 px `primary` dash and a
 * 16 px indent (globals.css), items 8 px apart, at most 68ch.
 */
export function BulletList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="bullet-list flex max-w-measure-body flex-col gap-xs type-body">
      {items.map((item) => (
        <li key={item}>{typography(item)}</li>
      ))}
    </ul>
  );
}
