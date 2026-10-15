import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectMediaProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  projectTitle?: string;
  projectCategory?: string;
  showOverlay?: boolean;
  priority?: boolean;
}

export function ProjectMedia({
  src,
  alt,
  aspectRatio = 'aspect-[16/10]',
  className,
  projectTitle,
  projectCategory,
  showOverlay = true,
  priority = false,
}: ProjectMediaProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl md:rounded-[2rem] bg-soft-white border border-border-color shadow-lg shadow-text-main/5 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-fresh-green/5 group-hover:border-slate-300",
        aspectRatio,
        className
      )}
    >
      {/* Subtle fine browser chrome header strip */}
      <div className="absolute top-0 inset-x-0 h-8 sm:h-9 bg-white/80 backdrop-blur-md border-b border-border-color/60 z-20 flex items-center justify-between px-3 sm:px-4 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono text-text-muted/70 tracking-tight flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-fresh-green/60" />
          <span>aurevia.studio/case-study</span>
        </div>
        <div className="w-8" />
      </div>

      {!hasError ? (
        <>
          {/* Subtle loading shimmer */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse z-0" />
          )}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "w-full h-full object-cover object-top pt-8 sm:pt-9 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.025]",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      ) : (
        /* Editorial Fallback Preview Card */
        <div className="w-full h-full pt-8 sm:pt-9 bg-gradient-to-br from-soft-white via-white to-soft-blue flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-soft-green border border-fresh-green/30 flex items-center justify-center text-fresh-green mb-4 shadow-sm">
            <Sparkles size={22} />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-elegant-green uppercase font-bold mb-1">
            {projectCategory || 'AureviaWeb Showcase'}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-text-main mb-2">
            {projectTitle || 'Bespoke Digital Experience'}
          </h4>
          <p className="text-xs text-text-muted max-w-sm">
            High-performance bespoke architecture & responsive visual design.
          </p>
        </div>
      )}

      {/* Subtle bottom vignette / soft lighting layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Interactive hover indicator pill */}
      {showOverlay && (
        <div className="absolute bottom-4 right-4 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text-main/90 text-white backdrop-blur-md text-xs font-semibold shadow-lg">
          <span>Explore Work</span>
          <ArrowUpRight size={13} className="text-fresh-green" />
        </div>
      )}
    </div>
  );
}
