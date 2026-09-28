import { z } from "zod";
import type { Content } from "./define";
import { LanguageTag } from "./primitives";
import { SectionId } from "./sections";

/** info.md → Site preferences, and the hero's call to action (Goals & audience). */
export const Site = z.strictObject({
  /** The document language: Site preferences → Language. */
  lang: LanguageTag,
  /** The section the primary call to action lands on. */
  primaryAction: SectionId,
});

export type Site = Content<typeof Site>;
