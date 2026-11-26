---
name: apps-script-escape-room
description: 'משחק חדר בריחה לתלמידים שמדווח למורה: כל ניסיון של כל תלמיד נשמר בגיליון Google Sheets, ולשונית "סיכום למורה" מראה כמה עברו כל שלב, כמה ניסיונות זה לקח, ומי תקוע איפה. השתמש כשמורה מבקש חדר בריחה, משחק, משחק שלבים, "מנעולים", או "משחק שאדע מי נתקע", בכל מקצוע. כותב 2 קבצים ל-Google Apps Script (Code.gs ו-Index.html), עם התשובות רק בשרת, ומסביר צעד אחר צעד איך לפרסם. לא להפעיל ללומדה או בוחן רגילים עם ציון בסוף (לזה יש apps-script-lomda), לסיכום של גיליון תשובות קיים (apps-script-dashboard), או לתיקון קוד קיים (apps-script-fix).'
---

# חדר בריחה שמדווח למורה

משחק חדר בריחה שתלמידים פותחים בקישור, גם בטלפון. כל שלב הוא "מנעול": תשובה נכונה פותחת את השלב הבא. כל ניסיון נשמר בגיליון של המורה, והמורה רואה מי נתקע ובאיזה שלב.

המורה **לא יודע לתכנת.** הוא מדביק 2 קבצים ולוחץ על כפתורים. לכן הקוד מלא, עובד בהדבקה אחת, וההוראות מדויקות.

## עקרונות

- **המשחק המלא כבר בתשובה הראשונה, כשיש נושא וכיתה.** לכתוב את השלבים בעצמך ולבנות מיד, עם ברירות המחדל שבהמשך. הסיבה: מורה שמקבל שאלון לפני משחק, עוזב.
  - יוצא דופן אחד: אין נושא או אין כיתה. אז הודעה קצרה אחת: "על איזה נושא, ולאיזו כיתה? אפשר גם להדביק את השאלות שלכם." בלי קוד בהודעה הזאת.
  - אחרי שהמורה עונה, או כותב "תחליט אתה": לבנות מיד. לא לשאול שוב.
- **ברירות מחדל:** 5 שלבים. שלב הוא שאלה אמריקאית עם 4 תשובות, או תשובה קצרה (מספר או מילה). רמז אחרי 2 ניסיונות שגויים. התלמיד מקליד שם וכיתה. בלי טיימר. המורה יכול לשנות כל אחת מהן בבקשה הבאה.
- **התשובות רק בשרת.** התשובה הנכונה נשמרת רק ב-Code.gs. הסיבה: תלמיד שפותח "הצג מקור" בדפדפן לא יראה אותה. גם פונקציית הבדיקה מחזירה רק "נכון / לא נכון", רמז, ואת השלב הבא. אף פעם לא את התשובה הנכונה.
- **כל ניסיון נשמר, לא רק הסוף.** הסיבה: המורה רוצה לדעת איפה תלמידים נתקעו, ולא רק מי סיים.
- **שאלות שהמורה הדביק נכנסות מילה במילה.** שאלה שאתה כותב: נכונה במקצוע, ברמה של הכיתה, ומסיח הוא טעות אמיתית של תלמידים.
- **פרטיות.** שם וכיתה שהתלמיד מקליד, בלבד. אף פעם לא תעודת זהות, מייל או טלפון, גם אם המורה ביקש: לכתוב במשפט אחד שהשם והכיתה מספיקים כדי לדעת מי תקוע. אם המורה הדביק רשימת תלמידים, אבחון או התאמה של תלמיד מסוים: לא לחזור על השמות בתשובה, ולא להכניס אותם לקוד, גם לא כרשימה לבחירה. הסיבה: כל מי שיש לו את הקישור יכול לראות את קוד הדף. התאמות נותנים לכולם (הקראה, הגדלת גופן, בלי טיימר).
- **לענות בשפה שבה המורה כתב.**

### 3 בקשות שלא בונים כמו שהן

