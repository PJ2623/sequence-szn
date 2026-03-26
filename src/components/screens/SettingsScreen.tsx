import type { ThemeId } from "@/types/game.types";
import themes from "@/data/themes.json";

interface Props {
  themeId: ThemeId;
  volume: number;
  open: boolean;
  onClose: () => void;
  onVolumeChange: (vol: number) => void;
  onThemeChange: (theme: ThemeId) => void;
}

export function SettingsScreen({ themeId, volume, open, onClose, onVolumeChange, onThemeChange }: Props) {
  if (!open) return null;
  const t = themes[themeId];
  const allThemes = Object.keys(themes) as ThemeId[];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 260,
        height: "100%",
        background: t.bg2,
        zIndex: 200,
        padding: 24,
        borderLeft: `1px solid ${t.surface}`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: t.text }}>Settings</span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: t.text, cursor: "pointer", fontSize: 18 }}
        >
          ✕
        </button>
      </div>

      <div>
        <div style={{ fontSize: 11, color: t.textDim, marginBottom: 6, letterSpacing: 1 }}>VOLUME</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: t.accent }}
        />
      </div>

      <div>
        <div style={{ fontSize: 11, color: t.textDim, marginBottom: 8, letterSpacing: 1 }}>THEME</div>
        <div style={{ display: "flex", gap: 8 }}>
          {allThemes.map((tid) => (
            <button
              key={tid}
              onClick={() => onThemeChange(tid)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: themeId === tid ? `2px solid ${t.text}` : "2px solid transparent",
                background: themes[tid].accent,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
