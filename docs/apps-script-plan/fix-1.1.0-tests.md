# בדיקות ל-apps-script-fix 1.1.0 (מצב פרויקט גדול)

כל בדיקה בשיחה חדשה ב-Gemini, עם הסקיל מותקן (גרסה 1.1.0). בדיקה 2 היא המשך של בדיקה 1, באותה שיחה.

את הקוד בבדיקות כתב Claude. זה כלי בוחן קטן, רק לבדיקה.

## בדיקה 1: יש כרטיס, מבקשים שינוי

מה אמור לקרות: שורה אחת בלי קוד, שמבקשת את Code.gs, Index.html ו-Scripts.html. לא את Styles.html.

```
יש לי בוחן גדול ב-Apps Script. אני רוצה שהתלמיד יכתוב גם את הכיתה שלו, ושהכיתה תישמר בגיליון.

זה הכרטיס של הפרויקט:

/* כרטיס הפרויקט · עדכון מס' 2
סוג: אפליקציית אינטרנט
קבצים: Code.gs, Index.html, Styles.html, Scripts.html, Card.gs

פונקציות:
- doGet() · ב-Code.gs · מחזירה את הדף Index
- include(name) · ב-Code.gs · נקראת מ-Index.html · מחזירה את התוכן של Styles או Scripts
- getQuestions() · ב-Code.gs · נקראת מ-Scripts.html · מחזירה: רשימת שאלות, בלי התשובות הנכונות
- saveAnswer(name, answers) · ב-Code.gs · נקראת מ-Scripts.html · מחזירה: ציון (0-100) · כותבת ללשונית "תשובות"

לשוניות בגיליון (העמודות לפי הסדר):
- שאלות: מספר | שאלה | א | ב | ג | ד | נכונה
- תשובות: תאריך | שם | ציון

עדכון אחרון: העברתי את חישוב הציון ל-Code.gs.
*/
```

## בדיקה 2: מדביקים את הקבצים (באותה שיחה של בדיקה 1)

מה אמור לקרות: 3 הקבצים מלאים, בלי "שאר הקוד נשאר". Card.gs מעודכן, עם "עדכון מס' 3" ועמודה "כיתה". הוראה איזו כותרת להוסיף ללשונית "תשובות", ולפני כן לעשות עותק של הגיליון. בדיקה בקישור /dev ואחריה גרסה חדשה. 3 השורות של "אם משהו נשבר". שורה "לשינוי הבא: לפתוח שיחה חדשה".

```
הנה הקבצים:

קובץ Code.gs:
function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('בוחן במדעים')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function getQuestions() {
  const rows = SpreadsheetApp.getActive().getSheetByName('שאלות').getDataRange().getValues().slice(1);
  return rows.map(r => ({ num: r[0], text: r[1], options: [r[2], r[3], r[4], r[5]] }));
}

function saveAnswer(name, answers) {
  const ss = SpreadsheetApp.getActive();
  const rows = ss.getSheetByName('שאלות').getDataRange().getValues().slice(1);
  let score = 0;
  rows.forEach((r, i) => { if (answers[i] === r[6]) score++; });
  const grade = Math.round(score / rows.length * 100);
  ss.getSheetByName('תשובות').appendRow([new Date(), name, grade]);
  return grade;
}

קובץ Index.html:
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <base target="_top">
  <?!= include('Styles'); ?>
</head>
<body>
  <h1>בוחן במדעים</h1>
  <label>השם שלך: <input id="name" type="text"></label>
  <div id="questions">טוען שאלות...</div>
  <button id="send" onclick="send()">שליחה</button>
  <p id="result"></p>
  <?!= include('Scripts'); ?>
</body>
</html>

קובץ Scripts.html:
<script>
  let questions = [];
  google.script.run.withSuccessHandler(show).withFailureHandler(err).getQuestions();

  function show(list) {
    questions = list;
    document.getElementById('questions').innerHTML = list.map((q, i) =>
      '<div class="q"><p>' + q.num + '. ' + q.text + '</p>' +
      q.options.map(o => '<label><input type="radio" name="q' + i + '" value="' + o + '"> ' + o + '</label><br>').join('') +
      '</div>').join('');
  }

  function send() {
    const name = document.getElementById('name').value.trim();
    if (!name) { alert('צריך לכתוב שם'); return; }
    const answers = questions.map((q, i) => {
      const c = document.querySelector('input[name="q' + i + '"]:checked');
      return c ? c.value : '';
    });
    document.getElementById('send').disabled = true;
    google.script.run.withSuccessHandler(g => {
      document.getElementById('result').textContent = 'הציון שלך: ' + g;
    }).withFailureHandler(err).saveAnswer(name, answers);
  }

  function err(e) { document.getElementById('result').textContent = 'שגיאה: ' + e.message; }
</script>
```

