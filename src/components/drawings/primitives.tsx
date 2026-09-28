import type { ReactNode } from "react";
import {
  arrowheadPath,
  type Direction,
  LABEL_CENTRE_OFFSET,
  LABEL_LINE,
  linePath,
  NODE_HEIGHT,
  NODE_RADIUS,
  type Point,
} from "./geometry/grammar";

/**
 * DESIGN.md → Drawing grammar, as SVG parts. Colour comes from the text
 * colour token (`textColor` is also the stroke: strokes and fills use
 * currentColor), stroke widths and the dash from the supplement tokens, and
 * labels from the drawing type utilities. No value here is raw, and every
 * class sits in a className attribute, where the token lint reads it.
 */

/** Ink: 1.5 px `primary`. Proof: 2 px `accent`. Construction: 1.5 px `trace`, dashed 6 4. */
export type LineTone = "ink" | "proof" | "construction";

/** Node labels in `primary`, proof labels in `accent` (label-strong), construction labels in `text-muted`. */
export type LabelTone = "ink" | "proof" | "muted";

/** `drawing-node` (ink), or a node on the proof (2 px `accent`, label-strong). */
export type NodeTone = "ink" | "proof";

/** A node's outline: ink, proof, or construction (1.5 px `trace`, dashed 6 4). */
export type FrameTone = NodeTone | "construction";

type Anchor = "start" | "middle" | "end";

interface LabelProps {
  readonly x: number;
  /** The baseline. */
  readonly y: number;
  readonly text: string;
  readonly tone?: LabelTone;
  readonly anchor?: Anchor;
}

export function Label({
  x,
  y,
  text,
  tone = "ink",
  anchor = "middle",
}: LabelProps) {
  switch (tone) {
    case "ink":
      return (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          className="fill-current type-drawing-label text-primary"
        >
          {text}
        </text>
      );
    case "proof":
      return (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          className="fill-current type-drawing-label-strong text-accent"
        >
          {text}
        </text>
      );
    case "muted":
      return (
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          className="fill-current type-drawing-label text-text-muted"
        >
          {text}
        </text>
      );
  }
}

interface LabelLinesProps extends Omit<LabelProps, "text"> {
  /** The owner's string, already split at word boundaries. */
  readonly lines: readonly string[];
}

/** A label on several lines, one <text> per line, 20 units apart. */
export function LabelLines({
  x,
  y,
  lines,
  tone = "ink",
  anchor = "start",
}: LabelLinesProps) {
  return (
    <>
      {lines.map((line, index) => (
        <Label
          key={line}
          x={x}
          y={y + index * LABEL_LINE}
          text={line}
          tone={tone}
          anchor={anchor}
        />
      ))}
    </>
  );
}

interface NodeProps {
  /** Top-left corner. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly label: string;
  readonly tone?: NodeTone;
}

interface NodeFrameProps {
  /** Top-left corner. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly tone: FrameTone;
}

/** A node's 40-unit, radius-6 outline on a Plate fill, without its label. */
export function NodeFrame({ x, y, width, tone }: NodeFrameProps) {
  switch (tone) {
    case "ink":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={NODE_HEIGHT}
          rx={NODE_RADIUS}
          className="fill-surface-raised stroke-current stroke-ink text-primary"
        />
      );
    case "proof":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={NODE_HEIGHT}
          rx={NODE_RADIUS}
          className="fill-surface-raised stroke-current stroke-proof text-accent"
        />
      );
    case "construction":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={NODE_HEIGHT}
          rx={NODE_RADIUS}
          className="fill-surface-raised stroke-current stroke-ink text-trace dash-construction"
        />
      );
  }
}

/** The label centred in a node's box. */
export function NodeLabel({
  x,
  y,
  width,
  label,
  tone = "ink",
}: Omit<NodeProps, "tone"> & { readonly tone?: LabelTone }) {
  return (
    <Label
      x={x + width / 2}
      y={y + NODE_HEIGHT / 2 + LABEL_CENTRE_OFFSET}
      text={label}
      tone={tone}
    />
  );
}

