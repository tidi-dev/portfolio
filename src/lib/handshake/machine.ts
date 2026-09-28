/**
 * The hero handshake's state (DESIGN.md → Handshake log, Motion → Handshake;
 * contrib-engineering §6.3), reused from v1 and extended with the autoplay
 * guard. Pure: the hero stage dispatches events with the time they happened,
 * the schedule (schedule.ts) times the steps, and both the HTML log and the
 * 3D scene are views of this state, so they can't drift apart.
 *
 * - rest: the server HTML, a completed genuine handshake.
 * - challenge → response → genuine; with the counterfeit chip,
 *   challenge → rejected (the fake fails after the challenge).
 * - idle: a run cancelled by the switch; nothing lit, no verdict.
 * - instant (the calm motion mode): a run lands on its verdict at once.
 */
export type HandshakeStep =
  "rest" | "idle" | "challenge" | "response" | "genuine" | "rejected";

export interface HandshakeState {
  readonly step: HandshakeStep;
  readonly counterfeit: boolean;
  /** A new id per run, so a stale step timer can't move a newer run on. */
  readonly run: number;
  /** The calm mode: the run landed on its verdict without steps. */
  readonly instant: boolean;
  /** The current run is the one-time autoplay (its verdict is not announced). */
  readonly autoplay: boolean;
  /** The autoplay has happened (or can no longer happen) on this page load. */
  readonly autoplayed: boolean;
  /** When the current step began, in `performance.now()` milliseconds. */
  readonly since: number;
}

export type HandshakeEvent =
  | { readonly type: "run"; readonly instant: boolean; readonly at: number }
  | { readonly type: "toggle"; readonly at: number }
  /** The one-time autoplay: acts only before any visitor action. */
  | { readonly type: "autoplay"; readonly at: number }
  /** A step's time ran out; stale events from an interrupted run are ignored. */
  | {
      readonly type: "advance";
      readonly from: HandshakeStep;
      readonly run: number;
      readonly at: number;
    }
  /** Motion was switched off mid-run: land on the end state at once. */
  | { readonly type: "settle"; readonly at: number };

export const INITIAL_HANDSHAKE: HandshakeState = {
  step: "rest",
  counterfeit: false,
  run: 0,
  instant: false,
  autoplay: false,
  autoplayed: false,
  since: 0,
};

export function isRunning(step: HandshakeStep): boolean {
  return step === "challenge" || step === "response";
}

function verdict(counterfeit: boolean): HandshakeStep {
  return counterfeit ? "rejected" : "genuine";
}

export function handshakeReducer(
  state: HandshakeState,
  event: HandshakeEvent,
): HandshakeState {
  switch (event.type) {
    // A visitor's run always restarts, and cancels the autoplay for good.
    case "run":
      return {
        ...state,
        run: state.run + 1,
        instant: event.instant,
        autoplay: false,
        autoplayed: true,
        step: event.instant ? verdict(state.counterfeit) : "challenge",
        since: event.at,
      };
    // The switch sets the chip for the next run. It cancels a run in
    // progress (to idle); a finished verdict stays until the next run.
    case "toggle":
      return {
        ...state,
        counterfeit: !state.counterfeit,
        autoplay: false,
        autoplayed: true,
        ...(isRunning(state.step)
          ? { step: "idle", instant: false, since: event.at }
          : {}),
      };
    case "autoplay":
      if (state.autoplayed) return state;
      return {
        ...state,
        run: state.run + 1,
        instant: false,
        autoplay: true,
        autoplayed: true,
        step: "challenge",
        since: event.at,
      };
    case "advance":
      if (event.run !== state.run || event.from !== state.step) return state;
      if (state.step === "challenge") {
        return {
          ...state,
          step: state.counterfeit ? "rejected" : "response",
          since: event.at,
        };
      }
      if (state.step === "response") {
        return { ...state, step: "genuine", since: event.at };
      }
      return state;
    case "settle":
      if (!isRunning(state.step)) return state;
      // The autoplay goes back to the server's rest state, silently.
      if (state.autoplay) {
        return { ...state, step: "rest", autoplay: false, since: event.at };
      }
      return {
        ...state,
        step: verdict(state.counterfeit),
        instant: true,
        since: event.at,
      };
  }
}

export type StepState = "pending" | "lit" | "skipped";

/**
 * Each log line's state (DESIGN.md → Handshake log): all lit at rest and
 * after a genuine run; nothing lit when idle; the counterfeit run skips
 * step 2.
 */
export function stepStates(
  step: HandshakeStep,
): readonly [StepState, StepState, StepState] {
  switch (step) {
    case "rest":
    case "genuine":
      return ["lit", "lit", "lit"];
    case "idle":
      return ["pending", "pending", "pending"];
    case "challenge":
      return ["lit", "pending", "pending"];
    case "response":
      return ["lit", "lit", "pending"];
    case "rejected":
      return ["lit", "skipped", "lit"];
  }
}

/** The line a run is on (`aria-current="step"`), or undefined at rest or idle. */
export function currentStepIndex(step: HandshakeStep): number | undefined {
  switch (step) {
    case "challenge":
      return 0;
    case "response":
      return 1;
    case "genuine":
    case "rejected":
      return 2;
    case "rest":
    case "idle":
      return undefined;
  }
}

/**
 * The verdict the `<output>` holds (DESIGN.md → Motion → Safety): the
 * autoplay keeps it at "genuine", so nothing is announced; a visitor's run
 * clears it, then sets it, so the verdict alone is announced.
 */
export function shownVerdict(
  state: HandshakeState,
): "genuine" | "rejected" | undefined {
  if (state.step === "rest" || state.autoplay) return "genuine";
  if (state.step === "genuine" || state.step === "rejected") return state.step;
  return undefined;
}
