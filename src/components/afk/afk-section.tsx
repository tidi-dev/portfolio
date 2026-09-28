import { InlineList } from "@/components/lists/inline-list";
import { Section } from "@/components/ui/section";
import { interests } from "@/content/interests";
import type { Section as SectionEntry } from "@/content/schema/sections";

/**
 * AFK (DESIGN.md → Experience, House rules, Inventory, AFK): the h2 and one
 * inline list, the profile list only (info.md → Approved copy, lists.scope).
 * One wrapping row at every width.
 */
export function AfkSection({ section }: { readonly section: SectionEntry }) {
  return (
    <Section section={section}>
      <div className="mt-xl max-w-measure-body type-body">
        <InlineList items={interests.afk} />
      </div>
    </Section>
  );
}
