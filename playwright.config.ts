import { defineConfig, devices } from "@playwright/test";

// Always the production build (`pnpm build` first), on a port no dev server uses.
const PORT = 3100;
const BASE_URL = `http://localhost:${String(PORT)}`;

// The budget spec measures bytes, which do not depend on the browser: it runs
// once, in chromium-desktop.
const CHROMIUM_DESKTOP_ONLY = [/budget\.spec\.ts$/];

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
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"] },
      testIgnore: CHROMIUM_DESKTOP_ONLY,
    },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 15"] },
      testIgnore: CHROMIUM_DESKTOP_ONLY,
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
