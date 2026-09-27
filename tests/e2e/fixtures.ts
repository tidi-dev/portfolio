import { test as base, expect } from "@playwright/test";
import { createGuard, type Guard } from "./support/guard";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

interface Fixtures {
  /** Origin of the production server under test. */
  origin: string;
  /**
   * Automatic on every test: fails it on a console error or warning, a page
   * error, a hydration message, a same-origin response of 400 or more, or a
   * third-party request (contrib-verification §1.3).
   */
  guard: Guard;
}

export const test = base.extend<Fixtures>({
  origin: async ({ baseURL }, provide) => {
    if (baseURL === undefined) {
      throw new Error("baseURL must be set in playwright.config.ts");
    }
    await provide(new URL(baseURL).origin);
  },
  guard: [
    async ({ page, origin }, provide) => {
      const guard = createGuard(page, { origin });
      await provide(guard);
      guard.assertClean();
    },
    { auto: true },
  ],
});

/**
 * The two-theme fixture: registers the given tests once per theme, with the
 * system colour scheme emulated. Every UI spec wraps its tests in it.
 */
export function forEachTheme(register: (theme: Theme) => void): void {
  for (const theme of THEMES) {
    test.describe(`${theme} theme`, () => {
      test.use({ colorScheme: theme });
      register(theme);
    });
  }
}

export { expect };
