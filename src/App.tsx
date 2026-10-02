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

const STORAGE_KEYS = {
  CATEGORIES: 'gamevault_categories_v10',
  SITES: 'gamevault_sites_v10',
};

export default function App() {
  // Passcode gate state: strictly ephemeral (resets on refresh)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockToast, setShowUnlockToast] = useState(false);

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

  const [sites, setSites] = useState<GameSiteLink[]>(() => {
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
      localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
    } catch {
      // storage unavailable
    }
  }, [sites]);

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
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleDeleteSite = (siteId: string) => {
    setSites((prev) => prev.filter((s) => s.id !== siteId));
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowUnlockToast(true);
    setTimeout(() => {
      setShowUnlockToast(false);
    }, 1800);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setShowUnlockToast(false);
  };

  // Gate check: If locked, render the passcode gate screen
  if (!isUnlocked) {
    return <PasscodeGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar (Kept clean without Best Websites) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        totalSites={sites.length}
        onLockVault={handleLock}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectCategory={handleSelectCategory}
              categories={categories}
              sites={sites}
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
    </div>
  );
}
