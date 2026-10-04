import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, MinusCircle, Gamepad2, ArrowRight, FileText, Menu, Shield } from 'lucide-react';
import { DiceIcon } from './DiceIcon';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_1_modal';

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
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
      localStorage.setItem(WHATS_NEW_STORAGE_KEY, 'true');
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
      aria-labelledby="whats-new-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-lg max-h-[min(92vh,680px)] flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Header - Fixed & Pinned */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3 border-b border-neutral-800/70 shrink-0 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Version Update</span>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono">
              What's new in v1.2
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="overflow-y-auto p-5 sm:p-6 py-4 space-y-4 relative z-10 focus:outline-none">
          {/* Highlights Section */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
              Update Highlights
            </div>

            {/* Highlight 1: Leadership ranking remove */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                  <MinusCircle className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Leadership ranking remove
                    </h3>
                    <span className="rounded bg-red-500/15 border border-red-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-red-300">
                      Updated
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Removed the leadership ranking system to keep the directory clean, fast, and centered around instant gaming access.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 2: Roadmap */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Gamepad2 className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      adding proxies and direct games soon
                    </h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-300">
                      Roadmap
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong className="text-neutral-300 font-medium">Roadmap:</strong> High-speed web proxies and direct in-browser game players are currently in development and planned for a future release.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 3: Feedback & Suggestion Forms */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Error report & game suggestion forms added
                    </h3>
                    <span className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sky-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Added direct links above the directory index for <strong className="text-neutral-200">GameVault error report</strong> and <strong className="text-neutral-200">GameVault Games suggestion</strong> Google Forms.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 4: Dropdown Sections in 3-Line Menu */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Menu className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Dropdown sections in 3-line menu
                    </h3>
                    <span className="rounded bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-purple-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Sidebar menu sections are now formatted as collapsible dropdown boxes, with <strong className="text-neutral-200">Directory Index</strong> open by default.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 5: Random Game / I'm Feeling Lucky Button */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <DiceIcon className="h-4.5 w-4.5 shrink-0 rounded-[3px] shadow-xs" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      "Random Game / I'm Feeling Lucky" Button
                    </h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    A quick shuffle button in the top bar that instantly picks and launches a top-rated, working game from the directory when you don't know what to play.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 6: Open in about:blank / Stealth Popup Launcher */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      "Open in about:blank" / Stealth Popup Launcher
                    </h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Open any game link inside an <strong className="text-neutral-200">about:blank</strong> tab or cloaked blob window. Many filter extensions (GoGuardian, Securly, Lightspeed) cannot inspect or log URLs opened inside about:blank, helping links avoid getting blocked or tracked in history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bug Fixes Section */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
              Bug Fixes
            </div>

            <div className="space-y-1.5">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">fixed website starred random sites</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">No sites are starred by default; items are only saved when you explicitly star them</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Fixed scrolling issue</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Header and logo no longer get covered while scrolling</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Fixed naming issue</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Changed "Browse All Games" to "Browse All Sites"</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Pinned */}
        <div className="p-4 sm:p-5 pt-3 border-t border-neutral-800/70 bg-neutral-900/95 space-y-2 shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 sm:py-3 px-5 text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Got it, explore games</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>

          <p className="text-center text-[11px] text-neutral-400">
            Click the <strong className="text-neutral-300">GameVault</strong> logo in the top bar anytime to view this changelog again.
          </p>
        </div>
      </div>
    </div>
  );
};
