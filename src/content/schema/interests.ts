import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/**
 * info.md → Interests. The site's AFK list is the profile list; the PDF adds
 * the résumé-only items (Approved copy, lists.scope).
 */
export const Interests = z.strictObject({
  afk: z.array(Text).nonempty(),
  resumeOnly: z.array(Text).nonempty(),
});

export type Interests = Content<typeof Interests>;
