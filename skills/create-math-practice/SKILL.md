---
name: create-math-practice
description: יוצר דפי עבודה, דפי תרגול, בחנים וחומרי עזר במתמטיקה בעברית, מדורגים לפי רמת הכיתה, עם מקום לפתרון ומפתח תשובות מלא. השתמש כאשר מורה מבקש דף עבודה, תרגול, שאלות, בוחן, מבחן, שיעורי בית או דף חזרה במתמטיקה, למשל על משוואות, משוואות ריבועיות, פונקציות, אלגברה, גאומטריה, טריגונומטריה, הסתברות, סדרות או חשבון דיפרנציאלי, בחטיבת הביניים ובתיכון, כיתות ז' עד י"ב (3, 4 או 5 יחידות). מצייר בקובץ גרפים של פונקציות על מערכת צירים, נקודות וצורות על הצירים, משולשים לפי מידות ושרטוטים להוכחה, והציור תמיד מתאים לנתונים. לבית הספר היסודי (כיתות א' עד ו') השתמש בסקיל create-elementary-math-practice.
---

# יצירת חומרי תרגול במתמטיקה

## חובה: התוצר הוא קובץ Word

- **אל תכתוב את דף העבודה בתשובה בצ'אט.** צור אותו כקובץ Word ‏(‎.docx) להורדה, גם אם המורה לא ביקש קובץ.
- **בצ'אט, אחרי הקובץ:** שורה אחת שמציגה את הקובץ, ואת שתי שורות ההוראה למורה מהסקיל format-equations-for-hebrew-worksheets. זה הכול: בלי טבלת בדיקה, בלי קוד LaTeX, ובלי שם של תלמיד.
- **בנה את הקובץ לפי "שלבי העבודה" בסקיל format-equations-for-hebrew-worksheets:** Markdown עם `$...$` ← pandoc בסביבת הקוד ← פונקציית `build` שבסקיל. pandoc מותקן בסביבת הקוד, והקוד רץ אצלך כרגיל. אל תבנה את הקובץ ידנית ב-python-docx.
- **הרצת קוד אחת, בסדר הזה, תמיד, גם בדף בלי ציור:**
  1. הקוד של `build` מהסקיל format-equations-for-hebrew-worksheets.
  2. הקוד של `check` מהסקיל verify-solutions, ו-`check(...)` לכל שאלה ולכל סעיף. ראה "בדיקה" למטה.
  3. "קוד הציורים" שבסוף הסקיל הזה, תו בתו.
  4. `build_figures(md, "<שם-באנגלית>.docx")`, במקום `build`. היא בודקת שכל שאלה עברה `check`, קוראת ל-`build`, ושמה כל ציור במקום שלו. **בלי בדיקה לכל שאלה, או כשבדיקה נכשלה, היא לא יוצרת קובץ.**
- **אם הקוד הדפיס בעיות:** תקן את ה-Markdown או את המפתח, והרץ שוב. אם הקוד נכשל, תקן והרץ שוב. אף פעם לא מוסרים קובץ עם בעיה, ואף פעם לא מדביקים את הדף בצ'אט במקום קובץ.
- בתוך הקובץ, כל ביטוי מתמטי הוא משוואת Word מובנית: שבר אמיתי, שורש אמיתי, חזקה ואינדקס. אסור להשאיר קוד LaTeX גלוי, כמו `$a_1$`.
- משוואה ארוכה (שבר, שורש, אינטגרל) כתוב בשורה משלה: `$$...$$`. `build` מסדר לבד משוואה שנשארה בתוך משפט: משוואה קצרה הופכת לטקסט רגיל במקומה, ומשוואה ארוכה עוברת לשורה משלה.
- כל סעיף (א., ב., ג.) בשורה משלו. גם את זה `build` מסדר לבד.
- את שאר כללי העיצוב קח מהסקיל format-equations-for-hebrew-worksheets.

## לפני שמתחילים

צריך לדעת שלושה דברים: **כיתה** (או רמת יחידות), **נושא**, ו**מספר שאלות**.

- **כיתות א' עד ו': אל תבנה דף בסקיל הזה.** אם הסקיל create-elementary-math-practice מותקן, עבוד לפיו. אם לא, כתוב שורה אחת: "לכיתות א'-ו' יש סקיל משלו: create-elementary-math-practice. כדאי להתקין אותו." ושאל אם לבנות בכל זאת.
- **שמות של תלמידים:** שם של תלמיד מהבקשה (למשל "יוסי מתקשה בשברים") לא נכנס לקובץ ולא חוזר בצ'אט. בדף לכיתה כותבים שאלות בלי שמות, או עם שם בדוי כללי.
- **טבלה או רשימה של תלמידים** (ציונים, טעויות, תוצאות): אף שם פרטי ממנה לא כתוב בתשובה שלך. לא בסיכום, לא בהסבר מה בנית ולא בשאלה למורה. כתוב "3 תלמידים", "התלמיד בשורה 2" או "חלק מהכיתה". בבדיקות קודמות Gemini חזר על שמות מהטבלה בצ'אט, וזו טעות.
- **"האם תלמיד כתב את זה עם AI?":** אי אפשר לדעת את זה מהטקסט. כתוב את זה בשורה אחת, בלי ניחוש, והמשך במשימה.
- אם הכיתה או הנושא חסרים, שאל עליהם בשאלה אחת קצרה ואל תנחש.
- אם רק מספר השאלות חסר, קבע 6 שאלות.
- אם המורה ביקש דיפרנציאציה, צור שתי גרסאות (בסיס ומתקדם) באותו קובץ, כל אחת בעמוד משלה.

## מבנה הדף

1. כותרת: הנושא והכיתה.
2. שורה למילוי: שם, כיתה, תאריך.
3. הוראה כללית קצרה, משפט אחד.
4. שאלות ממוספרות, **מדורגות מהקל לקשה**:
   - כשליש שאלות בסיס (הפעלה ישירה של כלל)
   - כשליש שאלות ביניים (שני שלבים או יותר)
   - כשליש שאלות העמקה (שאלה מילולית, הכללה או הסבר)
