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
} from 'lucide-react';
import { NavPosition, ViewMode } from '../types';
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
  /** Edge the navigation bar is docked to. Defaults to the left rail. */
  position?: NavPosition;
}

interface NavRailItem {
  id: ViewMode;
  label: string;
  railLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  count: number | null;
  description: string;
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
  position = 'left',
}) => {
  const { settings, currentAccentHex, accentRgb } = useSettings();

  const [tooltip, setTooltip] = useState<{
    style: React.CSSProperties;
    title: string;
    description: string;
    count?: number | null;
  } | null>(null);

  const hideTooltip = () => setTooltip(null);

  const isVertical = position === 'left' || position === 'right';
  const labelsOn = settings.showRailLabels;

  const showTooltip = (
    event: React.MouseEvent<HTMLElement>,
    content: { title: string; description: string; count?: number | null }
  ) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let style: React.CSSProperties;
    if (position === 'left') {
      style = { left: rect.right + 14, top: centerY, transform: 'translateY(-50%)' };
    } else if (position === 'right') {
      style = { left: rect.left - 14, top: centerY, transform: 'translate(-100%, -50%)' };
    } else if (position === 'top') {
      style = { left: centerX, top: rect.bottom + 10, transform: 'translateX(-50%)' };
    } else {
      style = { left: centerX, top: rect.top - 10, transform: 'translate(-50%, -100%)' };
    }

    setTooltip({ ...content, style });
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

  const navItems: NavRailItem[] = [
    {
      id: 'home',
      label: 'Home HQ',
      railLabel: 'Home',
      icon: Home,
      isActive: currentView === 'home',
      count: null,
      description: 'Directory home dashboard',
    },
    {
      id: 'categories',
      label: 'Categories',
      railLabel: 'Categories',
      icon: Layers,
      isActive: currentView === 'categories' || currentView === 'category-detail',
      count: null,
      description: 'Explore all category spaces',
    },
    {
      id: 'direct-games',
      label: 'Direct Games',
      railLabel: 'Direct',
      icon: Gamepad2,
      isActive: currentView === 'direct-games',
      count: null,
      description: 'Playable games inside GameVault',
    },
    {
      id: 'all-sites',
      label: 'All Sites',
      railLabel: 'All Sites',
      icon: Globe,
      isActive: currentView === 'all-sites',
      count: totalSites,
      description: 'Browse complete catalog',
    },
    {
      id: 'best-games',
      label: 'Best Games',
      railLabel: 'Best Games',
      icon: Trophy,
      isActive: currentView === 'best-games',
      count: bestGamesCount,
      description: 'Top ranked leaderboard (#1 ScholarNest)',
    },
    {
      id: 'best-websites',
      label: 'Best Websites',
      railLabel: 'Websites',
      icon: Medal,
      isActive: currentView === 'best-websites',
      count: bestWebsitesCount,
      description: 'Featured proxies & tools (#1 anyproxy)',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      railLabel: 'Starred',
      icon: Star,
      isActive: currentView === 'favorites',
      count: favoriteSitesCount,
      description: 'Starred sites and games',
    },
  ];

  // Geometry differs between the vertical rail and the horizontal bar.
  const itemShape = isVertical
    ? labelsOn
      ? 'w-full flex-col gap-1 px-1 py-1.5'
      : 'h-11 w-11 flex-col'
    : labelsOn
      ? 'flex-row gap-1.5 px-2 py-1.5'
      : 'h-10 w-10 flex-row';

  const labelClass = isVertical
    ? 'w-full text-center text-[8px] font-medium leading-[1.15] break-words'
    : 'text-[10px] font-medium leading-none whitespace-nowrap';

  const indicatorClass = isVertical
    ? position === 'left'
      ? 'absolute -left-2 top-2 bottom-2 w-1 rounded-r-full'
      : 'absolute -right-2 top-2 bottom-2 w-1 rounded-l-full'
    : position === 'top'
      ? 'absolute inset-x-2 bottom-0 h-1 rounded-t-full'
      : 'absolute inset-x-2 top-0 h-1 rounded-b-full';

  const activeStyle: React.CSSProperties = {
    backgroundColor: `rgba(${accentRgb}, 0.2)`,
    borderColor: `rgba(${accentRgb}, 0.5)`,
    color: currentAccentHex,
    boxShadow: `0 4px 12px rgba(${accentRgb}, 0.15)`,
  };

  const indicatorStyle: React.CSSProperties = {
    backgroundColor: currentAccentHex,
    boxShadow: `0 0 8px rgba(${accentRgb}, 0.55)`,
  };

  const renderSearchButton = () => (
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
      className={`relative group flex shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:text-orange-400 hover:bg-neutral-900 border border-neutral-800/80 hover:border-orange-500/50 transition-all duration-150 cursor-pointer shadow-xs active:scale-95 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] gv-accent-hover ${itemShape}`}
    >
      <Search className="h-5 w-5 shrink-0 stroke-[2.2]" />
      {labelsOn && <span className={labelClass}>Search</span>}
    </button>
  );

  const renderNavItem = (item: NavRailItem) => {
    const Icon = item.icon;
    return (
      <div
        key={item.id}
        className={`relative group flex items-center justify-center shrink-0 ${
          isVertical ? 'w-full' : ''
        }`}
      >
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
          className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${itemShape} ${
            item.isActive
              ? 'border shadow-md'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
          }`}
          style={item.isActive ? activeStyle : {}}
        >
          {/* Active glow indicator bar on the docked edge */}
          {item.isActive && <span className={indicatorClass} style={indicatorStyle} />}

          <Icon className="h-5 w-5 shrink-0 stroke-[2.2]" />

          {labelsOn && <span className={labelClass}>{item.railLabel}</span>}

          {/* Count indicator dot if present */}
          {item.count !== null && item.count > 0 && !item.isActive && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-400/80" />
          )}
        </button>
      </div>
    );
  };

  const renderSettingsButton = () => (
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
      className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${itemShape} ${
        currentView === 'settings'
          ? 'border shadow-md'
          : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
      }`}
      style={currentView === 'settings' ? activeStyle : {}}
    >
      {currentView === 'settings' && <span className={indicatorClass} style={indicatorStyle} />}
      <Settings className="h-5 w-5 shrink-0 stroke-[2.2]" />

      {labelsOn && <span className={labelClass}>Settings</span>}
    </button>
  );

  const tooltipNode = tooltip && (
    <div className="pointer-events-none fixed z-[60] hidden md:block animate-fade-in" style={tooltip.style}>
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
  );

  // Horizontal docks: a full-width bar under the header or along the bottom.
  if (!isVertical) {
    return (
      <>
        <aside
          className={`relative z-30 flex w-full shrink-0 items-center gap-1.5 overflow-x-auto bg-neutral-950/95 backdrop-blur-md py-1.5 select-none ${
            settings.compactRail ? 'px-2' : 'px-2 sm:px-3'
          } ${position === 'top' ? 'border-b' : 'border-t'} border-orange-950/40 [scrollbar-width:thin] [scrollbar-color:rgb(64,64,64)_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700`}
          aria-label="Navigation Rail"
        >
          {renderSearchButton()}

          <div className="w-px h-6 shrink-0 bg-neutral-900/90" />

          {navItems.map(renderNavItem)}

          <div className={`ml-auto flex shrink-0 items-center ${settings.compactRail ? 'pl-0.5' : 'pl-1.5'}`}>
            {renderSettingsButton()}
          </div>
        </aside>

        {tooltipNode}
      </>
    );
  }

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
        className={`fixed top-14 bottom-0 z-40 flex flex-col items-center justify-between py-3 sm:py-4 backdrop-blur-md transition-transform duration-200 select-none shrink-0 lg:static lg:h-full lg:translate-x-0 bg-neutral-950/95 ${
          position === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        } border-orange-950/40 ${
          labelsOn
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
          {/* Search Bar Icon Button */}
          <div className="relative group flex items-center justify-center w-full">
            {renderSearchButton()}
          </div>

          {/* Separator under search */}
          <div className="w-8 h-px shrink-0 bg-neutral-900/90" />

          {navItems.map(renderNavItem)}
        </div>

        {/* Bottom: Settings */}
        <div
          className={`flex shrink-0 flex-col items-center gap-2 w-full ${settings.compactRail ? 'px-1' : 'px-2'} pt-3 border-t border-neutral-900`}
        >
          <div className="relative group flex items-center justify-center w-full">
            {renderSettingsButton()}
          </div>
        </div>
      </aside>

      {tooltipNode}
    </>
  );
};
