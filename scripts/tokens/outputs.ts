import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GeneratedFiles } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import { exportTokens } from "./export";

export const DESIGN_MD_PATH = join(REPO_ROOT, "DESIGN.md");

/**
 * contrib-engineering §4.1: the two exports of DESIGN.md. The thin mapping
 * layer (src/styles/theme.css) is hand-written from DESIGN.md, because the
 * export and the package's parser drop what it holds (Known Gaps 1).
 */
export const TOKEN_FILES = {
  css: "src/styles/tokens.generated.css",
  dtcg: "src/styles/tokens.generated.json",
} as const;

/** Generates the token files from a DESIGN.md source. */
export function generateTokenFiles(designMd: string): GeneratedFiles {
  return new Map([
    [TOKEN_FILES.css, exportTokens(designMd, "css-tailwind")],
    [TOKEN_FILES.dtcg, exportTokens(designMd, "dtcg")],
  ]);
}

/** Reads the DESIGN.md to generate from: `--design <path>`, or the repo's. */
export function designMdFromArgs(argv: readonly string[]): {
  readonly path: string;
  readonly source: string;
} {
  const flag = argv.indexOf("--design");
  const path = flag === -1 ? DESIGN_MD_PATH : argv[flag + 1];
  if (path === undefined) {
    throw new Error("--design needs a path to a DESIGN.md file");
  }
  return { path, source: readFileSync(path, "utf8") };
}
