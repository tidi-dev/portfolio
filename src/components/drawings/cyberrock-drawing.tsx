import { drawings } from "@/content/drawings";
import {
  CYBERROCK_TALL,
  CYBERROCK_WIDE,
  type CyberRockLayout,
} from "./geometry/cyberrock";
import { wrapWords } from "./geometry/grammar";
import { DrawingSvg, Label, LabelLines, Line, Node, Proof } from "./primitives";

function CyberRockSvg({
  layout,
  variant,
  className,
}: {
  readonly layout: CyberRockLayout;
  readonly variant: "wide" | "tall";
  readonly className: string;
}) {
  const { labels } = drawings.cyberrock;
  const box = (key: "manufacturing" | "field" | "supplierExports" | "auth") =>
    layout[key];

  return (
    <DrawingSvg
      width={layout.width}
      height={layout.height}
      variant={variant}
      className={className}
    >
      {/* Construction: the full audit trail, with ticks to its three nodes. */}
      <Line points={layout.trail} tone="construction" />
      {layout.ticks.map((tick) => (
        <Line
          key={tick
            .map((point) => `${String(point.x)},${String(point.y)}`)
            .join(" ")}
          points={tick}
          tone="construction"
        />
      ))}
      <Label
        x={layout.trailLabel.x}
        y={layout.trailLabel.y}
        anchor={layout.trailLabel.anchor}
        text={labels.auditTrail}
        tone="muted"
      />

      {/* Ink: the lifecycle, and supplier exports as an output. */}
      <Line
        points={layout.lifecycle}
        tone="ink"
        arrow={layout.lifecycleArrow}
      />
      <Line points={layout.branch} tone="ink" arrow="down" />
      <Node {...box("manufacturing")} label={labels.manufacturing} />
      <Node {...box("supplierExports")} label={labels.supplierExports} />
      <Node {...box("field")} label={labels.field} />

      {/* The proof: the field → Challenge-response auth → genuine. */}
      <Proof>
        <Line points={layout.toAuth} tone="proof" arrow={layout.proofArrow} />
        <Node {...box("auth")} label={labels.auth} tone="proof" />
        <Line
          points={layout.toGenuine}
          tone="proof"
          arrow={layout.proofArrow}
        />
        <Label
          x={layout.genuine.x}
          y={layout.genuine.y}
          anchor={layout.genuine.anchor}
          text={labels.genuine}
          tone="proof"
        />
      </Proof>
      <LabelLines
        x={layout.attestation.x}
        y={layout.attestation.y}
        anchor={layout.attestation.anchor}
        lines={wrapWords(labels.authModes, layout.attestation.wordsPerLine)}
      />
    </DrawingSvg>
  );
}

/**
 * Both static variants; the figure's container query shows the wide one
 * from an 880 px plate inner width, at most 1.3× (1144 px), and the tall
 * one below it, at most 1.5× (360 px).
 */
export function CyberRockDrawing() {
  return (
    <>
      <CyberRockSvg
        layout={CYBERROCK_TALL}
        variant="tall"
        className="mx-auto block h-auto w-full max-w-drawing-tall @drawing:hidden"
      />
      <CyberRockSvg
        layout={CYBERROCK_WIDE}
        variant="wide"
        className="mx-auto hidden h-auto w-full max-w-drawing-wide @drawing:block"
      />
    </>
  );
}
