import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/**
 * One rule: the owner's sentence, and its first phrase, which profile.md sets
 * in bold (info.md → About → House-rule emphasis). The phrase must open the
 * rule, so the rendered words stay the rule's own.
 */
export const HouseRule = z
  .strictObject({ text: Text, emphasis: Text })
  .refine((rule) => rule.text.startsWith(rule.emphasis), {
    message: "The emphasis must be the rule's opening phrase",
    path: ["emphasis"],
  });

/** info.md → About → House rules: the intro lines, then the rules in the owner's order. */
export const HouseRules = z.strictObject({
  intro: z.array(Text).nonempty(),
  rules: z.array(HouseRule).nonempty(),
});

export type HouseRule = Content<typeof HouseRule>;
export type HouseRules = Content<typeof HouseRules>;