/** A 40-unit node with its label centred (DESIGN.md: 12-unit padding at least). */
export function Node({ x, y, width, label, tone = "ink" }: NodeProps) {
  return (
    <>
      <NodeFrame x={x} y={y} width={width} tone={tone} />
      <NodeLabel
        x={x}
        y={y}
        width={width}
        label={label}
        tone={tone === "proof" ? "proof" : "ink"}
      />
    </>
  );
}

/** A replaced node (`drawing-node-replaced`): a construction outline, its label in `text-muted`. */
export function ReplacedNode({ x, y, width, label }: Omit<NodeProps, "tone">) {
  return (
    <>
      <NodeFrame x={x} y={y} width={width} tone="construction" />
      <NodeLabel x={x} y={y} width={width} label={label} tone="muted" />
    </>
  );
}

interface BoundaryProps {
  /** Top-left corner. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly tone: LineTone;
}

/**
 * A boundary (DESIGN.md → Drawing grammar): a radius-6 region around nodes,
 * drawn as ink, construction or proof, with no fill. Its label is a
 * separate `Label` in the matching tone.
 */
export function Boundary({ x, y, width, height, tone }: BoundaryProps) {
  switch (tone) {
    case "ink":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={NODE_RADIUS}
          className="fill-none stroke-current stroke-ink text-primary"
        />
      );
    case "proof":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={NODE_RADIUS}
          className="fill-none stroke-current stroke-proof text-accent"
        />
      );
    case "construction":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={NODE_RADIUS}
          className="fill-none stroke-current stroke-ink text-trace dash-construction"
        />
      );
  }
}

function Stroke({ d, tone }: { readonly d: string; readonly tone: LineTone }) {
  switch (tone) {
    case "ink":
      return (
        <path
          d={d}
          className="fill-none stroke-current stroke-ink text-primary"
        />
      );
    case "proof":
      return (
        <path
          d={d}
          className="fill-none stroke-current stroke-proof text-accent"
        />
      );
    case "construction":
      return (
        <path
          d={d}
          className="fill-none stroke-current stroke-ink text-trace dash-construction"
        />
      );
  }
}

function Arrowhead({
  d,
  tone,
}: {
  readonly d: string;
  readonly tone: LineTone;
}) {
  switch (tone) {
    case "ink":
      return <path d={d} className="fill-current text-primary" />;
    case "proof":
      return <path d={d} className="fill-current text-accent" />;
    case "construction":
      return <path d={d} className="fill-current text-trace" />;
  }
}

interface LineProps {
  readonly points: readonly Point[];
  readonly tone: LineTone;
  /** The arrowhead at the last point, pointing this way. */
  readonly arrow?: Direction;
}

export function Line({ points, tone, arrow }: LineProps) {
  const tip = points.at(-1);
  return (
    <>
      <Stroke d={linePath(points, arrow)} tone={tone} />
      {arrow !== undefined && tip !== undefined ? (
        <Arrowhead d={arrowheadPath(tip, arrow)} tone={tone} />
      ) : null}
    </>
  );
}

/** The drawing's one proof element (DESIGN.md: exactly one proof per drawing). */
export function Proof({ children }: { readonly children: ReactNode }) {
  return <g data-proof="">{children}</g>;
}

interface DrawingSvgProps {
  readonly width: number;
  readonly height: number;
  /** Which variant: the container query in the figure shows one. */
  readonly variant: "compact" | "wide" | "tall";
  readonly className: string;
  readonly children: ReactNode;
}

/**
 * One static variant of a drawing. Every SVG is `aria-hidden`: the figure's
 * caption and its visually hidden step list carry the text alternative.
 */
export function DrawingSvg({
  width,
  height,
  variant,
  className,
  children,
}: DrawingSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      aria-hidden="true"
      data-variant={variant}
      className={className}
    >
      {children}
    </svg>
  );
}
