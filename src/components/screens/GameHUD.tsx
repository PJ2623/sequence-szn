import type { GameMode, ThemeId } from "@/types/game.types";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  mode: GameMode;
  score: number;
  streak: number;
  round: number;
  sequenceIndex: number;
  sprintTime: number;
  bpm: number;
  onPause: () => void;
}

export function GameHUD({ themeId, mode, score, streak, round, sequenceIndex, sprintTime, bpm, onPause }: Props) {
  const t = themes[themeId];
  const labelStyle = { fontSize: 9, color: "#8A8694", letterSpacing: 2 } as const;

  return (
    <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 20 }}>
      <div style={{ display: "flex", gap: 18 }}>
        <div>
          <div style={labelStyle}>SCORE</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 19, fontWeight: 700, color: t.accent }}>
            {score.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={labelStyle}>STREAK</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 19, fontWeight: 700, color: streak >= 5 ? t.accent3 : t.text }}>
            {streak}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {mode === "sprint" && (
          <div>
            <div style={labelStyle}>TIME</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 19, fontWeight: 500, color: sprintTime <= 10 ? t.error : t.text }}>
              {sprintTime}s
            </div>
          </div>
        )}
        {mode === "arcade" && (
          <div style={{ textAlign: "right" }}>
            <div style={labelStyle}>RND {round}/3</div>
            <div style={{ fontSize: 10, color: t.textDim }}>{sequenceIndex + 1}/8</div>
          </div>
        )}
        <div style={{ fontSize: 9, color: t.textDim, fontFamily: "'JetBrains Mono'" }}>{bpm}BPM</div>
        <button
          onClick={onPause}
          style={{
            background: "none",
            border: `1px solid ${t.textDim}33`,
            borderRadius: 8,
            color: t.textDim,
            cursor: "pointer",
            fontSize: 14,
            padding: "2px 8px",
            lineHeight: 1,
            transition: "all 0.2s",
          }}
          title="Pause (Esc)"
        >
          ⏸
        </button>
      </div>
    </div>
  );
}