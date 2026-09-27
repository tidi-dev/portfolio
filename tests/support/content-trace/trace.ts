import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { normalise } from "./normalise";

export interface Leaf {
  readonly path: string;
  readonly value: string | number;
}

/** A string traces if it is a substring of one corpus line, or an allowlist entry. */
export function tracesString(
  text: string,
  corpus: readonly string[],
  allowlist: readonly string[],
): boolean {
  const needle = normalise(text);
  if (needle === "") return false;

  return (
    corpus.some((line) => line.includes(needle)) ||
    allowlist.some((entry) => normalise(entry) === needle)
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** A number traces if it appears as a whole number token (C2). */
export function tracesNumber(
  value: number,
  corpus: readonly string[],
): boolean {
  const token = new RegExp(`(?<![\\d.])${escapeRegExp(String(value))}(?!\\d)`);
  return corpus.some((line) => token.test(line));
}

export function findUntraced(
  leaves: readonly Leaf[],
  corpus: readonly string[],
  allowlist: readonly string[],
): Leaf[] {
  return leaves.filter((leaf) =>
    typeof leaf.value === "number"
      ? !tracesNumber(leaf.value, corpus)
      : !tracesString(leaf.value, corpus, allowlist),
  );
}

function collectLeaves(value: unknown, path: string, leaves: Leaf[]): void {
  if (typeof value === "string" || typeof value === "number") {
    leaves.push({ path, value });
  } else if (Array.isArray(value)) {
    value.forEach((item: unknown, index) => {
      collectLeaves(item, `${path}[${String(index)}]`, leaves);
    });
  } else if (typeof value === "object" && value !== null) {
    for (const [key, item] of Object.entries(value)) {
      collectLeaves(item, `${path}.${key}`, leaves);
    }
  }
}

/**
 * Imports every module in the content directory (schemas excluded) and
 * returns the string and number leaves of its exports. Returns nothing while
 * the directory does not exist (Phase 1; content arrives in Phase 3).
 */
export async function collectContentLeaves(
  directory: string,
): Promise<{ modules: number; leaves: Leaf[] }> {
  if (!existsSync(directory)) return { modules: 0, leaves: [] };

  const files = readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => !relative(directory, file).split(sep).includes("schema"))
    .sort();

  const leaves: Leaf[] = [];
  for (const file of files) {
    const exports = (await import(pathToFileURL(file).href)) as Record<
      string,
      unknown
    >;
    for (const [name, value] of Object.entries(exports)) {
      collectLeaves(value, `${relative(directory, file)}:${name}`, leaves);
    }
  }

  return { modules: files.length, leaves };
}
