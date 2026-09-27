import { type ContentInput, defineContent } from "@/content/schema/define";
import { Site } from "@/content/schema/site";

/**
 * Site configuration. The canonical origin and the language are allowlisted
 * in the content trace with their info.md source (Site preferences → Domain
 * and Language), because the trace corpus leaves Site preferences out.
 */
export const site = defineContent("site", Site, {
  canonical: "https://daiho.dev",
  lang: "en",
  primaryAction: "contact",
} as const satisfies ContentInput<typeof Site>);
