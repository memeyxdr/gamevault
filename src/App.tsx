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
import { EarlyDevModal, EARLY_DEV_STORAGE_KEY } from './components/EarlyDevModal';
import { QuickReturnFeedbackModal } from './components/QuickReturnFeedbackModal';
import { DiceIcon } from './components/DiceIcon';

const STORAGE_KEYS = {
  CATEGORIES: 'gamevault_categories_v13',
  SITES: 'gamevault_sites_v13',
  STARRED: 'gamevault_starred_sites_v13',
};

export default function App() {
  // Passcode gate state: strictly ephemeral (resets on refresh)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockToast, setShowUnlockToast] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showEarlyDevModal, setShowEarlyDevModal] = useState(false);
  const [randomGameToast, setRandomGameToast] = useState<{
    name: string;
    url: string;
    rank?: number;
  } | null>(null);

  // User starred site IDs: remembered on this device in persistent localStorage
  // By default, NO sites are starred (empty array)
  const [starredSiteIds, setStarredSiteIds] = useState<string[]>(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEYS.STARRED) ||
        localStorage.getItem('gamevault_starred_sites_v12');
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(INITIAL_SITE_LINKS.map((s) => [s.id, s]));
          let updated = parsed.map((s: GameSiteLink) => {
            if (s.id === 'site-pixvibes') {
              return { ...s, name: 'ScholarNest', rank: 1, isBestGame: true };
            }
            const init = initialMap.get(s.id);
            if (init && init.isBestGame) {
              return { ...s, rank: init.rank, isBestGame: init.isBestGame };
            }
            return s;
          });
          if (!updated.some((s: GameSiteLink) => s.id === 'site-pixvibes')) {
            const pixvibes = initialMap.get('site-pixvibes');
            if (pixvibes) updated = [pixvibes, ...updated];
          }
          return updated;
        }
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
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick return detection: if a user returns to GameVault within 5 seconds after opening a link
  const lastOpenedLinkRef = React.useRef<{
    url: string;
    name?: string;
    timestamp: number;
  } | null>(null);
  const [quickReturnModal, setQuickReturnModal] = useState<{
    isOpen: boolean;
    siteName?: string;
    openedUrl?: string;
  }>({
    isOpen: false,
  });

  const recordLinkOpened = (url: string, name?: string) => {
    lastOpenedLinkRef.current = {
      url,
      name,
      timestamp: Date.now(),
    };
  };

  // Listen to global document click on external links + window focus / visibilitychange
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      // Check if it's an external link or opens in a new tab
      if (
        href &&
        (targetAttr === '_blank' || href.startsWith('http://') || href.startsWith('https://')) &&
        !href.includes('forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw') // don't trigger when clicking the error report itself
      ) {
        // Find human readable title or anchor text
        const anchorText =
          anchor.getAttribute('aria-label') ||
          anchor.innerText?.trim().slice(0, 50) ||
          anchor.title ||
          undefined;

        lastOpenedLinkRef.current = {
          url: href,
          name: anchorText,
          timestamp: Date.now(),
        };
      }
    };

    const handleWindowReturn = () => {
      if (!lastOpenedLinkRef.current) return;
      const { url, name, timestamp } = lastOpenedLinkRef.current;
      const elapsed = Date.now() - timestamp;

      // Reset immediately to prevent multiple triggers
      lastOpenedLinkRef.current = null;

      // If user came back between 250ms and 5000ms (5 seconds)
      if (elapsed >= 250 && elapsed <= 5000) {
        setQuickReturnModal({
          isOpen: true,
          siteName: name,
          openedUrl: url,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleWindowReturn();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('focus', handleWindowReturn);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('focus', handleWindowReturn);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
    // 1. If user hasn't seen the v1.2 release notes yet, show them first.
    //    When they exit the release notes, the early dev popup automatically displays.
    // 2. If user already saw release notes in the past (existing user returning after popup was added),
    //    trigger the one-time early development notice immediately upon unlock.
    try {
      const hasSeenWhatsNew = localStorage.getItem(WHATS_NEW_STORAGE_KEY);
      const hasSeenEarlyDev = localStorage.getItem(EARLY_DEV_STORAGE_KEY);

      if (!hasSeenWhatsNew) {
        setShowWhatsNewModal(true);
      } else if (!hasSeenEarlyDev) {
        setShowEarlyDevModal(true);
      }
    } catch {
      setShowWhatsNewModal(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setShowUnlockToast(false);
    setShowWhatsNewModal(false);
    setShowEarlyDevModal(false);
    setRandomGameToast(null);
  };

  const handleOpenWhatsNew = () => {
    setShowWhatsNewModal(true);
  };

  const handleCloseWhatsNew = () => {
    setShowWhatsNewModal(false);
    try {
      const hasSeenEarlyDev = localStorage.getItem(EARLY_DEV_STORAGE_KEY);
      if (!hasSeenEarlyDev) {
        setTimeout(() => {
          setShowEarlyDevModal(true);
        }, 220);
      }
    } catch {
      // storage unavailable
    }
  };

  const handleCloseEarlyDev = () => {
    setShowEarlyDevModal(false);
    try {
      localStorage.setItem(EARLY_DEV_STORAGE_KEY, 'true');
    } catch {
      // storage unavailable
    }
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

    recordLinkOpened(chosen.url, chosen.name);

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
        onOpenEarlyDev={() => setShowEarlyDevModal(true)}
        onLaunchRandomGame={handleLaunchRandomGame}
        onOpenLink={(url, name) => recordLinkOpened(url, name)}
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
          searchQuery={sidebarSearchQuery}
          onSearchChange={setSidebarSearchQuery}
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
              searchQuery={directorySearchQuery}
              onSearchChange={setDirectorySearchQuery}
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
              searchQuery={directorySearchQuery}
              onSearchChange={setDirectorySearchQuery}
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
              searchQuery={directorySearchQuery}
              onSearchChange={setDirectorySearchQuery}
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
              searchQuery={directorySearchQuery}
              onSearchChange={setDirectorySearchQuery}
            />
          )}
        </main>
      </div>

      {/* Brief Bottom Confirmation Toast */}
      {showUnlockToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-orange-500/50 bg-neutral-900/95 px-5 py-2.5 shadow-2xl backdrop-blur-md text-orange-400 text-xs sm:text-sm font-semibold tracking-wide font-mono animate-toast-in shadow-orange-500/20">
          <Check className="h-4 w-4 text-orange-400 stroke-[3]" />
          <span>Unlocked</span>
        </div>
      )}

      {/* Random Game Launch Toast */}
      {randomGameToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-orange-500/50 bg-neutral-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-sans tracking-wide animate-toast-in shadow-orange-500/20 max-w-sm sm:max-w-md w-auto">
          <DiceIcon className="h-5 w-5 shrink-0 rounded-[3px] shadow-xs" />
          <div className="truncate">
            <span className="text-neutral-400 text-[11px] block">Launching Random Game:</span>
            <span className="text-orange-400 font-bold truncate block">
              {randomGameToast.name} {randomGameToast.rank ? `(#${randomGameToast.rank})` : ''}
            </span>
          </div>
          <a
            href={randomGameToast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 px-2.5 py-1 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ml-2 cursor-pointer"
          >
            Play Now ↗
          </a>
        </div>
      )}

      {/* What's New in v1.2 Modal */}
      <WhatsNewModal
        isOpen={showWhatsNewModal}
        onClose={handleCloseWhatsNew}
      />

      {/* One-time Early Development Notice */}
      <EarlyDevModal
        isOpen={showEarlyDevModal}
        onClose={handleCloseEarlyDev}
      />

      {/* Quick Return Link Problem Assistant Modal */}
      <QuickReturnFeedbackModal
        isOpen={quickReturnModal.isOpen}
        siteName={quickReturnModal.siteName}
        openedUrl={quickReturnModal.openedUrl}
        onClose={() => setQuickReturnModal({ isOpen: false })}
      />
    </div>
  );
}
