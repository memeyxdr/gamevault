import React, { useState } from 'react';
import {
  Search,
  FolderOpen,
} from 'lucide-react';
import { Category, GameSiteLink } from '../types';
import { CategoryCard } from './CategoryCard';

interface CategoriesOverviewProps {
  categories: Category[];
  sites: GameSiteLink[];
  onSelectCategory: (categoryId: string) => void;
  siteCountByCategory: Record<string, number>;
}

export const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({
  categories,
  sites,
  onSelectCategory,
  siteCountByCategory,
}) => {
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter((cat) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Categories</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Organizational categories for cataloging links to game sites
        </p>
      </div>

      {/* Structural Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
          <div className="text-xs text-neutral-400">Total Categories</div>
          <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
            {categories.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Active groupings</div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
          <div className="text-xs text-neutral-400">Indexed Sites</div>
          <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
            {sites.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Across all categories</div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
          <div className="text-xs text-neutral-400">Status</div>
          <div className="mt-1 font-mono text-xl font-semibold text-neutral-200">
            {categories.length > 0 ? 'Configured' : 'Empty'}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Directory foundation</div>
        </div>
      </div>

      {/* Search Input (if categories exist) */}
      {categories.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-800 bg-neutral-900/80 py-2 pl-9 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </div>
      )}

      {/* Categories Grid or Clean Empty State */}
      {categories.length > 0 ? (
        filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                siteCount={siteCountByCategory[category.id] || 0}
                onSelect={onSelectCategory}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800/80 bg-neutral-900/20 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 mb-3">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-200">No categories found</h3>
            <p className="mt-1 text-xs text-neutral-400">
              No category matches your search filter.
            </p>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800/80 bg-neutral-900/20 py-20 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 mb-3">
            <FolderOpen className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-neutral-200">
            No categories available
          </h3>

          <p className="mt-1.5 max-w-sm text-xs text-neutral-400 leading-relaxed">
            All categories have been cleared.
          </p>
        </div>
      )}
    </div>
  );
};
