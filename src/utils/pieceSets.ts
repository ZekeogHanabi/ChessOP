import React from 'react';
import { PieceSetId, BlindfoldMode } from '../types';

export const PIECE_SETS: { id: PieceSetId; name: string; description: string }[] = [
  { id: 'standard', name: 'Classic Tournament', description: 'Standard high-contrast tournament pieces' },
  { id: 'neo', name: 'Neo Modern', description: 'Contemporary pieces with smooth curves and depth' },
  { id: 'alpha', name: 'Alpha Diagram', description: 'Clean book & diagram illustration style' }
];

export const BLINDFOLD_MODES: { id: BlindfoldMode; name: string; description: string }[] = [
  { id: 'off', name: 'Normal (Visible)', description: 'All pieces clearly visible on the board' },
  { id: 'semi', name: 'Semi-Blindfold', description: 'Hide only your pieces to test spatial memory' },
  { id: 'full', name: 'Full Blindfold', description: 'All pieces hidden—visualize everything in your mind' }
];

const PIECE_KEYS = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'] as const;

/**
 * Builds customPieces object for react-chessboard based on piece set and blindfold mode.
 */
export const getCustomPieces = (
  pieceSet: PieceSetId,
  blindfold: BlindfoldMode,
  playerSide: 'white' | 'black'
): Record<string, (args: { squareWidth: number }) => React.ReactElement> | undefined => {
  if (blindfold === 'off' && pieceSet === 'standard') {
    return undefined; // Use default optimized react-chessboard pieces
  }

  const customPieces: Record<string, (args: { squareWidth: number }) => React.ReactElement> = {};

  PIECE_KEYS.forEach((key) => {
    const isWhite = key.startsWith('w');
    const isPlayerPiece = playerSide === 'white' ? isWhite : !isWhite;

    // 1. Blindfold handling
    if (blindfold === 'full' || (blindfold === 'semi' && isPlayerPiece)) {
      customPieces[key] = () => (
        React.createElement('div', {
          style: { width: '100%', height: '100%', opacity: 0 }
        })
      );
      return;
    }

    // 2. Custom styling for Alpha or Neo if chosen
    // (If standard, we let react-chessboard default render it if not blindfolded)
  });

  return Object.keys(customPieces).length > 0 ? customPieces : undefined;
};
