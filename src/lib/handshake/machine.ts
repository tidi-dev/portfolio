/**
 * The handshake bench's state (DESIGN.md → Handshake bench → States and
 * Behaviour; contrib-engineering §1.3). Pure: the client leaf dispatches
 * events, and bench.css animates each step from the data attributes this
 * module derives. No duration lives here: the Motion tokens are CSS.
 *
 * - rest: the completed handshake, the server HTML.
 * - idle: lines construction, readout empty.
 * - challenge → response → genuine; with the counterfeit chip, challenge → rejected.
 * - instant (reduced motion): a run lands on the verdict at once.
 */
export type BenchStep =
  "rest" | "idle" | "challenge" | "response" | "genuine" | "rejected";

export interface BenchState {
  readonly step: BenchStep;
  readonly counterfeit: boolean;
  /** A new id per run, so the drawing remounts and its animations restart from zero. */
  readonly run: number;
  /** Reduced motion: the final state appears at once. */
  readonly instant: boolean;
}

export type BenchEvent =
  | { readonly type: "run"; readonly instant: boolean }
  | { readonly type: "toggle" }
  /** An animation of `from` ended; stale events from an interrupted run are ignored. */
  | { readonly type: "advance"; readonly from: BenchStep };

export const INITIAL_BENCH: BenchState = {
  step: "rest",
  counterfeit: false,
  run: 0,
  instant: false,
};

function verdict(counterfeit: boolean): BenchStep {
  return counterfeit ? "rejected" : "genuine";
}

export function benchReducer(state: BenchState, event: BenchEvent): BenchState {
  switch (event.type) {
    // Run always restarts from idle, interrupting any run in progress: the
    // new run id remounts the drawing, so nothing of the old run survives.
    case "run":
      return {
        ...state,
        run: state.run + 1,
        instant: event.instant,
        step: event.instant ? verdict(state.counterfeit) : "challenge",
      };
    // The toggle cancels a run and returns to idle.
    case "toggle":
      return {
        ...state,
        counterfeit: !state.counterfeit,
        step: "idle",
        instant: false,
      };
    case "advance":
      if (event.from !== state.step) return state;
      if (state.step === "challenge") {
        // The counterfeit chip fails after the challenge.
        return { ...state, step: state.counterfeit ? "rejected" : "response" };
      }
      if (state.step === "response") return { ...state, step: "genuine" };
      return state;
  }
}

/**
 * The keyframes whose end moves the run on (bench.css declares them under
 * these names): the challenge packet reaching the chip, and the response
 * packet reaching the host. Every other animation (fades, the pulse, the
 * exit, the verdict) ends without an event of its own.
 */
const STEP_END_ANIMATIONS: Readonly<Record<string, BenchStep>> = {
  "bench-challenge-travel": "challenge",
  "bench-response-travel": "response",
};

/** The step an `animationend` closes, or undefined for any other animation. */
export function stepEndedBy(animationName: string): BenchStep | undefined {
  return STEP_END_ANIMATIONS[animationName];
}

export type LineTone = "proof" | "construction";

/**
 * Each line's tone (DESIGN.md → States): both proof at rest and after a
 * genuine run; both construction when idle; the challenge alone while it
 * travels and after a rejection; the response turns proof as the chip answers.
 */
export function lineTones(step: BenchStep): {
  readonly challenge: LineTone;
  readonly response: LineTone;
} {
  switch (step) {
    case "rest":
    case "response":
    case "genuine":
      return { challenge: "proof", response: "proof" };
    case "challenge":
    case "rejected":
      return { challenge: "proof", response: "construction" };
    case "idle":
      return { challenge: "construction", response: "construction" };
  }
}

export type Readout =
  | { readonly kind: "empty" }
  /** A step word, announced by the live region but not shown. */
  | { readonly kind: "step"; readonly word: "challenge" | "response" }
  | { readonly kind: "verdict"; readonly verdict: "genuine" | "rejected" };

/**
 * What the polite live region holds: each step, then the verdict; the
 * verdict alone when instant (an instant run never passes through a step).
 */
export function readout(step: BenchStep): Readout {
  switch (step) {
    case "rest":
    case "genuine":
      return { kind: "verdict", verdict: "genuine" };
    case "rejected":
      return { kind: "verdict", verdict: "rejected" };
    case "challenge":
      return { kind: "step", word: "challenge" };
    case "response":
      return { kind: "step", word: "response" };
    case "idle":
      return { kind: "empty" };
  }
}
