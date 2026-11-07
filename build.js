// Builds the whole site into dist/: the home page, one page per skill, a zip per skill
// and per bundle. Fails with a clear list of problems if a skill does not pass the checks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import QRCode from 'qrcode';
import { loadSkills } from './lib/skills.js';

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
const platformsOf = (s) => [...new Set([...s.tested_on, ...s.compatible])];
const zipHref = (id) => `/downloads/${id}.zip`;
const sizeOf = (id) => {
  const kb = fs.statSync(path.join(DIST, 'downloads', `${id}.zip`)).size / 1024;
  return `${Math.max(1, Math.round(kb))}KB`;
};
const write = (rel, content) => {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

function makeZip(id, names) {
  const tree = {};
  for (const n of names) {
    // One folder named exactly like the skill, with SKILL.md inside. That is what Gemini expects.
    tree[`${n}/`] = [new Uint8Array(0), { mtime: ZIP_TIME }];
    tree[`${n}/SKILL.md`] = [new Uint8Array(byName.get(n).raw), { mtime: ZIP_TIME, level: 9 }];
  }
  write(`downloads/${id}.zip`, zipSync(tree));
}

// ---------- clean and copy assets ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });

// ---------- zips ----------
for (const s of skills) makeZip(s.name, [s.name]);
for (const b of bundles) makeZip(b.id, b.skills);
for (const b of autoBundles.values()) makeZip(b.id, b.skills);

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
    ...s.tested_on.map((p) => tag(`נבדק ב-${p}`, 'tag-tested')),
    ...s.compatible.filter((p) => !s.tested_on.includes(p)).map((p) => tag(`מתאים ל-${p}`, 'tag-compat')),
  ].join('');
}

function downloadFor(s) {
  const auto = autoBundles.get(s.name);
  if (auto) {
    const extra = auto.skills.length - 1;
    return {
      href: zipHref(auto.id), id: auto.id,
      label: 'הורדה',
      note: `כולל ${extra === 1 ? 'סקיל עזר אחד' : extra === 2 ? 'שני סקילי עזר' : `${extra} סקילי עזר`} שהוא צריך`,
    };
  }
  return { href: zipHref(s.name), id: s.name, label: 'הורדה', note: 'קובץ zip אחד' };
}

// ---------- home ----------
function card(s) {
  const d = downloadFor(s);
  return `<li class="card" data-subjects="${esc(s.subjects.join('|'))}" data-platforms="${esc(platformsOf(s).join('|'))}">
  <h3 class="card-title"><a href="/skills/${s.name}/">${esc(s.title)}</a></h3>
  <p class="card-problem">${esc(firstSentence(s.problem))}</p>
  <div class="tags">${s.subjects.map((x) => tag(x, 'tag-subject')).join('')}${platformTags(s)}</div>
  <div class="card-actions">
    <a class="btn btn-primary" href="${d.href}" download aria-label="הורדת ${esc(s.title)} (${esc(d.note)})">${d.label}</a>
    <a class="btn btn-ghost" href="/skills/${s.name}/">מה בדיוק הוא עושה</a>
  </div>
  <p class="card-note">${esc(d.note)} · ${sizeOf(d.id)}</p>
</li>`;
}

function bundleCard(b) {
  const items = b.skills.map((n) => `<li><a href="/skills/${n}/">${esc(byName.get(n).title)}</a></li>`).join('');
  return `<article class="bundle">
  <div class="bundle-text">
    <p class="eyebrow">חבילה · ${b.skills.length} סקילים בהורדה אחת</p>
    <h3>${esc(b.title)}</h3>
    <p>${esc(b.description)}</p>
    <ul class="bundle-list">${items}</ul>
  </div>
  <div class="bundle-cta">
    <a class="btn btn-primary btn-lg" href="${zipHref(b.id)}" download>הורדת החבילה</a>
    <span class="card-note">${sizeOf(b.id)} · zip</span>
  </div>
</article>`;
}

