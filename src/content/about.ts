import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { About } from "@/content/schema/about";
import { type ContentInput, defineContent } from "@/content/schema/define";

/**
 * info.md → About (bio, sign-off, Leveling up), the Character stats rows and
 * Education & certifications. The résumé's old summary is not here: the
 * approved résumé summary is the hero sentence (Approved copy,
 * resume.summary).
 */
export const about = defineContent("about", About, {
  // Labels: ui.profile-labels and ui.small-labels. Values: info.md →
  // Identity (role, current field "Guild", "In production since: 2020",
  // trait "Passive"), Contact (location) and Projects ("2 active · 1
  // cleared"), each as profile.md's Character stats writes it.
  stats: [
    { label: copy.ui.class, value: identity.role },
    { label: copy.ui.guild, value: "Cyber security for IoT (EU)" },
    { label: copy.ui.base, value: contact.location.text },
    { label: copy.ui.xp, value: "In production since 2020" },
    { label: copy.ui.quests, value: "2 active · 1 cleared" },
    { label: copy.ui.passive, value: "Can't leave a pain point alone" },
  ],
  bio: [
    "I'm Dai — Daniel in English, TiDi around here. Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable.",
    "My journey has taken me from building Laravel applications, to AWS serverless systems, and eventually to event-driven microservices with NestJS. Somewhere along the way, I even built a career-path platform inspired by RPG quest mechanics — which probably explains a lot about the rest of this page.",
  ],
  signOff:
    "Got a pain point? Bring the constraints — I'll bring the trade-offs.",
  levelingUp: {
    label: "Leveling up",
    items: [
      "distributed-systems trade-offs",
      "reliability & SRE",
      "infrastructure as code",
      "AI in the dev loop",
    ],
  },
  education: {
    label: copy.ui.education,
    degrees: [
      {
        degree: "Bachelor in Software Application",
        school: "Ho Chi Minh Vocational College",
        years: "2017–2020",
      },
      {
        degree: "Bachelor in Business Administration",
        school: "Ton Duc Thang University",
        years: "2013–2017",
      },
    ],
    certifications: [
      { subject: "English", credentials: ["IELTS 6.0", "EF SET C1"] },
    ],
  },
  languages: {
    label: copy.label.languages,
    items: ["Vietnamese", "English"],
  },
} as const satisfies ContentInput<typeof About>);
