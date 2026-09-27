import { Hero } from "@/components/hero/hero";
import {
  PAGE_SECTIONS,
  PRIMARY_ACTION_HREF,
} from "@/components/page/page-sections";

/**
 * The one page (contrib-design §1.3): the hero, then the sections the
 * registry renders, `section` rhythm apart. `main` takes focus from the skip
 * link (tabIndex -1: focusable by the link, never a Tab stop).
 */
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="flex flex-1 flex-col gap-section">
      <Hero ctaHref={PRIMARY_ACTION_HREF} />
      {PAGE_SECTIONS.map(({ section, Component }) => (
        <Component key={section.id} section={section} />
      ))}
    </main>
  );
}
