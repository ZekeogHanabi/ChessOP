import { BoardThemeConfig, BoardThemeId } from '../types';

export const BOARD_THEMES: Record<BoardThemeId, BoardThemeConfig> = {
  green: {
    id: 'green',
    name: 'Lichess Green',
    lightSquare: '#ececd7',
    darkSquare: '#739552'
  },
  sepia: {
    id: 'sepia',
    name: 'Warm Earth / Sepia',
    lightSquare: '#f3ede2',
    darkSquare: '#9c7a6b'
  },
  wood: {
    id: 'wood',
    name: 'Natural Wood',
    lightSquare: '#eed8be',
    darkSquare: '#a67246'
  },
  blue: {
    id: 'blue',
    name: 'Classic Blue',
    lightSquare: '#e5e9ec',
    darkSquare: '#7d95a5'
  }
};
