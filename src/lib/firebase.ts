import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "gen-lang-client-0378058471",
  appId: "1:29555189070:web:401ce655ff38ebea2bea1f",
  apiKey: "AIzaSyBxhL_fLZ7CO2LtnCojXMhxJQK38tsV4nM",
  authDomain: "gen-lang-client-0378058471.firebaseapp.com",
  storageBucket: "gen-lang-client-0378058471.firebasestorage.app",
  messagingSenderId: "29555189070"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-9fd7fc44-9ba5-43e6-bedc-da038a916a06");
export const storage = getStorage(app);
