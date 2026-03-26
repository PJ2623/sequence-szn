import { useEffect, useRef } from "react";

export function useGameLoop(
  active: boolean,
  callback: (now: number) => void,
) {
  const rafRef = useRef(0);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const loop = () => {
      cbRef.current(performance.now());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);
}
