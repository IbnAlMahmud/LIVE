import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Check, Trash2 } from 'lucide-react';
import { DemoItem } from '@/types/demo';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { trackEvent } from '@/components/analytics/MetaPixel';

interface DemoComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedDemos: DemoItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function DemoComparisonModal({
  isOpen,
  onClose,
  comparedDemos,
  onRemove,
  onClear
}: DemoComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white border border-border-color rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-soft-white">
            <div>
              <h3 className="text-lg font-bold text-text-main">Compare Selected Website Demos</h3>
              <p className="text-xs text-text-muted">Analyze features, technologies, and digital architectures side-by-side.</p>
            </div>

            <div className="flex items-center gap-3">
              {comparedDemos.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-text-main transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Comparison Matrix */}
          <div className="overflow-x-auto overflow-y-auto p-6 flex-1">
            {comparedDemos.length === 0 ? (
              <div className="py-16 text-center text-text-muted">
                <p className="text-sm font-semibold">No demos selected for comparison yet.</p>
                <p className="text-xs mt-1 text-slate-400">Click the layers icon on any demo card to compare up to 3 websites.</p>
              </div>
            ) : (
              <div className="min-w-[640px]">
                {/* Header Row with Images and Titles */}
                <div className="grid grid-cols-4 gap-4 pb-6 border-b border-border-color">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase self-end pb-2">
                    Parameter
                  </div>

                  {comparedDemos.map((demo) => (
                    <div key={demo.id} className="relative flex flex-col">
                      <button
                        type="button"
                        onClick={() => onRemove(demo.id)}
                        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                        title="Remove from comparison"
                      >
                        <X size={12} />
                      </button>

                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-border-color bg-slate-100">
                        <OptimizedImage
                          src={demo.desktopPreview || demo.thumbnail}
                          alt={demo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h4 className="font-bold text-sm text-text-main">{demo.name}</h4>
                      <span className="text-[11px] font-mono text-elegant-green">{demo.category}</span>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-border-color text-xs">
                  {/* Category */}
                  <div className="grid grid-cols-4 gap-4 py-3.5">
                    <span className="font-semibold text-slate-500">Industry / Sector</span>
                    {comparedDemos.map((demo) => (
                      <span key={demo.id} className="font-medium text-text-main">{demo.industry || demo.category}</span>
                    ))}
                  </div>

                  {/* Experience Type */}
                  <div className="grid grid-cols-4 gap-4 py-3.5">
                    <span className="font-semibold text-slate-500">Experience Type</span>
                    {comparedDemos.map((demo) => (
                      <span key={demo.id} className="text-text-main">{demo.type || 'Custom Web Application'}</span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="grid grid-cols-4 gap-4 py-3.5">
                    <span className="font-semibold text-slate-500">Languages</span>
                    {comparedDemos.map((demo) => (
                      <span key={demo.id} className="text-text-main">
                        {demo.languages && demo.languages.length > 0 ? demo.languages.join(', ') : 'English'}
                      </span>
                    ))}
                  </div>

                  {/* Core Features */}
                  <div className="grid grid-cols-4 gap-4 py-3.5">
                    <span className="font-semibold text-slate-500">Key Features</span>
                    {comparedDemos.map((demo) => (
                      <div key={demo.id} className="space-y-1">
                        {demo.features?.slice(0, 6).map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-text-muted">
                            <Check size={12} className="text-fresh-green shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Technology Stack */}
                  <div className="grid grid-cols-4 gap-4 py-3.5">
                    <span className="font-semibold text-slate-500">Technologies</span>
                    {comparedDemos.map((demo) => (
                      <span key={demo.id} className="text-text-main font-mono text-[11px]">
                        {demo.technologies?.join(', ') || 'React, TypeScript, Tailwind'}
                      </span>
                    ))}
                  </div>

                  {/* Launch Live Link */}
                  <div className="grid grid-cols-4 gap-4 py-4">
                    <span className="font-semibold text-slate-500">Live Experience</span>
                    {comparedDemos.map((demo) => (
                      <div key={demo.id}>
                        {demo.liveUrl ? (
                          <a
                            href={demo.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              trackEvent('OpenLiveDemo', {
                                demo_name: demo.name,
                                demo_slug: demo.slug,
                                demo_category: demo.category,
                                live_url: demo.liveUrl
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-fresh-green text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-xs"
                          >
                            <span>Open Demo</span>
                            <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Staging</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
