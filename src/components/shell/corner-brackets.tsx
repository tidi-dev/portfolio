const CORNERS = ["bracket-tl", "bracket-tr", "bracket-bl", "bracket-br"];

/** The four L-marks; `motion` names how they draw on. */
function Brackets({ motion }: { readonly motion: string }) {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`corner-bracket ${corner} ${motion}`}
        />
      ))}
    </>
  );
}

/**
 * Corner brackets (DESIGN.md → Shapes): four 30 px L-marks, decorative.
 * The hero's brackets frame its viewport and draw on at load.
 */
export function HeroBrackets() {
  return <Brackets motion="bracket-load" />;
}

/**
 * The same frame around the Join party grid, so it opens and closes the
 * page; it draws on when the sign-off panel powers on (reveal.css).
 */
export function PartyBrackets() {
  return <Brackets motion="bracket-reveal" />;
}
