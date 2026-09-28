/**
 * The résumé page for Chromium (contrib-engineering §7, steps 1 and 2): the
 * model rendered by ResumeDocument to static markup, with print.css
 * compiled by Tailwind and the font subsets inlined as data URLs.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "@/components/resume/resume-document";
import { buildResumeModel } from "@/lib/resume/model";
import { REPO_ROOT } from "../lib/repo";
import { FONTS, PRINT_CSS_PATH } from "./lock";

function fontFaces(): string {
  return FONTS.map((font) => {
    const data = readFileSync(join(REPO_ROOT, font.file)).toString("base64");
    return `@font-face{font-family:"${font.family}";src:url(data:font/woff2;base64,${data}) format("woff2");font-weight:${font.weight};font-stretch:${font.stretch};font-style:normal;font-display:block}`;
  }).join("\n");
}

async function compileCss(): Promise<string> {
  const from = join(REPO_ROOT, PRINT_CSS_PATH);
  const result = await postcss([tailwindcss({ base: REPO_ROOT })]).process(
    readFileSync(from, "utf8"),
    { from },
  );
  return `${fontFaces()}\n${result.css}`;
}

export async function renderResumeHtml(): Promise<string> {
  const model = buildResumeModel();
  const css = await compileCss();
  // The Lab (light) tokens only, whatever the system theme (theme.css).
  const markup = renderToStaticMarkup(
    createElement(
      "html",
      { lang: model.lang, "data-theme": "light" },
      createElement(
        "head",
        null,
        createElement("meta", { charSet: "utf-8" }),
        createElement("title", null, model.title),
        createElement("style", null, css),
      ),
      createElement(ResumeDocument, { model }),
    ),
  );
  return `<!DOCTYPE html>${markup}`;
}
