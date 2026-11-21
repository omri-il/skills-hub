// Builds the whole site into dist/: the home page, one page per skill, a zip per skill.
// A bundle is not a file: it downloads its skills' zips one by one, so nobody has to extract anything. Fails with a clear list of problems if a skill does not pass the checks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import QRCode from 'qrcode';
import YAML from 'yaml';
import { loadSkills, WHO, GROUPS, CATEGORIES } from './lib/skills.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://skills.omri-iram.co.il';
// Fixed time inside every zip, so the same skill always gives the same bytes.
const ZIP_TIME = new Date('2026-01-01T00:00:00Z');

const { skills, byName, bundles, autoBundles, errors } = loadSkills(ROOT);
if (errors.length) {
  console.error(`\nBuild stopped: ${errors.length} problem(s) to fix.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

// ---------- helpers ----------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = (iso) => {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso);
};
const firstSentence = (s) => {
  const m = String(s).match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (m ? m[0] : String(s)).trim();
};
// ---------- the install tutorial video (video.yaml; the MP4 itself is on the VPS, not in git) ----------
const VIDEO = (() => {
  const f = path.join(ROOT, 'video.yaml');
  if (!fs.existsSync(f)) return null;
  const v = YAML.parse(fs.readFileSync(f, 'utf8')) || {};
  return v.file ? v : null;
})();
const videoPlayer = (v, cls = '') => `<div class="video ${cls}">
    <video controls preload="none" playsinline${v.poster ? ` poster="${esc(v.poster)}"` : ''} width="1920" height="1080">
      <source src="${esc(v.file)}" type="video/mp4">
      ${v.captions ? `<track kind="captions" src="${esc(v.captions)}" srclang="he" label="עברית" default>` : ''}
    </video>
  </div>
  <p class="video-links">
    <a class="btn btn-ghost btn-sm" href="${esc(v.file)}" download>הורדת הסרטון (MP4)</a>
    ${v.youtube ? `<a class="btn btn-ghost btn-sm" href="${esc(v.youtube)}" target="_blank" rel="noopener">צפייה ביוטיוב</a>` : ''}
  </p>`;
const videoHome = (v) => `<section class="wrap section" id="video" aria-labelledby="h-video">
  <div class="section-head">
    <h2 id="h-video">${esc(v.title)}</h2>
    <p class="muted">${esc(v.minutes)} דקות: מההורדה ועד סקיל שעובד.</p>
  </div>
  ${videoPlayer(v)}
</section>`;
const videoSkill = (v) => `<details class="video-fold">
    <summary>סרטון התקנה (${esc(v.minutes)} דקות)</summary>
    ${videoPlayer(v, 'video-sm')}
  </details>`;

// Proof on the home page (Omri, 2026-11-19). Measured: 177 different addresses downloaded a skill zip
// 8.11-19.11.2026 (nginx log on the VPS, bots left out; Omri's own tests are in it, so the line says "more than 150").
// The number only grows, so the line stays true. Raise it by hand after a new count.
const PROOF_LINE = 'יותר מ-150 מורים כבר הורידו סקילים מהאתר.';

// ---------- the next workshop (workshop.yaml): the next step after a download (Omri, 2026-11-19) ----------
const WORKSHOP = (() => {
  const f = path.join(ROOT, 'workshop.yaml');
  if (!fs.existsSync(f)) return null;
  const w = YAML.parse(fs.readFileSync(f, 'utf8')) || {};
  if (!w.url || !w.until || !w.date_text) return null;
  if (new Date(w.until) < new Date()) return null; // already over when the site is built
  return w;
})();
// assets/app.js removes the box once `data-until` has passed, so a date never stays after the workshop.
const workshopBox = (cls = '') => (WORKSHOP ? `<aside class="workshop ${cls}" data-until="${esc(WORKSHOP.until)}" aria-labelledby="h-ws-${cls || 'x'}">
  <div>
    <h2 id="h-ws-${cls || 'x'}">רוצים לראות את זה עובד?</h2>
    <p>סדנה בזום של 90 דקות: בונים יחד סקיל לכיתה שלכם. ב-${esc(WORKSHOP.date_text)}, <bdi>${esc(WORKSHOP.price)} ₪</bdi>.</p>
  </div>
  <a class="btn btn-ghost" href="${esc(WORKSHOP.url)}">לפרטים ולהרשמה</a>
</aside>` : '');

// ---------- pictures inside the "איך זה עוזר?" table (Omri, 2026-11-21: "בתוך הטבלה") ----------
// shots/<name>.json + assets/shots/<name>-<n>-before|after.webp, made by deploy/shots/make_row_shots.py from the same
// Gemini answers the row's quote was copied from. A row gets its pair by its quote; a picture whose file is missing is left out.
const shotsOf = (name) => {
  const f = path.join(ROOT, 'shots', `${name}.json`);
  if (!fs.existsSync(f)) return new Map();
  const rows = JSON.parse(fs.readFileSync(f, 'utf8')).rows || [];
  return new Map(rows.filter((r) => ['before', 'after'].every((k) => fs.existsSync(path.join(ROOT, 'assets', 'shots', r[k]))))
    .map((r) => [r.quote, r]));
};
const shotPic = (r, kind) => {
  const [w, h] = r.size?.[kind] || [440, 260];
  const who = kind === 'before' ? 'בלי הסקיל' : 'עם הסקיל';
  return `<a class="fix-pic fix-pic-${kind}" href="/assets/shots/${esc(r[kind])}" target="_blank" rel="noopener"><img src="/assets/shots/${esc(r[kind])}" alt="התשובה של Gemini ${who}, לבקשה: ${esc(r.label)}" loading="lazy" width="${w}" height="${h}"></a>`;
};

// The site shows Gemini only for now (Omri, 2026-11-11). meta.yaml keeps the other platforms; add them back here to show them.
const SHOWN_PLATFORMS = ['Gemini'];
const shown = (list) => list.filter((p) => SHOWN_PLATFORMS.includes(p));
const platformsOf = (s) => shown([...new Set([...s.tested_on, ...s.compatible])]);
const zipHref = (id) => `/downloads/${id}.zip`;
const sizeOf = (ids) => {
  const bytes = [ids].flat().reduce((sum, id) => sum + fs.statSync(path.join(DIST, 'downloads', `${id}.zip`)).size, 0);
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
};
const filesCount = (n) => `${n} קבצים`;
// With several files, app.js downloads them one after the other (data-files).
// Without JavaScript the link gets the first file, and each page also lists a link per file.
function dlLink(files, label, cls, attrs = '') {
  const multi = files.length > 1 ? ` data-files="${files.join('|')}"` : '';
  // data-skill: after the download, app.js offers the "tell me when it improves" email box (Omri, 2026-11-19).
  return `<a class="${cls}" href="${zipHref(files[0])}" download${multi} data-skill="${files.join('|')}"${attrs}>${label}</a>`;
}
const dlStatus = '<span class="dl-status" role="status" aria-live="polite"></span>';
const write = (rel, content) => {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

function makeZip(n) {
  // One folder named exactly like the skill, with SKILL.md inside. That is what Gemini expects.
  const tree = {
    [`${n}/`]: [new Uint8Array(0), { mtime: ZIP_TIME }],
    [`${n}/SKILL.md`]: [strToU8(byName.get(n).packaged), { mtime: ZIP_TIME, level: 9 }],
  };
  write(`downloads/${n}.zip`, zipSync(tree));
}

// ---------- clean and copy assets ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });

// ---------- zips ----------
for (const s of skills) makeZip(s.name);

// ---------- QR (drawn here, at build time, no outside service) ----------
const qrSvg = await QRCode.toString(`${SITE}/`, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#002045', light: '#ffffff' } });
write('assets/qr.svg', qrSvg);

// ---------- layout ----------
const ASSET_V = Date.now().toString(36);
function page({ title, description, body, canonical }) {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:locale" content="he_IL">
<meta property="og:type" content="website">
<meta property="og:site_name" content="סקילים למורים">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="סקילים חינמיים לג'מיני למורים, מאת עומרי אירם">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/Rubik-hebrew.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/style.css?v=${ASSET_V}">
<script src="/assets/app.js?v=${ASSET_V}" defer></script>
${canonical === '/' || canonical.startsWith('/skills/') || canonical.startsWith('/bundles/') ? `<script src="/assets/video-help.js?v=${ASSET_V}" defer></script>\n` : ''}</head>
<body>
<a class="skip" href="#main">דילוג לתוכן</a>
<header class="topbar"><div class="wrap topbar-in">
  <a class="brand" href="/">סקילים למורים</a>
  <a class="top-link" href="/bundles/">חבילות</a>
  <span class="byline">מאת <a href="https://omri-iram.co.il">עומרי אירם</a></span>
</div></header>
<main id="main">
${body}
</main>
<footer class="foot"><div class="wrap">
  <p>חינם, מאת <a href="https://omri-iram.co.il">עומרי אירם | בינה בהוראה</a>. בעיה בסקיל? <bdi dir="ltr">hello@omri-iram.co.il</bdi></p>
  <p class="foot-admin"><a href="/admin">כניסה לניהול האתר</a></p>
</div></footer>
</body>
</html>
`;
}

const tag = (text, cls = '') => `<span class="tag ${cls}">${esc(text)}</span>`;
// One tag for every skill: "מתאים ל-Gemini" (Omri, 2026-11-19: two tags, "נבדק" and "מתאים", confused him).
// What was really tested stays on the skill page, under "מה נבדק ומה עוד לא".
function platformTags(s) {
  return platformsOf(s).map((p) => tag(`מתאים ל-${p}`, 'tag-compat')).join('') + (s.needs_pro ? tag('צריך Gemini Pro', 'tag-pro') : '');
}

// Omri, 2026-11-19: a skill that works well only in Pro says it plainly, at the top of its page.
const proBox = (s) => (s.needs_pro ? `<aside class="pro-box" role="note">
      <h2>לעבוד במצב Pro</h2>
      <p>הסקיל הזה עובד טוב רק במצב <bdi dir="ltr">Pro</bdi> של ג'מיני. במצב המהיר הוא טועה יותר.</p>
      <p>לפני שמתחילים: לבחור <bdi dir="ltr">Pro</bdi> בתפריט שבראש השיחה. בחשבון של בית הספר (<bdi dir="ltr">Education Plus</bdi>) יש לכם גישה ל-<bdi dir="ltr">Pro</bdi>.</p>
    </aside>` : s.prefers_pro ? `<aside class="pro-box" role="note">
      <h2>עובד טוב יותר במצב Pro</h2>
      <p>הסקיל עובד גם במצב המהיר של ג'מיני, אבל במצב <bdi dir="ltr">Pro</bdi> הוא טועה פחות.</p>
      <p>כדאי לבחור <bdi dir="ltr">Pro</bdi> בתפריט שבראש השיחה. בחשבון של בית הספר (<bdi dir="ltr">Education Plus</bdi>) יש לכם גישה ל-<bdi dir="ltr">Pro</bdi>.</p>
    </aside>` : '');

// A helper skill (role: shared) does nothing alone (Omri, 2026-11-19): it is never downloaded by itself,
// only with the skill that needs it.
const hostOf = (s) => (s.role === 'shared' ? skills.find((x) => x.role === 'main' && x.requires.includes(s.name)) : null);

function downloadFor(s) {
  const host = hostOf(s);
  if (host) return downloadFor(host);
  const auto = autoBundles.get(s.name);
  if (auto) {
    const extra = auto.skills.length - 1;
    return {
      files: auto.skills,
      label: 'הורדה',
      note: `${filesCount(auto.skills.length)}: הסקיל ו-${extra === 1 ? 'סקיל עזר' : `${extra} סקילי עזר`}`,
    };
  }
  return { files: [s.name], label: 'הורדה', note: 'קובץ zip' };
}

// ---------- home ----------
function card(s) {
  const d = downloadFor(s);
  // data-search: what the search box looks in (assets/app.js normalises it the same way as the query).
  const search = [s.title, s.category, s.problem, s.benefit, s.what_it_does, s.output, s.audience, ...s.subjects, s.name].join(' ').replace(/\s+/g, ' ');
  return `<li class="card" data-subjects="${esc(s.subjects.join('|'))}" data-groups="${esc(s.groups.join('|'))}" data-fits="${esc(s.fits.join('|'))}" data-who="${esc(s.who.join('|'))}" data-platforms="${esc(platformsOf(s).join('|'))}" data-search="${esc(search)}">
  <h3 class="card-title"><a href="/skills/${s.name}/">${esc(s.title)}</a></h3>
  <p class="card-benefit">${esc(s.benefit)}</p>
  <div class="tags">${s.subjects.map((x) => tag(x, 'tag-subject')).join('')}${platformTags(s)}</div>
  <div class="card-actions">
    ${dlLink(d.files, d.label, 'btn btn-primary', ` aria-label="הורדת ${esc(s.title)} (${esc(d.note)})"`)}
    <a class="btn btn-ghost" href="/skills/${s.name}/">פרטים</a>
  </div>
  <p class="card-note">${esc(d.note)} · ${sizeOf(d.files)}</p>
  ${dlStatus}
</li>`;
}

// Every bundle has its own page (Omri, 2026-11-19). The home page shows only the topic bundles, as short cards.
// A workshop bundle (bundles.yaml `workshop`) is reached by its own link, from the workshop's learning page.
const bundleHref = (b) => `/bundles/${b.id}/`;
const topicBundles = bundles.filter((b) => !b.workshop);
const workshopBundles = bundles.filter((b) => b.workshop).sort((a, z) => z.date.localeCompare(a.date));
const bundleEyebrow = (b) => (b.workshop ? `חבילה מהסדנה של ${fmtDate(b.date)}` : 'חבילה');

function bundleCard(b) {
  return `<article class="bundle bundle-short">
  <div class="bundle-text">
    <p class="eyebrow">${bundleEyebrow(b)} · ${b.skills.length} סקילים</p>
    <h3><a href="${bundleHref(b)}">${esc(b.title)}</a></h3>
    <p>${esc(b.description)}</p>
  </div>
  <div class="bundle-cta">
    ${dlLink(b.skills, 'הורדת החבילה', 'btn btn-cta btn-lg')}
    <a class="btn btn-ghost btn-sm" href="${bundleHref(b)}">מה יש בחבילה</a>
    <span class="card-note">${filesCount(b.skills.length)} · ${sizeOf(b.skills)}</span>
    ${dlStatus}
  </div>
</article>`;
}

const mains = skills.filter((s) => s.role === 'main');
const shared = skills.filter((s) => s.role === 'shared');
// Subject buttons: only real subjects. A button shows only the skills made for that subject.
const allSubjects = GROUPS;
const allWho = WHO.filter((w) => skills.some((s) => s.who.includes(w)));
const allPlatforms = [...new Set(skills.flatMap(platformsOf))];

// Sign-up (since 2026-11-11, Omri): the weekly skills email (Listmonk business list 106) and
// beta testers (list 107). nginx sends POST /signup to listmonk-selfservice, which forwards to
// Listmonk's own /subscription/form; the Altcha captcha and its script are served by Listmonk
// through the same nginx (deploy/skills.omri-iram.co.il.conf). No list is written here.
const signupSection = `<section class="wrap section" id="signup" aria-labelledby="h-signup">
  <div class="signup">
    <div class="signup-text">
      <h2 id="h-signup">סקילים חדשים, פעם בשבוע</h2>
      <p>מייל קצר עם הסקילים החדשים. רוצים לנסות סקילים לפני כולם? הירשמו כבודקי בטא.</p>
    </div>
    <form class="signup-form" id="signupForm" novalidate>
      <div id="signupFields">
        <label class="field"><span>שם</span><input type="text" name="name" autocomplete="name" required maxlength="120"></label>
        <label class="field"><span>מייל</span><input type="email" name="email" autocomplete="email" dir="ltr" required maxlength="254"></label>
        <label class="field"><span>מה אתם מלמדים? <span class="muted">(לא חובה)</span></span><input type="text" name="subject" maxlength="120" placeholder="למשל: מתמטיקה בחטיבת ביניים"></label>
        <fieldset class="boxes">
          <legend>מה תרצו לקבל?</legend>
          <label class="box"><input type="checkbox" name="weekly" value="1" checked> מייל שבועי עם הסקילים החדשים</label>
          <label class="box"><input type="checkbox" name="beta" value="1"> בודק בטא: סקילים לפני כולם</label>
        </fieldset>
        <div class="hp" aria-hidden="true"><label for="nonce">אל תמלאו שדה זה</label><input type="text" id="nonce" name="nonce" tabindex="-1" autocomplete="off"></div>
        <altcha-widget id="altcha" auto="onload" hidefooter challengeurl="/api/public/captcha/altcha" strings='{"label":"בודקים שאתם לא רובוט","verifying":"בודקים…","verified":"אומת","waitAlert":"רגע, עוד בודקים…","error":"הבדיקה נכשלה. נסו לרענן את הדף.","expired":"הבדיקה פגה. רעננו את הדף."}'></altcha-widget>
        <button type="submit" class="btn btn-send btn-lg" id="signupBtn">הרשמה</button>
        <p class="signup-err" id="signupErr" role="alert" hidden></p>
        <p class="muted small">אפשר להסיר את עצמכם בכל רגע, בקישור בתחתית המייל.</p>
      </div>
      <p class="signup-done" id="signupDone" role="status" hidden>נרשמתם. תודה!</p>
    </form>
  </div>
  <script type="module" src="/public/static/altcha.umd.js" async></script>
</section>`;
const CHIP_LABELS = { who: 'מי אתם?', subject: 'מה אתם מלמדים?', platform: 'פלטפורמה' };
const chips = (group, values) => `<div class="chips" role="group" aria-labelledby="f-${group}">
  <span class="chips-label" id="f-${group}">${CHIP_LABELS[group]}</span>
  <button type="button" class="chip" data-filter="${group}" data-value="" aria-pressed="true">הכל</button>
  ${values.map((v) => `<button type="button" class="chip" data-filter="${group}" data-value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('\n  ')}
