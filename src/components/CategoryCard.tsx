import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
  category: Category;
  siteCount: number;
  onSelect: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  siteCount,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(category.id)}
      className="group relative flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/70 cursor-pointer"
    >
      <div>
        {/* Top Header of Card */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 text-neutral-200 group-hover:border-neutral-700 group-hover:text-white transition-colors">
            <CategoryIcon name={category.icon} className="h-5 w-5" />
          </div>

          <div className="text-right">
            <span className="font-mono text-xs tabular-nums text-neutral-400">
              {siteCount} {siteCount === 1 ? 'site' : 'sites'}
            </span>
          </div>
        </div>

        {/* Category Title */}
        <h3 className="text-base font-semibold text-neutral-100 group-hover:text-white transition-colors">
          {category.name}
        </h3>

        {/* Category Description */}
        <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      {/* Card Action Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <span>/{category.slug}</span>
        </div>

        <span className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 group-hover:text-neutral-200 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
};
