/**
 * The font pipeline's fixed inputs (contrib-engineering §1.5; DESIGN.md →
 * Typography). The axis ranges and the static instances are not listed
 * here: they are derived from DESIGN.md's typography tokens.
 */

/** The pinned OFL source. `pnpm fonts` refuses a file with another hash. */
export const SOURCE = {
  file: "assets/fonts/source/Archivo[wdth,wght].ttf",
  licence: "assets/fonts/source/OFL.txt",
  repository: "https://github.com/google/fonts",
  commit: "95f4904fc8bcf26d3420fe315560c96417c6dec7",
  path: "ofl/archivo/Archivo[wdth,wght].ttf",
  bytes: 658_596,
  sha256: "0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053",
  spdx: "OFL-1.1",
} as const;

/**
 * Google Fonts' `unicode-range`s for Archivo (CSS2 API, fetched 2026-09-28),
 * plus the three arrows DESIGN.md names. Google's latin subset omits U+2192
 * "→", which the owner's strings use; latin-ext is dropped because
 * vietnamese covers "Đ".
 */
export const UNICODE_RANGES = {
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  vietnamese:
    "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
  arrows: "U+2190, U+2192, U+2194",
} as const;

/**
 * The layout features browsers apply by default to horizontal text (CSS
 * Fonts 4, §7.1: ccmp, clig, liga, locl, mark, mkmk, rlig, calt, kern, and
 * rvrn for variable fonts). The subset keeps these plus the features
 * DESIGN.md's typography tokens switch on (tnum, lnum), so aalt, case,
 * fractions, ordinals, superiors, oldstyle and slashed zero are dropped.
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

export const OUTPUT = {
  /** The one preloaded web font, loaded by next/font/local. */
  variable: "src/assets/fonts/archivo.woff2",
  manifest: "src/assets/fonts/archivo.manifest.json",
  /** Static TTF instances for Satori (Phase 11) and the résumé (Phase 10). */
  instanceDirectory: "src/assets/og",
  /** The OFL travels with every derived file. */
  licences: ["src/assets/fonts/OFL.txt", "src/assets/og/OFL.txt"],
} as const;

export function instanceFile(wght: number, wdth: number): string {
  return `${OUTPUT.instanceDirectory}/archivo-wght${String(wght)}-wdth${String(wdth)}.ttf`;
}
