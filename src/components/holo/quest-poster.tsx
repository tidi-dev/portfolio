import type { CSSProperties } from "react";
import type { QuestModelId } from "./quest-scene-props";

// botmivivi's two pallets and its two shops (quest.css → qp-pallet, qp-shop).
const PALLETS = [0, 1] as const;
const SHOPS_BACK_TO_FRONT = [1, 0] as const;

/**
 * The quest holograms' poster (contrib-engineering §5.2): a CSS-only still
 * of the small projector and the quest's model, drawn from tokens inside a
 * frame pinned to the stage top. It holds the stage before the scene loads
 * and stays when WebGL is missing, fails or is lost. No image request, no
 * icon.
 */
export function QuestPoster({ model }: { readonly model: QuestModelId }) {
  return (
    <div className="holo-poster holo-layer">
      <div className="qp-frame">
        <span className="qp-cone" />
        <span className="qp-base" />
        {model === "cyberrock" ? <span className="qp-chip" /> : null}
        {model === "botmivivi" ? (
          <div className="qp-map">
            <span className="qp-ground" />
            <span className="qp-supplier" />
            <span className="qp-warehouse" />
            {PALLETS.map((pallet) => (
              <span
                key={pallet}
                className="qp-pallet"
                style={{ "--pallet": pallet } as CSSProperties}
              />
            ))}
            <span className="qp-truck" />
            {SHOPS_BACK_TO_FRONT.map((shop) => (
              <span
                key={shop}
                className="qp-shop"
                style={{ "--shop": shop } as CSSProperties}
              />
            ))}
            <span className="qp-credit" />
            <span className="qp-coin" />
          </div>
        ) : null}
        {model === "quest" ? (
          <>
            <span className="qp-link" />
            <span className="qp-data qp-data-v1" />
            <span className="qp-data qp-data-v2" />
          </>
        ) : null}
      </div>
    </div>
  );
}
