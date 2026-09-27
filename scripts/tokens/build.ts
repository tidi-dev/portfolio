/**
 * pnpm tokens: DESIGN.md → src/styles/ (contrib-engineering §4.1).
 *   1. design.md export --format css-tailwind → tokens.generated.css
 *   2. design.md export --format dtcg         → tokens.generated.json
 *   3. theme.ts (the package's parser)        → theme.generated.css
 * `--design <path>` generates from another DESIGN.md.
 */
import { writeGenerated } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { designMdFromArgs, generateTokenFiles } from "./outputs";

const design = designMdFromArgs(process.argv.slice(2));
const generated = generateTokenFiles(design.source);
writeGenerated(REPO_ROOT, generated);

for (const path of generated.keys()) {
  console.log(`tokens: wrote ${path}`);
}
console.log(`tokens: ${String(generated.size)} files from ${design.path}`);
