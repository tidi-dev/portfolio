import { z } from "zod";
import type { Content } from "./define";
import { Period, structuralId, Text } from "./primitives";

/** One Mission log node (DESIGN.md → Mission log timeline): employer, title, period, projects. */
export const Employment = z.strictObject({
  employer: Text,
  title: Text,
  period: Period,
  /** The projects this row lists, as projects.ts ids. */
  projects: z
    .array(structuralId("a project the employer row lists"))
    .nonempty(),
});

/** info.md → Experience, newest first. */
export const Experience = z.array(Employment).nonempty();

export type Employment = Content<typeof Employment>;
