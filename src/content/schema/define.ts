import { z } from "zod";

/** A deeply readonly view: content is read, never written. */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/** What a content module writes: its schema's input, `as const`. */
export type ContentInput<S extends z.ZodType> = DeepReadonly<z.input<S>>;

/** What a content module exports: the parsed, validated value. */
export type Content<S extends z.ZodType> = DeepReadonly<z.output<S>>;

/** Invalid content, with the file and the Zod path of each problem. */
export class ContentError extends Error {
  override name = "ContentError";
}

/**
 * Parses a content module's data at module load, so invalid content fails
 * `next build` with the file and the Zod path (contrib-engineering §3).
 *
 * Content schemas validate only: strict objects and no transforms or
 * defaults, so the export equals what the module wrote.
 */
export function defineContent<S extends z.ZodType>(
  name: string,
  schema: S,
  data: ContentInput<S>,
): Content<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ContentError(
      `Invalid content in src/content/${name}.ts\n${z.prettifyError(result.error)}`,
    );
  }
  const value: unknown = result.data;
  if (typeof value !== "object" || value === null) {
    throw new ContentError(
      `src/content/${name}.ts must export an object or an array`,
    );
  }
  return value as Content<S>;
}
