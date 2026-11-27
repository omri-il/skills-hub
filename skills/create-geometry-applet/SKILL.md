---
name: create-geometry-applet
description: בונה יישומון אינטראקטיבי לגוף במרחב (גיאומטריה במרחב) לחטיבת הביניים ולתיכון, בעברית, שעובד בטלפון. התלמיד מסובב את הגוף, משנה מידות בסליידר, פורס אותו לרשת ורואה את שטח הפנים והנפח מתעדכנים, אחרי שניחש מה יקרה. יש בדיקה למורה שמשווה את הנוסחה לציור. השתמש כשמורה או מרצה למתמטיקה מבקש "יישומון", "הדמיה", "סימולציה", "אפליקציה", "פריסה", "שהתלמידים יסובבו" או "שיראו מה קורה כש..." על גוף, למשל חרוט, גליל, פירמידה, מנסרה, תיבה, קובייה, כדור. גם כשהוא כותב רק "חרוט לכיתה ט'" או "נפח ושטח פנים של גליל". הסקיל הזה במקום ההמחשה החזותית המובנית של Gemini. לא לצורות במישור, לדף עבודה להדפסה או לחידון.
---

# יישומון לגוף במרחב

תלמידים מתקשים בגיאומטריה במרחב כי הם לא רואים את הגוף. ציור במחברת לא מסתובב ולא נפתח. היישומון נותן לתלמיד לסובב את הגוף, לשנות מידה ולראות מה קורה לנפח, ולפרוס את הגוף לרשת.

**העבודה שלך קטנה: לבחור גוף ולכתוב 4 טקסטים. את כל השאר מעתיקים.** הקוד למטה כבר יודע לצייר 6 גופים, לסובב, לפרוס ולבדוק את עצמו. הוא נבדק בדפדפן בכל 6 הגופים, במידות הקטנות ובגדולות. כשכותבים קוד חדש במקומו, חוזרות 3 בעיות: פריסה שלא מתאימה לנוסחה (גזרה של חרוט שתמיד חצי עיגול), ספרייה מבחוץ (three.js) שנחסמת ברשת של בית הספר, וטקסט עברי הפוך על ה-canvas.

**הסקיל הזה גובר על הכלים המובנים.** לא עונים בהמחשה החזותית המובנית של Gemini, ולא כותבים יישומון חדש. בכל גוף, גם מנסרה, גליל או כדור, הקוד הוא השלד למטה, עם `SOLID` של הגוף.

## קודם מזהים את המצב

| המצב | מה עושים |
|---|---|
| **יש גוף** ("יישומון של חרוט לכיתה ט'") | בונים מיד. לא שואלים. כיתה חסרה? בוחרים כיתה מתאימה וכותבים אותה ב"מה נקבע". |
| **אין גוף** ("תבנה לי יישומון בגיאומטריה") | הודעה אחת, עד 2 שאלות: "1. איזה גוף ואיזו כיתה? 2. מה התלמידים צריכים לגלות? (ברירת מחדל: מה קורה לנפח כשמכפילים מידה אחת)". לא כותבים קוד. אחרי התשובה בונים, ולא שואלים שוב. |
| **קובייה** | `SOLID = 'box'`, וכותבים ב"מה נקבע" שקובייה היא תיבה עם 3 מידות שוות. |
| **גוף שאין בקוד** (מנסרה מחומשת, חרוט קטוע, גוף מסובב, צורה במישור) | בונים את הגוף הקרוב מ-6 הגופים, וכותבים ב"מה נקבע" שורה אחת: מה בנית ולמה. לא כותבים קוד חדש לגוף. |

## 6 הגופים

