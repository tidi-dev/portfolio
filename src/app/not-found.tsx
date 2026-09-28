import { PrimaryButtonLink } from "@/components/ui/button-link";
import { copy } from "@/content/copy";

/**
 * Not-found (DESIGN.md → Not-found): a section heading "Nothing here" and a
 * button-primary "Back to TiDi", on the page backdrop.
 */
export default function NotFound() {
  return (
    <main id="main" className="hero-frame">
      <div className="w-full page-x">
        <div className="mx-auto flex max-w-container flex-col items-start gap-lg">
          <h1 className="lead-line type-heading-section text-primary">
            {copy.notFound.heading}
          </h1>
          <PrimaryButtonLink href="/">{copy.notFound.link}</PrimaryButtonLink>
        </div>
      </div>
    </main>
  );
}
