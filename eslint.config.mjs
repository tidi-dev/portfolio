import { builtinModules } from "node:module";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];

// Bare built-in specifiers (`fs`, `fs/promises`, `path`); `node:*` is a pattern.
const NODE_BUILTINS = builtinModules.filter((name) => !name.startsWith("_"));

// JSX attributes whose value is shown or announced (an esquery regex).
const TEXT_ATTRIBUTES =
  "/^(alt|title|placeholder|aria-label|aria-description|aria-roledescription|aria-valuetext|aria-placeholder)$/";

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

  // Tailwind class correctness. Phase 2 tightens this to token-only classes.
  {
    name: "project/better-tailwindcss",
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "better-tailwindcss": betterTailwindcss },
    settings: {
      "better-tailwindcss": { entryPoint: "src/app/globals.css" },
    },
    rules: betterTailwindcss.configs["correctness-error"].rules,
  },

  prettier,
]);
