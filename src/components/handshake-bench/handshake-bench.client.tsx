"use client";

import { type AnimationEvent, type ReactNode, useReducer } from "react";
import {
  benchReducer,
  INITIAL_BENCH,
  lineTones,
  readout,
  stepEndedBy,
} from "@/lib/handshake/machine";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

interface HandshakeBenchControlsProps {
  /** Approved copy bench.run, bench.toggle and bench.verdict-rejected; the owner's step words and "genuine". */
  readonly labels: {
    readonly run: string;
    readonly toggle: string;
    readonly challenge: string;
    readonly response: string;
    readonly genuine: string;
    readonly rejected: string;
  };
  /** Server-rendered Tabler icons, so no icon code ships. */
  readonly icons: {
    readonly play: ReactNode;
    readonly square: ReactNode;
    readonly squareCheck: ReactNode;
    readonly check: ReactNode;
    readonly x: ReactNode;
  };
  /** The drawing's two static variants. */
  readonly children: ReactNode;
}

/**
 * The handshake bench's behaviour (DESIGN.md → Handshake bench;
 * contrib-engineering §1.3, §5.3), the only client leaf with motion.
 *
 * - The state lives in a pure reducer; bench.css animates each step from
 *   the data attributes, and the run moves on when a packet's trip ends.
 * - Run restarts from idle: a new run id remounts the drawing, so its
 *   animations start from zero. The toggle cancels a run and returns to idle.
 * - Reduced motion is read at click time: the run lands on the verdict at
 *   once, and the live region announces only the verdict.
 * - Nothing moves focus, and there are no effects or listeners to clean up.
 * - It renders the rest state first, exactly the server HTML. Without
 *   JavaScript the <noscript> style hides the controls.
 */
export function HandshakeBenchControls({
  labels,
  icons,
  children,
}: HandshakeBenchControlsProps) {
  const [state, dispatch] = useReducer(benchReducer, INITIAL_BENCH);
  const tones = lineTones(state.step);
  const shown = readout(state.step);

  function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    const from = stepEndedBy(event.animationName);
    if (from !== undefined) dispatch({ type: "advance", from });
  }

  return (
    <div
      data-bench=""
      data-step={state.step}
      data-challenge={tones.challenge}
      data-response={tones.response}
      data-counterfeit={state.counterfeit ? "" : undefined}
      data-instant={state.instant ? "" : undefined}
      onAnimationEnd={onAnimationEnd}
      className="flex flex-1 flex-col justify-center gap-md"
    >
      <div key={state.run}>{children}</div>
      {/* The readout: the bench's polite live region. Step words are announced, not shown. */}
      <p aria-live="polite" className="flex min-h-lh type-ui-strong">
        {shown.kind === "step" ? (
          <span className="sr-only">{labels[shown.word]}</span>
        ) : null}
        {shown.kind === "verdict" && shown.verdict === "genuine" ? (
          <span
            key={state.run}
            data-verdict=""
            className="inline-flex items-center gap-xs text-accent"
          >
            {icons.check}
            {labels.genuine}
          </span>
        ) : null}
        {shown.kind === "verdict" && shown.verdict === "rejected" ? (
          <span
            key={state.run}
            data-verdict=""
            className="inline-flex items-center gap-xs text-text-muted"
          >
            <span className="inline-flex text-trace">{icons.x}</span>
            {labels.rejected}
          </span>
        ) : null}
      </p>
      <div data-js-control="" className="flex flex-col gap-sm @bench:flex-row">
        <button
          type="button"
          onClick={() => {
            dispatch({
              type: "run",
              instant: window.matchMedia(REDUCED_MOTION).matches,
            });
          }}
          className="inline-flex h-2xl w-full items-center justify-center gap-xs rounded-base bg-accent px-button type-ui-strong text-on-accent transition-feedback hover:bg-accent-hover active:bg-accent-hover @bench:w-auto"
        >
          {icons.play}
          {labels.run}
        </button>
        <button
          type="button"
          aria-pressed={state.counterfeit}
          onClick={() => {
            dispatch({ type: "toggle" });
          }}
          className="inline-flex h-2xl w-full items-center justify-center gap-xs rounded-base border-toggle border-trace bg-surface-raised px-md type-ui-strong text-primary transition-feedback hover:border-accent hover:text-accent aria-pressed:border-2 aria-pressed:border-primary aria-pressed:hover:border-accent @bench:w-auto"
        >
          {state.counterfeit ? icons.squareCheck : icons.square}
          {labels.toggle}
        </button>
      </div>
    </div>
  );
}
