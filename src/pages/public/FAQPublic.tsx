import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FAQPublic() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faq'), where('published', '==', true), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setFaqs(data);
        
        const cats = Array.from(new Set(data.map(f => f.category || 'General')));
        setCategories(['All', ...cats]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => (f.category || 'General') === activeCategory);

  return (
    <>
      <Helmet><title>FAQ | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">Frequently Asked Questions</h1>
             <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
               Everything you need to know about working with us, our process, and our pricing.
             </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
          ) : faqs.length === 0 ? (
             <div className="text-center py-20 text-text-muted font-medium text-lg">Check back soon for answers to common questions.</div>
          ) : (
            <>
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-5 py-2 rounded-full text-sm font-bold transition-all border",
                        activeCategory === cat 
                          ? "bg-soft-green text-text-main border-charcoal" 
                          : "bg-white text-text-muted font-medium border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
                    <button 
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-charcoal pr-8">{faq.question}</h3>
                      <div className="shrink-0 text-elegant-green">
                        {openId === faq.id ? <Minus size={24} /> : <Plus size={24} />}
                      </div>
                    </button>
                    <div className={cn(
                      "px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out",
                      openId === faq.id ? "max-h-96 pb-6 md:pb-8 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <p className="text-text-muted font-medium leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
