import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  normaliseValue,
  proseValues,
  themeDeclarations,
} from "../support/design-md";
import { PROBE_DIR, probeRule } from "../support/lint-probe";
import { REPO_ROOT } from "../support/repo";
import { buildClasses, everyClass } from "../support/tailwind";

// Tailwind compiles the whole class list once; ESLint loads Tailwind too.
const TIMEOUT = 60_000;

const supplement = themeDeclarations(
  readFileSync(join(REPO_ROOT, "src/styles/theme.supplement.css"), "utf8"),
);

/** Properties that take a length: sizes, spacing, insets, line height. */
const LENGTH =
  /^(?:(?:margin|padding|scroll-margin|scroll-padding|inset)(?:-.+)?|top|right|bottom|left|gap|row-gap|column-gap|(?:min-|max-)?(?:width|height|block-size|inline-size)|flex-basis|text-indent|line-height|columns|--tw-(?:translate-[xyz]|border-spacing-[xy]|leading))$/;

/** The properties that may take each supplement token, by its namespace. */
const ACCEPTS: readonly (readonly [prefix: string, properties: RegExp])[] = [
  ["--text-", /^font-size$/],
  ["--spacing-", LENGTH],
  ["--container-", LENGTH],
  ["--scroll-margin-", /^scroll-margin(?:-.+)?$/],
  ["--stroke-width-", /^stroke-width$/],
  ["--dash-", /^stroke-dasharray$/],
  ["--transition-duration-", /^(?:transition-duration|--tw-duration)$/],
  ["--ease-", /^(?:transition-timing-function|--tw-ease)$/],
  ["--z-index-", /^z-index$/],
  // Breakpoints feed media queries only, never a declaration.
  ["--breakpoint-", /^$/],
];

function acceptedBy(variable: string): RegExp | undefined {
  return ACCEPTS.find(([prefix]) => variable.startsWith(prefix))?.[1];
}

const RESTRICTED = "better-tailwindcss/no-restricted-classes";
const SERVER_COMPONENT = `src/components/${PROBE_DIR}/block.tsx`;

describe(
  "the classes the supplement tokens produce declare valid properties (QA review of Phase 2, I2)",
  { timeout: TIMEOUT },
  () => {
    it("every supplement token has a namespace this test knows", () => {
      expect(
        [...supplement.keys()].filter((name) => !acceptedBy(name)),
      ).toEqual([]);
    });

    it("every class that reads a supplement token declares a property that takes it, or lint bans the class", async () => {
      const classes = await everyClass();
      let reads = 0;
      const invalid: { name: string; property: string; token: string }[] = [];

      for (const [name, css] of classes) {
        for (const [, property = "", value = ""] of css.matchAll(
          /([\w-]+)\s*:\s*([^;{}]+);/g,
        )) {
          for (const [, token = ""] of value.matchAll(/var\((--[\w-]+)/g)) {
            const accepted = supplement.has(token)
              ? acceptedBy(token)
              : undefined;
            if (accepted === undefined) continue;
            reads += 1;
            if (!accepted.test(property))
              invalid.push({ name, property, token });
          }
        }
      }

      expect(reads).toBeGreaterThan(100);
      // Tailwind reads every --stroke-* key as a stroke colour, so the
      // width tokens behind stroke-ink and stroke-proof also make these two.
      expect(invalid.sort((a, b) => a.name.localeCompare(b.name))).toEqual([
        {
          name: "stroke-width-ink",
          property: "stroke",
          token: "--stroke-width-ink",
        },
        {
          name: "stroke-width-proof",
          property: "stroke",
          token: "--stroke-width-proof",
        },
      ]);
      for (const { name } of invalid) {
        const code = `export const Probe = () => <div className="${name}" />;\n`;
        expect(
          await probeRule(RESTRICTED, SERVER_COMPONENT, code),
          name,
        ).toHaveLength(1);
      }
    });

    it("the drawing classes apply DESIGN.md's stroke widths and 6 4 dash", async () => {
      const css = normaliseValue(
        await buildClasses(["stroke-ink", "stroke-proof", "dash-construction"]),
      );
      const { strokes } = proseValues();

      expect(css).toContain(
        ".stroke-ink { stroke-width: var(--stroke-width-ink); }",
      );
      expect(css).toContain(
        ".stroke-proof { stroke-width: var(--stroke-width-proof); }",
      );
      expect(css).toContain(
        ".dash-construction { stroke-dasharray: var(--dash-construction); }",
      );
      expect(css).toContain(`--stroke-width-ink: ${strokes.ink};`);
      expect(css).toContain(`--stroke-width-proof: ${strokes.proof};`);
      expect(css).toContain(`--dash-construction: ${strokes.dash};`);
    });

    it("the zero classes exist and resolve to the 0px token (QA review of Phase 2, M5)", async () => {
      const css = normaliseValue(
        await buildClasses(["min-w-0", "m-0", "gap-0"]),
      );

      expect(css).toContain(".min-w-0 { min-width: var(--spacing-0); }");
      expect(css).toContain(".m-0 { margin: var(--spacing-0); }");
      expect(css).toContain(".gap-0 { gap: var(--spacing-0); }");
      expect(css).toContain("--spacing-0: 0px;");
    });

    it("no class applies the dash as a stroke colour any more", async () => {
      expect(await buildClasses(["stroke-dash"])).not.toContain(".stroke-dash");
    });
  },
);
