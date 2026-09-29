import React from 'react';
import {
  ArrowLeft,
  Flame,
  Award,
  Target,
  Brain,
  Calendar,
  AlertTriangle,
  Play,
  CheckCircle2,
  Compass,
  Sparkles
} from 'lucide-react';
import { OpeningVariant, UserProgress, WeakSpotRecord } from '../types';
import {
  getActivityHeatmap,
  calculateDailyStreak,
  calculateRepertoireMastery
} from '../utils/analytics';

interface Props {
  variants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  weakSpots: (WeakSpotRecord & { variant: OpeningVariant })[];
  onBackToMenu: () => void;
  onDrillWeakSpots: (variantsToDrill: OpeningVariant[]) => void;
  onStartVariant: (variant: OpeningVariant) => void;
}

export const AnalyticsView: React.FC<Props> = ({
  variants,
  userProgress,
  weakSpots,
  onBackToMenu,
  onDrillWeakSpots,
  onStartVariant
}) => {
  const streakInfo = calculateDailyStreak();
  const heatmapDays = getActivityHeatmap(105); // 15 weeks * 7 days
  const overallMastery = calculateRepertoireMastery(variants, userProgress);

  // Group variants by repertoire for individual mastery metrics
  const viennaVariants = variants.filter(v => v.openingName === 'Vienna Repertoire');
  const viennaMastery = calculateRepertoireMastery(viennaVariants, userProgress);

  const defaultVariants = variants.filter(v => v.openingName !== 'Vienna Repertoire' && !v.isCustom);
  const defaultMastery = calculateRepertoireMastery(defaultVariants, userProgress);

  const customVariants = variants.filter(v => v.isCustom);
  const customMastery = calculateRepertoireMastery(customVariants, userProgress);

  // Heatmap helper: slice into weeks of 7 days
  const weeks: typeof heatmapDays[] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  const getHeatmapColor = (level: number): string => {
    switch (level) {
      case 1: return 'bg-brand-primary/25 dark:bg-brand-primary/20 border-brand-primary/30';
      case 2: return 'bg-brand-primary/50 dark:bg-brand-primary/45 border-brand-primary/60';
      case 3: return 'bg-brand-primary/75 dark:bg-brand-primary/70 border-brand-primary/80';
      case 4: return 'bg-brand-primary text-white border-brand-primary shadow-xs';
      default: return 'bg-neutral-100 dark:bg-neutral-800/60 border-neutral-200/50 dark:border-neutral-700/40';
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-fadeIn pb-12">
      {/* Navigation and Title */}
      <div>
        <button
          onClick={onBackToMenu}
          className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer mb-3"
        >
          <ArrowLeft size={14} className="mr-1" />
          Back to Main Menu
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Learning Analytics & Weak Spots</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
              Measure your memory retention, review activity heatmaps, and target your theoretical stumbling points.
            </p>
          </div>

          {weakSpots.length > 0 && (
            <button
              onClick={() => onDrillWeakSpots(weakSpots.map(w => w.variant))}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Target size={14} />
              Drill My Weak Spots ({weakSpots.length})
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Daily Streak */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Daily Streak</span>
            <Flame size={16} className={streakInfo.currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-neutral-400'} />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black">
              {streakInfo.currentStreak} <span className="text-sm font-semibold text-neutral-400">{streakInfo.currentStreak === 1 ? 'day' : 'days'}</span>
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              Personal record: {streakInfo.maxStreak} days
            </span>
          </div>
        </div>

        {/* Metric 2: Repertoire Mastery */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mastery</span>
            <Award size={16} className="text-brand-primary" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-brand-primary">
              {overallMastery.masteryPercentage}%
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              {overallMastery.masteredCount} of {variants.length} lines mastered
            </span>
          </div>
        </div>

        {/* Metric 3: Accuracy Rate */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Practice Accuracy</span>
            <Target size={16} className="text-green-500" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-green-600 dark:text-green-400">
              {overallMastery.accuracyRate}%
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              {overallMastery.totalSuccesses} / {overallMastery.totalAttempts} clean runs
            </span>
          </div>
        </div>

        {/* Metric 4: Plies Memorized */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Theory Stored</span>
            <Brain size={16} className="text-indigo-500" />
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black">
              {overallMastery.totalPliesMemorized}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-1">
              Total theoretical plies
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Weak Spots / Talón de Aquiles */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Theoretical Weak Spots (Talón de Aquiles)</h3>
              <p className="text-xs text-neutral-400">Exact move coordinates where mistakes have occurred most frequently</p>
            </div>
          </div>
        </div>

        {weakSpots.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakSpots.slice(0, 6).map((spot, i) => (
                <div
                  key={`${spot.variantId}-${spot.plyIndex}-${i}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
                >
                  <div className="space-y-1 pr-2 max-w-[75%]">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block truncate">
                      {spot.variant.chapterName || spot.variant.openingName}
                    </span>
                    <h4 className="text-xs font-extrabold truncate">
                      {spot.variant.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>Move {Math.ceil((spot.plyIndex + 1) / 2)}:</span>
                      <span className="px-1.5 py-0.5 rounded bg-brand-primary text-white font-mono font-bold text-[10px]">
                        {spot.expectedMove}
                      </span>
                      <span className="text-red-500 font-bold">
                        {spot.mistakeCount} {spot.mistakeCount === 1 ? 'error' : 'errors'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartVariant(spot.variant)}
                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-transform active:scale-95 shadow-xs cursor-pointer flex items-center justify-center shrink-0"
                    title="Train this line now"
                  >
                    <Play size={12} className="fill-white" />
                  </button>
                </div>
              ))}
            </div>

            {weakSpots.length > 6 && (
              <p className="text-center text-xs text-neutral-400 pt-2 font-medium">
                Showing top 6 stumble points. Use "Drill My Weak Spots" above to practice all of them in order!
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <CheckCircle2 size={28} className="mx-auto text-green-500 mb-2" />
            <h4 className="text-sm font-bold">Zero Stumbling Points!</h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              You haven't accumulated recurring mistakes yet. Train in Practice Mode and the system will automatically pinpoint difficult lines here.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Consistency Activity Heatmap */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Training Consistency Heatmap</h3>
              <p className="text-xs text-neutral-400">Daily practice frequency over the past 15 weeks</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-semibold self-end sm:self-auto">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
            <div className="w-2.5 h-2.5 rounded-xs bg-brand-primary/25 border border-brand-primary/30" />
            <div className="w-2.5 h-2.5 rounded-xs bg-brand-primary/50 border border-brand-primary/60" />
            <div className="w-2.5 h-2.5 rounded-xs bg-brand-primary/75 border border-brand-primary/80" />
            <div className="w-2.5 h-2.5 rounded-xs bg-brand-primary border border-brand-primary" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Wrapper */}
        <div className="overflow-x-auto pb-2 pt-2">
          <div className="inline-flex gap-1.5 min-w-full justify-start md:justify-center">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-xs border transition-colors cursor-pointer ${getHeatmapColor(day.level)}`}
                    title={`${day.date}: ${day.count} moves/lines practiced`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800 font-medium">
          <span>{streakInfo.totalDays} active training days recorded</span>
          <span>Consistency is key to permanent opening retention</span>
        </div>
      </div>

      {/* Section 3: Repertoire-by-Repertoire Mastery Breakdown */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Repertoire Mastery Breakdown</h3>
            <p className="text-xs text-neutral-400">Detailed memory progress across each opening catalog</p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* Vienna Game Progress */}
          {viennaVariants.length > 0 && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Vienna Game Repertoire</span>
                  <span className="text-[11px] text-neutral-400 ml-2">({viennaVariants.length} lines total)</span>
                </div>
                <span className="font-black text-brand-primary">{viennaMastery.masteryPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${viennaMastery.masteryPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>{viennaMastery.masteredCount} mastered</span>
                <span>{viennaMastery.accuracyRate}% clean accuracy</span>
              </div>
            </div>
          )}

          {/* Default Repertoires Progress */}
          {defaultVariants.length > 0 && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Default Openings (Najdorf, Caro-Kann, Berlin)</span>
                  <span className="text-[11px] text-neutral-400 ml-2">({defaultVariants.length} lines)</span>
                </div>
                <span className="font-black text-brand-primary">{defaultMastery.masteryPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${defaultMastery.masteryPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>{defaultMastery.masteredCount} mastered</span>
                <span>{defaultMastery.accuracyRate}% clean accuracy</span>
              </div>
            </div>
          )}

          {/* Custom Repertoires Progress */}
          {customVariants.length > 0 && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                    <Sparkles size={12} className="text-brand-primary" />
                    Custom Imported Repertoires
                  </span>
                  <span className="text-[11px] text-neutral-400 ml-2">({customVariants.length} lines)</span>
                </div>
                <span className="font-black text-brand-primary">{customMastery.masteryPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${customMastery.masteryPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>{customMastery.masteredCount} mastered</span>
                <span>{customMastery.accuracyRate}% clean accuracy</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
