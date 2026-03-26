import { create } from "zustand";
import type { GameStore } from "@/types/store.types";

export const useGameStore = create<GameStore>()((set, get) => ({
  // ─── Session ─────────────────────────────────
  screen: "title",
  mode: "arcade",
  round: 1,
  sequenceIndex: 0,
  currentSequence: null,
  currentBlankIdx: 0,
  filledBlanks: {},
  tiles: [],
  countdown: 0,
  sprintTime: 60,

  // ─── Score ───────────────────────────────────
  score: 0,
  streak: 0,
  maxStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  timingGrades: [],

  // ─── Audio ───────────────────────────────────
  bpm: 85,
  volume: 0.8,

  // ─── Settings ────────────────────────────────
  theme: "midnight",
  quality: "high",
  reducedMotion: false,
  highContrast: false,
  showHint: false,

  // ─── Progress ────────────────────────────────
  highScores: [],
  unlockedThemes: ["midnight"],
  totalSolved: 0,

  // ─── UI ──────────────────────────────────────
  feedback: null,
  comboFlash: false,

  // ─── Session Actions ─────────────────────────
  setScreen: (screen) => set({ screen }),
  setMode: (mode) => set({ mode }),
  setCurrentSequence: (seq) => set({ currentSequence: seq }),
  setCurrentBlankIdx: (idx) => set({ currentBlankIdx: idx }),
  setFilledBlanks: (blanks) => set({ filledBlanks: blanks }),
  fillBlank: (blankIndex, value) =>
    set((state) => ({
      filledBlanks: { ...state.filledBlanks, [blankIndex]: value },
    })),
  setTiles: (tiles) => set({ tiles }),
  updateTiles: (updater) => set((state) => ({ tiles: updater(state.tiles) })),
  setCountdown: (n) => set({ countdown: n }),
  setSprintTime: (n) => set({ sprintTime: n }),
  decrementSprintTime: () => {
    const next = get().sprintTime - 1;
    set({ sprintTime: next });
    return next;
  },
  setRound: (n) => set({ round: n }),
  setSequenceIndex: (n) => set({ sequenceIndex: n }),
  incrementSequenceIndex: () => set((s) => ({ sequenceIndex: s.sequenceIndex + 1 })),

  // ─── Score Actions ───────────────────────────
  addScore: (points) => set((s) => ({ score: s.score + points })),
  incrementStreak: () => {
    const ns = get().streak + 1;
    set({ streak: ns, maxStreak: Math.max(ns, get().maxStreak) });
    return ns;
  },
  resetStreak: () => set({ streak: 0 }),
  incrementCorrect: () => set((s) => ({ totalCorrect: s.totalCorrect + 1 })),
  incrementAnswered: () => set((s) => ({ totalAnswered: s.totalAnswered + 1 })),
  addTimingGrade: (grade) => set((s) => ({ timingGrades: [...s.timingGrades, grade] })),
  resetScores: () =>
    set({
      score: 0,
      streak: 0,
      maxStreak: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      timingGrades: [],
    }),

  // ─── Settings Actions ────────────────────────
  setTheme: (theme) => set({ theme }),
  setQuality: (quality) => set({ quality }),
  setVolume: (vol) => set({ volume: vol }),
  toggleHint: () => set((s) => ({ showHint: !s.showHint })),
  setShowHint: (show) => set({ showHint: show }),

  // ─── UI Actions ──────────────────────────────
  setFeedback: (fb) => set({ feedback: fb }),
  flashCombo: () => {
    set({ comboFlash: true });
    setTimeout(() => set({ comboFlash: false }), 500);
  },

  // ─── Audio Actions ───────────────────────────
  setBpm: (bpm) => set({ bpm }),
}));
