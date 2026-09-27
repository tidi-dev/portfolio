import { fileURLToPath } from "node:url";

/** Absolute path of the repository root, with a trailing separator. */
export const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
