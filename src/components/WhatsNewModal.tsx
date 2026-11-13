import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, EyeOff, Move, Unplug, Star } from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Bumped when the notes change so the updated changelog is shown once more
export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_7_starred_games';

type ChangeKind = 'fix' | 'improvement';

interface ChangelogEntry {
  kind: ChangeKind;
  title: string;
  detail: string;
  /** Headline changes render as full banner cards at the top of the modal */
  featured?: boolean;
  icon?: 'cloak' | 'nav' | 'removed' | 'star';
  badge?: string;
  bullets?: string[];
}

// Everything shipped in this build. Rendered grouped and sorted by kind below.
const V1_7_CHANGES: ChangelogEntry[] = [
  {
    kind: 'improvement',
    title: 'Starred now holds your games too',
    detail:
      'Starred lists the games you star in Direct Games alongside the sites you star in the directory, and the counter in the navigation bar counts both.',
    featured: true,
    icon: 'star',
    badge: 'New',
    bullets: [
      'Star a game in Direct Games and it shows up on the Starred page under Starred Direct Games — no second bookmark to keep in sync.',
      'Click a starred game to jump straight into it: it opens in Direct Games and starts loading.',
      'Unstar it from either place and it disappears from both, because the Starred page and the library read the same list.',
    ],
  },
  {
    kind: 'improvement',
    title: 'Disguise the browser tab as a school page',
    detail: 'GameVault can now rename its own tab from Settings → Tab Cloaking.',
    featured: true,
    icon: 'cloak',
    badge: 'New',
    bullets: [
      'Pick a preset — Google Classroom, Google Docs, Google Sheets, Khan Academy or New Tab — or type any name up to 80 characters.',
      'Only the tab label changes. The address bar, URL, browser history, favicon and every saved link stay exactly as they are.',
      'The disguise is applied from page load, even on the lockscreen, and remembered on this device.',
    ],
  },
  {
    kind: 'improvement',
    title: 'Tab cloaking has its own Settings section',
    detail:
      'Settings → Tab Cloaking holds the on/off switch, the tab name field, preset chips and a live preview of how the tab will read, tagged Cloak active or Cloak off. A Tab Cloak line was also added to the configuration readout and the diagnostics export.',
  },
  {
    kind: 'improvement',
    title: 'Cloaking restores the real tab name when switched off',
    detail:
      'The original GameVault title is captured the first time cloaking applies, so flipping the switch off or clearing the name brings back “GameVault - Game Sites Directory” immediately.',
  },
  {
    kind: 'improvement',
    title: 'Tab cloaking is name-only — custom tab icons are gone',
    detail:
      'Icon uploads were removed entirely: cloaking no longer touches the favicon, and no icon data is stored. Any icon left in an older save is cleaned out the next time settings load.',
  },
  {
    kind: 'improvement',
    title: 'Version labels now read v1.7',
    detail:
      'Navbar badge, hero version pill, sidebar release-notes shortcut, Settings version line and this changelog header all read v1.7.',
  },
  {
    kind: 'improvement',
    title: 'Navigation placement bar',
    detail:
      'A new navigation placement bar has been implemented, allowing you to change left, right, top, or bottom.',
    featured: true,
    icon: 'nav',
    badge: 'New',
    bullets: [
      'Pick the dock in Settings → Navigation: a vertical rail on the left or right, or a horizontal bar on the top or bottom.',
      'The navigation bar moves instantly and the choice is remembered on this device.',
      'Available on screens 1024px and wider, where the bar can stay on screen — smaller screens keep the menu behind the header button.',
    ],
  },
  {
    kind: 'improvement',
    title: 'In-site browser removed',
    detail: 'The in-site browser has been removed — it might come back in the future.',
    featured: true,
    icon: 'removed',
    badge: 'Removed',
    bullets: [
      'I could not figure out how to fix it, and a browser button that does not work is useless dead code.',
      'The Browser quick-action in the header, the rail item and the per-site In-Site buttons are all gone.',
      'Every site in the directory still opens normally in your own browser through the Open Link buttons.',
    ],
  },
];

const CHANGE_GROUPS: Record<ChangeKind, { title: string; labelClass: string; dotClass: string }> = {
  fix: { title: 'Bug Fixes', labelClass: 'text-amber-400', dotClass: 'bg-amber-400' },
  improvement: { title: 'Improvements', labelClass: 'text-orange-400', dotClass: 'bg-orange-400' },
};

const CHANGE_ORDER: ChangeKind[] = ['fix', 'improvement'];

const HIGHLIGHT_ICONS = { cloak: EyeOff, nav: Move, removed: Unplug, star: Star } as const;

const FEATURED_CHANGES = V1_7_CHANGES.filter((entry) => entry.featured);

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
                <span>v1.7</span>
              </div>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
              <span>What's new in v1.7</span>
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
          {/* Highlights — headline changes get banner treatment */}
          {FEATURED_CHANGES.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400">
                Highlights
                <span className="ml-1.5 text-neutral-500">({FEATURED_CHANGES.length})</span>
              </div>

              {FEATURED_CHANGES.map((entry) => {
                const Icon = HIGHLIGHT_ICONS[entry.icon ?? 'cloak'];
                return (
                  <div
                    key={entry.title}
                    className="rounded-xl border border-orange-500/40 bg-neutral-950/80 p-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/15 text-orange-400">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-semibold text-white">{entry.title}</h3>
                          {entry.badge && (
                            <span className="inline-flex items-center gap-1 rounded bg-orange-500/20 border border-orange-500/40 px-1.5 py-0.2 text-[10px] font-mono font-bold text-orange-300">
                              {entry.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">{entry.detail}</p>
                        {entry.bullets && (
                          <ul className="text-xs text-neutral-300 leading-relaxed list-disc list-inside space-y-1">
                            {entry.bullets.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Changelog — grouped and sorted by kind */}
          {CHANGE_ORDER.map((kind) => {
            const items = V1_7_CHANGES.filter((entry) => entry.kind === kind && !entry.featured);
            if (items.length === 0) return null;
            const group = CHANGE_GROUPS[kind];

            return (
              <div key={kind} className="space-y-2">
                <div className={`text-xs font-mono font-semibold uppercase tracking-wider ${group.labelClass}`}>
                  {group.title}
                  <span className="ml-1.5 text-neutral-500">({items.length})</span>
                </div>

                <div className="space-y-1.5">
                  {items.map((entry) => (
                    <div
                      key={entry.title}
                      className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 flex items-start gap-2.5"
                    >
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${group.dotClass}`} />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">{entry.title}</div>
                        <div className="text-[11px] text-neutral-400 leading-tight">{entry.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
