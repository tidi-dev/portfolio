import type { RefObject } from "react";
import type { HandshakeState } from "@/lib/handshake/machine";
import type { Theme } from "@/lib/theme/preference";

/** R3F's frameloop modes (contrib-engineering §5.4). */
export type Frameloop = "always" | "demand" | "never";

/**
 * The hero scene's props: a pure view of the handshake state, the theme and
 * the motion mode (contrib-engineering §6.3). The scene never owns state
 * the HTML log depends on.
 */
export interface HeroSceneProps {
  readonly handshake: HandshakeState;
  readonly theme: Theme;
  readonly motion: boolean;
  readonly frameloop: Frameloop;
  /** The "host" and "chip" tags, pinned to their 3D anchors each frame. */
  readonly tags: {
    readonly host: RefObject<HTMLSpanElement | null>;
    readonly chip: RefObject<HTMLSpanElement | null>;
  };
  /** The first frame is on screen: the canvas cross-fades in. */
  readonly onReady: () => void;
  /** The boot sequence is over (at once in the calm mode). */
  readonly onBooted: () => void;
  /** The WebGL context was lost and not restored in time. */
  readonly onLost: () => void;
}
