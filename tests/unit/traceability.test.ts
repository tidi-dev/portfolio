import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { structuralId, Text } from "@/content/schema/primitives";
import {
  AllowlistEntry,
  loadAllowlist,
} from "../support/content-trace/allowlist";
import { corpusLines } from "../support/content-trace/corpus";
import { normalise } from "../support/content-trace/normalise";
import { walkLeaves } from "../support/content-trace/structural";
import {
  collectContentLeaves,
  findUntraced,
  tracesNumber,
  tracesString,
} from "../support/content-trace/trace";
import { REPO_ROOT } from "../support/repo";

// A miniature info.md with the same structure as the real one.
const FIXTURE_INFO_MD = [
  "# Owner information",
  "> Header note: never part of the corpus.",
  "## Identity",
  "- Role / title (owner, answer.md): **Full-stack Developer**",
  "### Visual assets (in this repo, provided by the owner)",
  '- Profile alt text: "Illustrated avatar of a developer".',
  '- Text: "STATUS accepting quests".',
  "## Projects",
  "### botmivivi (Side, live in production)",
  "- Stack (profile): NestJS · Prisma · PostgreSQL",
  '- Usage: "646 customers, 2951 orders"',
  "## Site preferences",
  "- Domain (owner, answer.md): **example.dev**",
  "## Approved copy",
  "| Key | Text | Approved |",
  "|---|---|---|",
  "| cta.label | Bring the constraints | 2026-09-28 |",
  "## Open questions",
  "- Should we add a blog?",
  "## Not included",
  "- **Travel and photography as interests:** declined.",
].join("\n");

