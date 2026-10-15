import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    brandName: 'AureviaWeb',
    tagline: 'Digital Experiences, Beautifully Built.',
    websiteUrl: 'https://aureviaweb.dev',
    email: 'hello@aureviaweb.dev',
    phone: '+880 1402-884798',
    whatsapp: '+880 1402-884798',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), formData, { merge: true });
      alert('Site settings saved successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>Site Settings | AureviaWeb Admin</title></Helmet>
      <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="text-modern-blue" /> Site Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage global website information and contact details.</p>
          </div>
        </div>
        
        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b pb-2">Brand Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand Name</label>
                    <input type="text" required value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tagline</label>
                    <input type="text" required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website URL</label>
                    <input type="url" required value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                    <input type="text" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-modern-blue text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +880)</p>
                  </div>
                </div>
              </div>
            </div>
                      
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : <Save size={18} />} Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
