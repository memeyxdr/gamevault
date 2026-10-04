import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Globe,
  ExternalLink,
  Star,
  Copy,
  Check,
  FolderOpen,
  KeyRound,
  Trophy,
  Medal,
  X,
  Shield,
} from 'lucide-react';
import { Category, GameSiteLink, DisplayDensity } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { openInAboutBlank } from '../utils/stealthLaunch';

interface SitesDirectoryProps {
  sites: GameSiteLink[];
  categories: Category[];
  onlyFavorites?: boolean;
  onlyBestGames?: boolean;
  onlyBestWebsites?: boolean;
  onToggleFavoriteSite: (siteId: string) => void;
  onDeleteSite: (siteId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SitesDirectory: React.FC<SitesDirectoryProps> = ({
  sites,
  categories,
  onlyFavorites = false,
  onlyBestGames = false,
  onlyBestWebsites = false,
  onToggleFavoriteSite,
  onDeleteSite,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'domain' | 'date'>(
    onlyBestGames || onlyBestWebsites ? 'rank' : 'name'
  );

  // View mode setting: "grid" (Blocks) vs "list" (List), persisted in localStorage
  const [viewSetting, setViewSetting] = useState<DisplayDensity>(() => {
    try {
      const saved = localStorage.getItem('gamevault_display_mode');
      return saved === 'list' || saved === 'grid' ? saved : 'grid';
    } catch {
      return 'grid';
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('gamevault_display_mode', viewSetting);
    } catch {
      // storage unavailable
    }
  }, [viewSetting]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Helper: Strictly checks for blocked status without triggering on "unblocked"
  const isActuallyBlocked = (notice?: string) => {
    if (!notice) return false;
    const lower = notice.toLowerCase();
    if (lower.includes('unblocked') && !lower.includes('blocked but') && !lower.includes('[blocked]')) {
      return false;
    }
    return lower.includes('blocked');
  };

  // Filtering: searches individual sites across name, domain, description, tags, url, specialNotice, passwordInfo
  const displayedSites = sites
    .filter((site) => {
      if (onlyFavorites && !site.isFavorite) return false;
      if (onlyBestGames && !site.isBestGame) return false;
      if (onlyBestWebsites && !site.isBestWebsite) return false;
      if (selectedCategoryId !== 'all' && site.categoryId !== selectedCategoryId) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = site.name.toLowerCase().includes(query);
        const matchesDomain = site.domain.toLowerCase().includes(query);
        const matchesDesc = site.description?.toLowerCase().includes(query);
        const matchesTag = site.tags.some((t) => t.toLowerCase().includes(query));
        const matchesUrl = site.url.toLowerCase().includes(query);
        const matchesNotice = site.specialNotice?.toLowerCase().includes(query);
        const matchesPass = site.passwordInfo?.toLowerCase().includes(query);
        return matchesName || matchesDomain || matchesDesc || matchesTag || matchesUrl || matchesNotice || matchesPass;
      }
      return true;
    })
    .sort((a, b) => {
      if (onlyBestGames || onlyBestWebsites || sortBy === 'rank') {
        const rankA = a.rank ?? 999;
        const rankB = b.rank ?? 999;
        if (rankA !== rankB) return rankA - rankB;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'domain') return a.domain.localeCompare(b.domain);
      if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onlyBestWebsites && (
              <Medal className="h-5 w-5 text-amber-400 fill-amber-400 shrink-0" />
            )}
            {onlyBestGames && (
              <Trophy className="h-5 w-5 text-yellow-400 fill-yellow-400 shrink-0" />
            )}
            <h1 className="text-xl font-bold tracking-tight text-white">
              {onlyBestWebsites
                ? 'Best Websites'
                : onlyBestGames
                ? 'Best Games Leaderboard'
                : onlyFavorites
                ? 'Starred Game Sites'
                : 'All Sites'}
            </h1>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            {onlyBestWebsites
              ? 'Curated unblocked web tools, media platforms, and essential links'
              : onlyBestGames
              ? 'Ranked community leaderboard of top unblocked games and interactive web portals'
              : onlyFavorites
              ? 'Bookmarked game site links across all categories'
              : 'Complete index of external game sites and portal links organized by category'}
          </p>
        </div>

        {/* View Mode Setting: Blocks vs List */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={() => setViewSetting('grid')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewSetting === 'grid'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Blocks</span>
            </button>
            <button
              type="button"
              onClick={() => setViewSetting('list')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewSetting === 'list'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          <div className="hidden sm:block text-xs font-mono text-neutral-500 tabular-nums">
            {displayedSites.length} of {sites.length} sites
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search individual sites, games, URLs, domains, passwords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/80 py-2 pl-9 pr-8 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category selector filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              aria-label="Filter by category"
              className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort sites"
              className="h-9 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
            >
              {(onlyBestGames || onlyBestWebsites) && (
                <option value="rank">Sort: Leaderboard Rank</option>
              )}
              <option value="name">Sort: Name (A-Z)</option>
              <option value="domain">Sort: Domain</option>
              <option value="date">Sort: Recently Added</option>
            </select>
          </div>
        )}
      </div>

      {/* Sites Content in Blocks or List */}
      {displayedSites.length > 0 ? (
        viewSetting === 'grid' ? (
          /* Blocks (Grid) View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedSites.map((site) => {
              const cat = categoryMap.get(site.categoryId);
              const isUnlockedThingy =
                site.name.toLowerCase().includes('unlocked thingy') || site.id === 'site-unlocked-thingy';
              const isKiwi = site.name.toLowerCase() === 'kiwi' || site.id === 'site-kiwi-games';

              return (
                <div
                  key={site.id}
                  className="group relative flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/70"
                >
                  <div>
                    {/* Top Row: Icon + Trophy/Medal (next to logo) + Star Toggle */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {/* Site Logo Icon */}
                        <div className="flex h-9 w-9 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-neutral-300 shrink-0">
                          {cat ? (
                            <CategoryIcon name={cat.icon} className="h-4 w-4" />
                          ) : (
                            <Globe className="h-4 w-4" />
                          )}
                        </div>

                        {/* Yellow Trophy Icon next to logo for Best Games */}
                        {site.isBestGame && (
                          <div
                            className="flex items-center gap-1 rounded bg-yellow-950/60 border border-yellow-700/60 px-1.5 py-0.5"
                            title={site.rank ? `Leaderboard #${site.rank}` : 'Best Game'}
                          >
                            <Trophy className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                            {site.rank && (
                              <span className="font-mono text-[11px] font-bold text-yellow-400">
                                #{site.rank}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Gold Medal Icon next to logo for Best Websites */}
                        {site.isBestWebsite && (
                          <div
                            className="flex items-center gap-1 rounded bg-amber-950/60 border border-amber-600/60 px-1.5 py-0.5"
                            title={site.rank ? `Best Website #${site.rank}` : 'Best Website'}
                          >
                            <Medal className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            {site.rank && (
                              <span className="font-mono text-[10px] font-bold text-amber-400">
                                #{site.rank}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(site.id, site.url)}
                          className="p-1.5 rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                          title="Copy site URL"
                        >
                          {copiedId === site.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFavoriteSite(site.id)}
                          className="p-1.5 rounded text-neutral-400 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
                          title={site.isFavorite ? 'Remove star' : 'Star site'}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              site.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Site Name & Domain */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white group-hover:text-neutral-100">
                        {site.name}
                      </h3>
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-400 font-mono truncate">
                      {site.domain}
                    </div>

                    {/* Kiwi: Prominent Red Bold Text */}
                    {isKiwi && (
                      <div className="mt-2.5 rounded border border-red-900/80 bg-red-950/40 px-2.5 py-1.5">
                        <span className="font-bold text-red-500 text-xs tracking-wide uppercase">
                          blocked but maby unblocked
                        </span>
                      </div>
                    )}

                    {/* Password Callouts (unlocked thingy, Cine-OS, etc.) */}
                    {site.passwordInfo && (
                      <div className="mt-2.5 rounded border border-amber-900/80 bg-amber-950/40 p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono text-xs">
                          <KeyRound className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>{site.passwordInfo}</span>
                        </div>
                        {isUnlockedThingy && (
                          <div className="text-[11px] font-medium text-amber-200/90 leading-snug">
                            do not add web URL when entering password
                          </div>
                        )}
                      </div>
                    )}

                    {/* Blocked or Caution Notices */}
                    {site.specialNotice && !isKiwi && (!site.passwordInfo || site.specialNotice !== site.passwordInfo) && (
                      isActuallyBlocked(site.specialNotice) ? (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-red-900/80 bg-red-950/50 px-2.5 py-1 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          <span className="font-bold text-red-400 tracking-wide uppercase">
                            [{site.specialNotice}]
                          </span>
                        </div>
                      ) : site.specialNotice.toLowerCase().includes('caution') ? (
                        <div className="mt-2 rounded bg-amber-950/40 border border-amber-800/80 px-2 py-1 text-xs text-amber-300 font-medium">
                          ⚠️ {site.specialNotice}
                        </div>
                      ) : (
                        <div className="mt-2 rounded bg-neutral-800/80 px-2 py-1 text-xs text-neutral-300 border border-neutral-700/60 font-mono font-medium">
                          {site.specialNotice}
                        </div>
                      )
                    )}

                    {/* Description / Notes */}
                    {site.description && (
                      <p className="mt-2 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {site.description}
                      </p>
                    )}

                    {/* Category Label */}
                    {cat && (
                      <button
                        type="button"
                        onClick={() => onSelectCategory(cat.id)}
                        className="mt-3 text-xs text-neutral-400 hover:text-neutral-200 transition-colors block text-left"
                      >
                        Category: {cat.name}
                      </button>
                    )}

                    {/* Tags */}
                    {site.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
                        {site.tags.map((t, i) => (
                          <React.Fragment key={t}>
                            <span>{t}</span>
                            {i < site.tags.length - 1 && <span aria-hidden="true">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Block Footer */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs gap-1.5">
                    <span className="font-mono text-[11px] text-neutral-400 truncate max-w-[90px] sm:max-w-[110px]">
                      {site.domain}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openInAboutBlank(site.url, site.name)}
                        className="inline-flex items-center gap-1 rounded bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        title="Open in about:blank (Stealth cloaked tab / popup launcher)"
                      >
                        <Shield className="h-3 w-3 text-emerald-400" />
                        <span>about:blank</span>
                      </button>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-neutral-200 hover:text-white transition-colors"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-neutral-900/30 overflow-hidden">
            {displayedSites.map((site) => {
              const cat = categoryMap.get(site.categoryId);
              const isUnlockedThingy =
                site.name.toLowerCase().includes('unlocked thingy') || site.id === 'site-unlocked-thingy';
              const isKiwi = site.name.toLowerCase() === 'kiwi' || site.id === 'site-kiwi-games';

              return (
                <div
                  key={site.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-900/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Site Logo + Trophy / Medal Icon next to it */}
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-neutral-300">
                        {cat ? (
                          <CategoryIcon name={cat.icon} className="h-4 w-4" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                      </div>

                      {site.isBestGame && (
                        <div
                          className="flex items-center gap-1 rounded bg-yellow-950/60 border border-yellow-700/60 px-1.5 py-0.5 shrink-0"
                          title={site.rank ? `Leaderboard #${site.rank}` : 'Best Game'}
                        >
                          <Trophy className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                          {site.rank && (
                            <span className="font-mono text-[10px] font-bold text-yellow-400">
                              #{site.rank}
                            </span>
                          )}
                        </div>
                      )}

                      {site.isBestWebsite && (
                        <div
                          className="flex items-center gap-1 rounded bg-amber-950/60 border border-amber-600/60 px-1.5 py-0.5 shrink-0"
                          title={site.rank ? `Best Website #${site.rank}` : 'Best Website'}
                        >
                          <Medal className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                          {site.rank && (
                            <span className="font-mono text-[10px] font-bold text-amber-400">
                              #{site.rank}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-white">{site.name}</span>
                        <span className="font-mono text-[11px] text-neutral-400">{site.domain}</span>
                        {cat && (
                          <>
                            <span aria-hidden="true" className="text-neutral-600">·</span>
                            <button
                              type="button"
                              onClick={() => onSelectCategory(cat.id)}
                              className="text-[11px] text-neutral-400 hover:text-neutral-200"
                            >
                              {cat.name}
                            </button>
                          </>
                        )}
                        {/* Kiwi: Clear Red Bold Text in List */}
                        {isKiwi && (
                          <span className="font-bold text-red-500 text-xs tracking-wide">
                            [blocked but maby unblocked]
                          </span>
                        )}
                        {/* Blocked or Caution Notices in List */}
                        {site.specialNotice && !isKiwi && (!site.passwordInfo || site.specialNotice !== site.passwordInfo) && (
                          isActuallyBlocked(site.specialNotice) ? (
                            <span className="font-bold text-red-400 text-xs tracking-wide">
                              [{site.specialNotice}]
                            </span>
                          ) : site.specialNotice.toLowerCase().includes('caution') ? (
                            <span className="text-amber-400 font-medium text-xs">
                              ⚠️ [{site.specialNotice}]
                            </span>
                          ) : (
                            <span className="text-neutral-300 font-mono text-xs">
                              [{site.specialNotice}]
                            </span>
                          )
                        )}
                      </div>

                      {/* Password notes in List */}
                      {site.passwordInfo && (
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] flex-wrap">
                          <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
                            <KeyRound className="h-3 w-3" />
                            {site.passwordInfo}
                          </span>
                          {isUnlockedThingy && (
                            <>
                              <span aria-hidden="true" className="text-neutral-600">·</span>
                              <span className="text-amber-200/90 font-medium">do not add web URL when entering password</span>
                            </>
                          )}
                        </div>
                      )}

                      {site.description && (
                        <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                          {site.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(site.id, site.url)}
                      className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === site.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavoriteSite(site.id)}
                      className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
                      title="Favorite"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          site.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => openInAboutBlank(site.url, site.name)}
                      className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      title="Open in about:blank (Stealth cloaked tab / popup launcher)"
                    >
                      <Shield className="h-3 w-3 text-emerald-400" />
                      <span>about:blank</span>
                    </button>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800/80 bg-neutral-900/20 py-20 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 mb-3">
            <FolderOpen className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-neutral-200">
            {onlyBestWebsites
              ? 'No websites listed under Best Websites'
              : onlyBestGames
              ? 'No games on the leaderboard'
              : onlyFavorites
              ? 'No starred game sites'
              : 'No game sites found'}
          </h3>

          <p className="mt-1.5 max-w-sm text-xs text-neutral-400 leading-relaxed">
            {searchQuery
              ? `No links match "${searchQuery}".`
              : 'No links to display.'}
          </p>

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="mt-4 rounded bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
