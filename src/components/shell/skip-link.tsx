import { copy } from "@/content/copy";

/**
 * The skip link (DESIGN.md → Skip link and focus ring): the first focusable
 * element, to `main`; `skip-link` (gold, 48 px, button type) at an 8 px
 * inset when focused, on the top layer of the z scale.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-xs left-xs z-skip-link inline-flex h-control items-center bg-accent px-md type-button text-on-accent not-focus:sr-only"
    >
      {copy.a11y.skipLink}
    </a>
  );
}
