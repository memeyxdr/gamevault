import React from 'react';
import { Menu, X, Lock, Compass } from 'lucide-react';
import { ViewMode } from '../types';
import { DiceIcon } from './DiceIcon';
import { useSettings } from '../context/SettingsContext';

interface NavbarProps {
  currentView?: ViewMode;
  onNavigate?: (view: ViewMode) => void;
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
  const { settings, currentAccentHex, accentRgb } = useSettings();

  return (
    <>
      <header className="sticky top-0 z-50 shrink-0 w-full border-b border-orange-950/40 bg-neutral-950/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(234,88,12,0.15)]" style={{ borderColor: `rgba(${accentRgb}, 0.24)`, boxShadow: `0 4px 20px -10px rgba(${accentRgb}, 0.2)` }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-6 lg:px-8">
          {/* Zone 1: Wordmark & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-900 hover:text-orange-400 lg:hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
                style={{ '--gv-accent-hover': currentAccentHex } as React.CSSProperties}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenWhatsNew}
                className="text-left font-semibold text-base sm:text-lg tracking-tight text-neutral-100 transition-colors hover:text-orange-200 flex items-center gap-1.5 sm:gap-2 group cursor-pointer"
                title="Click to view What's new in v1.4 (Layout Redesign)"
              >
                <span className="whitespace-nowrap">GameVault</span>
                <span className="rounded-full border border-orange-500/50 bg-orange-500/15 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-medium text-orange-400 group-hover:bg-orange-500/25 group-hover:border-orange-500/70 transition-colors whitespace-nowrap">
                  v1.4
                </span>
              </button>

              <span
                className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold text-orange-400 whitespace-nowrap shadow-xs"
                title="GameVault Beta"
              >
                Beta
              </span>
            </div>
          </div>

          {/* Zone 3: Actions & Status */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 xl:gap-3 text-xs text-neutral-400 font-mono shrink-0">
            {/* 🌐 In-Site Browser Quick Action Button */}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('browser')}
                title="In-Site Browser - Browse websites & proxies inside GameVault"
                aria-label="In-Site Browser"
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg border p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 ${
                  currentView === 'browser'
                    ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow-sm shadow-orange-500/20'
                    : 'border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:border-orange-500/50 hover:text-orange-300'
                }`}
                style={currentView === 'browser' ? {
                  borderColor: currentAccentHex,
                  backgroundColor: `rgba(${accentRgb}, 0.16)`,
                  color: currentAccentHex,
                  boxShadow: `0 1px 8px rgba(${accentRgb}, 0.14)`,
                } : undefined}
              >
                <Compass className="h-4 w-4 shrink-0" style={{ color: currentAccentHex }} />
                <span className="hidden sm:inline font-sans font-medium whitespace-nowrap">Browser</span>
              </button>
            )}

            {/* 🎲 Random Game / I'm Feeling Lucky Button */}
            <button
              type="button"
              onClick={onLaunchRandomGame}
              title="Random Game / I'm Feeling Lucky - Instantly pick and launch a top-rated game"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/60 hover:text-orange-300 transition-all active:scale-95 shadow-sm shadow-orange-500/10 cursor-pointer shrink-0"
              style={{ borderColor: `rgba(${accentRgb}, 0.45)`, backgroundColor: `rgba(${accentRgb}, 0.1)`, color: currentAccentHex, boxShadow: `0 1px 8px rgba(${accentRgb}, 0.12)` }}
            >
              <DiceIcon className="h-4 w-4 shrink-0 rounded-[3px] shadow-xs" />
              <span className="hidden xl:inline font-sans font-medium whitespace-nowrap">Random Game</span>
              <span className="hidden sm:inline xl:hidden font-sans font-medium whitespace-nowrap">Random</span>
            </button>

            <span className="hidden xl:inline tabular-nums shrink-0">{totalSites} sites indexed</span>
            <span className="hidden md:inline xl:hidden tabular-nums shrink-0">{totalSites} sites</span>

            {onLockVault && (
              <button
                type="button"
                onClick={onLockVault}
                title="Lock Vault"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/90 p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-neutral-300 hover:border-orange-500/50 hover:text-orange-300 transition-colors shrink-0 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* External Gateway / AnyProxy Disclaimer Modal */}
    </>
  );
};
