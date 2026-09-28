"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { Frameloop } from "@/components/holo/hero-scene-props";
import { QuestPoster } from "@/components/holo/quest-poster";
import { holoState, type SceneStatus } from "@/components/holo/holo-state";
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

interface QuestHologramProps {
  /** The aria-hidden tags on Quest's slabs ("v1", "v2"). */
  readonly tags: { readonly v1: string; readonly v2: string };
}

/**
 * The quest hologram stage (DESIGN.md → Quest detail panel → Stage; 3D
 * Scenes → Quest holograms): one canvas in the detail panel, showing the
 * selected quest's model; each change of quest cuts to the new model and
 * projects it in. It renders only while on screen in a visible tab (on
 * demand in the calm mode). The poster holds the stage before the scene,
 * and for good when WebGL is missing, fails or is lost. The toast sits at
 * its top-left, restarted by each visitor selection. Everything here is
 * `aria-hidden`: each tabpanel's steps list says what the hologram shows,
 * and the cards' `aria-selected` carries the selection.
 */
export function QuestHologram({ tags }: QuestHologramProps) {
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

  const entry = journal.quests.find((quest) => quest.id === journal.selected);
  const sceneWanted = webgl === true && scene !== "failed" && near;
  const frameloop: Frameloop =
    !inView.visible || !pageVisible || scene === "lost"
      ? "never"
      : motion
        ? "always"
        : "demand";
  const last = journal.last;
  const toast = last !== null && last.seq > dismissed ? last : null;
  const toastName = journal.quests.find(
    (quest) => quest.id === toast?.id,
  )?.name;

  const onReady = useCallback(() => {
    setScene("live");
  }, []);
  const onFailed = useCallback(() => {
    setScene("failed");
  }, []);
  const onContextLost = useCallback(() => {
    setScene("lost");
  }, []);
  const onContextRestored = useCallback(() => {
    setScene("live");
  }, []);

  if (entry === undefined) return null;

  return (
    <div
      ref={stage}
      aria-hidden="true"
      data-holo-stage="quest"
      data-holo-state={holoState(scene, sceneWanted)}
      data-frameloop={frameloop}
      className="quest-stage chamfer"
    >
      <QuestPoster model={entry.model} />
      {sceneWanted ? (
        <SceneErrorBoundary onError={onFailed}>
          <div className="holo-layer holo-canvas">
            <QuestScene
              model={entry.model}
              unlock={journal.swaps}
              theme={theme}
              motion={motion}
              frameloop={frameloop}
              tilt={layout === "wide-fine"}
              tags={{ v1, v2 }}
              onReady={onReady}
              onContextLost={onContextLost}
              onContextRestored={onContextRestored}
              onLost={onFailed}
            />
          </div>
        </SceneErrorBoundary>
      ) : null}
      <span ref={v1} className="scene-tag">
        <span className="chamfer block p-scene-tag type-label tag-fade chamfer-glass chamfer-sm">
          {tags.v1}
        </span>
      </span>
      <span ref={v2} className="scene-tag">
        <span className="chamfer block p-scene-tag type-label tag-fade chamfer-glass chamfer-sm">
          {tags.v2}
        </span>
      </span>
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
