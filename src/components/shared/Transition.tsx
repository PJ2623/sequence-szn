import type { ReactNode, CSSProperties } from "react";

interface TransitionProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp";
  delay?: number;
  style?: CSSProperties;
}

export function Transition({ children, animation = "fadeIn", delay = 0, style }: TransitionProps) {
  return (
    <div
      style={{
        animation: `${animation === "fadeIn" ? "fadeIn" : "slideUp"} 0.4s ease-out both`,
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
