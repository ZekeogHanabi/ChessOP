import { WeakSpotRecord, HeatmapDay, OpeningVariant, UserProgress } from '../types';

const WEAK_SPOTS_KEY = 'chessop_weak_spots';
const ACTIVITY_LOG_KEY = 'chessop_activity_log';

/**
 * Record a mistake at a specific ply index in a variation.
 */
export const recordWeakSpot = (
  variantId: string,
  plyIndex: number,
  expectedMove: string
) => {
  try {
    const raw = localStorage.getItem(WEAK_SPOTS_KEY);
    const spots: Record<string, WeakSpotRecord> = raw ? JSON.parse(raw) : {};
    const key = `${variantId}-ply${plyIndex}`;

    if (spots[key]) {
      spots[key].mistakeCount += 1;
      spots[key].lastFailed = new Date().toISOString();
    } else {
      spots[key] = {
        variantId,
        plyIndex,
        expectedMove,
        mistakeCount: 1,
        lastFailed: new Date().toISOString()
      };
    }

    localStorage.setItem(WEAK_SPOTS_KEY, JSON.stringify(spots));
  } catch (err) {
    console.warn('Error recording weak spot:', err);
  }
};

/**
 * When a user successfully plays the expected move at a weak spot without errors,
 * we ease the mistake counter or clear it if resolved.
 */
export const resolveWeakSpot = (variantId: string, plyIndex: number) => {
  try {
    const raw = localStorage.getItem(WEAK_SPOTS_KEY);
    if (!raw) return;
    const spots: Record<string, WeakSpotRecord> = JSON.parse(raw);
    const key = `${variantId}-ply${plyIndex}`;

    if (spots[key]) {
      spots[key].mistakeCount = Math.max(0, spots[key].mistakeCount - 1);
      if (spots[key].mistakeCount === 0) {
        delete spots[key];
      }
      localStorage.setItem(WEAK_SPOTS_KEY, JSON.stringify(spots));
    }
  } catch (err) {
    console.warn('Error resolving weak spot:', err);
  }
};

/**
 * Get sorted list of weak spots (most frequent first).
 */
export const getWeakSpots = (variants: OpeningVariant[]): (WeakSpotRecord & { variant: OpeningVariant })[] => {
  try {
    const raw = localStorage.getItem(WEAK_SPOTS_KEY);
    if (!raw) return [];
    const spots: Record<string, WeakSpotRecord> = JSON.parse(raw);

    const result: (WeakSpotRecord & { variant: OpeningVariant })[] = [];
    Object.values(spots).forEach(spot => {
      const variant = variants.find(v => v.id === spot.variantId);
      if (variant && spot.mistakeCount > 0) {
        result.push({
          ...spot,
          variant
        });
      }
    });

    return result.sort((a, b) => b.mistakeCount - a.mistakeCount);
  } catch {
    return [];
  }
};

/**
 * Record training activity for today.
 */
export const recordDailyActivity = (completedMoves: number = 1) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    const log: Record<string, number> = raw ? JSON.parse(raw) : {};

    log[today] = (log[today] || 0) + completedMoves;
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
  } catch (err) {
    console.warn('Error recording daily activity:', err);
  }
};

/**
 * Get heatmap days for the past N weeks (default 14 weeks = 98 days).
 */
export const getActivityHeatmap = (daysCount: number = 105): HeatmapDay[] => {
  let log: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (raw) log = JSON.parse(raw);
  } catch {
    // Failsafe
  }

  const days: HeatmapDay[] = [];
  const today = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = log[dateStr] || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 6) level = 2;
    else if (count > 6 && count <= 12) level = 3;
    else if (count > 12) level = 4;

    days.push({
      date: dateStr,
      count,
      level
    });
  }

  return days;
};

/**
 * Calculate current daily streak and maximum daily streak.
 */
export const calculateDailyStreak = (): { currentStreak: number; maxStreak: number; totalDays: number } => {
  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!raw) return { currentStreak: 0, maxStreak: 0, totalDays: 0 };
    const log: Record<string, number> = JSON.parse(raw);

    const sortedDates = Object.keys(log)
      .filter(d => log[d] > 0)
      .sort();

    if (sortedDates.length === 0) return { currentStreak: 0, maxStreak: 0, totalDays: 0 };

    const totalDays = sortedDates.length;

    // Check current streak starting from today or yesterday
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let currentStreak = 0;
    let checkDate = new Date();

    // If not trained today, start checking from yesterday
    if (!log[todayStr]) {
      if (log[yesterdayStr]) {
        checkDate = yesterday;
      } else {
        checkDate = new Date(0); // broken streak
      }
    }

    if (checkDate.getTime() > 0) {
      while (true) {
        const dStr = checkDate.toISOString().slice(0, 10);
        if (log[dStr] && log[dStr] > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate max streak across all historical dates
    let maxStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach(dateStr => {
      const curDate = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      prevDate = curDate;
    });

    return { currentStreak, maxStreak, totalDays };
  } catch {
    return { currentStreak: 0, maxStreak: 0, totalDays: 0 };
  }
};

/**
 * Calculate comprehensive repertoire accuracy and mastery.
 */
export const calculateRepertoireMastery = (
  variants: OpeningVariant[],
  userProgress: Record<string, UserProgress>
) => {
  if (variants.length === 0) {
    return {
      masteryPercentage: 0,
      totalAttempts: 0,
      totalSuccesses: 0,
      accuracyRate: 0,
      masteredCount: 0,
      demoDoneCount: 0,
      totalPliesMemorized: 0
    };
  }

  let totalAttempts = 0;
  let totalSuccesses = 0;
  let masteredCount = 0;
  let demoDoneCount = 0;
  let totalPliesMemorized = 0;

  variants.forEach(v => {
    const prog = userProgress[v.id];
    if (prog) {
      totalAttempts += prog.attempts || 0;
      totalSuccesses += prog.successes || 0;
      if (prog.demoCompleted) demoDoneCount++;
      if (prog.successes > 0) {
        masteredCount++;
        totalPliesMemorized += v.moves.length;
      }
    }
  });

  const accuracyRate = totalAttempts > 0
    ? Math.round((totalSuccesses / totalAttempts) * 100)
    : 0;

  const masteryPercentage = Math.round((masteredCount / variants.length) * 100);

  return {
    masteryPercentage,
    totalAttempts,
    totalSuccesses,
    accuracyRate,
    masteredCount,
    demoDoneCount,
    totalPliesMemorized
  };
};
