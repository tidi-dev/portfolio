import { type ContentInput, defineContent } from "@/content/schema/define";
import { Site } from "@/content/schema/site";

/**
 * Site configuration: info.md → Site preferences → Language ("English
 * only"), and the contact call to action (Goals & audience).
 */
export const site = defineContent("site", Site, {
  lang: "en",
  primaryAction: "contact",
} as const satisfies ContentInput<typeof Site>);
