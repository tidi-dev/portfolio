const SINGLE_QUOTES = /[‘’‚‛′]/g;
const DOUBLE_QUOTES = /[“”„‟″]/g;
const LIST_MARKER = /^\s*(?:[-*+]|\d+\.)\s+/;
const HEADING_MARKER = /^\s*#{1,6}\s+/;
const BOLD_AND_CODE_MARKERS = /\*\*|`/g;
const DIGIT_GROUPING = /(\d),(?=\d{3}(?!\d))/g;

/**
 * contrib-verification §5.2, applied to both sides of every comparison:
 * NFC; curly quotes to straight; "…" to "..."; markdown markers stripped;
 * digit grouping removed (2,951 → 2951); whitespace collapsed; lower case.
 * Middots and " — " are kept, so they act as boundaries.
 */
export function normalise(text: string): string {
  return text
    .normalize("NFC")
    .replace(SINGLE_QUOTES, "'")
    .replace(DOUBLE_QUOTES, '"')
    .replaceAll("…", "...")
    .replace(LIST_MARKER, "")
    .replace(HEADING_MARKER, "")
    .replace(BOLD_AND_CODE_MARKERS, "")
    .replace(DIGIT_GROUPING, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
