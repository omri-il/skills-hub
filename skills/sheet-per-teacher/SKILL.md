---
name: sheet-per-teacher
description: לרכז או למנהל שיש לו גיליון Google Sheets אחד עם נתונים של כמה מורים (לשונית לכל מורה, או טבלה אחת עם עמודה של שם המורה), ורוצה שכל מורה יראה רק את הנתונים שלו. מסביר במשפט אחד למה אי אפשר להסתיר לשונית ממי שהקובץ משותף איתו, וכותב קוד Google Apps Script מלא שיוצר קובץ נפרד לכל מורה, משתף אותו רק עם המייל של אותו מורה, ומעדכן את הקבצים לבד כשהגיליון הראשי משתנה. נותן הוראות הדבקה והפעלה צעד אחר צעד, ומסביר מתי מספיקה IMPORTRANGE בלי קוד. השתמש כאשר כותבים "שכל מורה יראה רק את הלשונית שלו", "להסתיר לשונית", "הרשאות ללשונית", "לשתף לשונית אחת", "לפצל גיליון למורים", "קובץ לכל מורה", "כל מחנך רואה רק את הכיתה שלו", "IMPORTRANGE למורים", "להגביל צפייה בגיליון". לא ללוח סיכום של תשובות תלמידים (apps-script-dashboard), לא לתיקון קוד קיים שלא עובד (apps-script-fix), ולא ללומדה לתלמידים (apps-script-lomda).
---

# גיליון אחד, וכל מורה רואה רק את הנתונים שלו

רכז מחזיק גיליון אחד עם נתונים של כל המורים: ציונים, נוכחות, שעות, תלמידים. הוא רוצה לשתף אותו כך שכל מורה יראה רק את הלשונית שלו. **ב-Google Sheets זה לא אפשרי.** הסקיל אומר את זה ישר, ונותן את הפתרון שעובד: קובץ נפרד לכל מורה, שמתעדכן לבד מהגיליון הראשי.

הרכז **לא יודע לתכנת.** הוא מדביק קוד אחד, לוחץ על תפריט, ומקבל קבצים משותפים.

## עקרונות (ולמה)

1. **קובץ נפרד לכל מורה, אף פעם לא "הסתרה" בתוך אותו קובץ.** מי שהקובץ משותף איתו יכול להוריד אותו, ליצור עותק או לפתוח לשונית מוסתרת. הגנה על טווח רק מונעת עריכה, ותצוגת סינון גלויה לכולם. כל פתרון בתוך אותו קובץ חושף את הנתונים.
2. **ברירת המחדל: צפייה בלבד.** הקוד דורס את הקובץ של המורה בכל עדכון. אם המורה יכתוב בו, העבודה שלו תימחק. וגם: מי שיכול לערוך יכול לשנות נוסחה ולמשוך נתונים אחרים.
3. **הגיליון הראשי לא משתנה.** הקוד רק קורא ממנו וכותב ללשונית `שיתוף` ולקבצים של המורים. כך טעות בקוד לא פוגעת בנתונים של הרכז.
4. **המיילים בגיליון, לא בקוד.** הרכז כותב מייל ליד כל מורה בלשונית `שיתוף`. כך מחליפים מורה בלי לגעת בקוד.
5. **עמודות רגישות לא עוברות.** ת"ז, אבחון והערות אישיות נשארים רק בגיליון הראשי. רשימה `HIDE_COLUMNS` בראש הקוד.
6. **אף פעם לא שיתוף "כל מי שיש לו את הקישור".** כל קובץ משותף רק עם מייל אחד. בקובץ יש נתונים של תלמידים.
7. **לא יוצרים עותק של הגיליון הראשי ומוחקים ממנו.** הנתונים שנמחקו נשארים בהיסטוריית הגרסאות של העותק. הקוד יוצר קובץ ריק וכותב לתוכו רק את מה שמותר.

## זרימה

