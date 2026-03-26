import type { TimingGrade } from "@/types/game.types";

export class ScoreManager {
  /** Calculate points for a correct answer based on timing grade */
  static getPoints(grade: TimingGrade): number {
    switch (grade) {
      case "perfect": return 100;
      case "good": return 75;
      case "ok": return 50;
      case "miss": return 25;
    }
  }

  /** Calculate multiplier from streak count */
  static getMultiplier(streak: number): number {
    return 1 + Math.floor(streak / 5) * 0.25;
  }

  /** Calculate total points for a hit */
  static calculateScore(grade: TimingGrade, streak: number): number {
    return Math.round(ScoreManager.getPoints(grade) * ScoreManager.getMultiplier(streak));
  }

  /** Check if streak just crossed a combo milestone */
  static isComboMilestone(streak: number): boolean {
    return streak > 0 && streak % 5 === 0;
  }

  /** Calculate final letter grade */
  static getLetterGrade(
    totalCorrect: number,
    totalAnswered: number,
    timingGrades: readonly TimingGrade[],
  ): string {
    const acc = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
    const perfects = timingGrades.filter((g) => g === "perfect").length;
    const perfRate = timingGrades.length > 0 ? perfects / timingGrades.length : 0;
    const combined = acc * 0.6 + perfRate * 0.4;

    if (combined >= 0.95) return "S";
    if (combined >= 0.85) return "A";
    if (combined >= 0.7) return "B";
    if (combined >= 0.5) return "C";
    return "D";
  }

  /** Get the grade-associated color */
  static getGradeColor(grade: string, theme: { perfect: string; accent3: string; accent: string; accent2: string; error: string }): string {
    const map: Record<string, string> = {
      S: theme.perfect,
      A: theme.accent3,
      B: theme.accent,
      C: theme.accent2,
      D: theme.error,
    };
    return map[grade] ?? theme.accent;
  }
}
