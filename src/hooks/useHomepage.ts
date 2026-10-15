import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useHomepage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().sections) {
        setSections(docSnap.data().sections);
      } else {
        // Fallback default
        setSections([
          { id: 'hero', enabled: true },
          { id: 'showcase', enabled: true },
          { id: 'services', enabled: true },
          { id: 'projects', enabled: true },
          { id: 'solutions', enabled: true },
          { id: 'stats', enabled: true },
          { id: 'process', enabled: true },
          { id: 'testimonials', enabled: true },
          { id: 'faq', enabled: true },
          { id: 'cta', enabled: true }
        ]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isEnabled = (id: string) => {
    const section = sections.find(s => s.id === id);
    return section ? section.enabled : true;
  };

  const getSection = (id: string) => sections.find(s => s.id === id) || null;

  return { sections, isEnabled, getSection, loading };
}
