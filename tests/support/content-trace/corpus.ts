import { normalise } from "./normalise";

// contrib-verification §5.2: the content sections of info.md. The header
// notes, Visual assets (except the avatar alt text), Site preferences, Open
// questions and Not included are excluded.
const INCLUDED_SECTIONS = [
  "Identity",
  "Goals & audience",
  "About",
  "Experience",
  "Projects",
  "Skills & tools",
  "Education & certifications",
  "Interests",
  "Contact & links",
  "Approved copy",
] as const;

const SECTION_HEADING = /^##\s+(.+)$/;
const SUBHEADING = /^#{3,6}\s+(.+)$/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const TABLE_SEPARATOR = /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/;
const AVATAR_ALT_TEXT = /Profile alt text:\s*"([^"]+)"/;

function isIncluded(section: string | undefined): boolean {
  return (
    section !== undefined &&
    INCLUDED_SECTIONS.some(
      (name) => section === name || section.startsWith(`${name} `),
    )
  );
}

/**
 * The content sections of info.md as written, one entry per line (or table
 * cell): the text the site may render. Font coverage reads these unchanged.
 */
export function contentLines(infoMd: string): string[] {
  const lines = infoMd.split(/\r?\n/);
  const corpus: string[] = [];
  let section: string | undefined;
  let inVisualAssets = false;

  lines.forEach((line, index) => {
    const sectionHeading = SECTION_HEADING.exec(line);
    if (sectionHeading) {
      section = sectionHeading[1]?.trim();
      inVisualAssets = false;
      if (isIncluded(section)) corpus.push(line);
      return;
    }
    if (!isIncluded(section)) return;

    const subheading = SUBHEADING.exec(line);
    if (subheading) {
      inVisualAssets =
        section === "Identity" &&
        (subheading[1] ?? "").startsWith("Visual assets");
      if (!inVisualAssets) corpus.push(line);
      return;
    }

    if (inVisualAssets) {
      const altText = AVATAR_ALT_TEXT.exec(line)?.[1];
      if (altText !== undefined) corpus.push(altText);
      return;
    }

    if (TABLE_SEPARATOR.test(line)) return;
    const row = TABLE_ROW.exec(line);
    if (row) {
      const isHeaderRow = TABLE_SEPARATOR.test(lines[index + 1] ?? "");
      if (!isHeaderRow) corpus.push(...(row[1] ?? "").split("|"));
      return;
    }

    corpus.push(line);
  });

  return corpus;
}

/**
 * The normalised corpus, one entry per line (or table cell), so that a match
 * never spans two lines of info.md.
 */
export function corpusLines(infoMd: string): string[] {
  return contentLines(infoMd)
    .map(normalise)
    .filter((entry) => entry !== "");
}
