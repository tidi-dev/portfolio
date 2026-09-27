import { join } from "node:path";
import { ESLint, type Linter } from "eslint";
import tseslint from "typescript-eslint";
import { REPO_ROOT } from "./repo";

/**
 * Probe files live under a `__lint-probe__` directory that never exists on
 * disk. typescript-eslint's project service reads files from disk, so
 * type-aware parsing is switched off for probe paths only. Every other part
 * of the repo's `eslint.config.mjs` applies unchanged.
 */
export const PROBE_DIR = "__lint-probe__";

let eslint: ESLint | undefined;

function probeEslint(): ESLint {
  eslint ??= new ESLint({
    cwd: REPO_ROOT,
    overrideConfig: [
      {
        ...tseslint.configs.disableTypeChecked,
        files: [`**/${PROBE_DIR}/**`],
        languageOptions: {
          parserOptions: { projectService: false, project: false },
        },
      },
    ],
  });
  return eslint;
}

export interface ProbeMessage {
  readonly ruleId: string | null;
  readonly message: string;
}

/**
 * Lints `code` as if it were the file at `relativePath` (from the repo root),
 * which must contain the `__lint-probe__` segment.
 */
export async function lintProbe(
  relativePath: string,
  code: string,
): Promise<ProbeMessage[]> {
  if (!relativePath.includes(`/${PROBE_DIR}/`)) {
    throw new Error(`probe paths must contain /${PROBE_DIR}/: ${relativePath}`);
  }
  const [result] = await probeEslint().lintText(code, {
    filePath: join(REPO_ROOT, relativePath),
  });
  if (result === undefined) {
    throw new Error(`ESLint returned no result for ${relativePath}`);
  }
  return result.messages.map((message: Linter.LintMessage) => ({
    ruleId: message.ruleId,
    message: message.message,
  }));
}

/** The messages a probe reports for one rule. */
export async function probeRule(
  ruleId: string,
  relativePath: string,
  code: string,
): Promise<string[]> {
  const messages = await lintProbe(relativePath, code);
  const fatal = messages.filter((message) => message.ruleId === null);
  if (fatal.length > 0) {
    throw new Error(
      `probe failed to parse: ${fatal.map((m) => m.message).join("; ")}`,
    );
  }
  return messages
    .filter((message) => message.ruleId === ruleId)
    .map((message) => message.message);
}
