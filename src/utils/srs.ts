import { OpeningVariant, UserProgress } from '../types';

/**
 * Spaced Repetition System (SRS) based on a modified SM-2 algorithm
 * adapted for opening lines memorization.
 */

export const calculateNextSrsProgress = (
  currentProg: UserProgress,
  isCleanSuccess: boolean
): Partial<UserProgress> => {
  const currentReps = currentProg.repetitions || 0;
  const currentInterval = currentProg.intervalDays || 1;
  const currentEase = currentProg.easeFactor || 2.5;

  if (!isCleanSuccess) {
    // Lapse / mistake made during practice
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1); // Review again tomorrow

    return {
      repetitions: 0,
      intervalDays: 1,
      easeFactor: Math.max(1.3, currentEase - 0.2),
      nextReviewDate: nextDate.toISOString()
    };
  }

  // Perfect clean recall
  let nextInterval: number;
  const nextReps = currentReps + 1;

  if (nextReps === 1) {
    nextInterval = 1; // 1 day
  } else if (nextReps === 2) {
    nextInterval = 3; // 3 days
  } else if (nextReps === 3) {
    nextInterval = 7; // 1 week
  } else {
    nextInterval = Math.round(currentInterval * currentEase);
  }

  const nextEase = Math.min(3.0, Math.max(1.3, currentEase + 0.1));
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);

  return {
    repetitions: nextReps,
    intervalDays: nextInterval,
    easeFactor: Number(nextEase.toFixed(2)),
    nextReviewDate: nextDate.toISOString()
  };
};

/**
 * Returns true if the variation is due for review today according to SRS.
 */
export const isVariantDue = (prog?: UserProgress): boolean => {
  if (!prog || !prog.nextReviewDate) return false;
  return new Date(prog.nextReviewDate).getTime() <= Date.now();
};

/**
 * Returns all variants that are due for review.
 */
export const getDueVariants = (
  variants: OpeningVariant[],
  userProgress: Record<string, UserProgress>
): OpeningVariant[] => {
  return variants.filter(v => isVariantDue(userProgress[v.id]));
};
