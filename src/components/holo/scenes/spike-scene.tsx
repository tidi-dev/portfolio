import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import tokens from "@/styles/tokens.generated.json";

// Phase 1 spike (throwaway): proves R3F 9.8.1 renders under Next 16.3.6.
const HOLO = tokens.color.holo.$value.hex;
const LIGHT = tokens.color["surface-raised"].$value.hex;

function SpinningChip() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current === null) return;
    mesh.current.rotation.y += delta * 0.35;
    mesh.current.rotation.x += delta * 0.2;
  });
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2.1, 0.26, 2.1]} />
      <meshStandardMaterial color={HOLO} metalness={0.4} roughness={0.35} />
    </mesh>
  );
}

export function SpikeScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 2, 5], fov: 34 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 5]} intensity={1.6} color={LIGHT} />
      <SpinningChip />
    </Canvas>
  );
}
