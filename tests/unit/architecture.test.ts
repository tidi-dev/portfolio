import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  clientBoundaryViolations,
  listSourceFiles,
} from "../support/architecture";
import { REPO_ROOT } from "../support/repo";

describe("client boundary (contrib-engineering §5.1)", () => {
  it("flags 'use client' in a file that is not *.client.tsx", () => {
    expect(
      clientBoundaryViolations([
        {
          path: "src/components/menu/panel.tsx",
          source: '"use client";\nexport function Panel() {}\n',
        },
      ]),
    ).toEqual([
      "src/components/menu/panel.tsx: 'use client' is allowed only in *.client.tsx files",
    ]);
  });

  it("flags a *.client.tsx file whose first statement is not 'use client'", () => {
    expect(
      clientBoundaryViolations([
        {
          path: "src/components/theme/theme-toggle.client.tsx",
          source: 'import { useState } from "react";\n"use client";\n',
        },
      ]),
    ).toEqual([
      "src/components/theme/theme-toggle.client.tsx: a client leaf must start with 'use client'",
    ]);
  });

  it("accepts a client leaf that starts with the directive after comments", () => {
    expect(
      clientBoundaryViolations([
        {
          path: "src/components/theme/theme-toggle.client.tsx",
          source:
            "// Theme toggle\n/* client leaf */\n'use client';\nexport function ThemeToggle() {}\n",
        },
      ]),
    ).toEqual([]);
  });

  it("accepts a server component that never mentions the directive", () => {
    expect(
      clientBoundaryViolations([
        {
          path: "src/app/page.tsx",
          source: "export default function Page() {}\n",
        },
      ]),
    ).toEqual([]);
  });

  it("holds for every source file in src/", () => {
    const files = listSourceFiles(join(REPO_ROOT, "src")).map((path) => ({
      path: relative(REPO_ROOT, path),
      source: readFileSync(path, "utf8"),
    }));

    expect(files.length).toBeGreaterThan(0);
    expect(clientBoundaryViolations(files)).toEqual([]);
  });
});
