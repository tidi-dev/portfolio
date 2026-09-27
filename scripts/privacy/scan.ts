/**
 * pnpm privacy:scan: scans src/, public/ and the whole build output (.next/,
 * client chunks included) for phone-shaped numbers, tel: links, emails other
 * than the opted-in address, and banner-only strings. Run after `pnpm build`.
 * Exit codes: 0 clean, 1 findings, 2 no build output to scan.
 */
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OPTED_IN_EMAIL } from "./rules";
import { scanRoots } from "./walk";

const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const BUILD_OUTPUT = join(REPO_ROOT, ".next");

if (!existsSync(BUILD_OUTPUT)) {
  console.error(
    "privacy scan: .next/ is missing. Run `pnpm build` first; the build output must be scanned.",
  );
  process.exit(2);
}

const result = scanRoots(
  [join(REPO_ROOT, "src"), join(REPO_ROOT, "public"), BUILD_OUTPUT],
  { exclude: [join(BUILD_OUTPUT, "cache")] },
);

for (const root of result.roots) {
  const name = `${basename(root.root)}/`;
  console.log(
    root.present
      ? `privacy scan: ${name} ${String(root.filesScanned)} text files, ${String(root.binarySkipped)} binary skipped; ${String(root.sourceMaps)} source maps: ${String(root.mapSourcesScanned)} first-party sources scanned, ${String(root.mapSourcesSkipped)} node_modules sources skipped (their compiled code is scanned)`
      : `privacy scan: ${name} absent`,
  );
}
console.log(
  "privacy scan: .next/cache excluded (Turbopack's build cache, not output)",
);

if (result.findings.length === 0) {
  console.log(
    `privacy scan: 0 findings (phone-shaped numbers, tel: links, emails other than ${OPTED_IN_EMAIL}, banner-only strings)`,
  );
} else {
  for (const finding of result.findings) {
    console.error(
      `${finding.location}:${String(finding.line)}  ${finding.rule}  ${finding.excerpt}`,
    );
  }
  console.error(`privacy scan: ${String(result.findings.length)} finding(s)`);
  process.exit(1);
}
