---
name: create-reading-comprehension
description: יוצר דף הבנת הנקרא לבית הספר היסודי, כיתות א' עד ו', כקובץ Word מוכן להדפסה. המורה נותן טקסט משלו (הדבקה, קובץ או תמונה של דף), או רק נושא, ואז נכתב טקסט מקורי שמתאים לכיתה. בדף יש את הטקסט עם מספרי פסקאות, שאלות מהקל לקשה לפי 4 ממדי ההבנה של משרד החינוך ומיצ"ב (משמעות גלויה, משמעות משתמעת, פרשנות ויישום, הערכה של תוכן, מבנה ולשון), שאלות על אוצר מילים, שאלות סגורות ופתוחות עם קווים לכתיבה, ומפתח תשובות עם ציטוט ומספר פסקה שנבדקים בקוד מול הטקסט. יכול ליצור 3 רמות לאותו טקסט, וטקסט מנוקד. השתמש כאשר מורה ביסודי מבקש דף הבנת הנקרא, שאלות על טקסט, שאלות על סיפור, דף עבודה על קטע קריאה, טקסט מידעי עם שאלות, תרגול לקראת מיצ"ב בעברית (שפת אם), או שאלות לפי ממדי ההבנה, לכל כיתה מ-א' עד ו'.
---

# דף הבנת הנקרא ליסודי

המטרה: דף שילד בכיתה א'-ו' קורא ועונה עליו לבד. טקסט באורך שמתאים לכיתה, שאלות ברורות לפי 4 ממדי ההבנה, ומקום לכתוב. המורה מקבל קובץ Word מוכן להדפסה, עם מפתח תשובות שכל ציטוט בו נבדק בקוד מול הטקסט.

## חובה: התוצר הוא קובץ Word

