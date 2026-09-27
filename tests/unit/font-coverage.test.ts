import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  instanceFile,
  LICENCE_NAME_IDS,
  OUTPUT,
  SOURCE,
} from "../../scripts/fonts/config";
import { typographyStyles } from "../../scripts/fonts/pipeline";
import {
  axes,
  codePoints,
  featureTags,
  fromRanges,
  nameString,
  readTables,
} from "../../scripts/fonts/sfnt";
import { contentLines } from "../support/content-trace/corpus";
import { collectContentLeaves } from "../support/content-trace/trace";
import { readDesignMd } from "../support/design-md";
import { REPO_ROOT } from "../support/repo";

interface Manifest {
  readonly variable: {
    readonly axes: Record<string, [number, number]>;
    readonly features: {
      readonly GSUB: readonly string[];
      readonly prunedNoEffect: readonly string[];
    };
  };
  readonly instances: readonly { readonly file: string }[];
  readonly codePoints: {
    readonly count: number;
    readonly ranges: readonly string[];
  };
}

const read = (path: string) => readFileSync(join(REPO_ROOT, path));
const manifest = JSON.parse(read(OUTPUT.manifest).toString("utf8")) as Manifest;
const covered = new Set(fromRanges(manifest.codePoints.ranges));
const infoMd = read("info.md").toString("utf8");

/** Line breaks and tabs draw no glyph. */
const NON_RENDERING = new Set(["\n", "\r", "\t"]);

/** Each distinct character of `text` that the subset lacks, as "U+XXXX c". */
function uncovered(text: string): string[] {
  const missing = new Set<string>();
  for (const character of text) {
    const code = character.codePointAt(0) ?? 0;
    if (!NON_RENDERING.has(character) && !covered.has(code)) {
      missing.add(
        `U+${code.toString(16).toUpperCase().padStart(4, "0")} ${character}`,
      );
    }
  }
  return [...missing].sort();
}

describe("the Archivo subset covers every character the site renders (contrib-engineering §1.5)", () => {
  it("the manifest lists exactly the code points the woff2 maps", () => {
    const woff2 = codePoints(readTables(read(OUTPUT.variable)));
    expect(woff2).toEqual([...covered].sort((a, b) => a - b));
    expect(manifest.codePoints.count).toBe(woff2.length);
  });

  it("covers every character of info.md's content sections", () => {
    const content = contentLines(infoMd).join("\n");
    expect(content.length).toBeGreaterThan(10_000);
    expect(uncovered(content)).toEqual([]);
  });

  it("covers the owner's name, the arrows and DESIGN.md's 102 Vietnamese code points", () => {
    expect(uncovered("Hồ Trọng Đại")).toEqual([]);
    expect(uncovered("← → ↔")).toEqual([]);

    // DESIGN.md → Typography: U+1EA0–1EF9 plus Ă ă Đ đ Ĩ ĩ Ũ ũ Ơ ơ Ư ư.
    const vietnamese = fromRanges([
      "1EA0-1EF9",
      "0102-0103",
      "0110-0111",
      "0128-0129",
      "0168-0169",
      "01A0-01A1",
      "01AF-01B0",
    ]);
    expect(vietnamese).toHaveLength(102);
    expect(vietnamese.filter((code) => !covered.has(code))).toEqual([]);
  });

  it("covers the typography the site adds: curly quotes, the ellipsis and the no-break space", () => {
    expect(uncovered("‘ ’ “ ” …  ")).toEqual([]);
  });

  it("covers every string in src/content/", async () => {
    const { leaves } = await collectContentLeaves(
      join(REPO_ROOT, "src", "content"),
    );
    const text = leaves.map((leaf) => String(leaf.value)).join("\n");
    expect(uncovered(text)).toEqual([]);
  });

  it("outside the subset, info.md holds only the banner text the site never renders (▸)", () => {
    expect(uncovered(infoMd)).toEqual(["U+25B8 ▸"]);
    const lines = infoMd.split("\n").filter((line) => line.includes("▸"));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/^\s*- Text: "tidi@saigon/);
  });
});

