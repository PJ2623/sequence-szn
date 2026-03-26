/** Stem identifiers within a track */
export type StemId = "drums" | "bass" | "melody" | "pad" | "flourish";

/** Track metadata */
export interface TrackMeta {
  readonly id: string;
  readonly name: string;
  readonly bpm: number;
  readonly key: string;
  readonly mood: string;
  readonly stems: Record<StemId, string>;
}

/** Beat event emitted by BeatClock */
export interface BeatEvent {
  readonly beatNumber: number;
  readonly measureNumber: number;
  readonly beatInMeasure: 1 | 2 | 3 | 4;
  readonly timestamp: number;
}

/** Callback signature for beat subscriptions */
export type BeatCallback = (event: BeatEvent) => void;

/** Beat info snapshot for the game loop */
export interface BeatInfo {
  readonly beat: number;
  readonly phase: number;
  readonly measureBeat: number;
}
