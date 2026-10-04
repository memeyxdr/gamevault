/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Category, GameSiteLink, ViewMode } from './types';
import { INITIAL_CATEGORIES, INITIAL_SITE_LINKS } from './data/initialCategories';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CategoriesOverview } from './components/CategoriesOverview';
import { CategoryDetail } from './components/CategoryDetail';
import { SitesDirectory } from './components/SitesDirectory';
import { HomePage } from './components/HomePage';
import { PasscodeGate } from './components/PasscodeGate';
import { WhatsNewModal, WHATS_NEW_STORAGE_KEY } from './components/WhatsNewModal';
import { DiceIcon } from './components/DiceIcon';

const STORAGE_KEYS = {
  CATEGORIES: 'gamevault_categories_v12',
  SITES: 'gamevault_sites_v12',
  STARRED: 'gamevault_starred_sites_v12',
};

export default function App() {
  // Passcode gate state: strictly ephemeral (resets on refresh)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockToast, setShowUnlockToast] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [randomGameToast, setRandomGameToast] = useState<{
    name: string;
    url: string;
    rank?: number;
  } | null>(null);

  // User starred site IDs: remembered on this device in persistent localStorage
  // By default, NO sites are starred (empty array)
  const [starredSiteIds, setStarredSiteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STARRED);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [rawSites, setRawSites] = useState<GameSiteLink[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SITES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SITE_LINKS;
    } catch {
      return INITIAL_SITE_LINKS;
    }
  });

  // Dynamic sites array reflecting starred status from device storage
  const sites = useMemo(() => {
    const starredSet = new Set(starredSiteIds);
    return rawSites.map((site) => ({
      ...site,
      isFavorite: starredSet.has(site.id),
    }));
  }, [rawSites, starredSiteIds]);

  // Navigation & View States - Default to Home page
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // storage unavailable
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(rawSites));
    } catch {
      // storage unavailable
    }
  }, [rawSites]);

  // Derived counts
  const siteCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = 0;
    }
    for (const site of sites) {
      if (counts[site.categoryId] !== undefined) {
        counts[site.categoryId]++;
      }
    }
    return counts;
  }, [categories, sites]);

  const favoriteSitesCount = useMemo(() => {
    return sites.filter((s) => s.isFavorite).length;
  }, [sites]);

  const bestGamesCount = useMemo(() => {
    return sites.filter((s) => s.isBestGame).length;
  }, [sites]);

  const bestWebsitesCount = useMemo(() => {
    return sites.filter((s) => s.isBestWebsite).length;
  }, [sites]);

  // Selected Category Object
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const sitesInSelectedCategory = useMemo(() => {
    if (!selectedCategoryId) return [];
    return sites.filter((s) => s.categoryId === selectedCategoryId);
  }, [sites, selectedCategoryId]);

  // Handlers
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('category-detail');
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    if (view !== 'category-detail') {
      setSelectedCategoryId(null);
    }
  };

  const handleToggleFavoriteSite = (siteId: string) => {
    setStarredSiteIds((prev) => {
      const next = prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId];
      try {
        localStorage.setItem(STORAGE_KEYS.STARRED, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  };

  const handleDeleteSite = (siteId: string) => {
    setRawSites((prev) => prev.filter((s) => s.id !== siteId));
    setStarredSiteIds((prev) => {
      const next = prev.filter((id) => id !== siteId);
      try {
        localStorage.setItem(STORAGE_KEYS.STARRED, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowUnlockToast(true);
    setTimeout(() => {
      setShowUnlockToast(false);
    }, 1800);

    // Passcode Unlock Trigger:
    // As soon as the user enters the authorized passcode to unlock the vault,
    // the modal automatically displays on the screen unless already dismissed
    // in persistent localStorage (gamevault_seen_v1_1_modal).
    try {
      const hasSeen = localStorage.getItem(WHATS_NEW_STORAGE_KEY);
      if (!hasSeen) {
        setShowWhatsNewModal(true);
      }
    } catch {
      setShowWhatsNewModal(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setShowUnlockToast(false);
    setShowWhatsNewModal(false);
    setRandomGameToast(null);
  };

  const handleOpenWhatsNew = () => {
    setShowWhatsNewModal(true);
  };

  // Auto-dismiss random game toast after 4.5s
  useEffect(() => {
    if (!randomGameToast) return;
    const timer = setTimeout(() => {
      setRandomGameToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [randomGameToast]);

  // 🎲 Random Game / I'm Feeling Lucky Launch Handler
  const handleLaunchRandomGame = () => {
    const isActuallyBlocked = (notice?: string) => {
      if (!notice) return false;
      const lower = notice.toLowerCase();
      return (
        lower.includes('blocked') ||
        lower.includes('shutdown') ||
        lower.includes('offline') ||
        lower.includes('taken down')
      );
    };

    // Candidate Pool 1: Verified top-rated Best Games list
    const workingBestGames = sites.filter(
      (s) => s.isBestGame && !isActuallyBlocked(s.specialNotice)
    );

    // Candidate Pool 2: Working direct games or playable instances
    const workingPlayableGames = sites.filter(
      (s) =>
        (s.isBestGame ||
          s.categoryId === 'direct-links' ||
          s.tags.some((t) => t.toLowerCase().includes('game'))) &&
        !isActuallyBlocked(s.specialNotice)
    );

    const pool =
      workingBestGames.length > 0
        ? workingBestGames
        : workingPlayableGames.length > 0
        ? workingPlayableGames
        : sites;

    if (pool.length === 0) return;

    const chosen = pool[Math.floor(Math.random() * pool.length)];

    // Programmatically launch via anchor click to avoid popup blocking
    const link = document.createElement('a');
    link.href = chosen.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show toast notification with direct play link
    setRandomGameToast({
      name: chosen.name,
      url: chosen.url,
      rank: chosen.rank,
    });
  };

  // Gate check: If locked, render the passcode gate screen
  if (!isUnlocked) {
    return <PasscodeGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans overflow-hidden">
      {/* Top Bar (Kept clean without Best Websites) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        totalSites={sites.length}
        onLockVault={handleLock}
        onOpenWhatsNew={handleOpenWhatsNew}
        onLaunchRandomGame={handleLaunchRandomGame}
      />

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        {/* Sidebar / 3-Line Menu */}
        <Sidebar
          categories={categories}
          sites={sites}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          currentView={currentView}
          onNavigate={handleNavigate}
          siteCountByCategory={siteCountByCategory}
          totalSites={sites.length}
          bestGamesCount={bestGamesCount}
          bestWebsitesCount={bestWebsitesCount}
          favoriteSitesCount={favoriteSitesCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scroll-smooth focus:outline-none">
          {currentView === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectCategory={handleSelectCategory}
              categories={categories}
              sites={sites}
              onOpenWhatsNew={handleOpenWhatsNew}
            />
          )}

          {currentView === 'all-sites' && (
            <SitesDirectory
              sites={sites}
              categories={categories}
              onlyFavorites={false}
              onlyBestGames={false}
              onlyBestWebsites={false}
              onToggleFavoriteSite={handleToggleFavoriteSite}
              onDeleteSite={handleDeleteSite}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentView === 'best-games' && (
            <SitesDirectory
              sites={sites}
              categories={categories}
              onlyFavorites={false}
              onlyBestGames={true}
              onlyBestWebsites={false}
              onToggleFavoriteSite={handleToggleFavoriteSite}
              onDeleteSite={handleDeleteSite}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentView === 'best-websites' && (
            <SitesDirectory
              sites={sites}
              categories={categories}
              onlyFavorites={false}
              onlyBestGames={false}
              onlyBestWebsites={true}
              onToggleFavoriteSite={handleToggleFavoriteSite}
              onDeleteSite={handleDeleteSite}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentView === 'categories' && (
            <CategoriesOverview
              categories={categories}
              sites={sites}
              onSelectCategory={handleSelectCategory}
              siteCountByCategory={siteCountByCategory}
            />
          )}

          {currentView === 'category-detail' && selectedCategory && (
            <CategoryDetail
              category={selectedCategory}
              sites={sitesInSelectedCategory}
              onBack={() => {
                setSelectedCategoryId(null);
                setCurrentView('categories');
              }}
              onToggleFavoriteSite={handleToggleFavoriteSite}
              onDeleteSite={handleDeleteSite}
            />
          )}

          {currentView === 'favorites' && (
            <SitesDirectory
              sites={sites}
              categories={categories}
              onlyFavorites={true}
              onlyBestGames={false}
              onlyBestWebsites={false}
              onToggleFavoriteSite={handleToggleFavoriteSite}
              onDeleteSite={handleDeleteSite}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </main>
      </div>

      {/* Brief Bottom Confirmation Toast */}
      {showUnlockToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/50 bg-neutral-900/95 px-5 py-2.5 shadow-2xl backdrop-blur-md text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide font-mono animate-toast-in shadow-emerald-500/20">
          <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
          <span>Unlocked</span>
        </div>
      )}

      {/* Random Game Launch Toast */}
      {randomGameToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-neutral-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-sans tracking-wide animate-toast-in shadow-emerald-500/20 max-w-sm sm:max-w-md w-auto">
          <DiceIcon className="h-5 w-5 shrink-0 rounded-[3px] shadow-xs" />
          <div className="truncate">
            <span className="text-neutral-400 text-[11px] block">Launching Random Game:</span>
            <span className="text-emerald-400 font-bold truncate block">
              {randomGameToast.name} {randomGameToast.rank ? `(#${randomGameToast.rank})` : ''}
            </span>
          </div>
          <a
            href={randomGameToast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-2.5 py-1 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ml-2 cursor-pointer"
          >
            Play Now ↗
          </a>
        </div>
      )}

      {/* What's New in v1.2 Modal */}
      <WhatsNewModal
        isOpen={showWhatsNewModal}
        onClose={() => setShowWhatsNewModal(false)}
      />
    </div>
  );
}
