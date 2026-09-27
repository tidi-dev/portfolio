import { type ContentInput, defineContent } from "@/content/schema/define";
import { HouseRules } from "@/content/schema/house-rules";

/** info.md → About → House rules, in the owner's order. */
export const houseRules = defineContent("house-rules", HouseRules, {
  intro: [
    "How I take on a problem. I'm still learning system design, so these get patched.",
    "If something in your software hurts, bring it over. This is how I'll approach it:",
  ],
  rules: [
    "There's no perfect system — only trade-offs you choose on purpose.",
    "Understand the pain before prescribing the fix. The problem, the constraints, the context — in that order.",
    "Options on the table, not one answer. I'd rather argue trade-offs with you than grab the first thing that compiles.",
    "Best advice with what I know today. If I'm wrong, I'd rather find out early — that's where the XP comes from.",
  ],
} as const satisfies ContentInput<typeof HouseRules>);
