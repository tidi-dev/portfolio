import { readFileSync } from "node:fs";
import { join } from "node:path";
import { lint, type DesignSystemState } from "@google/design.md/linter";
import { REPO_ROOT } from "./repo";

/**
 * Readers for the DESIGN.md prose values that the front matter can't hold
 * (Known Gaps 1). Each reader matches DESIGN.md's own wording and throws when
 * it can't, so a reworded spec fails loudly instead of passing silently.
 */

export function readDesignMd(): string {
  return readFileSync(join(REPO_ROOT, "DESIGN.md"), "utf8");
}

export function designSystem(designMd = readDesignMd()): DesignSystemState {
  return lint(designMd).designSystem;
}

function section(designMd: string, heading: string): string {
  const start = designMd.indexOf(`\n## ${heading}\n`);
  if (start === -1) throw new Error(`DESIGN.md has no "## ${heading}" section`);
  const end = designMd.indexOf("\n## ", start + 1);
  return designMd.slice(start, end === -1 ? undefined : end);
}

function capture(text: string, pattern: RegExp, what: string): string[] {
  const match = pattern.exec(text);
  if (!match)
    throw new Error(`DESIGN.md: cannot find ${what} (${String(pattern)})`);
  return match.slice(1).map((group) => group);
}

/** Collapses whitespace, so values compare regardless of formatting. */
export function normaliseValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export interface TypographyRow {
  readonly token: string;
  /** The row's `clamp()`, resolved through "as `<token>`"; undefined when fixed. */
  readonly clamp: string | undefined;
  readonly desktopPx: number;
  readonly mobilePx: number;
}

/** Typography → Hierarchy table. */
export function typographyTable(designMd = readDesignMd()): TypographyRow[] {
  const rows = section(designMd, "Typography")
    .split("\n")
    .filter((line) => /^\|\s*`[a-z-]+`\s*\|/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()));

  const raw = rows.map((cells) => {
    const [token = "", px = "", clampCell = ""] = cells.slice(1);
    const sizes = px.split("→").map((size) => Number.parseFloat(size));
    const mobilePx = sizes[0] ?? Number.NaN;
    return {
      token: token.replaceAll("`", ""),
      clampCell,
      mobilePx,
      desktopPx: sizes[1] ?? mobilePx,
    };
  });

  return raw.map((row) => {
    let clamp: string | undefined;
    const direct = /^`(clamp\(.+\))`$/.exec(row.clampCell)?.[1];
    const alias = /^as `([a-z-]+)`$/.exec(row.clampCell)?.[1];
    if (direct !== undefined) {
      clamp = normaliseValue(direct);
    } else if (alias !== undefined) {
      const target = raw.find((other) => other.token === alias);
      const targetClamp = /^`(clamp\(.+\))`$/.exec(
        target?.clampCell ?? "",
      )?.[1];
      if (targetClamp === undefined) {
        throw new Error(
          `typography row ${row.token}: "as ${alias}" has no clamp`,
        );
      }
      clamp = normaliseValue(targetClamp);
    } else if (row.clampCell !== "fixed") {
      throw new Error(
        `typography row ${row.token}: unreadable clamp "${row.clampCell}"`,
      );
    }
    return {
      token: row.token,
      clamp,
      mobilePx: row.mobilePx,
      desktopPx: row.desktopPx,
    };
  });
}

/** Motion → the "Tokens, mapped by hand" line: durations in ms, easings. */
export function motionTokens(designMd = readDesignMd()): {
  readonly durations: ReadonlyMap<string, string>;
  readonly easings: ReadonlyMap<string, string>;
} {
  const [line = ""] = capture(
    section(designMd, "Motion"),
    /\*\*Tokens,\*\* mapped by hand[^:]*:(.+)/,
    "the Motion tokens line",
  );
  const durations = new Map(
    [...line.matchAll(/`duration-([a-z]+)` (\d+) ms/g)].map((match) => [
      String(match[1]),
      `${String(match[2])}ms`,
    ]),
  );
  const easings = new Map(
    [...line.matchAll(/`(ease-[a-z-]+)` `(cubic-bezier\([^)]+\))`/g)].map(
      (match) => [String(match[1]), normaliseValue(String(match[2]))],
    ),
  );
  if (durations.size === 0 || easings.size === 0) {
    throw new Error(
      "DESIGN.md: the Motion tokens line lists no durations or easings",
    );
  }
  return { durations, easings };
}

/** The other hand-mapped values, each read from the sentence that states it. */
export function proseValues(designMd = readDesignMd()) {
  const layout = section(designMd, "Layout");
  const responsive = section(designMd, "Responsive Behavior");
  const components = section(designMd, "Components");

  const [sectionClamp = "", sheetClamp = ""] = capture(
    layout,
    /sections sit `(clamp\([^`]+\))` apart[^,]*, sheets `(clamp\([^`]+\))`/,
    "the section and sheet rhythm",
  );
  const [md = "", lg = ""] = capture(
    responsive,
    /md from 768 px \(([\d.]+rem)\), lg from 1024 px \(([\d.]+rem)\)/,
    "the breakpoints",
  );
  const [bench = ""] = capture(
    components,
    /wide, authored 480 units, from (\d+) px/,
    "the bench's wide threshold",
  );
  const [drawing = ""] = capture(
    components,
    /shown when the plate's inner width is at least (\d+) px/,
    "the drawings' wide threshold",
  );
  const [skipLink = ""] = capture(
    layout,
    /only the skip link \(z-index (\d+)\)/,
    "the skip link layer",
  );
  const [scrollMargin = ""] = capture(
    layout,
    /anchor targets get `scroll-margin-top: (\d+px)`/,
    "the anchor scroll margin",
  );
  const [ink = ""] = capture(
    components,
    /\| Ink line \| ([\d.]+) px `primary`/,
    "the ink stroke",
  );
  const [proof = ""] = capture(
    components,
    /\| Proof \| `drawing-proof`: ([\d.]+) px `accent`/,
    "the proof stroke",
  );
  const [construction = "", dash = ""] = capture(
    components,
    /\| Construction \| `drawing-construction`: ([\d.]+) px `trace`, dashed (\d+ \d+)/,
    "the construction stroke and dash",
  );

  return {
    sectionClamp: normaliseValue(sectionClamp),
    sheetClamp: normaliseValue(sheetClamp),
    breakpoints: { md, lg },
    containers: { bench: `${bench}px`, drawing: `${drawing}px` },
    skipLinkLayer: skipLink,
    scrollMargin,
    strokes: {
      ink: `${ink}px`,
      proof: `${proof}px`,
      construction: `${construction}px`,
      dash,
    },
  };
}

/** Custom-property declarations inside the `@theme { … }` blocks of a CSS file. */
export function themeDeclarations(css: string): Map<string, string> {
  const declarations = new Map<string, string>();
  for (const block of css.matchAll(/@theme(?:\s+[a-z]+)*\s*\{([^}]*)\}/g)) {
    const body = (block[1] ?? "").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      declarations.set(String(match[1]), normaliseValue(String(match[2])));
    }
  }
  return declarations;
}

/** The body of each `@utility <name> { … }` block, as property → value. */
export function utilities(css: string): Map<string, Map<string, string>> {
  const result = new Map<string, Map<string, string>>();
  for (const block of css.matchAll(/@utility\s+([\w-]+)\s*\{([^}]*)\}/g)) {
    const properties = new Map<string, string>();
    for (const match of String(block[2]).matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) {
      properties.set(String(match[1]), normaliseValue(String(match[2])));
    }
    result.set(String(block[1]), properties);
  }
  return result;
}