- **מוסרים קוד כבר בתשובה הראשונה.** בלי שאלות לפני. הקוד עובד בשני המבנים (`SOURCE_MODE`), וכל מה שלא ידוע הוא קבוע בראש הקוד עם הערה "כאן משנים".
- אם הרכז כתב או הדביק את המבנה (שמות לשוניות, כותרות, שם עמודת המורה): ממלאים את הקבועים לפי זה.
- **אם הרכז לא כתב שמות של לשוניות או כותרות: תמיד `SOURCE_MODE = 'tabs'`**, גם אם הוא כתב "גיליון אחד גדול". מצב `tabs` עובד בלי לנחש שום שם. לא ממציאים שם לשונית או שם עמודה. ב"מה הבנתי" כותבים שזו ברירת מחדל, ומשפט אחד: "אם כל המורים בטבלה אחת: לשנות ל-`'column'`, ולכתוב ב-`SOURCE_SHEET` ו-`TEACHER_COLUMN` את השם של הלשונית ואת הכותרת של עמודת המורה."
- שואלים רק אם לא ברור בכלל מה הרכז רוצה לחלק. אז שאלה אחת קצרה, בלי קוד. **אחרי שהרכז ענה, מוסרים, ולא שואלים שוב.**
- **ענה בשפה שבה הרכז כתב.** הטקסטים בתוך הגיליון בעברית.

## ברירת מחדל ו-2 דרכים אחרות

- **ברירת המחדל: הקוד** (Apps Script). מתאים לכל מספר של מורים, לטבלה אחת או ללשונית לכל מורה, ומסתיר עמודות רגישות.
- **דרך 1, בלי קוד: IMPORTRANGE.** כשהרכז מבקש בלי קוד, או כשיש עד 5 מורים ולשונית לכל מורה. גם אז התשובה שומרת על המבנה: הסבר, מה הבנתי, שלבים ממוספרים במקום קוד, איך בודקים, 3 תקלות (`#REF!` = עוד לא לחצו "אישור גישה"; שם לשונית עם רווח צריך גרש: `'ציוני ט'!A:Z`; מורה רואה הכל = שותף בעריכה). בכל קובץ מורה: `=IMPORTRANGE("הקישור לגיליון הראשי";"'שם הלשונית'!A:Z")`, ובטבלה אחת: `=QUERY(IMPORTRANGE("הקישור";"'נתונים'!A:H");"select * where Col3 = 'כהן'";1)`. בפעם הראשונה הרכז לוחץ "אישור גישה". את שם הלשונית תמיד בין גרשיים בודדים, גם בלי רווח. **אזהרה חובה:** לשתף את קובץ המורה רק בצפייה. מורה עם הרשאת עריכה יכול לשנות את הנוסחה ולמשוך כל לשונית מהגיליון הראשי. עמודה רגישה מסתירים עם `QUERY` (`select Col1, Col2, Col4`). כאן אין קוד, ולכן אין בלוק קוד.
- **דרך 2: המורים כותבים בחזרה** (למשל ממלאים ציונים או נוכחות). רק כשהרכז ביקש את זה. זה אותו קוד של הדוגמה, עם 4 שינויים בלבד:
  1. `ROLE = 'edit'`, ובשיתוף: `driveFile.addEditor(r.email)`. אזהרה במשפט אחד: עורך יכול לשתף את הקובץ הלאה.
  2. ב-`syncOne_` כותבים לקובץ המורה **רק כשהוא נוצר עכשיו**. בקובץ קיים לא נוגעים, כדי לא למחוק את מה שהמורה כתב.
  3. פונקציה חדשה `collectAll()`: לכל שורה עם קישור, קוראת את הלשונית הראשונה של קובץ המורה, מוחקת בגיליון הראשי את הלשונית `מ-<שם המורה>` אם יש, יוצרת אותה מחדש וכותבת לתוכה. **לעולם לא כותבת ללשונית המקורית של המורה או לטבלה הראשית.**
  4. בתפריט פריט נוסף `4. איסוף מהמורים` (`collectAll`), ו-`startAutoSync` מפעיל טריגר שעתי של `collectAll` במקום `syncAll`.
  כל השאר כמו בדוגמה: אותם קבועים, אותה לשונית `שיתוף`, אותם שמות בתפריט. לא מסנכרנים לשני הכיוונים באותו קוד.

