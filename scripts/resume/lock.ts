/**
 * The résumé's source lock (contrib-engineering §7): a SHA-256 of every
 * input that shapes the PDF, so `pnpm resume:check` can tell when content,
 * the template, the tokens or the fonts changed without a regeneration.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "@/content/copy";
import { buildResumeModel } from "@/lib/resume/model";
import manifest from "../../src/assets/fonts/fonts.manifest.json" with { type: "json" };
import { REPO_ROOT } from "../lib/repo";

export const PDF_PATH = `public/${copy.resume.file}`;
export const LOCK_PATH = "resume.lock.json";
export const PRINT_CSS_PATH = "src/styles/print.css";

/** A font subset embedded in the PDF (pnpm fonts), as the page declares it. */
export interface EmbeddedFont {
  readonly file: string;
  /** The CSS family: the site's served name ("Portfolio Sans" for Mona Sans). */
  readonly family: string;
  /** A CSS font-weight value: one weight, or a variable range. */
  readonly weight: string;
  /** A CSS font-stretch value, for a variable width axis. */
  readonly stretch: string;
}

export const FONTS: readonly EmbeddedFont[] = manifest.fonts.map((font) => ({
  file: font.file,
  family: "servedAs" in font ? font.servedAs : font.family,
  weight:
    "axes" in font
      ? `${String(font.axes.wght[0])} ${String(font.axes.wght[1])}`
      : String(font.weight),
  stretch:
    "axes" in font
      ? `${String(font.axes.wdth[0])}% ${String(font.axes.wdth[1])}%`
      : "100%",
}));

const COMPONENT_DIRECTORY = "src/components/resume";

/** Every file whose bytes shape the PDF, besides the model itself. */
function sourceFiles(): string[] {
  const components = readdirSync(join(REPO_ROOT, COMPONENT_DIRECTORY))
    .filter((name) => name.endsWith(".tsx"))
    .sort()
    .map((name) => `${COMPONENT_DIRECTORY}/${name}`);
  return [
    ...components,
    "src/lib/resume/model.ts",
    "src/lib/format/typography.ts",
    PRINT_CSS_PATH,
    "src/styles/reset.css",
    "src/styles/tokens.generated.css",
    "src/styles/theme.css",
    ...FONTS.map((font) => font.file),
    "scripts/resume/render.ts",
    "scripts/resume/build.ts",
  ];
}

function sha256(bytes: string | Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export interface ResumeLock {
  readonly file: string;
  /** One hash over every input below, in order. */
  readonly sources: string;
  /** The model JSON, then each source file, by path. */
  readonly inputs: Readonly<Record<string, string>>;
  /** The PDF that these sources produced. */
  readonly pdf: { readonly sha256: string; readonly bytes: number };
}

/** The inputs' hashes, as a fresh lock would record them. */
export function hashInputs(): Record<string, string> {
  const inputs: Record<string, string> = {
    model: sha256(JSON.stringify(buildResumeModel())),
  };
  for (const path of sourceFiles()) {
    inputs[path] = sha256(readFileSync(join(REPO_ROOT, path)));
  }
  return inputs;
}

export function combine(inputs: Readonly<Record<string, string>>): string {
  return sha256(
    Object.entries(inputs)
      .map(([path, hash]) => `${hash}  ${path}`)
      .join("\n"),
  );
}

export function lockFor(pdf: Uint8Array): ResumeLock {
  const inputs = hashInputs();
  return {
    file: PDF_PATH,
    sources: combine(inputs),
    inputs,
    pdf: { sha256: sha256(pdf), bytes: pdf.byteLength },
  };
}

export function pdfHash(pdf: Uint8Array): string {
  return sha256(pdf);
}
