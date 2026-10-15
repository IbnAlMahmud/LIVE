import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowRight, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Insights() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, 'blog'), where('published', '==', true), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <>
      <Helmet><title>Insights & Articles | AureviaWeb Studio</title></Helmet>
      
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-soft-white overflow-hidden border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
             <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">Insights & Articles</h1>
             <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
               Thoughts on web design, technology, and building digital businesses.
             </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
          ) : articles.length === 0 ? (
             <div className="text-center py-20 text-text-muted font-medium text-lg">No articles published yet. Check back soon.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, idx) => (
                <motion.a 
                  href={`/insights/${article.slug || article.id}`}
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200">
                        <span className="font-bold text-xl">Aw.</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs font-bold text-text-muted font-medium uppercase tracking-wider mb-4">
                      <span>{article.category || 'General'}</span>
                      {article.createdAt && <span>• {article.createdAt.toDate().toLocaleDateString()}</span>}
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-elegant-green transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-text-muted font-medium mb-6 line-clamp-3 leading-relaxed flex-1">{article.excerpt}</p>
                    <div className="flex items-center text-sm font-bold text-elegant-green mt-auto">
                      Read Article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