## מה הקוד עושה (חובה)

קובץ אחד: `Code.gs`. בראשו קבועים עם הערה "כאן משנים": `SOURCE_MODE`, `SOURCE_SHEET`, `TEACHER_COLUMN`, `HIDE_COLUMNS`, `SKIP_TABS`, `ROLE`, `FOLDER_NAME`, `FILE_PREFIX`, `SYNC_HOURS`.

- `onOpen()` רק קורא ל-`addSplitMenu()`. התפריט `🗂 חלוקה למורים`: `1. הכנת לשונית השיתוף`, `2. יצירה ועדכון של הקבצים`, `3. עדכון אוטומטי`, `עצירת העדכון האוטומטי`.
- `prepareShareSheet()`: יוצר לשונית `שיתוף` (מימין לשמאל) עם הכותרות שם המורה, מייל, קישור לקובץ, שותף עם, עדכון אחרון. ממלא את שמות המורים לבד: שמות הלשוניות (בלי `SKIP_TABS` ו-`שיתוף`), או הערכים השונים בעמודת המורה. שם שכבר קיים לא נכתב שוב. בסוף הודעה: "כתבו מייל ליד כל מורה".
- `syncAll()`: עם `LockService`. לכל שורה עם שם ומייל: מוצא את הנתונים של המורה, מוריד את `HIDE_COLUMNS`, ואם אין קובץ יוצר אחד (`SpreadsheetApp.create`) ומעביר לתיקייה `FOLDER_NAME`. משתף עם `addViewer` (או `addCommenter` לפי `ROLE`), רק כשהמייל שונה ממה שכתוב ב"שותף עם". אם המייל השתנה, מסיר קודם את הקודם (`removeViewer`). מנקה את הלשונית הראשונה בקובץ המורה וכותב בבת אחת עם `setValues`, אחרי `setNumberFormat('@')` כדי ש-0 בהתחלה ותאריכים לא ישתנו. כותרת מודגשת, שורה ראשונה קפואה, מימין לשמאל. כותב בלשונית `שיתוף` את הקישור, "שותף עם" ו"עודכן" עם שעה, או את השגיאה בעברית לאותה שורה, וממשיך לשורה הבאה.
- קורא לפי **שם לשונית ושם כותרת**, אף פעם לא `getActiveSheet()` ולא מספר עמודה קבוע. לשונית או כותרת שלא נמצאה: הודעה בעברית עם השם שחיפש, ועוצר.
- `startAutoSync()`: מוחק טריגר קודם של `syncAll`, ויוצר טריגר זמן (`ScriptApp.newTrigger('syncAll').timeBased().everyHours(SYNC_HOURS)`). `stopAutoSync()` מוחק אותו.
- הודעות דרך פונקציה אחת `tell_` עם `try` סביב `SpreadsheetApp.getUi().alert`: בעדכון האוטומטי אין חלון, ו-`getUi()` בלי `try` עוצר את הריצה.
- אם עברו 5 דקות, עוצר ואומר ללחוץ שוב (Apps Script עוצר ריצה אחרי 6 דקות).

## מבנה התשובה (תמיד בסדר הזה)

