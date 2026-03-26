import type { ThemeId } from "@/types/game.types";
import { Button } from "@components/shared/Button";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  score: number;
  streak: number;
  onResume: () => void;
  onRestart: () => void;
  onModeSelect: () => void;
  onTitle: () => void;
}

export function PauseOverlay({ themeId, score, streak, onResume, onRestart, onModeSelect, onTitle }: Props) {
  const t = themes[themeId];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `${t.bg}ee`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 40, fontWeight: 800, color: t.text, marginBottom: 8 }}>
        PAUSED
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 36 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.textDim, letterSpacing: 2, marginBottom: 2 }}>SCORE</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 22, fontWeight: 700, color: t.accent }}>
            {score.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.textDim, letterSpacing: 2, marginBottom: 2 }}>STREAK</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 22, fontWeight: 700, color: streak >= 5 ? t.accent3 : t.text }}>
            {streak}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 220 }}>
        <Button onClick={onResume} color={t.accent} style={{ width: "100%", textAlign: "center" }}>
          RESUME
        </Button>
        <Button onClick={onRestart} color={t.accent2} style={{ width: "100%", textAlign: "center" }}>
          RESTART
        </Button>
        <Button onClick={onModeSelect} color={t.textDim} variant="ghost" style={{ width: "100%", textAlign: "center", border: `1px solid ${t.textDim}33`, borderRadius: 14, padding: "10px 0" }}>
          CHANGE MODE
        </Button>
        <Button onClick={onTitle} color={t.textDim} variant="ghost" style={{ width: "100%", textAlign: "center", border: `1px solid ${t.textDim}22`, borderRadius: 14, padding: "10px 0" }}>
          ← TITLE SCREEN
        </Button>
      </div>

      <div style={{ marginTop: 24, fontSize: 10, color: `${t.textDim}66`, fontFamily: "'JetBrains Mono'" }}>
        press Esc to resume
      </div>
    </div>
  );
}