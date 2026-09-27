import { expect, forEachTheme, test } from "./fixtures";
import { horizontalOverflow } from "./support/overflow";

// Phase 1 shell: <html lang="en">, one empty <main>, no visible text.
// The guard fixture fails the test on any console error or warning, page
// error, hydration warning, same-origin 4xx/5xx or third-party request.
forEachTheme(() => {
  test("the shell renders one empty main in English", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main")).toBeEmpty();
    expect(await page.locator("body").innerText()).toBe("");
  });

  test("the shell has no horizontal overflow at the device width or 320 px", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await horizontalOverflow(page)).toBe(0);

    await page.setViewportSize({ width: 320, height: 568 });
    expect(await horizontalOverflow(page)).toBe(0);
  });
});
