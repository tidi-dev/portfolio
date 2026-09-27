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

describe(
  "Tailwind classes are DESIGN.md tokens only (contrib-engineering §4.3)",
  { timeout: TIMEOUT },
  () => {
    const UNKNOWN = "better-tailwindcss/no-unknown-classes";
    const RESTRICTED = "better-tailwindcss/no-restricted-classes";

    function withClasses(classes: string): string {
      return `export const Probe = () => <div className="${classes}" />;\n`;
    }

    it.each([
      // Tailwind's default theme is gone, so its classes are unknown.
      ["bg-red-500", UNKNOWN],
      ["p-4", UNKNOWN],
      ["text-sm", UNKNOWN],
      ["rounded-lg", UNKNOWN],
      ["shadow-md", UNKNOWN],
      ["sm:p-md", UNKNOWN],
      // Escape hatches.
      ["p-[13px]", RESTRICTED],
      ["bg-[#5b3fd0]", RESTRICTED],
      ["[mask-type:alpha]", RESTRICTED],
      ["p-(--spacing-md)", RESTRICTED],
      // Themes swap tokens.
      ["dark:bg-surface", RESTRICTED],
      ["bg-surface-dark", RESTRICTED],
      ["hover:text-accent-hover-dark", RESTRICTED],
      // Typography only through type-*.
      ["text-display", RESTRICTED],
      ["font-body", RESTRICTED],
      ["leading-label-strong", RESTRICTED],
      ["tracking-display", RESTRICTED],
      ["font-stretch-125%", RESTRICTED],
      // Raw numbers where a token exists.
      ["z-100", RESTRICTED],
      ["duration-150", RESTRICTED],
      ["delay-100", RESTRICTED],
      ["stroke-2", RESTRICTED],
      ["ease-linear", RESTRICTED],
      // DESIGN.md and CLAUDE.md bans.
      ["transition-all", RESTRICTED],
      ["bg-accent/10", RESTRICTED],
      ["bg-linear-to-r", RESTRICTED],
      ["from-accent", RESTRICTED],
      // Bare-value and static utilities exist without a theme, so the reset
      // can't remove them (QA review of Phase 2, I1).
      ["rounded-full", RESTRICTED],
      ["rounded-t-full", RESTRICTED],
      ["border-4", RESTRICTED],
      ["border-8", RESTRICTED],
      ["divide-x-4", RESTRICTED],
      ["outline", RESTRICTED],
      ["outline-2", RESTRICTED],
      ["outline-4", RESTRICTED],
      ["outline-offset-8", RESTRICTED],
      ["outline-none", RESTRICTED],
      ["focus-visible:outline-hidden", RESTRICTED],
      ["ring", RESTRICTED],
      ["ring-2", RESTRICTED],
      ["inset-ring-2", RESTRICTED],
      ["opacity-50", RESTRICTED],
      ["scale-105", RESTRICTED],
      ["hover:scale-105", RESTRICTED],
      ["rotate-3", RESTRICTED],
      ["-rotate-3", RESTRICTED],
      ["skew-x-6", RESTRICTED],
      ["grayscale", RESTRICTED],
      ["sepia", RESTRICTED],
      ["brightness-110", RESTRICTED],
      ["underline-offset-4", RESTRICTED],
      ["decoration-4", RESTRICTED],
      ["italic", RESTRICTED],
      ["uppercase", RESTRICTED],
      ["capitalize", RESTRICTED],
      ["leading-none", RESTRICTED],
      ["leading-6", RESTRICTED],
      ["h-screen", RESTRICTED],
      ["min-h-screen", RESTRICTED],
      ["w-screen", RESTRICTED],
      ["transition", RESTRICTED],
    ])("rejects %s (%s)", async (className, ruleId) => {
      const messages = await probeRule(
        ruleId,
        SERVER_COMPONENT,
        withClasses(className),
      );
      expect(messages).toHaveLength(1);
    });

    it("accepts token classes", async () => {
      const classes = [
        "bg-surface text-primary type-body p-md gap-section rounded-base",
        "z-skip-link duration-feedback ease-out transition-colors",
        "md:p-lg lg:gap-gutter @container @bench:flex max-w-bench",
        "stroke-ink scroll-mt-anchor hover:text-accent-hover aspect-16/9",
        // DESIGN.md values among the bare-value utilities stay usable.
        "border border-2 border-0 border-rule rounded-none underline",
        "opacity-0 opacity-100 decoration-1 hover:decoration-2 min-h-dvh",
        "transition-colors transition-opacity transition-transform",
      ].join(" ");
      const code = withClasses(classes);

      expect(await probeRule(UNKNOWN, SERVER_COMPONENT, code)).toEqual([]);
      expect(await probeRule(RESTRICTED, SERVER_COMPONENT, code)).toEqual([]);
    });

    it("reports conflicting classes", async () => {
      expect(
        await probeRule(
          "better-tailwindcss/no-conflicting-classes",
          SERVER_COMPONENT,
          withClasses("p-md p-lg"),
        ),
      ).not.toEqual([]);
    });
  },
);
