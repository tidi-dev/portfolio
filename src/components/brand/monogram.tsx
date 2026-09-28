import { ImageResponse } from "next/og";
import tokens from "@/styles/tokens.generated.json";

/** The icon's canvas, in CSS pixels (the browser tab's 32 px favicon). */
export const MONOGRAM_SIZE = { width: 32, height: 32 } as const;

// The tile's chamfer (DESIGN.md → Shapes → Chamfer: the top-right and
// bottom-left corners cut at 45°), cut 8 units into the 32-unit tile.
const TILE = "0,0 24,0 32,8 32,32 8,32 0,24";

// The Portfolio Pixel "T" (7 × 11 font pixels: a 1 px bar, a 1 px stem in
// column 4) at 2×, so a font pixel is 2 px: integer rectangles only
// (DESIGN.md → Components → Site icon).
const T_BAR = { x: 9, y: 5, width: 14, height: 2 } as const;
const T_STEM = { x: 15, y: 5, width: 2, height: 22 } as const;

/**
 * The site icon (`favicon`): the pixel "T" of the brand "TiDi" on a gold
 * chamfered tile, in DESIGN.md's Lab colours (`accent`, `on-accent`, from
 * the DTCG export; the tab doesn't theme). No artwork of the owner.
 * Rendered to a PNG, which every browser accepts at /favicon.ico and as
 * the declared icon.
 */
export function monogramIcon(): ImageResponse {
  const ink = tokens.color["on-accent"].$value.hex;
  return new ImageResponse(
    <svg
      width={MONOGRAM_SIZE.width}
      height={MONOGRAM_SIZE.height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={TILE} fill={tokens.color.accent.$value.hex} />
      <rect {...T_BAR} fill={ink} shapeRendering="crispEdges" />
      <rect {...T_STEM} fill={ink} shapeRendering="crispEdges" />
    </svg>,
    MONOGRAM_SIZE,
  );
}
