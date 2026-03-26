import type { SequenceType, TimingGrade } from "./game.types";

/** Output of SequenceGenerator.generate() */
export interface GeneratedSequence {
  readonly sequence: readonly number[];
  readonly blanks: readonly number[];
  readonly hint: string;
  readonly rule: SequenceType;
  readonly difficulty: number;
}

/** A single falling tile in the piano-tiles field */
export interface FallingTile {
  readonly id: number;
  readonly lane: number;
  readonly value: number;
  readonly correct: boolean;
  readonly spawnTime: number;
  readonly fallDuration: number;
  y: number;
  hit: boolean;
  missed: boolean;
  result: TimingGrade | null;
}

/** Filled blank entry */
export interface FilledBlank {
  readonly value: number;
  readonly correct: boolean;
}

/** Result of checking a single answer */
export interface AnswerResult {
  readonly blankIndex: number;
  readonly expected: number;
  readonly submitted: number;
  readonly correct: boolean;
  readonly timingGrade: TimingGrade;
  readonly timingOffsetMs: number;
}
