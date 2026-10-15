import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { mockDemos } from '@/data/mockDemos';
import { useProjects } from '@/hooks/useContent';
import { WorkProject } from '@/components/work/types';
import { SelectedWorksHeader } from '@/components/work/SelectedWorksHeader';
import { ProjectFilter } from '@/components/work/ProjectFilter';
import { FeaturedProject } from '@/components/work/FeaturedProject';
import { EditorialProject } from '@/components/work/EditorialProject';
import { SuccessStoryCTA } from '@/components/work/SuccessStoryCTA';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function Work() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects: dbProjects, loading } = useProjects();

  // Unified projects list with fallback to curated high-fidelity studio mock demos
  const allProjects: WorkProject[] = useMemo(() => {
    const raw = dbProjects.length > 0 ? dbProjects : mockDemos;
    return raw
      .filter((p: any) => p.published !== false)
      .map((p: any, idx: number) => ({
        id: p.id || `proj-${idx}`,
        title: p.title || 'Untitled Project',
        slug: p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `project-${idx}`),
        description: p.description || 'Editorial digital architecture for high-growth commercial brands.',
        thumbnail: p.thumbnail || p.desktopPreview || '',
        desktopPreview: p.desktopPreview || p.thumbnail || '',
        category: p.category || 'Web Architecture',
        industry: p.industry || p.category || 'Technology',
        featured: p.featured ?? (idx === 0),
        published: p.published !== false,
        createdAt: p.createdAt || '2026-01-01',
        liveUrl: p.liveUrl || p.url || '',
        services: p.services || ['UI/UX Design', 'Custom Build', 'Responsive Framework'],
        year: p.year || '2026'
      }));
  }, [dbProjects]);

  // Extract dynamic categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    allProjects.forEach((p) => {
      if (p.category) {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [allProjects]);

  // Read initial category or industry from query params (e.g. /work?industry=restaurant or /work?category=Restaurant)
  const initialCategory = useMemo(() => {
    const catParam = searchParams.get('category') || searchParams.get('industry');
    if (!catParam) return 'All';
    const match = categories.find(
      (c) => c.toLowerCase() === catParam.toLowerCase()
    );
    return match || 'All';
  }, [searchParams, categories]);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      searchParams.delete('industry');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: category.toLowerCase() }, { replace: true });
    }
  };

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allProjects.length };
    categories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = allProjects.filter(
          (p) =>
            p.category?.toLowerCase() === cat.toLowerCase() ||
            p.industry?.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [categories, allProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter(
      (p) =>
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.industry?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [allProjects, activeCategory]);

  const featuredProject = filteredProjects[0];
  const secondaryProjects = filteredProjects.slice(1);

  return (
    <div className="bg-white min-h-screen selection:bg-fresh-green selection:text-white">
      <Helmet>
        <title>Selected Works & Case Studies | AureviaWeb Studio</title>
        <meta
          name="description"
          content="Explore our editorial case studies and interactive website showcases built for ambitious businesses."
        />
        <meta property="og:title" content="Selected Works & Case Studies | AureviaWeb Studio" />
        <meta
          property="og:description"
          content="Editorial web design, interactive prototypes, and commercial digital architecture."
        />
      </Helmet>

      {/* 1. EDITORIAL HEADER */}
      <SelectedWorksHeader projectCount={allProjects.length} />

      {/* 2. STICKY HORIZONTAL EDITORIAL CATEGORY FILTER */}
      <ProjectFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
        categoryCounts={categoryCounts}
      />

      {/* 3. EDITORIAL SHOWCASE BODY */}
      <main className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10 sm:py-12 md:py-16">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 border-3 border-fresh-green/30 border-t-fresh-green rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Loading AureviaWeb Archives...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
            {/* Primary Featured Case Study (Project 01) */}
            {featuredProject && (
              <FeaturedProject project={featuredProject} index={1} />
            )}

            {/* Asymmetric Editorial Follow-ups (Project 02..N) */}
            {secondaryProjects.map((project, idx) => (
              <EditorialProject
                key={project.id || idx}
                project={project}
                index={idx + 1}
              />
            ))}
          </div>
        ) : (
          /* High-end Empty State */
          <div className="bg-soft-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-12 md:p-16 text-center max-w-2xl mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-white border border-border-color text-elegant-green flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sparkles size={22} className="text-fresh-green" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-2">Works Coming Soon</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6 leading-relaxed">
              We are currently archiving additional case studies for this category. Explore our other sectors or contact our design leads for private portfolio previews.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-text-main text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <RotateCcw size={14} />
              <span>Reset Sector Filter</span>
            </button>
          </div>
        )}
      </main>

      {/* 4. SUCCESS STORY CTA (UPGRADED EDITORIAL CLOSING) */}
      <SuccessStoryCTA />
    </div>
  );
}
