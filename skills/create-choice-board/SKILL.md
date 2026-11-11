---
name: create-choice-board
description: יוצר לוח בחירה (choice board) בעברית לכל מקצוע וכיתה, כקובץ Word עם טבלת משבצות צבעונית אמיתית (ברירת מחדל 3 על 3, "שלוש בשורה") בעמוד אחד לרוחב, ומדריך למורה עם מטרה, שלבים, תמיכה והרחבה לכל משבצת. השתמש כאשר מורה מבקש לוח בחירה, לוח בחירות, choice board, טיק-טק-טו למידה, בינגו משימות, תפריט משימות, משימות לבחירה, או דרכים שונות לתלמידים להראות שהבינו נושא, בתרגול או בפרויקט.
---

# יצירת לוח בחירה

לוח בחירה הוא **טבלה של משבצות**, לא רשימה של כרטיסים. התלמיד רואה את כל האפשרויות במבט אחד ובוחר לפי כלל ברור (למשל שלוש בשורה). כל הכללים כאן נועדו לשמור על זה.

## חובה: התוצר הוא קובץ Word

- **צור קובץ Word ‏(‎.docx) להורדה**, בהרצת קוד אחת, עם פונקציית `build` שבסוף הסקיל. גם אם המורה לא ביקש קובץ.
- **אל תכתוב את הלוח בתשובה בצ'אט, ואל תשתמש ב-Canvas.** בצ'אט כתוב רק את הקובץ ואת שתי שורות ההודעה למורה (בסוף הסקיל).
- `build` משתמשת רק ב-Python רגיל, בלי ספריות. היא רצה בסביבת הקוד שלך כרגיל. העתק אותה כמו שהיא ואל תשנה אותה.
- **אל תבנה את הקובץ בדרך אחרת** (python-docx, pandoc, HTML). רק `build`.

## לפני שמתחילים

**לפני שבונים, שאל את המורה הודעה אחת** עם השאלות שהתשובה עליהן לא כתובה כבר בבקשה. כל השאלות באותה הודעה, ממוספרות, ובכל שאלה ברירת המחדל בסוגריים. אל תבנה קובץ באותה תשובה.

```
לפני שאני בונה את הלוח, כמה שאלות קצרות (אפשר לענות רק על חלק, או לכתוב "תחליט אתה"):
1. לאיזו כיתה?
2. מה המטרה של הלוח? תרגול אחרי לימוד, חזרה לפני מבחן, או פרויקט מסכם (תרגול)
3. כמה משבצות? 3, 6 או 9 (9, "שלוש בשורה")
4. כמה זמן יש לתלמידים לכל הלוח? (45 דקות, שיעור אחד)
```

- שאלה שהתשובה עליה כבר בבקשה, לא שואלים. אם הכול כבר כתוב, בונים מיד.
- את השאלה על הכיתה תמיד שואלים אם היא חסרה. גם הנושא: אם הוא חסר, הוסף אותו כשאלה ראשונה.
- **שואלים פעם אחת בלבד.** אחרי התשובה של המורה בונים, גם אם ענה רק על חלק. מה שלא ענה עליו, או "תחליט אתה", נקבע לפי ברירת המחדל.
- את כל ההחלטות (מטרה, גודל, זמן, זמן למשבצת) כתוב בשורה הראשונה של `guide["info"]`, כדי שהמורה יראה מה נקבע.
- **המטרה משנה את המשימות:**
  - **תרגול**: משימות שמעבדות את החומר שנלמד (מסבירים, משווים, ממיינים, מיישמים).
  - **חזרה לפני מבחן**: משימות שליפה וקישור בין נושאים, בלי מחברת פתוחה כשאפשר, ומשבצת אחת לפחות של שאלות בסגנון מבחן.
  - **פרויקט מסכם**: תוצר אחד גדול יותר לכל משבצת, ובמדריך למורה מחוון קצר ב-`assess`. ברירת המחדל לזמן: 90 דקות.

## גודל הלוח וכלל הבחירה

