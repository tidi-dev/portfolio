import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];

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
  {
    name: "project/no-jsx-literals",
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    rules: {
      "react/jsx-no-literals": [
        "error",
        { noStrings: true, ignoreProps: true },
      ],
    },
  },

  // Client leaves stay small and never reach content, SEO builders or
  // Node built-ins (contrib-engineering §5.1).
  {
    name: "project/client-leaf-imports",
    files: ["src/**/*.client.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/content", "@/content/**"],
              message:
                "Client leaves receive content as props from a Server Component.",
            },
            {
              group: ["@/lib/seo", "@/lib/seo/**"],
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
