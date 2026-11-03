import { firebaseConfig } from "./firebase-config.js";
export const isDemo = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("PASTE");
const KEY = "hc-orders-demo", listeners = new Set();
const local = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
const putLocal = a => { localStorage.setItem(KEY, JSON.stringify(a)); listeners.forEach(f => f(a)); };
let fb;
const load = async () => {
  if (fb) return fb;
  const V = "10.12.2", base = `https://www.gstatic.com/firebasejs/${V}/`;
  const [app, fs] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")]);
  fb = { fs, db: fs.getFirestore(app.initializeApp(firebaseConfig)) };
  return fb;
};
export async function addOrder(o) {
  if (isDemo) { putLocal([{ ...o, id: o.orderNo, createdAt: Date.now() }, ...local()]); return; }
  const { fs, db } = await load();
  await fs.setDoc(fs.doc(db, "orders", o.orderNo), { ...o, createdAt: fs.serverTimestamp() });
}
export async function watchOrders(cb, onError) {
  if (isDemo) { listeners.add(cb); cb(local()); addEventListener("storage", () => cb(local())); return; }
  try {
    const { fs, db } = await load();
    fs.onSnapshot(fs.query(fs.collection(db, "orders"), fs.orderBy("createdAt", "desc")), s => cb(s.docs.map(d => {
      const x = d.data(); return { ...x, id: d.id, createdAt: x.createdAt ? x.createdAt.toMillis() : Date.now() };
    })), onError);
  } catch (e) { onError(e); }
}
export async function setStatus(id, status) {
  if (isDemo) return putLocal(local().map(o => o.id === id ? { ...o, status } : o));
  const { fs, db } = await load();
  await fs.updateDoc(fs.doc(db, "orders", id), { status });
}
