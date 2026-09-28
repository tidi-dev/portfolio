import { formatNumber } from "@/lib/format/number";

const PLACEHOLDER = "{size}";

// Keeps the number with its unit.
const NBSP = "\u00A0";

/**
 * A file size as a hint: whole kilobytes (1 KB = 1,000 bytes, as macOS
 * Finder counts them), at least 1 KB, e.g. "96 KB".
 */
export function formatFileSize(bytes: number): string {
  return `${formatNumber(Math.max(1, Math.round(bytes / 1000)))}${NBSP}KB`;
}

/**
 * Fills the approved size template (info.md → Approved copy,
 * resume.contact-link: "PDF, {size}") with the real file's size.
 */
export function fillSize(template: string, bytes: number): string {
  if (template.split(PLACEHOLDER).length !== 2) {
    throw new Error(
      `The template "${template}" needs exactly one ${PLACEHOLDER} placeholder`,
    );
  }
  return template.replace(PLACEHOLDER, formatFileSize(bytes));
}
