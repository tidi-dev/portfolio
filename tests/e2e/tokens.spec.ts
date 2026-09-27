import { readFileSync } from "node:fs";
import { expect, forEachTheme, test } from "./fixtures";
import { axeViolations } from "./support/axe";

// Phase 2: the empty shell paints DESIGN.md's `page` component (surface,
// primary, body type) in both themes, from the generated tokens only.

interface Dtcg {
  readonly color: Record<string, { readonly $value: { readonly hex: string } }>;
}

const tokens = JSON.parse(
  readFileSync("src/styles/tokens.generated.json", "utf8"),
) as Dtcg;
const supplement = readFileSync("src/styles/theme.supplement.css", "utf8");

/** A colour token as the browser reports it, e.g. "rgb(244, 244, 248)". */
function colour(name: string): string {
  const hex = tokens.color[name]?.$value.hex;
  if (hex === undefined) throw new Error(`no colour token ${name}`);
  const [r, g, b] = [1, 3, 5].map((start) =>
    Number.parseInt(hex.slice(start, start + 2), 16),
  );
  return `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
}

/** The px value of a supplement clamp(Arem, Brem + Cvw, Drem) at a width. */
function clampPx(variable: string, viewportWidth: number): number {
  const match = new RegExp(
    `${variable}: clamp\\(([\\d.]+)rem, ([\\d.]+)rem \\+ ([\\d.]+)vw, ([\\d.]+)rem\\)`,
  ).exec(supplement);
  if (!match) throw new Error(`no clamp for ${variable}`);
  const [min, base, slope, max] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
  ];
  const preferred = base * 16 + (slope * viewportWidth) / 100;
  return Math.min(Math.max(preferred, min * 16), max * 16);
}

forEachTheme((theme) => {
  const dark = theme === "dark" ? "-dark" : "";

  test("the shell paints the page tokens: surface, primary and body type", async ({
    page,
  }) => {
    await page.goto("/");
    const body = page.locator("body");

    await expect(page.locator("html")).toHaveCSS("color-scheme", theme);
    await expect(body).toHaveCSS("background-color", colour(`surface${dark}`));
    await expect(body).toHaveCSS("color", colour(`primary${dark}`));
    await expect(body).toHaveCSS("font-weight", "400");
    await expect(body).toHaveCSS("font-stretch", "100%");
    await expect(body).toHaveCSS("letter-spacing", "normal");

    const computed = await body.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
        fontFamily: style.fontFamily,
        viewportWidth: document.documentElement.clientWidth,
      };
    });
    const bodySize = clampPx("--text-body", computed.viewportWidth);
    expect(computed.fontSize).toBeCloseTo(bodySize, 1);
    expect(computed.lineHeight).toBeCloseTo(bodySize * 1.6, 0);
    expect(computed.fontFamily).toMatch(
      /^"?archivo"?, "?archivo Fallback"?, system-ui, sans-serif$/,
    );
  });

  test("a stored theme choice (data-theme) wins over the system theme", async ({
    page,
  }) => {
    const stored = theme === "dark" ? "light" : "dark";
    const storedDark = stored === "dark" ? "-dark" : "";
    await page.goto("/");
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, stored);

    await expect(page.locator("html")).toHaveCSS("color-scheme", stored);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      colour(`surface${storedDark}`),
    );
    await expect(page.locator("body")).toHaveCSS(
      "color",
      colour(`primary${storedDark}`),
    );
  });

  test("axe: the shell's only violations are the two that need Phase 4 content", async ({
    page,
  }) => {
    // Phase 4 adds the document title and the h1; this becomes [] then.
    await page.goto("/");
    const ids = (await axeViolations(page)).map((violation) => violation.id);
    expect(ids.sort()).toEqual(["document-title", "page-has-heading-one"]);
  });
});

test("Archivo comes from one preloaded, same-origin woff2 with swap and the DESIGN.md axes", async ({
  page,
  origin,
}) => {
  const fonts: string[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "font")
      fonts.push(response.url());
  });
  await page.goto("/");

  const preload = page.locator('link[rel="preload"][as="font"]');
  await expect(preload).toHaveCount(1);
  await expect(preload).toHaveAttribute("type", "font/woff2");

  // The empty shell has no text, so load the face explicitly.
  const face = await page.evaluate(async () => {
    const first =
      getComputedStyle(document.body).fontFamily.split(",")[0] ?? "";
    const family = first.trim().replace(/^"|"$/g, "");
    await document.fonts.load(`16px "${family}"`);
    const match = [...document.fonts].find(
      (font) => font.family.replace(/^"|"$/g, "") === family,
    );
    return match === undefined
      ? null
      : {
          status: match.status,
          display: match.display,
          weight: match.weight,
          stretch: match.stretch,
        };
  });

  expect(face).toEqual({
    status: "loaded",
    display: "swap",
    weight: "400 800",
    stretch: "87.5% 125%",
  });
  expect(fonts).toHaveLength(1);
  expect(fonts[0]).toMatch(
    new RegExp(`^${origin}/_next/static/media/[^/]+\\.woff2$`),
  );
});
