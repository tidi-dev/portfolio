import { Icon } from "@/components/ui/icon";
import { drawings } from "@/content/drawings";
import { BenchDrawing } from "./bench-drawing";

/**
 * The handshake bench at rest (DESIGN.md → Handshake bench; Phase 4): a
 * `plate` figure with the completed handshake, the readout "genuine" with
 * `check`, and the caption, plus a visually hidden list of the steps (Approved
 * copy a11y.steps.bench). This is the server HTML, and it stays after
 * hydration. The run and counterfeit controls arrive with their behaviour in
 * Phase 6, so no button is ever dead.
 */
export function HandshakeBench() {
  const { caption, steps, verdicts } = drawings.bench;

  return (
    <figure className="@container flex flex-1 flex-col rounded-base border border-rule bg-surface-raised p-md md:p-lg">
      <div className="flex flex-1 flex-col justify-center gap-md">
        <BenchDrawing />
        {/* The readout is the bench's polite live region (Phase 6 announces the steps). */}
        <p
          aria-live="polite"
          className="flex items-center gap-xs type-ui-strong text-accent"
        >
          <Icon name="check" />
          {verdicts.genuine}
        </p>
      </div>
      <ol className="sr-only">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <figcaption className="mt-md type-body-sm text-text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
