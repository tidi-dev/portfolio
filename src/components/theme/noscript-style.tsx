/**
 * Without JavaScript (contrib-engineering §5.2): the controls that need a
 * script are hidden (`data-js-control`: the theme and motion toggles, "Run
 * the handshake" and "Counterfeit chip"), so no control is dead. The menu
 * is a native popover and works without a script. The Quest journal
 * (DESIGN.md → Quest detail panel → No JS) hides its card row and stage
 * and shows every tabpanel, stacked across the panel's full width. These
 * rules sit outside Tailwind's cascade layers, so they win over any
 * utility. The tabpanels' rule is the exception: Tailwind's preflight
 * hides `[hidden]` with `!important` in the base layer, and a layered
 * important declaration beats an unlayered one, so this rule joins the
 * base layer, where its higher specificity wins.
 */
const NO_SCRIPT_CSS = [
  "[data-js-control],[data-quest-tabs],[data-quest-stage]{display:none}",
  "@layer base{[data-quest-panel][hidden]{display:flex!important}}",
  "[data-quest-panels]{grid-column:1/-1}",
].join("");

export function NoscriptStyle() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_CSS }} />
    </noscript>
  );
}
