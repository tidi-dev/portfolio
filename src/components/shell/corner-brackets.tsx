const CORNERS = ["bracket-tl", "bracket-tr", "bracket-bl", "bracket-br"];

/**
 * Corner brackets (DESIGN.md → Shapes): four 30 px L-marks framing the hero
 * viewport only; decorative.
 */
export function CornerBrackets() {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`corner-bracket ${corner}`}
        />
      ))}
    </>
  );
}
