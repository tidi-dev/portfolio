import { z } from "zod";
import type { Content } from "./define";
import { HttpsUrl, LanguageTag } from "./primitives";
import { SectionId } from "./sections";

/** info.md → Site preferences, and the hero's call to action (Goals & audience). */
export const Site = z.strictObject({
  /** The canonical origin: Site preferences → Domain. */
  canonical: HttpsUrl.refine(
    (url) => new URL(url).origin === url,
    "Use the bare origin, with no path or trailing slash",
  ),
  /** The document language: Site preferences → Language. */
  lang: LanguageTag,
  /** The section the primary call to action lands on. */
  primaryAction: SectionId,
});

export type Site = Content<typeof Site>;
