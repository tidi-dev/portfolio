import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { REPO_ROOT } from "../lib/repo";

/** The pinned CLI's entry point (package.json → bin). */
const DESIGN_MD_CLI = join(
  REPO_ROOT,
  "node_modules",
  "@google",
  "design.md",
  "dist",
  "index.js",
);

export type ExportFormat = "css-tailwind" | "dtcg";

/**
 * Runs `design.md export --format <format> -- -` with the DESIGN.md source
 * on stdin and returns stdout unchanged, so the committed file is byte for
 * byte what `npx @google/design.md export --format <format> DESIGN.md`
 * prints (contrib-engineering §4.1). The CLI reads stdin for the file "-";
 * its argument parser needs `--` before it.
 */
export function exportTokens(designMd: string, format: ExportFormat): string {
  return execFileSync(
    process.execPath,
    [DESIGN_MD_CLI, "export", "--format", format, "--", "-"],
    { input: designMd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
}
