import { GamificationProfile, StarRating, MoveFeedbackBadge } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Peón Curioso', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Caballo Táctico', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Alfil Incisivo', minXp: 250, maxXp: 500 },
  { level: 4, title: 'Torre de Asalto', minXp: 500, maxXp: 900 },
  { level: 5, title: 'Dama Dominante', minXp: 900, maxXp: 1500 },
  { level: 6, title: 'Rey de la Vienesa', minXp: 1500, maxXp: 2500 },
  { level: 7, title: 'Maestro del Gambito', minXp: 2500, maxXp: 4000 },
  { level: 8, title: 'Gran Maestro Legendario', minXp: 4000, maxXp: 100000 }
];

export const getLevelForXp = (xp: number): {
  level: number;
  title: string;
  nextLevelXp: number;
  currentLevelProgress: number;
} => {
  let currentLevel = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) {
      currentLevel = lvl;
    } else {
      break;
    }
  }

  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1) || currentLevel;
  const xpInCurrentLevel = Math.max(0, xp - currentLevel.minXp);
  const xpNeededForNext = Math.max(1, nextLevel.minXp - currentLevel.minXp);
  const currentLevelProgress = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpNeededForNext) * 100)
  );

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelXp: nextLevel.minXp,
    currentLevelProgress
  };
};

const STORAGE_KEY_XP = 'chessop_xp';
const STORAGE_KEY_STARS = 'chessop_stars';

export const loadGamificationProfile = (): GamificationProfile => {
  let totalXp = 0;
  let stars: Record<string, StarRating> = {};

  try {
    const rawXp = localStorage.getItem(STORAGE_KEY_XP);
    if (rawXp) {
      const parsedXp = parseInt(rawXp, 10);
      if (!isNaN(parsedXp)) totalXp = parsedXp;
    }

    const rawStars = localStorage.getItem(STORAGE_KEY_STARS);
    if (rawStars) {
      stars = JSON.parse(rawStars);
    }
  } catch (err) {
    console.error('Error loading gamification profile:', err);
  }

  const levelData = getLevelForXp(totalXp);
  const totalStars = Object.values(stars).reduce((acc, s) => acc + s, 0);

  return {
    totalXp,
    level: levelData.level,
    title: levelData.title,
    nextLevelXp: levelData.nextLevelXp,
    currentLevelProgress: levelData.currentLevelProgress,
    stars,
    totalStars
  };
};

export const saveGamificationProfile = (totalXp: number, stars: Record<string, StarRating>) => {
  try {
    localStorage.setItem(STORAGE_KEY_XP, String(totalXp));
    localStorage.setItem(STORAGE_KEY_STARS, JSON.stringify(stars));
  } catch (err) {
    console.error('Error saving gamification profile:', err);
  }
};

/**
 * Calculates current precision % (100% default, -15% per mistake, floor at 25%)
 */
export const calculatePrecision = (mistakesCount: number, userMovesAttempted: number): number => {
  if (userMovesAttempted === 0) return 100;
  if (mistakesCount === 0) return 100;
  const penalty = mistakesCount * 15;
  return Math.max(25, 100 - penalty);
};

/**
 * Translates precision into 1-to-3 Star rating
 */
export const calculateStars = (precision: number): StarRating => {
  if (precision >= 100) return 3;
  if (precision >= 80) return 2;
  return 1;
};

/**
 * Award XP and update stars for completing a variation
 */
export const awardVariantCompletion = (
  variantId: string,
  precision: number,
  isDemo: boolean,
  currentProfile: GamificationProfile
): {
  xpGained: number;
  starsAwarded: StarRating;
  newProfile: GamificationProfile;
  leveledUp: boolean;
} => {
  const starsAwarded = calculateStars(precision);
  
  // Base XP: Practice mode gives significantly more XP than Demo
  let xpGained = isDemo ? 25 : 75;
  
  // Star bonuses
  if (!isDemo) {
    if (starsAwarded === 3) xpGained += 50; // Total 125 XP for 3 stars
    else if (starsAwarded === 2) xpGained += 25; // Total 100 XP for 2 stars
  }

  const prevBestStars = currentProfile.stars[variantId] || 0;
  const updatedStars = { ...currentProfile.stars };
  
  if (starsAwarded > prevBestStars) {
    updatedStars[variantId] = starsAwarded;
    // First time achieving better stars bonus
    xpGained += (starsAwarded - prevBestStars) * 20;
  }

  const newTotalXp = currentProfile.totalXp + xpGained;
  saveGamificationProfile(newTotalXp, updatedStars);

  const newLevelData = getLevelForXp(newTotalXp);
  const leveledUp = newLevelData.level > currentProfile.level;
  const newTotalStars = Object.values(updatedStars).reduce((acc, s) => acc + s, 0);

  const newProfile: GamificationProfile = {
    totalXp: newTotalXp,
    level: newLevelData.level,
    title: newLevelData.title,
    nextLevelXp: newLevelData.nextLevelXp,
    currentLevelProgress: newLevelData.currentLevelProgress,
    stars: updatedStars,
    totalStars: newTotalStars
  };

  return {
    xpGained,
    starsAwarded,
    newProfile,
    leveledUp
  };
};

/**
 * Generate move reaction badge and message
 */
export const createMoveFeedbackBadge = (
  notation: string,
  isTacticalOrGambitKey: boolean,
  comboCount: number
): MoveFeedbackBadge => {
  if (comboCount >= 3) {
    return {
      type: 'combo',
      text: `🔥 ¡COMBO x${comboCount}!`,
      subtext: '¡Racha en llamas!'
    };
  }

  if (isTacticalOrGambitKey) {
    return {
      type: 'key',
      text: '💎 ¡Jugada Clave!',
      subtext: `Precisión brillante con ${notation}`
    };
  }

  return {
    type: 'book',
    text: '📚 Jugada de Libro',
    subtext: `Teoría exacta: ${notation}`
  };
};
