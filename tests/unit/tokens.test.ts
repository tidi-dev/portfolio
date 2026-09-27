import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedColor, ResolvedValue } from "@google/design.md/linter";
import { describe, expect, it } from "vitest";
import {
  DARK_SUFFIX,
  THEME_INVARIANT_COLOURS,
} from "../../scripts/tokens/theme";
import {
  designSystem,
  motionTokens,
  proseValues,
  themeDeclarations,
  typographyTable,
  utilities,
} from "../support/design-md";
import { REPO_ROOT } from "../support/repo";
import { findTokenLiterals, handWrittenFiles } from "../support/token-literals";

const read = (path: string) => readFileSync(join(REPO_ROOT, path), "utf8");

const system = designSystem();
const supplementCss = read("src/styles/theme.supplement.css");
const supplement = themeDeclarations(supplementCss);
const generatedTheme = read("src/styles/theme.generated.css");

function isColour(value: ResolvedValue | undefined): value is ResolvedColor {
  return typeof value === "object" && "type" in value && value.type === "color";
}

/** Light colour tokens that resolve to `hex` (several may share a value). */
function colourNamesFor(hex: string): string[] {
  return [...system.colors]
    .filter(
      ([name, colour]) => !name.endsWith(DARK_SUFFIX) && colour.hex === hex,
    )
    .map(([name]) => name);
}

