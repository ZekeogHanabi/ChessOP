import React from 'react';
import { Smartphone, Download, Share, PlusSquare, WifiOff, Zap, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
  canPromptDirectly: boolean;
}

export const InstallAppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  canPromptDirectly
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-scaleUp relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl shadow-xs border border-amber-500/30">
            <Smartphone size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Progressive Web App
            </span>
            <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Install ChessOp
            </h3>
          </div>
        </div>

        {/* App Highlights */}
        <div className="grid grid-cols-1 gap-2.5 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <WifiOff size={14} />
            </div>
            <div>
              <span className="font-black text-neutral-900 dark:text-neutral-100 block">100% Offline Training</span>
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                Master repertoires and spar with the AI on planes, subways, or without signal.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <div className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Zap size={14} />
            </div>
            <div>
              <span className="font-black text-neutral-900 dark:text-neutral-100 block">Full Screen & Native Touch</span>
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                No browser address bars, instant splash screen, and tactile haptic vibration.
              </span>
            </div>
          </div>
        </div>

        {/* Platform Specific Installation Guide */}
        {isIOS ? (
          <div className="space-y-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <span className="font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[10px] block">
              Instructions for iPhone / iPad (Safari)
            </span>
            <ol className="space-y-2 text-neutral-700 dark:text-neutral-300 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong>Share</strong> button <Share size={13} className="inline mx-0.5 text-amber-600 dark:text-amber-400" /> in Safari navigation.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={13} className="inline mx-0.5 text-amber-600 dark:text-amber-400" />.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top right corner. Done!</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            <p>
              Installing ChessOp adds an app icon to your home screen or desktop for fast, distraction-free opening practice.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          {canPromptDirectly ? (
            <button
              onClick={() => {
                onInstall();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-2xl btn-3d-gold text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
            >
              <Download size={16} />
              <span>Install ChessOp Now</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
            >
              <Check size={16} className="inline mr-1" />
              <span>Got it</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-2xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
