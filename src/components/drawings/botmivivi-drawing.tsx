import { drawings } from "@/content/drawings";
import {
  BOTMIVIVI_TALL,
  BOTMIVIVI_WIDE,
  type BotmiviviLayout,
} from "./geometry/botmivivi";
import {
  Boundary,
  DrawingSvg,
  Label,
  Line,
  Node,
  Proof,
  ReplacedNode,
} from "./primitives";

function BotmiviviSvg({
  layout,
  variant,
  className,
}: {
  readonly layout: BotmiviviLayout;
  readonly variant: "wide" | "tall";
  readonly className: string;
}) {
  const { labels, replaced } = drawings.botmivivi;
  const { arrows } = layout;

  return (
    <DrawingSvg
      width={layout.width}
      height={layout.height}
      variant={variant}
      className={className}
    >
      {/* Construction: the replaced manual steps, under their label. */}
      <Label {...layout.replacedLabel} text={replaced.label} tone="muted" />
      {layout.replaced.map((box, index) => {
        const label = replaced.items[index];
        return label === undefined ? null : (
          <ReplacedNode key={label} {...box} label={label} />
        );
      })}

      {/* The proof: the same transaction, around the three inputs. */}
      <Proof>
        <Boundary {...layout.transaction} tone="proof" />
        <Label
          {...layout.transactionLabel}
          text={labels.transaction}
          tone="proof"
        />
      </Proof>

      {/* Ink: each input moves the balance. */}
      <Line {...arrows.order} tone="ink" />
      <Line {...arrows.return} tone="ink" />
      <Line {...arrows.payment} tone="ink" />
      <Node {...layout.order} label={labels.order} />
      <Node {...layout.return} label={labels.return} />
      <Node {...layout.payment} label={labels.payment} />
      <Node {...layout.balance} label={labels.balance} />
    </DrawingSvg>
  );
}

/**
 * Both static variants; the figure's container query shows the wide one
 * from an 880 px plate inner width, at most 1.3× (1144 px), and the tall
 * one below it, at most 1.5× (360 px).
 */
export function BotmiviviDrawing() {
  return (
    <>
      <BotmiviviSvg
        layout={BOTMIVIVI_TALL}
        variant="tall"
        className="mx-auto block h-auto w-full max-w-drawing-tall @drawing:hidden"
      />
      <BotmiviviSvg
        layout={BOTMIVIVI_WIDE}
        variant="wide"
        className="mx-auto hidden h-auto w-full max-w-drawing-wide @drawing:block"
      />
    </>
  );
}
