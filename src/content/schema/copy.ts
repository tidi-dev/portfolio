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
 * string can't render before the owner approves it. The drawing rows live in
 * drawings.ts; approvals of a depiction, a pattern or a scope hold no string.
 */
export const Copy = z.strictObject({
  hero: z.strictObject({ cta: Text, sentence: Text }),
  resume: z.strictObject({
    link: Text,
    contactLink: template("{size}", 1),
    summary: Text,
    file: Text.regex(/^[a-z0-9-]+\.pdf$/, "Use a lower-case .pdf file name"),
    title: Text,
  }),
  a11y: z.strictObject({
    themeToggle: Text,
    menuButton: Text,
    nav: Text,
    skipLink: Text,
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
});

export type Copy = Content<typeof Copy>;
