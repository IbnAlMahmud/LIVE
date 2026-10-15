import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { mockDemos } from '@/data/mockDemos';

const SEED_VERSION = 1;

export async function checkAndSeedDemos(): Promise<void> {
  try {
    const seedRef = doc(db, 'system', 'demoSeed');
    const seedSnap = await getDoc(seedRef);

    if (seedSnap.exists() && seedSnap.data()?.version >= SEED_VERSION) {
      return;
    }

    // Check if collection already has documents
    const demosSnap = await getDocs(collection(db, 'demos'));
    if (!demosSnap.empty && demosSnap.size >= mockDemos.length) {
      // Mark as seeded without overwriting user custom edits
      await setDoc(seedRef, { version: SEED_VERSION, seededAt: new Date().toISOString() }, { merge: true });
      return;
    }

    // Seed default demos with deterministic doc IDs
    for (const demo of mockDemos) {
      const demoRef = doc(db, 'demos', demo.id);
      const existing = await getDoc(demoRef);
      if (!existing.exists()) {
        await setDoc(demoRef, {
          ...demo,
          createdAt: demo.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    await setDoc(seedRef, { version: SEED_VERSION, seededAt: new Date().toISOString() });
    console.info('[AureviaWeb] Curated studio demos successfully seeded.');
  } catch (err) {
    // If Firestore rules or network restricts seeding (e.g. unauthenticated), fallback gracefully
    console.warn('[AureviaWeb] Demo seeding skipped or offline. Utilizing curated local studio dataset.', err);
  }
}
