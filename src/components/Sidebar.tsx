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
}) => {
  const query = searchQuery.trim().toLowerCase();

  // Dropdown states: Directory Index open by default, others collapsed
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 flex-col border-r border-orange-950/30 bg-neutral-950 p-4 transition-transform duration-200 lg:static lg:flex lg:h-full lg:shrink-0 lg:overflow-y-auto lg:translate-x-0 ${
          isOpenOnMobile ? 'flex translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Global Search Input */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search games, sites, URLs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/90 py-2 pl-9 pr-8 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-colors"
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

        {/* If searching: Show Matching Individual Sites List */}
        {query ? (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
            <div>
              <div className="mb-2 flex items-center justify-between px-2 pt-2 border-t border-neutral-800/80">
                <span className="text-xs font-medium tracking-wide text-neutral-300">
                  Matching Sites ({matchingSites.length})
                </span>
                <button
                  type="button"
                  onClick={handleSearchSiteClick}
                  className="text-[11px] text-neutral-400 hover:text-white"
                >
                  View All
                </button>
              </div>

              {matchingSites.length > 0 ? (
                <div className="space-y-1">
                  {matchingSites.slice(0, 8).map((site) => (
                    <div
                      key={site.id}
                      className="group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-900 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={handleSearchSiteClick}
                        className="truncate text-left flex-1"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {site.isBestGame && (
                            <Trophy className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                          )}
                          <span className="truncate text-white text-xs">{site.name}</span>
                        </div>
                        <div className="truncate text-neutral-500 font-mono text-[11px]">
                          {site.domain}
                        </div>
                      </button>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-neutral-500 hover:text-white shrink-0 ml-1"
                        title="Open Link"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                  {matchingSites.length > 8 && (
                    <button
                      type="button"
                      onClick={handleSearchSiteClick}
                      className="w-full py-1 text-center text-xs text-neutral-400 hover:text-white"
                    >
                      + {matchingSites.length - 8} more sites
                    </button>
                  )}
                </div>
              ) : (
                <div className="px-2 py-2 text-xs text-neutral-500">
                  No individual sites match "{searchQuery}"
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 px-2 pt-2 border-t border-neutral-800/80 text-xs font-medium tracking-wide text-neutral-400">
                Matching Categories ({matchingCategories.length})
              </div>
              <div className="space-y-0.5">
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
                      className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CategoryIcon name={category.icon} className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-neutral-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Normal State: Sections formatted as Collapsible Dropdown Boxes */
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
            {/* 1. Forms & Feedback Dropdown Box */}
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 overflow-hidden transition-colors hover:border-neutral-700/80">
              <button
                type="button"
                onClick={() => setIsFormsOpen(!isFormsOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isFormsOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="tracking-wide">Forms & Feedback</span>
                  <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono text-neutral-400 border border-neutral-700/50">
                    2
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
                    isFormsOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isFormsOpen && (
                <div className="p-1.5 pt-0.5 space-y-0.5 border-t border-neutral-800/60 animate-fade-in">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800/80 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-amber-400/90 group-hover:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate">GameVault error report</span>
                    </div>
                    <ExternalLink className="h-3 w-3 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
                  </a>

                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdhulN_Qrg7223ug-iI4J3KmN5nJSepxTMDyFNSov4IE4xH8A/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800/80 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-emerald-400/90 group-hover:text-emerald-400">
                        <Lightbulb className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate">GameVault Games suggestion</span>
                    </div>
                    <ExternalLink className="h-3 w-3 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
                  </a>
                </div>
              )}
            </div>

            {/* 2. Directory Index Dropdown Box (Open by Default) */}
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 overflow-hidden transition-colors hover:border-neutral-700/80">
              <button
                type="button"
                onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isDirectoryOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="tracking-wide">Directory Index</span>
                  <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono text-neutral-400 border border-neutral-700/50">
                    6
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
                    isDirectoryOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isDirectoryOpen && (
                <div className="p-1.5 pt-0.5 space-y-0.5 border-t border-neutral-800/60 animate-fade-in">
                  {/* 0. Home / Headquarters */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'home'
                        ? 'bg-neutral-800 text-neutral-100 font-semibold shadow-sm'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className="h-4 w-4 text-orange-400" />
                      <span>Home</span>
                    </div>
                    <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-mono text-orange-400 border border-orange-500/20 font-bold">
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
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'all-sites'
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-neutral-400" />
                      <span>All Sites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-neutral-400">
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
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'best-games'
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-neutral-100 font-medium">Best Games</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-yellow-400 font-semibold">
                      {bestGamesCount}
                    </span>
                  </button>

                  {/* 3. Best Websites */}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('best-websites');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'best-websites'
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Medal className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-neutral-100 font-medium">Best Websites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-amber-400 font-semibold">
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
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'categories' && !selectedCategoryId
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-neutral-400" />
                      <span>All Categories</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-neutral-400">
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
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      currentView === 'favorites'
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Star className="h-4 w-4 text-neutral-400" />
                      <span>Starred Sites</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-neutral-400">
                      {favoriteSitesCount}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Site Categories Dropdown Box */}
            <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 overflow-hidden transition-colors hover:border-neutral-700/80">
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
                aria-expanded={isCategoriesOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="tracking-wide">Site Categories</span>
                  <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono text-neutral-400 border border-neutral-700/50">
                    {categories.length}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
                    isCategoriesOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="p-1.5 pt-0.5 space-y-0.5 border-t border-neutral-800/60 animate-fade-in max-h-64 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => {
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
                          className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-neutral-800 text-neutral-100'
                              : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="shrink-0 text-neutral-400 group-hover:text-neutral-300">
                              <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">{category.name}</span>
                          </div>
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-neutral-400">
                            {count}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-2 py-3 text-xs text-neutral-500">
                      No categories configured
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
