import React from 'react';
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
  Palette
} from 'lucide-react';
import {
  OpeningVariant,
  PlaylistMode,
  BoardThemeConfig,
  TimerMode,
  BlindfoldMode,
  PositionEvaluation,
  UserProgress
} from '../types';
import { BranchExplorer } from './BranchExplorer';

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
  onPieceDrop,
  onSquareClick,
  onNavigateBackward,
  onNavigateForward,
  onTriggerHint,
  onRestartVariant,
  onSwitchMode,
  onResetToMenu,
  onStartNextVariant,
  onOpenShortcutsModal
}) => {
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
              {playlistMode === 'rumble' ? (
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

        {/* Training Modes & Controls Panel */}
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

          {/* Quick Toolbar (Evaluation Bar & Blindfold Modal) */}
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

        {/* Dynamic Strategic Commentary */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 min-h-[130px] flex flex-col justify-between shadow-xs relative overflow-hidden">
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

        {/* Action Controls & Hotkey hint */}
        <div className="space-y-2">
          <button
            onClick={() => onRestartVariant(isDemoMode)}
            className="w-full py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} className="mr-1" />
            <span>Restart line (Space)</span>
          </button>

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
        {timerMode !== 'off' && !isCompleted && (
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
                  timeLeft <= 2 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-brand-primary'
                }`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Minimalist Feedback Banner & Dynamic Hint Button */}
        <div className="w-full max-w-[775px] mb-3 text-center transition-all duration-300 min-h-[44px] flex items-center justify-center gap-3">
          {feedbackMessage && (
            <span className={`text-xs font-bold flex items-center px-3 py-1 rounded-full ${
              boardError
                ? 'bg-red-500/10 text-red-500'
                : isCompleted
                ? 'bg-green-500/10 text-green-500'
                : 'bg-neutral-500/10 text-neutral-500'
            }`}>
              {boardError && <Zap size={12} className="mr-1 animate-pulse" />}
              {isCompleted && <CheckCircle2 size={12} className="mr-1" />}
              {feedbackMessage}
            </span>
          )}

          {/* Dynamic Hint Action Button */}
          {!isDemoMode && !isCompleted && consecutiveMistakes >= 3 && (
            <button
              onClick={onTriggerHint}
              className="px-5 py-2.5 rounded-xl bg-brand-primary/15 hover:bg-brand-primary/25 text-brand-primary font-black text-xs md:text-sm uppercase tracking-widest transition-all cursor-pointer animate-bounce border-2 border-brand-primary/45 shadow-md flex items-center gap-2 active:scale-95 duration-200"
              title="Reveal expected move hint (Hotkey: H)"
            >
              <span className="text-sm md:text-base">💡</span>
              <span>Get Hint (H)</span>
            </button>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full max-w-[775px] mb-4 space-y-1.5 animate-fadeIn">
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 dark:text-neutral-400 px-1 tracking-wider">
            <span>VARIATION PROGRESS</span>
            <span>{currentVariant.moves.length - currentIndex} {currentVariant.moves.length - currentIndex === 1 ? 'move' : 'moves'} remaining</span>
          </div>
          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-300/10 dark:border-neutral-700/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-brand-primary/60 via-brand-primary to-brand-primary/95 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(140,106,92,0.3)]"
              style={{ width: `${(currentIndex / currentVariant.moves.length) * 100}%` }}
            />
          </div>
        </div>

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
                : isCompleted 
                ? 'border-green-500/80 scale-[1.01]' 
                : 'border-white dark:border-neutral-850'
            }`}
          >
            <Chessboard
              position={gameFen}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={{
                ...optionSquares,
                ...(selectedSquare && {
                  [selectedSquare]: { backgroundColor: 'rgba(140, 106, 92, 0.35)' }
                })
              }}
              boardOrientation={currentVariant.side}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              customArrows={demoArrows as any}
              customDarkSquareStyle={{ backgroundColor: boardTheme.darkSquare }}
              customLightSquareStyle={{ backgroundColor: boardTheme.lightSquare }}
              customPieces={customPieces}
              animationDuration={250}
            />
          </div>
        </div>

        {/* Chessboard Navigation Controls (Backward, Counter, Forward) */}
        <div className="w-full max-w-[775px] mt-4 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 shadow-xs">
          <button
            onClick={onNavigateBackward}
            disabled={currentIndex <= 0}
            className={`flex items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all active:scale-95 shadow-xs ${
              currentIndex <= 0
                ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-brand-dark dark:text-brand-secondary font-bold'
            }`}
            title="Step Backward / Undo Move (Hotkey: ←)"
            aria-label="Step Backward"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="text-xs font-black tracking-wider text-neutral-500 uppercase select-none">
            PLY {currentIndex} / {currentVariant.moves.length}
          </div>

          <button
            onClick={onNavigateForward}
            disabled={currentIndex >= maxReachedIndex}
            className={`flex items-center justify-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all active:scale-95 shadow-xs ${
              currentIndex >= maxReachedIndex
                ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-brand-dark dark:text-brand-secondary font-bold'
            }`}
            title="Step Forward / Redo Move (Hotkey: →)"
            aria-label="Step Forward"
          >
            <ArrowLeft size={16} className="rotate-180" />
          </button>
        </div>

        {/* Repertoire Branch Explorer */}
        <BranchExplorer
          currentVariant={currentVariant}
          currentIndex={currentIndex}
          allVariants={allVariants}
          userProgress={userProgress}
          onSelectVariant={onSelectBranch}
        />

        {/* Victory Overlay Panel */}
        {isCompleted && (
          <div className="w-full max-w-[775px] bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4 mt-6 text-center animate-fadeIn shadow-xs">
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300 flex items-center justify-center">
              <Award size={16} className="mr-1 text-green-600 dark:text-green-400" />
              Excellent! You completed the variation
            </h4>
            <p className="text-xs text-green-600 dark:text-green-400/80 mt-1">
              {isDemoMode 
                ? 'You completed the demo. Now try it from memory in Practice Mode!' 
                : 'Perfect recall! Your repetition interval and accuracy have been recorded.'
              }
            </p>
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => onRestartVariant(false)}
                className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {isDemoMode ? 'Try Practice Mode' : 'Practice again'}
              </button>
              {nextVariantInChapter && (
                <button
                  onClick={() => onStartNextVariant(nextVariantInChapter)}
                  className="px-3 py-1 rounded bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Next Variation
                </button>
              )}
              <button
                onClick={onResetToMenu}
                className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
