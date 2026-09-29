import React from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Palette,
  Upload,
  Keyboard,
  Layers,
  BarChart3
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenThemeModal: () => void;
  onOpenPieceModal: () => void;
  onOpenImportModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenAnalytics: () => void;
  onResetToMenu: () => void;
}

export const Header: React.FC<Props> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onOpenThemeModal,
  onOpenPieceModal,
  onOpenImportModal,
  onOpenShortcutsModal,
  onOpenAnalytics,
  onResetToMenu
}) => {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 py-3.5 px-6 md:px-12 flex justify-between items-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-30">
      {/* Brand logo & title */}
      <div
        className="flex items-center space-x-3 cursor-pointer select-none"
        onClick={onResetToMenu}
      >
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
          C
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ChessOp</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Opening Repertoire Trainer</p>
        </div>
      </div>

      {/* Toolbar actions */}
      <div className="flex items-center space-x-1.5 md:space-x-2">
        {/* Learning Analytics & Weak Spots */}
        <button
          onClick={onOpenAnalytics}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Learning Analytics & Weak Spots"
          aria-label="Learning Analytics"
        >
          <BarChart3 size={17} />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute Sound (Hotkey: M)' : 'Enable Sound (Hotkey: M)'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} className="text-neutral-400" />}
        </button>

        {/* Board Theme Selector */}
        <button
          onClick={onOpenThemeModal}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Change Board Color Palette"
          aria-label="Change Board Colors"
        >
          <Palette size={17} />
        </button>

        {/* Piece Set & Blindfold Selector */}
        <button
          onClick={onOpenPieceModal}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Piece Sets & Blindfold Visualization"
          aria-label="Piece Sets and Blindfold"
        >
          <Layers size={17} />
        </button>

        {/* Custom PGN Import */}
        <button
          onClick={onOpenImportModal}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Import Custom PGN / Study"
          aria-label="Import Custom PGN"
        >
          <Upload size={17} />
        </button>

        {/* Keyboard Shortcuts Dialog */}
        <button
          onClick={onOpenShortcutsModal}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Keyboard Shortcuts (Hotkey: ?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={17} />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          title="Toggle Light / Dark Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com/ZekeogHanabi/ChessOP"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          title="GitHub Repository"
          aria-label="GitHub Repository"
        >
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </a>
      </div>
    </header>
  );
};
