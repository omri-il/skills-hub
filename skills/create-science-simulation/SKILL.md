---
name: create-science-simulation
description: בונה סימולציה אינטראקטיבית למדעים בחטיבת הביניים (כיתות ז'-ט'), בעברית, שעובדת בטלפון, עם מודל מדעי נכון ובלי שגיאות פנימיות. השתמש כשמורה למדעים מבקש "סימולציה", "הדמיה", "אנימציה שמראה", "ניסוי וירטואלי" או "שהתלמידים ישנו ויראו מה קורה", גם כשהוא כותב רק נושא, למשל מודל החלקיקים, מצבי צבירה, התפשטות, המסה, צפיפות, חום וטמפרטורה, אנרגיה, כוחות, חיכוך, תנועה, נפילה, מעגל חשמלי, מגנטיות, אור, קול, פוטוסינתזה, נשימה, דיפוזיה, אוסמוזה, שרשרת מזון, אוכלוסיות, מחזור המים, עונות השנה, מופעי הירח. לא להפעיל לבדיקה של סימולציה קיימת (check-science-simulation), לדף עבודה להדפסה או לחידון.
---

# סימולציה למדעים בחטיבת הביניים

סימולציה טובה מראה לתלמיד מודל. אם המודל שגוי, התלמיד לומד טעות, וזה גרוע יותר מבלי סימולציה. 3 בעיות חוזרות כש-AI בונה סימולציה בלי הנחיות:
1. **שגיאה פנימית:** אנרגיה שנוצרת מכלום, מסה שנעלמת, יחידות שלא מתאימות, ערך קצה (0 או מקסימום) ששובר את המסך.
2. **הציור מלמד תפיסה שגויה:** חלקיקים שגדלים כשמחממים, זרם ש"נגמר" אחרי נורה, גוף שעוצר כי "נגמר לו הכוח".
3. **עברית שבורה:** טקסט שמצויר על ה-canvas הפוך, מספר ויחידה מתחלפים, מסך שלא נכנס לטלפון.

הסקיל הזה בונה את המודל קודם במילים, אחר כך את הקוד לפי המודל, ומוסיף בדיקה שהמורה רואה.

## קודם מזהים את המצב

| המצב | מה עושים |
|---|---|
| **יש נושא** ("סימולציה של מצבי צבירה לכיתה ז'") | בונים מיד. לא שואלים. כיתה חסרה? בוחרים כיתה מתאימה וכותבים אותה ב"מה נקבע". |
| **אין נושא** ("תבנה לי סימולציה למדעים") | הודעה אחת, עד 2 שאלות: "1. איזה נושא ואיזו כיתה? 2. מה התלמידים צריכים לגלות? (ברירת מחדל: הקשר בין משתנה אחד לתוצאה)". לא כותבים קוד. אחרי התשובה בונים, ולא שואלים שוב. |
| **המורה הדביק סימולציה קיימת וביקש לבדוק או לתקן** | זה לא הסקיל הזה. כותבים שורה אחת: "לבדיקה של סימולציה קיימת יש את הסקיל check-science-simulation." אם הוא מותקן, עובדים לפיו. אם המורה שואל שוב באותה שיחה ("איך בודקים?"), עונים שוב רק בשורה הזאת ובאיך מתקינים סקיל. לא רשימת באגים ולא סימולציה חדשה, אלא אם המורה ביקש במפורש לבנות חדשה. |

## 8 כללים שאסור לשבור (וגם הסיבה)

