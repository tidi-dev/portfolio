import tokens from "@/styles/tokens.generated.json" with { type: "json" };

/**
 * DESIGN.md → Components → Drawing grammar, in drawing units: the geometry
 * every drawing shares. Coordinates are drawing data; colours, stroke widths,
 * dashes and label sizes come from tokens through CSS classes (primitives.tsx).
 */
export const GRID = 8;
export const NODE_HEIGHT = 40;
export const NODE_PADDING = 12;
/** The only arrowhead: a filled 8 × 8-unit triangle. */
export const ARROW = 8;
/** `rounded.base`, from the DTCG export: nodes share every rectangle's radius. */
export const NODE_RADIUS = tokens.rounded.base.$value.value;

/**
 * A 14-unit label's box around its baseline, measured in Chromium with the
 * project's Archivo subset at width 87.5: 12 units above, 3 below. A label
 * centred on a line sits 5 units below it (half the cap height).
 */
export const LABEL_ASCENT = 12;
export const LABEL_DESCENT = 3;
export const LABEL_CENTRE_OFFSET = 5;
/** The gap between a line and a label set above or below it. */
export const LABEL_GAP = 8;
/** Baseline to baseline for a label that wraps to several lines. */
export const LABEL_LINE = 20;

export interface Point {
  readonly x: number;
  readonly y: number;
}

export type Direction = "right" | "left" | "down" | "up";

/** A node's box: top-left corner and width (every node is 40 units tall). */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
}

/** A boundary's region: top-left corner and size. */
export interface Region extends Box {
  readonly height: number;
}

/** Where a free label sits. */
export interface TextSpot {
  readonly x: number;
  /** The baseline (the first one, for wrapped text). */
  readonly y: number;
  readonly anchor: "start" | "middle" | "end";
}

/** A line and the way its arrowhead points. */
export interface Arrow {
  readonly points: readonly Point[];
  readonly arrow: Direction;
}

const UNIT: Readonly<Record<Direction, Point>> = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
};

/** The arrowhead triangle for a tip and the direction it points. */
export function arrowheadPath(tip: Point, direction: Direction): string {
  const { x: dx, y: dy } = UNIT[direction];
  const base = { x: tip.x - dx * ARROW, y: tip.y - dy * ARROW };
  const half = ARROW / 2;
  const a = { x: base.x - dy * half, y: base.y + dx * half };
  const b = { x: base.x + dy * half, y: base.y - dx * half };
  return `M${String(tip.x)} ${String(tip.y)}L${String(a.x)} ${String(a.y)}L${String(b.x)} ${String(b.y)}Z`;
}

/**
 * A polyline through the points. With an arrowhead, the last segment stops
 * at the triangle's base, so the stroke never pokes through the tip.
 */
export function linePath(points: readonly Point[], arrow?: Direction): string {
  const last = points.at(-1);
  const trimmed =
    arrow === undefined || last === undefined
      ? points
      : [
          ...points.slice(0, -1),
          {
            x: last.x - UNIT[arrow].x * ARROW,
            y: last.y - UNIT[arrow].y * ARROW,
          },
        ];
  return trimmed
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${String(point.x)} ${String(point.y)}`,
    )
    .join("");
}

/**
 * The owner's string split into lines at word boundaries, with the given
 * word count per line. The words never change: joined with spaces, the lines
 * are the string again (a unit test pins this).
 */
export function wrapWords(
  text: string,
  wordsPerLine: readonly number[],
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let start = 0;
  for (const count of wordsPerLine) {
    lines.push(words.slice(start, start + count).join(" "));
    start += count;
  }
  if (start !== words.length) {
    throw new Error(
      `wrapWords: ${wordsPerLine.join("+")} words, but "${text}" has ${String(words.length)}`,
    );
  }
  return lines;
}
