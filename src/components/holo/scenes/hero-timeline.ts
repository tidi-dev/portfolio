import type { HandshakeState } from "@/lib/handshake/machine";
import type { MotionTimings } from "@/lib/motion/tokens";

/**
 * What the hero scene shows at a moment, from the handshake state alone
 * (DESIGN.md → Motion → Handshake, genuine / counterfeit): the scene is a
 * pure view, and the step timers live in the HTML side (schedule.ts).
 */
export interface HandshakeVisual {
  /** The comet in flight: which leg, and how far along (0–1, eased). */
  readonly comet:
    | { readonly leg: "challenge" | "response"; readonly progress: number }
    | undefined;
  /** How far the chip has turned to the verdict colour (0 = holo). */
  readonly verdictMix: number;
  readonly verdict: "genuine" | "rejected" | undefined;
  /** The pulse ring, scale 1 → 2.4 while fading (0–1), or undefined. */
  readonly pulse: number | undefined;
  /** The counterfeit's one decaying ±0.06 shake, in scene units. */
  readonly shake: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** The preview's cubic ease-out for the comet. */
export function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

/**
 * The `ease-back` token, cubic-bezier(0.34, 1.56, 0.64, 1), as the standard
 * back-out curve it approximates (overshoots, then settles).
 */
export function easeBack(value: number): number {
  const overshoot = 1.70158;
  const shifted = value - 1;
  return (
    1 +
    (overshoot + 1) * shifted * shifted * shifted +
    overshoot * shifted * shifted
  );
}

export function handshakeVisual(
  state: HandshakeState,
  now: number,
  timings: MotionTimings,
): HandshakeVisual {
  const { durations } = timings;
  const elapsed = Math.max(0, now - state.since);
  const idle: HandshakeVisual = {
    comet: undefined,
    verdictMix: 0,
    verdict: undefined,
    pulse: undefined,
    shake: 0,
  };

  switch (state.step) {
    case "rest":
    case "idle":
      return idle;
    case "challenge":
    case "response":
      return {
        ...idle,
        comet: {
          leg: state.step,
          progress: easeOutCubic(clamp01(elapsed / durations.packet)),
        },
      };
    case "genuine":
    case "rejected": {
      // The calm mode: the final state at once; the colour holds until the
      // next run, with no pulse and no shake.
      if (state.instant) {
        return { ...idle, verdict: state.step, verdictMix: 1 };
      }
      // 0–verdict: the chip lerps to the verdict colour; it holds for
      // verdict-hold, then releases to holo over release.
      const rise = clamp01(elapsed / durations.verdict);
      const release =
        elapsed > durations["verdict-hold"]
          ? clamp01(
              1 - (elapsed - durations["verdict-hold"]) / durations.release,
            )
          : 1;
      const pulse =
        elapsed < durations.pulse ? elapsed / durations.pulse : undefined;
      const shaking = state.step === "rejected" && elapsed < durations.shake;
      const seconds = elapsed / 1000;
      return {
        comet: undefined,
        verdict: state.step,
        verdictMix: rise * release,
        pulse,
        shake: shaking
          ? Math.sin(seconds * 60) * 0.06 * (1 - elapsed / durations.shake)
          : 0,
      };
    }
  }
}
