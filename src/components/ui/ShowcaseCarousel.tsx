import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDemos } from '@/data/mockDemos';
import { useDemos } from '@/hooks/useContent';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function ShowcaseCarousel() {
  const { demos: dbDemos, loading } = useDemos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const displayDemos = dbDemos.length > 0 ? dbDemos : mockDemos;
  const showcaseItems = displayDemos.slice(0, 5);

  useEffect(() => {
    if (isHovered || showcaseItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, showcaseItems.length]);

  const paginate = (newDirection: number) => {
    if (showcaseItems.length === 0) return;
    setCurrentIndex((prev) => (prev + newDirection + showcaseItems.length) % showcaseItems.length);
  };

  if (loading || showcaseItems.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="w-full max-w-6xl aspect-[16/9] lg:aspect-[21/9] bg-soft-white animate-pulse rounded-[2rem] border border-border-color" />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white border border-border-color shadow-xl shadow-text-main/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={showcaseItems[currentIndex].thumbnail || undefined} 
              alt={showcaseItems[currentIndex].title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Elegant minimal gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-text-main/80 via-text-main/10 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 flex flex-col items-start justify-end">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-white/20">
                  {showcaseItems[currentIndex].industry || showcaseItems[currentIndex].category || 'Featured Work'}
                </div>
                <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
                  {showcaseItems[currentIndex].title}
                </h3>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Internal Overlay Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 right-4 md:right-8 flex justify-between pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-text-main transition-all pointer-events-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Previous"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-text-main transition-all pointer-events-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Next"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress indicators below */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {showcaseItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              idx === currentIndex ? "w-8 bg-fresh-green" : "w-2 bg-border-color hover:bg-elegant-green/50"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
