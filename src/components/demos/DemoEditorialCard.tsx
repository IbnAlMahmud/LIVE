import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Heart, Layers, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoItem } from '@/types/demo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { trackEvent } from '@/components/analytics/MetaPixel';
import { cn } from '@/lib/utils';

export type CardLayoutVariant = 'featured-hero' | 'split-left' | 'split-right' | 'standard';

interface DemoEditorialCardProps {
  key?: React.Key | null;
  demo: DemoItem;
  index: number;
  variant?: CardLayoutVariant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
}

export function DemoEditorialCard({
  demo,
  index,
  variant = 'standard',
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}: DemoEditorialCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const formattedIndex = String(index + 1).padStart(2, '0');
  const demoUrl = `/demos/${demo.slug || demo.id}`;

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('OpenLiveDemo', {
      demo_name: demo.name,
      demo_slug: demo.slug,
      demo_category: demo.category,
      live_url: demo.liveUrl
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const clipPathVariants = {
    hidden: {
      clipPath: 'inset(10% 0% 0% 0% round 1.5rem)',
      opacity: 0.5,
      scale: 1.02,
    },
    visible: {
      clipPath: 'inset(0% 0% 0% 0% round 1.5rem)',
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // --- VARIANT 1: FEATURED HERO CASE (FULL WIDTH 16:9 EDITORIAL SPOTLIGHT) ---
  if (variant === 'featured-hero') {
    return (
      <motion.article
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? false : "visible"}
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-700"
      >
        {/* Top Micro-bar */}
        <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border-color">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fresh-green/10 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-ping" />
              <span>Spotlight Demo</span>
            </div>
            <span className="text-border-color">/</span>
            <span className="font-mono text-xs font-bold text-text-muted tracking-widest uppercase">
              Project {formattedIndex}
            </span>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(demo.id)}
              aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
              className={cn(
                "p-2 rounded-full border transition-colors",
                isFavorite
                  ? "bg-rose-50 border-rose-200 text-rose-500"
                  : "bg-soft-white border-border-color text-slate-400 hover:text-text-main hover:bg-white"
              )}
            >
              <Heart size={15} className={isFavorite ? "fill-rose-500" : ""} />
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(demo.id)}
              aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
              className={cn(
                "p-2 rounded-full border transition-colors",
                isCompared
                  ? "bg-fresh-green/10 border-fresh-green/30 text-elegant-green"
                  : "bg-soft-white border-border-color text-slate-400 hover:text-text-main hover:bg-white"
              )}
            >
              <Layers size={15} />
            </button>
          </div>
        </motion.div>

        {/* 16:9 Visual Preview with Browser Chrome */}
        <motion.div variants={clipPathVariants} className="overflow-hidden rounded-2xl md:rounded-[2rem] border border-border-color bg-slate-50 shadow-sm mb-8">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 border-b border-border-color">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Globe size={11} />
              <span>{demo.liveUrl ? demo.liveUrl.replace('https://', '') : `${demo.slug}.aureviaweb.com`}</span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              {demo.category}
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden group/img">
            <OptimizedImage
              src={demo.desktopPreview || demo.thumbnail}
              alt={demo.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/img:scale-105"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              {demo.liveUrl && (
                <a
                  href={demo.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemoClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fresh-green text-white font-bold text-sm shadow-xl hover:bg-emerald-600 transition-all transform hover:scale-105"
                >
                  <span>Open Live Demo</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              <Link
                to={demoUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-text-main font-bold text-sm shadow-xl hover:bg-slate-100 transition-all"
              >
                <span>Read Case Study</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Editorial Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div variants={fadeUpVariants} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold text-elegant-green uppercase tracking-wider">
                {demo.industry || demo.category}
              </span>
              {demo.languages && demo.languages.length > 0 && (
                <>
                  <span className="text-border-color">·</span>
                  <span className="text-xs font-mono text-text-muted">
                    {demo.languages.join(' + ')}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight mb-4">
              <Link to={demoUrl} className="hover:text-fresh-green transition-colors">
                {demo.name}
              </Link>
            </h3>

            <p className="text-text-muted text-base leading-relaxed mb-6 max-w-2xl">
              {demo.description || demo.shortDescription}
            </p>

            {/* Key Features Chips */}
            {demo.features && demo.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {demo.features.slice(0, 5).map((feat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-soft-white border border-border-color text-xs font-medium text-text-main"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUpVariants} className="lg:col-span-5 flex flex-col justify-between h-full bg-soft-white border border-border-color rounded-2xl p-6">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider block mb-3">
                Deliverable Architecture
              </span>
              <div className="space-y-2 text-xs font-mono text-text-muted">
                <div className="flex justify-between py-1 border-b border-border-color/60">
                  <span>Category</span>
                  <span className="font-semibold text-text-main">{demo.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-color/60">
                  <span>Experience</span>
                  <span className="font-semibold text-text-main">{demo.type || 'Bespoke Platform'}</span>
                </div>
                {demo.technologies && (
                  <div className="flex justify-between py-1 border-b border-border-color/60">
                    <span>Stack</span>
                    <span className="font-semibold text-text-main">{demo.technologies.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {demo.liveUrl ? (
                <a
                  href={demo.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemoClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-fresh-green text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-xs"
                >
                  <span>Launch Demo</span>
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="flex-1 text-center py-3 text-xs font-mono text-slate-400 bg-slate-100 rounded-full">
                  Demo in staging
                </span>
              )}

              <Link
                to={demoUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-border-color text-text-main font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-xs"
              >
                <span>Case Study</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.article>
    );
  }

  // --- VARIANT 2: ASYMMETRIC SPLIT (SIDE-BY-SIDE 60/40) ---
  const isImageRight = variant === 'split-right';

  return (
    <motion.article
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? false : "visible"}
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-700"
    >
      {/* Micro-bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border-color/60">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-slate-400 group-hover:text-fresh-green transition-colors">
            {formattedIndex}
          </span>
          <span className="text-border-color">/</span>
          <span className="font-mono text-xs font-bold text-text-muted tracking-widest uppercase">
            {demo.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(demo.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            className={cn(
              "p-2 rounded-full border transition-colors",
              isFavorite
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "bg-soft-white border-border-color text-slate-400 hover:text-text-main hover:bg-white"
            )}
          >
            <Heart size={14} className={isFavorite ? "fill-rose-500" : ""} />
          </button>

          <button
            type="button"
            onClick={() => onToggleCompare(demo.id)}
            aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            className={cn(
              "p-2 rounded-full border transition-colors",
              isCompared
                ? "bg-fresh-green/10 border-fresh-green/30 text-elegant-green"
                : "bg-soft-white border-border-color text-slate-400 hover:text-text-main hover:bg-white"
            )}
          >
            <Layers size={14} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Media Block with 16:9 ratio and clip-path reveal */}
        <motion.div
          variants={clipPathVariants}
          className={cn(
            "lg:col-span-7 overflow-hidden rounded-2xl md:rounded-[2rem] border border-border-color bg-slate-50",
            isImageRight ? "lg:order-2" : "lg:order-1"
          )}
        >
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/90 border-b border-border-color text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400/80" />
              <div className="w-2 h-2 rounded-full bg-amber-400/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
            </div>
            <span className="truncate max-w-[200px]">{demo.liveUrl?.replace('https://', '') || `${demo.slug}.aureviaweb.com`}</span>
            <span className="uppercase text-slate-500 font-bold">{demo.industry || demo.category}</span>
          </div>

          <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden group/img">
            <OptimizedImage
              src={demo.desktopPreview || demo.thumbnail}
              alt={demo.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/img:scale-105"
            />
            {/* Hover Live Demo Launch Prompt */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              {demo.liveUrl && (
                <a
                  href={demo.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemoClick}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-fresh-green text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-emerald-600 transition-all"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              <Link
                to={demoUrl}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-text-main font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all"
              >
                <span>Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Editorial Text Block */}
        <motion.div
          variants={fadeUpVariants}
          className={cn(
            "lg:col-span-5 flex flex-col justify-between",
            isImageRight ? "lg:order-1" : "lg:order-2"
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-text-muted">
              <span className="font-semibold text-elegant-green">{demo.type || demo.industry}</span>
              {demo.languages && demo.languages.length > 0 && (
                <>
                  <span>·</span>
                  <span>{demo.languages.join(' / ')}</span>
                </>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight mb-3">
              <Link to={demoUrl} className="hover:text-fresh-green transition-colors">
                {demo.name}
              </Link>
            </h3>

            <p className="text-text-muted text-sm leading-relaxed mb-6">
              {demo.shortDescription || demo.description}
            </p>

            {/* Feature Bullets */}
            {demo.features && demo.features.length > 0 && (
              <div className="mb-6 space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Featured Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {demo.features.slice(0, 4).map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-soft-white border border-border-color text-xs text-text-main"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-4 border-t border-border-color/60">
            {demo.liveUrl ? (
              <a
                href={demo.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemoClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-main text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>View Live Demo</span>
                <ArrowUpRight size={14} />
              </a>
            ) : null}

            <Link
              to={demoUrl}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-soft-white border border-border-color text-text-main font-bold text-xs uppercase tracking-wider hover:bg-white hover:border-fresh-green transition-colors"
            >
              <span>Case Study</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
