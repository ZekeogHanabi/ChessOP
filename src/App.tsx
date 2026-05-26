import { useState, useEffect, useRef, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
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
  Info,
  Search,
  ChevronDown
} from 'lucide-react';
import { OPENING_VARIANTS } from './data/openings';
import { OpeningVariant, UserProgress, MoveNode } from './types';

// --- PGN Parser Helpers ---
interface PgnHeaders {
  [key: string]: string;
}

interface ParsedPgnGame {
  headers: PgnHeaders;
  movesText: string;
}

// Splits PGN string into individual game/chapter blocks
const parsePgnFile = (pgnString: string): ParsedPgnGame[] => {
  const games: ParsedPgnGame[] = [];
  // Split games by standard PGN event header block
  const gameStrings = pgnString.split(/\n(?=\[Event )/g);

  for (const gameStr of gameStrings) {
    if (!gameStr.trim()) continue;

    const headers: PgnHeaders = {};
    const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
    let match;
    while ((match = headerRegex.exec(gameStr)) !== null) {
      headers[match[1]] = match[2];
    }

    // Extract moves text (everything after headers)
    const movesText = gameStr.replace(/\[[^\]]*\]/g, '').trim();
    if (movesText) {
      games.push({ headers, movesText });
    }
  }

  return games;
};

