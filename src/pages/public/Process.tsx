import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    { num: '01', title: 'Discovery & Strategy', desc: 'We begin by understanding your business, goals, target audience, and competitive landscape. We define the project scope, technical requirements, and establish a clear roadmap for success.' },
    { num: '02', title: 'UX/UI Design', desc: 'Our design team creates wireframes and high-fidelity mockups. We focus on conversion-optimized user journeys, editorial typography, and a premium visual aesthetic tailored to your brand identity.' },
    { num: '03', title: 'Development', desc: 'We build your website using modern, scalable technologies. We prioritize clean code, lightning-fast performance, and flawless responsive behavior across all devices.' },
    { num: '04', title: 'Content & CMS', desc: 'We integrate your content and connect the required Content Management Systems (CMS) so you can easily update text, images, and data without touching code.' },
    { num: '05', title: 'Testing & QA', desc: 'Rigorous cross-browser and cross-device testing. We ensure all forms, CTAs, animations, and integrations work perfectly before going live.' },
    { num: '06', title: 'Launch & Support', desc: 'We handle the deployment process, connect analytics, and provide post-launch support and training to ensure your new digital presence is a success.' }
  ];

  return (
    <>
      <Helmet><title>Our Process | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h2 className="text-sm font-bold text-elegant-green tracking-widest uppercase mb-4">How We Work</h2>
             <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">A proven process for digital success.</h1>
             <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
               We combine strategic thinking, world-class design, and robust engineering to deliver websites that perform.
             </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8 items-start group"
              >
                <div className="text-[5rem] font-bold text-gray-100 leading-none tracking-tighter shrink-0 group-hover:text-blue-50 transition-colors">{step.num}</div>
                <div className="pt-4">
                  <h3 className="text-3xl font-bold text-charcoal mb-4">{step.title}</h3>
                  <p className="text-xl text-text-muted font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
