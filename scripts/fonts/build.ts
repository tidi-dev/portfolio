/**
 * pnpm fonts: the pinned Archivo source → src/assets/ (contrib-engineering
 * §1.5): the variable woff2, the static TTF instances, the OFL copies and
 * the manifest. Sizes are printed; the woff2 aims for ≤ 100 KB.
 */
import { readFileSync } from "node:fs";
import { writeGenerated } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { DESIGN_MD_PATH } from "../tokens/outputs";
import { generateFontFiles } from "./pipeline";

const generated = await generateFontFiles(readFileSync(DESIGN_MD_PATH, "utf8"));
writeGenerated(REPO_ROOT, generated);

for (const [path, content] of generated) {
  console.log(`fonts: wrote ${path} (${String(content.length)} B)`);
}