5. מתחת לכל שאלה: שלוש-ארבע שורות ריקות לפתרון.
6. **מפתח תשובות** בעמוד נפרד: פתרון מלא שלב אחר שלב, לא רק תשובה סופית.

## בחירת מספרים

- בחר מקדמים שנותנים תשובות "נקיות" (שלמים או שברים פשוטים), אלא אם המטרה היא תרגול עם תשובות לא שלמות.
- במשוואה ריבועית: בדוק מראש את סימן הדיסקרימיננטה, וכלול בכוונה מקרה של שני פתרונות, פתרון אחד ואין פתרון, אם זה מתאים לנושא.
- אל תחזור על אותה שאלה עם מספרים אחרים יותר מפעמיים.

## מוסכמות בעברית

- מונחים כפי שמלמדים בבתי ספר בישראל: נוסחת השורשים, דיסקרימיננטה (או "דלתא"), נקודות חיתוך עם הצירים, שיפוע, תחום הגדרה.
- נקודה עשרונית ולא פסיק.
- ניסוח שאלות בלשון רבים ("פתרו", "מצאו", "הסבירו").

## עיצוב

השתמש בסקיל **format-equations-for-hebrew-worksheets** לכל העיצוב והמשוואות. הוא קובע את פורמט הקובץ, את בניית המשוואות ואת מיקומן. אל תעקוף את הכללים שלו.

## ציורים

הקוד מצייר גרפים על מערכת צירים, נקודות וצורות על הצירים, משולשים לפי מידות ושרטוטים להוכחה. כל ציור הוא שורה אחת בפסקה משלה: `[draw ...]`, עם שורה ריקה לפניה ואחריה. הקוד מצייר בדיוק לפי מה שכתוב בשורה, ובודק שכל מספר בציור מתאים לאורך או לזווית האמיתיים.

**מתי לצייר:** בכל שאלה שהתלמיד צריך בה לקרוא מגרף, לראות שרטוט של הוכחה, או לעבוד עם משולש שיש לו נתונים. בדף על פונקציות, גאומטריה, טריגונומטריה במשולש, גאומטריה אנליטית או אינטגרלים, רוב השאלות כוללות ציור. בדף על נושא אחר (משוואות, סדרות, הסתברות), צייר רק כשהציור עוזר.

- ההוראה בעברית כתובה במשפט **לפני** הציור. בתוך הציור יש רק אותיות לטיניות, מספרים וסימנים. אף פעם לא עברית בתוך `[draw ...]`.
- `[draw ...]` אף פעם לא בתוך משפט ולא בתוך `$`. במפתח התשובות מותר ציור, למשל הגרף שהתלמיד היה צריך לשרטט.
- החלקים בשורה מופרדים ברווח, ובתוך כל חלק אין רווח: `fn=f:x^2-4x+3`, לא `fn=f: x^2 - 4x + 3`.
- **הציור לא מגלה את התשובה.** ערך שהתלמיד מחשב הוא `?` או לא כתוב בציור: צלע, זווית, שטח. בשאלה "שרטטו את הגרף", הגרף נמצא רק במפתח. נקודה שהתלמיד מחשב מותר לסמן באות בסקיצה, כמו בספר.
- **בשאלת הוכחה מסמנים בציור רק את מה שכתוב ב"נתון".** אף פעם לא את מה שצריך להוכיח, ולא מסקנה בדרך. למשל: אם צריך להוכיח ש-AD גובה, אין `right=` ב-D. אם נתון רק ש-AD חוצה זווית, אין `eq=` על BD ו-DC.
- כל אות בציור מופיעה גם בטקסט של השאלה. כל נתון בציור כתוב גם בשאלה. כל נתון מספרי בשאלה שקשור לשרטוט (אורך, זווית) כתוב גם בציור, עם `len=` או `ang=`, כדי שהקוד יבדוק שהשרטוט מתאים לו.
- שם של נקודה, קטע או זווית בתוך משפט בעברית: שם אחד בכל משפט ("מצאו את אורך הקטע BC."). כמה שמות יחד כותבים בתוך `$...$`, למשל `הוכיחו: $AB = AC$`. רשימה כמו "A, B ו-C" מתבלגנת בדף מימין לשמאל.
- **הכללים בסקיל הם הוראות בשבילך. אף מילה מהם לא נכתבת בדף.** למשל לא "נתונה הפונקציה בסוף המשפט:", אלא "נתונה הפונקציה:".
- הקוד מדפיס שורת "ציור:" לכל ציור, עם הערכים האמיתיים: נקודות חיתוך, שטח, אורך של כל `?`. בדוק שהמפתח אומר אותו דבר.
- דיפרנציאציה: אותו סוג ציור באותה שאלה בשתי הגרסאות.

### גרף ומערכת צירים: `[draw axes ...]`

`[draw axes x=-1,5 y=-2,6 fn=f:x^2-4x+3 points=A:1,0;B:3,0]`

- `x=-1,5 y=-2,6` התחום של כל ציר. בחר תחום שמראה את מה שחשוב: חיתוכים, קודקוד, אסימפטוטות. כל נקודה חייבת להיות בתוכו.
- `fn=f:x^2-4x+3` פונקציה עם שם. כמה פונקציות: `fn=f:x^2;g:2x+1`. כותבים: `^` לחזקה, `sqrt(x)`, `sin(x)`, `cos(x)`, `tan(x)`, `ln(x)`, `log(x,2)`, `e^x`, `abs(x)`, `pi`. כל פונקציה מקבלת קו אחר (רציף, מקווקו), כי מדפיסים בשחור-לבן.
- `points=A:1,0;B:3,0` נקודות עם אות. נקודה על הגרף: `C:2,f(2)`. בציור כתובה רק האות, אף פעם לא השיעורים. שיעורים נתונים כותבים בטקסט של השאלה.
- `seg=AB,BC` קטעים בין נקודות. `seg=ABCA` מסלול שלם, למשל משולש. `dash=` קטע מקווקו. `fill=ABC` צביעה באפור.
- `circle=M:3` מעגל עם מרכז M (נקודה מ-`points`) ורדיוס 3. `circle=M:A` מעגל שעובר דרך A.
- `vline=2` ו-`hline=1` קו מקווקו, למשל אסימפטוטה. כמה קווים: `vline=-1,2`.
- `area=f:g:1,3` צובע את השטח בין f ל-g, מ-x=1 עד x=3. `area=f:0:0,2` השטח בין f לציר x.
- **סקיצה או רשת:** בלי הגדרה, הציור הוא סקיצה כמו בספר: צירים, גרף ואותיות, בלי רשת ובלי מספרים על הצירים. כך התלמיד לא קורא מהציור את מה שהוא צריך לחשב. `grid=yes` מוסיף רשת ומספרים, רק בשאלה שבה התלמיד קורא מהגרף או משרטט על רשת. `nums=yes` מספרים בלי רשת.
- `xstep=pi/2` שנתות של π/2, לגרף טריגונומטרי. `xstep=` ו-`ystep=` קובעים מרווח אחר. `scale=free` כשציר y ארוך בהרבה מציר x.
- אפשר להוסיף גם `eq=`, `right=`, `ang=` ו-`len=`, כמו בשרטוט להוכחה.

