import { readFileSync } from "node:fs";
import { z } from "zod";

/**
 * contrib-verification §5.4: a string that may render without being in
 * info.md. Each entry names its source (an info.md section, an Approved copy
 * key, a DESIGN.md label, or "generic UI label, not about the owner") and the
 * date it was added. QA reviews every new entry.
 */
export const AllowlistEntry = z.strictObject({
  text: z.string().trim().min(1),
  source: z.string().trim().min(1),
  added: z.iso.date(),
});

export type AllowlistEntry = z.infer<typeof AllowlistEntry>;

const ALLOWLIST_FILE = new URL("./allowlist.json", import.meta.url);

export function loadAllowlist(): AllowlistEntry[] {
  const raw = JSON.parse(readFileSync(ALLOWLIST_FILE, "utf8")) as unknown;
  return z.array(AllowlistEntry).parse(raw);
}
