import React, { useState, useEffect, useMemo, useRef } from "react";
import mammoth from "mammoth";
import {
  Upload, Search, BookOpen, Scale, Layers, MessageSquare,
  Trash2, Download, X, Loader2, AlertCircle, Check, Pencil, ChevronLeft,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  Ratio — a private register of your own judgments
 * ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800&family=Public+Sans:wght@300;400;500&family=Noto+Sans+Thaana:wght@300;400;500&family=Noto+Naskh+Arabic:wght@400&display=swap');

.ratio{
  --paper:#15130F; --surface:#1D1A15; --raise:#252118;
  --ink:#F2ECE1; --soft:#A0967F; --line:#332E24;
  --link:#DBA644; --for:#7FA982; --against:#C4644A; --mixed:#DBA644;
  font-family:'Public Sans','Noto Sans Thaana','Noto Naskh Arabic',system-ui,sans-serif;
  font-weight:300; color:var(--ink); background:var(--paper);
  min-height:100vh; -webkit-font-smoothing:antialiased;
}
.ratio *{box-sizing:border-box}
.ratio button{font:inherit;cursor:pointer;color:inherit}
.ratio :focus-visible{outline:2px solid var(--link);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.ratio *{transition:none!important;animation:none!important}}

.page{max-width:720px;margin:0 auto;padding:0 20px 120px}
.disp,.mono{font-variant-numeric:tabular-nums}

.eyebrow{font-family:'Archivo',sans-serif;font-size:10.5px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;color:var(--soft)}

/* masthead + thumb-reach tabs */
.top{display:flex;align-items:baseline;gap:12px;padding:26px 0 18px}
.wordmark{font-family:'Archivo',sans-serif;font-weight:800;font-size:27px;
  letter-spacing:-.035em;margin:0;color:var(--ink)}
.wordmark span{color:var(--link)}
.tagline{font-size:13px;color:var(--soft)}

.tabs{display:flex;gap:4px;background:var(--surface);border:1px solid var(--line);
  border-radius:10px;padding:5px;margin-bottom:30px;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.navlink{flex:1;background:none;border:0;border-radius:7px;padding:10px 12px;
  color:var(--soft);font-size:14px;white-space:nowrap;font-weight:400}
.navlink.on{background:var(--raise);color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
.navlink .ct{font-size:11px;opacity:.65;margin-left:5px}

.head{margin-bottom:26px}
.head h2{font-family:'Archivo',sans-serif;font-weight:800;letter-spacing:-.035em;
  font-size:clamp(30px,8vw,42px);line-height:1.02;margin:10px 0 0}
.head p{margin:12px 0 0;color:var(--soft);font-size:16px;line-height:1.6;max-width:52ch}

/* blocks */
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px}
.pad{padding:18px}
.boxed{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:18px}

.row{display:block;width:100%;text-align:left;background:var(--surface);
  border:1px solid var(--line);border-radius:10px;padding:16px 16px 15px;
  position:relative;overflow:hidden;margin-bottom:10px}
.row:hover{background:var(--raise);border-color:#443D30}
.row .rt{font-size:18.5px;line-height:1.4;margin:0 0 9px;font-weight:400;color:var(--ink)}
.row .rm{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center}
.rowbar{position:absolute;left:0;right:0;top:0;height:3px;width:auto;border-radius:0}
.rowpad{padding-left:16px}
.rtl .rowbar{left:0;right:0}

.tag{font-family:'Archivo',sans-serif;font-size:10.5px;font-weight:600;letter-spacing:.1em;
  text-transform:uppercase;color:var(--soft);border:0;background:none;padding:0;white-space:nowrap}

.btn{font-family:'Archivo',sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.06em;
  text-transform:uppercase;padding:11px 16px;border-radius:8px;border:1px solid transparent;
  background:var(--link);color:#1A1509;display:inline-flex;align-items:center;gap:7px}
.btn:hover{filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.btn.ghost:hover{background:var(--raise);filter:none}
.btn.danger{background:transparent;color:var(--against);border-color:var(--line)}
.btn:disabled{opacity:.35;cursor:not-allowed}

.field{width:100%;font:inherit;font-size:16px;padding:13px;border:1px solid var(--line);
  border-radius:9px;background:var(--paper);color:var(--ink)}
.field:focus{border-color:var(--link);outline:none}
.field::placeholder{color:#6E6759}
textarea.field{resize:vertical;min-height:96px;line-height:1.6}
select.field{font-size:14px;padding:11px}
option{background:var(--surface);color:var(--ink)}

.drop{border:1.5px dashed var(--line);border-radius:14px;background:var(--surface);
  padding:44px 20px;text-align:center}
.drop.hot{border-color:var(--link);background:var(--raise)}

/* sections */
.sec{margin-top:34px}
.sech{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.sech h3{font-family:'Archivo',sans-serif;font-size:11px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--link);margin:0}
.sech::after{content:"";flex:1;height:1px;background:var(--line)}
.prose{font-size:17.5px;line-height:1.85;color:var(--ink);font-weight:300}
.list{margin:0;padding:0;list-style:none}
.list li{display:flex;gap:13px;padding:13px 16px;background:var(--surface);
  border:1px solid var(--line);border-radius:9px;margin-bottom:7px;
  font-size:17px;line-height:1.7;font-weight:300}
.list li .n{font-family:'Archivo',sans-serif;font-size:11px;font-weight:600;color:var(--link);
  padding-top:6px;flex:none;width:20px}
.issue{padding:15px 16px;background:var(--surface);border:1px solid var(--line);
  border-radius:9px;margin-bottom:8px}
.issue .q{font-size:17.5px;margin:0 0 8px;font-weight:400;line-height:1.6}
.issue .a{font-size:16.5px;color:#CFC6B4;margin:0;line-height:1.8;padding-left:13px;
  border-left:2px solid var(--link);font-weight:300}
.rtl .issue .a,.issue.rtl .a{border-left:0;border-right:2px solid var(--link);
  padding-left:0;padding-right:13px}
.fulltext{white-space:pre-wrap;font-size:16.5px;line-height:2.05;color:#DDD5C6;
  font-weight:300;max-height:64vh;overflow:auto}

/* measures */
.bar{display:flex;align-items:center;gap:12px;padding:8px 0}
.bar .lab{width:126px;flex:none;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar .track{flex:1;height:8px;background:var(--surface);border-radius:4px;overflow:hidden}
.bar .fill{display:block;height:8px;border-radius:4px;background:var(--link)}
.bar .val{width:30px;text-align:right;font-family:'Archivo',sans-serif;font-size:12px;
  font-weight:600;color:var(--soft)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px}
.stat .v{font-family:'Archivo',sans-serif;font-size:27px;font-weight:800;letter-spacing:-.03em;
  line-height:1;display:block;color:var(--link)}
.stat .k{margin-top:7px}

.msg{padding:14px 16px;border-radius:10px;font-size:15.5px;line-height:1.6;display:flex;
  gap:11px;align-items:flex-start;background:var(--surface);border:1px solid var(--line);color:var(--soft)}
.msg.err{border-color:#5A3229;color:#E3A794}
.msg.ok{border-color:#3B5540;color:#A8CBAA}
.msg.note{border-color:#5A4826;color:#E5C583}

.foot{margin-top:44px;padding-top:18px;border-top:1px solid var(--line);
  display:flex;gap:18px;align-items:center;flex-wrap:wrap;font-size:13px;color:var(--soft)}
.foot button{background:none;border:0;color:var(--soft);padding:0;font-size:13px}
.foot button:hover{color:var(--link)}

.spin{animation:sp 1s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.fade{animation:fd .3s ease both}
@keyframes fd{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.flexb{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.rtl{direction:rtl;text-align:right}
.rtl .list li{flex-direction:row-reverse}

@media(max-width:640px){
  .page{padding:0 15px 104px}
  .top{padding:20px 0 14px}
  /* the tabs sit where the thumb is */
  .tabs{position:fixed;left:10px;right:10px;bottom:10px;z-index:20;margin:0;
    border-radius:14px;background:rgba(29,26,21,.94);backdrop-filter:blur(12px);
    box-shadow:0 10px 30px -12px #000}
  .navlink{flex:1;padding:11px 6px;font-size:12.5px;text-align:center}
  .navlink .ct{display:none}
  .grid2{grid-template-columns:1fr}
  .bar .lab{width:100px;font-size:14px}
}
`;

/* ---------------------------- storage ---------------------------- *
 * The host's write limit is unknown and its errors are opaque, so we
 * measure the limit at startup, compress, and split values across as
 * many keys as needed. If every size fails we run from memory and say so.
 * ----------------------------------------------------------------- */

const IDX_KEY = "ratio_index_v1";
const docKey = (id) => `ratio_doc_${id}`;
const PROBE = "ratio_probe";
const MARK = "__ratio_chunks__";

const store = {
  chunk: 20000, limit: 0, mem: false, why: "", zip: false,
  data: new Map(), listeners: new Set(), lastError: "",
};
const onStorageChange = (fn) => { store.listeners.add(fn); return () => store.listeners.delete(fn); };
const announce = () => store.listeners.forEach((f) => f({ ...store }));
function goMemory(why) {
  if (store.mem) return;
  store.mem = true;
  store.why = why || "the host refused every write size";
  announce();
}

/* gzip + base64, so a judgment costs roughly a third of its raw size */
async function zipStr(s) {
  if (typeof CompressionStream === "undefined") return null;
  try {
    const stream = new Blob([s]).stream().pipeThrough(new CompressionStream("gzip"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  } catch { return null; }
}
async function unzipStr(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const stream = new Blob([arr]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

async function rawSet(k, v) {
  if (store.mem) { store.data.set(k, v); return; }
  const r = await window.storage.set(k, v, false);
  if (!r) throw new Error("the host returned nothing for that write");
}
async function rawGet(k) {
  if (store.mem) return store.data.has(k) ? store.data.get(k) : null;
  try {
    const r = await window.storage.get(k, false);
    return r && typeof r.value === "string" ? r.value : null;
  } catch { return null; }
}
async function rawDel(k) {
  if (store.mem) { store.data.delete(k); return; }
  try { await window.storage.delete(k, false); } catch {}
}

/* Find the largest value this host will actually accept. */
async function initStorage() {
  if (typeof window === "undefined" || !window.storage) {
    goMemory("this viewer provides no storage");
    return;
  }
  store.zip = typeof CompressionStream !== "undefined";
  for (const n of [400000, 150000, 60000, 20000, 6000, 1500]) {
    try {
      await rawSet(PROBE, "x".repeat(n));
      const back = await rawGet(PROBE);
      if (back && back.length === n) {
        store.limit = n;
        store.chunk = Math.max(1000, Math.floor(n * 0.9));
        await rawDel(PROBE);
        announce();
        return;
      }
      store.lastError = "the host accepted the write but read it back wrong";
    } catch (e) {
      store.lastError = e && e.message ? e.message : String(e);
    }
  }
  goMemory(store.lastError || "the host refused every write size");
}

/* A character is not a byte. Thaana, Arabic, Devanagari and CJK all cost
   more, so every size decision here is made in UTF-8 bytes. */
function charBytes(cp) {
  if (cp < 0x80) return 1;
  if (cp < 0x800) return 2;
  if (cp < 0x10000) return 3;
  return 4;
}
function byteLen(s) {
  let n = 0;
  for (const ch of s) n += charBytes(ch.codePointAt(0));
  return n;
}
function chunkByBytes(s, maxBytes) {
  const parts = [];
  let cur = "", used = 0;
  for (const ch of s) {
    const b = charBytes(ch.codePointAt(0));
    if (used + b > maxBytes && cur) { parts.push(cur); cur = ""; used = 0; }
    cur += ch; used += b;
  }
  if (cur) parts.push(cur);
  return parts.length ? parts : [""];
}

async function readManifest(key) {
  const head = await rawGet(key);
  if (!head) return null;
  try {
    const m = JSON.parse(head);
    return m && typeof m === "object" && MARK in m ? m : null;
  } catch { return null; }
}

async function sset(key, value) {
  let payload = value, zipped = false;
  if (store.zip && byteLen(value) > 2000) {
    const z = await zipStr(value);
    if (z && byteLen(z) < byteLen(value)) { payload = z; zipped = true; }
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    if (store.mem) { store.data.set(key, value); return; }
    const parts = chunkByBytes(payload, store.chunk);
    try {
      const prev = await readManifest(key);
      for (let i = 0; i < parts.length; i++) await rawSet(`${key}_c${i}`, parts[i]);
      await rawSet(key, JSON.stringify({ [MARK]: parts.length, z: zipped }));
      if (prev && prev[MARK] > parts.length) {
        for (let i = parts.length; i < prev[MARK]; i++) await rawDel(`${key}_c${i}`);
      }
      return;
    } catch (e) {
      store.lastError = e && e.message ? e.message : String(e);
      if (store.chunk > 1200) { store.chunk = Math.max(1000, Math.floor(store.chunk / 4)); announce(); continue; }
      goMemory(store.lastError);
      store.data.set(key, value);
      return;
    }
  }
  goMemory(store.lastError || "writes kept failing");
  store.data.set(key, value);
}

async function sget(key) {
  if (store.mem && store.data.has(key)) return store.data.get(key);
  const head = await rawGet(key);
  if (!head) return null;
  const m = await readManifest(key);
  if (!m) return head; /* written before chunking existed */
  let out = "";
  for (let i = 0; i < m[MARK]; i++) {
    const part = await rawGet(`${key}_c${i}`);
    if (part == null) return null;
    out += part;
  }
  if (!m.z) return out;
  try { return await unzipStr(out); } catch { return null; }
}

async function sdel(key) {
  const m = await readManifest(key);
  if (m) for (let i = 0; i < m[MARK]; i++) await rawDel(`${key}_c${i}`);
  await rawDel(key);
  store.data.delete(key);
}

async function loadIndex() {
  const v = await sget(IDX_KEY);
  if (!v) return [];
  let idx;
  try { idx = JSON.parse(v); } catch { return []; }
  if (!Array.isArray(idx)) return [];
  /* Earlier versions marked a locally-read record as unindexed. */
  let changed = false;
  const next = idx.map((e) => {
    const hasRecord = words(e.summary) > 15 || (e.issues || []).length > 0;
    if (e.indexed === false && hasRecord) { changed = true; return { ...e, indexed: true, holdings: false }; }
    if (e.holdings === undefined) { changed = true; return { ...e, holdings: e.indexed !== false }; }
    return e;
  });
  if (changed) { try { await saveIndex(next); } catch {} }
  return next;
}
const saveIndex = (idx) => sset(IDX_KEY, JSON.stringify(idx));

async function loadDoc(id) {
  const v = await sget(docKey(id));
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}
const saveDoc = (d) => sset(docKey(d.id), JSON.stringify(d));
const removeDoc = (id) => { textCache.delete(id); return sdel(docKey(id)); };

/* Full texts are large; hold the ones already read for this session. */
const textCache = new Map();
async function textOf(id) {
  if (textCache.has(id)) return textCache.get(id);
  const d = await loadDoc(id);
  const t = d && typeof d.text === "string" ? d.text : "";
  textCache.set(id, t);
  return t;
}
function snippetAround(text, query, width = 150) {
  const ts = terms(query);
  let at = -1;
  const low = text.toLowerCase();
  for (const t of ts) { const i = low.indexOf(t); if (i >= 0 && (at < 0 || i < at)) at = i; }
  if (at < 0) return "";
  const from = Math.max(0, at - Math.floor(width / 3));
  return (from > 0 ? "… " : "") + text.slice(from, from + width).replace(/\s+/g, " ").trim() + " …";
}

/* ---------------------------- helpers ---------------------------- */

/* Thaana, Arabic, Hebrew and Syriac read right to left. */
const RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0780-\u07BF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const isRTL = (s) => {
  if (!s) return false;
  const m = String(s).match(/[\p{L}]/gu);
  if (!m) return false;
  let rtl = 0;
  for (const c of m) if (RTL_RE.test(c)) rtl++;
  return rtl / m.length > 0.3;
};
const dirOf = (s) => (isRTL(s) ? "rtl" : "ltr");

const STOP = new Set("the a an and or of in to for on by with is are was were be been it its that this as at from not no any all such which who whom whose".split(" "));
/* Keep every script's letters, not just Latin — Thaana, Arabic and
   Devanagari words must be searchable too. */
const terms = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu, " ")
  .split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));
const words = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* The device locale can render months as "M07", so months are named here. */
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_DV = ["ޖަނަވަރީ", "ފެބްރުވަރީ", "މާރިޗު", "އޭޕްރީލް", "މޭ", "ޖޫން", "ޖުލައި",
  "އޮގަސްޓް", "ސެޕްޓެންބަރު", "އޮކްޓޫބަރު", "ނޮވެންބަރު", "ޑިސެންބަރު"];

function fmtDate(d) {
  const dv = recordLang === "source";
  if (!d) return dv ? "ތާރީޚެއް ނެތް" : "undated";
  const m = String(d).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return String(d);
  const month = (dv ? MONTHS_DV : MONTHS_EN)[Number(m[2]) - 1];
  if (!month) return String(d);
  return `${Number(m[3])} ${month} ${m[1]}`;
}
function yearOf(e) {
  const t = Date.parse(e.judgmentDate || "");
  return isNaN(t) ? (e.addedAt ? new Date(e.addedAt).getFullYear() : null) : new Date(t).getFullYear();
}

const OUTCOMES = ["Allowed", "Partly allowed", "Dismissed", "Granted", "Refused", "Convicted", "Acquitted", "Remanded", "Settled", "Other"];
function verdictColor(o) {
  const s = (o || "").toLowerCase();
  if (/partly|remand/.test(s)) return "#DBA644";
  if (/allow|grant|acquit/.test(s)) return "#7FA982";
  if (/dismiss|refus|convict/.test(s)) return "#C4644A";
  return "#A0967F";
}

function blobOf(a) {
  const arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v) => (typeof v === "string" ? v : "");
  return [
    str(a.caseTitle), str(a.caseRef), str(a.forum), str(a.area), str(a.outcome), str(a.outcomeNote),
    arr(a.keyPoints).map(str).join(" "),
    arr(a.issues).map((i) => (typeof i === "string" ? i : `${str(i && i.issue)} ${str(i && i.holding)}`)).join(" "),
    arr(a.authorities).map((x) => (typeof x === "string" ? x : `${str(x && x.citation)} ${str(x && x.point)}`)).join(" "),
    arr(a.statutes).map(str).join(" "),
    arr(a.keywords).map(str).join(" "),
    arr(a.keyHoldings).map((h) => (typeof h === "string" ? h : str(h && h.text))).join(" "),
    str(a.summary), str(a.reasoningNotes),
  ].filter((s) => s && s.trim()).join(" \n ");
}

function scoreEntry(e, q) {
  const ts = terms(q);
  if (!ts.length) return 0;
  const blob = (e.searchBlob || "").toLowerCase();
  const title = (e.caseTitle || "").toLowerCase();
  let s = 0;
  for (const t of ts) {
    if (title.includes(t)) s += 4;
    if (blob.includes(t)) s += 1;
  }
  return s;
}

/* -------------------- reading Word files ------------------------- */

const u16 = (dv, o) => dv.getUint16(o, true);
const u32 = (dv, o) => dv.getUint32(o, true);

async function inflateRaw(buf) {
  if (typeof DecompressionStream === "undefined") throw new Error("This browser can't unpack .docx files. Try Chrome, Edge or Safari 16+.");
  const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/* A .docx is a zip. Read its central directory and pull out the parts we want. */
async function unzip(buf, want) {
  const dv = new DataView(buf);
  const n = buf.byteLength;
  let eocd = -1;
  for (let i = n - 22; i >= Math.max(0, n - 66000); i--) {
    if (u32(dv, i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("This file isn't a readable .docx package — it may be corrupt or renamed.");
  const count = u16(dv, eocd + 10);
  let off = u32(dv, eocd + 16);
  const out = {};
  const dec = new TextDecoder();
  for (let k = 0; k < count; k++) {
    if (off + 46 > n || u32(dv, off) !== 0x02014b50) break;
    const method = u16(dv, off + 10);
    const csize = u32(dv, off + 20);
    const nameLen = u16(dv, off + 28);
    const extraLen = u16(dv, off + 30);
    const cmtLen = u16(dv, off + 32);
    const lho = u32(dv, off + 42);
    const name = dec.decode(new Uint8Array(buf, off + 46, nameLen));
    if (want(name)) {
      const start = lho + 30 + u16(dv, lho + 26) + u16(dv, lho + 28);
      const raw = buf.slice(start, start + csize);
      out[name] = method === 0 ? new Uint8Array(raw) : await inflateRaw(raw);
    }
    off += 46 + nameLen + extraLen + cmtLen;
  }
  return out;
}

function xmlToText(xml) {
  return xml
    .replace(/<w:tab\b[^>]*\/?>/g, "\t")
    .replace(/<w:br\b[^>]*\/?>/g, "\n")
    .replace(/<\/w:p>\s*<\/w:tc>/g, "\t")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<\/w:p>/g, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function docxText(buf) {
  const parts = await unzip(buf, (n) =>
    n === "word/document.xml" || n === "word/footnotes.xml" || n === "word/endnotes.xml");
  const dec = new TextDecoder("utf-8");
  const body = parts["word/document.xml"] ? xmlToText(dec.decode(parts["word/document.xml"])) : "";
  if (!body) throw new Error("No document body found inside that .docx.");
  const notes = ["word/footnotes.xml", "word/endnotes.xml"]
    .map((k) => (parts[k] ? xmlToText(dec.decode(parts[k])) : ""))
    .filter((t) => words(t) > 12).join("\n\n");
  return notes ? `${body}\n\n--- Notes ---\n\n${notes}` : body;
}

/* Legacy .doc is a binary OLE file. Best-effort salvage of the readable runs. */
function legacyDocText(buf) {
  const bytes = new Uint8Array(buf);
  const grab = (enc, min) => {
    let s;
    try { s = new TextDecoder(enc).decode(bytes); } catch { return ""; }
    const runs = s.match(new RegExp(`[\\x20-\\x7E\\u00A0-\\u017F\\r\\n\\t]{${min},}`, "g")) || [];
    return runs
      .filter((r) => !/^[A-Za-z ]{0,40}$/.test(r.trim()))
      .filter((r) => (r.match(/[aeiou]/gi) || []).length / r.length > 0.15)
      .join("\n")
      .replace(/\s{3,}/g, "\n")
      .trim();
  };
  const a = grab("utf-16le", 40);
  const b = grab("windows-1252", 60);
  const best = words(a) >= words(b) ? a : b;
  if (words(best) < 60) throw new Error("This .doc is too old to read here. Open it in Word and use Save As → .docx.");
  return best;
}

/* ------------------------------ API ------------------------------ */

/* ------------------------------ API ------------------------------ *
 * The host caps how much can be sent in one request and reports the
 * refusal generically, so we measure a working size and trim to it.
 * A judgment's head and tail carry the parties, the issues and the
 * operative order, so that is what we keep when trimming.
 * ----------------------------------------------------------------- */

const MODELS = [
  "claude-sonnet-4-6", "claude-sonnet-4-5", "claude-3-7-sonnet-latest",
  "claude-3-5-sonnet-latest", "claude-sonnet-4-20250514", "claude-3-5-haiku-latest",
];
const api = { ceiling: 20000, model: MODELS[0], tested: false, down: false, note: "", trace: [], listeners: new Set() };
const onApiChange = (fn) => { api.listeners.add(fn); return () => api.listeners.delete(fn); };
const announceApi = () => api.listeners.forEach((f) => f({ ...api }));

function squeezeBytes(text, maxBytes) {
  if (byteLen(text) <= maxBytes) return text;
  const headBytes = Math.floor(maxBytes * 0.6);
  const tailBytes = Math.max(500, maxBytes - headBytes - 80);
  const head = chunkByBytes(text, headBytes)[0];
  const parts = chunkByBytes(text, tailBytes);
  return `${head}\n\n[… middle of the judgment omitted for length …]\n\n${parts[parts.length - 1]}`;
}

async function callOnce(content, maxTokens) {
  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: api.model, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
    });
  } catch (e) {
    const err = new Error(e && e.message ? e.message : String(e));
    err.tooBig = true; /* the host refused before answering — usually length */
    throw err;
  }

  const raw = await res.text();
  if (!res.ok) {
    const err = new Error(`Analysis service ${res.status} — ${raw.slice(0, 160)}`);
    err.tooBig = res.status === 413 || res.status === 400 || res.status === 500;
    throw err;
  }
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error(`Unreadable reply — ${raw.slice(0, 160)}`); }
  if (data && data.error) throw new Error(`${data.error.type || "error"}: ${data.error.message || raw.slice(0, 140)}`);

  const blocks = Array.isArray(data && data.content) ? data.content : [];
  const text = blocks.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n").trim();
  if (!text) throw new Error(`No text in the reply — keys: ${Object.keys(data || {}).join(", ") || "none"}`);
  return text;
}

async function askClaude(system, userText, maxTokens = 1000) {
  let budget = Math.min(byteLen(userText), api.ceiling);
  let last;
  for (let attempt = 0; attempt < 6; attempt++) {
    const content = system ? `${system}\n\n---\n\n${squeezeBytes(userText, budget)}` : squeezeBytes(userText, budget);
    try {
      const out = await callOnce(content, maxTokens);
      if (budget < api.ceiling) { api.ceiling = budget; announceApi(); }
      return out;
    } catch (e) {
      last = e;
      if (!e.tooBig || budget <= 1200) break;
      budget = Math.floor(budget / 2);
      api.ceiling = Math.max(1200, budget);
      announceApi();
    }
  }
  throw new Error(last && last.message ? last.message : "the analysis service refused the request");
}

/* Is the service reachable at all — and if so, on which model and how much?
   The host reports every refusal identically, so we test rather than assume. */
async function probeApi() {
  api.trace = [];
  let working = "";
  for (const m of MODELS) {
    api.model = m;
    try {
      const out = await callOnce("Reply with the single word OK and nothing else.", 16);
      if (out) { working = m; api.trace.push(`${m}: answered`); break; }
      api.trace.push(`${m}: empty reply`);
    } catch (e) {
      api.trace.push(`${m}: ${(e && e.message ? e.message : String(e)).slice(0, 90)}`);
    }
  }
  if (!working) {
    api.model = MODELS[0];
    api.tested = true;
    api.note = "no model answered";
    announceApi();
    return { ok: false, error: api.trace.join(" · "), trace: api.trace };
  }

  let limit = 200;
  for (const n of [40000, 20000, 8000, 2000]) {
    const filler = "The court considered the submissions of both parties. ".repeat(Math.ceil(n / 54)).slice(0, n);
    try {
      const out = await callOnce(`Reply with the single word OK and nothing else.\n\n${filler}`, 16);
      if (out) { limit = n; break; }
    } catch { /* try a smaller one */ }
  }
  api.tested = true;
  api.ceiling = Math.max(1200, Math.floor(limit * 0.9));
  api.note = `${working} · about ${Math.round(limit / 1000)}k per request`;
  announceApi();
  return { ok: true, limit, model: working, trace: api.trace };
}


/* Model replies get cut off mid-sentence. Rather than lose the record,
   walk back to the last point that can be legally closed. */
function parseJSON(raw) {
  let t = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = t.indexOf("{");
  if (start > 0) t = t.slice(start);
  try { return JSON.parse(t); } catch {}

  const openStack = (s) => {
    const stack = []; let inStr = false, esc = false;
    for (const c of s) {
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === "{" || c === "[") stack.push(c === "{" ? "}" : "]");
      else if (c === "}" || c === "]") stack.pop();
    }
    return { stack, inStr };
  };

  let cut = t;
  for (let k = 0; k < 25; k++) {
    const { stack, inStr } = openStack(cut);
    if (!inStr && stack.length) {
      const tidy = cut.replace(/[\s,]*$/, "").replace(/,?\s*"[^"]*"\s*:\s*$/, "");
      try { return JSON.parse(tidy + stack.slice().reverse().join("")); } catch {}
    }
    const i = cut.lastIndexOf(",");
    if (i <= 0) break;
    cut = cut.slice(0, i);
  }
  return null;
}

/* --------------------------- the indexer ------------------------- */

const ANALYST_SYSTEM = `You index a judicial officer's own written judgments. You read one judgment and return a structured record of it.

Rules:
- Report only what the judgment itself says. Never invent citations, dates, or holdings.
- If something is absent from the text, use an empty string or an empty array.
- Be terse. This is an index entry, not an essay.
- Return ONLY a JSON object, no prose, no markdown fences.

Schema:
{
 "caseTitle": "parties as given in the judgment",
 "caseRef": "case/appeal/suit number if stated",
 "judgmentDate": "YYYY-MM-DD if stated, else ''",
 "forum": "court or tribunal",
 "area": "one short subject label, e.g. Contract, Bail, Land, Tax, Family, Service",
 "posture": "what was before the court, max 12 words",
 "outcome": "one of: Allowed, Partly allowed, Dismissed, Granted, Refused, Convicted, Acquitted, Remanded, Settled, Other",
 "outcomeNote": "the operative order, max 22 words",
 "summary": "what was decided and why, max 100 words",
 "keyPoints": ["max 5 items, each max 20 words"],
 "issues": [{"issue":"the question framed, max 16 words","holding":"how it was answered, max 30 words"}],
 "authorities": [{"citation":"case or authority as cited","point":"what it was used for, max 10 words"}],
 "statutes": ["provisions cited, max 8"],
 "keywords": ["max 8 single terms for retrieval"],
 "reasoningNotes": "how the reasoning is structured, max 25 words"
}
Cap issues at 4 and authorities at 6, choosing the most load-bearing.

The judgment may be in any language or script — Dhivehi, Arabic, Urdu, Hindi, French and others are all normal here. Read it in its own language. Never refuse a judgment because of its script, and never transliterate the parties' names into a different alphabet.`;

const LANGS = {
  english: `Write the record in English. Keep caseTitle, caseRef, forum, party names, statutes and citations exactly as written in the judgment, in its own script — do not translate or transliterate those.`,
  source: `Write the record in the same language and script as the judgment itself, including the summary, key points, issues and holdings. The "outcome" field is the one exception: it must still be one of the English words listed in the schema, because it drives the filters and the colour coding.`,
};
let recordLang = "source";
const setRecordLang = (v) => { recordLang = v === "source" ? "source" : "english"; };

async function analyseText(text, fileName) {
  if (api.down) throw new Error(api.note || "the analysis service is not answering");
  const base = `${ANALYST_SYSTEM}\n\n${LANGS[recordLang] || LANGS.english}`;
  const ask = (sys, body) => askClaude(sys, `Judgment file: ${fileName}\n\n---\n${body}\n---`, 1000);
  let firstError = "";
  try {
    const a = parseJSON(await ask(base, text));
    if (a && typeof a === "object") return a;
    firstError = "the record came back malformed";
  } catch (e) {
    firstError = e.message;
    /* One unexplained refusal is worth diagnosing once, so later files
       are not each made to wait for the same dead service. */
    if (!api.tested) {
      const r = await probeApi();
      if (!r.ok) { api.down = true; api.note = firstError; announceApi(); throw new Error(firstError); }
    }
  }

  const strict = `${base}\n\nYour reply must begin with { and end with }. No preamble, no code fences. Keep every field short.`;
  const a2 = parseJSON(await ask(strict, text));
  if (a2 && typeof a2 === "object") return a2;
  throw new Error(firstError || "the record came back malformed");
}

/* --------------- reading a judgment without the service ----------- *
 * A judgment's own furniture — the heading block, the case number,
 * the operative sentence — carries a surprising amount. This reads
 * what it can from the text alone, in Dhivehi or in English.
 * ------------------------------------------------------------------ */


/* ------------------ reading a Dhivehi judgment ------------------- *
 * A Maldivian judgment has a fixed anatomy: a heading block, a line
 * of catchwords, "ފަނޑިޔާރު X ގެ ރައުޔު", then titled sections, then
 * the operative sentence. Dhivehi sentences close with އެވެ, so a
 * short line that does not is a heading. That alone yields the
 * outline, the issues and the order without any service.
 * ----------------------------------------------------------------- */

const isThaana = (s) => /[\u0780-\u07BF]/.test(String(s || ""));

/* Common Dhivehi legal furniture — frequent, but says nothing about a case. */
const DV_STOP = new Set(["ކަމަށް", "ކަމުގައި", "ގޮތުގައި", "ފަރާތުން", "ފަރާތަށް", "ފަރާތް",
  "އެހެންކަމުން", "އެހެންނަމަވެސް", "ނަމަވެސް", "ބަޔާންކުރާ", "ބަޔާންކޮށްފައިވާ", "ހުށަހަޅާފައިވާ",
  "މައްސަލައިގައި", "މައްސަލައިގެ", "މައްސަލަ", "ޤަޟިއްޔާގެ", "ޤަޟިއްޔާ", "ކޯޓުގެ", "ކޯޓަށް", "ކޯޓުން",
  "ޝަރީޢަތަށް", "ޝަރީޢަތުގެ", "ދަޢުވާގައި", "ދަޢުވާ", "އޮންނަ", "އެނގެއެވެ", "ވެއެވެ", "ނުވެއެވެ",
  "ކުރުމަށް", "ހުށަހެޅި", "ފާހަގަކުރެވޭ", "ބުނާ", "އެކަން", "މިކަން", "ކަމެއް", "ގޮތެއް"]);

function frequentTerms(text, exclude, limit = 6) {
  const counts = new Map();
  for (const w of terms(text)) {
    if (w.length < 5 || DV_STOP.has(w)) continue;
    if (exclude.some((c) => c.includes(w))) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
}

function dhivehiRead(text) {
  const paras = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const isHeading = (p) => p.length < 80 && !/(އެވެ|ެވެ)\s*[.،]?$/.test(p) && !/^[-–—_=]{5,}/.test(p);

  const benchAt = paras.findIndex((p) => p.includes("ފަނޑިޔާރުންގެ މަޖިލިސް"));
  const bench = [];
  if (benchAt >= 0) {
    for (let i = benchAt + 1; i < Math.min(paras.length, benchAt + 7); i++) {
      if (/^ފަނޑިޔާރު\s/.test(paras[i])) bench.push(paras[i].replace(/^ފަނޑިޔާރު\s+/, "").trim());
      else if (bench.length) break;
    }
  }

  const authorAt = paras.findIndex((p) => /ރައުޔު\s*$/.test(p) && p.length < 90);
  const author = authorAt >= 0
    ? paras[authorAt].replace(/^ފަނޑިޔާރު\s+/, "").replace(/ގެ\s*ރައުޔު\s*$/, "").trim()
    : "";

  /* The catchwords line carries the legal propositions in miniature. */
  let catchwords = [];
  const searchTo = authorAt >= 0 ? authorAt : Math.min(paras.length, 45);
  for (let i = searchTo; i >= 0; i--) {
    const bits = (paras[i] || "").split(/[-–—]/).map((s) => s.trim())
      .filter((s) => s.length > 3 && isThaana(s));
    if (bits.length >= 3) { catchwords = bits.slice(0, 10); break; }
  }

  const body = paras.slice(authorAt >= 0 ? authorAt + 1 : 0);
  const secs = [];
  let cur = { title: "", body: [] };
  for (const p of body) {
    if (isHeading(p)) {
      if (cur.title || cur.body.length) secs.push(cur);
      cur = { title: p.replace(/[:：]\s*$/, ""), body: [] };
    } else cur.body.push(p);
  }
  if (cur.title || cur.body.length) secs.push(cur);

  const titled = secs.filter((s) => s.title && s.body.length);

  /* Holdings live in the reasoning sections, not in the recital of what
     each side said. Dhivehi marks a decision with ކަނޑައަޅ / ދެކެމެވެ /
     ކަނޑައެޅިދާނެ and states a principle with އުސޫލ / މިންގަނޑ. */
  const SKIP_SECTION = /ވާހަކަ|ތަޢާރުފ|ތައާރުފ|އެދޭގޮތް|ނުކުތާ|ނިންމި ގޮތް|އިޖުރާއަތ/;
  const WEIGHTS = [
    [/ކަނޑައަޅ|ކަނޑައެޅ/, 3], [/ދެކެމެވެ|ބުރަވަމެވެ/, 3], [/ކަނޑައެޅިދާނެ/, 3],
    [/ޤަބޫލުކުރެވެ/, 2], [/ޖެހެއެވެ|ނުޖެހެއެވެ/, 2], [/އުސޫލ|އުޞޫލ/, 2],
    [/މިންގަނޑ/, 2], [/ލިބިގެންވެ/, 2], [/ނުވާނެ|ނުބެލެވޭނެ/, 2],
  ];
  const SUBMISSION = /ފާހަގަކުރެއެވެ|ބުނެފައިވެއެވެ|ބުނެއެވެ|ކަމަށެވެ\s*$/;
  const sentencesOf = (p) => p.match(/[\s\S]*?އެވެ[.،]?/g) || [p];

  /* A judgment may carry more than one opinion; a holding belongs to whichever
     judge's ރައުޔު it sits under. */
  let running = author;
  const authorOf = titled.map((s) => {
    const m = s.title.match(/^(?:ފަނޑިޔާރު\s+)?(.+?)ގެ\s*ރައުޔު\s*$/);
    if (m) running = m[1].trim();
    return running;
  });

  const scored = [];
  titled.forEach((s, si) => {
    if (SKIP_SECTION.test(s.title)) return;
    s.body.forEach((p) => {
      sentencesOf(p).forEach((raw) => {
        const sentence = raw.replace(/\s+/g, " ").trim();
        if (sentence.length < 60 || sentence.length > 420) return;
        let score = 0;
        for (const [re, w] of WEIGHTS) if (re.test(sentence)) score += w;
        if (SUBMISSION.test(sentence)) score -= 3;
        if (score > 0) scored.push({ score, order: si, section: s.title, by: authorOf[si], text: sentence });
      });
    });
  });
  const keyHoldings = scored
    .sort((a, b) => b.score - a.score).slice(0, 5)
    .sort((a, b) => a.order - b.order)
    .map(({ section, by, text }) => ({ section, by, text }));
  const find = (re) => titled.find((s) => re.test(s.title));
  const intro = find(/ތަޢާރުފ|ތައާރުފ/) || titled[0];
  const grounds = find(/ނުކުތާ/);
  const operativeRaw = [...body].reverse().find((p) => /ޙުކުމް|ހުކުމް/.test(p) && p.length > 40);
  const operative = operativeRaw ? operativeRaw.replace(/\s+/g, " ") : "";

  /* A headnote reads better than a bare opening paragraph: the facts,
     then what the court below did, then the order. */
  const lower = find(/ދަށުކޯޓުން|ދަށު ކޯޓުން/);
  const summary = [
    intro ? intro.body.join(" ") : "",
    lower ? lower.body[0] : "",
    operative || "",
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").slice(0, 900);

  return {
    bench, author, catchwords, keyHoldings,
    sections: titled.map((s) => s.title).slice(0, 14),
    summary,
    issues: grounds
      ? grounds.body
          .filter((t) => !/އަންނަނިވި|ތިރީގައި/.test(t))
          .slice(0, 4)
          .map((t) => ({ issue: t.replace(/\s+/g, " ").slice(0, 220), holding: "" }))
      : [],
    operative: operative
      ? (operative.length <= 300 ? operative : operative.slice(-300).replace(/^\S*\s/, ""))
      : "",
  };
}

const DV_MONTHS = {
  "ޖަނަވަރީ": 1, "ފެބްރުވަރީ": 2, "މާރިޗު": 3, "މާރޗް": 3, "މާރިޗް": 3,
  "އޭޕްރީލް": 4, "އޭޕްރިލް": 4, "މޭ": 5, "ޖޫން": 6, "ޖުލައި": 7,
  "އޮގަސްޓް": 8, "އޯގަސްޓް": 8, "ސެޕްޓެންބަރު": 9, "ސެޕްޓެމްބަރު": 9,
  "އޮކްޓޫބަރު": 10, "އޮކްޓޯބަރު": 10, "ނޮވެންބަރު": 11, "ނޮވެމްބަރު": 11,
  "ޑިސެންބަރު": 12, "ޑިސެމްބަރު": 12,
};
const EN_MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");

function afterLabel(text, labels, span = 200) {
  for (const l of labels) {
    const i = text.indexOf(l);
    if (i < 0) continue;
    /* The value may sit after a colon, a tab, or a line break — or all three. */
    const rest = text.slice(i + l.length, i + l.length + span).replace(/^[:\s\-–—]+/, "");
    const line = rest.split("\n").map((s) => s.trim()).find(Boolean);
    if (line) return line.replace(/^[:\s\-–—]+/, "").trim();
  }
  return "";
}

function findDate(text, near) {
  let hay = text;
  if (near) {
    const i = text.indexOf(near);
    if (i >= 0) hay = text.slice(i, i + 260);
  }
  let best = null;
  for (const [name, m] of Object.entries(DV_MONTHS)) {
    const hit = hay.match(new RegExp(`(\\d{1,2})\\s*${name}\\s*(\\d{4})`));
    if (hit && (best === null || hit.index < best.index)) {
      best = { index: hit.index, iso: `${hit[2]}-${String(m).padStart(2, "0")}-${String(hit[1]).padStart(2, "0")}` };
    }
  }
  if (best) return best.iso;
  const en = hay.match(/\b(\d{1,2})[\s.\-\/]+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s.,\-\/]+(\d{4})\b/i);
  if (en) {
    const m = EN_MONTHS.indexOf(en[2].toLowerCase()) + 1;
    return `${en[3]}-${String(m).padStart(2, "0")}-${String(en[1]).padStart(2, "0")}`;
  }
  const iso = hay.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  return iso ? iso[0] : "";
}

const DISPOSITIONS = [
  [/ބަދަލު\s*ގެންނަން\s*ޖެހޭ\s*ސަބަބެއް\s*ނެތް|ދަމަހައްޓައި|ތާއީދު\s*ކޮށ/, "Dismissed"],
  [/ބާޠިލު\s*ކޮށ|ބާތިލު\s*ކޮށ|ބާޠިލުކުރ/, "Allowed"],
  [/\bappeal (?:is )?dismissed\b|\bdismiss(?:ed|ing) the appeal\b/i, "Dismissed"],
  [/\bappeal (?:is )?allowed\b|\ballow(?:ed|ing) the appeal\b/i, "Allowed"],
  [/\bpartly allowed\b|\ballowed in part\b/i, "Partly allowed"],
  [/\bacquitt(?:ed|al)\b/i, "Acquitted"],
  [/\bconvicted\b|\bfound guilty\b/i, "Convicted"],
  [/\bpetition (?:is )?dismissed\b|\bapplication (?:is )?refused\b/i, "Refused"],
  [/\bgranted\b/i, "Granted"],
];

function localRecord(text, fileName) {
  const head = text.slice(0, 2600);
  const tail = text.slice(-2600);

  const ref = afterLabel(head, ["ޤަޟިއްޔާ ނަންބަރު", "Case No", "Case Number", "Appeal No"])
    || (head.match(/\b\d{2,4}\/[A-Z]{1,5}[-\/][A-Z0-9]{1,5}\/\d{1,4}\b/) || [""])[0]
    || (head.match(/\b\d{1,4}\/[A-Z0-9]{2,8}\/\d{4}\b/) || [""])[0];

  const firstLine = (head.split("\n").map((s) => s.trim()).find(Boolean) || "").slice(0, 70);
  const forum = /ކޯޓު|court|tribunal|ޓްރައިބިއުނަލ/i.test(firstLine)
    ? firstLine
    : afterLabel(head, ["ނިންމި ތަން", "Court", "Before"]) || firstLine;

  const appellant = afterLabel(head, ["އިސްތިއުނާފުކުރި ފަރާތް", "Appellant", "Plaintiff", "Petitioner"]);
  const respondent = afterLabel(head, ["އިސްތިއުނާފު ރައްދުވި ފަރާތް", "Respondent", "Defendant"]);
  const bothParties = appellant && respondent ? `${appellant} v ${respondent}` : "";

  const lineTitle = text.split("\n").map((l) => l.trim())
    .find((l) => l.length > 6 && l.length < 140 && /\s(v\.?|vs\.?|versus)\s/i.test(l));

  const area = afterLabel(head, ["މައްސަލައިގެ ބާވަތް", "Nature of case", "Subject"]) || "Unclassified";

  let outcome = "Other";
  for (const [re, label] of DISPOSITIONS) {
    if (re.test(tail)) { outcome = label; break; }
  }

  const authorities = [...new Set([
    ...(text.match(/\[\d{4}\]\s*[A-Z]{2,8}\s*(?:\(?[A-Za-z]{1,4}\)?\s*)?\d{1,4}/g) || []),
    ...(text.match(/\(\d{4}\)\s*\d{1,3}\s*[A-Z]{2,6}\s*\d{1,4}/g) || []),
  ])].slice(0, 8).map((c) => ({ citation: c.trim(), point: "" }));

  const dv = isThaana(text) ? dhivehiRead(text) : null;
  const summarySource = text.replace(/\s+/g, " ").trim();

  if (dv) {
    return {
      caseTitle: bothParties || lineTitle || fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim(),
      caseRef: ref.slice(0, 60),
      judgmentDate: findDate(text, "ނިމުނު ތާރީޚް") || findDate(head),
      forum,
      area: area.slice(0, 60),
      posture: "",
      outcome,
      outcomeNote: dv.operative,
      summary: dv.summary || summarySource.slice(0, 320),
      keyPoints: dv.catchwords.slice(0, 6),
      issues: dv.issues,
      authorities,
      statutes: [],
      keywords: dv.catchwords.length >= 3
        ? dv.catchwords.slice(0, 10)
        : frequentTerms(text, [bothParties, forum, area].filter(Boolean), 8),
      reasoningNotes: dv.sections.join(" · "),
      keyHoldings: dv.keyHoldings,
      bench: dv.bench,
      author: dv.author,
      sections: dv.sections,
    };
  }

  return {
    caseTitle: bothParties || lineTitle || fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim(),
    caseRef: ref.slice(0, 60),
    judgmentDate: findDate(text, "ނިމުނު ތާރީޚް") || findDate(head),
    forum,
    area: area.slice(0, 60),
    posture: "",
    outcome,
    outcomeNote: "",
    summary: summarySource.slice(0, 320) + (summarySource.length > 320 ? "…" : ""),
    keyPoints: [],
    issues: [],
    authorities,
    statutes: [],
    keywords: [],
    reasoningNotes: "",
  };
}

function buildEntry(a, meta) {
  const arr = (v) => (Array.isArray(v) ? v : []);
  return {
    id: meta.id,
    caseTitle: a.caseTitle || (meta.fileName || "Untitled").replace(/\.[^.]+$/, ""),
    caseRef: a.caseRef || "",
    judgmentDate: a.judgmentDate || "",
    forum: a.forum || "",
    area: a.area || "Unclassified",
    outcome: a.outcome || "Other",
    outcomeNote: a.outcomeNote || "",
    summary: a.summary || "",
    issues: arr(a.issues).map((i) => (typeof i === "string" ? i : i && i.issue)).filter(Boolean),
    keywords: arr(a.keywords).filter((k) => typeof k === "string"),
    statutes: arr(a.statutes).filter((s) => typeof s === "string"),
    authorities: arr(a.authorities).map((x) => (typeof x === "string" ? x : x && x.citation)).filter(Boolean),
    wordCount: meta.wordCount || 0,
    fileName: meta.fileName || "",
    addedAt: meta.addedAt || new Date().toISOString(),
    truncated: !!meta.truncated,
    indexed: meta.indexed !== false,
    holdings: meta.holdings !== false || arr(a.keyHoldings).length > 0,
    keyHoldings: arr(a.keyHoldings).filter((h) => h && (typeof h === "string" || h.text)),
    indexNote: meta.indexNote || "",
    bench: arr(a.bench).filter((b) => typeof b === "string"),
    author: typeof a.author === "string" ? a.author : "",
    sections: arr(a.sections).filter((s) => typeof s === "string"),
    searchBlob: blobOf(a).slice(0, 6000),
  };
}

/* ------------------------------ atoms ---------------------------- */

const Tag = ({ children, color, kind }) => (
  <span className={`tag ${kind || ""}`} style={color ? { color, borderColor: color } : undefined}>{children}</span>
);

function useApi() {
  const [s, setS] = useState({ ...api });
  useEffect(() => onApiChange(setS), []);
  return s;
}

const ServiceDown = ({ what }) => (
  <Msg kind="note">
    <div>
      The analysis service isn't answering in this viewer, so {what} can't run. Everything local still works —
      the register, filters, full-text search and the counts on Patterns.
      {api.note ? <div className="mono" style={{ fontSize: 12, marginTop: 6, opacity: .8 }}>{api.note}</div> : null}
    </div>
  </Msg>
);

const Section = ({ title, note, children }) => (
  <div className="sec">
    <div className="sech"><h3>{title}</h3>{note && <span className="eyebrow">{note}</span>}</div>
    {children}
  </div>
);

const Msg = ({ kind, children }) => (
  <div className={`msg ${kind}`}><AlertCircle size={16} style={{ flex: "none", marginTop: 2 }} /><div>{children}</div></div>
);

/* ------------------------------ add ------------------------------ */

function AddView({ onSaved, onOpen, count }) {
  const [queue, setQueue] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hot, setHot] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [lang, setLang] = useState(recordLang);
  const [probing, setProbing] = useState(false);
  const [probe, setProbe] = useState("");
  const [pasted, setPasted] = useState("");
  const fileRef = useRef(null);

  /* Decide by what's inside the file, not by its name. */
  async function readFile(file) {
    const buf = await file.arrayBuffer();
    const sig = new Uint8Array(buf.slice(0, 8));
    const isZip = sig[0] === 0x50 && sig[1] === 0x4b;
    const isOle = sig[0] === 0xd0 && sig[1] === 0xcf;
    const isRtf = sig[0] === 0x7b && sig[1] === 0x5c;
    const isPdf = sig[0] === 0x25 && sig[1] === 0x50 && sig[2] === 0x44 && sig[3] === 0x46;

    if (isPdf) throw new Error("That's a PDF. Save it as .docx from Word, or paste the text.");

    if (isZip) {
      try {
        return await docxText(buf);
      } catch (e) {
        try {
          const r = await mammoth.extractRawText({ arrayBuffer: buf.slice(0) });
          if (r && r.value && words(r.value) > 20) return r.value;
        } catch {}
        throw e;
      }
    }

    if (isOle) return legacyDocText(buf);

    if (isRtf) {
      const rtf = new TextDecoder("windows-1252").decode(new Uint8Array(buf));
      const t = rtf.replace(/\{\\\*[^{}]*\}/g, "").replace(/\\par[d]?\b/g, "\n")
        .replace(/\\'([0-9a-f]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
        .replace(/\\[a-z]+-?\d* ?/gi, "").replace(/[{}]/g, "").replace(/\n{3,}/g, "\n\n").trim();
      if (words(t) > 40) return t;
      throw new Error("That .rtf didn't yield readable text. Save it as .docx instead.");
    }

    /* anything else: try plain text */
    const text = new TextDecoder("utf-8").decode(new Uint8Array(buf.slice(0, 2000000)));
    const printable = (text.match(/[\x20-\x7E\n\r\t\u00A0-\u024F]/g) || []).length / Math.max(1, text.length);
    if (printable > 0.85 && words(text) > 40) return new TextDecoder("utf-8").decode(new Uint8Array(buf));
    throw new Error(`Couldn't read ${file.name}. Ratio reads .docx, .doc, .rtf, .txt and .md — or paste the text below.`);
  }

  async function process(files) {
    setErr("");
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    let last = null;
    setQueue(list.map((f) => ({ name: f.name, state: "waiting" })));
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      const mark = (state, note) => setQueue((q) => q.map((x, j) => (j === i ? { ...x, state, note } : x)));
      try {
        mark("reading");
        const text = await readFile(f);
        if (words(text) < 40) throw new Error("Only a few words came out of that file. It may be scanned images rather than text.");
        mark("reading", `${words(text).toLocaleString()} words extracted`);
        const r = await ingest(text, f.name);
        if (r.skipped) { mark("skipped", `Skipped — ${r.skipped}.`); continue; }
        last = r.id;
        const read = [
          `${words(text).toLocaleString()} words`,
          r.entry.caseRef && `no. ${r.entry.caseRef}`,
          r.entry.judgmentDate && fmtDate(r.entry.judgmentDate),
          (r.entry.sections || []).length ? `${r.entry.sections.length} sections` : "",
          (r.entry.bench || []).length ? `${r.entry.bench.length} judges` : "",
        ].filter(Boolean).join(" · ");
        const gotSummary = words(r.entry.summary) > 15;
        const gotIssues = (r.entry.issues || []).length > 0;
        if (!r.note) mark("done", read);
        else if (gotSummary) mark("done", `${read}. Read from the judgment itself${gotIssues ? ", issues included" : ""} — only the reasoned holding for each issue is missing.`);
        else mark("saved", `${read}. Text saved and searchable, but the record could not be read — ${r.note}.`);
      } catch (e) {
        mark("failed", e.message);
      }
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    if (list.length === 1 && last && onOpen) onOpen(last);
  }

  async function ingest(text, fileName) {
    const existing = await loadIndex();
    const dupe = existing.find((e) => e.fileName === fileName && Math.abs((e.wordCount || 0) - words(text)) < 5);
    if (dupe) return { skipped: `already in the register as "${dupe.caseTitle}"` };
    const id = uid();
    let a = null, note = "";
    try {
      a = await analyseText(text, fileName);
    } catch (e) {
      note = e.message;
      a = localRecord(text, fileName);
    }
    const hasRecord = words(a.summary) > 15 || (a.issues || []).length > 0 || (a.keyPoints || []).length > 0;
    const entry = buildEntry(a, {
      id, fileName, wordCount: words(text),
      truncated: byteLen(text) > api.ceiling,
      indexed: hasRecord,      /* is there a record to read? */
      holdings: !note,         /* were the reasoned holdings written? */
      indexNote: note,
    });
    await saveDoc({ id, text, analysis: a, fileName });
    const idx = await loadIndex();
    idx.unshift(entry);
    await saveIndex(idx);
    onSaved(idx);
    return { id, note, entry };
  }

  async function savePasted() {
    if (words(pasted) < 60) { setErr("Paste the full text of the judgment — that looks too short to index."); return; }
    setBusy(true); setErr("");
    setQueue([{ name: "Pasted text", state: "analysing" }]);
    try {
      const r = await ingest(pasted, "Pasted text");
      setQueue([{ name: "Pasted text", state: r.skipped ? "skipped" : "done", note: r.skipped || "" }]);
      setPasted(""); setPasteMode(false);
    } catch (e) {
      setQueue([{ name: "Pasted text", state: "failed", note: e.message }]);
    }
    setBusy(false);
  }

  return (
    <div className="fade">
      <div className="head">
        <span className="eyebrow">Add to the register</span>
        <h2>Bring in a judgment</h2>
        <p>Word files are read here in your browser, then indexed: parties, issues, holdings, authorities and disposition.</p>
      </div>

      <div className="flexb" style={{ marginBottom: 14 }}>
        <span className="eyebrow">Write the record in</span>
        <button className={`btn ${lang === "english" ? "" : "ghost"}`}
          onClick={() => { setLang("english"); setRecordLang("english"); }}>English</button>
        <button className={`btn ${lang === "source" ? "" : "ghost"}`}
          onClick={() => { setLang("source"); setRecordLang("source"); }}>The judgment's own language</button>
        <button className="btn ghost" style={{ marginLeft: "auto" }} disabled={probing}
          onClick={async () => {
            setProbing(true); setProbe("");
            const r = await probeApi();
            setProbe(r.ok
              ? `Working on ${r.model} — it accepts about ${Math.round(r.limit / 1000)}k per request. Open any unindexed judgment and press "Index again".`
              : `No model answered. Judgments are still saved, readable and searchable — only the summary and issues need indexing elsewhere.\n\n${(r.trace || []).join("\n")}`);
            setProbing(false);
          }}>
          {probing ? <Loader2 size={13} className="spin" /> : null} Check the service
        </button>
      </div>
      {probe && <div style={{ marginBottom: 14 }}><Msg kind={probe.startsWith("Working on") ? "ok" : "err"}><span style={{ whiteSpace: "pre-wrap" }}>{probe}</span></Msg></div>}

      <div className={`drop ${hot ? "hot" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setHot(true); }}
        onDragLeave={() => setHot(false)}
        onDrop={(e) => { e.preventDefault(); setHot(false); process(e.dataTransfer.files); }}>
        <Upload size={24} color="#DBA644" />
        <p style={{ fontSize: 22, margin: "14px 0 5px", fontWeight: 400 }}>Drop Word files here</p>
        <p style={{ color: "var(--soft)", margin: "0 0 20px", fontSize: 16 }}>.docx, .doc, .rtf, .txt or .md · several at once is fine</p>
        <div className="flexb" style={{ justifyContent: "center" }}>
          <button className="btn" disabled={busy} onClick={() => fileRef.current && fileRef.current.click()}>
            {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} Choose files
          </button>
          <button className="btn ghost" disabled={busy} onClick={() => setPasteMode((v) => !v)}>Paste text instead</button>
        </div>
        <input ref={fileRef} type="file" multiple accept=".docx,.doc,.rtf,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain" style={{ display: "none" }}
          onChange={(e) => process(e.target.files)} />
      </div>

      {pasteMode && (
        <div className="boxed" style={{ marginTop: 16 }}>
          <span className="eyebrow">Paste the judgment</span>
          <textarea className="field" style={{ marginTop: 8, minHeight: 200 }} value={pasted}
            onChange={(e) => setPasted(e.target.value)} placeholder="Paste the full text…" />
          <div className="flexb" style={{ marginTop: 10 }}>
            <button className="btn" disabled={busy} onClick={savePasted}>Index this</button>
            <span className="eyebrow">{words(pasted).toLocaleString()} words</span>
          </div>
        </div>
      )}

      {err && <div style={{ marginTop: 14 }}><Msg kind="err">{err}</Msg></div>}

      {queue.length > 0 && (
        <div style={{ marginTop: 22 }}>
          {queue.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px 18px", borderBottom: i < queue.length - 1 ? "1px solid var(--line)" : "0" }}>
              <div style={{ flex: "none", width: 18 }}>
                {q.state === "done" ? <Check size={15} color="#7FA982" />
                  : q.state === "skipped" ? <X size={15} color="#A0967F" />
                  : q.state === "saved" ? <AlertCircle size={15} color="#DBA644" />
                    : q.state === "failed" ? <X size={15} color="#C4644A" />
                      : <Loader2 size={15} className="spin" color="#DBA644" />}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.name}</div>
                {q.note && <div style={{ fontSize: 14, color: "var(--soft)", marginTop: 3, lineHeight: 1.4 }}>{q.note}</div>}
              </div>
              <span className="eyebrow">{q.state}</span>
            </div>
          ))}
        </div>
      )}

      {count === 0 && !queue.length && (
        <p style={{ color: "var(--soft)", fontSize: 15, marginTop: 20, lineHeight: 1.6 }}>
          Everything you add stays in this app's own storage, tied to your account. Nothing is published or shared.
          Text is sent for analysis only at the moment you add a file.
        </p>
      )}
    </div>
  );
}

/* ---------------------------- register --------------------------- */

function Register({ index, onOpen, query, setQuery }) {
  const [area, setArea] = useState("");
  const [outcome, setOutcome] = useState("");
  const [year, setYear] = useState("");
  const [deep, setDeep] = useState(false);
  const [deepHits, setDeepHits] = useState(null);
  const [scanning, setScanning] = useState(0);

  /* Reading every judgment is slow, so it only happens when asked for. */
  useEffect(() => {
    let live = true;
    if (!deep || !query.trim()) { setDeepHits(null); return; }
    (async () => {
      const ts = terms(query);
      const hits = new Map();
      for (let i = 0; i < index.length; i++) {
        if (!live) return;
        setScanning(i + 1);
        const t = await textOf(index[i].id);
        const low = t.toLowerCase();
        if (ts.some((x) => low.includes(x))) hits.set(index[i].id, snippetAround(t, query));
      }
      if (live) { setDeepHits(hits); setScanning(0); }
    })();
    return () => { live = false; };
  }, [deep, query, index]);

  const areas = useMemo(() => [...new Set(index.map((e) => e.area).filter(Boolean))].sort(), [index]);
  const years = useMemo(() => [...new Set(index.map(yearOf).filter(Boolean))].sort((a, b) => b - a), [index]);

  const rows = useMemo(() => {
    let r = index.filter((e) =>
      (!area || e.area === area) && (!outcome || e.outcome === outcome) && (!year || String(yearOf(e)) === year));
    if (query.trim()) {
      r = r.map((e) => ({ e, s: scoreEntry(e, query) + (deepHits && deepHits.has(e.id) ? 2 : 0) }))
        .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.e);
    } else {
      r = r.sort((a, b) => (b.judgmentDate || b.addedAt || "").localeCompare(a.judgmentDate || a.addedAt || ""));
    }
    return r;
  }, [index, area, outcome, year, query, deepHits]);

  if (!index.length) {
    return (
      <div className="fade">
        <div className="head">
          <span className="eyebrow">The register</span>
          <h2>Nothing on the shelf yet</h2>
          <p>Add your first judgment and it becomes searchable, comparable and countable alongside everything that follows.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade">
      <div className="head">
        <span className="eyebrow">The register · {index.length} judgment{index.length === 1 ? "" : "s"}</span>
        <h2>Your own case law</h2>
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={17} color="#6E6759" style={{ position: "absolute", left: 14, top: 15 }} />
        <input className="field" style={{ paddingLeft: 42 }} value={query} onChange={(e) => setQuery(e.target.value)}
          dir="auto" placeholder="Search titles, issues, holdings, authorities…" />
      </div>

      <div className="flexb" style={{ marginBottom: 18 }}>
        <select className="field" style={{ width: "auto" }} value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">All subjects</option>{areas.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select className="field" style={{ width: "auto" }} value={outcome} onChange={(e) => setOutcome(e.target.value)}>
          <option value="">Any disposition</option>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className="field" style={{ width: "auto" }} value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>{years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <button className={`btn ${deep ? "" : "ghost"}`} onClick={() => setDeep((v) => !v)}>
          {scanning ? <Loader2 size={13} className="spin" /> : null} Search full texts
        </button>
        {(area || outcome || year || query) && (
          <button className="btn ghost" onClick={() => { setArea(""); setOutcome(""); setYear(""); setQuery(""); }}>Clear</button>
        )}
        <span className="eyebrow" style={{ marginLeft: "auto" }}>
          {scanning ? `reading ${scanning} of ${index.length}` : `${rows.length} shown`}
        </span>
      </div>

      {rows.length === 0 ? (
        <div><p style={{ margin: 0, fontSize: 17 }}>No judgment matches that. Try a broader term, or clear the filters.</p></div>
      ) : (
        <div>
          {rows.map((e) => (
            <button key={e.id} className={`row rowpad ${isRTL(e.caseTitle) ? "rtl" : ""}`} dir={dirOf(e.caseTitle)} onClick={() => onOpen(e.id)}>
              <span className="rowbar" style={{ background: verdictColor(e.outcome) }} />
              <p className="rt">{e.caseTitle}</p>
              <div className="rm">
                <Tag color={verdictColor(e.outcome)} kind="v">{e.outcome || "—"}</Tag>
                <Tag>{e.area}</Tag>
                {e.holdings === false && <Tag color="var(--soft)">no holdings</Tag>}
                <span className="eyebrow">{fmtDate(e.judgmentDate)}</span>
                {e.forum && <span className="eyebrow">· {e.forum}</span>}
              </div>
              {deepHits && deepHits.get(e.id) ? (
                <p dir={dirOf(deepHits.get(e.id))} style={{ margin: "9px 0 0", fontSize: 16, lineHeight: 1.6, borderLeft: "2px solid var(--link)", paddingLeft: 11, color: "#CFC6B4" }}>
                  {deepHits.get(e.id)}</p>
              ) : e.summary ? (
                <p dir={dirOf(e.summary)} style={{ margin: "9px 0 0", color: "var(--soft)", fontSize: 15.5, lineHeight: 1.65 }}>
                  {e.summary.slice(0, 170)}{e.summary.length > 170 ? "…" : ""}</p>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- one case -------------------------- */

function CaseView({ id, index, onBack, onChanged }) {
  const [doc, setDoc] = useState(null);
  const [tab, setTab] = useState("record");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [err, setErr] = useState("");
  const [redoing, setRedoing] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [recordText, setRecordText] = useState("");
  const entry = index.find((e) => e.id === id);

  useEffect(() => {
    let live = true;
    setDoc(null); setTab("record"); setEditing(false);
    loadDoc(id).then((d) => { if (live) setDoc(d); }).catch(() => setErr("That judgment's text could not be opened."));
    return () => { live = false; };
  }, [id]);

  if (!entry) return null;
  const a = (doc && doc.analysis) || {};

  const related = index.filter((o) => o.id !== id &&
    (o.area === entry.area || (o.issues || []).some((i) => (entry.issues || []).some((j) => terms(i).some((t) => terms(j).includes(t))))))
    .slice(0, 5);

  async function commit() {
    const idx = await loadIndex();
    const next = idx.map((e) => (e.id === id ? { ...e, ...draft } : e));
    await saveIndex(next);
    const d = await loadDoc(id);
    if (d) { d.analysis = { ...d.analysis, ...draft }; await saveDoc(d); setDoc(d); }
    onChanged(next); setEditing(false);
  }
  /* A record can also come from anywhere else — a chat, a colleague, a script. */
  async function applyPasted() {
    const a = parseJSON(recordText);
    if (!a || typeof a !== "object") { setErr("That isn't a readable record. It should be a JSON object starting with {."); return; }
    const next = (await loadIndex()).map((e) => (e.id === id
      ? buildEntry(a, { id, fileName: e.fileName, wordCount: e.wordCount, truncated: e.truncated, addedAt: e.addedAt, indexed: true })
      : e));
    await saveIndex(next);
    if (doc) { const d = { ...doc, analysis: a }; await saveDoc(d); setDoc(d); }
    onChanged(next);
    setPasting(false); setRecordText(""); setErr("");
  }

  async function copyForIndexing() {
    if (!doc) return;
    const payload = `${ANALYST_SYSTEM}\n\n${LANGS[recordLang] || LANGS.english}\n\n---\n${squeezeBytes(doc.text, 60000)}\n---`;
    try {
      await navigator.clipboard.writeText(payload);
      setErr("Copied. Paste it into a Claude chat, then paste the JSON reply back here.");
    } catch {
      setErr("Copying isn't allowed here — open the Full text tab and copy the judgment manually.");
    }
  }

  async function reindex() {
    if (!doc) return;
    setRedoing(true); setErr("");
    try {
      const a = await analyseText(doc.text, doc.fileName || entry.caseTitle);
      const next = (await loadIndex()).map((e) => (e.id === id
        ? buildEntry(a, { id, fileName: e.fileName, wordCount: e.wordCount, truncated: e.truncated, addedAt: e.addedAt, indexed: true })
        : e));
      await saveIndex(next);
      const d = { ...doc, analysis: a };
      await saveDoc(d); setDoc(d);
      onChanged(next);
    } catch (e) { setErr(e.message); }
    setRedoing(false);
  }

  async function destroy() {
    const idx = (await loadIndex()).filter((e) => e.id !== id);
    await saveIndex(idx); await removeDoc(id); onChanged(idx); onBack();
  }

  return (
    <div className="fade">
      <button className="btn ghost" onClick={onBack} style={{ marginBottom: 18 }}><ChevronLeft size={14} /> Register</button>

      <div className="head">
        <div className="flexb" style={{ marginBottom: 10 }}>
          <Tag color={verdictColor(entry.outcome)} kind="v">{entry.outcome}</Tag>
          <Tag>{entry.area}</Tag>
          {entry.caseRef && <span className="eyebrow">{entry.caseRef}</span>}
        </div>
        <h2 style={{ marginTop: 0, fontFamily: isRTL(entry.caseTitle) ? undefined : "'Archivo',sans-serif",
          fontSize: isRTL(entry.caseTitle) ? "clamp(23px,5.6vw,30px)" : undefined,
          fontWeight: isRTL(entry.caseTitle) ? 400 : 800, lineHeight: isRTL(entry.caseTitle) ? 1.5 : 1.05 }}
          dir={dirOf(entry.caseTitle)}>{entry.caseTitle}</h2>
        <p className="mono eyebrow" style={{ marginTop: 12, letterSpacing: ".08em" }}>
          {fmtDate(entry.judgmentDate)}{entry.forum ? ` · ${entry.forum}` : ""} · {(entry.wordCount || 0).toLocaleString()} words
        </p>
        {entry.outcomeNote && <p dir={dirOf(entry.outcomeNote)} style={{ marginTop: 16, fontSize: 17.5, lineHeight: 1.75, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px", [isRTL(entry.outcomeNote) ? "borderRight" : "borderLeft"]: `3px solid ${verdictColor(entry.outcome)}`, [isRTL(entry.outcomeNote) ? "paddingRight" : "paddingLeft"]: 14 }}>{entry.outcomeNote}</p>}
      </div>

      <div className="flexb" style={{ marginBottom: 6 }}>
        <button className={`btn ${tab === "record" ? "" : "ghost"}`} onClick={() => setTab("record")}>The record</button>
        <button className={`btn ${tab === "text" ? "" : "ghost"}`} onClick={() => setTab("text")}>Full text</button>
        <button className="btn ghost" onClick={() => { setDraft({ caseTitle: entry.caseTitle, judgmentDate: entry.judgmentDate, forum: entry.forum, area: entry.area, outcome: entry.outcome }); setEditing(true); }}>
          <Pencil size={13} /> Correct
        </button>
      </div>

      {(entry.indexed === false || entry.holdings === false) && (
        <div style={{ marginTop: 12 }}>
          <Msg kind="note">
            <div>
              <strong style={{ fontWeight: 500 }}>
                {entry.indexed === false ? "Not indexed." : "Read from the judgment itself."}
              </strong>{" "}
              {entry.indexed === false
                ? "The full text is below and searchable, but no record could be read from it."
                : "The record below was taken from the judgment's own structure. Only the reasoned holding against each issue is missing."}
              {entry.indexNote && <div className="mono" style={{ fontSize: 12, marginTop: 6, opacity: .8 }}>{entry.indexNote}</div>}
              <div style={{ marginTop: 10 }} className="flexb">
                <button className="btn" onClick={reindex} disabled={redoing || !doc}>
                  {redoing ? <Loader2 size={13} className="spin" /> : <Layers size={13} />} {redoing ? "Indexing" : "Index again"}
                </button>
                <button className="btn ghost" onClick={() => setPasting((v) => !v)}>Paste a record</button>
              </div>
              {pasting && (
                <div style={{ marginTop: 12 }}>
                  <textarea className="field" style={{ minHeight: 120 }} value={recordText}
                    onChange={(e) => setRecordText(e.target.value)}
                    placeholder='Paste the JSON record here — {"caseTitle": …, "summary": …, "issues": […]}' />
                  <div className="flexb" style={{ marginTop: 8 }}>
                    <button className="btn" onClick={applyPasted} disabled={!recordText.trim()}>Apply record</button>
                    <button className="btn ghost" onClick={copyForIndexing}>Copy judgment + instructions</button>
                  </div>
                </div>
              )}
            </div>
          </Msg>
        </div>
      )}
      {entry.truncated && <div style={{ marginTop: 12 }}><Msg kind="note">This judgment was longer than one request allows, so indexing read its opening and its closing passages — where the parties, issues and the order sit. The full text below is complete.</Msg></div>}
      {err && <div style={{ marginTop: 12 }}><Msg kind="err">{err}</Msg></div>}

      {editing && (
        <div className="boxed" style={{ marginTop: 16 }}>
          <span className="eyebrow">Correct the details</span>
          <div className="grid2" style={{ marginTop: 10 }}>
            <input className="field" value={draft.caseTitle || ""} onChange={(e) => setDraft({ ...draft, caseTitle: e.target.value })} placeholder="Case title" />
            <input className="field" value={draft.forum || ""} onChange={(e) => setDraft({ ...draft, forum: e.target.value })} placeholder="Court or tribunal" />
            <input className="field" type="date" value={draft.judgmentDate || ""} onChange={(e) => setDraft({ ...draft, judgmentDate: e.target.value })} />
            <input className="field" value={draft.area || ""} onChange={(e) => setDraft({ ...draft, area: e.target.value })} placeholder="Subject" />
            <select className="field" value={draft.outcome || ""} onChange={(e) => setDraft({ ...draft, outcome: e.target.value })}>
              {OUTCOMES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flexb" style={{ marginTop: 12 }}>
            <button className="btn" onClick={commit}>Save changes</button>
            <button className="btn ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn danger" style={{ marginLeft: "auto" }}
              onClick={() => { if (window.confirm("Remove this judgment from the register? This cannot be undone.")) destroy(); }}>
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      )}

      {!doc && <p style={{ color: "var(--soft)", marginTop: 24 }}><Loader2 size={15} className="spin" /> Opening…</p>}

      {doc && tab === "record" && (
        <>
          {a.summary && <Section title="Summary"><p className="prose" style={{ margin: 0 }} dir={dirOf(a.summary)}>{a.summary}</p></Section>}

          {(a.keyPoints || []).length > 0 && (
            <Section title="Key points">
              <ul className={`list ${isRTL(a.keyPoints.join(" ")) ? "rtl" : ""}`}>{a.keyPoints.map((k, i) => <li key={i} dir={dirOf(k)}><span className="n mono">{String(i + 1).padStart(2, "0")}</span><span>{k}</span></li>)}</ul>
            </Section>
          )}

          {(a.issues || []).length > 0 && (
            <Section title="Issues and holdings" note={`${a.issues.length} framed`}>
              {a.issues.map((it, i) => (
                <div className={`issue ${isRTL(it.issue) ? "rtl" : ""}`} key={i} dir={dirOf(it.issue)}>
                  <p className="q">{it.issue}</p>
                  {it.holding && <p className="a">{it.holding}</p>}
                </div>
              ))}
            </Section>
          )}

          {(a.keyHoldings || []).length > 0 && (
            <Section title="Key holdings" note={`${a.keyHoldings.length}`}>
              {a.keyHoldings.map((h, i) => {
                const body = typeof h === "string" ? h : h.text;
                const where = typeof h === "string" ? "" : h.section;
                return (
                  <div className={`issue ${isRTL(body) ? "rtl" : ""}`} key={i} dir={dirOf(body)}>
                    {where && (
                      <div className="eyebrow" style={{ marginBottom: 6 }}>
                        {where}{h.by ? ` · ${h.by}` : ""}
                      </div>
                    )}
                    <p className="a" style={{ fontSize: 17.5 }}>{body}</p>
                  </div>
                );
              })}
            </Section>
          )}

          {(a.authorities || []).length > 0 && (
            <Section title="Authorities relied on">
              <ul className="list">{a.authorities.map((x, i) => (
                <li key={i}><span className="n mono">§</span><span><strong style={{ fontWeight: 500 }}>{x.citation}</strong>
                  {x.point && <span style={{ color: "var(--soft)" }}> — {x.point}</span>}</span></li>
              ))}</ul>
            </Section>
          )}

          {(a.statutes || []).length > 0 && (
            <Section title="Provisions"><div className="flexb">{a.statutes.map((s, i) => <Tag key={i}>{s}</Tag>)}</div></Section>
          )}

          {(entry.sections || []).length > 0 && (
            <Section title="Outline" note={`${entry.sections.length} parts`}>
              <ul className={`list ${isRTL(entry.sections[0]) ? "rtl" : ""}`}>
                {entry.sections.map((s, i) => (
                  <li key={i} dir={dirOf(s)}><span className="n mono">{String(i + 1).padStart(2, "0")}</span><span>{s}</span></li>
                ))}
              </ul>
            </Section>
          )}

          {(entry.bench || []).length > 0 && (
            <Section title="Bench" note={entry.author ? "opinion written by the marked judge" : ""}>
              <div className="flexb">
                {entry.bench.map((b, i) => (
                  <span key={i} className="tag" dir={dirOf(b)}
                    style={b === entry.author ? { borderColor: "var(--soft)", color: "var(--soft)" } : undefined}>
                    {b}{b === entry.author ? " ✦" : ""}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {a.reasoningNotes && !((entry.sections || []).length) && (
            <Section title="Shape of the reasoning"><p className="prose" dir={dirOf(a.reasoningNotes)} style={{ margin: 0 }}>{a.reasoningNotes}</p></Section>
          )}

          {related.length > 0 && (
            <Section title="Nearby in your own work" note="same subject or overlapping issue">
              <div>
                {related.map((r) => (
                  <button key={r.id} className="row rowpad" onClick={() => onChanged(index, r.id)}>
                    <span className="rowbar" style={{ background: verdictColor(r.outcome) }} />
                    <p className="rt" style={{ fontSize: 17 }}>{r.caseTitle}</p>
                    <div className="rm"><Tag color={verdictColor(r.outcome)} kind="v">{r.outcome}</Tag>
                      <span className="eyebrow">{fmtDate(r.judgmentDate)}</span></div>
                  </button>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {doc && tab === "text" && (
        <Section title="Full text" note={doc.fileName}>
          <div><div className="fulltext" dir={dirOf(doc.text)} style={{ textAlign: isRTL(doc.text) ? "right" : "left" }}>{doc.text}</div></div>
        </Section>
      )}
    </div>
  );
}

/* ------------------------------- ask ----------------------------- */

function AskView({ index }) {
  const svc = useApi();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [thread, setThread] = useState([]);
  const [err, setErr] = useState("");

  async function run() {
    if (!q.trim() || !index.length) return;
    setBusy(true); setErr("");
    const question = q; setQ("");
    try {
      const ranked = index.map((e) => ({ e, s: scoreEntry(e, question) }))
        .sort((a, b) => b.s - a.s);
      const picked = (ranked[0] && ranked[0].s > 0 ? ranked.filter((x) => x.s > 0) : ranked).slice(0, 4).map((x) => x.e);
      const parts = [];
      for (const e of picked) {
        const d = await loadDoc(e.id);
        const body = d ? squeezeBytes(d.text, 3500) : "";
        parts.push(`### ${e.caseTitle} (${fmtDate(e.judgmentDate)}, ${e.forum || "forum not stated"})\nDisposition: ${e.outcome} — ${e.outcomeNote}\nSummary: ${e.summary}\nIssues: ${(e.issues || []).join("; ")}\nExtract of the judgment:\n${body}`);
      }
      const sys = `You answer questions about a judicial officer's own past judgments, using only the extracts supplied.
- Ground every statement in the supplied judgments and name the case in square brackets, e.g. [Ali v State].
- If the extracts do not answer the question, say plainly what is missing rather than reasoning from general law.
- Write in continuous prose, under 220 words, no headings.`;
      const ans = await askClaude(sys, `Question: ${question}\n\nJudgments available:\n\n${parts.join("\n\n")}`, 1000);
      setThread((t) => [...t, { q: question, a: ans, used: picked.map((p) => p.caseTitle) }]);
    } catch (e) { setErr(e.message); setQ(question); }
    setBusy(false);
  }

  return (
    <div className="fade">
      <div className="head">
        <span className="eyebrow">Ask</span>
        <h2>Put a question to your own record</h2>
        <p>Answers are drawn only from the judgments you have added, with the case named each time.</p>
      </div>

      {svc.down ? <ServiceDown what="questions" /> : !index.length ? <Msg kind="note">Add a judgment first — there is nothing to ask about yet.</Msg> : (
        <>
          <textarea className="field" value={q} onChange={(e) => setQ(e.target.value)}
            dir="auto" placeholder="How have I treated delay in condonation applications?"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(); }} />
          <div className="flexb" style={{ marginTop: 10 }}>
            <button className="btn" onClick={run} disabled={busy || !q.trim()}>
              {busy ? <Loader2 size={14} className="spin" /> : <MessageSquare size={14} />} {busy ? "Reading" : "Ask"}
            </button>
            <span className="eyebrow">searches {index.length} judgment{index.length === 1 ? "" : "s"}</span>
          </div>
          {err && <div style={{ marginTop: 14 }}><Msg kind="err">{err}</Msg></div>}

          {thread.slice().reverse().map((t, i) => (
            <div className="fade" key={i} style={{ marginTop: 30, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
              <p dir={dirOf(t.q)} style={{ fontSize: 20, margin: "0 0 12px", fontWeight: 400 }}>{t.q}</p>
              <p className="prose" dir={dirOf(t.a)} style={{ margin: 0, whiteSpace: "pre-wrap" }}>{t.a}</p>
              <div className="flexb" style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <span className="eyebrow">read</span>
                {t.used.map((u, j) => <Tag key={j}>{u}</Tag>)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* --------------------------- consistency ------------------------- */

function ConsistencyView({ index, onOpen }) {
  const svc = useApi();
  const [pick, setPick] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [err, setErr] = useState("");

  const areas = useMemo(() => {
    const m = new Map();
    index.forEach((e) => m.set(e.area || "Unclassified", (m.get(e.area || "Unclassified") || 0) + 1));
    return [...m.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]);
  }, [index]);

  const group = useMemo(() => index.filter((e) => (e.area || "Unclassified") === pick), [index, pick]);

  async function run() {
    setBusy(true); setErr(""); setReport(null);
    try {
      const parts = group.slice(0, 10).map((e) =>
        `### ${e.caseTitle} (${fmtDate(e.judgmentDate)})\nDisposition: ${e.outcome} — ${e.outcomeNote}\nIssues: ${(e.issues || []).join("; ")}\nSummary: ${e.summary}\nAuthorities: ${(e.authorities || []).join("; ")}`).join("\n\n");
      const sys = `You compare one judicial officer's own judgments in a single subject area for internal consistency.
Return four short paragraphs, each opening with a bold-free label on its own line:
SETTLED — the propositions treated the same way throughout, with case names in brackets.
DIVERGENT — any place where similar facts or issues were treated differently, named plainly and without accusation.
UNTESTED — questions the officer has not yet had to decide in this area.
ANCHORS — the authorities and formulations returned to most often.
Use only the supplied records. Name cases in square brackets. Under 260 words total. If there is too little material to compare, say so instead of speculating.`;
      const out = await askClaude(sys, `Subject area: ${pick}\n\n${parts}`, 1000);
      setReport(out);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  return (
    <div className="fade">
      <div className="head">
        <span className="eyebrow">Consistency</span>
        <h2>Line up like against like</h2>
        <p>Pick a subject you have decided more than once. The comparison reads your own records side by side.</p>
      </div>

      {areas.length === 0 ? (
        <Msg kind="note">Consistency needs at least two judgments in the same subject. Add a few more and this fills in.</Msg>
      ) : (
        <>
          <div className="flexb" style={{ marginBottom: 16 }}>
            {areas.map(([a, c]) => (
              <button key={a} className={`btn ${pick === a ? "" : "ghost"}`} onClick={() => { setPick(a); setReport(null); }}>
                {a} <span style={{ opacity: .6 }}>{c}</span>
              </button>
            ))}
          </div>

          {pick && (
            <>
              <div style={{ marginBottom: 18 }}>
                {group.map((e) => (
                  <button key={e.id} className="row rowpad" onClick={() => onOpen(e.id)}>
                    <span className="rowbar" style={{ background: verdictColor(e.outcome) }} />
                    <p className="rt" style={{ fontSize: 17 }}>{e.caseTitle}</p>
                    <div className="rm">
                      <Tag color={verdictColor(e.outcome)} kind="v">{e.outcome}</Tag>
                      <span className="eyebrow">{fmtDate(e.judgmentDate)}</span>
                    </div>
                    {(e.issues || []).length > 0 && <p style={{ margin: "8px 0 0", fontSize: 15.5, color: "var(--soft)" }}>{e.issues.join(" · ")}</p>}
                  </button>
                ))}
              </div>
              {svc.down ? <ServiceDown what="the written comparison" /> : (
                <button className="btn" onClick={run} disabled={busy}>
                  {busy ? <Loader2 size={14} className="spin" /> : <Scale size={14} />} {busy ? "Comparing" : `Compare these ${group.length}`}
                </button>
              )}
            </>
          )}

          {err && <div style={{ marginTop: 14 }}><Msg kind="err">{err}</Msg></div>}

          {report && (
            <div className="fade" style={{ marginTop: 26 }}>
              <span className="eyebrow">{pick} · {group.length} judgments compared</span>
              <p className="prose" style={{ whiteSpace: "pre-wrap", marginTop: 12, marginBottom: 0 }}>{report}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ----------------------------- patterns -------------------------- */

function Bar({ label, value, max, color }) {
  return (
    <div className="bar">
      <span className="lab" title={label}>{label}</span>
      <span className="track"><span className="fill" style={{ width: `${Math.max(3, (value / max) * 100)}%`, background: color || "var(--ink)" }} /></span>
      <span className="val">{value}</span>
    </div>
  );
}

function PatternsView({ index }) {
  const svc = useApi();
  const [busy, setBusy] = useState(false);
  const [read, setRead] = useState("");
  const [err, setErr] = useState("");

  const stats = useMemo(() => {
    const tally = (arr) => {
      const m = new Map();
      arr.forEach((k) => { if (k) m.set(k, (m.get(k) || 0) + 1); });
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    return {
      outcomes: tally(index.map((e) => e.outcome)),
      areas: tally(index.map((e) => e.area)),
      forums: tally(index.map((e) => e.forum)),
      years: tally(index.map((e) => yearOf(e)).filter(Boolean).map(String)).sort((a, b) => a[0].localeCompare(b[0])),
      authorities: tally(index.flatMap((e) => e.authorities || [])).slice(0, 8),
      bench: tally(index.flatMap((e) => e.bench || [])).slice(0, 8),
      statutes: tally(index.flatMap((e) => e.statutes || [])).slice(0, 8),
      keywords: tally(index.flatMap((e) => e.keywords || [])).slice(0, 14),
      avgWords: index.length ? Math.round(index.reduce((s, e) => s + (e.wordCount || 0), 0) / index.length) : 0,
      totalWords: index.reduce((s, e) => s + (e.wordCount || 0), 0),
      avgIssues: index.length ? (index.reduce((s, e) => s + (e.issues || []).length, 0) / index.length).toFixed(1) : 0,
    };
  }, [index]);

  async function readWork() {
    setBusy(true); setErr("");
    try {
      const digest = index.slice(0, 24).map((e) =>
        `- ${e.caseTitle} | ${e.area} | ${e.outcome} | ${(e.issues || []).slice(0, 2).join("; ")} | ${(e.summary || "").slice(0, 180)}`).join("\n");
      const sys = `You read a judicial officer's own body of work and tell them what it shows. Address them as "you".
Cover, in this order and with a plain label line before each: WHAT YOU DECIDE MOST, HOW YOU REASON, WHERE YOU ARE STRONGEST, WHAT IS THIN.
Be concrete and cite case names in brackets. No flattery, no hedging filler. Under 250 words. Base everything on the records supplied.`;
      const out = await askClaude(sys, `Corpus of ${index.length} judgments (first 24 shown):\n${digest}\n\nAggregate: dispositions ${stats.outcomes.map(([k, v]) => `${k} ${v}`).join(", ")}. Subjects: ${stats.areas.map(([k, v]) => `${k} ${v}`).join(", ")}. Average length ${stats.avgWords} words. Most-cited: ${stats.authorities.map(([k]) => k).join("; ")}.`, 1000);
      setRead(out);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  if (!index.length) return (
    <div className="fade"><div className="head"><span className="eyebrow">Patterns</span><h2>Patterns need a corpus</h2>
      <p>Counts, dispositions and repeat authorities appear here once judgments are on the shelf.</p></div></div>
  );

  const max = (arr) => Math.max(1, ...arr.map((x) => x[1]));

  return (
    <div className="fade">
      <div className="head">
        <span className="eyebrow">Patterns</span>
        <h2>What the register adds up to</h2>
      </div>

      <div className="stats">
        <div className="stat"><span className="v">{index.length}</span><div className="k eyebrow">judgments</div></div>
        <div className="stat"><span className="v">{stats.areas.length}</span><div className="k eyebrow">subjects</div></div>
        <div className="stat"><span className="v">{stats.avgWords.toLocaleString()}</span><div className="k eyebrow">avg words</div></div>
        <div className="stat"><span className="v">{stats.avgIssues}</span><div className="k eyebrow">issues per case</div></div>
        <div className="stat"><span className="v">{Math.round(stats.totalWords / 1000)}k</span><div className="k eyebrow">words written</div></div>
      </div>

      <Section title="Dispositions">
        <div>{stats.outcomes.map(([k, v]) => <Bar key={k} label={k} value={v} max={max(stats.outcomes)} color={verdictColor(k)} />)}</div>
      </Section>

      <Section title="Subjects">
        <div>{stats.areas.map(([k, v]) => <Bar key={k} label={k} value={v} max={max(stats.areas)} />)}</div>
      </Section>

      {stats.years.length > 1 && (
        <Section title="By year">
          <div>{stats.years.map(([k, v]) => <Bar key={k} label={k} value={v} max={max(stats.years)} color="var(--soft)" />)}</div>
        </Section>
      )}

      {stats.bench.length > 0 && (
        <Section title="Judges you sat with">
          <div>{stats.bench.map(([k, v]) => <Bar key={k} label={k} value={v} max={max(stats.bench)} color="var(--soft)" />)}</div>
        </Section>
      )}

      {stats.authorities.length > 0 && (
        <Section title="Authorities you return to">
          <div>{stats.authorities.map(([k, v]) => <Bar key={k} label={k} value={v} max={max(stats.authorities)} color="var(--against)" />)}</div>
        </Section>
      )}

      {stats.statutes.length > 0 && (
        <Section title="Provisions most cited">
          <div className="flexb">{stats.statutes.map(([k, v]) => <Tag key={k}>{k} · {v}</Tag>)}</div>
        </Section>
      )}

      {stats.keywords.length > 0 && (
        <Section title="Recurring language">
          <div className="flexb" style={{ gap: "10px 16px" }}>{stats.keywords.map(([k, v]) => (
            <span key={k} dir={dirOf(k)} style={{ fontSize: 15 + Math.min(11, v * 2), lineHeight: 1.3, color: v > 2 ? "var(--ink)" : "var(--soft)" }}>{k}</span>
          ))}</div>
        </Section>
      )}

      <Section title="A read on your work" note="written from the records above">
        <div>
          {!read && <p style={{ margin: "0 0 14px", color: "var(--soft)", fontSize: 16 }}>
            Have the register read back what it sees: what you decide most, how you reason, where the body of work is strongest and where it is thin.</p>}
          {read && <p className="prose" style={{ whiteSpace: "pre-wrap", margin: "0 0 14px" }}>{read}</p>}
          {err && <div style={{ marginBottom: 12 }}><Msg kind="err">{err}</Msg></div>}
          {svc.down ? <ServiceDown what="the written read-back" /> : (
            <button className="btn" onClick={readWork} disabled={busy}>
              {busy ? <Loader2 size={14} className="spin" /> : <Layers size={14} />} {busy ? "Reading" : read ? "Read again" : "Read my work"}
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------- app ----------------------------- */

export default function Ratio() {
  const [index, setIndex] = useState([]);
  const [view, setView] = useState("register");
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const [memWhy, setMemWhy] = useState("");
  const [notice, setNotice] = useState("");
  const [limit, setLimit] = useState(0);
  const importRef = useRef(null);

  useEffect(() => {
    const off = onStorageChange((s) => { setMemWhy(s.mem ? s.why : ""); setLimit(s.limit); });
    (async () => {
      await initStorage();
      if (store.mem) setMemWhy(store.why);
      setLimit(store.limit);
      const i = await loadIndex();
      setIndex(i); setReady(true);
      if (!i.length) setView("add");
    })();
    return off;
  }, []);

  const open = (id) => { setOpenId(id); setView("case"); window.scrollTo(0, 0); };
  const changed = (next, alsoOpen) => { setIndex(next); if (alsoOpen) open(alsoOpen); };

  const NAV = [
    { id: "register", label: "Register", count: index.length },
    { id: "add", label: "Add" },
    { id: "ask", label: "Ask" },
    { id: "consistency", label: "Consistency" },
    { id: "patterns", label: "Patterns" },
  ];

  async function exportAll() {
    const docs = {};
    for (const e of index) {
      const d = await loadDoc(e.id);
      if (d) docs[e.id] = d;
    }
    const bundle = { app: "ratio", version: 1, exportedAt: new Date().toISOString(), index, docs };
    const url = URL.createObjectURL(new Blob([JSON.stringify(bundle)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = `ratio-register-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  async function importAll(file) {
    try {
      const b = JSON.parse(await file.text());
      const incoming = Array.isArray(b) ? b : b.index;
      if (!Array.isArray(incoming)) throw new Error("That file isn't a Ratio register.");
      const current = await loadIndex();
      const have = new Set(current.map((e) => e.id));
      const added = [];
      for (const e of incoming) {
        if (have.has(e.id)) continue;
        const d = b.docs && b.docs[e.id];
        if (d) await saveDoc(d);
        added.push(e);
      }
      const next = [...added, ...current];
      await saveIndex(next);
      setIndex(next);
      setView("register");
      setNotice(added.length ? `${added.length} judgment${added.length === 1 ? "" : "s"} restored.` : "Everything in that file was already here.");
    } catch (e) {
      setNotice(`Import failed — ${e.message}`);
    }
  }

  return (
    <div className="ratio">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <header className="top">
          <h1 className="wordmark">Ratio<span>.</span></h1>
          <span className="tagline">{index.length ? `${index.length} judgments` : "your own case law"}</span>
        </header>

        <nav className="tabs">
          {NAV.map((n) => (
            <button key={n.id}
              className={`navlink ${view === n.id || (view === "case" && n.id === "register") ? "on" : ""}`}
              onClick={() => { setView(n.id); setOpenId(null); }}>
              {n.label}{n.count > 0 && <span className="ct">{n.count}</span>}
            </button>
          ))}
        </nav>

        <main>

            {memWhy && (
              <div style={{ marginBottom: 18 }}>
                <Msg kind="note">
                  <div>
                    <strong style={{ fontWeight: 500 }}>Saving is off — this session only.</strong> The register works normally,
                    but nothing will survive closing this tab.
                    <div className="mono" style={{ fontSize: 12, marginTop: 6, opacity: .8 }}>reason: {memWhy}</div>
                    <div className="flexb" style={{ marginTop: 10 }}>
                      <button className="btn" onClick={exportAll} disabled={!index.length}>
                        <Download size={13} /> Export register
                      </button>
                      <button className="btn ghost" onClick={() => importRef.current && importRef.current.click()}>
                        Import a register
                      </button>
                    </div>
                  </div>
                </Msg>
              </div>
            )}
            {notice && (
              <div style={{ marginBottom: 18 }}>
                <Msg kind={notice.startsWith("Import failed") ? "err" : "ok"}>{notice}</Msg>
              </div>
            )}
            {!ready && <p style={{ color: "var(--soft)" }}><Loader2 size={15} className="spin" /> Opening the register…</p>}

            {ready && (
              <>
                {view === "register" && <Register index={index} onOpen={open} query={query} setQuery={setQuery} />}
                {view === "case" && openId && <CaseView id={openId} index={index} onBack={() => { setView("register"); setOpenId(null); }} onChanged={changed} />}
                {view === "add" && <AddView count={index.length} onOpen={open} onSaved={(i) => { setIndex(i); }} />}
                {view === "ask" && <AskView index={index} />}
                {view === "consistency" && <ConsistencyView index={index} onOpen={open} />}
                {view === "patterns" && <PatternsView index={index} />}
              </>
            )}
          <footer className="foot">
            {index.length > 0 && <button onClick={exportAll}>Export</button>}
            <button onClick={() => importRef.current && importRef.current.click()}>Import</button>
            <input ref={importRef} type="file" accept=".json,application/json" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) importAll(f); e.target.value = ""; }} />
            <span style={{ marginLeft: "auto" }}>
              {memWhy ? "Session only" : limit ? "Saved to this device" : "Private"}
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
