import type { UsageReadout } from "@/lib/content/facts";
import { typography } from "@/lib/format/typography";
import { CountUp } from "./count-up.client";

/**
 * botmivivi's stat readout (DESIGN.md → Stat readout), exactly
 * botmivivi.facts, in its order: Users, Customers and Orders as figures
 * that count up on first view, the qualifier "in the first 2 months", then
 * Impact as a text line.
 */
export function StatReadout({ readout }: { readonly readout: UsageReadout }) {
  return (
    <div className="flex flex-col gap-sm">
      <dl className="stat-grid">
        {readout.stats.map((stat) => (
          <div key={stat.term} className="flex flex-col gap-2xs">
            <dt className="type-label text-accent-ink">{stat.term}</dt>
            <dd className="type-stat-value text-primary">
              <CountUp value={stat.value} display={stat.display} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="type-body-compact text-text-muted">
        {typography(readout.qualifier)}
      </p>
      <dl>
        <div className="facts-row">
          <dt className="type-label text-accent-ink">{readout.impact.term}</dt>
          <dd className="type-body-compact text-primary">
            {typography(readout.impact.text)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
