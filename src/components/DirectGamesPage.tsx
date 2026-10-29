import React, { useEffect, useState } from 'react';
import { Gamepad2, Globe, ExternalLink, RotateCw, ArrowLeft, Play, MousePointerClick } from 'lucide-react';
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
  description: string;
  url: string;
  tags: string[];
}

const DIRECT_GAMES: DirectGame[] = [
  {
    id: 'n-gon',
    name: 'n-gon',
    description:
      'Physics-driven arena shooter — dodge, aim, and blast your way through waves in a browser.',
    url: 'https://landgreen.github.io/n-gon/',
    tags: ['shooter', 'physics', 'arena', 'browser'],
  },
  {
    id: 'drive-mad',
    name: 'Drive Mad',
    description:
      'Stunt-driving puzzle — ease the truck across each course without flipping it over.',
    url: 'https://godzilla214.github.io/drive-mad-main/',
    tags: ['driving', 'physics', 'puzzle', 'browser'],
  },
  {
    id: 'drive13k',
    name: 'Dr1v3n Wild',
    description:
      'Arcade driving chase with procedural art, squeezed into a 13 kilobyte package.',
    url: 'https://killedbyapixel.github.io/Drive13K/',
    tags: ['driving', 'arcade', 'tiny', 'browser'],
  },
  {
    id: 'slope',
    name: 'Slope',
    description:
      'Endless downhill runner — steer a rolling ball down a twisting neon track without falling off.',
    url: 'https://www.y8.com/embed/slope',
    tags: ['arcade', 'endless runner', 'reflex', 'y8'],
  },
  {
    id: 'bit-planes',
    name: 'Bit Planes',
    description:
      'Fly a tiny plane through a procedurally generated pixel world and see how far you can get.',
    url: 'https://medv.io/bit-planes/',
    tags: ['flying', 'pixel', 'procedural', 'reflex'],
  },
  {
    id: 'poly-track',
    name: 'PolyTrack',
    description:
      'Low-poly time-trial racing — learn each track, shave your lap time, and chase the leaderboard.',
    url: 'https://polytrackfree.github.io/poly-track/',
    tags: ['racing', 'low-poly', 'time trial', '3d'],
  },
  {
    id: 'drift-boss',
    name: 'Drift Boss',
    description:
      'One-button drifting — time each tap to swing the car around the bends without leaving the road.',
    url: 'https://drift-bossonline.github.io/file/',
    tags: ['driving', 'drifting', 'one button', 'arcade'],
  },
  {
    id: 'basket-hoop',
    name: 'Basket Hoop',
    description:
      'Arcade basketball — line up each shot and sink as many hoops as you can before the clock runs out.',
    url: 'https://dnrweqffuwjtx.cloudfront.net/games/2024/construct/311/basket-hoop/index.html',
    tags: ['sports', 'basketball', 'arcade', 'skill'],
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
              <p className="hidden truncate text-[11px] text-neutral-400 sm:block">
                {activeGame.description}
              </p>
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
          <span className="hidden shrink-0 truncate text-neutral-500 md:inline">
            {activeGame.tags.join(' · ')}
          </span>
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
            Pick a game to play right here — nothing loads until you choose
          </p>
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
        {DIRECT_GAMES.map((game) => (
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
              <p className="text-[11px] leading-relaxed text-neutral-400">{game.description}</p>
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
    </div>
  );
};
