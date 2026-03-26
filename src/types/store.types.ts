import type {
  Screen, GameMode, ThemeId, TimingGrade, QualityPreset,
} from "./game.types";
import type { GeneratedSequence, FallingTile } from "./sequence.types";

export interface SessionSlice {
  screen: Screen;
  mode: GameMode;
  round: number;
  sequenceIndex: number;
  currentSequence: GeneratedSequence | null;
  currentBlankIdx: number;
  filledBlanks: Record<number, number>;
  tiles: FallingTile[];
  countdown: number;
  sprintTime: number;
}

export interface ScoreSlice {
  score: number;
  streak: number;
  maxStreak: number;
  totalCorrect: number;
  totalAnswered: number;
  timingGrades: TimingGrade[];
}

export interface AudioSlice {
  bpm: number;
  volume: number;
}

export interface SettingsSlice {
  theme: ThemeId;
  quality: QualityPreset;
  reducedMotion: boolean;
  highContrast: boolean;
  showHint: boolean;
}

export interface ProgressSlice {
  highScores: { mode: GameMode; score: number; date: string }[];
  unlockedThemes: ThemeId[];
  totalSolved: number;
}

export interface UISlice {
  feedback: { grade: TimingGrade; correct: boolean } | null;
  comboFlash: boolean;
}

export interface SessionActions {
  setScreen(screen: Screen): void;
  setMode(mode: GameMode): void;
  setCurrentSequence(seq: GeneratedSequence | null): void;
  setCurrentBlankIdx(idx: number): void;
  setFilledBlanks(blanks: Record<number, number>): void;
  fillBlank(blankIndex: number, value: number): void;
  setTiles(tiles: FallingTile[]): void;
  updateTiles(updater: (tiles: FallingTile[]) => FallingTile[]): void;
  setCountdown(n: number): void;
  setSprintTime(n: number): void;
  decrementSprintTime(): number;
  setRound(n: number): void;
  setSequenceIndex(n: number): void;
  incrementSequenceIndex(): void;
}

export interface ScoreActions {
  addScore(points: number): void;
  incrementStreak(): number;
  resetStreak(): void;
  incrementCorrect(): void;
  incrementAnswered(): void;
  addTimingGrade(grade: TimingGrade): void;
  resetScores(): void;
}

export interface SettingsActions {
  setTheme(theme: ThemeId): void;
  setQuality(quality: QualityPreset): void;
  setVolume(vol: number): void;
  toggleHint(): void;
  setShowHint(show: boolean): void;
}

export interface UIActions {
  setFeedback(fb: { grade: TimingGrade; correct: boolean } | null): void;
  flashCombo(): void;
}

export interface AudioActions {
  setBpm(bpm: number): void;
}

export type GameStore =
  SessionSlice &
  ScoreSlice &
  AudioSlice &
  SettingsSlice &
  ProgressSlice &
  UISlice &
  SessionActions &
  ScoreActions &
  SettingsActions &
  UIActions &
  AudioActions;
