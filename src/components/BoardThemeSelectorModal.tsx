import React from 'react';
import { X, Check } from 'lucide-react';
import { BoardThemeId } from '../types';
import { BOARD_THEMES } from '../utils/boardThemes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BoardThemeId;
  onSelectTheme: (id: BoardThemeId) => void;
}

export const BoardThemeSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  const themes = Object.values(BOARD_THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-1">Chessboard Theme</h3>
        <p className="text-xs text-neutral-400 mb-4">Choose your preferred board color palette</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {themes.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700'
                }`}
              >
                {/* 2x2 miniature board preview */}
                <div className="w-full aspect-2/1 grid grid-cols-4 rounded-md overflow-hidden shadow-xs mb-2 border border-black/10">
                  <div style={{ backgroundColor: t.lightSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.lightSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.lightSquare }} />
                  <div style={{ backgroundColor: t.darkSquare }} />
                  <div style={{ backgroundColor: t.lightSquare }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{t.name}</span>
                  {isSelected && <Check size={14} className="text-brand-primary shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
