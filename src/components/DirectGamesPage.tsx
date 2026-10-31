import React, { useEffect, useState } from 'react';
import {
  Gamepad2,
  Globe,
  ExternalLink,
  RotateCw,
  ArrowLeft,
  Play,
  MousePointerClick,
  Search,
  SlidersHorizontal,
  Check,
  X,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { GAME_SUGGESTION_URL } from './SettingsPage';

interface DirectGamesPageProps {
  onBrowseSites?: () => void;
  /** Lets the shell know a game is on screen so it can drop its padding and hand over the whole view space. */
  onPlayingChange?: (isPlaying: boolean) => void;
}

interface DirectGame {
  id: string;
  name: string;
  description?: string;
  url: string;
  category: GameCategory;
  tags?: string[];
}

type GameCategory = 'Arcade' | 'Driving' | 'Shooter' | 'Sports' | 'Puzzle' | 'Idle' | 'Sandbox';

const GAME_CATEGORIES: GameCategory[] = [
  'Arcade',
  'Driving',
  'Shooter',
  'Sports',
  'Puzzle',
  'Idle',
  'Sandbox',
];

const CATEGORY_FILTER_OPTIONS: (GameCategory | 'all')[] = ['all', ...GAME_CATEGORIES];

const categoryLabel = (value: GameCategory | 'all') => (value === 'all' ? 'All games' : value);

type SortMode = 'default' | 'az' | 'za';

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: 'default', label: 'Default order' },
  { id: 'az', label: 'Name A–Z' },
  { id: 'za', label: 'Name Z–A' },
];

const DIRECT_GAMES: DirectGame[] = [
  {
    id: 'n-gon',
    name: 'n-gon',
    category: 'Shooter',
    url: 'https://landgreen.github.io/n-gon/',
    tags: ['shooter', 'physics', 'arena', 'browser'],
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/flappy-bird/game.html',
  },
  {
    id: 'bottle-flip',
    name: 'Bottle Flip',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bottle-flip/game.html',
  },
  {
    id: 'rooftop-snipers',
    name: 'Rooftop Snipers',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/rooftop-snipers/game.html',
  },
  {
    id: 'motox3m',
    name: 'Moto X3M',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m/game.html',
  },
  {
    id: 'basket-random',
    name: 'Basket Random',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/basket-random/game.html',
  },
  {
    id: 'tanuki-sunset',
    name: 'Tanuki Sunset',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/tanuki-sunset/game.html',
  },
  {
    id: 'snow-ride',
    name: 'Snow Ride',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/snow-ride/game.html',
  },
  {
    id: 'cluster-rush',
    name: 'Cluster Rush',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/cluster-rush/game.html',
  },
  {
    id: 'blumgi-rocket',
    name: 'Blumgi Rocket',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/blumgi-rocket/game.html',
  },
  {
    id: 'slope',
    name: 'Slope',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/slope/game.html',
  },
  {
    id: 'drift-boss',
    name: 'Drift Boss',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/drift-boss/game.html',
  },
  {
    id: 'crazy-cars',
    name: 'Crazy Cars',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/crazy-cars/game.html',
  },
  {
    id: 'cookie-clicker',
    name: 'Cookie Clicker',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/cookie-clicker/game.html',
  },
  {
    id: 'drive-mad',
    name: 'Drive Mad',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/drive-mad/game.html',
  },
  {
    id: '2048',
    name: '2048',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/2048/game.html',
  },
  {
    id: 'sandboxels',
    name: 'Sandboxels',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/sandboxels/',
  },
  {
    id: '8-ball',
    name: '8-Ball',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/8-ball/game.html',
  },
];

