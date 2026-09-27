import { copy } from "@/content/copy";
import { Contact } from "@/content/schema/contact";
import { type ContentInput, defineContent } from "@/content/schema/define";

/**
 * info.md → Contact & links → Shown on the site: the email, Telegram and
 * GitHub the owner opted in to, and the location (O4). Nothing else.
 */
export const contact = defineContent("contact", Contact, {
  email: { label: "Email", address: "tidi.dev1321@gmail.com" },
  telegram: {
    label: "Telegram",
    handle: "@tidi1321",
    url: "https://t.me/tidi1321",
  },
  github: {
    label: "GitHub",
    text: "github.com/tidi-dev",
    url: "https://github.com/tidi-dev",
  },
  location: {
    label: copy.contact.locationLabel,
    text: "Ho Chi Minh City, Vietnam",
    locality: "Ho Chi Minh City",
    country: "Vietnam",
  },
} as const satisfies ContentInput<typeof Contact>);
