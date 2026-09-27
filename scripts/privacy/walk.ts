import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { findPrivacyViolations, maskMatch, type RuleId } from "./rules";
import { sourceMapTargets } from "./source-maps";

// No text layer to scan. The résumé PDF's text is checked by its own test
// (Phase 10); images and fonts hold no strings.
const BINARY_EXTENSIONS = new Set([
  ".avif",
  ".br",
  ".eot",
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mp4",
  ".otf",
  ".pdf",
  ".png",
  ".ttf",
  ".wasm",
  ".webm",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
]);

export interface ScanFinding {
  /** The file, and for a source map the embedded source, e.g. "a.js.map → src/x.ts". */
  readonly location: string;
  readonly line: number;
  readonly rule: RuleId;
  readonly excerpt: string;
}

export interface RootSummary {
  readonly root: string;
  readonly present: boolean;
  readonly filesScanned: number;
  readonly binarySkipped: number;
  readonly sourceMaps: number;
  readonly mapSourcesScanned: number;
  readonly mapSourcesSkipped: number;
}

export interface ScanResult {
  readonly roots: readonly RootSummary[];
  readonly filesScanned: number;
  readonly findings: readonly ScanFinding[];
}

function isBinary(file: string, content: Buffer): boolean {
  return (
    BINARY_EXTENSIONS.has(extname(file).toLowerCase()) ||
    content.subarray(0, 8000).includes(0)
  );
}

function lineOf(text: string, index: number): number {
  let line = 1;
  for (let position = 0; position < index; position += 1) {
    if (text.charCodeAt(position) === 10) line += 1;
  }
  return line;
}

function scanText(
  location: string,
  text: string,
  findings: ScanFinding[],
): void {
  for (const finding of findPrivacyViolations(text)) {
    findings.push({
      location,
      line: lineOf(text, finding.index),
      rule: finding.rule,
      excerpt: maskMatch(finding.rule, finding.match),
    });
  }
}

/**
 * Scans every file under each root. `exclude` lists directories that are not
 * shipped output (Next's build cache).
 */
export function scanRoots(
  roots: readonly string[],
  { exclude = [] }: { exclude?: readonly string[] } = {},
): ScanResult {
  const summaries: RootSummary[] = [];
  const findings: ScanFinding[] = [];
  const excluded = (file: string) =>
    exclude.some((directory) => file.startsWith(`${directory}${sep}`));

  for (const root of roots) {
    const summary = {
      root,
      present: existsSync(root),
      filesScanned: 0,
      binarySkipped: 0,
      sourceMaps: 0,
      mapSourcesScanned: 0,
      mapSourcesSkipped: 0,
    };
    summaries.push(summary);
    if (!summary.present) continue;

    const files = readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name))
      .filter((file) => !excluded(file))
      .sort();

    for (const file of files) {
      const content = readFileSync(file);
      if (isBinary(file, content)) {
        summary.binarySkipped += 1;
        continue;
      }

      summary.filesScanned += 1;
      const location = relative(join(root, ".."), file);
      const text = content.toString("utf8");
      const map = file.endsWith(".map") ? sourceMapTargets(text) : undefined;

      if (map === undefined) {
        scanText(location, text, findings);
        continue;
      }
      summary.sourceMaps += 1;
      summary.mapSourcesScanned += map.scanned.length;
      summary.mapSourcesSkipped += map.skipped;
      for (const target of map.scanned) {
        scanText(`${location} → ${target.source}`, target.text, findings);
      }
    }
  }

  return {
    roots: summaries,
    filesScanned: summaries.reduce(
      (total, root) => total + root.filesScanned,
      0,
    ),
    findings,
  };
}
