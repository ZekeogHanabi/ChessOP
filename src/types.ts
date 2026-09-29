export interface MoveNode {
  from: string; // Source square, e.g., "e2"
  to: string;   // Target square, e.g., "e4"
  notation: string; // Algebraic notation, e.g., "e4", "Nf3", "c5"
  comment?: string; // Optional educational strategic comment
}

export interface OpeningVariant {
  id: string;
  name: string; // User-friendly name, e.g., "Najdorf Variation"
  openingName: string; // Main opening name, e.g., "Sicilian Defense"
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

export type BoardThemeId = 'sepia' | 'wood' | 'green' | 'blue';

export interface BoardThemeConfig {
  id: BoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
}

export type AppView = 'menu' | 'vienna-directory' | 'changelog';
export type PlaylistMode = 'none' | 'rumble' | 'study' | 'srs';
