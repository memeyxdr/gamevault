import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Menu,
  Globe,
  Layers,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Settings,
  Compass,
} from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_4_redesign_modal';

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
                <span>v1.4 Layout Redesign</span>
              </div>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
              <span>What's new in v1.4</span>
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

            {/* Highlight: Settings Feature */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Settings className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      New: Settings
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Feature
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>Added a dedicated Settings section.</li>
                    <li>Added Dark, Light, and System theme options.</li>
                    <li>Added preset and custom accent colors.</li>
                    <li>Added Performance Mode for reduced visual effects.</li>
                    <li>Added Grid and List browsing preferences.</li>
                    <li>Added an option to open external links in a new tab.</li>
                    <li>Added Reset Settings to Default.</li>
                    <li>Added Reset Local Data to restore the first-visit experience by clearing supported GameVault-specific local data.</li>
                    <li>Added persistent preferences so supported settings remain saved after refresh.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Highlight: In-Site Browser Feature */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Compass className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      New: In-Site Browser
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Feature
                    </span>
                  </div>
                  <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                    <li>Added integrated web browser directly inside the main viewing space.</li>
                    <li>Full AnyProxy gateway routing with DuckDuckGo search integration.</li>
                    <li>Navigation controls with Back history, Page Reload, and Go button.</li>
                    <li>Sandboxed iframe security with fallback pop-out for restricted websites.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Highlight: Left Navigation Icon Rail */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Menu className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Left Icon Rail Navigation
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      v1.4 Redesign
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Replaced the bulky text sidebar with a sleek, ergonomic vertical icon rail. Features comfortable button sizes with floating hover tooltips, freeing up massive screen space for the games and proxy directory.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight: One-Icon Categories Shortcut */}
            <div className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5 transition-colors hover:border-orange-500/60 shadow-sm shadow-orange-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      One-Icon Categories Space
                    </h3>
                    <span className="rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                      Quick Access
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    A single intuitive Categories icon on the left rail instantly opens the full Categories space, making it fast and effortless to explore portals, unblockers, GitHub pages, and media utilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight: Bottom Error Reporting Button */}
            <div className="rounded-xl border border-red-500/30 bg-neutral-950/80 p-3.5 transition-colors hover:border-red-500/50 shadow-sm shadow-red-500/5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/15 text-red-400">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Rail Bottom Error Report
                    </h3>
                    <span className="rounded bg-red-500/20 border border-red-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-red-300">
                      Direct Form
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Pinned right at the bottom of the navigation rail for immediate 1-click access to report blocked or malfunctioning links directly to GameVault maintainers.
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

            {/* Highlight: Protected Directory Library */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-colors hover:border-neutral-700">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-neutral-100">
                      Protected Directory Library
                    </h3>
                    <span className="rounded bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sky-300">
                      Catalog Integrity
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Removed accidental delete buttons and trash icons so that the community-curated list of links and proxies remains secure and permanent for everyone.
                  </p>
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
                  <div className="text-xs font-semibold text-neutral-200">Accent color now follows your selection</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Orange-based text, buttons, borders, gradients, and translucent highlights now use the selected accent color.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">More ways to open a site</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Added an In-Site Browser button beside Open Link in directory cards, lists, and category pages, plus the quick-return link dialog.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Directory catalog cleanup</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Removed SZVY Central v2 (Movies) from the catalog and updated the Best Websites highlight to show ranks #1–#2.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Theme-matched hover and light-mode cards</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Directory cards now keep a dark hover surface in dark mode, and Top Rated Games cards use light surfaces in light mode.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Removed site deletion trash icons</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Removed trash icons across directory and category views to prevent accidental site deletion.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Consolidated navigation into slim rail</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Eliminated wide drawer layout in favor of a slim icon rail with tooltips, giving more breathing room to games.</div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Cleaned release notes from older v1.3 items</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">Updated release notes and changelog exclusively for the v1.4 redesign.</div>
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
