import type { GameMode, ThemeId, TimingGrade } from "@/types/game.types";
import { ScoreManager } from "@engine/ScoreManager";
import { Button } from "@components/shared/Button";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  mode: GameMode;
  score: number;
  maxStreak: number;
  totalCorrect: number;
  totalAnswered: number;
  timingGrades: TimingGrade[];
  sequenceIndex: number;
  difficulty: number;
  onPlayAgain: () => void;
  onModeSelect: () => void;
  onTitle: () => void;
}

export function ResultsScreen(props: Props) {
  const t = themes[props.themeId];
  const accuracy = props.totalAnswered > 0 ? Math.round((props.totalCorrect / props.totalAnswered) * 100) : 0;
  const grade = ScoreManager.getLetterGrade(props.totalCorrect, props.totalAnswered, props.timingGrades);
  const gradeColor = ScoreManager.getGradeColor(grade, t);
  const perfects = props.timingGrades.filter((g) => g === "perfect").length;
  const goods = props.timingGrades.filter((g) => g === "good").length;

  const stats = [
    { l: "Accuracy", v: `${accuracy}%` },
    { l: "Max Streak", v: String(props.maxStreak) },
    { l: "Perfects", v: String(perfects) },
    { l: "Goods", v: String(goods) },
    { l: "Sequences", v: String(props.sequenceIndex + 1) },
    { l: "Difficulty", v: `Lv ${Math.round(props.difficulty)}` },
  ];

  return (
    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: t.textDim, marginBottom: 8 }}>SESSION COMPLETE</div>
        <div
          style={{
            fontFamily: "'Bricolage Grotesque'",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1,
            color: gradeColor,
            textShadow: `0 0 50px ${gradeColor}33`,
            marginBottom: 4,
          }}
        >
          {grade}
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 32, fontWeight: 700, color: t.accent, marginBottom: 28 }}>
          {props.score.toLocaleString()} pts
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: t.surface, borderRadius: 10, padding: "10px 14px", textAlign: "left" }}>
              <div style={{ fontSize: 9, color: t.textDim, letterSpacing: 2, marginBottom: 3 }}>
                {s.l.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontSize: 20, fontWeight: 700 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button onClick={props.onPlayAgain} color={t.accent}>
            PLAY AGAIN
          </Button>
          <Button onClick={props.onModeSelect} color={t.accent2}>
            MODES
          </Button>
        </div>
        <button
          onClick={props.onTitle}
          style={{ marginTop: 14, background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: 12 }}
        >
          ← title
        </button>
      </div>
    </div>
  );
}
