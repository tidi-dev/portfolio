import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AllowlistEntry,
  loadAllowlist,
} from "../support/content-trace/allowlist";
import { corpusLines } from "../support/content-trace/corpus";
import { normalise } from "../support/content-trace/normalise";
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

  it("every string and number leaf in src/content/ traces to info.md or the allowlist", async () => {
    const corpus = corpusLines(
      readFileSync(join(REPO_ROOT, "info.md"), "utf8"),
    );
    const allowlist = loadAllowlist().map((entry) => entry.text);
    const { modules, leaves } = await collectContentLeaves(
      join(REPO_ROOT, "src", "content"),
    );

    console.info(
      `content trace: ${String(modules)} modules, ${String(leaves.length)} leaves checked`,
    );
    expect(findUntraced(leaves, corpus, allowlist)).toEqual([]);
  });
});
