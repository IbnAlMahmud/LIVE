import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Pause, 
  Play,
  Layers,
  Code2,
  ShoppingBag,
  Cpu,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useServices, Service } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

export interface DisplayService {
  id: string;
  number: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  deliverables: string[];
  image: string;
  highlightText: string;
}

const DEFAULT_SERVICES: DisplayService[] = [
  {
    id: 'design',
    number: '01',
    title: 'UI/UX & Web Design',
    slug: 'ui-ux-web-design',
    category: 'Design Systems & Brand Experience',
    description: 'We architect bespoke, conversion-engineered digital interfaces and design systems tailored to your brand identity. Every layout is optically balanced for maximum clarity, intuitive interaction, and elevated brand authority.',
    deliverables: [
      'High-Fidelity UI/UX Systems',
      'Interactive Prototypes',
      'Visual Identity & Art Direction',
      'Responsive Component Libraries',
      'Micro-Interactions & Motion'
    ],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    highlightText: 'Elevate initial perception and turn visitors into qualified clients.'
  },
  {
    id: 'development',
    number: '02',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'Modern Engineering & Architecture',
    description: 'Performant, scalable, and secure front-end and back-end architecture. Built with modern TypeScript, React, Vite, and cloud APIs engineered for sub-second page loads, rock-solid security, and pristine Core Web Vitals.',
    deliverables: [
      'React & TypeScript Architecture',
      'Lightning Core Web Vitals',
      'Custom API & Cloud Integrations',
      'Content Management Systems',
      'Automated CI/CD Pipelines'
    ],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    highlightText: 'Engineered for sub-second speeds and bulletproof stability.'
  },
  {
    id: 'ecommerce',
    number: '03',
    title: 'E-Commerce & Digital Commerce',
    slug: 'ecommerce-solutions',
    category: 'Conversion & Storefront Strategy',
    description: 'Conversion-first online storefronts engineered to maximize average order value. We build friction-free checkout flows, inventory synchronization, and bespoke product shopping experiences that scale effortlessly.',
    deliverables: [
      'Custom Storefront Design',
      'Stripe & Modern Payment Gateways',
      'Frictionless Multi-Step Checkout',
      'Inventory & ERP Integrations',
      'Cart Optimization & Upsell Flows'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    highlightText: 'Frictionless checkout experiences designed to scale revenue.'
  },
  {
    id: 'web-apps',
    number: '04',
    title: 'Custom Web Apps & Portals',
    slug: 'custom-web-applications',
    category: 'Bespoke Software & Workflows',
    description: 'From customer-facing self-service portals to internal operational dashboards, we develop bespoke web applications that eliminate workflow bottlenecks and provide real-time collaborative value.',
    deliverables: [
      'SaaS & Client Dashboards',
      'Role-Based Authentication',
      'Real-Time Cloud Databases',
      'Internal Operational Tools',
      'API-First Scalable Backends'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    highlightText: 'Streamline operations with custom software built for your business.'
  },
  {
    id: 'seo-growth',
    number: '05',
    title: 'Technical SEO & Performance',
    slug: 'technical-seo-growth',
    category: 'Organic Growth & Analytics',
    description: 'We engineer websites as high-performance organic marketing assets. Semantic HTML, structured Schema markup, server-side metadata, and deep analytics integration ensure search engines rank your platform at the top.',
    deliverables: [
      'Schema.org Structured Data',
      'Technical SEO Audits & Fixes',
      'Meta Pixel & Analytics Setup',
      'Conversion Tracking Architecture',
      'Speed & Core Vitals Optimization'
    ],
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    highlightText: 'Built-in discoverability to capture high-intent organic search.'
  }
];

export function PremiumServices() {
  const shouldReduceMotion = useReducedMotion();
  const { services: firestoreServices, loading } = useServices();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const ROTATION_TIME = 7000; // 7 seconds per service
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Transform Firestore services if available, else use curated defaults
  const displayServices: DisplayService[] = React.useMemo(() => {
    if (!loading && firestoreServices && firestoreServices.length > 0) {
      const active = firestoreServices.filter(s => s.published !== false);
      if (active.length > 0) {
        return active.map((s, idx) => {
          let deliverableList: string[] = [];
          if (Array.isArray(s.features)) {
            deliverableList = s.features;
          } else if (typeof s.features === 'string' && s.features.trim()) {
            deliverableList = s.features.split('\n').map(f => f.trim()).filter(Boolean);
          } else {
            deliverableList = DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].deliverables;
          }

          const fallbackImage = DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].image;
          const fallbackCat = DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].category;

          return {
            id: s.id,
            number: (idx + 1).toString().padStart(2, '0'),
            title: s.name,
            slug: s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: s.description || DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].description,
            category: s.icon || fallbackCat,
            deliverables: deliverableList.length > 0 ? deliverableList : DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].deliverables,
            image: s.image && s.image.startsWith('http') ? s.image : fallbackImage,
            highlightText: DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].highlightText
          };
        });
      }
    }
    return DEFAULT_SERVICES;
  }, [firestoreServices, loading]);

  const totalServices = displayServices.length;
  const currentService = displayServices[activeIndex] || displayServices[0];

  // Auto-rotation timer logic
  const advanceService = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalServices);
    setProgress(0);
  }, [totalServices]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || totalServices <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const progressStep = (stepMs / ROTATION_TIME) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          advanceService();
          return 0;
        }
        return prev + progressStep;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, shouldReduceMotion, advanceService, totalServices]);

  const handleSelectService = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
    setIsPaused(true);
  };

  return (
    <section 
      id="services"
      aria-label="Our Services"
      className="py-16 md:py-24 lg:py-28 bg-[#FBFDFD] border-b border-border-color relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      {/* Background Architectural Accent Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute left-1/2 -top-40 w-[800px] h-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#EAF7F0]/60 via-[#EEF8FF]/30 to-transparent blur-3xl" />
        <div className="mx-auto max-w-[1440px] h-full px-6 lg:px-12 grid grid-cols-4 md:grid-cols-12 pointer-events-none">
          <div className="border-r border-slate-200/40 h-full hidden lg:block lg:col-span-5" />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
        
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-12 border-b border-border-color/80">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fresh-green/10 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase mb-4 border border-fresh-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse" />
              <span>Studio Capabilities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight leading-[1.12]">
              Everything You Need to Build a Better Digital Presence.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-sm sm:text-base text-text-muted font-medium max-w-md md:text-right leading-relaxed">
              We combine strategic visual design, scalable web architecture, and organic growth fundamentals into one unified studio team.
            </p>

            {/* Micro Timer & Counter */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-xs font-bold text-text-muted tracking-wider">
                {currentService.number} / {totalServices.toString().padStart(2, '0')}
              </span>
              
              {!shouldReduceMotion && (
                <div className="w-24 h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-fresh-green transition-all duration-75 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded-md text-text-muted hover:text-text-main hover:bg-slate-100 transition-colors"
                aria-label={isPaused ? "Resume auto rotation" : "Pause auto rotation"}
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={13} className="fill-current" /> : <Pause size={13} className="fill-current" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP EDITORIAL SPLIT SYSTEM (Lg and Up) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-14 pt-12 items-start">
          
          {/* LEFT: Interactive Service Catalogue List (5 Cols, ~40%) */}
          <div className="lg:col-span-5 flex flex-col space-y-2.5">
            <div className="text-[11px] font-mono tracking-widest text-text-muted uppercase font-semibold pb-1 flex items-center justify-between">
              <span>Select Service Area</span>
              <span className="text-fresh-green font-bold">Interactive Preview</span>
            </div>

            {displayServices.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(index)}
                  onMouseEnter={() => handleSelectService(index)}
                  onFocus={() => handleSelectService(index)}
                  className={cn(
                    "group relative w-full text-left p-5 xl:p-6 rounded-2xl transition-all duration-300 border flex items-center justify-between",
                    isActive
                      ? "bg-white border-slate-300 shadow-md shadow-slate-900/5 ring-1 ring-fresh-green/20"
                      : "bg-transparent border-transparent hover:bg-white/70 hover:border-slate-200/80"
                  )}
                  aria-pressed={isActive}
                >
                  {/* Active Left Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeServiceBar"
                      className="absolute left-0 top-3.5 bottom-3.5 w-1.5 bg-fresh-green rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div className="flex items-start gap-4 xl:gap-5 pl-1.5">
                    {/* Number with hover transition */}
                    <span 
                      className={cn(
                        "font-mono text-sm font-bold transition-all duration-300 pt-0.5",
                        isActive 
                          ? "text-fresh-green font-extrabold translate-x-1" 
                          : "text-slate-400 group-hover:text-text-main group-hover:translate-x-1"
                      )}
                    >
                      {service.number}
                    </span>

                    <div>
                      <h3 
                        className={cn(
                          "text-lg xl:text-xl font-bold tracking-tight transition-colors duration-200 leading-snug",
                          isActive ? "text-text-main" : "text-slate-600 group-hover:text-text-main"
                        )}
                      >
                        {service.title}
                      </h3>
                      
                      <p className="text-xs text-text-muted mt-1 line-clamp-1 font-medium">
                        {service.category}
                      </p>
                    </div>
                  </div>

                  {/* Micro Interaction Arrow */}
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-3",
                      isActive 
                        ? "bg-fresh-green text-white shadow-sm" 
                        : "bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-text-main"
                    )}
                  >
                    <ArrowUpRight 
                      size={15} 
                      className={cn(
                        "transition-transform duration-300",
                        isActive ? "rotate-0" : "-rotate-45 group-hover:rotate-0"
                      )} 
                    />
                  </div>
                </button>
              );
            })}

            {/* Bottom Support Callout Box */}
            <div className="pt-6 mt-4 border-t border-border-color/70">
              <div className="p-5 rounded-2xl bg-white border border-border-color/80 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-text-main">Looking for a combined retainer?</div>
                  <div className="text-xs text-text-muted font-medium mt-0.5">We assemble dedicated cross-functional squads.</div>
                </div>
                <a
                  href="/start-project"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-fresh-green hover:text-elegant-green transition-colors shrink-0 ml-3 group"
                >
                  <span>Inquire</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Showcase Container (7 Cols, ~60%) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border-color rounded-2xl md:rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Media Showcase (Strict 16:9 Aspect Ratio with Browser Chrome) */}
              <div className="relative aspect-[16/9] w-full rounded-xl md:rounded-[1.5rem] overflow-hidden bg-slate-900 border border-border-color/80 mb-6 shadow-md shadow-slate-900/5 group">
                
                {/* Editorial Browser Chrome */}
                <div className="absolute top-0 inset-x-0 h-8 bg-white/90 backdrop-blur-md border-b border-border-color/70 z-20 flex items-center justify-between px-3.5 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="text-[10px] font-mono text-text-muted/80 tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-fresh-green" />
                    <span>aurevia.studio/services/{currentService.slug}</span>
                  </div>
                  <div className="font-mono text-[10px] text-text-muted/60 uppercase">
                    HD Preview
                  </div>
                </div>

                {/* Crossfade Image Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService.id}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full pt-8"
                  >
                    <img
                      src={currentService.image}
                      alt={currentService.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Subtle aesthetic gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                    {/* Bottom Floating Badge */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-text-main text-xs font-mono font-bold border border-white/40 shadow-xs">
                        <Sparkles size={12} className="text-fresh-green" />
                        <span>{currentService.category}</span>
                      </div>

                      <div className="text-[11px] font-mono text-white/90 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        Service {currentService.number}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Service Detailed Information */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${currentService.id}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Category & Title */}
                  <div className="mb-4">
                    <div className="font-mono text-xs text-elegant-green font-bold tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-fresh-green" />
                      <span>{currentService.category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight leading-tight">
                      {currentService.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-text-muted font-medium leading-relaxed mb-6 max-w-2xl">
                    {currentService.description}
                  </p>

                  {/* Capabilities & Scope Tags */}
                  <div className="mb-8">
                    <span className="block text-[11px] font-mono tracking-wider text-text-muted uppercase font-semibold mb-2.5">
                      Included Scope & Key Deliverables
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentService.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-soft-white border border-border-color text-text-main font-medium"
                        >
                          <Check size={12} className="text-fresh-green shrink-0 stroke-[2.5]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Actions Strip */}
                  <div className="pt-6 border-t border-border-color/70 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/start-project?service=${encodeURIComponent(currentService.title)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fresh-green hover:bg-elegant-green text-white font-bold text-sm shadow-md shadow-fresh-green/20 transition-all duration-300 group/cta"
                      >
                        <span>Start This Project</span>
                        <ArrowUpRight 
                          size={16} 
                          className="transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" 
                        />
                      </a>

                      <a
                        href="/services"
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-soft-white hover:bg-slate-100 text-text-main font-semibold text-sm border border-border-color transition-colors"
                      >
                        <span>Full Studio Capabilities</span>
                        <ArrowRight size={14} className="text-text-muted" />
                      </a>
                    </div>

                    <div className="text-xs font-mono text-text-muted">
                      <span>Timeline: </span>
                      <strong className="text-text-main">2–6 Weeks Avg</strong>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET DEDICATED LAYOUT (Under lg) */}
        {/* ========================================================================= */}
        <div className="block lg:hidden pt-8">
          
          {/* Horizontal Service Selector Pills Bar (Scrollable without page blowout) */}
          <div className="mb-6 -mx-6 px-6 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2">
            {displayServices.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(index)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 border",
                    isActive
                      ? "bg-fresh-green text-white border-fresh-green shadow-sm"
                      : "bg-white text-slate-600 border-border-color hover:bg-slate-50"
                  )}
                >
                  <span className={cn("font-mono text-[10px]", isActive ? "text-white/80" : "text-slate-400")}>
                    {service.number}
                  </span>
                  <span>{service.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Mobile Card */}
          <div className="bg-white border border-border-color rounded-2xl p-5 sm:p-6 shadow-sm">
            
            {/* 16:9 Image (Strictly responsive, never 600px tall) */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-border-color mb-5">
              <img
                src={currentService.image}
                alt={currentService.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-text-main text-[11px] font-mono font-bold border border-white/30">
                <span>{currentService.number}</span>
                <span>·</span>
                <span>{currentService.category}</span>
              </div>
            </div>

            {/* Typography */}
            <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-2">
              {currentService.title}
            </h3>

            <p className="text-sm text-text-muted font-medium leading-relaxed mb-4">
              {currentService.description}
            </p>

            {/* Deliverables */}
            <div className="mb-6">
              <span className="block text-[11px] font-mono text-text-muted uppercase font-semibold mb-2">
                Key Deliverables
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentService.deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-soft-white border border-border-color text-text-main font-medium flex items-center gap-1"
                  >
                    <Check size={11} className="text-fresh-green stroke-[3]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-border-color flex flex-col sm:flex-row gap-3">
              <a
                href={`/start-project?service=${encodeURIComponent(currentService.title)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-fresh-green text-white font-bold text-sm shadow-md shadow-fresh-green/15"
              >
                <span>Start This Project</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href="/services"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-5 rounded-full bg-soft-white text-text-main font-semibold text-sm border border-border-color"
              >
                <span>View Full Offerings</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

          {/* Quick Step Indicators below mobile card */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {displayServices.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectService(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeIndex === i ? "w-6 bg-fresh-green" : "w-1.5 bg-slate-300"
                )}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