1. **המודל לפני הקוד.** לפני הקוד כותבים בלוק "המודל" קצר: מה המשתנים (עם יחידות), מה החוק או הנוסחה, מה נשמר (אנרגיה, מסה, מספר חלקיקים, מטען), ומה פושט. הקוד מממש בדיוק את מה שכתוב בבלוק. כי מודל שלא נכתב במילים לא נבדק, והמורה לא יכול לראות מה התלמיד לומד.
2. **החישוב בפונקציה אחת, נפרד מהציור.** כל החישוב בפונקציה `step(state, params, DT)` עם `DT` קבוע של 0.01 שניות, כמו בשלד. לא הזמן בין פריימים. הציור רק קורא את התוצאה. כי חישוב לפי הזמן בין פריימים נותן תוצאה אחרת בכל מחשב, ומצטבר לשגיאה.
3. **מה שנשמר, נשמר גם בקוד.** אם המודל אומר שמשהו נשמר, הקוד בודק אותו בכל צעד: אנרגיה כוללת, מסה לפני ואחרי, מספר החלקיקים, זרם שנכנס = זרם שיוצא. הסימולציה מציגה את הערך הנשמר על המסך (למשל "אנרגיה כוללת: 50 J"). כי זה מה שהתלמיד צריך לראות, וזה מה שמגלה באג.
4. **הציור נכון מדעית.** לפני הקוד בודקים את הנושא מול הטבלה "מה מודל נכון מראה" למטה. גודל בקנה מידה לא אמיתי (חלקיקים ענקיים, זמן מואץ) מסמנים על המסך: "לא בקנה מידה" או "הזמן מואץ פי 10". כי תלמיד מאמין למה שהוא רואה יותר ממה שכתוב.
5. **ערכי קצה לא שוברים.** לכל סליידר טווח שיש לו משמעות פיזיקלית (מסה לא 0, טמפרטורה לא מתחת ל-273- °C). כל חלוקה בודקת אפס. אחרי ריצה ארוכה (5 דקות) אין ערך שבורח לאינסוף או ל-NaN. כי התלמיד תמיד ינסה את הקצה קודם.
6. **כל טקסט ב-HTML, לא על ה-canvas.** על ה-canvas מציירים רק צורות, חצים וקווים. כל מילה, מספר ויחידה נמצאים ב-HTML מעל או ליד ה-canvas. כי `fillText` לא יודע לסדר עברית עם מספרים, והתוצאה הפוכה.
7. **התלמיד מנחש לפני שהוא רואה.** לפני הכפתור "▶ להפעיל" יש שאלת ניחוש עם 3 תשובות לבחירה. הכפתור פעיל רק אחרי בחירה. אחרי הריצה מופיעה השאלה "מה ראיתם? למה זה קרה?" והתשובה שהתלמיד בחר. כי ניחוש ואז תצפית הם מה שמשנה תפיסה שגויה, ולא צפייה.
8. **קובץ אחד, בלי שום דבר מבחוץ, שעובד גם ב-Google Sites.** בלי CDN, ספריות, גופנים או תמונות מקישור. בלי `alert`, `confirm`, `prompt`, `localStorage`, `sessionStorage`. כל הודעה בתוך הדף. כי ברשת של בית הספר קישור חיצוני נחסם, ו-Sites חוסם חלונות קופצים.

## מה מודל נכון מראה

לכל נושא: מה הציור והחישוב חייבים להראות. אם הנושא לא בטבלה, כותבים שורה כזאת בעצמכם בבלוק "המודל" לפני הקוד.

| נושא | מה מודל נכון מראה |
|---|---|
| מודל החלקיקים, מצבי צבירה, התפשטות | החלקיקים באותו גודל ובאותו צבע בכל טמפרטורה ובכל מצב. משתנים רק המהירות והמרחק ביניהם. בין החלקיקים יש ריק, לא אוויר ולא חומר. מספר החלקיקים קבוע. |
| המסה, תמיסה | המומס נשאר בתמיסה כחלקיקים קטנים מפוזרים. מסת התמיסה = מסת המים + מסת המומס. |
| צפיפות, ציפה ושקיעה | ציפה תלויה בצפיפות של הגוף ביחס לנוזל, לא במסה לבד ולא בגודל לבד. גוף כבד וגדול יכול לצוף. |
| חום וטמפרטורה | טמפרטורה = מידה לתנועה הממוצעת של החלקיקים. חום = אנרגיה שעוברת מהחם לקר, עד שהטמפרטורות שוות. אין "קור" שעובר. במעבר פאזה הטמפרטורה קבועה בזמן שהחום ממשיך להיכנס. |
| אנרגיה והמרות | האנרגיה הכוללת קבועה. עם חיכוך, אנרגיה עוברת לחום ומוצגת כחום, לא נעלמת. |
| כוחות ותנועה | גוף ממשיך לנוע במהירות קבועה כשאין כוח שקול. חיכוך הוא כוח שעוצר אותו. בלי חיכוך הוא לא עוצר. כוח שקול משנה מהירות, לא "מחזיק" אותה. |
| נפילה | בלי התנגדות אוויר, גוף כבד וגוף קל נופלים יחד. עם התנגדות אוויר יש מהירות סופית. g = 9.8 m/s² (אפשר 10 אם כתוב). |
| מעגל חשמלי | הזרם שווה בכל נקודה במעגל טורי, לפני הנורה ואחריה. הזרם לא "נגמר" בנורה. נורות זהות בטור מאירות אותו דבר. במעגל פתוח אין זרם בשום מקום. |
| מגנטיות | קווי שדה יוצאים מצפון ונכנסים לדרום, ולא נחתכים. מגנט משפיע על ברזל, לא על כל מתכת. |
| אור וצל | אור נע בקו ישר מהמקור. רואים עצם כשאור ממנו מגיע לעין, לא כשהעין "שולחת" משהו. צל = אזור שהאור לא מגיע אליו. |
| קול | קול צריך תווך. בריק אין קול. החלקיקים רוטטים במקום, הם לא נעים עם הגל. |
| פוטוסינתזה ונשימה | הצמח בונה את רוב המסה שלו מ-CO₂ מהאוויר ומים, לא מהאדמה. צמח נושם כל הזמן, גם ביום. פוטוסינתזה רק באור. |
| דיפוזיה ואוסמוזה | החלקיקים נעים כל הזמן לכל הכיוונים, גם בשיווי משקל. המעבר הממוצע הוא מריכוז גבוה לנמוך. |
| שרשרת מזון | החץ מראה לאן עוברים חומר ואנרגיה: מהנאכל אל האוכל. בכל רמה עוברת רק חלק קטן מהאנרגיה (בערך 10%). |
| עונות השנה | העונות נובעות מנטיית ציר כדור הארץ, לא מהמרחק לשמש. כשבישראל קיץ, בדרום אפריקה חורף. |
| מופעי הירח | המופע תלוי במיקום הירח ביחס לשמש ולכדור הארץ. הצל של כדור הארץ לא יוצר מופעים (רק ליקוי). |

