import { z } from "zod";
import type { Content } from "./define";
import { LanguageTag, Text } from "./primitives";

/**
 * info.md → Identity: the names, the role and the tagline. There is no
 * location field: the location lives in contact.ts only (O4; ruling 2).
 */
export const Identity = z.strictObject({
  /** The brand: the wordmark and the first line of the h1. */
  brand: Text,
  /** The résumé name. */
  name: Text,
  /** The Vietnamese spelling, with its language for the lang attribute. */
  nativeName: z.strictObject({ text: Text, lang: LanguageTag }),
  /** "Daniel in English". */
  englishName: Text,
  role: Text,
  tagline: Text,
});

export type Identity = Content<typeof Identity>;
