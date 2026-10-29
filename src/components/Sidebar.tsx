import React, { useState } from 'react';
import {
  Layers,
  Star,
  Globe,
  Search,
  ExternalLink,
  Trophy,
  Medal,
  Home,
  X,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  Sparkles,
  Compass,
} from 'lucide-react';
import { Category, GameSiteLink, ViewMode } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface SidebarProps {
  categories: Category[];
  sites: GameSiteLink[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  siteCountByCategory: Record<string, number>;
  totalSites: number;
  bestGamesCount: number;
  bestWebsitesCount: number;
  favoriteSitesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
  onOpenWhatsNew?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  sites,
  selectedCategoryId,
  onSelectCategory,
  currentView,
  onNavigate,
  siteCountByCategory,
  totalSites,
  bestGamesCount,
  bestWebsitesCount,
  favoriteSitesCount,
  searchQuery,
  onSearchChange,
  isOpenOnMobile,
  onCloseMobile,
  onOpenWhatsNew,
}) => {
  const query = searchQuery.trim().toLowerCase();

  // Dropdown states: Directory Index & Categories open by default for rich side taskbar experience
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isFormsOpen, setIsFormsOpen] = useState(false);

  // Search matches across categories
  const matchingCategories = categories.filter((cat) => {
    if (!query) return true;
    return cat.name.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query);
  });

  // Search matches across individual games/sites
  const matchingSites = query
    ? sites.filter((site) => {
        return (
          site.name.toLowerCase().includes(query) ||
          site.domain.toLowerCase().includes(query) ||
          site.url.toLowerCase().includes(query) ||
          (site.description && site.description.toLowerCase().includes(query)) ||
          site.tags.some((t) => t.toLowerCase().includes(query)) ||
          (site.specialNotice && site.specialNotice.toLowerCase().includes(query))
        );
      })
    : [];

  const handleSearchSiteClick = () => {
    onNavigate('all-sites');
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Expanded Wide Sidebar / Side Taskbar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-80 xl:w-96 flex-col border-r border-neutral-800/80 bg-neutral-950/98 backdrop-blur-xl p-4 sm:p-5 transition-transform duration-200 lg:static lg:flex lg:h-full lg:shrink-0 lg:overflow-y-auto lg:translate-x-0 ${
          isOpenOnMobile ? 'flex translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Taskbar Header & Status Pill */}
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-400">
              Vault Taskbar
            </span>
          </div>

          <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-orange-400">
            {totalSites} Sites
          </div>
        </div>

        {/* Global Sidebar Search Input */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search games, sites, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-sans text-neutral-100 placeholder:text-neutral-500 focus:border-orange-500/60 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 rounded-md p-0.5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Clear sidebar search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* If searching: Show Matching Individual Sites List */}
        {query ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3">
              <div className="mb-2.5 flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-xs font-semibold tracking-wide text-neutral-200">
                  Matching Sites ({matchingSites.length})
                </span>
                <button
                  type="button"
                  onClick={handleSearchSiteClick}
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
                >
                  View All
                </button>
              </div>

              {matchingSites.length > 0 ? (
                <div className="space-y-1.5">
                  {matchingSites.slice(0, 8).map((site) => (
                    <div
                      key={site.id}
                      className="group flex items-center justify-between rounded-lg p-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800/80 hover:text-white border border-transparent hover:border-neutral-700/60 transition-all"
                    >
                      <button
                        type="button"
                        onClick={handleSearchSiteClick}
                        className="truncate text-left flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {site.isBestGame && (
                            <Trophy className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                          )}
                          <span className="truncate text-white text-xs font-semibold">{site.name}</span>
                          {site.rank && (
                            <span className="text-[10px] font-mono px-1 rounded bg-yellow-500/20 text-yellow-300">
                              #{site.rank}
                            </span>
                          )}
                        </div>
                        <div className="truncate text-neutral-500 font-mono text-[11px] mt-0.5">
                          {site.domain}
                        </div>
                      </button>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-neutral-500 hover:text-orange-400 hover:bg-neutral-700/60 rounded-md shrink-0 ml-1.5 transition-colors cursor-pointer"
                        title="Open Link"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                  {matchingSites.length > 8 && (
                    <button
                      type="button"
                      onClick={handleSearchSiteClick}
                      className="w-full py-1.5 text-center text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer pt-2 border-t border-neutral-800/60"
                    >
                      + {matchingSites.length - 8} more matching sites
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-neutral-500">
                  No sites match "{searchQuery}"
                </div>
              )}
            </div>

            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3">
              <div className="mb-2 text-xs font-semibold tracking-wide text-neutral-300">
                Matching Categories ({matchingCategories.length})
              </div>
              <div className="space-y-1">
                {matchingCategories.map((category) => {
                  const count = siteCountByCategory[category.id] || 0;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(category.id);
                        onCloseMobile();
                      }}
                      className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800/80 hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <CategoryIcon name={category.icon} className="h-4 w-4 text-neutral-400 group-hover:text-orange-400" />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className="font-mono text-xs tabular-nums text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Normal State: Rich Side Taskbar Sections */
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
            {/* Section 1: Main Directory Navigation Taskbar Box */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/50 overflow-hidden shadow-sm transition-colors hover:border-neutral-700">
              <button
                type="button"
                onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isDirectoryOpen}
              >
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-orange-400" />
                  <span>Directory Index</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                    isDirectoryOpen ? 'rotate-180 text-orange-400' : ''
                  }`}
                />
              </button>

              {isDirectoryOpen && (
                <div className="p-2 pt-0 space-y-1 border-t border-neutral-800/60">
                  {/* 0. Home / HQ */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'home'
                        ? 'bg-orange-500/15 border border-orange-500/50 text-orange-200 shadow-[0_0_12px_rgba(234,88,12,0.15)]'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className={`h-4 w-4 ${currentView === 'home' ? 'text-orange-400' : 'text-neutral-400'}`} />
                      <span>Home Hub</span>
                    </div>
                    <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-mono text-orange-300 font-bold border border-orange-500/30">
                      HQ
                    </span>
                  </button>

                  {/* 1. All Sites */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('all-sites');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'all-sites'
                        ? 'bg-neutral-800 border border-neutral-700 text-white shadow-sm'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-neutral-400" />
                      <span>All Sites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-neutral-400 bg-neutral-800/90 px-2 py-0.5 rounded">
                      {totalSites}
                    </span>
                  </button>

                  {/* 2. Best Games */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('best-games');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'best-games'
                        ? 'bg-yellow-500/15 border border-yellow-500/40 text-yellow-200 shadow-[0_0_12px_rgba(234,179,8,0.15)]'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>Best Games Leaderboard</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded">
                      Top {bestGamesCount}
                    </span>
                  </button>

                  {/* 3. Best Websites */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('best-websites');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'best-websites'
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Medal className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span>Best Websites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {bestWebsitesCount}
                    </span>
                  </button>

                  {/* 4. All Categories */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('categories');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'categories' && !selectedCategoryId
                        ? 'bg-neutral-800 border border-neutral-700 text-white shadow-sm'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-neutral-400" />
                      <span>All Categories</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-neutral-400 bg-neutral-800/90 px-2 py-0.5 rounded">
                      {categories.length}
                    </span>
                  </button>

                  {/* 5. Starred Sites */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('favorites');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      currentView === 'favorites'
                        ? 'bg-orange-500/15 border border-orange-500/40 text-orange-200 shadow-[0_0_12px_rgba(234,88,12,0.15)]'
                        : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Star className="h-4 w-4 text-orange-400 fill-orange-400/40" />
                      <span>Starred Sites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-orange-400 font-bold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                      {favoriteSitesCount}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Categories Vault Box */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/50 overflow-hidden shadow-sm transition-colors hover:border-neutral-700">
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isCategoriesOpen}
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-neutral-400" />
                  <span>Site Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400 border border-neutral-700/50">
                    {categories.length}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                      isCategoriesOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </div>
              </button>

              {isCategoriesOpen && (
                <div className="p-2 pt-0 space-y-1 border-t border-neutral-800/60 max-h-72 overflow-y-auto">
                  {categories.map((category) => {
                    const isSelected =
                      currentView === 'category-detail' && selectedCategoryId === category.id;
                    const count = siteCountByCategory[category.id] || 0;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(category.id);
                          onCloseMobile();
                        }}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border border-orange-500/50 text-white shadow-sm'
                            : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`shrink-0 ${isSelected ? 'text-orange-400' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                            <CategoryIcon name={category.icon} className="h-4 w-4" />
                          </span>
                          <span className="truncate">{category.name}</span>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums text-neutral-400 bg-neutral-800/80 px-1.5 py-0.5 rounded">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Forms & Community Feedback Box */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/50 overflow-hidden shadow-sm transition-colors hover:border-neutral-700">
              <button
                type="button"
                onClick={() => setIsFormsOpen(!isFormsOpen)}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isFormsOpen}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Support & Forms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400 border border-neutral-700/50">
                    2
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                      isFormsOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </div>
              </button>

              {isFormsOpen && (
                <div className="p-2 pt-0 space-y-1.5 border-t border-neutral-800/60">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between rounded-lg p-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer border border-neutral-800/60"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-amber-400">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      <span className="truncate">GameVault error report</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
                  </a>

                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdhulN_Qrg7223ug-iI4J3KmN5nJSepxTMDyFNSov4IE4xH8A/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between rounded-lg p-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer border border-neutral-800/60"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-emerald-400">
                        <Lightbulb className="h-4 w-4" />
                      </span>
                      <span className="truncate">GameVault Games suggestion</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Taskbar Footer */}
        {onOpenWhatsNew && (
          <div className="pt-3 mt-2 border-t border-neutral-800/80">
            <button
              type="button"
              onClick={onOpenWhatsNew}
              className="flex w-full items-center justify-between px-3 py-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500/40 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400 group-hover:rotate-12 transition-transform" />
                <span>v1.5 Release Notes</span>
              </div>
              <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-mono text-orange-300 border border-orange-500/30">
                New
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