const mains = skills.filter((s) => s.role === 'main');
const shared = skills.filter((s) => s.role === 'shared');
const allSubjects = [...new Set(skills.flatMap((s) => s.subjects))];
const allPlatforms = [...new Set(skills.flatMap(platformsOf))];
const chips = (group, values) => `<div class="chips" role="group" aria-labelledby="f-${group}">
  <span class="chips-label" id="f-${group}">${group === 'subject' ? 'מקצוע' : 'פלטפורמה'}</span>
  <button type="button" class="chip" data-filter="${group}" data-value="" aria-pressed="true">הכל</button>
  ${values.map((v) => `<button type="button" class="chip" data-filter="${group}" data-value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('\n  ')}
</div>`;

const homeBody = `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-text">
    <h1>מלמדים את ג'מיני פעם אחת.<br class="br-wide"> מקבלים דף עבודה נכון בכל פעם.</h1>
    <p class="lead">סקיל הוא קובץ הוראות קטן שמעלים לג'מיני (או ל-Claude ול-ChatGPT). מאותו רגע, כשמבקשים כרגיל "דף עבודה בסדרות לכיתה י'", הוא כבר יודע איך עושים את זה טוב: שאלות מדורגות, משוואות שלא נשברות בעברית, ומפתח תשובות שנבדק לפני שהוא מגיע אליכם.</p>
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
  <div class="filters">
    ${chips('subject', allSubjects)}
    ${chips('platform', allPlatforms)}
  </div>
  <ul class="grid" id="grid-main">
    ${mains.map(card).join('\n')}
  </ul>
  ${shared.length ? `<h3 class="sub-head">סקילי עזר <span class="muted">(סקילים אחרים קוראים להם לבד. הם כבר בתוך ההורדה של הסקיל שצריך אותם)</span></h3>
  <ul class="grid" id="grid-shared">
    ${shared.map(card).join('\n')}
  </ul>` : ''}
  <p class="empty" id="empty" hidden>אין סקיל שמתאים לשני הסינונים יחד. נסו "הכל" באחד מהם.</p>
</section>

