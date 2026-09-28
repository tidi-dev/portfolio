import { z } from "zod";
import type { Content } from "./define";
import { structuralEnum, Text } from "./primitives";

/** The text alternative's steps, numbered by their <ol> (a11y.steps.*). */
const Steps = z.array(Text).nonempty();

/** The quest holograms in holograms.ts (the bench belongs to the hero). */
export const HologramId = structuralEnum(
  ["cyberrock", "quest", "botmivivi"],
  "a quest hologram in holograms.ts",
);

/**
 * What each hologram shows, as HTML (DESIGN.md → 3D Scenes; Do's: mirror
 * everything a canvas shows): the aria-hidden scene tags, the verdicts and
 * the approved step lists. Geometry lives with each scene.
 */
export const Holograms = z.strictObject({
  bench: z.strictObject({
    /** The scene tags "host" and "chip" (depiction.bench). */
    tags: z.strictObject({ host: Text, chip: Text }),
    verdicts: z.strictObject({ genuine: Text, rejected: Text }),
    steps: Steps,
  }),
  cyberrock: z.strictObject({ steps: Steps }),
  quest: z.strictObject({
    /** The tags on Quest's two data slabs. */
    tags: z.strictObject({ v1: Text, v2: Text }),
    steps: Steps,
  }),
  botmivivi: z.strictObject({ steps: Steps }),
});

export type HologramId = z.output<typeof HologramId>;
export type Holograms = Content<typeof Holograms>;
