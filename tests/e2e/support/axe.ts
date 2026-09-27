import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/** contrib-verification §3.6: the rule tags of every axe run. No rule is disabled. */
export const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return results.violations;
}
