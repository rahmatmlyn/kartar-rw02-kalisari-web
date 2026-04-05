import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

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

// Helper: kirim kritik/saran
export async function kirimFeedback({ nama, pesan, kategori }) {
  await addDoc(collection(db, "feedback"), {
    nama: nama || "Anonim",
    pesan,
    kategori,
    timestamp: serverTimestamp(),
  });
}

// Helper: subscribe real-time feedback (returns unsubscribe fn)
export function subscribeFeedback(callback) {
  const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

// Helper: ambil data pengurus dari Google Sheets (CSV)
export async function getPengurus() {
  const url = process.env.REACT_APP_SPREADSHEET_URL;
  if (!url) return null;

  const res = await fetch(url);
  const text = await res.text();
  const rows = text.trim().split("\n").map(r => r.split(",").map(c => c.trim().replace(/^"|"$/g, "")));

  const [header, ...data] = rows;
  const idx = k => header.findIndex(h => h.toLowerCase().includes(k.toLowerCase()));

  const iNoAnggota = idx("no anggota");
  const iNama      = idx("nama");
  const iJabatan   = idx("jabatan");
  const iDivisi    = idx("divisi");
  const iPeriode   = idx("periode");
  const iRT        = idx("rt");
  const iFoto      = idx("foto");
  const iStatus    = idx("status");

  return data
    .filter(r => r[iStatus]?.toLowerCase() !== "nonaktif" && r[iNama])
    .map((r, i) => ({
      id: i + 1,
      noAnggota: r[iNoAnggota] || "",
      nama:      r[iNama]      || "",
      jabatan:   r[iJabatan]   || "",
      divisi:    iDivisi >= 0 ? (r[iDivisi] || "Umum") : "Umum",
      periode:   r[iPeriode]   || "",
      asalRT:    r[iRT]        || "",
      foto:      r[iFoto]      || "",
    }));
}
