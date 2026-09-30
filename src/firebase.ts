import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore (using databaseId if specified in config)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Ensure user is signed in anonymously to satisfy security rules seamlessly
let authInitPromise: Promise<User> | null = null;
export function initAuth(): Promise<User> {
  if (authInitPromise) return authInitPromise;

  authInitPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          resolve(cred.user);
        } catch (err) {
          console.warn('Anonymous auth failed or offline:', err);
          unsubscribe();
          resolve(null as unknown as User);
        }
      }
    });
  });

  return authInitPromise;
}

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline-cache mode.');
    }
  }
}
