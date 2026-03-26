import * as Tone from "tone";
import type { BeatInfo } from "@/types/audio.types";
import type { TimingGrade } from "@/types/game.types";
import { BeatClock } from "./BeatClock";

/**
 * Stem file paths are resolved relative to the Vite public directory.
 * Place your audio files at:
 *   public/audio/tracks/<trackId>/drums.mp3
 *   public/audio/tracks/<trackId>/bass.mp3
 *   public/audio/tracks/<trackId>/melody.mp3
 *   public/audio/tracks/<trackId>/pad.mp3
 *   public/audio/tracks/<trackId>/flourish.mp3
 *
 * At runtime these are served as /audio/tracks/<trackId>/drums.mp3 etc.
 */

const STEM_NAMES = ["drums", "bass", "melody", "pad", "flourish"] as const;
type StemName = (typeof STEM_NAMES)[number];

// Which stems unlock at which streak thresholds
const STEM_THRESHOLDS: Record<StemName, number> = {
  drums: 0,     // always on
  bass: 3,
  melody: 6,
  pad: 10,
  flourish: 0,  // one-shot, not looped
};

export class AudioEngine {
  public initialized = false;
  public beatClock: BeatClock;

  // Stem players and volume buses
  private stems: Map<StemName, Tone.Player> = new Map();
  private stemBuses: Map<StemName, Tone.Volume> = new Map();
  private stemsLoaded = false;
  private currentTrackId: string | null = null;

  // SFX synths
  private correctSynth!: Tone.PolySynth;
  private wrongSynth!: Tone.Synth;
  private wrongFilter!: Tone.Filter;
  private perfectSynth!: Tone.PolySynth;
  private comboBell!: Tone.MetalSynth;
  private levelSynth!: Tone.PolySynth;

  private musicPlaying = false;

