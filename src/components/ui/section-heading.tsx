/**
 * A section's h2 (DESIGN.md → Section heading): `heading-section`, with the
 * 2 × 28 px holo lead line. `focusTarget` makes it focusable from script
 * (not in the Tab order), for a control that moves focus to the section.
 */
export function SectionHeading({
  id,
  focusTarget,
  children,
}: {
  readonly id: string;
  readonly focusTarget?: true;
  readonly children: string;
}) {
  return (
    <h2
      id={id}
      tabIndex={focusTarget === undefined ? undefined : -1}
      className="lead-line type-heading-section text-primary"
    >
      {children}
    </h2>
  );
}
