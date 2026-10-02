import React from 'react';
import {
  Crown,
  Shield,
  ShieldAlert,
  Sparkles,
  Ban,
  Gamepad2,
  Trophy,
  Medal,
  ArrowRight,
  Flame,
  UserX,
  Compass,
} from 'lucide-react';
import { ViewMode, GameSiteLink, Category } from '../types';

interface HomePageProps {
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (categoryId: string) => void;
  categories: Category[];
  sites: GameSiteLink[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCategory,
  categories,
  sites,
}) => {
  const bestGames = sites.filter((s) => s.isBestGame).sort((a, b) => (a.rank || 99) - (b.rank || 99));
  const bestWebsites = sites.filter((s) => s.isBestWebsite).sort((a, b) => (a.rank || 99) - (b.rank || 99));

  return (
    <div className="space-y-10 pb-16 pt-2">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Flame className="h-3.5 w-3.5" />
            <span>Official Vault Headquarters & Roster</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-mono">
            GameVault <span className="text-emerald-400">HQ</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            Welcome to the central command hub. Access the complete index of unblocked game links,
            stealth mirrors, official leaderboards, media streaming tools, and community roster.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('all-sites')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-[0.98]"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Browse All Games ({sites.length})</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('best-games')}
              className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-all"
            >
              <Trophy className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>Best Games #1–#9</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('best-websites')}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Medal className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Best Websites</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. COMMAND HIERARCHY & ROSTER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">Leadership & Command Roster</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Rank Structure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Captain: Ashwath (The Owner & Revamp Architect) */}
          <div className="relative overflow-hidden rounded-xl border border-amber-500/60 bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded bg-amber-500/20 border border-amber-500/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 font-mono tracking-wider">
                  <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  CAPTAIN & OWNER
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-wide">Ashwath</h3>
                <p className="text-xs text-amber-200 font-medium">
                  The Owner of GameVault · Revamp Architect
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-2xl shadow-inner">
                👑
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-300">
              Supreme executive owner of GameVault. Mastermind behind the major platform revamp, link indexing, and vault infrastructure.
            </div>
          </div>

          {/* Captain: Aadhav (Co-Captain) */}
          <div className="relative overflow-hidden rounded-xl border border-blue-500/40 bg-gradient-to-br from-neutral-900 via-neutral-900 to-blue-950/20 p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded bg-blue-500/15 border border-blue-500/40 px-2.5 py-0.5 text-[11px] font-bold text-blue-300 font-mono tracking-wider">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                  CAPTAIN
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-wide">Aadhav</h3>
                <p className="text-xs text-blue-200/80 font-medium">
                  Vault Captain
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-xl">
                ⚔️
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
              Executive vault captain alongside Ashwath, assisting in community direction and administrative governance.
            </div>
          </div>
        </div>

        {/* Commanders Status & Special Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Commanders Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-center gap-2 text-neutral-300 font-semibold text-sm">
              <Shield className="h-4 w-4 text-neutral-400" />
              <span>Commanders</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded bg-neutral-800 border border-neutral-700/60 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-300">
                None
              </span>
              <span className="text-xs text-neutral-400">
                No commanders currently appointed.
              </span>
            </div>
            <p className="mt-2.5 text-[11px] text-neutral-400 leading-relaxed">
              Command positions are reserved for trusted vault operatives and verified contributors.
            </p>
          </div>

          {/* Revamp Honors / Dedicated Recognition */}
          <div className="md:col-span-2 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-neutral-900/80 to-neutral-900 p-5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Special Revamp Credit</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
              Major appreciation to <span className="font-bold text-emerald-300 underline underline-offset-2">Ashwath</span> — this entire platform overhaul, enhanced game database, stealth proxies, and directory revamp is thanks to him!
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400/90 font-mono">
              <span>✓ UI Architecture</span>
              <span>·</span>
              <span>✓ Database Integration</span>
              <span>·</span>
              <span>✓ Best Websites Directory</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DISCIPLINARY WALL / PERMABANNED SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold tracking-tight text-white">Disciplinary Wall: Permabanned</h2>
          </div>
          <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400 tracking-wider">
            ZERO TOLERANCE
          </span>
        </div>

        <div className="rounded-xl border border-red-900/60 bg-gradient-to-b from-red-950/20 via-neutral-900/90 to-neutral-900 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-red-300 font-medium">
            <Ban className="h-4 w-4 text-red-400 shrink-0" />
            <span>
              The following individuals have been permanently banned and strictly blacklisted from all vault operations, privileges, and community standing:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Permabanned Person 1: shreehari */}
            <div className="flex items-start gap-3.5 rounded-lg border border-red-900/80 bg-black/60 p-4 shadow-inner">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <UserX className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white tracking-wide">shreehari</h4>
                  <span className="rounded bg-red-950 border border-red-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-400 uppercase">
                    Permabanned
                  </span>
                </div>
                <p className="text-xs text-red-200/80 leading-snug">
                  Behaved horridly and committed severe conduct infractions.
                </p>
              </div>
            </div>

            {/* Permabanned Person 2: Ishaan appalling */}
            <div className="flex items-start gap-3.5 rounded-lg border border-red-900/80 bg-black/60 p-4 shadow-inner">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <UserX className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white tracking-wide">Ishaan appalling</h4>
                  <span className="rounded bg-red-950 border border-red-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-400 uppercase">
                    Permabanned
                  </span>
                </div>
                <p className="text-xs text-red-200/80 leading-snug">
                  Behaved horridly and engaged in disruptive behavior.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded border border-red-950 bg-red-950/30 px-3 py-2 text-[11px] text-red-300/80">
            <strong>Notice:</strong> Permanent bans are non-negotiable. Harassment, disruptive misconduct, or horrid behavior results in an immediate permanent ban across all records.
          </div>
        </div>
      </section>

      {/* 4. QUICK VAULT EXPLORER */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">Vault Highlights</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Tile 1: Best Games */}
          <div
            onClick={() => onNavigate('best-games')}
            className="cursor-pointer group rounded-xl border border-yellow-500/30 bg-neutral-900/60 p-4 transition-all hover:border-yellow-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-yellow-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-mono text-xs font-bold text-yellow-400">#1 to #9</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
              Best Games Roster
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              The ranked top 9 titles including unlocked thingy, Invisible games, and Seraph.
            </p>
          </div>

          {/* Tile 2: Best Websites */}
          <div
            onClick={() => onNavigate('best-websites')}
            className="cursor-pointer group rounded-xl border border-amber-500/30 bg-neutral-900/60 p-4 transition-all hover:border-amber-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Medal className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="font-mono text-xs font-bold text-amber-400">#1 & #2</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
              Best Websites
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              SoundCloud (Unblocked Music) & SZVY Central v2 (Unblocked Movies).
            </p>
          </div>

          {/* Tile 3: Direct Game Links */}
          <div
            onClick={() => {
              const directCat = categories.find((c) => c.slug === 'direct-links');
              if (directCat) onSelectCategory(directCat.id);
              else onNavigate('all-sites');
            }}
            className="cursor-pointer group rounded-xl border border-rose-500/30 bg-neutral-900/60 p-4 transition-all hover:border-rose-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-rose-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Gamepad2 className="h-5 w-5 text-rose-400" />
              <span className="font-mono text-xs font-bold text-rose-400">Direct Play</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
              Direct Game Instances
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              Minecraft Classic, GeoFS, 1v1.lol, Drift Boss, and instant arcade play.
            </p>
          </div>

          {/* Tile 4: Web Tools & Emulators */}
          <div
            onClick={() => {
              const mediaCat = categories.find((c) => c.slug === 'music-web-tools');
              if (mediaCat) onSelectCategory(mediaCat.id);
              else onNavigate('all-sites');
            }}
            className="cursor-pointer group rounded-xl border border-sky-500/30 bg-neutral-900/60 p-4 transition-all hover:border-sky-500/60 hover:bg-neutral-900 hover:shadow-lg hover:shadow-sky-500/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400">Emulators</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
              Web Tools & Emulators
            </h3>
            <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
              TurboWarp, Ruffle Flash, EmulatorJS, WebGL Fluid Sim, and Cloud PC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