1. **למה אי אפשר להסתיר לשונית**: 2 משפטים לכל היותר, ומה הפתרון.
2. **מה הבנתי**: שורה אחת: המבנה (`tabs` או `column`), השמות שבקוד, ואילו עמודות לא יעברו.
3. **Code.gs**: בלוק קוד אחד, מלא.
4. **הוראות** (ממוספרות): 1) בגיליון הראשי: תוספים (Extensions) ← Apps Script. 2) מוחקים את מה שכתוב, מדביקים, שומרים. 3) חוזרים לגיליון ומרעננים. 4) `🗂 חלוקה למורים` ← `1`, ומאשרים הרשאות (אם מופיע "Google לא אימתה את האפליקציה": מתקדם ← מעבר לפרויקט). 5) כותבים מייל ליד כל מורה בלשונית `שיתוף`. 6) לוחצים `2`. 7) לוחצים `3` לעדכון אוטומטי.
5. **איך בודקים**: פותחים קובץ אחד מהתיקייה, לוחצים "שיתוף", ורואים רק את הרכז ומורה אחד.
6. **אם משהו לא עובד**: בדיוק 3 התקלות האלה:
   - אין תפריט: לרענן את הגיליון. אם עדיין אין, יש בפרויקט עוד `onOpen` (ראו בכללים איך לאחד).
   - "שגיאה" בשורה של מורה: מייל מחוץ לבית הספר (לשתף עם המייל של בית הספר), או שהקובץ נמחק (למחוק את הקישור בשורה וללחוץ שוב על `2`).
   - "לא מצאתי נתונים": השם בלשונית `שיתוף` לא זהה לשם של הלשונית או לערך בעמודת המורה.
7. **בלי קוד?** 3 שורות קבועות: IMPORTRANGE מספיקה כשיש עד 5 מורים ולשונית לכל מורה. בכל קובץ מורה כותבים את הנוסחה, ובפעם הראשונה הרכז לוחץ "אישור גישה". את קובץ המורה משתפים רק בצפייה, כי מי שעורך יכול לשנות את הנוסחה ולראות לשוניות של אחרים.

**שפה:** ההסבר בשפה של הרכז. מה שבתוך הגיליון (תפריט, לשונית `שיתוף`, כותרות, הודעות) תמיד בעברית ובשמות של הדוגמה, גם כשהבקשה באנגלית. בהוראות משתמשים בשמות של מורים רק בשלב "כותבים מייל ליד כל מורה". בכל מקום אחר (נוסחת IMPORTRANGE, דוגמאות) כותבים "כהן".

**לכתוב נכון:** לפני מסירה, לקרוא את ההוראות פעם אחת ולתקן מילים משובשות. רכז שרואה מילה שבורה בהוראה לא סומך על הקוד.

## בדיקה עצמית לפני מסירה

- [ ] אין בתשובה הסתרת לשונית, הגנה על טווח או תצוגת סינון כפתרון לפרטיות.
- [ ] קוד מלא, בלי "... שאר הקוד". כל פונקציה בתפריט קיימת בקוד באותו שם.
- [ ] הקוד לא כותב לגיליון הראשי, חוץ מהלשונית `שיתוף`.
- [ ] אין `setSharing`, אין `ANYONE` ואין `makeCopy` של הגיליון הראשי.
- [ ] כל קובץ משותף רק עם מייל אחד, בצפייה כברירת מחדל.
- [ ] לחיצה שנייה על `2` לא יוצרת קבצים כפולים: הקישור נשמר בלשונית `שיתוף`.
- [ ] `HIDE_COLUMNS` קיים, ועמודה רגישה מהבקשה כתובה בו.
- [ ] אין בקוד שמות של תלמידים, מיילים או ת"ז. המיילים רק בלשונית `שיתוף`.
- [ ] יש טריגר זמן, ו-`tell_` לא נכשל כשאין חלון.
- [ ] לא הומצא שם של לשונית או של עמודה. בלי שמות מהרכז: `tabs`.
- [ ] שמות הקבועים, התפריט והלשונית `שיתוף` כמו בדוגמה, בעברית.
- [ ] יש 7 החלקים של מבנה התשובה, ובחלק 6 בדיוק 3 התקלות.

## כללים

