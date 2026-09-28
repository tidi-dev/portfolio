import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/**
 * info.md → Skills & tools. The site shows the five profile groups; the PDF
 * adds the résumé-only items (Approved copy, lists.scope).
 */
export const Skills = z.strictObject({
  groups: z
    .array(z.strictObject({ name: Text, items: z.array(Text).nonempty() }))
    .nonempty(),
  resumeOnly: z.array(Text).nonempty(),
});

export type Skills = Content<typeof Skills>;
