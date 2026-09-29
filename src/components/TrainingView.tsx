import React, { useState, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import {
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Zap,
  CheckCircle2,
  Award,
  Sparkles,
  Keyboard,
  Timer,
  Flame,
  Gauge,
  EyeOff,
  Palette,
  Swords,
  Bot,
  Compass,
  Lightbulb,
  Eraser,
  Undo2,
  ChevronDown,
  ChevronUp,
  Eye,
  Star,
  Trophy,
  Map
} from 'lucide-react';
import {
  OpeningVariant,
  PlaylistMode,
  BoardThemeConfig,
  TimerMode,
  BlindfoldMode,
  PositionEvaluation,
  UserProgress,
  BotDifficulty,
  BoardArrow,
  MoveFeedbackBadge,
  GamificationProfile,
  StarRating
} from '../types';
import { BranchExplorer } from './BranchExplorer';
import { getStrategicPlan } from '../utils/strategicPlans';

interface Props {
  currentVariant: OpeningVariant;
  gameFen: string;
  currentIndex: number;
  maxReachedIndex: number;
  isDemoMode: boolean;
  isCompleted: boolean;
  boardError: boolean;
  feedbackMessage: string | null;
  lastMoveComment: string | null;
  consecutiveMistakes: number;
  playlistMode: PlaylistMode;
  playlistIndex: number;
  playlistOriginalSize: number;
  boardTheme: BoardThemeConfig;
  selectedSquare: string | null;
  optionSquares: Record<string, React.CSSProperties>;
  nextVariantInChapter: OpeningVariant | null;
  demoArrows: string[][] | undefined;
  // Features: Timer, Streak, Eval, Blindfold, Branches
  streak: number;
  bestStreak: number;
  timerMode: TimerMode;
  timeLeft: number;
  maxTime: number;
  onSetTimerMode: (mode: TimerMode) => void;
  evalScore: PositionEvaluation;
  showEvalBar: boolean;
  onToggleEvalBar: () => void;
  blindfoldMode: BlindfoldMode;
  customPieces?: Record<string, (args: { squareWidth: number }) => React.ReactElement>;
  allVariants: OpeningVariant[];
  userProgress: Record<string, UserProgress>;
  onSelectBranch: (variant: OpeningVariant) => void;
  onOpenPieceModal: () => void;
  // Sparring Mode Props
  isSparringMode: boolean;
  botDifficulty: BotDifficulty;
  isBotThinking: boolean;
  sparringGameOverMessage: string | null;
  onStartSparring: () => void;
  onExitSparring: () => void;
  onResetSparringPosition: () => void;
  onTakebackSparringMove: () => void;
  onSetBotDifficulty: (difficulty: BotDifficulty) => void;
  // Gamification & Precision Props
  precision: number;
  activeBadge: MoveFeedbackBadge | null;
  gamificationProfile: GamificationProfile;
  lastXpGained?: number;
  starsEarned?: StarRating;
  // Handlers
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  onSquareClick: (square: string) => void;
  onNavigateBackward: () => void;
  onNavigateForward: () => void;
  onTriggerHint: () => void;
  onRestartVariant: (demoMode: boolean) => void;
  onSwitchMode: (demoMode: boolean) => void;
  onResetToMenu: () => void;
  onStartNextVariant: (variant: OpeningVariant) => void;
  onOpenShortcutsModal: () => void;
  onOpenCampaign?: () => void;
}

export const TrainingView: React.FC<Props> = ({
  currentVariant,
  gameFen,
  currentIndex,
  maxReachedIndex,
  isDemoMode,
  isCompleted,
  boardError,
  feedbackMessage,
  lastMoveComment,
  consecutiveMistakes,
  playlistMode,
  playlistIndex,
  playlistOriginalSize,
  boardTheme,
  selectedSquare,
  optionSquares,
  nextVariantInChapter,
  demoArrows,
  streak,
  bestStreak,
  timerMode,
  timeLeft,
  maxTime,
  onSetTimerMode,
  evalScore,
  showEvalBar,
  onToggleEvalBar,
  blindfoldMode,
  customPieces,
  allVariants,
  userProgress,
  onSelectBranch,
  onOpenPieceModal,
  // Sparring
  isSparringMode,
  botDifficulty,
  isBotThinking,
  sparringGameOverMessage,
  onStartSparring,
  onExitSparring,
  onResetSparringPosition,
  onTakebackSparringMove,
  onSetBotDifficulty,
  // Gamification & Precision
  precision,
  activeBadge,
  gamificationProfile,
  lastXpGained,
  starsEarned,
  // Handlers
  onPieceDrop,
  onSquareClick,
  onNavigateBackward,
  onNavigateForward,
  onTriggerHint,
  onRestartVariant,
  onSwitchMode,
  onResetToMenu,
  onStartNextVariant,
  onOpenShortcutsModal,
  onOpenCampaign
}) => {
  // Right-click Tactical Annotations (Circles and Highlights)
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, React.CSSProperties>>({});
  const [showStrategicPlan, setShowStrategicPlan] = useState<boolean>(false);
  const [showStrategicArrows, setShowStrategicArrows] = useState<boolean>(false);

  // Strategic Grandmaster Plan for current variant
  const strategicPlan = useMemo(() => getStrategicPlan(currentVariant), [currentVariant]);

  // Handle right click on a square to toggle visual highlight circle
  const handleSquareRightClick = (square: string) => {
    setRightClickedSquares(prev => {
      const next = { ...prev };
      if (next[square]) {
        delete next[square];
      } else {
        next[square] = {
          backgroundColor: 'rgba(239, 68, 68, 0.45)', // Crimson target highlight
          borderRadius: '50%'
        };
      }
      return next;
    });
  };

  // Clear all annotations and board drawings
  const handleClearDrawings = () => {
    setRightClickedSquares({});
    setShowStrategicArrows(false);
  };

  // Determine active board arrows (strategic arrows or demo arrows)
  const activeArrows = useMemo(() => {
    if (showStrategicArrows) {
      return strategicPlan.recommendedArrows;
    }
    return (demoArrows as BoardArrow[]) || [];
  }, [showStrategicArrows, strategicPlan, demoArrows]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full animate-fadeIn pb-8">
      {/* SIDE CONTROL PANEL */}
      <div className="lg:col-span-4 space-y-5 order-2 lg:order-1 flex flex-col justify-start">
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            onClick={onResetToMenu}
            className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="mr-1" />
            Back to menu
          </button>
          
          <div>
            <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
              {isSparringMode ? (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-black">
                  <Swords size={12} /> Post-Theory Sparring
                </span>
              ) : playlistMode === 'rumble' ? (
                <span className="flex items-center gap-1 text-red-500 font-black animate-pulse">
                  <Zap size={11} className="fill-red-500" /> Rumble Challenge ({playlistIndex + 1} / {playlistOriginalSize})
                </span>
              ) : playlistMode === 'study' ? (
                <span className="flex items-center gap-1 text-brand-primary font-black">
                  <BookOpen size={11} /> Study Playlist ({playlistIndex + 1} / {playlistOriginalSize})
                </span>
              ) : playlistMode === 'srs' ? (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-black">
                  <Sparkles size={11} /> Daily Review ({playlistIndex + 1} / {playlistOriginalSize})
                </span>
              ) : (
                currentVariant.openingName
              )}
            </span>
            <h3 className="text-xl font-black tracking-tight leading-tight">
              {currentVariant.chapterName || currentVariant.name}
            </h3>
            {currentVariant.chapterName && (
              <span className="text-xs text-neutral-400 font-medium block mt-0.5">
                {currentVariant.name}
              </span>
            )}
          </div>
        </div>

        {/* Training Modes & Controls Panel (or Sparring Panel when sparring active) */}
        {isSparringMode ? (
          /* SPARRING MODE CONTROLS */
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-4 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Swords size={14} className="text-amber-600 dark:text-amber-400" />
                Sparring vs AI Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-200">
                Live Play
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              You reached the end of the opening book. Test your strategic plans in a real game against the computer!
            </p>

            {/* Bot Skill Level Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Bot Difficulty
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg">
                {(['casual', 'intermediate', 'master'] as BotDifficulty[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => onSetBotDifficulty(diff)}
                    className={`py-1.5 text-xs font-bold rounded-md capitalize transition-all cursor-pointer ${
                      botDifficulty === diff
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {diff === 'casual' ? 'Casual ~1200' : diff === 'intermediate' ? 'Club ~1600' : 'Master ~2000'}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons: Takeback & Reset */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onTakebackSparringMove}
                disabled={isBotThinking}
                className="py-2 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                title="Take back your last move and the bot's response"
              >
                <Undo2 size={13} />
                <span>Takeback</span>
              </button>

              <button
                onClick={onResetSparringPosition}
                disabled={isBotThinking}
                className="py-2 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-40"
                title="Reset to the starting post-theory position"
              >
                <RotateCcw size={13} />
                <span>Reset FEN</span>
              </button>
            </div>

            <button
              onClick={onExitSparring}
              className="w-full py-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer border-t border-amber-500/20 pt-3"
            >
              ← Exit Sparring & Return to Variation
            </button>
          </div>
        ) : (
          /* STANDARD PRACTICE CONTROLS */
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4 shadow-xs">
            {/* Side Info */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-400 uppercase tracking-wider">Side</span>
              <span className="font-bold text-neutral-600 dark:text-neutral-300">
                Playing as {currentVariant.side === 'white' ? 'White' : 'Black'}
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">Practice Mode</span>
              <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                <button
                  onClick={() => onSwitchMode(true)}
                  className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    isDemoMode 
                      ? 'bg-white dark:bg-neutral-700 shadow-xs text-brand-primary' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Demonstration
                </button>
                <button
                  onClick={() => onSwitchMode(false)}
                  className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    !isDemoMode 
                      ? 'bg-white dark:bg-neutral-700 shadow-xs text-brand-primary' 
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Practice
                </button>
              </div>
            </div>

            {/* Speed Practice Blitz Timer Selector */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Timer size={12} className="text-brand-primary" />
                  Blitz Speed Timer
                </span>
                {timerMode !== 'off' && (
                  <span className="text-[10px] font-bold text-brand-primary uppercase">Active</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                {(['off', '10s', '5s', '3s'] as TimerMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => onSetTimerMode(mode)}
                    className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer capitalize ${
                      timerMode === mode
                        ? 'bg-white dark:bg-neutral-700 shadow-xs text-brand-primary'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toolbar (Evaluation Bar & Piece Style/Blindfold Modal) */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={onToggleEvalBar}
                className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  showEvalBar
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
                title="Toggle Offline Position Evaluation Bar"
              >
                <Gauge size={13} />
                <span>Eval: {showEvalBar ? evalScore.label : 'Off'}</span>
              </button>

              <button
                onClick={onOpenPieceModal}
                className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  blindfoldMode !== 'off'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
                title="Customize piece styles or toggle blindfold mode"
              >
                {blindfoldMode !== 'off' ? <EyeOff size={13} /> : <Palette size={13} />}
                <span>{blindfoldMode === 'off' ? 'Pieces' : 'Blindfold'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Move Commentary */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 min-h-[110px] flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center">
              <BookOpen size={12} className="mr-1 text-brand-primary" />
              Strategic Explanation
            </span>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              {lastMoveComment || 'Make your first move on the board to view strategic explanations.'}
            </p>
          </div>

          <div className="text-xs text-neutral-400 text-right mt-3 font-semibold">
            Move {Math.ceil(currentIndex / 2)} / {Math.ceil(currentVariant.moves.length / 2)}
          </div>
        </div>

        {/* GRANDMASTER STRATEGIC PLANS & TACTICAL MOTIFS ACCORDION */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <button
            onClick={() => setShowStrategicPlan(prev => !prev)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
          >
            <span className="text-xs font-black text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 uppercase tracking-wide">
              <Compass size={14} className="text-brand-primary" />
              Strategic Plan & Motifs
            </span>
            {showStrategicPlan ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showStrategicPlan && (
            <div className="p-4 pt-1 space-y-3.5 border-t border-neutral-100 dark:border-neutral-800 text-xs animate-fadeIn">
              <div>
                <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1">
                  Master Rationale
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {strategicPlan.keyIdea}
                </p>
              </div>

              <div>
                <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1.5">
                  Thematic Pawn Breaks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {strategicPlan.pawnBreaks.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px] font-bold text-neutral-700 dark:text-neutral-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1.5">
                  Piece Placement Goals
                </span>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-300 list-disc pl-4">
                  {strategicPlan.pieceGoals.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1.5">
                  Tactical Themes
                </span>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-300 list-disc pl-4">
                  {strategicPlan.tacticalThemes.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Toggle Strategic Arrows on the board */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => setShowStrategicArrows(prev => !prev)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    showStrategicArrows
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Eye size={13} />
                  <span>{showStrategicArrows ? 'Hide Plan Arrows' : 'Display Strategic Arrows on Board'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Hotkey hint */}
        <div className="space-y-2">
          {!isSparringMode && (
            <button
              onClick={() => onRestartVariant(isDemoMode)}
              className="w-full py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw size={14} className="mr-1" />
              <span>Restart line (Space)</span>
            </button>
          )}

          <button
            onClick={onOpenShortcutsModal}
            className="w-full py-1.5 text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Keyboard size={12} />
            <span>View Keyboard Shortcuts</span>
          </button>
        </div>
      </div>

      {/* CHESSBOARD GRAPHIC CONTAINER */}
      <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
        {/* Streak & Timer HUD Header */}
        <div className="w-full max-w-[775px] mb-2 flex items-center justify-between px-1">
          {/* Streak indicator */}
          <div className="flex items-center gap-2">
            {!isSparringMode && (
              <>
                {streak >= 3 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center gap-1 animate-pulse">
                    <Flame size={13} className="fill-orange-500 text-orange-500" />
                    {streak} Move Streak!
                  </span>
                ) : streak > 0 ? (
                  <span className="text-[11px] font-bold text-neutral-400">
                    Streak: {streak}
                  </span>
                ) : null}

                {bestStreak > 0 && (
                  <span className="text-[10px] text-neutral-400 font-semibold">
                    (Best: {bestStreak})
                  </span>
                )}
              </>
            )}

            {isSparringMode && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Swords size={12} />
                Sparring vs AI ({botDifficulty})
              </span>
            )}
          </div>

          {/* Blindfold indicator badge */}
          {blindfoldMode !== 'off' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <EyeOff size={11} />
              {blindfoldMode === 'semi' ? 'Semi-Blindfold' : 'Full Blindfold'}
            </span>
          )}
        </div>

        {/* Live Timer Countdown Bar (when Blitz mode active) */}
        {!isSparringMode && timerMode !== 'off' && !isCompleted && (
          <div className="w-full max-w-[775px] mb-3 space-y-1 animate-fadeIn">
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 px-1">
              <span className="flex items-center gap-1">
                <Timer size={11} className={timeLeft <= 2 ? 'text-red-500 animate-spin' : 'text-neutral-400'} />
                MOVE TIME
              </span>
              <span className={timeLeft <= 2 ? 'text-red-500 font-black' : 'text-neutral-500'}>
                {timeLeft.toFixed(1)}s
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ease-linear rounded-full ${
                  timeLeft <= 2 ? 'bg-red-500 animate-pulse' : 'bg-brand-primary'
                }`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Sparring Game Over Banner */}
        {isSparringMode && sparringGameOverMessage && (
          <div className="w-full max-w-[775px] mb-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center font-black text-xs md:text-sm text-amber-800 dark:text-amber-300 animate-fadeIn shadow-xs flex items-center justify-center gap-2">
            <Award size={16} className="text-amber-600" />
            <span>{sparringGameOverMessage}</span>
          </div>
        )}

        {/* Bot Calculating Banner */}
        {isSparringMode && isBotThinking && (
          <div className="w-full max-w-[775px] mb-2 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse">
            <Bot size={15} className="animate-spin" />
            <span>Bot is calculating response...</span>
          </div>
        )}

        {/* Floating Badge Overlay & Minimalist Feedback Banner */}
        <div className="w-full max-w-[775px] mb-3 text-center transition-all duration-300 min-h-[48px] flex flex-col items-center justify-center gap-2 relative">
          {/* Animated Floating Move Reaction Badge */}
          {activeBadge && (
            <div className="animate-bounce transition-all duration-300 transform scale-100 flex items-center justify-center z-20">
              <div className={`px-4 py-1.5 rounded-full shadow-lg border flex items-center gap-2 font-black text-xs md:text-sm backdrop-blur-md transition-all ${
                activeBadge.type === 'combo'
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-600 dark:text-orange-400 shadow-orange-500/25'
                  : activeBadge.type === 'key'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-600 dark:text-cyan-400 shadow-cyan-500/25'
                  : activeBadge.type === 'mistake'
                  ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-red-500/25'
                  : 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-brand-primary/25'
              }`}>
                <span>{activeBadge.text}</span>
                {activeBadge.subtext && (
                  <span className="text-[11px] font-semibold opacity-85 hidden sm:inline">• {activeBadge.subtext}</span>
                )}
              </div>
            </div>
          )}

          {/* Standard Feedback Message when no active badge */}
          {!activeBadge && feedbackMessage && !sparringGameOverMessage && (
            <span className={`text-xs font-bold flex items-center px-3.5 py-1 rounded-full ${
              boardError
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : isCompleted
                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                : 'bg-neutral-500/10 text-neutral-500'
            }`}>
              {boardError && <Zap size={12} className="mr-1 animate-pulse" />}
              {isCompleted && <CheckCircle2 size={12} className="mr-1" />}
              {feedbackMessage}
            </span>
          )}

          {/* Dynamic Hint Action Button */}
          {!isSparringMode && !isDemoMode && !isCompleted && consecutiveMistakes >= 3 && (
            <button
              onClick={onTriggerHint}
              className="px-5 py-2 rounded-xl bg-brand-primary/15 hover:bg-brand-primary/25 text-brand-primary font-black text-xs md:text-sm uppercase tracking-widest transition-all cursor-pointer animate-bounce border-2 border-brand-primary/45 shadow-md flex items-center gap-2 active:scale-95 duration-200"
              title="Reveal expected move hint (Hotkey: H)"
            >
              <span className="text-sm md:text-base">💡</span>
              <span>Get Hint (H)</span>
            </button>
          )}
        </div>

        {/* Dual Progress & Precision HUD (during training) */}
        {!isSparringMode && (
          <div className="w-full max-w-[775px] mb-4 space-y-1.5 animate-fadeIn">
            <div className="flex justify-between items-center px-1 text-[10px] font-bold tracking-wider">
              <span className="text-neutral-500 dark:text-neutral-400 uppercase">
                Progreso: {Math.min(currentIndex, currentVariant.moves.length)} / {currentVariant.moves.length} jugadas
              </span>

              {/* Live Precision Meter */}
              {!isDemoMode && (
                <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all ${
                  precision >= 100
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : precision >= 80
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30'
                }`}>
                  <span>Precisión: {precision}%</span>
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className={`fill-current ${precision >= 25 ? 'text-amber-400' : 'text-neutral-400'}`} />
                    <Star size={11} className={`fill-current ${precision >= 80 ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} />
                    <Star size={11} className={`fill-current ${precision >= 100 ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-300/10 dark:border-neutral-700/10 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-brand-primary/60 via-brand-primary to-brand-primary/95 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(140,106,92,0.3)]"
                style={{ width: `${(currentIndex / currentVariant.moves.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Board Wrapper with Optional Evaluation Bar */}
        <div className="w-full max-w-[775px] flex items-stretch gap-3">
          {/* Vertical Evaluation Bar */}
          {showEvalBar && (
            <div className="w-4 rounded-xl bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-hidden flex flex-col justify-end shadow-md relative shrink-0">
              <div
                className="w-full bg-neutral-100 transition-all duration-300 ease-out"
                style={{ height: `${evalScore.whitePercentage}%` }}
              />
              <div className="absolute top-1 left-0 right-0 text-[8px] font-black text-center text-neutral-400 select-none">
                {evalScore.label}
              </div>
            </div>
          )}

          {/* Chessboard container with Error/Success borders */}
          <div
            className={`w-full aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border-4 ${
              boardError 
                ? 'border-red-500/80 scale-[0.99] shake-animation' 
                : isCompleted && !isSparringMode
                ? 'border-green-500/80 scale-[1.01]' 
                : isSparringMode
                ? 'border-amber-500/80'
                : 'border-white dark:border-neutral-850'
            }`}
          >
            <Chessboard
              position={gameFen}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              onSquareRightClick={handleSquareRightClick}
              customSquareStyles={{
                ...optionSquares,
                ...rightClickedSquares,
                ...(selectedSquare && {
                  [selectedSquare]: { backgroundColor: 'rgba(140, 106, 92, 0.35)' }
                })
              }}
              boardOrientation={currentVariant.side}
              areArrowsAllowed={true}
              customArrowColor="rgba(234, 179, 8, 0.85)"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              customArrows={activeArrows as any}
              customDarkSquareStyle={{ backgroundColor: boardTheme.darkSquare }}
              customLightSquareStyle={{ backgroundColor: boardTheme.lightSquare }}
              customPieces={customPieces}
              animationDuration={250}
            />
          </div>
        </div>

        {/* Board Annotation Toolbar & Drawing Hint */}
        <div className="w-full max-w-[775px] mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 px-2">
          <div className="flex items-center gap-1.5">
            <Lightbulb size={12} className="text-amber-500" />
            <span>Right-click & drag: <strong>Arrow</strong> • Right-click square: <strong>Circle</strong></span>
          </div>

          {(Object.keys(rightClickedSquares).length > 0 || showStrategicArrows) && (
            <button
              onClick={handleClearDrawings}
              className="text-xs font-bold text-neutral-500 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eraser size={12} />
              <span>Clear Drawings</span>
            </button>
          )}
        </div>

        {/* Chessboard Navigation Controls (during training) */}
        {!isSparringMode && (
          <div className="w-full max-w-[775px] mt-3 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 shadow-xs">
            <button
              onClick={onNavigateBackward}
              disabled={currentIndex <= 0}
              className={`flex items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all active:scale-95 shadow-xs ${
                currentIndex <= 0
                  ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer'
              }`}
              title="Step Backward (Hotkey: ←)"
              aria-label="Step Backward"
            >
              <ArrowLeft size={16} />
            </button>

            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
              {currentIndex === 0 ? 'START POSITION' : `MOVE ${currentIndex} / ${currentVariant.moves.length}`}
            </span>

            <button
              onClick={onNavigateForward}
              disabled={currentIndex >= maxReachedIndex}
              className={`flex items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all active:scale-95 shadow-xs ${
                currentIndex >= maxReachedIndex
                  ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer'
              }`}
              title="Step Forward / Redo Move (Hotkey: →)"
              aria-label="Step Forward"
            >
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>
        )}

        {/* Repertoire Branch Explorer (when not sparring) */}
        {!isSparringMode && (
          <BranchExplorer
            currentVariant={currentVariant}
            currentIndex={currentIndex}
            allVariants={allVariants}
            userProgress={userProgress}
            onSelectVariant={onSelectBranch}
          />
        )}

        {/* Victory Arcade Performance Card */}
        {isCompleted && !isSparringMode && (
          <div className="w-full max-w-[775px] bg-gradient-to-b from-white to-amber-500/5 dark:from-neutral-900 dark:to-amber-500/5 border-2 border-amber-500/30 rounded-2xl p-6 mt-6 text-center animate-fadeIn shadow-xl relative overflow-hidden">
            {/* Background celebratory glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/15 blur-2xl pointer-events-none rounded-full" />

            {/* 3 Animated Stars */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3].map(s => {
                const earned = s <= (starsEarned || (precision >= 100 ? 3 : precision >= 80 ? 2 : 1));
                return (
                  <div
                    key={s}
                    className={`transition-all duration-500 transform ${
                      earned ? 'scale-110' : 'scale-90 opacity-25'
                    }`}
                  >
                    <Star
                      size={36}
                      className={`${
                        earned
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse'
                          : 'text-neutral-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Performance Title */}
            <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              <span>
                {isDemoMode
                  ? 'Demostración Completada'
                  : precision >= 100
                  ? '¡Perfección Absoluta! ⭐⭐⭐'
                  : precision >= 80
                  ? '¡Gran Ejecución Teórica! ⭐⭐'
                  : '¡Variante Conquistada! ⭐'}
              </span>
            </h3>

            {/* Subtitle / assessment */}
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-lg mx-auto">
              {isDemoMode
                ? 'Has completado la demostración guiada. ¡Ahora ponla a prueba desde la memoria en el Modo Práctica!'
                : `Completaste la variante con un ${precision}% de precisión teórica en tus movimientos.`}
            </p>

            {/* Stats & Rewards Ribbon */}
            {!isDemoMode && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 my-4">
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-1.5 shadow-xs">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                    +{lastXpGained || (precision >= 100 ? 125 : precision >= 80 ? 100 : 75)} XP
                  </span>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <span>Rango: <strong>{gamificationProfile?.title || 'Peón Curioso'}</strong></span>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <span>Total Estrellas: <strong>⭐ {gamificationProfile?.totalStars || 0}</strong></span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 justify-center mt-4">
              {/* Sparring CTA */}
              <button
                onClick={onStartSparring}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                title="Jugar la posición resultante contra el bot de IA"
              >
                <Swords size={14} />
                <span>Jugar Sparring vs Bot</span>
              </button>

              <button
                onClick={() => onRestartVariant(false)}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>{precision < 100 && !isDemoMode ? 'Reintentar para 3 ⭐' : 'Practicar de nuevo'}</span>
              </button>

              {nextVariantInChapter && (
                <button
                  onClick={() => onStartNextVariant(nextVariantInChapter)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Siguiente Variante →
                </button>
              )}

              {onOpenCampaign && (
                <button
                  onClick={onOpenCampaign}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Map size={13} />
                  <span>Ver en el Mapa de Niveles</span>
                </button>
              )}

              <button
                onClick={onResetToMenu}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Volver al Menú
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
