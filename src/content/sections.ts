import { about } from "@/content/about";
import { copy } from "@/content/copy";
import { experience } from "@/content/experience";
import { houseRules } from "@/content/house-rules";
import { interests } from "@/content/interests";
import { projects } from "@/content/projects";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { Sections } from "@/content/schema/sections";
import { skills } from "@/content/skills";

/**
 * The section registry, in page order (contrib-design §1.2). The nav and the
 * page both read it, and `present` comes from the content itself, so a
 * section without content can't leave a dangling nav link. Labels: info.md →
 * Site preferences → Section labels, heading.experience, heading.contact
 * and ui.profile-labels.
 */
export const sections = defineContent("sections", Sections, [
  {
    id: "quest-journal",
    label: "Quest journal",
    nav: true,
    present: projects.some((project) => project.kind === "full"),
  },
  {
    id: "experience",
    label: copy.heading.experience,
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
    nav: true,
    present: skills.groups.length > 0,
  },
  {
    id: "about",
    label: copy.ui.characterStats,
    nav: false,
    present: about.stats.length > 0,
  },
  { id: "afk", label: "AFK", nav: false, present: interests.afk.length > 0 },
  // Join party's channels are required by its schema, so it is always present.
  { id: "contact", label: copy.heading.contact, nav: true, present: true },
] as const satisfies ContentInput<typeof Sections>);
