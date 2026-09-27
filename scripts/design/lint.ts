/**
 * pnpm design:lint: lints DESIGN.md with @google/design.md (the same `lint`
 * the `design.md lint` CLI runs) and applies the warning policy in
 * policy.ts: any error fails, and so does any warning not in the allowlist.
 * An optional path argument lints another file (default: DESIGN.md).
 * Exit codes: 0 pass, 1 fail.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lint } from "@google/design.md/linter";
import { evaluateDesignLint, formatFinding } from "./policy";

const DESIGN_MD =
  process.argv[2] ?? fileURLToPath(new URL("../../DESIGN.md", import.meta.url));

const report = lint(readFileSync(DESIGN_MD, "utf8"));
const verdict = evaluateDesignLint(report.findings);

for (const finding of [...verdict.infos, ...verdict.allowedWarnings]) {
  console.log(`design:lint: ${formatFinding(finding)}`);
}
for (const finding of [...verdict.errors, ...verdict.warnings]) {
  console.error(`design:lint: ${formatFinding(finding)}`);
}

const summary = `${String(verdict.errors.length)} errors, ${String(verdict.warnings.length)} warnings (${String(verdict.allowedWarnings.length)} allowlisted), ${String(verdict.infos.length)} infos`;

if (verdict.passed) {
  console.log(`design:lint: ${DESIGN_MD} passes: ${summary}`);
} else {
  console.error(`design:lint: ${DESIGN_MD} fails: ${summary}`);
  process.exit(1);
}
