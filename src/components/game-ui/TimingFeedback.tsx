import type { TimingGrade } from "@/types/game.types";

const GRADE_COLORS: Record<TimingGrade, string> = {
  perfect: "#FFD700",
  good: "#F0EDE6",
  ok: "#8A8694",
  miss: "#FF6B6B",
};

interface Props {
  grade: TimingGrade;
  correct: boolean;
  errorColor: string;
  perfectColor: string;
}

export function TimingFeedback({ grade, correct, errorColor, perfectColor }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: "32%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        pointerEvents: "none",
        animation: "feedbackPop 0.4s ease-out",
      }}
    >
      <span
        style={{
          fontFamily: "'Bricolage Grotesque'",
          fontWeight: 800,
          fontSize: grade === "perfect" ? 38 : 28,
          color: correct ? GRADE_COLORS[grade] : errorColor,
          textShadow: grade === "perfect"
            ? `0 0 30px ${perfectColor}66`
            : !correct
              ? `0 0 20px ${errorColor}44`
              : "none",
          letterSpacing: 2,
        }}
      >
        {correct ? grade.toUpperCase() : "MISS"}
        {grade === "perfect" && " ✦"}
      </span>
    </div>
  );
}
