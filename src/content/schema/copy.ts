import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/** A template: text with exactly `count` copies of the placeholder. */
function template(placeholder: string, count: number) {
  return Text.refine(
    (text) => text.split(placeholder).length - 1 === count,
    `Keep exactly ${String(count)} ${placeholder}`,
  );
}

/**
 * info.md → Approved copy, one key per row (camelCased per segment:
 * `not-found.heading` → `notFound.heading`). Every field is required, so a
 * string can't render before the owner approves it. The step lists live in
 * holograms.ts; approvals of a depiction, a behaviour, a pattern, a
 * placement or a scope hold no string.
 */
export const Copy = z.strictObject({
  hero: z.strictObject({ cta: Text, sentence: Text }),
  resume: z.strictObject({
    link: Text,
    contactLink: template("{size}", 1),
    summary: Text,
    file: Text.regex(/^[a-z0-9-]+\.pdf$/, "Use a lower-case .pdf file name"),
    title: Text,
    /** resume.section-labels, in the résumé's order. */
    sectionLabels: z.strictObject({
      profile: Text,
      workExperience: Text,
      projects: Text,
      skills: Text,
      education: Text,
      languages: Text,
      contact: Text,
    }),
  }),
  a11y: z.strictObject({
    themeToggle: Text,
    menuButton: Text,
    nav: Text,
    skipLink: Text,
    motionToggle: Text,
  }),
  format: z.strictObject({
    period: z.strictObject({
      closed: template("{YYYY-MM}", 2),
      open: template("{YYYY-MM}", 1),
    }),
  }),
  bench: z.strictObject({ run: Text, toggle: Text, verdictRejected: Text }),
  botmivivi: z.strictObject({
    facts: z.strictObject({ window: Text, impact: Text }),
  }),
  quest: z.strictObject({ users: Text }),
  lemonswan: z.strictObject({ oneLiner: Text }),
  scania: z.strictObject({ oneLiner: Text }),
  video: z.strictObject({ name: Text, caption: Text }),
  avatar: z.strictObject({ caption: Text }),
  meta: z.strictObject({ title: Text.max(60), description: Text.max(160) }),
  label: z.strictObject({ languages: Text }),
  contact: z.strictObject({ locationLabel: Text }),
  notFound: z.strictObject({ heading: Text, link: Text }),
  og: z.strictObject({ alt: Text }),
  heading: z.strictObject({ experience: Text, contact: Text }),
  toast: z.strictObject({ questUnlocked: Text }),
  /**
   * ui.profile-labels and ui.small-labels, one field per label. "▸" of
   * "▸ PLAYER 1" is not stored: it renders as a Tabler filled caret-right
   * beside the words (plan → Rulings → Glyphs).
   */
  ui: z.strictObject({
    characterStats: Text,
    class: Text,
    base: Text,
    xp: Text,
    quests: Text,
    role: Text,
    when: Text,
    pressAToContinue: Text,
    progressSaved: Text,
    player: Text,
    guild: Text,
    passive: Text,
    companions: Text,
    achievementsUnlocked: Text,
    education: Text,
    team: Text,
    scale: Text,
    stack: Text,
    email: Text,
    telegram: Text,
    github: Text,
  }),
  /** hud.banner: the owner's banner lines, disclosed by width. */
  hud: z.strictObject({ xpKey: Text, level: Text, max: Text }),
});

export type Copy = Content<typeof Copy>;
