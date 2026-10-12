import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ArrowRight, FileText, Menu, Smartphone, Zap, Medal, Search, AlertCircle, Globe } from 'lucide-react';
import { DiceIcon } from './DiceIcon';
import { PumpkinIcon } from './PumpkinIcon';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_3_proxy_input_modal';

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
        {/* Background Halloween glow effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Top Header - Fixed & Pinned */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3 border-b border-neutral-800/70 shrink-0 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-orange-500/20 border border-orange-500/50 px-2.5 py-0.5 text-xs font-mono font-semibold text-orange-300 shadow-sm shadow-orange-500/10">
                Major Release
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-orange-400">
                <PumpkinIcon className="h-3.5 w-3.5" />
                <span>October Halloween Update</span>
              </div>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
              <span>What's new in v1.3</span>
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

            {/* Highlight: Top Bar AnyProxy Search Launcher */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Top Bar Proxy Search Bar
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      New Feature
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Replaced duplicate top-bar navigation links with an instant web unblocker search bar (<span className="text-neutral-400 italic font-mono text-[11px]">"website links only"</span>). When you enter any link (like <strong className="text-orange-400 font-mono">youtube.com</strong>) and click enter, it automatically launches through <strong className="text-orange-400 font-mono">anyproxy.site/youtube.com</strong> using the formula <strong className="text-neutral-200 font-mono">anyproxy.site/(website link entered)</strong>. On first click, a safety disclaimer informs users that proxy traffic is operated externally by anyproxy.site.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight: Quick Return Link Problem Assistant */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <AlertCircle className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Instant Broken Link Assistance
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Smart Helper
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    If you open a game, proxy, or website link and immediately come back to GameVault within 5 seconds, an automatic prompt asks <strong className="text-white">"Whoa, way too fast! Did you run into a problem?"</strong> with a direct 1-click link to the official GameVault error report form so broken or blocked links can be reported and fixed quickly.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 0: anyproxy.site Ranked #1 Best Website */}
            <div className="rounded-xl border border-amber-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-amber-500/60 shadow-sm shadow-amber-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-400">
                  <Medal className="h-4.5 w-4.5 fill-amber-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      New Best Website: anyproxy.site (Ranked #1)
                    </h3>
                    <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-amber-300">
                      Rank #1
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Added <strong className="text-amber-300 font-mono">anyproxy.site</strong> to the directory under <strong className="text-neutral-200">Unblockers & Proxies</strong> and crowned it as the new <strong className="text-amber-300">#1 Best Website</strong>. Premier stealth proxy for bypassing school restrictions and firewalls with high-speed browsing.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 1: Halloween Seasonal Theme */}
            <div className="rounded-xl border border-orange-500/30 bg-neutral-950/70 p-3.5 transition-colors hover:border-orange-500/50">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400">
                  <PumpkinIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Halloween Seasonal Theme & Looks
                    </h3>
                    <span className="rounded bg-orange-500/15 border border-orange-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-orange-300">
                      October Edition
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Celebratory October Halloween visuals featuring glowing Jack-o'-Lantern pumpkin orange highlights, mystic witch-purple glows, and dark autumn atmospheric accents across the site.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 2: Pumpkin on the Top Bar */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Top Bar Jack-o'-Lantern Pumpkin
                    </h3>
                    <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-amber-300">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Added a carved, glowing Halloween Jack-o'-Lantern icon right next to the GameVault logo on the header bar.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 3: Mobile Layout Optimization */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  <Smartphone className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Mobile Top Bar Cramping Fixed
                    </h3>
                    <span className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sky-300">
                      Polished
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Optimized header padding and badge dimensions on mobile screens. Lock and shuffle buttons now sit comfortably without overflowing the screen.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 4: Feedback & Suggestion Forms */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Feedback Forms & Early Dev Notice
                    </h3>
                    <span className="rounded bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-purple-300">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Direct access via sidebar and the top-bar button to report broken game mirrors or submit suggestions for new unblocked games.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight: New websites indexed/added */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      New websites indexed/added
                    </h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-300">
                      Directory
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Expanded the catalog with newly indexed working proxies and game portals, adding collections with over +1,500 games and updating the top leaderboard rankings.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 5: Fast Direct Game Launches */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Zap className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Pure Client-Side Speed
                    </h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-emerald-300">
                      Optimized
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Directory links launch immediately in new tabs with zero proxy overhead, keeping games fast and responsive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bug Fixes Section */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
              Fixes & Improvements
            </div>

            <div className="space-y-1.5">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Fixed search bar mirroring on desktop screens</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Typing into or clearing the sidebar search bar no longer mirrors onto the main directory search bar (and vice versa); both now operate independently on larger screens.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Fixed mobile top bar overflow</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">The lock button and action icons no longer clip outside mobile screen boundaries</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Reverted experimental browser shell</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Restored the authentic, high-performance GameVault directory layout</div>
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
            Click the <strong className="text-orange-400">GameVault</strong> logo in the top bar anytime to view this changelog again.
          </p>
        </div>
      </div>
    </div>
  );
};
