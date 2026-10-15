import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DemoItem } from '@/types/demo';
import { checkAndSeedDemos } from '@/lib/seedDemos';
import { mockDemos } from '@/data/mockDemos';

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail: string;
  category: string;
  industry: string;
  featured?: boolean;
  createdAt: string;
}

export type Demo = DemoItem;

export interface Service {
  id: string;
  name: string;
  slug?: string;
  description: string;
  icon?: string;
  image?: string;
  features?: string | string[];
  published?: boolean;
  order?: number;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { projects, loading };
}

export function useDemos() {
  const [demos, setDemos] = useState<Demo[]>(mockDemos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt auto-seed if empty
    checkAndSeedDemos().catch(() => {});

    const q = query(collection(db, 'demos'));
    const unsub = onSnapshot(
      q, 
      (snapshot) => {
        const dms: Demo[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          dms.push({
            id: docSnap.id,
            name: data.name || data.title || 'Untitled Demo',
            title: data.title || data.name || 'Untitled Demo',
            slug: data.slug || docSnap.id,
            category: data.category || 'Business',
            industry: data.industry || data.category || 'General',
            type: data.type || 'Web Application',
            languages: data.languages || ['English'],
            shortDescription: data.shortDescription || data.description || '',
            description: data.description || data.shortDescription || '',
            thumbnail: data.thumbnail || '',
            heroImage: data.heroImage || data.thumbnail || '',
            desktopPreview: data.desktopPreview || data.thumbnail || '',
            tabletPreview: data.tabletPreview || '',
            mobilePreview: data.mobilePreview || '',
            galleryImages: data.galleryImages || [],
            previewVideo: data.previewVideo || '',
            liveUrl: data.liveUrl || data.url || '',
            url: data.url || data.liveUrl || '',
            caseStudyUrl: data.caseStudyUrl || '',
            technologies: data.technologies || [],
            features: data.features || [],
            caseStudy: data.caseStudy || undefined,
            featured: data.featured === true,
            published: data.published !== false,
            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 99,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || undefined,
          } as Demo);
        });

        if (dms.length > 0) {
          dms.sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setDemos(dms);
        } else {
          setDemos(mockDemos);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore demos read error, using studio defaults:', error);
        setDemos(mockDemos);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { demos, loading };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const svcs: Service[] = [];
        snapshot.forEach((doc) => {
          svcs.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(svcs);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { services, loading };
}
