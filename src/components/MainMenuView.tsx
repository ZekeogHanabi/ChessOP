import React, { useRef, useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  Play,
  RotateCcw,
  Download,
  UploadCloud,
  Brain,
  Trash2,
  Sparkles,
  BarChart3,
  Star,
  Map,
  Layers,
  Folder,
  FolderOpen
} from 'lucide-react';
import { OpeningVariant, UserProgress, GamificationProfile, OpeningGroup } from '../types';
import { getOpeningMetadata } from '../data/openings/metadata';

export const OPENING_CATEGORIES = [
  { id: 'all', label: 'All Openings' },
  { id: '1.e4 Open Games', label: '1.e4 Open Games' },
  { id: '1.e4 Asymmetric Defenses', label: '1.e4 Asymmetric Defenses' },
  { id: '1.d4 Systems & Classical', label: '1.d4 Systems & Classical' },
  { id: 'Gambits & Tactical Attacks', label: 'Gambits & Tactical Attacks' },
] as const;

interface Chapter {
  id: string;
  title: string;
  category: string;
  description: string;
  side: 'white' | 'black';
  variants: OpeningVariant[];
}

interface Props {
  defaultChapters: Chapter[];
  defaultVariants?: OpeningVariant[];
  viennaVariants: OpeningVariant[];
  customVariants: OpeningVariant[];
  dueVariants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  totalAttempts: number;
  totalSuccesses: number;
  masteredOpenings: number;
  viennaMastered: number;
  gamificationProfile?: GamificationProfile;
  onStartVariant: (variant: OpeningVariant) => void;
  onOpenViennaDirectory: () => void;
  onOpenOpeningDirectory: (openingName: string) => void;
  onStartSrsReview: () => void;
  onOpenAnalytics: () => void;
  onOpenCampaign?: () => void;
  onDeleteCustomRepertoire: (openingName: string) => void;
  onExportProgress: () => void;
  onImportProgress: (jsonString: string) => void;
  onResetProgress: () => void;
}

