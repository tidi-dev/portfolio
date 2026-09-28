import { CanvasTexture, SRGBColorSpace } from "three";

const SIZE = 512;

/** A small seeded PRNG (mulberry32), so the die draws the same every time. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The chip's procedural circuit die (DESIGN.md → 3D Scenes → Chip): a core
 * square and 44 routed traces ending in pads, drawn in `ink` (the scene's
 * white light) on a transparent canvas and tinted `holo` by the material.
 * The preview's HoloDeck draws the same.
 */
export function createDieTexture(ink: string): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("die texture: no 2D context");
  const random = seeded(5);
  context.strokeStyle = ink;
  context.fillStyle = ink;
  context.lineWidth = 3;
  context.lineCap = "square";
  context.strokeRect(150, 150, 212, 212);
  context.globalAlpha = 0.35;
  context.fillRect(170, 170, 172, 172);
  context.globalAlpha = 1;
  const clampEdge = (value: number) => Math.max(8, Math.min(SIZE - 8, value));
  for (let trace = 0; trace < 44; trace++) {
    let x = SIZE / 2 + (random() - 0.5) * 180;
    let y = SIZE / 2 + (random() - 0.5) * 180;
    context.beginPath();
    context.moveTo(x, y);
    for (let turn = 0; turn < 4; turn++) {
      const horizontal = random() > 0.5;
      const step = (random() > 0.5 ? 1 : -1) * (30 + random() * 90);
      if (horizontal) x += step;
      else y += step;
      x = clampEdge(x);
      y = clampEdge(y);
      context.lineTo(x, y);
    }
    context.stroke();
    context.beginPath();
    context.arc(x, y, 6, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