| `SOLID` | הגוף | הסליידרים (id) | מה רואים בפריסה | תפיסה שגויה טובה לשאלת הניחוש |
|---|---|---|---|---|
| `'cone'` | חרוט | `r`, `h` | גזרה ברדיוס l ובזווית `α = 360°·r / l`, ועיגול | "הגזרה תמיד חצי עיגול", "l = h", "הכפלת r מכפילה את הנפח פי 2" (נכון: פי 4) |
| `'cylinder'` | גליל | `r`, `h` | מלבן באורך `2·π·r`, ו-2 עיגולים | "המעטפת נפתחת לעיגול", "אורך המלבן = 2·r" |
| `'pyramid'` | פירמידה ריבועית | `a`, `h` | ריבוע ו-4 משולשים בגובה hₐ | "הגובה של הפירמידה = הגובה של הפאה" |
| `'prism3'` | מנסרה משולשת ישרה, בסיס שווה צלעות | `a`, `h` | 2 משולשים ו-3 מלבנים שווים | "הכפלת הגובה מכפילה את שטח הפנים פי 2" |
| `'box'` | תיבה | `a`, `b`, `c` | 6 מלבנים, 3 זוגות שווים | "הכפלת כל המידות פי 2 מכפילה את הנפח פי 2" (נכון: פי 8) |
| `'sphere'` | כדור | `r` | אין פריסה. הסליידר "פריסה" מוסתר | "הכפלת r מכפילה את הנפח פי 4" (נכון: פי 8) |

גוף עם `/ 3` (חרוט, פירמידה): שאלה טובה היא "כמה חרוטים ממלאים גליל עם אותו בסיס ואותו גובה?" (נכון: 3).

## מה ממלאים, ורק את זה

בקוד יש חלק אחד שמסומן `← למלא`. כל מה שאחריו מעתיקים כמו שהוא, אות באות, עד `</html>`.

- **`SOLID`:** אחד מ-6 השמות בטבלה.
- **`UNIT`:** `'cm'` (או `'m'` אם הבקשה במטרים).
- **`TEXT.title`:** שם הגוף ומה בודקים, למשל `המנסרה המשולשת: נפח ושטח פנים`.
- **`TEXT.goal`:** "מה בודקים:" ומשפט אחד.
- **`TEXT.question`:** שאלת ניחוש אחת על מה שהתלמיד עומד לשנות.
- **`TEXT.options`:** 3 תשובות: אחת נכונה ו-2 תפיסות שגויות מהטבלה. הנכונה לא תמיד ראשונה. בודקים את התשובה הנכונה בחישוב לפני שכותבים אותה.
- **`RANGES`:** רק אם הבקשה צריכה טווח אחר. למשל כיתה ז' עם מספרים שלמים: `{ r: { min: 1, max: 6, step: 1, value: 2 } }`. אחרת משאירים `{}`.

**עברית ונוסחאות:**
- כל טקסט בעברית בתוך backticks.
- מילים של הנושא בכתיב הנכון: קו יוצר, גזרה, מעטפת, פריסה, בסיס, פאה, קודקוד, מקצוע, חתך, שטח פנים, נפח.
- **בלי `$` ובלי LaTeX בשום מקום בתשובה: לא בקוד, לא בבלוק הנוסחאות ולא בצ'אט.** הצ'אט של Gemini מציג אותו כנוסחה שבורה, והדף מציג `$V$`. נוסחה כותבים בטקסט רגיל: `V = π·r²·h / 3`.