- **אל תכתוב את הדף בתשובה בצ'אט.** צור קובץ Word ‏(‎.docx) להורדה, גם אם המורה לא ביקש קובץ.
- בנה את הקובץ בהרצת קוד אחת, עם הפונקציה `build` שבסוף הסקיל. היא משתמשת רק ב-python-docx, שמותקן בסביבת הקוד שלך.
- **אל תבנה את הקובץ בדרך אחרת** (pandoc, טבלאות, XML שאתה כותב בעצמך). רק `build`, מועתקת תו בתו.
- הכלל הזה גובר על סקילים אחרים: גם אם מותקנים hebrew-docs-rtl או simple-language, דף הבנת הנקרא ליסודי נבנה רק לפי הסקיל הזה, עם `build` שלו.
- את הקוד אתה כותב ומריץ בעצמך בכלי הרצת הקוד. זה לא סקריפט של הסקיל, ואין מגבלה על הרצתו.
- **קוד שכתוב בטקסט התשובה, בבלוק ```python, לא רץ אף פעם.** המורה רואה קוד ולא מקבל קובץ. לכן אף פעם לא כותבים את `build` בטקסט התשובה.

## לפני שמתחילים

צריך לדעת 2 דברים: **כיתה** (א'-ו'), ו**טקסט או נושא**.

- אם הכיתה חסרה, או שאין טקסט וגם אין נושא, שאל בהודעה אחת קצרה, עם ברירת מחדל לכל שאלה. אל תנחש כיתה, ואל תבחר נושא בעצמך.
- אם כתוב "תחליט אתה", בחר בעצמך והמשך.
- ברירות מחדל, בלי לשאול: דף אחד, מספר השאלות לפי הטבלה, סוג טקסט לפי הנושא (סיפור או טקסט מידעי).
- אם המורה ביקש **רמות**, **דיפרנציאציה**, **כיתה הטרוגנית** או "לחלשים ולחזקים": צור 3 דפים (ראה "3 רמות").
- בקשה באנגלית: הדף עדיין בעברית, אלא אם המורה ביקש דף באנגלית. דף באנגלית בונים באותה `build`, עם כל הטקסט, השאלות והמפתח באנגלית.
- כיתה ז' ומעלה: אותו מבנה. הטקסט 400-700 מילים, ו-`build(..., grade="ז")`.

## הטקסט

### טקסט של המורה

- **העתק את הטקסט מילה במילה.** אל תתקן, אל תקצר ואל תוסיף. שמור על החלוקה לפסקאות של המקור.
- טקסט מתמונה: העתק בזהירות. אם מילה לא ברורה, כתוב למורה בצ'אט איזו מילה לבדוק.
- קרא ל-`build` עם `own_text=True`. אז הקוד לא בודק את אורך הטקסט.

### טקסט שאתה כותב

| כיתה | מילים | פסקאות | משפט | שאלות |
|---|---|---|---|---|
| א' | 40-90 | 2-4 | עד 8 מילים | 5 |
| ב' | 70-160 | 3-5 | עד 10 מילים | 6 |
| ג' | 150-260 | 4-6 | עד 14 מילים | 8 |
| ד' | 220-360 | 5-7 | עד 16 מילים | 8 |
| ה' | 300-480 | 5-8 | עד 20 מילים | 8 |
| ו' | 350-550 | 6-9 | עד 22 מילים | 8 |

- **סיפור:** דמות עם רצון או בעיה, מה קרה, ואיך זה נגמר. דיאלוג קצר עוזר. מצב מהחיים של ילדים (כיתה, הפסקה, משפחה, חברים, טיול, חיות). שמות מגוונים מכל החברה הישראלית.
- **טקסט מידעי:** כותרת, ופסקה לכל רעיון. רק עובדות ידועות ובטוחות. **אל תמציא מספרים, תאריכים, שמות של חוקרים או ציטוטים.** אם אתה לא בטוח בעובדה, אל תכתוב אותה.
- מילים שילדים בכיתה מכירים, ו-2 או 3 מילים חדשות שאפשר להבין מההקשר. עליהן נשאלות שאלות אוצר המילים.
- בלי אלימות, פחד חזק, מחלות קשות או נושאים שנויים במחלוקת.
- כתוב בעברית תקינה. קרא שוב כל משפט לפני `build`: שגיאות כתיב, מילה חסרה, זכר ונקבה.

## 4 ממדי ההבנה

מסגרת ההערכה של משרד החינוך וראמ"ה. כל שאלה שייכת לממד אחד.

- **ממד א: הבנת המשמעות הגלויה בטקסט.** התשובה כתובה בטקסט במפורש. איתור פרטים (מי, מה, איפה, מתי), הגדרה או הסבר שכתובים בטקסט, סידור אירועים לפי הסדר, סיבה ותוצאה שכתובות במפורש.
- **ממד ב: הבנת המשמעות המשתמעת מן הטקסט.** התשובה לא כתובה במפורש, אבל יש **תשובה נכונה אחת** שנובעת מהטקסט. מילה או ביטוי בהקשר, סיבה ותוצאה שלא כתובות, למי מתייחסת מילה כמו "הוא" או "שם", רעיון ברור שלא כתוב.
- **ממד ג: פרשנות, עיבוד ויישום.** הילד בונה משמעות, והתשובה יכולה להיות שונה אצל כל ילד, אבל מבוססת על הטקסט. רגשות ומניעים של דמויות, אפיון דמות, הרעיון המרכזי, השוואה, עמדה מנומקת, קישור לחיים של הילד, השערה מה יקרה.
- **ממד ד: בחינה והערכה של תוכן, מבנה ולשון.** מבט על הטקסט עצמו. מה מטרת הטקסט (לספר, להסביר, לשכנע), למה יש כותרת או פסקה מסוימת, למה הכותב בחר מילה או משפט, האם הטקסט אמין או ברור.

**הבדיקה בין ממד א לממד ב:** אם אפשר להעתיק את התשובה מהטקסט, כמעט באותן מילים, זה ממד א. גם אם השאלה מתחילה ב"למה". גם מילה שהטקסט מגדיר ("תהליך זה נקרא...") היא שאלה בממד א. בממד ב הילד צריך לחבר 2 פרטים, או להבין מההקשר.

**ממד ג הוא לא עובדה מהטקסט.** אם הרגש, הסיבה או המסר כתובים בטקסט במפורש ("היא הרגישה עצובה"), השאלה עליהם היא ממד א. בממד ג הילד מסביר במילים שלו, ויש יותר מתשובה טובה אחת. ממד ד שואל על הטקסט עצמו (מטרה, כותרת, בחירת מילה), לא על מה שקרה בו.

**כשהקוד אומר "התשובה כתובה בטקסט מילה במילה":** שנה את הממד של השאלה ל-א, או כתוב שאלה אחרת שבאמת בממד ב, ג או ד. אל תשנה רק את המילים של התשובה כדי לעבור את הבדיקה.

### כמה שאלות מכל ממד

| כיתה | א | ב | ג | ד |
|---|---|---|---|---|
| א' | 2 | 1 | 2 | 0 |
| ב' | 2 | 2 | 1 | 1 |
| ג'-ד' | 3 | 2 | 2 | 1 |
| ה'-ו' | 2 | 3 | 2 | 1 |

- המורה קובע: אם ביקש מספר שאלות אחר, עשה מה שביקש. אם ביקש רק ממד אחד ("רק שאלות הסקה" = ממד ב, "רק פרשנות" = ממד ג), **כל** השאלות בממד הזה, וקרא ל-`build` עם `only="ב"` (או האות של הממד).
- **אוצר מילים:** בדף של 5-7 שאלות, שאלה אחת. בדף של 8 שאלות ומעלה, 2 שאלות. כל אחת בממד ב, ומתחילה במילים **"מה פירוש"**: "מה פירוש המילה "..." בפסקה 3?". הקוד סופר אותן לפי המילים האלה.
- בחר מילה שילד בכיתה לא בטוח שהוא מכיר, ושאפשר להבין מההקשר. לא מילה שהטקסט מגדיר, ולא מילה שברור מהשורש שלה (צבע, צבעוני).
- אם המורה ביקש שאלות בלי אוצר מילים, קרא ל-`build` עם `vocab=False`.
- הסדר בדף: מהקל לקשה. קודם ממד א, אחר כך ב, ג ובסוף ד.

## השאלות

- הוראה קצרה וברורה. **בלשון רבים**: "כתבו", "הקיפו", "סדרו", "הסבירו", "העתיקו", "נמקו". אף פעם לא "כתוב" או "הקיפי".
- **יוצא מן הכלל: המורה ביקש שפה פשוטה** ("בשפה פשוטה", "לתלמידים מתקשים בקריאה", "לעולים"). אז כל ההוראות בדף בשם פועל: "לכתוב", "להקיף", "לסדר", "להסביר". בלי "כתבו". זה הכלל של הסקיל simple-language.
- שאלה אחת בכל סעיף. אם צריך 2 חלקים, כתוב "כתבו 2 דברים" או סמן א, ב בתוך השאלה, בשורות נפרדות.
- כשהשאלה על פסקה מסוימת, כתוב את המספר שלה: "בפסקה 2 כתוב ש...". הקוד מספר את הפסקאות בדף.
- **כמחצית מהשאלות סגורות** (בחירה מתוך תשובות), ובעיקר בממדים א ו-ב. השאר פתוחות.
- **שאלה סגורה:** 4 תשובות, כל אחת בשורה משלה, שמתחילה ב-`א.`, `ב.`, `ג.`, `ד.`. בכיתות א'-ב' מותר 3 תשובות. ההוראה בשאלה סגורה היא תמיד "הקיפו את התשובה הנכונה" (בשפה פשוטה: "להקיף").
- **תשובה שגויה טובה** לקוחה מהטקסט: פרט אחר מהסיפור, דמות אחרת, מקום או זמן אחרים, או טעות שילד עושה כשהוא קורא מהר. ילד שלא קרא את הטקסט לא יכול לפסול אותה. **בלי תשובה מצחיקה, דמיונית או רחוקה מהטקסט.**
- שאלה על מטרת הטקסט: התשובות לבחירה הן "לספר סיפור", "למסור מידע", "לשכנע", "להסביר איך עושים משהו".
- **כל התשובות לבחירה באותו אורך בערך.** התשובה הנכונה היא לא תמיד הארוכה ולא תמיד הקצרה. האות הנכונה משתנה: לא יותר מ-40% מהשאלות הסגורות באותה אות. הקוד בודק את זה.
- **אל תוסיף מילים ריקות לתשובה רק כדי לשנות את האורך שלה.** כתוב תשובה שגויה אחרת, טובה יותר.
- כל שאלה בודקת דבר אחר. לא 2 שאלות על אותו פרט.
- **שאלה פתוחה:** אחרי השאלה שורה `[קווים 2]` (בממד א ו-ב) או `[קווים 3]` (בממדים ג ו-ד). בכיתות א'-ב': `[קווים 1]` או `[קווים 2]`.
- שאלת "סדרו": כל פריט בשורה משלו, ובתחילתה `___`.
- **בדף לתלמיד לא כתובים שם הממד, המילה "ממד" או התשובות.** רק במפתח.
- בכיתות א'-ב': עד 8 מילים במשפט של שאלה. בכיתות ג'-ו': עד 15.

## ניקוד

- **כיתה א':** טקסט מנוקד, וגם השאלות והתשובות לבחירה, גם אם המורה לא ביקש.
- כיתות ב'-ו': ניקוד רק אם המורה ביקש. אז נקד את הטקסט, ואת השאלות רק אם ביקש.
- ניקוד מלא ונכון, עם דגש, שווא וחולם. בציטוט במפתח מותר בלי ניקוד: הקוד משווה בלי ניקוד.
- תמיד כתוב למורה בצ'אט: "כדאי לעבור על הניקוד לפני ההדפסה."

## 3 רמות

- הטקסט זהה בכל הדפים. כותבים אותו פעם אחת, והקוד מעתיק אותו לכל דף.
- הכותרות: `# דף 1`, `# דף 2`, `# דף 3`. **אל תכתוב על הדף "חלשים", "מתקדמים" או "רמה נמוכה".** ילד לא צריך לראות את זה.
- אותו מספר שאלות, ושאלה עם אותו מספר שואלת על אותו חלק בטקסט בכל הדפים. כך אפשר לבדוק יחד בכיתה.
- **שאלה N שואלת על אותה פסקה בכל 3 הדפים.** רק הקושי משתנה: איך שואלים, כמה תשובות לבחירה, ואם יש רמז. הקוד בודק את מספרי הפסקאות במפתח.
- דף 1: יותר שאלות סגורות, 3 תשובות לבחירה, ורמז בשאלות הקשות, בדיוק בצורה הזו: "(רמז: פסקה 3)".
- דף 2: הדף הרגיל של הכיתה.
- דף 3: יותר שאלות פתוחות, ושאלה נוספת בממד ג או ד במקום שאלה בממד א.
- במפתח: כותרת `## דף 1` לכל דף, ומתחתיה `### שאלה 1` וכן הלאה. בתחילת המפתח שורה אחת למורה שאומרת למי מתאים כל דף.