### משולש לפי מידות: `[draw triangle ...]`

`[draw triangle AB=6 AC=8 A=60 ask=BC]`

- הקודקודים תמיד A, B ו-C. הנתונים: 3 צלעות, 2 צלעות וזווית, או צלע ו-2 זוויות. אם אין משולש כזה, או שיש 2 משולשים כאלה, הקוד מדפיס בעיה.
- כל נתון כתוב בציור. זווית של 90 מקבלת סימן של זווית ישרה.
- `ask=BC,C` כותב `?` ליד הצלע BC וליד הזווית C.
- `hide=AB` נתון שבונה את הצורה, אבל לא כתוב בציור.
- אפשר להוסיף נקודות וסימנים כמו בשרטוט להוכחה: `H=foot:C:AB dash=CH right=CHB`.

### שרטוט להוכחה: `[draw geo ...]`

`[draw geo A=0,0 B=8,0 C=3,5 D=mid:AB seg=ABCA,CD eq=AD,DB]`

- נקודות לפי שיעורים: `A=0,0 B=8,0 C=3,5`. בחר שיעורים שמתאימים לנתון: משולש שווה שוקיים אמיתי, מקבילית אמיתית, זווית ישרה אמיתית. הקוד בודק את זה.
- **אל תריץ קוד נפרד כדי לחשב שיעורים.** בחר שיעורים פשוטים (שלמים), ותן לקוד לחשב את השאר: `mid`, `foot`, `cross`, `on`, `polar`, או `triangle` כשיש מידות. הקוד מדפיס בעיה אם השרטוט לא מתאים לסימנים, ואז מתקנים ומריצים שוב. משולש שווה שוקיים: `A=0,4 B=-3,0 C=3,0`. מקבילית: `A=0,0 B=6,0 C=8,3 D=2,3`. מלבן: `A=0,0 B=6,0 C=6,4 D=0,4`.
- נקודות שהקוד מחשב: `D=mid:AB` אמצע קטע. `H=foot:C:AB` עקב הגובה מ-C לישר AB. `E=cross:AC:BD` נקודת החיתוך של 2 ישרים. `P=on:AB:1/3` נקודה על AB, שליש מהדרך מ-A. `P=polar:O:3:40` נקודה במרחק 3 מ-O, בזווית 40°, למשל על מעגל.
- קווים: `seg=` ו-`dash=` כמו במערכת צירים. `circle=O:3` מעגל עם מרכז O ורדיוס 3. `circle=O:A` מעגל עם מרכז O שעובר דרך A.
- סימנים:
  - `eq=AD,DB;AE,EC` קטעים שווים. כל קבוצה מופרדת ב-`;` ומקבלת מספר קווקווים אחר. הקוד בודק שהקטעים באמת שווים.
  - `right=CHB` סימן של זווית ישרה, עם הקודקוד באמצע (H). הקוד בודק שהזווית 90°.
  - `eqang=BAD,DAC` זוויות שוות, עם קשת. קבוצות מופרדות ב-`;`.
  - `ang=BAC:40,ACB:?,ABC:α` כתוב ליד זווית. מספר חייב להיות הזווית האמיתית.
  - `len=AB:6,CD:x+2,BC:?` כתוב ליד קטע. מספר חייב להיות האורך האמיתי. במשולש עם מספרים, נוח יותר להשתמש ב-`triangle`.
  - `hide=O` נקודה בלי אות.

## בדיקה

לפני יצירת הקובץ, הפעל את הסקיל **verify-solutions** על כל השאלות ועל מפתח התשובות, **בקוד, עם `check()`**, באותה הרצה שבונה את הקובץ:

- לכל שאלה ולכל סעיף: `check("<מספר>", <התשובה במפתח>, <מה ש-sympy חישב מהנתונים>)`.
- שאלה שמבקשת "את כל" הפתרונות, נקודות החיתוך, נקודות הקיצון או נקודות הפיתול: רשימה מלאה מול `solutions`, `extrema` או `inflections`. בבדיקה קודמת חסרה במפתח נקודת פיתול אחת מתוך 2.
- שאלת הוכחה: `check` לכל שוויון של זוויות או קטעים שכתוב במפתח, עם `angle` ו-`dist` על הנקודות של `[draw geo ...]`. בבדיקה קודמת ההוכחה במפתח נשענה על זווית לא נכונה.
- `build_figures` לא יוצרת קובץ בלי `check` לכל שאלה, או כשבדיקה נכשלה. אל תכתוב בצ'אט שהתשובות נבדקו: הבדיקה נמצאת בפלט של הקוד.

**בדיקת הציורים, לפני הרצת הקוד:** עבור על כל שורת `[draw ...]` מול השאלה שלה:

1. לכל סימן (`right=`, `eq=`, `eqang=`, `ang=`, `len=`): מצא את המשפט ב"נתון" שאומר אותו. אם אין משפט כזה, או שהשאלה מבקשת להוכיח או למצוא אותו, מחק את הסימן.
2. לכל אות בציור: מצא אותה בטקסט של השאלה. אם היא לא שם, הוסף אותה לשאלה או מחק אותה מהציור.
3. לכל ערך שהתלמיד מחשב: ודא שהוא `?` או לא כתוב.
4. `grid=yes` רק בשאלה שבה התלמיד קורא מהגרף או משרטט על רשת.

