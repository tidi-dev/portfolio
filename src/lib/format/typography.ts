/**
 * Render-time typography (contrib-engineering §3). Content
 * stores text as info.md writes it; this sets curly quotes and the ellipsis,
 * and keeps a number with its unit. The owner's words and dashes are kept.
 */

// A quote opens at the start, or after a space, an opening bracket, a dash
// or another opening quote.
const OPENS_AFTER = /[\s([{—–“‘]/u;

// Units that must not wrap away from their number ("~5 min").
const NUMBER_AND_UNIT = /(\d)[ \u00A0]+(min)\b/g;

function opensAt(text: string, offset: number): boolean {
  return offset === 0 || OPENS_AFTER.test(text.charAt(offset - 1));
}

export function typography(text: string): string {
  return text
    .replaceAll("...", "…")
    .replace(/"/g, (_quote, offset: number, whole: string) =>
      opensAt(whole, offset) ? "“" : "”",
    )
    .replace(/'/g, (_quote, offset: number, whole: string) =>
      opensAt(whole, offset) ? "‘" : "’",
    )
    .replace(NUMBER_AND_UNIT, "$1\u00A0$2");
}
