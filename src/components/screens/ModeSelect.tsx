import type { GameMode, ThemeId } from "@/types/game.types";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

const MODES: { id: GameMode; label: string; desc: string; icon: string }[] = [
  { id: "arcade", label: "ARCADE", desc: "3 rounds · 8 sequences · tiles speed up", icon: "▶" },
  { id: "zen", label: "ZEN", desc: "No timer · no miss penalty · learn freely", icon: "◉" },
  { id: "sprint", label: "SPRINT", desc: "60 seconds · rapid fire · max score", icon: "⚡" },
];

export function ModeSelect({ themeId, onSelect, onBack }: Props) {
  const t = themes[themeId];

  return (
    <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: t.textDim, marginBottom: 28 }}>SELECT MODE</div>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              display: "block",
              width: "100%",
              background: t.surface,
              border: `1px solid ${t.accent2}22`,
              borderRadius: 16,
              padding: "18px 22px",
              cursor: "pointer",
              textAlign: "left",
              color: t.text,
              marginBottom: 12,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = t.accent)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = `${t.accent2}22`)}
          >
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 19 }}>
              {m.icon} {m.label}
            </div>
            <div style={{ fontSize: 12, color: t.textDim, marginTop: 4 }}>{m.desc}</div>
          </button>
        ))}
        <button
          onClick={onBack}
          style={{ marginTop: 16, background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: 13 }}
        >
          ← back
        </button>
      </div>
    </div>
  );
}
