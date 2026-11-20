// Share links (Omri, 2026-11-20): on a skill page, Omri writes where he shares the skill ("קבוצת מורי
// מתמטיקה"), and gets a go.omri-iram.co.il short link for that one place. The long link behind it ends with
// ?utm_source=s-<id>, so admin/stats.js counts who came from that place, who downloaded and who left an email.
//
// The list is NOT in git (the repo is public and the labels name Omri's groups): SHARE_FILE on the VPS.
// Env (deploy/skills-hub-admin.env):
//   GO_ADMIN_PASSWORD  the go-shortener's admin password (its own .env), to make a short link
//   GO_URL             default http://127.0.0.1:8091 (the go-shortener service on the VPS)
//   SHARE_FILE         default /root/Projects/skills-share/links.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const GO = process.env.GO_URL || 'http://127.0.0.1:8091';
const GO_PASSWORD = process.env.GO_ADMIN_PASSWORD || '';
export const SHARE_FILE = process.env.SHARE_FILE || '/root/Projects/skills-share/links.json';
export const SHARE_ID = /^[a-z0-9]{6}$/;

export function readShares() {
  try {
    const list = JSON.parse(fs.readFileSync(SHARE_FILE, 'utf8'));
    return Array.isArray(list) ? list.filter((s) => s && SHARE_ID.test(s.id)) : [];
  } catch { return []; }
}

function writeShares(list) {
  fs.mkdirSync(path.dirname(SHARE_FILE), { recursive: true });
  const tmp = `${SHARE_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 1));
  fs.renameSync(tmp, SHARE_FILE);
}

// Plain text only, one line, up to 80 characters.
export const cleanLabel = (s) => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);

const newId = (taken) => {
  for (;;) {
    const id = Array.from(crypto.randomBytes(6), (b) => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');
    if (!taken.has(id)) return id;
  }
};

// dry: a local test with no go-shortener password gets a made-up short link.
export async function createShare({ skill, label, site, dry = false }) {
  const list = readShares();
  const id = newId(new Set(list.map((s) => s.id)));
  const long = `${site}/skills/${skill}/?utm_source=s-${id}`;
  let short; let code = '';
  if (!GO_PASSWORD) {
    if (!dry) throw new Error('GO_ADMIN_PASSWORD is not set');
    short = `https://go.omri-iram.co.il/test-${id}`;
  } else {
    const r = await fetch(`${GO}/api/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': GO_PASSWORD },
      body: JSON.stringify({ url: long }),
      signal: AbortSignal.timeout(8000),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.short) throw new Error(`go-shortener: ${j.error || r.status}`);
    short = j.short; code = j.code || '';
  }
  const entry = { id, skill, label, short, code, long, created: new Date().toISOString() };
  list.push(entry);
  writeShares(list);
  return entry;
}

// The go-shortener's own click count per code (preview bots are not counted there). Empty when it cannot answer.
export async function goClicks() {
  if (!GO_PASSWORD) return new Map();
  try {
    const r = await fetch(`${GO}/api/list`, { headers: { 'X-Admin-Password': GO_PASSWORD }, signal: AbortSignal.timeout(3000) });
    if (!r.ok) return new Map();
    return new Map((await r.json()).map((l) => [l.code, l.clicks]));
  } catch { return new Map(); }
}