  constructor(bpm = 85) {
    this.beatClock = new BeatClock(bpm);
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    await Tone.start();
    Tone.getTransport().bpm.value = this.beatClock.getBPM();

    // ─── SFX synths ───────────────────────────────────────────
    this.correctSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.15 },
      volume: -8,
    }).toDestination();

    this.wrongSynth = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.12, sustain: 0, release: 0.08 },
      volume: -14,
    }).toDestination();
    this.wrongFilter = new Tone.Filter(350, "lowpass").toDestination();
    this.wrongSynth.connect(this.wrongFilter);

    this.perfectSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.4, sustain: 0, release: 0.3 },
      volume: -6,
    }).toDestination();

    this.comboBell = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
      harmonicity: 5.1,
      modulationIndex: 16,
      resonance: 4000,
      octaves: 0.5,
      volume: -18,
    }).toDestination();

    this.levelSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.4 },
      volume: -6,
    }).toDestination();

    this.initialized = true;
    this.beatClock.reset();
  }

  // ─── Stem loading ───────────────────────────────────────────────

  /**
   * Load stems for a track. Call this before startMusic().
   * @param trackId - folder name under public/audio/tracks/
   */
  async loadTrack(trackId: string): Promise<void> {
    if (this.currentTrackId === trackId && this.stemsLoaded) return;

    this.disposeStems();

    const basePath = `./audio/tracks/${trackId}`;

    for (const name of STEM_NAMES) {
      const url = `${basePath}/${name}.mp3`;
      const isFlourishOneShot = name === "flourish";
      const defaultVol = name === "drums" ? -2 : -40;

      const bus = new Tone.Volume(isFlourishOneShot ? -6 : defaultVol).toDestination();

      try {
        // Fetch first to check if file actually exists
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`[AudioEngine] Stem not found, skipping: ${url} (${res.status})`);
          bus.dispose();
          continue;
        }

        // Check content type — must be audio, not HTML
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("audio") && !contentType.includes("octet-stream")) {
          console.warn(`[AudioEngine] Unexpected content-type for ${url}: ${contentType} — skipping`);
          bus.dispose();
          continue;
        }

        const player = new Tone.Player({
          url,
          loop: !isFlourishOneShot,
          volume: 0,
          onerror: (err) => console.error(`[AudioEngine] Error loading ${name}:`, err),
        }).connect(bus);

        this.stems.set(name, player);
        this.stemBuses.set(name, bus);
      } catch (err) {
        console.error(`[AudioEngine] Failed to load stem ${url}:`, err);
        bus.dispose();
      }
    }

    // Wait for all players to finish buffering
    try {
      await Tone.loaded();
    } catch (err) {
      console.error("[AudioEngine] Tone.loaded() failed:", err);
    }

    this.currentTrackId = trackId;
    this.stemsLoaded = this.stems.size > 0;

    if (this.stems.size === 0) {
      console.warn("[AudioEngine] No stems loaded — game will run without music");
    } else {
      console.log(`[AudioEngine] Loaded ${this.stems.size} stems for track "${trackId}"`);
    }
  }

  private disposeStems(): void {
    this.stems.forEach((player) => { try { player.stop(); player.dispose(); } catch (_e) { /* */ } });
    this.stemBuses.forEach((bus) => { try { bus.dispose(); } catch (_e) { /* */ } });
    this.stems.clear();
    this.stemBuses.clear();
    this.stemsLoaded = false;
  }

  // ─── Music playback ─────────────────────────────────────────────

  startMusic(): void {
    if (!this.initialized || this.musicPlaying) return;

    this.stems.forEach((player, name) => {
      if (name !== "flourish" && player.loaded) {
        try { player.start(); } catch (_e) { /* */ }
      }
    });

    this.musicPlaying = true;
    this.beatClock.reset();
  }

  stopMusic(): void {
    if (!this.musicPlaying) return;
    this.stems.forEach((player) => {
      try { player.stop(); } catch (_e) { /* */ }
    });
    this.musicPlaying = false;
  }

  /** Fade stems in/out based on player streak */
  updateStemLayers(streak: number): void {
    if (!this.initialized) return;

    for (const name of STEM_NAMES) {
      if (name === "flourish") continue;
      const bus = this.stemBuses.get(name);
      if (!bus) continue;

      const threshold = STEM_THRESHOLDS[name];
      const targetVol = streak >= threshold ? -2 : -40;
      bus.volume.rampTo(targetVol, 0.5);
    }
  }

  /** Play the flourish one-shot (on perfect timing) */
  playFlourish(): void {
    const flourish = this.stems.get("flourish");
    if (flourish?.loaded) {
      try { flourish.start(); } catch (_e) { /* */ }
    }
  }

  // ─── Beat info ──────────────────────────────────────────────────

  setBPM(bpm: number): void {
    this.beatClock.setBPM(bpm);
    Tone.getTransport().bpm.value = bpm;
  }

  getBeatInfo(): BeatInfo {
    return this.beatClock.getBeatInfo();
  }

  judgeTime(): TimingGrade {
    return this.beatClock.judgeTime();
  }

  getTimeToNextBeat(): number {
    return this.beatClock.getTimeToNextBeat();
  }

  setVolume(vol: number): void {
    try {
      Tone.getDestination().volume.value = Tone.gainToDb(vol);
    } catch (_e) { /* */ }
  }

  // ─── SFX ────────────────────────────────────────────────────────

  playCorrect(): void {
    if (!this.initialized) return;
    try { this.correctSynth.triggerAttackRelease(["C5", "E5", "G5"], "8n"); } catch (_e) { /* */ }
  }

  playWrong(): void {
    if (!this.initialized) return;
    try { this.wrongSynth.triggerAttackRelease("C2", "16n"); } catch (_e) { /* */ }
  }

  playPerfect(): void {
    if (!this.initialized) return;
    try { this.perfectSynth.triggerAttackRelease(["E5", "G5", "B5", "E6"], "8n"); } catch (_e) { /* */ }
    this.playFlourish();
  }

  playCombo(): void {
    if (!this.initialized) return;
    try { this.comboBell.triggerAttackRelease("C1","16n"); } catch (_e) { /* */ }
  }

  playLevelUp(): void {
    if (!this.initialized) return;
    const n = Tone.now();
    try {
      this.levelSynth.triggerAttackRelease(["C5"], "16n", n);
      this.levelSynth.triggerAttackRelease(["E5"], "16n", n + 0.1);
      this.levelSynth.triggerAttackRelease(["G5"], "16n", n + 0.2);
      this.levelSynth.triggerAttackRelease(["C6"], "8n", n + 0.3);
    } catch (_e) { /* */ }
  }

  // Legacy compat aliases
  startDrone(): void { this.startMusic(); }
  stopDrone(): void { this.stopMusic(); }
  playTick(): void { /* no standalone metronome — the drums ARE the beat */ }
  playPad(): void { /* pad is a stem now */ }

  dispose(): void {
    if (!this.initialized) return;
    this.stopMusic();
    this.disposeStems();
    try {
      [
        this.correctSynth, this.wrongSynth, this.perfectSynth,
        this.comboBell, this.levelSynth, this.wrongFilter,
      ].forEach((s) => s?.dispose());
    } catch (_e) { /* */ }
    this.initialized = false;
  }
}