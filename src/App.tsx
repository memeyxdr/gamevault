/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Category, GameSiteLink, ViewMode } from './types';
import { INITIAL_CATEGORIES, INITIAL_SITE_LINKS } from './data/initialCategories';
import { Navbar } from './components/Navbar';
import { NavRail } from './components/NavRail';
import { Sidebar } from './components/Sidebar';
import { CategoriesOverview } from './components/CategoriesOverview';
import { CategoryDetail } from './components/CategoryDetail';
import { SitesDirectory } from './components/SitesDirectory';
import { HomePage } from './components/HomePage';
import { PasscodeGate } from './components/PasscodeGate';
import { WhatsNewModal, WHATS_NEW_STORAGE_KEY } from './components/WhatsNewModal';
import { QuickReturnFeedbackModal } from './components/QuickReturnFeedbackModal';
import { DiceIcon } from './components/DiceIcon';
import { SettingsPage } from './components/SettingsPage';
import { BrowserUnavailableNotice } from './components/BrowserUnavailableNotice';
import { DirectGamesPage } from './components/DirectGamesPage';
import { SettingsProvider, useSettings } from './context/SettingsContext';

const STORAGE_KEYS = {
  CATEGORIES: 'gamevault_categories_v14',
  SITES: 'gamevault_sites_v14',
  STARRED: 'gamevault_starred_sites_v13',
};

function VaultApp() {
  const { settings } = useSettings();
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
      const stored =
        localStorage.getItem(STORAGE_KEYS.SITES) ||
        localStorage.getItem('gamevault_sites_v13');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(INITIAL_SITE_LINKS.map((s) => [s.id, s]));
          let updated = parsed
            .filter((s: GameSiteLink) => s.id !== 'site-szvy-movies')
            .map((s: GameSiteLink) => {
              if (s.id === 'site-pixvibes') {
                return { ...s, name: 'ScholarNest', rank: 1, isBestGame: true };
              }
              if (s.id === 'site-anyproxy') {
                return { ...s, name: 'anyproxy.site', rank: 1, isBestWebsite: true, specialNotice: 'Rank #1 Proxy' };
              }
              const init = initialMap.get(s.id);
              if (init) {
                if (init.isBestGame) {
                  return { ...s, rank: init.rank, isBestGame: true };
                }
                if (init.isBestWebsite) {
                  return { ...s, rank: init.rank, isBestWebsite: true, specialNotice: init.specialNotice || s.specialNotice };
                }
              }
              return s;
            });
          if (!updated.some((s: GameSiteLink) => s.id === 'site-pixvibes')) {
            const pixvibes = initialMap.get('site-pixvibes');
            if (pixvibes) updated = [pixvibes, ...updated];
          }
          if (!updated.some((s: GameSiteLink) => s.id === 'site-anyproxy')) {
            const anyproxy = initialMap.get('site-anyproxy');
            if (anyproxy) updated = [anyproxy, ...updated];
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
  const [previousView, setPreviousView] = useState<ViewMode>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // True while a Direct Games title is running: the main area drops its padding so the game fills it edge to edge
  const [isDirectGamePlaying, setIsDirectGamePlaying] = useState(false);

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
    if (currentView !== 'browser' && view === 'browser') {
      setPreviousView(currentView);
    }
    setCurrentView(view);
    if (view !== 'category-detail') {
      setSelectedCategoryId(null);
    }
  };

  // The in-site browser is currently disabled, so every request to open it
  // lands on the "temporarily unavailable" notice in the main view space.
  const handleOpenInSiteBrowser = (_url: string) => {
    setPreviousView(currentView === 'browser' ? previousView : currentView);
    setQuickReturnModal({ isOpen: false });
    setCurrentView('browser');
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

    try {
      const hasSeenWhatsNew = localStorage.getItem(WHATS_NEW_STORAGE_KEY);
      if (!hasSeenWhatsNew) {
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

  const handleCloseWhatsNew = () => {
    setShowWhatsNewModal(false);
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
    link.target = settings.openInNewTab ? '_blank' : '_self';
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

  const handleRailSearchClick = () => {
    if (
      currentView !== 'all-sites' &&
      currentView !== 'best-games' &&
      currentView !== 'best-websites' &&
      currentView !== 'favorites'
    ) {
      setCurrentView('all-sites');
    }
    setTimeout(() => {
      const searchInput = document.querySelector<HTMLInputElement>(
        'input[placeholder*="Search individual sites"]'
      );
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 120);
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

      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left Icon Rail Navigation (v1.5 Redesign) */}
        <NavRail
          currentView={currentView}
          onNavigate={handleNavigate}
          totalSites={sites.length}
          bestGamesCount={bestGamesCount}
          bestWebsitesCount={bestWebsitesCount}
          favoriteSitesCount={favoriteSitesCount}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onSearchClick={handleRailSearchClick}
        />

        {/* Main Content Area / Expansive Main View Space */}
        <main
          className={`flex-1 min-w-0 focus:outline-none scroll-smooth ${
            isDirectGamePlaying
              ? 'p-0 overflow-hidden'
              : 'p-4 sm:p-6 lg:p-8 overflow-y-auto'
          }`}
        >
          <div className={isDirectGamePlaying ? 'h-full w-full' : 'w-full max-w-7xl mx-auto'}>
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
              onOpenInSiteBrowser={handleOpenInSiteBrowser}
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
              onOpenInSiteBrowser={handleOpenInSiteBrowser}
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
              onOpenInSiteBrowser={handleOpenInSiteBrowser}
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
              onOpenInSiteBrowser={handleOpenInSiteBrowser}
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
              onOpenInSiteBrowser={handleOpenInSiteBrowser}
              searchQuery={directorySearchQuery}
              onSearchChange={setDirectorySearchQuery}
            />
          )}

          {currentView === 'direct-games' && (
            <DirectGamesPage
              onBrowseSites={() => handleNavigate('all-sites')}
              onPlayingChange={setIsDirectGamePlaying}
            />
          )}

          {currentView === 'settings' && (
            <SettingsPage
              onBackToHome={() => handleNavigate('home')}
              siteCount={sites.length}
              categoryCount={categories.length}
              favoriteCount={starredSiteIds.length}
            />
          )}

          {currentView === 'browser' && (
            <BrowserUnavailableNotice
              onBackToSites={() =>
                handleNavigate(previousView === 'browser' ? 'all-sites' : previousView)
              }
            />
          )}
          </div>
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
            target={settings.openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 px-2.5 py-1 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ml-2 cursor-pointer"
          >
            Play Now ↗
          </a>
        </div>
      )}

      {/* What's New in v1.5 Modal */}
      <WhatsNewModal
        isOpen={showWhatsNewModal}
        onClose={handleCloseWhatsNew}
      />

      {/* Quick Return Link Problem Assistant Modal */}
      <QuickReturnFeedbackModal
        isOpen={quickReturnModal.isOpen}
        siteName={quickReturnModal.siteName}
        openedUrl={quickReturnModal.openedUrl}
        onClose={() => setQuickReturnModal({ isOpen: false })}
        onOpenInSiteBrowser={handleOpenInSiteBrowser}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <VaultApp />
    </SettingsProvider>
  );
}
