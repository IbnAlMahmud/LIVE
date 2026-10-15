import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Save, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { HeroSettings, defaultHeroSettings } from '@/hooks/useHeroSettings';

export default function Homepage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHeroDetails, setShowHeroDetails] = useState(false);
  
  const defaultSections = [
    { id: 'hero', name: 'Hero Banner', enabled: true, title: 'Websites Designed to Stand Out.' },
    { id: 'showcase', name: 'Website Showcase', enabled: true },
    { id: 'services', name: 'Our Services', enabled: true },
    { id: 'projects', name: 'Featured Projects', enabled: true },
    { id: 'solutions', name: 'Industry Solutions', enabled: true },
    { id: 'stats', name: 'Impact Statistics', enabled: true },
    { id: 'process', name: 'Our Process', enabled: true },
    { id: 'testimonials', name: 'Testimonials', enabled: true },
    { id: 'faq', name: 'FAQ', enabled: true },
    { id: 'cta', name: 'Bottom CTA', enabled: true }
  ];

  const [sections, setSections] = useState(defaultSections);
  const [heroConfig, setHeroConfig] = useState<HeroSettings>(defaultHeroSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().sections) {
          setSections(docSnap.data().sections);
        }

        const heroRef = doc(db, 'settings', 'hero');
        const heroSnap = await getDoc(heroRef);
        if (heroSnap.exists()) {
          setHeroConfig({ ...defaultHeroSettings, ...heroSnap.data() });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleTitleChange = (id: string, title: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), { sections });
      await setDoc(doc(db, 'settings', 'hero'), heroConfig);
      alert("Homepage and Hero settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save homepage settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>Homepage Management | Admin</title></Helmet>
      <div className="flex flex-col h-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Layout className="text-fresh-green" /> Homepage Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">Configure homepage sections, order, and ultra-premium Hero content.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-2 bg-fresh-green hover:bg-elegant-green text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-fresh-green rounded-full animate-spin"></div></div>
        ) : (
          <div className="space-y-8">
            {/* Dedicated Ultra-Premium Hero Configuration Panel */}
            <div className="bg-white border border-border-color rounded-2xl shadow-sm overflow-hidden">
              <div 
                onClick={() => setShowHeroDetails(!showHeroDetails)}
                className="flex items-center justify-between p-6 bg-soft-white border-b border-border-color cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-pulse" />
                  <div>
                    <h3 className="font-bold text-text-main text-base flex items-center gap-2">
                      Main Homepage Hero Settings <Sparkles size={14} className="text-fresh-green" />
                    </h3>
                    <p className="text-xs text-text-muted">Edit eyebrow, headline, copy, CTAs, trust indicator, and pricing assurance.</p>
                  </div>
                </div>
                <button type="button" className="text-text-muted hover:text-text-main p-1">
                  {showHeroDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {showHeroDetails && (
                <div className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Eyebrow Pill</label>
                      <input 
                        type="text" 
                        value={heroConfig.eyebrow || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, eyebrow: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="AUREVIAWEB STUDIO"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Pricing Sub-Note</label>
                      <input 
                        type="text" 
                        value={heroConfig.pricingNote || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, pricingNote: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="Websites from ৳4,999 · Fixed Timeline"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Headline (Prefix)</label>
                      <input 
                        type="text" 
                        value={heroConfig.headlineLine1 || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, headlineLine1: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="Websites Designed to"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Headline (Highlighted Words)</label>
                      <input 
                        type="text" 
                        value={heroConfig.headlineHighlight || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, headlineHighlight: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green text-fresh-green font-bold"
                        placeholder="Stand Out."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Supporting Description</label>
                    <textarea 
                      rows={3}
                      value={heroConfig.description || ''}
                      onChange={(e) => setHeroConfig({ ...heroConfig, description: e.target.value })}
                      className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                      placeholder="Professional websites for businesses, brands and entrepreneurs..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Primary CTA Text</label>
                      <input 
                        type="text" 
                        value={heroConfig.primaryCtaText || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, primaryCtaText: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="Start a Project"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Primary CTA Route</label>
                      <input 
                        type="text" 
                        value={heroConfig.primaryCtaLink || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, primaryCtaLink: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="/start-project"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Secondary CTA Text</label>
                      <input 
                        type="text" 
                        value={heroConfig.secondaryCtaText || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, secondaryCtaText: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="Explore Our Work"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Secondary CTA Route</label>
                      <input 
                        type="text" 
                        value={heroConfig.secondaryCtaLink || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, secondaryCtaLink: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="/work"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Trust Text Prefix</label>
                      <input 
                        type="text" 
                        value={heroConfig.trustText || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, trustText: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green"
                        placeholder="Trusted by"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Trust Highlight</label>
                      <input 
                        type="text" 
                        value={heroConfig.trustHighlight || ''}
                        onChange={(e) => setHeroConfig({ ...heroConfig, trustHighlight: e.target.value })}
                        className="w-full px-3.5 py-2 border border-border-color rounded-lg text-sm focus:outline-none focus:border-fresh-green font-bold"
                        placeholder="15+ Visionary Brands"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* General Section Toggles */}
            <div className="bg-white border rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-4 mb-4">Homepage Sections Visibility</h3>
              <div className="space-y-4">
                {sections.map(section => (
                  <div key={section.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4 transition-colors", section.enabled ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-60")}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          id={`toggle-${section.id}`} 
                          checked={section.enabled}
                          onChange={() => handleToggle(section.id)}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                          style={{
                             transform: section.enabled ? 'translateX(100%)' : 'translateX(0)',
                             borderColor: section.enabled ? '#4FAF78' : '#d1d5db',
                             backgroundColor: section.enabled ? '#4FAF78' : '#fff'
                          }}
                        />
                        <label 
                          htmlFor={`toggle-${section.id}`} 
                          className={cn("toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out", section.enabled ? "bg-emerald-100" : "bg-gray-300")}
                        ></label>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{section.name}</h4>
                        {section.id === 'hero' && (
                          <div className="mt-2">
                             <input 
                               type="text" 
                               value={section.title || ''} 
                               onChange={(e) => handleTitleChange(section.id, e.target.value)}
                               placeholder="Hero title"
                               className="w-full sm:w-96 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-fresh-green"
                             />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {section.enabled ? <span className="text-emerald-600 flex items-center gap-1 font-semibold"><CheckCircle2 size={14}/> Visible</span> : 'Hidden'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