- **זיהוי AI או העתקה** ("שיתפוס מי העתיק", "עמודה של חשד"): משפט אחד שקוד לא יכול לדעת את זה, ושאלה אחת: "לבנות את המשחק בלי זה?". בלי קוד בתשובה הזאת. הסיבה: המורה ביקש דבר שהמשחק לא יכול לתת, והוא צריך להחליט אם הוא רוצה את השאר.
- **ציון במבחן או ציון 0-100:** לבנות את המשחק כמו שהוא, בלי ציון. משפט אחד בשורת "מה נקבע": המשחק מראה ניסיונות ושלבים, ולציון יש את apps-script-lomda.
- **בקשה שסותרת את עצמה** ("בלי רמזים" וגם "רמז אחרי 2 טעויות"): לבחור באפשרות אחת, ולכתוב בשורת "מה נקבע" מה בחרת ולמה. ב"בלי רמזים": `const HINT_AFTER = 999;`.

## שלבי עבודה

1. **לבדוק שיש נושא וכיתה.** אם אין, השאלה הקצרה שלמעלה, ולעצור.
2. **לכתוב את השלבים:** שאלה, סוג (בחירה או תשובה קצרה), תשובה נכונה, רמז אחד שמכוון בלי לגלות. בשאלות בחירה, התשובה הנכונה במקום אחר בכל שלב.
3. **להעתיק את 2 הקבצים** מ"איך הקוד בנוי", ולשנות רק את `TITLE`, את `STAGES` ואת הצבעים.
4. **בדיקה לפני שליחה:**
   - חוץ מ-`TITLE`, `STAGES` (ו-`HINT_AFTER` אם צריך) והצבעים, הקוד זהה מילה במילה לקוד שבסקיל?
   - כל שלב ב-`STAGES` בנוי לפי התבנית, עם פסיק בין שלבים? כל טקסט בעברית בתוך backticks?
   - בשאלות אמריקאיות, ה-`answer` מצביע על התשובה הנכונה, והמקום מתחלף בין השלבים?
   - אין שלב שהשאלה שלו מגלה את התשובה של שלב אחר?
   - שאלות של המורה נכנסו מילה במילה? כל תשובה נכונה באמת נכונה?
   - אין בקוד ובתשובה שם אמיתי של תלמיד, אבחון, תעודת זהות, מייל או טלפון?

## איך הקוד בנוי

הקוד של המשחק זהה בכל מקצוע. רק השם והשלבים משתנים. לכן **מעתיקים את 2 הקבצים שלמטה כמו שהם**, ומשנים רק:

- ב-Code.gs: `TITLE` ו-`STAGES`, בין 2 שורות ההערה בראש הקובץ. ואם צריך, המספר ב-`HINT_AFTER`. שום דבר אחר.
- ב-Index.html: מותר לשנות רק את 6 הצבעים ב-`:root`, כדי שיתאימו לנושא (ים, חלל, יער), ואת `placeholder="שם"` במשחק בקבוצות. שום דבר אחר.

הסיבה: הקוד הזה נבדק בגיליון מדומה. הוא שומר כל ניסיון, נותן רמז אחרי 2 טעויות, ממשיך מאותו שלב אחרי רענון, ומעדכן את "סיכום למורה". קוד שכותבים מחדש בכל פעם נשבר: שלב שנספר פעם מ-0 ופעם מ-1, או מילה שנשארה בתוך רשימה.

**איך כותבים שלב ב-`STAGES`:**
- שאלה אמריקאית: ``{ q: `...`, type: 'choice', options: [`...`, `...`, `...`, `...`], answer: 2, hint: `...` }``. ה-`answer` הוא המקום של התשובה הנכונה, מ-0. המקום מתחלף בין השלבים.
- תשובה קצרה: ``{ q: `...`, type: 'text', answer: [12, `שתים עשרה`], hint: `...` }``. ה-`answer` הוא רשימה של כל התשובות הנכונות. מספר נבדק כמספר (12 = 12.0). מילה עם ה' הידיעה ובלי: לכתוב את 2 הצורות.
- כל טקסט בעברית בתוך backticks (`` ` ``), כי מירכאות כפולות נשברות במילים כמו תנ"ך.
- ביטוי מתמטי או אנגלית בתוך שאלה: כמו שהוא, בלי תגיות HTML. הדף מציג את השאלה כטקסט.

### Code.gs

```javascript
// ===== כאן משנים את שם המשחק ואת השלבים =====
const TITLE = `בורחים ממחזור המים`;
const STAGES = [
  { q: `איך קוראים למעבר של מים מנוזל לגז?`, type: 'choice',
    options: [`התעבות`, `אידוי`, `המסה`, `קיפאון`], answer: 1,
    hint: `זה קורה לשלולית ביום חם.` },
  { q: `כמה מצבי צבירה יש למים במחזור המים?`, type: 'text',
    answer: [3, `שלושה`, `שלוש`],
    hint: `חשבו על קרח, מים ואדים.` },
];
// ===== מכאן והלאה לא צריך לשנות =====
const LOG = `ניסיונות`;
const SUMMARY = `סיכום למורה`;
const HINT_AFTER = 2;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// השלבים בלי תשובות ובלי רמזים
function getStages() {
  return {
    title: TITLE,
    stages: STAGES.map(function (s) { return { q: s.q, type: s.type, options: s.options || [] }; })
  };
}

function logSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LOG);
  if (!sh) {
    sh = ss.insertSheet(LOG);
    sh.appendRow([`זמן`, `שם`, `כיתה`, `שלב`, `תשובה`, `נכון`]);
  }
  return sh;
}

