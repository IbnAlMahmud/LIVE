import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroSettings {
  eyebrow?: string;
  headlineLine1?: string;
  headlineHighlight?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  trustText?: string;
  trustHighlight?: string;
  pricingNote?: string;
}

export const defaultHeroSettings: Required<HeroSettings> = {
  eyebrow: 'AUREVIAWEB STUDIO',
  headlineLine1: 'Websites Designed to',
  headlineHighlight: 'Stand Out.',
  description: 'Professional websites for businesses, brands and entrepreneurs — designed with modern UI/UX and built for real-world business needs.',
  primaryCtaText: 'Start a Project',
  primaryCtaLink: '/start-project',
  secondaryCtaText: 'Explore Our Work',
  secondaryCtaLink: '/work',
  trustText: 'Trusted by',
  trustHighlight: '15+ Visionary Brands',
  pricingNote: 'Websites from ৳4,999 · Fixed Timeline',
};

export function useHeroSettings() {
  const [heroSettings, setHeroSettings] = useState<Required<HeroSettings>>(defaultHeroSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'hero');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as HeroSettings;
        setHeroSettings({
          ...defaultHeroSettings,
          ...data,
        });
      }
      setLoading(false);
    }, (err) => {
      console.warn('Hero settings snapshot fallback to defaults:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { heroSettings, loading };
}
