import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

export type LiteralKind = "colour" | "duration" | "z-index";

export interface LiteralFinding {
  readonly path: string;
  readonly line: number;
  readonly kind: LiteralKind;
  readonly excerpt: string;
}

/**
 * contrib-engineering §4.3: hand-written CSS, TSX, TS and SVG hold no colour
 * literal (hex or a colour function), no duration literal and no numeric
 * z-index. Values come from the token files instead.
 */
const RULES: readonly { kind: LiteralKind; pattern: RegExp }[] = [
  {
    kind: "colour",
    pattern: /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
  },
  {
    kind: "colour",
    pattern: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/g,
  },
  { kind: "duration", pattern: /(?<![\w.-])\d*\.?\d+m?s\b/g },
  { kind: "z-index", pattern: /\b(?:z-index|zIndex)\s*:\s*["']?-?\d/g },
];

/** The token layer itself, where these values are defined and checked. */
export const TOKEN_FILES: readonly string[] = [
  "src/styles/tokens.generated.css",
  "src/styles/tokens.generated.json",
  "src/styles/theme.generated.css",
  "src/styles/theme.supplement.css",
  "src/styles/theme-reset.css",
];

const SCANNED_EXTENSIONS = /\.(?:css|tsx?|svg)$/;

export function findTokenLiterals(
  path: string,
  source: string,
): LiteralFinding[] {
  const findings: LiteralFinding[] = [];
  source.split("\n").forEach((text, index) => {
    for (const { kind, pattern } of RULES) {
      for (const match of text.matchAll(pattern)) {
        findings.push({ path, line: index + 1, kind, excerpt: match[0] });
      }
    }
  });
  return findings;
}

/** Hand-written source files under `src/`, relative to the repo root. */
export function handWrittenFiles(repoRoot: string): string[] {
  return readdirSync(join(repoRoot, "src"), {
    recursive: true,
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && SCANNED_EXTENSIONS.test(entry.name))
    .map((entry) => relative(repoRoot, join(entry.parentPath, entry.name)))
    .filter((path) => !TOKEN_FILES.includes(path))
    .sort();
}
