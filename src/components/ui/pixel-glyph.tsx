/**
 * DESIGN.md → Shapes → Icons, game glyphs: "▸" (before PLAYER 1), "▼"
 * (after Press A to continue) and "▲" (the training markers) are Portfolio
 * Pixel glyphs (U+25B8, U+25BC, U+25B2). Each sits in an aria-hidden span,
 * so the text node keeps only the words; the span takes its parent's pixel
 * type role and colour. `pnpm fonts:check` asserts the pixel subset maps
 * all three.
 */
const GLYPHS = {
  "caret-right": "▸",
  "caret-down": "▼",
  triangle: "▲",
} as const;

export type GlyphName = keyof typeof GLYPHS;

export function PixelGlyph({ name }: { readonly name: GlyphName }) {
  return (
    <span aria-hidden="true" className="shrink-0">
      {GLYPHS[name]}
    </span>
  );
}
