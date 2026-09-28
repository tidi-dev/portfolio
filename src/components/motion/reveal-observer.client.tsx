"use client";

import { useEffect } from "react";
import { motionSnapshot } from "@/lib/motion/store";

/**
 * Set on <html> while the observer runs. reveal.css hides a panel before
 * its power-on only under this attribute (and `data-motion="on"`), so
 * without JavaScript, before hydration, or if this leaf fails, every
 * panel simply shows (contrib-engineering §6.1, R3).
 */
const READY = "data-reveal-ready";

// DESIGN.md → Motion → Panel power-on: "≥ 25 % in view, once". A panel
// taller than four viewports never shows 25 % of itself, so a quarter of
// the viewport filled counts too; the finer thresholds let that be seen.
const SHARE = 0.25;
const THRESHOLDS = [0, 0.05, 0.1, 0.15, 0.2, 0.25];

// A one-shot reward (the avatar scan, the level-up sweep) stops on its
// animationend; this is the backstop if that never fires. Longer than
// every one-shot (DESIGN.md → Motion → Tokens: scan 1400 + delay 600).
const ONE_SHOT_BACKSTOP = 4000;

function reached(entry: IntersectionObserverEntry): boolean {
  if (!entry.isIntersecting) return false;
  const viewport = entry.rootBounds?.height ?? window.innerHeight;
  return (
    entry.intersectionRatio >= SHARE ||
    entry.intersectionRect.height >= viewport * SHARE
  );
}

function inDocumentOrder(a: Element, b: Element): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

/** Plays a one-shot animation (`data-play`, reveal.css) once; returns its stop. */
function playOnce(element: Element): () => void {
  const stop = () => {
    clearTimeout(backstop);
    element.removeEventListener("animationend", stop);
    element.removeAttribute("data-play");
  };
  element.addEventListener("animationend", stop);
  const backstop = setTimeout(stop, ONE_SHOT_BACKSTOP);
  element.setAttribute("data-play", "");
  return stop;
}

/**
 * The scroll reveals (contrib-engineering §6.1; DESIGN.md → Motion): one
 * IntersectionObserver for every `[data-reveal]` element, and no scroll
 * listeners. The first time an element is reached it gets
 * `data-revealed`, once, and is unobserved; reveal.css runs its power-on
 * from there (the panel wipe, the stat rows, the rule underlines, the
 * training markers, the Mission log line where scroll timelines are
 * missing). Panels reached together take their stagger in reading order
 * (`--reveal-order`). With motion on at that moment, the one-shot rewards
 * play: the avatar scan inside the panel, and the HUD level-up sweep when
 * the panel holds Leveling up. In the calm mode elements are still marked,
 * so turning motion on later never hides what was already seen.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const stops = new Set<() => void>();
    const play = (element: Element | null) => {
      if (element !== null) stops.add(playOnce(element));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const motion = motionSnapshot();
        const arrived = entries
          .filter(reached)
          .map((entry) => entry.target)
          .sort(inDocumentOrder);
        let order = 0;
        for (const element of arrived) {
          observer.unobserve(element);
          if (element instanceof HTMLElement) {
            if (element.dataset.reveal === "panel") {
              element.style.setProperty("--reveal-order", String(order));
              order += 1;
            }
            element.dataset.revealed = "";
          }
          if (!motion) continue;
          for (const shot of element.querySelectorAll("[data-oneshot]")) {
            play(shot);
          }
          if (element.querySelector("[data-levelup]") !== null) {
            play(document.querySelector("[data-levelup-bar]"));
          }
        }
      },
      { threshold: THRESHOLDS },
    );

    for (const element of document.querySelectorAll("[data-reveal]")) {
      observer.observe(element);
    }
    root.setAttribute(READY, "");

    return () => {
      observer.disconnect();
      root.removeAttribute(READY);
      for (const stop of stops) stop();
    };
  }, []);

  return null;
}
