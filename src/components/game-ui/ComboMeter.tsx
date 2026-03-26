interface Props {
  streak: number;
  visible: boolean;
  color: string;
}

export function ComboMeter({ streak, visible, color }: Props) {
  if (!visible) return null;

  const multiplier = (1 + Math.floor(streak / 5) * 0.25).toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        top: "25%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 55,
        pointerEvents: "none",
        animation: "comboFlash 0.6s ease-out forwards",
      }}
    >
      <span
        style={{
          fontFamily: "'Bricolage Grotesque'",
          fontSize: 38,
          fontWeight: 800,
          color,
          textShadow: `0 0 30px ${color}`,
        }}
      >
        ×{multiplier} COMBO
      </span>
    </div>
  );
}