## איך בונים את הקוד

מעתיקים את השלד למטה, וממלאים רק את 3 החלקים שמסומנים `← למלא`: התוכן, המודל והציור. החלק "השלד: לא משנים מכאן" נשאר כמו שהוא, אות באות. השלד כבר עושה את מה שכללים 2, 3, 6, 7 ו-8 דורשים: צעד בזמן קבוע, ערך נשמר על המסך, טבלה למורה שמחושבת מהמודל, ניחוש לפני ריצה, טקסט אחרי ריצה, עברית נכונה ליד מספרים, טלפון.

**כשממלאים:**
- **התוכן:** עד 2 פקדים בסך הכול. גם כפתור החלפה (טורי/מקבילי, מים/מלח) הוא פקד. ביקשו יותר? משאירים את 2 החשובים, וכותבים ב"מה נקבע" מה נשאר בחוץ ולמה. הבקשה סותרת את הטבלה "מה מודל נכון מראה"? בונים את המודל הנכון, וכותבים ב"מה נקבע" שורה אחת: מה שיניתי מהבקשה ולמה. 3 תשובות לניחוש: אחת נכונה ו-2 תפיסות שגויות אמיתיות, והנכונה לא ראשונה בכל סימולציה.
- **המודל:** `step` מממש בדיוק את בלוק "המודל" מהצ'אט. `conserved` מחבר את החלקים מתוך המצב: למשל `m·g·s.y + ½·m·s.v² + s.heat`, כש-`s.heat` נצבר ב-`step` מעבודת החיכוך. או מספר החלקיקים `s.parts.length`. אף פעם לא מספר קבוע (`return 50`), ולא "סך הכול פחות השאר". אין בנושא גודל שנשמר (מופעי הירח, עונות)? `conserved` מחזיר `null`, ואז השורה לא מופיעה. `finished` עוצר ריצה שיש לה סוף.
- **השלד:** `buildUI`, `render`, `loop` וכל שורה אחרי "לא משנים מכאן" נשארים כמו שהם. `step` לא נוגע ב-DOM ולא משנה את `p`. קצב מהיר יותר רק דרך `SPEED`.
- **הציור:** כל מיקום וכל גודל עוברים דרך `toPx`, באותן יחידות כמו המודל. גוף של 2 m מצויר פי 2 מגוף של 1 m. מה שמצויר נשאר בתוך ה-canvas בכל ערך של סליידר, והגוף הקטן ביותר עדיין גדול מספיק לראות אותו. בודקים כיוון: הצד הכבד יורד, גוף חם יותר זז מהר יותר, הזרם זז מהקוטב לקוטב. ב-canvas ציר y הפוך, ולכן `toPx` כבר הופך אותו. בלי `fillText` בעברית: תווית צריכה להיות ב-HTML.
- **לפני הלחיצה הראשונה** הדף כבר קורא ל-`initState`, `draw`, `readouts` ו-`conserved` עם `t = 0`. כל אחת מהן צריכה לעבוד כבר אז, עם כל ערך של סליידר, בלי `undefined` ובלי NaN.
- **הנושא לא מתאים לשלד** (למשל שרשרת מזון בלי זמן)? משאירים את השלד, ו-`step` מקדם את הסימולציה בצעד אחד של תהליך. לא בונים מבנה אחר.

