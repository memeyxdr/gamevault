import React from 'react';
import {
  Gamepad2,
  Trophy,
  Medal,
  ArrowRight,
  Flame,
  Compass,
  Sparkles,
  Layers,
  Star,
  ExternalLink,
} from 'lucide-react';
import { ViewMode, GameSiteLink, Category } from '../types';
import { useSettings } from '../context/SettingsContext';

interface HomePageProps {
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (categoryId: string) => void;
  categories: Category[];
  sites: GameSiteLink[];
  onOpenWhatsNew?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCategory,
  categories,
  sites,
  onOpenWhatsNew,
}) => {
  const { settings } = useSettings();
  const bestGames = sites.filter((s) => s.isBestGame).sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const bestWebsites = sites.filter((s) => s.isBestWebsite).sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const starredSites = sites.filter((s) => s.isFavorite);

  return (
    <div className="space-y-10 pb-16 pt-2">
      {/* 1. HERO BANNER - Halloween Atmospheric Looks */}
      <section className="relative overflow-hidden rounded-2xl border border-orange-950/40 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-10 shadow-2xl light-home-hero">
        {/* Halloween Jack-o'-Lantern & Witch-Purple Glows */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <Flame className="h-3.5 w-3.5" />
            <span>Official Vault Directory & Hub</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-mono flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenWhatsNew}
              className="text-left hover:text-orange-300 transition-colors cursor-pointer flex items-center gap-2"
              title="Click to view What's new in v1.5.1"
            >
              <span>GameVault</span>
            </button>
            {onOpenWhatsNew && (
              <button
                type="button"
                onClick={onOpenWhatsNew}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-orange-400 hover:bg-orange-500/20 transition-all cursor-pointer"
                title="View changelog"
              >
                <span>v1.5.1 Redesign</span>
              </button>
            )}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            Welcome to the central directory hub. Access the complete index of unblocked game links,
            stealth mirrors, top rated games, media streaming tools, and web emulators.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('all-sites')}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-all active:scale-[0.98]"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Browse All Sites ({sites.length})</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('best-games')}
              className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-all"
            >
              <Trophy className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>Top Ranked Games</span>
            </button>

            {onOpenWhatsNew && (
              <button
                type="button"
                onClick={onOpenWhatsNew}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-200 hover:border-orange-500/40 hover:text-orange-300 transition-all cursor-pointer"
              >
                <span>What's new in v1.5.1</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. DIRECTORY STATS & QUICK ACCESS BAR */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => onNavigate('all-sites')}
          className="cursor-pointer group rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-orange-500/40 hover:bg-neutral-900 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Sites</span>
            <Gamepad2 className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white group-hover:text-orange-400 transition-colors">
            {sites.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">Indexed & tested</p>
        </div>

        <div
          onClick={() => onNavigate('best-games')}
          className="cursor-pointer group rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-yellow-500/40 hover:bg-neutral-900 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Best Games</span>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-yellow-400">
            {bestGames.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">Ranked #1 to #9</p>
        </div>

        <div
          onClick={() => onNavigate('categories')}
          className="cursor-pointer group rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-purple-500/40 hover:bg-neutral-900 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Categories</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white group-hover:text-purple-400 transition-colors">
            {categories.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">Organized vaults</p>
        </div>

        <div
          onClick={() => onNavigate('favorites')}
          className="cursor-pointer group rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-amber-500/40 hover:bg-neutral-900 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Starred</span>
            <Star className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white group-hover:text-amber-400 transition-colors">
            {starredSites.length}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">Saved shortcuts</p>
        </div>
      </section>

      {/* 3. VAULT HIGHLIGHTS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">Vault Highlights</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tile 1: Best Games */}
          <div
            onClick={() => onNavigate('best-games')}
            className="cursor-pointer group rounded-xl border border-yellow-500/30 bg-neutral-900/60 p-4 transition-all hover:border-yellow-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-yellow-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-mono text-xs font-bold text-yellow-400">#1 to #10</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
              Best Games List
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              The top 10 titles including ScholarNest, unlocked thingy, and Invisible games.
            </p>
          </div>

          {/* Tile 2: Best Websites */}
          <div
            onClick={() => onNavigate('best-websites')}
            className="cursor-pointer group rounded-xl border border-amber-500/30 bg-neutral-900/60 p-4 transition-all hover:border-amber-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Medal className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="font-mono text-xs font-bold text-amber-400">#1 to #2</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
              Best Websites
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              anyproxy.site (#1) and SoundCloud (#2).
            </p>
          </div>

          {/* Tile 3: Direct Game Links */}
          <div
            onClick={() => {
              const directCat = categories.find((c) => c.slug === 'direct-links');
              if (directCat) onSelectCategory(directCat.id);
              else onNavigate('all-sites');
            }}
            className="cursor-pointer group rounded-xl border border-orange-500/30 bg-neutral-900/60 p-4 transition-all hover:border-orange-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-orange-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Gamepad2 className="h-5 w-5 text-orange-400" />
              <span className="font-mono text-xs font-bold text-orange-400">Direct Play</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">
              Direct Game Instances
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              Minecraft Classic, GeoFS, 1v1.lol, Drift Boss, and instant arcade play.
            </p>
          </div>

          {/* Tile 4: Web Tools & Emulators */}
          <div
            onClick={() => {
              const mediaCat = categories.find((c) => c.slug === 'music-web-tools');
              if (mediaCat) onSelectCategory(mediaCat.id);
              else onNavigate('all-sites');
            }}
            className="cursor-pointer group rounded-xl border border-purple-500/30 bg-neutral-900/60 p-4 transition-all hover:border-purple-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-purple-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="font-mono text-xs font-bold text-purple-400">Emulators</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
              Web Tools & Emulators
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              TurboWarp, Ruffle Flash, EmulatorJS, WebGL Fluid Sim, and Cloud PC.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED POPULAR SITES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">Top Rated Games</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('best-games')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>See Top 9</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {bestGames.slice(0, 6).map((site) => (
            <a
              key={site.id}
              href={site.url}
              target={settings.openInNewTab ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 hover:border-orange-500/40 hover:bg-neutral-900 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {site.rank && (
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/20 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                        #{site.rank}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {site.name}
                    </h4>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-orange-300 transition-colors shrink-0" />
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {site.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span className="text-orange-400 font-sans">Active Game</span>
                <span className="text-neutral-400 group-hover:text-white transition-colors">Launch ↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
