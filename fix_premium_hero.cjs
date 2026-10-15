const fs = require('fs');

const content = `
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PremiumHero({ projects = [] }: { projects: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const showcaseItems = projects.slice(0, 5);

  useEffect(() => {
    if (showcaseItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [showcaseItems.length]);

  if (showcaseItems.length === 0) return null;

  return (
    <section className="relative pt-24 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-white">
      {/* Background Micro-Visuals */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-soft-blue rounded-full blur-[150px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-soft-green rounded-full blur-[120px] opacity-30 translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Typography & CTA */}
          <div className="w-full lg:w-[45%] z-20 text-center lg:text-left order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-soft-white px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-elegant-green uppercase mb-6 lg:mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-fresh-green"></span>
                <span>AureviaWeb Studio</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold tracking-tight text-text-main mb-6 lg:mb-8 leading-[1.05]">
                Websites Designed to <span className="text-fresh-green">Convert.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-text-muted mb-8 lg:mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Premium digital experiences for brands and entrepreneurs. Designed with modern UI/UX and built for real-world commercial success.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mb-8 lg:mb-12">
                <a href="/start-project" className="inline-flex items-center justify-center rounded-full bg-fresh-green px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-fresh-green/20 hover:bg-elegant-green hover:-translate-y-0.5 transition-all">
                  Start a Project
                </a>
                <a href="/work" className="inline-flex items-center justify-center rounded-full bg-white border border-gray-200 px-8 py-4 text-[15px] font-bold text-text-main hover:bg-soft-white hover:-translate-y-0.5 transition-all shadow-sm">
                  Explore Our Work
                </a>
              </div>

              {/* Trust Indicator - Desktop Only (moved to bottom on mobile) */}
              <div className="hidden lg:flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-soft-blue flex items-center justify-center overflow-hidden">
                       <img src={\`https://api.dicebear.com/7.x/notionists/svg?seed=\${i}&backgroundColor=eef8ff\`} alt="Avatar" className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-semibold text-text-muted">
                  Trusted by <span className="text-text-main font-bold">15+ Visionary Brands</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Premium Website Showcase */}
          <div className="w-full lg:w-[55%] relative order-2 flex flex-col items-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="w-full max-w-[92%] sm:max-w-full mx-auto"
            >
              {/* Feature Indicator (Top on desktop, Bottom on mobile - Wait, user requested below showcase on mobile. We will put it above on Desktop, below on mobile if possible, but let's just make it look good.) */}
              
              <div className="hidden lg:flex justify-between items-end mb-4 px-2 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col"
                  >
                    <span className="text-xs font-bold tracking-widest text-elegant-green uppercase">0{currentIndex + 1} / 0{showcaseItems.length}</span>
                    <span className="text-lg font-bold text-text-main">{showcaseItems[currentIndex]?.industry || 'Premium Design'}</span>
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center gap-2">
                   {showcaseItems.map((_, idx) => (
                      <div key={idx} className={cn("h-1 rounded-full transition-all duration-500", idx === currentIndex ? "w-6 bg-fresh-green" : "w-2 bg-gray-200")} />
                   ))}
                </div>
              </div>

              {/* Browser Frame */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] xl:aspect-[16/9] rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-text-main/5 flex flex-col mb-6 lg:mb-0">
                {/* Clean Browser Chrome */}
                <div className="h-8 sm:h-12 bg-gray-50 border-b border-gray-100 flex items-center px-3 sm:px-6 gap-2 shrink-0">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="mx-auto bg-white border border-gray-100 rounded-md h-5 sm:h-7 w-1/2 max-w-[200px] sm:max-w-[300px] flex items-center justify-center px-2">
                     <AnimatePresence mode="wait">
                        <motion.span 
                          key={currentIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[8px] sm:text-[11px] text-gray-400 truncate"
                        >
                          {showcaseItems[currentIndex]?.title.toLowerCase().replace(/\\s+/g, '')}.com
                        </motion.span>
                     </AnimatePresence>
                  </div>
                </div>

                {/* Website Image Container */}
                <div className="relative flex-1 overflow-hidden bg-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={showcaseItems[currentIndex]?.thumbnail} 
                        alt={showcaseItems[currentIndex]?.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Only: Feature Indicator & Trust */}
              <div className="flex flex-col lg:hidden w-full items-center text-center mt-2">
                 <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col mb-4"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-elegant-green uppercase mb-1">0{currentIndex + 1} / 0{showcaseItems.length}</span>
                    <span className="text-base font-bold text-text-main">{showcaseItems[currentIndex]?.industry || 'Premium Design'}</span>
                  </motion.div>
                </AnimatePresence>
                
                <div className="w-full h-px bg-gray-100 my-4" />

                <div className="flex items-center justify-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-soft-blue flex items-center justify-center overflow-hidden shadow-sm">
                         <img src={\`https://api.dicebear.com/7.x/notionists/svg?seed=\${i}&backgroundColor=eef8ff\`} alt="Avatar" className="w-full h-full object-cover opacity-80" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-text-muted">
                    Trusted by <span className="text-text-main font-bold">15+ Brands</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('src/components/ui/PremiumHero.tsx', content, 'utf8');
console.log('PremiumHero updated');