## בדיקה 3: אין כרטיס, מדביקים הכול, ו-2 שינויים יחד

מה אמור לקרות: רק השינוי הראשון (טיימר). Card.gs חדש, והוראה איך ליצור קובץ חדש בשם Card. משפט שאת השינוי השני (צבע הכפתור) עושים בשיחה חדשה.

```
יש לי בוחן ב-Apps Script עם 4 קבצים. אני רוצה להוסיף טיימר של 10 דקות, שאחריו הבוחן נשלח לבד. וגם לשנות את צבע הכפתור לירוק.

קובץ Code.gs:
function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('בוחן במדעים')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function getQuestions() {
  const rows = SpreadsheetApp.getActive().getSheetByName('שאלות').getDataRange().getValues().slice(1);
  return rows.map(r => ({ num: r[0], text: r[1], options: [r[2], r[3], r[4], r[5]] }));
}

function saveAnswer(name, answers) {
  const ss = SpreadsheetApp.getActive();
  const rows = ss.getSheetByName('שאלות').getDataRange().getValues().slice(1);
  let score = 0;
  rows.forEach((r, i) => { if (answers[i] === r[6]) score++; });
  const grade = Math.round(score / rows.length * 100);
  ss.getSheetByName('תשובות').appendRow([new Date(), name, grade]);
  return grade;
}

קובץ Index.html:
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <base target="_top">
  <?!= include('Styles'); ?>
</head>
<body>
  <h1>בוחן במדעים</h1>
  <label>השם שלך: <input id="name" type="text"></label>
  <div id="questions">טוען שאלות...</div>
  <button id="send" onclick="send()">שליחה</button>
  <p id="result"></p>
  <?!= include('Scripts'); ?>
</body>
</html>

קובץ Styles.html:
<style>
  body { font-family: Arial, sans-serif; max-width: 640px; margin: 24px auto; padding: 0 12px; }
  h1 { color: #002045; }
  .q { background: #f4f6fa; border-radius: 8px; padding: 12px; margin: 12px 0; }
  button { background: #002045; color: #fff; border: 0; padding: 10px 24px; border-radius: 6px; font-size: 16px; }
  #result { font-size: 20px; font-weight: bold; }
</style>

קובץ Scripts.html:
<script>
  let questions = [];
  google.script.run.withSuccessHandler(show).withFailureHandler(err).getQuestions();

  function show(list) {
    questions = list;
    document.getElementById('questions').innerHTML = list.map((q, i) =>
      '<div class="q"><p>' + q.num + '. ' + q.text + '</p>' +
      q.options.map(o => '<label><input type="radio" name="q' + i + '" value="' + o + '"> ' + o + '</label><br>').join('') +
      '</div>').join('');
  }

  function send() {
    const name = document.getElementById('name').value.trim();
    if (!name) { alert('צריך לכתוב שם'); return; }
    const answers = questions.map((q, i) => {
      const c = document.querySelector('input[name="q' + i + '"]:checked');
      return c ? c.value : '';
    });
    document.getElementById('send').disabled = true;
    google.script.run.withSuccessHandler(g => {
      document.getElementById('result').textContent = 'הציון שלך: ' + g;
    }).withFailureHandler(err).saveAnswer(name, answers);
  }

  function err(e) { document.getElementById('result').textContent = 'שגיאה: ' + e.message; }
</script>
```

## בדיקה 4: קובץ HTML ארוך (250 שורות)

מה אמור לקרות: קודם הצעה לפצל ל-Index, Styles ו-Scripts, עם משפט אחד למה. קובץ אחד בכל הודעה, עם "לכתוב 'הבא'". ב-Code.gs: פונקציה include, ו-doGet עם createTemplateFromFile('Index').evaluate(). הכותרת וה-viewport נשארים. בדיקה ב-/dev שהדף נראה כמו קודם. את השאלה החדשה עושים בשיחה חדשה. שורה אחת בסוף: התשובות הנכונות והציון נמצאים ב-HTML, ותלמיד רואה אותם.

