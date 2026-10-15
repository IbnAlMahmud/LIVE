import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Edit2, Trash2, X, Search, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    published: true,
    featured: false
  });

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Article[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Article);
      });
      setArticles(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage || '',
        category: article.category,
        published: article.published,
        featured: article.featured || false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        category: '',
        published: true,
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      if (editingId) {
        await updateDoc(doc(db, 'blog', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'blog'), {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving article:", error);
      alert("Failed to save article: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      try {
        await deleteDoc(doc(db, 'blog', id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog & Insights | AureviaWeb Admin</title>
      </Helmet>
      
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-modern-blue" /> Blog & Insights
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage articles and case studies.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-navy transition-all font-medium text-sm shadow-sm"
          >
            <Plus size={18} />
            <span>New Article</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12">
            <div className="text-center text-gray-500">
              <FileText size={32} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium text-gray-900 mb-1">No articles found</p>
              <p className="text-sm">Create your first post to get started.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold w-16">Image</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {article.coverImage ? (
                        <img src={article.coverImage} alt={article.title} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <FileText size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{article.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{article.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                        article.published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", article.published ? "bg-green-500" : "bg-yellow-500")}></span>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(article)} className="p-2 text-gray-400 hover:text-modern-blue hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(article.id, article.title)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="absolute inset-0" onClick={handleCloseModal}></div>
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Article Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="Title" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="Auto-generated if empty" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="e.g. Tips & Tricks" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
                  <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm resize-none" placeholder="Short summary" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content (Markdown / Text)</label>
                  <textarea required rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm font-mono" placeholder="Write article content..." />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
                  <input type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm" placeholder="https://" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-4 h-4 text-modern-blue rounded border-gray-300" />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-900 cursor-pointer">Published</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-modern-blue rounded border-gray-300" />
                  <label htmlFor="featured" className="text-sm font-semibold text-gray-900 cursor-pointer">Featured Post</label>
                </div>
              </div>
            </form>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                onClick={handleSubmit}
                className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold hover:bg-navy transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
