import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tag, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface PricingPackage {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  pageCount: string;
  description: string;
  features: string;
  cta: string;
  badge: string;
  popular: boolean;
  published: boolean;
  order: number;
}

export default function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', subtitle: '', price: '', pageCount: '', description: '', features: '', cta: 'Start Project', badge: '', popular: false, published: true, order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'pricing'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: PricingPackage[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as PricingPackage));
      setPackages(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (pkg?: PricingPackage) => {
    if (pkg) {
      setEditingId(pkg.id);
      setFormData({
        name: pkg.name, subtitle: pkg.subtitle || '', price: pkg.price, pageCount: pkg.pageCount || '', 
        description: pkg.description || '', features: pkg.features || '', cta: pkg.cta || 'Start Project', 
        badge: pkg.badge || '', popular: pkg.popular || false, published: pkg.published !== false, order: pkg.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', subtitle: '', price: '', pageCount: '', description: '', features: '', cta: 'Start Project', badge: '', popular: false, published: true, order: packages.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'pricing', editingId), formData);
      } else {
        await addDoc(collection(db, 'pricing'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save Pricing Package");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete pricing package "${name}"?`)) {
      await deleteDoc(doc(db, 'pricing', id));
    }
  };

  return (
    <>
      <Helmet><title>Pricing | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="text-modern-blue" /> Pricing Management
            </h1>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus size={18} /><span>Add Package</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : packages.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12">
            <div className="text-center text-gray-500">
              <p className="font-medium text-gray-900 mb-1">No Pricing Packages configured</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className={cn("bg-white border rounded-xl shadow-sm p-6 relative flex flex-col", pkg.popular ? "border-modern-blue ring-1 ring-modern-blue" : "border-gray-200")}>
                {pkg.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-modern-blue text-white text-xs font-bold px-3 py-1 rounded-full">{pkg.badge || 'Most Popular'}</span>}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(pkg)} className="text-gray-400 hover:text-modern-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(pkg.id, pkg.name)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-2xl font-bold text-charcoal mb-4">{pkg.price}</div>
                <div className="text-sm text-gray-500 font-medium mb-4">{pkg.pageCount}</div>
                <div className="text-sm text-gray-600 mb-6">{pkg.description}</div>
                <ul className="text-sm text-gray-700 space-y-2 mb-6 flex-1">
                  {pkg.features.split('\n').filter(Boolean).map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16} /> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Package' : 'New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1.5"><X size={20} /></button>
            </div>
            
            <form className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="৳4,999" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Page Count</label>
                  <input required type="text" value={formData.pageCount} onChange={e => setFormData({...formData, pageCount: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="1 page" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Features (One per line)</label>
                <textarea rows={5} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Badge text (optional)</label>
                  <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} className="rounded" /> Most Popular</label>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded" /> Published</label>
              </div>
            </form>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold">
                {isSaving ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// placeholder for CheckCircle2 import fix, wait, I can just use it since it's missing in my import above? Let me add it.
