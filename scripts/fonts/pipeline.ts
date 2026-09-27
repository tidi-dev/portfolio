import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { lint } from "@google/design.md/linter";
import subsetFont from "subset-font";
import type { GeneratedFiles } from "../lib/freshness";
import { REPO_ROOT } from "../lib/repo";
import {
  DEFAULT_FEATURES,
  instanceFile,
  OUTPUT,
  SOURCE,
  UNICODE_RANGES,
} from "./config";
import {
  axes,
  codePoints,
  featureTags,
  fromRanges,
  readTables,
  toRanges,
  type Axis,
} from "./sfnt";

export interface Style {
  readonly wght: number;
  readonly wdth: number;
  /** The typography tokens that use this weight and width. */
  readonly roles: readonly string[];
}

export interface AxisRange {
  readonly min: number;
  readonly max: number;
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Each weight and width pair DESIGN.md's typography tokens use. */
export function typographyStyles(designMd: string): Style[] {
  const styles = new Map<
    string,
    { wght: number; wdth: number; roles: string[] }
  >();
  for (const [role, token] of lint(designMd).designSystem.typography) {
    const wdth = /^\s*'wdth'\s+(\d+(?:\.\d+)?)\s*$/.exec(
      token.fontVariation ?? "",
    )?.[1];
    if (token.fontWeight === undefined || wdth === undefined) {
      throw new Error(
        `typography.${role}: needs fontWeight and "'wdth' <number>"`,
      );
    }
    const key = `${String(token.fontWeight)}/${wdth}`;
    const style = styles.get(key) ?? {
      wght: token.fontWeight,
      wdth: Number(wdth),
      roles: [],
    };
    style.roles.push(role);
    styles.set(key, style);
  }
  return [...styles.values()].sort(
    (a, b) => b.wdth - a.wdth || b.wght - a.wght,
  );
}

/** The OpenType features the typography tokens switch on, e.g. tnum, lnum. */
export function requiredFeatures(designMd: string): string[] {
  const features = new Set<string>();
  for (const [role, token] of lint(designMd).designSystem.typography) {
    const parts = (token.fontFeature ?? "").split(",");
    for (const part of parts.filter((text) => text.trim() !== "")) {
      const tag = /^\s*'([a-z0-9]{4})'\s+1\s*$/.exec(part)?.[1];
      if (tag === undefined) {
        throw new Error(
          `typography.${role}: unreadable fontFeature "${part.trim()}"`,
        );
      }
      features.add(tag);
    }
  }
  return [...features].sort();
}

/** The smallest axis ranges that cover every style (DESIGN.md → Typography). */
export function axisRanges(styles: readonly Style[]): {
  wght: AxisRange;
  wdth: AxisRange;
} {
  const range = (values: number[]) => ({
    min: Math.min(...values),
    max: Math.max(...values),
  });
  return {
    wght: range(styles.map((style) => style.wght)),
    wdth: range(styles.map((style) => style.wdth)),
  };
}

/** Every code point in the configured unicode ranges, once, in order. */
export function requestedCodePoints(): number[] {
  const all = Object.values(UNICODE_RANGES).flatMap((ranges) =>
    fromRanges(ranges.split(",")),
  );
  return [...new Set(all)].sort((a, b) => a - b);
}

function readSource(): Buffer {
  const source = readFileSync(join(REPO_ROOT, SOURCE.file));
  if (source.length !== SOURCE.bytes || sha256(source) !== SOURCE.sha256) {
    throw new Error(
      `${SOURCE.file} is not the pinned file (${SOURCE.repository} ${SOURCE.commit}): expected ${String(SOURCE.bytes)} B, SHA-256 ${SOURCE.sha256}`,
    );
  }
  return source;
}

function subsetFontVersion(): string {
  const require = createRequire(import.meta.url);
  const manifest = JSON.parse(
    readFileSync(require.resolve("subset-font/package.json"), "utf8"),
  ) as {
    version: string;
  };
  return manifest.version;
}

function sameList(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function axisSummary(found: readonly Axis[]): Record<string, [number, number]> {
  return Object.fromEntries(
    found.map((axis) => [axis.tag, [axis.min, axis.max]]),
  );
}

/**
 * `pnpm fonts` (contrib-engineering §1.5): one variable woff2 with the latin
 * and vietnamese ranges plus ← → ↔ and axes cut to the ranges DESIGN.md
 * uses; a static TTF instance per weight and width pair; the OFL next to
 * each; and a manifest of what the files hold, read back from the files.
 */
export async function generateFontFiles(
  designMd: string,
): Promise<GeneratedFiles> {
  const source = readSource();
  const licence = readFileSync(join(REPO_ROOT, SOURCE.licence));
  const styles = typographyStyles(designMd);
  const ranges = axisRanges(styles);
  const features = requiredFeatures(designMd);
  const requested = requestedCodePoints();
  const text = String.fromCodePoint(...requested);

  const sourceCodePoints = new Set(codePoints(readTables(source)));
  const expected = requested.filter((code) => sourceCodePoints.has(code));

  const variationAxes = { wght: ranges.wght, wdth: ranges.wdth };
  const keepFeatures = [...new Set([...DEFAULT_FEATURES, ...features])].sort();
  const variable = await subsetFont(source, text, {
    targetFormat: "woff2",
    variationAxes,
    keepFeatures,
  });
  const variableTables = readTables(variable);
  const covered = codePoints(variableTables);
  const variableAxes = axes(variableTables);
  const gsub = featureTags(variableTables, "GSUB");
  const gpos = featureTags(variableTables, "GPOS");

  if (!sameList(covered, expected)) {
    throw new Error(
      "the woff2 does not map exactly the requested code points the source has",
    );
  }
  const foundAxes = axisSummary(variableAxes);
  const wantedAxes: Record<string, [number, number]> = {
    wght: [ranges.wght.min, ranges.wght.max],
    wdth: [ranges.wdth.min, ranges.wdth.max],
  };
  const axesMatch =
    Object.keys(foundAxes).length === Object.keys(wantedAxes).length &&
    Object.entries(wantedAxes).every(([tag, [min, max]]) => {
      const found = foundAxes[tag];
      return found !== undefined && found[0] === min && found[1] === max;
    });
  if (!axesMatch) {
    throw new Error(
      `the woff2's axes ${JSON.stringify(foundAxes)} are not ${JSON.stringify(wantedAxes)}`,
    );
  }
  // HarfBuzz prunes a kept feature whose lookups touch no glyph in the
  // subset. A required feature may be pruned only if the font has it (a
  // subset that keeps every feature still lists it): it then acts only on
  // glyphs this subset leaves out, so it can't change how the text renders.
  const pruned = features.filter(
    (feature) => ![...gsub, ...gpos].includes(feature),
  );
  if (pruned.length > 0) {
    const everything = readTables(
      await subsetFont(source, text, { targetFormat: "sfnt", variationAxes }),
    );
    const available = [
      ...featureTags(everything, "GSUB"),
      ...featureTags(everything, "GPOS"),
    ];
    const absent = pruned.filter((feature) => !available.includes(feature));
    if (absent.length > 0) {
      throw new Error(
        `Archivo has no ${absent.join(", ")} feature, which DESIGN.md's typography switches on`,
      );
    }
  }

  const files = new Map<string, Uint8Array | string>();
  files.set(OUTPUT.variable, variable);

  const instances = [];
  for (const style of styles) {
    const ttf = await subsetFont(source, text, {
      targetFormat: "sfnt",
      variationAxes: { wght: style.wght, wdth: style.wdth },
      keepFeatures,
    });
    const tables = readTables(ttf);
    if (axes(tables).length !== 0)
      throw new Error(
        `instance ${String(style.wght)}/${String(style.wdth)} is not static`,
      );
    if (!sameList(codePoints(tables), covered)) {
      throw new Error(
        `instance ${String(style.wght)}/${String(style.wdth)} maps other code points than the woff2`,
      );
    }
    const file = instanceFile(style.wght, style.wdth);
    files.set(file, ttf);
    instances.push({
      file,
      wght: style.wght,
      wdth: style.wdth,
      roles: style.roles,
      bytes: ttf.length,
      sha256: sha256(ttf),
    });
  }

  for (const path of OUTPUT.licences) files.set(path, licence);

  const manifest = {
    font: "Archivo",
    generator: `pnpm fonts (subset-font ${subsetFontVersion()}, HarfBuzz)`,
    source: {
      repository: SOURCE.repository,
      commit: SOURCE.commit,
      path: SOURCE.path,
      file: SOURCE.file,
      bytes: SOURCE.bytes,
      sha256: SOURCE.sha256,
      licence: SOURCE.spdx,
    },
    unicodeRanges: UNICODE_RANGES,
    variable: {
      file: OUTPUT.variable,
      bytes: variable.length,
      sha256: sha256(variable),
      axes: foundAxes,
      features: {
        kept: keepFeatures,
        GSUB: gsub,
        GPOS: gpos,
        prunedNoEffect: pruned,
      },
    },
    instances,
    codePoints: { count: covered.length, ranges: toRanges(covered) },
  };
  files.set(OUTPUT.manifest, `${JSON.stringify(manifest, null, 2)}\n`);

  return files;
}
