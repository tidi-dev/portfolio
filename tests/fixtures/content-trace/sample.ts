// A content module for the trace test's end-to-end case. It is never part of
// src/content: it holds one invented string, one structural key and one
// export made without defineContent, each of which the trace must report.
import { z } from "zod";
import { type ContentInput, defineContent } from "@/content/schema/define";
import { structuralId, Text } from "@/content/schema/primitives";

const Sample = z.strictObject({
  id: structuralId("fixture key"),
  title: Text,
  stack: z.array(Text).nonempty(),
});

export const sample = defineContent("sample", Sample, {
  id: "made-up-key",
  title: "Principal engineer at a unicorn",
  stack: ["NestJS", "Prisma"],
} as const satisfies ContentInput<typeof Sample>);

export const loose = { note: "exported without defineContent" };
