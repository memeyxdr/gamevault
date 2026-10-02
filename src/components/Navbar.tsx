import React from 'react';
import { Menu, X, Trophy, Lock } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  totalSites: number;
  onLockVault?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
  totalSites,
  onLockVault,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-left font-semibold text-lg tracking-tight text-neutral-100 transition-colors hover:text-white"
          >
            GameVault
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap ${
              currentView === 'home'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigate('all-sites')}
            className={`transition-colors whitespace-nowrap ${
              currentView === 'all-sites'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Sites
          </button>

          <button
            type="button"
            onClick={() => onNavigate('best-games')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentView === 'best-games'
                ? 'text-white border-b-2 border-yellow-400 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span>Best Games</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className={`transition-colors whitespace-nowrap ${
              currentView === 'categories' || currentView === 'category-detail'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Categories
          </button>

          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className={`transition-colors whitespace-nowrap ${
              currentView === 'favorites'
                ? 'text-white border-b-2 border-neutral-100 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Starred Sites
          </button>
        </nav>

        {/* Zone 3: Directory Status & Lock Action */}
        <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
          <span className="hidden sm:inline tabular-nums">{totalSites} sites indexed</span>

          {onLockVault && (
            <button
              type="button"
              onClick={onLockVault}
              title="Lock Vault"
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/90 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
