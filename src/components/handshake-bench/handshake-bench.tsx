import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { drawings } from "@/content/drawings";
import { typography } from "@/lib/format/typography";
import { BenchDrawing } from "./bench-drawing";
import { HandshakeBenchControls } from "./handshake-bench.client";

// Hoisted: the labels and icons the client leaf receives never change.
const LABELS = {
  run: copy.bench.run,
  toggle: copy.bench.toggle,
  challenge: drawings.bench.labels.challenge,
  response: drawings.bench.labels.response,
  genuine: drawings.bench.verdicts.genuine,
  rejected: drawings.bench.verdicts.rejected,
};

const ICONS = {
  play: <Icon name="player-play" />,
  square: <Icon name="square" />,
  squareCheck: <Icon name="square-check" />,
  check: <Icon name="check" />,
  x: <Icon name="x" />,
};

/**
 * The handshake bench (DESIGN.md → Handshake bench): a `plate` figure with
 * the drawing, the readout (a polite live region), the run and counterfeit
 * controls, and the caption, plus a visually hidden list of the steps
 * (Approved copy a11y.steps.bench). The server HTML is the rest state: the
 * completed handshake and the readout "genuine" with `check`. The client
 * leaf adds the behaviour; without JavaScript its controls are hidden.
 */
export function HandshakeBench() {
  const { caption, steps } = drawings.bench;

  return (
    <figure className="@container flex flex-1 flex-col rounded-base border border-rule bg-surface-raised p-md md:p-lg">
      <HandshakeBenchControls labels={LABELS} icons={ICONS}>
        <BenchDrawing />
      </HandshakeBenchControls>
      <ol className="sr-only">
        {steps.map((step) => (
          <li key={step}>{typography(step)}</li>
        ))}
      </ol>
      <figcaption className="mt-md type-body-sm text-text-muted">
        {typography(caption)}
      </figcaption>
    </figure>
  );
}
