import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  Compass,
  AlertTriangle,
  Star,
  History,
  Gamepad2,
} from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Bumped when the notes change so the updated changelog is shown once more
export const WHATS_NEW_STORAGE_KEY = 'gamevault_seen_v1_6_direct_games_sections';

type ChangeKind = 'fix' | 'improvement';

interface ChangelogEntry {
  kind: ChangeKind;
  title: string;
  detail: string;
  /** Headline changes render as full banner cards at the top of the modal */
  featured?: boolean;
  icon?: 'library' | 'favorites' | 'recent';
  badge?: string;
  bullets?: string[];
}

// Everything shipped in this build. Rendered grouped and sorted by kind below.
const V1_6_CHANGES: ChangelogEntry[] = [
  {
    kind: 'improvement',
    title: 'Direct Games is now a full library of 117 games',
    detail:
      'Direct Games is no longer a short list.',
    featured: true,
    icon: 'library',
    badge: '117 games',
    bullets: [
      '117 entries pulled from viberverse, up from a small handful.',
      '96 titles added in one sweep, plus Geometry Dash, Retro Bowl and Subway Surfers.',
      'Every entry launches inside GameVault, with no descriptions so the grid stays name-first.',
    ],
  },
  {
    kind: 'improvement',
    title: 'Search in Direct Games now looks at titles first',
    detail:
      'Typing in the search box ranks matches on the game name alone: an exact name wins, then a name that starts with your text, then a matching word inside the name, then any substring. The category filter stacks on top of the search, and A–Z / Z–A now only breaks ties instead of deciding the order.',
  },
  {
    kind: 'improvement',
    title: 'Favorites, pinned above the whole library',
    detail:
      'Star any game and it rises to the top.',
    featured: true,
    icon: 'favorites',
    badge: 'New',
    bullets: [
      'Every tile has a star button in its top-right corner.',
      'Starred games collect in a Favorites section above everything else, newest star first.',
      'Saved on this device, so favorites survive a restart; unstar to remove.',
    ],
  },
  {
    kind: 'improvement',
    title: 'Recently played section covering the past week',
    detail:
      'GameVault remembers what you launched.',
    featured: true,
    icon: 'recent',
    badge: 'Past 7 days',
    bullets: [
      'Every launch is logged and shown in a Recently played row under Favorites.',
      'Tiles read “Played just now” or “Played 3d ago”.',
      'Anything older than a week drops off automatically.',
    ],
  },
  {
    kind: 'improvement',
    title: 'All games divider above the library',
    detail:
      'A labeled divider reading “All games” with a live count now sits above the main grid, so you can always tell where the curated Favorites and Recently played rows end and the full library begins.',
  },
  {
    kind: 'fix',
    title: 'Lockscreen highlights follow your accent again',
    detail:
      'The passcode field focus border and ring, the key badge, and the error text were pinned to amber, which is not wired to the accent theme. They now use the accent-aware orange classes, so a purple accent glows purple instead of leaving an orange highlight behind.',
  },
  {
    kind: 'improvement',
    title: 'Unlock button now matches your accent color',
    detail:
      'The lockscreen button used a hardcoded #ff9800 fill that ignored the theme. It now uses the same accent-mapped colors as the rest of GameVault, so it repaints when you switch accents.',
  },
  {
    kind: 'improvement',
    title: 'Get code from GitHub link on the lockscreen',
    detail:
      'A small “Get code from GitHub” line now sits under the Unlock button, with a clickable GitHub icon that opens the public repository in a new tab.',
  },
  {
    kind: 'improvement',
    title: 'Phantom Purple is the new default accent',
    detail:
      'GameVault now ships in Phantom Purple (#a855f7) instead of Pumpkin Orange — buttons, highlights, focus rings, and glows all start purple. Existing installs switch once; pick any accent in Settings → Appearance to change it back.',
  },
  {
    kind: 'improvement',
    title: 'Rail labels are on by default',
    detail:
      'Show Labels Under Rail Icons is now enabled out of the box, so every nav icon prints its name underneath and you never have to hover to find out what it does. Existing installs pick it up once; turn it off in Settings → Navigation if you prefer the bare icons.',
  },
  {
    kind: 'improvement',
    title: 'Version labels now read v1.6',
    detail:
      'Every remaining v1.5.1 tag was bumped to v1.6 — navbar badge, hero version pill, sidebar release-notes shortcut, Settings version line, and this changelog header.',
  },
];

const CHANGE_GROUPS: Record<ChangeKind, { title: string; labelClass: string; dotClass: string }> = {
  fix: { title: 'Bug Fixes', labelClass: 'text-amber-400', dotClass: 'bg-amber-400' },
  improvement: { title: 'Improvements', labelClass: 'text-orange-400', dotClass: 'bg-orange-400' },
};

const CHANGE_ORDER: ChangeKind[] = ['fix', 'improvement'];

const HIGHLIGHT_ICONS = { library: Gamepad2, favorites: Star, recent: History } as const;

const FEATURED_CHANGES = V1_6_CHANGES.filter((entry) => entry.featured);

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
                <span>v1.6</span>
              </div>
            </div>
            <h2 id="whats-new-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
              <span>What's new in v1.6</span>
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

          {/* Highlights — headline changes get the same banner treatment as Heads Up */}
          {FEATURED_CHANGES.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400">
                Highlights
                <span className="ml-1.5 text-neutral-500">({FEATURED_CHANGES.length})</span>
              </div>

              {FEATURED_CHANGES.map((entry) => {
                const Icon = HIGHLIGHT_ICONS[entry.icon ?? 'library'];
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
            const items = V1_6_CHANGES.filter((entry) => entry.kind === kind && !entry.featured);
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
