import { builtinModules } from "node:module";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import designTokens from "./src/styles/tokens.generated.json" with { type: "json" };

const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];

// Bare built-in specifiers (`fs`, `fs/promises`, `path`); `node:*` is a pattern.
const NODE_BUILTINS = builtinModules.filter((name) => !name.startsWith("_"));

// JSX attributes whose value is shown or announced (an esquery regex).
const TEXT_ATTRIBUTES =
  "/^(alt|title|placeholder|aria-label|aria-description|aria-roledescription|aria-valuetext|aria-placeholder)$/";

// Token names come from the DTCG export of DESIGN.md (`pnpm tokens`), so the
// class restrictions follow DESIGN.md without a hand-kept list.
const tokenNames = (group) =>
  Object.keys(group).filter((name) => !name.startsWith("$"));
const alternatives = (names) =>
  names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
const COLOURS = tokenNames(designTokens.color);
const DARK_COLOURS = COLOURS.filter((name) => name.endsWith("-dark"));
const TYPOGRAPHY = tokenNames(designTokens.typography);
// Any variant chain and an optional important marker, before the utility.
const VARIANTS = "^(?:[^:]+:)*!?";
const END = "!?$";

/** Regexes over each full class, variants included, with the reason. */
const TOKEN_CLASS_RESTRICTIONS = [
  {
    pattern: "[\\[\\]()]",
    message:
      "Arbitrary values, properties and variants bypass DESIGN.md tokens: use a token class.",
  },
  {
    pattern: "(?:^|:)dark:",
    message:
      "Themes swap tokens (DESIGN.md → Consistency locks 1): never use the dark: variant.",
  },
  {
    pattern: `-(?:${alternatives(DARK_COLOURS)})(?:/\\S+)?${END}`,
    message:
      "Dark values come from the token swap in theme.generated.css: never use a *-dark class.",
  },
  {
    pattern: `${VARIANTS}(?:font|text|leading|tracking)-(?:${alternatives(TYPOGRAPHY)})${END}`,
    message:
      "Typography comes only through the type-* utilities (DESIGN.md → Typography).",
  },
  {
    pattern: `${VARIANTS}font-stretch-`,
    message:
      "Width comes only through the type-* utilities (DESIGN.md → Typography).",
  },
  {
    pattern: `${VARIANTS}-?(?:z|duration|delay|stroke)-\\d`,
    message:
      "Use the named token (z-skip-link, duration-<token>, stroke-ink, stroke-proof), never a raw number.",
  },
  {
    pattern: `${VARIANTS}ease-(?:linear|initial)${END}`,
    message: "Easings come from the Motion tokens: ease-out or ease-in-out.",
  },
  {
    pattern: `${VARIANTS}transition-all${END}`,
    message:
      "Never transition all (CLAUDE.md → Motion): list the properties, e.g. transition-colors.",
  },
  {
    pattern: `-(?:${alternatives(COLOURS)})/`,
    message:
      "Opacity modifiers make tints, which DESIGN.md → Colors bans: use the colour token itself.",
  },
  {
    pattern: `${VARIANTS}(?:bg-(?:linear|radial|conic)|from|via|to)-`,
    message: "DESIGN.md → Colors: no gradients.",
  },
];

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
    "coverage/**",
    ".lighthouseci/**",
  ]),

  js.configs.recommended,
  ...nextVitals,
  ...nextTypescript,

  // jsx-a11y strict. eslint-config-next already registers the plugin
  // (the same 6.10.2), so only the preset's rules are applied here.
  { name: "project/jsx-a11y-strict", rules: jsxA11y.flatConfigs.strict.rules },

  // typescript-eslint, type-checked, on TypeScript files only.
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: TS_FILES,
  })),
  {
    name: "project/type-aware-parser",
    files: TS_FILES,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Every visible string comes from src/content (contrib-engineering §5.1).
  // `ignoreProps` keeps className and other non-text props usable, so the
  // attributes that carry visible or announced text are banned separately.
  // An empty `alt=""` (a decorative image) is not text and stays allowed.
  {
    name: "project/no-jsx-literals",
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    rules: {
      "react/jsx-no-literals": [
        "error",
        { noStrings: true, ignoreProps: true },
      ],
      "no-restricted-syntax": [
        "error",
        ...[
          `JSXAttribute[name.name=${TEXT_ATTRIBUTES}] > Literal[value=/./]`,
          `JSXAttribute[name.name=${TEXT_ATTRIBUTES}] > JSXExpressionContainer > Literal[value=/./]`,
          `JSXAttribute[name.name=${TEXT_ATTRIBUTES}] > JSXExpressionContainer > TemplateLiteral`,
        ].map((selector) => ({
          selector,
          message:
            "Visible and accessible text comes from src/content (copy.ts), never a literal.",
        })),
      ],
    },
  },

  // Client leaves stay small and never reach content, SEO builders or
  // Node built-ins (contrib-engineering §5.1). The regexes match the alias
  // and relative forms alike (`@/content/…`, `../../content/…`).
  {
    name: "project/client-leaf-imports",
    files: ["src/**/*.client.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: NODE_BUILTINS.map((name) => ({
            name,
            message: "Node built-ins never ship to the browser.",
          })),
          patterns: [
            {
              regex: "(^@/|/)content(/|$)",
              message:
                "Client leaves receive content as props from a Server Component.",
            },
            {
              regex: "(^@/|/)lib/seo(/|$)",
              message: "SEO builders run on the server only.",
            },
            {
              group: ["node:*"],
              message: "Node built-ins never ship to the browser.",
            },
          ],
        },
      ],
    },
  },

  // Token-only Tailwind classes (contrib-engineering §4.3). theme-reset.css
  // removes Tailwind's default theme, so any class that isn't a DESIGN.md
  // token is unknown; the restrictions close the remaining escape hatches.
  {
    name: "project/better-tailwindcss",
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "better-tailwindcss": betterTailwindcss },
    settings: {
      "better-tailwindcss": { entryPoint: "src/app/globals.css" },
    },
    rules: {
      ...betterTailwindcss.configs["correctness-error"].rules,
      "better-tailwindcss/no-restricted-classes": [
        "error",
        { restrict: TOKEN_CLASS_RESTRICTIONS },
      ],
    },
  },

  prettier,
]);
