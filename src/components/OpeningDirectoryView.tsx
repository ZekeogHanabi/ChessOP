import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  CheckCircle2,
  Info,
  Play,
  Star,
  Shuffle,
  FolderOpen
} from 'lucide-react';
import { OpeningVariant, UserProgress, GamificationProfile } from '../types';
import { getOpeningMetadata } from '../data/openings/metadata';

interface Props {
  openingName: string;
  variants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  gamificationProfile?: GamificationProfile;
  onStartVariant: (variant: OpeningVariant, isDemo?: boolean) => void;
  onBackToMenu: () => void;
}

export const OpeningDirectoryView: React.FC<Props> = ({
  openingName,
  variants,
  userProgress,
  gamificationProfile,
  onStartVariant,
  onBackToMenu
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const metadata = useMemo(() => {
    return getOpeningMetadata(openingName, variants[0]);
  }, [openingName, variants]);

  const filteredVariants = useMemo(() => {
    if (!searchQuery.trim()) return variants;
    const query = searchQuery.toLowerCase();
    return variants.filter(v =>
      v.name.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query)
    );
  }, [variants, searchQuery]);

  const stats = useMemo(() => {
    let completed = 0;
    let mastered = 0;
    let stars = 0;

    variants.forEach(v => {
      const p = userProgress[v.id];
      if (p && p.successes > 0) {
        completed += p.successes;
        mastered += 1;
      }
      if (gamificationProfile?.stars[v.id]) {
        stars += gamificationProfile.stars[v.id];
      }
    });

    return { completed, mastered, total: variants.length, stars };
  }, [variants, userProgress, gamificationProfile]);

  const handleStartRandom = () => {
    if (variants.length === 0) return;
    const randomIndex = Math.floor(Math.random() * variants.length);
    onStartVariant(variants[randomIndex], false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-primary/40 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Openings</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <FolderOpen size={14} className="text-brand-primary" />
          <span>{metadata.category}</span>
        </div>
      </div>

      {/* Opening Folder Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-brand-primary/5 rounded-full -mr-10 -mt-10 pointer-events-none blur-xl" />

        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary">
              Repertoire Folder
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
              metadata.side === 'white'
                ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                : 'bg-brand-dark text-white border border-brand-dark'
            }`}>
              Plays as {metadata.side === 'white' ? 'White' : 'Black'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800">
              {variants.length} {variants.length === 1 ? 'Variation' : 'Variations'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
            {openingName}
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed">
            {metadata.description}
          </p>
        </div>

        {/* Stats & Quick Actions Panel */}
        <div className="md:border-l border-neutral-200 dark:border-neutral-800 md:pl-8 min-w-[240px] flex flex-col justify-between gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Lines</span>
              <span className="text-lg font-black text-neutral-900 dark:text-neutral-100">{variants.length}</span>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Mastered</span>
              <span className="text-lg font-black text-brand-primary">
                {stats.mastered} / {stats.total}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Stars</span>
              <span className="text-lg font-black text-amber-500 flex items-center gap-0.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {stats.stars}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleStartRandom}
              className="w-full py-2 px-3 rounded-xl bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shuffle size={13} />
              <span>Practice Random Line</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <BookOpen size={16} className="text-brand-primary" />
          <span>Available Variations ({filteredVariants.length})</span>
        </h3>

        {variants.length > 2 && (
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search variation..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-hidden focus:border-brand-primary"
            />
          </div>
        )}
      </div>

      {/* Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVariants.map((variant, index) => {
          const progress = userProgress[variant.id];
          const hasCompletedDemo = progress?.demoCompleted ?? false;
          const practiceCount = progress?.successes ?? 0;
          const userStars = gamificationProfile?.stars[variant.id] || 0;

          // Generate move chips summary (up to first 6 moves)
          const movesPreview = variant.moves
            .slice(0, 8)
            .map((m, i) => `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''}${m.notation}`)
            .join(' ');

          return (
            <div
              key={variant.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 rounded-xl p-5 md:p-6 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Line {index + 1} • {variant.moves.length} plies
                    </span>
                    <h4 className="text-base font-extrabold tracking-tight mt-0.5 text-neutral-900 dark:text-neutral-100">
                      {variant.name}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    variant.side === 'white'
                      ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                      : 'bg-brand-dark text-white border border-brand-dark'
                  }`}>
                    {variant.side === 'white' ? 'White' : 'Black'}
                  </span>
                </div>

                {/* Move Sequence Preview */}
                <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400 overflow-x-auto whitespace-nowrap scrollbar-none border border-neutral-100 dark:border-neutral-800">
                  {movesPreview}
                  {variant.moves.length > 8 && ' ...'}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[36px]">
                  {variant.description}
                </p>
              </div>

              {/* Action & Mastery Footer */}
              <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center gap-3">
                <div className="flex items-center space-x-2 text-xs">
                  {hasCompletedDemo ? (
                    <span className="flex items-center text-green-600 dark:text-green-400 font-semibold text-[11px]">
                      <CheckCircle2 size={13} className="mr-1" /> Demo OK
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-medium flex items-center text-[11px]">
                      <Info size={13} className="mr-1" /> Demo Pending
                    </span>
                  )}

                  {userStars > 0 && (
                    <div className="flex items-center gap-0.5" title={`${userStars} Stars`}>
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          size={11}
                          className={s <= userStars ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}
                        />
                      ))}
                    </div>
                  )}

                  {practiceCount > 0 && userStars === 0 && (
                    <span className="text-brand-primary font-bold text-[11px]">
                      {practiceCount}x OK
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStartVariant(variant, true)}
                    className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
                    title="Learn theory with guided arrows"
                  >
                    Learn
                  </button>

                  <button
                    onClick={() => onStartVariant(variant, false)}
                    className="px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={11} className="fill-white" />
                    <span>Train</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
