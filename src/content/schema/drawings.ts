import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/** The text alternative's steps, numbered by their <ol> (DESIGN.md → Drawing grammar). */
const Steps = z.array(Text).nonempty();

/**
 * The bench and the three sheet drawings: labels in the owner's words,
 * captions, and the approved step lists (info.md → Approved copy,
 * a11y.steps.*). Geometry lives with each drawing's component.
 */
export const Drawings = z.strictObject({
  bench: z.strictObject({
    caption: Text,
    labels: z.strictObject({
      host: Text,
      chip: Text,
      challenge: Text,
      response: Text,
    }),
    verdicts: z.strictObject({ genuine: Text, rejected: Text }),
    steps: Steps,
  }),
  cyberrock: z.strictObject({
    caption: Text,
    labels: z.strictObject({
      manufacturing: Text,
      field: Text,
      supplierExports: Text,
      auditTrail: Text,
      auth: Text,
      authModes: Text,
      genuine: Text,
    }),
    steps: Steps,
  }),
  quest: z.strictObject({
    caption: Text,
    labels: z.strictObject({
      v1: Text,
      v2: Text,
      lambda: Text,
      eventBridge: Text,
      dynamoDb: Text,
      nestJs: Text,
      prisma: Text,
      mySql: Text,
      downtime: Text,
    }),
    /** The data the migration carried (Approved copy, quest.drawing.carried). */
    carried: z.array(Text).nonempty(),
    steps: Steps,
  }),
  botmivivi: z.strictObject({
    caption: Text,
    labels: z.strictObject({
      transaction: Text,
      order: Text,
      return: Text,
      payment: Text,
      balance: Text,
    }),
    /** The replaced manual steps, under their approved label. */
    replaced: z.strictObject({ label: Text, items: z.array(Text).nonempty() }),
    steps: Steps,
  }),
});

export type Drawings = Content<typeof Drawings>;
