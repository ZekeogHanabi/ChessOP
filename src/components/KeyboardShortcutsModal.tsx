import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '←', desc: 'Step backward (Undo move in variation)' },
    { key: '→', desc: 'Step forward (Redo move)' },
    { key: 'Space', desc: 'Restart variation / Reset sparring FEN' },
    { key: 'U', desc: 'Takeback move in Sparring Mode' },
    { key: 'H', desc: 'Get move hint (draws guide arrow)' },
    { key: 'M', desc: 'Toggle sound effects on / off' },
    { key: 'R-Click', desc: 'Circle square / Drag to draw arrows' },
    { key: 'Esc', desc: 'Return to main menu or exit sparring' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Keyboard size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
            <p className="text-xs text-neutral-400">Navigate and practice without leaving your keyboard</p>
          </div>
        </div>

        <div className="space-y-2.5 my-4">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800"
            >
              <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                {sc.desc}
              </span>
              <kbd className="px-2 py-1 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold rounded shadow-xs border border-neutral-200 dark:border-neutral-600">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
