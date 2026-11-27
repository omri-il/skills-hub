---
name: create-integrated-lesson
description: בונה ב-Canvas דף שיעור אינטראקטיבי אחד, בעברית, שעובד בטלפון, לשיעור של 45 דקות במתמטיקה או במדעים, לחטיבת הביניים ולתיכון. בדף יש הקניה עם דוגמה פתורה צעד אחר צעד, תרגול מתוקשב עם בדיקה עצמית ורמזים, שאלת חקר לזוגות, כרטיס יציאה, ובדיקה למורה עם כל התשובות. בחרוט יש בדף גם יישומון שהתלמיד מסובב, משנה ופורס. השתמש כשמורה או מרצה מבקש "שיעור משולב", "מערך שיעור", "שיעור שלם", "חוויית למידה", "הקניה, תרגול וסיכום", "תרגול מתוקשב", "שאלת חקר" או "כרטיס יציאה" על נושא, למשל "שיעור משולב על נפח ושטח פנים של חרוט לכיתה ט'". לא לדף עבודה להדפסה (create-math-practice), לא למצגת (create-lesson-slides), ולא ליישומון לבד בלי שיעור.
---

# דף שיעור משולב

**התוצר הוא דף אחד ב-Canvas: כל השיעור בתוכו.** הקניה, יישומון (בחרוט), תרגול עם בדיקה עצמית, שאלת חקר לזוגות וכרטיס יציאה. המורה מקרין אותו בכיתה, והתלמידים פותחים אותו בטלפון. בצ'אט כותבים רק 3 שורות.

**העבודה שלך קטנה: למלא את החלק `← למלא` בקוד. את כל השאר מעתיקים אות באות.** הקוד נבדק בדפדפן ובטלפון: בדיקה עצמית, רמז אחרי טעות, פתרון אחרי 2 טעויות, עברית ונוסחאות באותה שורה בסדר נכון, ויישומון חרוט שהנוסחאות שלו מתאימות לציור.

**אסור:**
- לכתוב מערך שיעור בצ'אט: טבלה של שלבים, שיעור כפול, 90 דקות, רשימת מטרות. הכול נכנס לדף.
- `$`, LaTeX או נוסחה מעוצבת, בדף ובצ'אט. נוסחה כותבים בטקסט רגיל: `V = π·r²·h / 3`.
- להפנות לכלי אחר: GeoGebra, Quizizz, Kahoot, דף עבודה להדפסה, דגמים מפלסטיק.
- לכתוב דף או יישומון חדש במקום השלד, או לענות בהמחשה החזותית המובנית של Gemini.
- לסיים בהצעות כמו "איך תרצה להמשיך?".

## קודם מזהים את המצב

| המצב | מה עושים |
|---|---|
| **יש נושא** ("שיעור משולב על נפח החרוט לכיתה ט'") | בונים מיד. לא שואלים. כיתה חסרה? בוחרים כיתה מתאימה וכותבים אותה ב"מה נקבע". |
| **אין נושא** ("תבנה לי מערך שיעור") | הודעה אחת, עד 2 שאלות: "1. איזה נושא ואיזו כיתה? 2. מה התלמידים צריכים לדעת לעשות בסוף השיעור?". לא כותבים קוד. אחרי התשובה בונים, ולא שואלים שוב. |
| **הנושא הוא חרוט** (נפח, שטח פנים, פריסה, קו יוצר) | `APPLET = true`. היישומון נכנס לדף אחרי ההקניה. שאלות התרגול על מידות שהתלמיד יכול לבדוק ביישומון. |
| **כל נושא אחר** (גליל, משוואות, צפיפות, מהירות, אחוזים...) | `APPLET = false`. הדף בלי יישומון. ב"מה נקבע" כותבים: "יישומון מוכן יש כרגע רק לחרוט". לא כותבים יישומון חדש. |

## מה ממלאים בקוד, ורק את זה

- **`APPLET`:** `true` רק בחרוט. אחרת `false`.
- **`UNIT`:** `'cm'` (או `'m'`). משמש רק את היישומון.
- **`TEXT.title`, `TEXT.goal`:** הנושא, ומשפט אחד "מה לומדים:".
- **ההקניה (15 דקות):**
  - `opening`: שאלת פתיחה אחת שמעוררת סקרנות.
  - `teach`: 3-5 שורות: המושגים והנוסחאות, כל אחד בשורה.
  - `example`: דוגמה פתורה אחת: `title` עם הנתונים, ו-`steps` של 3-5 צעדים (הנוסחה, ההצבה, החישוב, התשובה עם יחידות).
  - `mistake`: טעות נפוצה אחת, ואיך מזהים אותה.
