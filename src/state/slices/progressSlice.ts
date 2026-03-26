import { useGameStore } from "../gameStore";

export const useProgress = () =>
  useGameStore((s) => ({
    highScores: s.highScores,
    unlockedThemes: s.unlockedThemes,
    totalSolved: s.totalSolved,
  }));
