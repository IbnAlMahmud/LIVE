import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useDemos } from '@/hooks/useContent';
import { DemoHeroShowcase } from '@/components/demos/DemoHeroShowcase';
import { DemoCategoryNav, DEMO_CATEGORIES } from '@/components/demos/DemoCategoryNav';
import { DemoDiscoveryBar, DemoSortOption } from '@/components/demos/DemoDiscoveryBar';
import { DemoEditorialCard, CardLayoutVariant } from '@/components/demos/DemoEditorialCard';
import { DemoComparisonModal } from '@/components/demos/DemoComparisonModal';
import { useFavorites, useCompare } from '@/lib/demoStorage';
import { ArrowUpRight, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { trackEvent } from '@/components/analytics/MetaPixel';

export default function Demos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { demos, loading } = useDemos();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { comparedIds, toggleCompare, clearCompare, isCompared } = useCompare();
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Read initial query params
  const paramCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (!paramCategory) return 'All';
    const match = DEMO_CATEGORIES.find(c => c.toLowerCase() === paramCategory.toLowerCase());
    return match || 'All';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<DemoSortOption>('featured');

  // Synchronize category param
  useEffect(() => {
    if (paramCategory) {
      const match = DEMO_CATEGORIES.find(c => c.toLowerCase() === paramCategory.toLowerCase());
      if (match && match !== activeCategory) {
        setActiveCategory(match);
      }
    }
  }, [paramCategory]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: category.toLowerCase() }, { replace: true });
    }
  };

  // Only published demos in public view
  const publishedDemos = useMemo(() => {
    return demos.filter(d => d.published !== false);
  }, [demos]);

  // Featured demos for Hero auto-rotation
  const heroDemos = useMemo(() => {
    const feat = publishedDemos.filter(d => d.featured === true);
    return feat.length > 0 ? feat : publishedDemos.slice(0, 5);
  }, [publishedDemos]);

  // Dynamic industry list
  const industries = useMemo(() => {
    const set = new Set<string>();
    publishedDemos.forEach(d => {
      if (d.industry) set.add(d.industry.trim());
    });
    return Array.from(set);
  }, [publishedDemos]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: publishedDemos.length };
    DEMO_CATEGORIES.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = publishedDemos.filter(d =>
          d.category.toLowerCase().includes(cat.toLowerCase()) ||
          (d.industry && d.industry.toLowerCase().includes(cat.toLowerCase()))
        ).length;
      }
    });
    return counts;
  }, [publishedDemos]);

  // Filtered & sorted demos
  const filteredDemos = useMemo(() => {
    let list = [...publishedDemos];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter(d =>
        d.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (d.industry && d.industry.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    // Industry filter
    if (selectedIndustry !== 'All') {
      list = list.filter(d => d.industry?.toLowerCase() === selectedIndustry.toLowerCase());
    }

    // Only featured
    if (onlyFeatured) {
      list = list.filter(d => d.featured === true);
    }

    // Only favorites
    if (onlyFavorites) {
      list = list.filter(d => favorites.includes(d.id));
    }

    // Search query across name, industry, features, technologies
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(d => {
        const nameMatch = d.name?.toLowerCase().includes(q);
        const catMatch = d.category?.toLowerCase().includes(q);
        const indMatch = d.industry?.toLowerCase().includes(q);
        const descMatch = d.description?.toLowerCase().includes(q) || d.shortDescription?.toLowerCase().includes(q);
        const featMatch = d.features?.some(f => f.toLowerCase().includes(q));
        const techMatch = d.technologies?.some(t => t.toLowerCase().includes(q));
        return nameMatch || catMatch || indMatch || descMatch || featMatch || techMatch;
      });
    }

    // Sort order
    if (sortBy === 'featured') {
      list.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [publishedDemos, activeCategory, selectedIndustry, onlyFeatured, onlyFavorites, favorites, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSelectedIndustry('All');
    setOnlyFeatured(false);
    setOnlyFavorites(false);
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  };

  // Compare demos data
  const comparedDemos = useMemo(() => {
    return publishedDemos.filter(d => comparedIds.includes(d.id));
  }, [publishedDemos, comparedIds]);

  return (
    <div className="bg-white min-h-screen selection:bg-fresh-green selection:text-white">
      <Helmet>
        <title>Interactive Website Demos & Digital Studio Showcase | AureviaWeb</title>
        <meta
          name="description"
          content="Explore curated interactive website demos built by AureviaWeb. Discover bespoke digital architectures for restaurants, luxury real estate, e-commerce, resorts, and modern SaaS."
        />
        <meta property="og:title" content="Interactive Website Demos | AureviaWeb Studio" />
        <meta
          property="og:description"
          content="Live interactive websites engineered for ambitious businesses. Test real layouts, menus, reservation systems, and booking funnels."
        />
      </Helmet>

      {/* 1. EDITORIAL HERO SHOWCASE WITH CINEMATIC AUTO-ROTATING GALLERY */}
      <DemoHeroShowcase demos={heroDemos} />

      {/* 2. STICKY CATEGORY NAVIGATION */}
      <DemoCategoryNav
        categories={DEMO_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        counts={categoryCounts}
      />

      {/* 3. MAIN INTERACTIVE SHOWCASE SECTION */}
      <main className="mx-auto max-w-[1440px] px-6 lg:px-12 py-8 sm:py-12">
        {/* Search, Filter & Sort Controls */}
        <DemoDiscoveryBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          industries={industries}
          onlyFeatured={onlyFeatured}
          onToggleFeatured={() => setOnlyFeatured(!onlyFeatured)}
          onlyFavorites={onlyFavorites}
          onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
          favoritesCount={favorites.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiltered={filteredDemos.length}
          totalAll={publishedDemos.length}
          onReset={handleResetFilters}
          comparedCount={comparedIds.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />

        {/* Catalog Body */}
        <div className="mt-10 sm:mt-12">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-3 border-fresh-green/30 border-t-fresh-green rounded-full animate-spin mx-auto mb-4" />
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Loading Digital Studio Showcase...
              </p>
            </div>
          ) : filteredDemos.length > 0 ? (
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {filteredDemos.map((demo, idx) => {
                let variant: CardLayoutVariant = 'standard';
                if (idx === 0) {
                  variant = 'featured-hero';
                } else if (idx % 2 === 1) {
                  variant = 'split-left';
                } else {
                  variant = 'split-right';
                }

                return (
                  <DemoEditorialCard
                    key={demo.id}
                    demo={demo}
                    index={idx}
                    variant={variant}
                    isFavorite={isFavorite(demo.id)}
                    onToggleFavorite={toggleFavorite}
                    isCompared={isCompared(demo.id)}
                    onToggleCompare={toggleCompare}
                  />
                );
              })}
            </div>
          ) : (
            /* Refined Empty State */
            <div className="bg-soft-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-12 md:p-16 text-center max-w-2xl mx-auto my-12">
              <div className="w-12 h-12 rounded-2xl bg-white border border-border-color text-elegant-green flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles size={22} className="text-fresh-green" />
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">No Matching Demos Found</h3>
              <p className="text-sm text-text-muted max-w-md mx-auto mb-6 leading-relaxed">
                We couldn't find any demos matching your specific filters or search keywords. Try resetting your criteria or contact our studio for a custom prototype preview.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-text-main text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 4. CLOSING EDITORIAL CALL TO ACTION */}
      <section className="bg-soft-white border-t border-border-color py-20 lg:py-28 mt-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-elegant-green block mb-4">
              Bespoke Digital Production
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight mb-6">
              Need a Website Built Specifically for Your Vision?
            </h2>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
              Each demo in our showcase is a proven, production-grade architectural baseline. We customize, rebrand, and deploy full commercial platforms tailored to your business objectives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/start-project"
                onClick={() => trackEvent('ContactInitiated', { source: 'demos_bottom_cta' })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-fresh-green text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg"
              >
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-border-color text-text-main font-bold text-sm hover:bg-slate-50 transition-all shadow-xs"
              >
                <span>Schedule a Consultation</span>
                <ArrowUpRight size={16} className="text-fresh-green" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIDE-BY-SIDE COMPARISON MODAL */}
      <DemoComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedDemos={comparedDemos}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />
    </div>
  );
}
