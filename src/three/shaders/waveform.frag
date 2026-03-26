precision mediump float;

uniform float uTime;
uniform float uBeatPhase;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float wave = sin(vUv.x * 20.0 + uTime * 3.0 + uBeatPhase * 6.28) * 0.5 + 0.5;
  float mask = smoothstep(0.48, 0.5, vUv.y) * smoothstep(0.52, 0.5, vUv.y);
  float brightness = wave * mask * 0.8;
  gl_FragColor = vec4(uColor * brightness, brightness * 0.5);
}
