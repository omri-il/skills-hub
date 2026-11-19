// The admin screen of skills.omri-iram.co.il: https://skills.omri-iram.co.il/admin (Omri, 2026-11-17).
// One password. Each skill can be hidden from the site, shown again, or deleted.
// Every action is a commit to main on GitHub, made in a clone of its own (ADMIN_REPO), then the
// normal deploy (skills-hub-deploy.service) runs at once, so the site changes in about 10 seconds.
//
// Env (deploy/skills-hub-admin.env on the VPS, never in git):
//   ADMIN_PASSWORD   the one password
//   ADMIN_SECRET     a long random string that signs the login cookie
//   PORT             default 5047
//   ADMIN_REPO       default /root/Projects/skills-hub-admin (a clone used only by this service)
//   DRY_RUN=1        local test: no fetch, no push, no deploy, cookie without Secure
//   VIDEO_HELP_DIR   default /root/Projects/skills-video-help: one <skill>.json per skill, the video helper
//
// Video helper (Omri, 2026-11-19): demo requests for a skill, Gemini's answer without and with the skill, and
// what to point at on camera. Only Omri sees it: the JSON files are NOT in git (the repo is public), and
// /admin/api/video-help/<name> sends one only with the login cookie. assets/video-help.js shows it as a side
// panel on the skill page (key H hides it for a recording); /admin/video/<name> is the same for a phone.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
import { loadSkills } from '../lib/skills.js';
import { stats } from './stats.js';

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET = process.env.ADMIN_SECRET || '';
const PORT = Number(process.env.PORT || 5047);
const REPO = process.env.ADMIN_REPO || '/root/Projects/skills-hub-admin';
const DRY = process.env.DRY_RUN === '1';
const SITE = 'https://skills.omri-iram.co.il';
const COOKIE = 'skills_admin';
// A second cookie with no secret in it, readable by the site's script: it only tells assets/video-help.js
// that it is worth asking /admin/api for the helper, so other visitors' browsers never ask.
const SEEN = 'skills_admin_seen';
const DAYS = 30;
const HELP_DIR = process.env.VIDEO_HELP_DIR || '/root/Projects/skills-video-help';

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
const seenCookie = (on) => `${SEEN}=${on ? '1' : ''}; Path=/; SameSite=Strict; Max-Age=${on ? DAYS * 86400 : 0}${DRY ? '' : '; Secure'}`;

// ---------- video helper ----------
function readHelp(name) {
  if (!/^[a-z0-9-]+$/.test(name)) return null;
  try { return JSON.parse(fs.readFileSync(path.join(HELP_DIR, `${name}.json`), 'utf8')); } catch { return null; }
}
const hasHelp = (name) => fs.existsSync(path.join(HELP_DIR, `${name}.json`));
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
  const view = (s.hidden ? '' : `<a class="btn" href="/skills/${esc(s.name)}/" target="_blank" rel="noopener">לראות באתר</a>`)
    + (hasHelp(s.name) ? `<a class="btn" href="/admin/video/${esc(s.name)}">🎬 עזרה לסרטון</a>` : '');
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
<p><a class="btn" href="/admin/stats">📊 נתוני האתר: מי נכנס ומה הורידו</a></p>
<p>הסתרה מורידה סקיל מהאתר, ואפשר להחזיר אותו בלחיצה. מחיקה מוחקת אותו מהתיקייה. כל שינוי מופיע באתר תוך כ-10 שניות.</p>
<p>🎬 עזרה לסרטון: בעמוד של כל סקיל באתר יש חלון צד שרק אתה רואה. המקש H מסתיר אותו ומחזיר אותו, גם לפני הקלטה.</p>
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

