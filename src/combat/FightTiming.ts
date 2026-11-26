export type FightTimingGrade = "precise" | "steady" | "miss";

export interface FightTimingResult {
  grade: FightTimingGrade;
  progress: number;
  distanceFromTarget: number;
}

export const RHYTHM_TIMING_DURATION_MS = 1800;
export const RHYTHM_TIMING_TARGET = 0.75;

/**
 * Evaluates input against the centre of the final long beat.
 * Observing the pattern first widens the judgement window.
 */
export function evaluateRhythmTiming(
  elapsedMs: number,
  observedBeat: boolean,
): FightTimingResult {
  const safeElapsed = Number.isFinite(elapsedMs) ? elapsedMs : 0;
  const progress = Math.max(0, Math.min(1, safeElapsed / RHYTHM_TIMING_DURATION_MS));
  const distanceFromTarget = Math.abs(progress - RHYTHM_TIMING_TARGET);

  const preciseWindow = observedBeat ? 0.075 : 0.035;
  const steadyWindow = observedBeat ? 0.16 : 0.09;

  let grade: FightTimingGrade;
  if (distanceFromTarget <= preciseWindow) {
    grade = "precise";
  } else if (distanceFromTarget <= steadyWindow) {
    grade = "steady";
  } else {
    grade = "miss";
  }

  return { grade, progress, distanceFromTarget };
}

export const RHYTHM_DODGE_INTERVALS_MS = [300, 300, 300, 900] as const;
