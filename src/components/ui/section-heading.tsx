/**
 * A section's h2 (DESIGN.md → Section heading): `heading-section`, with the
 * 2 × 28 px holo lead line.
 */
export function SectionHeading({
  id,
  children,
}: {
  readonly id: string;
  readonly children: string;
}) {
  return (
    <h2 id={id} className="lead-line type-heading-section text-primary">
      {children}
    </h2>
  );
}
