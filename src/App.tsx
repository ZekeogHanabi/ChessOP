import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard, ChessboardProvider } from 'react-chessboard';
import {
  BookOpen,
  Award,
  RotateCcw,
  Play,
  ArrowLeft,
  CheckCircle2,
  Sun,
  Moon,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { OPENING_VARIANTS } from './data/openings';
import { OpeningVariant, UserProgress } from './types';

interface PieceDropArgs {
  piece?: { isSparePiece: boolean; position: string; pieceType: string };
  sourceSquare?: string;
  targetSquare?: string | null;
}

interface PieceDragArgs {
  isSparePiece: boolean;
  piece: { pieceType: string };
  square: string | null;
}

interface ChessboardArrow {
  startSquare: string;
  endSquare: string;
  color: string;
}

function App() {
  // --- Navigation & Theme State ---
  const [currentVariant, setCurrentVariant] = useState<OpeningVariant | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('chessop_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // --- User Progress State ---
  const [userProgress, setUserProgress] = useState<{ [variantId: string]: UserProgress }>(() => {
    const saved = localStorage.getItem('chessop_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Training Loop State ---
  const game = useRef<Chess>(new Chess());
  const [gameFen, setGameFen] = useState<string>('start');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [boardError, setBoardError] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [lastMoveComment, setLastMoveComment] = useState<string | null>(null);

  // --- Theme Sync Effect ---
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chessop_theme', theme);
  }, [theme]);

  // --- Initialize / Load an Opening Variant ---
  const startVariant = (variant: OpeningVariant, demoOverride?: boolean) => {
    // Initialize a fresh clean chess.js instance
    const chessInstance = new Chess();
    game.current = chessInstance;
    
    // Determine whether we should start in Demo Mode
    const progress = userProgress[variant.id];
    const shouldStartDemo = demoOverride ?? !(progress?.demoCompleted ?? false);
    
    setCurrentVariant(variant);
    setGameFen('start');
    setCurrentIndex(0);
    setIsDemoMode(shouldStartDemo);
    setIsCompleted(false);
    setBoardError(false);
    setFeedbackMessage(
      shouldStartDemo
        ? 'Demonstration Mode: Follow the arrow to learn the opening line.'
        : 'Practice Mode: Play from memory. The board will validate your moves.'
    );
    setLastMoveComment(variant.description);

    // If the user plays as Black, the machine must make White's first move immediately
    if (variant.side === 'black') {
      setTimeout(() => {
        makeRivalMove(0, variant, chessInstance);
      }, 500);
    }
  };

  // --- Make Opponent Move ---
  const makeRivalMove = (index: number, variant: OpeningVariant, chessInstance: Chess) => {
    const rivalMove = variant.moves[index];
    if (!rivalMove) return;

    try {
      chessInstance.move({
        from: rivalMove.from,
        to: rivalMove.to,
        promotion: 'q' // auto-promote to queen for simplicity
      });

      const nextIndex = index + 1;
      setCurrentIndex(nextIndex);
      setGameFen(chessInstance.fen());
      
      if (rivalMove.comment) {
        setLastMoveComment(rivalMove.comment);
      }

      // Check if this move finishes the variation
      if (nextIndex >= variant.moves.length) {
        completeTraining(variant, true);
      }
    } catch (err) {
      console.error('Error making rival move:', err);
    }
  };

  // --- Drag & Drop Handler (API v5 and v4 compatible) ---
  const handlePieceDrop = (arg1: PieceDropArgs | string, arg2?: string): boolean => {
    if (!currentVariant || isCompleted || boardError) return false;

    let sourceSquare = '';
    let targetSquare: string | null = null;

    if (arg2 !== undefined && typeof arg1 === 'string' && typeof arg2 === 'string') {
      // Traditional three-argument format: onPieceDrop(sourceSquare, targetSquare, piece)
      sourceSquare = arg1;
      targetSquare = arg2;
    } else if (arg1 && typeof arg1 === 'object') {
      // Destructured single object format: onPieceDrop({ piece, sourceSquare, targetSquare })
      sourceSquare = arg1.sourceSquare || '';
      targetSquare = arg1.targetSquare || null;
    }

    if (!sourceSquare || !targetSquare) return false;

    const expectedMove = currentVariant.moves[currentIndex];
    if (!expectedMove) return false;

    // Validate if it is the user's turn to move based on their selected side
    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (!isUserTurn) return false;

    // Check if source and target squares match the expected move
    if (sourceSquare !== expectedMove.from || targetSquare !== expectedMove.to) {
      triggerErrorFeedback();
      return false;
    }

    try {
      // Make the move on chess.js
      const move = game.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) {
        triggerErrorFeedback();
        return false;
      }

      // Correct move: Update states
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setGameFen(game.current.fen());
      setFeedbackMessage('Correct!');
      if (expectedMove.comment) {
        setLastMoveComment(expectedMove.comment);
      }

      // Check if the line has been completed
      if (nextIndex >= currentVariant.moves.length) {
        completeTraining(currentVariant, true);
      } else {
        // Trigger automatic opponent response after 400ms
        setTimeout(() => {
          makeRivalMove(nextIndex, currentVariant, game.current);
        }, 400);
      }

      return true;
    } catch {
      triggerErrorFeedback();
      return false;
    }
  };

  // --- Visual Error Feedback ---
  const triggerErrorFeedback = () => {
    setBoardError(true);
    setFeedbackMessage('Incorrect move. Try again!');
    
    setTimeout(() => {
      setBoardError(false);
    }, 800);
  };

  // --- Handle Successful Training Run ---
  const completeTraining = (variant: OpeningVariant, success: boolean) => {
    setIsCompleted(true);
    setFeedbackMessage('Variation completed successfully!');
    
    // Save progress stats to localStorage
    const currentProg = userProgress[variant.id] || {
      variantId: variant.id,
      attempts: 0,
      successes: 0,
      demoCompleted: false,
      lastTrained: new Date().toISOString()
    };

    const newAttempts = currentProg.attempts + 1;
    const newSuccesses = success && !isDemoMode ? currentProg.successes + 1 : currentProg.successes;
    const newDemoCompleted = isDemoMode ? true : currentProg.demoCompleted;

    const newProgress: UserProgress = {
      variantId: variant.id,
      attempts: newAttempts,
      successes: newSuccesses,
      demoCompleted: newDemoCompleted,
      lastTrained: new Date().toISOString()
    };

    const updatedProgress = {
      ...userProgress,
      [variant.id]: newProgress
    };

    setUserProgress(updatedProgress);
    localStorage.setItem('chessop_progress', JSON.stringify(updatedProgress));
  };

  // --- Return to Menu ---
  const resetToMenu = () => {
    setCurrentVariant(null);
    setIsCompleted(false);
    setLastMoveComment(null);
    setFeedbackMessage(null);
  };

  // --- Get Demonstration Guide Arrow ---
  const getDemoArrows = (): ChessboardArrow[] | undefined => {
    if (!isDemoMode || !currentVariant || isCompleted) return undefined;

    const expectedMove = currentVariant.moves[currentIndex];
    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (expectedMove && isUserTurn) {
      return [{
        startSquare: expectedMove.from,
        endSquare: expectedMove.to,
        color: 'rgba(140, 106, 92, 0.7)'
      }];
    }
    return undefined;
  };

  // --- Configure react-chessboard v5 Options ---
  const getBoardOptions = () => {
    if (!currentVariant) return {};
    return {
      position: gameFen,
      onPieceDrop: handlePieceDrop,
      boardOrientation: currentVariant.side,
      arrows: getDemoArrows(),
      canDragPiece: (args: PieceDragArgs) => {
        if (!args || !args.piece || !args.piece.pieceType) return false;
        return args.piece.pieceType[0] === currentVariant.side[0];
      },
      darkSquareStyle: { backgroundColor: 'var(--color-board-dark)' },
      lightSquareStyle: { backgroundColor: 'var(--color-board-light)' },
      animationDurationInMs: 250,
    };
  };

  // --- Calculate Global Statistics ---
  const totalAttempts = Object.values(userProgress).reduce((acc, curr) => acc + curr.attempts, 0);
  const totalSuccesses = Object.values(userProgress).reduce((acc, curr) => acc + curr.successes, 0);
  const masteredOpenings = Object.values(userProgress).filter(p => p.successes > 0).length;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-brand-bg-light dark:bg-brand-bg-dark text-brand-dark dark:text-brand-secondary flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 py-4 px-6 md:px-12 flex justify-between items-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={resetToMenu}>
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ChessOp</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Opening Repertoire Trainer</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Robust Inline GitHub SVG */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            title="GitHub Repository"
          >
            <svg
              className="w-5.5 h-5.5 fill-current text-brand-dark dark:text-brand-secondary"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        
        {!currentVariant ? (
          /* ================= MENU VIEW ================= */
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner / Global Stats */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                  Memory & Repetitions
                </span>
                <h2 className="text-2xl font-bold tracking-tight">Master Your Chess Openings</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  ChessOp helps you absorb the best chess variations through muscle memory and active recall.
                  Learn theory with guided visual arrows, then practice completely from memory.
                </p>
              </div>

              {/* Quick Stats Panel */}
              <div className="grid grid-cols-3 gap-4 md:border-l border-neutral-200 dark:border-neutral-800 md:pl-8 min-w-[280px]">
                <div className="text-center md:text-left">
                  <span className="block text-xs text-neutral-400 font-medium">Attempts</span>
                  <span className="text-2xl font-bold">{totalAttempts}</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-xs text-neutral-400 font-medium">Completed</span>
                  <span className="text-2xl font-bold">{totalSuccesses}</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-xs text-neutral-400 font-medium">Mastered</span>
                  <span className="text-2xl font-bold text-brand-primary">{masteredOpenings}</span>
                </div>
              </div>
            </div>

            {/* Available Variations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Compass size={18} className="text-brand-primary" />
                Available Variations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OPENING_VARIANTS.map((variant) => {
                  const progress = userProgress[variant.id];
                  const hasCompletedDemo = progress?.demoCompleted ?? false;
                  const practiceCount = progress?.successes ?? 0;

                  return (
                    <div
                      key={variant.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                              {variant.openingName}
                            </span>
                            <h4 className="text-lg font-bold tracking-tight mt-0.5">{variant.name}</h4>
                          </div>
                          
                          {/* Trained Side Badge */}
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            variant.side === 'white' 
                              ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' 
                              : 'bg-brand-dark text-white'
                          }`}>
                            {variant.side === 'white' ? 'White' : 'Black'}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {variant.description}
                        </p>
                      </div>

                      {/* Individual Progress & CTA */}
                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center gap-4">
                        <div className="flex items-center space-x-3 text-xs">
                          {hasCompletedDemo ? (
                            <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                              <CheckCircle2 size={14} className="mr-1" /> Demo OK
                            </span>
                          ) : (
                            <span className="text-neutral-400 font-medium flex items-center">
                              <Info size={14} className="mr-1" /> Demo Pending
                            </span>
                          )}

                          {practiceCount > 0 && (
                            <span className="text-brand-primary font-semibold">
                              {practiceCount}x Completed
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => startVariant(variant)}
                          className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-sm flex items-center cursor-pointer"
                        >
                          <Play size={12} className="mr-1 fill-white" /> Train
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ================= TRAINING VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full animate-fadeIn">
            
            {/* SIDE CONTROL PANEL */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1 flex flex-col justify-center h-full">
              
              {/* Navigation & Header */}
              <div className="space-y-3">
                <button
                  onClick={resetToMenu}
                  className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Back to menu
                </button>
                
                <div>
                  <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                    {currentVariant.openingName}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight">{currentVariant.name}</h3>
                </div>
              </div>

              {/* Toggles & Modes */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Side</span>
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                    Playing as {currentVariant.side === 'white' ? 'White' : 'Black'}
                  </span>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">Practice Mode</span>
                  <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                    <button
                      onClick={() => {
                        setIsDemoMode(true);
                        startVariant(currentVariant, true);
                      }}
                      className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        isDemoMode 
                          ? 'bg-white dark:bg-neutral-700 shadow text-brand-primary' 
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      Demonstration
                    </button>
                    <button
                      onClick={() => {
                        setIsDemoMode(false);
                        startVariant(currentVariant, false);
                      }}
                      className={`py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        !isDemoMode 
                          ? 'bg-white dark:bg-neutral-700 shadow text-brand-primary' 
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      Practice
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Strategic Commentary */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 min-h-[140px] flex flex-col justify-between shadow-sm relative overflow-hidden">
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

              {/* Restart Button */}
              <button
                onClick={() => startVariant(currentVariant, isDemoMode)}
                className="w-full py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95 cursor-pointer"
              >
                <RotateCcw size={14} className="mr-1" />
                <span>Restart line</span>
              </button>
            </div>

            {/* CHESSBOARD GRAPHIC CONTAINER */}
            <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
              
              {/* Minimalist Feedback Banner */}
              <div className="w-full max-w-[480px] mb-3 text-center transition-all duration-300 min-h-[28px] flex items-center justify-center">
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
              </div>

              {/* Chessboard container with Error/Success borders */}
              <div
                className={`w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border-4 ${
                  boardError 
                    ? 'border-red-500/80 scale-[0.99] shake-animation' 
                    : isCompleted 
                    ? 'border-green-500/80 scale-[1.01]' 
                    : 'border-white dark:border-neutral-850'
                }`}
              >
                <ChessboardProvider options={getBoardOptions()}>
                  <Chessboard />
                </ChessboardProvider>
              </div>

              {/* Victory Overlay Panel */}
              {isCompleted && (
                <div className="w-full max-w-[480px] bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4 mt-6 text-center animate-fadeIn shadow-sm">
                  <h4 className="text-sm font-bold text-green-800 dark:text-green-300 flex items-center justify-center">
                    <Award size={16} className="mr-1 text-green-600 dark:text-green-400" />
                    Excellent! You memorized the variation
                  </h4>
                  <p className="text-xs text-green-600 dark:text-green-400/80 mt-1">
                    {isDemoMode 
                      ? 'You completed the demo. Now try it from memory!' 
                      : 'Perfect! You have mastered this training block.'
                    }
                  </p>
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      onClick={() => {
                        if (isDemoMode) {
                          setIsDemoMode(false);
                          startVariant(currentVariant, false);
                        } else {
                          startVariant(currentVariant, false);
                        }
                      }}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {isDemoMode ? 'Try Practice Mode' : 'Practice Again'}
                    </button>
                    <button
                      onClick={resetToMenu}
                      className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-white/30 dark:bg-neutral-900/30">
        <p>ChessOp &copy; 2026 - Minimal Open Source Chess Opening Repetitor.</p>
        <p className="mt-1 font-semibold text-neutral-500 dark:text-neutral-400">
          Designed for 100% local storage and ultra low resource consumption.
        </p>
      </footer>
    </div>
  );
}

export default App;
