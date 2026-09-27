import { copy } from "@/content/copy";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { Drawings } from "@/content/schema/drawings";

// The owner's verdict word, shared by the bench readout and CyberRock's proof.
const GENUINE = "genuine";

/**
 * The bench and the three sheet drawings (DESIGN.md → Drawing grammar):
 * labels in the owner's words, captions, and the approved step lists
 * (info.md → Approved copy, a11y.steps.*, quest.drawing.carried and
 * botmivivi.drawing.replaced-label).
 */
export const drawings = defineContent("drawings", Drawings, {
  bench: {
    caption: "prove a device is genuine before anything trusts it",
    labels: {
      host: "host",
      chip: "chip",
      challenge: "challenge",
      response: "response",
    },
    verdicts: { genuine: GENUINE, rejected: copy.bench.verdictRejected },
    steps: [
      "The host sends a challenge.",
      "The chip sends back a response.",
      "Verdict: genuine.",
    ],
  },
  cyberrock: {
    caption: "chip authentication and lifecycle",
    labels: {
      manufacturing: "manufacturing",
      field: "the field",
      supplierExports: "supplier exports",
      auditTrail: "full audit trail",
      auth: "Challenge-response auth",
      authModes: "token, host, mutual, daisy-chain and secure-boot attestation",
      genuine: GENUINE,
    },
    steps: [
      "The chip lifecycle runs from manufacturing to the field.",
      "Supplier exports leave the lifecycle as an output.",
      "A full audit trail runs underneath the whole lifecycle.",
      "In the field, challenge-response auth (token, host, mutual, daisy-chain and secure-boot attestation) proves the device is genuine before anything trusts it.",
    ],
  },
  quest: {
    caption: "DynamoDB → MySQL migration with ~5 min of downtime",
    labels: {
      v1: "v1",
      v2: "v2",
      lambda: "Lambda",
      eventBridge: "EventBridge",
      dynamoDb: "DynamoDB",
      nestJs: "NestJS",
      prisma: "Prisma",
      mySql: "MySQL",
      downtime: "~5 min of downtime",
    },
    carried: ["users", "quest collection", "award", "status"],
    steps: [
      "v1 ran on Lambda, EventBridge and DynamoDB.",
      "The data moved from DynamoDB to MySQL with ~5 min of downtime, carrying users, quest collection, award and status.",
      "v2 was built on NestJS, Prisma and MySQL.",
    ],
  },
  botmivivi: {
    caption: "numbers that keep themselves correct",
    labels: {
      transaction: "the same transaction",
      order: "order",
      return: "return",
      payment: "payment",
      balance: "balance",
    },
    replaced: {
      label: "Replaced manual steps",
      items: ["creating order", "write report", "customer debt", "inventory"],
    },
    steps: [
      "Every order, return and payment moves the balance in the same transaction.",
      "Replaced manual steps: creating order, write report, customer debt, inventory.",
    ],
  },
} as const satisfies ContentInput<typeof Drawings>);
