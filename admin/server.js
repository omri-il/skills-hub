// The admin screen of skills.omri-iram.co.il: https://skills.omri-iram.co.il/admin (Omri, 2026-11-17).
// One password. Each skill can be hidden from the site, shown again, or deleted.
// Every action is a commit to main on GitHub, made in a clone of its own (ADMIN_REPO), then the
// normal deploy (skills-hub-deploy.service) runs at once, so the site changes in about 30 seconds.
//
// Env (deploy/skills-hub-admin.env on the VPS, never in git):
//   ADMIN_PASSWORD   the one password
//   ADMIN_SECRET     a long random string that signs the login cookie
//   PORT             default 5047
//   ADMIN_REPO       default /root/Projects/skills-hub-admin (a clone used only by this service)
//   DRY_RUN=1        local test: no fetch, no push, no deploy, cookie without Secure
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
import { loadSkills } from '../lib/skills.js';

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET = process.env.ADMIN_SECRET || '';
const PORT = Number(process.env.PORT || 5047);
const REPO = process.env.ADMIN_REPO || '/root/Projects/skills-hub-admin';
const DRY = process.env.DRY_RUN === '1';
const SITE = 'https://skills.omri-iram.co.il';
const COOKIE = 'skills_admin';
const DAYS = 30;

if (!PASSWORD || !SECRET) {
  console.error('ADMIN_PASSWORD and ADMIN_SECRET must be set.');
  process.exit(1);
}

// ---------- login ----------
const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');
const same = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
function loggedIn(req) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=(\\d+)\\.([a-f0-9]{64})`));
  return !!m && Number(m[1]) > Date.now() && same(m[2], sign(m[1]));
}
function loginCookie() {
  const exp = String(Date.now() + DAYS * 864e5);
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${DAYS * 86400}${DRY ? '' : '; Secure'}`;
}
const fails = new Map(); // ip -> [times]; 5 wrong passwords in 15 minutes = wait
const recentFails = (ip) => (fails.get(ip) || []).filter((t) => t > Date.now() - 15 * 6e4);

// ---------- git ----------
const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
function sync() {
  if (DRY) return;
  git('fetch', '-q', 'origin', 'main');
  git('reset', '-q', '--hard', 'origin/main');
  git('clean', '-qfd');
}
function undo() {
  git('reset', '-q', '--hard', DRY ? 'HEAD' : 'origin/main');
  git('clean', '-qfd');
}

// ---------- the skills ----------
function state() {
  const { all, errors } = loadSkills(REPO);
  const requiredBy = new Map(all.map((s) => [s.name, []]));
  for (const s of all) for (const r of s.requires) requiredBy.get(r)?.push(s);
  return { all, errors, requiredBy, byName: new Map(all.map((s) => [s.name, s])) };
}

function setHidden(name, on) {
  const file = path.join(REPO, 'skills', name, 'meta.yaml');
  // A text edit, so the rest of the file stays exactly as it was written.
  let text = fs.readFileSync(file, 'utf8').replace(/^hidden:.*(\r?\n|$)/m, '');
  if (on) text = `${text.replace(/\s*$/, '')}\nhidden: true\n`;
  fs.writeFileSync(file, text);
}

function deleteSkill(name) {
  fs.rmSync(path.join(REPO, 'skills', name), { recursive: true, force: true });
  const file = path.join(REPO, 'bundles.yaml');
  if (!fs.existsSync(file)) return;
  // First a text edit (keeps the file as written); only if a bundle is left empty, rewrite it.
  const before = fs.readFileSync(file, 'utf8');
  const text = before.replace(new RegExp(`^\\s*-\\s+${name}\\s*(\\r?\\n|$)`, 'gm'), '');
  const parsed = YAML.parse(text) || [];
  if (!Array.isArray(parsed) || parsed.every((b) => Array.isArray(b?.skills) && b.skills.length && !b.skills.includes(name))) {
    fs.writeFileSync(file, text);
    return;
  }
  const doc = YAML.parseDocument(before);
  const bundles = doc.contents;
  if (!YAML.isSeq(bundles)) return;
  for (let i = bundles.items.length - 1; i >= 0; i--) {
    const list = bundles.items[i].get?.('skills');
    if (!YAML.isSeq(list)) continue;
    list.items = list.items.filter((n) => String(YAML.isScalar(n) ? n.value : n) !== name);
    if (!list.items.length) bundles.items.splice(i, 1);
  }
  fs.writeFileSync(file, doc.toString({ lineWidth: 0 }));
}

const names = (list) => list.map((s) => `"${s.title}"`).join(', ');