// Recursive backtracking parser to extract all unique branches/subvariations
const parsePgnToLines = (movesText: string): MoveNode[][] => {
  // 1. Remove Lichess eval and graphical tags like [%eval 0.25] or [%cal Ga2a3]
  const cleanText = movesText.replace(/\[%[^\]]*\]/g, '');
  
  const lines: MoveNode[][] = [];
  
  const recurse = (text: string, currentPath: MoveNode[], tempChess: Chess) => {
    let index = 0;
    const tokens = text.match(/(\(|\)|\{[^}]*\}|\d+\.+\s*|[a-zA-Z0-9#+=x-]+)/g) || [];
    
    const localChess = new Chess(tempChess.fen());
    const localPath = [...currentPath];
    
    while (index < tokens.length) {
      const token = tokens[index].trim();
      index++;
      
      if (!token || /^\d+\.+/.test(token) || token === '*' || token === '1-0' || token === '0-1' || token === '1/2-1/2') {
        continue;
      }
      
      if (token.startsWith('{')) {
        // Comment for the last move
        const comment = token.slice(1, -1).trim();
        if (localPath.length > 0 && comment) {
          localPath[localPath.length - 1].comment = comment;
        }
        continue;
      }
      
      if (token === '(') {
        // A branch starts! Find matching closing parenthesis
        let depth = 1;
        const branchStart = index;
        while (index < tokens.length && depth > 0) {
          if (tokens[index].trim() === '(') depth++;
          if (tokens[index].trim() === ')') depth--;
          index++;
        }
        
        const branchTokens = tokens.slice(branchStart, index - 1);
        const branchText = branchTokens.join(' ');
        
        // The branch is an alternative to the LAST move in localPath
        if (localPath.length > 0) {
          const parentPath = localPath.slice(0, -1);
          const parentChess = new Chess();
          for (const m of parentPath) {
            parentChess.move({ from: m.from, to: m.to, promotion: 'q' });
          }
          
          recurse(branchText, parentPath, parentChess);
        }
        continue;
      }
      
      if (token === ')') {
        continue;
      }
      
      // It is a standard move
      try {
        const move = localChess.move(token);
        if (move) {
          let comment: string | undefined = undefined;
          if (index < tokens.length && tokens[index].trim().startsWith('{')) {
            comment = tokens[index].trim().slice(1, -1).trim();
            index++;
          }
          
          localPath.push({
            from: move.from,
            to: move.to,
            notation: move.san,
            comment: comment || undefined
          });
        }
      } catch (err) {
        console.warn(`Skipping invalid move token "${token}":`, err);
        break;
      }
    }
    
    if (localPath.length > 0) {
      lines.push(localPath);
    }
  };
  
  recurse(cleanText, [], new Chess());
  return lines;
};

// Converts a parsed PGN game block to our OpeningVariant format (extracting all unique paths)
const convertPgnToVariants = (chapterIndex: number, game: ParsedPgnGame): OpeningVariant[] => {
  const event = game.headers['Event'] || game.headers['ChapterName'] || `Chapter ${chapterIndex}`;
  const side = (game.headers['Side'] || 'white').toLowerCase() as 'white' | 'black';
  const description = game.headers['Description'] || `Practice the ${event}.`;

  const lines = parsePgnToLines(game.movesText);
  const variants: OpeningVariant[] = [];

  lines.forEach((moves, lineIndex) => {
    if (moves.length === 0) return;

    let variantName = event;
    if (lines.length > 1) {
      if (lineIndex === 0) {
        variantName = `Main Line`;
      } else {
        const lastMove = moves[moves.length - 1];
        variantName = `var. ${lastMove.notation}`;
      }
    } else {
      variantName = `Main Line`;
    }

    variants.push({
      id: `vienna-pgn-ch${chapterIndex}-line${lineIndex}`,
      openingName: 'Vienna Repertoire',
      name: variantName,
      description,
      side,
      moves,
      chapterName: event,
      chapterIndex
    });
  });

  return variants;
};

function App() {
  // --- Available Variants State ---
  const [variants, setVariants] = useState<OpeningVariant[]>(OPENING_VARIANTS);
  const [activeView, setActiveView] = useState<'menu' | 'vienna-directory'>('menu');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});

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
  const [completedVariantsThisSession, setCompletedVariantsThisSession] = useState<string[]>([]);
  const [showUnpopularChapters, setShowUnpopularChapters] = useState<boolean>(false);

  // --- Load Dynamic PGN File on Startup ---
  useEffect(() => {
    fetch('/vienna.pgn')
      .then(response => {
        if (!response.ok) {
          throw new Error('No custom vienna.pgn found');
        }
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
          // Merge default hardcoded variants with dynamically parsed PGN variants
          setVariants([...OPENING_VARIANTS, ...parsedVariants]);
        }
      })
      .catch(err => {
        console.log('Using default opening variations (no custom public/vienna.pgn loaded):', err);
      });
  }, []);

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

    // Reset session completions if starting a different chapter
    if (!currentVariant || currentVariant.chapterName !== variant.chapterName) {
      setCompletedVariantsThisSession([]);
    }
    
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

  // --- Drag & Drop Handler (API v4 Signature) ---
  const handlePieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (!currentVariant || isCompleted || boardError) return false;

    const expectedMove = currentVariant.moves[currentIndex];
    if (!expectedMove) return false;

    // Validate if it is the user's turn to move based on their selected side
    const isUserTurn = currentVariant.side === 'white'
      ? currentIndex % 2 === 0
      : currentIndex % 2 === 1;

    if (!isUserTurn) return false;

    let actualVariant = currentVariant;
    let actualExpectedMove = expectedMove;

    // Check if source and target squares match the expected move
    if (sourceSquare !== expectedMove.from || targetSquare !== expectedMove.to) {
      // Look for alternative variation in the same chapter that matches the played path + this move
      const alternativeVariant = variants.find(v => {
        if (v.chapterName !== currentVariant.chapterName || v.id === currentVariant.id) return false;
        if (v.moves.length <= currentIndex) return false;
        
        // Match history
        for (let i = 0; i < currentIndex; i++) {
          if (v.moves[i].from !== currentVariant.moves[i].from || v.moves[i].to !== currentVariant.moves[i].to) {
            return false;
          }
        }
        
        // Match new move
        return v.moves[currentIndex].from === sourceSquare && v.moves[currentIndex].to === targetSquare;
      });

      if (alternativeVariant) {
        // Yes! Switch to the alternative variation dynamically
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
      if (actualExpectedMove.comment) {
        setLastMoveComment(actualExpectedMove.comment);
      }

      // Check if the line has been completed
      if (nextIndex >= actualVariant.moves.length) {
        completeTraining(actualVariant, true);
      } else {
        // Trigger automatic opponent response after 400ms
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

    // Handle transition / victory state
    if (variant.chapterName) {
      const chapter = chapters.find(ch => ch.title === variant.chapterName);
      if (chapter && chapter.variants.length > 1) {
        // Track session completion
        const nextCompleted = [...completedVariantsThisSession, variant.id];
        setCompletedVariantsThisSession(nextCompleted);

        // Check if all variants in the chapter are completed
        const allCompleted = chapter.variants.every(v => nextCompleted.includes(v.id));

        if (!allCompleted) {
          // Find the next uncompleted variant
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

    // Default: Show the final victory completion screen for the chapter
    setIsCompleted(true);
    setFeedbackMessage('Chapter completed successfully!');
  };

  // --- Return to Menu ---
  const resetToMenu = () => {
    setCurrentVariant(null);
    setIsCompleted(false);
    setLastMoveComment(null);
    setFeedbackMessage(null);
  };

  // --- Get Demonstration Guide Arrow (react-chessboard v4 double array shape) ---
  const getDemoArrows = (): string[][] | undefined => {
    if (!isDemoMode || !currentVariant || isCompleted) return undefined;

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

  // Group Vienna Variations for filtering stats
  const viennaVariants = useMemo(() => {
    return variants.filter(v => v.openingName === 'Vienna Repertoire');
  }, [variants]);
  
  // Stats specifically for Vienna Repertoire
  const viennaAttempts = viennaVariants.reduce((acc, curr) => acc + (userProgress[curr.id]?.attempts || 0), 0);
  const viennaSuccesses = viennaVariants.reduce((acc, curr) => acc + (userProgress[curr.id]?.successes || 0), 0);
  const viennaMastered = viennaVariants.filter(v => (userProgress[v.id]?.successes || 0) > 0).length;

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

    // A. Group default variants
    const defaultVariants = variants.filter(v => v.openingName !== 'Vienna Repertoire');
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

    // B. Group Vienna variants by chapterName
    const viennaGroups: { [key: string]: OpeningVariant[] } = {};
    viennaVariants.forEach(v => {
      const chName = v.chapterName || 'General Repertoire';
      if (!viennaGroups[chName]) {
        viennaGroups[chName] = [];
      }
      viennaGroups[chName].push(v);
    });

    // Convert Vienna groups to chapters, sorted by chapterIndex
    const viennaChaptersList = Object.keys(viennaGroups).map(chName => {
      const groupVariants = viennaGroups[chName];
      // Sort variants: Main Line (lineIndex 0) is first
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

    // Sort Vienna chapters by chapterIndex
    viennaChaptersList.sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0));

    return [...list, ...viennaChaptersList];
  }, [variants, viennaVariants]);

  // Extract default and Vienna chapters specifically
  const defaultChapters = useMemo(() => {
    return chapters.filter(ch => ch.category === 'Default Repertoire');
  }, [chapters]);

  // Curated list of popular theoretical chapters
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

  // Rest of the chapters in the study (not so popular)
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

  // Filter popular Vienna chapters based on search query
  const filteredPopularChapters = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return popularViennaChapters.filter(ch =>
      ch.title.toLowerCase().includes(query) ||
      ch.description.toLowerCase().includes(query)
    );
  }, [popularViennaChapters, searchQuery]);

  // Filter unpopular Vienna chapters based on search query
  const filteredUnpopularChapters = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return unpopularViennaChapters.filter(ch =>
      ch.title.toLowerCase().includes(query) ||
      ch.description.toLowerCase().includes(query)
    );
  }, [unpopularViennaChapters, searchQuery]);

  // Find the next variation in the same chapter if any
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

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const renderChapterCard = (chapter: any) => {
    const totalSuccesses = chapter.variants.reduce((acc: number, v: any) => acc + (userProgress[v.id]?.successes || 0), 0);
    const masteredCount = chapter.variants.filter((v: any) => (userProgress[v.id]?.successes || 0) > 0).length;
    const isAllMastered = masteredCount === chapter.variants.length;

    return (
      <div
        key={chapter.id}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 transition-all duration-200 shadow-sm flex flex-col justify-between hover:shadow relative overflow-hidden animate-fadeIn"
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
                onClick={() => startVariant(chapter.variants[0])}
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-sm flex items-center gap-1 cursor-pointer"
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
                  onClick={() => startVariant(chapter.variants[0])}
                  className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-sm flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Play size={12} className="fill-white" /> Train
                </button>
                
                <button
                  onClick={() => toggleChapterExpand(chapter.id)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>{expandedChapters[chapter.id] ? 'Hide' : 'Choose Variation'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${expandedChapters[chapter.id] ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expanded Subvariations List */}
              {expandedChapters[chapter.id] && (
                <div className="space-y-2 mt-3 pt-3 border-t border-neutral-150 dark:border-neutral-800/80 animate-fadeIn">
                  {chapter.variants.map((variant: any) => {
                    const prog = userProgress[variant.id];
                    const isDemoDone = prog?.demoCompleted ?? false;
                    const successes = prog?.successes ?? 0;
                    return (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-55 dark:bg-neutral-855 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800/80 transition-all text-[11px]"
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
                          onClick={() => startVariant(variant)}
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
    <div className="min-h-screen transition-colors duration-300 bg-brand-bg-light dark:bg-brand-bg-dark text-brand-dark dark:text-brand-secondary flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 py-4 px-6 md:px-12 flex justify-between items-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { resetToMenu(); setActiveView('menu'); setSearchQuery(''); }}>
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
        
        {currentVariant ? (
          /* ================= 1. TRAINING VIEW ================= */
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
                  <h3 className="text-xl font-black tracking-tight leading-tight">{currentVariant.chapterName || currentVariant.name}</h3>
                  {currentVariant.chapterName && (
                    <span className="text-xs text-neutral-400 font-medium block mt-0.5">{currentVariant.name}</span>
                  )}
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
                <Chessboard
                  position={gameFen}
                  onPieceDrop={handlePieceDrop}
                  boardOrientation={currentVariant.side}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  customArrows={getDemoArrows() as any}
                  customDarkSquareStyle={{ backgroundColor: 'var(--color-board-dark)' }}
                  customLightSquareStyle={{ backgroundColor: 'var(--color-board-light)' }}
                  animationDuration={250}
                />
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
                      {isDemoMode ? 'Try Practice Mode' : 'Practice again'}
                    </button>
                    {nextVariantInChapter && (
                      <button
                        onClick={() => {
                          startVariant(nextVariantInChapter, isDemoMode);
                        }}
                        className="px-3 py-1 rounded bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Next Variation
                      </button>
                    )}
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
        ) : activeView === 'menu' ? (
          /* ================= 2. CLEAN MAIN MENU VIEW (Najdorf, Caro-Kann, Berlin, Vienna Card) ================= */
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner / Global Stats */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                  Memory & Active Recall
                </span>
                <h2 className="text-2xl font-bold tracking-tight">Master Your Chess Openings</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  ChessOp helps you absorb chess variations through muscle memory and active recall.
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

            {/* Repertoire Categories & Clean Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Compass size={18} className="text-brand-primary" />
                Select an Opening Repertoire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A. Default Repertoires */}
                {defaultChapters.map((chapter) => {
                  const variant = chapter.variants[0];
                  const progress = userProgress[variant.id];
                  const hasCompletedDemo = progress?.demoCompleted ?? false;
                  const practiceCount = progress?.successes ?? 0;

                  return (
                    <div
                      key={chapter.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-700 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                              {variant.openingName}
                            </span>
                            <h4 className="text-lg font-bold tracking-tight mt-0.5">{variant.name}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shrink-0 ${
                            variant.side === 'white'
                              ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                              : 'bg-brand-dark text-white border border-brand-dark'
                          }`}>
                            {variant.side === 'white' ? 'White' : 'Black'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[36px]">
                          {variant.description}
                        </p>
                      </div>

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

                {/* B. Vienna Repertoire Card (PREMIUM DYNAMIC CATEGORY LINK) */}
                {viennaVariants.length > 0 && (
                  <div
                    className="bg-white dark:bg-neutral-900 border-2 border-brand-primary/20 dark:border-brand-primary/10 hover:border-brand-primary/50 dark:hover:border-brand-primary/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                            Vienna Game
                          </span>
                          <h4 className="text-lg font-black tracking-tight mt-0.5">Vienna Opening Repertoire</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                          White
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed min-h-[36px]">
                        A highly practical and active-recall repertoire for the Vienna Game (1.e4 e5 2.Nc3). Master the signature Vienna Gambit and all major lines using dynamic, chapter-level training.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center gap-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-neutral-400 font-medium">
                          {viennaMastered} / {viennaVariants.length} Mastered
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveView('vienna-directory')}
                        className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 active:scale-95 text-white font-medium text-xs tracking-wide transition-all shadow-sm flex items-center cursor-pointer font-bold"
                      >
                        <Compass size={12} className="mr-1" /> Choose Chapters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================= 3. DEDICATED VIENNA DIRECTORY EXPLORER VIEW ================= */
          <div className="space-y-6 animate-fadeIn">
            {/* Navigation and Title */}
            <div>
              <button
                onClick={() => { setActiveView('menu'); setSearchQuery(''); }}
                className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer mb-3"
              >
                <ArrowLeft size={14} className="mr-1" />
                Back to Main Menu
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Vienna Directory</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                    Explore, select, and practice all chapters and alternative subvariations parsed from your Lichess study.
                  </p>
                </div>

                {/* Vienna Specific Stats Banner */}
                <div className="flex gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-lg text-xs font-medium shadow-sm">
                  <div>
                    <span className="text-neutral-450 font-semibold block">Vienna Attempts</span>
                    <span className="text-sm font-black">{viennaAttempts}</span>
                  </div>
                  <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
                    <span className="text-neutral-450 font-semibold block">Vienna Successes</span>
                    <span className="text-sm font-black">{viennaSuccesses}</span>
                  </div>
                  <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
                    <span className="text-brand-primary font-semibold block">Mastered Variations</span>
                    <span className="text-sm font-black text-brand-primary">{viennaMastered} / {viennaVariants.length}</span>
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
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-brand-dark dark:text-brand-secondary placeholder-neutral-400"
              />
            </div>

            {/* Grid of Selectable Chapter Cards (Popular ones) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPopularChapters.length > 0 ? (
                filteredPopularChapters.map((chapter) => renderChapterCard(chapter))
              ) : searchQuery && filteredUnpopularChapters.length === 0 ? (
                <div className="col-span-full text-center py-16 text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl animate-fadeIn">
                  <Compass className="mx-auto text-neutral-350 mb-3 animate-pulse" size={36} />
                  <p className="text-sm font-medium">No chapters found matching your search</p>
                </div>
              ) : null}
            </div>

            {/* Unpopular Chapters Collapsible Section */}
            {filteredUnpopularChapters.length > 0 && (
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/80 mt-12 space-y-6">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowUnpopularChapters(!showUnpopularChapters)}
                    className="px-6 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:border-brand-primary/40 dark:hover:border-brand-primary/30 transition-all font-bold text-xs shadow-sm cursor-pointer flex items-center gap-2 select-none active:scale-[0.98] text-neutral-500 dark:text-neutral-400"
                  >
                    <span>{showUnpopularChapters ? 'Hide not so popular variations' : 'Not so popular variations'}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showUnpopularChapters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {(showUnpopularChapters || searchQuery) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {filteredUnpopularChapters.map((chapter) => renderChapterCard(chapter))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-white/30 dark:bg-neutral-900/30">
        <p>ChessOp &copy; 2026 - Minimal Open Source Chess Opening Repetitor.</p>
        <p className="mt-1 font-semibold text-neutral-500 dark:text-neutral-400">
          Designed for 100% local storage and ultra-low resource consumption.
        </p>
      </footer>
    </div>
  );
}

export default App;
