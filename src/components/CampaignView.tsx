import React, { useState, useMemo } from 'react';
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
  Flame
} from 'lucide-react';
import { CampaignLevel, OpeningVariant, GamificationProfile, UserProgress } from '../types';
import { CAMPAIGN_WORLDS, findVariantForLevel } from '../utils/campaignData';

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

  // Resuelve la variante para el nivel actualmente seleccionado
  const selectedVariant = useMemo(() => {
    if (!selectedLevel) return null;
    return findVariantForLevel(selectedLevel, allVariants);
  }, [selectedLevel, allVariants]);

  // Calcula estadísticas globales de la campaña
  const totalCampaignStars = useMemo(() => {
    return gamificationProfile.totalStars || 0;
  }, [gamificationProfile]);

  // Offset horizontal para el camino sinuoso (en porcentaje %)
  const getNodeXPosition = (index: number, total: number) => {
    if (index === total - 1) return 50; // El Boss siempre está centrado
    const pattern = [50, 32, 50, 68, 50, 28, 50, 72];
    return pattern[index % pattern.length];
  };

  // Genera el camino SVG curvado que conecta los nodos
  const pathD = useMemo(() => {
    const levels = activeWorld.levels;
    const nodeHeight = 120; // Separación vertical entre nodos en píxeles
    let d = '';

    levels.forEach((_, i) => {
      const x = getNodeXPosition(i, levels.length);
      const y = i * nodeHeight + 40;

      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevX = getNodeXPosition(i - 1, levels.length);
        const prevY = (i - 1) * nodeHeight + 40;
        const midY = (prevY + y) / 2;
        d += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
      }
    });

    return d;
  }, [activeWorld]);

  // Encuentra el primer nivel no completado en el mundo activo para destacarlo como "Siguiente"
  const nextTargetLevelIndex = useMemo(() => {
    const idx = activeWorld.levels.findIndex(lvl => {
      const variant = findVariantForLevel(lvl, allVariants);
      if (!variant) return false;
      const stars: number = gamificationProfile.stars[variant.id] || 0;
      return stars === 0;
    });
    return idx === -1 ? activeWorld.levels.length - 1 : idx;
  }, [activeWorld, allVariants, gamificationProfile]);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 animate-fadeIn pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Volver al Menú Principal"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                Modo Campaña
              </span>
              <span className="text-xs font-bold text-neutral-400">Ruta de Maestría</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">
              Mapa de Niveles
            </h2>
          </div>
        </div>

        {/* Global Player Campaign Progress Pill */}
        <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800/80 px-4 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-xs font-black text-neutral-800 dark:text-neutral-200">
              Nv. {gamificationProfile.level} • {gamificationProfile.title}
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{totalCampaignStars} Estrellas</span>
          </div>
        </div>
      </div>

      {/* World Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CAMPAIGN_WORLDS.map(world => {
          const isSelected = world.id === activeWorldId;
          const completedInWorld = world.levels.filter(lvl => {
            const variant = findVariantForLevel(lvl, allVariants);
            return variant ? (gamificationProfile.stars[variant.id] || 0) > 0 : false;
          }).length;

          return (
            <button
              key={world.id}
              onClick={() => setActiveWorldId(world.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs active:scale-[0.99] ${
                isSelected
                  ? world.theme === 'gold'
                    ? 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-white to-white dark:via-neutral-900 dark:to-neutral-900 shadow-amber-500/10'
                    : world.theme === 'emerald'
                    ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 via-white to-white dark:via-neutral-900 dark:to-neutral-900 shadow-emerald-500/10'
                    : 'border-blue-500/60 bg-gradient-to-br from-blue-500/15 via-white to-white dark:via-neutral-900 dark:to-neutral-900 shadow-blue-500/10'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Mundo {world.worldNumber}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  completedInWorld === world.levels.length
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {completedInWorld} / {world.levels.length}
                </span>
              </div>
              <h3 className="text-sm font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                {world.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {world.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* World Lore Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        activeWorld.theme === 'gold'
          ? 'bg-amber-500/10 border-amber-500/30'
          : activeWorld.theme === 'emerald'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-blue-500/10 border-blue-500/30'
      }`}>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Sparkles size={14} />
            <span>Mundo {activeWorld.worldNumber}: {activeWorld.title}</span>
          </div>
          <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            {activeWorld.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {activeWorld.levels.length} Niveles • Acceso Libre con Estrellas ⭐
          </span>
        </div>
      </div>

      {/* GRAPHICAL WINDING ROAD (SVG PATH + INTERACTIVE NODES) */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-12 shadow-sm overflow-hidden min-h-[700px]">
        {/* Subtle decorative background chess grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[radial-gradient(#8c6a5c_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* SVG Road connecting nodes */}
        <svg
          viewBox={`0 0 100 ${activeWorld.levels.length * 120}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 w-full h-full pointer-events-none z-0"
        >
          {/* Sombra de la ruta */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="text-neutral-200 dark:text-neutral-800/80"
          />
          {/* Ruta dorada punteada activa */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            className="text-amber-500/50 dark:text-amber-400/40"
          />
        </svg>

        {/* Nodes Layer */}
        <div
          className="relative z-10 w-full"
          style={{ height: `${activeWorld.levels.length * 120}px` }}
        >
          {activeWorld.levels.map((level, i) => {
            const xPercent = getNodeXPosition(i, activeWorld.levels.length);
            const yPixels = i * 120 + 40;
            const variant = findVariantForLevel(level, allVariants);
            const stars = variant ? gamificationProfile.stars[variant.id] || 0 : 0;
            const isCompleted = stars > 0;
            const isNextTarget = i === nextTargetLevelIndex;
            const isBoss = level.isBoss;

            return (
              <div
                key={level.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPixels}px`
                }}
              >
                {/* Indicador "Siguiente Desafío" flotante */}
                {isNextTarget && (
                  <div className="absolute -top-7 animate-bounce whitespace-nowrap z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-primary text-white shadow-md flex items-center gap-1 uppercase tracking-wider">
                      <Flame size={10} className="fill-white" /> ¡Siguiente!
                    </span>
                  </div>
                )}

                {/* Stars Badge on top of completed node */}
                {isCompleted && (
                  <div className="absolute -top-3.5 z-20 flex items-center gap-0.5 bg-neutral-900/90 dark:bg-black/90 px-1.5 py-0.5 rounded-full border border-amber-500/40 shadow-xs">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        size={10}
                        className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}
                      />
                    ))}
                  </div>
                )}

                {/* Interactive Node Button */}
                <button
                  onClick={() => setSelectedLevel(level)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg relative ${
                    isBoss
                      ? 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-600 to-red-600 text-white border-4 border-amber-400 shadow-amber-500/30'
                      : isCompleted
                      ? stars === 3
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-2 border-amber-300 shadow-amber-500/25'
                        : 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-emerald-600/20'
                      : isNextTarget
                      ? 'bg-brand-primary text-white border-4 border-brand-primary/50 ring-4 ring-brand-primary/30 animate-pulse shadow-brand-primary/30'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-2 border-neutral-300 dark:border-neutral-700 hover:border-brand-primary/50'
                  }`}
                  title={`${level.title} • Haz clic para ver detalles`}
                >
                  {isBoss ? (
                    <Crown size={28} className="fill-white animate-pulse" />
                  ) : isCompleted ? (
                    <CheckCircle2 size={24} className="stroke-[2.5]" />
                  ) : (
                    <span className="font-black text-sm sm:text-base font-mono">
                      {level.levelNumber}
                    </span>
                  )}
                </button>

                {/* Level Title label under node */}
                <div
                  onClick={() => setSelectedLevel(level)}
                  className="mt-2 text-center cursor-pointer max-w-[130px]"
                >
                  <span className="block text-[11px] font-black text-neutral-800 dark:text-neutral-200 truncate leading-tight group-hover:text-brand-primary transition-colors">
                    {level.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-semibold block truncate">
                    {level.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEVEL DETAILS DIALOG / ACTION MODAL */}
      {selectedLevel && selectedVariant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp relative">
            {/* Header with Level Badge */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    Nivel {selectedLevel.levelNumber} • {selectedVariant.side === 'white' ? 'Blancas' : 'Negras'}
                  </span>
                  {selectedLevel.isBoss && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                      <ShieldAlert size={12} /> Boss Fight
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black tracking-tight mt-1.5 text-neutral-900 dark:text-neutral-100">
                  {selectedLevel.title}
                </h3>
                <span className="text-xs text-neutral-400 font-semibold block">
                  {selectedLevel.subtitle}
                </span>
              </div>

              {/* Current Stars Pill */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
                {[1, 2, 3].map(s => {
                  const earned = s <= (gamificationProfile.stars[selectedVariant.id] || 0);
                  return (
                    <Star
                      key={s}
                      size={15}
                      className={earned ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}
                    />
                  );
                })}
              </div>
            </div>

            {/* Description & Objective */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-2 border border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block">
                Objetivo Teórico
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                {selectedLevel.description}
              </p>
            </div>

            {/* Stats & Rewards Ribbon */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Recompensa:</span>
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                  <Sparkles size={12} /> +125 XP
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Longitud:</span>
                <span className="font-black text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {selectedVariant.moves.length} jugadas
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
                <span className="font-bold text-neutral-400 text-[10px] uppercase">Superado:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {userProgress[selectedVariant.id]?.successes || 0}x veces
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {selectedLevel.isBoss ? (
                <button
                  onClick={() => {
                    onStartCampaignLevel(selectedVariant, false, true);
                    setSelectedLevel(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs md:text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Swords size={16} />
                  <span>¡Desafiar al Jefe (Sparring vs Bot)!</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onStartCampaignLevel(selectedVariant, true, false);
                      setSelectedLevel(null);
                    }}
                    className="py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>Ver Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      onStartCampaignLevel(selectedVariant, false, false);
                      setSelectedLevel(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white font-black text-xs md:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Play size={15} className="fill-white" />
                    <span>¡Jugar Nivel (Práctica)!</span>
                    <ChevronRight size={14} />
                  </button>
                </>
              )}

              <button
                onClick={() => setSelectedLevel(null)}
                className="py-2.5 px-4 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
