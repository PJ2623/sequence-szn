import { useRef, useEffect } from "react";
import { AudioEngine } from "@engine/AudioEngine";

export function useAudioEngine() {
  const ref = useRef<AudioEngine | null>(null);

  if (!ref.current) {
    ref.current = new AudioEngine();
  }

  useEffect(() => {
    return () => {
      ref.current?.dispose();
    };
  }, []);

  return ref.current;
}
