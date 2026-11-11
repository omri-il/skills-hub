# מה ידוע על Gemini Skills

נכון ל-2026-11-09. התחום משתנה מהר, אז כל עובדה כאן מסומנת לפי המקור שלה. לפני שמסתמכים על מספר או תאריך, כדאי לבדוק שוב את עמודי העזרה של Google.

סימון המקורות: **[G]** עמוד רשמי של Google · **[צד ג']** כתבה או בלוג, לא מאומת · **[נבדק]** ראינו בפועל בחשבון של עומרי · **[לא ידוע]** אין מקור, צריך בדיקה.

## מה זה סקיל

הוראות שמורות שמלמדות את Gemini משימה אחת, בקובץ `SKILL.md` ועוד קובצי עזר אם צריך. Google מגדירה את זה כ"דף עזר, לא מדריך": קצר, ומיועד לסוג של משימה ולא לתוצאה אחת. [G]

## "סקיל" הוא ארבעה מוצרים שונים

| מוצר | למי | איך יוצרים | הערה |
|---|---|---|---|
| **אפליקציית Gemini** | חשבון אישי מגיל 18, ובפועל גם חשבון בית ספר | בעמוד Skills, או העלאת `SKILL.md` | **זה מה שהאתר הזה משרת** |
| **Gemini ב-Workspace** | עובדים ב-Workspace | ב-Workspace Studio | בטא, כבוי כברירת מחדל גם ב-Education [צד ג'] |
| **Gemini Enterprise** | ארגונים | בעמוד Skills שם, העלאת md או zip | עד 100 MB ו-100 קבצים [G] |
| **Gemini CLI ודומיו** | מפתחים | תיקייה עם `SKILL.md` | אותו פורמט פתוח |

הסקילים לא מסתנכרנים בין המוצרים [צד ג']. מעבירים אותם בהורדה והעלאה של `SKILL.md`. [G]

## זמינות באפליקציית Gemini

- חשבון Google אישי, גיל 18 ומעלה, ו-Keep Activity פעיל. לא צריך מנוי בתשלום. [G]
- **חשבון בית ספר:** עמודי העזרה של Google עדיין כותבים "בקרוב" [G], אבל בסדנאות של עומרי ב-15.10.2026 וב-19.10.2026 הוצגו בניית סקילים, הפעלה והעלאה מ-ZIP בחשבון הארגוני [נבדק]. מה שנראה בפועל גובר על עמוד העזרה.
- עובד בווב, באפליקציית Mac ובמובייל. **העלאה מקובץ רק בווב וב-Mac.** [G]
- אפשר ליצור כמה שרוצים, אבל רק 100 פעילים בו זמנית. [G]

## Gems עוברים לסקילים

| מי | מתי |
|---|---|
| חשבון אישי, גיל 18 ומעלה | **17.11.2026** Gems לקריאה בלבד · **17.12.2026** Gems נמחקים |
| חשבון אישי, מתחת לגיל 18 | "במועד מאוחר יותר" |
| Workspace עסקי או ארגוני | מרץ 2027 |
| **Workspace for Education** | **יוני 2027** |

ההמרה אוטומטית, ולא עוברים בה קובצי GitHub, אודיו, וידאו, ‎.doc/.xls/.ppt וארכיונים. [G]

## הפורמט והמגבלות

- `name`: אותיות קטנות באנגלית ומקפים. Google ממליצה להתחיל בפועל. שם התיקייה זהה לשם הסקיל. [G]
- `description`: עד 1024 תווים, משפט או שניים, בגוף שלישי, עם דוגמאות מתי להשתמש ("Use when…"). [G]
- `SKILL.md` בתיקייה הראשית. משקל כולל עד 100 MB. לעדכון קבצים מעלים את כל הסקיל מחדש. [G]
- קובצי עזר נתמכים, בין היתר: `.md .txt .pdf .docx .csv .xlsx .pptx .json .yaml .html .js .py .sh` ותמונות. לא נתמכים: `.doc .xls .ppt`, אודיו, וידאו, ארכיונים, `.ts .jsx .sql`. [G]
- **אצלנו:** האתר אורז רק את `SKILL.md`, אז כל סקיל חייב להיות קובץ אחד, למרות ש-Google מאפשרת יותר (ראו `CLAUDE.md`).

## איך סקיל מופעל

- ידנית: `/` (ובקרוב `@`) ואז בוחרים את הסקיל. [G]
- אוטומטית: Gemini קורא רק את השם והתיאור כדי להחליט, ורק אחר כך את ההוראות, ואת קובצי העזר רק כשצריך. [G]
- אפשר לשלב כמה סקילים, וסקיל יכול להפנות לסקיל אחר. [G]

## מה עובד בתוך סקיל ומה לא

- **עובד:** Connected Apps, כמו Gmail, Docs ו-Calendar. [G]
- **לא עובד:** Canvas, Deep Research, Guided Learning, יצירת וידאו ומוזיקה. [G]
- **סקריפטים:** אפשר לצרף, אבל "סקריפטים שדורשים אינטרנט לא נתמכים" ואי אפשר לפעול מולם באתרים חיצוניים. [G] Google לא כותבת אם ובאיזו סביבה הם רצים. [לא ידוע]
- בקשה למצגת עברה ל-Canvas ודילגה על הסקיל, גם כשהבקשה נקבה בשמו (Flash ו-Pro, 2026-11-07). [נבדק]
- סקיל לא מתואר בשום עמוד של Google כמי שיוצר קובץ Forms, Sheets, Slides או Docs ישירות. [לא ידוע]

## סקילים ו-Apps Script

**לא מצאתי דרך רשמית שסקיל באפליקציית Gemini יריץ Apps Script.** אף עמוד רשמי של Skills לא מזכיר את זה. לכן המסלול הוא: **הסקיל כותב קוד, והמורה מדביק ומריץ.**

זה מסלול טוב למורים, כי:

1. הוא לא תלוי ב-Canvas, שלא עובד עם סקילים.
2. הוא יוצר קובץ Google אמיתי, בלי כפתור הייצוא שהופך את העברית.
3. הקוד יכול לשלוט בדברים שקשה לבקש מצ'אט: ניקוד, משוב לכל תשובה, מדורים.
4. ה-Playbook שלך כבר מלמד אותו: AU-130, PR-160 ואבן הבניין "אוטומציות ב-Apps Script".
5. הקוד רץ בחשבון שבו מדביקים אותו, והקובץ שנוצר נשאר שם. בחשבון בית ספר המנהל יכול לחסום את Apps Script, וזה משתנה מבית ספר לבית ספר.

מסלולים אחרים שנבדקו ונפסלו:

- Gemini Spark דרך MCP או webhook: בלוג אחד, ודורש פרסום web app פתוח לכולם. לא מתאים למורים. [צד ג']
- Gemini בתוך עורך Apps Script: קיים לפי כתבות מ-2026, מועיל לתיקון שגיאות אבל לא מחליף סקיל. [צד ג']
- מאגרים ציבוריים: `google-gemini/gemini-skills` ו-`google/skills` מיועדים למפתחים (Gemini API ו-Cloud). סקיל Apps Script הקהילתי של `henkisdabro` מיועד למפתחים, ואת תוכנו לא הצלחתי לקרוא. לא מצאתי סקיל Apps Script למורים.

## עובדות Apps Script שקובעות איך כותבים את הסקילים

| שירות | מימין לשמאל | עוד דברים חשובים |
|---|---|---|
| **Forms** | **אין שום פקודת כיוון.** מה שקורה לעברית אצל התלמיד: [לא ידוע], המקורות סותרים | `setIsQuiz`, `createChoice(text, isCorrect)`, `setPoints`, `setFeedbackForCorrect/Incorrect`, `addPageBreakItem` |
| **Docs** | `setLeftToRight(false)` על פסקה ופריט רשימה | **אין פקודה לכיוון טבלה.** צריך לכתוב את העמודות בסדר הפוך |
| **Sheets** | `sheet.setRightToLeft(true)` | |
| **Slides** | `setTextDirection(RIGHT_TO_LEFT)` | כבר בשימוש ב-`fix-slides-rtl`, עוד לא נבדק על מצגת אמיתית |

- **פרסום טופס:** ב-Forms API, טפסים שנוצרו אחרי 30.6.2026 מתחילים לא מפורסמים ולא מקבלים תשובות. עמודי Apps Script לא מיישבים אם זה חל גם על `FormApp.create(title)`. לכן תמיד `FormApp.create(title, true)` ואז בדיקת `form.isPublished()`. [G]
- `setRequireLogin` מסומן כ-deprecated. לא להשתמש. [G]
- **מכסות לחשבון אישי:** ריצה עד 6 דקות, 250 מסמכים, גיליונות או מצגות ליום, 50 פרויקטים ליום, 100 נמענים למייל ליום. ב-Workspace: 1,500 מסמכים או מצגות, 3,200 גיליונות, 1,500 נמענים. [G]
- מכסה ליצירת טפסים לא מופיעה בטבלה. [לא ידוע]

## כללי כתיבה לסקיל שמייצר Apps Script

ההמלצות של Google [G]: תיאור ספציפי, הוראות קצרות, תבנית פלט, סעיף "טעויות נפוצות", ולומר מה עושים כשחסר מידע.

מסקנות שלי, עדיין לא נבדקו:

- **מנוע קבוע ונתונים משתנים.** Gemini ממלא רק אובייקט `DATA` בראש הקוד ולא נוגע בפונקציות. פחות קוד שנכתב מחדש הוא פחות שגיאות.
- **גרשיים בעברית שוברים קוד.** ד"ר או תשפ"ו בתוך מחרוזת JavaScript מפילים את הסקריפט. הסקיל צריך לחייב `\"` או את התו `״`.
- קוד אחד מלא בבלוק אחד, ואחריו צעדים קבועים למורה. בלי Canvas.
- הקישור לקובץ שנוצר מודפס ביומן (`Logger.log`), עם קישור עריכה וקישור לתלמידים.
- אין שמות תלמידים בקוד או בצ'אט: הגיליון נוצר ריק, והמורה ממלא בעצמו.
- בשגיאה: מדביקים את השורה האדומה בצ'אט ומקבלים קוד מלא מתוקן (PR-160).

## מקורות

רשמיים:
- [Create and manage skills](https://support.google.com/gemini/answer/17094296?hl=en&co=GENIE.Platform%3DDesktop)
- [The transition from Gems to skills](https://support.google.com/gemini/answer/18560919?hl=en)
- [Write effective skills](https://support.google.com/gemini/answer/17102773?hl=en)
- [AI skills 101 handbook](https://services.google.com/fh/files/misc/skills_in_gemini_101_handbook_v4.pdf)
- [Skills in Gemini Enterprise](https://docs.cloud.google.com/gemini/enterprise/docs/skills)
- [Apps Script: Form](https://developers.google.com/apps-script/reference/forms/form) · [FormApp](https://developers.google.com/apps-script/reference/forms/form-app) · [Paragraph](https://developers.google.com/apps-script/reference/document/paragraph) · [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet) · [TextDirection](https://developers.google.com/apps-script/reference/slides/text-direction) · [Quotas](https://developers.google.com/apps-script/guides/services/quotas)
- [Forms API changes](https://developers.google.com/workspace/forms/api/guides/api-changes-to-google-forms)

צד ג':
- [Xenospectrum](https://xenospectrum.com/en/google-gemini-skills-gems-migration/) · [Incrypted](https://incrypted.com/en/how-create-skills-gemini/) · [Lead with AI: Workspace Studio](https://www.leadwithai.co/article/google-workspace-studio-skills-are-live-what-you-need-to-know)
- [Gemini Spark ו-Apps Script](https://medium.com/google-cloud/unlocking-infinite-automation-integrating-google-apps-script-with-gemini-spark-9b5407e4286c) · [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills) · [RTL ב-Forms](https://blog.addxt.com/align-text-right-to-left-in-google-forms-for-rtl-languages-hebrew-arabic)
