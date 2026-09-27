import { readFileSync } from "node:fs";
import { join } from "node:path";
import { lint, type Finding } from "@google/design.md/linter";
import { describe, expect, it } from "vitest";
import { evaluateDesignLint } from "../../scripts/design/policy";
import { REPO_ROOT } from "../support/repo";

const info: Finding = {
  severity: "info",
  rule: "token-summary",
  message: "summary",
};
const warning: Finding = {
  severity: "warning",
  rule: "orphaned-tokens",
  path: "colors.spare",
  message: "unused",
};
const error: Finding = {
  severity: "error",
  rule: "broken-ref",
  path: "components.page",
  message: "broken",
};

describe("design:lint warning policy (contrib-engineering §9.1)", () => {
  it("passes on infos alone", () => {
    expect(evaluateDesignLint([info], []).passed).toBe(true);
  });

  it("fails on any error, even when its rule is allowlisted", () => {
    const verdict = evaluateDesignLint(
      [error],
      [{ rule: "broken-ref", reason: "test" }],
    );
    expect(verdict.passed).toBe(false);
    expect(verdict.errors).toEqual([error]);
  });

  it("fails on a warning that is not allowlisted", () => {
    const verdict = evaluateDesignLint([warning], []);
    expect(verdict.passed).toBe(false);
    expect(verdict.warnings).toEqual([warning]);
  });

  it("passes a warning allowlisted by rule, or by rule and path", () => {
    for (const entry of [
      { rule: "orphaned-tokens", reason: "test" },
      { rule: "orphaned-tokens", path: "colors.spare", reason: "test" },
    ]) {
      const verdict = evaluateDesignLint([warning], [entry]);
      expect(verdict.passed).toBe(true);
      expect(verdict.allowedWarnings).toEqual([warning]);
    }
  });

  it("does not match an allowlist entry for another path", () => {
    const verdict = evaluateDesignLint(
      [warning],
      [{ rule: "orphaned-tokens", path: "colors.other", reason: "test" }],
    );
    expect(verdict.passed).toBe(false);
  });

  it("DESIGN.md lints with 0 errors and 0 warnings", () => {
    const report = lint(readFileSync(join(REPO_ROOT, "DESIGN.md"), "utf8"));
    const verdict = evaluateDesignLint(report.findings, []);

    expect(verdict.errors).toEqual([]);
    expect(verdict.warnings).toEqual([]);
    expect(verdict.passed).toBe(true);
  });
});
