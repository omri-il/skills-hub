---
name: create-elementary-math-practice
description: יוצר דפי עבודה ודפי תרגול במתמטיקה (חשבון) לבית הספר היסודי, כיתות א' עד ו', כקובץ Word עם אותיות גדולות, מקום לפתרון, תרגילים במאונך, שברים, בעיות מילוליות בשפה של ילדים, ומפתח תשובות שנבדק בקוד. מצייר צורות עם מידות, זוויות למדידה, דף משבצות, ישר מספרים, שעון ומודל שבר. יכול ליצור את אותו דף ב-3 רמות לכיתה הטרוגנית. השתמש כאשר מורה ביסודי מבקש דף עבודה, דף תרגול, שיעורי בית, בוחן קצר או דף חזרה בחשבון או במתמטיקה, למשל על חיבור וחיסור, לוח הכפל, כפל וחילוק, תרגילים במאונך, ערך המקום, שברים, מספרים עשרוניים, אחוזים, מדידות, שטח והיקף, גאומטריה, או בעיות מילוליות, לכל כיתה מ-א' עד ו'.
---

# דפי תרגול במתמטיקה ליסודי

המטרה: דף שילד בכיתה א'-ו' יכול לעבוד עליו לבד. אותיות גדולות, הוראה קצרה, מקום לכתוב, ומספרים שמתאימים לכיתה. המורה מקבל קובץ Word מוכן להדפסה, עם מפתח תשובות נכון.

## חובה: התוצר הוא קובץ Word

- **אל תכתוב את דף העבודה בתשובה בצ'אט.** צור קובץ Word ‏(‎.docx) להורדה, גם אם המורה לא ביקש קובץ.
- בנה את הקובץ בהרצת קוד אחת, עם הפונקציה `build` שבסוף הסקיל. היא משתמשת רק ב-python-docx, שמותקן בסביבת הקוד שלך. אם יש בדף ציורים, העתק גם את "קוד הציורים" (matplotlib, גם הוא מותקן).
- **אל תבנה את הקובץ בדרך אחרת** (pandoc, טבלאות של python-docx, XML שאתה כותב בעצמך). רק `build`, מועתקת תו בתו.
- הכלל הזה גובר על סקילים אחרים: גם אם מותקנים format-equations-for-hebrew-worksheets או hebrew-docs-rtl, דף חשבון לכיתות א'-ו' נבנה רק לפי הסקיל הזה, עם `build` שלו.
- את הקוד אתה כותב ומריץ בעצמך בכלי הרצת הקוד. זה לא סקריפט של הסקיל, ואין מגבלה על הרצתו.
- **קוד שכתוב בטקסט התשובה, בבלוק ```python, לא רץ אף פעם.** המורה רואה קוד ולא מקבל קובץ. לכן אף פעם לא כותבים את `build` בטקסט התשובה.

## לפני שמתחילים

צריך לדעת 2 דברים: **כיתה** (א'-ו') ו**נושא**.

- אם הכיתה או הנושא חסרים, שאל עליהם בהודעה אחת קצרה, עם ברירת מחדל לכל שאלה. אל תנחש כיתה.
- אם כתוב "תחליט אתה", בחר בעצמך והמשך.
- ברירות מחדל, בלי לשאול: 8 שאלות, דף אחד, בלי ניקוד.
- אם המורה ביקש **רמות**, **דיפרנציאציה**, **כיתה הטרוגנית** או "לחלשים ולחזקים": צור 3 דפים (ראה "3 רמות").
- אם המורה ביקש דף **לתלמידים בשילוב** או לתלמידים מתקשים: צור דף אחד, כמו "דף 1" (מספרים קטנים, דוגמה פתורה, רמזים). לא 3 דפים.
- בקשה באנגלית: הדף עדיין בעברית, אלא אם המורה ביקש דף באנגלית.

## מספרים שמתאימים לכיתה

הטבלה היא כיוון כללי לפי תוכנית הלימודים. אם המורה כתב טווח אחר, המורה קובע.

| כיתה | מספרים | נושאים טיפוסיים |
|---|---|---|
| א' | עד 20, ובהמשך השנה עד 100 | חיבור וחיסור עד 20, השוואה (גדול, קטן, שווה), זוגי ואי-זוגי |
| ב' | עד 100, ובהמשך עד 1,000 | חיבור וחיסור עד 100, תחילת הכפל, כסף, שעון, אורך |
| ג' | עד 1,000 ועד 10,000 | לוח הכפל, חילוק עם שארית, תרגילים במאונך, חצי ורבע |
| ד' | עד מיליון | כפל במאונך, חילוק ארוך, סדר פעולות, שברים פשוטים, שטח והיקף |
| ה' | מספרים גדולים | שברים: הרחבה, צמצום, השוואה, חיבור וחיסור, מספרים מעורבים, תחילת העשרוניים |
| ו' | מספרים גדולים | מספרים עשרוניים, כפל וחילוק שברים, אחוזים, יחס, נפח |

- **אל תעבור את הטווח של הכיתה.** בכיתה ב' אין תרגיל עם 4 ספרות. בכיתה ג' אין שבר כמו 7/12.
- בחר מספרים שנותנים תשובה שלמה, אלא אם הנושא הוא שארית, שברים או עשרוניים.
- בתרגילים במאונך: שלב תרגילים עם המרה (פריטה, "הלוואה") ובלי המרה, אם זה הנושא.
- אל תחזור על אותו סוג תרגיל יותר מ-3 פעמים ברצף. גוון: תרגיל, השלמה (□ + 5 = 12), השוואה, בעיה מילולית, "מצאו את הטעות".

## מבנה הדף

1. כותרת `#`: הנושא והכיתה. למשל: "כפל במאונך - כיתה ד'".
2. שורה למילוי: `שם: ______________ כיתה: ______ תאריך: ______`
3. השאלות, כל אחת עם כותרת `##` ("שאלה 1"), מהקל לקשה:
   - כחצי מהשאלות: תרגול ישיר של הנושא.
   - כרבע: שאלות של 2 שלבים, השלמה או השוואה.
   - כרבע: בעיות מילוליות ושאלת "הסבירו איך חשבתם".
4. בסוף: שאלת אתגר אחת, עם הכותרת `## אתגר`. חידה קטנה או שאלה פתוחה, באותו נושא.
5. `# מפתח תשובות`. הקוד מעביר אותו לעמוד חדש.

## הוראות ובעיות מילוליות

