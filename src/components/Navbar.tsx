import React from 'react';
import { Menu, X, Trophy, Lock } from 'lucide-react';
import { ViewMode } from '../types';
import { DiceIcon } from './DiceIcon';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  totalSites: number;
  onLockVault?: () => void;
  onOpenWhatsNew: () => void;
  onLaunchRandomGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
  totalSites,
  onLockVault,
  onOpenWhatsNew,
  onLaunchRandomGame,
}) => {
  return (
    <header className="sticky top-0 z-50 shrink-0 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenWhatsNew}
            className="text-left font-semibold text-lg tracking-tight text-neutral-100 transition-colors hover:text-white flex items-center gap-2 group cursor-pointer"
            title="Click to view What's new in v1.2"
          >
            <span>GameVault</span>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
              v1.2
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Shown on desktop when sidebar toggle is hidden) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'home'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigate('all-sites')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'all-sites'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Sites
          </button>

          <button
            type="button"
            onClick={() => onNavigate('best-games')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'best-games'
                ? 'text-white border-b-2 border-yellow-400 pb-0.5 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span>Best Games</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'categories' || currentView === 'category-detail'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Categories
          </button>

          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'favorites'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Starred Sites
          </button>
        </nav>

        {/* Zone 3: Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 text-xs text-neutral-400 font-mono shrink-0">
          {/* 🎲 Random Game / I'm Feeling Lucky Button */}
          <button
            type="button"
            onClick={onLaunchRandomGame}
            title="Random Game / I'm Feeling Lucky - Instantly pick and launch a top-rated game"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:text-emerald-300 transition-all active:scale-95 shadow-sm shadow-emerald-500/10 cursor-pointer shrink-0"
          >
            <DiceIcon className="h-4 w-4 shrink-0 rounded-[3px] shadow-xs" />
            <span className="hidden xl:inline font-sans font-medium whitespace-nowrap">Random Game</span>
            <span className="hidden sm:inline xl:hidden font-sans font-medium whitespace-nowrap">Random</span>
            <span className="sm:hidden font-sans font-medium whitespace-nowrap">Lucky</span>
          </button>

          <span className="hidden xl:inline tabular-nums shrink-0">{totalSites} sites indexed</span>
          <span className="hidden md:inline xl:hidden tabular-nums shrink-0">{totalSites} sites</span>

          {onLockVault && (
            <button
              type="button"
              onClick={onLockVault}
              title="Lock Vault"
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/90 px-2 sm:px-2.5 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
