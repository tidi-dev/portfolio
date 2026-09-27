import { defineConfig, devices } from "@playwright/test";

// Always the production build (`pnpm build` first), on a port no dev server uses.
const PORT = 3100;
const BASE_URL = `http://localhost:${String(PORT)}`;

// The budget spec measures bytes, which do not depend on the browser: it runs
// once, in chromium-desktop. The owner deferred the performance budget on
// 2026-09-28 ("skip performance budget ... for now"), so it is left out of
// `pnpm test:e2e` and runs only through `pnpm test:budget` until the main
// session re-enables it.
const BUDGET_SPEC = /budget\.spec\.ts$/;
const RUN_BUDGET = process.env.RUN_BUDGET === "1";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // Zero retries: a flaky test is a bug to root-cause (contrib-verification §1.3).
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm start --port ${String(PORT)}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: RUN_BUDGET ? [] : [BUDGET_SPEC],
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"] },
      testIgnore: [BUDGET_SPEC],
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 15"] },
      testIgnore: [BUDGET_SPEC],
    },
    {
      // Firefox runs the layout and keyboard specs (ruling in docs/progress.md),
      // plus the harness self-tests, so the guards those specs rely on are
      // proven in Gecko too.
      name: "firefox-desktop",
      use: { ...devices["Desktop Firefox"] },
      testMatch: [
        /layout\.spec\.ts$/,
        /keyboard\.spec\.ts$/,
        /harness\.spec\.ts$/,
      ],
    },
  ],
});
