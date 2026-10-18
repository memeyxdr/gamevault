import React from 'react';
import {
  Search,
  Home,
  Layers,
  Globe,
  Trophy,
  Medal,
  Star,
  AlertTriangle,
  Lightbulb,
  Settings,
  Compass,
} from 'lucide-react';
import { ViewMode } from '../types';
import { GAMEVAULT_ERROR_REPORT_URL } from './QuickReturnFeedbackModal';
import { useSettings } from '../context/SettingsContext';

export const GAMEVAULT_SUGGESTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdhulN_Qrg7223ug-iI4J3KmN5nJSepxTMDyFNSov4IE4xH8A/viewform?usp=dialog';

interface NavRailProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  totalSites: number;
  bestGamesCount: number;
  bestWebsitesCount: number;
  favoriteSitesCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenLink?: (url: string, name: string) => void;
  onSearchClick?: () => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  currentView,
  onNavigate,
  totalSites,
  bestGamesCount,
  bestWebsitesCount,
  favoriteSitesCount,
  isOpenOnMobile = false,
  onCloseMobile,
  onOpenLink,
  onSearchClick,
}) => {
  const { currentAccentHex, accentRgb } = useSettings();

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      onNavigate('all-sites');
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLaunchReportForm = () => {
    if (onOpenLink) {
      onOpenLink(GAMEVAULT_ERROR_REPORT_URL, 'GameVault Error Report');
    }
    const link = document.createElement('a');
    link.href = GAMEVAULT_ERROR_REPORT_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLaunchSuggestionForm = () => {
    if (onOpenLink) {
      onOpenLink(GAMEVAULT_SUGGESTION_URL, 'GameVault Game Suggestion');
    }
    const link = document.createElement('a');
    link.href = GAMEVAULT_SUGGESTION_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = [
    {
      id: 'home' as ViewMode,
      label: 'Home HQ',
      icon: Home,
      isActive: currentView === 'home',
      count: null,
      description: 'Directory home dashboard',
    },
    {
      id: 'categories' as ViewMode,
      label: 'Categories',
      icon: Layers,
      isActive: currentView === 'categories' || currentView === 'category-detail',
      count: null,
      description: 'Explore all category spaces',
    },
    {
      id: 'all-sites' as ViewMode,
      label: 'All Sites',
      icon: Globe,
      isActive: currentView === 'all-sites',
      count: totalSites,
      description: 'Browse complete catalog',
    },
    {
      id: 'best-games' as ViewMode,
      label: 'Best Games',
      icon: Trophy,
      isActive: currentView === 'best-games',
      count: bestGamesCount,
      description: 'Top ranked leaderboard (#1 ScholarNest)',
    },
    {
      id: 'best-websites' as ViewMode,
      label: 'Best Websites',
      icon: Medal,
      isActive: currentView === 'best-websites',
      count: bestWebsitesCount,
      description: 'Featured proxies & tools (#1 anyproxy)',
    },
    {
      id: 'favorites' as ViewMode,
      label: 'Favorites',
      icon: Star,
      isActive: currentView === 'favorites',
      count: favoriteSitesCount,
      description: 'Starred game bookmarks',
    },
    {
      id: 'browser' as ViewMode,
      label: 'In-Site Browser',
      icon: Compass,
      isActive: currentView === 'browser',
      count: null,
      description: 'Built-in web browser & proxy gateway',
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Vertical Icon Rail */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 flex flex-col items-center justify-between py-3 sm:py-4 border-r border-orange-950/40 bg-neutral-950/95 backdrop-blur-md transition-transform duration-200 select-none shrink-0 lg:static lg:h-full lg:translate-x-0 w-16 sm:w-[68px] ${
          isOpenOnMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Navigation Rail"
      >
        {/* Top: Navigation Icon Group */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {/* Search Bar Icon Button (Positioned at top of rail as provided in image) */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={handleSearchClick}
              aria-label="Search Sites & Games"
              title="Search Directory (Games, Proxies & Portals)"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400 hover:text-orange-400 hover:bg-neutral-900 border border-neutral-800/80 hover:border-orange-500/50 transition-all duration-150 cursor-pointer shadow-xs active:scale-95 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.15)]"
            >
              <Search className="h-5 w-5 stroke-[2.2]" />
            </button>

            {/* Floating Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3.5 hidden md:group-hover:flex items-center z-50 animate-fade-in">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-orange-400" />
                  <span>Search Directory</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Search all games, sites & unblockers</div>
              </div>
            </div>
          </div>

          {/* Separator under search */}
          <div className="w-8 h-px bg-neutral-900/90" />
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group flex items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-label={item.label}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                    item.isActive
                      ? 'border shadow-md'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
                  }`}
                  style={
                    item.isActive
                      ? {
                          backgroundColor: `rgba(${accentRgb}, 0.2)`,
                          borderColor: `rgba(${accentRgb}, 0.5)`,
                          color: currentAccentHex,
                          boxShadow: `0 4px 12px rgba(${accentRgb}, 0.15)`,
                        }
                      : {}
                  }
                >
                  {/* Left Active Glow Indicator Bar */}
                  {item.isActive && (
                    <span
                      className="absolute -left-2 top-2 bottom-2 w-1 rounded-r-full shadow-sm"
                      style={{
                        backgroundColor: currentAccentHex,
                        boxShadow: `0 0 8px ${currentAccentHex}`,
                      }}
                    />
                  )}

                  <Icon className="h-5 w-5 stroke-[2.2]" />

                  {/* Count indicator dot/badge if present */}
                  {item.count !== null && item.count > 0 && !item.isActive && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-400/80" />
                  )}
                </button>

                {/* Floating Tooltip (Desktop/Tablet) */}
                <div className="pointer-events-none absolute left-full ml-3.5 hidden md:group-hover:flex items-center z-50 animate-fade-in">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.count !== null && (
                        <span className="font-mono text-[10px] text-orange-400 bg-orange-500/15 px-1.5 py-0.2 rounded border border-orange-500/30">
                          {item.count}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{item.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: Settings, Forms & Feedback Section (Location matching reference image) */}
        <div className="flex flex-col items-center gap-2 w-full px-2 pt-3 border-t border-neutral-900">
          {/* Settings Button (Placed above AlertTriangle as indicated in image) */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={() => handleNavClick('settings')}
              aria-label="Settings"
              title="Settings & Preferences"
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                currentView === 'settings'
                  ? 'border shadow-md'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
              }`}
              style={
                currentView === 'settings'
                  ? {
                      backgroundColor: `rgba(${accentRgb}, 0.2)`,
                      borderColor: `rgba(${accentRgb}, 0.5)`,
                      color: currentAccentHex,
                      boxShadow: `0 4px 12px rgba(${accentRgb}, 0.15)`,
                    }
                  : {}
              }
            >
              {currentView === 'settings' && (
                <span
                  className="absolute -left-2 top-2 bottom-2 w-1 rounded-r-full shadow-sm"
                  style={{
                    backgroundColor: currentAccentHex,
                    boxShadow: `0 0 8px ${currentAccentHex}`,
                  }}
                />
              )}
              <Settings className="h-5 w-5 stroke-[2.2]" />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3.5 hidden md:group-hover:flex items-center z-50 animate-fade-in">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" style={{ color: currentAccentHex }} />
                  <span>Settings</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Preferences, theme & performance</div>
              </div>
            </div>
          </div>

          {/* 1. Direct Error Report Button */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={handleLaunchReportForm}
              aria-label="Report Error or Broken Link"
              title="Report Error"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/30 hover:border-red-500/60 hover:text-red-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <AlertTriangle className="h-5 w-5" />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3.5 hidden md:group-hover:flex items-center z-50 animate-fade-in">
              <div className="rounded-lg border border-red-900/50 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
                <div className="font-semibold text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Report Error / Broken Link</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Direct form to fix blocked or down games</div>
              </div>
            </div>
          </div>

          {/* 2. Suggest Game Button */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={handleLaunchSuggestionForm}
              aria-label="Suggest a Game or Site"
              title="Suggest Game"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Lightbulb className="h-4 w-4" />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full ml-3.5 hidden md:group-hover:flex items-center z-50 animate-fade-in">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Suggest a Game or Site</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Submit new unblocked titles</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
