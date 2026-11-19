// Site numbers for the admin screen (Omri, 2026-11-19): who came, which skill they read and downloaded,
// from where, phone or computer. Only from nginx's own log of this site (deploy/skills.omri-iram.co.il.conf,
// format skills_json, kept 90 days by deploy/skills-hub.logrotate). Nothing runs in the visitor's browser,
// no cookie is set for this, and no name is known: only counts.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export const LOG_DIR = process.env.SKILLS_LOG_DIR || '/var/log/nginx/skills';

const BOT = /bot|crawl|spider|slurp|curl|wget|python|httpclient|headless|preview|facebookexternalhit|whatsapp\/|telegram|lighthouse|monitor|uptime|java\/|go-http|node-fetch|axios|okhttp|scrapy|semrush|ahrefs|bing|yandex|petal/i;
const PHONE = /iphone|android|mobile|ipad/i;
const PAGE = /^\/(?:$|skills\/[a-z0-9-]+\/?$|bundles\/(?:[a-z0-9-]+\/?)?$)/;
const ZIP = /^\/downloads\/([a-z0-9-]+)\.zip$/;

function readLines() {
  if (!fs.existsSync(LOG_DIR)) return [];
  const out = [];
  for (const f of fs.readdirSync(LOG_DIR)) {
    const p = path.join(LOG_DIR, f);
    if (!/\.log(\.\d+)?(\.gz)?$/.test(f) || !fs.statSync(p).isFile()) continue;
    let text;
    try { text = f.endsWith('.gz') ? zlib.gunzipSync(fs.readFileSync(p)).toString('utf8') : fs.readFileSync(p, 'utf8'); } catch { continue; }
    for (const line of text.split('\n')) {
      if (!line.startsWith('{')) continue;
      try { out.push(JSON.parse(line)); } catch {}
    }
  }
  return out;
}

// Where a visit came from, in words Omri uses. No referrer = a link opened from WhatsApp, an email app or typed in.
function source(r, uri) {
  const utm = /[?&]utm_source=([^&]+)/.exec(uri || '');
  if (utm) {
    const u = decodeURIComponent(utm[1]).toLowerCase();
    return { whatsapp: 'וואטסאפ', wa: 'וואטסאפ', newsletter: 'ניוזלטר', email: 'מייל', listmonk: 'ניוזלטר', facebook: 'פייסבוק', fb: 'פייסבוק', youtube: 'יוטיוב', skool: 'Skool', instagram: 'אינסטגרם', qr: 'קוד QR' }[u] || u;
  }
  let host = '';
  try { host = new URL(r).hostname.replace(/^www\./, ''); } catch { return 'ישיר, וואטסאפ או מייל'; }
  if (!host || host === 'skills.omri-iram.co.il') return null; // a click inside the site
  if (/google\./.test(host)) return 'גוגל';
  if (/youtube\.com|youtu\.be/.test(host)) return 'יוטיוב';
  if (/facebook\.com|fb\.me/.test(host)) return 'פייסבוק';
  if (/instagram\.com/.test(host)) return 'אינסטגרם';
  if (/whatsapp/.test(host)) return 'וואטסאפ';
  if (/linkedin/.test(host)) return 'לינקדאין';
  if (/events\.omri-iram\.co\.il/.test(host)) return 'דפי הסדנאות';
  if (/omri-iram\.co\.il$/.test(host)) return 'האתר של עומרי';
  if (/gegisrael/.test(host)) return 'GEG';
  if (/skool\.com/.test(host)) return 'Skool';
  return host;
}

const dayOf = (t) => String(t).slice(0, 10);

export function stats({ days = 30, titles = new Map(), now = new Date() } = {}) {
  const from = new Date(now.getTime() - days * 864e5).toISOString().slice(0, 10);
  const visitors = new Set();
  const byDay = new Map(); // day -> {v:Set, d:Set}
  const skillViews = new Map(); // name -> Set(visitor)
  const skillDl = new Map(); // name -> Set(visitor)
  const sources = new Map(); // source -> Set(visitor)
  const phone = new Set(); const desk = new Set();
  let pageViews = 0; let home = 0; let signups = 0; let first = null;

  for (const e of readLines()) {
    if (!e.t || e.a === '1' || BOT.test(e.ua || '')) continue;
    const day = dayOf(e.t);
    if (day < from) continue;
    if (!first || day < first) first = day;
    const uri = String(e.u || '').split('?')[0];
    const who = `${e.ip}|${e.ua}`; // one visitor = one address with one browser
    const d = byDay.get(day) || { v: new Set(), d: new Set() };
    byDay.set(day, d);

    if (e.m === 'POST' && uri === '/signup' && e.s >= 200 && e.s < 300) { signups++; continue; }
    if (e.m !== 'GET' || e.s !== 200 && e.s !== 206 && e.s !== 304) continue;

    const zip = ZIP.exec(uri);
    // A visitor is anyone who opened a page or downloaded (the imported old lines have no home page visits).
    if (zip || PAGE.test(uri)) { visitors.add(who); d.v.add(who); (PHONE.test(e.ua || '') ? phone : desk).add(who); }
    if (zip) {
      if (!skillDl.has(zip[1])) skillDl.set(zip[1], new Set());
      skillDl.get(zip[1]).add(who);
      d.d.add(`${who}|${zip[1]}`);
      continue;
    }
    if (!PAGE.test(uri)) continue;
    pageViews++;
    if (uri === '/') home++;
    const sk = /^\/skills\/([a-z0-9-]+)/.exec(uri);
    if (sk) { if (!skillViews.has(sk[1])) skillViews.set(sk[1], new Set()); skillViews.get(sk[1]).add(who); }
    const src = source(e.r, e.u);
    if (src) { if (!sources.has(src)) sources.set(src, new Set()); sources.get(src).add(who); }
  }

  const downloaders = new Set([...skillDl.values()].flatMap((s) => [...s]));
  // Only skills that exist now: old zips (a renamed or deleted skill) are left out of the table.
  const names = new Set([...skillViews.keys(), ...skillDl.keys()].filter((n) => !titles.size || titles.has(n)));
  return {
    days, first,
    visitors: visitors.size, pageViews, home, signups,
    downloaders: downloaders.size,
    phone: phone.size, desktop: desk.size,
    perDay: [...byDay.entries()].sort().map(([day, x]) => ({ day, visitors: x.v.size, downloads: x.d.size })),
    perSkill: [...names].map((n) => ({
      name: n, title: titles.get(n) || n,
      views: (skillViews.get(n) || new Set()).size,
      downloads: (skillDl.get(n) || new Set()).size,
    })).sort((a, b) => b.downloads - a.downloads || b.views - a.views),
    sources: [...sources.entries()].map(([s, v]) => ({ source: s, visitors: v.size })).sort((a, b) => b.visitors - a.visitors),
  };
}
