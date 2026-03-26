import { useGameStore } from "../gameStore";

export const useSettings = () =>
  useGameStore((s) => ({
    theme: s.theme,
    quality: s.quality,
    volume: s.volume,
    reducedMotion: s.reducedMotion,
    highContrast: s.highContrast,
    showHint: s.showHint,
  }));
