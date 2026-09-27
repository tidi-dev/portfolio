/**
 * pnpm fonts:check: regenerates the font files from the pinned source into
 * a temporary directory and byte-compares them with the committed ones
 * (contrib-engineering §1.5). Exit codes: 0 fresh, 1 stale or missing.
 */
import { readFileSync } from "node:fs";
import { checkFreshness } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { DESIGN_MD_PATH } from "../tokens/outputs";
import { generateFontFiles } from "./pipeline";

const generated = await generateFontFiles(readFileSync(DESIGN_MD_PATH, "utf8"));
const report = checkFreshness(REPO_ROOT, generated, "fonts");

if (report.stale.length === 0 && report.missing.length === 0) {
  console.log(
    `fonts:check: the ${String(generated.size)} font files match a fresh generation`,
  );
} else {
  for (const path of report.stale) console.error(`fonts:check: stale ${path}`);
  for (const path of report.missing)
    console.error(`fonts:check: missing ${path}`);
  console.error(
    `fonts:check: fresh files are in ${String(report.freshDirectory)}`,
  );
  console.error("fonts:check: the font files are out of date: run pnpm fonts");
  process.exit(1);
}
