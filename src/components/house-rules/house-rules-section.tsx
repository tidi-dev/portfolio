import { Section } from "@/components/ui/section";
import { houseRules } from "@/content/house-rules";
import type { HouseRule } from "@/content/schema/house-rules";
import type { Section as SectionEntry } from "@/content/schema/sections";
import { typography } from "@/lib/format/typography";

/**
 * A rule with its opening phrase in weight 700, as the owner's profile sets
 * it: `strong` is `bolder`, which takes `lead` (400) to 700. The two parts
 * join back into the owner's sentence, unchanged.
 */
function RuleText({ rule }: { readonly rule: HouseRule }) {
  return (
    <>
      <strong>{typography(rule.emphasis)}</strong>
      {typography(rule.text.slice(rule.emphasis.length))}
    </>
  );
}

/**
 * House rules (DESIGN.md → Experience, House rules, Inventory, AFK): the
 * intro (both owner lines, `body`), then the four rules as an ordered list
 * in the owner's order. The numeral sits in `label-strong`, `text-muted`, in
 * a 32 px column; the rule reads in `lead`; a `divider` separates rules. The
 * numeral is visible text, so the sequence reads the same with or without
 * list markers. From lg: intro cols 1–4, rules cols 5–12.
 */
export function HouseRulesSection({
  section,
}: {
  readonly section: SectionEntry;
}) {
  return (
    <Section section={section}>
      <div className="mt-xl grid grid-cols-1 gap-y-xl lg:grid-cols-12 lg:gap-x-gutter">
        <div className="flex max-w-measure-body flex-col gap-sm lg:col-span-4">
          {houseRules.intro.map((line) => (
            <p key={line} className="type-body">
              {typography(line)}
            </p>
          ))}
        </div>
        <ol className="flex list-none flex-col gap-lg lg:col-span-8 lg:col-start-5">
          {houseRules.rules.map((rule, index) => (
            <li
              key={rule.text}
              className={
                index === 0
                  ? "flex items-baseline"
                  : "flex items-baseline border-t border-rule pt-lg"
              }
            >
              <span className="w-xl shrink-0 type-label-strong text-text-muted">
                {String(index + 1)}
              </span>
              <span className="max-w-measure-lead min-w-0 type-lead">
                <RuleText rule={rule} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
