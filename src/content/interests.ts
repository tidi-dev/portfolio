import { type ContentInput, defineContent } from "@/content/schema/define";
import { Interests } from "@/content/schema/interests";

/**
 * info.md → Interests: the profile list for AFK, each with its icon
 * (DESIGN.md → AFK list), and the résumé-only item (Approved copy,
 * lists.scope). Travel and photography are declined.
 */
export const interests = defineContent("interests", Interests, {
  afk: [
    { label: "Football", icon: "ball-football" },
    { label: "Badminton", icon: "feather" },
    { label: "Swimming", icon: "swimming" },
    { label: "Games", icon: "device-gamepad-2" },
    {
      label: 'Tech gossip and "how would you design this?" debates',
      icon: "coffee",
    },
  ],
  resumeOnly: ["Reading"],
} as const satisfies ContentInput<typeof Interests>);