describe("the woff2 carries the axes and features DESIGN.md's roles use", () => {
  const woff2 = readTables(read(OUTPUT.variable));

  it("its axes are the ranges DESIGN.md → Typography states", () => {
    const stated =
      /axes cut to `wdth` ([\d.]+)–([\d.]+) and `wght` ([\d.]+)–([\d.]+)/.exec(
        readDesignMd(),
      );
    expect(stated).not.toBeNull();
    const [wdthMin, wdthMax, wghtMin, wghtMax] = (stated ?? [])
      .slice(1)
      .map(Number);

    const found = Object.fromEntries(
      axes(woff2).map((axis) => [axis.tag, [axis.min, axis.max]]),
    );
    expect(found).toEqual({
      wght: [wghtMin, wghtMax],
      wdth: [wdthMin, wdthMax],
    });
    expect(manifest.variable.axes).toEqual(found);
  });

  it("keeps tnum; lnum is pruned only because Archivo's default figures are already lining", () => {
    const gsub = featureTags(woff2, "GSUB");
    expect(gsub).toContain("tnum");
    expect(gsub).toEqual(manifest.variable.features.GSUB);
    // The pipeline allows a pruned feature only if the font has it, i.e. it
    // acts on no glyph this subset keeps.
    expect(manifest.variable.features.prunedNoEffect).toEqual(["lnum"]);
  });
});

describe("static instances for Satori and the résumé", () => {
  const styles = typographyStyles(readDesignMd());

  it("there is one static TTF per weight and width pair the typography tokens use", () => {
    expect(styles.length).toBeGreaterThan(0);
    expect(manifest.instances.map((instance) => instance.file)).toEqual(
      styles.map((style) => instanceFile(style.wght, style.wdth)),
    );
  });

  it.each(styles.map((style) => [instanceFile(style.wght, style.wdth)]))(
    "%s is static and maps the same code points",
    (file) => {
      const tables = readTables(read(file));
      expect(axes(tables)).toEqual([]);
      expect(codePoints(tables)).toEqual([...covered].sort((a, b) => a - b));
    },
  );
});

describe("every font file carries the OFL in its naming table (OFL condition 2; QA review of Phase 2, M1)", () => {
  const source = readTables(read(SOURCE.file));

  it("the source's copyright, licence and licence URL records are the OFL's", () => {
    expect(nameString(source, 0)).toContain("The Archivo Project Authors");
    expect(nameString(source, 13)).toContain(
      "licensed under the SIL Open Font License, Version 1.1",
    );
    expect(nameString(source, 14)).toBe("http://scripts.sil.org/OFL");
  });

  it.each(
    [
      OUTPUT.variable,
      ...manifest.instances.map((instance) => instance.file),
    ].map((file) => [file]),
  )("%s keeps name IDs 0, 13 and 14 exactly as the source has them", (file) => {
    const tables = readTables(read(file));
    for (const nameId of LICENCE_NAME_IDS) {
      expect(nameString(tables, nameId), `name ID ${String(nameId)}`).toBe(
        nameString(source, nameId),
      );
    }
  });
});

/** An SFNT's table checksums, and the whole-file sum that head.checkSumAdjustment balances. */
function checksumProblems(font: Buffer): string[] {
  const sum = (bytes: Buffer) => {
    const padded = Buffer.concat([
      bytes,
      Buffer.alloc((4 - (bytes.length % 4)) % 4),
    ]);
    let total = 0;
    for (let offset = 0; offset < padded.length; offset += 4) {
      total = (total + padded.readUInt32BE(offset)) >>> 0;
    }
    return total;
  };
  const problems: string[] = [];
  const count = font.readUInt16BE(4);
  for (let index = 0; index < count; index++) {
    const record = 12 + index * 16;
    const tag = font.toString("latin1", record, record + 4);
    const offset = font.readUInt32BE(record + 8);
    const data = Buffer.from(
      font.subarray(offset, offset + font.readUInt32BE(record + 12)),
    );
    if (tag === "head") data.writeUInt32BE(0, 8);
    if (sum(data) !== font.readUInt32BE(record + 4))
      problems.push(`${tag} checksum`);
  }
  if (sum(font) !== 0xb1b0afba) problems.push("whole-file checksum");
  return problems;
}

