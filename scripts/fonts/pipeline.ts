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
  DEFAULT_WIDTH,
  FAMILIES,
  FAMILY_NAME_IDS,
  type FontFamily,
  KNOWN_FEATURE_GAPS,
  LICENCE_NAME_IDS,
  licenceFile,
  MANIFEST,
  type PinnedFile,
  POSTSCRIPT_NAME_IDS,
  type ReservedNameRename,
  type SourceOrigin,
  staticFile,
  UNICODE_RANGES,
  variableFile,
} from "./config";
import {
  axes,
  codePoints,
  featureTags,
  fromRanges,
  nameRecords,
  nameString,
  readTables,
  toRanges,
  withRenamedRecords,
  type FontTables,
} from "./sfnt";

interface Range {
  readonly min: number;
  readonly max: number;
}

/** What DESIGN.md's typography tokens ask of one family. */
export interface FamilyUse {
  readonly weights: readonly number[];
  readonly widths: readonly number[];
  readonly features: readonly string[];
  readonly roles: readonly string[];
}

/** One generated font file, as the manifest and the coverage check read it. */
export interface FontOutput {
  readonly file: string;
  readonly family: string;
  readonly bytes: Uint8Array;
  readonly codePoints: readonly number[];
}

export interface FontGeneration {
  readonly files: GeneratedFiles;
  readonly fonts: readonly FontOutput[];
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function describe(origin: SourceOrigin): string {
  return origin.kind === "google-fonts"
    ? `${origin.url} ${origin.commit}`
    : `${origin.tarball} (sha1 ${origin.shasum})`;
}

function readPinned(pinned: PinnedFile, origin: SourceOrigin): Buffer {
  const bytes = readFileSync(join(REPO_ROOT, pinned.file));
  if (bytes.length !== pinned.bytes || sha256(bytes) !== pinned.sha256) {
    throw new Error(
      `${pinned.file} is not the pinned file (${describe(origin)} ${pinned.path}): expected ${String(pinned.bytes)} B, SHA-256 ${pinned.sha256}`,
    );
  }
  return bytes;
}

/** DESIGN.md's typography tokens, grouped by family. */
export function familyUses(designMd: string): ReadonlyMap<string, FamilyUse> {
  const uses = new Map<
    string,
    {
      weights: Set<number>;
      widths: Set<number>;
      features: Set<string>;
      roles: string[];
    }
  >();
  for (const [role, token] of lint(designMd).designSystem.typography) {
    if (token.fontFamily === undefined || token.fontWeight === undefined) {
      throw new Error(`typography.${role}: needs fontFamily and fontWeight`);
    }
    const use = uses.get(token.fontFamily) ?? {
      weights: new Set<number>(),
      widths: new Set<number>(),
      features: new Set<string>(),
      roles: [],
    };
    use.weights.add(token.fontWeight);
    const variation = token.fontVariation;
    if (variation === undefined) {
      use.widths.add(DEFAULT_WIDTH);
    } else {
      const wdth = /^\s*'wdth'\s+(\d+(?:\.\d+)?)\s*$/.exec(variation)?.[1];
      if (wdth === undefined) {
        throw new Error(
          `typography.${role}: fontVariation must be "'wdth' <number>", got "${variation}"`,
        );
      }
      use.widths.add(Number(wdth));
    }
    for (const part of (token.fontFeature ?? "").split(",")) {
      if (part.trim() === "") continue;
      const tag = /^\s*'([a-z0-9]{4})'\s+1\s*$/.exec(part)?.[1];
      if (tag === undefined) {
        throw new Error(
          `typography.${role}: unreadable fontFeature "${part.trim()}"`,
        );
      }
      use.features.add(tag);
    }
    use.roles.push(role);
    uses.set(token.fontFamily, use);
  }
  const sorted = (values: Iterable<number>) =>
    [...values].sort((a, b) => a - b);
  return new Map(
    [...uses].map(([family, use]) => [
      family,
      {
        weights: sorted(use.weights),
        widths: sorted(use.widths),
        features: [...use.features].sort(),
        roles: use.roles,
      },
    ]),
  );
}

/**
 * Every code point in the configured unicode ranges, plus a family's own
 * extra ranges, once, in order.
 */
export function requestedCodePoints(
  extraRanges: Readonly<Record<string, string>> = {},
): number[] {
  const all = [
    ...Object.values(UNICODE_RANGES),
    ...Object.values(extraRanges),
  ].flatMap((ranges) => fromRanges(ranges.split(",")));
  return [...new Set(all)].sort((a, b) => a - b);
}

function range(values: readonly number[]): Range {
  return { min: Math.min(...values), max: Math.max(...values) };
}

function sameList(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function subsetFontVersion(): string {
  const require = createRequire(import.meta.url);
  const manifest = JSON.parse(
    readFileSync(require.resolve("subset-font/package.json"), "utf8"),
  ) as { version: string };
  return manifest.version;
}

/** Checks a subset keeps the licence records and the requested code points. */
function verifySubset(
  label: string,
  subset: FontTables,
  source: FontTables,
  requested: readonly number[],
): number[] {
  for (const nameId of LICENCE_NAME_IDS) {
    if (nameString(subset, nameId) !== nameString(source, nameId)) {
      throw new Error(
        `${label}: name ID ${String(nameId)} is not the source's (the OFL must travel with the font)`,
      );
    }
  }
  const sourceCodePoints = new Set(codePoints(source));
  const expected = requested.filter((code) => sourceCodePoints.has(code));
  const covered = codePoints(subset);
  if (!sameList(covered, expected)) {
    throw new Error(
      `${label}: does not map exactly the requested code points the source has`,
    );
  }
  return covered;
}

/**
 * The source with its family-name records renamed (OFL Reserved Font Name;
 * config.ts → ReservedNameRename). The copyright and licence records keep
 * naming the original.
 */
function renamed(source: Buffer, rename: ReservedNameRename): Buffer {
  const familyIds: readonly number[] = FAMILY_NAME_IDS;
  const postscriptIds: readonly number[] = POSTSCRIPT_NAME_IDS;
  return withRenamedRecords(source, (record) => {
    if (!familyIds.includes(record.nameId)) return record.text;
    return postscriptIds.includes(record.nameId)
      ? record.text.replaceAll(rename.from.postscript, rename.to.postscript)
      : record.text.replaceAll(rename.from.family, rename.to.family);
  });
}

/** The served-name fields a renamed family adds to its manifest entry. */
function servedAs(config: FontFamily): object {
  return config.rename === undefined
    ? {}
    : {
        servedAs: config.rename.to.family,
        reservedFontName: config.rename.reserved,
      };
}

/** Fails if any record but the copyright and licence ones holds the reserved name. */
function verifyRenamed(
  label: string,
  subset: FontTables,
  rename: ReservedNameRename,
): void {
  const licenceIds: readonly number[] = LICENCE_NAME_IDS;
  const reserved = rename.reserved.toLowerCase();
  const leaks = nameRecords(subset).filter(
    (record) =>
      !licenceIds.includes(record.nameId) &&
      record.text.toLowerCase().includes(reserved),
  );
  if (leaks.length > 0) {
    throw new Error(
      `${label}: name IDs ${leaks.map((record) => String(record.nameId)).join(", ")} still use the Reserved Font Name "${rename.reserved}"`,
    );
  }
  if (nameString(subset, 1)?.startsWith(rename.to.family) !== true) {
    throw new Error(`${label}: the family name is not "${rename.to.family}"`);
  }
}

/**
 * The features DESIGN.md's typography switches on that the source lacks.
 * A gap not listed in KNOWN_FEATURE_GAPS fails.
 */
function verifyFeatures(
  family: string,
  label: string,
  source: FontTables,
  features: readonly string[],
): string[] {
  const available = [
    ...featureTags(source, "GSUB"),
    ...featureTags(source, "GPOS"),
  ];
  const absent = features.filter((feature) => !available.includes(feature));
  const known = KNOWN_FEATURE_GAPS[family] ?? [];
  const unknown = absent.filter((feature) => !known.includes(feature));
  if (unknown.length > 0) {
    throw new Error(
      `${label}: the source has no ${unknown.join(", ")} feature, which DESIGN.md's typography switches on`,
    );
  }
  return absent;
}

/**
 * `pnpm fonts` (contrib-engineering §1.3): a woff2 per static weight
 * (the pixel face at 400, served as Portfolio Pixel) and one variable Mona Sans
 * woff2 (served as Portfolio Sans) with its axes cut to the ranges
 * DESIGN.md uses, each covering Google's latin and vietnamese ranges plus
 * U+2190–2193 and the family's own extra ranges; the OFL beside them; and
 * a manifest read back from the files.
 */
export async function generateFontFiles(
  designMd: string,
): Promise<FontGeneration> {
  const uses = familyUses(designMd);
  const files = new Map<string, Uint8Array | string>();
  const fonts: FontOutput[] = [];
  const manifestFonts: unknown[] = [];

  const unknown = [...uses.keys()].filter(
    (family) => !FAMILIES.some((config) => config.family === family),
  );
  if (unknown.length > 0) {
    throw new Error(
      `DESIGN.md uses ${unknown.join(", ")}, which has no source`,
    );
  }

  for (const config of FAMILIES) {
    const use = uses.get(config.family);
    if (use === undefined) {
      throw new Error(
        `${config.family} has a source but no DESIGN.md typography token uses it`,
      );
    }
    const requested = requestedCodePoints(config.extraRanges);
    const text = String.fromCodePoint(...requested);
    const keepFeatures = [
      ...new Set([...DEFAULT_FEATURES, ...use.features]),
    ].sort();
    const slug = config.rename?.to.slug ?? config.slug;
    const common = {
      origin: config.origin,
      ...(config.extraRanges === undefined
        ? {}
        : { extraRanges: config.extraRanges }),
    };
    files.set(
      licenceFile(config.slug),
      readPinned(config.licence, config.origin),
    );

    if (config.kind === "static") {
      if (!sameList(use.widths, [DEFAULT_WIDTH])) {
        throw new Error(`${config.family} is static: it has no width axis`);
      }
      for (const weight of use.weights) {
        const pinned = config.weights[weight];
        if (pinned === undefined) {
          throw new Error(
            `DESIGN.md uses ${config.family} ${String(weight)}, which has no pinned source`,
          );
        }
        const pinnedSource = readPinned(pinned, config.origin);
        const source =
          config.rename === undefined
            ? pinnedSource
            : renamed(pinnedSource, config.rename);
        const sourceTables = readTables(pinnedSource);
        const label = `${config.family} ${String(weight)}`;
        const missingFeatures = verifyFeatures(
          config.family,
          label,
          sourceTables,
          use.features,
        );
        const woff2 = await subsetFont(source, text, {
          targetFormat: "woff2",
          keepFeatures,
          preserveNameIds: LICENCE_NAME_IDS,
        });
        const tables = readTables(woff2);
        const covered = verifySubset(label, tables, sourceTables, requested);
        if (config.rename !== undefined) {
          verifyRenamed(label, tables, config.rename);
        }
        const file = staticFile(slug, weight);
        files.set(file, woff2);
        fonts.push({
          file,
          family: config.family,
          bytes: woff2,
          codePoints: covered,
        });
        manifestFonts.push({
          file,
          family: config.family,
          ...servedAs(config),
          weight,
          missingFeatures,
          ...common,
          source: pinned.path,
          sourceSha256: pinned.sha256,
          bytes: woff2.length,
          sha256: sha256(woff2),
          codePoints: { count: covered.length, ranges: toRanges(covered) },
        });
      }
      continue;
    }

    const pinnedSource = readPinned(config.source, config.origin);
    const source =
      config.rename === undefined
        ? pinnedSource
        : renamed(pinnedSource, config.rename);
    const sourceTables = readTables(pinnedSource);
    const missingFeatures = verifyFeatures(
      config.family,
      config.family,
      sourceTables,
      use.features,
    );
    const variationAxes = {
      wght: range(use.weights),
      wdth: range(use.widths),
    };
    const woff2 = await subsetFont(source, text, {
      targetFormat: "woff2",
      variationAxes,
      keepFeatures,
      preserveNameIds: LICENCE_NAME_IDS,
    });
    const tables = readTables(woff2);
    const covered = verifySubset(
      config.family,
      tables,
      sourceTables,
      requested,
    );
    if (config.rename !== undefined) {
      verifyRenamed(config.family, tables, config.rename);
    }
    const found = Object.fromEntries(
      axes(tables).map((axis) => [axis.tag, [axis.min, axis.max]]),
    );
    const wanted = {
      wdth: [variationAxes.wdth.min, variationAxes.wdth.max],
      wght: [variationAxes.wght.min, variationAxes.wght.max],
    };
    const sortedAxes = (value: object) =>
      JSON.stringify(
        Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
      );
    if (sortedAxes(found) !== sortedAxes(wanted)) {
      throw new Error(
        `${config.family}: the woff2's axes ${JSON.stringify(found)} are not ${JSON.stringify(wanted)}`,
      );
    }
    const file = variableFile(slug);
    files.set(file, woff2);
    fonts.push({
      file,
      family: config.family,
      bytes: woff2,
      codePoints: covered,
    });
    manifestFonts.push({
      file,
      family: config.family,
      ...servedAs(config),
      axes: found,
      missingFeatures,
      ...common,
      source: config.source.path,
      sourceSha256: config.source.sha256,
      bytes: woff2.length,
      sha256: sha256(woff2),
      codePoints: { count: covered.length, ranges: toRanges(covered) },
    });
  }

  const manifest = {
    generator: `pnpm fonts (subset-font ${subsetFontVersion()}, HarfBuzz)`,
    unicodeRanges: UNICODE_RANGES,
    fonts: manifestFonts,
  };
  files.set(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  return { files, fonts };
}