| הלוח | כלל הבחירה | משבצות |
|---|---|---|
| 3×3 (ברירת מחדל, "9") | שלוש בשורה: שורה, טור או אלכסון | 8 משימות + "בחירה חופשית" באמצע |
| 2×3 ("6") | בחרו 2 משימות, אחת מכל שורה | 6 |
| 1×3 ("3") | בחרו משימה אחת | 3, כל אחת ממשפחה אחרת |
| כיתות א'–ג' | בחרו 2 משימות (בלי שלוש בשורה) | 6 בלוח 2×3, או 9 בלוח 3×3 |
| 4×4 | ארבע בשורה (בינגו) | 16, או 15 + "בחירה חופשית" |

המורה יכול לבקש כל גודל וכל כלל אחר. הכלל נכתב **מעל הלוח**, במשפט אחד.

## זמן: מתחלקים בין המשבצות

**זמן למשבצת = משך כולל ÷ מספר המשבצות שהתלמיד משלים.** 45 דקות ו"שלוש בשורה" = 15 דקות למשבצת.

- כל משימה חייבת להיגמר בזמן הזה אצל תלמיד ממוצע בכיתה, כולל קריאת ההוראה.
- כל המשבצות שוות במאמץ. אין משבצת "קלה" ואין משבצת שהיא פרויקט.
- **תוצר אחד לכל משבצת**, בסוג של המשבצת. בלי "ובנוסף כתבו חיבור" על משימת ציור או הקלטה.
- בלי חיפוש עצמאי ברשת, בלי כמה טיוטות, ובלי הפקת וידאו בתוך שיעור אחד.

## תוכן המשבצות

- **כל משימה מעבדת את החומר**: משווה, מסבירה, מיישמת, ממיינת, מנתחת או יוצרת. לא "קראו" ולא "העתיקו".
- **מגוון סוגים.** ארבע משפחות:
  - **כ**: כתיבה (יומן, מכתב, הגדרה במילים שלך, שאלות ותשובות)
  - **ח**: חזותי (ציור עם הסברים, תרשים, קומיקס, מפת מושגים)
  - **ד**: דיבור והצגה (הקלטה, ראיון, הסבר לחבר, פודקאסט קצר)
  - **י**: ידיים ותנועה (בנייה, דגם, משחק, מיון, תנועה)
  - משימה דיגיטלית נכנסת לאחת המשפחות. לכיתות ד' ומעלה, שתיים-שלוש משבצות דיגיטליות לכל היותר.
- **סידור 3×3 שבו כל שורה של שלוש מעורבת** (המשבצות ממוספרות מימין לשמאל, ★ = בחירה חופשית):

  ```
  1:כ  2:ח  3:ד
  4:ד  5:★  6:י
  7:י  8:כ  9:ח
  ```

  בסידור הזה אין שורה, טור או אלכסון עם שתי משבצות מאותה משפחה. בלוח בגודל אחר: כל שורה מכילה לפחות שני סוגים שונים.
- **"בחירה חופשית"**: התלמיד מציע משימה משלו לאותה מטרה, ומאשר אותה עם המורה לפני שמתחיל.
- **חומרים**: רק מה שיש בכל כיתה או בית (דף, צבעים, טלפון, פלסטלינה), או מה שהמורה צירף. לא "דף עבודה מצורף" שלא קיים. אם המשימה צריכה פריטים (מושגים למיון, שאלות), כתוב אותם בתוך המשימה.
- **כיתות א'–ג'**: 1–3 חומרים פשוטים, משפטים קצרים במילים מוכרות, משימות שאפשר לעשות לבד בלי מבוגר, ו-`"young": True`.
- **דוגמאות חד-משמעיות.** במשימות מיון וזיהוי, כל פריט שייך בבירור לאחת הקטגוריות שהמורה ביקש. לא מכניסים פריט שלא שייך לאף אחת מהן (למשל התאמה פיזיולוגית כשהמורה ביקש מבנית והתנהגותית), ולא כותבים "מבנית/פיזיולוגית".
- לשון רבים פונה לתלמידים ("ציירו", "כתבו"), מונחים כפי שמלמדים בישראל.
- **בלי אימוג'י ובלי סימנים מיוחדים** (✔ ⏱ ⭐) בשום טקסט בקובץ. בתצוגה של Google הם יוצאים כריבועים ריקים.

## הנתונים ל-build

