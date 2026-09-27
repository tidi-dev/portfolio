import { brotliDecompressSync } from "node:zlib";

/**
 * Just enough of the OpenType and WOFF2 formats to verify the font outputs:
 * the character map (cmap), the variation axes (fvar) and the layout
 * feature tags (GSUB, GPOS). WOFF2 tables are read with Node's brotli; the
 * three tables read here are never transformed (only glyf, loca and hmtx
 * can be).
 */

export type FontTables = ReadonlyMap<string, Buffer>;

export interface Axis {
  readonly tag: string;
  readonly min: number;
  readonly default: number;
  readonly max: number;
}

const WOFF2_SIGNATURE = 0x774f4632; // "wOF2"
const SFNT_VERSIONS = new Set([0x00010000, 0x4f54544f, 0x74727565]); // 1.0, "OTTO", "true"

// WOFF2 known-table tags, in the order of the spec's table (index 0–62).
// prettier-ignore
const WOFF2_KNOWN_TAGS = [
  "cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post", "cvt ",
  "fpgm", "glyf", "loca", "prep", "CFF ", "VORG", "EBDT", "EBLC", "gasp",
  "hdmx", "kern", "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "BASE", "GDEF",
  "GPOS", "GSUB", "EBSC", "JSTF", "MATH", "CBDT", "CBLC", "COLR", "CPAL",
  "SVG ", "sbix", "acnt", "avar", "bdat", "bloc", "bsln", "cvar", "fdsc",
  "feat", "fmtx", "fvar", "gvar", "hsty", "just", "lcar", "mort", "morx",
  "opbd", "prop", "trak", "Zapf", "Silf", "Glat", "Gloc", "Feat", "Sill",
] as const;

function tagAt(buffer: Buffer, offset: number): string {
  return buffer.toString("latin1", offset, offset + 4);
}

function readSfntTables(font: Buffer): FontTables {
  const tables = new Map<string, Buffer>();
  const count = font.readUInt16BE(4);
  for (let index = 0; index < count; index++) {
    const record = 12 + index * 16;
    const offset = font.readUInt32BE(record + 8);
    const length = font.readUInt32BE(record + 12);
    tables.set(tagAt(font, record), font.subarray(offset, offset + length));
  }
  return tables;
}

function readUIntBase128(buffer: Buffer, start: number): [number, number] {
  let value = 0;
  for (let index = 0; index < 5; index++) {
    const byte = buffer.readUInt8(start + index);
    if (index === 0 && byte === 0x80) {
      throw new Error("WOFF2: UIntBase128 with a leading zero");
    }
    value = value * 128 + (byte & 0x7f);
    if ((byte & 0x80) === 0) return [value, start + index + 1];
  }
  throw new Error("WOFF2: UIntBase128 longer than 5 bytes");
}

function readWoff2Tables(font: Buffer): FontTables {
  if (tagAt(font, 4) === "ttcf") {
    throw new Error("WOFF2: font collections are not supported");
  }
  const count = font.readUInt16BE(12);
  const compressedLength = font.readUInt32BE(20);
  const entries: { tag: string; length: number; transformed: boolean }[] = [];

  let cursor = 48;
  for (let index = 0; index < count; index++) {
    const flags = font.readUInt8(cursor);
    cursor += 1;
    const tagIndex = flags & 0x3f;
    let tag: string;
    if (tagIndex === 0x3f) {
      tag = tagAt(font, cursor);
      cursor += 4;
    } else {
      const known = WOFF2_KNOWN_TAGS[tagIndex];
      if (known === undefined)
        throw new Error(`WOFF2: bad tag index ${String(tagIndex)}`);
      tag = known;
    }
    const version = flags >> 6;
    const [origLength, afterOrig] = readUIntBase128(font, cursor);
    cursor = afterOrig;
    // glyf and loca: version 0 is the transform, 3 the null transform. Other
    // tables: version 0 is the null transform.
    const transformed =
      tag === "glyf" || tag === "loca" ? version === 0 : version !== 0;
    let length = origLength;
    if (transformed) {
      const [transformLength, afterTransform] = readUIntBase128(font, cursor);
      cursor = afterTransform;
      length = transformLength;
    }
    entries.push({ tag, length, transformed });
  }

  const data = brotliDecompressSync(
    font.subarray(cursor, cursor + compressedLength),
  );
  const tables = new Map<string, Buffer>();
  let offset = 0;
  for (const entry of entries) {
    if (!entry.transformed) {
      tables.set(entry.tag, data.subarray(offset, offset + entry.length));
    }
    offset += entry.length;
  }
  return tables;
}

/** The untransformed tables of a TTF/OTF or WOFF2 font. */
export function readTables(font: Buffer): FontTables {
  const signature = font.readUInt32BE(0);
  if (signature === WOFF2_SIGNATURE) return readWoff2Tables(font);
  if (SFNT_VERSIONS.has(signature)) return readSfntTables(font);
  throw new Error(
    `not a TTF, OTF or WOFF2 font (signature 0x${signature.toString(16)})`,
  );
}

