import { Copy } from "@/content/schema/copy";
import { type ContentInput, defineContent } from "@/content/schema/define";

// Approved copy hero.sentence; resume.summary is "= hero.sentence".
const HERO_SENTENCE =
  "Officially a full-stack developer, though I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable.";

/**
 * info.md → Approved copy, verbatim. content.test.ts checks every row
 * against info.md, and that nothing else lives here.
 */
export const copy = defineContent("copy", Copy, {
  hero: {
    cta: "Bring me a pain point",
    sentence: HERO_SENTENCE,
  },
  resume: {
    link: "Résumé",
    contactLink: "PDF, {size}",
    summary: HERO_SENTENCE,
    file: "tidi-resume.pdf",
    title: "TiDi, Résumé",
  },
  a11y: {
    themeToggle: "Dark theme",
    menuButton: "Menu",
    nav: "Main",
    skipLink: "Skip to content",
  },
  format: {
    period: {
      closed: "{YYYY-MM} to {YYYY-MM}",
      open: "{YYYY-MM} to present",
    },
  },
  bench: {
    run: "Run the handshake",
    toggle: "Counterfeit chip",
    verdictRejected: "rejected",
  },
  botmivivi: {
    facts: {
      window: "in the first 2 months",
      impact: "90% less time, 80% fewer errors",
    },
  },
  quest: {
    users: "~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho",
  },
  lemonswan: {
    oneLiner:
      "A dating platform in Germany for singles with serious intentions.",
  },
  scania: {
    oneLiner:
      "An e-commerce platform selling trucks, built for a German company.",
  },
  video: {
    name: "Watch Quest by NFQ",
    caption: "Opens the YouTube player.",
  },
  avatar: {
    caption:
      "Illustrated avatar of TiDi coding, gaming, playing football and drinking coffee",
  },
  meta: {
    title: "Dai Ho Trong (TiDi), Full-stack Developer",
    description:
      "I spend most of my time on the backend: designing APIs, modeling data, connecting services, and making sure the infrastructure underneath them stays reliable.",
  },
  label: {
    languages: "Languages",
  },
  contact: {
    locationLabel: "Location",
  },
  notFound: {
    heading: "Nothing here",
    link: "Back to TiDi",
  },
  og: {
    alt: "Dai Ho Trong (TiDi), Full-stack Developer, with a drawing of a chip handshake",
  },
} as const satisfies ContentInput<typeof Copy>);