```python
board = {
    "title": "התאמות של בעלי חיים למדבר",
    "rule": "בחרו שלוש משימות בשורה: לאורך, לרוחב או באלכסון. סמנו V על כל משימה שסיימתם.",
    "cols": 3,
    "young": False,
    "cells": [  # לפי הסדר, מימין לשמאל ומלמעלה למטה
        {"title": "יומן הישרדות",
         "task": "כתבו יומן של גמל ל-24 שעות במדבר. שלבו 2 התאמות מבניות ו-1 התנהגותית.",
         "product": "קטע יומן של 8-10 שורות", "time": "15 דקות", "materials": "דף ועט"},
        # ...
        {"title": "בחירה חופשית", "free": True, "time": "15 דקות",
         "task": "הציעו משימה משלכם שמראה [המטרה]. אשרו אותה עם המורה לפני שמתחילים."},
        # ...
    ],
    "guide": {
        "info": ["כיתה: ח'", "מטרות: ...", "משך: 45 דקות · לוח 3×3, שלוש בשורה · 15 דקות למשבצת"],
        "rows": [  # שורה לכל משבצת חוץ מבחירה חופשית
            {"n": 1, "title": "יומן הישרדות", "type": "כתיבה",
             "goal": "המטרה שהמשבצת בודקת",
             "steps": ["תכננו: ... (3 דק')", "כתבו: ... (9 דק')", "בדקו: ... (3 דק')"],
             "product": "קטע יומן", "support": "פתיח משפט, בנק מילים או דוגמה",
             "extension": "דרישה שמעמיקה את אותה משימה", "materials": "דף ועט", "time": "15 דקות"},
        ],
        "assess": "שתיים-שלוש שורות: מה בתוצר מראה שהתלמיד הבין את המטרה.",
    },
}
```

- **משבצת בלוח**: כותרת קצרה ומושכת, משימה של משפט אחד-שניים (עד 35 מילים, לכיתות א'–ג' עד 15), תוצר בכמה מילים, זמן וחומרים.
- **שלבים במדריך**: שלושה, בחלוקה של כ-20% תכנון, 60% ביצוע, 20% סיום ובדיקה, עם דקות בסוגריים.
- **תמיכה**: משהו מוחשי (פתיח משפט, בנק מילים, דוגמה). לא "עזרה מהמורה".
- **הרחבה**: שאלה או דרישה שמעמיקה את אותה משימה, לא משימה נוספת.

## שלבי העבודה

0. אם חסרים פרטים, שאל את הודעת השאלות מ"לפני שמתחילים", וחכה לתשובה.
1. תכנן את המשבצות לפי הכללים למעלה, ובדוק את הרשימה ב"לפני מסירה".
2. **בהרצת קוד אחת**: הגדר את `build`, את `board`, וקרא ל-`build(board, "<שם-באנגלית>.docx")`.
3. אם הודפסו בעיות, תקן את `board` והרץ שוב. אל תמסור קובץ עם בעיות.
4. מסור את הקובץ, ואחריו את שתי שורות ההודעה למורה.