- **`TEXT.question`, `TEXT.options`:** שאלת ניחוש לפני שמשנים ביישומון, ו-3 תשובות (אחת נכונה, 2 תפיסות שגויות, הנכונה לא תמיד ראשונה). בלי יישומון משאירים אותן כמו שהן: הן לא מוצגות.
- **`TEXT.howto`:** איך עונים בדף. בשאלות עם מספר משאירים את המשפט על π ועל העיגול.
- **`QUESTIONS`, התרגול (15 דקות):** 4-6 שאלות, מהקל לקשה. לכל שאלה:
  - `q`: השאלה. `tip`: רמז שמראה את הדרך, לא את התשובה. `sol`: הפתרון בשורה אחת.
  - **שאלה עם מספר:** `unit` (למשל `'cm³'`, `'°'`, `'m/s'`) ו-`ans`. **`ans` הוא חישוב ב-JavaScript מהנתונים שבשאלה**, למשל `Math.PI * 3 ** 2 * 4 / 3` או `Math.hypot(3, 4)`. לא מספר שחישבת בראש. הדף מקבל תשובה בהפרש של עד 1%, וגם `12π`.
  - **שאלה בלי מספר:** `choices` עם 3 תשובות, ו-`ans` הוא המספר של הנכונה: 0, 1 או 2. בלי `unit`.
- **`research` (10 דקות):** שאלת חקר לזוגות, בלי התשובה. שאלה טובה לא נפתרת בהצבה אחת בנוסחה: התלמידים משנים, משווים ומחפשים כלל. **`researchAnswer`:** התשובה, ורמז לזוג שנתקע. מוצגת רק ב"בדיקה למורה".
- **`exit` (5 דקות):** 3 שאלות: חישוב, הבנה ("למה..."), ו"מה עוד לא ברור לי". לכל אחת `a`, התשובה למורה.

**עברית ונוסחאות:**
- כל טקסט בעברית בתוך backticks.
- נוסחה בטקסט רגיל: `V = π·r²·h / 3`, `l = √(r² + h²)`. הדף שומר אותה משמאל לימין בתוך המשפט.
- מילים של הנושא בכתיב הנכון. בחרוט: קו יוצר, גזרה, מעטפת, פריסה, בסיס, שטח פנים, נפח.

## מה כותבים בצ'אט: 3 שורות בלבד

1. **מה נקבע:** נושא, כיתה, 45 דקות, ומה התלמיד יודע לעשות בסוף.
2. **לפני הכיתה:** "ללחוץ על 'בדיקה למורה': לבדוק שיש ✓, לפתור שאלה אחת ביד ולהשוות, ולנסות את הדף בטלפון."
3. **לשלוח לתלמידים:** "בחשבון של בית ספר אין קישור לשיתוף ב-Canvas. הסקיל sites-student-app מסביר איך שולחים דרך Google Sites. את כרטיס היציאה אפשר להדביק גם ב-Google Forms."

