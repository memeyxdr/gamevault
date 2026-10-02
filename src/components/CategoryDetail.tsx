import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  ExternalLink,
  Trash2,
  Star,
  Globe,
  FolderOpen,
  KeyRound,
  Copy,
  Check,
  Trophy,
} from 'lucide-react';
import { Category, GameSiteLink } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryDetailProps {
  category: Category;
  sites: GameSiteLink[];
  onBack: () => void;
  onToggleFavoriteSite: (siteId: string) => void;
  onDeleteSite: (siteId: string) => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  sites,
  onBack,
  onToggleFavoriteSite,
  onDeleteSite,
}) => {
  const [siteSearch, setSiteSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter sites inside this category
  const filteredSites = sites.filter((site) => {
    const q = siteSearch.toLowerCase();
    const matchesSearch =
      site.name.toLowerCase().includes(q) ||
      site.domain.toLowerCase().includes(q) ||
      site.url.toLowerCase().includes(q) ||
      (site.description && site.description.toLowerCase().includes(q)) ||
      (site.specialNotice && site.specialNotice.toLowerCase().includes(q)) ||
      (site.passwordInfo && site.passwordInfo.toLowerCase().includes(q));
    const matchesTag = selectedTag ? site.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(sites.flatMap((s) => s.tags)));

  return (
    <div className="space-y-6">
      {/* Breadcrumb Trail & Back Action */}
      <div className="flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-neutral-200 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Categories</span>
          </button>
          <span aria-hidden="true" className="text-neutral-600">/</span>
          <span className="text-neutral-200 font-medium">{category.name}</span>
        </nav>
      </div>

      {/* Category Header Card */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-100">
            <CategoryIcon name={category.icon} className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                {category.name}
              </h1>
              <span className="font-mono text-xs tabular-nums text-neutral-400">
                {sites.length} {sites.length === 1 ? 'site' : 'sites'}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Unboxed Metadata row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-800/80 pt-3 text-xs text-neutral-400 font-mono">
          <span>Slug: /{category.slug}</span>
        </div>
      </div>

      {/* Filter / Search Bar (if sites exist) */}
      {sites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder={`Search within ${category.name}...`}
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900/80 py-2 pl-9 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All Tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Site Links Grid or Clean Empty State */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSites.map((site) => {
            const isUnlockedThingy = site.name.toLowerCase().includes('unlocked thingy') || site.id === 'site-unlocked-thingy';
            const isKiwi = site.name.toLowerCase() === 'kiwi' || site.id === 'site-kiwi-games';

            return (
              <div
                key={site.id}
                className="group relative flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/70"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-neutral-300 shrink-0">
                        <Globe className="h-4 w-4" />
                      </div>
                      {site.isBestGame && (
                        <div
                          className="flex items-center gap-1 rounded bg-yellow-950/60 border border-yellow-700/60 px-1.5 py-0.5"
                          title={site.rank ? `Leaderboard #${site.rank}` : 'Best Game'}
                        >
                          <Trophy className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                          {site.rank && (
                            <span className="font-mono text-[11px] font-bold text-yellow-400">
                              #{site.rank}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(site.id, site.url)}
                        className="p-1 rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === site.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavoriteSite(site.id)}
                        className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
                        title={site.isFavorite ? 'Remove star' : 'Star site'}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            site.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSite(site.id)}
                        className="p-1 text-neutral-400 hover:text-rose-400 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white">{site.name}</h4>
                  <div className="mt-0.5 text-xs text-neutral-500 font-mono">{site.domain}</div>

                  {/* Kiwi: Red bold text */}
                  {isKiwi && (
                    <div className="mt-2.5 rounded border border-red-900/80 bg-red-950/40 px-2 py-1">
                      <span className="font-bold text-red-500 text-xs tracking-wide uppercase">
                        blocked but maby unblocked
                      </span>
                    </div>
                  )}

                  {/* Unlocked Thingy: Password Callout */}
                  {isUnlockedThingy && (
                    <div className="mt-2.5 rounded border border-amber-900/80 bg-amber-950/40 p-2 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono text-xs">
                        <KeyRound className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>Password: funni</span>
                      </div>
                      <div className="text-[11px] font-medium text-amber-200/90 leading-snug">
                        do not add web URL when entering password
                      </div>
                    </div>
                  )}

                  {site.description && (
                    <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                      {site.description}
                    </p>
                  )}

                  {site.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
                      {site.tags.map((t, i) => (
                        <React.Fragment key={t}>
                          <span>{t}</span>
                          {i < site.tags.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-[11px] text-neutral-500 truncate max-w-[120px]">
                    {site.domain}
                  </span>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800/80 bg-neutral-900/20 py-16 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 mb-3">
            <FolderOpen className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-neutral-200">
            No game sites in this category
          </h3>

          <p className="mt-1.5 max-w-sm text-xs text-neutral-400 leading-relaxed">
            This category has no indexed game site links.
          </p>
        </div>
      )}
    </div>
  );
};