describe("each static instance is named for its weight and width (QA review of Phase 2, M2)", () => {
  // [file, family (ID 1), full name (ID 4), PostScript name (ID 6), typographic subfamily (ID 17)]
  const EXPECTED = [
    [
      "archivo-wght800-wdth125.ttf",
      "Archivo Expanded ExtraBold",
      "Archivo Expanded ExtraBold",
      "Archivo-ExpandedExtraBold",
      "Expanded ExtraBold",
    ],
    [
      "archivo-wght700-wdth125.ttf",
      "Archivo Expanded Bold",
      "Archivo Expanded Bold",
      "Archivo-ExpandedBold",
      "Expanded Bold",
    ],
    [
      "archivo-wght700-wdth112.ttf",
      "Archivo SemiExpanded Bold",
      "Archivo SemiExpanded Bold",
      "Archivo-SemiExpandedBold",
      "SemiExpanded Bold",
    ],
    [
      "archivo-wght700-wdth100.ttf",
      "Archivo Bold",
      "Archivo Bold",
      "Archivo-Bold",
      "Bold",
    ],
    [
      "archivo-wght500-wdth100.ttf",
      "Archivo Medium",
      "Archivo Medium",
      "Archivo-Medium",
      "Medium",
    ],
    [
      "archivo-wght400-wdth100.ttf",
      "Archivo",
      "Archivo Regular",
      "Archivo-Regular",
      "Regular",
    ],
    [
      "archivo-wght700-wdth87.5.ttf",
      "Archivo SemiCondensed Bold",
      "Archivo SemiCondensed Bold",
      "Archivo-SemiCondensedBold",
      "SemiCondensed Bold",
    ],
    [
      "archivo-wght600-wdth87.5.ttf",
      "Archivo SemiCondensed SemiBold",
      "Archivo SemiCondensed SemiBold",
      "Archivo-SemiCondensedSemiBold",
      "SemiCondensed SemiBold",
    ],
  ] as const;

  it("the expectations cover every instance in the manifest", () => {
    expect(
      EXPECTED.map(([file]) => `${OUTPUT.instanceDirectory}/${file}`),
    ).toEqual(manifest.instances.map((instance) => instance.file));
  });

  it.each(EXPECTED)(
    "%s is %s (full name %s, PostScript %s)",
    (file, family, fullName, postscriptName, style) => {
      const font = read(`${OUTPUT.instanceDirectory}/${file}`);
      const tables = readTables(font);
      expect(nameString(tables, 1)).toBe(family);
      expect(nameString(tables, 2)).toBe("Regular");
      expect(nameString(tables, 3)).toBe(`2.001;OMNI;${postscriptName}`);
      expect(nameString(tables, 4)).toBe(fullName);
      expect(nameString(tables, 6)).toBe(postscriptName);
      expect(nameString(tables, 16)).toBe("Archivo");
      expect(nameString(tables, 17)).toBe(style);
      expect(checksumProblems(font)).toEqual([]);
    },
  );

  it("records each instance's names in the manifest", () => {
    const named = manifest.instances as readonly {
      readonly file: string;
      readonly fullName?: string;
      readonly postscriptName?: string;
    }[];
    expect(
      named.map(({ fullName, postscriptName }) => [fullName, postscriptName]),
    ).toEqual(
      EXPECTED.map(([, , fullName, postscriptName]) => [
        fullName,
        postscriptName,
      ]),
    );
  });
});

describe("next/font/local loads the subset (src/app/layout.tsx)", () => {
  // next/font only accepts literals, so the options repeat the manifest.
  const layout = read("src/app/layout.tsx").toString("utf8");
  const { wght, wdth } = manifest.variable.axes;

  it("points at the woff2, with swap and preload", () => {
    expect(layout).toContain(`src: "${relative("src/app", OUTPUT.variable)}"`);
    expect(layout).toContain('display: "swap"');
    expect(layout).toContain("preload: true");
    expect(layout).toContain('variable: "--font-archivo"');
  });

  it("declares the woff2's weight and width ranges", () => {
    expect(wght).toBeDefined();
    expect(wdth).toBeDefined();
    expect(layout).toContain(
      `weight: "${String(wght?.[0])} ${String(wght?.[1])}"`,
    );
    expect(layout).toContain(
      `{ prop: "font-stretch", value: "${String(wdth?.[0])}% ${String(wdth?.[1])}%" }`,
    );
  });
});
