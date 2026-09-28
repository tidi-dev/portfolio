import {
  currentStepIndex,
  type HandshakeState,
  shownVerdict,
  stepStates,
} from "@/lib/handshake/machine";

export interface HandshakeLogCopy {
  /** a11y.steps.bench 1 and 2. */
  readonly steps: readonly [string, string];
  /** a11y.steps.bench 3 before its verdict word ("Verdict:"). */
  readonly verdictPrefix: string;
  readonly verdicts: { readonly genuine: string; readonly rejected: string };
}

/**
 * The handshake log (DESIGN.md → Handshake log; contrib-engineering §6.3):
 * a glass <ol> of the three `a11y.steps.bench` lines, the run's line marked
 * `aria-current="step"`, a skipped step 2 in <del>, and the verdict in an
 * <output> (implicit role status, a polite live region), the only thing
 * announced. Rendered by the hero
 * stage leaf; its server HTML is the rest state (all lit, "genuine").
 */
export function HandshakeLog({
  state,
  copy,
}: {
  readonly state: HandshakeState;
  readonly copy: HandshakeLogCopy;
}) {
  const states = stepStates(state.step);
  const current = currentStepIndex(state.step);
  const verdict = shownVerdict(state);

  return (
    <div className="chamfer hero-log p-md chamfer-glass">
      <ol className="flex flex-col gap-xs type-body-compact">
        {copy.steps.map((text, index) => (
          <li
            key={text}
            data-state={states[index]}
            aria-current={current === index ? "step" : undefined}
            className="step-line"
          >
            <span aria-hidden="true" className="step-numeral type-label">
              {index + 1}
            </span>
            {states[index] === "skipped" ? <del>{text}</del> : text}
          </li>
        ))}
        <li
          data-state={states[2]}
          aria-current={current === 2 ? "step" : undefined}
          className="step-line"
        >
          <span aria-hidden="true" className="step-numeral type-label">
            {copy.steps.length + 1}
          </span>
          <span className="inline-flex flex-wrap items-baseline gap-xs">
            <span>{copy.verdictPrefix}</span>
            <output
              data-verdict={verdict}
              className="type-button verdict-output"
            >
              {verdict === undefined ? null : copy.verdicts[verdict]}
            </output>
          </span>
        </li>
      </ol>
    </div>
  );
}
