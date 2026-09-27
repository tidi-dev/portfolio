import { z } from "zod";
import type { Content } from "./define";
import { Text } from "./primitives";

/** Years as info.md writes them, e.g. "2017–2020". */
const YearRange = Text.regex(
  /^\d{4}–\d{4}$/,
  "Use YYYY–YYYY, as info.md writes it",
).refine(
  (years) => years.slice(0, 4) <= years.slice(5),
  "The years run backwards",
);

/** A subhead over an inline list (DESIGN.md → Sheets → Lists). */
const LabelledList = z.strictObject({
  label: Text,
  items: z.array(Text).nonempty(),
});

/** info.md → About (bio, sign-off, Leveling up) and Education & certifications. */
export const About = z.strictObject({
  bio: z.array(Text).nonempty(),
  /** The Contact h2. */
  signOff: Text,
  levelingUp: LabelledList,
  education: z.strictObject({
    label: Text,
    degrees: z
      .array(z.strictObject({ degree: Text, school: Text, years: YearRange }))
      .nonempty(),
    certifications: z
      .array(
        z.strictObject({
          subject: Text,
          credentials: z.array(Text).nonempty(),
        }),
      )
      .nonempty(),
  }),
  languages: LabelledList,
});

export type About = Content<typeof About>;
