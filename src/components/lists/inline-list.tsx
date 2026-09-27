import { typography } from "@/lib/format/typography";

/**
 * Inline list (DESIGN.md → Sheets → Lists), for the owner's middot strings:
 * the items run inline, separated by a comma generated in CSS, and wrap.
 */
export function InlineList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="inline-list">
      {items.map((item) => (
        <li key={item}>{typography(item)}</li>
      ))}
    </ul>
  );
}
