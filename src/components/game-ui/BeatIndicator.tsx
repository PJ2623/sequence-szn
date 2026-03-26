import { useEffect, useRef } from "react";
import type { AudioEngine } from "@engine/AudioEngine";

interface Props {
  audio: AudioEngine;
  playing: boolean;
  color: string;
}

export function BeatIndicator({ audio, playing, color }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!playing) return;

    const tick = () => {
      if (barRef.current && audio.initialized) {
        const info = audio.getBeatInfo();
        barRef.current.style.width = `${info.phase * 100}%`;
        barRef.current.style.opacity = String(0.5 + (1 - info.phase) * 0.5);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [audio, playing]);

  return (
    <div
      style={{
        width: "100%",
        height: 3,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: color,
          borderRadius: 2,
          transition: "width 0.03s linear",
        }}
      />
    </div>
  );
}
