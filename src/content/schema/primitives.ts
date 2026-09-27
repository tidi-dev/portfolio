import { z } from "zod";
import type { Content } from "./define";

/**
 * Non-visible keys: ids, references and discriminators. The content trace
 * exempts every value under a schema registered here, and only those (ruling:
 * Phase 3 trace rules). Each helper below registers a fresh schema, so
 * marking one field never marks another.
 */
export const structural = z.registry<{ readonly description: string }>();

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Registers a schema as structural. */
function markStructural(schema: z.ZodType, description: string): void {
  structural.add(schema, { description });
}

/** A structural id or reference: lower-case words joined by hyphens. */
export function structuralId(description: string) {
  const schema = z
    .string()
    .regex(SLUG, "Use lower-case words joined by hyphens");
  markStructural(schema, description);
  return schema;
}

/** A structural enum: a fixed set of ids. */
export function structuralEnum<const V extends readonly [string, ...string[]]>(
  values: V,
  description: string,
) {
  const schema = z.enum(values);
  markStructural(schema, description);
  return schema;
}

/** A structural literal: a union discriminator. */
export function structuralLiteral<const V extends string>(
  value: V,
  description: string,
) {
  const schema = z.literal(value);
  markStructural(schema, description);
  return schema;
}

/**
 * Visible text, stored as `info.md` writes it: non-empty, trimmed, NFC, with
 * straight quotes and three dots. Curly quotes and `…` are set at render by
 * lib/format/typography.ts, so stored text stays comparable to `info.md`
 * (contrib-engineering §3.1).
 */
export const Text = z
  .string()
  .min(1, "Empty text: leave the optional field out instead")
  .refine(
    (text) => text.trim() === text,
    "Remove the leading or trailing space",
  )
  .refine(
    (text) => text.normalize("NFC") === text,
    "Use composed (NFC) characters",
  )
  .refine(
    (text) => !/[‘’“”…]/.test(text),
    "Store straight quotes and three dots: typography is applied at render",
  );

/** A month, as `info.md` writes dates: YYYY-MM. */
export const YearMonth = z
  .string()
  .regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, "Use YYYY-MM");

/** A period: from a month to a later month, or to "present". */
export const Period = z
  .strictObject({
    start: YearMonth,
    end: z.union([YearMonth, z.literal("present")]),
  })
  .refine((period) => period.end === "present" || period.start <= period.end, {
    message: "The period ends before it starts",
    path: ["end"],
  });

export type Period = Content<typeof Period>;

/** An https URL on a real domain. */
export const HttpsUrl = z.url({
  protocol: /^https$/,
  hostname: z.regexes.domain,
  error: "Use an https URL on a real domain",
});

/** A BCP 47 tag for the `lang` attribute. */
export const LanguageTag = z.enum(["en", "vi"]);

/** The owner's "Name — description" strings, split at the dash. */
export const Term = z.strictObject({ term: Text, description: Text });