## מבנה הדף

הדף נכתב כטקסט פשוט, ו-`build` הופכת אותו לקובץ Word. **כל שורה היא פסקה.** הקוד מוסיף לבד את שורת השם, הכיתה והתאריך, ואת מספרי הפסקאות בטקסט.

```
# הבנת הנקרא: <שם הטקסט> - כיתה ג'

[טקסט]
### <כותרת הטקסט>
<פסקה 1, בשורה אחת>
<פסקה 2, בשורה אחת>
[/טקסט]

## שאלה 1
<השאלה>
א. <תשובה>
ב. <תשובה>
ג. <תשובה>
ד. <תשובה>

## שאלה 2
<השאלה>
[קווים 2]

# מפתח תשובות

## שאלה 1
ממד: א
תשובה: ב. <התשובה>
מהטקסט: "<ציטוט מדויק>" (פסקה 2)

## שאלה 2
ממד: ג
תשובה: <תשובה אפשרית>
מהטקסט: "<ציטוט מדויק>" (פסקה 4)
מה לבדוק: <מה חייב להיות בתשובה טובה>
```

- `[טקסט]` ו-`[/טקסט]` בשורות משלהם. בתוכם רק כותרת `###` (לא חובה) והפסקאות. **פסקה = שורה אחת**, גם אם היא ארוכה. בלי מספרים בתחילת הפסקה: הקוד מוסיף אותם.
- 3 רמות: `[טקסט]` בא לפני `# דף 1`, פעם אחת.
- הדגשה: `**מילה**`. בלי טבלאות, בלי רשימות עם תבליטים, בלי קישורים ובלי אימוג'י.

