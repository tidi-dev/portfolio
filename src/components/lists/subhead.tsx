import type { ReactNode } from "react";

/**
 * Subheads (DESIGN.md → Sheets → Lists: What I built, What it does,
 * Achievements, …): real headings in `label-strong`, `text-muted`. The level
 * follows the outline (contrib-design §1.2): h4 inside a sheet.
 */
export function Subhead({
  level,
  children,
}: {
  readonly level: 3 | 4;
  readonly children: ReactNode;
}) {
  const Heading = level === 3 ? "h3" : "h4";
  return (
    <Heading className="type-label-strong text-text-muted">{children}</Heading>
  );
}
