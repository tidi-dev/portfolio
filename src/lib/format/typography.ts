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

/** The owner's middot separator ("2 active · 1 cleared", banner.svg). */
const MIDDOT = " · ";

/** Parts shown as one middot line, as the owner writes his lists. */
export function joinMiddot(parts: readonly string[]): string {
  return parts.join(MIDDOT);
}

/**
 * A HUD line split into its key and value at the first space, as the
 * owner's banner sets them ("LVL still leveling" → "LVL", "still
 * leveling"). The text itself is unchanged.
 */
export function hudKeyValue(text: string): {
  readonly key: string;
  readonly value: string;
} {
  const space = text.indexOf(" ");
  return space === -1
    ? { key: text, value: "" }
    : { key: text.slice(0, space), value: text.slice(space + 1) };
}
