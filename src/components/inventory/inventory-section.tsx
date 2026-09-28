import { InlineList } from "@/components/lists/inline-list";
import { Subhead } from "@/components/lists/subhead";
import { Section } from "@/components/ui/section";
import { about } from "@/content/about";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { skills } from "@/content/skills";

/**
 * Inventory (DESIGN.md → Experience, House rules, Inventory, AFK): a `dl` of
 * the five profile groups (info.md → Approved copy, lists.scope), each term
 * in `label-strong`, `text-muted`, over an inline list in `body`; 1, 2 and 3
 * columns at base, md and lg. Then "Leveling up" as a subhead over one
 * inline list. No logos, levels, bars or percentages.
 */
export function InventorySection({
  section,
}: {
  readonly section: SectionEntry;
}) {
  return (
    <Section section={section}>
      <dl className="mt-xl grid grid-cols-1 gap-x-gutter gap-y-lg md:grid-cols-2 lg:grid-cols-3">
        {skills.groups.map((group) => (
          <div key={group.name}>
            <dt className="type-label-strong text-text-muted">{group.name}</dt>
            <dd className="mt-2xs type-body">
              <InlineList items={group.items} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-xl">
        <Subhead level={3}>{about.levelingUp.label}</Subhead>
        <div className="mt-xs max-w-measure-body type-body">
          <InlineList items={about.levelingUp.items} />
        </div>
      </div>
    </Section>
  );
}
