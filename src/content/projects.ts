import { copy } from "@/content/copy";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { FactTerms, Projects } from "@/content/schema/projects";

/**
 * info.md → Projects (CyberRock, botmivivi, Quest @ NFQ Asia: the Quest
 * journal) and Experience → NFQ Asia's other projects (Lemonswan, Scania:
 * the Mission log). Approved wording comes from copy.ts.
 */
export const projects = defineContent("projects", Projects, [
  {
    kind: "full",
    id: "cyberrock",
    name: "CyberRock",
    status: "Active",
    period: { start: "2024-03", end: "present" },
    lede: "prove IoT devices are genuine",
    hologram: "cyberrock",
    facts: {
      role: ["Backend", "auth", "solution design"],
      team: "8 people",
      scale: "13 services across Azure and AWS",
      stack: [
        "NestJS microservices over NATS",
        "PostgreSQL",
        "Redis/BullMQ",
        "React",
        "Azure and AWS",
        "GitHub Actions",
        "Argo CD",
      ],
    },
    cardStat: {
      source: "scale",
      key: "scale",
      value: "13",
      qualifier: "services across Azure and AWS",
    },
    body: {
      kind: "bullets",
      heading: "What I built",
      items: [
        "Challenge-response auth for security chips — token, host, mutual, daisy-chain and secure-boot attestation",
        "Chip lifecycle from manufacturing to the field, with supplier exports and a full audit trail",
        "Anomaly detection that turns geolocation jumps and slow responses into Slack-alerted incidents",
      ],
    },
  },
  {
    kind: "full",
    id: "botmivivi",
    name: "botmivivi",
    status: "Side",
    period: { start: "2026-08", end: "present" },
    lede: "back office for a flour distributor, live in production",
    hologram: "botmivivi",
    facts: {
      role: "Built end to end",
      usage: {
        users: 10,
        customers: 646,
        orders: 2951,
        window: copy.botmivivi.facts.window,
        impact: copy.botmivivi.facts.impact,
      },
      stack: ["NestJS", "Prisma", "PostgreSQL", "Redis/BullMQ", "Vue 3"],
    },
    cardStat: {
      source: "customers",
      key: "customers",
      value: "646",
      qualifier: copy.botmivivi.facts.window,
    },
    body: {
      kind: "terms",
      heading: "What it does",
      items: [
        {
          term: "Debt ledger",
          description:
            "every order, return and payment moves the balance in the same transaction",
        },
        {
          term: "Price whitelist",
          description:
            "off-list prices are flagged to Slack; customers can lock a price and prepay",
        },
        {
          term: "Tonnage payroll",
          description:
            "every kilo a loader moves prices itself, so payroll is a query",
        },
      ],
    },
  },
  {
    kind: "full",
    id: "quest",
    name: "Quest @ NFQ Asia",
    shortName: "Quest",
    status: "Cleared",
    period: { start: "2020-12", end: "2024-03" },
    lede: "a career-path platform on RPG quest mechanics",
    hologram: "quest",
    facts: {
      role: "Tech lead",
      team: "8 juniors",
      users: copy.quest.users,
      // info.md → Quest @ NFQ Asia → Stack, compiled from the résumé.
      stack: [
        "Node.js",
        "Serverless framework",
        "AWS Lambda",
        "DynamoDB",
        "S3",
        "API Gateway",
        "EventBridge",
        "NestJS",
        "Prisma",
        "MySQL",
        "ReactJS",
        "VueJS",
        "Google OAuth 2.0",
        "Terraform",
        "New Relic",
      ],
    },
    cardStat: {
      source: "users",
      value: "~300",
      qualifier: "users in Ha Noi, Da Nang, Sai Gon, Can Tho",
    },
    partyLead: {
      term: "Party lead",
      description:
        "architecture calls, code reviews, cross-team work, agile timelines, and mentoring freshers and juniors.",
    },
    // DESIGN.md → Achievement badge: wall, stopwatch, key, tool, in order.
    body: {
      kind: "achievements",
      heading: copy.ui.achievementsUnlocked,
      items: [
        {
          term: "Clean Slate",
          description:
            "v2 codebase and architecture from scratch with NestJS + Prisma",
          icon: "wall",
        },
        {
          term: "Five-Minute Window",
          description: "DynamoDB → MySQL migration with ~5 min of downtime",
          icon: "stopwatch",
        },
        {
          term: "Front Door",
          description: "Google SSO built in, fewer third-party dependencies",
          icon: "key",
        },
        {
          term: "No More ClickOps",
          description: "Terraform for infrastructure, New Relic for monitoring",
          icon: "tool",
        },
      ],
    },
    video: {
      url: "https://www.youtube.com/watch?v=yLJZXvO_ARU",
      title: "Quest by NFQ",
    },
  },
  {
    kind: "compact",
    id: "lemonswan",
    name: "Lemonswan",
    period: { start: "2020-03", end: "2020-12" },
    oneLiner: copy.lemonswan.oneLiner,
    built: "matching logic and UI design",
    stack: ["Laravel 8.10", "MySQL", "Redis (cache)", "Tailwind CSS"],
    link: { url: "https://lemonswan.com/", text: "lemonswan.com" },
  },
  {
    kind: "compact",
    id: "scania",
    name: "Scania",
    oneLiner: copy.scania.oneLiner,
    built: "backend and frontend",
    stack: ["Spryker framework"],
  },
] as const satisfies ContentInput<typeof Projects>);

/**
 * The facts-list terms: the approved labels (ui.profile-labels,
 * ui.small-labels, botmivivi.facts, quest.users) and info.md's "What I
 * built".
 */
export const factTerms = defineContent("projects", FactTerms, {
  role: copy.ui.role,
  when: copy.ui.when,
  built: "What I built",
  team: copy.ui.team,
  scale: copy.ui.scale,
  users: "Users",
  customers: "Customers",
  orders: "Orders",
  impact: "Impact",
  stack: copy.ui.stack,
} as const satisfies ContentInput<typeof FactTerms>);
