import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Plus, Edit2, Trash2, X } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  features: string;
  published: boolean;
  order: number;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', icon: '', image: '', features: '', published: true, order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: ServiceItem[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as ServiceItem));
      setServices(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (svc?: ServiceItem) => {
    if (svc) {
      setEditingId(svc.id);
      setFormData({
        name: svc.name, slug: svc.slug, description: svc.description, 
        icon: svc.icon || '', image: svc.image || '', features: svc.features || '', 
        published: svc.published !== false, order: svc.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '', description: '', icon: '', image: '', features: '', published: true, order: services.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'services'), dataToSave);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save Service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete service "${name}"?`)) {
      await deleteDoc(doc(db, 'services', id));
    }
  };

  return (
    <>
      <Helmet><title>Services | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="text-modern-blue" /> Services
            </h1>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus size={18} /><span>Add Service</span>
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : services.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12">
            <div className="text-center text-gray-500">
              <p className="font-medium text-gray-900 mb-1">No services configured</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold w-16">Order</th>
                  <th className="px-6 py-4 font-semibold">Service Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-500">{svc.order}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{svc.name}</td>
                    <td className="px-6 py-4">
                      {svc.published ? <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Published</span> : <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Draft</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(svc)} className="p-2 text-gray-400 hover:text-modern-blue"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(svc.id, svc.name)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
              <h2 className="text-lg font-bold">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1.5"><X size={20} /></button>
            </div>
            
            <form className="flex-1 overflow-y-auto p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1">Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold mb-1">Slug</label><input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Auto-generated if empty" /></div>
              <div><label className="block text-sm font-semibold mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold mb-1">Features (One per line)</label><textarea rows={4} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">Icon URL (optional)</label><input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-semibold mb-1">Image URL (optional)</label><input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div><label className="block text-sm font-semibold mb-1">Order</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div className="flex items-center"><label className="flex items-center gap-2 text-sm font-semibold mt-6"><input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded" /> Published</label></div>
              </div>
            </form>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold">
                {isSaving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
