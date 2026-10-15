import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PremiumTopStrip({ projects = [] }: { projects: any[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white overflow-hidden border-b border-border-color">
      <div className="flex gap-6 lg:gap-8 whitespace-nowrap min-w-max">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-6 lg:gap-8 shrink-0"
        >
          {[...projects, ...projects, ...projects].slice(0, 8).map((p, i) => (
            <div key={i} className={cn("w-[300px] sm:w-[400px] lg:w-[480px] aspect-[16/9] rounded-2xl overflow-hidden p-3 border border-border-color", 
               i % 3 === 0 ? 'bg-soft-blue' : i % 3 === 1 ? 'bg-soft-green' : 'bg-soft-white'
            )}>
              <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer shadow-sm border border-border-color/50">
                <img src={p.thumbnail} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" alt={p.title} loading="lazy" />
                <div className="absolute inset-0 bg-text-main/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
