import React, { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Trophy,
  Star,
  Swords,
  Play,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Crown,
  ChevronRight,
  ShieldAlert,
  Flame,
  Castle,
  Shield
} from 'lucide-react';
import { CampaignLevel, OpeningVariant, GamificationProfile, UserProgress } from '../types';
import { CAMPAIGN_WORLDS, findVariantForLevel } from '../utils/campaignData';
import { soundManager } from '../utils/sound';

interface Props {
  allVariants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  gamificationProfile: GamificationProfile;
  onBackToMenu: () => void;
  onStartCampaignLevel: (variant: OpeningVariant, isDemo: boolean, isBossSparring?: boolean) => void;
}

export const CampaignView: React.FC<Props> = ({
  allVariants,
  userProgress,
  gamificationProfile,
  onBackToMenu,
  onStartCampaignLevel
}) => {
  const [activeWorldId, setActiveWorldId] = useState<string>('world-1-vienna');
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);

  const activeWorld = useMemo(() => {
    return CAMPAIGN_WORLDS.find(w => w.id === activeWorldId) || CAMPAIGN_WORLDS[0];
  }, [activeWorldId]);

  // Resolve opening variant for selected level
  const selectedVariant = useMemo(() => {
    if (!selectedLevel) return null;
    return findVariantForLevel(selectedLevel, allVariants);
  }, [selectedLevel, allVariants]);

  // Total stars collected across all repertoires
  const totalCampaignStars = useMemo(() => {
    return gamificationProfile.totalStars || 0;
  }, [gamificationProfile]);

  // Total completed levels in the active world
  const completedInActiveWorld = useMemo(() => {
    return activeWorld.levels.filter(lvl => {
      const v = findVariantForLevel(lvl, allVariants);
      return v ? (gamificationProfile.stars[v.id] || 0) > 0 : false;
    }).length;
  }, [activeWorld, allVariants, gamificationProfile]);

  // World icon helper
  const getWorldIcon = (worldId: string) => {
    if (worldId.includes('vienna')) return <Castle size={18} />;
    if (worldId.includes('asymmetric')) return <Shield size={18} />;
    return <Swords size={18} />;
  };

  // ----------------------------------------------------
  // Precise 3D Ribbon Coordinate Geometry
  // ----------------------------------------------------
  const nodeHeight = 140;
  const topPadding = 70;
  const bottomPadding = 90;
  const totalHeight = activeWorld.levels.length * nodeHeight + topPadding + bottomPadding;

  const getNodeCoords = useCallback((index: number) => {
    const isBoss = index === activeWorld.levels.length - 1;
    if (isBoss) return { x: 200, y: index * nodeHeight + topPadding };
    // Smooth alternating S-curve pattern centered on X = 200
    const xPattern = [200, 115, 200, 285, 200, 105, 200, 295];
    return {
      x: xPattern[index % xPattern.length],
      y: index * nodeHeight + topPadding
    };
  }, [activeWorld.levels.length]);

  // Full SVG road path
  const fullPathD = useMemo(() => {
    let d = '';
    activeWorld.levels.forEach((_, i) => {
      const { x, y } = getNodeCoords(i);
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prev = getNodeCoords(i - 1);
        const midY = (prev.y + y) / 2;
        d += ` C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
      }
    });
    return d;
  }, [activeWorld, getNodeCoords]);

  // Illuminated golden flow for completed levels
  const completedPathD = useMemo(() => {
    let lastCompletedIdx = -1;
    activeWorld.levels.forEach((lvl, i) => {
      const v = findVariantForLevel(lvl, allVariants);
      if (v && (gamificationProfile.stars[v.id] || 0) > 0) {
        lastCompletedIdx = i;
      }
    });

    if (lastCompletedIdx <= 0) return '';

    let d = '';
    for (let i = 0; i <= lastCompletedIdx; i++) {
      const { x, y } = getNodeCoords(i);
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prev = getNodeCoords(i - 1);
        const midY = (prev.y + y) / 2;
        d += ` C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
      }
    }
    return d;
  }, [activeWorld, allVariants, gamificationProfile, getNodeCoords]);

  // Find index of recommended next level
  const nextTargetLevelIndex = useMemo(() => {
    const idx = activeWorld.levels.findIndex(lvl => {
      const variant = findVariantForLevel(lvl, allVariants);
      if (!variant) return false;
      const stars: number = gamificationProfile.stars[variant.id] || 0;
      return stars === 0;
    });
    return idx === -1 ? activeWorld.levels.length - 1 : idx;
  }, [activeWorld, allVariants, gamificationProfile]);

  const handleOpenLevelModal = (level: CampaignLevel) => {
    if (level.isBoss) {
      soundManager.playKeyMove();
    } else {
      soundManager.playBookMove();
    }
    setSelectedLevel(level);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-fadeIn pb-20 select-none">
      {/* ==================================================== */}
      {/* 1. TOP HEADER & PLAYER PROFILE                       */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToMenu}
            className="p-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Back to Main Menu"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                Campaign Mode
              </span>
              <span className="text-xs font-bold text-neutral-400">Roadmap to Mastery</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
              Adventure Road
            </h2>
          </div>
        </div>

        {/* Global Player Campaign Progress Pill */}
        <div className="flex items-center gap-3.5 bg-neutral-100 dark:bg-neutral-800/80 px-4 py-2 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 shadow-xs self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
              <Trophy size={15} />
            </div>
            <div>
              <span className="text-xs font-black text-neutral-800 dark:text-neutral-200 block leading-tight">
                Lvl. {gamificationProfile.level} • {gamificationProfile.title}
              </span>
              <span className="text-[10px] font-bold text-neutral-400">
                {gamificationProfile.totalXp} XP Total
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span>{totalCampaignStars}</span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. WORLD REALM CARDS (SELECTION)                     */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {CAMPAIGN_WORLDS.map(world => {
          const isSelected = world.id === activeWorldId;
          const completedCount = world.levels.filter(lvl => {
            const variant = findVariantForLevel(lvl, allVariants);
            return variant ? (gamificationProfile.stars[variant.id] || 0) > 0 : false;
          }).length;
          const pct = Math.round((completedCount / world.levels.length) * 100);

          return (
            <button
              key={world.id}
              onClick={() => {
                soundManager.playBookMove();
                setActiveWorldId(world.id);
              }}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs active:scale-[0.98] ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-gradient-to-br from-amber-500/15 via-white to-white dark:via-neutral-900 dark:to-neutral-900 shadow-md'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`p-1.5 rounded-xl ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}>
                    {getWorldIcon(world.id)}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    World {world.worldNumber}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  completedCount === world.levels.length
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {completedCount}/{world.levels.length}
                </span>
              </div>

              <h3 className="text-sm font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                {world.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {world.subtitle}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct === 100
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* World Description Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-brand-primary/5 to-transparent border border-amber-500/20 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Sparkles size={14} />
            <span>World {activeWorld.worldNumber}: {activeWorld.title}</span>
          </div>
          <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            {activeWorld.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
            {completedInActiveWorld} of {activeWorld.levels.length} Mastered ⭐
          </span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. NEO-ARCADE 3D WINDING ROADWAY (FIXED RATIO)      */}
      {/* ==================================================== */}
      <div className="relative bg-neutral-50 dark:bg-[#0c0e14] border-2 border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden flex justify-center">
        {/* Subtle checkered tiles ambient backdrop */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#8c6a5c_2px,transparent_2px)] [background-size:24px_24px]" />

        {/* Constrained Fixed-Ratio Stage Container */}
        <div
          className="relative w-full max-w-[420px]"
          style={{ height: `${totalHeight}px` }}
        >
          {/* 3D SVG Highway Layers */}
          <svg
            viewBox={`0 0 400 ${totalHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <defs>
              <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Layer 1: Ground 3D Depth Shadow */}
            <path
              d={fullPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
              className="text-neutral-300 dark:text-[#06080d]"
            />

            {/* Layer 2: Main Roadway Pavement */}
            <path
              d={fullPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeLinecap="round"
              className="text-neutral-200 dark:text-neutral-800"
            />

            {/* Layer 3: Dashed Road Guide */}
            <path
              d={fullPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="text-neutral-400/50 dark:text-neutral-600/50"
            />

            {/* Layer 4: Illuminated Golden Progress Flow */}
            {completedPathD && (
              <path
                d={completedPathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeDasharray="12 8"
                strokeLinecap="round"
                filter="url(#road-glow)"
                className="opacity-90"
              />
            )}
          </svg>

          {/* Interactive 3D Nodes */}
          {activeWorld.levels.map((level, i) => {
            const coords = getNodeCoords(i);
            const xPercent = (coords.x / 400) * 100;
            const yPixels = coords.y;
            const variant = findVariantForLevel(level, allVariants);
            const stars = variant ? gamificationProfile.stars[variant.id] || 0 : 0;
            const isCompleted = stars > 0;
            const isNextTarget = i === nextTargetLevelIndex;
            const isBoss = level.isBoss;

            return (
              <div
                key={level.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPixels}px`
                }}
              >
                {/* 1. Animated Floating Mascot Speech Bubble (Next Challenge) */}
                {isNextTarget && (
                  <div className="absolute -top-13 z-30 animate-soft-float flex flex-col items-center pointer-events-none whitespace-nowrap">
                    <div className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-xl flex items-center gap-1.5 uppercase tracking-wider border border-amber-200">
                      <Flame size={12} className="fill-slate-950" /> Next Challenge!
                    </div>
                    <div className="w-2.5 h-2.5 bg-orange-500 rotate-45 -mt-1 shadow-md" />
                  </div>
                )}

                {/* 2. Floating Star Pedestal (Completed Levels) */}
                {isCompleted && !isBoss && (
                  <div className="absolute -top-4 z-20 flex items-center gap-0.5 bg-slate-950 dark:bg-black px-2.5 py-0.5 rounded-full border border-amber-400/80 shadow-lg">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        size={11}
                        className={s <= stars ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-neutral-600'}
                      />
                    ))}
                  </div>
                )}

                {/* 3. Boss Crown Badge */}
                {isBoss && (
                  <div className="absolute -top-4 z-20 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-500 shadow-xl flex items-center gap-1">
                    <Swords size={12} /> Boss Duel
                  </div>
                )}

                {/* 4. Tangible 3D Arcade Button */}
                <button
                  onClick={() => handleOpenLevelModal(level)}
                  className={`btn-3d flex items-center justify-center cursor-pointer relative ${
                    isBoss
                      ? 'w-22 h-22 sm:w-24 sm:h-24 rounded-3xl btn-3d-boss border-4 border-amber-300 text-white'
                      : isCompleted
                      ? 'w-16 h-16 sm:w-18 sm:h-18 rounded-3xl btn-3d-emerald border-2 border-emerald-300 text-white'
                      : isNextTarget
                      ? 'w-18 h-18 sm:w-20 sm:h-20 rounded-3xl btn-3d-gold border-4 border-amber-200 text-slate-950 ring-4 ring-amber-400/30'
                      : 'w-16 h-16 sm:w-18 sm:h-18 rounded-3xl btn-3d-slate border-2 border-slate-600 text-slate-200'
                  }`}
                  title={`${level.title} • Click to view`}
                >
                  {isBoss ? (
                    <Crown size={36} className="fill-amber-300 text-amber-300 filter drop-shadow-md animate-pulse" />
                  ) : isCompleted ? (
                    <CheckCircle2 size={30} className="stroke-[2.5]" />
                  ) : (
                    <span className="font-mono font-black text-xl">
                      {level.levelNumber}
                    </span>
                  )}
                </button>

                {/* 5. Level Label Tag Under Node */}
                <div
                  onClick={() => handleOpenLevelModal(level)}
                  className="mt-3 text-center cursor-pointer max-w-[140px] px-2.5 py-1.5 rounded-2xl bg-white/80 dark:bg-neutral-900/90 backdrop-blur-xs border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-primary/50 transition-all group-hover:scale-105"
                >
                  <span className="block text-[11px] font-black text-neutral-900 dark:text-neutral-100 truncate leading-tight">
                    {level.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold block truncate mt-0.5">
                    {level.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. LEVEL DETAILS MODAL DIALOG                        */}
      {/* ==================================================== */}
      {selectedLevel && selectedVariant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp relative overflow-hidden">
            {/* Ambient accent background glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20 ${
              selectedLevel.isBoss ? 'bg-red-500' : 'bg-amber-500'
            }`} />

            {/* Header info */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    Level {selectedLevel.levelNumber} • {selectedVariant.side === 'white' ? 'White' : 'Black'}
                  </span>
                  {selectedLevel.isBoss && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/15 text-red-500 border border-red-500/30 flex items-center gap-1">
                      <ShieldAlert size={12} /> Boss Fight
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 text-neutral-900 dark:text-neutral-100">
                  {selectedLevel.title}
                </h3>
                <span className="text-xs text-neutral-400 font-semibold block mt-0.5">
                  {selectedLevel.subtitle}
                </span>
              </div>

              {/* Stars Earned Pill */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                {[1, 2, 3].map(s => {
                  const earned = s <= (gamificationProfile.stars[selectedVariant.id] || 0);
                  return (
                    <Star
                      key={s}
                      size={16}
                      className={earned ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-neutral-300 dark:text-neutral-600'}
                    />
                  );
                })}
              </div>
            </div>

            {/* Theoretical Objective Box */}
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4.5 space-y-1.5 border border-neutral-200/60 dark:border-neutral-800 text-xs relative z-10">
              <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block">
                Theoretical Objective
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium text-xs sm:text-sm">
                {selectedLevel.description}
              </p>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 text-xs relative z-10">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Reward:</span>
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1 text-sm">
                  <Sparkles size={14} /> +125 XP
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Line Depth:</span>
                <span className="font-black text-neutral-800 dark:text-neutral-200 mt-1 text-sm">
                  {selectedVariant.moves.length} moves
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Mastered:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 mt-1 text-sm">
                  {userProgress[selectedVariant.id]?.successes || 0}x times
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
              {selectedLevel.isBoss ? (
                <button
                  onClick={() => {
                    onStartCampaignLevel(selectedVariant, false, true);
                    setSelectedLevel(null);
                  }}
                  className="flex-1 py-3.5 px-5 rounded-2xl btn-3d-boss text-white font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400"
                >
                  <Swords size={18} />
                  <span>Challenge Boss (AI Sparring Duel)!</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onStartCampaignLevel(selectedVariant, true, false);
                      setSelectedLevel(null);
                    }}
                    className="py-3 px-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <BookOpen size={15} />
                    <span>Watch Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      onStartCampaignLevel(selectedVariant, false, false);
                      setSelectedLevel(null);
                    }}
                    className="flex-1 py-3.5 px-5 rounded-2xl btn-3d-gold text-slate-950 font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200"
                  >
                    <Play size={16} className="fill-slate-950" />
                    <span>Play Level (Practice)!</span>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <button
                onClick={() => setSelectedLevel(null)}
                className="py-3 px-4 rounded-2xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
