import { copy } from "@/content/copy";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { Skills } from "@/content/schema/skills";

/**
 * info.md → Skills & tools: the five profile groups for the site, and the
 * résumé-only items (Approved copy, lists.scope). The AI group takes the
 * profile's label, "Companions" (ui.small-labels).
 */
export const skills = defineContent("skills", Skills, {
  groups: [
    {
      name: "Main",
      items: ["TypeScript", "Node.js", "NestJS", "React", "Next.js", "Vue 3"],
    },
    {
      name: "Data",
      items: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "DynamoDB",
        "Redis",
        "NATS",
        "BullMQ",
      ],
    },
    {
      name: "Ops",
      items: [
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "Terraform",
        "GitHub Actions",
        "Argo CD",
        "New Relic",
      ],
    },
    { name: copy.ui.companions, items: ["Claude", "ChatGPT"] },
    {
      name: "Alt builds",
      items: ["PHP", "Laravel", "Symfony", "Python", "Flask"],
    },
  ],
  resumeOnly: [
    "Serverless framework",
    "CI/CD",
    "Git",
    "Slack",
    "Jira",
    "Spryker framework",
  ],
} as const satisfies ContentInput<typeof Skills>);
