import { useEffect, useRef } from "react";
import type { AudioEngine } from "@engine/AudioEngine";

export function useBeatSync(
  audio: AudioEngine,
  playing: boolean,
  onBeat: (beat: number, measureBeat: number) => void,
) {
  const rafRef = useRef(0);
  const lastBeatRef = useRef(-1);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      if (audio.initialized) {
        const info = audio.getBeatInfo();
        if (info.beat !== lastBeatRef.current) {
          lastBeatRef.current = info.beat;
          onBeat(info.beat, info.measureBeat);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [audio, playing, onBeat]);
}
