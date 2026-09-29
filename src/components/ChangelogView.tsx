import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBackToMenu: () => void;
}

export const ChangelogView: React.FC<Props> = ({ onBackToMenu }) => {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-fadeIn pb-12">
      {/* Navigation and Title */}
      <div>
        <button
          onClick={onBackToMenu}
          className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-brand-secondary transition-colors cursor-pointer mb-3"
        >
          <ArrowLeft size={14} className="mr-1" />
          Back to Main Menu
        </button>
        
        <h2 className="text-3xl font-extrabold tracking-tight">System Changelog</h2>
        <p className="text-neutral-500 dark:text-neutral-450 text-sm mt-1">
          Keep track of updates, optimizations, and new features implemented in ChessOp.
        </p>
      </div>

      {/* Version List */}
      <div className="space-y-8">
        {/* Version 1.0.3 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                v1.0.3 • Grandmaster Training Tools
              </span>
              <h3 className="text-2xl font-black mt-2 tracking-tight">Blitz Timer, Piece Styles, Blindfold & Engine Eval</h3>
            </div>
            <span className="text-xs text-neutral-450 dark:text-neutral-400 font-semibold md:text-right">
              Released: September 29, 2026
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
            <p>
              Version 1.0.3 equips you with serious player tools: train under time pressure, visualize moves blindfolded, explore divergent opening branches, and assess positions with real-time heuristic evaluations.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">⏱️ Blitz Speed Practice & Flame Streaks</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Per-Move Countdown</strong>: Train with 10s, 5s, or ultra-sharp 3s blitz timers to engrain instantaneous theoretical reflexes.</li>
                <li><strong>Dynamic Move Streak Counter</strong>: Track consecutive mistake-free moves with a burning flame badge (🔥) and track your all-time high score.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">👁️ Blindfold & Semi-Blindfold Visualization</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Grandmaster Blindfold Training</strong>: Hide all pieces to develop supreme board geometry and mental calculation skills.</li>
                <li><strong>Semi-Blindfold Mode</strong>: Hide only your pieces while keeping rival pieces visible for an optimal stepping-stone challenge.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">🌳 Repertoire Branch Explorer</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Transposition Tree</strong>: Discover all theoretical alternative moves originating from your current position across the chapter.</li>
                <li><strong>Instant Line Branching</strong>: Click any divergent move to immediately pivot training to that subvariation.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">⚙️ Offline Position Evaluator & Piece Sets</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Instant Heuristic Eval Bar</strong>: Real-time centipawn advantage bar calculated with PeSTO piece-square tables completely offline.</li>
                <li><strong>Piece Set Selection</strong>: Switch between Classic Tournament, Neo Modern, and Alpha diagram styles.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Version 1.0.2 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                v1.0.2 • Sound, SRS, PGN Import & Architecture
              </span>
              <h3 className="text-2xl font-black mt-2 tracking-tight">The Player Experience & Modular Architecture</h3>
            </div>
            <span className="text-xs text-neutral-450 dark:text-neutral-400 font-semibold md:text-right">
              Released: September 29, 2026
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
            <p>
              Version 1.0.2 transforms ChessOp into a full-fledged opening training platform with rich tactile sound feedback, intelligent Spaced Repetition (SRS), user PGN study importing, and seamless keyboard navigation.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">🎧 Synthesized Web Audio Engine</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Zero-Asset Realistic Sounds</strong>: Powered by native browser Web Audio API synthesis—requires zero external mp3 downloads, ensuring instant zero-latency clicks on mobile and desktop.</li>
                <li><strong>Distinct Acoustic Feedback</strong>: Dedicated acoustic tones for piece moves (wood tap), captures (impact snap), check warnings, error buzzers, and victory melodies.</li>
                <li><strong>One-Click Mute</strong>: Easily toggle sound with the speaker toolbar button or press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">M</kbd>.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">🧠 Spaced Repetition System (SRS)</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Adapted SM-2 Algorithm</strong>: Calculates optimal review intervals based on your clean memory practice runs.</li>
                <li><strong>Daily Review Queue</strong>: A dedicated badge on the main menu alerts you whenever variations are due for reinforcement, allowing you to train with maximum cognitive retention.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">📁 Custom PGN & Study Importer</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Drop Any PGN</strong>: Upload files directly or paste raw PGN texts from Lichess studies or ChessBase books.</li>
                <li><strong>Automatic Chapter & Subvariation Extraction</strong>: Parsed variations are instantly added to your custom repertory section and persisted in <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">localStorage</code>.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">⌨️ Complete Keyboard Shortcuts</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">→</kbd>: Undo and Redo moves in the current line.</li>
                <li><kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">Space</kbd>: Restart the active line instantly.</li>
                <li><kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">H</kbd>: Trigger move hint arrow.</li>
                <li><kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">Esc</kbd>: Return to main menu or close open modals.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">🎨 Board Theme Customizer & Data Backup</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>4 Color Schemes</strong>: Switch smoothly between Lichess Green, Warm Earth/Sepia, Natural Wood, and Classic Blue.</li>
                <li><strong>JSON Export & Import</strong>: Back up and transfer your training metrics with a single click.</li>
                <li><strong>Modular Architecture</strong>: Monolithic codebase restructured into clean, reusable components and standalone utility engines.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Version 1.0.1 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                v1.0.1 • Navigation & Board Scale
              </span>
              <h3 className="text-2xl font-black mt-2 tracking-tight">Sizing & History Navigation</h3>
            </div>
            <span className="text-xs text-neutral-450 dark:text-neutral-400 font-semibold md:text-right">
              Released: May 26, 2026
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
            <p>
              This minor release brought significant usability and visual enhancements to help you review lines with maximum ease and visual comfort!
            </p>
            
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">↩️ Move History Navigation (Undo & Redo)</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Stepping Navigation Arrows</strong>: Step backward or forward through the move sequence at any time using buttons under the chessboard.</li>
                <li><strong>History Redo Memory</strong>: Going forward is restricted to plies successfully played or seen.</li>
                <li><strong>Live Ply Counter</strong>: Renders a tracking badge in the navigation row (e.g., <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">PLY 3 / 10</code>).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wide text-xs">🔍 Expanded 775px Chessboard</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>25% Board Scale-up</strong>: Enlarged the primary Chessboard and sibling containers to <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">775px</code>.</li>
                <li><strong>Luxurious Spacious Grid</strong>: Upgraded the central training view wrapper to a massive <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">max-w-7xl</code> container.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Version 1.0.0 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                v1.0.0 • Initial Release
              </span>
              <h3 className="text-2xl font-black mt-2 tracking-tight">The Opening Repertoire Foundation</h3>
            </div>
            <span className="text-xs text-neutral-450 dark:text-neutral-400 font-semibold md:text-right">
              Released: May 26, 2026
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
            <p>
              The first official release of <strong>ChessOp</strong>: interactive Practice & Demo loops, dynamic Lichess PGN parsing, adaptive variation branching, Rumble Challenge playlist, and timeless sepia design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