## מפתח התשובות

- לכל שאלה בדף יש `## שאלה N` במפתח, עם המספר שלה, ומתחתיה:
  - `ממד: א` (או ב, ג, ד). הקוד כותב את השם המלא של הממד.
  - `תשובה:` בשאלה סגורה, **האות של התשובה הנכונה בתחילת השורה**, ואחריה התשובה: `תשובה: ג. כי הוא פחד`. בשאלה פתוחה: תשובה לדוגמה.
  - `מהטקסט:` **חובה בממד א ו-ב**, ורצוי בממד ג. ציטוט מדויק מהטקסט במירכאות, ואחריו `(פסקה N)`. כמה ציטוטים: `"..." (פסקה 2), "..." (פסקה 4)`.
  - `מה לבדוק:` בשאלה פתוחה בממד ג ו-ד: מה חייב להיות בתשובה טובה. למשל: "רגש אחד ופרט מהטקסט שמראה אותו". בממד ג אין תשובה אחת נכונה, ולכן כתוב "תשובה אפשרית".
- **ציטוט = העתקה מדויקת של מילים רצופות מהטקסט.** אפשר לקצר את האמצע עם `...`. הקוד בודק שכל ציטוט נמצא בטקסט ובפסקה שכתבת.
- התשובה במפתח חייבת להתאים לטקסט. בשאלה סגורה, בדוק שרק תשובה אחת נכונה לפי הטקסט.