</div>`;

const homeBody = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-text">
    <h1>חוסכים שעות עבודה בכל שבוע,<br class="br-wide"> עם Gemini Skills.</h1>
    <p class="lead">דף עבודה או לוח בחירה מג'מיני, מוכן להדפסה. עברית שלא מתהפכת ומפתח תשובות שנבדק. חינם, בלי הרשמה.</p>
    <p class="proof">${PROOF_LINE}</p>
    <ol class="steps">
      <li><span><b>מורידים</b> חבילה או סקיל</span></li>
      <li><span><b>מעלים</b> לג'מיני, פעם אחת</span></li>
      <li><span><b>מבקשים כרגיל</b>. לא עבד? כותבים <code dir="ltr">@</code> ואת שם הסקיל</span></li>
    </ol>
    <p class="hero-actions">
      ${bundles.length ? `<a class="btn btn-cta btn-lg" href="#bundles">לחבילות</a>
      <a class="btn btn-ghost btn-lg" href="#skills">לסקיל בודד</a>` : '<a class="btn btn-cta btn-lg" href="#skills">לבחירת סקיל</a>'}
      ${VIDEO ? `<a class="btn btn-ghost btn-video" href="#video">סרטון התקנה (${esc(VIDEO.minutes)} דקות)</a>` : ''}
    </p>
  </div>
  <figure class="qr">
    <img src="/assets/qr.svg" width="140" height="140" alt="קוד QR לכתובת skills.omri-iram.co.il">
    <figcaption>סורקים ופותחים בטלפון</figcaption>
  </figure>
</div></section>

${bundles.length ? `<section class="wrap section" id="bundles" aria-labelledby="h-bundles">
  <div class="section-head">
    <h2 id="h-bundles">חבילות</h2>
    <p class="muted">כמה סקילים שעובדים יחד, בהורדה אחת.</p>
  </div>
  <div class="bundle-grid">
  ${topicBundles.map(bundleCard).join('\n')}
  </div>
  ${workshopBundles.length ? `<p class="workshop-line">הייתם בסדנה שלי? <a href="/bundles/#workshops">לחבילות מהסדנאות</a></p>` : ''}
