const fs = require('fs');

const content = `
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function PremiumHero({ projects = [] }: { projects: any[] }) {
  const showcaseItems = projects.slice(0, 4);

  if (showcaseItems.length === 0) return null;

  return (
    <section className="relative pt-24 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-white border-b border-border-color">
      {/* Background Micro-Visuals */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-soft-blue rounded-full blur-[150px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-soft-green rounded-full blur-[120px] opacity-30 translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">
          
          {/* Left: Typography & CTA */}
          <div className="w-full lg:w-[45%] z-20 text-center lg:text-left order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center space-x-2 rounded-full border border-border-color bg-soft-white px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-elegant-green uppercase mb-6 lg:mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-fresh-green animate-pulse"></span>
                <span>AureviaWeb Studio</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] 2xl:text-[5.5rem] font-bold tracking-tight text-text-main mb-6 lg:mb-8 leading-[1.05]">
                Websites Designed to <span className="text-fresh-green">Stand Out.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-text-muted mb-8 lg:mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Professional websites for businesses, brands and entrepreneurs — designed with modern UI/UX and built for real-world business needs.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mb-8 lg:mb-12">
                <a href="/start-project" className="inline-flex items-center justify-center rounded-full bg-fresh-green px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-fresh-green/20 hover:bg-elegant-green hover:-translate-y-0.5 transition-all">
                  Start a Project
                </a>
                <a href="/work" className="inline-flex items-center justify-center rounded-full bg-white border border-border-color px-8 py-4 text-[15px] font-bold text-text-main hover:bg-soft-white hover:-translate-y-0.5 transition-all shadow-sm">
                  Explore Our Work
                </a>
                <a href="/demos" className="inline-flex items-center justify-center rounded-full bg-transparent px-6 py-4 text-[15px] font-bold text-text-main hover:text-fresh-green transition-all">
                  View Live Demos <ArrowRight size={16} className="ml-2" />
                </a>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
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

          {/* Right: Asymmetric Premium Website Showcase */}
          <div className="w-full lg:w-[55%] relative order-2 h-[450px] sm:h-[550px] lg:h-[700px] flex items-center justify-center">
            
            {showcaseItems[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, rotate: 0, zIndex: 30 }}
                className="absolute right-[5%] sm:right-[10%] top-[10%] w-[65%] sm:w-[60%] aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-border-color shadow-2xl shadow-text-main/10 flex flex-col z-10"
              >
                <div className="h-6 sm:h-8 bg-soft-white border-b border-gray-100 flex items-center px-3 gap-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <img src={showcaseItems[0].thumbnail} className="w-full h-full object-cover object-top" alt="Demo" />
                </div>
              </motion.div>
            )}

            {showcaseItems[1] && (
              <motion.div
                initial={{ opacity: 0, x: -50, y: 30, rotate: 3 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 3 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, rotate: 0, zIndex: 30 }}
                className="absolute left-[0%] sm:left-[5%] top-[30%] sm:top-[25%] w-[60%] sm:w-[55%] aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-border-color shadow-xl shadow-text-main/10 flex flex-col z-20"
              >
                <div className="h-6 sm:h-8 bg-soft-white border-b border-gray-100 flex items-center px-3 gap-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <img src={showcaseItems[1].thumbnail} className="w-full h-full object-cover object-top" alt="Demo" />
                </div>
              </motion.div>
            )}

            {showcaseItems[2] && (
              <motion.div
                initial={{ opacity: 0, y: 70, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: -1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, rotate: 0, zIndex: 30 }}
                className="absolute right-[15%] sm:right-[20%] bottom-[5%] sm:bottom-[10%] w-[50%] sm:w-[45%] aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-border-color shadow-2xl shadow-text-main/10 flex flex-col z-30"
              >
                <div className="h-6 sm:h-8 bg-soft-white border-b border-gray-100 flex items-center px-3 gap-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <img src={showcaseItems[2].thumbnail} className="w-full h-full object-cover object-top" alt="Demo" />
                </div>
              </motion.div>
            )}
            
          </div>
          
        </div>
      </div>
    </section>
  );
}
`

fs.writeFileSync('src/components/ui/PremiumHero.tsx', content, 'utf8');
console.log('PremiumHero rewritten');