## שלבי העבודה

1. כתוב את כל הדף, כולל מפתח התשובות, לפי הכללים למעלה.
2. **בהרצת קוד אחת בלבד:** העתק את `build` שלמטה תו בתו, שים את הדף במחרוזת raw (`md = r"""..."""`), וקרא ל-`build(md, "<שם-באנגלית>.docx", grade="ג")`. האות של הכיתה, בלי גרש. לטקסט של המורה: `own_text=True`.
3. הקוד מדפיס את מספר המילים, הפסקאות, השאלות והממדים, ורשימת בעיות. **אם הודפסו בעיות או שגיאה, תקן את הדף והרץ שוב.** ציטוט שלא נמצא: העתק אותו שוב מהטקסט, או תקן את מספר הפסקה. משפט ארוך: חלק אותו ל-2 משפטים. אל תמסור קובץ עם בעיות.
4. מסור את הקובץ, ואחריו את ההודעה למורה.

## ההודעה למורה (אחרי הקובץ)

עד 4 שורות קצרות:
1. מה בקובץ: הטקסט (כמה מילים), כמה שאלות, ומפתח תשובות. **רק מה שהקוד הדפיס.** אל תכתוב שיש אוצר מילים או ממד, אם הקוד לא ספר אותם.
2. כמה שאלות מכל ממד, בשורה אחת. למשל: "גלויה 3, משתמעת 2, פרשנות 2, הערכה 1".
3. אם יש ניקוד: "כדאי לעבור על הניקוד לפני ההדפסה." אם כתבת טקסט מידעי: "כדאי לבדוק את העובדות בטקסט."
4. הצעה אחת להמשך, למשל 3 רמות לאותו טקסט.

אל תכתוב קישור להורדה ואל תכתוב שם של תיקייה: הקובץ מופיע לבד מעל ההודעה.

```python
import re, docx
from docx.shared import Pt, RGBColor
from docx.oxml import parse_xml
from docx.oxml.ns import qn

RTL = re.compile("[\u0590-\u05FF\u0600-\u06FF]")
NIQQUD = re.compile("[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]")
NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
DIMS = {"א": "הבנת המשמעות הגלויה בטקסט", "ב": "הבנת המשמעות המשתמעת מן הטקסט",
        "ג": "פרשנות, עיבוד ויישום", "ד": "בחינה והערכה של תוכן, מבנה ולשון"}
GRADES = {"א": (40, 90, 18), "ב": (70, 160, 16), "ג": (150, 260, 15),
          "ד": (220, 360, 14), "ה": (300, 480, 13), "ו": (350, 550, 13)}
OPT = re.compile(r"^([א-ד])[.)]\s+(.+)")
VOC = re.compile(r"פי?רוש|משמעות המילה|משמעות הביטוי")
CIRCLE = re.compile(r"הקיפו|להקיף|סמנו|לסמן|בחרו|לבחור")


def _norm(s):
    s = NIQQUD.sub("", s).replace("\u05BE", " ")
    s = re.sub(r"[\"'`\u05F3\u05F4\u201C-\u201E\u2018\u2019]", "", s)
    s = re.sub(r"[.,;:!?()\-\u2013\u2014]", " ", s)
    return " ".join(s.split())


def _rtl(p, text):
    if RTL.search(text) or not re.search(r"[A-Za-z]", text):
        pPr = p._p.get_or_add_pPr()
        later = [c for c in pPr if c.tag in (qn("w:spacing"), qn("w:ind"), qn("w:jc"), qn("w:rPr"))]
        el = parse_xml(f"<w:bidi {NS}/>")
        later[0].addprevious(el) if later else pPr.append(el)


def _add(p, text, size=None, bold=None, gray=False, rtl=False):
    for part in re.split(r"(\*\*.+?\*\*)", text):
        if not part:
            continue
        b = part.startswith("**") and part.endswith("**")
        r = p.add_run(part.strip("*") if b else part)
        r.bold = (b or bold) or None
        if size:
            r.font.size = Pt(size)
            r._r.get_or_add_rPr().append(parse_xml(f'<w:szCs {NS} w:val="{int(size * 2)}"/>'))
        if gray:
            r.font.color.rgb = RGBColor(0x80, 0x80, 0x80)
        if rtl or RTL.search(part):
            r._r.get_or_add_rPr().append(parse_xml(f"<w:rtl {NS}/>"))


