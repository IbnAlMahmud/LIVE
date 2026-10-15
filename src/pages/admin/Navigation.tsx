import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, Plus, Edit2, Trash2, X } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  url: string;
  newTab: boolean;
  enabled: boolean;
  order: number;
}

export default function Navigation() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    label: '', url: '', newTab: false, enabled: true, order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'navigation'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const results: NavItem[] = [];
      snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as NavItem));
      setItems(results);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (item?: NavItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        label: item.label, url: item.url, newTab: item.newTab || false, 
        enabled: item.enabled !== false, order: item.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ label: '', url: '/', newTab: false, enabled: true, order: items.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'navigation', editingId), formData);
      } else {
        await addDoc(collection(db, 'navigation'), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save Menu Item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(`Delete menu item "${label}"?`)) {
      await deleteDoc(doc(db, 'navigation', id));
    }
  };

  return (
    <>
      <Helmet><title>Navigation | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Menu className="text-modern-blue" /> Navigation Management
            </h1>
          </div>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus size={18} /><span>Add Menu Item</span>
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : items.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12 text-center text-gray-500">
             <p className="font-medium text-gray-900">No navigation items configured</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold w-16">Order</th>
                  <th className="px-6 py-4 font-semibold">Label</th>
                  <th className="px-6 py-4 font-semibold">URL Path</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-500">{item.order}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.label} {item.newTab && <span className="text-xs text-gray-400 font-normal ml-2 border px-1 rounded">New Tab</span>}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.url}</td>
                    <td className="px-6 py-4">
                      {item.enabled ? <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Enabled</span> : <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Disabled</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-modern-blue"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item.id, item.label)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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
              <h2 className="text-lg font-bold">{editingId ? 'Edit Menu Item' : 'New Menu Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1.5"><X size={20} /></button>
            </div>
            
            <form className="flex-1 overflow-y-auto p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1">Label</label><input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Services" /></div>
              <div><label className="block text-sm font-semibold mb-1">URL / Path</label><input required type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="/services" /></div>
              <div><label className="block text-sm font-semibold mb-1">Order</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              
              <div className="flex gap-4 pt-4">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.newTab} onChange={e => setFormData({...formData, newTab: e.target.checked})} className="rounded" /> Open in New Tab</label>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} className="rounded" /> Enabled</label>
              </div>
            </form>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold">
                {isSaving ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