export const DirectGamesPage: React.FC<DirectGamesPageProps> = ({
  onBrowseSites,
  onPlayingChange,
}) => {
  const { currentAccentHex, accentRgb } = useSettings();
  const [activeGame, setActiveGame] = useState<DirectGame | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<GameCategory | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  // Tell the shell when a game is running, and always hand the space back on unmount
  useEffect(() => {
    onPlayingChange?.(activeGame !== null);
    return () => onPlayingChange?.(false);
  }, [activeGame, onPlayingChange]);

  const launchGame = (game: DirectGame) => {
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
    setActiveGame(game);
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsLoading(false);
  };

  const restartGame = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  // Search + category + sort applied to the tile grid only; the player view above is untouched
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGames = [...DIRECT_GAMES]
    .filter((game) => !normalizedQuery || game.name.toLowerCase().includes(normalizedQuery))
    .filter((game) => category === 'all' || game.category === category)
    .sort((a, b) => {
      if (sortMode === 'az') return a.name.localeCompare(b.name);
      if (sortMode === 'za') return b.name.localeCompare(a.name);
      return 0;
    });
  const activeSortLabel = SORT_OPTIONS.find((option) => option.id === sortMode)?.label ?? 'Default order';
  const filterActive = category !== 'all' || sortMode !== 'default';
  const countInCategory = (value: GameCategory | 'all') =>
    value === 'all' ? DIRECT_GAMES.length : DIRECT_GAMES.filter((game) => game.category === value).length;

  // Player view: fills the main view space, iframe loads only after a game is picked
  if (activeGame) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-neutral-950">
        {/* Player Toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/60 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={closeGame}
              title="Back to Direct Games"
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 px-2.5 text-[11px] font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Direct Games</span>
            </button>

            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
              style={{
                borderColor: `rgba(${accentRgb}, 0.45)`,
                backgroundColor: `rgba(${accentRgb}, 0.12)`,
                color: currentAccentHex,
              }}
            >
              <Gamepad2 className="h-4 w-4 stroke-[2]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">{activeGame.name}</h2>
              {activeGame.description && (
                <p className="hidden truncate text-[11px] text-neutral-400 sm:block">
                  {activeGame.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={restartGame}
              title="Restart game"
              aria-label="Restart game"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/60 text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={activeGame.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in a new tab"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 px-2.5 text-[11px] font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New tab</span>
            </a>
          </div>
        </div>

        {/* Game Frame */}
        <div className="relative min-h-0 w-full flex-1 bg-neutral-950">
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950/85 text-neutral-300">
              <div
                className="flex h-11 w-11 animate-pulse items-center justify-center rounded-2xl border"
                style={{
                  borderColor: `rgba(${accentRgb}, 0.45)`,
                  backgroundColor: `rgba(${accentRgb}, 0.12)`,
                  color: currentAccentHex,
                }}
              >
                <Gamepad2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-mono text-neutral-400">Loading {activeGame.name}…</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={activeGame.url}
            title={activeGame.name}
            onLoad={() => setIsLoading(false)}
            className="block h-full w-full border-0 bg-neutral-950"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
            allow="autoplay; fullscreen; gamepad; pointer-lock"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Player Footer Hint */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-neutral-800 bg-neutral-900/60 px-3 py-1 text-[11px] font-mono text-neutral-400">
          <span className="inline-flex items-center gap-1.5 truncate">
            <MousePointerClick className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Click the game once to capture keyboard and mouse</span>
          </span>
          {activeGame.tags && activeGame.tags.length > 0 && (
            <span className="hidden shrink-0 truncate text-neutral-500 md:inline">
              {activeGame.tags.join(' · ')}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Library view: games appear as tiles and load nothing until clicked
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Direct Games</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Pick a game to play right here
          </p>
        </div>

        {/* Search + filter settings */}
        <div className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-auto sm:max-w-md">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search games…"
              aria-label="Search direct games"
              className="h-9 w-full rounded-lg border border-neutral-800 bg-neutral-900/40 pl-8 pr-8 text-xs text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-600 [&::-webkit-search-cancel-button]:hidden"
              style={query ? { borderColor: `rgba(${accentRgb}, 0.55)` } : undefined}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                title="Clear search"
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={sortOpen}
              title={filterActive ? `Filter: ${categoryLabel(category)} · ${activeSortLabel}` : 'Filter games'}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/40 px-2.5 text-xs font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95"
              style={filterActive ? { borderColor: `rgba(${accentRgb}, 0.55)`, color: currentAccentHex } : undefined}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 max-h-[70vh] w-48 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
                  <p className="px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    Category
                  </p>
                  {CATEGORY_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCategory(option);
                        setSortOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <span>{categoryLabel(option)}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-500">{countInCategory(option)}</span>
                        {category === option && (
                          <Check className="h-3.5 w-3.5 shrink-0" style={{ color: currentAccentHex }} />
                        )}
                      </span>
                    </button>
                  ))}

                  <p className="border-t border-neutral-800 px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    Sort by
                  </p>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortMode(option.id);
                        setSortOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <span>{option.label}</span>
                      {sortMode === option.id && (
                        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: currentAccentHex }} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {onBrowseSites && (
          <button
            type="button"
            onClick={onBrowseSites}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
            style={{
              borderColor: `rgba(${accentRgb}, 0.45)`,
              backgroundColor: `rgba(${accentRgb}, 0.12)`,
              color: currentAccentHex,
            }}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Browse game sites</span>
          </button>
        )}
      </div>

      {/* Game Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibleGames.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => launchGame(game)}
            title={`Play ${game.name}`}
            className="group flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-neutral-800/80 bg-neutral-900/20 p-4 text-center transition-all hover:border-neutral-700 hover:bg-neutral-900/50 active:scale-[0.98]"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-105"
              style={{
                borderColor: `rgba(${accentRgb}, 0.45)`,
                backgroundColor: `rgba(${accentRgb}, 0.12)`,
                color: currentAccentHex,
                boxShadow: `0 4px 16px rgba(${accentRgb}, 0.15)`,
              }}
            >
              <Gamepad2 className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">{game.name}</h2>
              {game.description && (
                <p className="text-[11px] leading-relaxed text-neutral-400">{game.description}</p>
              )}
            </div>

            <span
              className="mt-auto inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all"
              style={{
                borderColor: `rgba(${accentRgb}, 0.45)`,
                backgroundColor: `rgba(${accentRgb}, 0.12)`,
                color: currentAccentHex,
              }}
            >
              <Play className="h-3 w-3" />
              <span>Play</span>
            </span>
          </button>
        ))}
      </div>

      {visibleGames.length === 0 && (
        <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/20 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-white">
            No games match
            {normalizedQuery ? ` “${query.trim()}”` : ''}
            {category !== 'all' ? ` in ${category}` : ''}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Try a different name or category, or reset the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
            style={{
              borderColor: `rgba(${accentRgb}, 0.45)`,
              backgroundColor: `rgba(${accentRgb}, 0.12)`,
              color: currentAccentHex,
            }}
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Suggestion Footnote */}
      <p className="pt-1 text-center text-[11px] text-neutral-500">
        More games are being added — you can suggest a game{' '}
        <a
          href={GAME_SUGGESTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-300"
          style={{ color: currentAccentHex }}
        >
          here*
        </a>
      </p>

      {/* Source credit */}
      <p className="pt-1 text-center text-[11px] text-neutral-500">
        all games are sourced from the github repo{' '}
        <a
          href="https://github.com/viberverse/viberverse.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-300"
          style={{ color: currentAccentHex }}
        >
          viberverse*
        </a>{' '}
        all credit to them
      </p>
    </div>
  );
};
