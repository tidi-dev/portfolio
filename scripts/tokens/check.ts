/**
 * pnpm tokens:check: regenerates the three token files into a temporary
 * directory and byte-compares them with the committed ones (contrib-
 * engineering §4.4; contrib-verification G11). `--design <path>` checks the
 * committed files against another DESIGN.md.
 * Exit codes: 0 fresh, 1 stale or missing ("run pnpm tokens").
 */
import { checkFreshness } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { designMdFromArgs, generateTokenFiles } from "./outputs";

const design = designMdFromArgs(process.argv.slice(2));
const report = checkFreshness(
  REPO_ROOT,
  generateTokenFiles(design.source),
  "tokens",
);

if (report.stale.length === 0 && report.missing.length === 0) {
  console.log(
    `tokens:check: the 3 token files match a fresh generation from ${design.path}`,
  );
} else {
  for (const path of report.stale) {
    console.error(`tokens:check: stale ${path}`);
  }
  for (const path of report.missing) {
    console.error(`tokens:check: missing ${path}`);
  }
  console.error(
    `tokens:check: fresh files are in ${String(report.freshDirectory)}`,
  );
  console.error(
    "tokens:check: the generated tokens are out of date: run pnpm tokens",
  );
  process.exit(1);
}
