import React from 'react';

interface Props {
  version: string;
  onOpenChangelog: () => void;
}

export const VersionWidget: React.FC<Props> = ({ version, onOpenChangelog }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center gap-2 text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 select-none transition-all duration-300 hover:scale-105 hover:border-brand-primary/45">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        {version}
      </span>
      <span className="text-neutral-300 dark:text-neutral-700">|</span>
      <button
        onClick={onOpenChangelog}
        className="text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer font-extrabold underline decoration-brand-primary/30 underline-offset-2"
      >
        Changelog
      </button>
    </div>
  );
};
