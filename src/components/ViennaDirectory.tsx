import React from 'react';
import {
  ArrowLeft,
  Search,
  Zap,
  BookOpen,
  Compass,
  ChevronDown,
  CheckCircle2,
  Info,
  Play,
  Award
} from 'lucide-react';
import { OpeningVariant, UserProgress } from '../types';

interface Chapter {
  id: string;
  title: string;
  category: string;
  description: string;
  side: 'white' | 'black';
  variants: OpeningVariant[];
  chapterIndex?: number;
}

interface Props {
  popularChapters: Chapter[];
  unpopularChapters: Chapter[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedChapters: Record<string, boolean>;
  toggleChapterExpand: (chapterId: string) => void;
  userProgress: Record<string, UserProgress>;
  showUnpopularChapters: boolean;
  setShowUnpopularChapters: (show: boolean) => void;
  onStartVariant: (variant: OpeningVariant) => void;
  onStartRumbleChallenge: () => void;
  onStartStudyMainLines: () => void;
  onBackToMenu: () => void;
  viennaStats: {
    attempts: number;
    successes: number;
    mastered: number;
    total: number;
  };
}

export const ViennaDirectory: React.FC<Props> = ({
  popularChapters,
  unpopularChapters,
  searchQuery,
  setSearchQuery,
  expandedChapters,
  toggleChapterExpand,
  userProgress,
  showUnpopularChapters,
  setShowUnpopularChapters,
  onStartVariant,
  onStartRumbleChallenge,
  onStartStudyMainLines,
  onBackToMenu,
  viennaStats
}) => {
  const query = searchQuery.toLowerCase();

  const filteredPopular = popularChapters.filter(ch =>
    ch.title.toLowerCase().includes(query) ||
    ch.description.toLowerCase().includes(query)
  );

  const filteredUnpopular = unpopularChapters.filter(ch =>
    ch.title.toLowerCase().includes(query) ||
    ch.description.toLowerCase().includes(query)
  );

  const renderChapterCard = (chapter: Chapter) => {
    const totalSuccesses = chapter.variants.reduce((acc, v) => acc + (userProgress[v.id]?.successes || 0), 0);
    const masteredCount = chapter.variants.filter(v => (userProgress[v.id]?.successes || 0) > 0).length;
    const isAllMastered = masteredCount === chapter.variants.length;

    return (
      <div
        key={chapter.id}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 transition-all duration-200 shadow-xs flex flex-col justify-between hover:shadow-md relative overflow-hidden animate-fadeIn"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase">
                Chapter {chapter.chapterIndex} • Vienna Opening
              </span>
              <h4 className="text-base font-extrabold tracking-tight mt-0.5 leading-snug">
                {chapter.title}
              </h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
              chapter.side === 'white'
                ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                : 'bg-brand-dark text-white border border-brand-dark'
            }`}>
              {chapter.side === 'white' ? 'White' : 'Black'}
            </span>
          </div>
          
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[44px]">
            {chapter.description}
          </p>
        </div>

        {/* Chapter Action Details */}
        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {chapter.variants.length === 1 ? (
            /* Case A: Chapter only has 1 line */
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center space-x-2 text-[10px]">
                {userProgress[chapter.variants[0].id]?.demoCompleted ? (
                  <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 size={12} className="mr-0.5" /> Demo OK
                  </span>
                ) : (
                  <span className="text-neutral-450 font-medium flex items-center">
                    <Info size={12} className="mr-0.5" /> Demo Pending
                  </span>
                )}
                {totalSuccesses > 0 && (
                  <span className="text-brand-primary font-bold">
                    {totalSuccesses}x
                  </span>
                )}
              </div>

              <button
                onClick={() => onStartVariant(chapter.variants[0])}
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-xs flex items-center gap-1 cursor-pointer font-bold"
              >
                <Play size={12} className="fill-white" /> Train
              </button>
            </div>
          ) : (
            /* Case B: Chapter has multiple subvariations */
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-neutral-400 font-semibold">
                  {chapter.variants.length} variations • {masteredCount} / {chapter.variants.length} Mastered
                </span>
                {isAllMastered && (
                  <span className="text-green-600 dark:text-green-400 font-bold flex items-center">
                    <Award size={12} className="mr-0.5" /> Mastered!
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center gap-2 pt-1">
                <button
                  onClick={() => onStartVariant(chapter.variants[0])}
                  className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-xs flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Play size={12} className="fill-white" /> Train Main Line
                </button>
                
                <button
                  onClick={() => toggleChapterExpand(chapter.id)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>{expandedChapters[chapter.id] ? 'Hide' : 'Choose Line'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${expandedChapters[chapter.id] ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expanded Subvariations List */}
              {expandedChapters[chapter.id] && (
                <div className="space-y-2 mt-3 pt-3 border-t border-neutral-150 dark:border-neutral-800/80 animate-fadeIn">
                  {chapter.variants.map((variant) => {
                    const prog = userProgress[variant.id];
                    const isDemoDone = prog?.demoCompleted ?? false;
                    const successes = prog?.successes ?? 0;
                    return (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 transition-all text-[11px]"
                      >
                        <div className="space-y-0.5 pr-2 max-w-[70%]">
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                            {variant.name}
                          </div>
                          <div className="flex gap-2 text-[9px] text-neutral-450 dark:text-neutral-400">
                            <span>{variant.moves.length} plies</span>
                            {successes > 0 && <span className="text-brand-primary">{successes}x OK</span>}
                            {isDemoDone && <span className="text-green-600 dark:text-green-400">Demo OK</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => onStartVariant(variant)}
                          className="px-2 py-1 rounded bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                        >
                          <Play size={10} className="fill-white" /> Train
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Navigation and Title */}
      <div>
        <button
          onClick={onBackToMenu}
          className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer mb-3"
        >
          <ArrowLeft size={14} className="mr-1" />
          Back to Main Menu
        </button>
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Vienna Directory</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Explore, select, and practice all chapters and alternative subvariations parsed from the study.
              </p>
            </div>
            
            {/* Playlist Action Buttons */}
            <div className="flex gap-3 mt-2 md:mt-0 shrink-0">
              <button
                onClick={onStartRumbleChallenge}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 border border-brand-primary select-none"
                title="Train in a random survival checklist challenge"
              >
                <Zap size={14} className="fill-white animate-pulse" />
                Rumble Challenge
              </button>
              
              <button
                onClick={onStartStudyMainLines}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:border-brand-primary/45 dark:hover:border-brand-primary/30 transition-all font-bold text-xs shadow-xs active:scale-[0.98] cursor-pointer flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 select-none"
                title="Study the critical Main Lines of all 11 popular chapters sequentially"
              >
                <BookOpen size={14} />
                Study Main Lines
              </button>
            </div>
          </div>

          {/* Vienna Specific Stats Banner */}
          <div className="flex gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-lg text-xs font-medium shadow-xs">
            <div>
              <span className="text-neutral-450 font-semibold block">Vienna Attempts</span>
              <span className="text-sm font-black">{viennaStats.attempts}</span>
            </div>
            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <span className="text-neutral-450 font-semibold block">Vienna Successes</span>
              <span className="text-sm font-black">{viennaStats.successes}</span>
            </div>
            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <span className="text-brand-primary font-semibold block">Mastered Variations</span>
              <span className="text-sm font-black text-brand-primary">{viennaStats.mastered} / {viennaStats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
        <input
          type="text"
          placeholder="Search Vienna chapters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-brand-dark dark:text-brand-secondary placeholder-neutral-400"
        />
      </div>

      {/* Grid of Selectable Chapter Cards (Popular ones) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPopular.length > 0 ? (
          filteredPopular.map((chapter) => renderChapterCard(chapter))
        ) : searchQuery && filteredUnpopular.length === 0 ? (
          <div className="col-span-full text-center py-16 text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl animate-fadeIn">
            <Compass className="mx-auto text-neutral-350 mb-3 animate-pulse" size={36} />
            <p className="text-sm font-medium">No chapters found matching your search</p>
          </div>
        ) : null}
      </div>

      {/* Unpopular Chapters Collapsible Section */}
      {filteredUnpopular.length > 0 && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/80 mt-12 space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() => setShowUnpopularChapters(!showUnpopularChapters)}
              className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:border-brand-primary/40 dark:hover:border-brand-primary/30 transition-all font-bold text-xs shadow-xs cursor-pointer flex items-center gap-2 select-none active:scale-[0.98] text-neutral-500 dark:text-neutral-400"
            >
              <span>{showUnpopularChapters ? 'Hide not so popular variations' : 'Not so popular variations'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showUnpopularChapters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {(showUnpopularChapters || searchQuery) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredUnpopular.map((chapter) => renderChapterCard(chapter))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