```python
import re, zipfile

HEB = re.compile(r"[֐-׿]")
COLORS = ["DBEAFE", "DCFCE7", "FEF9C3", "FCE7F3", "EDE9FE", "FFEDD5", "CCFBF1", "FEE2E2", "E0F2FE"]

def build(board, out):
    problems = []
    esc = lambda s: str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    def run(text, size=11, bold=False, color=None):
        rtl = "<w:rtl/>" if HEB.search(str(text)) else ""
        b = "<w:b/><w:bCs/>" if bold else ""
        c = f'<w:color w:val="{color}"/>' if color else ""
        return (f'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>{b}{c}'
                f'<w:sz w:val="{size*2}"/><w:szCs w:val="{size*2}"/>{rtl}</w:rPr>'
                f'<w:t xml:space="preserve">{esc(text)}</w:t></w:r>')
    def para(runs, center=False, after=60, fill=None, newpage=False):
        pb = "<w:pageBreakBefore/>" if newpage else ""
        shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>' if fill else ""
        jc = '<w:jc w:val="center"/>' if center else ""
        return f'<w:p><w:pPr>{pb}{shd}<w:bidi/><w:spacing w:before="0" w:after="{after}"/>{jc}</w:pPr>{"".join(runs)}</w:p>'
    def cell(paras, width, fill=None, border="FFFFFF"):
        shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>' if fill else ""
        return f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/>{shd}</w:tcPr>{"".join(paras) or para([])}</w:tc>'
    def table(widths, rows, border, bsize, height=None, header=False):
        b = "".join(f'<w:{s} w:val="single" w:sz="{bsize}" w:space="0" w:color="{border}"/>'
                    for s in ["top", "left", "bottom", "right", "insideH", "insideV"])
        grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in widths)
        trs = ""
        for i, r in enumerate(rows):
            pr = "<w:cantSplit/>" + (f'<w:trHeight w:val="{height}" w:hRule="atLeast"/>' if height else "")
            pr += "<w:tblHeader/>" if header and i == 0 else ""
            trs += f"<w:tr><w:trPr>{pr}</w:trPr>{''.join(r)}</w:tr>"
        return (f'<w:tbl><w:tblPr><w:bidiVisual/><w:tblW w:w="{sum(widths)}" w:type="dxa"/>'
                f'<w:tblBorders>{b}</w:tblBorders><w:tblLayout w:type="fixed"/>'
                f'<w:tblCellMar><w:top w:w="100" w:type="dxa"/><w:left w:w="140" w:type="dxa"/>'
                f'<w:bottom w:w="100" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tblCellMar></w:tblPr>'
                f'<w:tblGrid>{grid}</w:tblGrid>{trs}</w:tbl>')

    W = 15704  # A4 landscape, 1 cm margins
    young = board.get("young", False)
    cols, cells = board["cols"], board["cells"]
    if len(cells) % cols:
        problems.append(f"{len(cells)} משבצות לא מתחלקות ל-{cols} טורים")
    nrows = -(-len(cells) // cols)
    body = para([run(board["title"], 22, True)], after=40)
    body += para([run("שם: ________________     כיתה: ________     תאריך: ________", 11)], after=80)
    body += para([run(board["rule"], 14, True, "FFFFFF")], after=120, fill="1F2933")
    cw = W // cols
    grid_rows = []
    for r in range(nrows):
        row = []
        for k in range(cols):
            i = r * cols + k
            if i >= len(cells):
                row.append(cell([], cw)); continue
            c = cells[i]
            ts, bs = (16, 14) if young else (13, 11)
            if len(str(c.get("task", "")).split()) > (15 if young else 35):
                problems.append(f"משבצת {i+1}: המשימה ארוכה מדי")
            ps = [para([run(f"{i+1}.", ts, True, "6B7280"), run("  " + c["title"], ts, True)], center=c.get("free", False), after=80),
                  para([run(c.get("task", ""), bs)], center=c.get("free", False), after=80)]
            if c.get("product"):
                ps.append(para([run("תוצר: ", bs, True), run(c["product"], bs)], after=80))
            meta = [run("זמן: ", bs - 1, True), run(c.get("time", ""), bs - 1)]
            if c.get("materials"):
                meta += [run("  ·  צריך: ", bs - 1, True), run(c["materials"], bs - 1)]
            ps.append(para(meta, center=c.get("free", False), after=0))
            row.append(cell(ps, cw, COLORS[i % len(COLORS)]))
        grid_rows.append(row)
    body += table([cw] * cols, grid_rows, "FFFFFF", 36, height=7600 // nrows)

    g = board["guide"]
    body += para([run("מדריך למורה: " + board["title"], 18, True)], after=80, newpage=True)
    for line in g["info"]:
        body += para([run("• " + line, 11)], after=30)
    body += para([], after=60)
    heads = ["משבצת", "מטרה", "שלבים ותוצר", "תמיכה", "הרחבה", "חומרים וזמן"]
    ws = [2000, 2600, 4000, 2600, 2600, 1904]
    rows = [[cell([para([run(h, 11, True, "FFFFFF")], after=0)], w, "1F2933") for h, w in zip(heads, ws)]]
    for r in g["rows"]:
        steps = [para([run(f"{j+1}. {s}", 10)], after=30) for j, s in enumerate(r.get("steps", []))]
        steps.append(para([run("תוצר: ", 10, True), run(r.get("product", ""), 10)], after=0))
        rows.append([cell([para([run(f'{r["n"]}. {r["title"]}', 10, True)], after=30), para([run(r.get("type", ""), 9, color="6B7280")], after=0)], ws[0]),
                     cell([para([run(r.get("goal", ""), 10)], after=0)], ws[1]),
                     cell(steps, ws[2]),
                     cell([para([run(r.get("support", ""), 10)], after=0)], ws[3]),
                     cell([para([run(r.get("extension", ""), 10)], after=0)], ws[4]),
                     cell([para([run(r.get("materials", ""), 10)], after=30), para([run("זמן: ", 10, True), run(r.get("time", ""), 10)], after=0)], ws[5])])
    body += table(ws, rows, "C5CAD3", 4, header=True)
    if g.get("assess"):
        body += para([], after=60) + para([run("איך בודקים: ", 11, True), run(g["assess"], 11)], after=0)
    if len(g["rows"]) != sum(1 for c in cells if not c.get("free")):
        problems.append("במדריך למורה חסרה שורה למשבצת")

    sect = ('<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>'
            '<w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567" w:header="0" w:footer="0" w:gutter="0"/><w:bidi/></w:sectPr>')
    ns = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
    doc = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {ns}><w:body>{body}{sect}</w:body></w:document>'
    styles = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles {ns}><w:docDefaults><w:rPrDefault><w:rPr>'
              '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/><w:lang w:val="he-IL" w:bidi="he-IL"/>'
              '</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:bidi/><w:spacing w:after="0" w:line="252" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>')
    ct = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
          '<Default Extension="xml" ContentType="application/xml"/>'
          '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
          '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>')
    rel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    rels = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            f'<Relationship Id="rId1" Type="{rel}/officeDocument" Target="word/document.xml"/></Relationships>')
    drels = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
             f'<Relationship Id="rId1" Type="{rel}/styles" Target="styles.xml"/></Relationships>')
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", ct); z.writestr("_rels/.rels", rels)
        z.writestr("word/document.xml", doc); z.writestr("word/styles.xml", styles)
        z.writestr("word/_rels/document.xml.rels", drels)
    print("בעיות:", problems or "אין")
    return problems
```

