import type { GameMode } from "@/types/game.types";

export class DifficultyController {
  /** Get starting difficulty for a game mode */
  static getStartDifficulty(mode: GameMode): number {
    switch (mode) {
      case "sprint": return 2;
      case "zen": return 1;
      case "arcade": return 1;
    }
  }

  /** Get starting BPM for a game mode */
  static getStartBPM(mode: GameMode): number {
    switch (mode) {
      case "sprint": return 110;
      case "zen": return 85;
      case "arcade": return 85;
    }
  }

  /** Calculate next difficulty after completing a sequence (within a round) */
  static getNextDifficulty(current: number, mode: GameMode): number {
    const increment = mode === "sprint" ? 0.1 : mode === "zen" ? 0.2 : 0.3;
    return Math.min(current + increment, 10);
  }

  /** Calculate difficulty bump when advancing to a new round (arcade) */
  static getRoundBumpDifficulty(current: number): number {
    return Math.min(current + 1.5, 10);
  }

  /** Calculate BPM bump when advancing to a new round (arcade) */
  static getRoundBumpBPM(current: number): number {
    return Math.min(current + 8, 130);
  }

  /** Sequences per round in arcade mode */
  static readonly SEQS_PER_ROUND = 8;

  /** Total rounds in arcade mode */
  static readonly TOTAL_ROUNDS = 3;

  /** Sprint duration in seconds */
  static readonly SPRINT_DURATION = 60;
}
