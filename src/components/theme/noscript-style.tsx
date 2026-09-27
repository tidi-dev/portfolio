/**
 * Without JavaScript (contrib-engineering §5.1; DESIGN.md → Header, Links and
 * buttons, Handshake bench): the controls that need a script are hidden
 * (`data-js-control`: the theme toggle, the menu button, and the bench
 * controls from Phase 6), and the menu panel shows its links. These rules sit
 * outside Tailwind's cascade layers, so they win over its utilities; the
 * panel's `md:hidden!` is important and still hides it from md, where the
 * inline nav shows. Nothing is dead, and nothing shifts when JavaScript runs.
 */
const NO_SCRIPT_CSS =
  "[data-js-control]{display:none}[data-menu-panel]{display:block}";

export function NoscriptStyle() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_CSS }} />
    </noscript>
  );
}
