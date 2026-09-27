import type { ReactNode } from "react";
import { typography } from "@/lib/format/typography";

interface DrawingFigureProps {
  /** The owner's caption (DESIGN.md → the drawing table). */
  readonly caption: string;
  /** The approved step list (info.md → Approved copy, a11y.steps.*). */
  readonly steps: readonly string[];
  /** The drawing's two static variants. */
  readonly children: ReactNode;
}

/**
 * The drawing figure shell (DESIGN.md → Drawing grammar → Text alternative):
 * a `plate` whose inner width drives the variant's container query, both
 * SVGs `aria-hidden`, a visually hidden ordered list of the steps, and a
 * visible `figcaption` in `caption` style.
 */
export function DrawingFigure({
  caption,
  steps,
  children,
}: DrawingFigureProps) {
  return (
    <figure className="@container rounded-base border border-rule bg-surface-raised p-md md:p-lg">
      {children}
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
