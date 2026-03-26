import * as Tone from "tone";
import type { BeatInfo } from "@/types/audio.types";
import type { TimingGrade } from "@/types/game.types";
import { TIMING_WINDOWS } from "@/types/game.types";

export class BeatClock {
  private bpm: number;
  private startTime: number;

  constructor(bpm: number) {
    this.bpm = bpm;
    this.startTime = Tone.now();
  }

  setBPM(bpm: number): void {
    this.bpm = bpm;
  }

  getBPM(): number {
    return this.bpm;
  }

  reset(): void {
    this.startTime = Tone.now();
  }

  getBeatInfo(): BeatInfo {
    const elapsed = Tone.now() - this.startTime;
    const beatsElapsed = elapsed * (this.bpm / 60);
    return {
      beat: Math.floor(beatsElapsed),
      phase: beatsElapsed % 1,
      measureBeat: Math.floor(beatsElapsed) % 4,
    };
  }

  getBeatPosition(): number {
    const elapsed = Tone.now() - this.startTime;
    return elapsed * (this.bpm / 60);
  }

  getTimeToNextBeat(): number {
    const pos = this.getBeatPosition();
    const remaining = 1 - (pos % 1);
    return remaining * (60 / this.bpm);
  }

  getTimingOffsetMs(): number {
    const { phase } = this.getBeatInfo();
    const offset = phase < 0.5 ? phase : phase - 1;
    return Math.abs(offset * (60000 / this.bpm));
  }

  judgeTime(): TimingGrade {
    const ms = this.getTimingOffsetMs();
    if (ms <= TIMING_WINDOWS.PERFECT) return "perfect";
    if (ms <= TIMING_WINDOWS.GOOD) return "good";
    if (ms <= TIMING_WINDOWS.OK) return "ok";
    return "miss";
  }
}