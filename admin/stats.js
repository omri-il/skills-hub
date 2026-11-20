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
  // In time order: the rotated files are read in any order, and a share link counts what happens after it.
  return out.sort((a, b) => (String(a.t) < String(b.t) ? -1 : String(a.t) > String(b.t) ? 1 : 0));
}

// A share link made on a skill page (admin/share.js): ?utm_source=s-<id>.
const shareOf = (uri) => /[?&]utm_source=s-([a-z0-9]{6})(?:&|$)/.exec(uri || '')?.[1] || null;

// Where a visit came from, in words Omri uses. No referrer = a link opened from WhatsApp, an email app or typed in.
function source(r, uri, labels) {
  const sh = shareOf(uri);
  if (sh) return `🔗 ${labels.get(sh) || 'לינק ששיתפת'}`;
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

// shares: the list from admin/share.js. A visitor who opened a share link belongs to it, and so do the
// skills that visitor downloads and the email box filled after it (the last share link they opened).
export function stats({ days = 30, titles = new Map(), now = new Date(), shares = [] } = {}) {
  const labels = new Map(shares.map((s) => [s.id, s.label]));
  const perShare = new Map(shares.map((s) => [s.id, { v: new Set(), d: new Set(), signups: 0 }]));
  const cameBy = new Map(); // visitor -> share id
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

    if (e.m === 'POST' && uri === '/signup' && e.s >= 200 && e.s < 300) {
      signups++;
      const by = perShare.get(cameBy.get(who));
      if (by) by.signups++;
      continue;
    }
    if (e.m !== 'GET' || e.s !== 200 && e.s !== 206 && e.s !== 304) continue;

    const zip = ZIP.exec(uri);
    // A visitor is anyone who opened a page or downloaded (the imported old lines have no home page visits).
    if (zip || PAGE.test(uri)) { visitors.add(who); d.v.add(who); (PHONE.test(e.ua || '') ? phone : desk).add(who); }
    if (zip) {
      if (!skillDl.has(zip[1])) skillDl.set(zip[1], new Set());
      skillDl.get(zip[1]).add(who);
      d.d.add(`${who}|${zip[1]}`);
      perShare.get(cameBy.get(who))?.d.add(who);
      continue;
    }
    if (!PAGE.test(uri)) continue;
    pageViews++;
    if (uri === '/') home++;
    const sk = /^\/skills\/([a-z0-9-]+)/.exec(uri);
    if (sk) { if (!skillViews.has(sk[1])) skillViews.set(sk[1], new Set()); skillViews.get(sk[1]).add(who); }
    const sh = shareOf(e.u);
    if (sh && perShare.has(sh)) { cameBy.set(who, sh); perShare.get(sh).v.add(who); }
    const src = source(e.r, e.u, labels);
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
    shares: shares.map((s) => {
      const x = perShare.get(s.id);
      return { ...s, visitors: x.v.size, downloaders: x.d.size, signups: x.signups };
    }).sort((a, b) => String(b.created).localeCompare(String(a.created))),
    sources: [...sources.entries()].map(([s, v]) => ({ source: s, visitors: v.size })).sort((a, b) => b.visitors - a.visitors),
  };
}
