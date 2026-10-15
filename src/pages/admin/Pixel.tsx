import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pixel() {
  const [pixelId, setPixelId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchPixel = async () => {
      try {
        const docRef = doc(db, 'settings', 'tracking');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().metaPixelId) {
          setPixelId(docSnap.data().metaPixelId);
        }
      } catch (error) {
        console.error("Error fetching pixel settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPixel();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');
    try {
      await setDoc(doc(db, 'settings', 'tracking'), {
        metaPixelId: pixelId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setStatus('success');
    } catch (error) {
      console.error("Error saving pixel:", error);
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => { if(status === 'success') setStatus('idle'); }, 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Meta Pixel Control | AureviaWeb Admin</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-modern-blue" /> Meta Pixel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your Facebook/Meta Pixel tracking ID for analytics and conversions.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            
            {status === 'success' && (
              <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border border-green-200">
                <CheckCircle2 size={18} className="text-green-600" />
                Pixel ID saved successfully. Changes are now active.
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border border-red-200">
                <AlertCircle size={18} className="text-red-600" />
                Failed to save Pixel ID. Please check permissions.
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Meta Pixel ID</label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm font-medium">
                  ID:
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789012345"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  disabled={loading}
                  className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-modern-blue focus:border-transparent sm:text-sm disabled:opacity-50"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter your numeric Pixel ID. The tracking script will automatically be injected into all public pages.
              </p>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-sm font-bold text-charcoal mb-3 flex items-center gap-2">
                <Activity size={16} className="text-modern-blue" />
                Automatic Event Tracking
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li><strong className="text-gray-900 font-medium">PageView:</strong> Fires automatically on all route changes.</li>
                <li><strong className="text-gray-900 font-medium">Lead:</strong> Fires automatically when the Start Project form is successfully submitted.</li>
                <li><strong className="text-gray-900 font-medium">Contact:</strong> Fires on direct contact form submissions.</li>
              </ul>
            </div>
            
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading || saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy transition-all disabled:opacity-70 shadow-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
