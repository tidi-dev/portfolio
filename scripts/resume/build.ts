/**
 * pnpm resume:pdf (contrib-engineering §7): renders the résumé model with
 * ResumeDocument, compiles print.css with the font subsets embedded, checks
 * the page with axe, prints it with Chromium (tagged, with an outline, A4
 * from @page) to public/, and writes resume.lock.json. Nothing is written
 * unless every font loads, axe finds 0 violations and the PDF is A4 and at
 * most 2 pages.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { REPO_ROOT } from "../lib/repo";
import { FONTS, LOCK_PATH, lockFor, PDF_PATH } from "./lock";
import { renderResumeHtml } from "./render";

const MAX_PAGES = 2;

// A4 in PDF points (210 × 297 mm), with Chromium's rounding tolerance.
const A4_POINTS = { width: 595.28, height: 841.89, tolerance: 2 };

const MEDIA_BOX = /\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/;

function boxOf(object: string): { width: number; height: number } | undefined {
  const box = MEDIA_BOX.exec(object);
  return box === null
    ? undefined
    : {
        width: Number(box[3]) - Number(box[1]),
        height: Number(box[4]) - Number(box[2]),
      };
}

/**
 * Each page's media box, read from the PDF's objects (Chromium writes them
 * uncompressed). A page without its own box inherits the page tree's.
 */
function pageBoxes(pdf: Uint8Array): { width: number; height: number }[] {
  const objects =
    Buffer.from(pdf)
      .toString("latin1")
      .match(/\d+ 0 obj[^]*?endobj/g) ?? [];
  const tree = objects.find((object) => /\/Type\s*\/Pages\b/.test(object));
  const inherited = tree === undefined ? undefined : boxOf(tree);
  return objects
    .filter((object) => /\/Type\s*\/Page(?![A-Za-z])/.test(object))
    .map((object) => {
      const box = boxOf(object) ?? inherited;
      if (box === undefined) throw new Error("A PDF page has no MediaBox");
      return box;
    });
}

const html = await renderResumeHtml();

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.emulateMedia({ media: "print" });
  await page.setContent(html, { waitUntil: "load" });
  // Load every face, used or not, so a broken instance fails here.
  const faces = await page.evaluate(async () => {
    const all = [...document.fonts];
    await Promise.allSettled(all.map((face) => face.load()));
    await document.fonts.ready;
    return {
      total: all.length,
      loaded: all.filter((face) => face.status === "loaded").length,
    };
  });
  if (faces.total !== FONTS.length || faces.loaded !== faces.total) {
    throw new Error(
      `${String(faces.loaded)} of ${String(faces.total)} font faces loaded; expected ${String(FONTS.length)}`,
    );
  }

  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length > 0) {
    for (const violation of axe.violations) {
      console.error(
        `resume:pdf: axe ${violation.id}: ${violation.help} (${String(violation.nodes.length)} nodes)`,
      );
    }
    throw new Error(
      `axe found ${String(axe.violations.length)} violations on the résumé HTML`,
    );
  }

  const pdf = await page.pdf({
    tagged: true,
    outline: true,
    preferCSSPageSize: true,
    printBackground: true,
  });

  const boxes = pageBoxes(pdf);
  if (boxes.length === 0 || boxes.length > MAX_PAGES) {
    throw new Error(
      `The résumé has ${String(boxes.length)} pages; it must have 1 to ${String(MAX_PAGES)}`,
    );
  }
  for (const box of boxes) {
    if (
      Math.abs(box.width - A4_POINTS.width) > A4_POINTS.tolerance ||
      Math.abs(box.height - A4_POINTS.height) > A4_POINTS.tolerance
    ) {
      throw new Error(
        `A page is ${String(box.width)} × ${String(box.height)} pt, not A4`,
      );
    }
  }

  mkdirSync(dirname(join(REPO_ROOT, PDF_PATH)), { recursive: true });
  writeFileSync(join(REPO_ROOT, PDF_PATH), pdf);
  writeFileSync(
    join(REPO_ROOT, LOCK_PATH),
    `${JSON.stringify(lockFor(pdf), null, 2)}\n`,
  );
  console.log(
    `resume:pdf: wrote ${PDF_PATH} (${String(boxes.length)} A4 pages, ${String(pdf.byteLength)} bytes; axe 0 violations) and ${LOCK_PATH}`,
  );
} finally {
  await browser.close();
}
