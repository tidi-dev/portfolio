import { SpikeStage } from "@/components/holo/spike-stage.client";
import { about } from "@/content/about";
import { copy } from "@/content/copy";
import { holograms } from "@/content/holograms";
import { identity } from "@/content/identity";
import { sections } from "@/content/sections";
import { typography } from "@/lib/format/typography";

const NAV_SECTIONS = sections.filter(
  (section) => section.nav && section.present,
);

/**
 * Phase 1: a bare page that proves the tokens, both themes and both fonts,
 * built only from src/content. Phase 2 replaces it with the shell and hero.
 */
export default function HomePage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-container flex-col gap-2xl section-y page-x"
    >
      <ul className="flex flex-wrap gap-lg type-nav">
        {NAV_SECTIONS.map((section) => (
          <li key={section.id}>{section.label}</li>
        ))}
      </ul>

      <div className="flex flex-col gap-lg">
        <p className="type-label text-accent-ink">{copy.ui.player}</p>
        <h1 className="flex flex-col gap-xs">
          <span className="type-display">{identity.brand}</span>
          <span
            lang={identity.nativeName.lang}
            className="type-name text-text-muted"
          >
            {identity.nativeName.text}
          </span>
          <span className="type-name text-text-muted">{identity.name}</span>
        </h1>
        <p className="type-role text-holo">{identity.role}</p>
        <p className="max-w-measure-hero">{typography(copy.hero.sentence)}</p>
      </div>

      <SpikeStage />

      <div className="grid gap-gutter lg:grid-cols-2">
        <div className="chamfer flex flex-col gap-sm p-lg">
          <ol className="flex list-inside list-decimal flex-col gap-xs type-body-sm">
            {holograms.bench.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="type-button text-success">
            {holograms.bench.verdicts.genuine}
          </p>
        </div>

        <section
          aria-labelledby="character-stats"
          className="chamfer flex flex-col gap-md p-lg"
        >
          <h2
            id="character-stats"
            className="type-heading-panel text-accent-ink"
          >
            {copy.ui.characterStats}
          </h2>
          <dl className="grid grid-cols-2 gap-xs">
            {about.stats.map((stat) => (
              <div key={stat.label} className="contents">
                <dt className="type-label text-accent-ink">{stat.label}</dt>
                <dd className="type-body-sm">{typography(stat.value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