- **רק פונקציות שקיימות באמת ב-Apps Script.** בלי ספריות, בלי Advanced Services ובלי API key.
- **פרטיות:** אם הרכז הדביק שמות של תלמידים, ת"ז או אבחונים, אל תחזור עליהם בתשובה ואל תכתוב אותם בקוד. אם יש בטבלה עמודה רגישה, הכנס את הכותרת שלה ל-`HIDE_COLUMNS` וכתוב את זה בשורה "מה הבנתי". שמות של מורים ומיילים שהרכז נתן: רק בהוראות "מה לכתוב בלשונית שיתוף", לא בקוד.
- **הקוד לא שולח מיילים משלו.** Google יכולה לשלוח למורה הודעת שיתוף, והקישור תמיד בלשונית `שיתוף`.
- אם הרכז מבקש בכל זאת להסתיר לשונית באותו קובץ: משפט אחד למה זה לא מגן, ואז הפתרון המלא.
- אם יש בפרויקט כבר `onOpen`: מוסיפים קובץ חדש (+ ← סקריפט), מוחקים ממנו את `onOpen` הקצרה, ומוסיפים שורה אחת `addSplitMenu();` בתוך ה-`onOpen` הקיימת.
- **בלי Canvas.** הקוד בצ'אט.

## טעויות נפוצות (Gotchas)

- `SpreadsheetApp.getUi()` בתוך פונקציה שרצה מטריגר: שגיאה "Cannot call SpreadsheetApp.getUi() from this context". לכן `tell_` עם `try`.
- `setValues` בלי `setNumberFormat('@')`: "0501234567" הופך ל-501234567, ו"1/2" הופך לתאריך.
- `SpreadsheetApp.create` בכל ריצה בלי לשמור את הקישור: עשרות קבצים כפולים בכל שעה.
- חשבון של בית ספר: לפעמים אי אפשר לשתף עם מייל מחוץ לבית הספר (Gmail פרטי). השגיאה תופיע בשורה של אותו מורה. הפתרון: המייל של המורה בבית הספר.
- מחיקת שורה בלשונית `שיתוף` לא מבטלת שיתוף. כדי להפסיק לשתף: פותחים את הקובץ ← שיתוף ← מסירים את המורה.
- שם מורה שונה מעט בין הלשונית לבין עמודת המורה ("כהן" מול "כהן "). הקוד משווה אחרי `trim()`.

## דוגמה מלאה

**הבקשה:** "יש לי גיליון 'ציונים' עם עמודות: שם תלמיד, ת.ז, כיתה, מורה, ציון מחצית. אני רוצה שכל מורה יראה רק את התלמידים שלו."

**התשובה:**

ב-Google Sheets אי אפשר להסתיר לשונית או שורות ממי שהקובץ משותף איתו: הוא יכול להוריד את הקובץ ולראות הכל. לכן הקוד יוצר קובץ נפרד לכל מורה, משותף רק איתו, ומעדכן אותו לבד.

**מה הבנתי:** טבלה אחת (`column`) בלשונית `ציונים`, המורה בעמודה `מורה`. העמודה `ת.ז` לא תעבור לאף מורה.

