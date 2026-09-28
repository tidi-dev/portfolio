import { type ContentInput, defineContent } from "@/content/schema/define";
import { Identity } from "@/content/schema/identity";

/**
 * info.md → Identity. The positioning line is the approved hero sentence
 * (copy.ts); the avatar's alt text is the approved avatar caption (copy.ts);
 * the location lives in contact.ts only (O4).
 */
export const identity = defineContent("identity", Identity, {
  brand: "TiDi",
  name: "Dai Ho Trong",
  nativeName: { text: "Hồ Trọng Đại", lang: "vi" },
  englishName: "Daniel",
  role: "Full-stack Developer",
  tagline: "still learning, always solving.",
} as const satisfies ContentInput<typeof Identity>);