```
אני רוצה להוסיף לבוחן שאלה 31 על דינוזאורים.

קובץ Code.gs:
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('בוחן במדעים')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function saveGrade(name, grade) {
  SpreadsheetApp.getActive().getSheetByName('תשובות').appendRow([new Date(), name, grade]);
}

קובץ Index.html:
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<base target="_top">
<style>
  body { font-family: Arial, sans-serif; max-width: 640px; margin: 24px auto; padding: 0 12px; }
  h1 { color: #002045; }
  .q { background: #f4f6fa; border-radius: 8px; padding: 12px; margin: 12px 0; }
  .q p { font-weight: bold; margin-top: 0; }
  label { display: inline-block; padding: 4px 0; }
  button { background: #002045; color: #fff; border: 0; padding: 10px 24px; border-radius: 6px; font-size: 16px; }
  button:disabled { opacity: .5; }
  #result { font-size: 20px; font-weight: bold; }
</style>
</head>
<body>
<h1>בוחן במדעים: 30 שאלות</h1>
<label>השם שלך: <input id="name" type="text"></label>
  <div class="q" data-correct="ב">
    <p>1. שאלה על מים: מה נכון?</p>
    <label><input type="radio" name="q1" value="א"> תשובה א על מים</label><br>
    <label><input type="radio" name="q1" value="ב"> תשובה ב על מים</label><br>
    <label><input type="radio" name="q1" value="ג"> תשובה ג על מים</label><br>
    <label><input type="radio" name="q1" value="ד"> תשובה ד על מים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>2. שאלה על אור: מה נכון?</p>
    <label><input type="radio" name="q2" value="א"> תשובה א על אור</label><br>
    <label><input type="radio" name="q2" value="ב"> תשובה ב על אור</label><br>
    <label><input type="radio" name="q2" value="ג"> תשובה ג על אור</label><br>
    <label><input type="radio" name="q2" value="ד"> תשובה ד על אור</label>
  </div>
  <div class="q" data-correct="ב">
    <p>3. שאלה על צמחים: מה נכון?</p>
    <label><input type="radio" name="q3" value="א"> תשובה א על צמחים</label><br>
    <label><input type="radio" name="q3" value="ב"> תשובה ב על צמחים</label><br>
    <label><input type="radio" name="q3" value="ג"> תשובה ג על צמחים</label><br>
    <label><input type="radio" name="q3" value="ד"> תשובה ד על צמחים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>4. שאלה על חשמל: מה נכון?</p>
    <label><input type="radio" name="q4" value="א"> תשובה א על חשמל</label><br>
    <label><input type="radio" name="q4" value="ב"> תשובה ב על חשמל</label><br>
    <label><input type="radio" name="q4" value="ג"> תשובה ג על חשמל</label><br>
    <label><input type="radio" name="q4" value="ד"> תשובה ד על חשמל</label>
  </div>
  <div class="q" data-correct="ב">
    <p>5. שאלה על מגנט: מה נכון?</p>
    <label><input type="radio" name="q5" value="א"> תשובה א על מגנט</label><br>
    <label><input type="radio" name="q5" value="ב"> תשובה ב על מגנט</label><br>
    <label><input type="radio" name="q5" value="ג"> תשובה ג על מגנט</label><br>
    <label><input type="radio" name="q5" value="ד"> תשובה ד על מגנט</label>
  </div>
  <div class="q" data-correct="ב">
    <p>6. שאלה על חום: מה נכון?</p>
    <label><input type="radio" name="q6" value="א"> תשובה א על חום</label><br>
    <label><input type="radio" name="q6" value="ב"> תשובה ב על חום</label><br>
    <label><input type="radio" name="q6" value="ג"> תשובה ג על חום</label><br>
    <label><input type="radio" name="q6" value="ד"> תשובה ד על חום</label>
  </div>
  <div class="q" data-correct="ב">
    <p>7. שאלה על קול: מה נכון?</p>
    <label><input type="radio" name="q7" value="א"> תשובה א על קול</label><br>
    <label><input type="radio" name="q7" value="ב"> תשובה ב על קול</label><br>
    <label><input type="radio" name="q7" value="ג"> תשובה ג על קול</label><br>
    <label><input type="radio" name="q7" value="ד"> תשובה ד על קול</label>
  </div>
  <div class="q" data-correct="ב">
    <p>8. שאלה על כוח: מה נכון?</p>
    <label><input type="radio" name="q8" value="א"> תשובה א על כוח</label><br>
    <label><input type="radio" name="q8" value="ב"> תשובה ב על כוח</label><br>
    <label><input type="radio" name="q8" value="ג"> תשובה ג על כוח</label><br>
    <label><input type="radio" name="q8" value="ד"> תשובה ד על כוח</label>
  </div>
  <div class="q" data-correct="ב">
    <p>9. שאלה על אוויר: מה נכון?</p>
    <label><input type="radio" name="q9" value="א"> תשובה א על אוויר</label><br>
    <label><input type="radio" name="q9" value="ב"> תשובה ב על אוויר</label><br>
    <label><input type="radio" name="q9" value="ג"> תשובה ג על אוויר</label><br>
    <label><input type="radio" name="q9" value="ד"> תשובה ד על אוויר</label>
  </div>
  <div class="q" data-correct="ב">
    <p>10. שאלה על סלעים: מה נכון?</p>
    <label><input type="radio" name="q10" value="א"> תשובה א על סלעים</label><br>
    <label><input type="radio" name="q10" value="ב"> תשובה ב על סלעים</label><br>
    <label><input type="radio" name="q10" value="ג"> תשובה ג על סלעים</label><br>
    <label><input type="radio" name="q10" value="ד"> תשובה ד על סלעים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>11. שאלה על כוכבים: מה נכון?</p>
    <label><input type="radio" name="q11" value="א"> תשובה א על כוכבים</label><br>
    <label><input type="radio" name="q11" value="ב"> תשובה ב על כוכבים</label><br>
    <label><input type="radio" name="q11" value="ג"> תשובה ג על כוכבים</label><br>
    <label><input type="radio" name="q11" value="ד"> תשובה ד על כוכבים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>12. שאלה על גוף האדם: מה נכון?</p>
    <label><input type="radio" name="q12" value="א"> תשובה א על גוף האדם</label><br>
    <label><input type="radio" name="q12" value="ב"> תשובה ב על גוף האדם</label><br>
    <label><input type="radio" name="q12" value="ג"> תשובה ג על גוף האדם</label><br>
    <label><input type="radio" name="q12" value="ד"> תשובה ד על גוף האדם</label>
  </div>
  <div class="q" data-correct="ב">
    <p>13. שאלה על מזון: מה נכון?</p>
    <label><input type="radio" name="q13" value="א"> תשובה א על מזון</label><br>
    <label><input type="radio" name="q13" value="ב"> תשובה ב על מזון</label><br>
    <label><input type="radio" name="q13" value="ג"> תשובה ג על מזון</label><br>
    <label><input type="radio" name="q13" value="ד"> תשובה ד על מזון</label>
  </div>
  <div class="q" data-correct="ב">
    <p>14. שאלה על חיות: מה נכון?</p>
    <label><input type="radio" name="q14" value="א"> תשובה א על חיות</label><br>
    <label><input type="radio" name="q14" value="ב"> תשובה ב על חיות</label><br>
    <label><input type="radio" name="q14" value="ג"> תשובה ג על חיות</label><br>
    <label><input type="radio" name="q14" value="ד"> תשובה ד על חיות</label>
  </div>
  <div class="q" data-correct="ב">
    <p>15. שאלה על מזג אוויר: מה נכון?</p>
    <label><input type="radio" name="q15" value="א"> תשובה א על מזג אוויר</label><br>
    <label><input type="radio" name="q15" value="ב"> תשובה ב על מזג אוויר</label><br>
    <label><input type="radio" name="q15" value="ג"> תשובה ג על מזג אוויר</label><br>
    <label><input type="radio" name="q15" value="ד"> תשובה ד על מזג אוויר</label>
  </div>
  <div class="q" data-correct="ב">
    <p>16. שאלה על אנרגיה: מה נכון?</p>
    <label><input type="radio" name="q16" value="א"> תשובה א על אנרגיה</label><br>
    <label><input type="radio" name="q16" value="ב"> תשובה ב על אנרגיה</label><br>
    <label><input type="radio" name="q16" value="ג"> תשובה ג על אנרגיה</label><br>
    <label><input type="radio" name="q16" value="ד"> תשובה ד על אנרגיה</label>
  </div>
  <div class="q" data-correct="ב">
    <p>17. שאלה על ירח: מה נכון?</p>
    <label><input type="radio" name="q17" value="א"> תשובה א על ירח</label><br>
    <label><input type="radio" name="q17" value="ב"> תשובה ב על ירח</label><br>
    <label><input type="radio" name="q17" value="ג"> תשובה ג על ירח</label><br>
    <label><input type="radio" name="q17" value="ד"> תשובה ד על ירח</label>
  </div>
  <div class="q" data-correct="ב">
    <p>18. שאלה על שמש: מה נכון?</p>
    <label><input type="radio" name="q18" value="א"> תשובה א על שמש</label><br>
    <label><input type="radio" name="q18" value="ב"> תשובה ב על שמש</label><br>
    <label><input type="radio" name="q18" value="ג"> תשובה ג על שמש</label><br>
    <label><input type="radio" name="q18" value="ד"> תשובה ד על שמש</label>
  </div>
  <div class="q" data-correct="ב">
    <p>19. שאלה על עננים: מה נכון?</p>
    <label><input type="radio" name="q19" value="א"> תשובה א על עננים</label><br>
    <label><input type="radio" name="q19" value="ב"> תשובה ב על עננים</label><br>
    <label><input type="radio" name="q19" value="ג"> תשובה ג על עננים</label><br>
    <label><input type="radio" name="q19" value="ד"> תשובה ד על עננים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>20. שאלה על זרעים: מה נכון?</p>
    <label><input type="radio" name="q20" value="א"> תשובה א על זרעים</label><br>
    <label><input type="radio" name="q20" value="ב"> תשובה ב על זרעים</label><br>
    <label><input type="radio" name="q20" value="ג"> תשובה ג על זרעים</label><br>
    <label><input type="radio" name="q20" value="ד"> תשובה ד על זרעים</label>
  </div>
  <div class="q" data-correct="ב">
    <p>21. שאלה על עצמות: מה נכון?</p>
    <label><input type="radio" name="q21" value="א"> תשובה א על עצמות</label><br>
    <label><input type="radio" name="q21" value="ב"> תשובה ב על עצמות</label><br>
    <label><input type="radio" name="q21" value="ג"> תשובה ג על עצמות</label><br>
    <label><input type="radio" name="q21" value="ד"> תשובה ד על עצמות</label>
  </div>
  <div class="q" data-correct="ב">
    <p>22. שאלה על דם: מה נכון?</p>
    <label><input type="radio" name="q22" value="א"> תשובה א על דם</label><br>
    <label><input type="radio" name="q22" value="ב"> תשובה ב על דם</label><br>
    <label><input type="radio" name="q22" value="ג"> תשובה ג על דם</label><br>
    <label><input type="radio" name="q22" value="ד"> תשובה ד על דם</label>
  </div>
  <div class="q" data-correct="ב">
    <p>23. שאלה על ברזל: מה נכון?</p>
    <label><input type="radio" name="q23" value="א"> תשובה א על ברזל</label><br>
    <label><input type="radio" name="q23" value="ב"> תשובה ב על ברזל</label><br>
    <label><input type="radio" name="q23" value="ג"> תשובה ג על ברזל</label><br>
    <label><input type="radio" name="q23" value="ד"> תשובה ד על ברזל</label>
  </div>
  <div class="q" data-correct="ב">
    <p>24. שאלה על זכוכית: מה נכון?</p>
    <label><input type="radio" name="q24" value="א"> תשובה א על זכוכית</label><br>
    <label><input type="radio" name="q24" value="ב"> תשובה ב על זכוכית</label><br>
    <label><input type="radio" name="q24" value="ג"> תשובה ג על זכוכית</label><br>
    <label><input type="radio" name="q24" value="ד"> תשובה ד על זכוכית</label>
  </div>
  <div class="q" data-correct="ב">
    <p>25. שאלה על פלסטיק: מה נכון?</p>
    <label><input type="radio" name="q25" value="א"> תשובה א על פלסטיק</label><br>
    <label><input type="radio" name="q25" value="ב"> תשובה ב על פלסטיק</label><br>
    <label><input type="radio" name="q25" value="ג"> תשובה ג על פלסטיק</label><br>
    <label><input type="radio" name="q25" value="ד"> תשובה ד על פלסטיק</label>
  </div>
  <div class="q" data-correct="ב">
    <p>26. שאלה על נפט: מה נכון?</p>
    <label><input type="radio" name="q26" value="א"> תשובה א על נפט</label><br>
    <label><input type="radio" name="q26" value="ב"> תשובה ב על נפט</label><br>
    <label><input type="radio" name="q26" value="ג"> תשובה ג על נפט</label><br>
    <label><input type="radio" name="q26" value="ד"> תשובה ד על נפט</label>
  </div>
  <div class="q" data-correct="ב">
    <p>27. שאלה על רוח: מה נכון?</p>
    <label><input type="radio" name="q27" value="א"> תשובה א על רוח</label><br>
    <label><input type="radio" name="q27" value="ב"> תשובה ב על רוח</label><br>
    <label><input type="radio" name="q27" value="ג"> תשובה ג על רוח</label><br>
    <label><input type="radio" name="q27" value="ד"> תשובה ד על רוח</label>
  </div>
  <div class="q" data-correct="ב">
    <p>28. שאלה על גשם: מה נכון?</p>
    <label><input type="radio" name="q28" value="א"> תשובה א על גשם</label><br>
    <label><input type="radio" name="q28" value="ב"> תשובה ב על גשם</label><br>
    <label><input type="radio" name="q28" value="ג"> תשובה ג על גשם</label><br>
    <label><input type="radio" name="q28" value="ד"> תשובה ד על גשם</label>
  </div>
  <div class="q" data-correct="ב">
    <p>29. שאלה על שלג: מה נכון?</p>
    <label><input type="radio" name="q29" value="א"> תשובה א על שלג</label><br>
    <label><input type="radio" name="q29" value="ב"> תשובה ב על שלג</label><br>
    <label><input type="radio" name="q29" value="ג"> תשובה ג על שלג</label><br>
    <label><input type="radio" name="q29" value="ד"> תשובה ד על שלג</label>
  </div>
  <div class="q" data-correct="ב">
    <p>30. שאלה על ים: מה נכון?</p>
    <label><input type="radio" name="q30" value="א"> תשובה א על ים</label><br>
    <label><input type="radio" name="q30" value="ב"> תשובה ב על ים</label><br>
    <label><input type="radio" name="q30" value="ג"> תשובה ג על ים</label><br>
    <label><input type="radio" name="q30" value="ד"> תשובה ד על ים</label>
  </div>
<button id="send" onclick="send()">שליחה</button>
<p id="result"></p>
<script>
  function send() {
    const name = document.getElementById('name').value.trim();
    if (!name) { alert('צריך לכתוב שם'); return; }
    let score = 0;
    const qs = document.querySelectorAll('.q');
    qs.forEach((q, i) => {
      const c = q.querySelector('input:checked');
      if (c && c.value === q.dataset.correct) score++;
    });
    const grade = Math.round(score / qs.length * 100);
    document.getElementById('send').disabled = true;
    google.script.run
      .withSuccessHandler(() => { document.getElementById('result').textContent = 'הציון שלך: ' + grade; })
      .withFailureHandler(e => { document.getElementById('result').textContent = 'שגיאה: ' + e.message; })
      .saveGrade(name, grade);
  }
</script>
</body>
</html>
```

