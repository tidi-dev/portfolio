import {
  BENCH_HEIGHT,
  type BenchVariant,
  benchGeometry,
} from "@/components/drawings/geometry/bench";
import {
  DrawingSvg,
  Label,
  Line,
  Node,
  Proof,
} from "@/components/drawings/primitives";
import { drawings } from "@/content/drawings";

function BenchVariantSvg({
  variant,
  className,
}: {
  readonly variant: BenchVariant;
  readonly className: string;
}) {
  const { width, host, chip, pins, challenge, response } =
    benchGeometry(variant);
  const { labels } = drawings.bench;

  return (
    <DrawingSvg
      width={width}
      height={BENCH_HEIGHT}
      variant={variant}
      className={className}
    >
      <Node x={host.x} y={host.y} width={host.width} label={labels.host} />
      {pins.map(([from, to]) => (
        <Line
          key={`${String(from.x)},${String(from.y)}`}
          points={[from, to]}
          tone="ink"
        />
      ))}
      <Node x={chip.x} y={chip.y} width={chip.size} label={labels.chip} />
      {/* Rest: the completed handshake, both lines proof (DESIGN.md → States). */}
      <Proof>
        <g data-line="challenge">
          <Line
            points={[challenge.from, challenge.to]}
            tone="proof"
            arrow="right"
          />
          <Label
            x={challenge.label.x}
            y={challenge.label.y}
            text={labels.challenge}
            tone="proof"
          />
        </g>
        <g data-line="response">
          <Line
            points={[response.from, response.to]}
            tone="proof"
            arrow="left"
          />
          <Label
            x={response.label.x}
            y={response.label.y}
            text={labels.response}
            tone="proof"
          />
        </g>
      </Proof>
    </DrawingSvg>
  );
}

/**
 * The bench drawing: both static variants in the HTML. By container query on
 * the plate's inner width (DESIGN.md → Handshake bench → Variants): compact
 * below 480 px, at most 1.5× (360 px); wide from 480 px, at most 1.35×
 * (648 px).
 */
export function BenchDrawing() {
  return (
    <>
      <BenchVariantSvg
        variant="compact"
        className="mx-auto block h-auto w-full max-w-bench-compact @bench:hidden"
      />
      <BenchVariantSvg
        variant="wide"
        className="mx-auto hidden h-auto w-full max-w-bench-wide @bench:block"
      />
    </>
  );
}
