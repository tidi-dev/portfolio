import type { CSSProperties } from "react";
import type { QuestModelId } from "./quest-scene-props";

// The ledger stack's five slabs (DESIGN.md → Quest holograms → botmivivi).
const LEDGER_SLABS = [0, 1, 2, 3, 4] as const;

/**
 * The quest holograms' poster (contrib-engineering §5.2): a CSS-only still
 * of the small projector and the quest's model, drawn from tokens. It holds
 * the stage before the scene loads and stays when WebGL is missing, fails
 * or is lost. No image request, no icon.
 */
export function QuestPoster({ model }: { readonly model: QuestModelId }) {
  return (
    <div className="holo-poster holo-layer">
      <span className="qp-cone" />
      <span className="qp-base" />
      {model === "cyberrock" ? <span className="qp-chip" /> : null}
      {model === "botmivivi"
        ? LEDGER_SLABS.map((index) => (
            <span
              key={index}
              className="qp-slab"
              style={{ "--slab": index } as CSSProperties}
            />
          ))
        : null}
      {model === "quest" ? (
        <>
          <span className="qp-link" />
          <span className="qp-data qp-data-v1" />
          <span className="qp-data qp-data-v2" />
        </>
      ) : null}
    </div>
  );
}
