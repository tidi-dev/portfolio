import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { BUDGETS } from "../e2e/support/budgets";
import { REPO_ROOT } from "../support/repo";

const Assertion = z.tuple([
  z.enum(["error", "warn"]),
  z.looseObject({
    aggregationMethod: z.enum(["median", "median-run"]),
    minScore: z.number().optional(),
    maxNumericValue: z.number().optional(),
  }),
]);

const LhciConfig = z.object({
  ci: z.object({
    collect: z.object({
      startServerCommand: z.string(),
      url: z.array(z.string()).nonempty(),
      numberOfRuns: z.number(),
      settings: z.object({ preset: z.string() }).optional(),
    }),
    assert: z.object({ assertions: z.record(z.string(), Assertion) }),
    upload: z.object({ target: z.string(), outputDir: z.string() }),
  }),
});

function load(file: string) {
  return LhciConfig.parse(
    JSON.parse(readFileSync(join(REPO_ROOT, file), "utf8")) as unknown,
  );
}

const mobile = load("lighthouserc.json");
const desktop = load("lighthouserc.desktop.json");

describe("Lighthouse CI config (P1-3)", () => {
  it.each([
    ["mobile", mobile],
    ["desktop", desktop],
  ])(
    "%s runs 3 times, sets median-run on every assertion and uploads to the filesystem",
    (_name, config) => {
      expect(config.ci.collect.numberOfRuns).toBe(3);
      for (const [, options] of Object.values(config.ci.assert.assertions)) {
        expect(options.aggregationMethod).toBe("median-run");
      }
      expect(config.ci.upload.target).toBe("filesystem");
    },
  );

  it("uses Lighthouse's default mobile profile and the desktop preset", () => {
    expect(mobile.ci.collect.settings).toBeUndefined();
    expect(desktop.ci.collect.settings?.preset).toBe("desktop");
  });

  it("asserts the same budgets for mobile and desktop", () => {
    expect(desktop.ci.assert.assertions).toEqual(mobile.ci.assert.assertions);
  });

  it("keeps separate report folders", () => {
    expect(mobile.ci.upload.outputDir).not.toBe(desktop.ci.upload.outputDir);
  });

  it("uses the same byte budgets as the budget spec", () => {
    const max = (audit: string) =>
      mobile.ci.assert.assertions[audit]?.[1].maxNumericValue;

    expect(max("resource-summary:script:size")).toBe(BUDGETS.scriptBytes);
    expect(max("resource-summary:stylesheet:size")).toBe(
      BUDGETS.stylesheetBytes,
    );
    expect(max("resource-summary:font:size")).toBe(BUDGETS.fontBytes);
    expect(max("resource-summary:document:size")).toBe(BUDGETS.documentBytes);
    expect(max("resource-summary:third-party:count")).toBe(
      BUDGETS.thirdPartyRequests,
    );
  });
});
