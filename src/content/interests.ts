import { type ContentInput, defineContent } from "@/content/schema/define";
import { Interests } from "@/content/schema/interests";

/**
 * info.md → Interests: the profile list for AFK, and the résumé-only item
 * (Approved copy, lists.scope). Travel and photography are declined.
 */
export const interests = defineContent("interests", Interests, {
  afk: [
    "Football",
    "Badminton",
    "Swimming",
    "Games",
    'Tech gossip and "how would you design this?" debates',
  ],
  resumeOnly: ["Reading"],
} as const satisfies ContentInput<typeof Interests>);
