import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SuccessStoryCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden border-t border-border-color">
      {/* Soft ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-soft-green/50 via-soft-blue/40 to-soft-green/30 rounded-full blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-gradient-to-br from-soft-green/40 via-white to-soft-blue/30 border border-border-color rounded-2xl md:rounded-[3rem] p-8 sm:p-12 lg:p-16 shadow-xl shadow-fresh-green/5 overflow-hidden"
        >
          {/* Subtle architectural grid lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #172033 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-fresh-green/30 text-elegant-green text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-sm">
                <Sparkles size={13} className="text-fresh-green" />
                <span>Your Next Digital Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight leading-[1.12] mb-6">
                Ready to be our next <br className="hidden sm:inline" />
                <span className="text-fresh-green relative inline-block">
                  success story?
                  <span className="absolute left-0 bottom-1 w-full h-[3px] bg-fresh-green/20 rounded-full" />
                </span>
              </h2>

              <p className="text-base sm:text-lg text-text-muted font-medium max-w-xl leading-relaxed mb-8">
                We partner with ambitious founders, established companies, and creative brands to design and engineer bespoke web platforms that win markets and drive real commercial ROI.
              </p>

              {/* Guarantees / Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pb-8 border-b border-border-color/60">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-text-main">
                  <CheckCircle2 size={16} className="text-fresh-green shrink-0" />
                  <span>Transparent Fixed Scope & Pricing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-text-main">
                  <CheckCircle2 size={16} className="text-fresh-green shrink-0" />
                  <span>Guaranteed Delivery Timeline</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-text-main">
                  <CheckCircle2 size={16} className="text-fresh-green shrink-0" />
                  <span>Awwwards-Caliber Visual Design</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-text-main">
                  <CheckCircle2 size={16} className="text-fresh-green shrink-0" />
                  <span>100% Mobile & SEO Optimized</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/start-project"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-fresh-green hover:bg-elegant-green text-white font-bold text-base shadow-lg shadow-fresh-green/20 hover:shadow-fresh-green/30 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight
                    size={18}
                    className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  />
                </Link>

                <a
                  href="https://wa.me/8801402884798"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-soft-white text-text-main font-bold text-base border border-border-color shadow-sm hover:-translate-y-0.5 transition-all duration-300"
                >
                  <MessageCircle size={18} className="text-fresh-green" />
                  <span>WhatsApp Studio</span>
                </a>
              </div>
            </div>

            {/* Right Editorial Visual Composition (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Backing decorative subtle card */}
                <div className="absolute -top-3 -right-3 inset-0 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-fresh-green/10 to-soft-blue/20 border border-fresh-green/20 -z-10 transform rotate-1" />

                {/* Main layered interface preview card */}
                <div className="rounded-2xl md:rounded-[2rem] bg-white border border-border-color shadow-xl shadow-slate-900/5 overflow-hidden p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-color/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-[11px] text-text-muted font-semibold tracking-wider uppercase">
                      STUDIO PIPELINE
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-soft-white border border-border-color">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono text-elegant-green uppercase tracking-wide">
                          Current Availability
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-fresh-green">
                          <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse" />
                          Accepting Projects
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-main">
                        Q2 / Q3 2026 Production Slots Open
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Average kickoff timeline: within 5-7 business days
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-soft-blue/40 to-soft-green/30 border border-blue-100">
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wide block mb-1">
                        Investment Framework
                      </span>
                      <p className="text-sm font-bold text-text-main">
                        Websites from ৳4,999 · Custom Scale-to-Fit
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Fixed milestone payments & comprehensive handover included
                      </p>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="text-xs text-text-muted font-medium">
                        Have custom requirements or a unique brief?
                      </span>
                      <Link
                        to="/contact"
                        className="block text-xs font-bold text-fresh-green hover:text-elegant-green mt-1 underline underline-offset-2"
                      >
                        Contact our design leads directly →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
