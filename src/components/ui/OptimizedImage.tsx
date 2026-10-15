import React, { useState, useEffect } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  [key: string]: any;
}

const DEFAULT_STUDIO_FALLBACK = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80';

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_STUDIO_FALLBACK,
  aspectRatio,
  priority = false,
  className,
  containerClassName,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || fallbackSrc);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
      setIsLoaded(false);
    } else {
      setCurrentSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-100",
        aspectRatio,
        containerClassName
      )}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/60 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-fresh-green animate-spin" />
        </div>
      )}

      {/* Clean Branded Fallback on complete failure */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8FBFA] p-6 text-center border border-border-color">
          <div className="w-12 h-12 rounded-xl bg-white border border-border-color flex items-center justify-center mb-3 shadow-xs">
            <ImageOff size={20} className="text-slate-400" />
          </div>
          <p className="font-mono text-xs uppercase font-bold text-text-main tracking-wider">
            Preview Unavailable
          </p>
          <span className="text-[11px] text-text-muted mt-1 max-w-xs line-clamp-1">
            {alt || 'AureviaWeb Showcase Experience'}
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            !isLoaded ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100",
            className
          )}
          {...rest}
        />
      )}
    </div>
  );
}
