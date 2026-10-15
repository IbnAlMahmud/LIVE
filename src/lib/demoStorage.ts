import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'aurevia_saved_demos';
const COMPARE_KEY = 'aurevia_compare_demos';

export function getSavedDemoIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSavedDemoId(id: string): string[] {
  const current = getSavedDemoIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getSavedDemoIds);

  useEffect(() => {
    const handleStorage = () => setFavorites(getSavedDemoIds());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = toggleSavedDemoId(id);
    setFavorites(updated);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}

export function useCompare() {
  const [comparedIds, setComparedIds] = useState<string[]>(() => {
    try {
      const raw = sessionStorage.getItem(COMPARE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleCompare = (id: string) => {
    setComparedIds(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(i => i !== id);
      } else {
        if (prev.length >= 3) {
          next = [...prev.slice(1), id]; // keep max 3
        } else {
          next = [...prev, id];
        }
      }
      try {
        sessionStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearCompare = () => {
    setComparedIds([]);
    try {
      sessionStorage.removeItem(COMPARE_KEY);
    } catch {}
  };

  const isCompared = (id: string) => comparedIds.includes(id);

  return { comparedIds, toggleCompare, clearCompare, isCompared };
}
