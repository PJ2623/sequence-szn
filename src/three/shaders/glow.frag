precision mediump float;

uniform float uIntensity;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float dist = length(vUv - vec2(0.5));
  float glow = smoothstep(0.5, 0.0, dist) * uIntensity;
  gl_FragColor = vec4(uColor, glow * 0.6);
}
