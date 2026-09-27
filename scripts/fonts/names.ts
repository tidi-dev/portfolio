import { encodeNameTable, replaceTable } from "./sfnt-write";
import {
  nameRecords,
  nameString,
  readTables,
  WINDOWS_ENGLISH,
  type FontTables,
  type NameRecord,
} from "./sfnt";

/**
 * Names for a static instance. HarfBuzz instancing keeps the default
 * instance's names, so every instance read "Archivo SemiBold" (QA review of
 * Phase 2, M2). Each instance gets its own family, full and PostScript
 * names. Subfamily stays "Regular", which matches the fsSelection HarfBuzz
 * writes; the typographic names (IDs 16 and 17) carry the width and weight.
 */

/** OpenType's usWeightClass names. */
const WEIGHTS: Readonly<Record<number, string>> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

/** OpenType's usWidthClass names, by width percentage ("" is normal). */
const WIDTHS: readonly (readonly [percent: number, name: string])[] = [
  [50, "UltraCondensed"],
  [62.5, "ExtraCondensed"],
  [75, "Condensed"],
  [87.5, "SemiCondensed"],
  [100, ""],
  [112.5, "SemiExpanded"],
  [125, "Expanded"],
  [150, "ExtraExpanded"],
  [200, "UltraExpanded"],
];

/** The nearest width class, as HarfBuzz sets usWidthClass (112 → SemiExpanded). */
function widthName(wdth: number): string {
  const [nearest] = [...WIDTHS].sort(
    (a, b) => Math.abs(a[0] - wdth) - Math.abs(b[0] - wdth),
  );
  if (nearest === undefined)
    throw new Error(`no width class for ${String(wdth)}`);
  return nearest[1];
}

export interface InstanceNames {
  /** Name ID 1: the family, with the width and any weight other than Regular. */
  readonly family: string;
  /** Name ID 2. */
  readonly subfamily: "Regular";
  /** Name ID 3: the source's version and vendor, then the PostScript name. */
  readonly uniqueId: string;
  /** Name ID 4. */
  readonly fullName: string;
  /** Name ID 6. */
  readonly postscriptName: string;
  /** Name ID 16. */
  readonly typographicFamily: string;
  /** Name ID 17: the width and weight. */
  readonly typographicSubfamily: string;
}

export function instanceNames(
  wght: number,
  wdth: number,
  source: FontTables,
): InstanceNames {
  const weight = WEIGHTS[wght];
  if (weight === undefined)
    throw new Error(`no weight name for ${String(wght)}`);
  const family = nameString(source, 16) ?? nameString(source, 1);
  const uniqueId = nameString(source, 3);
  if (family === undefined || uniqueId === undefined) {
    throw new Error(
      "the source has no family (ID 16 or 1) or unique ID (ID 3)",
    );
  }

  const width = widthName(wdth);
  const style = [width, weight].filter((part) => part !== "").join(" ");
  const familyStyle = [width, weight === "Regular" ? "" : weight]
    .filter((part) => part !== "")
    .join(" ");
  const postscriptName = `${family}-${style.replaceAll(" ", "")}`;

  return {
    family: familyStyle === "" ? family : `${family} ${familyStyle}`,
    subfamily: "Regular",
    uniqueId: `${uniqueId.slice(0, uniqueId.lastIndexOf(";") + 1)}${postscriptName}`,
    fullName: `${family} ${style}`,
    postscriptName,
    typographicFamily: family,
    typographicSubfamily: style,
  };
}

/** The TTF with its naming table rewritten to `names` (Windows US English). */
export function renameInstance(ttf: Buffer, names: InstanceNames): Buffer {
  const replaced: Readonly<Record<number, string>> = {
    1: names.family,
    2: names.subfamily,
    3: names.uniqueId,
    4: names.fullName,
    6: names.postscriptName,
    16: names.typographicFamily,
    17: names.typographicSubfamily,
  };
  const kept = nameRecords(readTables(ttf)).filter(
    (record) => !(record.nameId in replaced),
  );
  const written: NameRecord[] = Object.entries(replaced).map(
    ([nameId, text]) => ({
      ...WINDOWS_ENGLISH,
      nameId: Number(nameId),
      text,
    }),
  );
  return replaceTable(ttf, "name", encodeNameTable([...kept, ...written]));
}
