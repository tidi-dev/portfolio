import {
  GRID,
  LABEL_ASCENT,
  LABEL_DESCENT,
  LABEL_GAP,
  NODE_HEIGHT,
  type Point,
} from "./grammar";

/**
 * The handshake bench (DESIGN.md → Handshake bench; Approved copy
 * depiction.bench): a host node on the left, a square chip with short ink
 * pins on each side on the right, "challenge" on top (host → chip) and
 * "response" below (chip → host). Both variants stay horizontal: compact is
 * authored 240 units wide, wide 480 (Errata: compact 240).
 */
export const BENCH_WIDTHS = { compact: 240, wide: 480 } as const;
export type BenchVariant = keyof typeof BENCH_WIDTHS;

export const BENCH_HEIGHT = 88;

const CENTRE = BENCH_HEIGHT / 2;
/** Each line sits 12 units from the node's centre, on a chip pin. */
const LINE_OFFSET = 12;
const PIN = GRID;
const HOST = { x: GRID, width: 56 };
const CHIP = NODE_HEIGHT;

export interface BenchGeometry {
  readonly width: number;
  readonly host: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
  };
  readonly chip: {
    readonly x: number;
    readonly y: number;
    readonly size: number;
  };
  /** Short ink pins, two on each side of the chip. */
  readonly pins: readonly (readonly [Point, Point])[];
  readonly challenge: {
    readonly from: Point;
    readonly to: Point;
    readonly label: Point;
  };
  readonly response: {
    readonly from: Point;
    readonly to: Point;
    readonly label: Point;
  };
}

export function benchGeometry(variant: BenchVariant): BenchGeometry {
  const width = BENCH_WIDTHS[variant];
  const top = CENTRE - NODE_HEIGHT / 2;
  const chipX = width - GRID - PIN - CHIP;
  const upper = CENTRE - LINE_OFFSET;
  const lower = CENTRE + LINE_OFFSET;
  const hostRight = HOST.x + HOST.width;
  const pinTip = chipX - PIN;
  const middle = (hostRight + pinTip) / 2;
  const side = [top + (CHIP / 2 - LINE_OFFSET), top + (CHIP / 2 + LINE_OFFSET)];
  const across = [
    chipX + (CHIP / 2 - LINE_OFFSET),
    chipX + (CHIP / 2 + LINE_OFFSET),
  ];

  return {
    width,
    host: { x: HOST.x, y: top, width: HOST.width },
    chip: { x: chipX, y: top, size: CHIP },
    pins: [
      ...side.map(
        (y) =>
          [
            { x: chipX - PIN, y },
            { x: chipX, y },
          ] as const,
      ),
      ...side.map(
        (y) =>
          [
            { x: chipX + CHIP, y },
            { x: chipX + CHIP + PIN, y },
          ] as const,
      ),
      ...across.map(
        (x) =>
          [
            { x, y: top - PIN },
            { x, y: top },
          ] as const,
      ),
      ...across.map(
        (x) =>
          [
            { x, y: top + CHIP },
            { x, y: top + CHIP + PIN },
          ] as const,
      ),
    ],
    challenge: {
      from: { x: hostRight, y: upper },
      to: { x: pinTip, y: upper },
      label: { x: middle, y: upper - LABEL_GAP - LABEL_DESCENT },
    },
    response: {
      from: { x: pinTip, y: lower },
      to: { x: hostRight, y: lower },
      label: { x: middle, y: lower + LABEL_GAP + LABEL_ASCENT },
    },
  };
}
