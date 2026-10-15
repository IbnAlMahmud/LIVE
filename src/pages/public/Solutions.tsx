import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LayoutGrid, Globe, Layers, PenTool, Code2, BarChart3, ArrowRight } from 'lucide-react';

export default function Solutions() {
  const industries = [
    { name: 'Corporate & Professional', icon: Globe, desc: 'Authoritative, trust-building websites for law firms, consultants, agencies, and professional services.' },
    { name: 'E-Commerce & Retail', icon: LayoutGrid, desc: 'High-conversion online stores with flawless product showcases and seamless checkout experiences.' },
    { name: 'Restaurants & Hospitality', icon: Layers, desc: 'Immersive digital experiences featuring menus, reservation systems, and location information.' },
    { name: 'Real Estate & Property', icon: Globe, desc: 'Property portfolios with high-quality imagery, advanced filtering, and lead generation tools.' },
    { name: 'Creators & Portfolios', icon: PenTool, desc: 'Visually striking, asymmetric designs that put your creative work front and center.' },
    { name: 'Startups & SaaS', icon: Code2, desc: 'Modern, feature-rich landing pages designed to explain complex software and drive signups.' }
  ];

  return (
    <>
      <Helmet><title>Industries & Solutions | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">Industries</h2>
             <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">Tailored digital solutions.</h1>
             <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
               We don't believe in one-size-fits-all. We build industry-specific web experiences designed to solve your unique business challenges.
             </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-soft-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-elegant-green mb-8 shadow-sm group-hover:scale-110 group-hover:bg-fresh-green text-white group-hover: transition-all">
                  <ind.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">{ind.name}</h3>
                <p className="text-text-muted font-medium mb-8 leading-relaxed">{ind.desc}</p>
                <a href={`/work?industry=${ind.name.split(' ')[0].toLowerCase()}`} className="inline-flex items-center text-sm font-bold text-elegant-green group/link">
                  View Examples <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-soft-green text-text-main text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Don't see your industry?</h2>
          <p className="text-xl text-text-muted font-medium mb-10">We build custom digital solutions for businesses of all types. Let's discuss your specific needs.</p>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-fresh-green text-white px-10 py-5 text-lg font-bold  shadow-lg hover:bg-elegant-green hover:-translate-y-1 transition-all">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
