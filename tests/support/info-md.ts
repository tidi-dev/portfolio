import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "./repo";

export function readInfoMd(): string {
  return readFileSync(join(REPO_ROOT, "info.md"), "utf8");
}

/** The lines of one `## heading` section of info.md, without the heading. */
export function sectionLines(infoMd: string, heading: string): string[] {
  const lines = infoMd.split(/\r?\n/);
  const start = lines.findIndex(
    (line) => line === `## ${heading}` || line.startsWith(`## ${heading} `),
  );
  if (start === -1) throw new Error(`info.md has no "## ${heading}" section`);
  const end = lines.findIndex(
    (line, index) => index > start && /^##\s/.test(line),
  );
  return lines.slice(start + 1, end === -1 ? undefined : end);
}

export interface ApprovedRow {
  readonly key: string;
  readonly text: string;
  readonly note: string;
}

const TABLE_SEPARATOR = /^\|(?:\s*:?-+:?\s*\|)+$/;

/** info.md → Approved copy, one entry per table row, keyed as written. */
export function approvedCopy(infoMd: string): Map<string, ApprovedRow> {
  const rows = new Map<string, ApprovedRow>();

  for (const line of sectionLines(infoMd, "Approved copy")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || TABLE_SEPARATOR.test(trimmed)) continue;

    const cells = trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
    const [key, text, note] = cells;
    if (cells.length !== 3 || key === undefined || text === undefined) {
      throw new Error(`Approved copy: a row without 3 cells: ${line}`);
    }
    if (key === "Key") continue;
    if (rows.has(key)) throw new Error(`Approved copy: duplicate key ${key}`);
    rows.set(key, { key, text, note: note ?? "" });
  }

  return rows;
}

export interface ShownChannel {
  readonly channel: string;
  readonly value: string;
  readonly shown: boolean;
}

const SHOWN_ENTRY = /^\s+- (\w+)(?: (.+?))?: \*\*(yes|no)\*\*/;

/** info.md → Contact & links → "Shown on the site": each channel and the owner's yes or no. */
export function shownOnSite(infoMd: string): ShownChannel[] {
  const lines = sectionLines(infoMd, "Contact & links");
  const start = lines.findIndex((line) =>
    line.startsWith("- Shown on the site"),
  );
  if (start === -1) throw new Error('info.md has no "Shown on the site" list');

  const entries: ShownChannel[] = [];
  for (const line of lines.slice(start + 1)) {
    const match = SHOWN_ENTRY.exec(line);
    if (!match) break;
    const [, channel = "", value = "", answer] = match;
    entries.push({
      channel,
      value: value.replace(/^"(.*)"$/, "$1"),
      shown: answer === "yes",
    });
  }
  return entries;
}
