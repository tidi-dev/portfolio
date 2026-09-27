# Web interface checklist

Sources:
- Vercel Web Interface Guidelines, condensed to what a static portfolio can hit. To refresh the full list, fetch `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`.
- The portfolio-relevant parts of Taste's pre-flight check.

Report format: `file:line - issue`, grouped by file. A clean file gets `✓ pass`.

## Accessibility & semantics
- `<button>` for actions, `<a>` for navigation; no clickable `div` or `span`.
- Icon-only controls have `aria-label`; decorative icons have `aria-hidden="true"`.
- Images have `alt` (`alt=""` if decorative); meaningful media has a description.
- Headings are hierarchical with one `h1`; there is a skip link to `main`; heading anchors have `scroll-margin-top`.
- Semantic HTML before ARIA. `aria-live="polite"` for async status such as "copied".
- `lang` is set on `<html>`, and the page title is accurate.

## Focus & keyboard
- Every interactive element shows a visible `:focus-visible` style. No `outline: none` without a replacement.
- `:focus-within` for compound controls. Sticky header and footer never cover the focused element.
- Everything is reachable and operable by keyboard; no traps; the menu or dialog closes on Escape and returns focus.

## Typography & copy
- `…` not `...`; curly quotes; `&nbsp;` in `10&nbsp;MB`, `⌘&nbsp;K` and brand names.
- `tabular-nums` for aligned numbers; `text-wrap: balance` or `pretty` on headings.
- Sentence case. No em or en dashes in UI copy we wrote. One label per intent.

## Content handling
- Long text wraps or truncates deliberately (`min-w-0` on flex children, `break-words`).
- A missing optional field renders nothing, not an empty box or a placeholder.

## Images & media
- `<img>` has explicit `width` and `height`, or the framework equivalent. Only the LCP image is `priority`; below-fold images are lazy.
- Video replaces GIFs. Autoplay longer than 5 seconds has a pause control and stops under reduced motion.

## Animation
- Honours `prefers-reduced-motion`. Animates only `transform` and `opacity`. Never `transition: all`.
- Correct `transform-origin`. SVG transforms go on a `<g>` wrapper. Animations are interruptible.

## Layout & touch
- No horizontal scroll from 320 to 1920px. Full-bleed layouts respect `env(safe-area-inset-*)`.
- Layout uses flex or grid, never JavaScript measurement. Touch targets are ≥ 44px. `touch-action: manipulation` on controls.
- `overscroll-behavior: contain` in the mobile menu. `autofocus` is not used on mobile.

## Theming
- `color-scheme` matches the theme on `<html>`, and `<meta name="theme-color">` matches the background.
- The theme is applied before paint: no flash, no hydration mismatch.
- Hover, active and focus states increase contrast.

## Navigation & state
- Links are real `<a>` elements, so modifier-click works. External links have `rel="noopener noreferrer"` when `target="_blank"`.
- In-page navigation updates the URL hash. Stateful UI such as project filters is reflected in the URL.

## Hydration & runtime
- No console errors or hydration warnings. Dates and numbers use `Intl.*` and are hydration-safe.
- `suppressHydrationWarning` appears only where it is truly needed.

## Anti-patterns (always flag)
`user-scalable=no` or `maximum-scale=1` · `transition: all` · `outline-none` without replacement · a `div` with `onClick` · images without dimensions · icon buttons without labels · hardcoded date or number formats · autoplaying GIFs · gesture-only actions.
