import { readdirSync } from "node:fs";
import { join } from "node:path";

export interface SourceFile {
  readonly path: string;
  readonly source: string;
}

const SOURCE_EXTENSIONS = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;

// The directive must be the first statement; only comments and whitespace may
// come before it.
const LEADING_DIRECTIVE =
  /^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*(["'])use client\1/;
const ANY_DIRECTIVE = /(["'])use client\1/;

/**
 * contrib-engineering §5.1: a client leaf is a `*.client.tsx` file that starts
 * with 'use client', and 'use client' appears nowhere else.
 */
export function clientBoundaryViolations(
  files: readonly SourceFile[],
): string[] {
  const violations: string[] = [];

  for (const { path, source } of files) {
    const isClientLeaf = path.endsWith(".client.tsx");

    if (isClientLeaf && !LEADING_DIRECTIVE.test(source)) {
      violations.push(`${path}: a client leaf must start with 'use client'`);
    }
    if (!isClientLeaf && ANY_DIRECTIVE.test(source)) {
      violations.push(
        `${path}: 'use client' is allowed only in *.client.tsx files`,
      );
    }
  }

  return violations;
}

/** Every JS or TS source file under `directory`, recursively. */
export function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}
