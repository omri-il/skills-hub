// Builds the whole site into dist/: the home page, one page per skill, a zip per skill.
// A bundle is not a file: it downloads its skills' zips one by one, so nobody has to extract anything. Fails with a clear list of problems if a skill does not pass the checks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import QRCode from 'qrcode';
import { loadSkills, WHO, ANY_SUBJECT } from './lib/skills.js';

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
// The site shows Gemini only for now (Omri, 2026-11-11). meta.yaml keeps the other platforms; add them back here to show them.
const SHOWN_PLATFORMS = ['Gemini'];
const shown = (list) => list.filter((p) => SHOWN_PLATFORMS.includes(p));
const platformsOf = (s) => shown([...new Set([...s.tested_on, ...s.compatible])]);
const zipHref = (id) => `/downloads/${id}.zip`;
const sizeOf = (ids) => {
  const bytes = [ids].flat().reduce((sum, id) => sum + fs.statSync(path.join(DIST, 'downloads', `${id}.zip`)).size, 0);
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
};
const filesCount = (n) => (n === 2 ? 'שני קבצים נפרדים' : `${n} קבצים נפרדים`);
// With several files, app.js downloads them one after the other (data-files).
// Without JavaScript the link gets the first file, and each page also lists a link per file.
function dlLink(files, label, cls, attrs = '') {
  const multi = files.length > 1 ? ` data-files="${files.join('|')}"` : '';
  return `<a class="${cls}" href="${zipHref(files[0])}" download${multi}${attrs}>${label}</a>`;
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
const qrSvg = await QRCode.toString(`${SITE}/`, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1d2421', light: '#ffffff' } });
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
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/Rubik-hebrew.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/style.css?v=${ASSET_V}">
<script src="/assets/app.js?v=${ASSET_V}" defer></script>
</head>
<body>
<a class="skip" href="#main">דילוג לתוכן</a>
<header class="topbar"><div class="wrap topbar-in">
  <a class="brand" href="/">סקילים למורים</a>
  <span class="byline">מאת <a href="https://omri-iram.co.il">עומרי אירם</a></span>
</div></header>
<main id="main">
${body}
</main>
<footer class="foot"><div class="wrap">
  <p>הסקילים חינמיים לשימוש בכיתה ובבית הספר. נבנו ונבדקו על ידי <a href="https://omri-iram.co.il">עומרי אירם | בינה בהוראה</a>.</p>
  <p class="muted">מצאתם בעיה בסקיל? ספרו לי ב-<bdi dir="ltr">hello@omri-iram.co.il</bdi> ואני אתקן.</p>
</div></footer>
</body>
</html>
`;
}

const tag = (text, cls = '') => `<span class="tag ${cls}">${esc(text)}</span>`;
function platformTags(s) {
  return [
    ...shown(s.tested_on).map((p) => tag(`נבדק ב-${p}`, 'tag-tested')),
    ...shown(s.compatible).filter((p) => !s.tested_on.includes(p)).map((p) => tag(`מתאים ל-${p}`, 'tag-compat')),
  ].join('');
}

function downloadFor(s) {
  const auto = autoBundles.get(s.name);
  if (auto) {
    const extra = auto.skills.length - 1;
    return {
      files: auto.skills,
      label: 'הורדה',
      note: `${filesCount(auto.skills.length)}: הסקיל ו${extra === 1 ? 'סקיל עזר אחד' : extra === 2 ? 'שני סקילי עזר' : `${extra} סקילי עזר`}`,
    };
  }
  return { files: [s.name], label: 'הורדה', note: 'קובץ zip אחד' };
}

// ---------- home ----------
function card(s) {
  const d = downloadFor(s);
  // data-search: what the search box looks in (assets/app.js normalises it the same way as the query).
  const search = [s.title, s.problem, s.what_it_does, s.output, s.audience, ...s.subjects, s.name].join(' ').replace(/\s+/g, ' ');
  return `<li class="card" data-subjects="${esc(s.subjects.join('|'))}" data-who="${esc(s.who.join('|'))}" data-platforms="${esc(platformsOf(s).join('|'))}" data-search="${esc(search)}">
  <h3 class="card-title"><a href="/skills/${s.name}/">${esc(s.title)}</a></h3>
  <p class="card-problem">${esc(firstSentence(s.problem))}</p>
  <div class="tags">${s.subjects.map((x) => tag(x, 'tag-subject')).join('')}${platformTags(s)}</div>
  <div class="card-actions">
    ${dlLink(d.files, d.label, 'btn btn-primary', ` aria-label="הורדת ${esc(s.title)} (${esc(d.note)})"`)}
    <a class="btn btn-ghost" href="/skills/${s.name}/">מה בדיוק הוא עושה</a>
  </div>
  <p class="card-note">${esc(d.note)} · ${sizeOf(d.files)}</p>
  ${dlStatus}
</li>`;
}

function bundleCard(b) {
  const items = b.skills.map((n) => `<li><a href="/skills/${n}/">${esc(byName.get(n).title)}</a> · <a href="${zipHref(n)}" download aria-label="הורדת ${esc(byName.get(n).title)} בלבד">הורדה</a></li>`).join('');
  return `<article class="bundle">
  <div class="bundle-text">
    <p class="eyebrow">חבילה · ${b.skills.length} סקילים, קובץ נפרד לכל אחד</p>
    <h3>${esc(b.title)}</h3>
    <p>${esc(b.description)}</p>
    <ul class="bundle-list">${items}</ul>
  </div>
  <div class="bundle-cta">
    ${dlLink(b.skills, 'הורדת החבילה', 'btn btn-primary btn-lg')}
    <span class="card-note">${filesCount(b.skills.length)} · ${sizeOf(b.skills)}</span>
    <span class="card-note">לא צריך לחלץ כלום</span>
    ${dlStatus}
  </div>
</article>`;
}

const mains = skills.filter((s) => s.role === 'main');
const shared = skills.filter((s) => s.role === 'shared');
// Subject buttons: only real subjects. A skill for any subject shows under every one of them.
const allSubjects = [...new Set(skills.flatMap((s) => s.subjects))].filter((x) => !ANY_SUBJECT.includes(x));
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
      <p>פעם בשבוע אשלח מייל קצר עם הסקילים שעלו לאתר. ומי שרוצה לנסות סקילים לפני שהם עולים ולספר לי מה עבד, יכול להירשם כבודק בטא.</p>
    </div>
    <form class="signup-form" id="signupForm" novalidate>
      <div id="signupFields">
        <label class="field"><span>שם</span><input type="text" name="name" autocomplete="name" required maxlength="120"></label>
        <label class="field"><span>מייל</span><input type="email" name="email" autocomplete="email" dir="ltr" required maxlength="254"></label>
        <label class="field"><span>מה אתם מלמדים? <span class="muted">(לא חובה)</span></span><input type="text" name="subject" maxlength="120" placeholder="למשל: מתמטיקה בחטיבת ביניים"></label>
        <fieldset class="boxes">
          <legend>מה תרצו לקבל?</legend>
          <label class="box"><input type="checkbox" name="weekly" value="1" checked> מייל שבועי עם הסקילים החדשים</label>
          <label class="box"><input type="checkbox" name="beta" value="1"> להיות בודק בטא: לנסות סקילים לפני כולם</label>
        </fieldset>
        <div class="hp" aria-hidden="true"><label for="nonce">אל תמלאו שדה זה</label><input type="text" id="nonce" name="nonce" tabindex="-1" autocomplete="off"></div>
        <altcha-widget id="altcha" auto="onload" hidefooter challengeurl="/api/public/captcha/altcha" strings='{"label":"בודקים שאתם לא רובוט","verifying":"בודקים…","verified":"אומת","waitAlert":"רגע, עוד בודקים…","error":"הבדיקה נכשלה. נסו לרענן את הדף.","expired":"הבדיקה פגה. רעננו את הדף."}'></altcha-widget>
        <button type="submit" class="btn btn-send btn-lg" id="signupBtn">הרשמה</button>
        <p class="signup-err" id="signupErr" role="alert" hidden></p>
        <p class="muted small">אפשר להסיר את עצמכם בכל רגע, בקישור שבתחתית כל מייל.</p>
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
    <h1>מלמדים את ג'מיני פעם אחת.<br class="br-wide"> מקבלים דף עבודה נכון בכל פעם.</h1>
    <p class="lead">סקיל הוא קובץ הוראות קטן שמעלים לג'מיני. מאותו רגע, כשמבקשים כרגיל "דף עבודה בסדרות לכיתה י'", הוא כבר יודע איך עושים את זה טוב: שאלות מדורגות, משוואות שלא נשברות בעברית, ומפתח תשובות שנבדק לפני שהוא מגיע אליכם.</p>
    <ol class="steps">
      <li><span><b>מורידים</b> סקיל או חבילה מהדף הזה</span></li>
      <li><span><b>מעלים</b> אותו לג'מיני, פעם אחת</span></li>
      <li><span><b>מבקשים כרגיל</b>, והסקיל נכנס לפעולה לבד</span></li>
    </ol>
  </div>
  <figure class="qr">
    <img src="/assets/qr.svg" width="140" height="140" alt="קוד QR לכתובת skills.omri-iram.co.il">
    <figcaption>סורקים ופותחים בטלפון</figcaption>
  </figure>
</div></section>

<section class="wrap section" aria-labelledby="h-skills">
  <div class="section-head">
    <h2 id="h-skills">הסקילים</h2>
    <p class="muted">כל סקיל מגיע עם רשימה כנה של מה נבדק ומה עוד לא.</p>
  </div>
  <div class="filters" data-any-subject="${esc(ANY_SUBJECT.join('|'))}">
    <div class="search" role="search">
      <label class="chips-label" for="q">חיפוש</label>
      <input type="search" id="q" class="search-input" placeholder="למשל: מכתב להורים, מצגת, חומצות" autocomplete="off" enterkeyhint="search">
    </div>
    ${chips('who', allWho)}
    ${chips('subject', allSubjects)}
    ${allPlatforms.length > 1 ? chips('platform', allPlatforms) : ''}
    <p class="filter-count muted small" id="count" aria-live="polite"></p>
  </div>
  <ul class="grid" id="grid-main">
    ${mains.map(card).join('\n')}
  </ul>
  ${shared.length ? `<h3 class="sub-head">סקילי עזר <span class="muted">(סקילים אחרים קוראים להם לבד. הם כבר בתוך ההורדה של הסקיל שצריך אותם)</span></h3>
  <ul class="grid" id="grid-shared">
    ${shared.map(card).join('\n')}
  </ul>` : ''}
  <div class="empty" id="empty" hidden>
    <p>אין סקיל שמתאים לחיפוש הזה. אפשר לנסות מילה אחרת, או להציג שוב את כל הסקילים.</p>
    <button type="button" class="btn btn-ghost" id="reset">הצגת כל הסקילים</button>
  </div>
</section>

${bundles.length ? `<section class="wrap section" aria-labelledby="h-bundles">
  <div class="section-head">
    <h2 id="h-bundles">חבילות</h2>
    <p class="muted">סקילים שעובדים יחד, בלחיצה אחת. כל סקיל יורד כקובץ משלו, ומעלים אותו לג'מיני כמו שהוא.</p>
  </div>
  ${bundles.map(bundleCard).join('\n')}
</section>` : ''}

${signupSection}
`;

write('index.html', page({
  title: 'סקילים למורים | עומרי אירם',
  description: 'סקילים לג\'מיני שיוצרים דפי עבודה בעברית במתמטיקה ובמדעים, עם משוואות תקינות ומפתח תשובות שנבדק. הורדה חופשית.',
  canonical: '/',
  body: homeBody,
}));

// ---------- skill pages ----------
const usedBy = (name) => skills.filter((s) => s.requires.includes(name));
const skillLink = (n) => `<a href="/skills/${n}/">${esc(byName.get(n).title)}</a>`;

function installSteps(s, d) {
  const isBundle = d.files.length > 1;
  return `<section class="block" aria-labelledby="h-install">
  <h2 id="h-install">איך מתקינים</h2>
  <h3 class="install-title">בג'מיני</h3>
  <ol class="install">
    ${isBundle
      ? `<li>לוחצים על הכפתור הראשי בדף הזה ויורדים ${filesCount(d.files.length)}. <b>לא פותחים אותם</b>. אם הדפדפן שואל, מאשרים הורדה של כמה קבצים.</li>
    <li>בג'מיני פותחים את <b>הגדרות</b>, ונכנסים ל-<b>סקילים (כישורים)</b>.</li>
    <li>בוחרים <b>העלאת סקיל</b> ובוחרים קובץ אחד. חוזרים על זה לכל קובץ.</li>
    <li>חסר קובץ? אפשר להוריד כל אחד בנפרד: ${d.files.map((n) => `<a href="${zipHref(n)}" download>${esc(byName.get(n).title)}</a>`).join(', ')}.</li>`
      : `<li>מורידים את קובץ ה-zip מהכפתור בדף הזה. <b>לא פותחים אותו</b>.</li>
    <li>בג'מיני פותחים את <b>הגדרות</b>, ונכנסים ל-<b>סקילים (כישורים)</b>.</li>
    <li>בוחרים <b>העלאת סקיל</b> ובוחרים את הקובץ שהורדתם.</li>`}
    <li>פותחים צ'אט חדש ומבקשים כרגיל, למשל: <q>${esc(exampleAsk(s))}</q>.</li>
    <li>ג'מיני ענה בלי הסקיל? כותבים <code dir="ltr">@</code> ואת שם הסקיל בתחילת הבקשה (<code dir="ltr">@${esc(s.name)}</code>), ובוחרים אותו מהרשימה שנפתחת. ככה הוא רץ בוודאות.</li>
    <li>יצאה גרסה חדשה של הסקיל? מורידים שוב, ובהגדרות בוחרים <b>החלפת סקיל</b>. העדכון לא מגיע לבד.</li>
  </ol>
</section>`;
}

function exampleAsk(s) {
  if (s.subjects.includes('כימיה') && s.name.includes('chem')) return "דף עבודה באיזון ניסוחים לכיתה י', כקובץ Word";
  if (s.name.includes('math')) return "דף תרגול בסדרות הנדסיות ל-4 יחידות, כקובץ Word";
  if (s.name.includes('verify')) return 'תבדוק את מפתח התשובות של דף העבודה שהעליתי';
  return 'דף עבודה במשוואות ריבועיות לכיתה ט\', כקובץ Word';
}

function skillPage(s) {
  const d = downloadFor(s);
  const auto = autoBundles.get(s.name);
  const callers = usedBy(s.name);
  const dl = auto
    ? `<div class="dl-box">
    ${dlLink(d.files, 'הורדת הסקיל עם מה שהוא צריך', 'btn btn-primary btn-lg')}
    <p class="card-note">${filesCount(d.files.length)} · ${sizeOf(d.files)} · זה מה שרוב המורים צריכים</p>
    ${dlStatus}
    <p class="dl-alt">יש לכם כבר את סקילי העזר? <a href="${zipHref(s.name)}" download>הורדת הסקיל הזה בלבד</a> (${sizeOf(s.name)})</p>
  </div>`
    : `<div class="dl-box">
    ${dlLink(d.files, 'הורדת הסקיל', 'btn btn-primary btn-lg')}
    <p class="card-note">קובץ zip · ${sizeOf(d.files)}</p>
  </div>`;

  const body = `
<div class="wrap skill">
  <nav class="crumbs" aria-label="מיקום"><a href="/">כל הסקילים</a> <span aria-hidden="true">‹</span> <span>${esc(s.title)}</span></nav>
  <header class="skill-head">
    <div>
      <p class="eyebrow">${s.role === 'shared' ? 'סקיל עזר' : 'סקיל'} · ${esc(s.audience)}</p>
      <h1>${esc(s.title)}</h1>
      <p class="meta-line">גרסה <bdi dir="ltr">${esc(s.version)}</bdi> · עודכן ${fmtDate(s.updated)} · <code dir="ltr">${esc(s.name)}</code></p>
      <div class="tags">${s.subjects.map((x) => tag(x, 'tag-subject')).join('')}${platformTags(s)}</div>
    </div>
    ${dl}
  </header>

  <div class="skill-grid">
    <div class="skill-main">
      <section class="block" aria-labelledby="h-problem">
        <h2 id="h-problem">הבעיה שהוא פותר</h2>
        <p>${esc(s.problem)}</p>
      </section>
      <section class="block" aria-labelledby="h-what">
        <h2 id="h-what">מה הוא עושה</h2>
        <p>${esc(s.what_it_does)}</p>
      </section>
      <section class="block" aria-labelledby="h-out">
        <h2 id="h-out">מה יוצא ממנו</h2>
        <p class="output">${esc(s.output)}</p>
      </section>

      <section class="block trust" aria-labelledby="h-trust">
        <h2 id="h-trust">מה נבדק ומה עוד לא</h2>
        <p class="muted">בדקתי כל סקיל בשימוש אמיתי לפני שהעליתי אותו. זה מה שראיתי, כולל מה שעוד לא עובד מושלם.</p>
        <div class="trust-cols">
          <div class="trust-ok">
            <h3><span class="ico" aria-hidden="true">✓</span> נבדק ועבד${shown(s.tested_on).length ? ` (${esc(shown(s.tested_on).join(', '))})` : ''}</h3>
            <ul>${s.tested.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div class="trust-warn">
            <h3><span class="ico" aria-hidden="true">!</span> עוד לא, או שכדאי לדעת</h3>
            <ul>${s.limitations.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </div>
        ${shown(s.compatible).filter((p) => !s.tested_on.includes(p)).length ? `<p class="muted small">${shown(s.compatible).filter((p) => !s.tested_on.includes(p)).map((p) => `ב-<bdi>${esc(p)}</bdi>`).join(' ו')} זה אותו פורמט ואמור לעבוד, אבל עוד לא בדקתי שם.</p>` : ''}
      </section>

      ${installSteps(s, d)}

      <p class="signup-link"><a href="/#signup">רוצים מייל שבועי עם הסקילים החדשים, או לנסות סקילים לפני כולם? להרשמה</a></p>

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
        <p class="muted small">הסקיל הזה קורא לסקילים האלה. ההורדה הראשית כוללת אותם.</p>
        <ul>${s.requires.map((n) => `<li>${skillLink(n)}</li>`).join('')}</ul>
      </section>` : ''}
      ${callers.length ? `<section class="side-box">
        <h2>סקילים שמשתמשים בו</h2>
        <ul>${callers.map((c) => `<li>${skillLink(c.name)}</li>`).join('')}</ul>
      </section>` : ''}
      ${bundles.filter((b) => b.skills.includes(s.name)).map((b) => `<section class="side-box">
        <h2>נמצא בחבילה</h2>
        <p><b>${esc(b.title)}</b></p>
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
skills.forEach(skillPage);

// ---------- 404, robots, sitemap ----------
write('404.html', page({
  title: 'הדף לא נמצא | סקילים למורים',
  description: 'הדף לא נמצא',
  canonical: '/',
  body: `<div class="wrap section"><h1>הדף הזה לא קיים</h1><p><a href="/">חזרה לכל הסקילים</a></p></div>`,
}));
// skills.json: read every Thursday by Listmonk's scripts/skills_weekly_draft.py (the weekly email).
write('skills.json', JSON.stringify({
  skills: skills.map((s) => ({
    name: s.name, title: s.title, version: s.version, updated: s.updated,
    role: s.role, problem: firstSentence(s.problem),
  })),
}, null, 1));
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc></url>
${skills.map((s) => `<url><loc>${SITE}/skills/${s.name}/</loc><lastmod>${s.updated}</lastmod></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${skills.length} skills, ${bundles.length + autoBundles.size} bundles into dist/.`);
