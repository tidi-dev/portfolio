import { type ContentInput, defineContent } from "@/content/schema/define";
import { Experience } from "@/content/schema/experience";

/**
 * info.md → Experience, newest first. Projects are projects.ts ids; Lemonswan
 * and Scania sit under NFQ Asia (Approved copy, placement.nfq-projects).
 */
export const experience = defineContent("experience", Experience, [
  {
    employer: "Sunbytes",
    title: "Full-stack Developer",
    period: { start: "2024-03", end: "present" },
    projects: ["cyberrock"],
  },
  {
    employer: "NFQ Asia",
    title: "Full-stack Developer",
    period: { start: "2020-03", end: "2024-03" },
    projects: ["lemonswan", "quest", "scania"],
  },
] as const satisfies ContentInput<typeof Experience>);
