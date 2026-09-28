import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { copy } from "@/content/copy";

/** The committed Résumé PDF, as the links need it. */
export interface ResumeFile {
  /** The public URL, e.g. "/tidi-resume.pdf". */
  readonly href: string;
  readonly bytes: number;
}

/**
 * The Résumé PDF in public/ (pnpm resume:pdf), read at build time, or
 * undefined when it doesn't exist, so no link can point at a missing file
 * and the size hint is the real file's (contrib-engineering §7.2).
 */
function readResumeFile(): ResumeFile | undefined {
  const path = join(process.cwd(), "public", copy.resume.file);
  if (!existsSync(path)) return undefined;
  return { href: `/${copy.resume.file}`, bytes: statSync(path).size };
}

export const RESUME_FILE = readResumeFile();