function table(tables: FontTables, tag: string): Buffer {
  const found = tables.get(tag);
  if (found === undefined) throw new Error(`the font has no ${tag} table`);
  return found;
}

function format4(cmap: Buffer, start: number, into: Set<number>): void {
  const segments = cmap.readUInt16BE(start + 6) / 2;
  const ends = start + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const rangeOffsets = deltas + segments * 2;
  for (let segment = 0; segment < segments; segment++) {
    const end = cmap.readUInt16BE(ends + segment * 2);
    const first = cmap.readUInt16BE(starts + segment * 2);
    const delta = cmap.readInt16BE(deltas + segment * 2);
    const rangeOffsetAt = rangeOffsets + segment * 2;
    const rangeOffset = cmap.readUInt16BE(rangeOffsetAt);
    for (let code = first; code <= end && code !== 0xffff; code++) {
      let glyph: number;
      if (rangeOffset === 0) {
        glyph = (code + delta) & 0xffff;
      } else {
        const raw = cmap.readUInt16BE(
          rangeOffsetAt + rangeOffset + (code - first) * 2,
        );
        glyph = raw === 0 ? 0 : (raw + delta) & 0xffff;
      }
      if (glyph !== 0) into.add(code);
    }
  }
}

function format12(cmap: Buffer, start: number, into: Set<number>): void {
  const groups = cmap.readUInt32BE(start + 12);
  for (let group = 0; group < groups; group++) {
    const record = start + 16 + group * 12;
    const first = cmap.readUInt32BE(record);
    const last = cmap.readUInt32BE(record + 4);
    const firstGlyph = cmap.readUInt32BE(record + 8);
    for (let code = first; code <= last; code++) {
      if (firstGlyph + (code - first) !== 0) into.add(code);
    }
  }
}

/** Every code point the font maps to a glyph, from its Unicode cmap subtables. */
export function codePoints(tables: FontTables): number[] {
  const cmap = table(tables, "cmap");
  const found = new Set<number>();
  const count = cmap.readUInt16BE(2);
  for (let index = 0; index < count; index++) {
    const record = 4 + index * 8;
    const platform = cmap.readUInt16BE(record);
    const encoding = cmap.readUInt16BE(record + 2);
    const unicode =
      platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode) continue;
    const start = cmap.readUInt32BE(record + 4);
    const format = cmap.readUInt16BE(start);
    if (format === 4) format4(cmap, start, found);
    else if (format === 12) format12(cmap, start, found);
  }
  return [...found].sort((a, b) => a - b);
}

/** The variation axes (fvar); empty for a static font. */
export function axes(tables: FontTables): Axis[] {
  const fvar = tables.get("fvar");
  if (fvar === undefined) return [];
  const arrayOffset = fvar.readUInt16BE(4);
  const count = fvar.readUInt16BE(8);
  const size = fvar.readUInt16BE(10);
  const fixed = (offset: number) => fvar.readInt32BE(offset) / 65536;
  return Array.from({ length: count }, (_, index) => {
    const record = arrayOffset + index * size;
    return {
      tag: tagAt(fvar, record),
      min: fixed(record + 4),
      default: fixed(record + 8),
      max: fixed(record + 12),
    };
  });
}

/** The distinct feature tags of a layout table (GSUB or GPOS), sorted. */
export function featureTags(
  tables: FontTables,
  tag: "GSUB" | "GPOS",
): string[] {
  const layout = tables.get(tag);
  if (layout === undefined) return [];
  const list = layout.readUInt16BE(6);
  const count = layout.readUInt16BE(list);
  const tags = new Set<string>();
  for (let index = 0; index < count; index++) {
    tags.add(tagAt(layout, list + 2 + index * 6));
  }
  return [...tags].sort();
}

/** Compact ranges, e.g. [0x41, 0x42, 0x43, 0x61] → ["0041-0043", "0061"]. */
export function toRanges(sorted: readonly number[]): string[] {
  const hex = (code: number) =>
    code.toString(16).toUpperCase().padStart(4, "0");
  const ranges: string[] = [];
  let index = 0;
  while (index < sorted.length) {
    const first = sorted[index] ?? 0;
    let last = first;
    while (sorted[index + 1] === last + 1) {
      index += 1;
      last += 1;
    }
    ranges.push(first === last ? hex(first) : `${hex(first)}-${hex(last)}`);
    index += 1;
  }
  return ranges;
}

/** The inverse of toRanges; also reads CSS unicode-range syntax ("U+0041-005A"). */
export function fromRanges(ranges: readonly string[]): number[] {
  const codes: number[] = [];
  for (const range of ranges) {
    const match = /^(?:U\+)?([0-9A-F]{1,6})(?:-([0-9A-F]{1,6}))?$/i.exec(
      range.trim(),
    );
    if (!match?.[1]) throw new Error(`bad code point range "${range}"`);
    const first = Number.parseInt(match[1], 16);
    const last = match[2] === undefined ? first : Number.parseInt(match[2], 16);
    for (let code = first; code <= last; code++) codes.push(code);
  }
  return codes;
}
