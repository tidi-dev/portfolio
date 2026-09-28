import { ImageResponse } from "next/og";
import tokens from "@/styles/tokens.generated.json";

/** The icon's canvas, in CSS pixels (the browser tab's 32 px favicon). */
export const MONOGRAM_SIZE = { width: 32, height: 32 } as const;

// The tile's chamfer (DESIGN.md → Shapes → Chamfer: the top-right and
// bottom-left corners cut at 45°), cut 8 units into the 32-unit tile.
const TILE = "0,0 24,0 32,8 32,32 8,32 0,24";

/**
 * The site icon (QA F7): a "T" monogram for the brand "TiDi" on a gold
 * chamfered tile, in DESIGN.md's colours (`accent`, `on-accent`, from the
 * DTCG export). No artwork of the owner. Rendered to a PNG, which every
 * browser accepts at /favicon.ico and as the declared icon.
 */
export function monogramIcon(): ImageResponse {
  return new ImageResponse(
    <svg
      width={MONOGRAM_SIZE.width}
      height={MONOGRAM_SIZE.height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points={TILE} fill={tokens.color.accent.$value.hex} />
      <rect
        x="8"
        y="8"
        width="16"
        height="4.5"
        fill={tokens.color["on-accent"].$value.hex}
      />
      <rect
        x="13.75"
        y="8"
        width="4.5"
        height="16"
        fill={tokens.color["on-accent"].$value.hex}
      />
    </svg>,
    MONOGRAM_SIZE,
  );
}
