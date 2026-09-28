/** A period as content stores it: YYYY-MM months, "present" for an open end. */
export interface MonthPeriod {
  readonly start: string;
  readonly end: string;
}

/** The approved templates (info.md → Approved copy, format.period). */
export interface PeriodTemplates {
  readonly closed: string;
  readonly open: string;
}

const PLACEHOLDER = "{YYYY-MM}";

function fill(template: string, months: readonly string[]): string {
  const parts = template.split(PLACEHOLDER);
  const found = parts.length - 1;
  if (found !== months.length) {
    throw new Error(
      `The period template "${template}" needs ${String(months.length)} ${PLACEHOLDER} placeholder${months.length === 1 ? "" : "s"}, found ${String(found)}`,
    );
  }
  return parts
    .map((part, index) =>
      index === 0 ? part : `${months[index - 1] ?? ""}${part}`,
    )
    .join("");
}

/** "2020-12 to 2024-03", or "2024-03 to present" for an open period. */
export function formatPeriod(
  period: MonthPeriod,
  templates: PeriodTemplates,
): string {
  return period.end === "present"
    ? fill(templates.open, [period.start])
    : fill(templates.closed, [period.start, period.end]);
}
