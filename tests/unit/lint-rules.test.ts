import { describe, expect, it } from "vitest";
import { PROBE_DIR, probeRule } from "../support/lint-probe";

// ESLint starts once per worker and loads Tailwind; allow for it.
const TIMEOUT = 30_000;

const CLIENT_LEAF = `src/components/${PROBE_DIR}/leaf.client.tsx`;
const SERVER_COMPONENT = `src/components/${PROBE_DIR}/block.tsx`;

function importing(specifier: string): string {
  return [
    `"use client";`,
    `import * as mod from "${specifier}";`,
    `export const probe = mod;`,
    "",
  ].join("\n");
}

describe(
  "client leaves never import content, SEO builders or Node built-ins (contrib-engineering §5.1)",
  { timeout: TIMEOUT },
  () => {
    it.each([
      "@/content/identity",
      "../../content/contact",
      "../content",
      "@/lib/seo/json-ld",
      "../../lib/seo/metadata",
      "node:fs",
      "fs",
      "fs/promises",
      "path",
    ])("flags %s in a *.client.tsx file", async (specifier) => {
      const messages = await probeRule(
        "no-restricted-imports",
        CLIENT_LEAF,
        importing(specifier),
      );
      expect(messages).toHaveLength(1);
    });

    it.each(["react", "@/lib/format/contents", "../../lib/theme/preference"])(
      "allows %s in a *.client.tsx file",
      async (specifier) => {
        expect(
          await probeRule(
            "no-restricted-imports",
            CLIENT_LEAF,
            importing(specifier),
          ),
        ).toEqual([]);
      },
    );

    it("allows content imports in a Server Component", async () => {
      const code = [
        `import * as mod from "../../content/identity";`,
        `export const probe = mod;`,
        "",
      ].join("\n");
      expect(
        await probeRule("no-restricted-imports", SERVER_COMPONENT, code),
      ).toEqual([]);
    });
  },
);

describe(
  "visible and accessible attribute text comes from content (contrib-engineering §5.1)",
  { timeout: TIMEOUT },
  () => {
    function element(attribute: string): string {
      return `export const Probe = () => <img src="/a.png" ${attribute} />;\n`;
    }

    it.each([
      `alt="A developer at a desk"`,
      `aria-label="Open the menu"`,
      `aria-description="Opens in place"`,
      `title="Menu"`,
      `placeholder="Search"`,
      `aria-roledescription="bench"`,
      `aria-valuetext="half"`,
      `aria-placeholder="Search"`,
      `aria-label={"Open the menu"}`,
      "aria-label={`Open the menu`}",
    ])("flags %s", async (attribute) => {
      const messages = await probeRule(
        "no-restricted-syntax",
        SERVER_COMPONENT,
        element(attribute),
      );
      expect(messages).toHaveLength(1);
    });

    it.each([
      `alt=""`,
      `alt={copy.avatar}`,
      `aria-label={copy.menu}`,
      `className="block"`,
      `id="main"`,
    ])("allows %s", async (attribute) => {
      const code = `const copy = { avatar: "", menu: "" };\n${element(attribute)}`;
      expect(
        await probeRule("no-restricted-syntax", SERVER_COMPONENT, code),
      ).toEqual([]);
    });

    it("still flags JSX text", async () => {
      const code = `export const Probe = () => <p>Menu</p>;\n`;
      expect(
        await probeRule("react/jsx-no-literals", SERVER_COMPONENT, code),
      ).toHaveLength(1);
    });
  },
);
