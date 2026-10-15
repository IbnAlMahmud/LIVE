const fs = require('fs');

const content = `
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDemos } from '@/data/mockDemos';
import { useProjects } from '@/hooks/useContent';
import { useHomepage } from '@/hooks/useHomepage';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { pricingPackages } from '@/config/pricingConfig';
import { useState } from 'react';
import { PremiumHero } from '@/components/ui/PremiumHero';
import { PremiumTopStrip } from '@/components/ui/PremiumTopStrip';
import { PremiumSolutions } from '@/components/ui/PremiumSolutions';
import { PremiumDemos } from '@/components/ui/PremiumDemos';
import { PremiumServices } from '@/components/ui/PremiumServices';

export default function Home() {
  const { projects } = useProjects();
  const { isEnabled } = useHomepage();
  const displayProjects = projects.length > 0 ? projects : mockDemos;
  const featuredWork = displayProjects.filter(d => d.featured).slice(0, 4);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How long does it take to build a website?", a: "Most premium websites take between 2 to 4 weeks depending on the complexity, number of pages, and specific features required." },
    { q: "Do you provide hosting and maintenance?", a: "Yes, we offer comprehensive hosting, maintenance, and security packages to keep your website running perfectly after launch." },
    { q: "Can I update the website myself?", a: "Absolutely. We build with modern, easy-to-use content management systems (CMS) so you can update text and images effortlessly." },
    { q: "Are your websites optimized for SEO?", a: "Yes, technical SEO is built into our core process. We ensure fast load times, proper metadata, and clean architecture." }
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>AureviaWeb | Premium Digital Studio</title>
        <meta name="description" content="Digital Experiences, Beautifully Built." />
      </Helmet>

      {/* SECTION 01: WHITE HERO */}
      <PremiumHero projects={featuredWork} />

      {/* TOP STRIP (Instead of Soft Green Visual Showcase, we put it here) */}
      <PremiumTopStrip projects={displayProjects} />

      {/* SECTION 02: SOFT GREEN PHILOSOPHY / WHY AUREVIAWEB */}
      <section className="py-24 md:py-32 bg-soft-green relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white rounded-full blur-[100px] opacity-50 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-soft-blue rounded-full blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10 text-center">
          <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-12">Why AureviaWeb?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 text-left max-w-5xl mx-auto">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <h3 className="text-3xl lg:text-4xl font-bold text-text-main mb-4 leading-tight">Designed for Business.</h3>
               <p className="text-lg text-text-muted font-medium">We create commercial digital assets that drive leads, engage customers, and elevate your brand.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
               <h3 className="text-3xl lg:text-4xl font-bold text-text-main mb-4 leading-tight">Built for Real People.</h3>
               <p className="text-lg text-text-muted font-medium">Beautiful on the outside, intuitive on the inside. We prioritize user experience above all else.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
               <h3 className="text-3xl lg:text-4xl font-bold text-text-main mb-4 leading-tight">Responsive Everywhere.</h3>
               <p className="text-lg text-text-muted font-medium">Flawless execution across desktop, tablet, and mobile. Your website will look stunning on every device.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
               <h3 className="text-3xl lg:text-4xl font-bold text-text-main mb-4 leading-tight">Ready to Grow.</h3>
               <p className="text-lg text-text-muted font-medium">Scalable architecture and integrated analytics ensure your platform grows alongside your business.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 03: WHITE SELECTED WORK / DEMOS */}
      {isEnabled('featured_work') && (
        <PremiumDemos demos={displayProjects} />
      )}

      {/* SECTION 04: VERY LIGHT BLUE SERVICES */}
      {isEnabled('services') && (
        <PremiumServices />
      )}

      {/* SECTION 05: WHITE INDUSTRIES */}
      {isEnabled('solutions') && (
        <PremiumSolutions />
      )}

      {/* SECTION 06: SOFT GREEN PROCESS TIMELINE */}
      {isEnabled('process') && (
      <section className="py-24 md:py-32 bg-soft-green border-b border-border-color overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">Our Process</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main leading-tight">How we bring it to life.</h3>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-border-color -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border-color md:hidden"></div>
            
            <div className="space-y-16">
              {[
                { num: '01', title: 'Discovery & Strategy', desc: 'We learn about your business, goals, and specific requirements to build a solid foundation.' },
                { num: '02', title: 'UX/UI Design', desc: 'Crafting the visual identity and user experience wireframes tailored to your brand.' },
                { num: '03', title: 'Development', desc: 'Building the website with modern, scalable, and lightning-fast technologies.' },
                { num: '04', title: 'Launch & Support', desc: 'Final testing, optimization, pushing your site live, and providing ongoing support.' }
              ].map((step, i) => (
                <div key={i} className={cn("relative flex items-center gap-8 md:gap-16", i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")}>
                   {/* Mobile line connection */}
                   <div className="absolute left-[27px] top-10 bottom-[-4rem] w-px bg-border-color md:hidden z-0"></div>

                   <div className="w-14 h-14 shrink-0 rounded-full bg-white border-2 border-fresh-green flex items-center justify-center text-lg font-bold text-elegant-green shadow-sm z-10 relative md:absolute md:left-1/2 md:-translate-x-1/2">
                     {i+1}
                   </div>
                   
                   <motion.div 
                     initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} 
                     whileInView={{ opacity: 1, x: 0 }} 
                     viewport={{ once: true, margin: "-100px" }} 
                     transition={{ duration: 0.6 }}
                     className={cn("bg-white p-8 rounded-[2rem] shadow-sm border border-border-color flex-1 relative z-10", i % 2 === 0 ? "md:text-right" : "md:text-left")}
                   >
                     <div className="text-[4rem] font-bold text-soft-green leading-none tracking-tighter mb-2 select-none absolute top-4 right-8 z-0">{step.num}</div>
                     <h4 className="text-2xl font-bold text-text-main mb-3 relative z-10">{step.title}</h4>
                     <p className="text-text-muted font-medium text-lg leading-relaxed relative z-10">{step.desc}</p>
                   </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 07: WHITE PRICING */}
      {isEnabled('pricing') && (
      <section className="py-24 md:py-32 bg-white relative">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">Investment</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-text-main mb-6">Transparent, Value-Driven Pricing</h3>
            <p className="text-text-muted text-xl font-medium">Invest in a digital presence that actually generates ROI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            {pricingPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={cn(
                  "rounded-[2.5rem] p-8 lg:p-10 transition-all flex flex-col relative h-full group",
                  pkg.popular 
                    ? "bg-soft-green shadow-xl shadow-fresh-green/10 lg:-translate-y-4 border-2 border-fresh-green" 
                    : "bg-white border border-border-color hover:border-gray-200 hover:shadow-lg hover:shadow-text-main/5"
                )}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fresh-green text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-md whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 text-text-main">{pkg.name}</h3>
                <p className={cn("font-semibold mb-8 text-sm", pkg.popular ? "text-elegant-green" : "text-text-muted")}>{pkg.pageCount}</p>
                
                <div className="mb-8 pb-8 border-b border-border-color">
                  <div className="text-4xl xl:text-5xl font-bold text-text-main mb-2">{pkg.price}</div>
                  {pkg.price !== 'Custom' && <div className="text-sm text-text-muted">One-time investment</div>}
                </div>
                
                <ul className="space-y-4 flex-1 mb-10">
                  {pkg.features.slice(0, 6).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-text-main">
                      <CheckCircle2 size={18} className={cn("shrink-0 mt-0.5", pkg.popular ? "text-fresh-green" : "text-elegant-green")} />
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                  {pkg.features.length > 6 && (
                    <li className={cn("text-sm font-bold pt-2", pkg.popular ? "text-elegant-green" : "text-text-muted")}>
                      + {pkg.features.length - 6} more features
                    </li>
                  )}
                </ul>
                
                <a 
                  href="/pricing" 
                  className={cn(
                    "block w-full text-center rounded-2xl py-4 font-bold transition-all text-[15px]",
                    pkg.popular 
                      ? "bg-fresh-green text-white hover:bg-elegant-green shadow-lg" 
                      : "bg-soft-white text-text-main hover:bg-gray-100 border border-border-color group-hover:border-gray-300"
                  )}
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SECTION 08: VERY LIGHT BLUE FAQ */}
      <section className="py-24 bg-soft-blue border-y border-blue-100">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <div className="text-center mb-16">
             <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">FAQ</h2>
             <h3 className="text-4xl font-bold text-text-main">Common Questions</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-6 lg:p-8 flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-bold text-text-main">{faq.q}</span>
                  <ChevronDown size={20} className={cn("text-blue-500 transition-transform duration-300 shrink-0", activeFaq === i ? "rotate-180" : "")} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 lg:p-8 pt-0 text-text-muted font-medium border-t border-blue-50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 09: SOFT GREEN FINAL CTA */}
      {isEnabled('cta') && (
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="bg-soft-green border border-border-color rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-fresh-green/5">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-80 -translate-y-1/2 translate-x-1/3"></div>
             
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-8 relative z-10 leading-tight">
               Ready to build something <span className="text-fresh-green">exceptional?</span>
             </h2>
             <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto relative z-10 font-medium">
               Let's discuss your project requirements and create a digital experience that drives real commercial results.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
                <a href="/start-project" className="inline-flex items-center justify-center rounded-full bg-fresh-green px-10 py-5 text-lg font-bold text-white shadow-lg shadow-fresh-green/20 hover:bg-elegant-green hover:-translate-y-1 transition-all">
                  Start Your Project
                </a>
                <a href="https://wa.me/8801402884798" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white border border-border-color px-10 py-5 text-lg font-bold text-text-main shadow-sm hover:bg-soft-white hover:-translate-y-1 transition-all">
                  WhatsApp Us
                </a>
             </div>
           </div>
         </div>
      </section>
      )}
    </div>
  );
}
`

fs.writeFileSync('src/pages/public/Home.tsx', content, 'utf8');
console.log('Home.tsx completely rewritten');
