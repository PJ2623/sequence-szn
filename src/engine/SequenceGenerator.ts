import type { SequenceType } from "@/types/game.types";
import type { GeneratedSequence, FallingTile } from "@/types/sequence.types";
import { NUM_LANES, TILE_CONSTANTS } from "@/types/game.types";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function nextPrime(n: number): number {
  let c = n + 1;
  while (!isPrime(c)) c++;
  return c;
}

let _tileId = 0;

/**
 * Rhythmic patterns for tile drop timing.
 * Values are in fractions of a beat (0 = on the beat, 0.5 = offbeat).
 * Each pattern totals roughly 4 beats of musical time.
 * The array length must be >= NUM_LANES.
 */
const RHYTHM_PATTERNS: number[][] = [
  [0, 1, 2, 3],           // straight quarter notes: 1 - 2 - 3 - 4
  [0, 0.5, 2, 2.5],       // syncopated pairs: 1 &  -  3 &
  [0, 1.5, 2, 3.5],       // push rhythm: 1 - & 3 - &
  [0, 0.5, 1, 3],         // fast start, rest, drop: 1 & 2 - - 4
  [0, 2, 2.5, 3],         // wait then cascade: 1 - - 3 & 4
  [0, 1, 1.5, 3],         // double tap mid: 1 - 2 & - 4
  [0.5, 1, 2.5, 3],       // all offbeats: & 2 - & 4
  [0, 1, 2, 2.5],         // steady then quick: 1 - 2 - 3 &
  [0, 0.5, 1.5, 3],       // swing feel: 1 & - & - - 4
  [0, 1, 3, 3.5],         // gap then flurry: 1 - 2 - - - 4 &
];

export class SequenceGenerator {
  static getTypesForDifficulty(difficulty: number): SequenceType[] {
    if (difficulty <= 3) return ["arithmetic"];
    if (difficulty <= 5) return ["arithmetic", "geometric", "fibonacci"];
    if (difficulty <= 7) return ["arithmetic", "geometric", "fibonacci", "square", "triangular"];
    return ["arithmetic", "geometric", "fibonacci", "square", "triangular", "prime", "custom", "alternating"];
  }

  static generate(type: SequenceType, difficulty: number): GeneratedSequence {
    const len = Math.min(4 + Math.floor(difficulty / 2), 8);
    let seq: number[] = [];
    let hint = "";

    switch (type) {
      case "arithmetic": {
        const d = Math.floor(Math.random() * (2 + difficulty)) + 1;
        const s = Math.floor(Math.random() * (5 + difficulty * 2));
        for (let i = 0; i < len; i++) seq.push(s + d * i);
        hint = `+${d} each term`;
        break;
      }
      case "geometric": {
        const r = Math.floor(Math.random() * 2) + 2;
        const s = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < len; i++) seq.push(s * Math.pow(r, i));
        hint = `×${r} each term`;
        break;
      }
      case "fibonacci": {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        seq = [a, b];
        for (let i = 2; i < len; i++) seq.push(seq[i - 1]! + seq[i - 2]!);
        hint = "Sum of two before";
        break;
      }
      case "square": {
        const o = Math.floor(Math.random() * 3);
        for (let i = 1; i <= len; i++) seq.push((i + o) * (i + o));
        hint = "Perfect squares";
        break;
      }
      case "triangular": {
        for (let i = 1; i <= len; i++) seq.push((i * (i + 1)) / 2);
        hint = "Triangular numbers";
        break;
      }
      case "prime": {
        let p = 2;
        for (let i = 0; i < len; i++) {
          seq.push(p);
          p = nextPrime(p);
        }
        hint = "Prime numbers";
        break;
      }
      case "custom": {
        const s = Math.floor(Math.random() * 3) + 1;
        seq = [s];
        for (let i = 1; i < len; i++) seq.push(seq[i - 1]! + (i + 1));
        hint = "Diffs increase +1";
        break;
      }
      case "alternating": {
        for (let i = 1; i <= len; i++) seq.push(i * (i % 2 === 0 ? -1 : 1));
        hint = "Alternating ±";
        break;
      }
    }

    const numBlanks = Math.min(1 + Math.floor(difficulty / 4), 3, seq.length - 2);
    const blanks: number[] = [];
    const avail = seq.map((_, i) => i).filter((i) => i > 0 && i < seq.length - 1);

    for (let i = 0; i < numBlanks && avail.length > 0; i++) {
      const idx = Math.floor(Math.random() * avail.length);
      blanks.push(avail[idx]!);
      avail.splice(idx, 1);
    }
    if (blanks.length === 0 && seq.length > 2) {
      blanks.push(Math.floor(seq.length / 2));
    }

    return {
      sequence: seq,
      blanks: blanks.sort((a, b) => a - b),
      hint,
      rule: type,
      difficulty,
    };
  }

  static generateRandom(difficulty: number): GeneratedSequence {
    const types = SequenceGenerator.getTypesForDifficulty(difficulty);
    const type = types[Math.floor(Math.random() * types.length)]!;
    return SequenceGenerator.generate(type, difficulty);
  }

  static generateTileOptions(correct: number, count: number = NUM_LANES): number[] {
    const opts = new Set<number>([correct]);
    const range = Math.max(5, Math.abs(correct) + 3);
    let attempts = 0;

    while (opts.size < count && attempts < 100) {
      const offset = Math.floor(Math.random() * range * 2) - range;
      const decoy = correct + (offset === 0 ? (Math.random() > 0.5 ? 1 : -1) : offset);
      if (decoy !== correct) opts.add(decoy);
      attempts++;
    }
    while (opts.size < count) opts.add(correct + opts.size);

    const arr = Array.from(opts);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }

  /**
   * Create falling tiles for one blank.
   * Tiles drop in a randomized rhythmic pattern — not uniformly.
   * Each tile spawns at a musically-timed offset from the base beat.
   */
  static createTilesForBlank(
    correctValue: number,
    difficulty: number,
    beatIntervalMs: number,
  ): FallingTile[] {
    const options = SequenceGenerator.generateTileOptions(correctValue, NUM_LANES);
    const fallDuration = Math.max(1800, TILE_CONSTANTS.FALL_DURATION - difficulty * 90);
    const now = performance.now();

    // Pick a random rhythm pattern
    const pattern = RHYTHM_PATTERNS[Math.floor(Math.random() * RHYTHM_PATTERNS.length)]!;

    // Shuffle the timing slots so the correct answer doesn't always land
    // on the same beat position
    const timingSlots = [...pattern];
    for (let i = timingSlots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [timingSlots[i], timingSlots[j]] = [timingSlots[j]!, timingSlots[i]!];
    }

    // Randomly assign each tile to a lane (not sequential)
    const lanes = Array.from({ length: NUM_LANES }, (_, i) => i);
    for (let i = lanes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lanes[i], lanes[j]] = [lanes[j]!, lanes[i]!];
    }

    return options.map((val, i) => ({
      id: ++_tileId,
      lane: lanes[i]!,
      value: val,
      correct: val === correctValue,
      spawnTime: now + timingSlots[i]! * beatIntervalMs,
      fallDuration,
      y: 0,
      hit: false,
      missed: false,
      result: null,
    }));
  }
}