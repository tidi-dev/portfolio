import { HandshakeBench } from "@/components/handshake-bench/handshake-bench";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { typography } from "@/lib/format/typography";
import { HeroLockup } from "./hero-lockup";

const HEADING_ID = "hero-heading";

/**
 * The hero (DESIGN.md → Hero): on the left, the h1 lockup, the role in
 * `ui-strong` with the positioning sentence in `lead`, and the call to
 * action; on the right, the bench. Stacked below lg, split 5 | 7 from lg,
 * where both columns stretch to one height so the bench's caption and the
 * CTA share the bottom edge. The LCP element is text.
 *
 * The CTA links to #contact, so it renders only once Contact does (Phase 9;
 * no dangling anchors). The Résumé link joins in Phase 10, once the PDF
 * exists.
 */
export function Hero({ ctaHref }: { readonly ctaHref: string | undefined }) {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="grid grid-cols-1 gap-y-xl pt-xl lg:grid-cols-12 lg:gap-x-gutter lg:pt-2xl"
    >
      <div className="flex flex-col lg:col-span-5">
        <HeroLockup id={HEADING_ID} />
        <p className="mt-lg type-ui-strong">{identity.role}</p>
        <p className="mt-xs max-w-measure-lead type-lead">
          {typography(copy.hero.sentence)}
        </p>
        {ctaHref === undefined ? null : (
          <p className="mt-xl flex lg:mt-auto lg:pt-xl">
            <a
              href={ctaHref}
              className="inline-flex h-2xl w-full items-center justify-center rounded-base bg-accent px-button type-ui-strong text-on-accent transition-feedback hover:bg-accent-hover active:bg-accent-hover md:w-auto"
            >
              {copy.hero.cta}
            </a>
          </p>
        )}
      </div>
      <div className="flex flex-col lg:col-span-7">
        <HandshakeBench />
      </div>
    </section>
  );
}
