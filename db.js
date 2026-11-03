import { firebaseConfig } from "./firebase-config.js";
export const isDemo = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("PASTE");
export const projectId = firebaseConfig.projectId;
const KEY = "hc-orders-demo", listeners = new Set();
const local = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
const putLocal = a => { localStorage.setItem(KEY, JSON.stringify(a)); listeners.forEach(f => f(a)); };
let fb;
const load = async () => {
  if (fb) return fb;
  const V = "10.12.2", base = `https://www.gstatic.com/firebasejs/${V}/`;
  const [app, fs, au] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js"), import(base + "firebase-auth.js")]);
  const a = app.initializeApp(firebaseConfig);
  fb = { fs, au, db: fs.getFirestore(a), auth: au.getAuth(a) };
  return fb;
};
/* staff login (real Firebase accounts; the demo password is used only in demo mode) */
export async function signIn(email, password) {
  const { au, auth } = await load();
  await au.signInWithEmailAndPassword(auth, email, password);
}
export async function signOutStaff() {
  const { au, auth } = await load();
  await au.signOut(auth);
}
export async function onStaff(cb) {
  const { au, auth } = await load();
  au.onAuthStateChanged(auth, u => cb(u));
}
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
