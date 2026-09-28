/**
 * The résumé's source lock (contrib-engineering §7.1, step 5; §7.2): a
 * SHA-256 of every input that shapes the PDF, so `pnpm resume:check` can
 * tell when content, the template, the tokens or the fonts changed without
 * a regeneration.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "@/content/copy";
import { buildResumeModel } from "@/lib/resume/model";
import manifest from "../../src/assets/fonts/archivo.manifest.json" with { type: "json" };
import { REPO_ROOT } from "../lib/repo";

export const PDF_PATH = `public/${copy.resume.file}`;
export const LOCK_PATH = "resume.lock.json";
export const PRINT_CSS_PATH = "src/styles/print.css";

/** The static Archivo instances, embedded in the PDF (pnpm fonts). */
export const FONT_INSTANCES = manifest.instances;

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
    "src/styles/bullet-list.css",
    "src/styles/theme-reset.css",
    "src/styles/tokens.generated.css",
    "src/styles/theme.generated.css",
    "src/styles/theme.supplement.css",
    ...FONT_INSTANCES.map((instance) => instance.file),
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
