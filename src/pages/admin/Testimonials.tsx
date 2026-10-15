import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Plus, Edit2, Trash2, X } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  testimonial: string;
  avatar: string;
  rating: number;
  featured: boolean;
  published: boolean;
  order: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '', company: '', role: '', testimonial: '', avatar: '', rating: 5, featured: false, published: true, order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Testimonial[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (t?: Testimonial) => {
    if (t) {
      setEditingId(t.id);
      setFormData({
        clientName: t.clientName, company: t.company || '', role: t.role || '', 
        testimonial: t.testimonial, avatar: t.avatar || '', rating: t.rating || 5, 
        featured: t.featured || false, published: t.published !== false, order: t.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ clientName: '', company: '', role: '', testimonial: '', avatar: '', rating: 5, featured: false, published: true, order: testimonials.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
      } else {
        await addDoc(collection(db, 'testimonials'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete testimonial from "${name}"?`)) {
      await deleteDoc(doc(db, 'testimonials', id));
    }
  };

  return (
    <>
      <Helmet><title>Testimonials | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-modern-blue" /> Testimonials
            </h1>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus size={18} /><span>Add Testimonial</span>
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : testimonials.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12 text-center text-gray-500">
             <p className="font-medium text-gray-900">No testimonials yet</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold w-16">Order</th>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Company / Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-500">{t.order}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                      {t.avatar ? <img src={t.avatar} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
                      {t.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.role} {t.company ? `@ ${t.company}` : ''}</td>
                    <td className="px-6 py-4">
                      {t.published ? <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Published</span> : <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Draft</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(t)} className="p-2 text-gray-400 hover:text-modern-blue"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(t.id, t.clientName)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1.5"><X size={20} /></button>
            </div>
            
            <form className="flex-1 overflow-y-auto p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1">Client Name</label><input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-semibold mb-1">Role</label><input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1">Testimonial Quote</label><textarea required rows={4} value={formData.testimonial} onChange={e => setFormData({...formData, testimonial: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold mb-1">Avatar URL (optional)</label><input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">Rating (1-5)</label><input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-semibold mb-1">Order</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded" /> Featured</label>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded" /> Published</label>
              </div>
            </form>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold">
                {isSaving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