## הקוד: תמיד השלד הזה

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>יישומון גיאומטרי</title>
<style>
  [hidden] { display: none !important; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 17px/1.5 system-ui, Arial, sans-serif; background: #f4f6f9; color: #1d2433; }
  main { max-width: 720px; width: 100%; margin: 0 auto; padding: 12px; }
  h1 { font-size: 1.4em; margin: 4px 0; }
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
</style>
</head>
<body>
<main>
  <h1 id="title"></h1>
  <p id="goal"></p>

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

  <section class="card">
    <button id="teacherBtn">בדיקה למורה</button>
    <div id="teacher" hidden></div>
  </section>
</main>
<script>
// ===== 1. התוכן  ← למלא =====
// הגוף: 'cone' חרוט, 'cylinder' גליל, 'pyramid' פירמידה ריבועית, 'prism3' מנסרה משולשת, 'box' תיבה, 'sphere' כדור
const SOLID = 'cone';
const UNIT = 'cm';
const TEXT = {
  title: `החרוט: נפח ושטח פנים`,
  goal: `מה בודקים: מה קורה לנפח החרוט כשמכפילים את הרדיוס, ואיך נראית הפריסה שלו.`,
  question: `אם מכפילים את רדיוס הבסיס פי 2 והגובה נשאר, הנפח גדל פי...`,
  options: [`פי 2`, `פי 4`, `פי 8`],   // תשובה נכונה אחת ו-2 תפיסות שגויות. הנכונה לא תמיד ראשונה
};
// אופציונלי: טווח אחר לסליידר, לפי ה-id שלו בטבלה "6 הגופים". למשל { r: { min: 1, max: 10, value: 3 } }
const RANGES = {};

// ===== 2. ספריית הגופים: לא משנים מכאן =====
const TAU = 2 * Math.PI, N = 96;
const ring = (i) => Math.PI / 2 - Math.PI + TAU * i / N;   // זווית על היקף הבסיס. התפר מול נקודת המגע של הפריסה
const SOLIDS = {
  cone: {
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
  },
  cylinder: {
    sliders: [{ id: 'r', label: `רדיוס r`, min: 1, max: 4, step: 0.5, value: 2 }, { id: 'h', label: `גובה h`, min: 1, max: 8, step: 0.5, value: 4 }],
    formulas: [`S = 2·π·r² + 2·π·r·h`, `V = π·r²·h`, `אורך המלבן = 2·π·r`],
    view: (m) => ({ solid: Math.max(2 * m.r, m.h), net: Math.max(TAU * m.r, 4 * m.r + m.h) }),
    measures(p) { const S = TAU * p.r * p.r + TAU * p.r * p.h, V = Math.PI * p.r * p.r * p.h;
      return { area: S, volume: V, show: [[`אורך המלבן`, TAU * p.r, UNIT], [`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
    height: (p) => p.h,
    section: (p) => Math.PI * p.r * p.r,
    faces(p) { const F = [], bot = [], top = [];
      for (let i = 0; i < N; i++) { const x = p.r * Math.cos(ring(i)), y = p.r * Math.sin(ring(i));
        bot.push({ a: [x, y, 0], n: [x, y] }); top.push({ a: [x, y, p.h], n: [x, 2 * p.r + p.h - y] }); }
      F.push({ color: '#ffc250', pts: bot.slice().reverse(), edge: false }, { color: '#ffc250', pts: top, edge: false });
      for (let i = 0; i < N; i++) { const s0 = (ring(i) - Math.PI / 2) * p.r, s1 = (ring(i + 1) - Math.PI / 2) * p.r;
        const c0 = [p.r * Math.cos(ring(i)), p.r * Math.sin(ring(i))], c1 = [p.r * Math.cos(ring(i + 1)), p.r * Math.sin(ring(i + 1))];
        F.push({ color: '#5aa0ff', edge: false, pts: [{ a: [c0[0], c0[1], 0], n: [s0, p.r] }, { a: [c1[0], c1[1], 0], n: [s1, p.r] },
          { a: [c1[0], c1[1], p.h], n: [s1, p.r + p.h] }, { a: [c0[0], c0[1], p.h], n: [s0, p.r + p.h] }] }); }
      return F; },
    guides: (p) => [{ from: [0, 0, 0], to: [0, 0, p.h], label: 'h' }, { from: [0, 0, 0], to: [p.r, 0, 0], label: 'r' }],
  },
  pyramid: {
    sliders: [{ id: 'a', label: `צלע הבסיס a`, min: 1, max: 6, step: 0.5, value: 3 }, { id: 'h', label: `גובה h`, min: 1, max: 8, step: 0.5, value: 4 }],
    formulas: [`hₐ = √(h² + (a/2)²)`, `S = a² + 2·a·hₐ`, `V = a²·h / 3`],
    view: (m) => ({ solid: Math.max(1.42 * m.a, m.h), net: m.a + 2 * Math.hypot(m.h, m.a / 2) }),
    measures(p) { const ha = Math.hypot(p.h, p.a / 2), S = p.a * p.a + 2 * p.a * ha, V = p.a * p.a * p.h / 3;
      return { area: S, volume: V, show: [[`גובה הפאה hₐ`, ha, UNIT], [`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
    height: (p) => p.h,
    section: (p, z) => (p.a * (1 - z / p.h)) ** 2,
    faces(p) { const d = p.a / 2, ha = Math.hypot(p.h, d), B = [[-d, -d], [d, -d], [d, d], [-d, d]];
      const F = [{ color: '#ffc250', pts: B.slice().reverse().map(([x, y]) => ({ a: [x, y, 0], n: [x, y] })) }];
      for (let i = 0; i < 4; i++) { const [x1, y1] = B[i], [x2, y2] = B[(i + 1) % 4], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(mx, my);
        F.push({ color: '#5aa0ff', pts: [{ a: [x1, y1, 0], n: [x1, y1] }, { a: [x2, y2, 0], n: [x2, y2] }, { a: [0, 0, p.h], n: [mx + mx / L * ha, my + my / L * ha] }] }); }
      return F; },
    guides: (p) => [{ from: [0, 0, 0], to: [0, 0, p.h], label: 'h' }, { from: [p.a / 2, 0, 0], to: [0, 0, p.h], label: 'hₐ' }],
  },
  prism3: {
    sliders: [{ id: 'a', label: `צלע הבסיס a`, min: 1, max: 6, step: 0.5, value: 3 }, { id: 'h', label: `גובה המנסרה h`, min: 1, max: 8, step: 0.5, value: 4 }],
    formulas: [`B = √3·a² / 4`, `S = 2·B + 3·a·h`, `V = B·h`],
    view: (m) => ({ solid: Math.max(m.a, m.h), net: m.a + 2 * m.h + 0.9 * m.a }),
    measures(p) { const B = Math.sqrt(3) * p.a * p.a / 4, S = 2 * B + 3 * p.a * p.h, V = B * p.h;
      return { area: S, volume: V, show: [[`שטח הבסיס B`, B, UNIT + '²'], [`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
    height: (p) => p.h,
    section: (p) => Math.sqrt(3) * p.a * p.a / 4,
    faces(p) { const R = p.a / Math.sqrt(3), V = [0, 1, 2].map(k => [R * Math.cos(Math.PI / 2 + k * TAU / 3), R * Math.sin(Math.PI / 2 + k * TAU / 3)]);
      const F = [{ color: '#ffc250', pts: V.slice().reverse().map(([x, y]) => ({ a: [x, y, 0], n: [x, y] })) }];
      let top = null;
      for (let i = 0; i < 3; i++) { const P = V[i], Q = V[(i + 1) % 3], mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, L = Math.hypot(mx, my), u = [mx / L, my / L];
        const P2 = [P[0] + u[0] * p.h, P[1] + u[1] * p.h], Q2 = [Q[0] + u[0] * p.h, Q[1] + u[1] * p.h];
        F.push({ color: '#5aa0ff', pts: [{ a: [P[0], P[1], 0], n: P }, { a: [Q[0], Q[1], 0], n: Q }, { a: [Q[0], Q[1], p.h], n: Q2 }, { a: [P[0], P[1], p.h], n: P2 }] });
        if (i === 0) { const k = Math.sqrt(3) * p.a / 2, W = V[2], T3 = [(P2[0] + Q2[0]) / 2 + u[0] * k, (P2[1] + Q2[1]) / 2 + u[1] * k];
          top = { color: '#ffc250', pts: [{ a: [P[0], P[1], p.h], n: P2 }, { a: [Q[0], Q[1], p.h], n: Q2 }, { a: [W[0], W[1], p.h], n: T3 }] }; } }
      F.push(top); return F; },
    guides: (p) => [{ from: [0, 0, 0], to: [0, 0, p.h], label: 'h' }],
  },
  box: {
    sliders: [{ id: 'a', label: `אורך a`, min: 1, max: 5, step: 0.5, value: 3 }, { id: 'b', label: `רוחב b`, min: 1, max: 4, step: 0.5, value: 2 }, { id: 'c', label: `גובה c`, min: 1, max: 4, step: 0.5, value: 2 }],
    formulas: [`S = 2·(a·b + a·c + b·c)`, `V = a·b·c`],
    view: (m) => ({ solid: Math.hypot(m.a, m.b, m.c), net: Math.max(m.a + 2 * m.c, 2 * m.b + 2 * m.c) }),
    measures(p) { const S = 2 * (p.a * p.b + p.a * p.c + p.b * p.c), V = p.a * p.b * p.c;
      return { area: S, volume: V, show: [[`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
    height: (p) => p.c,
    section: (p) => p.a * p.b,
    faces(p) { const x = p.a / 2, y = p.b / 2, c = p.c, Q = (pts) => pts.map(([a, n]) => ({ a, n }));
      return [
        { color: '#ffc250', pts: Q([[[-x, -y, 0], [-x, -y]], [[-x, y, 0], [-x, y]], [[x, y, 0], [x, y]], [[x, -y, 0], [x, -y]]]) },
        { color: '#5aa0ff', pts: Q([[[-x, -y, 0], [-x, -y]], [[x, -y, 0], [x, -y]], [[x, -y, c], [x, -y - c]], [[-x, -y, c], [-x, -y - c]]]) },
        { color: '#5aa0ff', pts: Q([[[-x, y, 0], [-x, y]], [[-x, y, c], [-x, y + c]], [[x, y, c], [x, y + c]], [[x, y, 0], [x, y]]]) },
        { color: '#8fd18f', pts: Q([[[x, -y, 0], [x, -y]], [[x, y, 0], [x, y]], [[x, y, c], [x + c, y]], [[x, -y, c], [x + c, -y]]]) },
        { color: '#8fd18f', pts: Q([[[-x, -y, 0], [-x, -y]], [[-x, -y, c], [-x - c, -y]], [[-x, y, c], [-x - c, y]], [[-x, y, 0], [-x, y]]]) },
        { color: '#ffc250', pts: Q([[[-x, y, c], [-x, y + c + p.b]], [[-x, -y, c], [-x, y + c]], [[x, -y, c], [x, y + c]], [[x, y, c], [x, y + c + p.b]]]) },
      ]; },
    guides: () => [],
  },
  sphere: {
    sliders: [{ id: 'r', label: `רדיוס r`, min: 1, max: 4, step: 0.5, value: 2 }],
    formulas: [`S = 4·π·r²`, `V = 4·π·r³ / 3`],
    view: (m) => ({ solid: 2 * m.r, net: 2 * m.r }),
    measures(p) { const S = 4 * Math.PI * p.r * p.r, V = 4 * Math.PI * p.r ** 3 / 3;
      return { area: S, volume: V, show: [[`שטח פנים S`, S, UNIT + '²'], [`נפח V`, V, UNIT + '³']] }; },
    height: (p) => 2 * p.r,
    section: (p, z) => Math.PI * Math.max(0, p.r * p.r - (z - p.r) ** 2),
    faces(p) { const NA = 64, NB = 32, F = [];
      const pt = (i, j) => { const u = TAU * i / NA, v = Math.PI * j / NB; return { a: [p.r * Math.sin(v) * Math.cos(u), p.r * Math.sin(v) * Math.sin(u), p.r - p.r * Math.cos(v)] }; };
      for (let i = 0; i < NA; i++) for (let j = 0; j < NB; j++) F.push({ color: '#5aa0ff', edge: false, pts: [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)] });
      return F; },
    guides: (p) => [{ from: [0, 0, p.r], to: [p.r, 0, p.r], label: 'r' }],
  },
};
const G = SOLIDS[SOLID];
const SLIDERS = G.sliders.map(s => ({ ...s, ...(RANGES[s.id] || {}), unit: UNIT }));
TEXT.formulas = G.formulas;
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
// הפריסה בשני שלבים: עד 40% המבט עובר למבט מלמעלה, ואחר כך הגוף נפתח
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
  const net = F.every(f => f.pts.every(q => q.n)) ? F.reduce((s, f) => s + polyArea2D(f.pts.map(q => q.n)), 0) : null;
  return { m, solid: F.reduce((s, f) => s + polyArea3D(f.pts.map(q => q.a)), 0), net, slices: v };
}
const near = (a, b) => b !== null && Math.abs(a - b) <= 0.01 * Math.abs(a) + 1e-9;
function buildUI() {
  el('title').textContent = TEXT.title; el('goal').textContent = TEXT.goal; el('q').textContent = TEXT.question;
  TEXT.formulas.forEach((f) => { const d = document.createElement('div'); d.className = 'formula'; d.textContent = f; el('formulas').appendChild(d); });
  SLIDERS.forEach((sl) => { P[sl.id] = sl.value; });
  const inputs = [];
  TEXT.options.forEach((o, i) => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = o;
    b.onclick = () => { guess = i; P0 = { ...P }; document.querySelectorAll('.opt').forEach(x => x.classList.remove('chosen')); b.classList.add('chosen');
      inputs.forEach(r => r.disabled = false); el('after').hidden = true; };
    el('opts').appendChild(b); });
  SLIDERS.forEach((sl) => { const l = document.createElement('label'); const r = document.createElement('input');
    Object.assign(r, { type: 'range', min: sl.min, max: sl.max, step: sl.step, value: sl.value, disabled: true }); r.dir = 'ltr'; inputs.push(r);
    const show = () => { P[sl.id] = +r.value; l.replaceChildren(sl.label + ': ', numUnit(P[sl.id], sl.unit), r); render(); };
    r.oninput = () => { show(); showAfter(); }; el('sliders').appendChild(l); show(); });
  const u = el('unfold');
  if (!faces(P).every(f => f.pts.every(q => q.n))) el('unfoldBox').hidden = true;
  u.oninput = () => { T = +u.value / 100; el('unfoldVal').textContent = u.value + '%'; render(); };
  let drag = null; const cv = el('cv');
  cv.onpointerdown = (e) => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.01; pitch = Math.min(1.5, Math.max(0, pitch + (e.clientY - drag[1]) * 0.01)); drag = [e.clientX, e.clientY]; render(); };
  cv.onpointerup = () => { drag = null; };
  el('teacherBtn').onclick = () => { el('teacher').hidden = !el('teacher').hidden; teacherTable(); };
  addEventListener('resize', render);
}
function showAfter() { if (guess === null || !P0 || SLIDERS.every(s => P[s.id] === P0[s.id])) return;
  el('afterText').textContent = `ניחשתם: ${TEXT.options[guess]}. ` + afterText(P0, P); el('after').hidden = false; }
function render() {
  const cv = el('cv'), r = devicePixelRatio || 1, W = cv.clientWidth, Hh = cv.clientHeight;
  cv.width = W * r; cv.height = Hh * r; const ctx = cv.getContext('2d'); ctx.setTransform(r, 0, 0, r, 0, 0); ctx.clearRect(0, 0, W, Hh);
  const k = Math.min(W, Hh) / lerp(VIEW.solid, VIEW.net, netT()), cx = W / 2, cy = Hh / 2;
  const F = faces(P), zc = lerp(height(P) / 2, 0, netT());
  const NP = F.flatMap(f => f.pts.map(q => q.n || [0, 0])), mid = (i) => (Math.min(...NP.map(q => q[i])) + Math.max(...NP.map(q => q[i]))) / 2;
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
    if (f.edge === false) { ctx.strokeStyle = f.color; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1; }
    else { ctx.strokeStyle = '#0f1b2d'; ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  if (T === 0) for (const g of guides(P)) { const a = scr(g.from), b = scr(g.to);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.fillText(g.label, (a[0] + b[0]) / 2 + 6, (a[1] + b[1]) / 2 - 6); }
  const box = el('vals'); box.innerHTML = '';
  SLIDERS.map(s => [s.label, P[s.id], s.unit]).concat(measures(P).show).forEach(([n, v, u]) => { const d = document.createElement('div'); d.className = 'val'; d.append(n + ': ', numUnit(v, u)); box.appendChild(d); });
  if (!el('teacher').hidden) teacherTable();
}
function teacherTable() {
  const sets = [Object.fromEntries(SLIDERS.map(s => [s.id, s.min])), Object.fromEntries(SLIDERS.map(s => [s.id, s.value])), Object.fromEntries(SLIDERS.map(s => [s.id, s.max]))];
  const head = [...SLIDERS.map(s => s.id), `S נוסחה`, `S מהפאות`, `S מהפריסה`, `V נוסחה`, `V מפרוסות`];
  const tb = document.createElement('table'); let allOk = true;
  [head, ...sets.map(p => { const c = checks(p); const ok = near(c.m.area, c.solid) && (c.net === null || near(c.m.area, c.net)) && near(c.m.volume, c.slices); allOk = allOk && ok;
    return [...SLIDERS.map(s => fmt(p[s.id])), fmt(c.m.area), fmt(c.solid), c.net === null ? 'אין' : fmt(c.net), fmt(c.m.volume), fmt(c.slices)]; })]
    .forEach((r, i) => { const tr = tb.insertRow(); r.forEach(v => { const c = document.createElement(i ? 'td' : 'th'); c.textContent = v; tr.appendChild(c); }); });
  const msg = document.createElement('p'); msg.className = allOk ? 'ok' : 'bad';
  msg.textContent = allOk ? `✓ הנוסחאות מתאימות לציור (הפרש קטן מ-1%).` : `✗ יש הפרש של יותר מ-1% בין הנוסחה לציור. לא להשתמש לפני תיקון.`;
  const msg2 = document.createElement('p'); msg2.className = offScreen ? 'bad' : 'ok';
  msg2.textContent = offScreen ? `✗ חלק מהציור יוצא מהמסך במצב הנוכחי.` : `✓ הציור נכנס למסך במצב הנוכחי.`;
  el('teacher').replaceChildren(tb, msg, msg2);
}
buildUI(); render();
</script>
</body>
</html>
```

## מה מחזירים

**6 חלקים, תמיד. גם כשהקוד נמצא ב-Canvas, חלקים 1, 2, 4, 5 ו-6 נכתבים בצ'אט, מתחת ל-Canvas.** לא שורת סיכום אחת במקומם. כי המורה צריך את הנוסחאות, את שאלת החקר ואת הבדיקה כדי להשתמש ביישומון בכיתה.

1. **מה נקבע:** שורה אחת: גוף, כיתה, מה התלמיד משנה ומה הוא מגלה.
2. **הנוסחאות:** 3-5 שורות בטקסט רגיל, בלי `$`: המשתנים והיחידות, שטח הפנים, הנפח, ומה רואים בפריסה.
3. **הקוד:** קובץ HTML אחד מלא, ב-Canvas (או בבלוק קוד אחד בצ'אט).
4. **שאלת חקר לזוגות:** שאלה אחת שהתלמידים עונים עליה בזוגות רק בעזרת היישומון, ומה התשובה. למשל: "מצאו חרוט שהגזרה שלו היא חצי עיגול. מה היחס בין l ל-r?" (תשובה: l = 2·r).
5. **בדיקה של 2 דקות לפני הכיתה:** "1. ללחוץ על 'בדיקה למורה' ולבדוק שיש 2 ✓. 2. להזיז כל סליידר לקצה ולפרוס עד 100%. 3. לפתוח בטלפון ולסובב באצבע. 4. לחשב ערך אחד ביד ולהשוות."
6. **לשלוח לתלמידים:** שורה אחת: "בחשבון של בית ספר אין קישור לשיתוף ב-Canvas. הסקיל sites-student-app מסביר איך שולחים דרך Google Sites."

לפני שמחזירים בודקים 3 דברים: הקוד אחרי `← למלא` זהה לשלד, יש 6 חלקים, ואין `$` בתשובה (חוץ מ-`${...}` בתוך הקוד). אם משהו חסר, מתקנים, ולא כותבים הסבר.