**עברית:**
- כל טקסט בעברית ב-JavaScript בתוך backticks.
- מילים של הנושא בכתיב הנכון: מואר, חשוך, מולד, ירח מלא, צפיפות, ציפה, מוליך, מבודד, נורה, סוללה, מנוף, נקודת משען, ממברנה, ריכוז. גרשיים בתוך מירכאות רגילות שוברים את הקוד.
- מספר ויחידה בטקסט: `nu(x, 'm/s')`. יחידות בסימנים הבינלאומיים (m, s, kg, °C, J, V, A, N, Ω). לא יחידה בעברית ליד מספר.
- לכל גודל היחידה שלו: אנרגיה ב-J, טמפרטורה ב-°C, כוח ב-N.
- סימנים מיוחדים כתווים עצמם (μ, Ω, ², ₁), לא `&mu;` ולא `\Omega`.
- אות יחס צמודה למילה: "כשמחממים", "בחימום". לא "כ שמחממים".
- **בלי `$` ובלי LaTeX בשום מקום בתשובה: לא בדף, לא בבלוק המודל ולא בצ'אט.** הצ'אט של Gemini והדף לא מציגים אותו, והמורה רואה `$V$`. נוסחה כותבים בטקסט רגיל: `E = m·g·h`, `v = a·t`.


**הלימוד:**
- `afterText` כותב מה קרה בריצה הזאת, עם המספרים שלה. לא "צדקתם", "נכון" או "טעיתם": התלמיד משווה בעצמו לניחוש שלו.
- `limits`: 2-3 שורות קצרות, למשל "החלקיקים בציור גדולים פי מיליון", "אין כאן התנגדות אוויר". אם `SPEED` שונה מ-1, שורה "הזמן מואץ פי X".

## השלד: תמיד מתחילים ממנו