describe("colours: dark swaps colour tokens only (DESIGN.md → Consistency locks 1)", () => {
  const light = [...system.colors.keys()].filter(
    (name) => !name.endsWith(DARK_SUFFIX),
  );

  it("every colour has a -dark twin, or is listed as theme-invariant", () => {
    const missing = light.filter(
      (name) =>
        !system.colors.has(`${name}${DARK_SUFFIX}`) &&
        !THEME_INVARIANT_COLOURS.includes(name),
    );
    expect(light.length).toBeGreaterThan(0);
    expect(missing).toEqual([]);
  });

  it("every -dark colour has a light colour", () => {
    const orphans = [...system.colors.keys()]
      .filter((name) => name.endsWith(DARK_SUFFIX))
      .filter((name) => !system.colors.has(name.slice(0, -DARK_SUFFIX.length)));
    expect(orphans).toEqual([]);
  });

  it("every -dark component holds only colours, each the -dark twin of the light component's colour", () => {
    const problems: string[] = [];
    for (const [name, component] of system.components) {
      if (!name.endsWith(DARK_SUFFIX)) continue;
      const base = system.components.get(name.slice(0, -DARK_SUFFIX.length));
      if (base === undefined) {
        problems.push(`${name}: no light component`);
        continue;
      }
      for (const [property, value] of component.properties) {
        const lightValue = base.properties.get(property);
        if (!isColour(value) || !isColour(lightValue)) {
          problems.push(`${name}.${property}: not a colour swap`);
          continue;
        }
        const twins = colourNamesFor(lightValue.hex).map(
          (token) => system.colors.get(`${token}${DARK_SUFFIX}`)?.hex,
        );
        if (!twins.includes(value.hex)) {
          problems.push(
            `${name}.${property}: ${value.hex} is not the -dark twin of ${lightValue.hex}`,
          );
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("theme.generated.css gives every colour its -dark value for data-theme and for the system preference", () => {
    const blocks = [
      /:root\[data-theme="dark"\]\s*\{([^}]*)\}/,
      /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/,
    ].map((pattern) => pattern.exec(generatedTheme)?.[1] ?? "");

    for (const block of blocks) {
      expect(block).toContain("color-scheme: dark;");
      for (const name of light) {
        const twin = system.colors.get(`${name}${DARK_SUFFIX}`);
        if (twin === undefined) continue;
        expect(block, name).toContain(`--color-${name}: ${twin.hex};`);
      }
    }
  });
});

describe("typography: one type-* utility per token (contrib-engineering §4.2)", () => {
  const typeUtilities = utilities(generatedTheme);

  it.each([...system.typography])(
    "type-%s sets the token's size, leading, weight, width and figures",
    (name, token) => {
      const utility = typeUtilities.get(`type-${name}`);
      expect(utility, `type-${name}`).toBeDefined();

      const wdth = /'wdth'\s+([\d.]+)/.exec(token.fontVariation ?? "")?.[1];
      expect(wdth, `typography.${name} width`).toBeDefined();
      const figures = (token.fontFeature ?? "").includes("'tnum' 1")
        ? "tabular-nums lining-nums"
        : "normal";

      expect(Object.fromEntries(utility ?? [])).toEqual({
        "font-family": "var(--font-archivo)",
        "font-size": `var(--text-${name})`,
        "line-height": `var(--leading-${name})`,
        "letter-spacing":
          token.letterSpacing === undefined
            ? "normal"
            : `var(--tracking-${name})`,
        "font-weight": `var(--font-weight-${name})`,
        "font-stretch": `${String(Number(wdth))}%`,
        "font-variant-numeric": figures,
      });
    },
  );

  it("there is no type utility without a token, and no font-variation-settings", () => {
    const names = [...typeUtilities.keys()].map((key) =>
      key.slice("type-".length),
    );
    expect(names.sort()).toEqual([...system.typography.keys()].sort());
    expect(generatedTheme).not.toMatch(/font-variation-settings\s*:/);
  });
});

describe("theme.supplement.css equals DESIGN.md prose (Known Gaps 1)", () => {
  const rows = typographyTable();
  const motion = motionTokens();
  const prose = proseValues();

  it("each fluid role's size is the Typography table's clamp(); fixed roles keep the exported size", () => {
    expect(rows.map((row) => row.token).sort()).toEqual(
      [...system.typography.keys()].sort(),
    );
    for (const row of rows) {
      expect(supplement.get(`--text-${row.token}`), row.token).toBe(row.clamp);
    }
  });

  it("each clamp() starts at the token's 375 px size and runs to the table's 1440 px size", () => {
    for (const row of rows) {
      if (row.clamp === undefined) continue;
      const match =
        /^clamp\(([\d.]+)rem, ([\d.]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)$/.exec(
          row.clamp,
        );
      expect(match, row.token).not.toBeNull();
      const [min, base, slope, max] = (match ?? []).slice(1).map(Number) as [
        number,
        number,
        number,
        number,
      ];
      const tokenSize = system.typography.get(row.token)?.fontSize;

      expect(tokenSize?.unit, row.token).toBe("rem");
      expect(min, `${row.token} min = token size`).toBe(tokenSize?.value);
      expect(min * 16, `${row.token} at 375 px`).toBeCloseTo(row.mobilePx, 1);
      expect(max * 16, `${row.token} at 1440 px`).toBeCloseTo(row.desktopPx, 1);
      expect(
        base * 16 + (slope * 375) / 100,
        `${row.token} slope at 375 px`,
      ).toBeCloseTo(row.mobilePx, 1);
      expect(
        base * 16 + (slope * 1440) / 100,
        `${row.token} slope at 1440 px`,
      ).toBeCloseTo(row.desktopPx, 1);
    }
  });

  it("the section and sheet rhythm equal Layout → Rhythm", () => {
    expect(supplement.get("--spacing-section")).toBe(prose.sectionClamp);
    expect(supplement.get("--spacing-sheet")).toBe(prose.sheetClamp);
  });

  it("durations and easings equal Motion → Tokens", () => {
    expect(motion.durations.size).toBe(6);
    for (const [name, value] of motion.durations) {
      expect(supplement.get(`--transition-duration-${name}`), name).toBe(value);
    }
    expect(motion.easings.size).toBe(2);
    for (const [name, value] of motion.easings) {
      expect(supplement.get(`--${name}`), name).toBe(value);
    }
  });

  it("breakpoints, container thresholds, the skip-link layer, strokes and the anchor margin equal DESIGN.md", () => {
    expect(supplement.get("--breakpoint-md")).toBe(prose.breakpoints.md);
    expect(supplement.get("--breakpoint-lg")).toBe(prose.breakpoints.lg);
    expect(supplement.get("--container-bench")).toBe(prose.containers.bench);
    expect(supplement.get("--container-drawing")).toBe(
      prose.containers.drawing,
    );
    expect(supplement.get("--z-index-skip-link")).toBe(prose.skipLinkLayer);
    expect(supplement.get("--stroke-width-ink")).toBe(prose.strokes.ink);
    expect(prose.strokes.construction).toBe(prose.strokes.ink);
    expect(supplement.get("--stroke-width-proof")).toBe(prose.strokes.proof);
    expect(supplement.get("--dash-construction")).toBe(prose.strokes.dash);
    expect(supplement.get("--scroll-margin-anchor")).toBe(prose.scrollMargin);
  });

  it("declares nothing beyond the values checked here", () => {
    const checked = [
      ...rows
        .filter((row) => row.clamp !== undefined)
        .map((row) => `--text-${row.token}`),
      "--spacing-section",
      "--spacing-sheet",
      ...[...motion.durations.keys()].map(
        (name) => `--transition-duration-${name}`,
      ),
      ...[...motion.easings.keys()].map((name) => `--${name}`),
      "--breakpoint-md",
      "--breakpoint-lg",
      "--container-bench",
      "--container-drawing",
      "--z-index-skip-link",
      "--stroke-width-ink",
      "--stroke-width-proof",
      "--dash-construction",
      "--scroll-margin-anchor",
    ];
    expect([...supplement.keys()].sort()).toEqual(checked.sort());
  });

  it("its only utility applies the construction dash, from its token (Drawing grammar: dashed 6 4)", () => {
    expect(utilities(supplementCss)).toEqual(
      new Map([
        [
          "dash-construction",
          new Map([["stroke-dasharray", "var(--dash-construction)"]]),
        ],
      ]),
    );
  });
});

describe("hand-written source holds no raw colour, duration or z-index (contrib-engineering §4.3)", () => {
  it("catches hex colours, colour functions, durations and a numeric z-index", () => {
    const source = [
      "a { color: #5b3fd0; }",
      "b { background: rgb(0 0 0 / 50%); border-color: oklch(0.5 0.1 270); }",
      "c { transition: color 120ms; animation-delay: .2s; }",
      "d { z-index: 3; }",
      "export const style = { zIndex: 10 };",
    ].join("\n");

    expect(
      findTokenLiterals("probe.css", source).map((finding) => [
        finding.line,
        finding.kind,
        finding.excerpt,
      ]),
    ).toEqual([
      [1, "colour", "#5b3fd0"],
      [2, "colour", "rgb("],
      [2, "colour", "oklch("],
      [3, "duration", "120ms"],
      [3, "duration", ".2s"],
      [4, "z-index", "z-index: 3"],
      [5, "z-index", "zIndex: 1"],
    ]);
  });

  it("ignores anchors, ids, entities and token references", () => {
    const source = [
      'export const a = <a href="#contact" id="add">x</a>;',
      "const entity = '&#123;';",
      "a { color: var(--color-accent); transition-duration: var(--transition-duration-feedback); }",
      "b { z-index: var(--z-index-skip-link); font-size: 1.5rem; }",
      'export const c = "items 2x";',
    ].join("\n");

    expect(findTokenLiterals("probe.tsx", source)).toEqual([]);
  });

  it("holds for every hand-written CSS, TS, TSX and SVG file in src/", () => {
    const files = handWrittenFiles(REPO_ROOT);
    expect(files).toContain("src/app/globals.css");
    expect(files).not.toContain("src/styles/theme.supplement.css");

    const findings = files.flatMap((path) =>
      findTokenLiterals(path, read(path)),
    );
    expect(findings).toEqual([]);
  });
});
