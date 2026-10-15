import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Settings {
  metaPixelId?: string;
  updatedAt?: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as Settings);
      } else {
        setSettings({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { settings, loading };
}
