import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { schemaOf } from "@/content/schema/define";
import { normalise } from "./normalise";
import { type ContentLeaf, walkLeaves } from "./structural";

export interface Leaf {
  readonly path: string;
  readonly value: string | number;
  /** A non-visible key marked in the schema; exempt from the trace. */
  readonly structural?: boolean;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const WORD_CHARACTER = /[\p{L}\p{N}]/u;
const NOT_AFTER_WORD = "(?<![\\p{L}\\p{N}])";
const NOT_BEFORE_WORD = "(?![\\p{L}\\p{N}])";

/**
 * The needle as a pattern that never starts or ends inside a word, so a
 * short token ("en", "vi") can't trace through an unrelated longer word
 * ("English", "services"). Edges that are punctuation match as written.
 */
function wholeWords(needle: string): RegExp {
  const characters = Array.from(needle);
  const start = WORD_CHARACTER.test(characters[0] ?? "") ? NOT_AFTER_WORD : "";
  const end = WORD_CHARACTER.test(characters.at(-1) ?? "")
    ? NOT_BEFORE_WORD
    : "";
  return new RegExp(`${start}${escapeRegExp(needle)}${end}`, "u");
}

/**
 * A string traces if it appears, on whole-word boundaries, inside one corpus
 * line, or equals an allowlist entry.
 */
export function tracesString(
  text: string,
  corpus: readonly string[],
  allowlist: readonly string[],
): boolean {
  const needle = normalise(text);
  if (needle === "") return false;

  const pattern = wholeWords(needle);
  return (
    corpus.some((line) => pattern.test(line)) ||
    allowlist.some((entry) => normalise(entry) === needle)
  );
}

/** A number traces if it appears as a whole number token (C2). */
export function tracesNumber(
  value: number,
  corpus: readonly string[],
): boolean {
  const token = new RegExp(`(?<![\\d.])${escapeRegExp(String(value))}(?!\\d)`);
  return corpus.some((line) => token.test(line));
}

/** The visible leaves that trace neither to the corpus nor to the allowlist. */
export function findUntraced(
  leaves: readonly Leaf[],
  corpus: readonly string[],
  allowlist: readonly string[],
): Leaf[] {
  return leaves.filter(
    (leaf) =>
      leaf.structural !== true &&
      (typeof leaf.value === "number"
        ? !tracesNumber(leaf.value, corpus)
        : !tracesString(leaf.value, corpus, allowlist)),
  );
}

export interface ContentScan {
  /** Content modules imported (files outside `schema/`). */
  readonly modules: number;
  /** Their runtime exports. */
  readonly exports: number;
  /** Every string and number leaf, marked structural or visible by its schema. */
  readonly leaves: ContentLeaf[];
  /** Exports that were not created through `defineContent`, so no schema vouches for them. */
  readonly unregistered: string[];
}

/**
 * Imports every module in the content directory (schemas excluded) and walks
 * each export with the schema `defineContent` registered for it. Returns
 * nothing while the directory does not exist; the trace test asserts that it
 * does (QA minor M5).
 */
export async function collectContentLeaves(
  directory: string,
): Promise<ContentScan> {
  if (!existsSync(directory)) {
    return { modules: 0, exports: 0, leaves: [], unregistered: [] };
  }

  const files = readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => !relative(directory, file).split(sep).includes("schema"))
    .sort();

  let exportCount = 0;
  const leaves: ContentLeaf[] = [];
  const unregistered: string[] = [];

  for (const file of files) {
    const moduleExports = (await import(pathToFileURL(file).href)) as Record<
      string,
      unknown
    >;
    for (const [name, value] of Object.entries(moduleExports)) {
      exportCount += 1;
      const path = `${relative(directory, file)}:${name}`;
      const schema = schemaOf(value);
      if (schema === undefined) {
        unregistered.push(path);
      } else {
        leaves.push(...walkLeaves(schema, value, path));
      }
    }
  }

  return { modules: files.length, exports: exportCount, leaves, unregistered };
}
