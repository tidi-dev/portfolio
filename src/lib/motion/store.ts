import {
  effectiveMotion,
  MOTION_ATTRIBUTE,
  MOTION_STORAGE_KEY,
  type MotionMode,
  parseMotion,
  REDUCED_MOTION_QUERY,
} from "./preference";

/**
 * The motion mode as a `useSyncExternalStore` source (contrib-engineering
 * §6.4): the one switch for the frameloop, the handshake's autoplay and
 * instant runs, and the toggle. Browser-only. `data-motion` on <html> is the
 * state; the head script sets it first, and this module keeps it in step
 * with the system preference while the visitor has no stored choice.
 */

function storedMotion(): MotionMode | null {
  try {
    return parseMotion(localStorage.getItem(MOTION_STORAGE_KEY));
  } catch {
    return null;
  }
}

function applyMotion(mode: MotionMode): void {
  if (document.documentElement.getAttribute(MOTION_ATTRIBUTE) !== mode) {
    document.documentElement.setAttribute(MOTION_ATTRIBUTE, mode);
  }
}

export function subscribeMotion(listener: () => void): () => void {
  const system = window.matchMedia(REDUCED_MOTION_QUERY);
  const followSystem = () => {
    applyMotion(effectiveMotion(storedMotion(), system.matches));
  };
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [MOTION_ATTRIBUTE],
  });
  system.addEventListener("change", followSystem);
  return () => {
    observer.disconnect();
    system.removeEventListener("change", followSystem);
  };
}

/** True while motion is allowed (`data-motion="on"`). */
export function motionSnapshot(): boolean {
  return document.documentElement.getAttribute(MOTION_ATTRIBUTE) === "on";
}

/** The server can't know: it renders the calm state. */
export function serverMotionSnapshot(): boolean {
  return false;
}

/** The toggle: stores the visitor's choice and applies it at once. */
export function setMotion(mode: MotionMode): void {
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, mode);
  } catch {
    // Storage is unavailable: the choice lasts for this page only.
  }
  applyMotion(mode);
}