// One action at a time.
let queue = Promise.resolve();
const serial = (fn) => { const p = queue.then(fn, fn); queue = p.catch(() => {}); return p; };

function act(action, name) {
  sync();
  const { byName, requiredBy } = state();
  const s = byName.get(name);
  if (!s) return { ok: false, text: 'הסקיל הזה כבר לא קיים. אולי מישהו מחק אותו לפני רגע.' };
  const users = requiredBy.get(name) || [];

  if (action === 'hide') {
    if (s.hidden) return { ok: true, text: `"${s.title}" כבר מוסתר.` };
    const shownUsers = users.filter((u) => !u.hidden);
    if (shownUsers.length) return { ok: false, text: `אי אפשר להסתיר את "${s.title}": הסקילים ${names(shownUsers)} צריכים אותו. קודם להסתיר אותם.` };
    setHidden(name, true);
  } else if (action === 'show') {
    if (!s.hidden) return { ok: true, text: `"${s.title}" כבר מופיע באתר.` };
    const hiddenNeeds = s.requires.map((r) => byName.get(r)).filter((r) => r?.hidden);
    if (hiddenNeeds.length) return { ok: false, text: `אי אפשר להחזיר את "${s.title}": הוא צריך את ${names(hiddenNeeds)}, והם מוסתרים. קודם להחזיר אותם.` };
    setHidden(name, false);
  } else if (action === 'delete') {
    if (users.length) return { ok: false, text: `אי אפשר למחוק את "${s.title}": הסקילים ${names(users)} צריכים אותו. קודם למחוק אותם.` };
    deleteSkill(name);
  } else {
    return { ok: false, text: 'פעולה לא מוכרת.' };
  }

  const check = loadSkills(REPO);
  if (check.errors.length) {
    undo();
    return { ok: false, text: `לא שיניתי כלום. הבדיקה של האתר נכשלה: ${check.errors.join(' ')}` };
  }
  const verb = { hide: 'hide', show: 'show', delete: 'delete' }[action];
  git('add', '-A');
  git('commit', '-q', '-m', `admin: ${verb} ${name}`, '-m', 'From the admin screen, skills.omri-iram.co.il/admin.');
  if (!DRY) {
    try { git('push', '-q', 'origin', 'HEAD:main'); } catch (e) {
      undo();
      return { ok: false, text: `לא שיניתי כלום: השמירה ב-GitHub נכשלה. לנסות שוב בעוד דקה. (${String(e.stderr || e.message).trim().slice(0, 200)})` };
    }
    try {
      execFileSync('systemctl', ['start', 'skills-hub-deploy'], { timeout: 180000, stdio: 'ignore' });
    } catch {
      return { ok: true, text: `השינוי נשמר, אבל העדכון של האתר לא רץ עכשיו. האתר יתעדכן לבד תוך 5 דקות.` };
    }
  }
  const done = { hide: `"${s.title}" מוסתר עכשיו. הוא לא מופיע באתר.`, show: `"${s.title}" חזר לאתר.`, delete: `"${s.title}" נמחק מהאתר ומהתיקייה.` }[action];
  return { ok: true, text: done };
}

// ---------- pages ----------
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CSS = `
@font-face{font-family:Rubik;src:url(/assets/fonts/Rubik-hebrew.woff2) format("woff2");font-weight:300 900;unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F}
@font-face{font-family:Rubik;src:url(/assets/fonts/Rubik-latin.woff2) format("woff2");font-weight:300 900;unicode-range:U+0000-00FF,U+2000-206F}
:root{--navy:#002045;--ochre:#FFC250;--bg:#f3f5f8;--card:#fff;--ink:#0f1d2e;--ink2:#4b5a6b;--line:#dde3ea;--red:#b42318;--red-soft:#fdecea;--ok:#146c43;--ok-soft:#e6f4ec}
*{box-sizing:border-box}
body{margin:0;font-family:Rubik,system-ui,sans-serif;background:var(--bg);color:var(--ink);line-height:1.5}
header{background:var(--navy);color:#fff;padding:14px 16px}
header .in{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
header h1{font-size:1.15rem;margin:0;font-weight:600}
header a,header button{color:#fff}
main{max-width:860px;margin:0 auto;padding:16px}
.note{margin:0 0 16px;padding:12px 14px;border-radius:10px;border-inline-start:5px solid var(--ok);background:var(--ok-soft)}
.note.bad{border-color:var(--red);background:var(--red-soft)}
h2{font-size:1rem;margin:24px 0 8px;color:var(--ink2);font-weight:600}
.row{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 10px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px}
.row.off{background:#f7f7f5;border-style:dashed}
.who{flex:1 1 260px;min-width:0}
.who b{display:block;font-weight:600}
.who small{color:var(--ink2)}
.tag{display:inline-block;font-size:.8rem;padding:1px 8px;border-radius:99px;background:var(--ochre);color:var(--navy);font-weight:600;margin-inline-start:6px}
.acts{display:flex;flex-wrap:wrap;gap:8px}
form{margin:0;display:inline}
button,.btn{font:inherit;font-size:.95rem;padding:7px 14px;border-radius:8px;border:1px solid var(--navy);background:#fff;color:var(--navy);cursor:pointer;text-decoration:none;display:inline-block}
button.main{background:var(--navy);color:#fff}
button.danger{background:var(--red);border-color:var(--red);color:#fff}
.btn.soft-danger{border-color:var(--red);color:var(--red)}
.link{background:none;border:0;text-decoration:underline;padding:0}
.box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;max-width:460px;margin:24px auto}
input[type=password]{font:inherit;width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;margin:8px 0 14px}
:focus-visible{outline:3px solid var(--ochre);outline-offset:2px}
bdi{unicode-bidi:isolate}
code{direction:ltr;unicode-bidi:isolate;font-size:.85em;color:var(--ink2)}
`;

