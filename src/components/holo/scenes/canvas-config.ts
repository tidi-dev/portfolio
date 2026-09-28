/**
 * What every hologram canvas shares (DESIGN.md → 3D Scenes): the DPR
 * capped at 1.75, and a transparent, antialiased renderer, so the page's
 * panel or backdrop shows through.
 */
export const DPR: [number, number] = [1, 1.75];

export const GL = {
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
} as const;
