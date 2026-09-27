import { z } from "zod";
import type { Content } from "./define";
import { HttpsUrl, Text } from "./primitives";

/**
 * info.md → Contact & links: exactly the channels the owner opted in to
 * (email, Telegram, GitHub) and the location (O4). The object is strict and
 * has no field for a phone number, a second email or a reference, so none
 * can be added without changing this schema (privacy is structural).
 */
export const Contact = z.strictObject({
  email: z.strictObject({ label: Text, address: z.email() }),
  telegram: z
    .strictObject({
      label: Text,
      handle: z.string().regex(/^@\w{5,32}$/, "Use the @handle"),
      url: HttpsUrl,
    })
    .refine(
      (telegram) => telegram.url === `https://t.me/${telegram.handle.slice(1)}`,
      {
        message: "The URL must be the handle's t.me link",
        path: ["url"],
      },
    ),
  github: z
    .strictObject({ label: Text, text: Text, url: HttpsUrl })
    .refine((github) => github.url === `https://${github.text}`, {
      message: "The text must be the URL without https://",
      path: ["text"],
    }),
  /** Shown in Contact only; the Person data may use the locality and country. */
  location: z
    .strictObject({ label: Text, text: Text, locality: Text, country: Text })
    .refine(
      (location) =>
        location.text === `${location.locality}, ${location.country}`,
      {
        message: 'The text must read "<locality>, <country>"',
        path: ["text"],
      },
    ),
});

export type Contact = Content<typeof Contact>;
