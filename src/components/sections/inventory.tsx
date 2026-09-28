import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { about } from "@/content/about";
import type { Section } from "@/content/schema/sections";
import { skills } from "@/content/skills";
import { typography } from "@/lib/format/typography";

/**
 * Leveling up (DESIGN.md → Training card): the owner's topics in `nav`
 * type, each under a success filled triangle (the "▲" neither font has).
 * Its panel reaching the view is the level-up moment (`data-levelup`): the
 * triangles rise in and a gold bar sweeps across the HUD strip, once.
 */
function LevelingUp() {
  const { levelingUp } = about;
  return (
    <Panel className="inventory-training flex flex-col gap-md">
      <PanelHeading>{levelingUp.label}</PanelHeading>
      <ul data-levelup="" className="training-grid">
        {levelingUp.items.map((item, index) => (
          <li
            key={item}
            style={{ "--i": index } as CSSProperties}
            className="chamfer flex flex-col gap-xs p-md training-card"
          >
            <span className="relative training-marker text-success">
              <Icon name="triangle-filled" size="marker" />
            </span>
            <span className="relative type-nav text-primary">
              {typography(item)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/**
 * Inventory (DESIGN.md → Inventory slot; Responsive Behavior → Inventory):
 * the five profile skill groups (Approved copy, lists.scope), each an h3
 * and its slots, then Leveling up. Stacked below lg; from lg the
 * inventory takes 8 columns and Leveling up 4, its cards stacked.
 */
export function Inventory({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section}>
      <div className="inventory-grid">
        <Panel className="inventory-main flex flex-col gap-lg">
          {skills.groups.map((group) => (
            <div key={group.name} className="flex flex-col gap-sm">
              <PanelHeading>{group.name}</PanelHeading>
              <ul className="flex flex-wrap gap-xs">
                {group.items.map((item) => (
                  <li key={item} className="inventory-slot type-slot">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>
        <LevelingUp />
      </div>
    </SectionFrame>
  );
}
