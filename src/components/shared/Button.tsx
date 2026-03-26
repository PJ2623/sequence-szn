import type { CSSProperties, ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color: string;
  variant?: "primary" | "ghost";
  style?: CSSProperties;
}

export function Button({ children, onClick, color, variant = "primary", style }: ButtonProps) {
  const base: CSSProperties = {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 3,
    padding: "13px 32px",
    borderRadius: 14,
    cursor: "pointer",
    transition: "all 0.25s",
    border: variant === "ghost" ? "none" : `2px solid ${color}`,
    background: variant === "ghost" ? "none" : `${color}11`,
    color,
    ...style,
  };

  return (
    <button onClick={onClick} style={base}>
      {children}
    </button>
  );
}
