import { useCallback, useEffect, useRef } from "react";
import { useGameStore } from "@state/gameStore";
import { useAudioEngine } from "@hooks/useAudioEngine";
import { useGameLoop } from "@hooks/useGameLoop";
import { SequenceGenerator } from "@engine/SequenceGenerator";
import { ScoreManager } from "@engine/ScoreManager";
import { DifficultyController } from "@engine/DifficultyController";
import { SceneManager } from "@three/SceneManager";
import { TILE_CONSTANTS } from "@/types/game.types";
import type { GameMode, ThemeId } from "@/types/game.types";
import type { FallingTile } from "@/types/sequence.types";
import themes from "@/data/themes.json";
import tracksData from "@/data/tracks.json";

import { TitleScreen } from "@components/screens/TitleScreen";
import { ModeSelect } from "@components/screens/ModeSelect";
import { ResultsScreen } from "@components/screens/ResultsScreen";
import { PauseOverlay } from "@components/screens/PauseOverlay";
import { GameHUD } from "@components/screens/GameHUD";
import { SequenceDisplay } from "@components/game-ui/SequenceDisplay";
import { InputPad } from "@components/game-ui/InputPad";
import { TimingFeedback } from "@components/game-ui/TimingFeedback";
import { ComboMeter } from "@components/game-ui/ComboMeter";

const { HIT_ZONE_Y, HEIGHT: TILE_HEIGHT } = TILE_CONSTANTS;

/** Pick a random track from tracks.json */
function pickRandomTrack(): { id: string; bpm: number } {
  const track = tracksData[Math.floor(Math.random() * tracksData.length)]!;
  return { id: track.id, bpm: track.bpm };
}

