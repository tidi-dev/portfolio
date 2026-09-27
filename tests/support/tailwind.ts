import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { __unstable__loadDesignSystem, compile } from "tailwindcss";
import { REPO_ROOT } from "./repo";

/**
 * Tailwind 4's own compiler, run in memory on `src/app/globals.css` with the
 * repo's token layers, so tests see exactly the CSS a class produces.
 */
const ENTRY = join(REPO_ROOT, "src", "app", "globals.css");
const require = createRequire(import.meta.url);

function loadStylesheet(id: string, base: string) {
  const path =
    id === "tailwindcss"
      ? require.resolve("tailwindcss/index.css")
      : resolve(base, id);
  return Promise.resolve({
    path,
    base: dirname(path),
    content: readFileSync(path, "utf8"),
  });
}

const options = { base: dirname(ENTRY), loadStylesheet };

/** The CSS Tailwind emits for these classes, theme variables included. */
export async function buildClasses(
  classes: readonly string[],
): Promise<string> {
  const compiler = await compile(readFileSync(ENTRY, "utf8"), options);
  return compiler.build([...classes]);
}

/** Every class Tailwind knows under the repo's theme, with the CSS each one emits. */
export async function everyClass(): Promise<Map<string, string>> {
  const system = await __unstable__loadDesignSystem(
    readFileSync(ENTRY, "utf8"),
    options,
  );
  const names = system.getClassList().map(([name]) => name);
  const css = system.candidatesToCss(names);
  return new Map(
    names.flatMap((name, index) => {
      const output = css[index];
      return output === null || output === undefined ? [] : [[name, output]];
    }),
  );
}
