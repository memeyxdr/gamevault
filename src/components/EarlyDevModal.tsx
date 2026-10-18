import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, ExternalLink, Lightbulb, Check } from 'lucide-react';

interface EarlyDevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EARLY_DEV_STORAGE_KEY = 'gamevault_seen_early_dev_notice_v1';

export const EarlyDevModal: React.FC<EarlyDevModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen && !isClosing) return null;

  const handleDismiss = () => {
    if (isClosing) return;
    try {
      localStorage.setItem(EARLY_DEV_STORAGE_KEY, 'true');
    } catch {
      // storage unavailable
    }
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="early-dev-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-md flex flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-neutral-900/95 shadow-2xl my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Close early development notice"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content Header with Big Warning Sign Logo */}
        <div className="p-6 sm:p-7 text-center space-y-4 relative z-10">
          {/* Big Warning Sign Logo (SVG vector, not an emoji) */}
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/10">
            <AlertTriangle className="h-9 w-9 sm:h-11 sm:w-11 text-amber-400 stroke-[2.3]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-400">
              Early Development Notice
            </div>
            <h2
              id="early-dev-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono"
            >
              Heads Up: Work In Progress!
            </h2>
          </div>

          {/* Refined and polished message */}
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2.5 text-left bg-neutral-950/60 rounded-xl p-4 border border-neutral-800/80">
            <p>
              GameVault is currently in <strong className="text-amber-300 font-semibold">early development</strong>.
              If you encounter any bugs, broken links, or blocked mirrors, please report them through the{' '}
              <strong className="text-neutral-100">Forms & Feedback</strong> section in the sidebar.
            </p>
            <p>
              Have favorite games you'd like to see added? Please submit your requests via{' '}
              <strong className="text-emerald-400 font-semibold">Game Suggestions</strong> in the forms menu!
            </p>
          </div>

          {/* Quick Access to the Forms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Report Bug</span>
              </div>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </a>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdhulN_Qrg7223ug-iI4J3KmN5nJSepxTMDyFNSov4IE4xH8A/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Lightbulb className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Suggest Game</span>
              </div>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </a>
          </div>

          {/* Dismiss button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Got It, Continue to Vault</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
