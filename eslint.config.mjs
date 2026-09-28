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

// The only place three, React Three Fiber and postprocessing may be
// imported (contrib-engineering §5.1).
const SCENES = "src/components/holo/scenes/**";

// The only client leaves that may import Motion (contrib-engineering §9.2).
const MOTION_LEAVES = "src/components/quest-journal/*.client.tsx";

// Bare built-in specifiers (`fs`, `fs/promises`, `path`); `node:*` is a pattern.
const NODE_BUILTINS = builtinModules.filter((name) => !name.startsWith("_"));

// JSX attributes whose value is shown or announced (an esquery regex).
const TEXT_ATTRIBUTES =
  "/^(alt|title|placeholder|aria-label|aria-description|aria-roledescription|aria-valuetext|aria-placeholder)$/";

const THREE_IMPORTS = {
  regex: "^(three|postprocessing|@react-three/.+)(/|$)",
  message:
    "3D code lives only in src/components/holo/scenes/, reached through next/dynamic (contrib-engineering §5.1).",
};
const MOTION_IMPORTS = {
  regex: "^(motion|framer-motion)(/|$)",
  message:
    "Motion is used only in the Quest journal's client leaves (contrib-engineering §9.2).",
};
const CONTENT_IMPORTS = {
  regex: "(^@/|/)content(/|$)",
  message: "Client leaves receive content as props from a Server Component.",
};
const NODE_IMPORTS = {
  group: ["node:*"],
  message: "Node built-ins never ship to the browser.",
};
const NODE_PATHS = NODE_BUILTINS.map((name) => ({
  name,
  message: "Node built-ins never ship to the browser.",
}));

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
      "Arbitrary values, properties and variants bypass DESIGN.md tokens: use a token class or a theme.css utility.",
  },
  {
    pattern: "(?:^|:)dark:",
    message:
      "Themes swap tokens (DESIGN.md → Consistency locks 1): never use the dark: variant.",
  },
  {
    pattern: `-(?:${alternatives(DARK_COLOURS)})(?:/\\S+)?${END}`,
    message:
      "Dark values come from the token swap in theme.css: never use a *-dark class.",
  },
  {
    pattern: `-(?:${alternatives(COLOURS)})/`,
    message:
      "Translucent layers (glass, scrims, glows) are named utilities in theme.css, from DESIGN.md → Elevation: no ad hoc opacity modifiers.",
  },
  {
    pattern: `${VARIANTS}(?:font|text|leading|tracking)-(?:${alternatives(TYPOGRAPHY)})${END}`,
    message:
      "Typography comes only through the type-* utilities (DESIGN.md → Typography).",
  },
  {
    pattern: `${VARIANTS}(?:font-stretch-|italic${END}|uppercase${END}|capitalize${END}|leading-(?:none|\\d+)${END})`,
    message:
      "DESIGN.md → Typography: width, case and line height come only from the type-* utilities; no italics.",
  },
  {
    pattern: `${VARIANTS}-?(?:z|duration|delay)-\\d`,
    message:
      "Use the named token (z-hud, duration-feedback, delay-xp), never a raw number.",
  },
  {
    pattern: `${VARIANTS}transition(?:-all)?${END}`,
    message:
      "Never transition all (CLAUDE.md → Motion): list the properties, e.g. transition-colors or a theme.css transition utility.",
  },
  {
    pattern: `${VARIANTS}rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-full${END}`,
    message:
      "DESIGN.md → Consistency locks 3: chamfer, 0 radius (rounded-none).",
  },
  {
    pattern: `${VARIANTS}outline(?:-(?:none|hidden|\\d+)|-offset-\\d+)?${END}`,
    message:
      "The focus ring is the global :focus-visible outline (DESIGN.md → Skip link and focus ring): never restyle or remove it.",
  },
  {
    pattern: `${VARIANTS}(?:inset-)?ring(?:-\\d+)?${END}`,
    message:
      "Rings are box shadows, and DESIGN.md has none (Elevation: light and glass, never drop shadows).",
  },
  {
    pattern: `${VARIANTS}(?:min-|max-)?[hw]-screen${END}`,
    message: "CLAUDE.md → Responsive: min-h-dvh, never h-screen or w-screen.",
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

  // Every visible string comes from src/content (contrib-engineering §9.2).
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

  // Import boundaries (contrib-engineering §5.1, §9.2). Flat config replaces
  // a rule's options per matching block, so each block lists every pattern
  // that applies to its files. The regexes match the alias and relative
  // forms alike (`@/content/…`, `../../content/…`).
  {
    name: "project/imports-server",
    files: ["src/**/*.{ts,tsx}"],
    ignores: [SCENES],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [THREE_IMPORTS, MOTION_IMPORTS] },
      ],
    },
  },
  {
    name: "project/imports-client-leaves",
    files: ["src/**/*.client.tsx"],
    ignores: [MOTION_LEAVES],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: NODE_PATHS,
          patterns: [
            THREE_IMPORTS,
            MOTION_IMPORTS,
            CONTENT_IMPORTS,
            NODE_IMPORTS,
          ],
        },
      ],
    },
  },
  {
    name: "project/imports-motion-leaves",
    files: [MOTION_LEAVES],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: NODE_PATHS,
          patterns: [THREE_IMPORTS, CONTENT_IMPORTS, NODE_IMPORTS],
        },
      ],
    },
  },
  {
    name: "project/imports-scenes",
    files: [SCENES],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: NODE_PATHS,
          patterns: [MOTION_IMPORTS, CONTENT_IMPORTS, NODE_IMPORTS],
        },
      ],
    },
  },

  // Token-only Tailwind classes (contrib-engineering §4.3). The reset in
  // theme.css removes Tailwind's default theme, so every theme-driven class
  // that isn't a DESIGN.md token is unknown (`bg-red-500`, `p-4`). The
  // restrictions close the escape hatches and ban bare-value utilities
  // that break DESIGN.md.
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
