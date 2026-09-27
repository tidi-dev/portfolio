import { z } from "zod";
import type { Content } from "./define";
import { structuralEnum, Text } from "./primitives";

/**
 * The sections' stable anchors (`#id`), in DESIGN.md's order. They are keys,
 * never shown, and part of the public URL surface: changing one needs a
 * ruling (contrib-engineering §6).
 */
export const SectionId = structuralEnum(
  [
    "quest-journal",
    "experience",
    "house-rules",
    "inventory",
    "about",
    "afk",
    "contact",
  ],
  "a section's stable anchor (#id)",
);

export const Section = z.strictObject({
  id: SectionId,
  /** The section's name: its nav link, and its h2 except Contact's (the sign-off). */
  label: Text,
  nav: z.boolean(),
  /** Derived from content, so a section without content drops its nav link too. */
  present: z.boolean(),
});

export const Sections = z
  .array(Section)
  .nonempty()
  .refine(
    (sections) =>
      new Set(sections.map((section) => section.id)).size === sections.length,
    "Section ids must be unique",
  );

export type SectionId = z.output<typeof SectionId>;
export type Section = Content<typeof Section>;