${bundles.length ? `<section class="wrap section" aria-labelledby="h-bundles">
  <div class="section-head">
    <h2 id="h-bundles">חבילות</h2>
    <p class="muted">סקילים שעובדים יחד, בהורדה אחת.</p>
  </div>
  ${bundles.map(bundleCard).join('\n')}
</section>` : ''}
`;

write('index.html', page({
  title: 'סקילים למורים | עומרי אירם',
  description: 'סקילים לג\'מיני, Claude ו-ChatGPT שיוצרים דפי עבודה בעברית במתמטיקה ובמדעים, עם משוואות תקינות ומפתח תשובות שנבדק. הורדה חופשית.',
  canonical: '/',
  body: homeBody,
}));

// ---------- skill pages ----------
const usedBy = (name) => skills.filter((s) => s.requires.includes(name));
const skillLink = (n) => `<a href="/skills/${n}/">${esc(byName.get(n).title)}</a>`;

function installSteps(s, d) {
  const isBundle = d.id !== s.name;
  return `<section class="block" aria-labelledby="h-install">
  <h2 id="h-install">איך מתקינים</h2>
  <h3 class="install-title">בג'מיני</h3>
  <ol class="install">
    ${isBundle
      ? `<li>מורידים את הקובץ מהכפתור הראשי בדף הזה. יש בו ${d.count} סקילים, כל אחד בתיקייה משלו.</li>
    <li>מחלצים את הקובץ במחשב (קליק ימני, <b>חילוץ הכל</b>). בכל תיקייה יש קובץ <bdi dir="ltr">SKILL.md</bdi> אחד.</li>
    <li>בג'מיני פותחים את <b>הגדרות</b>, ונכנסים ל-<b>סקילים (כישורים)</b>.</li>
    <li>בוחרים <b>העלאת סקיל</b> ומעלים את <bdi dir="ltr">SKILL.md</bdi> מהתיקייה הראשונה. חוזרים על זה לכל תיקייה. ${d.others.map((n) => `<a href="${zipHref(n)}" download>${esc(byName.get(n).title)}</a>`).join(', ')}: אפשר גם להוריד כל אחד מהם כ-zip נפרד ולהעלות אותו כמו שהוא.</li>`
      : `<li>מורידים את קובץ ה-zip מהכפתור בדף הזה. <b>לא פותחים אותו</b>.</li>
    <li>בג'מיני פותחים את <b>הגדרות</b>, ונכנסים ל-<b>סקילים (כישורים)</b>.</li>
    <li>בוחרים <b>העלאת סקיל</b> ובוחרים את הקובץ שהורדתם.</li>`}
    <li>פותחים צ'אט חדש ומבקשים כרגיל, למשל: <q>${esc(exampleAsk(s))}</q>. אין צורך לקרוא לסקיל בשם.</li>
    <li>יצאה גרסה חדשה של הסקיל? מורידים שוב, ובהגדרות בוחרים <b>החלפת סקיל</b>. העדכון לא מגיע לבד.</li>
  </ol>
  <div class="install-other">
    <div>
      <h3 class="install-title">ב-Claude</h3>
      <p>אותו קובץ zip בדיוק. ב-claude.ai: <b>הגדרות</b>, <b>יכולות</b>, ובאזור הסקילים מעלים את הקובץ.</p>
    </div>
    <div>
      <h3 class="install-title">ב-ChatGPT</h3>
      <p>אותו פורמט <bdi dir="ltr">SKILL.md</bdi>. אם אין אצלכם עדיין העלאת סקילים, מדביקים את התוכן של <bdi dir="ltr">SKILL.md</bdi> (בתחתית הדף) בהוראות של פרויקט או של GPT מותאם.</p>
    </div>
  </div>
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
  d.count = auto ? auto.skills.length : 1;
  d.others = auto ? [s.name, ...auto.skills.slice(1)] : [];
  const callers = usedBy(s.name);
  const dl = auto
    ? `<div class="dl-box">
    <a class="btn btn-primary btn-lg" href="${d.href}" download>הורדת הסקיל עם מה שהוא צריך</a>
    <p class="card-note">${d.count} סקילים בקובץ אחד · ${sizeOf(d.id)} · זה מה שרוב המורים צריכים</p>
    <p class="dl-alt">יש לכם כבר את סקילי העזר? <a href="${zipHref(s.name)}" download>הורדת הסקיל הזה בלבד</a> (${sizeOf(s.name)})</p>
  </div>`
    : `<div class="dl-box">
    <a class="btn btn-primary btn-lg" href="${d.href}" download>הורדת הסקיל</a>
    <p class="card-note">קובץ zip · ${sizeOf(d.id)}</p>
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
            <h3><span class="ico" aria-hidden="true">✓</span> נבדק ועבד${s.tested_on.length ? ` (${esc(s.tested_on.join(', '))})` : ''}</h3>
            <ul>${s.tested.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div class="trust-warn">
            <h3><span class="ico" aria-hidden="true">!</span> עוד לא, או שכדאי לדעת</h3>
            <ul>${s.limitations.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </div>
        ${s.compatible.filter((p) => !s.tested_on.includes(p)).length ? `<p class="muted small">${s.compatible.filter((p) => !s.tested_on.includes(p)).map((p) => `ב-<bdi>${esc(p)}</bdi>`).join(' ו')} זה אותו פורמט ואמור לעבוד, אבל עוד לא בדקתי שם.</p>` : ''}
      </section>

      ${installSteps(s, d)}

      <section class="block" aria-labelledby="h-source">
        <h2 id="h-source">מה כתוב בסקיל</h2>
        <details class="source">
          <summary>הצגת הקובץ <bdi dir="ltr">SKILL.md</bdi></summary>
          <div class="source-bar">
            <button type="button" class="btn btn-ghost btn-sm" data-copy="src-${s.name}">העתקה</button>
            <span class="copy-status" role="status" aria-live="polite"></span>
          </div>
          <pre class="source-pre" id="src-${s.name}" tabindex="0">${esc(s.text)}</pre>
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
        <a class="btn btn-ghost btn-sm" href="${zipHref(b.id)}" download>הורדת החבילה (${b.skills.length} סקילים)</a>
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
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc></url>
${skills.map((s) => `<url><loc>${SITE}/skills/${s.name}/</loc><lastmod>${s.updated}</lastmod></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${skills.length} skills, ${bundles.length + autoBundles.size} bundles into dist/.`);
