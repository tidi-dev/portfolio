import type { RefObject } from "react";
import type { Theme } from "@/lib/theme/preference";
import type { Frameloop } from "./hero-scene-props";

/**
 * The quest holograms (DESIGN.md → 3D Scenes → Quest holograms;
 * depiction.holograms). The ids match content's `HologramId`, which client
 * code can't import (contrib-engineering §5.1): the Server Component passes
 * them in.
 */
export type QuestModelId = "cyberrock" | "botmivivi" | "quest";

/**
 * A quest canvas's props: a pure view of which model shows, how many times
 * it has been unlocked (each new count projects it in), the theme and the
 * motion mode.
 */
export interface QuestSceneProps {
  readonly model: QuestModelId;
  /** Grows by one per "Quest unlocked" for this stage. */
  readonly unlock: number;
  readonly theme: Theme;
  readonly motion: boolean;
  readonly frameloop: Frameloop;
  /** Pointer tilt, ±0.15 rad: fine pointers from lg only. */
  readonly tilt: boolean;
  /** Quest's "v1" and "v2" tags, pinned to its slabs each frame. */
  readonly tags: {
    readonly v1: RefObject<HTMLSpanElement | null>;
    readonly v2: RefObject<HTMLSpanElement | null>;
  };
  /** The first frame is on screen: the canvas cross-fades in. */
  readonly onReady: () => void;
  /** The WebGL context was just lost: the poster takes the stage at once. */
  readonly onContextLost: () => void;
  /** The browser restored the context in time: the scene is live again. */
  readonly onContextRestored: () => void;
  /** The WebGL context was lost and not restored in time. */
  readonly onLost: () => void;
}
