import { drawings } from "@/content/drawings";
import { wrapWords } from "./geometry/grammar";
import { QUEST_TALL, QUEST_WIDE, type QuestLayout } from "./geometry/quest";
import {
  Boundary,
  DrawingSvg,
  Label,
  LabelLines,
  Line,
  Node,
  Proof,
  ReplacedNode,
} from "./primitives";

function QuestSvg({
  layout,
  variant,
  className,
}: {
  readonly layout: QuestLayout;
  readonly variant: "wide" | "tall";
  readonly className: string;
}) {
  const { labels, carried } = drawings.quest;

  return (
    <DrawingSvg
      width={layout.width}
      height={layout.height}
      variant={variant}
      className={className}
    >
      {/* Construction: territory v1 and its replaced nodes. */}
      <Boundary {...layout.v1} tone="construction" />
      <Label {...layout.v1Label} text={labels.v1} tone="muted" />
      <ReplacedNode {...layout.lambda} label={labels.lambda} />
      <ReplacedNode {...layout.eventBridge} label={labels.eventBridge} />
      <ReplacedNode {...layout.dynamoDb} label={labels.dynamoDb} />

      {/* Ink: territory v2. */}
      <Boundary {...layout.v2} tone="ink" />
      <Label {...layout.v2Label} text={labels.v2} />
      <Node {...layout.nestJs} label={labels.nestJs} />
      <Node {...layout.prisma} label={labels.prisma} />
      <Node {...layout.mySql} label={labels.mySql} />

      {/* The proof: DynamoDB → MySQL, with ~5 min of downtime. */}
      <Proof>
        <Line points={layout.proof} tone="proof" arrow={layout.proofArrow} />
        <Label {...layout.downtime} text={labels.downtime} tone="proof" />
      </Proof>
      <LabelLines
        x={layout.carried.x}
        y={layout.carried.y}
        anchor={layout.carried.anchor}
        lines={wrapWords(carried.join(", "), layout.carried.wordsPerLine)}
      />
    </DrawingSvg>
  );
}

/**
 * Both static variants; the figure's container query shows the wide one
 * from an 880 px plate inner width, at most 1.3× (1144 px), and the tall
 * one below it, at most 1.5× (360 px).
 */
export function QuestDrawing() {
  return (
    <>
      <QuestSvg
        layout={QUEST_TALL}
        variant="tall"
        className="mx-auto block h-auto w-full max-w-drawing-tall @drawing:hidden"
      />
      <QuestSvg
        layout={QUEST_WIDE}
        variant="wide"
        className="mx-auto hidden h-auto w-full max-w-drawing-wide @drawing:block"
      />
    </>
  );
}
