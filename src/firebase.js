import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper: ambil data
export async function getData() {
  const ref = doc(db, "website", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Helper: simpan data
export async function saveData(data) {
  const ref = doc(db, "website", "data");
  await setDoc(ref, data);
}
