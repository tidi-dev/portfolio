import type { Finding } from "@google/design.md/linter";

export interface AllowedWarning {
  /** The linter rule id, e.g. "orphaned-tokens". */
  readonly rule: string;
  /** The finding's path; omit to accept every path for the rule. */
  readonly path?: string;
  /** Why the warning is accepted, with the ruling it comes from. */
  readonly reason: string;
}

/**
 * Warnings accepted on purpose (contrib-engineering §9.1). Empty: DESIGN.md
 * lints with 0 errors and 0 warnings. Adding an entry needs a main-session
 * ruling, cited in `reason`.
 */
export const ALLOWED_WARNINGS: readonly AllowedWarning[] = [];

export interface DesignLintVerdict {
  readonly errors: readonly Finding[];
  /** Warnings not in the allowlist: each one fails the lint. */
  readonly warnings: readonly Finding[];
  readonly allowedWarnings: readonly Finding[];
  readonly infos: readonly Finding[];
  readonly passed: boolean;
}

function isAllowed(
  finding: Finding,
  allowlist: readonly AllowedWarning[],
): boolean {
  return allowlist.some(
    (entry) =>
      entry.rule === finding.rule &&
      (entry.path === undefined || entry.path === finding.path),
  );
}

/** The warning policy: fail on any error, and on any warning not allowlisted. */
export function evaluateDesignLint(
  findings: readonly Finding[],
  allowlist: readonly AllowedWarning[] = ALLOWED_WARNINGS,
): DesignLintVerdict {
  const errors = findings.filter((finding) => finding.severity === "error");
  const allWarnings = findings.filter(
    (finding) => finding.severity === "warning",
  );
  const allowedWarnings = allWarnings.filter((finding) =>
    isAllowed(finding, allowlist),
  );
  const warnings = allWarnings.filter(
    (finding) => !isAllowed(finding, allowlist),
  );
  const infos = findings.filter((finding) => finding.severity === "info");

  return {
    errors,
    warnings,
    allowedWarnings,
    infos,
    passed: errors.length === 0 && warnings.length === 0,
  };
}

export function formatFinding(finding: Finding): string {
  const where = finding.path === undefined ? "" : ` ${finding.path}`;
  const rule = finding.rule === undefined ? "" : ` [${finding.rule}]`;
  return `${finding.severity}${rule}${where}: ${finding.message}`;
}
