import { Chess, Move } from 'chess.js';
import { BotDifficulty } from '../types';
import { evaluatePositionRawCentipawns } from './evaluator';

const PIECE_WEIGHTS: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

/**
  * Score moves for Alpha-Beta move ordering (MVV-LVA)
  */
const getMoveOrderScore = (move: Move, game: Chess): number => {
  let score = 0;
  
  if (move.captured) {
    const victimVal = PIECE_WEIGHTS[move.captured] || 0;
    const attackerVal = PIECE_WEIGHTS[move.piece] || 0;
    score += 1000 + (victimVal - attackerVal * 0.1);
  }

  if (move.promotion) {
    score += 900;
  }

  // Quick check bonus
  game.move(move);
  if (game.inCheck()) {
    score += 300;
  }
  game.undo();

  return score;
};

/**
 * Minimax with Alpha-Beta Pruning
 */
const minimax = (
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePositionRawCentipawns(game);
  }

  const rawMoves = game.moves({ verbose: true });
  // Order moves for faster alpha-beta cutoffs
  rawMoves.sort((a, b) => getMoveOrderScore(b, game) - getMoveOrderScore(a, game));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of rawMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of rawMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

/**
 * Find best move using Minimax with Alpha-Beta pruning tailored for the selected bot difficulty.
 */
export const findBotMove = (game: Chess, difficulty: BotDifficulty): Move | null => {
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const isWhite = game.turn() === 'w';

  // Evaluate all root moves
  const depth = difficulty === 'casual' ? 1 : difficulty === 'intermediate' ? 2 : 3;

  const scoredMoves: { move: Move; score: number }[] = [];

  for (const move of legalMoves) {
    game.move(move);
    const score = minimax(
      game,
      depth - 1,
      -Infinity,
      Infinity,
      !isWhite // Next turn is opposite
    );
    game.undo();
    scoredMoves.push({ move, score });
  }

  // Sort moves: if White, highest score is best; if Black, lowest score is best
  scoredMoves.sort((a, b) => (isWhite ? b.score - a.score : a.score - b.score));

  if (difficulty === 'casual') {
    // Top 3 moves with probabilistic selection to emulate friendly human club play
    const candidateMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
    const roll = Math.random();
    if (roll < 0.55 || candidateMoves.length === 1) {
      return candidateMoves[0].move;
    } else if (roll < 0.85 && candidateMoves.length >= 2) {
      return candidateMoves[1].move;
    } else {
      return candidateMoves[candidateMoves.length - 1].move;
    }
  }

  if (difficulty === 'intermediate') {
    // 85% pick top move, 15% pick 2nd if close in score
    if (scoredMoves.length > 1 && Math.random() > 0.85) {
      const diff = Math.abs(scoredMoves[0].score - scoredMoves[1].score);
      if (diff < 150) {
        return scoredMoves[1].move;
      }
    }
    return scoredMoves[0].move;
  }

  // Master difficulty: always pick best move
  return scoredMoves[0].move;
};
