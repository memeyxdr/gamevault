import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  Gamepad2,
  Accessibility,
  HardDrive,
  Compass,
  AlertTriangle,
} from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Bumped when the notes change so the updated changelog is shown once more
export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_5_1_direct_games';

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-lg max-h-[min(92vh,680px)] flex flex-col overflow-hidden rounded-2xl border border-orange-500/30 bg-neutral-900/95 shadow-2xl my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Top Header - Fixed & Pinned */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3 border-b border-neutral-800/70 shrink-0 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-orange-400">
                <span>v1.5.1</span>
              </div>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
              <span>What's new in v1.5.1</span>
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
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400">
              Update Highlights
            </div>

            {/* Highlight: Direct Games catalogue refresh */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Gamepad2 className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Direct Games Catalogue</h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      New
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>Eighteen titles now play in-app, with seventeen fresh additions and n-gon kept from the old lineup.</li>
                    <li>A search bar and Filter menu sit in the page header — narrow by category (Arcade, Driving, Shooter, Sports, Puzzle, Idle, Sandbox) or sort A–Z / Z–A.</li>
                    <li>A short credit line at the bottom links straight to the viberverse game repo.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Highlight: Direct Games */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Gamepad2 className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Direct Games</h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      New
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>Direct Games is no longer a placeholder — eight titles now play right inside GameVault: n-gon, Drive Mad, Dr1v3n Wild, Slope, Bit Planes, PolyTrack, Drift Boss, and Basket Hoop.</li>
                    <li>Games load only when you pick one. The page opens as a tile grid, so nothing downloads or starts until you press Play.</li>
                    <li>Picking a tile opens a full-view player with Back to Direct Games, Restart, and New tab. The frame fills the whole view space — no padding, no borders, no dead space around it.</li>
                    <li>More games are on the way, and there is a suggest-a-game link at the bottom of the page that opens the same form as Settings.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Highlight: Accessibility & Motion */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Accessibility className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Accessibility & Motion
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Settings
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>Reduce Motion stops animated toasts, hover glides, and smooth scrolling — including a hint when your OS already asks for it.</li>
                    <li>Compact Navigation Rail slims the icon rail so wide directories get more room.</li>
                    <li>Show Labels Under Rail Icons prints a tiny name under every rail icon, so you never have to hover to know what it does.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Highlight: Storage & Diagnostics */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <HardDrive className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Storage & Diagnostics
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Settings
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>See exactly how much GameVault keeps on this device, plus your site, category, and starred counts.</li>
                    <li>A readout of every active setting, and a Copy Diagnostics button for bug reports.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Heads Up Section */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              Heads Up
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-neutral-950/80 p-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-400">
                  <Compass className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      In-Site Browser is down
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-amber-300">
                      <AlertTriangle className="h-3 w-3" />
                      Fixing
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>The built-in browser is not working anymore, and it is actively being fixed.</li>
                    <li>Every button that used to open it now shows a short notice right in the page area — no pop-ups.</li>
                    <li>Directory links still open normally in your own browser.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Fixes & Improvements Section */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
              Fixes & Improvements
            </div>

            <div className="space-y-1.5">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Version labels now read v1.5.1</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Every remaining v1.4 tag was updated to v1.5.1 — hero version pill, changelog buttons, and the sidebar shortcut.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Active games use the entire view space</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">While a game is running, the main area drops its padding and width cap, so the frame sits flush against the rail, the navbar, and the window edges. Leaving the game restores the normal layout.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Home hero dropped the “HQ” tag</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">The heading now reads just GameVault, and it still opens this changelog when clicked.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Rail shortcuts reordered</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Direct Games moved up next to Categories, with Stars and the browser closing out the list. Rail icons still keep their full size and scroll instead of squashing together.</div>
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold py-2.5 sm:py-3 px-5 text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Got it, explore games</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>

          <p className="text-center text-[11px] text-neutral-400">
            Click the <strong className="text-orange-400">GameVault</strong> logo or version tag anytime to view this changelog again.
          </p>
        </div>
      </div>
    </div>
  );
};
