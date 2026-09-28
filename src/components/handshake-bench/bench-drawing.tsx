import type { CSSProperties } from "react";
import {
  BENCH_HEIGHT,
  type BenchVariant,
  benchGeometry,
  PACKET_RADIUS,
} from "@/components/drawings/geometry/bench";
import type { Point } from "@/components/drawings/geometry/grammar";
import {
  DrawingSvg,
  Label,
  Line,
  NodeFrame,
  NodeLabel,
  Node,
  Proof,
} from "@/components/drawings/primitives";
import { drawings } from "@/content/drawings";

// The step numerals are the sequence itself (DESIGN.md → Reduced motion:
// "a real sequence"), not copy.
const NUMERALS = { challenge: String(1), response: String(2) } as const;

type LineName = keyof typeof NUMERALS;

interface BenchLineProps {
  readonly name: LineName;
  readonly from: Point;
  readonly to: Point;
  readonly arrow: "right" | "left";
  readonly label: Point;
  readonly numeral: Point;
  readonly anchor: "start" | "end";
  readonly text: string;
}

/**
 * One line of the handshake in both tones: proof and construction. The
 * bench's state shows one (bench.css, from `data-challenge` and
 * `data-response`); at rest, and without JavaScript, the proof shows. Each
 * tone carries its step numeral, shown only under reduced motion.
 */
function BenchLine({
  name,
  from,
  to,
  arrow,
  label,
  numeral,
  anchor,
  text,
}: BenchLineProps) {
  return (
    <g data-line={name}>
      <g data-tone="proof">
        <Line points={[from, to]} tone="proof" arrow={arrow} />
        <Label x={label.x} y={label.y} text={text} tone="proof" />
        <g data-numeral="">
          <Label
            x={numeral.x}
            y={numeral.y}
            text={NUMERALS[name]}
            tone="proof"
            anchor={anchor}
          />
        </g>
      </g>
      <g data-tone="construction">
        <Line points={[from, to]} tone="construction" arrow={arrow} />
        <Label x={label.x} y={label.y} text={text} tone="muted" />
        <g data-numeral="">
          <Label
            x={numeral.x}
            y={numeral.y}
            text={NUMERALS[name]}
            tone="muted"
            anchor={anchor}
          />
        </g>
      </g>
    </g>
  );
}

/**
 * A packet: the only circle (DESIGN.md → Consistency locks 3), in the proof
 * colour. Invisible until bench.css moves it along its line by `travel`
 * drawing units.
 */
function Packet({
  name,
  start,
  travel,
}: {
  readonly name: LineName;
  readonly start: Point;
  readonly travel: number;
}) {
  const style = {
    "--bench-travel": `${String(travel)}px`,
  } as CSSProperties;
  return (
    <circle
      data-packet={name}
      cx={start.x}
      cy={start.y}
      r={PACKET_RADIUS}
      style={style}
      className="fill-current text-accent"
    />
  );
}

function BenchVariantSvg({
  variant,
  className,
}: {
  readonly variant: BenchVariant;
  readonly className: string;
}) {
  const { width, host, chip, pins, challenge, response, packets, numerals } =
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
      {/* The chip frame pulses as it answers; the counterfeit chip's outline is construction. */}
      <g data-chip="">
        <g data-tone="ink">
          <NodeFrame x={chip.x} y={chip.y} width={chip.size} tone="ink" />
        </g>
        <g data-tone="construction">
          <NodeFrame
            x={chip.x}
            y={chip.y}
            width={chip.size}
            tone="construction"
          />
        </g>
        <NodeLabel
          x={chip.x}
          y={chip.y}
          width={chip.size}
          label={labels.chip}
        />
      </g>
      {/* Rest: the completed handshake, both lines proof (DESIGN.md → States). */}
      <Proof>
        <BenchLine
          name="challenge"
          from={challenge.from}
          to={challenge.to}
          arrow="right"
          label={challenge.label}
          numeral={numerals.challenge}
          anchor="start"
          text={labels.challenge}
        />
        <BenchLine
          name="response"
          from={response.from}
          to={response.to}
          arrow="left"
          label={response.label}
          numeral={numerals.response}
          anchor="end"
          text={labels.response}
        />
      </Proof>
      <Packet name="challenge" {...packets.challenge} />
      <Packet name="response" {...packets.response} />
    </DrawingSvg>
  );
}

/**
 * The bench drawing: both static variants in the HTML. By container query on
 * the plate's inner width (DESIGN.md → Handshake bench → Variants): compact
 * below 480 px, at most 1.5× (360 px); wide from 480 px, at most 1.35×
 * (648 px). The hidden variant is `display: none`, so only the visible one
 * animates and fires `animationend`.
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
