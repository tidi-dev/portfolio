"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { Frameloop } from "@/components/holo/hero-scene-props";
import { QuestPoster } from "@/components/holo/quest-poster";
import { SceneErrorBoundary } from "@/components/holo/scene-error-boundary.client";
import { useInView } from "@/components/holo/use-in-view";
import { useNear } from "@/components/holo/use-near";
import { usePageVisible } from "@/components/holo/use-page-visible";
import { useQuestLayout } from "@/components/holo/use-quest-layout";
import { webglSupported } from "@/components/holo/webgl-support";
import {
  motionSnapshot,
  serverMotionSnapshot,
  subscribeMotion,
} from "@/lib/motion/store";
import {
  serverThemeSnapshot,
  subscribeTheme,
  themeSnapshot,
} from "@/lib/theme/store";
import { useQuestJournal } from "./quest-journal-controller.client";
import { QuestToast } from "./quest-toast";

// The scene chunk loads only in the browser, only when WebGL exists, and
// only once its stage is near the screen (contrib-engineering §5.2).
const QuestScene = dynamic(
  () => import("@/components/holo/scenes/quest-scene"),
  { ssr: false },
);

function noSubscription(): () => void {
  return () => undefined;
}

function serverWebgl(): boolean | undefined {
  return undefined;
}

type SceneStatus = "loading" | "live" | "failed";

/** The sticky viewport from `lg`, or one file's band below it. */
export type QuestHologramPlacement =
  | { readonly placement: "viewport" }
  | { readonly placement: "band"; readonly questId: string };

type QuestHologramProps = QuestHologramPlacement & {
  /** The aria-hidden tags on Quest's slabs ("v1", "v2"). */
  readonly tags: { readonly v1: string; readonly v2: string };
};

/**
 * A quest hologram stage (DESIGN.md → 3D Scenes → Quest holograms;
 * Responsive Behavior → Quest journal). From `lg` one sticky viewport shows
 * the current quest's model; below `lg` each file opens with its own band.
 * Only the stages of the layout on screen mount a canvas, and each renders
 * only while on screen in a visible tab (on demand in the calm mode). The
 * poster holds the stage before the scene, and for good when WebGL is
 * missing, fails or is lost. Everything here is `aria-hidden`: the file's
 * steps list says what the hologram shows.
 */
export function QuestHologram(props: QuestHologramProps) {
  const journal = useQuestJournal();
  const layout = useQuestLayout();
  const motion = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );
  const theme = useSyncExternalStore(
    subscribeTheme,
    themeSnapshot,
    serverThemeSnapshot,
  );
  const webgl = useSyncExternalStore(
    noSubscription,
    webglSupported,
    serverWebgl,
  );
  const pageVisible = usePageVisible();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage);
  const near = useNear(stage);
  const v1 = useRef<HTMLSpanElement>(null);
  const v2 = useRef<HTMLSpanElement>(null);
  const [scene, setScene] = useState<SceneStatus>("loading");
  const [dismissed, setDismissed] = useState(0);

  const band = props.placement === "band";
  const questId = band ? props.questId : journal.shown;
  const entry = journal.quests.find((quest) => quest.id === questId);
  const onScreenLayout =
    layout !== undefined && (band ? layout === "narrow" : layout !== "narrow");
  const sceneWanted =
    webgl === true && scene !== "failed" && onScreenLayout && near;
  const frameloop: Frameloop =
    !inView.visible || !pageVisible ? "never" : motion ? "always" : "demand";
  const unlock = band
    ? (journal.unlocks[questId] ?? 0)
    : (journal.last?.seq ?? 0);
  const last = journal.last;
  const toast =
    last !== null &&
    onScreenLayout &&
    last.seq > dismissed &&
    (!band || last.id === questId)
      ? last
      : null;
  const toastName = journal.quests.find(
    (quest) => quest.id === toast?.id,
  )?.name;

  const onReady = useCallback(() => {
    setScene("live");
  }, []);
  const onFailed = useCallback(() => {
    setScene("failed");
  }, []);

  if (entry === undefined) return null;

  return (
    <div
      ref={stage}
      aria-hidden="true"
      data-holo-stage="quest"
      data-holo-state={scene === "live" && sceneWanted ? "live" : "poster"}
      data-frameloop={frameloop}
      className={
        band
          ? "quest-stage chamfer quest-band"
          : "quest-stage chamfer quest-viewport"
      }
    >
      <QuestPoster model={entry.model} />
      {sceneWanted ? (
        <SceneErrorBoundary onError={onFailed}>
          <div className="holo-layer holo-canvas">
            <QuestScene
              model={entry.model}
              unlock={unlock}
              theme={theme}
              motion={motion}
              frameloop={frameloop}
              tilt={!band && layout === "wide-fine"}
              tags={{ v1, v2 }}
              onReady={onReady}
              onLost={onFailed}
            />
          </div>
        </SceneErrorBoundary>
      ) : null}
      {!band || entry.model === "quest" ? (
        <>
          <span ref={v1} className="scene-tag">
            <span className="chamfer block p-scene-tag type-label tag-fade chamfer-glass chamfer-sm">
              {props.tags.v1}
            </span>
          </span>
          <span ref={v2} className="scene-tag">
            <span className="chamfer block p-scene-tag type-label tag-fade chamfer-glass chamfer-sm">
              {props.tags.v2}
            </span>
          </span>
        </>
      ) : null}
      {toast !== null && toastName !== undefined ? (
        <QuestToast
          key={toast.seq}
          label={journal.toastLabel}
          name={toastName}
          onDone={() => {
            setDismissed(toast.seq);
          }}
        />
      ) : null}
    </div>
  );
}
