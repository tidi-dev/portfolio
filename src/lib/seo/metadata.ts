import type { Metadata } from "next";
import { copy } from "@/content/copy";

/**
 * The document title and meta description (info.md → Approved copy,
 * meta.title and meta.description). They moved to Phase 4 with the owner's
 * deferral: WCAG 2.4.2 needs the title. The rest of the Metadata API
 * (canonical, Open Graph, Twitter, robots) is Phase 11.
 */
export function siteMetadata(): Metadata {
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}
