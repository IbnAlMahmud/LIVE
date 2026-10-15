import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export function ProjectFilter({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: ProjectFilterProps) {
  return (
    <div className="w-full bg-white border-b border-border-color sticky top-[68px] sm:top-[76px] z-30 backdrop-blur-md bg-white/95">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex items-center justify-between py-3 overflow-x-auto no-scrollbar scroll-smooth gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              const count = categoryCounts[cat] || 0;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={cn(
                    "relative px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green",
                    isActive
                      ? "bg-text-main text-white shadow-sm"
                      : "text-text-muted hover:text-text-main hover:bg-soft-white"
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-fresh-green text-white font-bold"
                        : "bg-slate-100 text-text-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center text-xs font-mono text-text-muted shrink-0 pl-4 border-l border-border-color/80">
            <span>FILTER BY SECTOR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
