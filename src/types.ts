export interface MoveNode {
  from: string; // Source square, e.g., "e2"
  to: string;   // Target square, e.g., "e4"
  notation: string; // Algebraic notation, e.g., "e4", "Nf3", "c5"
  comment?: string; // Optional educational strategic comment
}

export type OpeningCategory =
  | '1.e4 Open Games'
  | '1.e4 Asymmetric Defenses'
  | '1.d4 Systems & Classical'
  | 'Gambits & Tactical Attacks';

export interface OpeningVariant {
  id: string;
  name: string; // User-friendly name, e.g., "Najdorf Variation"
  openingName: string; // Main opening name, e.g., "Sicilian Defense"
  category?: OpeningCategory;
  description: string; // Brief context or explanation
  side: 'white' | 'black'; // The side the user plays
  moves: MoveNode[]; // Ordered array of moves in this line
  chapterName?: string; // Optional chapter name for grouped repertoires
  chapterIndex?: number; // Optional chapter index
  isCustom?: boolean; // True if loaded via user PGN import
}

export interface UserProgress {
  variantId: string;
  attempts: number; // Total practice attempts
  successes: number; // Total successful practice runs (no mistakes)
  demoCompleted: boolean; // Whether the user has completed the guided demonstration
  lastTrained: string; // ISO date string of the last session
  // Spaced Repetition (SRS)
  repetitions?: number; // Consecutive successful practice sessions
  intervalDays?: number; // Current interval in days until next review
  easeFactor?: number; // SRS ease multiplier (default 2.5)
  nextReviewDate?: string; // ISO date string when review is due
}

export interface WeakSpotRecord {
  variantId: string;
  plyIndex: number;
  expectedMove: string;
  mistakeCount: number;
  lastFailed: string;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Visual intensity
}

export type BoardThemeId = 'sepia' | 'wood' | 'green' | 'blue';

export interface BoardThemeConfig {
  id: BoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
}

export type PieceSetId = 'standard' | 'neo' | 'alpha';
export type BlindfoldMode = 'off' | 'semi' | 'full';
export type TimerMode = 'off' | '10s' | '5s' | '3s';

export interface PositionEvaluation {
  score: number; // in pawns e.g. +0.45
  label: string; // "+0.5" or "-1.2"
  whitePercentage: number; // 0 to 100 for visual bar
  isMate?: boolean;
}

export type AppView = 'menu' | 'vienna-directory' | 'opening-directory' | 'changelog' | 'analytics' | 'campaign';
export type PlaylistMode = 'none' | 'rumble' | 'study' | 'srs' | 'weakspots';

export interface OpeningGroup {
  id: string;
  openingName: string;
  category: OpeningCategory;
  side: 'white' | 'black';
  description: string;
  variants: OpeningVariant[];
  masteredCount: number;
  totalVariants: number;
}

export interface CampaignLevel {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  variantId: string;
  isBoss?: boolean;
  bossDifficulty?: BotDifficulty;
  description: string;
}

export interface CampaignWorld {
  id: string;
  worldNumber: number;
  title: string;
  subtitle: string;
  description: string;
  theme: 'gold' | 'emerald' | 'sapphire';
  levels: CampaignLevel[];
}

export type BotDifficulty = 'casual' | 'intermediate' | 'master';

export type BoardArrow = [string, string, string?];

export interface StrategicPlan {
  title: string;
  keyIdea: string;
  pawnBreaks: string[];
  pieceGoals: string[];
  tacticalThemes: string[];
  recommendedArrows: BoardArrow[];
}

export type StarRating = 1 | 2 | 3;

export interface MoveFeedbackBadge {
  type: 'book' | 'key' | 'best' | 'mistake' | 'combo';
  text: string;
  subtext?: string;
}

export interface GamificationProfile {
  totalXp: number;
  level: number;
  title: string;
  nextLevelXp: number;
  currentLevelProgress: number; // 0 - 100%
  stars: Record<string, StarRating>;
  totalStars: number;
}


