import type { Box, Direction, Point, Region, TextSpot } from "./grammar";

/**
 * The Quest migration drawing (DESIGN.md → Drawing grammar, Quest row;
 * Approved copy quest.drawing.carried, a11y.steps.quest): territory "v1" as
 * construction, with Lambda, EventBridge and DynamoDB as replaced nodes;
 * territory "v2" in ink, with NestJS, Prisma and MySQL; the proof runs
 * DynamoDB → MySQL, labelled "~5 min of downtime", with the carried data
 * beside it. Nothing inside a territory is connected: info.md names the
 * technologies, not how they call each other.
 *
 * Node widths are the label measured in Chromium (the project's Archivo at
 * width 87.5, 14 units) plus at least 12 units a side, on the 8-unit grid:
 * Lambda 47 → 72, EventBridge 72 → 96, DynamoDB 66 → 96, NestJS 43 → 72,
 * Prisma 41 → 72, MySQL 43 → 96 (as wide as DynamoDB, so the proof lines up
 * in the tall variant). "~5 min of downtime" is 116 units (label-strong);
 * the carried data 214 on one line, 99 at most wrapped 1 + 2 + 2 words.
 */
export interface QuestLayout {
  readonly width: number;
  readonly height: number;
  readonly v1: Region;
  readonly v1Label: TextSpot;
  readonly v2: Region;
  readonly v2Label: TextSpot;
  readonly lambda: Box;
  readonly eventBridge: Box;
  readonly dynamoDb: Box;
  readonly nestJs: Box;
  readonly prisma: Box;
  readonly mySql: Box;
  /** DynamoDB → MySQL. */
  readonly proof: readonly Point[];
  readonly proofArrow: Direction;
  readonly downtime: TextSpot;
  readonly carried: TextSpot & { readonly wordsPerLine: readonly number[] };
}

/** Wide: v1 left, v2 right, data stores on the bottom row so the proof runs level. */
export const QUEST_WIDE: QuestLayout = {
  width: 880,
  height: 168,
  v1: { x: 8, y: 8, width: 216, height: 152 },
  v1Label: { x: 24, y: 32, anchor: "start" },
  v2: { x: 680, y: 8, width: 192, height: 152 },
  v2Label: { x: 696, y: 32, anchor: "start" },
  lambda: { x: 24, y: 48, width: 72 },
  eventBridge: { x: 112, y: 48, width: 96 },
  dynamoDb: { x: 112, y: 104, width: 96 },
  nestJs: { x: 696, y: 48, width: 72 },
  prisma: { x: 784, y: 48, width: 72 },
  mySql: { x: 696, y: 104, width: 96 },
  proof: [
    { x: 208, y: 124 },
    { x: 696, y: 124 },
  ],
  proofArrow: "right",
  downtime: { x: 452, y: 113, anchor: "middle" },
  carried: { x: 452, y: 144, anchor: "middle", wordsPerLine: [5] },
};

/** Tall: v1 above, ending in DynamoDB; the proof down; v2 below, starting with MySQL. */
export const QUEST_TALL: QuestLayout = {
  width: 240,
  height: 424,
  v1: { x: 8, y: 8, width: 224, height: 152 },
  v1Label: { x: 24, y: 32, anchor: "start" },
  v2: { x: 8, y: 264, width: 224, height: 152 },
  v2Label: { x: 24, y: 288, anchor: "start" },
  lambda: { x: 24, y: 48, width: 72 },
  eventBridge: { x: 112, y: 48, width: 96 },
  dynamoDb: { x: 24, y: 104, width: 96 },
  mySql: { x: 24, y: 304, width: 96 },
  nestJs: { x: 24, y: 360, width: 72 },
  prisma: { x: 112, y: 360, width: 72 },
  proof: [
    { x: 72, y: 144 },
    { x: 72, y: 304 },
  ],
  proofArrow: "down",
  downtime: { x: 88, y: 180, anchor: "start" },
  carried: { x: 88, y: 204, anchor: "start", wordsPerLine: [1, 2, 2] },
};