// ---------- site numbers (Omri, 2026-11-19), from nginx's own log of this site: admin/stats.js ----------
const STATS_CSS = `
.big{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 8px}
.big div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.big b{display:block;font-size:1.8rem;color:var(--navy);line-height:1.1}
.big span{color:var(--ink2);font-size:.9rem}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:.95rem}
th,td{padding:7px 10px;border-bottom:1px solid var(--line);text-align:start}
th{background:#eef1f6;font-weight:600}
td.n{direction:ltr;text-align:end;font-variant-numeric:tabular-nums;width:6em}
.bar{height:10px;background:var(--navy);border-radius:5px;min-width:2px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
.tabs a{padding:5px 12px;border:1px solid var(--navy);border-radius:99px;text-decoration:none;color:var(--navy)}
.tabs a.on{background:var(--navy);color:#fff}
.small{color:var(--ink2);font-size:.88rem}`;

function statsPage(days) {
  const { all } = state();
  const titles = new Map(all.map((s) => [s.name, s.title]));
  const st = stats({ days, titles });
  const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '');
  const maxDay = Math.max(1, ...st.perDay.map((d) => d.visitors));
  const tabs = [7, 30, 90].map((d) => `<a class="${d === days ? 'on' : ''}" href="/admin/stats?days=${d}">${d} ימים</a>`).join('');
  const none = !st.first;
  const body = `<p><a href="/admin">‹ לרשימת הסקילים</a></p>
<h1 style="font-size:1.25rem;margin:0 0 10px">📊 נתוני האתר</h1>
<div class="tabs">${tabs}</div>
${none ? '<p class="note">עוד אין נתונים לתקופה הזאת. הרישום של האתר התחיל ב-19.11.2026.</p>' : `
<div class="big">
<div><b>${st.visitors}</b><span>מבקרים</span></div>
<div><b>${st.downloaders}</b><span>הורידו לפחות סקיל אחד</span></div>
<div><b>${pct(st.downloaders, st.visitors) || '0%'}</b><span>מהמבקרים הורידו</span></div>
<div><b>${st.signups}</b><span>נרשמו למייל השבועי</span></div>
<div><b>${pct(st.phone, st.phone + st.desktop)}</b><span>מהטלפון</span></div>
</div>
<p class="small">מבקר = כתובת אחת עם דפדפן אחד. בית ספר עם רשת אחת יכול להיספר כמבקר אחד. הביקורים שלך לא נספרים. המספרים מ-<bdi>${esc(st.first.split('-').reverse().join('.'))}</bdi> ואילך. לפני 19.11.2026 נספרו רק דפי הסקילים וההורדות, בלי דף הבית.</p>

<h2>הסקילים: כמה נכנסו וכמה הורידו</h2>
<table><tr><th>סקיל</th><th>נכנסו לדף</th><th>הורידו</th></tr>
${st.perSkill.map((s) => `<tr><td>${esc(s.title)}</td><td class="n">${s.views}</td><td class="n">${s.downloads}</td></tr>`).join('')}
</table>
<p class="small">הורדה מדף הבית או מחבילה נספרת גם בלי כניסה לדף של הסקיל.</p>

<h2>מאיפה הגיעו</h2>
<table><tr><th>מקור</th><th>מבקרים</th></tr>
${st.sources.map((s) => `<tr><td>${esc(s.source)}</td><td class="n">${s.visitors}</td></tr>`).join('')}
</table>
<p class="small">"ישיר, וואטסאפ או מייל" = קישור שנפתח מוואטסאפ, ממייל, או שהקלידו אותו. אפשר להפריד אותם: קישור עם <code>?utm_source=whatsapp</code> בסוף נספר בנפרד.</p>

<h2>כל יום</h2>
<table><tr><th>יום</th><th>מבקרים</th><th>הורדות</th><th></th></tr>
${st.perDay.slice().reverse().map((d) => `<tr><td><bdi>${esc(d.day.split('-').reverse().join('.'))}</bdi></td><td class="n">${d.visitors}</td><td class="n">${d.downloads}</td><td style="width:40%"><div class="bar" style="width:${Math.round((d.visitors / maxDay) * 100)}%"></div></td></tr>`).join('')}
</table>`}`;
  return page('נתוני האתר', `<style>${STATS_CSS}</style>${body}`);
}