describe("content trace (contrib-verification §5.2, §5.4)", () => {
  describe("normalise", () => {
    it("folds curly quotes, the ellipsis, whitespace, case and digit grouping", () => {
      expect(normalise("  “Can’t”  leave…\n 2,951 ")).toBe(
        '"can\'t" leave... 2951',
      );
    });

    it("composes Vietnamese letters to NFC", () => {
      expect(normalise("Hồ Trọng Đại")).toBe("hồ trọng đại");
    });

    it("strips list, heading, bold and code markers", () => {
      expect(normalise("- **Title:** `Full-stack Developer`")).toBe(
        "title: full-stack developer",
      );
      expect(normalise("### Quest")).toBe("quest");
    });
  });

  describe("corpus", () => {
    const corpus = corpusLines(FIXTURE_INFO_MD);

    it("includes the content sections and their subheadings", () => {
      expect(corpus).toContain(
        "role / title (owner, answer.md): full-stack developer",
      );
      expect(corpus).toContain("botmivivi (side, live in production)");
    });

    it("excludes the header notes, Site preferences, Open questions and Not included", () => {
      const joined = corpus.join("\n");
      expect(joined).not.toContain("header note");
      expect(joined).not.toContain("example.dev");
      expect(joined).not.toContain("blog");
      expect(joined).not.toContain("travel and photography");
    });

    it("keeps only the avatar alt text from Visual assets", () => {
      expect(corpus).toContain("illustrated avatar of a developer");
      expect(corpus.join("\n")).not.toContain("accepting quests");
    });

    it("splits Approved copy rows into cells and drops the header row", () => {
      expect(corpus).toContain("bring the constraints");
      expect(corpus).not.toContain("text");
      expect(corpus).not.toContain("---");
    });
  });

  describe("tracing", () => {
    const corpus = corpusLines(FIXTURE_INFO_MD);
    const allowlist = ["menu"];

    it("traces a verbatim fragment", () => {
      expect(tracesString("Full-stack Developer", corpus, allowlist)).toBe(
        true,
      );
      expect(tracesString("Prisma", corpus, allowlist)).toBe(true);
    });

    it("rejects an invented string", () => {
      expect(
        tracesString("Principal engineer at a unicorn", corpus, allowlist),
      ).toBe(false);
    });

    it("rejects a string joined across a middot boundary", () => {
      expect(tracesString("NestJS Prisma", corpus, allowlist)).toBe(false);
    });

    it("rejects a short token that only occurs inside a longer word", () => {
      const lines = corpusLines(
        "## Identity\n- Language: English only\n- Scale: 13 services\n",
      );
      expect(tracesString("en", lines, [])).toBe(false);
      expect(tracesString("vi", lines, [])).toBe(false);
      expect(tracesString("English", lines, [])).toBe(true);
      expect(tracesString("13 services", lines, [])).toBe(true);
    });

    it("matches punctuation edges as written", () => {
      const lines = corpusLines(
        "## Contact & links\n- GitHub (résumé): https://github.com/tidi-dev\n",
      );
      expect(tracesString("github.com/tidi-dev", lines, [])).toBe(true);
      expect(tracesString("ithub.com", lines, [])).toBe(false);
    });

    it("rejects an empty or blank string", () => {
      expect(tracesString("", corpus, allowlist)).toBe(false);
      expect(tracesString("   ", corpus, allowlist)).toBe(false);
    });

    it("rejects strings that exist only in excluded sections", () => {
      expect(tracesString("example.dev", corpus, allowlist)).toBe(false);
      expect(tracesString("accepting quests", corpus, allowlist)).toBe(false);
    });

    it("accepts an allowlisted string, compared after normalisation", () => {
      expect(tracesString("Menu", corpus, allowlist)).toBe(true);
    });

    it("traces numbers as whole tokens, ignoring digit grouping", () => {
      expect(tracesNumber(2951, corpus)).toBe(true);
      expect(tracesNumber(646, corpus)).toBe(true);
      expect(tracesNumber(295, corpus)).toBe(false);
      expect(tracesNumber(29510, corpus)).toBe(false);
    });

    it("skips structural leaves, which the schema marks as non-visible keys", () => {
      expect(
        findUntraced(
          [
            {
              path: "sections[0].id",
              value: "quest-journal",
              structural: true,
            },
            {
              path: "sections[0].label",
              value: "Quest journal",
              structural: false,
            },
          ],
          corpus,
          allowlist,
        ),
      ).toEqual([
        {
          path: "sections[0].label",
          value: "Quest journal",
          structural: false,
        },
      ]);
    });

    it("reports each untraced leaf with its path", () => {
      expect(
        findUntraced(
          [
            { path: "projects.stack[0]", value: "NestJS" },
            { path: "projects.team", value: "Staff of 40" },
            { path: "projects.orders", value: 2951 },
            { path: "projects.users", value: 9999 },
          ],
          corpus,
          allowlist,
        ),
      ).toEqual([
        { path: "projects.team", value: "Staff of 40" },
        { path: "projects.users", value: 9999 },
      ]);
    });
  });

  describe("allowlist", () => {
    it("the schema rejects an entry that lacks a source (P1-5)", () => {
      const result = AllowlistEntry.safeParse({
        text: "Menu",
        added: "2026-09-28",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual(
        ["source"],
      );
    });

    it("the schema rejects an entry with a blank text or a malformed date", () => {
      expect(
        AllowlistEntry.safeParse({
          text: " ",
          source: "x",
          added: "2026-09-28",
        }).success,
      ).toBe(false);
      expect(
        AllowlistEntry.safeParse({
          text: "Menu",
          source: "x",
          added: "28/09/2026",
        }).success,
      ).toBe(false);
    });

    it("the committed allowlist is valid", () => {
      expect(() => loadAllowlist()).not.toThrow();
    });
  });

  describe("the real info.md", () => {
    const corpus = corpusLines(
      readFileSync(join(REPO_ROOT, "info.md"), "utf8"),
    );

    it("traces facts from its content sections", () => {
      for (const fact of [
        "Full-stack Developer",
        "Hồ Trọng Đại",
        "still learning, always solving.",
        "Illustrated avatar of TiDi coding, gaming, playing football and drinking coffee",
        "https://t.me/tidi1321",
      ]) {
        expect(tracesString(fact, corpus, []), fact).toBe(true);
      }
    });

    it("does not trace banner-only or declined strings", () => {
      for (const text of ["accepting quests", "Travel and photography"]) {
        expect(tracesString(text, corpus, []), text).toBe(false);
      }
    });
  });

  describe("structural keys are marked in the schema (ruling: Phase 3 trace rules)", () => {
    const Sheet = z.strictObject({
      id: structuralId("sheet key"),
      title: Text,
      refs: z.array(structuralId("sheet reference")).optional(),
      body: z.union([
        z.strictObject({ kind: structuralId("body kind"), text: Text }),
        z.strictObject({ count: z.number() }),
      ]),
    });

    it("marks leaves under a registered schema structural and every other leaf visible", () => {
      const value = {
        id: "cyberrock",
        title: "CyberRock",
        refs: ["quest", "scania"],
        body: { kind: "bullets", text: "Chip lifecycle" },
      };
      expect(walkLeaves(Sheet, value, "sheet")).toEqual([
        { path: "sheet.id", value: "cyberrock", structural: true },
        { path: "sheet.title", value: "CyberRock", structural: false },
        { path: "sheet.refs[0]", value: "quest", structural: true },
        { path: "sheet.refs[1]", value: "scania", structural: true },
        { path: "sheet.body.kind", value: "bullets", structural: true },
        { path: "sheet.body.text", value: "Chip lifecycle", structural: false },
      ]);
    });

    it("follows the union option that matches the value, and skips absent optional keys", () => {
      expect(
        walkLeaves(Sheet, { id: "a", title: "T", body: { count: 3 } }, "s"),
      ).toEqual([
        { path: "s.id", value: "a", structural: true },
        { path: "s.title", value: "T", structural: false },
        { path: "s.body.count", value: 3, structural: false },
      ]);
    });

    it("refuses schemas that could change what a module wrote", () => {
      expect(() =>
        walkLeaves(z.object({ a: Text }), { a: "x" }, "loose"),
      ).toThrow("loose: content objects must be strict (z.strictObject)");
      expect(() =>
        walkLeaves(
          z.string().transform((text) => text.trim()),
          " x",
          "piped",
        ),
      ).toThrow('piped: unsupported schema type "pipe"');
      expect(() =>
        walkLeaves(
          z.strictObject({ a: Text.default("x") }),
          { a: "x" },
          "defaulted",
        ),
      ).toThrow('defaulted.a: unsupported schema type "default"');
    });
  });

  describe("the whole pipeline on a fixture module (tests/fixtures/content-trace)", () => {
    const corpus = corpusLines(FIXTURE_INFO_MD);

    it("reports the invented string with its path, exempts the structural key and flags the unregistered export", async () => {
      const scan = await collectContentLeaves(
        join(REPO_ROOT, "tests", "fixtures", "content-trace"),
      );

      expect(scan.modules).toBe(1);
      expect(scan.exports).toBe(2);
      expect(scan.unregistered).toEqual(["sample.ts:loose"]);
      expect(scan.leaves).toContainEqual({
        path: "sample.ts:sample.id",
        value: "made-up-key",
        structural: true,
      });
      expect(findUntraced(scan.leaves, corpus, [])).toEqual([
        {
          path: "sample.ts:sample.title",
          value: "Principal engineer at a unicorn",
          structural: false,
        },
      ]);
    });
  });

  describe("the committed allowlist carries the site configuration (ruling: Phase 3 trace rules)", () => {
    const entries = loadAllowlist();

    it.each([
      ["https://daiho.dev", "Site preferences → Domain"],
      ["en", "Site preferences → Language"],
    ])("%s, sourced from info.md → %s", (text, source) => {
      const entry = entries.find((candidate) => candidate.text === text);
      expect(entry?.source).toContain(`info.md → ${source}`);
    });
  });

  it("every visible string and number leaf in src/content/ traces to info.md or the allowlist", async () => {
    const directory = join(REPO_ROOT, "src", "content");
    const corpus = corpusLines(
      readFileSync(join(REPO_ROOT, "info.md"), "utf8"),
    );
    const allowlist = loadAllowlist().map((entry) => entry.text);
    const { modules, exports, leaves, unregistered } =
      await collectContentLeaves(directory);
    const visible = leaves.filter((leaf) => !leaf.structural);

    console.info(
      `content trace: ${String(modules)} modules, ${String(exports)} exports, ${String(visible.length)} visible leaves checked, ${String(leaves.length - visible.length)} structural leaves exempt`,
    );

    // QA minor M5: the trace must never pass on no content.
    expect(existsSync(directory)).toBe(true);
    expect(modules).toBeGreaterThan(0);
    expect(visible.length).toBeGreaterThan(0);

    expect(unregistered).toEqual([]);
    expect(findUntraced(leaves, corpus, allowlist)).toEqual([]);
  });
});
