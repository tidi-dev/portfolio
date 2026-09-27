import type { Page } from "@playwright/test";

/** Horizontal overflow of the page in CSS pixels; 0 when nothing overflows. */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
}
