/**
 * pnpm fonts: the pinned google/fonts sources → src/assets/fonts/
 * (contrib-engineering §1.3): the woff2 subsets, the OFL copies and the
 * manifest.
 */
import { readFileSync } from "node:fs";
import { writeGenerated } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { DESIGN_MD_PATH } from "../tokens/outputs";
import { generateFontFiles } from "./pipeline";

const { files } = await generateFontFiles(readFileSync(DESIGN_MD_PATH, "utf8"));
writeGenerated(REPO_ROOT, files);

for (const [path, content] of files) {
  console.log(`fonts: wrote ${path} (${String(content.length)} B)`);
}
