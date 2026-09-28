import type { MotionTimings } from "@/lib/motion/tokens";
import type { HandshakeStep } from "./machine";

/**
 * How long each timed step lasts (DESIGN.md → Motion → Handshake: "0–1000
 * gold comet host → chip, step 1 lit; 1000–2000 holo comet back, step 2"):
 * one `packet` per leg. The verdict steps have no timer: they hold until
 * the next run.
 */
export function stepDuration(
  step: HandshakeStep,
  timings: MotionTimings,
): number | undefined {
  return step === "challenge" || step === "response"
    ? timings.durations.packet
    : undefined;
}