// The same helper as the panel on the skill page, as a page of its own: to read on a phone while recording.
const HELP_CSS = `
.demo{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:0 0 14px}
.demo h3{margin:0 0 8px;font-size:1rem}
.prompt{background:#fff8e6;border:1px solid var(--ochre);border-radius:8px;padding:10px 12px;white-space:pre-wrap;unicode-bidi:plaintext;margin:0 0 10px}
.show{margin:0 0 10px;padding-inline-start:20px}
.show li{margin:0 0 4px}
details{border:1px solid var(--line);border-radius:8px;margin:0 0 8px;background:#fff}
summary{cursor:pointer;padding:8px 12px;font-weight:600}
.answer{white-space:pre-wrap;unicode-bidi:plaintext;padding:0 12px 12px;font-size:.92rem;max-height:70vh;overflow:auto}
.opening{font-size:1.05rem;background:var(--ok-soft);border-radius:10px;padding:10px 14px}
.small{color:var(--ink2);font-size:.88rem}`;

function helpPage(name) {
  const h = readHelp(name);
  if (!h) return page('אין עזרה לסרטון', `<p class="note bad">עוד אין עזרה לסרטון לסקיל הזה. אפשר לבקש מ-Claude להכין.</p><a class="btn" href="/admin">לרשימה</a>`);
  const demos = (h.demos || []).map((d, i) => `<section class="demo"><h3>${i + 1}. ${esc(d.label || 'בקשה לדוגמה')}</h3>
<div class="prompt">${esc(d.prompt)}</div>
${d.followup ? `<p class="small">אם Gemini שואל שאלה, לענות: <b>${esc(d.followup)}</b></p>` : ''}
<b>מה להראות במצלמה</b><ul class="show">${(d.show || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<details><summary>Gemini בלי הסקיל</summary><div class="answer">${esc(d.without || '')}</div></details>
<details><summary>Gemini עם הסקיל</summary><div class="answer">${esc(d.with || '')}</div></details></section>`).join('');
  return page(`🎬 ${h.title || name}`, `<style>${HELP_CSS}</style>
<p><a href="/admin">‹ לרשימה</a></p>
<h1 style="font-size:1.25rem;margin:0 0 10px">🎬 ${esc(h.title || name)}</h1>
${h.opening ? `<p class="opening">${esc(h.opening)}</p>` : ''}
${demos}
<p class="small">התשובות הן תצוגה מקדימה מ-Gemini API (<bdi>${esc(h.model || '')}</bdi>, <bdi>${esc(h.made || '')}</bdi>). באפליקציה של Gemini התשובה יכולה להיות קצת אחרת.</p>`);
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
      return go(res, '/admin', { 'Set-Cookie': [loginCookie(), seenCookie(true)] });
    }
    if (url.pathname === '/admin/logout' && req.method === 'POST') {
      return go(res, '/admin', { 'Set-Cookie': [`${COOKIE}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0`, seenCookie(false)] });
    }

    // The skill page's script asks here (assets/video-help.js). JSON, never a redirect to the login page.
    const api = url.pathname.match(/^\/admin\/api\/video-help\/([a-z0-9-]+)$/);
    if (api && req.method === 'GET') {
      const json = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' };
      if (!loggedIn(req)) { res.writeHead(401, { ...json, 'Set-Cookie': seenCookie(false) }); return res.end('{"error":"login"}'); }
      const h = readHelp(api[1]);
      res.writeHead(h ? 200 : 404, json);
      return res.end(JSON.stringify(h || { error: 'none' }));
    }

    if (!loggedIn(req)) {
      if (req.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) return send(res, 200, loginPage());
      return go(res, '/admin');
    }

    if (req.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) {
      // Also for a login made before the helper existed (2026-11-19): it has no SEEN cookie yet.
      return send(res, 200, await serial(() => listPage()), { 'Set-Cookie': seenCookie(true) });
    }
    if (req.method === 'GET' && url.pathname === '/admin/stats') {
      const d = Number(url.searchParams.get('days'));
      return send(res, 200, statsPage([7, 30, 90].includes(d) ? d : 30));
    }
    const video = url.pathname.match(/^\/admin\/video\/([a-z0-9-]+)\/?$/);
    if (req.method === 'GET' && video) return send(res, 200, helpPage(video[1]));
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
