import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Star, Heart, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DemoSortOption = 'featured' | 'newest' | 'alphabetical';

interface DemoDiscoveryBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  industries: string[];
  onlyFeatured: boolean;
  onToggleFeatured: () => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  sortBy: DemoSortOption;
  onSortChange: (sort: DemoSortOption) => void;
  totalFiltered: number;
  totalAll: number;
  onReset: () => void;
  comparedCount: number;
  onOpenCompare: () => void;
}

export function DemoDiscoveryBar({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  industries,
  onlyFeatured,
  onToggleFeatured,
  onlyFavorites,
  onToggleFavorites,
  favoritesCount,
  sortBy,
  onSortChange,
  totalFiltered,
  totalAll,
  onReset,
  comparedCount,
  onOpenCompare
}: DemoDiscoveryBarProps) {
  const hasActiveFilters = Boolean(
    searchQuery || selectedIndustry !== 'All' || onlyFeatured || onlyFavorites
  );

  return (
    <div id="demos-catalogue" className="pt-8 pb-6 border-b border-border-color">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search demos by name, features, or stack (e.g. Menu, Reservation, React)..."
            className="w-full pl-10 pr-9 py-2.5 bg-soft-white border border-border-color rounded-xl text-sm text-text-main placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-text-main"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter / Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Industry Filter dropdown */}
          {industries.length > 1 && (
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => onIndustryChange(e.target.value)}
                className="appearance-none bg-soft-white border border-border-color text-xs font-semibold text-text-main pl-3 pr-8 py-2.5 rounded-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-green/30 cursor-pointer"
              >
                <option value="All">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <SlidersHorizontal size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          )}

          {/* Featured Toggle */}
          <button
            type="button"
            onClick={onToggleFeatured}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors",
              onlyFeatured
                ? "bg-fresh-green/10 text-elegant-green border-fresh-green/30"
                : "bg-soft-white text-text-muted border-border-color hover:bg-white hover:text-text-main"
            )}
          >
            <Star size={13} className={onlyFeatured ? "fill-fresh-green text-fresh-green" : ""} />
            <span>Featured</span>
          </button>

          {/* Favorites Toggle */}
          <button
            type="button"
            onClick={onToggleFavorites}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors",
              onlyFavorites
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-soft-white text-text-muted border-border-color hover:bg-white hover:text-text-main"
            )}
          >
            <Heart size={13} className={onlyFavorites ? "fill-rose-500 text-rose-500" : ""} />
            <span>Saved ({favoritesCount})</span>
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as DemoSortOption)}
              className="appearance-none bg-soft-white border border-border-color text-xs font-semibold text-text-main pl-3 pr-8 py-2.5 rounded-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-green/30 cursor-pointer"
            >
              <option value="featured">Sort: Curated</option>
              <option value="newest">Sort: Newest</option>
              <option value="alphabetical">Sort: A – Z</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Compare Trigger Button */}
          {comparedCount > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-text-main text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Layers size={13} />
              <span>Compare ({comparedCount})</span>
            </button>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-text-muted hover:text-text-main font-semibold underline underline-offset-4 px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count Line */}
      <div className="mt-4 flex items-center justify-between text-xs text-text-muted font-mono">
        <span>
          Showing <strong className="text-text-main font-bold">{totalFiltered}</strong> of {totalAll} live demos
        </span>

        {hasActiveFilters && (
          <span className="text-elegant-green">
            Filtered results
          </span>
        )}
      </div>
    </div>
  );
}
