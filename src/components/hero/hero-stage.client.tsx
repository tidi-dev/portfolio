"use client";

import dynamic from "next/dynamic";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Frameloop } from "@/components/holo/hero-scene-props";
import { HoloPoster } from "@/components/holo/holo-poster";
import { holoState, type SceneStatus } from "@/components/holo/holo-state";
import { SceneErrorBoundary } from "@/components/holo/scene-error-boundary.client";
import { useInView } from "@/components/holo/use-in-view";
import { usePageVisible } from "@/components/holo/use-page-visible";
import { webglSupported } from "@/components/holo/webgl-support";
import {
  handshakeReducer,
  INITIAL_HANDSHAKE,
  isRunning,
} from "@/lib/handshake/machine";
import { stepDuration } from "@/lib/handshake/schedule";
import {
  motionSnapshot,
  serverMotionSnapshot,
  subscribeMotion,
} from "@/lib/motion/store";
import { readMotionTimings } from "@/lib/motion/tokens";
import {
  serverThemeSnapshot,
  subscribeTheme,
  themeSnapshot,
} from "@/lib/theme/store";
import { HandshakeLog, type HandshakeLogCopy } from "./handshake-log";

// The scene chunk (three, R3F, postprocessing) loads only in the browser,
// after hydration, and only when WebGL exists (contrib-engineering §5.2).
const HeroScene = dynamic(() => import("@/components/holo/scenes/hero-scene"), {
  ssr: false,
});

function noSubscription(): () => void {
  return () => undefined;
}

function serverWebgl(): boolean | undefined {
  return undefined;
}

interface HeroStageProps {
  /** The hero intro (server-rendered), between the stage and the console. */
  readonly children: ReactNode;
  /** bench.run and bench.toggle. */
  readonly run: string;
  readonly toggle: string;
  readonly log: HandshakeLogCopy;
  /** The scene tags (depiction.bench). */
  readonly tags: { readonly host: string; readonly chip: string };
}

/**
 * The hero's live part (contrib-engineering §5, §6.3): it owns the
 * handshake state, its step timers and the one-time autoplay; renders the
 * stage (poster, canvas, tags), then the intro it is given, then the
 * console (Run, the switch, the log). The log and the scene are both views
 * of the same state, so the story runs the same with or without WebGL.
 */
export function HeroStage({
  children,
  run,
  toggle,
  log,
  tags,
}: HeroStageProps) {
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
  const hostTag = useRef<HTMLSpanElement>(null);
  const chipTag = useRef<HTMLSpanElement>(null);

  const [state, dispatch] = useReducer(handshakeReducer, INITIAL_HANDSHAKE);
  const [scene, setScene] = useState<SceneStatus>("loading");
  const [booted, setBooted] = useState(false);

  const sceneWanted = webgl === true && scene !== "failed";
  const posterFinal = webgl === false || scene === "failed";
  // contrib-engineering §5.4: render continuously only while on screen, in
  // a visible tab, with motion on; on demand in the calm mode; not at all
  // off screen, in a hidden tab, or while its WebGL context is lost.
  const frameloop: Frameloop =
    !inView.visible || !pageVisible || scene === "lost"
      ? "never"
      : motion
        ? "always"
        : "demand";
  const userRun = isRunning(state.step) && !state.autoplay;

  // Step timers: one `packet` per leg; a new run, the switch or unmounting
  // clears them, and a stale timer is ignored by the reducer.
  useEffect(() => {
    if (state.instant) return;
    const duration = stepDuration(state.step, readMotionTimings());
    if (duration === undefined) return;
    const { step, run: runId } = state;
    const timer = setTimeout(() => {
      dispatch({
        type: "advance",
        from: step,
        run: runId,
        at: performance.now(),
      });
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  // Autoplay once per load (behaviour.handshake-autoplay): motion on, the
  // stage at least half in view in a visible tab, the scene booted (or the
  // poster final), then `delay-autoplay`. The guard is in the reducer, so
  // scrolling away and back or a theme change can't replay it.
  const autoplayReady =
    motion &&
    inView.half &&
    pageVisible &&
    !state.autoplayed &&
    (booted || posterFinal);
  useEffect(() => {
    if (!autoplayReady) return;
    const timer = setTimeout(() => {
      dispatch({ type: "autoplay", at: performance.now() });
    }, readMotionTimings().autoplayDelay);
    return () => {
      clearTimeout(timer);
    };
  }, [autoplayReady]);

  // An instant run holds its verdict back for one painted frame, then
  // reveals it, so the <output> changes and the verdict is announced even
  // when it is the one already shown (QA F8). Two frames: the first runs
  // before the empty output is painted.
  useEffect(() => {
    if (!state.held) return;
    const runId = state.run;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        dispatch({ type: "reveal", run: runId });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [state.held, state.run]);

  // Motion switched off mid-run: the final state at once.
  useEffect(() => {
    if (!motion && isRunning(state.step)) {
      dispatch({ type: "settle", at: performance.now() });
    }
  }, [motion, state.step]);

  const onReady = useCallback(() => {
    setScene("live");
  }, []);
  const onBooted = useCallback(() => {
    setBooted(true);
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

  return (
    <>
      <div
        ref={stage}
        aria-hidden="true"
        data-holo-stage="hero"
        data-holo-state={holoState(scene, sceneWanted)}
        data-frameloop={frameloop}
        className="hero-stage"
      >
        <HoloPoster />
        {sceneWanted ? (
          <SceneErrorBoundary onError={onFailed}>
            <div className="holo-layer holo-canvas">
              <HeroScene
                handshake={state}
                theme={theme}
                motion={motion}
                frameloop={frameloop}
                tags={{ host: hostTag, chip: chipTag }}
                onReady={onReady}
                onBooted={onBooted}
                onContextLost={onContextLost}
                onContextRestored={onContextRestored}
                onLost={onFailed}
              />
            </div>
          </SceneErrorBoundary>
        ) : null}
        <span ref={hostTag} className="scene-tag">
          <span className="chamfer block p-scene-tag type-label chamfer-glass chamfer-sm">
            {tags.host}
          </span>
        </span>
        <span ref={chipTag} className="scene-tag">
          <span className="chamfer block p-scene-tag type-label chamfer-glass chamfer-sm">
            {tags.chip}
          </span>
        </span>
      </div>

      {children}

      <div className="hero-console">
        <div className="flex flex-col gap-sm sm:flex-row sm:flex-wrap sm:items-center lg:flex-col lg:items-stretch">
          <button
            type="button"
            data-js-control=""
            aria-disabled={userRun ? true : undefined}
            onClick={() => {
              if (userRun) return;
              dispatch({
                type: "run",
                instant: !motion,
                at: performance.now(),
              });
            }}
            className="chamfer btn btn-holo type-button"
          >
            {run}
          </button>
          <button
            type="button"
            data-js-control=""
            aria-pressed={state.counterfeit}
            onClick={() => {
              dispatch({ type: "toggle", at: performance.now() });
            }}
            className="chamfer inline-flex switch items-center gap-sm type-nav text-primary chamfer-glass chamfer-sm"
          >
            <span aria-hidden="true" className="switch-track">
              <span className="switch-thumb" />
            </span>
            {toggle}
          </button>
        </div>
        <HandshakeLog state={state} copy={log} />
      </div>
    </>
  );
}