- הוראה אחת בכל שאלה, במשפט קצר. **תמיד בלשון רבים**: "פתרו", "השלימו", "הקיפו", "סדרו", "הסבירו", "כתבו". אף פעם לא "כתובי" או "פתור".
- ההוראה מתאימה למה שרואים בדף. "הקיפו" רק כשיש בדף אפשרויות להקיף. "השלימו" כשיש □ או קו.
- בכל שאלה שהילד עונה בה על כמה פריטים, יש מקום לתשובה ליד כל פריט (□ או `\underline{\qquad}`).
- **אף פעם אל תכתוב את הסימנים > או < בתוך משפט בעברית.** בדף מימין לשמאל הם מוצגים הפוך. כתוב במילים ("כתבו בריבוע את הסימן המתאים: גדול מ-, קטן מ- או שווה ל-"), ואת הדוגמה בפסקה משלה: `$$7 > 3 \qquad 3 < 7 \qquad 5 = 5$$`.
- להדגיש ספרה במספר אי אפשר. כתוב במקום: "מה הערך של הספרה 8 במספר 4,857?"
- הדף לתלמיד לא כולל פתרונות. רק "דף 1" ודף לשילוב כוללים דוגמה פתורה אחת, עם מספרים שלא מופיעים בשאלות.
- קרא שוב כל משפט לפני `build`: שגיאות כתיב, מילה חסרה, יחידה נכונה (שטח בסמ"ר, נפח בסמ"ק, אורך בס"מ).
- בכיתות א'-ב': עד 8 מילים במשפט, ולא יותר מ-2 משפטים בשאלה.
- בכיתות ג'-ו': עד 15 מילים במשפט.
- בעיה מילולית: מצב מהחיים של ילדים (הפסקה, טיול שנתי, מכולת, ספורט, יום הולדת, גינה). שמות מגוונים מכל החברה הישראלית.
- כל הנתונים שצריך נמצאים בבעיה, ויש בה שאלה אחת. אין נתונים מיותרים, אלא אם הנושא הוא "נתון מיותר".
- אחרי בעיה מילולית: 2 פסקאות `&nbsp;`, ואז `תשובה: ________` עם היחידה (גולות, שקלים, ס"מ).
- **ניקוד:** רק אם המורה ביקש. אז נקד רק את ההוראות ואת הבעיות המילוליות, וכתוב למורה בצ'אט לבדוק את הניקוד לפני ההדפסה.

## 3 רמות

- 3 דפים באותו קובץ. הכותרות: `# דף 1`, `# דף 2`, `# דף 3`. הקוד מעביר כל דף לעמוד חדש. **אל תכתוב על הדף "חלשים", "מתקדמים" או "רמה נמוכה".** ילד לא צריך לראות את זה.
- אותו נושא ואותו מספר שאלות. מספר השאלה זהה בכל הדפים, כדי שאפשר לבדוק יחד בכיתה.
- דף 1: מספרים קטנים יותר, דוגמה פתורה בראש הדף, ורמז בשאלות הקשות.
- דף 2: הדף הרגיל של הכיתה.
- דף 3: מספרים גדולים יותר, יותר בעיות של 2 שלבים, ושאלת "הסבירו" נוספת.
- במפתח התשובות: כותרת `## דף 1` לכל דף, ושורה אחת למורה שאומרת למי מתאים כל דף.

## כללי כתיבה

הדף נכתב כטקסט פשוט, ו-`build` הופכת אותו לקובץ Word. כל `$...$` הופך לתרגיל אמיתי של Word.

- כותרות: `#` לכותרת הדף, `##` לכל שאלה.
- **שורה ריקה בין כל 2 פסקאות.** שורות צמודות מתאחדות לפסקה אחת.
- מקום לפתרון: פסקאות של `&nbsp;` בלבד, עם שורה ריקה ביניהן. 2 עד 3 אחרי כל שאלה שצריך לכתוב בה.
- הדגשה: `**מילה**`. בלי רשימות, בלי טבלאות ובלי קישורים. תמונה רק דרך שורת `[draw ...]` (ראה "ציורים").
- **אל תשתמש בטבלאות לתרגילים.** בדף מימין לשמאל הסימן + קופץ לצד השני של המספר.
- **בלי אימוג'י ובלי סימנים מיוחדים** (⭐ ✔ ✏). ב-Google Docs הם יוצאים כריבועים ריקים.
- **אל תכתוב בתוך הטקסט 3 גרשיים הפוכים (\`\`\`).**

### מספרים ותרגילים

- **תרגיל נמצא בפסקה משלו, בתוך `$$...$$`.** אף פעם לא באמצע משפט בעברית.
- `$...$` בתוך שורה מותר רק בסוף משפט, אחרי נקודתיים, ורק אחד בשורה. אחרי `$...$` לא באה עוד עברית באותה פסקה. הקוד מדפיס בעיה אם כן.
- שעה כתובה בטקסט רגיל, בלי `$`: "השעה 3:00". גם במפתח. שעה בתוך `$` מתהפכת ל-00:3.
- **אין עברית בתוך `$`.** מילים נכתבות במשפט לפני התרגיל.
- כפל: `\times`. חילוק: `:` (כמו בבתי ספר בישראל). מקום לתשובה בתוך תרגיל: `\underline{\qquad}`.
- משבצת להשלמה: `\square`. למשל `$$\square + 5 = 12$$`.
- שבר: `\frac{3}{4}`. מספר מעורב: `2\frac{1}{2}`. עשרוני: נקודה, `0.75`.
- מספר עם 5 ספרות או יותר בתוך תרגיל: `12{,}450`. מחוץ לתרגיל, בטקסט: 12,450.
- רשימת מספרים לסידור או להשוואה: בפסקה משלה, עם `\qquad` ביניהם. למשל `$$0.5 \qquad 0.25 \qquad 0.75$$`.
- רווח בין תרגילים באותה שורה: `\qquad`.
- `build` מכירה רק את הפקודות האלה: `\frac`, `\underline`, `\times`, `\cdot`, `\div`, `\square`, `\qquad`, `\quad`, `\;`, `\,`, `\le`, `\ge`, `\neq`, `\approx`, `\circ`, `\%`, `\text`, `\phantom`, ו-`\begin{array}{r}`. אל תשתמש בפקודה אחרת.

### תרגילים במאונך

תרגיל במאונך נכתב כך, עם קו מתחת לשורה השנייה:

`$$\begin{array}{r} 345 \\ \underline{+\;278} \end{array}$$`

- עד 4 תרגילים בשורה אחת, עם `\qquad` ביניהם:
  `$$\begin{array}{r} 512 \\ \underline{-\;137} \end{array} \qquad \begin{array}{r} 46 \\ \underline{\times\;7} \end{array}$$`
- אחרי שורה של תרגילים במאונך: 2 פסקאות `&nbsp;`, כדי שיהיה מקום לכתוב את התוצאה.
- חילוק ארוך: כתוב אותו כתרגיל בשורה (`$$756 : 4 =$$`) ותן מקום לפתרון. אל תנסה לצייר את "הבית" של החילוק.

## ציורים

הקוד מצייר צורות, זוויות, משבצות, ישר מספרים, שעון ומודל שבר. כל ציור הוא שורה אחת בפסקה משלה: `[draw ...]`, עם שורה ריקה לפניה ואחריה. הקוד מצייר בדיוק לפי המספרים בשורה, ולכן המספרים בציור תמיד מתאימים לאורכים ולזוויות.

**מתי לצייר:** בכל שאלה שילד צריך בה לראות צורה, למדוד, לספור משבצות, לסמן על ישר מספרים או לקרוא שעון. בדף על שטח, היקף, זוויות, צורות, ישר מספרים או שעון, רוב השאלות כוללות ציור. בדף על נושא אחר, צייר רק כשהציור עוזר.

- ההוראה בעברית כתובה במשפט **לפני** הציור. בתוך הציור יש רק מספרים, האותיות A, B, C וסימן `?`. אף פעם לא עברית בתוך `[draw ...]`.
- מתחת לצורה עם מידות הקוד כותב לבד "המידות בס"מ." (או במטרים). אל תכתוב את זה שוב. אם הצורה גדולה מהדף, הקוד מקטין אותה ומוסיף "השרטוט מוקטן."
- `[draw ...]` אף פעם לא בתוך משפט, לא בתוך `$` ולא במפתח התשובות.
- **הציור לא מגלה את התשובה.** כל ערך שהילד צריך למצוא, לחשב או למדוד הוא `?` או ריק בציור, אף פעם לא המספר: צלע, זווית, נקודה על ישר המספרים, התוצאה של קפיצות. בדוק כל `labels=`, `angles=`, `points=` ו-`jumps=` מול השאלה שלו.
- שאלה שבה הילד מחשב "בעזרת ישר המספרים": צייר ישר בלי קפיצות, והילד מצייר אותן. `jumps=` רק בדוגמה פתורה, או כשהשאלה היא "איזה תרגיל מתאים לקפיצות?".
- נתון שהילד צריך מהציור כתוב גם בציור. שאלה על צורה מורכבת, על צורה שיש לה מידות או על זווית שמודדים: תמיד עם ציור, לא תיאור במילים.
- אותיות של נקודות או קודקודים בתוך משפט בעברית: אות אחת בכל משפט ("מה המספר בנקודה A?"). רשימה כמו "A, B ו-C" מתבלגנת בדף מימין לשמאל. לכמה נקודות, כתוב "כל אחת מהנקודות המסומנות", ושורת תשובה לכל אות.
- 3 רמות: אותו סוג ציור באותה שאלה בכל 3 הדפים, עם מספרים אחרים.

### צורות

- `[draw rect 6 4]` מלבן, רוחב 6 וגובה 4. `[draw square 5]` ריבוע.
- `[draw triangle 3 4 5]` משולש לפי 3 צלעות: בסיס, צלע ימין, צלע שמאל. אם אין משולש כזה, הקוד מדפיס בעיה.
- `[draw triangle angles=50,60,?]` משולש לפי זוויות: A משמאל למטה, B מימין למטה, C למעלה. זווית אחת יכולה להיות `?`.
- `[draw triangle base=8 height=5]` משולש עם גובה מקווקו. `apex=2` קובע איפה הקודקוד העליון מעל הבסיס (מ-0 עד אורך הבסיס, או מחוץ לו למשולש קהה זווית).
- `[draw parallelogram base=7 height=4 shift=2]` מקבילית עם גובה. `[draw trapezoid bottom=10 top=6 height=4]` טרפז עם גובה.
- `[draw polygon 6 4]` מצולע משוכלל: מספר הצלעות, ואורך הצלע.
- `[draw shape 0,0 8,0 8,3 3,3 3,6 0,6]` כל צורה לפי הפינות שלה, לפי הסדר מסביב לצורה. למשל צורה מורכבת לשטח. הקוד כותב לבד את האורך של כל צלע.
- `[draw circle 3]` עיגול עם רדיוס 3. `show=d` מראה את הקוטר.

אפשרויות לכל צורה:

- `labels=6,?,,4` מה כתוב ליד כל צלע, לפי הסדר: במלבן ובריבוע למטה, ימין, למעלה, שמאל. ערך ריק = בלי מספר. `?` = צלע שהילד מחשב. מספר חייב להיות האורך האמיתי, אחרת הקוד מדפיס בעיה.
- `angles=90,?,,` מה כתוב ליד כל פינה, באותו סדר. מספר חייב להיות הזווית האמיתית.
- `letters=ABCD` אותיות לפינות. `unit=m` יחידה אחרת: `cm` (ברירת מחדל), `m`, `mm`, `km`, או `none` בלי משפט יחידות. `fill=yes` צביעה באפור.
- בכל זווית ישרה הקוד מצייר לבד סימן של זווית ישרה.
- בכל `?` הקוד מדפיס את הערך האמיתי ("צלע 4 = 3"). בדוק שהמפתח אומר אותו דבר.

### מדידה בסרגל ובמד זווית

- צורה ב-ס"מ עד 10 רוחב ו-6 גובה מודפסת **בגודל אמיתי**, כך שאפשר למדוד אותה בסרגל. בשאלת מדידה: מספרים שלמים, `labels=,,,` (בלי מספרים), ובמפתח האורך האמיתי.
- `[draw angle 65]` זווית בגודל מדויק, עם קרניים של 6.5 ס"מ. `rot=30` מסובב את כל הזווית. גוון את `rot` בין השאלות, כדי שלא כל הזוויות יתחילו בקו אופקי.
- בשאלה "מדדו את הזווית": בלי `label`. במפתח: הגודל, ו"תשובה בטווח של 2 מעלות נכונה". `label` כותב את הגודל בציור, רק כשהילד לא מודד.
- בחר זוויות שמתחלקות ב-5 (35, 70, 125), מ-10 עד 170.
- `[draw ray]` קרן עם נקודה בקצה, כדי שהילד ישרטט ממנה זווית. במפתח: "בדקו עם מד זווית".
- `letters=ABC` לזווית: A על הקרן הראשונה, B בקודקוד, C על הקרן השנייה.

### משבצות, ישר מספרים, שעון ושברים

- `[draw grid 12 8]` דף משבצות של 1 ס"מ, 12 עמודות ו-8 שורות (עד 15 על 22). `shape=1,1;5,1;5,4;1,4` צובע צורה על המשבצות, לספירת שטח. הפינות של הצורה על קווי המשבצות.
- `[draw numberline 0 20]` ישר מספרים. `step=` המרחק בין שנתות: `5`, `0.1` או `1/4` (שבר יוצא כשבר, עשרוני כעשרוני). עד 40 שנתות. כל נקודה וכל משבצת ריקה חייבות להיות על שנתה.
  - `labels=all`, `ends` (רק בקצוות), `none`, או רשימה `0,10,20`.
  - `blank=7,13` משבצת ריקה מתחת לשנתות האלה, להשלמה.
  - `points=A:3/4,B:1.5` נקודות עם אותיות.
  - `jumps=3:8,8:10` קפיצות מעל הישר, עם +5 ו-+2.
- `[draw clock 3:45]` שעון עם מחוגים. `[draw clock hands=no]` שעון בלי מחוגים, שהילד מצייר בו.
- `[draw fraction 3 4]` עיגול מחולק ל-4, ו-3 חלקים צבועים. `shape=rect` מלבן מחולק. 7 מתוך 4 = 2 שלמים. `[draw fraction 0 6]` בלי צביעה, כדי שהילד יצבע.

## מפתח התשובות

- כל שורה מתחילה ב"שאלה" ובמספר: `שאלה 3: $3\frac{3}{4}$`. לא `3.` בתחילת שורה. לשאלת האתגר: `אתגר:`, בלי מספר.
- שאלה עם כמה חלקים בדף לתלמיד: סמן אותם א, ב, ג גם בדף וגם במפתח.
- כמה תשובות לאותה שאלה: בתוך `$...$` בסוף השורה, עם `\qquad` ביניהן. למשל `שאלה 1: $623 \qquad 375 \qquad 322$`. אחרת הסדר מתהפך.
- בתרגיל של 2 שלבים או יותר: גם הדרך, בפסקה של `$$...$$` מתחת לשורה.

## בדיקת התשובות

- **חשב בקוד את התשובה של כל שאלה**, באותה הרצת קוד, לפני `build`. גם שברים (`fractions.Fraction`) וגם עשרוניים.
- בבעיה מילולית: כתוב בקוד את החישוב לפי הנתונים בבעיה, לא לפי התשובה שחשבת בראש.
- בדוק שכל תשובה בטווח של הכיתה. למשל בכיתה א' אין תשובה שלילית.
- **אתגר, חידה, "מצאו מספר" או "מה הספרה החסרה":** בדוק בקוד את כל האפשרויות (לולאה על כל המספרים בטווח), וספור כמה תשובות נכונות יש. אם יש יותר מאחת, הוסף לשאלה תנאי שמשאיר תשובה אחת, או כתוב במפתח את כל התשובות.
- **"מצאו את הטעות":** חשב בקוד את התוצאה השגויה מתוך הטעות שאתה מתאר (למשל: שכח להוריד 1 מהעשרות אחרי פריטה). התוצאה השגויה בשאלה חייבת להיות בדיוק התוצאה הזאת, וההסבר במפתח מתאר את אותה טעות.
- שאלה של "מה גדול יותר": בדוק שהתשובות לא שוות, אלא אם "שווה" היא אחת האפשרויות בשאלה.
- אם התשובה בקוד שונה מהתשובה שכתבת, תקן את השאלה או את המפתח לפני `build`.
- אל תוסיף למפתח "תשובה אפשרית נוספת" שלא בדקת בקוד מול כל התנאים של השאלה.

## שלבי העבודה

1. כתוב את כל הדף, כולל מפתח התשובות, לפי הכללים למעלה.
2. **בהרצת קוד אחת בלבד:** חשב את התשובות, העתק את `build` שלמטה תו בתו (ואם יש ציורים, גם את "קוד הציורים"), שים את הדף במחרוזת raw (`md = r"""..."""`, כדי ש-`\frac` לא יישבר), וקרא ל-`build(md, "<שם-באנגלית>.docx")`.
3. אם הודפסו בעיות או שגיאה, תקן את הדף והרץ שוב. אל תמסור קובץ עם בעיות. בדוק גם ששורות "ציור:" שהודפסו מתאימות למפתח.
4. מסור את הקובץ, ואחריו את ההודעה למורה.

```python
import re, docx
from docx.shared import Pt
from docx.oxml import parse_xml
from docx.oxml.ns import qn

HEB = re.compile(r"[֐-׿]")
NS = 'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
SYM = {"times": "×", "cdot": "·", "div": "÷", "square": "□", "qquad": "  ", "quad": " ",
       ";": " ", ",": " ", "le": "≤", "ge": "≥", "neq": "≠", "%": "%", "approx": "≈", "circ": "°"}

def _x(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def _run(t):
    return ('<m:r><m:rPr><m:sty m:val="p"/></m:rPr><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/>'
            f'<w:sz w:val="30"/></w:rPr><m:t xml:space="preserve">{_x(t)}</m:t></m:r>')

def _group(s, i):
    depth, j = 0, i
    while j < len(s):
        depth += {"{": 1, "}": -1}.get(s[j], 0)
        if depth == 0:
            return s[i + 1:j], j + 1
        j += 1
    raise ValueError("סוגריים { } לא סגורים: " + s)

def _math(s, problems):
    out, i, buf = [], 0, ""
    def flush():
        nonlocal buf
        if buf:
            out.append(_run(buf.replace("-", "−")))
            buf = ""
    while i < len(s):
        c = s[i]
        if c == "\\":
            m = re.match(r"\\([A-Za-z]+|.)", s[i:])
            cmd = m.group(1)
            i += len(m.group(0))
            if cmd == "frac":
                a, i = _group(s, i); b, i = _group(s, i); flush()
                out.append(f"<m:f><m:num>{_math(a, problems)}</m:num><m:den>{_math(b, problems)}</m:den></m:f>")
            elif cmd == "underline":
                a, i = _group(s, i); flush()
                out.append(f'<m:bar><m:barPr><m:pos m:val="bot"/></m:barPr><m:e>{_math(a, problems)}</m:e></m:bar>')
            elif cmd == "begin":
                env, i = _group(s, i)
                if s[i:i + 1] == "{":
                    _, i = _group(s, i)
                end = s.index("\\end{" + env + "}", i)
                rows = [r.strip() for r in s[i:end].split("\\\\") if r.strip()]
                i = end + len("\\end{" + env + "}"); flush()
                out.append('<m:m><m:mPr><m:plcHide m:val="on"/><m:mcs><m:mc><m:mcPr><m:count m:val="1"/>'
                           '<m:mcJc m:val="right"/></m:mcPr></m:mc></m:mcs></m:mPr>'
                           + "".join(f"<m:mr><m:e>{_math(r, problems)}</m:e></m:mr>" for r in rows) + "</m:m>")
            elif cmd in SYM:
                buf += SYM[cmd]
            elif cmd in ("text", "mathrm"):
                a, i = _group(s, i); buf += a
            elif cmd == "phantom":
                a, i = _group(s, i); buf += " " * len(a)
            else:
                problems.append("פקודה לא מוכרת בתרגיל: \\" + cmd)
        elif c == "{":
            a, i = _group(s, i); flush(); out.append(_math(a, problems))
        elif c == " ":
            i += 1
            if buf[-1:].isdigit() and s[i:].lstrip()[:1].isdigit():
                buf += " "
        else:
            buf += c; i += 1
    flush()
    return "".join(out)

def _omath(tex, problems):
    if HEB.search(tex):
        problems.append("עברית בתוך תרגיל: " + tex[:50])
    return parse_xml(f"<m:oMath {NS}>{_math(tex.strip(), problems)}</m:oMath>")

def _text(p, text, problems):
    for part in re.split(r"(\*\*.+?\*\*)", text):
        if not part:
            continue
        bold = part.startswith("**") and part.endswith("**")
        part = part.strip("*") if bold else part
        if "$" in part or re.search(r"\\[A-Za-z]+", part):
            problems.append("קוד LaTeX גלוי: " + part[:50])
        if HEB.search(part) and re.search(r"[A-Z] ?, ?[A-Z]|[A-Z] ו-?[A-Z]", part):
            problems.append("רשימת אותיות בתוך משפט: " + part[:50])
        if "[draw" in part:
            problems.append("ציור בתוך משפט: " + part[:50])
        if HEB.search(part) and re.search(r"[<>]", part):
            problems.append("סימן < או > בתוך משפט בעברית: " + part[:50])
        r = p.add_run(part)
        r.bold = bold or None
        if HEB.search(part):
            r._r.get_or_add_rPr().append(parse_xml(f"<w:rtl {NS}/>"))

def build(md, out):
    problems = []
    md = re.sub(r"^---\n.*?\n---\n", "", md.strip() + "\n", flags=re.S)
    md = re.sub(r"^[ \t]*(#{1,3} .*|\[draw .*\])[ \t]*$", r"\n\1\n", md, flags=re.M)
    doc = docx.Document()
    for name, size in (("Normal", 14), ("Heading 1", 20), ("Heading 2", 16), ("Heading 3", 14)):
        st = doc.styles[name]
        st.font.name, st.font.size = "Arial", Pt(size)
        st.element.rPr.rFonts.set(qn("w:cs"), "Arial")
        st.element.rPr.append(parse_xml(f'<w:szCs {NS} w:val="{size * 2}"/>'))
    for block in re.split(r"\n\s*\n", md):
        block = " ".join(line.strip() for line in block.strip().splitlines())
        if not block:
            continue
        h = re.match(r"(#{1,3})\s+(.*)", block)
        if h:
            p = doc.add_paragraph(style=f"Heading {len(h.group(1))}")
            title = h.group(2)
            if "מפתח תשובות" in title or (len(h.group(1)) == 1 and re.match(r"דף [23]", title)):
                p.paragraph_format.page_break_before = True
            _text(p, title, problems)
        elif block.startswith("[draw ") and block.endswith("]"):
            if "_figure" in globals():
                p = _figure(doc, block[6:-1].strip(), problems)
            else:
                problems.append("יש ציור בדף, אבל קוד הציורים לא הועתק")
                p = doc.add_paragraph()
        elif block == "&nbsp;":
            p = doc.add_paragraph()
        elif block.startswith("$$") and block.endswith("$$") and block.count("$$") == 2:
            p = doc.add_paragraph()
            p._p.append(parse_xml(f'<m:oMathPara {NS}><m:oMathParaPr><m:jc m:val="center"/></m:oMathParaPr></m:oMathPara>'))
            p._p[-1].append(_omath(block[2:-2], problems))
        else:
            p = doc.add_paragraph()
            parts = re.split(r"\$(.+?)\$", block)
            if len(parts) > 1 and HEB.search("".join(parts[2::2])):
                problems.append("תרגיל באמצע משפט. $...$ רק בסוף המשפט: " + block[:50])
            for k, part in enumerate(parts):
                if k % 2:
                    p._p.append(_omath(part, problems))
                elif part:
                    _text(p, part, problems)
        p._p.get_or_add_pPr().append(parse_xml(f"<w:bidi {NS}/>"))
    if "מפתח תשובות" not in md:
        problems.append("אין מפתח תשובות")
    doc.save(out)
    print("תרגילים בקובץ:", md.count("$$") // 2, "| בעיות:", problems or "אין")
    return problems
```

### קוד הציורים

רק אם יש בדף שורת `[draw ...]`: העתק גם את הקוד הזה, תו בתו, באותה הרצת קוד, לפני הקריאה ל-`build`. דף בלי ציורים לא צריך אותו.

```python
import io, math
from fractions import Fraction
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, Polygon, Rectangle, Wedge
from docx.shared import Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

UNITS = {"cm": 'בס"מ', "m": "במטרים", "mm": 'במ"מ', "km": 'בק"מ'}
FS = 14

def _len(x):
    for d in (1, 2):
        if abs(x * d - round(x * d)) < 1e-6:
            return "%g" % (round(x * d) / d)
    return ""

def _canvas(x0, y0, x1, y1, k, pad=0.9):
    w, h = (x1 - x0) * k + 2 * pad, (y1 - y0) * k + 2 * pad
    fig = plt.figure(figsize=(w / 2.54, h / 2.54))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis("off")
    ax.set_xlim(x0 - pad / k, x1 + pad / k)
    ax.set_ylim(y0 - pad / k, y1 + pad / k)
    return fig, ax, w

def _t(ax, x, y, s, size=FS):
    ax.text(x, y, s, ha="center", va="center", fontsize=size)

def _mark(ax, p, u, v, r):
    q = [p, (p[0] + u[0] * r, p[1] + u[1] * r), (p[0] + (u[0] + v[0]) * r, p[1] + (u[1] + v[1]) * r), (p[0] + v[0] * r, p[1] + v[1] * r)]
    ax.add_patch(Polygon(q, closed=False, fill=False, lw=1.2))

def _unit(a, b):
    d = math.hypot(b[0] - a[0], b[1] - a[1])
    return ((b[0] - a[0]) / d, (b[1] - a[1]) / d)

def _shape(P, L, o, notes, problems, dashes=()):
    n, unit = len(P), o.get("unit", "cm")
    pts = list(P) + [q for d in dashes for q in d[:2]]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    W, H = max(x1 - x0, 1e-9), max(y1 - y0, 1e-9)
    k = min(10 / W, 6 / H, 1 if unit == "cm" else 6 / max(W, H))
    fig, ax, w = _canvas(x0, y0, x1, y1, k, 0.7)
    ax.add_patch(Polygon(P, closed=True, fill=o.get("fill") == "yes", fc="0.85", ec="black", lw=1.8))
    ccw = sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n)) > 0
    if "labels" in o:
        L = o["labels"].split(",")
    if len(L) != n:
        problems.append("labels: צריך %d ערכים, אחד לכל צלע" % n)
        L = (L + [""] * n)[:n]
    A = o.get("angles", "").split(",") if "angles" in o else [""] * n
    for i in range(n):
        a, b = P[i], P[(i + 1) % n]
        u, d = _unit(a, b), math.dist(a, b)
        nx, ny = (u[1], -u[0]) if ccw else (-u[1], u[0])
        lab = L[i].strip()
        if lab == "?":
            notes.append("צלע %d = %s" % (i + 1, _len(d) or round(d, 2)))
        elif lab and lab.replace(".", "").isdigit() and abs(float(lab) - d) > 0.01:
            problems.append("צלע %d: כתוב %s, אבל האורך בציור %s" % (i + 1, lab, round(d, 2)))
        if lab:
            _t(ax, (a[0] + b[0]) / 2 + nx * 0.45 / k, (a[1] + b[1]) / 2 + ny * 0.45 / k, lab)
    for i in range(n):
        p, nxt, prv = P[i], P[(i + 1) % n], P[i - 1]
        u, v = _unit(p, nxt), _unit(p, prv)
        a2, a1 = math.degrees(math.atan2(u[1], u[0])), math.degrees(math.atan2(v[1], v[0]))
        ang = (a1 - a2) % 360 if ccw else (a2 - a1) % 360
        start = a2 if ccw else a1
        mid = math.radians(start + ang / 2)
        if abs(ang - 90) < 0.5:
            _mark(ax, p, u, v, 0.35 / k)
        lab = A[i].strip() if i < len(A) else ""
        if lab:
            if abs(ang - 90) >= 0.5:
                ax.add_patch(Arc(p, 1.1 / k, 1.1 / k, theta1=start, theta2=start + ang, lw=1.2))
            _t(ax, p[0] + math.cos(mid) * 1.05 / k, p[1] + math.sin(mid) * 1.05 / k, lab if lab == "?" else lab + "°", FS - 2)
            if lab == "?":
                notes.append("זווית %d = %s°" % (i + 1, round(ang, 1)))
            elif lab.replace(".", "").isdigit() and abs(float(lab) - ang) > 0.5:
                problems.append("זווית %d: כתוב %s, אבל בציור %s" % (i + 1, lab, round(ang, 1)))
        if i < len(o.get("letters", "")):
            _t(ax, p[0] - math.cos(mid) * 0.45 / k, p[1] - math.sin(mid) * 0.45 / k, o["letters"][i])
    for a, b, lab in dashes:
        ax.plot([a[0], b[0]], [a[1], b[1]], "k--", lw=1.2)
        if lab:
            _t(ax, (a[0] + b[0]) / 2 + 0.4 / k, (a[1] + b[1]) / 2, lab)
            _mark(ax, b, _unit(b, a), (1, 0) if b[0] < (x0 + x1) / 2 else (-1, 0), 0.3 / k)
    cap = None
    if unit in UNITS and (any(l.strip() for l in L) or any(d[2] for d in dashes)):
        cap = "המידות " + UNITS[unit] + "." + (" השרטוט מוקטן." if unit == "cm" and k < 0.999 else "")
    return fig, w, cap

def _height(top, foot, base_ends, lab):
    d = [(top, foot, lab)]
    far = min(base_ends, key=lambda q: abs(q[0] - foot[0]))
    if not min(e[0] for e in base_ends) <= foot[0] <= max(e[0] for e in base_ends):
        d.append((far, foot, ""))
    return d

def _draw(spec, notes, problems):
    t = spec.split()
    kind = t[0]
    o = dict(x.split("=", 1) for x in t[1:] if "=" in x)
    a = [x for x in t[1:] if "=" not in x]
    num = lambda v: re.fullmatch(r"-?[0-9.]+(/[0-9]+)?", v)
    f = [float(Fraction(x)) for x in a if num(x)]
    g = {k: float(Fraction(v)) for k, v in o.items() if num(v)}
    if kind in ("rect", "square"):
        W, H = (f[0], f[1]) if kind == "rect" else (f[0], f[0])
        L = [a[0], "", "", a[1] if kind == "rect" else ""]
        return _shape([(0, 0), (W, 0), (W, H), (0, H)], L, o, notes, problems)
    if kind == "triangle":
        if len(f) == 3:
            b, c, e = f
            x = (b * b + e * e - c * c) / (2 * b)
            if e * e - x * x <= 1e-9:
                raise ValueError("אין משולש עם הצלעות האלה")
            return _shape([(0, 0), (b, 0), (x, math.sqrt(e * e - x * x))], a[:3], o, notes, problems)
        if "height" in o:
            b, h = g["base"], g["height"]
            x = g.get("apex", b / 2)
            P = [(0, 0), (b, 0), (x, h)]
            return _shape(P, [o["base"], "", ""], o, notes, problems, _height(P[2], (x, 0), P[:2], o["height"]))
        A = o["angles"].split(",")
        known = [float(v) for v in A if v.strip() not in ("?", "")]
        if len(A) != 3 or len(known) < 2:
            raise ValueError("angles: צריך 3 זוויות, ולכל היותר אחת עם ?")
        full = [float(v) if v.strip() not in ("?", "") else 180 - sum(known) for v in A]
        if abs(sum(full) - 180) > 0.01 or min(full) <= 0:
            raise ValueError("סכום הזוויות במשולש חייב להיות 180")
        b = g.get("base", 6)
        al, be = math.radians(full[0]), math.radians(full[1])
        s = b * math.sin(be) / math.sin(al + be)
        return _shape([(0, 0), (b, 0), (s * math.cos(al), s * math.sin(al))], [o.get("base", ""), "", ""], o, notes, problems)
    if kind == "parallelogram":
        b, h, s = g["base"], g["height"], g.get("shift", g["height"] / 2)
        P = [(0, 0), (b, 0), (b + s, h), (s, h)]
        return _shape(P, [o["base"], "", "", ""], o, notes, problems, _height(P[3], (s, 0), P[:2], o["height"]))
    if kind == "trapezoid":
        b, top, h = g["bottom"], g["top"], g["height"]
        s = g.get("shift", (b - top) / 2)
        P = [(0, 0), (b, 0), (s + top, h), (s, h)]
        return _shape(P, [o["bottom"], "", o["top"], ""], o, notes, problems, _height(P[3], (s, 0), P[:2], o["height"]))
    if kind == "polygon":
        n, side = int(f[0]), f[1]
        r = side / (2 * math.sin(math.pi / n))
        P = [(r * math.cos(math.radians(-90 - 180 / n + 360 * i / n)), r * math.sin(math.radians(-90 - 180 / n + 360 * i / n))) for i in range(n)]
        return _shape(P, [a[1]] * n, o, notes, problems)
    if kind == "shape":
        P = [tuple(float(Fraction(v)) for v in p.split(",")) for p in a]
        return _shape(P, [_len(math.dist(P[i], P[(i + 1) % len(P)])) for i in range(len(P))], o, notes, problems)
    if kind == "circle":
        r = f[0]
        unit = o.get("unit", "cm")
        k = min(1 if unit == "cm" else 2.5 / r, 3 / r)
        fig, ax, w = _canvas(-r, -r, r, r, k)
        ax.add_patch(Circle((0, 0), r, fill=False, lw=1.8))
        ax.plot([0], [0], "ko", ms=4)
        if o.get("show") == "d":
            ax.plot([-r, r], [0, 0], "k-", lw=1.2)
            _t(ax, 0, 0.4 / k, _len(2 * r))
        else:
            ax.plot([0, r], [0, 0], "k-", lw=1.2)
            _t(ax, r / 2, 0.4 / k, a[0])
        if "letters" in o:
            _t(ax, -0.35 / k, -0.35 / k, o["letters"][0])
        cap = "המידות " + UNITS[unit] + "." + (" השרטוט מוקטן." if unit == "cm" and k < 0.999 else "") if unit in UNITS else None
        return fig, w, cap
    if kind in ("angle", "ray"):
        d = f[0] if kind == "angle" else 0
        r0 = math.radians(g.get("rot", 0))
        r1 = r0 + math.radians(d)
        P = [(6.5 * math.cos(r0), 6.5 * math.sin(r0)), (0, 0)] + ([(6.5 * math.cos(r1), 6.5 * math.sin(r1))] if kind == "angle" else [])
        fig, ax, w = _canvas(min(p[0] for p in P), min(p[1] for p in P), max(p[0] for p in P), max(p[1] for p in P), 1, 0.7)
        for p in P[::2]:
            ax.plot([0, p[0]], [0, p[1]], "k-", lw=1.8)
        ax.plot([0], [0], "ko", ms=4)
        if kind == "angle":
            if abs(d - 90) < 0.01:
                _mark(ax, (0, 0), (math.cos(r0), math.sin(r0)), (math.cos(r1), math.sin(r1)), 0.4)
            else:
                ax.add_patch(Arc((0, 0), 1.4, 1.4, theta1=math.degrees(r0), theta2=math.degrees(r1), lw=1.2))
            if "label" in a or "label" in o:
                m = (r0 + r1) / 2
                _t(ax, 1.3 * math.cos(m), 1.3 * math.sin(m), "%g°" % d if o.get("label") != "?" else "?", FS - 2)
        m = (r0 + r1) / 2 + math.pi
        for ch, p in zip(o.get("letters", ""), P):
            q = (p[0] * 1.06, p[1] * 1.06) if p != (0, 0) else (0.45 * math.cos(m), 0.45 * math.sin(m))
            _t(ax, q[0], q[1], ch)
        return fig, w, None
    if kind == "grid":
        c, r = int(f[0]), int(f[1])
        if c > 15 or r > 22:
            raise ValueError("grid: עד 15 עמודות ו-22 שורות")
        fig, ax, w = _canvas(0, 0, c, r, 1, 0.2)
        for i in range(c + 1):
            ax.plot([i, i], [0, r], color="0.55", lw=0.6)
        for j in range(r + 1):
            ax.plot([0, c], [j, j], color="0.55", lw=0.6)
        if "shape" in o:
            P = [tuple(float(v) for v in p.split(",")) for p in o["shape"].split(";")]
            ax.add_patch(Polygon(P, closed=True, fc="0.8", ec="black", lw=1.8))
        return fig, w, None
    if kind == "numberline":
        lo, hi, st = Fraction(a[0]), Fraction(a[1]), Fraction(o.get("step", "1"))
        n = (hi - lo) / st
        if n.denominator != 1 or not 1 <= n <= 40:
            raise ValueError("numberline: (סוף פחות התחלה) חלקי step צריך להיות מספר שלם עד 40")
        n = int(n)
        form = "frac" if "/" in o.get("step", "") else "dec"
        sp = min(1.5, 14 / n)
        vals = [lo + st * i for i in range(n + 1)]
        X = {v: i * sp for i, v in enumerate(vals)}
        fig, ax, w = _canvas(0, -1.2, n * sp, 1.6, 1, 0.5)
        ax.annotate("", xy=(n * sp + 0.45, 0), xytext=(-0.2, 0), arrowprops=dict(arrowstyle="-|>", lw=1.6, color="black"))
        def fmt(v):
            if form == "frac" and v.denominator != 1:
                d = st.denominator if (v * st.denominator).denominator == 1 else v.denominator
                wh, rest = divmod(abs(int(v * d)), d)
                return "$" + ("-" if v < 0 else "") + (str(wh) if wh else "") + r"\dfrac{%d}{%d}$" % (rest, d)
            s = "{:,}".format(int(v)) if v.denominator == 1 and abs(v) >= 10000 else "%g" % float(v)
            return s.replace("-", "−")
        lab = o.get("labels", "all" if n <= 20 else "five")
        show = set(vals) if lab == "all" else {lo, hi} if lab == "ends" else set() if lab == "none" else {v for i, v in enumerate(vals) if i % 5 == 0} if lab == "five" else {Fraction(v) for v in lab.split(",")}
        blank = {Fraction(v) for v in o.get("blank", "").split(",") if v}
        for v in vals:
            ax.plot([X[v], X[v]], [-0.15, 0.15], "k-", lw=1.4)
            if v in blank:
                ax.add_patch(Rectangle((X[v] - 0.35, -1.05), 0.7, 0.65, fill=False, lw=1.2))
            elif v in show:
                _t(ax, X[v], -0.6, fmt(v), FS - 1 if sp >= 0.9 else FS - 4)
        for p in o.get("points", "").split(","):
            if p:
                ch, v = p.split(":")
                if ((Fraction(v) - lo) / st).denominator != 1:
                    problems.append("points: הנקודה %s לא על שנתה. בחר step שהנקודה עליו" % p)
                x = X[lo] + float((Fraction(v) - lo) / st) * sp
                ax.plot([x], [0], "ko", ms=6)
                _t(ax, x, 0.55, ch)
        for j in o.get("jumps", "").split(","):
            if j:
                p, q = (Fraction(v) for v in j.split(":"))
                x1, x2 = X[lo] + float((p - lo) / st) * sp, X[lo] + float((q - lo) / st) * sp
                ax.add_patch(Arc(((x1 + x2) / 2, 0.15), abs(x2 - x1), min(1.6, abs(x2 - x1)), theta1=0, theta2=180, lw=1.3))
                ax.annotate("", xy=(x2, 0.17), xytext=(x2 - (0.05 if x2 > x1 else -0.05), 0.35), arrowprops=dict(arrowstyle="-|>", lw=1.2, color="black"))
                s = fmt(abs(q - p))
                s = "$" + ("+" if q > p else "-") + s[1:] if s[:1] == "$" else ("+" if q > p else "−") + s
                _t(ax, (x1 + x2) / 2, 0.15 + min(0.8, abs(x2 - x1) / 2) + 0.3, s, FS - 2)
        return fig, w, None
    if kind == "clock":
        fig, ax, w = _canvas(-2.6, -2.6, 2.6, 2.6, 1, 0.3)
        ax.add_patch(Circle((0, 0), 2.5, fill=False, lw=2))
        for i in range(60):
            q = math.radians(90 - 6 * i)
            r1 = 2.2 if i % 5 == 0 else 2.35
            ax.plot([r1 * math.cos(q), 2.5 * math.cos(q)], [r1 * math.sin(q), 2.5 * math.sin(q)], "k-", lw=1.5 if i % 5 == 0 else 0.7)
        for i in range(1, 13):
            q = math.radians(90 - 30 * i)
            _t(ax, 1.8 * math.cos(q), 1.8 * math.sin(q), str(i), FS - 1)
        if o.get("hands") != "no":
            hh, mm = (int(x) for x in a[0].split(":"))
            for ang, ln, lw in ((90 - 30 * (hh % 12 + mm / 60), 1.0, 4.5), (90 - 6 * mm, 1.55, 2.2)):
                ax.plot([0, ln * math.cos(math.radians(ang))], [0, ln * math.sin(math.radians(ang))], "k-", lw=lw, solid_capstyle="round")
        ax.plot([0], [0], "ko", ms=6)
        return fig, w, None
    if kind == "fraction":
        num, den = int(f[0]), int(f[1])
        wholes = max(1, -(-num // den))
        if o.get("shape") == "rect":
            fig, ax, w = _canvas(0, 0, 8, 1.6 * wholes - 0.4, 1, 0.2)
            for k in range(wholes):
                for i in range(den):
                    ax.add_patch(Rectangle((8 * i / den, 1.6 * (wholes - 1 - k)), 8 / den, 1.2, fc="0.6" if k * den + i < num else "white", ec="black", lw=1.4))
        else:
            fig, ax, w = _canvas(0, 0, 4 * wholes - 0.6, 3.4, 1, 0.2)
            for k in range(wholes):
                for i in range(den):
                    ax.add_patch(Wedge((1.7 + 4 * k, 1.7), 1.7, 90 - 360 * (i + 1) / den, 90 - 360 * i / den, fc="0.6" if k * den + i < num else "white", ec="black", lw=1.4))
        return fig, w, None
    raise ValueError("סוג ציור לא מוכר: " + kind)

def _figure(doc, spec, problems):
    notes = []
    try:
        fig, w, cap = _draw(spec, notes, problems)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=200)
        plt.close(fig)
        buf.seek(0)
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(buf, width=Cm(w))
        if cap:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _text(p, cap, problems)
    except Exception as e:
        plt.close("all")
        problems.append("ציור לא תקין: [draw %s] | %s" % (spec, e))
        notes.append("שגיאה")
        p = doc.add_paragraph()
    print("ציור:", spec, "|", "; ".join(notes) or "תקין")
    return p
```

הקוד קובע גופן Arial גדול (14) לכל הטקסט, כיוון מימין לשמאל, ועמוד חדש לפני "מפתח תשובות", "דף 2" ו"דף 3". הוא מדפיס בעיה אם נשאר קוד גלוי (`$` או `\`), אם יש עברית בתוך תרגיל, אם יש פקודה שהוא לא מכיר, או אם אין מפתח תשובות.

## ההודעה למורה אחרי הקובץ

כתוב שורה אחת שמציגה את הקובץ (כיתה, נושא, מספר שאלות, ואם יש 3 דפים). אחריה את 2 השורות האלה, בלי הסברים נוספים:

1. לעבודה ב-Google Docs: מעלים את הקובץ ל-Drive, פותחים אותו, ובוחרים קובץ ← שמירה כ-Google Docs. התרגילים יישארו ניתנים לעריכה.
2. כדאי לפתור שאלה אחת מהדף לפני ההדפסה, ולבדוק שהמספרים מתאימים לכיתה.

רק אם יש בדף מדידה בסרגל או במד זווית, הוסף שורה שלישית: "3. כדי שהמדידה תצא נכונה, מדפיסים בגודל אמיתי (100%), בלי 'התאמה לעמוד'."

## טעויות שכבר קרו

- סימן + או − שקפץ לצד השני של המספר, בטבלה בדף מימין לשמאל. לכן תרגילים רק בתוך `$$`.
- רשימת תשובות במפתח שהסדר שלה התהפך. לכן כמה תשובות נכתבות בתוך `$...$`.
- הסימנים > ו-< בתוך משפט בעברית, שהוצגו הפוך לילדים בכיתה א'.
- חידה עם 3 תשובות נכונות, כשבמפתח הייתה רק אחת.
- "מצאו את הטעות" שבה ההסבר במפתח לא התאים לתוצאה השגויה שבדף.
- בסביבת קוד בלי pandoc, בנייה עם pandoc נכשלה, וג'מיני כתב קובץ בדרך אחרת עם תרגילים שבורים. לכן רק `build`.
