/**
 * pnpm fonts:check (contrib-engineering §1.3):
 *   1. regenerates the font files from the pinned sources into a temporary
 *      directory and byte-compares them with the committed ones
 *   2. checks that every character in info.md and src/content/ is in every
 *      font file, except the glyphs the plan rules are icons
 * Exit codes: 0 pass, 1 stale, missing or a glyph gap.
 */
import { readFileSync } from "node:fs";
import { checkFreshness } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { DESIGN_MD_PATH } from "../tokens/outputs";
import { ICON_GLYPHS } from "./config";
import { checkCoverage } from "./coverage";
import { generateFontFiles } from "./pipeline";

const { files, fonts } = await generateFontFiles(
  readFileSync(DESIGN_MD_PATH, "utf8"),
);
const report = checkFreshness(REPO_ROOT, files, "fonts");
let failed = false;

if (report.stale.length === 0 && report.missing.length === 0) {
  console.log(
    `fonts:check: the ${String(files.size)} font files match a fresh generation`,
  );
} else {
  for (const path of report.stale) console.error(`fonts:check: stale ${path}`);
  for (const path of report.missing)
    console.error(`fonts:check: missing ${path}`);
  console.error(
    `fonts:check: fresh files are in ${String(report.freshDirectory)}`,
  );
  console.error("fonts:check: the font files are out of date: run pnpm fonts");
  failed = true;
}

const coverage = checkCoverage(fonts);
for (const glyph of coverage.exempt) {
  console.log(
    `fonts:check: "${glyph}" is not a font glyph: it renders as the Tabler ${ICON_GLYPHS[glyph] ?? "icon"} (plan → Rulings → Glyphs)`,
  );
}
if (coverage.gaps.length === 0) {
  console.log(
    `fonts:check: all ${String(coverage.characters)} characters of ${String(coverage.files.length)} files (info.md, src/content/) are in all ${String(fonts.length)} font files`,
  );
} else {
  for (const gap of coverage.gaps) {
    console.error(
      `fonts:check: "${gap.character}" ${gap.codePoint} is missing from ${gap.file} (used in ${gap.foundIn.join(", ")})`,
    );
  }
  failed = true;
}

if (failed) process.exit(1);