// כל השורות של הניסיונות, בלי שורת הכותרות
function rows_() {
  const sh = logSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 6).getValues();
}

function norm_(x) {
  return String(x).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[−–]/g, '-');
}

function isRight_(stage, answer) {
  if (stage.type === 'choice') return Number(answer) === Number(stage.answer);
  const goods = Array.isArray(stage.answer) ? stage.answer : [stage.answer];
  const a = norm_(answer);
  return goods.some(function (g) {
    const n1 = parseFloat(a), n2 = parseFloat(g);
    if (!isNaN(n1) && !isNaN(n2) && /^[-+]?[\d.]+$/.test(a)) return Math.abs(n1 - n2) < 1e-9;
    return norm_(g) === a;
  });
}

// index מתחיל ב-0. בגיליון השלב נשמר כ-index + 1
function checkStage(name, group, index, answer) {
  index = Number(index);
  const stage = STAGES[index];
  if (!stage) return { ok: false, message: `שלב לא קיים` };
  name = String(name || '').trim();
  group = String(group || '').trim();
  const correct = isRight_(stage, answer);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    logSheet_().appendRow([new Date(), name, group, index + 1, String(answer), correct ? `כן` : `לא`]);
    updateSummary();
  } finally {
    lock.releaseLock();
  }
  let wrong = 0;
  rows_().forEach(function (r) {
    if (r[1] === name && String(r[2]) === group && Number(r[3]) === index + 1 && r[5] === `לא`) wrong++;
  });
  return {
    ok: true,
    correct: correct,
    hint: !correct && wrong >= HINT_AFTER ? stage.hint : '',
    done: correct && index === STAGES.length - 1
  };
}

// השלב הראשון (מ-0) שהתלמיד עוד לא פתר
function getProgress(name, group) {
  name = String(name || '').trim();
  group = String(group || '').trim();
  const solved = {};
  rows_().forEach(function (r) {
    if (r[1] === name && String(r[2]) === group && r[5] === `כן`) solved[Number(r[3])] = true;
  });
  let i = 0;
  while (i < STAGES.length && solved[i + 1]) i++;
  return i;
}

