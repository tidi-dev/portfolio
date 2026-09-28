import { Panel } from "@/components/ui/panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { houseRules } from "@/content/house-rules";
import type { HouseRule } from "@/content/schema/house-rules";
import type { Section } from "@/content/schema/sections";
import { typography } from "@/lib/format/typography";

/**
 * A rule's words, split at its lead phrase (info.md → House-rule
 * emphasis). The schema guarantees the phrase opens the rule, so the two
 * parts read as the owner's sentence.
 */
function splitRule(rule: HouseRule) {
  return {
    lead: typography(rule.emphasis),
    rest: typography(rule.text.slice(rule.emphasis.length)),
  };
}

/**
 * House rules (DESIGN.md → Rule panel; Responsive Behavior → House rules):
 * the owner's two intro lines, then the four rules in order, each a panel
 * with its numeral chip and the rule as one paragraph, its lead phrase run
 * in as `rule-lead`. One column, 2 × 2 from md. The panels power on in
 * reading order and each lead phrase's underline colour comes up
 * (reveal.css).
 */
export function HouseRules({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section}>
      <div className="flex max-w-measure flex-col gap-xs">
        {houseRules.intro.map((line, index) => (
          // The first line is the owner's small print (profile.md sets
          // it in <sub>): body-sm, text-muted.
          <p
            key={line}
            className={index === 0 ? "type-body-sm text-text-muted" : undefined}
          >
            {typography(line)}
          </p>
        ))}
      </div>
      <ol className="rules-grid">
        {houseRules.rules.map((rule, index) => {
          const { lead, rest } = splitRule(rule);
          return (
            <li key={rule.emphasis} className="flex">
              <Panel className="flex w-full items-start gap-md">
                <span
                  aria-hidden="true"
                  className="chamfer rule-numeral type-label chamfer-sm"
                >
                  <span className="relative">{index + 1}</span>
                </span>
                <p className="max-w-measure">
                  <strong className="type-body-strong rule-lead">{lead}</strong>
                  {rest}
                </p>
              </Panel>
            </li>
          );
        })}
      </ol>
    </SectionFrame>
  );
}
