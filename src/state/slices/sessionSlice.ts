// Slice selectors for session state
import { useGameStore } from "../gameStore";

export const useSession = () =>
  useGameStore((s) => ({
    screen: s.screen,
    mode: s.mode,
    round: s.round,
    sequenceIndex: s.sequenceIndex,
    currentSequence: s.currentSequence,
    currentBlankIdx: s.currentBlankIdx,
    filledBlanks: s.filledBlanks,
    tiles: s.tiles,
    countdown: s.countdown,
    sprintTime: s.sprintTime,
  }));
