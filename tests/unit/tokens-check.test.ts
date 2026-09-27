import { rmSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkFreshness } from "../../scripts/lib/freshness";
import { buildTheme } from "../../scripts/tokens/theme";
import { generateTokenFiles, TOKEN_FILES } from "../../scripts/tokens/outputs";
import { readDesignMd } from "../support/design-md";
import { REPO_ROOT } from "../support/repo";

// The design.md CLI runs twice per generation.
const TIMEOUT = 30_000;

describe(
  "tokens:check (contrib-engineering §4.4, contrib-verification G11)",
  { timeout: TIMEOUT },
  () => {
    const designMd = readDesignMd();

    it("the committed token files equal a fresh generation from DESIGN.md", () => {
      const report = checkFreshness(
        REPO_ROOT,
        generateTokenFiles(designMd),
        "tokens-test",
      );
      expect(report.missing).toEqual([]);
      expect(report.stale).toEqual([]);
    });

    it("reports every affected file as stale after an unregenerated DESIGN.md edit", () => {
      const edited = designMd.replace(
        'accent-dark: "#B7A6FF"',
        'accent-dark: "#B8A6FF"',
      );
      expect(edited).not.toBe(designMd);

      const report = checkFreshness(
        REPO_ROOT,
        generateTokenFiles(edited),
        "tokens-test",
      );
      if (report.freshDirectory !== undefined) {
        rmSync(report.freshDirectory, { recursive: true, force: true });
      }
      expect(report.stale).toEqual([
        TOKEN_FILES.css,
        TOKEN_FILES.dtcg,
        TOKEN_FILES.theme,
      ]);
    });

    it("the theme generator refuses a colour without a -dark twin", () => {
      const edited = designMd.replace(
        '  rule: "#D9DAE2"',
        '  rule: "#D9DAE2"\n  spare: "#101010"',
      );
      expect(() => buildTheme(edited)).toThrow(
        /colors\.spare has no spare-dark twin/,
      );
    });

    it("the theme generator refuses a second font family", () => {
      const edited = designMd.replace(
        "wordmark: { fontFamily: Archivo,",
        "wordmark: { fontFamily: Inter,",
      );
      expect(() => buildTheme(edited)).toThrow(
        /fontFamily "Inter" has no web font/,
      );
    });
  },
);
