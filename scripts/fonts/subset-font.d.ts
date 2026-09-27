// subset-font 2.9.0 ships no types; this covers the options the font
// pipeline uses (README → API).
declare module "subset-font" {
  interface AxisRange {
    readonly min: number;
    readonly max: number;
    readonly default?: number;
  }

  interface SubsetFontOptions {
    readonly targetFormat?: "sfnt" | "truetype" | "woff" | "woff2";
    readonly variationAxes?: Readonly<Record<string, number | AxisRange>>;
    readonly keepFeatures?: readonly string[];
    readonly preserveNameIds?: readonly number[];
    readonly noHinting?: boolean;
  }

  function subsetFont(
    font: Buffer,
    text: string,
    options?: SubsetFontOptions,
  ): Promise<Buffer>;

  export default subsetFont;
}
