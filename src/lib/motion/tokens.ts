/**
 * The motion tokens the scripted motion needs, read from the CSS custom
 * properties theme.css declares (DESIGN.md → Motion → Tokens), so scripts
 * and CSS share one source (contrib-engineering §4.2: read once, on mount).
 * Browser-only.
 */
const DURATIONS = [
  "verdict",
  "shake",
  "release",
  "pulse",
  "packet",
  "boot",
  "verdict-hold",
  // Quest journal: the model's project-in and the readouts' count-up.
  "project",
  "count",
] as const;

const OTHERS = {
  autoplayDelay: "--delay-autoplay",
  ringStagger: "--stagger-ring",
} as const;

export type MotionDurationName = (typeof DURATIONS)[number];

export interface MotionTimings {
  /** Milliseconds, per DESIGN.md duration token. */
  readonly durations: Readonly<Record<MotionDurationName, number>>;
  readonly autoplayDelay: number;
  readonly ringStagger: number;
}

function milliseconds(style: CSSStyleDeclaration, property: string): number {
  const value = style.getPropertyValue(property).trim();
  // Minified CSS may write 250ms as ".25s".
  const match = /^(\d*\.?\d+)(ms|s)$/.exec(value);
  if (match?.[1] === undefined) {
    throw new Error(`motion token ${property} is "${value}", not a duration`);
  }
  const amount = Number(match[1]);
  return match[2] === "s" ? amount * 1000 : amount;
}

export function readMotionTimings(): MotionTimings {
  const style = getComputedStyle(document.documentElement);
  const durations = Object.fromEntries(
    DURATIONS.map((name) => [
      name,
      milliseconds(style, `--transition-duration-${name}`),
    ]),
  ) as Record<MotionDurationName, number>;
  return {
    durations,
    autoplayDelay: milliseconds(style, OTHERS.autoplayDelay),
    ringStagger: milliseconds(style, OTHERS.ringStagger),
  };
}
