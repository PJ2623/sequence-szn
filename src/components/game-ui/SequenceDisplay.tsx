import type { GeneratedSequence } from "@/types/sequence.types";
import type { ThemeId } from "@/types/game.types";
import themes from "@/data/themes.json";

interface Props {
  sequence: GeneratedSequence;
  filledBlanks: Record<number, number>;
  currentBlankIdx: number;
  showHint: boolean;
  onToggleHint: () => void;
  themeId: ThemeId;
}

type ThemeData = (typeof themes)[keyof typeof themes];

export function SequenceDisplay({ sequence, filledBlanks, currentBlankIdx, showHint, onToggleHint, themeId }: Props) {
  const t: ThemeData = themes[themeId];

  return (
    <div style={{ padding: "2px 14px 6px", flexShrink: 0, zIndex: 20 }}>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: t.accent2, fontFamily: "'JetBrains Mono'", letterSpacing: 1 }}>
          {sequence.rule.toUpperCase()}
        </span>
        <button
          onClick={onToggleHint}
          style={{
            background: "none",
            border: `1px solid ${t.textDim}33`,
            borderRadius: 5,
            color: t.textDim,
            cursor: "pointer",
            fontSize: 9,
            padding: "0 6px",
          }}
        >
          {showHint ? "hide" : "hint"}
        </button>
      </div>

      {showHint && (
        <div style={{ fontSize: 10, color: t.accent, textAlign: "center", marginBottom: 4, fontStyle: "italic" }}>
          {sequence.hint}
        </div>
      )}

      <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
        {sequence.sequence.map((val, i) => {
          const isBlank = sequence.blanks.includes(i);
          const filled = filledBlanks[i];
          const blankOrder = sequence.blanks.indexOf(i);
          const isActive = isBlank && blankOrder === currentBlankIdx && filled === undefined;

          return (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: "clamp(14px, 3.5vw, 20px)",
                fontWeight: 500,
                padding: "3px 7px",
                minWidth: 32,
                textAlign: "center",
                borderRadius: 7,
                background: isBlank
                  ? filled !== undefined
                    ? `${t.accent}18`
                    : isActive
                      ? `${t.accent2}18`
                      : t.surface
                  : "transparent",
                border: isBlank
                  ? filled !== undefined
                    ? `2px solid ${t.accent}`
                    : isActive
                      ? `2px solid ${t.accent2}`
                      : `2px dashed ${t.textDim}33`
                  : "none",
                color: isBlank
                  ? filled !== undefined
                    ? t.accent
                    : isActive
                      ? t.accent2
                      : `${t.textDim}55`
                  : t.text,
                transition: "all 0.3s",
                boxShadow: isActive ? `0 0 10px ${t.accent2}22` : "none",
              }}
            >
              {isBlank ? (filled !== undefined ? filled : "?") : val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
