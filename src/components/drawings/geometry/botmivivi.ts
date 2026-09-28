import type { Arrow, Box, Region, TextSpot } from "./grammar";

/**
 * The botmivivi ledger drawing (DESIGN.md → Drawing grammar, botmivivi row;
 * Approved copy botmivivi.drawing.replaced-label, a11y.steps.botmivivi):
 * the proof is a boundary labelled "the same transaction" around "order",
 * "return" and "payment", each with an ink arrow into "balance"; the
 * replaced manual steps are construction nodes under their approved label,
 * in the owner's order. Nothing connects the two groups: info.md says the
 * app replaced those steps, not how.
 *
 * Node widths are the label measured in Chromium (the project's Archivo at
 * width 87.5, 14 units) plus at least 12 units a side, on the 8-unit grid.
 * The replaced steps sit in two columns: creating order (81) and customer
 * debt (83) at 112; write report (66) and inventory (54) at 96. The inputs
 * share 80 (payment, 50, is the widest); balance (46) is 72 wide, or 96
 * where three arrows land on its top. "the same transaction" is 125 units
 * (label-strong), "Replaced manual steps" 135.
 */
export interface BotmiviviLayout {
  readonly width: number;
  readonly height: number;
  readonly replacedLabel: TextSpot;
  /** creating order, write report, customer debt, inventory. */
  readonly replaced: readonly [Box, Box, Box, Box];
  readonly transaction: Region;
  readonly transactionLabel: TextSpot;
  readonly order: Box;
  readonly return: Box;
  readonly payment: Box;
  readonly balance: Box;
  readonly arrows: {
    readonly order: Arrow;
    readonly return: Arrow;
    readonly payment: Arrow;
  };
}

/** Wide: the replaced steps (2 × 2) left, the transaction right. */
export const BOTMIVIVI_WIDE: BotmiviviLayout = {
  width: 880,
  height: 224,
  replacedLabel: { x: 48, y: 32, anchor: "start" },
  replaced: [
    { x: 48, y: 48, width: 112 },
    { x: 176, y: 48, width: 96 },
    { x: 48, y: 104, width: 112 },
    { x: 176, y: 104, width: 96 },
  ],
  transaction: { x: 448, y: 8, width: 160, height: 208 },
  transactionLabel: { x: 464, y: 32, anchor: "start" },
  order: { x: 464, y: 48, width: 80 },
  return: { x: 464, y: 104, width: 80 },
  payment: { x: 464, y: 160, width: 80 },
  balance: { x: 760, y: 104, width: 72 },
  arrows: {
    order: {
      points: [
        { x: 544, y: 68 },
        { x: 796, y: 68 },
        { x: 796, y: 104 },
      ],
      arrow: "down",
    },
    return: {
      points: [
        { x: 544, y: 124 },
        { x: 760, y: 124 },
      ],
      arrow: "right",
    },
    payment: {
      points: [
        { x: 544, y: 180 },
        { x: 796, y: 180 },
        { x: 796, y: 144 },
      ],
      arrow: "up",
    },
  },
};

/** Tall: the replaced steps above, the transaction below, the inputs stacked. */
export const BOTMIVIVI_TALL: BotmiviviLayout = {
  width: 240,
  height: 456,
  replacedLabel: { x: 8, y: 24, anchor: "start" },
  replaced: [
    { x: 8, y: 40, width: 112 },
    { x: 136, y: 40, width: 96 },
    { x: 8, y: 96, width: 112 },
    { x: 136, y: 96, width: 96 },
  ],
  transaction: { x: 8, y: 168, width: 224, height: 208 },
  transactionLabel: { x: 24, y: 192, anchor: "start" },
  order: { x: 24, y: 208, width: 80 },
  return: { x: 24, y: 264, width: 80 },
  payment: { x: 24, y: 320, width: 80 },
  balance: { x: 128, y: 408, width: 96 },
  arrows: {
    order: {
      points: [
        { x: 104, y: 228 },
        { x: 200, y: 228 },
        { x: 200, y: 408 },
      ],
      arrow: "down",
    },
    return: {
      points: [
        { x: 104, y: 284 },
        { x: 176, y: 284 },
        { x: 176, y: 408 },
      ],
      arrow: "down",
    },
    payment: {
      points: [
        { x: 104, y: 340 },
        { x: 152, y: 340 },
        { x: 152, y: 408 },
      ],
      arrow: "down",
    },
  },
};
