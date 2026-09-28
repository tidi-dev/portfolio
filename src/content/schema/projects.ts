import { z } from "zod";
import type { Content } from "./define";
import {
  HttpsUrl,
  Period,
  structuralEnum,
  structuralId,
  structuralLiteral,
  Term,
  Text,
} from "./primitives";

const List = z.array(Text).nonempty();

/** A role: one phrase, or the owner's middot list (rendered inline). */
const Role = z.union([Text, z.array(Text).min(2)]);

const Count = z.number().int().nonnegative();

/**
 * The approved compact set of figures (info.md → Approved copy,
 * botmivivi.facts): users, customers and orders, the window that qualifies
 * customers and orders, and the impact line.
 */
const Usage = z.strictObject({
  users: Count,
  customers: Count,
  orders: Count,
  window: Text,
  impact: Text,
});

const Facts = z
  .strictObject({
    role: Role,
    team: Text.optional(),
    scale: Text.optional(),
    /** A users line, as the owner wrote it (Quest). */
    users: Text.optional(),
    usage: Usage.optional(),
    stack: List.optional(),
  })
  .refine((facts) => facts.users === undefined || facts.usage === undefined, {
    message: "One users fact per sheet: the users line or the usage figures",
    path: ["users"],
  });

/** What I built as bullets, or the owner's "Name — description" strings as terms. */
const Body = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: structuralLiteral("bullets", "body variant"),
    heading: Text,
    items: List,
  }),
  z.strictObject({
    kind: structuralLiteral("terms", "body variant"),
    heading: Text,
    items: z.array(Term).nonempty(),
  }),
]);

const YouTubeWatchUrl = HttpsUrl.refine((url) => {
  const { hostname, pathname, searchParams } = new URL(url);
  return (
    hostname === "www.youtube.com" &&
    pathname === "/watch" &&
    /^[\w-]{11}$/.test(searchParams.get("v") ?? "")
  );
}, "Use a https://www.youtube.com/watch?v=<id> URL");

/** The sheet drawings in drawings.ts (the bench belongs to the hero). */
export const DrawingId = structuralEnum(
  ["cyberrock", "quest", "botmivivi"],
  "a sheet drawing in drawings.ts",
);

const ProjectId = () => structuralId("a project id, which experience.ts lists");

/** A full sheet (DESIGN.md → Sheets): CyberRock, botmivivi, Quest @ NFQ Asia. */
export const FullProject = z.strictObject({
  kind: structuralLiteral("full", "sheet variant"),
  id: ProjectId(),
  name: Text,
  /** The name in an employer's project list, when it differs. */
  shortName: Text.optional(),
  status: z.enum(["Active", "Side", "Cleared"]),
  period: Period,
  lede: Text,
  drawing: DrawingId,
  facts: Facts,
  partyLead: Term.optional(),
  body: Body,
  video: z.strictObject({ url: YouTubeWatchUrl, title: Text }).optional(),
});

/** A compact sheet: Lemonswan and Scania. A missing period or link renders nothing. */
export const CompactProject = z.strictObject({
  kind: structuralLiteral("compact", "sheet variant"),
  id: ProjectId(),
  name: Text,
  shortName: Text.optional(),
  period: Period.optional(),
  oneLiner: Text,
  built: Text,
  stack: List,
  link: z.strictObject({ url: HttpsUrl, text: Text }).optional(),
});

/** info.md → Projects, and Experience → NFQ Asia's projects, in Quest journal order. */
export const Projects = z
  .array(z.discriminatedUnion("kind", [FullProject, CompactProject]))
  .nonempty()
  .refine(
    (projects) =>
      new Set(projects.map((project) => project.id)).size === projects.length,
    "Project ids must be unique",
  );

/** The facts-list terms, one per intent across every sheet. */
export const FactTerms = z.strictObject({
  role: Text,
  /** A compact sheet's "What I built" (info.md: Lemonswan, Scania). */
  built: Text,
  team: Text,
  scale: Text,
  users: Text,
  customers: Text,
  orders: Text,
  impact: Text,
  stack: Text,
});

export type FullProject = Content<typeof FullProject>;
export type CompactProject = Content<typeof CompactProject>;
export type Project = FullProject | CompactProject;
export type FactTerms = Content<typeof FactTerms>;
