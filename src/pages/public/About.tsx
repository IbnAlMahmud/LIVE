import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | AureviaWeb Studio</title>
        <meta name="description" content="Learn about AureviaWeb, a premium digital design and development studio." />
      </Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">Built for the Modern Web.</h1>
             <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto mb-12">
               We are a premium digital studio focused on crafting high-end, conversion-optimized websites that help businesses establish an unshakeable digital presence.
             </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">Our Philosophy</h2>
              <p className="text-lg text-text-muted font-medium mb-6 leading-relaxed">
                AureviaWeb was founded on a simple principle: every business deserves a world-class digital presence. In today's digital-first economy, your website is your most valuable real estate. It's not just a digital brochure; it's a 24/7 sales engine, brand ambassador, and trust builder.
              </p>
              <p className="text-lg text-text-muted font-medium mb-8 leading-relaxed">
                We reject generic templates and cookie-cutter solutions. Instead, we take an editorial, conversion-focused approach to web design—combining deep UX strategy with breathtaking visual design and robust engineering.
              </p>
              <ul className="space-y-4">
                {['Design that commands authority', 'Engineering built for speed', 'Architecture designed to scale', 'Experiences optimized for conversion'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-800 font-bold">
                    <CheckCircle2 className="text-elegant-green" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] bg-gray-100 overflow-hidden relative z-10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Team collaborating" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-64 h-64 bg-fresh-green text-white rounded-full blur-[100px] opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-soft-green text-text-main text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Ready to elevate your brand's digital presence?</h2>
          <a href="/start-project" className="inline-flex items-center justify-center rounded-full bg-fresh-green text-white px-10 py-5 text-lg font-bold  shadow-lg shadow-fresh-green/20 hover:bg-elegant-green hover:-translate-y-1 transition-all">
            Start Your Project <ArrowRight size={20} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