def build(md, out, grade="ג", own_text=False, vocab=True, only=None):
    problems = []
    grade = grade.strip("'׳ ")[:1]
    lo, hi, big = GRADES.get(grade, (350, 700, 13))
    small = big - 2 if big > 14 else big
    md = md.replace("\r", "")
    if "[טקסט]" not in md or "[/טקסט]" not in md:
        problems.append("חסר [טקסט] ... [/טקסט]")
        return problems
    head, rest = md.split("[טקסט]", 1)
    text_block, rest = rest.split("[/טקסט]", 1)
    if "# מפתח תשובות" not in rest:
        problems.append("אין # מפתח תשובות")
        rest += "\n# מפתח תשובות\n"
    sheet_part, key_part = rest.split("# מפתח תשובות", 1)
    title = next((l[2:].strip() for l in head.splitlines() if l.startswith("# ")), "הבנת הנקרא")
    text_lines = [l.strip() for l in text_block.strip().splitlines() if l.strip()]
    text_title = text_lines.pop(0)[4:].strip() if text_lines and text_lines[0].startswith("### ") else ""
    paras = text_lines
    words = len(_norm(" ".join(paras)).split())
    full = _norm(" ".join(paras))
    if not own_text and not (lo <= words <= hi * 1.15):
        problems.append(f"אורך הטקסט {words} מילים. לכיתה {grade}' צריך {lo}-{hi}")
    limit = {"א": 8, "ב": 10, "ג": 14, "ד": 16, "ה": 20, "ו": 22}.get(grade, 26)
    if not own_text:
        long = [x for p in paras for x in re.split(r"(?<=[.!?])\s+", p) if len(_norm(x).split()) > limit + 4]
        if long:
            problems.append(f"{len(long)} משפטים ארוכים מ-{limit} מילים. למשל: {long[0][:50]}")
    for l in paras:
        if l.startswith("#") or OPT.match(l) or l.startswith("["):
            problems.append("שורה לא שייכת לטקסט: " + l[:40])

    # student sheets
    sheets, cur = [], None
    for l in sheet_part.splitlines():
        l = l.strip()
        m = re.match(r"# (דף [1-3])$", l)
        if m:
            cur = {"name": m.group(1), "lines": []}
            sheets.append(cur)
        elif l:
            if cur is None:
                cur = {"name": "", "lines": []}
                sheets.append(cur)
            cur["lines"].append(l)
    qs = {}
    for sh in sheets:
        q = None
        for l in sh["lines"]:
            m = re.match(r"## שאלה (\d+)$", l)
            if m:
                q = int(m.group(1))
                qs[(sh["name"], q)] = {"opts": {}, "text": ""}
            elif q is not None and OPT.match(l):
                qs[(sh["name"], q)]["opts"][OPT.match(l).group(1)] = OPT.match(l).group(2)
            elif q is not None:
                qs[(sh["name"], q)]["text"] += " " + _norm(l)
            if "ממד" in l:
                problems.append(f"{sh['name'] or 'הדף'}: המילה 'ממד' בדף לתלמיד")

    # answer key
    keys, sheet, q, dims = {}, "", None, {}
    for l in key_part.splitlines():
        l = l.strip()
        m = re.match(r"#{2,3} (דף [1-3])$", l)
        if m:
            sheet = m.group(1)
            continue
        m = re.match(r"#{2,3} שאלה (\d+)$", l)
        if m:
            q = int(m.group(1))
            keys[(sheet, q)] = {"dim": None, "answer": None, "quotes": 0, "paras": set()}
            continue
        if q is None or not l:
            continue
        k = keys[(sheet, q)]
        name = f"{sheet + ', ' if sheet else ''}שאלה {q}"
        if l.startswith("ממד:"):
            d = l[4:].strip()[:1]
            if d not in DIMS:
                problems.append(f"{name}: ממד לא מוכר")
            k["dim"] = d
            dims.setdefault(sheet, []).append(d)
        elif l.startswith("תשובה:"):
            k["answer"] = l[6:].strip()
        elif l.startswith("מהטקסט:"):
            for quote, pn in re.findall(r"[\"״“”](.+?)[\"״“”]\s*\(פסקה (\d+)\)", l):
                k["quotes"] += 1
                k["paras"].add(int(pn))
                parts = [_norm(x) for x in re.split(r"\.\.\.|\u2026", quote) if _norm(x)]
                where = [i + 1 for i, p in enumerate(paras) if all(x in _norm(p) for x in parts)]
                if not where:  # כתיב מלא מול כתיב חסר: חיפשה / חִפְּשָׂה
                    bare = lambda t: re.sub("[וי]", "", t)
                    where = [i + 1 for i, p in enumerate(paras) if all(bare(x) in bare(_norm(p)) for x in parts)]
                if not where:
                    problems.append(f"{name}: הציטוט לא נמצא בטקסט: {quote[:40]}")
                elif int(pn) not in where:
                    problems.append(f"{name}: הציטוט נמצא בפסקה {where[0]}, לא בפסקה {pn}")
            if not k["quotes"]:
                problems.append(f"{name}: שורת 'מהטקסט' בלי ציטוט במירכאות ו-(פסקה N)")
    for key in qs:
        if key not in keys:
            problems.append(f"{key[0] + ', ' if key[0] else ''}שאלה {key[1]}: אין תשובה במפתח")
    mc_letters = {}
    for key, k in keys.items():
        name = f"{key[0] + ', ' if key[0] else ''}שאלה {key[1]}"
        if key not in qs:
            problems.append(f"{name}: במפתח, אבל לא בדף")
            continue
        if not k["dim"] or not k["answer"]:
            problems.append(f"{name}: חסר 'ממד:' או 'תשובה:' במפתח")
        if k["dim"] in ("א", "ב") and not k["quotes"]:
            problems.append(f"{name}: ממד {k['dim']} צריך שורת 'מהטקסט'")
        opts = qs[key]["opts"]
        if opts:
            if len(opts) < 3 or list(opts) != list("אבגד"[:len(opts)]):
                problems.append(f"{name}: צריך 3 או 4 תשובות לבחירה, א, ב, ג (ד)")
            a = (k["answer"] or "")[:1]
            if a not in opts:
                problems.append(f"{name}: התשובה במפתח צריכה להתחיל באות של התשובה הנכונה")
            if not CIRCLE.search(qs[key]["text"]):
                problems.append(f"{name}: שאלה סגורה, אבל ההוראה לא אומרת להקיף")
            size = {x: len(_norm(v)) for x, v in opts.items()}
            long = a in opts and all(size[a] > v for x, v in size.items() if x != a)
            short = a in opts and all(size[a] < v for x, v in size.items() if x != a)
            mc_letters.setdefault(key[0], []).append((a, long, short))
            right = _norm(opts.get(a, ""))
        else:
            right = re.sub(r"^תשובה אפשרית\s*", "", _norm(k["answer"] or ""))
        if k["dim"] in ("ב", "ג", "ד") and len(right.split()) >= 3 and right in full:
            problems.append(f"{name}: התשובה כתובה בטקסט מילה במילה, ולכן זה ממד א. לשנות את הממד, או לשאול שאלה אחרת")
        if only and k["dim"] != only:
            problems.append(f"{name}: המורה ביקש רק ממד {only}")
    for sh, mc in mc_letters.items():
        where = sh or "הדף"
        top = max([m[0] for m in mc].count(x) for x, _, _ in mc)
        if len(mc) >= 3 and top > max(2, round(len(mc) * 0.4)):
            problems.append(f"{where}: {top} מתוך {len(mc)} תשובות נכונות באותה אות. לגוון")
        for i, word in ((1, "הארוכה"), (2, "הקצרה")):
            n_x = sum(m[i] for m in mc)
            if len(mc) >= 3 and n_x > len(mc) // 2:
                problems.append(f"{where}: התשובה הנכונה היא {word} ביותר ב-{n_x} מתוך {len(mc)} שאלות סגורות")
    for sh in {s for s, _ in qs}:
        n = sum(1 for (s2, _), v in qs.items() if s2 == sh)
        voc = sum(1 for (s2, _), v in qs.items() if s2 == sh and bool(VOC.search(v["text"])))
        need = 2 if n >= 8 else 1 if n >= 5 else 0
        if vocab and only in (None, "ב") and voc < need:
            problems.append(f"{sh or 'הדף'}: {voc} שאלות 'מה פירוש', צריך {need}")
    for q in {q for _, q in keys}:
        ps = [k["paras"] for (s2, q2), k in keys.items() if q2 == q and s2 and k["paras"]]
        if len(ps) > 1 and not set.intersection(*ps):
            problems.append(f"שאלה {q}: בכל דף היא שואלת על פסקה אחרת")
    for sh, ds in dims.items():
        if only:
            continue
        need = "אבג" + ("ד" if grade not in ("א",) and len(ds) >= 6 else "")
        miss = [d for d in need if d not in ds]
        if miss:
            problems.append(f"{sh or 'הדף'}: אין שאלה בממד " + ", ".join(miss))
        if len(ds) >= 8 and ds.count("ג") < 2:
            problems.append(f"{sh or 'הדף'}: צריך לפחות 2 שאלות בממד ג")
    if {"דף 1", "דף 2", "דף 3"} <= set(dims):
        closed = {s: sum(1 for (s2, _), v in qs.items() if s2 == s and v["opts"]) for s in ("דף 1", "דף 2")}
        if closed["דף 1"] <= closed["דף 2"]:
            problems.append("בדף 1 צריך יותר שאלות סגורות מבדף 2")
        if sum(d in "גד" for d in dims["דף 3"]) <= sum(d in "גד" for d in dims["דף 2"]):
            problems.append("בדף 3 צריך יותר שאלות בממדים ג ו-ד מבדף 2")

    # the Word file
    doc = docx.Document()
    for name, size in (("Normal", small), ("Heading 1", big + 4), ("Heading 2", small + 1), ("Heading 3", big + 2)):
        st = doc.styles[name]
        st.font.name, st.font.size = "Arial", Pt(size)
        st.element.rPr.rFonts.set(qn("w:cs"), "Arial")
        st.element.rPr.append(parse_xml(f'<w:szCs {NS} w:val="{size * 2}"/>'))
        st.font.color.rgb = RGBColor(0, 0, 0)

    def para(text="", style=None, **kw):
        p = doc.add_paragraph(style=style)
        if text:
            _add(p, text, **kw)
        _rtl(p, text or "א")
        return p

    for i, sh in enumerate(sheets):
        h = para(title + (" - " + sh["name"] if sh["name"] else ""), "Heading 1")
        if i:
            h.paragraph_format.page_break_before = True
        para("שם: ______________   כיתה: ______   תאריך: ______")
        if text_title:
            para(text_title, "Heading 3").alignment = 1
        for n, t in enumerate(paras, 1):
            p = doc.add_paragraph()
            p.paragraph_format.line_spacing = 1.5
            _add(p, f"{n}    ", size=big - 3, bold=True, gray=True, rtl=True)
            _add(p, t, size=big)
            _rtl(p, t)
        for j, l in enumerate(sh["lines"]):
            nxt = sh["lines"][j + 1] if j + 1 < len(sh["lines"]) else "## "
            m = re.match(r"\[קווים (\d)\]$", l)
            if m:
                line = '<w:{0} w:val="single" w:sz="6" w:space="1" w:color="808080"/>'
                for k in range(int(m.group(1))):
                    p = para()
                    p.paragraph_format.keep_with_next = k + 1 < int(m.group(1))
                    pPr = p._p.get_or_add_pPr()
                    pPr.insert(1 if pPr.find(qn("w:pStyle")) is not None else 0, parse_xml(
                        f'<w:pBdr {NS}>{line.format("bottom")}{line.format("between")}</w:pBdr>'))
                    p.paragraph_format.space_before = Pt(big + 8)
            elif l.startswith("## "):
                para(l[3:], "Heading 2").paragraph_format.space_before = Pt(16)
            elif l.startswith("#"):
                problems.append("כותרת לא מוכרת בדף: " + l[:40])
            else:
                p = para(l)
                p.paragraph_format.keep_with_next = not nxt.startswith("## ")
                if OPT.match(l):
                    p.paragraph_format.left_indent = p.paragraph_format.right_indent = Pt(18)
                    p.paragraph_format.space_after = Pt(2)
    h = para("מפתח תשובות", "Heading 1")
    h.paragraph_format.page_break_before = True
    for l in key_part.splitlines():
        l = l.strip()
        if not l:
            continue
        if re.match(r"#{2,3} שאלה", l):
            para(l.lstrip("# "), bold=True).paragraph_format.space_before = Pt(10)
        elif re.match(r"#{2,3} ", l):
            p = para(l.lstrip("# "), "Heading 1")
            p.paragraph_format.page_break_before = l.lstrip("# ") != "דף 1"
        elif l.startswith("ממד:"):
            d = l[4:].strip()[:1]
            para(f"ממד {d}: {DIMS.get(d, '')}", bold=True)
        else:
            para(l)
    doc.save(out)
    print(f"מילים בטקסט: {words} | פסקאות: {len(paras)} | שאלות: {len(qs)} | אוצר מילים:",
          sum(bool(VOC.search(v["text"])) for v in qs.values()), "| ממדים:",
          {s or "דף": "".join(sorted(d)) for s, d in dims.items()}, "| בעיות:", problems or "אין")
    return problems
```
