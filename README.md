# Sequence SZN

A rhythm-based puzzle game that turns learning number sequences into a music-driven experience. Solve arithmetic, geometric, and unique sequences as tiles fall to lo-fi beats — tap the correct answer as it crosses the hit zone.

## How to Play

Tiles with numbers fall down 4 lanes to the rhythm of the music. One tile has the correct answer to fill the blank in the sequence shown at the top. Tap or click the correct tile as it passes through the hit zone, or use keyboard controls.

**Controls:**

- **Keys 1 2 3 4** or **A S D F** — tap the corresponding lane
- **Esc** — pause / resume
- **Click / Tap** — hit tiles directly (mobile friendly)

**Timing grades:**

- **Perfect** (±80ms) — 100 pts
- **Good** (±160ms) — 75 pts
- **Ok** (±260ms) — 50 pts
- **Miss** — streak broken

## Game Modes

| Mode | Description |
|------|-------------|
| **Arcade** | 3 rounds × 8 sequences, tiles speed up each round |
| **Zen** | No timer, no pressure, practice freely |
| **Sprint** | 60 seconds, rapid fire, max score |

## Sequence Types

Arithmetic, Geometric, Fibonacci, Square, Triangular, Prime, Custom (increasing differences), Alternating sign. Harder types unlock as difficulty increases.

## Tech Stack

- **React 19** + **TypeScript** — UI layer
- **Three.js** — particle background + beat reactor visuals
- **Tone.js** — audio engine, stem playback, beat sync
- **Zustand** — state management

## Setup

```bash
npm install
npm run dev
```

## Audio Files

Place stems in `public/audio/tracks/<trackId>/`:

```
public/audio/tracks/chill-01/
├── drums.mp3
├── bass.mp3
├── melody.mp3
├── pad.mp3
└── flourish.mp3
```

All stems must share the same BPM, length, and loop cleanly. Track metadata lives in `src/data/tracks.json`.

## Build & Deploy

```bash
npm run build
```

For itch.io: zip the contents of `dist/` (not the folder itself), upload as HTML game.

## Project Structure

```
src/
├── engine/        # BeatClock, AudioEngine, SequenceGenerator, ScoreManager
├── three/         # SceneManager, particles, beat reactor, effects
├── components/    # React screens and game UI
├── hooks/         # useAudioEngine, useBeatSync, useGameLoop
├── state/         # Zustand store
├── types/         # TypeScript type definitions
├── data/          # themes.json, tracks.json, sequences.json
└── styles/        # CSS tokens, typography, animations
```