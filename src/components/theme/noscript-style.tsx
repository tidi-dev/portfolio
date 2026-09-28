/**
 * Without JavaScript (contrib-engineering §5.2): the controls that need a
 * script are hidden (`data-js-control`: the theme and motion toggles, "Run
 * the handshake" and "Counterfeit chip"), so no control is dead. The menu
 * is a native popover and works without a script. This rule sits outside
 * Tailwind's cascade layers, so it wins over any utility.
 */
const NO_SCRIPT_CSS = "[data-js-control]{display:none}";

export function NoscriptStyle() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_CSS }} />
    </noscript>
  );
}