## טעויות נפוצות

- תשובה במפתח שלא מתאימה לשאלה אחרי שינוי מספרים.
- קפיצה חדה ברמת הקושי בין שאלות סמוכות.
- שאלה מילולית שחסר בה נתון הכרחי.
- משוואה ארוכה באמצע משפט. כתוב אותה בשורה משלה.
- ציור עם מספר שלא מתאים לשרטוט, או שרטוט של הוכחה שמסמן את מה שצריך להוכיח.
- מפתח שלא נבדק ב-`check`, ו"כל התשובות נבדקו" בצ'אט.
- טבלת בדיקה, קוד LaTeX או שם של תלמיד בצ'אט.

## קוד הציורים

בכל דף, גם בלי ציורים: העתק את הקוד הזה, תו בתו, באותה הרצת קוד, אחרי `build` של הסקיל format-equations-for-hebrew-worksheets ואחרי הקוד של `check` מהסקיל verify-solutions והבדיקות. אחר כך קרא ל-`build_figures(md, "<שם-באנגלית>.docx")`.

```python
import io, math, re, docx
import numpy as np
import sympy as sp
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, Polygon, Rectangle
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
from docx.shared import Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

X = sp.Symbol("x")
TR = standard_transformations + (implicit_multiplication_application, convert_xor)
FS = 12
NUM = re.compile(r"[0-9]+(\.[0-9]+)?")

def _ex(s, env=None):
    loc = {"x": X, "e": sp.E, "pi": sp.pi, "ln": sp.log, "sqrt": sp.sqrt, "abs": sp.Abs}
    loc.update(env or {})
    return parse_expr(s.replace("π", "pi"), local_dict=loc, transformations=TR)

def _num(s, env=None):
    return float(_ex(str(s), env))

def _r(v):
    v = round(v, 3)
    return ("%g" % (0 if v == 0 else v)).replace("-", "−")

def _names(s):
    return re.findall(r"[A-Z]'?[0-9]?", s)

class _Page:
    def __init__(s, x0, y0, x1, y1, kx, ky, pad=0.7):
        s.kx, s.ky, s.obs = kx, ky, []
        s.w = (x1 - x0) * kx + 2 * pad
        s.fig = plt.figure(figsize=(s.w / 2.54, ((y1 - y0) * ky + 2 * pad) / 2.54))
        s.ax = s.fig.add_axes([0, 0, 1, 1])
        s.ax.axis("off")
        s.ax.set_xlim(x0 - pad / kx, x1 + pad / kx)
        s.ax.set_ylim(y0 - pad / ky, y1 + pad / ky)

    def block(s, xs, ys):
        s.obs += [(x * s.kx, y * s.ky) for x, y in zip(xs, ys) if np.isfinite(x) and np.isfinite(y)]

    def line(s, a, b, **kw):
        s.ax.plot([a[0], b[0]], [a[1], b[1]], **kw)
        n = max(2, int(math.hypot((b[0] - a[0]) * s.kx, (b[1] - a[1]) * s.ky) / 0.1))
        s.block(np.linspace(a[0], b[0], n), np.linspace(a[1], b[1], n))

    def text(s, x, y, txt, size=FS, **kw):
        s.ax.text(x, y, txt, ha="center", va="center", fontsize=size, **kw)
        s.obs.append((x * s.kx, y * s.ky))

    def put(s, x, y, txt, offs, size=FS, pref=None, **kw):
        O = np.array(s.obs) if s.obs else np.zeros((0, 2))
        wid = 0.1 * max(0, len(txt) - 1)
        def score(i, d):
            dx = d[0] + math.copysign(wid, d[0]) if abs(d[0]) > 0.05 else d[0]
            cx, cy = x * s.kx + dx, y * s.ky + d[1]
            m = np.min(np.hypot(O[:, 0] - cx, O[:, 1] - cy)) if len(O) else 9
            if wid:
                m = min(m, np.min(np.hypot(O[:, 0] - cx - wid, O[:, 1] - cy)), np.min(np.hypot(O[:, 0] - cx + wid, O[:, 1] - cy))) if len(O) else 9
            return min(m, 0.6) + (0.05 if pref and pref(d) else 0) - 0.001 * i, dx, d[1]
        _, dx, dy = max(score(i, d) for i, d in enumerate(offs))
        s.text(x + dx / s.kx, y + dy / s.ky, txt, size, **kw)

def _ring(r=0.42):
    return [(r * math.cos(math.radians(a)), r * math.sin(math.radians(a))) for a in range(45, 405, 45)]

def _ang(P, a, v, b):
    u = math.atan2(P[a][1] - P[v][1], P[a][0] - P[v][0])
    w = math.atan2(P[b][1] - P[v][1], P[b][0] - P[v][0])
    d = math.degrees(w - u) % 360
    s = math.degrees(u)
    if d > 180:
        s, d = math.degrees(w), 360 - d
    return s, d

def _point(v, P, env=None):
    t = v.split(":")
    if t[0] == "mid":
        a, b = _names(t[1])
        return ((P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2)
    if t[0] == "on":
        a, b = _names(t[1])
        k = _num(t[2])
        return (P[a][0] + k * (P[b][0] - P[a][0]), P[a][1] + k * (P[b][1] - P[a][1]))
    if t[0] == "foot":
        c, (a, b) = t[1], _names(t[2])
        dx, dy = P[b][0] - P[a][0], P[b][1] - P[a][1]
        k = ((P[c][0] - P[a][0]) * dx + (P[c][1] - P[a][1]) * dy) / (dx * dx + dy * dy)
        return (P[a][0] + k * dx, P[a][1] + k * dy)
    if t[0] == "cross":
        (a, b), (c, d) = _names(t[1]), _names(t[2])
        x1, y1, x2, y2, x3, y3, x4, y4 = *P[a], *P[b], *P[c], *P[d]
        den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        if abs(den) < 1e-9:
            raise ValueError("cross: הישרים מקבילים")
        k = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
        return (x1 + k * (x2 - x1), y1 + k * (y2 - y1))
    if t[0] == "polar":
        r, q = _num(t[2]), math.radians(_num(t[3]))
        return (P[t[1]][0] + r * math.cos(q), P[t[1]][1] + r * math.sin(q))
    x, y = v.split(",")
    return (_num(x, env), _num(y, env))

def _lines(pg, P, o, lw=1.8):
    links = []
    for key, st in (("seg", "-"), ("dash", "--")):
        for p in o.get(key, "").split(","):
            path = _names(p)
            for a, b in zip(path, path[1:]):
                pg.line(P[a], P[b], color="black", ls=st, lw=lw if st == "-" else 1.2)
                links.append((a, b))
    return links

def _marks(pg, P, o, notes, problems):
    ax, k = pg.ax, pg.kx
    for nm in filter(None, o.get("right", "").split(",")):
        a, v, b = _names(nm)
        s, d = _ang(P, a, v, b)
        if abs(d - 90) > 0.5:
            problems.append("right: הזווית %s בציור היא %s°, לא 90°" % (nm, _r(d)))
        q, p = 0.3 / k, P[v]
        u = (math.cos(math.radians(s)) * q, math.sin(math.radians(s)) * q)
        w = (math.cos(math.radians(s + d)) * q, math.sin(math.radians(s + d)) * q)
        ax.plot([p[0] + u[0], p[0] + u[0] + w[0], p[0] + w[0]], [p[1] + u[1], p[1] + u[1] + w[1], p[1] + w[1]], "k-", lw=1.1)
    groups = [(g, x, False) for g, x in enumerate(filter(None, o.get("eqang", "").split(";")))]
    groups += [(0, x, True) for x in filter(None, o.get("ang", "").split(","))]
    for g, grp, single in groups:
        ds = []
        for nm in grp.split(","):
            nm, lab = nm.split(":", 1) if ":" in nm else (nm, "")
            a, v, b = _names(nm)
            s, d = _ang(P, a, v, b)
            ds.append(d)
            base = 0.55 if d > 40 else 0.55 + (40 - d) * 0.025
            for j in range(g + 1):
                r = (base + 0.12 * j) / k
                ax.add_patch(Arc(P[v], 2 * r, 2 * r, theta1=s, theta2=s + d, lw=1.1))
            if single and lab:
                m = math.radians(s + d / 2)
                pg.text(P[v][0] + math.cos(m) * (r + 0.32 / k), P[v][1] + math.sin(m) * (r + 0.32 / k),
                        lab + "°" if NUM.fullmatch(lab) else lab, FS - 1)
            if single and lab == "?":
                notes.append("זווית %s = %s°" % (a + v + b, _r(d)))
            elif single and NUM.fullmatch(lab) and abs(float(lab) - d) > 0.5:
                problems.append("זווית %s: כתוב %s°, אבל בציור %s°" % (a + v + b, lab, _r(d)))
        if not single and max(ds) - min(ds) > 0.5:
            problems.append("eqang: הזוויות %s לא שוות בציור (%s)" % (grp, ", ".join(_r(x) for x in ds)))
    for g, grp in enumerate(filter(None, o.get("eq", "").split(";"))):
        ls = []
        for sg in grp.split(","):
            a, b = _names(sg)
            d = math.dist(P[a], P[b])
            ls.append(d)
            mx, my = (P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2
            ux, uy = (P[b][0] - P[a][0]) / d, (P[b][1] - P[a][1]) / d
            for j in range(g + 1):
                off = (j - g / 2) * 0.13 / k
                tx, ty = mx + ux * off, my + uy * off
                ax.plot([tx - uy * 0.17 / k, tx + uy * 0.17 / k], [ty + ux * 0.17 / k, ty - ux * 0.17 / k], "k-", lw=1.2)
        if max(ls) - min(ls) > 0.01 * max(ls):
            problems.append("eq: הקטעים %s לא שווים בציור (%s)" % (grp, ", ".join(_r(x) for x in ls)))

def _labels(pg, P, o, links, notes, problems, hide=()):
    cx = sum(p[0] for p in P.values()) / len(P)
    cy = sum(p[1] for p in P.values()) / len(P)
    for n, p in P.items():
        if n not in hide:
            pg.put(p[0], p[1], n, _ring(), FS + 1,
                   pref=lambda d, p=p: d[0] * (p[0] - cx) + d[1] * (p[1] - cy) > 0)
    for item in filter(None, o.get("len", "").split(",")):
        sg, lab = item.split(":", 1)
        a, b = _names(sg)
        d = math.dist(P[a], P[b])
        nx, ny = -(P[b][1] - P[a][1]) / d, (P[b][0] - P[a][0]) / d
        offs = []
        for t in (0.5, 0.35, 0.65):
            for sgn in (1, -1):
                offs.append((t, sgn))
        mx, my = (P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2
        out = 1 if nx * (mx - cx) + ny * (my - cy) >= 0 else -1
        best = None
        for i, (t, sgn) in enumerate(offs):
            x, y = P[a][0] + t * (P[b][0] - P[a][0]), P[a][1] + t * (P[b][1] - P[a][1])
            dx, dy = sgn * nx * 0.38, sgn * ny * 0.38
            O = np.array(pg.obs)
            m = min(0.6, np.min(np.hypot(O[:, 0] - x * pg.kx - dx, O[:, 1] - y * pg.ky - dy))) + (0.05 if sgn == out else 0) - 0.001 * i
            if best is None or m > best[0]:
                best = (m, x + dx / pg.kx, y + dy / pg.ky)
        pg.text(best[1], best[2], lab)
        if lab == "?":
            notes.append("%s%s = %s" % (a, b, _r(d)))
        elif NUM.fullmatch(lab) and abs(float(lab) - d) > 0.01 * d:
            problems.append("%s%s: כתוב %s, אבל בציור %s" % (a, b, lab, _r(d)))

def _geo(P, o, notes, problems):
    ext = list(P.values())
    circles = []
    for c in filter(None, o.get("circle", "").split(";")):
        cn, r = c.split(":")
        r = math.dist(P[cn], P[r]) if r in P else _num(r)
        circles.append((P[cn], r))
        ext += [(P[cn][0] - r, P[cn][1] - r), (P[cn][0] + r, P[cn][1] + r)]
    x0, x1 = min(p[0] for p in ext), max(p[0] for p in ext)
    y0, y1 = min(p[1] for p in ext), max(p[1] for p in ext)
    k = min(10 / max(x1 - x0, 1e-9), 7 / max(y1 - y0, 1e-9))
    pg = _Page(x0, y0, x1, y1, k, k)
    for f in filter(None, o.get("fill", "").split(",")):
        pg.ax.add_patch(Polygon([P[n] for n in _names(f)], closed=True, fc="0.85", ec="none"))
    links = _lines(pg, P, o)
    for c, r in circles:
        pg.ax.add_patch(Circle(c, r, fill=False, lw=1.8))
        q = np.linspace(0, 2 * math.pi, 120)
        pg.block(c[0] + r * np.cos(q), c[1] + r * np.sin(q))
    for n in P:
        pg.ax.plot(*P[n], "ko", ms=3.5)
    _marks(pg, P, o, notes, problems)
    _labels(pg, P, o, links, notes, problems, hide=_names(o.get("hide", "")))
    return pg.fig, pg.w

def _tri(m, o, notes):
    V = "ABC"
    side = {"A": ("BC", "CB"), "B": ("CA", "AC"), "C": ("AB", "BA")}
    S = {v: next((_num(m[s]) for s in side[v] if s in m), None) for v in V}
    G = {v: _num(m[v]) if v in m else None for v in V}
    if sum(g is not None for g in G.values()) == 2:
        v = next(v for v in V if G[v] is None)
        G[v] = 180 - sum(g for g in G.values() if g)
    nS = sum(s is not None for s in S.values())
    if all(g is not None for g in G.values()):
        if nS == 0:
            raise ValueError("triangle: צריך לפחות צלע אחת")
        v = next(v for v in V if S[v] is not None)
        q = S[v] / math.sin(math.radians(G[v]))
        S = {u: q * math.sin(math.radians(G[u])) for u in V}
    elif nS == 2 and sum(g is not None for g in G.values()) == 1:
        v = next(v for v in V if G[v] is not None)
        if S[v] is None:
            a, b = (S[u] for u in V if u != v)
            S[v] = math.sqrt(a * a + b * b - 2 * a * b * math.cos(math.radians(G[v])))
        else:
            u = next(u for u in V if u != v and S[u] is not None)
            sn = S[u] * math.sin(math.radians(G[v])) / S[v]
            if sn > 1:
                raise ValueError("triangle: אין משולש כזה")
            if S[u] > S[v] and G[v] < 90:
                raise ValueError("triangle: יש 2 משולשים כאלה. תן את הזווית שבין 2 הצלעות")
            G[u] = math.degrees(math.asin(sn))
            z = next(z for z in V if z not in (u, v))
            G[z] = 180 - G[u] - G[v]
            S[z] = S[v] * math.sin(math.radians(G[z])) / math.sin(math.radians(G[v]))
    elif nS != 3:
        raise ValueError("triangle: צריך 3 צלעות, 2 צלעות וזווית, או צלע ו-2 זוויות")
    a, b, c = S["A"], S["B"], S["C"]
    if min(a + b - c, a + c - b, b + c - a) <= 1e-9:
        raise ValueError("triangle: אין משולש עם הצלעות האלה")
    cosA = (b * b + c * c - a * a) / (2 * b * c)
    P = {"A": (0.0, 0.0), "B": (c, 0.0), "C": (b * cosA, b * math.sqrt(max(0, 1 - cosA * cosA)))}
    at = {"A": "CAB", "B": "ABC", "C": "BCA"}
    hide = o.get("hide", "").split(",")
    lens, angs, right = [], [], []
    for v in V:
        for s in side[v]:
            if s in m and s not in hide:
                lens.append(s + ":" + m[s])
        if v in m and v not in hide:
            if abs(_num(m[v]) - 90) < 1e-9:
                right.append(at[v])
            else:
                angs.append(at[v] + ":" + m[v])
    for q in filter(None, o.get("ask", "").split(",")):
        (lens if len(q) == 2 else angs).append((q if len(q) == 2 else at[q]) + ":?")
    for key, lst in (("len", lens), ("ang", angs), ("right", right)):
        o[key] = ",".join(filter(None, [o.get(key, "")] + lst))
    o["seg"] = ",".join(filter(None, ["ABCA", o.get("seg", "")]))
    o.pop("hide", None)
    ang = {v: math.degrees(math.acos(max(-1, min(1, (S[u] ** 2 + S[w] ** 2 - S[v] ** 2) / (2 * S[u] * S[w])))))
           for v, u, w in (("A", "B", "C"), ("B", "C", "A"), ("C", "A", "B"))}
    notes.append("AB=%s BC=%s CA=%s, A=%s° B=%s° C=%s°" % (_r(c), _r(a), _r(b), _r(ang["A"]), _r(ang["B"]), _r(ang["C"])))
    return P

def _ticks(lo, hi, st):
    if st:
        s = _num(st)
    else:
        s = next(c for c in (0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 10 ** 9) if (hi - lo) / c <= 10)
    return [i * s for i in range(math.ceil(lo / s - 1e-9), math.floor(hi / s + 1e-9) + 1)]

def _tick(v, st):
    if "pi" not in st:
        return _r(v)
    f = sp.Rational(round(v / math.pi * 12), 12)
    n, d = abs(f.p), f.q
    return ("−" if f < 0 else "") + ("" if n == 1 else str(n)) + "π" + ("" if d == 1 else "/" + str(d))

def _zeros(e, a, b, H):
    f = sp.lambdify(X, e, "math")
    def val(t):
        try:
            v = f(float(t))
            return v if isinstance(v, (int, float)) and math.isfinite(v) else None
        except (ValueError, ZeroDivisionError, TypeError, OverflowError):
            return None
    z, xs = [], np.linspace(a, b, 3001)
    for p, q in zip(xs, xs[1:]):
        fp, fq = val(p), val(q)
        if fp is None or fq is None:
            continue
        if fp == 0:
            z.append(p)
        elif fp * fq < 0 and abs(fp - fq) < H:
            for _ in range(60):
                c = (p + q) / 2
                fc = val(c)
                if fc is None:
                    break
                p, q = (p, c) if fp * fc <= 0 else (c, q)
                fp = val(p)
            z.append((p + q) / 2)
    return z

def _axes(o, notes, problems):
    x0, x1 = (_num(v) for v in o.get("x", "-5,5").split(","))
    y0, y1 = (_num(v) for v in o.get("y", "-5,5").split(","))
    W, H = x1 - x0, y1 - y0
    kx = ky = min(11 / W, 8 / H, 2)
    if not 0.4 <= H / W <= 1.6 or o.get("scale") == "free":
        kx, ky = min(11 / W, 2), min(8 / H, 2)
    pg = _Page(x0, y0, x1, y1, kx, ky, 0.8)
    ax = pg.ax
    ox, oy = min(max(0, x0), x1), min(max(0, y0), y1)
    xst, yst = o.get("xstep", ""), o.get("ystep", "")
    tx, ty = _ticks(x0, x1, xst), _ticks(y0, y1, yst)
    if o.get("grid") == "yes":
        for v in tx:
            ax.plot([v, v], [y0, y1], color="0.85", lw=0.6)
        for v in ty:
            ax.plot([x0, x1], [v, v], color="0.85", lw=0.6)
    ax.annotate("", xy=(x1 + 0.45 / kx, oy), xytext=(x0 - 0.2 / kx, oy), arrowprops=dict(arrowstyle="-|>", lw=1.3, color="black"))
    ax.annotate("", xy=(ox, y1 + 0.45 / ky), xytext=(ox, y0 - 0.2 / ky), arrowprops=dict(arrowstyle="-|>", lw=1.3, color="black"))
    pg.block(np.linspace(x0, x1, 200), [oy] * 200)
    pg.block([ox] * 200, np.linspace(y0, y1, 200))
    pg.text(x1 + 0.45 / kx, oy - 0.35 / ky, "x", FS, style="italic")
    pg.text(ox - 0.35 / kx, y1 + 0.45 / ky, "y", FS, style="italic")
    if o.get("grid") == "yes" or o.get("nums") == "yes":
        for v in tx:
            ax.plot([v, v], [oy - 0.08 / ky, oy + 0.08 / ky], "k-", lw=1)
            if abs(v - ox) > 1e-9:
                pg.text(v, oy - 0.3 / ky, _tick(v, xst), FS - 3)
        for v in ty:
            ax.plot([ox - 0.08 / kx, ox + 0.08 / kx], [v, v], "k-", lw=1)
            if abs(v - oy) > 1e-9:
                t = _tick(v, yst)
                pg.text(ox - (0.2 + 0.08 * len(t)) / kx, v, t, FS - 3)
        if ox == 0 and oy == 0:
            pg.text(-0.22 / kx, -0.28 / ky, "0", FS - 3)
    clip = Rectangle((x0, y0), W, H, transform=ax.transData)
    fns, env, curves = {}, {}, []
    xs = np.linspace(x0, x1, 3001)
    styles = ["-", "--", "-.", ":"]
    for i, item in enumerate(filter(None, o.get("fn", "").split(";"))):
        name, e = item.split(":", 1) if ":" in item else ("", item)
        e = _ex(e, env)
        fns[name or "f%d" % i] = e
        if name:
            env[name] = sp.Lambda(X, e)
        with np.errstate(all="ignore"):
            ys = np.asarray(sp.lambdify(X, e, "numpy")(xs.astype(complex)), dtype=complex) * np.ones_like(xs)
        ys = np.where(np.abs(ys.imag) < 1e-9, ys.real, np.nan)
        ys[(ys < y0 - 2 * H) | (ys > y1 + 2 * H)] = np.nan
        ys[1:][np.abs(np.diff(ys)) > H / 2] = np.nan
        ax.plot(xs, ys, "k" + styles[i % 4], lw=2)[0].set_clip_path(clip)
        inside = (ys >= y0) & (ys <= y1)
        pg.block(xs[inside][::6], ys[inside][::6])
        curves.append((name, xs[inside], ys[inside]))
        if name:
            z = _zeros(e, x0, x1, H)
            notes.append("%s: חיתוך עם ציר x ב-x = %s" % (name, ", ".join(_r(v) for v in z[:8]) or "אין בתחום"))
    for v in filter(None, o.get("vline", "").split(",")):
        pg.line((_num(v), y0), (_num(v), y1), color="black", ls="--", lw=1)
    for v in filter(None, o.get("hline", "").split(",")):
        pg.line((x0, _num(v)), (x1, _num(v)), color="black", ls="--", lw=1)
    for item in filter(None, o.get("area", "").split(";")):
        f1, f2, rng = item.split(":")
        a, b = (_num(v, env) for v in rng.split(","))
        g1, g2 = (sp.lambdify(X, fns[n] if n in fns else _ex(n, env), "numpy") for n in (f1, f2))
        xa = np.linspace(a, b, 2001)
        with np.errstate(all="ignore"):
            v1, v2 = np.ones_like(xa) * g1(xa), np.ones_like(xa) * g2(xa)
        ax.fill_between(xa, v1, v2, color="0.8", lw=0).set_clip_path(clip)
        notes.append("שטח %s = %s" % (item, _r(float(np.sum((np.abs(v1 - v2)[1:] + np.abs(v1 - v2)[:-1]) / 2 * np.diff(xa))))))
    P = {}
    for item in filter(None, o.get("points", "").split(";")):
        n, v = item.split(":", 1)
        P[n] = _point(v, P, env)
        if not (x0 - 1e-9 <= P[n][0] <= x1 + 1e-9 and y0 - 1e-9 <= P[n][1] <= y1 + 1e-9):
            problems.append("הנקודה %s מחוץ לתחום הציור" % n)
        notes.append("%s(%s, %s)" % (n, _r(P[n][0]), _r(P[n][1])))
    for f in filter(None, o.get("fill", "").split(",")):
        ax.add_patch(Polygon([P[n] for n in _names(f)], closed=True, fc="0.85", ec="none"))
    links = _lines(pg, P, o, 1.6)
    for c in filter(None, o.get("circle", "").split(";")):
        cn, r = c.split(":")
        r = math.dist(P[cn], P[r]) if r in P else _num(r)
        ax.add_patch(Circle(P[cn], r, fill=False, lw=1.8))
        q = np.linspace(0, 2 * math.pi, 120)
        pg.block(P[cn][0] + r * np.cos(q), P[cn][1] + r * np.sin(q))
    for n, p in P.items():
        ax.plot(*p, "ko", ms=5)
        pg.block([p[0]], [p[1]])
    if P:
        _marks(pg, P, o, notes, problems)
        _labels(pg, P, o, links, notes, problems)
    for name, cx, cy in curves:
        if name and len(cx):
            idx = [int(len(cx) * t) for t in (0.85, 0.7, 0.95, 0.55, 0.3, 0.15)]
            O = np.array(pg.obs)
            best = None
            for i, j in enumerate(idx):
                for dx, dy in ((0.3, 0.3), (-0.3, 0.3), (0.3, -0.3), (-0.3, -0.3)):
                    m = min(0.6, np.min(np.hypot(O[:, 0] - cx[j] * kx - dx, O[:, 1] - cy[j] * ky - dy))) - 0.01 * i
                    if best is None or m > best[0]:
                        best = (m, cx[j] + dx / kx, cy[j] + dy / ky)
            pg.text(best[1], best[2], name, FS + 1, style="italic")
    return pg.fig, pg.w

def _draw(spec, notes, problems):
    if re.search(r"[֐-׿]", spec):
        raise ValueError("עברית בתוך ציור. בציור רק אותיות לטיניות, מספרים וסימנים")
    t = spec.split()
    kind, items = t[0], [x.split("=", 1) for x in t[1:]]
    if any(len(i) != 2 for i in items):
        raise ValueError("כל חלק בציור הוא key=value, בלי רווחים בתוך הערך")
    if kind == "axes":
        return _axes(dict(items), notes, problems)
    if kind in ("geo", "triangle"):
        m, P, o, extra = {}, {}, {}, []
        for key, v in items:
            if kind == "triangle" and re.fullmatch(r"[ABC]|AB|BA|BC|CB|AC|CA", key):
                m[key] = v
            elif re.fullmatch(r"[A-Z]'?[0-9]?", key):
                extra.append((key, v))
            else:
                o[key] = v
        if kind == "triangle":
            P = _tri(m, o, notes)
        for key, v in extra:
            P[key] = _point(v, P)
        return _geo(P, o, notes, problems)
    raise ValueError("סוג ציור לא מוכר: " + kind)

def _verified(md):
    # בלי בדיקת sympy (check של verify-solutions) לכל שאלה באותה הרצה, אין קובץ
    checks = globals().get("CHECKS") or []
    qs = re.split(r"^#+[^\n]*מפתח תשובות", md, flags=re.M)[0]
    nums = re.findall(r"^\s*(?:#{1,4}\s*)?(?:\*\*)?\s*שאלה\s*(\d+)", qs, flags=re.M) or re.findall(r"^\s*(\d+)[.)]\s", qs, flags=re.M)
    done = [m.group(1) for m in (re.search(r"(\d+)", c["q"]) for c in checks) if m]
    bad = []
    if not checks:
        bad.append("אין בדיקת sympy. להעתיק את הקוד של verify-solutions ולקרוא ל-check() לכל שאלה, באותה הרצה")
    bad += ["בדיקת sympy נכשלה בשאלה %s. לתקן את המפתח ולהריץ שוב" % c["q"] for c in checks if not c["ok"]]
    miss = sorted(set(nums) - set(done), key=int)
    if checks and (miss or len(checks) < len(nums)):
        bad.append("אין check() לשאלות: %s" % (", ".join(miss) or "חלק מהשאלות (בדיקה אחת לפחות לכל שאלה)"))
    return bad

def build_figures(md, out):
    bad = _verified(md)
    if bad:
        print("הקובץ לא נוצר:", bad)
        return bad
    print("בדיקת sympy:", len(CHECKS), "בדיקות, כולן תקינות")
    specs = []
    def keep(m):
        specs.append(m.group(1).strip())
        return "\n\nFIGURE%dEND\n\n" % (len(specs) - 1)
    md = re.sub(r"^[ \t]*\[draw (.*?)\][ \t]*$", keep, md, flags=re.M)
    # A name in a Hebrew sentence ($x$, $AB$) is plain text, not a Word equation.
    md = "\n".join(re.sub(r"\$([A-Za-z]{1,4})\$", r"\1", l) if re.search(r"[א-ת]", l) else l
                   for l in md.split("\n"))
    problems = list(build(md, out))
    if "[draw" in md:
        problems.append("ציור בתוך משפט. [draw ...] רק בשורה משלו")
    doc = docx.Document(out)
    for p in doc.paragraphs:
        m = re.fullmatch(r"FIGURE(\d+)END", p.text.strip())
        if not m:
            continue
        spec, notes = specs[int(m.group(1))], []
        for r in list(p.runs):
            r._r.getparent().remove(r._r)
        try:
            fig, w = _draw(spec, notes, problems)
            buf = io.BytesIO()
            fig.savefig(buf, format="png", dpi=200)
            plt.close(fig)
            buf.seek(0)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.add_run().add_picture(buf, width=Cm(min(w, 15)))
        except Exception as e:
            plt.close("all")
            problems.append("ציור לא תקין: [draw %s] | %s" % (spec, e))
        print("ציור:", spec, "|", "; ".join(notes) or "תקין")
    doc.save(out)
    print("ציורים:", len(specs), "| בעיות:", problems or "אין")
    return problems
```

הקוד בודק קודם שכל שאלה עברה `check`, ובלי זה לא יוצר קובץ. הוא מחליף כל שורת `[draw ...]` בסימן לפני pandoc, כדי ש-pandoc לא יהפוך `^` או `*` בנוסחה לעיצוב. אחרי `build` הוא מצייר כל ציור ב-matplotlib ושם אותו באמצע השורה. הוא מדפיס בעיה אם מספר בציור לא מתאים לשרטוט, אם קטעים שסומנו שווים לא שווים, אם זווית שסומנה ישרה לא ישרה, אם נקודה מחוץ לתחום, או אם יש עברית בציור.