</section>` : ''}

<section class="wrap section" id="skills" aria-labelledby="h-skills">
  <div class="section-head">
    <h2 id="h-skills">הסקילים</h2>
  </div>
  <div class="filters">
    <div class="search" role="search">
      <label class="chips-label" for="q">חיפוש</label>
      <input type="search" id="q" class="search-input" placeholder="למשל: מכתב להורים, שברים, ציונים" autocomplete="off" enterkeyhint="search">
    </div>
    ${chips('who', allWho)}
    ${chips('subject', allSubjects)}
    ${allPlatforms.length > 1 ? chips('platform', allPlatforms) : ''}
    <p class="filter-count muted small" id="count" aria-live="polite"></p>
  </div>
  ${CATEGORIES.filter((c) => mains.some((s) => s.category === c.name)).map((c, i) => `<h3 class="sub-head cat-head${i ? '' : ' cat-first'}">${esc(c.name)} <span class="muted">${esc(c.note)}</span></h3>
  <ul class="grid">
    ${mains.filter((s) => s.category === c.name).map(card).join('\n')}
  </ul>`).join('\n  ')}
  <div class="empty" id="empty" hidden>
    <p id="empty-text">אין סקיל שמתאים. נסו מילה אחרת.</p>
    <p id="empty-subject" hidden>עוד אין סקיל ל<span id="empty-subject-name"></span>. הסקילים הכלליים מתאימים גם לכם. רוצים סקיל ל<span id="empty-subject-name2"></span>? <a href="#signup">ספרו לי בהרשמה</a>.</p>
    <button type="button" class="btn btn-ghost" id="reset">הצגת כל הסקילים</button>
  </div>
</section>

${VIDEO ? videoHome(VIDEO) : ''}

${WORKSHOP ? `<div class="wrap section">${workshopBox('home')}</div>` : ''}

${signupSection}
`;

