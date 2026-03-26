import type { FallingTile } from "@/types/sequence.types";
import type { ThemeId } from "@/types/game.types";
import { NUM_LANES, TILE_CONSTANTS } from "@/types/game.types";
import themes from "@/data/themes.json";

const { HIT_ZONE_Y, HEIGHT: TILE_HEIGHT, START_Y } = TILE_CONSTANTS;

interface Props {
  tiles: FallingTile[];
  themeId: ThemeId;
  onLaneTap: (lane: number) => void;
}

type ThemeData = (typeof themes)[keyof typeof themes];

export function InputPad({ tiles, themeId, onLaneTap }: Props) {
  const t: ThemeData = themes[themeId];
  const laneW = 100 / NUM_LANES;

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", touchAction: "none" }}>
      {/* Lane dividers */}
      {Array.from({ length: NUM_LANES - 1 }).map((_, i) => (
        <div
          key={`div-${i}`}
          style={{
            position: "absolute",
            left: `${laneW * (i + 1)}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: `${t.textDim}0e`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Hit zone line */}
      <div style={{ position: "absolute", top: `${HIT_ZONE_Y * 100}%`, left: 0, right: 0, height: 2, zIndex: 5 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${t.accent}88, ${t.accent2}88, transparent)`,
          }}
        />
      </div>

      {/* Hit zone glow */}
      <div
        style={{
          position: "absolute",
          top: `${(HIT_ZONE_Y - 0.06) * 100}%`,
          left: 0,
          right: 0,
          height: `${(TILE_HEIGHT + 0.12) * 100}%`,
          background: `linear-gradient(180deg, transparent, ${t.accent}0a, ${t.accent}06, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Lane key hints */}
      {Array.from({ length: NUM_LANES }).map((_, i) => (
        <div
          key={`key-${i}`}
          style={{
            position: "absolute",
            bottom: 4,
            left: `${laneW * i}%`,
            width: `${laneW}%`,
            textAlign: "center",
            fontSize: 9,
            color: `${t.textDim}44`,
            fontFamily: "'JetBrains Mono'",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          {["1", "2", "3", "4"][i]}
        </div>
      ))}

      {/* Falling tiles */}
      {tiles.map((tile) => {
        // Tile hasn't reached its spawn beat yet — completely hidden
        if (tile.y <= 0 && !tile.hit) return null;

        if (tile.missed && !tile.result && !tile.correct) return null;

        const left = tile.lane * laneW;
        const lc = t.laneColors[tile.lane] ?? t.accent;
        const isHit = tile.hit;
        const isMissResult = tile.result === "miss" && tile.missed;

        // Map tile.y from [0..1] to screen position [START_Y..1.0]
        // so tiles smoothly slide in from above the viewport
        const visualY = START_Y + tile.y * (1.0 - START_Y);
        const topPct = visualY * 100;

        // Fade out tiles that passed the hit zone
        const pastHitZone = visualY > HIT_ZONE_Y + TILE_HEIGHT;
        const opacity = isHit
          ? 0
          : isMissResult
            ? 0.25
            : pastHitZone
              ? Math.max(0, 1 - (visualY - HIT_ZONE_Y - TILE_HEIGHT) * 8)
              : 1;
        if (opacity <= 0 && !isHit) return null;

        return (
          <div
            key={tile.id}
            onClick={() => onLaneTap(tile.lane)}
            style={{
              position: "absolute",
              left: `calc(${left}% + 3px)`,
              top: `${topPct}%`,
              width: `calc(${laneW}% - 6px)`,
              height: `${TILE_HEIGHT * 100}%`,
              zIndex: 10,
              cursor: isHit || tile.missed ? "default" : "pointer",
              opacity,
              pointerEvents: isHit || tile.missed ? "none" : "auto",
              animation: isHit ? "tileHit 0.3s ease-out forwards" : "none",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isHit
                  ? `${tile.result === "perfect" ? t.perfect : t.accent}44`
                  : isMissResult
                    ? `${t.error}33`
                    : `${lc}18`,
                border: `1.5px solid ${isHit
                    ? tile.result === "perfect"
                      ? t.perfect
                      : t.accent
                    : isMissResult
                      ? t.error
                      : lc
                  }${isHit ? "" : "66"}`,
                backdropFilter: "blur(2px)",
                boxShadow:
                  tile.correct && !isHit && !isMissResult
                    ? `inset 0 0 28px ${lc}10, 0 0 24px ${lc}12`
                    : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontWeight: 600,
                  fontSize: "clamp(22px, 6vw, 38px)",
                  color: isHit
                    ? tile.result === "perfect"
                      ? t.perfect
                      : t.accent
                    : isMissResult
                      ? t.error
                      : t.text,
                }}
              >
                {tile.value}
              </span>
            </div>
          </div>
        );
      })}

      {/* Invisible tap zones for mobile */}
      {Array.from({ length: NUM_LANES }).map((_, lane) => (
        <div
          key={`tap-${lane}`}
          onClick={() => onLaneTap(lane)}
          style={{
            position: "absolute",
            left: `${lane * laneW}%`,
            top: `${(HIT_ZONE_Y - 0.20) * 100}%`,
            width: `${laneW}%`,
            height: `${0.48 * 100}%`,
            zIndex: 6,
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}