function page(title, body, { header = true } = {}) {
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(title)}</title><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><style>${CSS}</style></head><body>
${header ? `<header><div class="in"><h1>ניהול הסקילים</h1><form method="post" action="/admin/logout"><button class="link">יציאה</button></form></div></header>` : ''}
<main>${body}</main></body></html>`;
}

function loginPage(msg = '') {
  return page('כניסה לניהול הסקילים', `<div class="box"><h1 style="margin-top:0;font-size:1.2rem">ניהול הסקילים</h1>
${msg ? `<p class="note bad">${esc(msg)}</p>` : ''}
<form method="post" action="/admin/login" style="display:block"><label for="p">סיסמה</label>
<input id="p" name="password" type="password" autocomplete="current-password" required autofocus>
<button class="main" type="submit">להיכנס</button></form></div>`, { header: false });
}

function actionButton(action, name, label, cls = '') {
  return `<form method="post" action="/admin/action"><input type="hidden" name="action" value="${action}"><input type="hidden" name="skill" value="${esc(name)}"><button class="${cls}" type="submit">${label}</button></form>`;
}

function row(s, requiredBy) {
  const users = requiredBy.get(s.name) || [];
  const need = users.length ? `<br><small>הסקילים ${esc(names(users))} צריכים אותו.</small>` : '';
  const view = s.hidden ? '' : `<a class="btn" href="/skills/${esc(s.name)}/" target="_blank" rel="noopener">לראות באתר</a>`;
  const toggle = s.hidden
    ? actionButton('show', s.name, 'להחזיר לאתר', 'main')
    : actionButton('hide', s.name, 'להסתיר מהאתר');
  return `<div class="row${s.hidden ? ' off' : ''}"><div class="who"><b>${esc(s.title)}${s.hidden ? '<span class="tag">מוסתר</span>' : ''}</b>
<small><code>${esc(s.name)}</code> · גרסה <bdi>${esc(s.version)}</bdi> · ${s.role === 'shared' ? 'סקיל עזר' : 'סקיל ראשי'}</small>${need}</div>
<div class="acts">${view}${toggle}<a class="btn soft-danger" href="/admin/confirm?skill=${encodeURIComponent(s.name)}">למחוק לגמרי…</a></div></div>`;
}

function listPage(note) {
  sync();
  const { all, errors, requiredBy } = state();
  const shown = all.filter((s) => !s.hidden);
  const hidden = all.filter((s) => s.hidden);
  const warn = errors.length ? `<p class="note bad">יש בעיה בקבצים של האתר, והוא לא מתעדכן: ${esc(errors.join(' '))}</p>` : '';
  const msg = note ? `<p class="note${note.ok ? '' : ' bad'}" role="status">${esc(note.text)}</p>` : '';
  return page('ניהול הסקילים', `${msg}${warn}
