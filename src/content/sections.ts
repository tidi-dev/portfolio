import { about } from "@/content/about";
import { experience } from "@/content/experience";
import { houseRules } from "@/content/house-rules";
import { interests } from "@/content/interests";
import { projects } from "@/content/projects";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { Sections } from "@/content/schema/sections";
import { skills } from "@/content/skills";

/**
 * The section registry, in DESIGN.md's order (contrib-design §1.3). The nav
 * and the page both read it, and `present` comes from the content itself, so
 * a section without content can't leave a dangling nav link. The labels are
 * the owner's section names; Contact's h2 is the sign-off (about.ts).
 */
export const sections = defineContent("sections", Sections, [
  {
    id: "quest-journal",
    label: "Quest journal",
    nav: true,
    present: projects.length > 0,
  },
  {
    id: "experience",
    label: "Experience",
    nav: true,
    present: experience.length > 0,
  },
  {
    id: "house-rules",
    label: "House rules",
    nav: true,
    present: houseRules.rules.length > 0,
  },
  {
    id: "inventory",
    label: "Inventory",
    nav: false,
    present: skills.groups.length > 0,
  },
  { id: "about", label: "About", nav: false, present: about.bio.length > 0 },
  { id: "afk", label: "AFK", nav: false, present: interests.afk.length > 0 },
  // Contact's channels are required by its schema, so it is always present.
  { id: "contact", label: "Contact", nav: true, present: true },
] as const satisfies ContentInput<typeof Sections>);
