import React, { useState } from 'react';
import {
  Search,
  Home,
  Layers,
  Globe,
  Trophy,
  Medal,
  Gamepad2,
  Star,
  Settings,
  Compass,
} from 'lucide-react';
import { ViewMode } from '../types';
import { useSettings } from '../context/SettingsContext';

interface NavRailProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  totalSites: number;
  bestGamesCount: number;
  bestWebsitesCount: number;
  favoriteSitesCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
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
  onSearchClick,
}) => {
  const { settings, currentAccentHex, accentRgb } = useSettings();

  const [tooltip, setTooltip] = useState<{
    left: number;
    top: number;
    title: string;
    description: string;
    count?: number | null;
  } | null>(null);

  const hideTooltip = () => setTooltip(null);

  const showTooltip = (
    event: React.MouseEvent<HTMLElement>,
    content: { title: string; description: string; count?: number | null }
  ) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      ...content,
      left: rect.right + 14,
      top: rect.top + rect.height / 2,
    });
  };

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

  const navItems = [
    {
      id: 'home' as ViewMode,
      label: 'Home HQ',
      railLabel: 'Home',
      icon: Home,
      isActive: currentView === 'home',
      count: null,
      description: 'Directory home dashboard',
    },
    {
      id: 'categories' as ViewMode,
      label: 'Categories',
      railLabel: 'Categories',
      icon: Layers,
      isActive: currentView === 'categories' || currentView === 'category-detail',
      count: null,
      description: 'Explore all category spaces',
    },
    {
      id: 'direct-games' as ViewMode,
      label: 'Direct Games',
      railLabel: 'Direct',
      icon: Gamepad2,
      isActive: currentView === 'direct-games',
      count: null,
      description: 'Playable games inside GameVault (coming soon)',
    },
    {
      id: 'all-sites' as ViewMode,
      label: 'All Sites',
      railLabel: 'All Sites',
      icon: Globe,
      isActive: currentView === 'all-sites',
      count: totalSites,
      description: 'Browse complete catalog',
    },
    {
      id: 'best-games' as ViewMode,
      label: 'Best Games',
      railLabel: 'Best Games',
      icon: Trophy,
      isActive: currentView === 'best-games',
      count: bestGamesCount,
      description: 'Top ranked leaderboard (#1 ScholarNest)',
    },
    {
      id: 'best-websites' as ViewMode,
      label: 'Best Websites',
      railLabel: 'Websites',
      icon: Medal,
      isActive: currentView === 'best-websites',
      count: bestWebsitesCount,
      description: 'Featured proxies & tools (#1 anyproxy)',
    },
    {
      id: 'favorites' as ViewMode,
      label: 'Favorites',
      railLabel: 'Starred',
      icon: Star,
      isActive: currentView === 'favorites',
      count: favoriteSitesCount,
      description: 'Starred game bookmarks',
    },
    {
      id: 'browser' as ViewMode,
      label: 'In-Site Browser',
      railLabel: 'Browser',
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
        className={`fixed top-14 bottom-0 left-0 z-40 flex flex-col items-center justify-between py-3 sm:py-4 border-r border-orange-950/40 bg-neutral-950/95 backdrop-blur-md transition-transform duration-200 select-none shrink-0 lg:static lg:h-full lg:translate-x-0 ${
          settings.showRailLabels
            ? 'w-[72px] sm:w-[78px]'
            : settings.compactRail
              ? 'w-14 sm:w-[60px]'
              : 'w-16 sm:w-[68px]'
        } ${isOpenOnMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Navigation Rail"
      >
        {/* Top: Navigation Icon Group */}
        <div
          className={`flex min-h-0 flex-1 flex-col items-center gap-2.5 w-full overflow-x-hidden overflow-y-auto ${settings.compactRail ? 'px-1' : 'px-2'} [scrollbar-width:thin] [scrollbar-color:rgb(64,64,64)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700`}
          onScroll={hideTooltip}
        >
          {/* Search Bar Icon Button (Positioned at top of rail as provided in image) */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={handleSearchClick}
              onMouseEnter={(e) =>
                showTooltip(e, {
                  title: 'Search Directory',
                  description: 'Search all games, sites & unblockers',
                })
              }
              onMouseLeave={hideTooltip}
              aria-label="Search Sites & Games"
              title="Search Directory (Games, Proxies & Portals)"
              className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl text-neutral-400 hover:text-orange-400 hover:bg-neutral-900 border border-neutral-800/80 hover:border-orange-500/50 transition-all duration-150 cursor-pointer shadow-xs active:scale-95 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] gv-accent-hover ${
                settings.showRailLabels ? 'w-full gap-1 px-1 py-1.5' : 'h-11 w-11'
              }`}
            >
              <Search className="h-5 w-5 stroke-[2.2]" />
              {settings.showRailLabels && (
                <span className="w-full text-center text-[8px] font-medium leading-[1.15] break-words">
                  Search
                </span>
              )}
            </button>
          </div>

          {/* Separator under search */}
          <div className="w-8 h-px shrink-0 bg-neutral-900/90" />
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group flex items-center justify-center w-full shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={(e) =>
                    showTooltip(e, {
                      title: item.label,
                      description: item.description,
                      count: item.count,
                    })
                  }
                  onMouseLeave={hideTooltip}
                  aria-label={item.label}
                  className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                    settings.showRailLabels ? 'w-full gap-1 px-1 py-1.5' : 'h-11 w-11'
                  } ${
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
                  boxShadow: `0 0 8px rgba(${accentRgb}, 0.55)`,
                      }}
                    />
                  )}

                  <Icon className="h-5 w-5 stroke-[2.2]" />

                  {settings.showRailLabels && (
                    <span className="w-full text-center text-[8px] font-medium leading-[1.15] break-words">
                      {item.railLabel}
                    </span>
                  )}

                  {/* Count indicator dot/badge if present */}
                  {item.count !== null && item.count > 0 && !item.isActive && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-400/80" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom: Settings */}
        <div className={`flex shrink-0 flex-col items-center gap-2 w-full ${settings.compactRail ? 'px-1' : 'px-2'} pt-3 border-t border-neutral-900`}>
          {/* Settings Button (Placed above AlertTriangle as indicated in image) */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={() => handleNavClick('settings')}
              onMouseEnter={(e) =>
                showTooltip(e, {
                  title: 'Settings',
                  description: 'Preferences, theme & performance',
                })
              }
              onMouseLeave={hideTooltip}
              aria-label="Settings"
              title="Settings & Preferences"
              className={`relative flex shrink-0 flex-col items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                settings.showRailLabels ? 'w-full gap-1 px-1 py-1.5' : 'h-11 w-11'
              } ${
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
                    boxShadow: `0 0 8px rgba(${accentRgb}, 0.55)`,
                  }}
                />
              )}
              <Settings className="h-5 w-5 stroke-[2.2]" />

              {settings.showRailLabels && (
                <span className="w-full text-center text-[8px] font-medium leading-[1.15] break-words">
                  Settings
                </span>
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* Floating Tooltip - fixed positioned so the scrollable rail can never clip it */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[60] hidden md:block animate-fade-in"
          style={{ left: tooltip.left, top: tooltip.top, transform: 'translateY(-50%)' }}
        >
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/95 px-3 py-1.5 text-xs text-neutral-200 shadow-xl backdrop-blur-md whitespace-nowrap">
            <div className="font-semibold text-white flex items-center gap-2">
              <span>{tooltip.title}</span>
              {tooltip.count !== null && tooltip.count !== undefined && (
                <span className="font-mono text-[10px] text-orange-400 bg-orange-500/15 px-1.5 py-0.2 rounded border border-orange-500/30">
                  {tooltip.count}
                </span>
              )}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">{tooltip.description}</div>
          </div>
        </div>
      )}
    </>
  );
};
