import { useGameStore } from "@state/gameStore";

export function useSequence() {
  const currentSequence = useGameStore((s) => s.currentSequence);
  const currentBlankIdx = useGameStore((s) => s.currentBlankIdx);
  const filledBlanks = useGameStore((s) => s.filledBlanks);
  const showHint = useGameStore((s) => s.showHint);

  return { currentSequence, currentBlankIdx, filledBlanks, showHint };
}
