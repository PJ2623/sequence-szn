import type { ThemeId } from "@/types/game.types";
import { Button } from "@components/shared/Button";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  onStart: () => void;
  onThemeChange: (theme: ThemeId) => void;
}

export function TitleScreen({ themeId, onStart, onThemeChange }: Props) {
  const t = themes[themeId];
  const allThemes = Object.keys(themes) as ThemeId[];

  return (
    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 13, letterSpacing: 6, color: t.accent2, marginBottom: 16, fontWeight: 500 }}>
          RHYTHM × MATH × FLOW
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque'",
            fontSize: "clamp(52px, 13vw, 90px)",
            fontWeight: 800,
            lineHeight: 0.92,
            margin: "0 0 8px",
            background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sequence<br />SZN
        </h1>
        <p style={{ fontSize: 14, color: t.textDim, margin: "20px 0 44px", lineHeight: 1.7 }}>
          Tiles fall to the beat. Tap the correct answer
          <br />
          as it crosses the hit zone. Feel the math.
        </p>
        <Button onClick={onStart} color={t.accent}>
          TAP TO START
        </Button>
        <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center" }}>
          {allThemes.map((tid) => (
            <button
              key={tid}
              onClick={() => onThemeChange(tid)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: themeId === tid ? `2.5px solid ${t.text}` : "2.5px solid transparent",
                background: themes[tid].accent,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 10, color: t.textDim, marginTop: 8, opacity: 0.5, letterSpacing: 2 }}>
          THEME
        </div>
      </div>
    </div>
  );
}