write('index.html', page({
  title: 'סקילים למורים | עומרי אירם',
  description: `${mains.length} סקילים לג'מיני למורים בכל המקצועות: דפי עבודה, לוחות בחירה, ניתוח ציונים ומכתבים להורים, בעברית שלא מתהפכת. הורדה חינם, בלי הרשמה.`,
  canonical: '/',
  body: homeBody,
}));

// ---------- skill pages ----------
const usedBy = (name) => skills.filter((s) => s.requires.includes(name));
const skillLink = (n) => `<a href="/skills/${n}/">${esc(byName.get(n).title)}</a>`;

function installSteps(s, d) {
  const isBundle = d.files.length > 1;
  // A helper with several hosts: the files depend on the teacher's pick, so no list of one host's files.
  const manyHosts = s.role === 'shared' && usedBy(s.name).filter((x) => x.role === 'main').length > 1;
  if (manyHosts) {
    return `<section class="block" aria-labelledby="h-install">
  <h2 id="h-install">איך מתקינים</h2>
  ${VIDEO ? videoSkill(VIDEO) : ''}
  <ol class="install">
    <li>בוחרים למעלה את הסקיל שלכם ומורידים. יורדים כמה קבצים. <b>לא פותחים אותם</b>. הדפדפן שואל? מאשרים.</li>
    <li>בג'מיני, בפאנל הימני מעל ההיסטוריה: <b>התאמה אישית</b> ← הטאב <b>סקילים</b> ← <b>יצירה והעלאה</b>. מעלים כל קובץ בנפרד.</li>
    <li>בצ'אט חדש מבקשים כרגיל${exampleAsk(s) ? `, למשל: <q>${esc(exampleAsk(s))}</q>` : ''}.</li>
    <li>גרסה חדשה? מורידים שוב ובוחרים <b>החלפת סקיל</b>. העדכון לא מגיע לבד.</li>
  </ol>
</section>`;
  }
  return `<section class="block" aria-labelledby="h-install">
  <h2 id="h-install">איך מתקינים</h2>
  ${VIDEO ? videoSkill(VIDEO) : ''}
  <ol class="install">
    ${isBundle
      ? `<li>מורידים את ${filesCount(d.files.length)}. <b>לא פותחים אותם</b>. הדפדפן שואל? מאשרים.</li>
    <li>בג'מיני, בפאנל הימני מעל ההיסטוריה: <b>התאמה אישית</b> ← הטאב <b>סקילים</b> ← <b>יצירה והעלאה</b>. מעלים כל קובץ בנפרד.</li>
    <li>חסר קובץ? ${d.files.map((n) => `<a href="${zipHref(n)}" download>${esc(byName.get(n).title)}</a>`).join(', ')}.</li>`
      : `<li>מורידים את קובץ ה-zip. <b>לא פותחים אותו</b>.</li>
    <li>בג'מיני, בפאנל הימני מעל ההיסטוריה: <b>התאמה אישית</b> ← הטאב <b>סקילים</b> ← <b>יצירה והעלאה</b>, ובוחרים את הקובץ.</li>`}
    <li>בצ'אט חדש מבקשים כרגיל${exampleAsk(s) ? `, למשל: <q>${esc(exampleAsk(s))}</q>` : ''}.</li>
    <li>לא עבד? כותבים בהתחלה <code dir="ltr">@${esc(s.name)}</code> ובוחרים מהרשימה.</li>
    <li>גרסה חדשה? מורידים שוב ובוחרים <b>החלפת סקיל</b>. העדכון לא מגיע לבד.</li>
  </ol>
</section>`;
}

function exampleAsk(s) {
  if (s.subjects.includes('כימיה') && s.name.includes('chem')) return "דף עבודה באיזון ניסוחים לכיתה י', כקובץ Word";
  if (s.name.includes('elementary')) return "דף תרגול בשברים לכיתה ד', כקובץ Word";
  if (s.name.includes('math')) return "דף תרגול בסדרות הנדסיות ל-4 יחידות, כקובץ Word";
  if (s.name.includes('verify')) return 'תבדוק את מפתח התשובות של דף העבודה שהעליתי';
  // Other skills: no example, rather than a worksheet example that does not fit them.
  return '';
}

function skillPage(s) {
  const d = downloadFor(s);
  const auto = autoBundles.get(s.name);
  const callers = usedBy(s.name);
  const host = hostOf(s);
  // A skill that needs helper skills, and a helper skill, download only as the whole set (Omri, 2026-11-19).
  // Omri, 2026-11-21: a helper used by several skills (verify-solutions: math, chemistry, physics, biology)
  // lets the teacher pick their own skill, never the first one in the list.
  // Order: by the helper's own subjects list (math first, then chemistry...).
  const rank = (h) => Math.min(...h.subjects.map((x) => (s.subjects.includes(x) ? s.subjects.indexOf(x) : 99)));
  const hosts = s.role === 'shared' ? skills.filter((x) => x.role === 'main' && x.requires.includes(s.name)).sort((a, b) => rank(a) - rank(b)) : [];
  const dl = hosts.length > 1
    ? `<div class="dl-box">
    <p class="dl-pick">סקיל עזר. הוא יורד יחד עם הסקיל שלכם. בוחרים אחד:</p>
    <ul class="dl-hosts">${hosts.map((h) => `
      <li>${dlLink(downloadFor(h).files, `הורדה עם ${esc(h.title)}`, 'btn btn-primary')}</li>`).join('')}
    </ul>
    ${dlStatus}
  </div>`
    : host
    ? `<div class="dl-box">
    ${dlLink(d.files, 'הורדה עם הסקיל שצריך אותו', 'btn btn-primary btn-lg')}
    <p class="card-note">סקיל עזר. הוא עובד רק עם ${skillLink(host.name)}, ולכן יורד איתו · ${filesCount(d.files.length)} · ${sizeOf(d.files)}</p>
    ${dlStatus}
  </div>`
    : auto
    ? `<div class="dl-box">
    ${dlLink(d.files, 'הורדת הסקיל וסקילי העזר', 'btn btn-primary btn-lg')}
    <p class="card-note">${filesCount(d.files.length)} · ${sizeOf(d.files)}</p>
    ${dlStatus}
  </div>`
    : `<div class="dl-box">
    ${dlLink(d.files, 'הורדת הסקיל', 'btn btn-primary btn-lg')}
    <p class="card-note">קובץ zip · ${sizeOf(d.files)}</p>
  </div>`;

  // Omri, 2026-11-19: a skill with `simple` + `uses` opens with a plain sentence and 3 ways to use it,
  // instead of the 4 blocks problem / benefit / what / output.
  const plain = s.simple && s.uses.length;
  // English inside a Hebrew line (an error message, "Google Forms") keeps its own direction.
  // Split before escaping, so an entity like &quot; is never cut.
  const he = (t) => t.split(/([A-Za-z][A-Za-z0-9.:_\- ]*[A-Za-z0-9])/).map((part, i) => (i % 2 ? `<bdi dir="ltr">${esc(part)}</bdi>` : esc(part))).join('');
  // Omri, 2026-11-19: "the story behind the skill", only when meta.yaml has `story`.
  const storyBlock = s.story ? `<section class="block story" aria-labelledby="h-story">
        <h2 id="h-story">הסיפור מאחורי הסקיל</h2>
        ${s.story.split(/\n\s*\n/).map((para) => `<p>${he(para.trim())}</p>`).join('')}
      </section>` : '';
  // Omri, 2026-11-20: "why not just ask Gemini?". 2026-11-21: a table "בלי הסקיל / עם הסקיל", only mistakes a real
  // run showed, each with Gemini's own words; rules nobody saw broken go under it as "הסקיל גם בודק".
  const fx = s.fixes;
  // 2026-11-21: under each row, the two real answers it comes from (before on the "בלי" side), cropped to that spot.
  const shots = fx ? shotsOf(s.name) : new Map();
  const anyShot = fx?.list.some((f) => shots.has(f.quote));
  const fixesBlock = fx ? `<section class="block fixes" aria-labelledby="h-fixes">
        <h2 id="h-fixes">איך זה עוזר?</h2>${fx.list.length ? `
        <table class="fixes-table">
          <thead><tr><th scope="col" class="fix-no"><span aria-hidden="true">✗</span> בלי הסקיל</th><th scope="col" class="fix-yes"><span aria-hidden="true">✓</span> עם הסקיל</th></tr></thead>
          <tbody>${fx.list.map((f) => {
            const r = shots.get(f.quote);
            return `
            <tr${r ? ' class="has-shots"' : ''}><td>${he(f.without)}${f.quote ? `<q class="fix-quote">${he(f.quote)}</q>` : ''}</td><td class="fix-with">${he(f.with)}</td></tr>${r ? `
            <tr class="fix-shots"><td colspan="2"><div class="fix-pics">${shotPic(r, 'before')}${shotPic(r, 'after')}</div></td></tr>` : ''}`;
          }).join('')}
          </tbody>
        </table>
        <p class="fixes-source">${he(fx.source)}${anyShot ? ' לחיצה על תמונה מגדילה אותה.' : ''}</p>` : ''}${fx.also ? `
        <p class="fixes-also"><b>${fx.list.length ? 'הסקיל גם אומר ל-Gemini:' : 'מה הסקיל אומר ל-Gemini:'}</b> ${he(fx.also)}</p>` : ''}
      </section>` : '';
  const usesBlock = plain ? `<section class="block what-skill" aria-labelledby="h-what-skill">
        <h2 id="h-what-skill">מה זה סקיל?</h2>
        <p>קובץ קטן עם הוראות לג'מיני. מעלים אותו פעם אחת, ומאז ג'מיני יודע לעשות את המשימה הזאת טוב. לא צריך לזכור שום פקודה: מבקשים כרגיל.</p>
      </section>
      <section class="block uses" aria-labelledby="h-uses">
        <h2 id="h-uses">${s.uses.length} דרכים להשתמש בזה</h2>
        <ol class="uses-list">${s.uses.map((u, i) => `
          <li class="use">
            <h3><span class="use-n" aria-hidden="true">${i + 1}</span><span>${he(u.when)}</span></h3>
            <p class="use-label">כותבים לג'מיני:</p>
            <blockquote class="use-ask" id="ask-${s.name}-${i}">${he(u.ask)}</blockquote>
            <div class="use-bar"><button type="button" class="btn btn-ghost btn-sm" data-copy="ask-${s.name}-${i}">העתקה</button><span class="copy-status" role="status" aria-live="polite"></span></div>
            <p class="use-label">מקבלים:</p>
            <p class="use-get">${he(u.get)}</p>
          </li>`).join('')}
        </ol>
      </section>` : '';
  const factsBlocks = `<section class="block" aria-labelledby="h-problem">
        <h2 id="h-problem">הבעיה</h2>
        <p>${esc(s.problem)}</p>
      </section>
      <section class="block benefit" aria-labelledby="h-benefit">
        <h2 id="h-benefit">חוסך לכם</h2>
        <p>${esc(s.benefit)}</p>
      </section>
      <section class="block" aria-labelledby="h-what">
        <h2 id="h-what">מה הוא עושה</h2>
        <p>${esc(s.what_it_does)}</p>
      </section>
      <section class="block" aria-labelledby="h-out">
        <h2 id="h-out">מה מקבלים</h2>
        <p class="output">${esc(s.output)}</p>
      </section>`;

  const body = `
<div class="wrap skill">
  <nav class="crumbs" aria-label="מיקום"><a href="/">כל הסקילים</a> <span aria-hidden="true">‹</span> <span>${esc(s.title)}</span></nav>
  <header class="skill-head">
    <div>
      <p class="eyebrow">${s.role === 'shared' ? 'סקיל עזר' : 'סקיל'} · ${esc(s.audience)}</p>
      <h1>${esc(s.title)}</h1>
      ${plain ? `<p class="simple">${he(s.simple)}</p>` : ''}
      <p class="meta-line">גרסה <bdi dir="ltr">${esc(s.version)}</bdi> · עודכן ${fmtDate(s.updated)} · <code dir="ltr">${esc(s.name)}</code></p>
      <div class="tags">${s.subjects.map((x) => tag(x, 'tag-subject')).join('')}${platformTags(s)}</div>
    </div>
    <div class="dl-col">
      ${dl}
      <img class="qr-skill" src="/skills/${esc(s.name)}/qr.svg" width="110" height="110" alt="קוד QR להורדת הסקיל ${esc(s.title)} בטלפון">
    </div>
  </header>

  <div class="skill-grid">
    <div class="skill-main">
      ${/* Omri, 2026-11-21: "איך זה עוזר?" opens the page; the ways to use it come under it. */ ''}
      ${fixesBlock}

      ${proBox(s)}

      ${plain ? usesBlock : factsBlocks}

      ${storyBlock}

      <section class="block trust" aria-labelledby="h-trust">
        <h2 id="h-trust">מה נבדק ומה עוד לא</h2>
        <div class="trust-cols">
          <div class="trust-ok">
            <h3><span class="ico" aria-hidden="true">✓</span> נבדק ועבד${shown(s.tested_on).length ? ` (${esc(shown(s.tested_on).join(', '))})` : ''}</h3>
            <ul>${s.tested.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div class="trust-warn">
            <h3><span class="ico" aria-hidden="true">!</span> כדאי לדעת</h3>
            <ul>${s.limitations.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </div>
        ${shown(s.compatible).filter((p) => !s.tested_on.includes(p)).length ? `<p class="muted small">${shown(s.compatible).filter((p) => !s.tested_on.includes(p)).map((p) => `ב-<bdi>${esc(p)}</bdi>`).join(' ו')} זה אמור לעבוד, אבל עוד לא בדקתי.</p>` : ''}
      </section>

      ${workshopBox('skill')}

      ${installSteps(s, d)}

      <p class="signup-link"><a href="/#signup">מייל שבועי עם סקילים חדשים: להרשמה</a></p>

      <section class="block" aria-labelledby="h-source">
        <h2 id="h-source">מה כתוב בסקיל</h2>
        <details class="source">
          <summary>הצגת הקובץ <bdi dir="ltr">SKILL.md</bdi></summary>
          <div class="source-bar">
            <button type="button" class="btn btn-ghost btn-sm" data-copy="src-${s.name}">העתקה</button>
            <span class="copy-status" role="status" aria-live="polite"></span>
          </div>
          <pre class="source-pre" id="src-${s.name}" tabindex="0">${esc(s.packaged)}</pre>
        </details>
      </section>
    </div>

    <aside class="skill-side">
      ${s.requires.length ? `<section class="side-box">
        <h2>דורש גם</h2>
        <p class="muted small">ההורדה הראשית כוללת אותם.</p>
        <ul>${s.requires.map((n) => `<li>${skillLink(n)}</li>`).join('')}</ul>
      </section>` : ''}
      ${callers.length ? `<section class="side-box">
        <h2>סקילים שמשתמשים בו</h2>
        <ul>${callers.map((c) => `<li>${skillLink(c.name)}</li>`).join('')}</ul>
      </section>` : ''}
      ${topicBundles.filter((b) => b.skills.includes(s.name)).map((b) => `<section class="side-box">
        <h2>נמצא בחבילה</h2>
        <p><a href="${bundleHref(b)}"><b>${esc(b.title)}</b></a></p>
        ${dlLink(b.skills, `הורדת החבילה (${filesCount(b.skills.length)})`, 'btn btn-ghost btn-sm')}
        ${dlStatus}
      </section>`).join('')}
    </aside>
  </div>
</div>`;

  write(`skills/${s.name}/index.html`, page({
    title: `${s.title} | סקילים למורים`,
    description: firstSentence(s.problem),
    canonical: `/skills/${s.name}/`,
    body,
  }));
}
// Omri, 2026-11-20: a small QR on every skill page, so in a workshop he can say "scan it and you have the skill".
// It holds only that page's fixed public address; utm_source=qr counts these visits under "qr" in /admin/stats.
for (const s of skills) {
  write(`skills/${s.name}/qr.svg`, await QRCode.toString(`${SITE}/skills/${s.name}/?utm_source=qr`, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#002045', light: '#ffffff' } }));
}
skills.forEach(skillPage);

// ---------- bundle pages (Omri, 2026-11-19) ----------
// One page per bundle: one download button, a short card per skill, install steps, and the bundle's video.
// The page loads nothing from another site (CSP), so the video is a link to YouTube, not an embed.
function bundleSkill(n) {
  const s = byName.get(n);
  return `<li class="card bundle-skill">
  <h3 class="card-title"><a href="/skills/${n}/">${esc(s.title)}</a></h3>
  <p class="card-benefit">${esc(s.benefit)}</p>
  <p class="card-note">מפעילים עם <code dir="ltr">@${esc(n)}</code></p>
  <div class="card-actions">
    <a class="btn btn-ghost btn-sm" href="/skills/${n}/">פרטים</a>
    ${s.role === 'shared' || s.requires.length ? '' : `<a class="btn btn-ghost btn-sm" href="${zipHref(n)}" download data-skill="${n}" aria-label="הורדת ${esc(s.title)} בלבד">רק הסקיל הזה</a>`}
  </div>
</li>`;
}

function bundlePage(b) {
  const first = b.skills[0];
  const body = `
<div class="wrap skill">
  <nav class="crumbs" aria-label="מיקום"><a href="/">כל הסקילים</a> <span aria-hidden="true">‹</span> <a href="/bundles/">חבילות</a> <span aria-hidden="true">‹</span> <span>${esc(b.title)}</span></nav>
  <header class="skill-head">
    <div>
      <p class="eyebrow">${bundleEyebrow(b)}</p>
      <h1>${esc(b.title)}</h1>
      <p class="lead-sm">${esc(b.description)}</p>
      ${b.video ? `<p><a class="btn btn-ghost btn-video" href="${esc(b.video)}" target="_blank" rel="noopener">סרטון על הסקילים${b.video_minutes ? ` (${esc(b.video_minutes)} דקות)` : ''}</a></p>` : ''}
    </div>
    <div class="dl-col">
      <div class="dl-box">
        ${dlLink(b.skills, b.skills.length === 1 ? 'הורדת הסקיל' : `הורדת ${b.skills.length} הסקילים`, 'btn btn-primary btn-lg')}
        <p class="card-note">${filesCount(b.skills.length)} · ${sizeOf(b.skills)}</p>
        ${dlStatus}
      </div>
      <img class="qr-skill" src="${bundleHref(b)}qr.svg" width="110" height="110" alt="קוד QR לחבילה ${esc(b.title)} בטלפון">
    </div>
  </header>

  <section class="block" aria-labelledby="h-in">
    <h2 id="h-in">מה יש בחבילה</h2>
    <ul class="grid">
      ${b.skills.map(bundleSkill).join('\n')}
    </ul>
  </section>

  <section class="block" aria-labelledby="h-install">
    <h2 id="h-install">איך מתקינים</h2>
    ${VIDEO ? videoSkill(VIDEO) : ''}
    <ol class="install">
      <li>מורידים את ${filesCount(b.skills.length)}. <b>לא פותחים אותם</b>. הדפדפן שואל? מאשרים.</li>
      <li>בג'מיני, בפאנל הימני מעל ההיסטוריה: <b>התאמה אישית</b> ← הטאב <b>סקילים</b> ← <b>יצירה והעלאה</b>. מעלים כל קובץ בנפרד.</li>
      <li>בצ'אט חדש כותבים <code dir="ltr">@</code> ואת שם הסקיל, למשל <code dir="ltr">@${esc(first)}</code>, ובוחרים מהרשימה.</li>
      <li>חסר קובץ? ${b.skills.map((n) => `<a href="${zipHref(n)}" download data-skill="${n}">${esc(byName.get(n).title)}</a>`).join(', ')}.</li>
    </ol>
  </section>

  <p class="signup-link"><a href="/#signup">מייל שבועי עם סקילים חדשים: להרשמה</a></p>
</div>`;

  write(`bundles/${b.id}/index.html`, page({
    title: `${b.title} | סקילים למורים`,
    description: b.description,
    canonical: bundleHref(b),
    body,
  }));
}
// Omri, 2026-11-21: the same small QR on every bundle page (also the workshop bundles), like the skill pages.
for (const b of bundles) {
  write(`bundles/${b.id}/qr.svg`, await QRCode.toString(`${SITE}${bundleHref(b)}?utm_source=qr`, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#002045', light: '#ffffff' } }));
}
bundles.forEach(bundlePage);

const bundleRow = (b) => `<li><a href="${bundleHref(b)}"><b>${esc(b.title)}</b></a> <span class="muted">· ${b.workshop ? `${fmtDate(b.date)} · ` : ''}${b.skills.length} סקילים</span></li>`;
write('bundles/index.html', page({
  title: 'חבילות | סקילים למורים',
  description: 'חבילות של סקילים לג\'מיני: לפי נושא, ומהסדנאות.',
  canonical: '/bundles/',
  body: `<div class="wrap skill">
  <nav class="crumbs" aria-label="מיקום"><a href="/">כל הסקילים</a> <span aria-hidden="true">‹</span> <span>חבילות</span></nav>
  <h1>חבילות</h1>
  ${topicBundles.length ? `<section class="block" aria-labelledby="h-topic"><h2 id="h-topic">לפי נושא</h2><ul class="bundle-rows">${topicBundles.map(bundleRow).join('')}</ul></section>` : ''}
  ${workshopBundles.length ? `<section class="block" id="workshops" aria-labelledby="h-ws"><h2 id="h-ws">מהסדנאות</h2><p class="muted">החדשה ראשונה.</p><ul class="bundle-rows">${workshopBundles.map(bundleRow).join('')}</ul></section>` : ''}
</div>`,
}));

// ---------- 404, robots, sitemap ----------
write('404.html', page({
  title: 'הדף לא נמצא | סקילים למורים',
  description: 'הדף לא נמצא',
  canonical: '/',
  body: `<div class="wrap section"><h1>הדף הזה לא קיים</h1><p><a href="/">חזרה לכל הסקילים</a></p></div>`,
}));
// skills.json: read every Thursday by Listmonk's scripts/skills_weekly_draft.py (the weekly email), and by
// Listmonk's selfservice/skills_mail.py (2026-11-19): the welcome email (video, workshop) and the daily
// skill-update email (version, and the new `tested` lines = what improved).
write('skills.json', JSON.stringify({
  skills: skills.map((s) => ({
    name: s.name, title: s.title, version: s.version, updated: s.updated,
    role: s.role, category: s.category, problem: firstSentence(s.problem), benefit: s.benefit,
    tested: s.tested,
    example: (s.uses && s.uses[0] && s.uses[0].ask) || null, // the welcome email's request to try
  })),
  workshop: WORKSHOP ? { date_text: WORKSHOP.date_text, price: WORKSHOP.price, url: WORKSHOP.url, until: WORKSHOP.until } : null,
  video: VIDEO ? { youtube: VIDEO.youtube || null, minutes: VIDEO.minutes } : null,
}, null, 1));
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc></url>
${skills.map((s) => `<url><loc>${SITE}/skills/${s.name}/</loc><lastmod>${s.updated}</lastmod></url>`).join('\n')}
<url><loc>${SITE}/bundles/</loc></url>
${topicBundles.map((b) => `<url><loc>${SITE}${bundleHref(b)}</loc></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${skills.length} skills, ${bundles.length + autoBundles.size} bundles into dist/.`);
