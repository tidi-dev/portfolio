import { typography } from "@/lib/format/typography";

/**
 * A hologram's text alternative (DESIGN.md → Quest file: "the steps <ol>
 * in the log style (a11y.steps.*)"): the approved steps, each with its
 * numeral chip lit, as the hero's handshake log draws them.
 */
export function QuestSteps({ steps }: { readonly steps: readonly string[] }) {
  return (
    <div className="chamfer p-md quest-log">
      <ol className="flex flex-col gap-xs type-body-compact">
        {steps.map((step, index) => (
          <li key={step} data-state="lit" className="step-line">
            <span aria-hidden="true" className="step-numeral type-label">
              {index + 1}
            </span>
            {typography(step)}
          </li>
        ))}
      </ol>
    </div>
  );
}