function updateSummary() {
  const players = {};
  rows_().forEach(function (r) {
    const key = r[1] + ' (' + r[2] + ')';
    const p = players[key] || (players[key] = { tries: {}, solved: {} });
    const st = Number(r[3]);
    p.tries[st] = (p.tries[st] || 0) + 1;
    if (r[5] === `כן`) p.solved[st] = true;
  });
  const out = [[`שלב`, `כמה הגיעו`, `כמה עברו`, `ממוצע ניסיונות למי שעבר`, `תקועים עכשיו`]];
  let worst = -1, worstCount = 0, finished = 0;
  Object.keys(players).forEach(function (k) {
    if (Object.keys(players[k].solved).length >= STAGES.length) finished++;
  });
  for (let st = 1; st <= STAGES.length; st++) {
    let reached = 0, passed = 0, sum = 0;
    const stuck = [];
    Object.keys(players).forEach(function (k) {
      const p = players[k];
      if (!p.tries[st]) return;
      reached++;
      if (p.solved[st]) { passed++; sum += p.tries[st]; return; }
      let first = 1;
      while (first <= STAGES.length && p.solved[first]) first++;
      if (first === st) stuck.push(k);
    });
    if (stuck.length > worstCount) { worstCount = stuck.length; worst = st; }
    out.push([st, reached, passed, passed ? Math.round(sum / passed * 10) / 10 : '', stuck.join(', ')]);
  }
  out.push([`סיימו את כל השלבים`, finished, '', '', '']);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY);
  sh.clear();
  sh.setRightToLeft(true);
  sh.getRange(1, 1, out.length, 5).setValues(out);
  sh.getRange(1, 1, 1, 5).setFontWeight('bold');
  if (worst > 0) sh.getRange(worst + 1, 1, 1, 5).setBackground('#FFF2B3');
}
```

### Index.html

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<style>
  :root { --bg: #0f1b2d; --card: #1b2b45; --ink: #f2f5fa; --accent: #ffc250; --ok: #3ccf7a; --bad: #ff6b6b; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--ink); font-family: system-ui, Arial, sans-serif; font-size: 18px; display: flex; align-items: center; justify-content: center; padding: 16px; }
  body.big { font-size: 22px; }
  .card { background: var(--card); border-radius: 18px; padding: 24px; width: 100%; max-width: 560px; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
  h1 { margin: 0 0 12px; font-size: 1.5em; text-align: center; }
  .locks { text-align: center; font-size: 1.6em; letter-spacing: 6px; margin-bottom: 6px; }
  .count { text-align: center; opacity: .8; margin-bottom: 16px; }
  input, button { font: inherit; width: 100%; padding: 14px; border-radius: 12px; border: 0; margin: 6px 0; }
  input { background: #fff; color: #111; }
  button { background: var(--accent); color: #111; font-weight: 700; cursor: pointer; }
  button:disabled { opacity: .5; cursor: default; }
  button.opt { background: #2c4268; color: var(--ink); text-align: right; }
  .tools { display: flex; gap: 8px; justify-content: flex-start; }
  .tools button { width: auto; padding: 8px 12px; background: #2c4268; color: var(--ink); }
  .hint { background: #2c4268; border-radius: 12px; padding: 12px; margin-top: 10px; }
  .msg { position: fixed; top: 12px; right: 12px; left: 12px; background: var(--bad); color: #fff; padding: 12px; border-radius: 12px; text-align: center; }
  .hidden { display: none; }
  .shake { animation: shake .4s; }
  @keyframes shake { 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
  .pop { animation: pop .5s; }
  @keyframes pop { 50% { transform: scale(1.4); } }
</style>
</head>
<body>
<div id="msg" class="msg hidden" role="alert"></div>
<div class="card" id="card">
  <h1 id="title">חדר בריחה</h1>

  <section id="start">
    <input id="name" placeholder="שם" autocomplete="off">
    <input id="group" placeholder="כיתה" autocomplete="off">
    <button id="go" disabled>נכנסים לחדר</button>
  </section>

  <section id="play" class="hidden">
    <div class="locks" id="locks"></div>
    <div class="count" id="count"></div>
    <div class="tools"><button id="read">🔊</button><button id="bigger">A+</button></div>
    <p id="q"></p>
    <div id="answers"></div>
    <div id="feedback" role="status"></div>
    <div id="hint" class="hint hidden"></div>
  </section>

  <section id="end" class="hidden">
    <h1>יצאתם מהחדר! 🎉</h1>
    <p id="endText" style="text-align:center"></p>
  </section>
</div>

<script>
  let stages = [], cur = 0, tries = 0, busy = false;
  const $ = (id) => document.getElementById(id);

  function showMsg(t) { $('msg').textContent = t; $('msg').classList.remove('hidden'); }
  function hideMsg() { $('msg').classList.add('hidden'); }
  function fail() { busy = false; showMsg('משהו השתבש. נסו שוב או קראו למורה'); setButtons(true); }
  function setButtons(on) { document.querySelectorAll('#answers button').forEach((b) => { b.disabled = !on; }); }

  function checkStart() { $('go').disabled = !($('name').value.trim() && $('group').value.trim()); }
  $('name').addEventListener('input', checkStart);
  $('group').addEventListener('input', checkStart);
  $('bigger').onclick = () => document.body.classList.toggle('big');
  $('read').onclick = () => {
    const u = new SpeechSynthesisUtterance($('q').textContent);
    u.lang = 'he-IL';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  google.script.run.withSuccessHandler((d) => {
    stages = d.stages;
    $('title').textContent = d.title;
  }).withFailureHandler(fail).getStages();

  $('go').onclick = () => {
    $('go').disabled = true;
    google.script.run.withSuccessHandler((i) => {
      cur = i;
      $('start').classList.add('hidden');
      if (cur >= stages.length) return finish();
      $('play').classList.remove('hidden');
      show();
    }).withFailureHandler((e) => { $('go').disabled = false; fail(e); })
      .getProgress($('name').value.trim(), $('group').value.trim());
  };

  function show() {
    hideMsg();
    tries = 0;
    const s = stages[cur];
    $('locks').textContent = stages.map((x, i) => (i < cur ? '🔓' : '🔒')).join('');
    $('count').textContent = 'שלב ' + (cur + 1) + ' מתוך ' + stages.length;
    $('q').textContent = s.q;
    $('feedback').textContent = '';
    $('hint').classList.add('hidden');
    const box = $('answers');
    box.innerHTML = '';
    if (s.type === 'choice') {
      s.options.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.textContent = o;
        b.onclick = () => send(i);
        box.appendChild(b);
      });
    } else {
      const inp = document.createElement('input');
      inp.id = 'txt';
      inp.placeholder = 'התשובה שלכם';
      const b = document.createElement('button');
      b.textContent = 'פותחים את המנעול';
      b.onclick = () => { if (inp.value.trim()) send(inp.value.trim()); };
      box.appendChild(inp);
      box.appendChild(b);
    }
  }

  function send(ans) {
    if (busy) return;
    busy = true;
    setButtons(false);
    $('feedback').textContent = 'בודק...';
    google.script.run.withSuccessHandler((r) => {
      busy = false;
      if (!r || !r.ok) return fail();
      tries++;
      if (r.correct) {
        $('locks').classList.add('pop');
        setTimeout(() => $('locks').classList.remove('pop'), 500);
        if (r.done) return finish();
        cur++;
        show();
      } else {
        setButtons(true);
        $('feedback').textContent = 'לא נכון, נסו שוב';
        $('card').classList.add('shake');
        setTimeout(() => $('card').classList.remove('shake'), 400);
        if (r.hint) { $('hint').textContent = '💡 רמז: ' + r.hint; $('hint').classList.remove('hidden'); }
      }
    }).withFailureHandler(fail).checkStage($('name').value.trim(), $('group').value.trim(), cur, ans);
  }

  function finish() {
    $('play').classList.add('hidden');
    $('end').classList.remove('hidden');
    $('endText').textContent = 'פתחתם את כל ' + stages.length + ' המנעולים.';
  }
</script>
</body>
</html>
```

