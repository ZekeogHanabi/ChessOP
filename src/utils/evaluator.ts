import { Chess } from 'chess.js';
import { PositionEvaluation } from '../types';

/**
 * Lightweight Offline Position Evaluator
 * Based on PeSTO's Piece-Square Tables (PST) and Material Imbalance.
 * Runs instantly in pure TypeScript without any network requests or heavy WASM.
 */

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Simplified piece square tables (from White's perspective, rank 8 to rank 1)
const PAWN_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

const getTableValue = (type: string, squareIndex: number, isWhite: boolean): number => {
  // Mirror square vertically for black pieces
  const idx = isWhite ? squareIndex : (7 - Math.floor(squareIndex / 8)) * 8 + (squareIndex % 8);
  
  switch (type) {
    case 'p': return PAWN_TABLE[idx] || 0;
    case 'n': return KNIGHT_TABLE[idx] || 0;
    case 'b': return BISHOP_TABLE[idx] || 0;
    case 'r': return ROOK_TABLE[idx] || 0;
    case 'q': return QUEEN_TABLE[idx] || 0;
    case 'k': return KING_TABLE[idx] || 0;
    default: return 0;
  }
};

/**
 * Evaluates the board position from White's perspective.
 */
export const evaluatePosition = (game: Chess): PositionEvaluation => {
  if (game.isCheckmate()) {
    const isWhiteTurn = game.turn() === 'w';
    return {
      score: isWhiteTurn ? -100 : 100,
      label: isWhiteTurn ? '#-0' : '#+0',
      whitePercentage: isWhiteTurn ? 0 : 100,
      isMate: true
    };
  }

  if (game.isDraw()) {
    return {
      score: 0,
      label: '0.0',
      whitePercentage: 50
    };
  }

  const board = game.board();
  let centipawns = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const squareIndex = r * 8 + c;
      const isWhite = piece.color === 'w';
      const val = (PIECE_VALUES[piece.type] || 0) + getTableValue(piece.type, squareIndex, isWhite);

      if (isWhite) {
        centipawns += val;
      } else {
        centipawns -= val;
      }
    }
  }

  // Convert centipawns to pawns
  const scoreInPawns = centipawns / 100;
  
  // Format label: e.g. "+0.3" or "-0.8" or "0.0"
  let label = scoreInPawns > 0 ? `+${scoreInPawns.toFixed(1)}` : scoreInPawns.toFixed(1);
  if (Math.abs(scoreInPawns) < 0.05) {
    label = '0.0';
  }

  // Smooth sigmoid mapping to 0% - 100% white win-rate
  // Standard Lichess formula: 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
  const whitePercentage = Math.round(
    Math.min(98, Math.max(2, 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1)))
  );

  return {
    score: scoreInPawns,
    label,
    whitePercentage
  };
};
