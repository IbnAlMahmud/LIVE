import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Pause, Play, ChevronLeft, ChevronRight, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoItem } from '@/types/demo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { trackEvent } from '@/components/analytics/MetaPixel';

interface DemoHeroShowcaseProps {
  demos: DemoItem[];
}

export function DemoHeroShowcase({ demos }: DemoHeroShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const featuredDemos = demos.length > 0 ? demos : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = featuredDemos.length || 1;
  const currentDemo = featuredDemos[activeIndex] || featuredDemos[0];

  // Secondary and Tertiary preview indices
  const nextIndex = (activeIndex + 1) % total;
  const tertiaryIndex = (activeIndex + 2) % total;
  const nextDemo = featuredDemos[nextIndex];
  const tertiaryDemo = featuredDemos[tertiaryIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    // Resume rotation after 12s of user interaction
    const timer = setTimeout(() => setIsPaused(false), 12000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (isPaused || shouldReduceMotion || total <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, total, handleNext]);

  const scrollToDemos = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('demos-catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLiveDemoClick = (demo: DemoItem) => {
    trackEvent('OpenLiveDemo', {
      demo_name: demo.name,
      demo_slug: demo.slug,
      demo_category: demo.category,
      live_url: demo.liveUrl
    });
  };

  if (!currentDemo) return null;

  return (
    <section className="relative bg-white pt-24 sm:pt-28 md:pt-32 pb-16 lg:pb-24 overflow-hidden border-b border-border-color">
      {/* Subtle Studio Background Atmospheric Light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-fresh-green/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Editorial Top Headline Layout */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-soft-white border border-border-color mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-fresh-green animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-elegant-green">
              SELECTED DIGITAL EXPERIENCES
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-main leading-[1.08]"
          >
            Websites Built to Make Businesses Stand Out.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-text-muted leading-relaxed font-normal max-w-2xl"
          >
            AureviaWeb creates modern, responsive digital experiences for businesses, brands and entrepreneurs — from elegant landing pages to complete business platforms.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#demos-catalogue"
              onClick={scrollToDemos}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-text-main text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              <span>Explore Demos</span>
              <ArrowRight size={16} />
            </a>

            <Link
              to="/start-project"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-soft-white border border-border-color text-text-main font-bold text-sm hover:bg-white hover:border-fresh-green/60 transition-all"
            >
              <span>Start a Project</span>
              <ArrowUpRight size={16} className="text-fresh-green" />
            </Link>
          </motion.div>
        </div>

        {/* Curation Interactive Stage (16:9 Primary + Secondary & Tertiary Digital Gallery Layer) */}
        <div className="relative pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Primary Visual Showcase (16:9 Frame with Browser Chrome) */}
            <div className="lg:col-span-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDemo.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -12 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-white border border-border-color rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl shadow-slate-900/5"
                >
                  {/* Browser Viewport Frame Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/90 border-b border-border-color backdrop-blur-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-border-color text-[11px] font-mono text-slate-500 max-w-xs truncate">
                      <Globe size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{currentDemo.liveUrl ? currentDemo.liveUrl.replace('https://', '') : `demo.${currentDemo.slug}.aureviaweb.com`}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-fresh-green/10 text-elegant-green font-mono text-[10px] font-bold tracking-widest uppercase">
                        {currentDemo.category}
                      </span>
                    </div>
                  </div>

                  {/* 16:9 Primary Media Image with Live Hover Prompt */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <OptimizedImage
                      src={currentDemo.desktopPreview || currentDemo.thumbnail}
                      alt={currentDemo.name}
                      priority={true}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Quick Live Preview Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        {currentDemo.liveUrl ? (
                          <a
                            href={currentDemo.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLiveDemoClick(currentDemo)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fresh-green text-white font-bold text-sm shadow-lg hover:bg-emerald-600 transition-all transform group-hover:scale-105"
                          >
                            <span>Open Live Demo</span>
                            <ArrowUpRight size={16} />
                          </a>
                        ) : null}

                        <Link
                          to={`/demos/${currentDemo.slug || currentDemo.id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-text-main font-bold text-sm shadow-lg hover:bg-slate-100 transition-all"
                        >
                          <span>Explore Case Study</span>
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Primary Presentation Strip */}
                  <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-color">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                          {currentDemo.name}
                        </h2>
                        <span className="text-xs font-mono text-text-muted">
                          {currentDemo.type || currentDemo.industry}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted line-clamp-1 max-w-xl">
                        {currentDemo.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {currentDemo.liveUrl && (
                        <a
                          href={currentDemo.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLiveDemoClick(currentDemo)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-fresh-green text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                      <Link
                        to={`/demos/${currentDemo.slug || currentDemo.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-soft-white border border-border-color text-text-main text-xs font-bold hover:bg-slate-100 transition-colors"
                      >
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Curated Gallery Layer: Secondary & Tertiary Previews */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-color">
                <span className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider">
                  Upcoming Previews ({activeIndex + 1} / {total})
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    aria-label={isPaused ? "Play auto rotation" : "Pause auto rotation"}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-text-muted transition-colors"
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous demo"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-text-muted transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next demo"
                    className="p-1.5 rounded-full hover:bg-slate-100 text-text-muted transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Secondary Demo Card */}
              {nextDemo && (
                <div
                  onClick={() => handleSelect(nextIndex)}
                  className="group/sec cursor-pointer bg-soft-white hover:bg-white border border-border-color hover:border-fresh-green/50 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-elegant-green uppercase tracking-wider">
                      Next · {nextDemo.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {String(nextIndex + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-border-color">
                    <OptimizedImage
                      src={nextDemo.thumbnail}
                      alt={nextDemo.name}
                      className="w-full h-full object-cover group-hover/sec:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-text-main group-hover/sec:text-fresh-green transition-colors">
                    {nextDemo.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                    {nextDemo.shortDescription}
                  </p>
                </div>
              )}

              {/* Tertiary Demo Card */}
              {tertiaryDemo && (
                <div
                  onClick={() => handleSelect(tertiaryIndex)}
                  className="group/ter cursor-pointer bg-soft-white hover:bg-white border border-border-color hover:border-fresh-green/50 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md opacity-85 hover:opacity-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Up Next · {tertiaryDemo.category}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      {String(tertiaryIndex + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-border-color">
                    <OptimizedImage
                      src={tertiaryDemo.thumbnail}
                      alt={tertiaryDemo.name}
                      className="w-full h-full object-cover group-hover/ter:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-text-main group-hover/ter:text-fresh-green transition-colors">
                    {tertiaryDemo.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                    {tertiaryDemo.shortDescription}
                  </p>
                </div>
              )}

              {/* Selector Dots */}
              <div className="flex items-center gap-2 pt-2">
                {featuredDemos.map((d, i) => (
                  <button
                    key={d.id || i}
                    type="button"
                    onClick={() => handleSelect(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? 'w-8 bg-fresh-green'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Jump to ${d.name}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
