/** Supported sequence categories */
export type SequenceType =
  | "arithmetic"
  | "geometric"
  | "fibonacci"
  | "square"
  | "triangular"
  | "prime"
  | "custom"
  | "alternating";

/** Game modes */
export type GameMode = "arcade" | "zen" | "sprint";

/** Screens / navigation states */
export type Screen =
  | "title"
  | "modeSelect"
  | "countdown"
  | "playing"
  | "paused"
  | "results";

/** Visual themes */
export type ThemeId = "midnight" | "sunrise" | "forest" | "neon";

/** Timing judgment for a submitted answer */
export type TimingGrade = "perfect" | "good" | "ok" | "miss";

/** Quality presets for Three.js rendering */
export type QualityPreset = "high" | "medium" | "low";

/** Number of falling lanes */
export const NUM_LANES = 4 as const;

/** Timing windows in ms */
export const TIMING_WINDOWS = {
  PERFECT: 80,
  GOOD: 160,
  OK: 260,
} as const;

/** Tile field layout constants */
export const TILE_CONSTANTS = {
  FALL_DURATION: 2800,
  HIT_ZONE_Y: 0.75,
  HEIGHT: 0.28,
  START_Y: -0.30,
} as const;