## לפני מסירה, בדוק

- [ ] מספר המשבצות מתחלק בדיוק במספר הטורים.
- [ ] הכלל מתאים לגודל הלוח.
- [ ] בלוח 3×3: אין שורה, טור או אלכסון עם שתי משבצות מאותה משפחה.
- [ ] הזמן בכל משבצת = משך כולל ÷ מספר המשבצות שמשלימים, והמשימה באמת נגמרת בו.
- [ ] אין אימוג'י או סימנים מיוחדים בשום טקסט.
- [ ] בכל משבצת תוצר אחד, וכל חומר זמין בכל כיתה או כתוב בתוך המשימה.
- [ ] במדריך שורה לכל משבצת (חוץ מבחירה חופשית), עם תמיכה והרחבה ממשיות.

## הודעה למורה אחרי הקובץ

כתוב בדיוק את שתי השורות האלה:

1. העמוד הראשון הוא הלוח לתלמידים (מודפס לרוחב), ואחריו המדריך למורה. להדפסת הלוח בלבד: הדפסת עמוד 1.
2. ל-Classroom או ל-Google Docs: מעלים את הקובץ ל-Drive, פותחים אותו, ובוחרים קובץ ← שמירה כ-Google Docs.

## טעויות נפוצות

- **רשימה של כרטיסים במקום טבלה.** זו בדיוק הבעיה שהסקיל הזה פותר.
- לוח שנכתב בצ'אט או ב-Canvas במקום כקובץ.
- שאלות בכמה הודעות, אחת אחרי השנייה, או שאלה נוספת אחרי שהמורה כבר ענה.
- כל משבצת לוקחת את כל זמן השיעור, למרות שהתלמיד משלים שלוש.
- משימת ציור או הקלטה שמסתיימת ב"וכתבו הסבר של פסקה".
- "דף העבודה המצורף" או "הכרטיסים שהמורה יחלק" כשאין כאלה.
