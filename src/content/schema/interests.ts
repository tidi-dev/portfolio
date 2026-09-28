import { z } from "zod";
import type { Content } from "./define";
import { structuralEnum, Text } from "./primitives";

/**
 * An AFK item's Tabler icon (DESIGN.md → Shapes → Icons: ball-football,
 * feather for Badminton, swimming, device-gamepad-2, coffee). Stored with
 * its item, so the icons follow the items if the owner reorders them.
 */
const AfkIcon = structuralEnum(
  ["ball-football", "feather", "swimming", "device-gamepad-2", "coffee"],
  "an AFK item's Tabler icon",
);

/**
 * info.md → Interests. The site's AFK list is the profile list; the PDF adds
 * the résumé-only items (Approved copy, lists.scope).
 */
export const Interests = z.strictObject({
  afk: z.array(z.strictObject({ label: Text, icon: AfkIcon })).nonempty(),
  resumeOnly: z.array(Text).nonempty(),
});

export type AfkIcon = z.output<typeof AfkIcon>;
export type Interests = Content<typeof Interests>;
