import type { Point } from "./grammar";

/**
 * The CyberRock drawing (DESIGN.md → Drawing grammar, CyberRock row; Approved
 * copy depiction.cyberrock-drawing): manufacturing → the field in ink, with
 * supplier exports branching off as an output; the proof runs the field →
 * Challenge-response auth → genuine, with the attestation modes under the
 * auth node; the full audit trail is construction, dashed under the
 * lifecycle, with ticks to its three nodes. Anomaly detection is not drawn.
 *
 * Node widths are the measured label plus at least 12 units a side, on the
 * 8-unit grid (tests/unit/drawings.test.ts checks the label boxes).
 */

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
}

export interface TextSpot {
  readonly x: number;
  /** The baseline (the first one, for wrapped text). */
  readonly y: number;
  readonly anchor: "start" | "middle" | "end";
}

export interface CyberRockLayout {
  readonly width: number;
  readonly height: number;
  readonly manufacturing: Box;
  readonly field: Box;
  readonly supplierExports: Box;
  readonly auth: Box;
  /** manufacturing → the field (ink, arrow at the end). */
  readonly lifecycle: readonly Point[];
  readonly lifecycleArrow: "right" | "down";
  /** From the lifecycle line to supplier exports: an output, not a stage. */
  readonly branch: readonly Point[];
  readonly toAuth: readonly Point[];
  readonly toGenuine: readonly Point[];
  readonly proofArrow: "right" | "down";
  readonly genuine: TextSpot;
  readonly attestation: TextSpot & { readonly wordsPerLine: readonly number[] };
  readonly trail: readonly Point[];
  readonly ticks: readonly (readonly Point[])[];
  readonly trailLabel: TextSpot;
}

/** Wide: one row; the branch drops below; the trail runs under everything. */
export const CYBERROCK_WIDE: CyberRockLayout = {
  width: 880,
  height: 208,
  manufacturing: { x: 8, y: 16, width: 112 },
  field: { x: 328, y: 16, width: 72 },
  supplierExports: { x: 160, y: 96, width: 128 },
  auth: { x: 512, y: 16, width: 176 },
  lifecycle: [
    { x: 120, y: 36 },
    { x: 328, y: 36 },
  ],
  lifecycleArrow: "right",
  branch: [
    { x: 224, y: 36 },
    { x: 224, y: 96 },
  ],
  toAuth: [
    { x: 400, y: 36 },
    { x: 512, y: 36 },
  ],
  toGenuine: [
    { x: 688, y: 36 },
    { x: 784, y: 36 },
  ],
  proofArrow: "right",
  genuine: { x: 792, y: 41, anchor: "start" },
  attestation: { x: 600, y: 76, anchor: "middle", wordsPerLine: [4, 3] },
  trail: [
    { x: 8, y: 176 },
    { x: 872, y: 176 },
  ],
  ticks: [
    [
      { x: 64, y: 56 },
      { x: 64, y: 176 },
    ],
    [
      { x: 224, y: 136 },
      { x: 224, y: 176 },
    ],
    [
      { x: 364, y: 56 },
      { x: 364, y: 176 },
    ],
  ],
  trailLabel: { x: 8, y: 196, anchor: "start" },
};

/** Tall: top to bottom; the branch steps right; the trail runs down the right edge, labelled at its foot. */
export const CYBERROCK_TALL: CyberRockLayout = {
  width: 240,
  height: 392,
  manufacturing: { x: 8, y: 8, width: 112 },
  field: { x: 28, y: 160, width: 72 },
  supplierExports: { x: 80, y: 96, width: 120 },
  auth: { x: 8, y: 256, width: 176 },
  lifecycle: [
    { x: 64, y: 48 },
    { x: 64, y: 160 },
  ],
  lifecycleArrow: "down",
  branch: [
    { x: 64, y: 72 },
    { x: 140, y: 72 },
    { x: 140, y: 96 },
  ],
  toAuth: [
    { x: 64, y: 200 },
    { x: 64, y: 256 },
  ],
  toGenuine: [
    { x: 168, y: 296 },
    { x: 168, y: 360 },
  ],
  proofArrow: "down",
  genuine: { x: 168, y: 380, anchor: "middle" },
  attestation: { x: 8, y: 316, anchor: "start", wordsPerLine: [3, 2, 2] },
  trail: [
    { x: 224, y: 28 },
    { x: 224, y: 216 },
  ],
  ticks: [
    [
      { x: 120, y: 28 },
      { x: 224, y: 28 },
    ],
    [
      { x: 200, y: 116 },
      { x: 224, y: 116 },
    ],
    [
      { x: 100, y: 180 },
      { x: 224, y: 180 },
    ],
  ],
  trailLabel: { x: 232, y: 236, anchor: "end" },
};
