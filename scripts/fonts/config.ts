/**
 * The font pipeline's fixed inputs (contrib-engineering §1.3; DESIGN.md →
 * Typography; plan ruling R1: subsets built from google/fonts sources).
 * Weights and axis ranges are not listed here: they are derived from
 * DESIGN.md's typography tokens.
 */

export interface PinnedFile {
  /** Path from the repo root. */
  readonly file: string;
  /** Path in the google/fonts repository. */
  readonly path: string;
  readonly bytes: number;
  readonly sha256: string;
}

/** google/fonts at the pinned commit (2026-09-24). */
export const REPOSITORY = {
  url: "https://github.com/google/fonts",
  commit: "23e54b51ddffbc7713c583748e3bd86f62b1fa4a",
} as const;

export interface StaticFamily {
  readonly kind: "static";
  /** The family name DESIGN.md's typography tokens use. */
  readonly family: string;
  readonly slug: string;
  /** One static source per weight. */
  readonly weights: Readonly<Record<number, PinnedFile>>;
  readonly licence: PinnedFile;
}

export interface VariableFamily {
  readonly kind: "variable";
  readonly family: string;
  readonly slug: string;
  readonly source: PinnedFile;
  readonly licence: PinnedFile;
}

export type FontFamily = StaticFamily | VariableFamily;

const CHAKRA_PETCH = "assets/fonts/source/chakra-petch";
const MONA_SANS = "assets/fonts/source/mona-sans";

export const FAMILIES: readonly FontFamily[] = [
  {
    kind: "static",
    family: "Chakra Petch",
    slug: "chakra-petch",
    weights: {
      600: {
        file: `${CHAKRA_PETCH}/ChakraPetch-SemiBold.ttf`,
        path: "ofl/chakrapetch/ChakraPetch-SemiBold.ttf",
        bytes: 78_604,
        sha256:
          "45264de3204ddbd5fb3e14a2402acd5c630d16650ae5fc221d2c52da46a6734b",
      },
      700: {
        file: `${CHAKRA_PETCH}/ChakraPetch-Bold.ttf`,
        path: "ofl/chakrapetch/ChakraPetch-Bold.ttf",
        bytes: 78_384,
        sha256:
          "65fbf76d95651697275e19db4d717c0e95a789ddd3476478b05292104db278a0",
      },
    },
    licence: {
      file: `${CHAKRA_PETCH}/OFL.txt`,
      path: "ofl/chakrapetch/OFL.txt",
      bytes: 4_396,
      sha256:
        "13831d02389d917d22fcfa6c79f98f8acbf61d230add0e73a4d4dc5f3bfb9e56",
    },
  },
  {
    kind: "variable",
    family: "Mona Sans",
    slug: "mona-sans",
    source: {
      file: `${MONA_SANS}/MonaSans[wdth,wght].ttf`,
      path: "ofl/monasans/MonaSans[wdth,wght].ttf",
      bytes: 349_140,
      sha256:
        "fd6e79634b5ae804a45aac7e2e3c2a325b41291fba59034f4732b0135b8475b3",
    },
    licence: {
      file: `${MONA_SANS}/OFL.txt`,
      path: "ofl/monasans/OFL.txt",
      bytes: 4_419,
      sha256:
        "9261dcb61fb5e3c587d50d7a9fdae12bc7422d8822d7ac06b8f34550479575de",
    },
  },
];

/**
 * Google Fonts' latin and vietnamese `unicode-range`s (CSS2 API), plus
 * U+2190–2193. Google's latin subset omits U+2192 "→", which the owner's
 * strings use ("DynamoDB → MySQL", "v1 → v2"); latin-ext is left out
 * because vietnamese covers "Đ".
 */
export const UNICODE_RANGES = {
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  vietnamese:
    "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
  arrows: "U+2190-2193",
} as const;

/**
 * The layout features browsers apply by default to horizontal text (CSS
 * Fonts 4, §7.1), plus rvrn for variable fonts. The subsets keep these and
 * the features DESIGN.md's typography tokens switch on (tnum).
 */
export const DEFAULT_FEATURES = [
  "calt",
  "ccmp",
  "clig",
  "kern",
  "liga",
  "locl",
  "mark",
  "mkmk",
  "rlig",
  "rvrn",
] as const;

/**
 * The naming-table records that carry the OFL (condition 2: every copy
 * carries the licence): 0 copyright, 13 licence description, 14 licence
 * URL. HarfBuzz keeps IDs 0–6 by default and drops 13 and 14.
 */
export const LICENCE_NAME_IDS = [0, 13, 14] as const;

/** The wdth a Mona Sans token uses when DESIGN.md sets no fontVariation. */
export const DEFAULT_WIDTH = 100;

export const OUTPUT_DIRECTORY = "src/assets/fonts";
export const MANIFEST = `${OUTPUT_DIRECTORY}/fonts.manifest.json`;

export function staticFile(slug: string, weight: number): string {
  return `${OUTPUT_DIRECTORY}/${slug}-${String(weight)}.woff2`;
}

export function variableFile(slug: string): string {
  return `${OUTPUT_DIRECTORY}/${slug}.woff2`;
}

export function licenceFile(slug: string): string {
  return `${OUTPUT_DIRECTORY}/OFL-${slug}.txt`;
}

/**
 * Characters the fonts don't have, rendered another way (plan → Rulings →
 * Glyphs: "▸", "▲" and "▼" render as Tabler filled icons, because neither
 * font has them). The glyph-coverage check skips exactly these.
 */
export const ICON_GLYPHS: Readonly<Record<string, string>> = {
  "▸": "caret-right (filled), before PLAYER 1",
  "▲": "triangle (filled), the training markers",
  "▼": "caret-down (filled), after Press A to continue",
};

/**
 * Features DESIGN.md switches on that a source doesn't have, accepted
 * until DESIGN.md changes (any other missing feature fails `pnpm fonts`).
 * Chakra Petch has proportional figures and no tnum, so `stat-value`'s
 * "'tnum' 1" can't apply; raised to the main session in the Phase 1 report
 * (docs/reports/v2-phase-1.md).
 */
export const KNOWN_FEATURE_GAPS: Readonly<Record<string, readonly string[]>> = {
  "Chakra Petch": ["tnum"],
};
