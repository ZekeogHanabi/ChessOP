import React from 'react';
import { GitBranch, Play, CheckCircle2 } from 'lucide-react';
import { OpeningVariant, UserProgress } from '../types';

interface Props {
  currentVariant: OpeningVariant;
  currentIndex: number;
  allVariants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  onSelectVariant: (variant: OpeningVariant) => void;
}

export const BranchExplorer: React.FC<Props> = ({
  currentVariant,
  currentIndex,
  allVariants,
  userProgress,
  onSelectVariant
}) => {
  // Find all sibling variants in the same chapter or opening
  const siblingVariants = allVariants.filter(
    v => (v.chapterName && v.chapterName === currentVariant.chapterName) ||
         (v.openingName === currentVariant.openingName)
  );

  if (siblingVariants.length <= 1) return null;

  // 1. Identify variations that match our current path up to currentIndex
  const activeBranches = siblingVariants.filter(v => {
    if (v.id === currentVariant.id) return false;
    if (v.moves.length <= currentIndex) return false;

    // Must match all moves up to current index
    for (let i = 0; i < currentIndex; i++) {
      if (
        v.moves[i].from !== currentVariant.moves[i].from ||
        v.moves[i].to !== currentVariant.moves[i].to
      ) {
        return false;
      }
    }
    return true;
  });

  // 2. Identify other alternative lines in the chapter that diverged earlier
  const otherLinesInChapter = siblingVariants.filter(
    v => v.id !== currentVariant.id && !activeBranches.some(b => b.id === v.id)
  );

  return (
    <div className="w-full max-w-[775px] mt-4 bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs animate-fadeIn">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-brand-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            Repertoire Branch Explorer
          </h4>
        </div>
        <span className="text-[10px] text-neutral-400 font-semibold">
          {siblingVariants.length} lines in this chapter
        </span>
      </div>

      {/* Immediate Alternative Moves at this exact position */}
      {activeBranches.length > 0 ? (
        <div className="space-y-2 mb-3">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide block">
            🌿 Divergent theoretical branches from this move:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeBranches.map(branch => {
              const divergentMove = branch.moves[currentIndex];
              const prog = userProgress[branch.id];
              const isMastered = (prog?.successes || 0) > 0;

              return (
                <button
                  key={branch.id}
                  onClick={() => onSelectVariant(branch)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 transition-all text-left cursor-pointer group"
                >
                  <div className="pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-brand-primary text-white font-mono font-bold text-[10px]">
                        {divergentMove?.notation || 'Line'}
                      </span>
                      <span className="text-xs font-bold text-brand-dark dark:text-brand-secondary group-hover:text-brand-primary transition-colors truncate max-w-[140px]">
                        {branch.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {branch.moves.length} moves • {branch.moves.length - currentIndex} ahead
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isMastered && <CheckCircle2 size={12} className="text-green-500" />}
                    <Play size={12} className="text-brand-primary group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-neutral-400 py-1 italic mb-2">
          Currently playing the principal line for this branch.
        </div>
      )}

      {/* Other Lines in this Chapter */}
      {otherLinesInChapter.length > 0 && (
        <details className="text-[11px] pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <summary className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer select-none py-1">
            Other subvariations in {currentVariant.chapterName || 'chapter'} ({otherLinesInChapter.length})
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
            {otherLinesInChapter.map(line => (
              <button
                key={line.id}
                onClick={() => onSelectVariant(line)}
                className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold truncate max-w-[180px]">
                  {line.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {line.moves.length}p
                </span>
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
