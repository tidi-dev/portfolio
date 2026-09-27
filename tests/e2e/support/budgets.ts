/**
 * Byte budgets per HTML route, in bytes (1 kB = 1,000 B). Sources: the plan's
 * Global Constraints → Budgets and contrib-verification §6 (B8–B13). The LHCI
 * configs assert the same numbers (tests/unit/lhci-config.test.ts). None of
 * them changes without a logged ruling.
 */
export const BUDGETS = {
  /** B8: first-load JS, gzip. */
  scriptBytes: 120_000,
  /** B9: first-load JS minus FRAMEWORK_FLOOR_BYTES. */
  appOwnedScriptBytes: 15_000,
  /** B11 */
  stylesheetBytes: 20_000,
  /** B12: one preloaded woff2. */
  fontBytes: 100_000,
  fontFiles: 1,
  /** B10 */
  documentBytes: 60_000,
  /** B13: before any interaction. */
  thirdPartyRequests: 0,
} as const;

/**
 * First-load JS of the bare Phase 1 shell: 5 files, gzip, chromium-desktop,
 * `next start`, Next 16.3.6 with Turbopack, measured 2026-09-28 (identical on
 * repeated builds). It is above 105 kB, so the plan's recalibration applies:
 * BUDGETS.scriptBytes awaits the main session's ruling
 * (docs/reports/phase-01-engineering.md).
 */
export const FRAMEWORK_FLOOR_BYTES = 133_646;