## הקוד: תמיד השלד הזה

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>שיעור משולב</title>
<style>
  [hidden] { display: none !important; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 17px/1.5 system-ui, Arial, sans-serif; background: #f4f6f9; color: #1d2433; }
  main { max-width: 720px; width: 100%; margin: 0 auto; padding: 12px; }
  h1 { font-size: 1.4em; margin: 4px 0; } h2 { font-size: 1.15em; margin: 0 0 6px; } h3 { font-size: 1em; margin: 10px 0 4px; } #teach p { margin: 4px 0; }
  .card { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
  canvas { width: 100%; aspect-ratio: 1 / 1; max-height: 70vh; display: block; background: #0f1b2d; border-radius: 10px; touch-action: none; cursor: grab; }
  .hint { font-size: .85em; color: #5a6478; margin: 4px 0 0; }
  button { font: inherit; min-height: 44px; padding: 0 16px; border-radius: 10px; border: 1px solid #b8c2d6; background: #fff; cursor: pointer; }
  .opt { display: block; width: 100%; text-align: start; margin: 6px 0; }
  .opt.chosen { background: #dbe7ff; border-color: #2f5fd0; }
  label { display: block; margin-top: 8px; }
  input[type=range] { width: 100%; }
  input:disabled { opacity: .4; }
  .vals { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
  .val { background: #f4f6f9; border-radius: 8px; padding: 8px; }
  .formula { font-family: ui-monospace, Consolas, monospace; direction: ltr; unicode-bidi: isolate; }
  .ok { color: #1c7c3a; } .bad { color: #b3261e; font-weight: bold; }
  table { border-collapse: collapse; width: 100%; font-size: .9em; } td, th { border: 1px solid #ccd; padding: 4px; text-align: center; }
  .qa { border-top: 1px solid #e3e7ef; padding: 10px 0; }
  .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 6px; }
  .row input { font: inherit; width: 9em; min-height: 44px; padding: 0 10px; border: 1px solid #b8c2d6; border-radius: 10px; }
  .tip { background: #fff6dd; border-radius: 8px; padding: 6px 10px; margin-top: 6px; }
  #score { font-weight: bold; }
  bdi { display: inline-block; } td { unicode-bidi: plaintext; } #teacher { overflow-x: auto; }
</style>
</head>
<body>
<main>
  <h1 id="title"></h1>
  <p id="goal"></p>

  <section class="card">
    <h2>1. לומדים</h2>
    <p><strong id="opening"></strong></p>
    <div id="teach"></div>
    <h3 id="exTitle"></h3>
    <ol id="exSteps"></ol>
    <p class="tip" id="mistake"></p>
  </section>

  <div id="applet" hidden>
    <h2 class="card">2. מנסים ביישומון</h2>
    <section class="card" id="predict">
      <div>ניחוש לפני שמשנים</div>
      <strong id="q"></strong>
      <div id="opts"></div>
    </section>
    <canvas id="cv"></canvas>
    <p class="hint">לגרור את הגוף כדי לסובב אותו.</p>
    <section class="card">
      <div id="sliders"></div>
      <label id="unfoldBox">פריסה: <bdi id="unfoldVal">0%</bdi>
        <input type="range" id="unfold" min="0" max="100" step="1" value="0" dir="ltr"></label>
    </section>
    <section class="card vals" id="vals"></section>
    <section class="card"><strong>הנוסחאות</strong><div id="formulas"></div></section>
    <section class="card" id="after" hidden>
      <p id="afterText"></p>
      <p><strong>מה ראיתם? למה זה קרה?</strong></p>
    </section>
  </div>

  <section class="card">
    <h2 id="practiceTitle">תרגול עם בדיקה עצמית</h2>
    <p class="hint" id="howto"></p>
    <div id="practice"></div>
    <p id="score"></p>
  </section>

  <section class="card" id="researchBox">
    <h2>שאלת חקר בזוגות</h2>
    <p id="research"></p>
  </section>

  <section class="card">
    <h2>כרטיס יציאה</h2>
    <p class="hint">עונים לבד, במחברת או בטופס שהמורה שולח.</p>
    <ol id="exit"></ol>
  </section>

  <section class="card">
    <button id="teacherBtn">בדיקה למורה</button>
    <div id="teacher" hidden></div>
  </section>
</main>
<script>
// ===== 1. התוכן  ← למלא =====
const APPLET = true;   // true רק כשהנושא הוא חרוט. בכל נושא אחר: false
const UNIT = 'cm';
const TEXT = {
  title: `החרוט: נפח ושטח פנים`,
  goal: `מה לומדים: איך מחשבים את הנפח ואת שטח הפנים של חרוט, ומה קורה לנפח כשמכפילים את הרדיוס.`,
  // ההקניה: שאלת פתיחה, 3-5 שורות של מושגים ונוסחאות, דוגמה פתורה צעד אחר צעד, וטעות נפוצה
  opening: `כמה חרוטי גלידה מלאים צריך כדי למלא כוס גלילית באותו רוחב ובאותו גובה?`,
  teach: [
    `r הוא רדיוס הבסיס, h הוא הגובה, ו-l הוא הקו היוצר: הקו מהקודקוד לשפת הבסיס.`,
    `r, h ו-l יוצרים משולש ישר זווית, ולכן l = √(r² + h²).`,
    `הנפח הוא שליש מנפח הגליל עם אותו בסיס ואותו גובה: V = π·r²·h / 3.`,
    `שטח הפנים הוא הבסיס ועוד המעטפת: S = π·r² + π·r·l.`,
    `בפריסה, המעטפת היא גזרה של עיגול ברדיוס l, בזווית α = 360°·r / l.`,
  ],
  example: { title: `דוגמה פתורה: חרוט עם r = 6 ס"מ ו-h = 8 ס"מ`, steps: [
    `הקו היוצר: l = √(6² + 8²) = √100 = 10 ס"מ.`,
    `הנפח: V = π·6²·8 / 3 = 96π ≈ 301.6 סמ"ק.`,
    `שטח הפנים: S = π·6² + π·6·10 = 36π + 60π = 96π ≈ 301.6 סמ"ר.`,
    `התשובה: הנפח ≈ 301.6 סמ"ק, ושטח הפנים ≈ 301.6 סמ"ר. אותו מספר, אבל יחידות שונות.`,
  ] },
  mistake: `טעות נפוצה: להציב את h במקום l בנוסחת המעטפת. בודקים: l תמיד ארוך מ-h.`,
  question: `אם מכפילים את רדיוס הבסיס פי 2 והגובה נשאר, הנפח גדל פי...`,
  options: [`פי 2`, `פי 4`, `פי 8`],
  howto: `כותבים מספר ולוחצים "לבדוק". מותר π = 3.14, ומותר לכתוב גם 12π. עיגול ל-2 ספרות אחרי הנקודה מספיק.`,
  research: `מצאו ביישומון חרוט שהגזרה שלו היא בדיוק חצי עיגול (α = 180°). מה היחס בין l ל-r? בדקו עוד 2 חרוטים כאלה. האם היחס תמיד זהה? למה?`,
  researchAnswer: `l = 2·r תמיד, כי α = 360°·r / l = 180° רק כש-l = 2·r. רמז לזוג שנתקע: לשים r = 2 ולחפש h.`,
  // כרטיס יציאה: 3 שאלות (חישוב, הבנה, ומה עוד לא ברור), ולכל אחת התשובה למורה
  exit: [
    { q: `חשבו את הנפח של חרוט עם r = 3 ו-h = 10.`, a: `V = π·9·10 / 3 = 30π ≈ 94.2 סמ"ק` },
    { q: `למה בנוסחת הנפח מחלקים ב-3?`, a: `כי 3 חרוטים ממלאים גליל עם אותו בסיס ואותו גובה` },
    { q: `מה עוד לא ברור לי בחרוט?`, a: `שאלה פתוחה. כדאי לקרוא לפני השיעור הבא` },
  ],
};
// התרגול: 4-6 שאלות, מהקל לקשה. שאלה עם מספר: ans הוא חישוב ב-JavaScript, לא מספר שחישבת בראש.
// שאלה בלי מספר: choices: [3 תשובות], ו-ans הוא המספר של הנכונה (0, 1 או 2), בלי unit
const QUESTIONS = [
  { q: `לחרוט רדיוס בסיס 3 ס"מ וגובה 4 ס"מ. מה אורך הקו היוצר l?`, unit: 'cm', ans: Math.hypot(3, 4),
    tip: `הקו היוצר הוא היתר במשולש ישר זווית עם הצלעות r ו-h. l = √(r² + h²)`, sol: `l = √(3² + 4²) = √25 = 5 ס"מ` },
  { q: `מה הנפח של אותו חרוט (r = 3, h = 4)?`, unit: 'cm³', ans: Math.PI * 3 ** 2 * 4 / 3,
    tip: `V = π·r²·h / 3`, sol: `V = π·9·4 / 3 = 12π ≈ 37.70 סמ"ק` },
  { q: `מה שטח הפנים של אותו חרוט?`, unit: 'cm²', ans: Math.PI * 3 ** 2 + Math.PI * 3 * 5,
    tip: `S = π·r² + π·r·l, ו-l כבר חישבתם בשאלה 1`, sol: `S = 9π + 15π = 24π ≈ 75.40 סמ"ר` },
  { q: `מכפילים את הרדיוס ל-6 ס"מ, והגובה נשאר 4. מה הנפח החדש?`, unit: 'cm³', ans: Math.PI * 6 ** 2 * 4 / 3,
    tip: `הרדיוס בריבוע: כשהרדיוס גדל פי 2, r² גדל פי 4`, sol: `V = π·36·4 / 3 = 48π ≈ 150.80 סמ"ק, פי 4 מ-12π` },
  { q: `מה זווית הגזרה α בפריסה של החרוט עם r = 3 ו-l = 5? (במעלות)`, unit: '°', ans: 360 * 3 / 5,
    tip: `α = 360°·r / l`, sol: `α = 360·3 / 5 = 216°` },
];

// ===== 2. היישומון של החרוט: לא משנים מכאן =====
const TAU = 2 * Math.PI, N = 96;
const ring = (i) => Math.PI / 2 - Math.PI + TAU * i / N;
const G = {
  sliders: [{ id: 'r', label: `רדיוס הבסיס r`, min: 1, max: 5, step: 0.5, value: 2 }, { id: 'h', label: `גובה h`, min: 1, max: 8, step: 0.5, value: 4 }],
  formulas: [`l = √(r² + h²)`, `S = π·r² + π·r·l`, `V = π·r²·h / 3`, `α = 360°·r / l`],
  view: (m) => ({ solid: Math.max(2 * m.r, m.h), net: 2 * m.r + Math.hypot(m.r, m.h) }),
  measures(p) { const l = Math.hypot(p.r, p.h), S = Math.PI * p.r * p.r + Math.PI * p.r * l, V = Math.PI * p.r * p.r * p.h / 3;
    return { area: S, volume: V, show: [[`קו יוצר l`, l, UNIT], [`זווית הגזרה α`, 360 * p.r / l, '°'], [`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
  height: (p) => p.h,
  section: (p, z) => Math.PI * (p.r * (1 - z / p.h)) ** 2,
  faces(p) { const l = Math.hypot(p.r, p.h), F = [], base = [];
    for (let i = 0; i < N; i++) { const x = p.r * Math.cos(ring(i)), y = p.r * Math.sin(ring(i)); base.push({ a: [x, y, 0], n: [x, y] }); }
    F.push({ color: '#ffc250', pts: base.slice().reverse(), edge: false });
    const apex = { a: [0, 0, p.h], n: [0, p.r + l] };
    const arc = (i) => { const b = -Math.PI / 2 + (ring(i) - Math.PI / 2) * p.r / l;
      return { a: [p.r * Math.cos(ring(i)), p.r * Math.sin(ring(i)), 0], n: [l * Math.cos(b), p.r + l + l * Math.sin(b)] }; };
    for (let i = 0; i < N; i++) F.push({ color: '#5aa0ff', pts: [apex, arc(i), arc(i + 1)], edge: false });
    return F; },
  guides: (p) => [{ from: [0, 0, 0], to: [0, 0, p.h], label: 'h' }, { from: [0, 0, 0], to: [p.r, 0, 0], label: 'r' }],
};
const SLIDERS = G.sliders.map(s => ({ ...s, unit: UNIT }));
const VIEW = (() => { const m = Object.fromEntries(SLIDERS.map(s => [s.id, s.max])), v = G.view(m); return { solid: 1.2 * v.solid, net: 1.2 * v.net }; })();
const measures = (p) => G.measures(p), height = (p) => G.height(p), section = (p, z) => G.section(p, z), faces = (p) => G.faces(p), guides = (p) => G.guides(p);
function afterText(p0, p) {
  const ch = SLIDERS.filter(s => p0[s.id] !== p[s.id]).map(s => `${s.label}: מ-${nu(p0[s.id], UNIT)} ל-${nu(p[s.id], UNIT)}`).join('. ');
  const m0 = measures(p0), m1 = measures(p);
  return `${ch}. הנפח עבר מ-${nu(m0.volume, UNIT + '³')} ל-${nu(m1.volume, UNIT + '³')}, פי ${nu(m1.volume / m0.volume)}. ` +
         `שטח הפנים עבר מ-${nu(m0.area, UNIT + '²')} ל-${nu(m1.area, UNIT + '²')}, פי ${nu(m1.area / m0.area)}.`;
}

// ===== 3. השלד: לא משנים מכאן =====
let P = {}, P0 = null, guess = null, yaw = 0.6, pitch = 1.05, T = 0, offScreen = false;
const el = (id) => document.getElementById(id);
const fmt = (x) => (typeof x !== 'number' || !isFinite(x)) ? '—' : Number.isInteger(x) ? String(x) : (Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2));
const nu = (x, u) => '⁦' + fmt(x) + (u ? (u === '°' ? '' : ' ') + u : '') + '⁩';
const numUnit = (x, u) => { const b = document.createElement('bdi'); b.dir = 'ltr'; b.textContent = fmt(x) + (u ? (u === '°' ? '' : ' ') + u : ''); return b; };
const lerp = (a, b, t) => a + (b - a) * t;
function pos(pt, t) { const n = pt.n || pt.a; return [lerp(pt.a[0], n[0], t), lerp(pt.a[1], n[1], t), lerp(pt.a[2], 0, t)]; }
const camT = () => Math.min(1, T / 0.4), netT = () => Math.max(0, (T - 0.4) / 0.6);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function view(v) { const yy = lerp(wrap(yaw), 0, camT()), c = Math.cos(yy), s = Math.sin(yy); const x = v[0] * c - v[1] * s, y = v[0] * s + v[1] * c;
  const pp = lerp(pitch, 0, camT()); return { x, up: y * Math.cos(pp) + v[2] * Math.sin(pp), depth: v[2] * Math.cos(pp) - y * Math.sin(pp) }; }
function polyArea2D(q) { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
function polyArea3D(q) { let x = 0, y = 0, z = 0; for (let i = 1; i < q.length - 1; i++) { const u = q[i].map((v, k) => v - q[0][k]), w = q[i + 1].map((v, k) => v - q[0][k]);
  x += u[1] * w[2] - u[2] * w[1]; y += u[2] * w[0] - u[0] * w[2]; z += u[0] * w[1] - u[1] * w[0]; } return Math.hypot(x, y, z) / 2; }
function checks(p) {
  const F = faces(p), m = measures(p), H = height(p), n = 200; let v = 0;
  for (let i = 0; i <= n; i++) { const w = (i === 0 || i === n) ? 1 : (i % 2 ? 4 : 2); v += w * section(p, H * i / n); }
  v *= H / n / 3;
  const net = F.reduce((s, f) => s + polyArea2D(f.pts.map(q => q.n)), 0);
  return { m, solid: F.reduce((s, f) => s + polyArea3D(f.pts.map(q => q.a)), 0), net, slices: v };
}
const near = (a, b) => Math.abs(a - b) <= 0.01 * Math.abs(a) + 1e-9;
function buildApplet() {
  el('applet').hidden = false; mixed(el('q'), TEXT.question);
  G.formulas.forEach((f) => { const d = document.createElement('div'); d.className = 'formula'; d.textContent = f; el('formulas').appendChild(d); });
  SLIDERS.forEach((sl) => { P[sl.id] = sl.value; });
  const inputs = [];
  TEXT.options.forEach((o, i) => { const b = document.createElement('button'); b.className = 'opt'; mixed(b, o);
    b.onclick = () => { guess = i; P0 = { ...P }; document.querySelectorAll('.opt').forEach(x => x.classList.remove('chosen')); b.classList.add('chosen');
      inputs.forEach(r => r.disabled = false); el('after').hidden = true; };
    el('opts').appendChild(b); });
  SLIDERS.forEach((sl) => { const l = document.createElement('label'); const r = document.createElement('input');
    Object.assign(r, { type: 'range', min: sl.min, max: sl.max, step: sl.step, value: sl.value, disabled: true }); r.dir = 'ltr'; inputs.push(r);
    const show = () => { P[sl.id] = +r.value; l.replaceChildren(sl.label + ': ', numUnit(P[sl.id], sl.unit), r); render(); };
    r.oninput = () => { show(); showAfter(); }; el('sliders').appendChild(l); show(); });
  const u = el('unfold');
  u.oninput = () => { T = +u.value / 100; el('unfoldVal').textContent = u.value + '%'; render(); };
  let drag = null; const cv = el('cv');
  cv.onpointerdown = (e) => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.01; pitch = Math.min(1.5, Math.max(0, pitch + (e.clientY - drag[1]) * 0.01)); drag = [e.clientX, e.clientY]; render(); };
  cv.onpointerup = () => { drag = null; };
  addEventListener('resize', render);
}
function showAfter() { if (guess === null || !P0 || SLIDERS.every(s => P[s.id] === P0[s.id])) return;
  el('afterText').textContent = `ניחשתם: ${TEXT.options[guess]}. ` + afterText(P0, P); el('after').hidden = false; }
function render() {
  if (!APPLET) return;
  const cv = el('cv'), r = devicePixelRatio || 1, W = cv.clientWidth, Hh = cv.clientHeight;
  cv.width = W * r; cv.height = Hh * r; const ctx = cv.getContext('2d'); ctx.setTransform(r, 0, 0, r, 0, 0); ctx.clearRect(0, 0, W, Hh);
  const k = Math.min(W, Hh) / lerp(VIEW.solid, VIEW.net, netT()), cx = W / 2, cy = Hh / 2;
  const F = faces(P), zc = lerp(height(P) / 2, 0, netT());
  const NP = F.flatMap(f => f.pts.map(q => q.n)), mid = (i) => (Math.min(...NP.map(q => q[i])) + Math.max(...NP.map(q => q[i]))) / 2;
  const nx0 = lerp(0, mid(0), netT()), ny0 = lerp(0, mid(1), netT());
  const scr = (v) => { const w = view([v[0] - nx0, v[1] - ny0, v[2] - zc]); return [cx + w.x * k, cy - w.up * k, w.depth]; };
  offScreen = false;
  const polys = F.map(f => { const q = f.pts.map(pt => scr(pos(pt, netT()))); return { f, q, d: q.reduce((s, v) => s + v[2], 0) / q.length }; });
  polys.sort((a, b) => a.d - b.d);
  for (const { f, q } of polys) {
    ctx.beginPath(); q.forEach(([x, y], i) => { if (x < 0 || y < 0 || x > W || y > Hh) offScreen = true; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
    const u = q[1].map((v, i) => v - q[0][i]), w = q[q.length - 1].map((v, i) => v - q[0][i]);
    const nx = u[1] * w[2] - u[2] * w[1], nyy = u[2] * w[0] - u[0] * w[2], nz = u[0] * w[1] - u[1] * w[0];
    const lit = Math.abs(nz) / (Math.hypot(nx, nyy, nz) || 1);
    ctx.fillStyle = f.color; ctx.fill();
    ctx.fillStyle = `rgba(0,0,0,${(0.45 * (1 - lit)).toFixed(3)})`; ctx.fill();
    ctx.strokeStyle = f.color; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (T === 0) for (const g of guides(P)) { const a = scr(g.from), b = scr(g.to);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.fillText(g.label, (a[0] + b[0]) / 2 + 6, (a[1] + b[1]) / 2 - 6); }
  const box = el('vals'); box.innerHTML = '';
  SLIDERS.map(s => [s.label, P[s.id], s.unit]).concat(measures(P).show).forEach(([n, v, u]) => { const d = document.createElement('div'); d.className = 'val'; d.append(n + ': ', numUnit(v, u)); box.appendChild(d); });
}
// טקסט עברי עם נוסחה: כל קטע של נוסחה או מספר נשאר משמאל לימין
const LTR = /(?:[A-Za-z0-9α-ω√π]|\((?=[A-Za-z0-9α-ω√π]))(?:[A-Za-z0-9α-ω√π²³·=+\-*/()≈°ₐ' ]|\.(?=[0-9])|,(?= [A-Za-zα-ω]ₐ? ?=))*[A-Za-z0-9α-ω²³)°πₐ]|[A-Za-z0-9α-ωπ]/g;
function mixed(node, s) { node.replaceChildren(); let i = 0;
  for (const m of s.matchAll(LTR)) { node.append(s.slice(i, m.index)); const b = document.createElement('bdi'); b.dir = 'ltr'; b.textContent = m[0]; node.append(b); i = m.index + m[0].length; }
  node.append(s.slice(i)); return node; }
// מספר מהתלמיד: 37.7, 37,7 או 12π
function readNum(s) { s = String(s).trim().replace(/,/g, '.').replace(/\s+/g, '').replace(/pi/i, 'π');
  const m = s.match(/^(-?\d*\.?\d*)\*?π$/); if (m) return (m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : +m[1]) * Math.PI;
  return s === '' ? NaN : +s; }
const right = (x, ans) => isFinite(x) && Math.abs(x - ans) <= Math.max(0.01 * Math.abs(ans), 0.01);
const done = new Set();
function buildPractice() {
  mixed(el('howto'), TEXT.howto);
  QUESTIONS.forEach((Q, i) => {
    const box = document.createElement('div'); box.className = 'qa';
    const q = document.createElement('div'); mixed(q, `${i + 1}. ${Q.q}`);
    const row = document.createElement('div'); row.className = 'row';
    const inp = document.createElement('input'); inp.inputMode = 'decimal'; inp.dir = 'ltr'; inp.setAttribute('aria-label', `תשובה לשאלה ${i + 1}`);
    const unit = document.createElement('bdi'); unit.dir = 'ltr'; unit.textContent = Q.unit || '';
    const btn = document.createElement('button'); btn.textContent = 'לבדוק';
    const fb = document.createElement('div'), tip = document.createElement('div'), solBtn = document.createElement('button'), sol = document.createElement('div');
    tip.className = 'tip'; tip.hidden = true; mixed(tip, 'רמז: ' + Q.tip);
    solBtn.textContent = 'להראות פתרון'; solBtn.hidden = true; sol.className = 'tip'; sol.hidden = true; mixed(sol, 'פתרון: ' + Q.sol);
    let tries = 0;
    const mark = (ok) => { if (ok) { fb.className = 'ok'; fb.textContent = '✓ נכון!'; done.add(i); tip.hidden = true; }
      else { tries++; fb.className = 'bad'; fb.textContent = '✗ עוד לא. כדאי לנסות שוב.'; tip.hidden = false; if (tries >= 2) solBtn.hidden = false; }
      score(); };
    const check = () => { const x = readNum(inp.value);
      if (!isFinite(x)) { fb.className = 'bad'; fb.textContent = 'צריך לכתוב מספר.'; return; }
      mark(right(x, Q.ans)); };
    solBtn.onclick = () => { sol.hidden = false; };
    if (Q.choices) Q.choices.forEach((c, k) => { const b = document.createElement('button'); b.className = 'opt'; mixed(b, c);
      b.onclick = () => { box.querySelectorAll('.opt').forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); mark(k === Q.ans); }; row.appendChild(b); });
    else { btn.onclick = check; inp.onkeydown = (e) => { if (e.key === 'Enter') check(); }; row.append(inp, unit, btn); }
    box.append(q, row, fb, tip, solBtn, sol); el('practice').appendChild(box);
  });
  score();
}
function score() { el('score').textContent = `פתרתם ${done.size} מתוך ${QUESTIONS.length}.`;
  if (done.size === QUESTIONS.length) { el('score').textContent += ' כל הכבוד! עכשיו לשאלת החקר עם בן או בת הזוג.'; } }
function teacherTable() {
  const out = [];
  const t1 = document.createElement('table');
  [['שאלה', 'התשובה הנכונה'], ...QUESTIONS.map((Q, i) => [String(i + 1), Q.choices ? String(Q.choices[Q.ans]) : fmt(Q.ans) + (Q.unit ? (Q.unit === '°' ? '' : ' ') + Q.unit : '')])]
    .forEach((r, i) => { const tr = t1.insertRow(); r.forEach(v => { const c = document.createElement(i ? 'td' : 'th'); c.textContent = v; tr.appendChild(c); }); });
  const bad = QUESTIONS.filter(Q => Q.choices ? !(Q.ans >= 0 && Q.ans < Q.choices.length && Number.isInteger(Q.ans)) : !isFinite(Q.ans)).length;
  const m0 = document.createElement('p'); m0.className = bad ? 'bad' : 'ok';
  m0.textContent = bad ? `✗ ב-${bad} שאלות אין תשובה נכונה תקינה. לא להשתמש לפני תיקון.` : `✓ לכל ${QUESTIONS.length} השאלות יש תשובה נכונה. לפתור 1 ביד ולהשוות לטבלה.`;
  out.push(t1, m0);
  if (APPLET) {
    const sets = [Object.fromEntries(SLIDERS.map(s => [s.id, s.min])), Object.fromEntries(SLIDERS.map(s => [s.id, s.value])), Object.fromEntries(SLIDERS.map(s => [s.id, s.max]))];
    const tb = document.createElement('table'); let allOk = true;
    [['r', 'h', `S נוסחה`, `S מהפאות`, `S מהפריסה`, `V נוסחה`, `V מפרוסות`], ...sets.map(p => { const c = checks(p); const ok = near(c.m.area, c.solid) && near(c.m.area, c.net) && near(c.m.volume, c.slices); allOk = allOk && ok;
      return [fmt(p.r), fmt(p.h), fmt(c.m.area), fmt(c.solid), fmt(c.net), fmt(c.m.volume), fmt(c.slices)]; })]
      .forEach((r, i) => { const tr = tb.insertRow(); r.forEach(v => { const c = document.createElement(i ? 'td' : 'th'); c.textContent = v; tr.appendChild(c); }); });
    const msg = document.createElement('p'); msg.className = allOk ? 'ok' : 'bad';
    msg.textContent = allOk ? `✓ הנוסחאות של החרוט מתאימות לציור (הפרש קטן מ-1%).` : `✗ יש הפרש של יותר מ-1% בין הנוסחה לציור. לא להשתמש לפני תיקון.`;
    out.push(tb, msg);
  }
  const notes = document.createElement('div');
  notes.append(mixed(document.createElement('p'), 'התשובה לשאלת החקר: ' + TEXT.researchAnswer));
  const ol = document.createElement('ol'); TEXT.exit.forEach((x) => ol.appendChild(mixed(document.createElement('li'), x.a)));
  notes.append(document.createTextNode('התשובות לכרטיס היציאה:'), ol); out.push(notes);
  el('teacher').replaceChildren(...out);
}
el('title').textContent = TEXT.title; mixed(el('goal'), TEXT.goal); mixed(el('research'), TEXT.research);
mixed(el('opening'), TEXT.opening); mixed(el('exTitle'), TEXT.example.title); mixed(el('mistake'), TEXT.mistake);
TEXT.teach.forEach((t) => el('teach').appendChild(mixed(document.createElement('p'), t)));
TEXT.example.steps.forEach((t) => el('exSteps').appendChild(mixed(document.createElement('li'), t)));
TEXT.exit.forEach((x) => el('exit').appendChild(mixed(document.createElement('li'), x.q)));
el('practiceTitle').textContent = (APPLET ? '3. ' : '2. ') + 'תרגול עם בדיקה עצמית';
el('teacherBtn').onclick = () => { el('teacher').hidden = !el('teacher').hidden; teacherTable(); };
if (APPLET) { buildApplet(); render(); }
buildPractice();
</script>
</body>
</html>
```

## לפני ששולחים

בודקים 4 דברים: הקוד אחרי `← למלא` זהה לשלד; כל `ans` של מספר הוא חישוב ולא מספר מוכן; בצ'אט יש רק 3 השורות; ואין `$` בתשובה (חוץ מ-`${...}` בתוך הקוד). אם משהו חסר, מתקנים, ולא כותבים הסבר.
