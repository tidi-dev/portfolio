import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/** Generated files, keyed by their path relative to the repo root. */
export type GeneratedFiles = ReadonlyMap<string, string | Uint8Array>;

export interface FreshnessReport {
  /** Committed files whose bytes differ from a fresh generation. */
  readonly stale: readonly string[];
  /** Files the generator produces that are not in the repo. */
  readonly missing: readonly string[];
  /** Where the fresh generation was kept for a diff; undefined when fresh. */
  readonly freshDirectory: string | undefined;
}

function toBytes(content: string | Uint8Array): Uint8Array {
  return typeof content === "string" ? Buffer.from(content, "utf8") : content;
}

/**
 * Writes a fresh generation to a temporary directory and byte-compares each
 * file with the committed one (contrib-engineering §4.4). The directory is
 * kept only when something differs, so it can be diffed.
 */
export function checkFreshness(
  repoRoot: string,
  generated: GeneratedFiles,
  label: string,
): FreshnessReport {
  const freshDirectory = mkdtempSync(join(tmpdir(), `${label}-check-`));
  const stale: string[] = [];
  const missing: string[] = [];

  for (const [path, content] of generated) {
    const fresh = toBytes(content);
    const freshPath = join(freshDirectory, path);
    mkdirSync(dirname(freshPath), { recursive: true });
    writeFileSync(freshPath, fresh);

    const committedPath = join(repoRoot, path);
    if (!existsSync(committedPath)) {
      missing.push(path);
    } else if (!Buffer.from(readFileSync(committedPath)).equals(fresh)) {
      stale.push(path);
    }
  }

  if (stale.length === 0 && missing.length === 0) {
    rmSync(freshDirectory, { recursive: true, force: true });
    return { stale, missing, freshDirectory: undefined };
  }
  return { stale, missing, freshDirectory };
}

/** Writes every generated file into the repo. */
export function writeGenerated(
  repoRoot: string,
  generated: GeneratedFiles,
): void {
  for (const [path, content] of generated) {
    const target = join(repoRoot, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, toBytes(content));
  }
}
