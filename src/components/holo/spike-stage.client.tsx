"use client";

import dynamic from "next/dynamic";

// Phase 1 spike (throwaway): the scene loads only in the browser.
const SpikeScene = dynamic(
  () => import("./scenes/spike-scene").then((module) => module.SpikeScene),
  { ssr: false },
);

export function SpikeStage() {
  return (
    <div aria-hidden="true" className="h-avatar w-full">
      <SpikeScene />
    </div>
  );
}
