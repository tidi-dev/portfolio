import { monogramIcon } from "@/components/brand/monogram";

// Browsers still ask for /favicon.ico; it serves the same monogram as the
// declared icon, so the request never 404s (QA F7). Static at build time.
export const dynamic = "force-static";

export function GET() {
  return monogramIcon();
}
