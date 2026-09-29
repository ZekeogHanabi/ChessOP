import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { OPENING_VARIANTS } from './data/openings';
import {
  OpeningVariant,
  UserProgress,
  AppView,
  PlaylistMode,
  BoardThemeId
} from './types';
import { parsePgnFile, convertPgnToVariants } from './utils/pgnParser';
import { soundManager } from './utils/sound';
import { calculateNextSrsProgress, getDueVariants } from './utils/srs';
import { BOARD_THEMES } from './utils/boardThemes';

// Modular UI Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VersionWidget } from './components/VersionWidget';
import { MainMenuView } from './components/MainMenuView';
import { ViennaDirectory } from './components/ViennaDirectory';
import { TrainingView } from './components/TrainingView';
import { ChangelogView } from './components/ChangelogView';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { BoardThemeSelectorModal } from './components/BoardThemeSelectorModal';
import { ImportPgnModal } from './components/ImportPgnModal';

function App() {
  // --- Repertoire State ---
  const [variants, setVariants] = useState<OpeningVariant[]>(OPENING_VARIANTS);
  const [customVariants, setCustomVariants] = useState<OpeningVariant[]>(() => {
    try {
      const saved = localStorage.getItem('chessop_custom_variants');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- Navigation & View State ---
  const [activeView, setActiveView] = useState<AppView>('menu');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // --- Modals State ---
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // --- Board Theme & Sound State ---
  const [boardThemeId, setBoardThemeId] = useState<BoardThemeId>(() => {
    const saved = localStorage.getItem('chessop_board_theme') as BoardThemeId;
    return saved && BOARD_THEMES[saved] ? saved : 'sepia';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());

  // --- Light / Dark Theme ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('chessop_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // --- User Progress State ---
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>(() => {
    const saved = localStorage.getItem('chessop_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Training Loop State ---
  const [currentVariant, setCurrentVariant] = useState<OpeningVariant | null>(null);
  const game = useRef<Chess>(new Chess());
  const [gameFen, setGameFen] = useState<string>('start');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [boardError, setBoardError] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [lastMoveComment, setLastMoveComment] = useState<string | null>(null);
  const [completedVariantsThisSession, setCompletedVariantsThisSession] = useState<string[]>([]);
  const [showUnpopularChapters, setShowUnpopularChapters] = useState<boolean>(false);
  const [playlistMode, setPlaylistMode] = useState<PlaylistMode>('none');
  const [playlistQueue, setPlaylistQueue] = useState<OpeningVariant[]>([]);
  const [playlistOriginalSize, setPlaylistOriginalSize] = useState<number>(0);
  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState<number>(0);
  const [showHintArrow, setShowHintArrow] = useState<boolean>(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});
  const [maxReachedIndex, setMaxReachedIndex] = useState<number>(0);

  // --- Load Dynamic PGN on Startup ---
  useEffect(() => {
    fetch('/vienna.pgn')
      .then(response => {
        if (!response.ok) throw new Error('No custom vienna.pgn found');
        return response.text();
      })
      .then(text => {
        const parsedGames = parsePgnFile(text);
        const parsedVariants: OpeningVariant[] = [];
        
        parsedGames.forEach((gameBlock, index) => {
          const variantsFromChapter = convertPgnToVariants(index + 1, gameBlock);
          parsedVariants.push(...variantsFromChapter);
        });

        if (parsedVariants.length > 0) {
          setVariants(prev => {
            const defaults = prev.filter(v => v.openingName !== 'Vienna Repertoire' && !v.isCustom);
            return [...defaults, ...parsedVariants, ...customVariants];
          });
        }
      })
      .catch(err => {
        console.log('Using default opening variations (no custom public/vienna.pgn loaded):', err);
      });
  }, [customVariants]);

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

  // --- Board Theme Sync ---
  const handleSelectBoardTheme = (id: BoardThemeId) => {
    setBoardThemeId(id);
    localStorage.setItem('chessop_board_theme', id);
  };

  // --- Sound Toggle ---
  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  // --- Sound Dispatcher Helper ---
  const playMoveAudioFeedback = (chessInstance: Chess, isCaptureMove: boolean) => {
    if (chessInstance.inCheck()) {
      soundManager.playCheck();
    } else if (isCaptureMove) {
      soundManager.playCapture();
    } else {
      soundManager.playMove();
    }
  };

  const makeRivalMoveRef = useRef<((index: number, variant: OpeningVariant, chessInstance: Chess) => void) | null>(null);

  // --- Start / Load an Opening Variant ---
  const startVariant = useCallback((variant: OpeningVariant, demoOverride?: boolean) => {
    const chessInstance = new Chess();
    game.current = chessInstance;

    if (!currentVariant || currentVariant.chapterName !== variant.chapterName) {
      setCompletedVariantsThisSession([]);
    }
    
    const progress = userProgress[variant.id];
    const shouldStartDemo = demoOverride ?? !(progress?.demoCompleted ?? false);
    
    setCurrentVariant(variant);
    setGameFen('start');
    setCurrentIndex(0);
    setIsDemoMode(shouldStartDemo);
    setIsCompleted(false);
    setBoardError(false);
    setConsecutiveMistakes(0);
    setShowHintArrow(false);
    setSelectedSquare(null);
    setOptionSquares({});
    setMaxReachedIndex(0);
    setFeedbackMessage(
      shouldStartDemo
        ? 'Demonstration Mode: Follow the arrow to learn the opening line.'
        : 'Practice Mode: Play from memory. The board will validate your moves.'
    );
    setLastMoveComment(variant.description);

    if (variant.side === 'black') {
      setTimeout(() => {
        makeRivalMoveRef.current?.(0, variant, chessInstance);
      }, 500);
    }
  }, [currentVariant, userProgress]);

  // --- Make Rival Move ---
  const makeRivalMove = (index: number, variant: OpeningVariant, chessInstance: Chess) => {
    const rivalMove = variant.moves[index];
    if (!rivalMove) return;

    try {
      const isCapture = !!chessInstance.get(rivalMove.to as Square);
      chessInstance.move({
        from: rivalMove.from,
        to: rivalMove.to,
        promotion: 'q'
      });

      playMoveAudioFeedback(chessInstance, isCapture);

      const nextIndex = index + 1;
      setCurrentIndex(nextIndex);
      setMaxReachedIndex(prev => Math.max(prev, nextIndex));
      setGameFen(chessInstance.fen());
      setConsecutiveMistakes(0);
      
      if (rivalMove.comment) {
        setLastMoveComment(rivalMove.comment);
      }

      if (nextIndex >= variant.moves.length) {
        completeTraining(variant, true);
      }
    } catch (err) {
      console.error('Error making rival move:', err);
    }
  };
  makeRivalMoveRef.current = makeRivalMove;

  // --- Drag & Drop Handler ---
  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (!currentVariant || isCompleted || boardError) return false;

    const expectedMove = currentVariant.moves[currentIndex];
    if (!expectedMove) return false;

    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (!isUserTurn) return false;

    let actualVariant = currentVariant;
    let actualExpectedMove = expectedMove;

    if (sourceSquare !== expectedMove.from || targetSquare !== expectedMove.to) {
      const alternativeVariant = variants.find(v => {
        if (v.chapterName !== currentVariant.chapterName || v.id === currentVariant.id) return false;
        if (v.moves.length <= currentIndex) return false;
        
        for (let i = 0; i < currentIndex; i++) {
          if (v.moves[i].from !== currentVariant.moves[i].from || v.moves[i].to !== currentVariant.moves[i].to) {
            return false;
          }
        }
        
        return v.moves[currentIndex].from === sourceSquare && v.moves[currentIndex].to === targetSquare;
      });

      if (alternativeVariant) {
        actualVariant = alternativeVariant;
        actualExpectedMove = alternativeVariant.moves[currentIndex];
        setCurrentVariant(alternativeVariant);
        setFeedbackMessage(`Switched to: ${alternativeVariant.name}`);
      } else {
        triggerErrorFeedback();
        return false;
      }
    }

    try {
      const isCapture = !!game.current.get(targetSquare as Square);
      const move = game.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (!move) {
        triggerErrorFeedback();
        return false;
      }

      playMoveAudioFeedback(game.current, isCapture);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setMaxReachedIndex(prev => Math.max(prev, nextIndex));
      setGameFen(game.current.fen());
      setFeedbackMessage('Correct!');
      setConsecutiveMistakes(0);
      if (actualExpectedMove.comment) {
        setLastMoveComment(actualExpectedMove.comment);
      }

      setSelectedSquare(null);
      setOptionSquares({});

      if (nextIndex >= actualVariant.moves.length) {
        completeTraining(actualVariant, true);
      } else {
        setTimeout(() => {
          makeRivalMove(nextIndex, actualVariant, game.current);
        }, 400);
      }

      return true;
    } catch {
      triggerErrorFeedback();
      return false;
    }
  };

  // --- Click to Move and Highlights Handler ---
  const handleSquareClick = (square: string) => {
    if (!currentVariant || isCompleted || boardError) return;

    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (!isUserTurn) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }

      const success = handlePieceDrop(selectedSquare, square);
      if (success) {
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }
    }

    const piece = game.current.get(square as Square);
    const expectedColor = currentVariant.side === 'white' ? 'w' : 'b';

    if (piece && piece.color === expectedColor) {
      setSelectedSquare(square);
      const rawMoves = game.current.moves({ square: square as Square, verbose: true });
      const highlightSquares: Record<string, React.CSSProperties> = {};
      
      rawMoves.forEach((m: Move) => {
        const targetPiece = game.current.get(m.to);
        highlightSquares[m.to] = {
          background: targetPiece
            ? 'radial-gradient(circle, transparent 50%, rgba(140, 106, 92, 0.45) 56%)'
            : 'radial-gradient(circle, rgba(140, 106, 92, 0.4) 20%, transparent 25%)',
          borderRadius: '50%'
        };
      });

      setOptionSquares(highlightSquares);
    } else {
      setSelectedSquare(null);
      setOptionSquares({});
    }
  };

  // --- Move Navigation Handlers (Undo / Redo) ---
  const handleNavigateBackward = useCallback(() => {
    if (!currentVariant || currentIndex <= 0 || boardError) return;

    const newIndex = currentIndex - 1;
    const tempChess = new Chess();
    for (let i = 0; i < newIndex; i++) {
      try {
        tempChess.move({
          from: currentVariant.moves[i].from,
          to: currentVariant.moves[i].to,
          promotion: 'q'
        });
      } catch (err) {
        console.error('Error rebuilding FEN during backward navigation:', err);
      }
    }
    game.current = tempChess;
    setGameFen(tempChess.fen());
    setCurrentIndex(newIndex);
    setSelectedSquare(null);
    setOptionSquares({});
    soundManager.playMove();
    
    if (newIndex === 0) {
      setLastMoveComment(currentVariant.description);
    } else {
      const lastMove = currentVariant.moves[newIndex - 1];
      if (lastMove.comment) {
        setLastMoveComment(lastMove.comment);
      }
    }
  }, [currentVariant, currentIndex, boardError]);

  const handleNavigateForward = useCallback(() => {
    if (!currentVariant || currentIndex >= maxReachedIndex || boardError) return;

    const nextMove = currentVariant.moves[currentIndex];
    if (!nextMove) return;

    try {
      const isCapture = !!game.current.get(nextMove.to as Square);
      game.current.move({
        from: nextMove.from,
        to: nextMove.to,
        promotion: 'q'
      });
      
      playMoveAudioFeedback(game.current, isCapture);

      const newIndex = currentIndex + 1;
      setGameFen(game.current.fen());
      setCurrentIndex(newIndex);
      setSelectedSquare(null);
      setOptionSquares({});
      
      if (nextMove.comment) {
        setLastMoveComment(nextMove.comment);
      }
    } catch (err) {
      console.error('Error executing forward navigation move:', err);
    }
  }, [currentVariant, currentIndex, maxReachedIndex, boardError]);

  // --- Visual & Acoustic Error Feedback ---
  const triggerErrorFeedback = () => {
    setBoardError(true);
    setFeedbackMessage('Incorrect move. Try again!');
    setConsecutiveMistakes(prev => prev + 1);
    soundManager.playError();
    
    setSelectedSquare(null);
    setOptionSquares({});
    
    setTimeout(() => {
      setBoardError(false);
    }, 800);
  };

  // --- Trigger Move Hint ---
  const triggerHint = useCallback(() => {
    if (!currentVariant || isCompleted) return;
    const expectedMove = currentVariant.moves[currentIndex];
    if (!expectedMove) return;

    setShowHintArrow(true);
    setFeedbackMessage(`Hint: The next move is ${expectedMove.notation}!`);
    soundManager.playCheck();
    
    setTimeout(() => {
      setShowHintArrow(false);
    }, 2500);
  }, [currentVariant, isCompleted, currentIndex]);

  // --- Handle Successful Training Run ---
  const completeTraining = (variant: OpeningVariant, success: boolean) => {
    soundManager.playVictory();

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

    // Calculate Spaced Repetition (SRS) metrics
    const srsUpdates = !isDemoMode
      ? calculateNextSrsProgress(currentProg, consecutiveMistakes === 0)
      : {};

    const newProgress: UserProgress = {
      ...currentProg,
      variantId: variant.id,
      attempts: newAttempts,
      successes: newSuccesses,
      demoCompleted: newDemoCompleted,
      lastTrained: new Date().toISOString(),
      ...srsUpdates
    };

    const updatedProgress = {
      ...userProgress,
      [variant.id]: newProgress
    };

    setUserProgress(updatedProgress);
    localStorage.setItem('chessop_progress', JSON.stringify(updatedProgress));

    // Handle transition in playlist modes
    if (playlistMode !== 'none') {
      const nextIdx = playlistIndex + 1;
      if (nextIdx < playlistQueue.length) {
        setPlaylistIndex(nextIdx);
        const nextVar = playlistQueue[nextIdx];
        const transitionText = playlistMode === 'rumble'
          ? `Rumble line conquered! Loading next chapter: ${nextVar.chapterName}...`
          : playlistMode === 'srs'
          ? `Memory review passed! Next due variation loading...`
          : `Main line completed! Loading next main study line: ${nextVar.chapterName}...`;
        
        setFeedbackMessage(transitionText);
        setTimeout(() => {
          startVariant(nextVar, isDemoMode);
        }, 1800);
        return;
      } else {
        setIsCompleted(true);
        const victoryText = playlistMode === 'rumble'
          ? 'Rumble Challenge Conquered! Mastered a line from all 11 principal chapters!'
          : playlistMode === 'srs'
          ? 'Daily Spaced Repetition Review Complete! Your memory is razor-sharp!'
          : 'Study Repertoire Mastered! Completed the Main Lines of all 11 principal chapters!';
        setFeedbackMessage(victoryText);
        setPlaylistMode('none');
        return;
      }
    }

    if (variant.chapterName) {
      const chapter = chapters.find(ch => ch.title === variant.chapterName);
      if (chapter && chapter.variants.length > 1) {
        const nextCompleted = [...completedVariantsThisSession, variant.id];
        setCompletedVariantsThisSession(nextCompleted);
        const allCompleted = chapter.variants.every(v => nextCompleted.includes(v.id));

        if (!allCompleted) {
          const nextUncompleted = chapter.variants.find(v => !nextCompleted.includes(v.id));
          if (nextUncompleted) {
            setFeedbackMessage(`Line completed! Auto-loading next variation: ${nextUncompleted.name}...`);
            setTimeout(() => {
              startVariant(nextUncompleted, isDemoMode);
            }, 1800);
            return;
          }
        }
      }
    }

    setIsCompleted(true);
    setFeedbackMessage('Chapter completed successfully!');
  };

  // --- Reset to Menu ---
  const resetToMenu = useCallback(() => {
    setCurrentVariant(null);
    setIsCompleted(false);
    setLastMoveComment(null);
    setFeedbackMessage(null);
    setPlaylistMode('none');
    setSelectedSquare(null);
    setOptionSquares({});
    setMaxReachedIndex(0);
    setActiveView('menu');
  }, []);

  // --- Demonstration Guide Arrow ---
  const getDemoArrows = (): string[][] | undefined => {
    if (!currentVariant || isCompleted) return undefined;
    if (!isDemoMode && !showHintArrow) return undefined;

    const expectedMove = currentVariant.moves[currentIndex];
    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (expectedMove && isUserTurn) {
      return [[expectedMove.from, expectedMove.to, 'rgba(140, 106, 92, 0.7)']];
    }
    return undefined;
  };

  // --- Calculate Global Statistics ---
  const totalAttempts = Object.values(userProgress).reduce((acc, curr) => acc + curr.attempts, 0);
  const totalSuccesses = Object.values(userProgress).reduce((acc, curr) => acc + curr.successes, 0);
  const masteredOpenings = Object.values(userProgress).filter(p => p.successes > 0).length;

  const viennaVariants = useMemo(() => {
    return variants.filter(v => v.openingName === 'Vienna Repertoire');
  }, [variants]);
  
  const viennaAttempts = viennaVariants.reduce((acc, curr) => acc + (userProgress[curr.id]?.attempts || 0), 0);
  const viennaSuccesses = viennaVariants.reduce((acc, curr) => acc + (userProgress[curr.id]?.successes || 0), 0);
  const viennaMastered = viennaVariants.filter(v => (userProgress[v.id]?.successes || 0) > 0).length;

  // Due variants for Spaced Repetition (SRS)
  const dueVariants = useMemo(() => {
    return getDueVariants(variants, userProgress);
  }, [variants, userProgress]);

  // Dynamically group variants into Chapters
  const chapters = useMemo(() => {
    const list: {
      id: string;
      title: string;
      category: string;
      description: string;
      side: 'white' | 'black';
      variants: OpeningVariant[];
      chapterIndex?: number;
    }[] = [];

    const defaultVariants = variants.filter(v => v.openingName !== 'Vienna Repertoire' && !v.isCustom);
    defaultVariants.forEach(v => {
      list.push({
        id: v.id,
        title: `${v.openingName}: ${v.name}`,
        category: 'Default Repertoire',
        description: v.description,
        side: v.side,
        variants: [v]
      });
    });

    const viennaGroups: Record<string, OpeningVariant[]> = {};
    viennaVariants.forEach(v => {
      const chName = v.chapterName || 'General Repertoire';
      if (!viennaGroups[chName]) {
        viennaGroups[chName] = [];
      }
      viennaGroups[chName].push(v);
    });

    const viennaChaptersList = Object.keys(viennaGroups).map(chName => {
      const groupVariants = viennaGroups[chName];
      const sortedGroup = [...groupVariants].sort((a, b) => {
        const aIdx = parseInt(a.id.split('-line')[1]) || 0;
        const bIdx = parseInt(b.id.split('-line')[1]) || 0;
        return aIdx - bIdx;
      });
      const firstVar = sortedGroup[0];
      return {
        id: `vienna-ch-${firstVar.chapterIndex || 0}`,
        title: chName,
        category: 'Vienna Repertoire',
        description: firstVar.description,
        side: firstVar.side,
        variants: sortedGroup,
        chapterIndex: firstVar.chapterIndex
      };
    });

    viennaChaptersList.sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0));

    return [...list, ...viennaChaptersList];
  }, [variants, viennaVariants]);

  const defaultChapters = useMemo(() => {
    return chapters.filter(ch => ch.category === 'Default Repertoire');
  }, [chapters]);

  const popularViennaChapters = useMemo(() => {
    const VIENNA_UTILITY_ORDER = [
      "Vienna Gambit: Accepted",
      "Vienna Gambit: Main Line",
      "Vienna Gambit: Declined 3... Nf6",
      "Vienna Gambit: Declined 3... d6",
      "Vienna Hybrid: Main Line",
      "Vienna Copycat: Main Line",
      "Vienna Mieses: Main Line",
      "Hamppe-Meitner Variation",
      "Jeanisch Gambit: Accepted",
      "Vienna Gambit: Paulsen Attack",
      "Vienna Open Variation"
    ];

    const getViennaUtilityScore = (title: string): number => {
      const idx = VIENNA_UTILITY_ORDER.findIndex(key => title.toLowerCase().includes(key.toLowerCase()));
      return idx === -1 ? 99 : idx;
    };

    const list = chapters.filter(ch => ch.category === 'Vienna Repertoire');
    const popularList = list.filter(ch => getViennaUtilityScore(ch.title) !== 99);
    return [...popularList].sort((a, b) => getViennaUtilityScore(a.title) - getViennaUtilityScore(b.title));
  }, [chapters]);

  const unpopularViennaChapters = useMemo(() => {
    const VIENNA_UTILITY_ORDER = [
      "Vienna Gambit: Accepted",
      "Vienna Gambit: Main Line",
      "Vienna Gambit: Declined 3... Nf6",
      "Vienna Gambit: Declined 3... d6",
      "Vienna Hybrid: Main Line",
      "Vienna Copycat: Main Line",
      "Vienna Mieses: Main Line",
      "Hamppe-Meitner Variation",
      "Jeanisch Gambit: Accepted",
      "Vienna Gambit: Paulsen Attack",
      "Vienna Open Variation"
    ];

    const isPopular = (title: string): boolean => {
      return VIENNA_UTILITY_ORDER.some(key => title.toLowerCase().includes(key.toLowerCase()));
    };

    const list = chapters.filter(ch => ch.category === 'Vienna Repertoire');
    const unpopularList = list.filter(ch => !isPopular(ch.title));
    return [...unpopularList].sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0));
  }, [chapters]);

  const nextVariantInChapter = useMemo(() => {
    if (!currentVariant || !currentVariant.chapterName) return null;
    const chapter = chapters.find(ch => ch.title === currentVariant.chapterName);
    if (!chapter) return null;
    const variantIndex = chapter.variants.findIndex(v => v.id === currentVariant.id);
    if (variantIndex !== -1 && variantIndex < chapter.variants.length - 1) {
      return chapter.variants[variantIndex + 1];
    }
    return null;
  }, [currentVariant, chapters]);

  // --- Playlist Actions ---
  const startRumbleChallenge = () => {
    if (popularViennaChapters.length === 0) return;
    const mainLines: OpeningVariant[] = [];
    popularViennaChapters.forEach(chapter => {
      if (chapter.variants.length > 0) {
        mainLines.push(chapter.variants[0]);
      }
    });

    const shuffled = [...mainLines].sort(() => Math.random() - 0.5);
    setPlaylistMode('rumble');
    setPlaylistQueue(shuffled);
    setPlaylistOriginalSize(shuffled.length);
    setPlaylistIndex(0);
    startVariant(shuffled[0], false);
  };

  const startStudyMainLines = () => {
    if (popularViennaChapters.length === 0) return;
    const mainLines: OpeningVariant[] = [];
    popularViennaChapters.forEach(chapter => {
      if (chapter.variants.length > 0) {
        mainLines.push(chapter.variants[0]);
      }
    });

    setPlaylistMode('study');
    setPlaylistQueue(mainLines);
    setPlaylistOriginalSize(mainLines.length);
    setPlaylistIndex(0);
    startVariant(mainLines[0], true);
  };

  const startSrsReview = () => {
    if (dueVariants.length === 0) return;
    setPlaylistMode('srs');
    setPlaylistQueue(dueVariants);
    setPlaylistOriginalSize(dueVariants.length);
    setPlaylistIndex(0);
    startVariant(dueVariants[0], false);
  };

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // --- Custom PGN Import Handlers ---
  const handleImportCustomPgn = (newVariants: OpeningVariant[]) => {
    const updated = [...customVariants, ...newVariants];
    setCustomVariants(updated);
    localStorage.setItem('chessop_custom_variants', JSON.stringify(updated));
    setVariants(prev => [...prev, ...newVariants]);
  };

  const handleDeleteCustomRepertoire = (openingName: string) => {
    if (window.confirm(`Delete "${openingName}" from your repertoires?`)) {
      const filtered = customVariants.filter(v => v.openingName !== openingName);
      setCustomVariants(filtered);
      localStorage.setItem('chessop_custom_variants', JSON.stringify(filtered));
      setVariants(prev => prev.filter(v => v.openingName !== openingName || !v.isCustom));
    }
  };

  // --- Backup & Restore Handlers ---
  const handleExportProgress = () => {
    const data = {
      progress: userProgress,
      customVariants,
      theme,
      boardThemeId,
      exportedAt: new Date().toISOString(),
      version: '1.0.2'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chessop_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress) {
        setUserProgress(data.progress);
        localStorage.setItem('chessop_progress', JSON.stringify(data.progress));
      }
      if (data.customVariants && Array.isArray(data.customVariants)) {
        setCustomVariants(data.customVariants);
        localStorage.setItem('chessop_custom_variants', JSON.stringify(data.customVariants));
      }
      alert('Backup restored successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid format';
      alert(`Invalid backup JSON: ${message}`);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all training statistics? This cannot be undone.')) {
      setUserProgress({});
      localStorage.removeItem('chessop_progress');
    }
  };

  // --- Global Keyboard Shortcuts Listener ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Close open modals with Esc
      if (e.key === 'Escape') {
        if (isThemeModalOpen) {
          setIsThemeModalOpen(false);
          return;
        }
        if (isImportModalOpen) {
          setIsImportModalOpen(false);
          return;
        }
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          return;
        }
        if (currentVariant) {
          resetToMenu();
          return;
        }
      }

      // Toggle sound with 'm'
      if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
        return;
      }

      // Open shortcuts dialog with '?'
      if (e.key === '?') {
        setIsShortcutsModalOpen(true);
        return;
      }

      // Training view shortcuts
      if (currentVariant) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleNavigateBackward();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNavigateForward();
        } else if (e.key === ' ') {
          e.preventDefault();
          startVariant(currentVariant, isDemoMode);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          triggerHint();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentVariant,
    isDemoMode,
    isThemeModalOpen,
    isImportModalOpen,
    isShortcutsModalOpen,
    handleNavigateBackward,
    handleNavigateForward,
    startVariant,
    triggerHint,
    resetToMenu
  ]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-brand-bg-light dark:bg-brand-bg-dark text-brand-dark dark:text-brand-secondary flex flex-col justify-between">
      {/* HEADER */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onResetToMenu={resetToMenu}
      />

      {/* CORE VIEWPORT */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {currentVariant ? (
          <TrainingView
            currentVariant={currentVariant}
            gameFen={gameFen}
            currentIndex={currentIndex}
            maxReachedIndex={maxReachedIndex}
            isDemoMode={isDemoMode}
            isCompleted={isCompleted}
            boardError={boardError}
            feedbackMessage={feedbackMessage}
            lastMoveComment={lastMoveComment}
            consecutiveMistakes={consecutiveMistakes}
            playlistMode={playlistMode}
            playlistIndex={playlistIndex}
            playlistOriginalSize={playlistOriginalSize}
            boardTheme={BOARD_THEMES[boardThemeId]}
            selectedSquare={selectedSquare}
            optionSquares={optionSquares}
            nextVariantInChapter={nextVariantInChapter}
            demoArrows={getDemoArrows()}
            onPieceDrop={handlePieceDrop}
            onSquareClick={handleSquareClick}
            onNavigateBackward={handleNavigateBackward}
            onNavigateForward={handleNavigateForward}
            onTriggerHint={triggerHint}
            onRestartVariant={(demo) => startVariant(currentVariant, demo)}
            onSwitchMode={(demo) => {
              setIsDemoMode(demo);
              startVariant(currentVariant, demo);
            }}
            onResetToMenu={resetToMenu}
            onStartNextVariant={(variant) => startVariant(variant, isDemoMode)}
            onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          />
        ) : activeView === 'menu' ? (
          <MainMenuView
            defaultChapters={defaultChapters}
            viennaVariants={viennaVariants}
            customVariants={customVariants}
            dueVariants={dueVariants}
            userProgress={userProgress}
            totalAttempts={totalAttempts}
            totalSuccesses={totalSuccesses}
            masteredOpenings={masteredOpenings}
            viennaMastered={viennaMastered}
            onStartVariant={startVariant}
            onOpenViennaDirectory={() => setActiveView('vienna-directory')}
            onStartSrsReview={startSrsReview}
            onDeleteCustomRepertoire={handleDeleteCustomRepertoire}
            onExportProgress={handleExportProgress}
            onImportProgress={handleImportProgress}
            onResetProgress={handleResetProgress}
          />
        ) : activeView === 'vienna-directory' ? (
          <ViennaDirectory
            popularChapters={popularViennaChapters}
            unpopularChapters={unpopularViennaChapters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedChapters={expandedChapters}
            toggleChapterExpand={toggleChapterExpand}
            userProgress={userProgress}
            showUnpopularChapters={showUnpopularChapters}
            setShowUnpopularChapters={setShowUnpopularChapters}
            onStartVariant={startVariant}
            onStartRumbleChallenge={startRumbleChallenge}
            onStartStudyMainLines={startStudyMainLines}
            onBackToMenu={() => { setActiveView('menu'); setSearchQuery(''); }}
            viennaStats={{
              attempts: viennaAttempts,
              successes: viennaSuccesses,
              mastered: viennaMastered,
              total: viennaVariants.length
            }}
          />
        ) : (
          <ChangelogView onBackToMenu={() => setActiveView('menu')} />
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING VERSION WIDGET */}
      <VersionWidget
        version="v1.0.2"
        onOpenChangelog={() => {
          setCurrentVariant(null);
          setIsCompleted(false);
          setPlaylistMode('none');
          setActiveView('changelog');
        }}
      />

      {/* MODALS */}
      <BoardThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={boardThemeId}
        onSelectTheme={handleSelectBoardTheme}
      />

      <ImportPgnModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCustomPgn}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}

export default App;
