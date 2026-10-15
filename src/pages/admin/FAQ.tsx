import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    published: true
  });

  useEffect(() => {
    const q = query(collection(db, 'faq'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: FAQItem[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as FAQItem));
      setFaqs(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (faq?: FAQItem) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'General',
        order: faq.order || 0,
        published: faq.published !== false
      });
    } else {
      setEditingId(null);
      setFormData({ question: '', answer: '', category: 'General', order: faqs.length, published: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'faq', editingId), formData);
      } else {
        await addDoc(collection(db, 'faq'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save FAQ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this FAQ?")) {
      await deleteDoc(doc(db, 'faq', id));
    }
  };

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <Helmet><title>FAQ Management | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="text-modern-blue" /> FAQ Management
            </h1>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-navy transition-all font-medium text-sm">
            <Plus size={18} /><span>Add Question</span>
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search FAQs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : filteredFaqs.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12">
            <div className="text-center text-gray-500">
              <p className="font-medium text-gray-900 mb-1">No FAQs found</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold w-16">Order</th>
                  <th className="px-6 py-4 font-semibold">Question & Answer</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-gray-500">{faq.order}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{faq.question}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{faq.category}</td>
                    <td className="px-6 py-4">
                      {faq.published ? <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Published</span> : <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Draft</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(faq)} className="p-2 text-gray-400 hover:text-modern-blue"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(faq.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1.5"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Question</label>
                  <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Answer</label>
                  <textarea required rows={4} value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order</label>
                    <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-900">Published</label>
                </div>
              </div>
            </form>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
