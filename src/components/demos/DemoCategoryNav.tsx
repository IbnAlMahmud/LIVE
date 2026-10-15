import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const DEMO_CATEGORIES = [
  'All',
  'Restaurant',
  'Real Estate',
  'Interior Design',
  'Hotel & Resort',
  'E-Commerce',
  'Technology',
  'Education',
  'Business',
  'Personal Brand',
  'Other'
];

interface DemoCategoryNavProps {
  categories?: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
}

export function DemoCategoryNav({
  categories = DEMO_CATEGORIES,
  activeCategory,
  onSelectCategory,
  counts = {}
}: DemoCategoryNavProps) {
  return (
    <div className="w-full border-b border-border-color bg-white/95 backdrop-blur-md sticky top-16 z-20 py-2">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            const count = counts[cat] ?? (cat === 'All' ? counts['All'] : undefined);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  "relative shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 rounded-full",
                  isActive
                    ? "text-text-main font-bold"
                    : "text-text-muted hover:text-text-main hover:bg-slate-50"
                )}
              >
                <span>{cat}</span>

                {typeof count === 'number' && (
                  <span
                    className={cn(
                      "font-mono text-[11px] px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-fresh-green text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="demo-category-active-pill"
                    className="absolute inset-0 bg-slate-100/70 -z-10 rounded-full border border-slate-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
