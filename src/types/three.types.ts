import type { QualityPreset } from "./game.types";

/** Configuration for the Three.js scene manager */
export interface SceneConfig {
  readonly container: HTMLElement;
  readonly quality: QualityPreset;
  readonly pixelRatio: number;
}

/** Interface all visual effect classes must implement */
export interface VisualEffect {
  update(deltaTime: number, beatPhase: number): void;
  trigger(): void;
  dispose(): void;
}

/** Theme visual properties for the 3D scene */
export interface ThemeVisuals {
  readonly particleColor: number;
  readonly laneColors: readonly [string, string, string, string];
}
