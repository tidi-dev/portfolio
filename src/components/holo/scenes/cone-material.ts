import { Color, DoubleSide, type IUniform, ShaderMaterial } from "three";

export interface ConeUniforms {
  readonly [uniform: string]: IUniform;
  readonly uColor: IUniform<Color>;
  readonly uOpacity: IUniform<number>;
  readonly uHeight: IUniform<number>;
}

// The projector cone's vertical alpha fade (DESIGN.md → 3D Scenes → Cone):
// full at the base, clear at the top, over the cone's height.
const VERTEX = `varying float vY;
void main() {
  vY = position.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const FRAGMENT = `uniform vec3 uColor;
uniform float uOpacity;
uniform float uHeight;
varying float vY;
void main() {
  float a = clamp(0.5 - vY / uHeight, 0.0, 1.0);
  gl_FragColor = vec4(uColor, a * a * uOpacity);
}`;

/**
 * The cone's material, shared by the hero and the quest projectors. The
 * caller owns and disposes it; colour, opacity and blending follow the
 * palette through its uniforms.
 */
export function createConeMaterial(
  height: number,
  colour: Color,
  opacity: number,
): { readonly material: ShaderMaterial; readonly uniforms: ConeUniforms } {
  const uniforms: ConeUniforms = {
    uColor: { value: colour.clone() },
    uOpacity: { value: opacity },
    uHeight: { value: height },
  };
  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  return { material, uniforms };
}
