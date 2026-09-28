import { CornerBrackets } from "@/components/shell/corner-brackets";
import { copy } from "@/content/copy";
import { holograms } from "@/content/holograms";
import { HERO_TITLE_ID, HeroLockup } from "./hero-lockup";
import { HeroStage } from "./hero-stage.client";

const { steps, verdicts, tags } = holograms.bench;

/**
 * a11y.steps.bench's third line up to its verdict word: "Verdict: genuine."
 * → "Verdict:". The log shows the live verdict in its <output> instead.
 */
function verdictPrefix(line: string, genuine: string): string {
  const at = line.lastIndexOf(genuine);
  if (at <= 0) {
    throw new Error(`a11y.steps.bench line 3 "${line}" has no "${genuine}"`);
  }
  return line.slice(0, at).trimEnd();
}

function benchLog() {
  const [challenge, response, verdict] = steps;
  if (
    challenge === undefined ||
    response === undefined ||
    verdict === undefined
  ) {
    throw new Error("a11y.steps.bench needs its three lines");
  }
  return {
    steps: [challenge, response] as const,
    verdictPrefix: verdictPrefix(verdict, verdicts.genuine),
    verdicts,
  };
}

const LOG = benchLog();

/**
 * The hero (DESIGN.md → Hero intro, Handshake, 3D Scenes → Hero projector;
 * Responsive Behavior → Hero), framed by the corner brackets.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby={HERO_TITLE_ID} className="hero-frame">
      <CornerBrackets />
      <div className="w-full page-x">
        <div className="mx-auto hero-grid max-w-container">
          <HeroStage
            run={copy.bench.run}
            toggle={copy.bench.toggle}
            log={LOG}
            tags={tags}
          >
            <HeroLockup />
          </HeroStage>
        </div>
      </div>
    </section>
  );
}