## בדיקה 5: כלי קטן עם תפריט בגיליון

מה אמור לקרות: מצב רגיל, בלי כרטיס ובלי לשאול. הקובץ מלא. בלי "גרסה חדשה": לשמור, לרענן את הגיליון ולבדוק מהתפריט. משפט לשמור כשאף אחד לא עובד בגיליון. 3 השורות של "אם משהו נשבר", עם "להדביק בחזרה את הקוד הישן".

```
יש לי תפריט בגיליון שמחשב ממוצע לכל תלמיד. אני רוצה פריט נוסף בתפריט: "צביעה באדום של ממוצע מתחת ל-55".

קובץ Code.gs:
function onOpen() {
  SpreadsheetApp.getUi().createMenu('כלי מורה')
    .addItem('ממוצע לכל תלמיד', 'averages')
    .addToUi();
}

function averages() {
  const sh = SpreadsheetApp.getActive().getSheetByName('ציונים');
  const data = sh.getDataRange().getValues();
  const out = data.slice(1).map(r => {
    const nums = r.slice(1).filter(x => typeof x === 'number');
    return [nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : ''];
  });
  const col = data[0].length + 1;
  sh.getRange(1, col).setValue('ממוצע');
  sh.getRange(2, col, out.length, 1).setValues(out);
}
```
