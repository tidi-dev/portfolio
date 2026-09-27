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

const schemas = new WeakMap<object, z.ZodType>();

/**
 * Parses a content module's data at module load, so invalid content fails
 * `next build` and every test that imports it, with the file and the Zod
 * path (contrib-engineering §3.1). The schema is remembered for the export,
 * so the content trace can tell structural keys from visible text.
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
  schemas.set(value, schema);
  return value as Content<S>;
}

/** The schema that validated a content export, if `defineContent` made it. */
export function schemaOf(value: unknown): z.ZodType | undefined {
  return typeof value === "object" && value !== null
    ? schemas.get(value)
    : undefined;
}
