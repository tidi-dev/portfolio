import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { Panel } from "@/components/ui/panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { interests } from "@/content/interests";
import type { Section } from "@/content/schema/sections";
import { typography } from "@/lib/format/typography";

/**
 * AFK (DESIGN.md → AFK list; Responsive Behavior → AFK): the owner's five
 * interests, each a 24 px icon and its label in a 56 px row, in one idle
 * panel: 2 columns, 3 from md, one row of 5 from lg. It powers on, each
 * icon rises in once (reveal.css), and then it stays calm on purpose
 * (contrib-design §3). Its heading takes focus from "Press A to continue".
 */
export function Afk({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section} focusTarget>
      <Panel>
        <ul className="afk-grid">
          {interests.afk.map((item, index) => (
            <li
              key={item.label}
              style={{ "--i": index } as CSSProperties}
              className="afk-item"
            >
              <span className="afk-icon text-accent-ink">
                <Icon name={item.icon} size="large" />
              </span>
              <span className="type-body text-primary">
                {typography(item.label)}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </SectionFrame>
  );
}