export function App() {
  const store = useGameStore();
  const audio = useAudioEngine();
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneManager | null>(null);
  const sprintRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const missHandledRef = useRef(new Set<number>());
  const difficultyRef = useRef(1);
  const pauseTimeRef = useRef(0);
  const lastBeatRef = useRef(-1);
  const pendingSpawnRef = useRef<{ correctVal: number; diff: number } | null>(null);
  const currentTrackRef = useRef<{ id: string; bpm: number }>({ id: "chill-01", bpm: 82 });
  const t = themes[store.theme];

  useEffect(() => { difficultyRef.current = store.sequenceIndex; }, [store.sequenceIndex]);

  // Init Three.js
  useEffect(() => {
    if (canvasRef.current && !sceneRef.current) {
      sceneRef.current = new SceneManager({
        container: canvasRef.current,
        quality: "high",
        pixelRatio: window.devicePixelRatio,
      });
    }
    return () => { sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);

  useEffect(() => {
    const pc = parseInt(themes[store.theme].particleColor.replace("0x", ""), 16);
    sceneRef.current?.setThemeColor(pc);
  }, [store.theme]);

  useEffect(() => { audio.setVolume(store.volume); }, [store.volume, audio]);

  // ─── Pause / Resume ─────────────────────────────────────────────
  const pauseGame = useCallback(() => {
    if (store.screen !== "playing") return;
    pauseTimeRef.current = performance.now();
    if (sprintRef.current) clearInterval(sprintRef.current);
    audio.stopMusic();
    store.setScreen("paused");
  }, [store, audio]);

  const resumeGame = useCallback(() => {
    if (store.screen !== "paused") return;
    const pauseDuration = performance.now() - pauseTimeRef.current;
    store.updateTiles((tiles) =>
      tiles.map((tile) => ({ ...tile, spawnTime: tile.spawnTime + pauseDuration })),
    );
    audio.startMusic();
    store.setScreen("playing");
  }, [store, audio]);

  const quitToTitle = useCallback(() => {
    if (sprintRef.current) clearInterval(sprintRef.current);
    audio.stopMusic();
    store.setTiles([]);
    store.setScreen("title");
  }, [audio, store]);

  const quitToModeSelect = useCallback(() => {
    if (sprintRef.current) clearInterval(sprintRef.current);
    audio.stopMusic();
    store.setTiles([]);
    store.setScreen("modeSelect");
  }, [audio, store]);

  // ─── Beat-synced tile spawning ──────────────────────────────────
  const queueSpawnOnBeat = useCallback((correctVal: number, diff: number) => {
    pendingSpawnRef.current = { correctVal, diff };
  }, []);

  const executeSpawn = useCallback((correctVal: number, diff: number) => {
    missHandledRef.current = new Set();
    const bpm = useGameStore.getState().bpm;
    const beatIntervalMs = 60000 / bpm;
    store.setTiles(SequenceGenerator.createTilesForBlank(correctVal, diff, beatIntervalMs));
  }, [store]);

  // ─── Sequence management ────────────────────────────────────────
  const newSequence = useCallback((diff: number) => {
    const seq = SequenceGenerator.generateRandom(diff);
    store.setCurrentSequence(seq);
    store.setFilledBlanks({});
    store.setCurrentBlankIdx(0);
    store.setFeedback(null);
    store.setShowHint(false);
    store.setTiles([]);
    const correctVal = seq.sequence[seq.blanks[0]!]!;
    queueSpawnOnBeat(correctVal, diff);
  }, [store, queueSpawnOnBeat]);

  const endGame = useCallback(() => {
    if (sprintRef.current) clearInterval(sprintRef.current);
    audio.stopMusic();
    store.setTiles([]);
    store.setScreen("results");
  }, [audio, store]);

  const advanceSequence = useCallback(() => {
    const s = useGameStore.getState();
    if (s.mode === "arcade") {
      const ni = s.sequenceIndex + 1;
      if (ni >= DifficultyController.SEQS_PER_ROUND) {
        if (s.round >= DifficultyController.TOTAL_ROUNDS) { endGame(); return; }
        const nd = DifficultyController.getRoundBumpDifficulty(difficultyRef.current);
        const nb = DifficultyController.getRoundBumpBPM(s.bpm);
        store.setRound(s.round + 1);
        store.setSequenceIndex(0);
        store.setBpm(nb);
        audio.setBPM(nb);
        audio.playLevelUp();
        difficultyRef.current = nd;
        newSequence(nd);
      } else {
        store.setSequenceIndex(ni);
        const nd = DifficultyController.getNextDifficulty(difficultyRef.current, "arcade");
        difficultyRef.current = nd;
        newSequence(nd);
      }
    } else if (s.mode === "sprint") {
      store.incrementSequenceIndex();
      newSequence(difficultyRef.current);
    } else {
      store.incrementSequenceIndex();
      const nd = DifficultyController.getNextDifficulty(difficultyRef.current, "zen");
      difficultyRef.current = nd;
      newSequence(nd);
    }
  }, [audio, store, newSequence, endGame]);

  const moveToNextBlank = useCallback(() => {
    const s = useGameStore.getState();
    if (!s.currentSequence) return;
    const next = s.currentBlankIdx + 1;
    if (next < s.currentSequence.blanks.length) {
      store.setCurrentBlankIdx(next);
      const correctVal = s.currentSequence.sequence[s.currentSequence.blanks[next]!]!;
      queueSpawnOnBeat(correctVal, difficultyRef.current);
    } else {
      advanceSequence();
    }
  }, [store, queueSpawnOnBeat, advanceSequence]);

  // ─── Hit / Miss handlers ────────────────────────────────────────
  const handleHit = useCallback((tile: FallingTile) => {
    const s = useGameStore.getState();
    const grade = s.mode === "zen" ? (tile.correct ? "good" : "miss") : audio.judgeTime();
    const finalGrade = tile.correct ? grade : "miss";

    store.updateTiles((tiles) =>
      tiles.map((t) =>
        t.id === tile.id
          ? { ...t, hit: true, result: finalGrade }
          : tile.correct && !t.correct && !t.hit
            ? { ...t, missed: true }
            : t,
      ),
    );
    store.incrementAnswered();

    if (tile.correct) {
      store.incrementCorrect();
      const ns = store.incrementStreak();
      audio.updateStemLayers(ns);
      if (ScoreManager.isComboMilestone(ns)) {
        audio.playCombo();
        store.flashCombo();
      }
      const pts = ScoreManager.calculateScore(finalGrade, s.streak);
      store.addScore(pts);
      if (finalGrade === "perfect") audio.playPerfect(); else audio.playCorrect();
      sceneRef.current?.triggerSuccess();
      if (s.currentSequence) {
        store.fillBlank(s.currentSequence.blanks[s.currentBlankIdx]!, tile.value);
      }
      store.addTimingGrade(finalGrade);
      store.setFeedback({ grade: finalGrade, correct: true });
      setTimeout(() => store.setFeedback(null), 600);
      moveToNextBlank();
    } else {
      store.resetStreak();
      audio.updateStemLayers(0);
      audio.playWrong();
      sceneRef.current?.triggerFail();
      store.addTimingGrade("miss");
      store.setFeedback({ grade: "miss", correct: false });
      setTimeout(() => store.setFeedback(null), 600);
    }
  }, [audio, store, moveToNextBlank]);

  const handleMiss = useCallback(() => {
    store.resetStreak();
    store.incrementAnswered();
    audio.updateStemLayers(0);
    audio.playWrong();
    sceneRef.current?.triggerFail();
    store.addTimingGrade("miss");
    store.setFeedback({ grade: "miss", correct: false });
    setTimeout(() => store.setFeedback(null), 600);
    moveToNextBlank();
  }, [audio, store, moveToNextBlank]);

  const handleLaneTap = useCallback((lane: number) => {
    const s = useGameStore.getState();
    const tapped = s.tiles.find(
      (t) => t.lane === lane && !t.hit && !t.missed && t.y >= HIT_ZONE_Y - 0.25 && t.y <= HIT_ZONE_Y + TILE_HEIGHT + 0.12,
    );
    if (!tapped) return;
    handleHit(tapped);
  }, [handleHit]);

  // ─── Start game — picks a random track automatically ────────────
  const startGame = useCallback(async (mode: GameMode) => {
    store.setMode(mode);
    await audio.init();

    // Pick a random track from tracks.json
    const track = pickRandomTrack();
    currentTrackRef.current = track;
    await audio.loadTrack(track.id);

    const baseBpm = mode === "sprint" ? Math.max(track.bpm, 110) : track.bpm;
    store.setBpm(baseBpm);
    audio.setBPM(baseBpm);

    store.resetScores();
    store.setRound(1);
    store.setSequenceIndex(0);
    store.setSprintTime(DifficultyController.SPRINT_DURATION);
    const sd = DifficultyController.getStartDifficulty(mode);
    difficultyRef.current = sd;
    lastBeatRef.current = -1;
    pendingSpawnRef.current = null;
    store.setCountdown(3);
    store.setScreen("countdown");
    let c = 3;
    const ci = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(ci);
        store.setCountdown(0);
        store.setScreen("playing");
        audio.startMusic();
        audio.updateStemLayers(0);
        newSequence(sd);
      } else {
        store.setCountdown(c);
      }
    }, 650);
  }, [audio, store, newSequence]);

  // ─── Game loop ──────────────────────────────────────────────────
  useGameLoop(store.screen === "playing", (now) => {
    if (!audio.initialized) return;

    const info = audio.getBeatInfo();

    if (info.beat !== lastBeatRef.current) {
      lastBeatRef.current = info.beat;
      sceneRef.current?.triggerBeat();

      if (pendingSpawnRef.current) {
        const { correctVal, diff } = pendingSpawnRef.current;
        pendingSpawnRef.current = null;
        executeSpawn(correctVal, diff);
      }
    }

    store.updateTiles((tiles) => {
      let missed = false;
      const updated = tiles.map((tile) => {
        if (tile.hit || tile.missed) return tile;
        if (now < tile.spawnTime) return tile;

        const elapsed = now - tile.spawnTime;
        const progress = Math.min(elapsed / tile.fallDuration, 1.2);
        const nt = { ...tile, y: progress };

        if (progress > HIT_ZONE_Y + TILE_HEIGHT + 0.1 && tile.correct && !tile.hit && !missHandledRef.current.has(tile.id)) {
          missHandledRef.current.add(tile.id);
          missed = true;
          return { ...nt, missed: true, result: "miss" as const };
        }
        if (progress > 1.12 && !tile.correct) return { ...nt, missed: true };
        return nt;
      });
      if (missed) setTimeout(() => handleMiss(), 0);
      return updated;
    });
  });

  // Sprint timer
  useEffect(() => {
    if (store.screen !== "playing" || store.mode !== "sprint") return;
    sprintRef.current = setInterval(() => {
      const remaining = store.decrementSprintTime();
      if (remaining <= 0) { if (sprintRef.current) clearInterval(sprintRef.current); endGame(); }
    }, 1000);
    return () => { if (sprintRef.current) clearInterval(sprintRef.current); };
  }, [store.screen, store.mode, store, endGame]);

  // ─── Keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (store.screen === "playing") { pauseGame(); return; }
        if (store.screen === "paused") { resumeGame(); return; }
        if (store.screen === "results") { store.setScreen("modeSelect"); return; }
        if (store.screen === "modeSelect") { store.setScreen("title"); return; }
        return;
      }
      if (store.screen !== "playing") return;
      const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, s: 1, d: 2, f: 3 };
      if (map[e.key] !== undefined) handleLaneTap(map[e.key]!);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [store.screen, handleLaneTap, pauseGame, resumeGame, store]);

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      color: t.text,
      width: "100%",
      height: "100vh",
      background: t.bg,
      position: "relative",
      overflow: "hidden",
      userSelect: "none",
    }}>
      <div ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {store.screen === "title" && (
        <TitleScreen
          themeId={store.theme}
          onStart={async () => { await audio.init(); store.setScreen("modeSelect"); }}
          onThemeChange={(tid: ThemeId) => store.setTheme(tid)}
        />
      )}

      {store.screen === "modeSelect" && (
        <ModeSelect
          themeId={store.theme}
          onSelect={(m: GameMode) => startGame(m)}
          onBack={() => store.setScreen("title")}
        />
      )}

      {store.screen === "countdown" && (
        <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: "clamp(90px, 22vw, 170px)", fontWeight: 800, color: t.accent, animation: "countdownPulse 0.6s ease-in-out infinite" }}>
            {store.countdown}
          </div>
          <div style={{ fontSize: 13, color: t.textDim, marginTop: 12 }}>tiles incoming...</div>
        </div>
      )}

      {(store.screen === "playing" || store.screen === "paused") && store.currentSequence && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <GameHUD
            themeId={store.theme}
            mode={store.mode}
            score={store.score}
            streak={store.streak}
            round={store.round}
            sequenceIndex={store.sequenceIndex}
            sprintTime={store.sprintTime}
            bpm={store.bpm}
            onPause={pauseGame}
          />
          <SequenceDisplay
            sequence={store.currentSequence}
            filledBlanks={store.filledBlanks}
            currentBlankIdx={store.currentBlankIdx}
            showHint={store.showHint}
            onToggleHint={() => store.toggleHint()}
            themeId={store.theme}
          />
          <InputPad tiles={store.tiles} themeId={store.theme} onLaneTap={handleLaneTap} />

          {store.feedback && (
            <TimingFeedback
              grade={store.feedback.grade}
              correct={store.feedback.correct}
              errorColor={t.error}
              perfectColor={t.perfect}
            />
          )}
          <ComboMeter streak={store.streak} visible={store.comboFlash} color={t.accent3} />

          <div style={{ padding: "4px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 20 }}>
            <span style={{ fontSize: 9, color: t.textDim, fontFamily: "'JetBrains Mono'" }}>
              {store.totalAnswered > 0 ? Math.round((store.totalCorrect / store.totalAnswered) * 100) : 0}% acc
            </span>
            <span style={{ fontSize: 9, color: `${t.textDim}55`, fontFamily: "'JetBrains Mono'" }}>Esc to pause · keys: 1 2 3 4</span>
            <button onClick={endGame} style={{ background: "none", border: `1px solid ${t.textDim}22`, borderRadius: 6, color: t.textDim, cursor: "pointer", fontSize: 9, padding: "2px 10px" }}>
              end
            </button>
          </div>
        </div>
      )}

      {store.screen === "paused" && (
        <PauseOverlay
          themeId={store.theme}
          score={store.score}
          streak={store.streak}
          onResume={resumeGame}
          onRestart={() => startGame(store.mode)}
          onModeSelect={quitToModeSelect}
          onTitle={quitToTitle}
        />
      )}

      {store.screen === "results" && (
        <ResultsScreen
          themeId={store.theme}
          mode={store.mode}
          score={store.score}
          maxStreak={store.maxStreak}
          totalCorrect={store.totalCorrect}
          totalAnswered={store.totalAnswered}
          timingGrades={store.timingGrades}
          sequenceIndex={store.sequenceIndex}
          difficulty={difficultyRef.current}
          onPlayAgain={() => startGame(store.mode)}
          onModeSelect={() => store.setScreen("modeSelect")}
          onTitle={() => store.setScreen("title")}
        />
      )}
    </div>
  );
}