import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ExternalLink, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHeroSettings } from '@/hooks/useHeroSettings';

export interface ShowcaseDemo {
  id: string;
  title: string;
  category: string;
  industry: string;
  featureTitle: string;
  slug: string;
  previewUrl: string;
  palette: {
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
}

// Exactly the 7 real-looking portfolio demo concepts requested by user
export const HERO_DEMOS: ShowcaseDemo[] = [
  {
    id: 'demo-noire',
    title: 'NOIRÉ',
    category: 'Restaurant',
    industry: 'Hospitality',
    featureTitle: 'Editorial Culinary Architecture',
    slug: 'noire',
    previewUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      accent: '#B45309',
    },
  },
  {
    id: 'demo-aurelia',
    title: 'AURELIA ESTATES',
    category: 'Real Estate',
    industry: 'Architecture & Living',
    featureTitle: 'Luxury Spatial Storytelling',
    slug: 'aurelia-estates',
    previewUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
      accent: '#047857',
    },
  },
  {
    id: 'demo-uthaan',
    title: 'UTHAAN DESIGN STUDIO',
    category: 'Interior Design',
    industry: 'Creative Interior',
    featureTitle: 'Bespoke Portfolio Presentation',
    slug: 'uthaan-design',
    previewUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-stone-100',
      badgeText: 'text-stone-800',
      accent: '#57534E',
    },
  },
  {
    id: 'demo-aurora',
    title: 'AURORA RESORT',
    category: 'Hotel',
    industry: 'Luxury Hospitality',
    featureTitle: 'Cinematic Guest Booking Experience',
    slug: 'aurora-resort',
    previewUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-800',
      accent: '#0284C7',
    },
  },
  {
    id: 'demo-atozent',
    title: 'ATozent',
    category: 'E-commerce',
    industry: 'Retail & Commerce',
    featureTitle: 'Conversion-Centric Architecture',
    slug: 'atozent',
    previewUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
      accent: '#4338CA',
    },
  },
  {
    id: 'demo-nexora',
    title: 'NEXORA',
    category: 'Technology',
    industry: 'SaaS & Enterprise',
    featureTitle: 'High-Performance Cloud Infrastructure',
    slug: 'nexora',
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-800',
      accent: '#1D4ED8',
    },
  },
  {
    id: 'demo-orbital',
    title: 'STUDY ORBITAL',
    category: 'Education',
    industry: 'Academic Platforms',
    featureTitle: 'Modern Learning Discovery Experience',
    slug: 'study-orbital',
    previewUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    palette: {
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
      accent: '#0F766E',
    },
  },
];

interface PremiumHeroProps {
  projects?: any[];
}

