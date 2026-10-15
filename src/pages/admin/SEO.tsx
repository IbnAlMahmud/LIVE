import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SEO() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    siteTitle: 'AureviaWeb | Premium Digital Studio',
    metaDescription: 'Digital Experiences, Beautifully Built.',
    canonicalUrl: 'https://aureviaweb.dev',
    defaultOgImage: '',
    robots: 'index, follow'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'seo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...formData, ...docSnap.data() });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'seo'), formData, { merge: true });
      alert("SEO settings saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>SEO Management | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="text-modern-blue" /> SEO Management
            </h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-2 bg-charcoal text-white px-6 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm p-8 max-w-3xl">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-4 mb-6">Global SEO Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Global Site Title</label>
                <input type="text" value={formData.siteTitle} onChange={e => setFormData({...formData, siteTitle: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
                <p className="text-xs text-gray-500 mt-1">Appended to page titles (e.g., Home | {formData.siteTitle})</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Global Meta Description</label>
                <textarea rows={3} value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
                <p className="text-xs text-gray-500 mt-1">Default description if a page doesn't have one specified.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Canonical URL</label>
                <input type="url" value={formData.canonicalUrl} onChange={e => setFormData({...formData, canonicalUrl: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Default OpenGraph Image URL</label>
                <input type="url" value={formData.defaultOgImage} onChange={e => setFormData({...formData, defaultOgImage: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
                <p className="text-xs text-gray-500 mt-1">Used when sharing links on social media.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Robots Configuration</label>
                <input type="text" value={formData.robots} onChange={e => setFormData({...formData, robots: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
