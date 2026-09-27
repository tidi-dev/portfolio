import { expect, test } from "./fixtures";
import { BUDGETS, FRAMEWORK_FLOOR_BYTES } from "./support/budgets";
import { recordNetwork, summariseNetwork } from "./support/network-log";

// contrib-engineering §8.2: Next 16 no longer prints first-load JS, so the
// budget is measured on the network. Fresh context, cold cache, production
// build under `next start` (gzip), until network idle.
// The not-found route joins in Phase 11 (app/not-found.tsx).
const ROUTES: readonly string[] = ["/"];

function slug(route: string): string {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

for (const route of ROUTES) {
  test(`first load of ${route} stays within the byte budgets`, async ({
    page,
    origin,
  }, testInfo) => {
    const log = recordNetwork(page, origin);

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const summary = summariseNetwork(await log.settle());
    const appOwnedScriptBytes = summary.script.bytes - FRAMEWORK_FLOOR_BYTES;

    const kB = (bytes: number) => (bytes / 1000).toFixed(1);
    console.log(
      [
        `budget ${route}:`,
        `first-load JS ${String(summary.script.bytes)} B gzip (${kB(summary.script.bytes)} kB, ${String(summary.script.count)} files, ${String(summary.script.uncompressedCount)} uncompressed)`,
        `framework floor ${String(FRAMEWORK_FLOOR_BYTES)} B (${kB(FRAMEWORK_FLOOR_BYTES)} kB)`,
        `app-owned JS ${String(appOwnedScriptBytes)} B`,
        `CSS ${String(summary.stylesheet.bytes)} B`,
        `fonts ${String(summary.font.bytes)} B in ${String(summary.font.count)} files`,
        `document ${String(summary.document.bytes)} B`,
        `third-party requests ${String(summary.thirdPartyRequests)}`,
      ].join(" | "),
    );
    await testInfo.attach(`budget-${slug(route)}.json`, {
      body: JSON.stringify({ route, summary, appOwnedScriptBytes }, null, 2),
      contentType: "application/json",
    });

    expect(summary.script.bytes).toBeLessThanOrEqual(BUDGETS.scriptBytes);
    expect(appOwnedScriptBytes).toBeLessThanOrEqual(
      BUDGETS.appOwnedScriptBytes,
    );
    expect(summary.stylesheet.bytes).toBeLessThanOrEqual(
      BUDGETS.stylesheetBytes,
    );
    expect(summary.font.bytes).toBeLessThanOrEqual(BUDGETS.fontBytes);
    expect(summary.font.count).toBeLessThanOrEqual(BUDGETS.fontFiles);
    expect(summary.document.bytes).toBeLessThanOrEqual(BUDGETS.documentBytes);
    expect(summary.thirdPartyRequests).toBe(BUDGETS.thirdPartyRequests);
  });
}
