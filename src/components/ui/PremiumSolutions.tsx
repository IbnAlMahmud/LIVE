import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Home, Utensils, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const solutions = [
  {
    id: 'e-commerce',
    title: 'E-commerce Solutions',
    desc: 'High-conversion online stores designed to sell. We build scalable digital storefronts with seamless checkout experiences, fast loading times, and powerful inventory management.',
    icon: ShoppingBag,
    features: ['Custom Product Pages', 'Seamless Checkout', 'Inventory Management'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-soft-blue',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-500',
    reverse: false,
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="ecommerce-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 30 30 L 70 70 M 70 30 L 30 70" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect x="0" y="0" w="100%" h="100%" fill="url(#ecommerce-pattern)" />
      </svg>
    )
  },
  {
    id: 'real-estate',
    title: 'Real Estate Platforms',
    desc: 'Premium property showcases that turn visitors into leads. Featuring advanced search filters, beautiful property galleries, and interactive maps tailored for modern agencies.',
    icon: Home,
    features: ['Advanced Search', 'Property Galleries', 'Lead Generation'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-soft-green',
    textColor: 'text-elegant-green',
    iconColor: 'text-fresh-green',
    reverse: true,
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="realestate-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect x="20" y="20" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="1" />
          <line x1="60" y1="20" x2="60" y2="100" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect x="0" y="0" w="100%" h="100%" fill="url(#realestate-pattern)" />
      </svg>
    )
  },
  {
    id: 'restaurant',
    title: 'Restaurant & Hospitality',
    desc: 'Appetizing digital experiences that drive bookings. We design beautiful online menus, seamless reservation systems, and brand-aligned visual storytelling.',
    icon: Utensils,
    features: ['Digital Menus', 'Reservation Systems', 'Brand Storytelling'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-orange-50',
    textColor: 'text-orange-900',
    iconColor: 'text-orange-500',
    reverse: false,
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="restaurant-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect x="0" y="0" w="100%" h="100%" fill="url(#restaurant-pattern)" />
      </svg>
    )
  },
  {
    id: 'technology',
    title: 'Technology & SaaS',
    desc: 'High-performance landing pages for modern tech products. We highlight your software features with clean interfaces, dynamic product demos, and strong conversion funnels.',
    icon: Building2,
    features: ['Feature Highlights', 'Interactive Demos', 'Conversion Funnels'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-soft-blue',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-500',
    reverse: true,
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 20 50 L 50 20 L 80 50 L 50 80 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </pattern>
        <rect x="0" y="0" w="100%" h="100%" fill="url(#tech-pattern)" />
      </svg>
    )
  }
];

export function PremiumSolutions() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">Industry Solutions</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-text-main mb-6 leading-tight">Tailored Digital Experiences.</h3>
          <p className="text-text-muted text-lg md:text-xl font-medium">
            We don't build generic templates. Every website is purposefully crafted to solve specific business challenges in your industry.
          </p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {solutions.map((sol, i) => (
            <div key={sol.id} className={cn("flex flex-col lg:flex-row items-center gap-12 lg:gap-20", sol.reverse ? "lg:flex-row-reverse" : "")}>
              
              {/* Content */}
              <div className="w-full lg:w-1/2 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white", sol.color)}>
                    <sol.icon size={24} className={sol.iconColor} />
                  </div>
                  <h4 className="text-3xl lg:text-4xl font-bold text-text-main mb-6 leading-tight">{sol.title}</h4>
                  <p className="text-lg text-text-muted font-medium leading-relaxed mb-8">
                    {sol.desc}
                  </p>
                  
                  <ul className="space-y-4 mb-10">
                    {sol.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-text-main font-medium">
                        <div className="w-2 h-2 rounded-full bg-fresh-green" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a href={`/work?industry=${sol.id}`} className="inline-flex items-center font-bold text-elegant-green hover:text-fresh-green transition-colors group">
                    View {sol.title.split(' ')[0]} Work
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </div>

              {/* Visual */}
              <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("absolute inset-0 w-full h-full flex items-center justify-center border border-gray-100", sol.color)}
                >
                  {sol.bgPattern}
                  
                  {/* Website Frame Representation */}
                  <div className="relative w-[85%] h-[80%] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col group-hover:-translate-y-2 transition-transform duration-500 border border-gray-200">
                     <div className="h-8 sm:h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5 shrink-0">
                       <div className="w-2 h-2 rounded-full bg-gray-300" />
                       <div className="w-2 h-2 rounded-full bg-gray-300" />
                       <div className="w-2 h-2 rounded-full bg-gray-300" />
                     </div>
                     <div className="flex-1 relative overflow-hidden bg-gray-100">
                       <img src={sol.image} alt={sol.title} className="w-full h-full object-cover object-top" />
                       {/* Floating UI Elements based on industry */}
                       {sol.id === 'real-estate' && (
                         <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                           <div className="text-xs font-bold text-elegant-green mb-1">$1,250,000</div>
                           <div className="text-sm font-bold text-text-main">Modern Architectural Villa</div>
                         </div>
                       )}
                       {sol.id === 'e-commerce' && (
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 flex items-center gap-3">
                           <ShoppingBag size={16} className="text-fresh-green" />
                           <span className="text-sm font-bold text-text-main">Added to Cart</span>
                         </div>
                       )}
                     </div>
                  </div>
                </motion.div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