<p>הסתרה מורידה סקיל מהאתר, ואפשר להחזיר אותו בלחיצה. מחיקה מוחקת אותו מהתיקייה. כל שינוי מופיע באתר תוך כ-30 שניות.</p>
<h2>מופיעים באתר (${shown.length})</h2>${shown.map((s) => row(s, requiredBy)).join('') || '<p>אין.</p>'}
<h2>מוסתרים (${hidden.length})</h2>${hidden.map((s) => row(s, requiredBy)).join('') || '<p>אין סקילים מוסתרים.</p>'}`);
}

function confirmPage(name) {
  sync();
  const { byName, requiredBy } = state();
  const s = byName.get(name);
  if (!s) return listPage({ ok: false, text: 'הסקיל הזה לא קיים.' });
  const users = requiredBy.get(name) || [];
  const body = users.length
    ? `<p class="note bad">אי אפשר למחוק את "${esc(s.title)}": הסקילים ${esc(names(users))} צריכים אותו.</p><a class="btn" href="/admin">לחזור לרשימה</a>`
    : `<p>למחוק את <b>${esc(s.title)}</b> לגמרי?</p>
<p>הסקיל יימחק מהאתר ומהתיקייה, וגם מהחבילות שהוא נמצא בהן. רק Claude יכול לשחזר אותו אחר כך, מההיסטוריה ב-GitHub.</p>
<p>כדי להוריד אותו רק לזמן מה, עדיף ללחוץ "להסתיר מהאתר".</p>
<div class="acts">${actionButton('delete', s.name, `כן, למחוק את "${esc(s.title)}"`, 'danger')}<a class="btn" href="/admin">לא, לחזור לרשימה</a></div>`;
  return page('למחוק סקיל?', `<div class="box">${body}</div>`);
}

// ---------- server ----------
const HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'none'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
const send = (res, code, html, extra = {}) => { res.writeHead(code, { ...HEADERS, ...extra }); res.end(html); };
const go = (res, to, extra = {}) => { res.writeHead(303, { Location: to, 'Cache-Control': 'no-store', ...extra }); res.end(); };

function body(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 10000) { reject(new Error('too big')); req.destroy(); } });
    req.on('end', () => resolve(new URLSearchParams(data)));
    req.on('error', reject);
  });
}

// A POST must come from this site (the cookie is SameSite=Strict too).
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { return new URL(o).host === host; } catch { return false; }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const ip = String(req.headers['x-real-ip'] || req.socket.remoteAddress);
  try {
    if (req.method === 'POST' && !sameOrigin(req)) return send(res, 403, 'Forbidden');
    // Local test only: nginx serves /assets on the VPS.
    if (DRY && url.pathname.startsWith('/assets/')) {
      const file = path.join(import.meta.dirname, '..', path.normalize(url.pathname).replace(/^[\\/]+/, ''));
      if (fs.existsSync(file)) { res.writeHead(200, { 'Content-Type': file.endsWith('.svg') ? 'image/svg+xml' : 'font/woff2' }); return res.end(fs.readFileSync(file)); }
    }

    if (url.pathname === '/admin/login' && req.method === 'POST') {
      if (recentFails(ip).length >= 5) return send(res, 429, loginPage('יותר מדי ניסיונות. לנסות שוב בעוד 15 דקות.'));
      const f = await body(req);
      if (!same(f.get('password') || '', PASSWORD)) {
        fails.set(ip, [...recentFails(ip), Date.now()]);
        return send(res, 401, loginPage('הסיסמה לא נכונה.'));
      }
      fails.delete(ip);
      return go(res, '/admin', { 'Set-Cookie': loginCookie() });
    }
    if (url.pathname === '/admin/logout' && req.method === 'POST') {
      return go(res, '/admin', { 'Set-Cookie': `${COOKIE}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0` });
    }

    if (!loggedIn(req)) {
      if (req.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) return send(res, 200, loginPage());
      return go(res, '/admin');
    }

    if (req.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) {
      return send(res, 200, await serial(() => listPage()));
    }
    if (req.method === 'GET' && url.pathname === '/admin/confirm') {
      return send(res, 200, await serial(() => confirmPage(url.searchParams.get('skill') || '')));
    }
    if (req.method === 'POST' && url.pathname === '/admin/action') {
      const f = await body(req);
      const note = await serial(() => act(f.get('action'), f.get('skill') || ''));
      console.log(`${new Date().toISOString()} ${f.get('action')} ${f.get('skill')}: ${note.ok ? 'ok' : 'refused'}: ${note.text}`);
      return send(res, 200, await serial(() => listPage(note)));
    }
    return send(res, 404, page('לא נמצא', '<p>הדף לא נמצא. <a href="/admin">לרשימת הסקילים</a></p>'));
  } catch (e) {
    console.error(e);
    try { undo(); } catch {}
    return send(res, 500, page('שגיאה', `<p class="note bad">משהו נכשל, ולא שיניתי כלום. <a href="/admin">לחזור לרשימה</a></p>`));
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`skills-hub admin on 127.0.0.1:${PORT}, repo ${REPO}${DRY ? ' (DRY_RUN)' : ''}`));
