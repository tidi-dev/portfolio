import type { NameRecord } from "./sfnt";

/**
 * The two writes the font pipeline needs: encode a naming table, and put a
 * table into a TTF with valid checksums. Everything else HarfBuzz writes.
 */

/** OpenType's table checksum: the sum of the big-endian uint32 words, zero-padded. */
export function tableChecksum(bytes: Uint8Array): number {
  const view = Buffer.concat([
    Buffer.from(bytes),
    Buffer.alloc((4 - (bytes.length % 4)) % 4),
  ]);
  let sum = 0;
  for (let offset = 0; offset < view.length; offset += 4) {
    sum = (sum + view.readUInt32BE(offset)) >>> 0;
  }
  return sum;
}

function encodeText(record: NameRecord): Buffer {
  return record.platformId === 1
    ? Buffer.from(record.text, "latin1")
    : Buffer.from(record.text, "utf16le").swap16();
}

/** A format 0 naming table, its records sorted as the spec requires. */
export function encodeNameTable(records: readonly NameRecord[]): Buffer {
  const sorted = [...records].sort(
    (a, b) =>
      a.platformId - b.platformId ||
      a.encodingId - b.encodingId ||
      a.languageId - b.languageId ||
      a.nameId - b.nameId,
  );
  const strings = sorted.map(encodeText);
  const header = Buffer.alloc(6 + sorted.length * 12);
  header.writeUInt16BE(0, 0);
  header.writeUInt16BE(sorted.length, 2);
  header.writeUInt16BE(header.length, 4);

  let offset = 0;
  sorted.forEach((record, index) => {
    const at = 6 + index * 12;
    const text = strings[index] ?? Buffer.alloc(0);
    header.writeUInt16BE(record.platformId, at);
    header.writeUInt16BE(record.encodingId, at + 2);
    header.writeUInt16BE(record.languageId, at + 4);
    header.writeUInt16BE(record.nameId, at + 6);
    header.writeUInt16BE(text.length, at + 8);
    header.writeUInt16BE(offset, at + 10);
    offset += text.length;
  });
  return Buffer.concat([header, ...strings]);
}

const CHECKSUM_MAGIC = 0xb1b0afba;

/**
 * The TTF with one table replaced. Tables keep their order in the file, each
 * 4-byte aligned; the directory stays sorted by tag; every table checksum and
 * head.checkSumAdjustment are recomputed.
 */
export function replaceTable(font: Buffer, tag: string, data: Buffer): Buffer {
  const count = font.readUInt16BE(4);
  const tables = Array.from({ length: count }, (_, index) => {
    const record = 12 + index * 16;
    const tableTag = font.toString("latin1", record, record + 4);
    const offset = font.readUInt32BE(record + 8);
    const length = font.readUInt32BE(record + 12);
    return {
      tag: tableTag,
      offset,
      data: tableTag === tag ? data : font.subarray(offset, offset + length),
    };
  });
  if (!tables.some((table) => table.tag === tag)) {
    throw new Error(`the font has no ${tag} table to replace`);
  }

  const placed = new Map<string, number>();
  let cursor = 12 + count * 16;
  for (const table of [...tables].sort((a, b) => a.offset - b.offset)) {
    placed.set(table.tag, cursor);
    cursor += table.data.length + ((4 - (table.data.length % 4)) % 4);
  }

  const output = Buffer.alloc(cursor);
  font.copy(output, 0, 0, 12);
  const directory = [...tables].sort((a, b) => (a.tag < b.tag ? -1 : 1));
  directory.forEach((table, index) => {
    const offset = placed.get(table.tag) ?? 0;
    const bytes = Buffer.from(table.data);
    if (table.tag === "head") bytes.writeUInt32BE(0, 8);
    bytes.copy(output, offset);
    const record = 12 + index * 16;
    output.write(table.tag, record, 4, "latin1");
    output.writeUInt32BE(tableChecksum(bytes), record + 4);
    output.writeUInt32BE(offset, record + 8);
    output.writeUInt32BE(bytes.length, record + 12);
  });

  const head = placed.get("head");
  if (head === undefined) throw new Error("the font has no head table");
  output.writeUInt32BE(
    (CHECKSUM_MAGIC - tableChecksum(output)) >>> 0,
    head + 8,
  );
  return output;
}