## מבנה התשובה

1. **מה נקבע:** שורה אחת. נושא, כיתה, מספר שלבים וסוגם, מתי מופיע רמז.
2. **השלבים:** רשימה קצרה. השאלה והתשובה הנכונה של כל שלב, כדי שהמורה יבדוק לפני שהוא מדביק.
3. **הוראות התקנה**, ממוספרות, פעולה אחת בכל צעד, עם שמות הכפתורים בעברית ובאנגלית בסוגריים:
   1. פותחים גיליון חדש ב-Google Sheets ונותנים לו שם.
   2. תוספים (Extensions) ← Apps Script.
   3. מוחקים את מה שכתוב ב-`Code.gs` ומדביקים את הקוד הראשון.
   4. לוחצים על + ליד "קבצים" ← HTML, קוראים לקובץ `Index` בדיוק, ומדביקים את הקוד השני.
   5. שומרים.
   6. פריסה (Deploy) ← פריסה חדשה (New deployment) ← סוג: אפליקציית אינטרנט (Web app).
   7. ביצוע בתור (Execute as): **אני**. למי יש גישה (Who has access): **כל מי שבארגון**, או **כל אחד** אם לתלמידים אין חשבון בית ספר.
   8. מאשרים הרשאות. אם כתוב "Google לא אימתה את האפליקציה": מתקדם (Advanced) ← מעבר לפרויקט. זה הקוד שלכם. בחלון ההרשאות מסמנים את כל התיבות (Select all), אחרת המשחק לא שומר.
   9. פותחים את הקישור בעצמכם ומשחקים שלב אחד. בודקים שנוספה שורה בלשונית "ניסיונות" ושהלשונית "סיכום למורה" התעדכנה.
   10. בודקים את הקישור גם מחשבון של תלמיד, לפני השיעור. בחלק מהמחוזות אפליקציות חסומות לתלמידים.
   11. שולחים לתלמידים את הקישור.
