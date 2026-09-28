import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO_ROOT } from "../lib/repo";
import { ICON_GLYPHS } from "./config";
import type { FontOutput } from "./pipeline";

/** The texts whose characters the fonts must cover (contrib-engineering §1.3). */
function coveredTexts(): { readonly path: string; readonly text: string }[] {
  const contentDirectory = join(REPO_ROOT, "src", "content");
  const content = readdirSync(contentDirectory, {
    recursive: true,
    encoding: "utf8",
  })
    .filter((path) => path.endsWith(".ts"))
    .sort()
    .map((path) => join(contentDirectory, path));
  return [join(REPO_ROOT, "info.md"), ...content].map((path) => ({
    path: relative(REPO_ROOT, path),
    text: readFileSync(path, "utf8"),
  }));
}

export interface GlyphGap {
  readonly character: string;
  readonly codePoint: string;
  readonly file: string;
  /** The files it appears in. */
  readonly foundIn: readonly string[];
}

export interface CoverageReport {
  readonly characters: number;
  readonly files: readonly string[];
  readonly exempt: readonly string[];
  readonly gaps: readonly GlyphGap[];
}

function hex(code: number): string {
  return `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
}

/**
 * Every character in info.md and src/content/**, except line breaks and the
 * ruled icon glyphs, must be in every font file: any family may set any
 * string, so a missing glyph would fall back to another face.
 */
export function checkCoverage(fonts: readonly FontOutput[]): CoverageReport {
  const texts = coveredTexts();
  const where = new Map<number, Set<string>>();
  const exempt = new Set<string>();
  for (const { path, text } of texts) {
    for (const character of text) {
      if (character === "\n" || character === "\r") continue;
      if (character in ICON_GLYPHS) {
        exempt.add(character);
        continue;
      }
      const code = character.codePointAt(0) ?? 0;
      const files = where.get(code) ?? new Set<string>();
      files.add(path);
      where.set(code, files);
    }
  }
  const gaps: GlyphGap[] = [];
  for (const font of fonts) {
    const mapped = new Set(font.codePoints);
    for (const [code, files] of [...where].sort(([a], [b]) => a - b)) {
      if (!mapped.has(code)) {
        gaps.push({
          character: String.fromCodePoint(code),
          codePoint: hex(code),
          file: font.file,
          foundIn: [...files],
        });
      }
    }
  }
  return {
    characters: where.size,
    files: texts.map((text) => text.path),
    exempt: [...exempt].sort(),
    gaps,
  };
}
