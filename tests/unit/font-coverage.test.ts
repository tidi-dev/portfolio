import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { instanceFile, OUTPUT } from "../../scripts/fonts/config";
import { typographyStyles } from "../../scripts/fonts/pipeline";
import {
  axes,
  codePoints,
  featureTags,
  fromRanges,
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