export function PremiumHero({ projects = [] }: PremiumHeroProps) {
  const { heroSettings } = useHeroSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  // Combine custom projects from admin or fallback to the 7 core demo concepts
  const activeDemos = HERO_DEMOS.map((demo, idx) => {
    const matchedProject = projects[idx];
    if (matchedProject && matchedProject.thumbnail) {
      return {
        ...demo,
        title: matchedProject.title || demo.title,
        category: matchedProject.category || demo.category,
        previewUrl: matchedProject.thumbnail || demo.previewUrl,
        slug: matchedProject.slug || demo.slug,
      };
    }
    return demo;
  });

  const totalDemos = activeDemos.length;
  const currentDemo = activeDemos[currentIndex];
  
  // Calculate relative indices for layered background previews
  const prevIndex = (currentIndex - 1 + totalDemos) % totalDemos;
  const nextIndex = (currentIndex + 1) % totalDemos;
  const prevDemo = activeDemos[prevIndex];
  const nextDemo = activeDemos[nextIndex];

  // Subtle Parallax Scroll for desktop showcase
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  
  const showcaseParallax = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const backgroundParallax = useTransform(scrollYProgress, [0, 1], [0, 18]);

  // 5-second automatic rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalDemos);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, totalDemos]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalDemos);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalDemos) % totalDemos);
  };

  const handleImageError = (demoId: string) => {
    setImageErrors((prev) => ({ ...prev, [demoId]: true }));
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-white border-b border-border-color"
      aria-label="Hero Section"
    >
      {/* 9. SUBTLE HERO BACKGROUND: Mostly white with light-blue & green atmospheric glow and fine grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Architectural Fine Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #172033 1px, transparent 1px), linear-gradient(to bottom, #172033 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Soft Light-Blue Radial Glow (Top-Right) */}
        <div className="absolute -top-32 right-0 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-soft-blue/80 rounded-full blur-[130px] opacity-70 translate-x-1/4 pointer-events-none" />

        {/* Soft Fresh-Green Radial Glow (Bottom-Left) */}
        <div className="absolute -bottom-24 left-0 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-soft-green/60 rounded-full blur-[120px] opacity-60 -translate-x-1/4 pointer-events-none" />

        {/* Micro Light Blue Flare Accent */}
        <div className="hidden lg:block absolute top-1/3 left-1/2 w-72 h-72 bg-light-blue/40 rounded-full blur-[90px] opacity-40 -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* ======================================================== */}
        {/* DESKTOP VIEW (Two-Column Editorial Showcase Composition)  */}
        {/* ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 items-center gap-8 xl:gap-14">
          
          {/* LEFT COLUMN: Editorial Typography, Value Proposition & CTA */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start pr-2">
            
            {/* 10. Small Eyebrow with Pulsing Emerald Gem */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border-color bg-soft-white px-3.5 py-1.5 mb-6 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-fresh-green animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-elegant-green uppercase">
                {heroSettings.eyebrow}
              </span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-5xl xl:text-[3.75rem] font-extrabold tracking-tight text-text-main leading-[1.08] mb-6"
            >
              {heroSettings.headlineLine1}{' '}
              <span className="relative inline-block text-fresh-green">
                <span className="relative z-10">{heroSettings.headlineHighlight}</span>
                {/* Subtle Light-Blue / Green underline bar */}
                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-soft-green via-light-blue to-soft-green/20 -z-0 rounded-full" />
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base xl:text-lg text-text-muted leading-relaxed font-medium mb-8 max-w-lg"
            >
              {heroSettings.description}
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-4"
            >
              <Link
                to={heroSettings.primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fresh-green px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-fresh-green/25 hover:bg-elegant-green hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <span>{heroSettings.primaryCtaText}</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to={heroSettings.secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-border-color px-7 py-3.5 text-[15px] font-bold text-text-main hover:bg-soft-white hover:border-gray-300 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs"
              >
                <span>{heroSettings.secondaryCtaText}</span>
              </Link>
            </motion.div>

            {/* Subtle pricing hint */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs font-semibold text-text-muted mb-8 tracking-wide flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-fresh-green" />
              <span>{heroSettings.pricingNote}</span>
            </motion.p>

            {/* 8. Trust Indicator: Avatars + Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 pt-4 border-t border-border-color/60 w-full"
            >
              {/* 3 Circular Neutral Visual Avatars */}
              <div className="flex -space-x-2.5 shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-soft-blue flex items-center justify-center overflow-hidden shadow-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Founder avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-soft-green flex items-center justify-center overflow-hidden shadow-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Entrepreneur avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-light-blue flex items-center justify-center overflow-hidden shadow-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Brand leader avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-muted leading-snug">
                  {heroSettings.trustText} <span className="text-text-main font-bold">{heroSettings.trustHighlight}</span>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-elegant-green">
                  <span>★★★★★</span>
                  <span className="text-text-muted font-medium">· 100% Client Satisfaction</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 4. HERO VISUAL — Sophisticated Layered Website Showcase */}
          <div 
            className="lg:col-span-7 xl:col-span-7 relative flex flex-col items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Parallax Container for the 3-layer composition */}
            <motion.div 
              style={shouldReduceMotion ? {} : { y: showcaseParallax }}
              className="w-full relative min-h-[460px] xl:min-h-[510px] flex items-center justify-center pt-8 pb-4"
            >
              {/* BACK PREVIEW 1: Offset Top-Right (Previous Demo Concept) */}
              <motion.div 
                style={shouldReduceMotion ? {} : { y: backgroundParallax }}
                onClick={() => setCurrentIndex(prevIndex)}
                className="absolute -top-3 right-0 w-[58%] aspect-video rounded-xl bg-white border border-border-color shadow-lg opacity-40 hover:opacity-75 transition-opacity cursor-pointer overflow-hidden z-10 scale-[0.88] select-none"
                title={`Switch to ${prevDemo.title}`}
              >
                <div className="h-5 bg-soft-white border-b border-border-color/60 px-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="text-[9px] font-bold tracking-wider text-text-muted uppercase ml-1.5 opacity-60">
                    {prevDemo.title}
                  </span>
                </div>
                <div className="w-full h-[calc(100%-20px)] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={prevDemo.previewUrl} 
                    alt={prevDemo.title} 
                    className="w-full h-full object-cover object-top filter saturate-[0.85]" 
                  />
                </div>
              </motion.div>

              {/* BACK PREVIEW 2: Offset Bottom-Left (Next Demo Concept) */}
              <motion.div 
                style={shouldReduceMotion ? {} : { y: backgroundParallax }}
                onClick={() => setCurrentIndex(nextIndex)}
                className="absolute -bottom-4 left-0 w-[55%] aspect-video rounded-xl bg-white border border-border-color shadow-lg opacity-40 hover:opacity-75 transition-opacity cursor-pointer overflow-hidden z-10 scale-[0.86] select-none"
                title={`Switch to ${nextDemo.title}`}
              >
                <div className="h-5 bg-soft-white border-b border-border-color/60 px-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="text-[9px] font-bold tracking-wider text-text-muted uppercase ml-1.5 opacity-60">
                    {nextDemo.title}
                  </span>
                </div>
                <div className="w-full h-[calc(100%-20px)] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={nextDemo.previewUrl} 
                    alt={nextDemo.title} 
                    className="w-full h-full object-cover object-top filter saturate-[0.85]" 
                  />
                </div>
              </motion.div>

              {/* MAIN WEBSITE PREVIEW: Large 16:9 Focal Preview with Minimal Browser Chrome */}
              <motion.div 
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative z-20 w-[92%] xl:w-[94%] aspect-video rounded-2xl bg-white border border-border-color shadow-[0_24px_50px_-12px_rgba(23,32,51,0.12)] overflow-hidden flex flex-col group"
              >
                {/* 11. Minimal Browser Chrome */}
                <div className="h-9 sm:h-10 bg-soft-white border-b border-border-color/80 px-4 flex items-center justify-between shrink-0 select-none">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
                  </div>

                  {/* Tiny Address Bar */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border-color/70 text-[11px] font-medium text-text-muted max-w-[240px] truncate shadow-2xs">
                    <Lock size={10} className="text-elegant-green shrink-0" />
                    <span className="text-text-main font-semibold">aurevia.studio</span>
                    <span className="text-text-muted">/{currentDemo.slug}</span>
                  </div>

                  {/* Live Demo Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-soft-green text-elegant-green text-[10px] font-bold tracking-wider uppercase border border-fresh-green/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse" />
                    <span>Live Demo</span>
                  </div>
                </div>

                {/* 6. Automatic Smooth Transition for Main Preview */}
                <div className="flex-1 w-full bg-soft-white overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDemo.id}
                      initial={{ opacity: 0, x: 20, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.98 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      {imageErrors[currentDemo.id] ? (
                        /* Pristine Editorial Fallback Card if image fails */
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-soft-white via-white to-soft-green/30 text-center">
                          <span className={cn("text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3", currentDemo.palette.badgeBg, currentDemo.palette.badgeText)}>
                            {currentDemo.category}
                          </span>
                          <h3 className="text-2xl font-black text-text-main tracking-tight mb-2">
                            {currentDemo.title}
                          </h3>
                          <p className="text-sm font-medium text-text-muted max-w-xs">
                            {currentDemo.featureTitle}
                          </p>
                        </div>
                      ) : (
                        <div className="relative w-full h-full overflow-hidden">
                          <img
                            src={currentDemo.previewUrl}
                            alt={currentDemo.title}
                            onError={() => handleImageError(currentDemo.id)}
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            loading="eager"
                          />
                          
                          {/* Subtle Bottom Vignette with Demo Info */}
                          <div className="absolute inset-x-0 bottom-0 pt-12 pb-3 px-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-between text-white">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                                {currentDemo.category}
                              </span>
                              <p className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                                {currentDemo.title}
                              </p>
                            </div>
                            <Link
                              to={`/demos/${currentDemo.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-text-main text-xs font-bold transition-all shadow-sm"
                            >
                              <span>Explore</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* 7. HERO FEATURE & PROGRESS INDICATOR (Interactive Presentation Strip) */}
            <div className="w-[92%] xl:w-[94%] mt-3 flex items-center justify-between px-2 text-xs select-none">
              {/* Feature Title & Category */}
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-text-main text-sm">
                  {String(currentIndex + 1).padStart(2, '0')}{' '}
                  <span className="text-text-muted font-normal text-xs">/ {String(totalDemos).padStart(2, '0')}</span>
                </span>
                <span className="h-3 w-[1px] bg-border-color" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-main">{currentDemo.title}</span>
                  <span className="text-text-muted font-medium">({currentDemo.category})</span>
                  <span className="hidden sm:inline-block text-elegant-green font-semibold">· {currentDemo.featureTitle}</span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded-full hover:bg-soft-white text-text-muted hover:text-text-main transition-colors"
                  aria-label="Previous Demo"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 rounded-full hover:bg-soft-white text-text-muted hover:text-text-main transition-colors"
                  aria-label="Next Demo"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Animated Progress Line */}
            <div className="w-[92%] xl:w-[94%] mt-2 h-[3px] bg-border-color/70 rounded-full overflow-hidden relative">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: isPaused ? 0 : 5, ease: 'linear' }}
                className="h-full bg-fresh-green rounded-full"
              />
            </div>

            {/* 7 Subtle Interactive Indicator Pills */}
            <div className="w-[92%] xl:w-[94%] mt-3 flex items-center justify-center gap-1.5">
              {activeDemos.map((demo, idx) => (
                <button
                  key={demo.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentIndex === idx 
                      ? "w-8 bg-fresh-green" 
                      : "w-2 bg-border-color hover:bg-text-muted/40"
                  )}
                  aria-label={`View ${demo.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 15. MOBILE HERO — SPECIAL DEDICATED COMPOSITION          */}
        {/* Designed specifically for: 320px, 360px, 375px, 390px,   */}
        {/* 412px, 430px mobile viewports without horizontal bleed   */}
        {/* ======================================================== */}
        <div className="lg:hidden flex flex-col items-center text-center">
          
          {/* Mobile Step 1: Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-color bg-soft-white px-3 py-1 mb-4 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-fresh-green animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-elegant-green uppercase">
              {heroSettings.eyebrow}
            </span>
          </motion.div>

          {/* Mobile Step 2: Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main leading-[1.12] mb-4 max-w-sm"
          >
            {heroSettings.headlineLine1}{' '}
            <span className="relative inline-block text-fresh-green">
              <span>{heroSettings.headlineHighlight}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-soft-green via-light-blue to-soft-green/20 rounded-full" />
            </span>
          </motion.h1>

          {/* Mobile Step 3: Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-sm sm:text-base text-text-muted leading-relaxed font-medium mb-6 max-w-sm px-2"
          >
            {heroSettings.description}
          </motion.p>

          {/* Mobile Step 4: CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mb-3"
          >
            <Link
              to={heroSettings.primaryCtaLink}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-fresh-green px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-fresh-green/20 active:bg-elegant-green transition-all"
            >
              <span>{heroSettings.primaryCtaText}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to={heroSettings.secondaryCtaLink}
              className="w-full inline-flex items-center justify-center rounded-full bg-white border border-border-color px-6 py-3 text-sm font-bold text-text-main active:bg-soft-white transition-all shadow-xs"
            >
              <span>{heroSettings.secondaryCtaText}</span>
            </Link>
          </motion.div>

          <p className="text-[11px] font-semibold text-text-muted mb-7 tracking-wide flex items-center gap-1 justify-center">
            <Sparkles size={12} className="text-fresh-green" />
            <span>{heroSettings.pricingNote}</span>
          </p>

          {/* 16. MOBILE SHOWCASE: Exact 16:9 ratio, width 92-94% of container, clean crop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="w-full max-w-md mx-auto aspect-video rounded-xl bg-white border border-border-color shadow-lg overflow-hidden flex flex-col mb-3"
          >
            {/* Mobile Browser Bar */}
            <div className="h-8 bg-soft-white border-b border-border-color px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-border-color text-[10px] font-medium text-text-muted">
                <Lock size={9} className="text-elegant-green" />
                <span>aurevia.studio/{currentDemo.slug}</span>
              </div>
              <span className="text-[9px] font-bold text-elegant-green uppercase tracking-wider">Demo</span>
            </div>

            {/* Mobile Preview Image with Crossfade */}
            <div className="flex-1 w-full bg-soft-white overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDemo.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {imageErrors[currentDemo.id] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-soft-green/30 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-elegant-green mb-1">
                        {currentDemo.category}
                      </span>
                      <h4 className="text-lg font-black text-text-main">{currentDemo.title}</h4>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={currentDemo.previewUrl}
                        alt={currentDemo.title}
                        onError={() => handleImageError(currentDemo.id)}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-3 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between text-white">
                        <div className="text-left">
                          <p className="text-[9px] font-bold uppercase text-emerald-300">{currentDemo.category}</p>
                          <p className="text-xs font-bold leading-tight">{currentDemo.title}</p>
                        </div>
                        <Link
                          to={`/demos/${currentDemo.slug}`}
                          className="px-2.5 py-1 rounded-full bg-white text-text-main text-[11px] font-bold"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Mobile Step 5: Feature Title, Progress & Navigation */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between text-[11px] font-medium text-text-muted mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-text-main text-xs">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalDemos).padStart(2, '0')}
              </span>
              <span className="h-3 w-[1px] bg-border-color" />
              <span className="font-bold text-text-main">{currentDemo.title}</span>
              <span className="text-text-muted">({currentDemo.category})</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1 text-text-muted active:text-text-main"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-1 text-text-muted active:text-text-main"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Progress Line */}
          <div className="w-full max-w-md mx-auto h-[2.5px] bg-border-color/70 rounded-full overflow-hidden mb-6">
            <motion.div
              key={`m-${currentIndex}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-fresh-green rounded-full"
            />
          </div>

          {/* Mobile Step 6: Trust Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center justify-center gap-3 pt-4 border-t border-border-color/60 w-full max-w-xs"
          >
            <div className="flex -space-x-2 shrink-0">
              <div className="w-7 h-7 rounded-full border border-white bg-soft-blue overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Client" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="w-7 h-7 rounded-full border border-white bg-soft-green overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Client" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="w-7 h-7 rounded-full border border-white bg-light-blue overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Client" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <div className="text-left">
              <p className="text-xs font-semibold text-text-muted leading-tight">
                {heroSettings.trustText} <span className="text-text-main font-bold">{heroSettings.trustHighlight}</span>
              </p>
              <p className="text-[10px] font-bold text-elegant-green">★★★★★ · 100% Client Satisfaction</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
