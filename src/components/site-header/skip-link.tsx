import { copy } from "@/content/copy";

/**
 * The skip link (DESIGN.md → Header, navigation, skip link): the first
 * focusable element, targeting `main`, shown as `skip-link` at an 8 px inset
 * when focused, on the only raised layer.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-xs left-xs z-skip-link inline-flex h-2xl items-center rounded-base bg-accent px-md type-ui-strong text-on-accent not-focus:sr-only"
    >
      {copy.a11y.skipLink}
    </a>
  );
}