כל סימולציה נבנית מהשלד הזה. משנים רק את החלקים שמסומנים `// ← למלא`. לא מוחקים חלק, לא משנים את הלולאה, לא משנים את זרימת הניחוש. כי השלד כבר שומר על 8 הכללים: זמן קבוע, טבלת מורה מהמודל, ניחוש לפני ריצה, טקסט אחרי ריצה מהערכים, עברית ב-HTML.

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>סימולציה</title>
<style>
  [hidden] { display: none !important; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 17px/1.5 system-ui, Arial, sans-serif; background: #f4f6f9; color: #1d2433; }
  main { max-width: 720px; width: 100%; margin: 0 auto; padding: 12px; }
  .card { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
  canvas { width: 100%; aspect-ratio: 16 / 10; display: block; background: #0f1b2d; border-radius: 10px; }
  button { font: inherit; min-height: 44px; padding: 0 16px; border-radius: 10px; border: 1px solid #b8c2d6; background: #fff; cursor: pointer; }
  button:disabled { opacity: .45; cursor: default; }
  .opt { display: block; width: 100%; text-align: start; margin: 6px 0; }
  .opt.chosen { background: #dbe7ff; border-color: #2f5fd0; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; }
  label { display: block; margin-top: 8px; }
  input[type=range] { width: 100%; }
  .vals { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
  .val { background: #f4f6f9; border-radius: 8px; padding: 8px; }
  table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #ccd; padding: 4px; text-align: center; }
</style>
</head>
<body>
<main>
  <h1 id="title"></h1>
  <p id="goal"></p>

  <section class="card" id="predict">
    <div>ניחוש לפני ההפעלה</div>
    <strong id="q"></strong>
    <div id="opts"></div>
  </section>

  <canvas id="cv"></canvas>

  <section class="card">
    <div id="sliders"></div>
    <div class="row" style="margin-top:10px">
      <button id="play" disabled>▶ להפעיל</button>
      <button id="pause">⏸ לעצור</button>
      <button id="reset">↺ מההתחלה</button>
    </div>
  </section>

  <section class="card vals" id="vals"></section>

  <section class="card" id="after" hidden>
    <p id="afterText"></p>
    <p><strong>מה ראיתם? למה זה קרה?</strong></p>
  </section>

  <section class="card"><strong>מה המודל לא מראה</strong><ul id="limits"></ul></section>

  <section class="card">
    <button id="teacherBtn">בדיקת המודל למורה</button>
    <div id="teacher" hidden></div>
  </section>
</main>
<script>
// ===== 1. התוכן  ← למלא =====
const TEXT = {
  title: `...`,
  goal: `מה בודקים: ...`,
  question: `...?`,
  options: [`...`, `...`, `...`],   // תשובה נכונה אחת ו-2 תפיסות שגויות. הנכונה לא תמיד ראשונה
  limits: [`...`, `...`],
};
// הקבועים, עם יחידה בשם או בהערה
const CONST = { g: 9.8 /* m/s² */ };
// עד 2 סליידרים. unit בסימן לועזי
const SLIDERS = [
  { id: 'a', label: `...`, min: 1, max: 10, step: 0.5, value: 5, unit: 'kg' },
];

// ===== 2. המודל  ← למלא =====
// מצב התחלתי מהפרמטרים
function initState(p) { return { t: 0 /* , ... */ }; }
// צעד אחד בזמן קבוע DT. בלי ציור ובלי DOM
function step(s, p, dt) { s.t += dt; /* ... */ }
// הגודל שנשמר, מחושב בנפרד מהצעד (אנרגיה כוללת, מסה, מספר חלקיקים, זרם)
function conserved(s, p) { return { name: `...`, value: 0, unit: 'J' }; }
// הערכים שמוצגים לתלמיד: [שם, מספר, יחידה]
function readouts(s, p) { return [[`זמן`, s.t, 's']]; }
// מתי הריצה נגמרת (למשל הגוף נעצר או נגע ברצפה). אין סוף? return false
function finished(s, p) { return false; }
// הטקסט אחרי הריצה, מהערכים של הריצה הזאת בלבד. מספר ויחידה תמיד דרך nu(x, 'm/s')
function afterText(s, p) { return `...`; }

// ===== 3. הציור  ← למלא =====
// הכול בקואורדינטות של המודל. toPx ממיר למסך, ו-W, H הם הרוחב והגובה של ה-canvas
function draw(ctx, s, p, W, H) { /* צורות בלבד. בלי fillText בעברית */ }
const WORLD = { w: 10, h: 6.25 };  // גודל העולם ביחידות של המודל (מטרים, למשל)
function toPx(x, y, W, H) { return [x / WORLD.w * W, H - y / WORLD.h * H]; }

// ===== 4. השלד: לא משנים מכאן =====
const DT = 0.01;                 // שניות של מודל בכל צעד
const SPEED = 1;                 // כמה שניות של מודל בכל שנייה של מסך. אם שונה מ-1, לכתוב את זה ב-limits
let P = {}, S, running = false, guess = null, acc = 0, last = null;
const el = (id) => document.getElementById(id);
const fmt = (x) => (typeof x !== 'number' || !isFinite(x)) ? '—' : Number.isInteger(x) ? String(x) : (Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2));
// nu: מספר ויחידה בתוך טקסט (afterText, כותרות). שומר על הסדר הנכון ליד עברית
const nu = (x, u) => '⁦' + fmt(x) + (u ? ' ' + u : '') + '⁩';
const numUnit = (x, u) => { const b = document.createElement('bdi'); b.dir = 'ltr'; b.textContent = fmt(x) + (u ? ' ' + u : ''); return b; };

function buildUI() {
  SLIDERS.forEach((sl) => { P[sl.id] = sl.value; });   // כל הערכים קיימים לפני הציור הראשון
  el('title').textContent = TEXT.title; el('goal').textContent = TEXT.goal; el('q').textContent = TEXT.question;
  TEXT.options.forEach((o, i) => { const b = document.createElement('button'); b.className = 'opt'; b.textContent = o;
    b.onclick = () => { guess = i; document.querySelectorAll('.opt').forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); el('play').disabled = false; };
    el('opts').appendChild(b); });
  SLIDERS.forEach((sl) => { const l = document.createElement('label'); const r = document.createElement('input');
    Object.assign(r, { type: 'range', min: sl.min, max: sl.max, step: sl.step, value: sl.value }); r.dir = 'ltr';
    const show = () => { P[sl.id] = +r.value; l.firstChild.textContent = sl.label + ': '; l.children[0].replaceWith(numUnit(P[sl.id], sl.unit)); if (S) reset(); };
    l.append(sl.label + ': ', document.createElement('bdi'), r); r.oninput = show; el('sliders').appendChild(l); P[sl.id] = sl.value; show(); });
  TEXT.limits.forEach((t) => { const li = document.createElement('li'); li.textContent = t; el('limits').appendChild(li); });
  el('play').onclick = () => { running = true; last = null; el('after').hidden = true; };
  el('pause').onclick = () => { running = false; showAfter(); };
  el('reset').onclick = reset;
  el('teacherBtn').onclick = () => { el('teacher').hidden = !el('teacher').hidden; teacherTable(); };
  addEventListener('resize', render);
}
function reset() { S = initState(P); running = false; acc = 0; el('after').hidden = true; render(); }
function showAfter() { if (guess === null || S.t === 0) return;
  el('afterText').textContent = `ניחשתם: ${TEXT.options[guess]}. ` + afterText(S, P); el('after').hidden = false; }
function render() {
  const cv = el('cv'), r = devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * r; cv.height = H * r; const ctx = cv.getContext('2d'); ctx.setTransform(r, 0, 0, r, 0, 0);
  ctx.clearRect(0, 0, W, H);
  try { draw(ctx, S, P, W, H); } catch (e) { console.error(e); }
  const box = el('vals'); box.innerHTML = '';
  const c = conserved(S, P);
  [...readouts(S, P), ...(c ? [[c.name, c.value, c.unit]] : [])].forEach(([n, v, u]) => { const d = document.createElement('div'); d.className = 'val';
    d.append(n + ': ', numUnit(v, u)); box.appendChild(d); });
}
function teacherTable() {
  const times = [0, 1, 2, 5, 10]; let s = initState(P), rows = [];
  for (const T of times) { while (s.t < T - 1e-9) step(s, P, DT); const c = conserved(s, P);
    rows.push([T, ...readouts(s, P).map(x => fmt(x[1])), ...(c ? [fmt(c.value)] : [])]); }
  const head = [`t (s)`, ...readouts(S, P).map(x => `${x[0]} (${x[2]})`), ...(conserved(S, P) ? [conserved(S, P).name] : [])];
  el('teacher').innerHTML = ''; const tb = document.createElement('table');
  [head, ...rows].forEach((r, i) => { const tr = tb.insertRow(); r.forEach(v => { const c = document.createElement(i ? 'td' : 'th'); c.textContent = v; tr.appendChild(c); }); });
  el('teacher').appendChild(tb);
}
function loop(now) {
  if (running) { if (last !== null) acc += Math.min((now - last) / 1000, 0.1) * SPEED;
    last = now; while (acc >= DT && !finished(S, P)) { step(S, P, DT); acc -= DT; }
    if (finished(S, P)) { running = false; showAfter(); } render(); }
  requestAnimationFrame(loop);
}
buildUI(); reset(); requestAnimationFrame(loop);
</script>
</body>
</html>
```

הזמן בין פריימים רק קובע כמה צעדים של `DT` לרוץ. החישוב עצמו תמיד ב-`DT` קבוע, ולכן התוצאה זהה בכל מחשב.


## מה מחזירים

1. **מה נקבע:** שורה אחת: נושא, כיתה, מה התלמיד משנה ומה הוא מגלה.
2. **המודל:** 4-6 שורות בטקסט רגיל, בלי `$`: משתנים ויחידות, החוק (`E = m·g·h`), מה נשמר, מה פושט.
3. **הקוד:** קובץ HTML אחד מלא, ב-Canvas (או בבלוק קוד אחד בצ'אט).
4. **בדיקה של 2 דקות לפני הכיתה:** 4 צעדים קצרים למורה. למשל: "1. להזיז כל סליידר לקצה. 2. ללחוץ על 'בדיקת המודל למורה' ולבדוק ערך אחד ביד. 3. לפתוח בטלפון. 4. לבדוק שהערך הנשמר לא משתנה."
5. **לשלוח לתלמידים:** שורה אחת: "בחשבון של בית ספר אין קישור לשיתוף ב-Canvas. הסקיל sites-student-app מסביר איך שולחים דרך Google Sites."

לפני שמחזירים, עוברים על 8 הכללים אחד אחד, ומחפשים `$` בכל התשובה. אם כלל נשבר, מתקנים את הקוד, ולא כותבים הסבר למה הוא נשבר.
