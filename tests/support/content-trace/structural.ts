import type { z } from "zod";
import { structural } from "@/content/schema/primitives";

export interface ContentLeaf {
  readonly path: string;
  readonly value: string | number;
  /**
   * The leaf sits under a schema registered in `structural`: a non-visible
   * id, reference or discriminator, which the content trace exempts (ruling:
   * Phase 3 trace rules).
   */
  readonly structural: boolean;
}

/** The parts of a Zod 4 definition the walker reads. */
interface Definition {
  readonly type: string;
  readonly shape?: Readonly<Record<string, z.ZodType>>;
  readonly catchall?: z.ZodType;
  readonly element?: z.ZodType;
  readonly innerType?: z.ZodType;
  readonly options?: readonly z.ZodType[];
}

const LEAF_TYPES = new Set(["string", "number", "literal", "enum", "boolean"]);
const WRAPPER_TYPES = new Set(["optional", "nullable", "readonly"]);

function definition(schema: z.ZodType): Definition {
  return schema._zod.def;
}

function inner(schema: z.ZodType | undefined, path: string): z.ZodType {
  if (schema === undefined)
    throw new Error(`${path}: a wrapper without an inner schema`);
  return schema;
}

/**
 * Walks a content value alongside the schema that validated it and returns
 * its string and number leaves, each marked structural or visible.
 *
 * It accepts only validation schemas: strict objects, arrays, unions,
 * optional wrappers and scalar leaves. A transform, default, pipe or
 * non-strict object throws, because each could make the exported value
 * differ from what the content module wrote.
 */
export function walkLeaves(
  schema: z.ZodType,
  value: unknown,
  path: string,
  inherited = false,
): ContentLeaf[] {
  const def = definition(schema);
  const isStructural = inherited || structural.has(schema);

  if (LEAF_TYPES.has(def.type)) {
    return typeof value === "string" || typeof value === "number"
      ? [{ path, value, structural: isStructural }]
      : [];
  }

  if (WRAPPER_TYPES.has(def.type)) {
    return value === undefined || value === null
      ? []
      : walkLeaves(inner(def.innerType, path), value, path, isStructural);
  }

  switch (def.type) {
    case "object": {
      if (
        def.catchall === undefined ||
        definition(def.catchall).type !== "never"
      ) {
        throw new Error(
          `${path}: content objects must be strict (z.strictObject)`,
        );
      }
      const record = value as Readonly<Record<string, unknown>>;
      return Object.entries(def.shape ?? {}).flatMap(([key, field]) =>
        key in record
          ? walkLeaves(field, record[key], `${path}.${key}`, isStructural)
          : [],
      );
    }
    case "array": {
      const element = inner(def.element, path);
      return (value as readonly unknown[]).flatMap((item, index) =>
        walkLeaves(element, item, `${path}[${String(index)}]`, isStructural),
      );
    }
    case "union": {
      const option = def.options?.find(
        (candidate) => candidate.safeParse(value).success,
      );
      if (option === undefined)
        throw new Error(`${path}: no union option matches`);
      return walkLeaves(option, value, path, isStructural);
    }
    default:
      throw new Error(
        `${path}: unsupported schema type "${def.type}" (content schemas validate only: no transforms, defaults or pipes)`,
      );
  }
}
