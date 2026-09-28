import { copy } from "@/content/copy";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { Holograms } from "@/content/schema/holograms";

/**
 * The hero bench and the quest holograms: scene tags in the owner's words
 * (depiction.bench; Quest's "v1 → v2"), the verdicts ("genuine" is the
 * owner's word, bench.verdict-rejected its pair) and the approved step
 * lists (info.md → Approved copy, a11y.steps.*).
 */
export const holograms = defineContent("holograms", Holograms, {
  bench: {
    tags: { host: "host", chip: "chip" },
    verdicts: { genuine: "genuine", rejected: copy.bench.verdictRejected },
    steps: [
      "The host sends a challenge.",
      "The chip sends back a response.",
      "Verdict: genuine.",
    ],
  },
  cyberrock: {
    steps: [
      "The chip lifecycle runs from manufacturing to the field.",
      "Supplier exports leave the lifecycle as an output.",
      "A full audit trail runs underneath the whole lifecycle.",
      "In the field, challenge-response auth (token, host, mutual, daisy-chain and secure-boot attestation) proves the device is genuine before anything trusts it.",
    ],
  },
  quest: {
    tags: { v1: "v1", v2: "v2" },
    steps: [
      "v1 ran on Lambda, EventBridge and DynamoDB.",
      "The data moved from DynamoDB to MySQL with ~5 min of downtime, carrying users, quest collection, award and status.",
      "v2 was built on NestJS, Prisma and MySQL.",
    ],
  },
  botmivivi: {
    steps: [
      "Every order, return and payment moves the balance in the same transaction.",
      "Replaced manual steps: creating order, write report, customer debt, inventory.",
    ],
  },
} as const satisfies ContentInput<typeof Holograms>);
