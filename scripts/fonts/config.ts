/**
 * The font pipeline's fixed inputs (contrib-engineering §1.3; DESIGN.md →
 * Typography; plan ruling R1: subsets built from pinned sources, google/fonts
 * for Mona Sans and the galmuri npm tarball for Galmuri11).
 * Weights and axis ranges are not listed here: they are derived from
 * DESIGN.md's typography tokens.
 */

export interface PinnedFile {
  /** Path from the repo root. */
  readonly file: string;
  /** Path inside the family's origin (the repository or the tarball). */
  readonly path: string;
  readonly bytes: number;
  readonly sha256: string;
}

/** google/fonts at the pinned commit (2026-09-24). */
export interface GoogleFontsOrigin {
  readonly kind: "google-fonts";
  readonly url: string;
  readonly commit: string;
}

/** A published npm tarball, pinned by its registry checksums. */
export interface NpmTarballOrigin {
  readonly kind: "npm-tarball";
  readonly package: string;
  readonly version: string;
  readonly tarball: string;
  readonly shasum: string;
  readonly integrity: string;
  /** The package's licence field. */
  readonly licence: string;
  readonly repository: string;
}

export type SourceOrigin = GoogleFontsOrigin | NpmTarballOrigin;

export const GOOGLE_FONTS: GoogleFontsOrigin = {
  kind: "google-fonts",
  url: "https://github.com/google/fonts",
  commit: "23e54b51ddffbc7713c583748e3bd86f62b1fa4a",
};

/**
 * The OFL's Reserved Font Name clause: a Modified Version (a subset is one)
 * may not use the reserved name. The subset is served under `to`; the
 * copyright and licence records, which name the original, stay as they are.
 * Rulings (main session, 2026-09-28): rename the Mona Sans and Galmuri11
 * subsets. `postscript` is replaced in the PostScript-style records (IDs 3,
 * 6, 25), `family` in the others.
 */
export interface ReservedNameRename {
  /** The Reserved Font Name in the copyright notice or licence header. */
  readonly reserved: string;
  readonly from: { readonly family: string; readonly postscript: string };
  readonly to: {
    readonly family: string;
    readonly postscript: string;
    readonly slug: string;
  };
}

interface FamilyBase {
  /** The family name DESIGN.md's typography tokens use. */
  readonly family: string;
  /** Names the licence copy (and the woff2 when there is no rename). */
  readonly slug: string;
  readonly origin: SourceOrigin;
  readonly licence: PinnedFile;
  readonly rename?: ReservedNameRename;
  /** Unicode ranges this family adds to UNICODE_RANGES. */
  readonly extraRanges?: Readonly<Record<string, string>>;
  /** Where the subset is used (DESIGN.md → Typography), for fonts:check. */
  readonly use: "site" | "résumé only";
}

export interface StaticFamily extends FamilyBase {
  readonly kind: "static";
  /** One static source per weight. */
  readonly weights: Readonly<Record<number, PinnedFile>>;
}

export interface VariableFamily extends FamilyBase {
  readonly kind: "variable";
  readonly source: PinnedFile;
}

export type FontFamily = StaticFamily | VariableFamily;

const GALMURI11 = "assets/fonts/source/galmuri11";
const MONA_SANS = "assets/fonts/source/mona-sans";

/** The game glyphs ▲ ▸ ▼ (DESIGN.md → Shapes → Icons), pixel face only. */
const SHAPES = "U+25B2, U+25B8, U+25BC";

export const FAMILIES: readonly FontFamily[] = [
  {
    // DESIGN.md → Typography: Portfolio Pixel. Regular only: the Bold,
    // Condensed, Galmuri14 and *Bitmap-* files in the tarball are not used.
    kind: "static",
    family: "Galmuri11",
    slug: "portfolio-pixel",
    origin: {
      kind: "npm-tarball",
      package: "galmuri",
      version: "2.40.3",
      tarball: "https://registry.npmjs.org/galmuri/-/galmuri-2.40.3.tgz",
      shasum: "8eaa5ee9761d19030807254c5cf357a08958c05e",
      integrity:
        "sha512-eXflXih1AWy2J+jWeT5sGVj4PUCb1bMK7lnwKDKMzEd3lx+F6myuxqp6c0eZlD7EMXOicUYaM+FH7DAoQ7mWbw==",
      licence: "OFL-1.1",
      repository: "https://github.com/quiple/galmuri",
    },
    weights: {
      400: {
        file: `${GALMURI11}/Galmuri11.ttf`,
        path: "package/dist/Galmuri11.ttf",
        bytes: 5_376_428,
        sha256:
          "2c709890595668f7bdb6df408420fda957dde0288e95b31a1cc17a2ab98b4b4f",
      },
    },
    licence: {
      file: `${GALMURI11}/ofl.md`,
      path: "package/ofl.md",
      bytes: 4_266,
      sha256:
        "9a9e5a342c430c3fcf01a408b680f4405d5bf4ac659c931be35f8a1b27ea69c9",
    },
    // The Reserved Font Name is declared in package/dist/galmuri.css
    // (lines 1 to 5): 'with Reserved Font Name "Galmuri"'.
    rename: {
      reserved: "Galmuri",
      from: { family: "Galmuri11", postscript: "Galmuri11" },
      to: {
        family: "Portfolio Pixel",
        postscript: "PortfolioPixel",
        slug: "portfolio-pixel",
      },
    },
    extraRanges: { shapes: SHAPES },
    use: "site",
  },
  {
    kind: "variable",
    family: "Mona Sans",
    slug: "mona-sans",
    origin: GOOGLE_FONTS,
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
    rename: {
      reserved: "Mona",
      from: { family: "Mona Sans", postscript: "MonaSans" },
      to: {
        family: "Portfolio Sans",
        postscript: "PortfolioSans",
        slug: "portfolio-sans",
      },
    },
    // Owner, 2026-09-28: the site loads only Portfolio Pixel; this subset
    // is embedded by `pnpm resume:pdf`.
    use: "résumé only",
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

/**
 * The naming-table records that carry the family name: 1 family, 3 unique
 * ID, 4 full name, 6 PostScript name, 16 typographic family, 21 WWS family,
 * 25 variations PostScript name prefix. A ReservedNameRename rewrites
 * exactly these.
 */
export const FAMILY_NAME_IDS = [1, 3, 4, 6, 16, 21, 25] as const;

/** The records among FAMILY_NAME_IDS that hold a PostScript-style name. */
export const POSTSCRIPT_NAME_IDS = [3, 6, 25] as const;

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
 * The game glyphs (DESIGN.md → Shapes → Icons): "▸", "▲" and "▼" render as
 * Portfolio Pixel glyphs, each in an aria-hidden span. Portfolio Sans lacks
 * them, so the all-fonts coverage check skips exactly these, and checks
 * instead that the pixel subset (the family with the `shapes` range) maps
 * all three.
 */
export const ICON_GLYPHS: Readonly<Record<string, string>> = {
  "▸": "caret, before PLAYER 1",
  "▲": "triangle, the training markers",
  "▼": "caret, after Press A to continue",
};

/**
 * Features DESIGN.md switches on that a source doesn't have, accepted
 * until DESIGN.md changes (any other missing feature fails `pnpm fonts`).
 * None today: Galmuri11 has the tnum that `stat-value` asks for.
 */
export const KNOWN_FEATURE_GAPS: Readonly<Record<string, readonly string[]>> =
  {};