4. **Code.gs:** בלוק קוד אחד, מלא.
5. **Index.html:** בלוק קוד אחד, מלא.
6. **כשמשנים משהו:** פריסה ← ניהול פריסות (Manage deployments) ← עריכה ← גרסה: **גרסה חדשה** ← פריסה. בלי זה התלמידים רואים את הגרסה הישנה. הקישור לא משתנה.
7. **אם משהו לא עובד:** 3 תקלות ותיקון בשורה: "Script function not found: doGet" (לא שמרו); דף ריק (שם הקובץ לא בדיוק `Index`); תלמידים לא נכנסים (הגישה לא "כל מי שבארגון", או שמנהל המערכת חוסם).

בלי משפט פתיחה, ובלי הצעה לעוד משהו בסוף.

## מלכודות

- **Canvas לא שומר תשובות.** לא לבנות את המשחק ב-Canvas ולא להציע את זה. כל הסיבה לסקיל היא הגיליון.
- **רמז שמגלה את התשובה** ("התשובה מתחילה ב-4") הוא לא רמז. רמז מזכיר כלל, נוסחה או מקום בחומר.
- **"תקוע" הוא לא "לא התחיל".** תלמיד שעוד לא ניסה שלב לא נספר כתקוע בו.
- **תשובה קצרה בעברית:** לקבל גם עם ה' הידיעה ובלי ("הכנסת" / "כנסת") כשזה אותו דבר, ולכתוב את 2 הצורות ברשימת התשובות הנכונות.
- **משחק בקבוצות** (כל הקבוצה עונה יחד): אותו קוד. ב-Index.html משנים רק את `placeholder="שם"` ל-`placeholder="שם הקבוצה"`. לא מבקשים את השמות של חברי הקבוצה.
- **שינוי בקוד שלא ביקשו** (ציון, טיימר, רשימת תלמידים, שליחת מייל): לא להוסיף. מה שהמורה צריך ושלא נמצא בקוד, לכתוב בשורה אחת אחרי ההוראות.

## דוגמה

**המורה:** תבנה לי חדר בריחה על מחזור המים לכיתה ה'.

**התשובה (קטע: חלקים 1, 2 ו-3, ובלוק אחד מתוך Code.gs):**

**מה נקבע:** מחזור המים, כיתה ה', 5 שלבים (3 אמריקאיות ו-2 תשובות קצרות), רמז אחרי 2 טעויות, שם וכיתה.

**השלבים:**
1. איך קוראים למעבר של מים מנוזל לגז? (אידוי)
2. מה נוצר כשאדי מים מתקררים גבוה בשמיים? (עננים)
3. כמה מצבי צבירה יש למים במחזור המים? (3)
4. איך קוראים למים שיורדים מהענן? (משקעים)
5. לאן זורמים רוב מי הנהרות בסוף? (לים)

**הוראות התקנה:** 11 הצעדים שלמעלה.

**Code.gs** (רק החלק שמשתנה; כל השאר בדיוק כמו בקוד שבסקיל):

```javascript
// ===== כאן משנים את שם המשחק ואת השלבים =====
const TITLE = `בורחים ממחזור המים`;
const STAGES = [
  { q: `איך קוראים למעבר של מים מנוזל לגז?`, type: 'choice',
    options: [`התעבות`, `אידוי`, `המסה`, `קיפאון`], answer: 1,
    hint: `זה קורה לשלולית ביום חם.` },
  { q: `מה נוצר כשאדי מים מתקררים גבוה בשמיים?`, type: 'choice',
    options: [`עננים`, `נהרות`, `קרחונים`, `מי תהום`], answer: 0,
    hint: `מסתכלים למעלה ביום אפור.` },
  { q: `כמה מצבי צבירה יש למים במחזור המים?`, type: 'text',
    answer: [3, `שלושה`, `שלוש`],
    hint: `חשבו על קרח, מים ואדים.` },
  { q: `איך קוראים למים שיורדים מהענן, כמו גשם ושלג?`, type: 'text',
    answer: [`משקעים`, `המשקעים`],
    hint: `המילה דומה ל"לשקוע".` },
  { q: `לאן זורמים רוב מי הנהרות בסוף?`, type: 'choice',
    options: [`להרים`, `למדבר`, `לים`, `לעננים`], answer: 2,
    hint: `חשבו על חוף הים.` },
];
// ===== מכאן והלאה לא צריך לשנות =====
```

בתשובה האמיתית, Code.gs ו-Index.html מלאים, כל אחד בבלוק אחד, בדיוק כמו בסקיל.