```javascript
// ===== כאן משנים =====
const SOURCE_MODE = 'column';        // 'tabs' = לשונית לכל מורה. 'column' = טבלה אחת עם עמודה של שם המורה
const SOURCE_SHEET = 'ציונים';       // רק במצב 'column': שם הלשונית עם הטבלה
const TEACHER_COLUMN = 'מורה';       // רק במצב 'column': הכותרת של עמודת המורה
const HIDE_COLUMNS = ['ת.ז'];        // עמודות שלא יגיעו לאף מורה
const SKIP_TABS = ['הוראות'];        // רק במצב 'tabs': לשוניות שלא מחלקים
const ROLE = 'view';                 // 'view' = צפייה בלבד. 'comment' = צפייה והערות
const FOLDER_NAME = 'קבצים למורים';
const FILE_PREFIX = 'הנתונים של ';
const SYNC_HOURS = 1;                // 1, 2, 4, 6, 8 או 12
// =====================

const SHARE_SHEET = 'שיתוף';
const SHARE_HEADERS = ['שם המורה', 'מייל', 'קישור לקובץ', 'שותף עם', 'עדכון אחרון'];

function onOpen() {
  addSplitMenu();
}

function addSplitMenu() {
  SpreadsheetApp.getUi().createMenu('🗂 חלוקה למורים')
    .addItem('1. הכנת לשונית השיתוף', 'prepareShareSheet')
    .addItem('2. יצירה ועדכון של הקבצים', 'syncAll')
    .addItem('3. עדכון אוטומטי', 'startAutoSync')
    .addItem('עצירת העדכון האוטומטי', 'stopAutoSync')
    .addToUi();
}

function prepareShareSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const keys = getTeacherKeys_(ss);
  if (!keys.length) { tell_('לא מצאתי מורים. בדקו את ההגדרות בראש הקוד.'); return; }
  let sheet = ss.getSheetByName(SHARE_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SHARE_SHEET);
    sheet.getRange(1, 1, 1, SHARE_HEADERS.length).setValues([SHARE_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setRightToLeft(true);
  }
  const existing = readShareRows_(sheet).map(r => r.name);
  const fresh = keys.filter(k => existing.indexOf(k) === -1).map(k => [k, '', '', '', '']);
  if (fresh.length) sheet.getRange(sheet.getLastRow() + 1, 1, fresh.length, SHARE_HEADERS.length).setValues(fresh);
  tell_('בלשונית "' + SHARE_SHEET + '" יש ' + keys.length + ' מורים. כתבו מייל ליד כל מורה, ואז בתפריט: 2. יצירה ועדכון של הקבצים.');
}

function syncAll() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHARE_SHEET);
    if (!sheet) { tell_('אין עדיין לשונית "' + SHARE_SHEET + '". קודם: 1. הכנת לשונית השיתוף.'); return; }
    let sourceData = null;
    if (SOURCE_MODE === 'column') {
      sourceData = getSourceValues_(ss);
      if (!sourceData) return;
    }
    const rows = readShareRows_(sheet);
    if (!rows.length) { tell_('אין מורים בלשונית "' + SHARE_SHEET + '".'); return; }
    const start = Date.now();
    let done = 0, left = 0;
    rows.forEach(r => {
      if (!r.name || !r.email) return;
      if (Date.now() - start > 5 * 60 * 1000) { left++; return; }
      try {
        r.status = syncOne_(ss, r, sourceData);
        done++;
      } catch (e) {
        r.status = 'שגיאה: ' + e.message;
      }
    });
    sheet.getRange(2, 3, rows.length, 3).setValues(rows.map(r => [r.url, r.sharedWith, r.status]));
    tell_('עודכנו ' + done + ' קבצים.' + (left ? ' נשארו ' + left + ': לחצו שוב על 2.' : ''));
  } finally {
    lock.releaseLock();
  }
}

function syncOne_(ss, r, sourceData) {
  const data = getTeacherData_(ss, r.name, sourceData);
  if (!data) return 'לא מצאתי נתונים בשם הזה';
  if (r.email.indexOf('@') === -1) return 'המייל לא תקין';
  let file;
  if (r.url) {
    file = SpreadsheetApp.openByUrl(r.url);
  } else {
    file = SpreadsheetApp.create(FILE_PREFIX + r.name);
    DriveApp.getFileById(file.getId()).moveTo(getFolder_());
    r.url = file.getUrl();
  }
  const driveFile = DriveApp.getFileById(file.getId());
  if (r.sharedWith !== r.email) {
    if (r.sharedWith) driveFile.removeViewer(r.sharedWith);
    if (ROLE === 'comment') driveFile.addCommenter(r.email);
    else driveFile.addViewer(r.email);
    r.sharedWith = r.email;
  }
  const target = file.getSheets()[0];
  target.clearContents();
  const range = target.getRange(1, 1, data.length, data[0].length);
  range.setNumberFormat('@');
  range.setValues(data);
  target.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
  target.setFrozenRows(1);
  target.setRightToLeft(true);
  return 'עודכן ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM HH:mm');
}

function getTeacherKeys_(ss) {
  if (SOURCE_MODE === 'tabs') {
    return ss.getSheets().map(s => s.getName())
      .filter(n => n !== SHARE_SHEET && SKIP_TABS.indexOf(n) === -1);
  }
  const data = getSourceValues_(ss);
  if (!data) return [];
  const col = findColumn_(data[0], TEACHER_COLUMN);
  const keys = [];
  data.slice(1).forEach(r => {
    const k = String(r[col]).trim();
    if (k && keys.indexOf(k) === -1) keys.push(k);
  });
  return keys;
}

function getSourceValues_(ss) {
  const sheet = ss.getSheetByName(SOURCE_SHEET);
  if (!sheet) { tell_('לא מצאתי לשונית בשם "' + SOURCE_SHEET + '". תקנו את SOURCE_SHEET בראש הקוד.'); return null; }
  const data = sheet.getDataRange().getDisplayValues();
  if (findColumn_(data[0], TEACHER_COLUMN) === -1) { tell_('לא מצאתי עמודה בשם "' + TEACHER_COLUMN + '". תקנו את TEACHER_COLUMN בראש הקוד.'); return null; }
  return data;
}

function getTeacherData_(ss, key, sourceData) {
  let data;
  if (SOURCE_MODE === 'tabs') {
    const sheet = ss.getSheetByName(key);
    if (!sheet) return null;
    data = sheet.getDataRange().getDisplayValues();
  } else {
    const col = findColumn_(sourceData[0], TEACHER_COLUMN);
    data = [sourceData[0]].concat(sourceData.slice(1).filter(r => String(r[col]).trim() === key));
    if (data.length < 2) return null;
  }
  const hide = HIDE_COLUMNS.map(h => String(h).trim());
  const keep = data[0].map((h, i) => i).filter(i => hide.indexOf(String(data[0][i]).trim()) === -1);
  return data.map(r => keep.map(i => r[i]));
}

function readShareRows_(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, SHARE_HEADERS.length).getDisplayValues().map(r => ({
    name: String(r[0]).trim(),
    email: String(r[1]).trim().toLowerCase(),
    url: String(r[2]).trim(),
    sharedWith: String(r[3]).trim().toLowerCase(),
    status: r[4]
  }));
}

function findColumn_(header, name) {
  return header.map(h => String(h).trim()).indexOf(String(name).trim());
}

function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
}

function startAutoSync() {
  stopAutoSync_();
  ScriptApp.newTrigger('syncAll').timeBased().everyHours(SYNC_HOURS).create();
  tell_('מעכשיו הקבצים של המורים מתעדכנים לבד כל ' + (SYNC_HOURS === 1 ? 'שעה' : SYNC_HOURS + ' שעות') + '.');
}

function stopAutoSync() {
  stopAutoSync_();
  tell_('העדכון האוטומטי נעצר.');
}

function stopAutoSync_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncAll')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

function tell_(msg) {
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    console.log(msg); // בעדכון האוטומטי אין חלון, אז ההודעה נרשמת ביומן
  }
}
```

אחרי הקוד באות ההוראות 1-7, "איך בודקים", 3 תקלות: אין תפריט (לא רעננו, או `onOpen` כפול); "שגיאה" בשורה של מורה (מייל מחוץ לבית הספר, או קובץ שנמחק: מוחקים את הקישור בשורה ולוחצים שוב על `2`); "לא מצאתי נתונים" (השם בלשונית `שיתוף` לא זהה לשם בעמודה `מורה`). ובסוף 2-3 שורות על IMPORTRANGE.
