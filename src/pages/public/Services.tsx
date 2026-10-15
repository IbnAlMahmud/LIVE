import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Clock 
} from 'lucide-react';
import { useServices, Service } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

interface DetailedService {
  id: string;
  number: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  deliverables: string[];
  image: string;
  timeline: string;
  engagement: string;
}

const FALLBACK_DETAILED_SERVICES: DetailedService[] = [
  {
    id: 'design',
    number: '01',
    title: 'UI/UX & Web Design',
    slug: 'ui-ux-web-design',
    tagline: 'High-Conversion Visual Systems',
    description: 'We craft bespoke, user-centric interfaces designed to communicate your brand value instantly. Every pixel is purposeful, focusing on intuitive navigation, typographic hierarchy, and elevated conversion rates.',
    deliverables: ['Wireframing & Prototyping', 'High-Fidelity Visual Design', 'Interactive Design Systems', 'Brand Identity Integration', 'Mobile-Responsive Systems'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    timeline: '2–4 Weeks',
    engagement: 'Fixed Sprint or Retainer'
  },
  {
    id: 'development',
    number: '02',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    tagline: 'Modern Architecture & Clean Code',
    description: 'From lightning-fast marketing landing pages to full-scale web platforms. We build scalable, secure, and resilient architecture using modern TypeScript, React, Vite, and cloud-native backends.',
    deliverables: ['React & Next.js Architecture', 'Custom Backend & APIs', 'Core Web Vitals Optimization', 'Enterprise Security Best Practices', 'Database Architecture'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    timeline: '3–6 Weeks',
    engagement: 'Fixed Project or Dedicated Squad'
  },
  {
    id: 'ecommerce',
    number: '03',
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-solutions',
    tagline: 'Bespoke Digital Storefronts',
    description: 'High-conversion online stores designed to turn browsing into revenue. We engineer friction-free checkout flows, inventory synchronization, and bespoke shopping experiences.',
    deliverables: ['Custom Storefront UX', 'Stripe & Payment Gateways', 'Cart Optimization', 'Product Management Flows', 'Multi-Currency Architecture'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    timeline: '4–8 Weeks',
    engagement: 'End-to-End Build'
  },
  {
    id: 'web-apps',
    number: '04',
    title: 'Custom Web Apps & Portals',
    slug: 'custom-web-applications',
    tagline: 'Bespoke Business Logic & Tooling',
    description: 'Solve operational bottlenecks with bespoke web applications. We build client dashboards, authenticated portals, and real-time internal management platforms.',
    deliverables: ['SaaS Dashboards', 'Role-Based Authentication', 'Cloud Database Sync', 'API Integrations', 'Real-Time Telemetry'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    timeline: '4–10 Weeks',
    engagement: 'Sprint Milestones'
  },
  {
    id: 'seo-marketing',
    number: '05',
    title: 'SEO & Growth Architecture',
    slug: 'technical-seo-growth',
    tagline: 'High-Intent Organic Discoverability',
    description: 'We engineer websites as organic marketing assets. Our technical SEO architecture guarantees search engines index and rank your pages ahead of competitors.',
    deliverables: ['Technical & On-Page SEO', 'Schema Markup Integration', 'Analytics & Tracking Setup', 'Speed Audits & Fixes', 'Conversion Funnel Tracking'],
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    timeline: '1–3 Weeks',
    engagement: 'Sprint or Ongoing Retainer'
  }
];

export default function Services() {
  const shouldReduceMotion = useReducedMotion();
  const { services: firestoreServices, loading } = useServices();
  const [activeService, setActiveService] = useState(0);

  const servicesList: DetailedService[] = React.useMemo(() => {
    if (!loading && firestoreServices && firestoreServices.length > 0) {
      const published = firestoreServices.filter(s => s.published !== false);
      if (published.length > 0) {
        return published.map((s, idx) => {
          let deliverableList: string[] = [];
          if (Array.isArray(s.features)) {
            deliverableList = s.features;
          } else if (typeof s.features === 'string' && s.features.trim()) {
            deliverableList = s.features.split('\n').map(f => f.trim()).filter(Boolean);
          } else {
            deliverableList = FALLBACK_DETAILED_SERVICES[idx % FALLBACK_DETAILED_SERVICES.length].deliverables;
          }

          const fallback = FALLBACK_DETAILED_SERVICES[idx % FALLBACK_DETAILED_SERVICES.length];
          return {
            id: s.id,
            number: (idx + 1).toString().padStart(2, '0'),
            title: s.name,
            slug: s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tagline: s.icon || fallback.tagline,
            description: s.description || fallback.description,
            deliverables: deliverableList.length > 0 ? deliverableList : fallback.deliverables,
            image: s.image && s.image.startsWith('http') ? s.image : fallback.image,
            timeline: fallback.timeline,
            engagement: fallback.engagement
          };
        });
      }
    }
    return FALLBACK_DETAILED_SERVICES;
  }, [firestoreServices, loading]);

  const current = servicesList[activeService] || servicesList[0];

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
      <Helmet>
        <title>Studio Services & Capabilities | AureviaWeb</title>
        <meta 
          name="description" 
          content="Strategic visual design, full-stack TypeScript engineering, and organic growth architecture engineered to build scalable digital brands." 
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-[#F8FBFA] pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-border-color">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fresh-green/10 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase mb-6 border border-fresh-green/20">
            <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse" />
            <span>STUDIO CAPABILITIES</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main mb-6 max-w-4xl mx-auto leading-[1.1] tracking-tight">
            End-to-End Digital Product Creation.
          </h1>
          
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            We combine strategic design, cutting-edge web engineering, and organic growth fundamentals to craft platforms that scale.
          </p>
        </div>
      </section>

      {/* Main Interactive Showcase Section */}
      <section className="py-16 md:py-24 bg-white border-b border-border-color">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          
          {/* Desktop & Tablet Split Catalogue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            
            {/* Left: Sticky Media Frame (16:9 Aspect Ratio) */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <div className="bg-[#F8FBFA] border border-border-color rounded-2xl md:rounded-[2rem] p-5 sm:p-6 shadow-sm">
                
                {/* 16:9 Image Display with Browser Chrome */}
                <div className="relative aspect-[16/9] w-full rounded-xl md:rounded-2xl overflow-hidden bg-slate-900 border border-border-color/80 shadow-md">
                  
                  {/* Chrome top strip */}
                  <div className="absolute top-0 inset-x-0 h-8 bg-white/90 backdrop-blur-md border-b border-border-color/70 z-20 flex items-center justify-between px-3.5 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="text-[10px] font-mono text-text-muted/80 tracking-tight flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-fresh-green" />
                      <span>aurevia.studio/services/{current.slug}</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted/60 uppercase">Studio</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full pt-8"
                    >
                      <img 
                        src={current.image}
                        alt={current.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Corner Badge */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-text-main text-xs font-mono font-bold shadow-xs">
                      <span className="text-fresh-green font-extrabold">{current.number}</span>
                      <span>·</span>
                      <span>{current.tagline}</span>
                    </div>
                  </div>
                </div>

                {/* Micro info strip below preview */}
                <div className="mt-5 pt-4 border-t border-border-color/80 flex items-center justify-between text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-fresh-green" />
                    <span>Timeline: <strong className="text-text-main">{current.timeline}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-fresh-green" />
                    <span>Model: <strong className="text-text-main">{current.engagement}</strong></span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Service List & Expanding Details */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              {servicesList.map((srv, idx) => {
                const isActive = activeService === idx;
                return (
                  <div 
                    key={srv.id} 
                    onMouseEnter={() => setActiveService(idx)}
                    onClick={() => setActiveService(idx)}
                    className={cn(
                      "transition-all duration-300 rounded-2xl border p-6 cursor-pointer group", 
                      isActive 
                        ? "bg-white border-slate-300 shadow-md shadow-slate-900/5 ring-1 ring-fresh-green/20" 
                        : "bg-transparent border-transparent hover:bg-[#F8FBFA] hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "font-mono text-sm font-bold transition-colors duration-200",
                          isActive ? "text-fresh-green font-extrabold" : "text-slate-400 group-hover:text-text-main"
                        )}>
                          {srv.number}
                        </span>

                        <div>
                          <h3 className={cn(
                            "text-xl sm:text-2xl font-bold transition-colors duration-200",
                            isActive ? "text-text-main" : "text-slate-600 group-hover:text-text-main"
                          )}>
                            {srv.title}
                          </h3>
                          <p className="text-xs font-mono text-text-muted mt-0.5 font-medium">
                            {srv.tagline}
                          </p>
                        </div>
                      </div>

                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                        isActive ? "bg-fresh-green text-white" : "bg-slate-100 text-slate-400 group-hover:text-text-main"
                      )}>
                        <ArrowUpRight size={15} className={cn(isActive ? "rotate-0" : "-rotate-45")} />
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden pt-4"
                        >
                          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-6 font-normal">
                            {srv.description}
                          </p>

                          <div className="mb-6">
                            <span className="block text-[11px] font-mono text-text-muted uppercase font-semibold mb-2.5">
                              Key Capabilities & Deliverables
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {srv.deliverables.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-text-main bg-[#F8FBFA] border border-border-color px-3 py-1.5 rounded-lg">
                                  <Check size={12} className="text-fresh-green shrink-0 stroke-[2.5]" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border-color/60 flex items-center gap-3">
                            <a 
                              href={`/start-project?service=${encodeURIComponent(srv.title)}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fresh-green hover:bg-elegant-green text-white font-bold text-xs sm:text-sm shadow-md shadow-fresh-green/15 transition-all"
                            >
                              <span>Discuss This Service</span>
                              <ArrowUpRight size={15} />
                            </a>
                            <a 
                              href="/pricing"
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-soft-white hover:bg-slate-100 text-text-main font-semibold text-xs sm:text-sm border border-border-color transition-colors"
                            >
                              <span>View Pricing</span>
                              <ArrowRight size={13} className="text-text-muted" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
      
      {/* Editorial Bottom CTA */}
      <section className="py-20 lg:py-24 bg-[#F8FBFA] text-center border-b border-border-color">
        <div className="mx-auto max-w-3xl px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fresh-green/10 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase mb-4 border border-fresh-green/20">
            <span>START A CONVERSATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-text-main tracking-tight">
            Have a specific technical challenge?
          </h2>
          <p className="text-text-muted text-base sm:text-lg mb-8 font-medium leading-relaxed max-w-xl mx-auto">
            We partner with ambitious founders and marketing leaders to solve complex brand, UX, and software problems with elegant digital solutions.
          </p>
          <a 
            href="/start-project" 
            className="inline-flex items-center justify-center gap-2 rounded-full bg-fresh-green px-8 py-4 text-base font-bold text-white hover:bg-elegant-green transition-all shadow-lg shadow-fresh-green/20 group"
          >
            <span>Discuss Your Project</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}
