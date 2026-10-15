import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pricingPackages } from '@/config/pricingConfig';
import { CheckCircle2 } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Pricing | AureviaWeb</title>
        <meta name="description" content="Transparent, outcome-based pricing for premium digital experiences." />
      </Helmet>
      
      <div className="bg-soft-white pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-border-color">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
           <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-text-main mb-8 tracking-tight">Invest in Your Digital Future.</h1>
           <p className="text-xl text-text-muted max-w-2xl mx-auto font-medium">
             Transparent pricing without hidden fees. We don't just build websites, we build high-converting business assets.
           </p>
        </div>
      </div>

      <div className="py-32 bg-white relative">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {pricingPackages.map((plan, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={plan.name} 
                className={cn(
                  "rounded-[2.5rem] p-10 transition-all flex flex-col h-full",
                  plan.popular 
                    ? "bg-soft-green shadow-2xl shadow-fresh-green/10 lg:-translate-y-6 border-2 border-fresh-green relative" 
                    : "bg-white border border-border-color shadow-sm hover:border-gray-300 hover:shadow-lg hover:shadow-text-main/5 mt-0 lg:mt-6"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fresh-green text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                    Most Popular
                  </div>
                )}
                                
                <h3 className="text-2xl font-bold text-text-main mb-2">{plan.name}</h3>
                <p className={cn("font-semibold mb-8", plan.popular ? "text-elegant-green" : "text-text-muted")}>{plan.pageCount}</p>
                
                <div className="mb-8 pb-8 border-b border-border-color">
                  <div className="text-4xl xl:text-5xl font-bold text-text-main mb-2">{plan.price}</div>
                  <p className="text-text-muted text-sm min-h-[40px] leading-relaxed mt-4 font-medium">{plan.description}</p>
                </div>
                                
                <ul className="space-y-5 flex-1 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className={cn("shrink-0 mt-0.5", plan.popular ? "text-fresh-green" : "text-elegant-green")} />
                      <span className="text-sm font-bold text-text-main leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="/start-project" 
                  className={cn(
                    "block w-full text-center rounded-2xl py-4 font-bold transition-all text-sm",
                    plan.popular 
                      ? "bg-fresh-green text-white shadow-lg hover:bg-elegant-green" 
                      : "bg-soft-white text-text-main hover:bg-gray-100 border border-border-color"
                  )}
                >
                  {plan.ctaText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-32 bg-soft-green text-center border-t border-border-color">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text-main leading-tight">Need something specific?</h2>
          <p className="text-text-muted text-xl mb-12 font-medium">We also offer custom development, monthly SEO retainers, and priority maintenance plans for existing clients.</p>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-white border border-border-color px-10 py-5 text-lg font-bold text-text-main hover:bg-soft-white transition-all shadow-sm">
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}
