import { expect, forEachTheme, test } from "./fixtures";
import { axeViolations } from "./support/axe";
import { horizontalOverflow } from "./support/overflow";

// Permanent self-tests (contrib-verification §1.3): each proves that its guard
// or helper can fail, against a page.setContent fixture, without the server.

test.describe("guard self-tests", () => {
  test("records a console error", async ({ page, guard }) => {
    const logged = page.waitForEvent("console");
    await page.setContent('<script>console.error("guard self-test")</script>');
    await logged;

    expect(guard.problems()).toEqual(["console error: guard self-test"]);
    expect(() => {
      guard.assertClean();
    }).toThrow(/console error: guard self-test/);
    guard.clear();
  });

  test("records a console warning", async ({ page, guard }) => {
    const logged = page.waitForEvent("console");
    await page.setContent('<script>console.warn("guard self-test")</script>');
    await logged;

    expect(guard.problems()).toEqual(["console warning: guard self-test"]);
    guard.clear();
  });

  test("records an uncaught page error", async ({ page, guard }) => {
    const thrown = page.waitForEvent("pageerror");
    await page.setContent(
      '<script>throw new Error("guard self-test")</script>',
    );
    await thrown;

    expect(guard.problems()).toEqual(
      expect.arrayContaining([expect.stringContaining("page error: ")]),
    );
    expect(guard.problems().join("\n")).toContain("guard self-test");
    guard.clear();
  });

  test("records a request to another origin", async ({ page, guard }) => {
    await page.route("https://third-party.invalid/**", (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
    const requested = page.waitForEvent("request", (request) =>
      request.url().startsWith("https://third-party.invalid/"),
    );
    await page.setContent(
      '<img src="https://third-party.invalid/pixel.png" alt="">',
    );
    await requested;

    expect(guard.problems()).toEqual([
      "third-party request: https://third-party.invalid/pixel.png",
    ]);
    guard.clear();
  });

  test("records a same-origin response of 400 or more", async ({
    page,
    guard,
    origin,
  }) => {
    const missing = `${origin}/guard-self-test-missing.png`;
    await page.route(missing, (route) =>
      route.fulfill({ status: 404, body: "" }),
    );
    const answered = page.waitForEvent(
      "response",
      (response) => response.url() === missing,
    );
    await page.setContent(`<img src="${missing}" alt="">`);
    await answered;

    // Some engines also log the 404 to the console; the guard records both.
    expect(guard.problems()).toEqual(
      expect.arrayContaining(["HTTP 404: /guard-self-test-missing.png"]),
    );
    guard.clear();
  });

  test("fails the test from its teardown when a problem is left unhandled", async ({
    page,
  }) => {
    test.fail(true, "the guard fixture must fail this test");
    const logged = page.waitForEvent("console");
    await page.setContent('<script>console.error("left unhandled")</script>');
    await logged;
  });
});

test.describe("helper self-tests", () => {
  test("axe reports an unlabelled button", async ({ page }) => {
    await page.setContent("<main><button></button></main>");

    const ids = (await axeViolations(page)).map((violation) => violation.id);
    expect(ids).toContain("button-name");
  });

  test("overflow check catches a 400 px block at 320 px and passes a fluid one", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    // Without a viewport meta, mobile emulation lays the page out at 980 px.
    const viewport = '<meta name="viewport" content="width=device-width">';

    await page.setContent(
      `${viewport}<body style="margin:0"><div style="width:400px;height:1px"></div></body>`,
    );
    expect(await horizontalOverflow(page)).toBe(80);

    await page.setContent(
      `${viewport}<body style="margin:0"><div style="width:100%;height:1px"></div></body>`,
    );
    expect(await horizontalOverflow(page)).toBe(0);
  });
});

forEachTheme((theme) => {
  test("the two-theme fixture emulates the system colour scheme", async ({
    page,
  }) => {
    await page.setContent("<main></main>");

    const dark = await page.evaluate(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    expect(dark).toBe(theme === "dark");
  });
});
