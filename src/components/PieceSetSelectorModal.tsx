import React from 'react';
import { X, Check, EyeOff, Layers } from 'lucide-react';
import { PieceSetId, BlindfoldMode } from '../types';
import { PIECE_SETS, BLINDFOLD_MODES } from '../utils/pieceSets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPieceSet: PieceSetId;
  onSelectPieceSet: (id: PieceSetId) => void;
  currentBlindfold: BlindfoldMode;
  onSelectBlindfold: (mode: BlindfoldMode) => void;
}

export const PieceSetSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPieceSet,
  onSelectPieceSet,
  currentBlindfold,
  onSelectBlindfold
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-1">Board & Piece Customization</h3>
        <p className="text-xs text-neutral-400 mb-5">Adjust piece visual styles and spatial visualization modes</p>

        {/* 1. Piece Set Selection */}
        <div className="mb-6 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            <Layers size={14} className="text-brand-primary" />
            <span>Piece Set Style</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PIECE_SETS.map(set => {
              const isSelected = currentPieceSet === set.id;
              return (
                <button
                  key={set.id}
                  onClick={() => onSelectPieceSet(set.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{set.name}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{set.description}</p>
                  </div>
                  {isSelected && <Check size={16} className="text-brand-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Blindfold Visualization Mode */}
        <div className="mb-6 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            <EyeOff size={14} className="text-brand-primary" />
            <span>Blindfold Visualization</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {BLINDFOLD_MODES.map(mode => {
              const isSelected = currentBlindfold === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectBlindfold(mode.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{mode.name}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{mode.description}</p>
                  </div>
                  {isSelected && <Check size={16} className="text-brand-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
