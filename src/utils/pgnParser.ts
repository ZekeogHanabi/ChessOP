import { Chess } from 'chess.js';
import { OpeningVariant, MoveNode } from '../types';

export interface PgnHeaders {
  [key: string]: string;
}

export interface ParsedPgnGame {
  headers: PgnHeaders;
  movesText: string;
}

/**
 * Splits PGN string into individual game/chapter blocks.
 */
export const parsePgnFile = (pgnString: string): ParsedPgnGame[] => {
  const games: ParsedPgnGame[] = [];
  // Split games by standard PGN event header block
  const gameStrings = pgnString.split(/\n(?=\[Event )/g);

  for (const gameStr of gameStrings) {
    if (!gameStr.trim()) continue;

    const headers: PgnHeaders = {};
    const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
    let match;
    while ((match = headerRegex.exec(gameStr)) !== null) {
      headers[match[1]] = match[2];
    }

    // Extract moves text (everything after headers)
    const movesText = gameStr.replace(/\[[^\]]*\]/g, '').trim();
    if (movesText) {
      games.push({ headers, movesText });
    }
  }

  return games;
};

/**
 * Recursive backtracking parser to extract all unique branches/subvariations (RAVs).
 */
export const parsePgnToLines = (movesText: string): MoveNode[][] => {
  // 1. Remove Lichess eval and graphical tags like [%eval 0.25] or [%cal Ga2a3]
  const cleanText = movesText.replace(/\[%[^\]]*\]/g, '');
  
  const lines: MoveNode[][] = [];
  
  const recurse = (text: string, currentPath: MoveNode[], tempChess: Chess) => {
    let index = 0;
    const tokens = text.match(/(\(|\)|\{[^}]*\}|\d+\.+\s*|[a-zA-Z0-9#+=x-]+)/g) || [];
    
    const localChess = new Chess(tempChess.fen());
    const localPath = [...currentPath];
    
    while (index < tokens.length) {
      const token = tokens[index].trim();
      index++;
      
      if (!token || /^\d+\.+/.test(token) || token === '*' || token === '1-0' || token === '0-1' || token === '1/2-1/2') {
        continue;
      }
      
      if (token.startsWith('{')) {
        // Comment for the last move
        const comment = token.slice(1, -1).trim();
        if (localPath.length > 0 && comment) {
          localPath[localPath.length - 1].comment = comment;
        }
        continue;
      }
      
      if (token === '(') {
        // A branch starts! Find matching closing parenthesis
        let depth = 1;
        const branchStart = index;
        while (index < tokens.length && depth > 0) {
          if (tokens[index].trim() === '(') depth++;
          if (tokens[index].trim() === ')') depth--;
          index++;
        }
        
        const branchTokens = tokens.slice(branchStart, index - 1);
        const branchText = branchTokens.join(' ');
        
        // The branch is an alternative to the LAST move in localPath
        if (localPath.length > 0) {
          const parentPath = localPath.slice(0, -1);
          const parentChess = new Chess();
          for (const m of parentPath) {
            parentChess.move({ from: m.from, to: m.to, promotion: 'q' });
          }
          
          recurse(branchText, parentPath, parentChess);
        }
        continue;
      }
      
      if (token === ')') {
        continue;
      }
      
      // Standard move token
      try {
        const move = localChess.move(token);
        if (move) {
          let comment: string | undefined = undefined;
          if (index < tokens.length && tokens[index].trim().startsWith('{')) {
            comment = tokens[index].trim().slice(1, -1).trim();
            index++;
          }
          
          localPath.push({
            from: move.from,
            to: move.to,
            notation: move.san,
            comment: comment || undefined
          });
        }
      } catch (err) {
        console.warn(`Skipping invalid move token "${token}":`, err);
        break;
      }
    }
    
    if (localPath.length > 0) {
      lines.push(localPath);
    }
  };
  
  recurse(cleanText, [], new Chess());
  return lines;
};

/**
 * Converts a parsed PGN game block to OpeningVariant array (extracting all unique paths).
 */
export const convertPgnToVariants = (
  chapterIndex: number,
  game: ParsedPgnGame,
  options?: { openingName?: string; isCustom?: boolean; idPrefix?: string }
): OpeningVariant[] => {
  const event = game.headers['Event'] || game.headers['ChapterName'] || `Chapter ${chapterIndex}`;
  const side = (game.headers['Side'] || 'white').toLowerCase() as 'white' | 'black';
  const description = game.headers['Description'] || `Practice the ${event}.`;
  const openingName = options?.openingName || 'Vienna Repertoire';
  const idPrefix = options?.idPrefix || 'vienna-pgn';
  const isCustom = options?.isCustom || false;

  const lines = parsePgnToLines(game.movesText);
  const variants: OpeningVariant[] = [];

  lines.forEach((moves, lineIndex) => {
    if (moves.length === 0) return;

    let variantName = event;
    if (lines.length > 1) {
      if (lineIndex === 0) {
        variantName = `Main Line`;
      } else {
        const lastMove = moves[moves.length - 1];
        variantName = `var. ${lastMove.notation}`;
      }
    } else {
      variantName = `Main Line`;
    }

    variants.push({
      id: `${idPrefix}-ch${chapterIndex}-line${lineIndex}`,
      openingName,
      name: variantName,
      description,
      side,
      moves,
      chapterName: event,
      chapterIndex,
      isCustom
    });
  });

  return variants;
};

/**
 * Converts any user-uploaded or pasted PGN string into a list of OpeningVariants.
 */
export const parseCustomPgnString = (
  pgnText: string,
  repertoireName: string = 'Custom Repertoire'
): OpeningVariant[] => {
  const games = parsePgnFile(pgnText);
  const parsedVariants: OpeningVariant[] = [];
  const safeIdPrefix = `custom-${repertoireName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

  games.forEach((gameBlock, index) => {
    const vars = convertPgnToVariants(index + 1, gameBlock, {
      openingName: repertoireName,
      isCustom: true,
      idPrefix: safeIdPrefix
    });
    parsedVariants.push(...vars);
  });

  return parsedVariants;
};
