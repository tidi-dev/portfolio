/**
 * Source maps embed the original text of every module they cover. First-party
 * and bundler-runtime sources are scanned. Library sources under node_modules
 * are skipped: what ships from a library is its compiled code, which the scan
 * reads in the chunk itself, while the embedded original carries comments such
 * as author credits.
 */

export interface SourceMapTarget {
  readonly source: string;
  readonly text: string;
}

export interface SourceMapTargets {
  readonly scanned: readonly SourceMapTarget[];
  readonly skipped: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A regular map, or every map inside an indexed map's sections. */
function flatten(map: Record<string, unknown>): Record<string, unknown>[] {
  const { sections } = map;
  if (!Array.isArray(sections)) return [map];

  return sections.flatMap((section: unknown) =>
    isRecord(section) && isRecord(section.map) ? flatten(section.map) : [],
  );
}

/** Returns undefined when the file is not a parseable source map. */
export function sourceMapTargets(json: string): SourceMapTargets | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return undefined;
  }
  if (!isRecord(parsed)) return undefined;

  const scanned: SourceMapTarget[] = [];
  let skipped = 0;
  for (const map of flatten(parsed)) {
    const { sources, sourcesContent } = map;
    if (!Array.isArray(sources) || !Array.isArray(sourcesContent)) continue;

    sources.forEach((source: unknown, index) => {
      const text: unknown = sourcesContent[index];
      if (typeof text !== "string") return;
      const path =
        typeof source === "string" ? source : `(source ${String(index)})`;

      if (path.includes("/node_modules/")) {
        skipped += 1;
      } else {
        scanned.push({ source: path, text });
      }
    });
  }

  return { scanned, skipped };
}
