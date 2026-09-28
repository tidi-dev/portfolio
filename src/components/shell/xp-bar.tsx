/**
 * The XP bar (DESIGN.md → HUD bar): 10 segments, filled to a fixed 70 %,
 * decorative and never a number (Do's and Don'ts: honesty locks). Its
 * words are the HUD lines beside it.
 */
export function XpBar() {
  return (
    <span aria-hidden="true" className="xp-track">
      <span className="xp-fill" />
    </span>
  );
}
