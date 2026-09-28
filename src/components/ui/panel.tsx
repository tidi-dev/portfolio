import type { ReactNode } from "react";

/**
 * The power-on wipe's cover (reveal.css): a page-surface layer over the
 * panel that shrinks away to the right once the panel is reached. The
 * wipe is drawn by this layer rather than by clipping the panel, because
 * an IntersectionObserver never sees a target clipped to nothing, so the
 * panel would never be revealed. At rest (no JavaScript, the calm mode,
 * after the wipe) the cover has no width, and it never takes a pointer.
 */
export function PowerCover() {
  return <span aria-hidden="true" className="power-cover" />;
}

/**
 * A panel (DESIGN.md → Panel): the chamfered block every section is made
 * of, opaque `surface-raised` with the 1 px `line` edge, 16 px padding
 * below md and 24 px from md. It powers on the first time it is a quarter
 * in view (`data-reveal`, reveal.css); without JavaScript, and in the calm
 * mode, it is simply there. Panels aren't interactive and get no hover.
 */
export function Panel({
  className,
  children,
}: {
  /** Layout classes: the grid span, a flex direction. */
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <div
      data-reveal="panel"
      className={
        className === undefined
          ? "chamfer p-md md:p-lg"
          : `chamfer p-md md:p-lg ${className}`
      }
    >
      <PowerCover />
      {children}
    </div>
  );
}

/** A panel's h3 (DESIGN.md → Panel): `heading-panel` in accent-ink, with a trailing rule. */
export function PanelHeading({
  id,
  children,
}: {
  readonly id?: string;
  readonly children: string;
}) {
  return (
    <h3 id={id} className="panel-heading type-heading-panel text-accent-ink">
      {children}
    </h3>
  );
}
