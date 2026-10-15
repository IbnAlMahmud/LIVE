import { motion } from 'framer-motion';
import { ArrowUpRight, Utensils, Home, PaintBucket, Building2, ShoppingBag, Code2, GraduationCap, Laptop } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { trackEvent } from '@/components/analytics/MetaPixel';

const getIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('restaurant') || cat.includes('food')) return Utensils;
  if (cat.includes('real estate')) return Home;
  if (cat.includes('interior')) return PaintBucket;
  if (cat.includes('hotel') || cat.includes('resort')) return Building2;
  if (cat.includes('commerce') || cat.includes('shop')) return ShoppingBag;
  if (cat.includes('saas') || cat.includes('tech')) return Code2;
  if (cat.includes('education')) return GraduationCap;
  return Laptop;
};

export function PremiumDemos({ demos = [] }: { demos: any[] }) {
  const navigate = useNavigate();
  // Filter published and display top 4
  const displayDemos = demos.filter(d => d.published !== false).slice(0, 4);

  if (displayDemos.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-soft-white relative overflow-hidden border-b border-border-color">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-mono font-bold text-elegant-green tracking-widest uppercase mb-3">
              Explore Our Demos
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-main leading-tight tracking-tight">
              Proof of Quality.
            </h3>
            <p className="text-text-muted text-base sm:text-lg mt-3 font-normal">
              Interact with our high-end live website demos before you start your project.
            </p>
          </div>
          <Link
            to="/demos"
            className="inline-flex items-center font-bold text-elegant-green hover:text-fresh-green transition-colors pb-1 border-b-2 border-elegant-green hover:border-fresh-green text-sm"
          >
            <span>View All Studio Demos</span>
            <ArrowUpRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {displayDemos.map((demo, idx) => {
            const Icon = getIcon(demo.category || demo.industry || '');
            const title = demo.name || demo.title;
            const liveUrl = demo.liveUrl || demo.url;
            const slug = demo.slug || demo.id;

            return (
              <motion.div
                key={demo.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col"
              >
                {/* Visual Frame */}
                <div 
                  className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white border border-border-color shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  onClick={() => {
                    if (liveUrl) {
                      trackEvent('OpenLiveDemo', { demo_name: title, demo_slug: slug, live_url: liveUrl });
                      window.open(liveUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(`/demos/${slug}`);
                    }
                  }}
                >
                  <OptimizedImage 
                    src={demo.desktopPreview || demo.thumbnail} 
                    alt={title} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                     <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-white text-elegant-green flex items-center justify-center mb-3 shadow-xl">
                          <Icon size={24} />
                        </div>
                        <span className="bg-fresh-green text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <span>View Live Demo</span>
                          <ArrowUpRight size={16} />
                        </span>
                     </div>
                  </div>
                </div>

                {/* Meta details below */}
                <div className="mt-5 flex justify-between items-start">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-text-main mb-1.5 group-hover:text-fresh-green transition-colors">
                      <Link to={`/demos/${slug}`}>
                        {title}
                      </Link>
                    </h4>
                    <p className="text-text-muted text-sm line-clamp-2 max-w-md">
                      {demo.shortDescription || demo.description || `Premium ${demo.category} website experience.`}
                    </p>
                  </div>
                  <div className="shrink-0 ml-4 hidden sm:flex items-center gap-1.5 bg-white px-3 py-1.5 border border-border-color rounded-full shadow-xs">
                     <Icon size={13} className="text-elegant-green" />
                     <span className="text-[11px] font-mono font-bold text-text-main uppercase tracking-wider">
                       {demo.category}
                     </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
