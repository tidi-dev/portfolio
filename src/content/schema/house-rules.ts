import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/** info.md → About → House rules: the intro lines, then the rules in the owner's order. */
export const HouseRules = z.strictObject({
  intro: z.array(Text).nonempty(),
  rules: z.array(Text).nonempty(),
});

export type HouseRules = Content<typeof HouseRules>;
