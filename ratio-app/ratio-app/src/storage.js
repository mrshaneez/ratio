/* Real browser storage, presented under the same interface the app expects.
   Judgments are far too large for cookies and awkward in localStorage, so
   IndexedDB does the work, with localStorage as a fallback. */

const DB_NAME = "ratio";
const STORE = "kv";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req ? req.result : undefined);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      })
  );
}

const idb = {
  async get(key) {
    const value = await run("readonly", (s) => s.get(key));
    return value === undefined ? null : { key, value, shared: false };
  },
  async set(key, value) {
    await run("readwrite", (s) => s.put(value, key));
    return { key, value, shared: false };
  },
  async delete(key) {
    await run("readwrite", (s) => s.delete(key));
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const keys = (await run("readonly", (s) => s.getAllKeys())) || [];
    return { keys: keys.map(String).filter((k) => k.startsWith(prefix)), prefix, shared: false };
  },
};

const ls = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { key, value, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
    return { keys, prefix, shared: false };
  },
};

export function installStorage() {
  const backend = typeof indexedDB !== "undefined" ? idb : ls;
  window.storage = {
    get: (key) => backend.get(key),
    set: (key, value) => backend.set(key, value),
    delete: (key) => backend.delete(key),
    list: (prefix) => backend.list(prefix),
  };
}
