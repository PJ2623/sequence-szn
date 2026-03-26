precision mediump float;

uniform float uTime;
uniform float uAmplitude;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  pos.x += sin(pos.y * 4.0 + uTime) * uAmplitude;
  pos.y += cos(pos.x * 4.0 + uTime * 0.7) * uAmplitude;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