export const MainMenuView: React.FC<Props> = ({
  defaultChapters,
  defaultVariants,
  viennaVariants,
  customVariants,
  dueVariants,
  userProgress,
  totalAttempts,
  totalSuccesses,
  masteredOpenings,
  viennaMastered,
  gamificationProfile,
  onStartVariant,
  onOpenViennaDirectory,
  onOpenOpeningDirectory,
  onStartSrsReview,
  onOpenAnalytics,
  onOpenCampaign,
  onDeleteCustomRepertoire,
  onExportProgress,
  onImportProgress,
  onResetProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group custom variants by openingName
  const customGroups = customVariants.reduce((acc, v) => {
    const name = v.openingName || 'Custom Repertoire';
    if (!acc[name]) acc[name] = [];
    acc[name].push(v);
    return acc;
  }, {} as Record<string, OpeningVariant[]>);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportProgress(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Group standard variants by openingName into Repertoire Folders
  const openingGroups = useMemo(() => {
    const rawVariants = defaultVariants && defaultVariants.length > 0
      ? defaultVariants
      : defaultChapters.flatMap(c => c.variants);

    const map: Record<string, OpeningVariant[]> = {};
    rawVariants.forEach(v => {
      const key = v.openingName;
      if (!map[key]) map[key] = [];
      map[key].push(v);
    });

    const groups: (OpeningGroup & { totalStars: number })[] = Object.entries(map).map(([name, vars]) => {
      const meta = getOpeningMetadata(name, vars[0]);
      const masteredCount = vars.filter(v => (userProgress[v.id]?.successes || 0) > 0).length;
      let totalStars = 0;
      vars.forEach(v => {
        totalStars += gamificationProfile?.stars[v.id] || 0;
      });

      return {
        id: vars[0].id.split('-')[0] || name.toLowerCase().replace(/\s+/g, '-'),
        openingName: name,
        category: meta.category,
        side: meta.side,
        description: meta.description,
        variants: vars,
        masteredCount,
        totalVariants: vars.length,
        totalStars
      };
    });

    // Also include Vienna Game as a standard Repertoire Folder!
    if (viennaVariants.length > 0) {
      const viennaMeta = getOpeningMetadata('Vienna Game', viennaVariants[0]);
      let viennaStars = 0;
      viennaVariants.forEach(v => {
        viennaStars += gamificationProfile?.stars[v.id] || 0;
      });

      groups.push({
        id: 'vienna-game',
        openingName: 'Vienna Game',
        category: '1.e4 Open Games',
        side: 'white',
        description: viennaMeta.description,
        variants: viennaVariants,
        masteredCount: viennaMastered,
        totalVariants: viennaVariants.length,
        totalStars: viennaStars
      });
    }

    return groups;
  }, [defaultVariants, defaultChapters, viennaVariants, viennaMastered, userProgress, gamificationProfile]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryCounts = useMemo(() => {
    return {
      all: openingGroups.length,
      '1.e4 Open Games': openingGroups.filter(g => g.category === '1.e4 Open Games').length,
      '1.e4 Asymmetric Defenses': openingGroups.filter(g => g.category === '1.e4 Asymmetric Defenses').length,
      '1.d4 Systems & Classical': openingGroups.filter(g => g.category === '1.d4 Systems & Classical').length,
      'Gambits & Tactical Attacks': openingGroups.filter(g => g.category === 'Gambits & Tactical Attacks').length,
    };
  }, [openingGroups]);

  const filteredOpeningGroups = useMemo(() => {
    if (selectedCategory === 'all') return openingGroups;
    return openingGroups.filter(g => g.category === selectedCategory);
  }, [openingGroups, selectedCategory]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome Banner / Global Stats */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
            Active Recall & Spaced Repetition
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Master Your Chess Openings</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
            ChessOp trains your opening repertoires through tactile recall and memory retention.
            Learn theory with guided visual cues, then practice completely from memory.
          </p>
        </div>

        {/* Quick Stats Panel */}
        <div className="md:border-l border-neutral-200 dark:border-neutral-800 md:pl-8 min-w-[280px] flex flex-col justify-between">
          {gamificationProfile && (
            <div className="mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black flex items-center justify-center">
                    {gamificationProfile.level}
                  </span>
                  {gamificationProfile.title}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {gamificationProfile.totalStars}
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${gamificationProfile.currentLevelProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-neutral-400 font-semibold mt-1">
                <span>{gamificationProfile.totalXp} XP</span>
                <span>{gamificationProfile.nextLevelXp} XP</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center md:text-left">
              <span className="block text-xs text-neutral-400 font-medium">Attempts</span>
              <span className="text-xl font-bold">{totalAttempts}</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xs text-neutral-400 font-medium">Completed</span>
              <span className="text-xl font-bold">{totalSuccesses}</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xs text-neutral-400 font-medium">Mastered</span>
              <span className="text-xl font-bold text-brand-primary">{masteredOpenings}</span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={onOpenAnalytics}
              className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-primary/40 dark:hover:border-brand-primary/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-xs font-bold text-neutral-600 dark:text-neutral-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <BarChart3 size={13} className="text-brand-primary" />
              <span>View Learning Analytics & Weak Spots</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Campaign Levels Banner */}
      {onOpenCampaign && (
        <div className="bg-gradient-to-r from-amber-500/15 via-brand-primary/10 to-transparent border-2 border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-8 -mt-8 pointer-events-none blur-xl" />
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs border border-amber-500/30">
              <Map size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  New • Campaign Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Visual Roadmap
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
                Interactive Opening Roadmap
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl mt-1">
                Advance node by node along the winding path, earn 3 stars in every theoretical variation, and defeat the Boss Sparring bots.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCampaign}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-brand-primary hover:from-amber-500 hover:to-brand-primary/95 text-white font-black text-xs md:text-sm tracking-wide shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Play size={14} className="fill-white" />
            <span>Explore Campaign Map</span>
          </button>
        </div>
      )}

      {/* SRS Due Review Card */}
      {dueVariants.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Brain size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Spaced Repetition Review
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {dueVariants.length} lines due today
                </span>
              </div>
              <h4 className="text-base font-bold tracking-tight mt-0.5">
                Strengthen Your Active Recall
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                These variations have reached their memory review date. Review them now to ensure permanent mastery!
              </p>
            </div>
          </div>

          <button
            onClick={onStartSrsReview}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <Sparkles size={14} />
            Start Daily Review ({dueVariants.length})
          </button>
        </div>
      )}

      {/* Repertoire Categories & Clean Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Compass size={18} className="text-brand-primary" />
            Select an Opening Repertoire
          </h3>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {OPENING_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.id] ?? 0;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-black/15 dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredOpeningGroups.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
            <Layers className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No openings found in this category yet</p>
            <p className="text-xs text-neutral-400 mt-1">Select another category or "All Openings" to browse available repertoires.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpeningGroups.map((group) => {
              const isVienna = group.openingName === 'Vienna Game' || group.openingName === 'Vienna Repertoire';
              const isAllMastered = group.masteredCount === group.totalVariants && group.totalVariants > 0;

              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-primary/40 dark:hover:border-brand-primary/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Folder size={12} className="text-brand-primary" />
                          <span className="text-[10px] font-black text-brand-primary tracking-wider uppercase">
                            {group.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-black tracking-tight mt-1 text-neutral-900 dark:text-neutral-100">
                          {group.openingName}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        group.side === 'white'
                          ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                          : 'bg-brand-dark text-white border border-brand-dark'
                      }`}>
                        {group.side === 'white' ? 'White' : 'Black'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[36px]">
                      {group.description}
                    </p>

                    {/* Preview of Lines */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {isVienna ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                          8 Core Chapters (Main Line, Accepted, Declined, Hybrid...)
                        </span>
                      ) : (
                        <>
                          {group.variants.slice(0, 3).map(v => (
                            <span
                              key={v.id}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            >
                              {v.name}
                            </span>
                          ))}
                          {group.variants.length > 3 && (
                            <span className="text-[10px] font-bold text-neutral-400">
                              +{group.variants.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center gap-4">
                    <div className="flex items-center space-x-3 text-xs">
                      <span className={`font-semibold text-xs flex items-center gap-1 ${
                        isAllMastered ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {isAllMastered && <CheckCircle2 size={13} />}
                        {group.masteredCount} / {group.totalVariants} Mastered
                      </span>

                      {group.totalStars > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{group.totalStars}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (isVienna) {
                          onOpenViennaDirectory();
                        } else {
                          onOpenOpeningDirectory(group.openingName);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderOpen size={13} />
                      <span>{isVienna ? 'Choose Chapters' : 'Explore Variations'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* C. Custom User Repertoires (if any imported) */}
      {Object.keys(customGroups).length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/80">
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Sparkles size={18} className="text-brand-primary" />
            Your Custom Imported Repertoires
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(customGroups).map(([repName, vars]) => {
              const mastered = vars.filter(v => (userProgress[v.id]?.successes || 0) > 0).length;
              return (
                <div
                  key={repName}
                  className="bg-white dark:bg-neutral-900 border border-brand-primary/30 rounded-xl p-6 transition-all flex flex-col justify-between shadow-xs relative"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                          Custom PGN
                        </span>
                        <h4 className="text-lg font-bold tracking-tight mt-0.5">{repName}</h4>
                      </div>
                      <button
                        onClick={() => onDeleteCustomRepertoire(repName)}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete this custom repertoire"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Contains {vars.length} variations. {mastered} / {vars.length} mastered.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="text-xs text-neutral-400">
                      Side: <strong className="capitalize">{vars[0]?.side || 'white'}</strong>
                    </span>
                    {vars.length > 1 ? (
                      <button
                        onClick={() => onOpenOpeningDirectory(repName)}
                        className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <FolderOpen size={12} /> Explore ({vars.length})
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenOpeningDirectory(repName)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onStartVariant(vars[0])}
                          className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Play size={12} className="fill-white" /> Train
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* D. Data Management / Backup Card */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Progress Data & Backups</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Your training stats are saved in your browser. Export a JSON backup or import it onto another device.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportProgress}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Export progress to JSON"
            >
              <Download size={13} />
              Export Backup
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Import progress from JSON"
            >
              <UploadCloud size={13} />
              Restore Backup
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={onResetProgress}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-red-500/10 hover:text-red-500 text-xs font-bold text-neutral-400 transition-all flex items-center gap-1 cursor-pointer"
              title="Clear all local progress"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
