import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SelectedWorksHeaderProps {
  projectCount: number;
}

export function SelectedWorksHeader({ projectCount }: SelectedWorksHeaderProps) {
  const formattedCount = projectCount.toString().padStart(2, '0');

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-8 md:pb-12 overflow-hidden bg-white border-b border-border-color/60">
      {/* Subtle architectural background accents */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #172033 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-soft-blue/60 rounded-full blur-[110px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-soft-green/40 rounded-full blur-[100px] pointer-events-none translate-y-1/3" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-color/40">
          <div className="max-w-3xl">
            {/* Eyebrow with dynamic micro-pill */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-green border border-fresh-green/20 text-elegant-green text-xs font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse" />
                <span>Selected Works</span>
              </div>
              <span className="text-border-color text-sm">/</span>
              <span className="font-mono text-xs text-text-muted tracking-widest uppercase font-semibold">
                Work Profile · 2026
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-[1.08] mb-4"
            >
              Digital Experiences <br className="hidden sm:inline" />
              <span className="text-fresh-green relative inline-block">
                Built to Stand Out.
                <span className="absolute left-0 bottom-1 sm:bottom-2 w-full h-[3px] bg-soft-blue -z-10 rounded-full" />
              </span>
            </motion.h1>

            {/* Concise Supporting Copy */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-text-muted max-w-2xl font-medium leading-relaxed"
            >
              Editorial case studies, interactive prototypes, and commercial web architectures crafted for forward-thinking brands and businesses.
            </motion.p>
          </div>

          {/* Dynamic Project Counter micro-card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.25 }}
            className="shrink-0 flex items-center md:flex-col md:items-end justify-between md:justify-center p-3 sm:p-4 bg-soft-white rounded-2xl border border-border-color/80 shadow-sm"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-text-main tracking-tight">
                {formattedCount}
              </span>
              <span className="text-xs font-bold text-fresh-green uppercase tracking-wider">
                Active
              </span>
            </div>
            <div className="text-[11px] font-mono tracking-widest text-text-muted uppercase font-medium flex items-center gap-1.5">
              <Sparkles size={11} className="text-fresh-green" />
              <span>Editorial Releases</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
