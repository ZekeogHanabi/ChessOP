import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-white/30 dark:bg-neutral-900/30">
      <p>ChessOp &copy; 2026 - Minimal Open Source Chess Opening Repetitor.</p>
      <p className="mt-1 font-semibold text-neutral-500 dark:text-neutral-400">
        Designed for 100% local storage, zero servers, and ultra-low resource consumption.
      </p>
    </footer>
  );
};
