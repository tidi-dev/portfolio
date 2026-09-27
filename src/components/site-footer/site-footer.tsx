import { identity } from "@/content/identity";

/**
 * The footer (DESIGN.md → Contact, footer, other surfaces): a `divider`, then
 * the owner's tagline in `body-sm`, `text-muted`. Nothing else.
 */
export function SiteFooter() {
  return (
    <footer className="mt-section border-t border-rule py-lg">
      <p className="type-body-sm text-text-muted">{identity.tagline}</p>
    </footer>
  );
}
