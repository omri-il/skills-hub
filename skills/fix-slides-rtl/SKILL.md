---
name: fix-slides-rtl
description: יוצר מצגות בעברית כקובץ PowerPoint שנפתח ב-Google Slides מימין לשמאל, במקום כפתור הייצוא ל-Slides שהופך את כל הטקסט למשמאל לימין. ומתקן מצגת שכבר יוצאה הפוכה, בקוד Apps Script מוכן. השתמש בכל פעם שאתה יוצר מצגת, שקפים או פרזנטציה בעברית, כאשר סקיל אחר מבקש לבנות מצגת, וכאשר המורה כותב שהמצגת "הפוכה", "משמאל לימין", "יצאה LTR", "הטקסט בצד הלא נכון", "הבולטים בצד שמאל" או "ייצאתי לסליידס והכל התהפך".
---

# מצגות בעברית שנפתחות מימין לשמאל

כפתור "ייצוא ל-Slides" של ג'מיני הופך כל פסקה בעברית למשמאל לימין: הטקסט רק מיושר לימין, אבל כיוון הפסקה הוא של אנגלית, ולכן פיסוק, מספרים ומילים באנגלית קופצים, והבולטים בצד שמאל. אי אפשר לשנות את הכפתור הזה.

לכן **אל תבנה מצגת בעברית ב-Canvas ואל תציע את כפתור הייצוא.** בנה אותה בעצמך כקובץ PowerPoint ‏(‎.pptx) בסביבת הקוד, לפי השלבים כאן. בקובץ הזה כל פסקה מוגדרת מימין לשמאל, ו-Google Slides שומר על זה כשפותחים אותו.

## שלבי העבודה

1. תכנן את תוכן השקפים (אם סקיל אחר קבע את התוכן, כמו create-lesson-slides, השתמש בתוכן שלו).
2. **בהרצת קוד אחת בלבד:** העתק את הקוד שלמטה כמו שהוא, הוסף אחריו קריאה ל-`build_deck(slides, "<שם-באנגלית>.pptx")` עם רשימת השקפים, והרץ. python-pptx מותקן בסביבת הקוד. אל תבדוק קודם אם הוא קיים, ואל תשנה את הפונקציות.
3. מסור את קובץ ה-pptx, ואחריו את שלוש שורות ההודעה למורה. אל תכתוב את כל השקפים גם בצ'אט.

## סוגי השקפים

כל שקף הוא מילון עם `"type"`, ו-`"notes"` להערות הדובר (מה המורה אומר, כמה זמן, התשובה הצפויה):

- `"cover"`: שקף פתיחה. `"title"`, ו-`"subtitle"` (לא חובה).
- `"content"`: שקף הסבר. `"title"` ו-`"points"`, עד חמש נקודות קצרות.
- `"question"`: שאלה לכיתה, גדולה במרכז השקף. `"label"` (למשל "חשבו לבד, דקה אחת") ו-`"question"`.
- `"task"`: משימה. `"title"`, `"steps"` (מה עושים, צעד אחרי צעד) ו-`"time"` (למשל "7 דקות").

כללי כתיבה לתוכן:
- נקודה עד כשמונה מילים. משפטים מלאים הולכים להערות הדובר.
- שקף לא מתחיל במילה באנגלית או במספר. "שרשרת מעבר אלקטרונים (ETC)" ולא "ETC: שרשרת...".
- אל תכתוב תשובה לשאלה על אותו שקף. התשובה בהערות הדובר או בשקף הבא.

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR
from pptx.oxml.ns import qn

FONT = "Arial"
INK, MUTED, ACCENT, BG_SOFT = "1F2937", "4B5563", "0B6BCB", "EEF4FB"

def _rtl(p, size, bold=False, color=INK, align="r"):
    pPr = p._p.get_or_add_pPr()
    pPr.set("rtl", "1")       # כיוון הפסקה: מימין לשמאל
    pPr.set("algn", align)    # r = ימין, ctr = מרכז
    for r in p.runs:
        r.font.size, r.font.bold, r.font.name = Pt(size), bold, FONT
        r.font.color.rgb = RGBColor.from_string(color)
        rPr = r._r.get_or_add_rPr()
        rPr.set("lang", "he-IL")
        cs = rPr.find(qn("a:cs"))
        if cs is None:
            cs = rPr.makeelement(qn("a:cs"), {})
            rPr.append(cs)
        cs.set("typeface", FONT)

def _text(slide, x, y, w, h, lines, size, bold=False, color=INK, align="r", middle=False):
    tf = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h)).text_frame
    tf.word_wrap = True
    if middle:
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.space_after = Pt(size * 0.6)
        _rtl(p, size, bold, color, align)

def _rect(slide, x, y, w, h, color):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid()
    s.fill.fore_color.rgb = RGBColor.from_string(color)
    s.line.fill.background()

def build_deck(slides, out):
    prs = Presentation()
    prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
    for s in slides:
        slide = prs.slides.add_slide(prs.slide_layouts[6])
        kind = s.get("type", "content")
        if kind == "cover":
            _rect(slide, 0, 0, 13.333, 7.5, BG_SOFT)
            _rect(slide, 12.733, 0, 0.6, 7.5, ACCENT)
            _text(slide, 0.9, 2.2, 11.4, 1.8, [s["title"]], 48, bold=True, middle=True)
            if s.get("subtitle"):
                _text(slide, 0.9, 4.1, 11.4, 1.0, [s["subtitle"]], 26, color=MUTED)
        elif kind == "question":
            _rect(slide, 0, 0, 13.333, 7.5, BG_SOFT)
            _text(slide, 0.9, 0.7, 11.5, 0.7, [s.get("label", "שאלה לכיתה")], 22, bold=True, color=ACCENT)
            _text(slide, 0.9, 1.6, 11.5, 4.8, [s["question"]], 40, bold=True, align="ctr", middle=True)
        else:
            _rect(slide, 12.633, 0.65, 0.12, 0.9, ACCENT)
            _text(slide, 0.9, 0.55, 11.5, 1.1, [s["title"]], 38, bold=True, middle=True)
            lines = ["• " + p for p in s.get("points", [])]
            if kind == "task":
                lines = [f"{i}. {t}" for i, t in enumerate(s.get("steps", []), 1)]
                if s.get("time"):
                    _text(slide, 0.9, 6.4, 11.5, 0.6, ["⏱ " + s["time"]], 22, bold=True, color=ACCENT)
            _text(slide, 0.9, 1.9, 11.5, 4.4, lines, 26)
        if s.get("notes"):
            tf = slide.notes_slide.notes_text_frame
            tf.text = s["notes"]
            for p in tf.paragraphs:
                _rtl(p, 14)
    prs.save(out)
    print("שקפים:", len(prs.slides), "| קובץ:", out)
```

## הודעה למורה אחרי הקובץ

כתוב בדיוק את שלוש השורות האלה:

1. מורידים את הקובץ, וגוררים אותו ל-Google Drive.
2. לוחצים עליו פעמיים ובוחרים "פתיחה באמצעות Google Slides". הטקסט כבר מימין לשמאל.
3. כדי לערוך ולשתף כמצגת Google: קובץ ← שמירה כ-Google Slides.

## מצגת שכבר יוצאה הפוכה

אם המורה כבר ייצא מצגת מ-Canvas והיא משמאל לימין, יש שתי דרכים. הצע את שתיהן בקצרה:

- **לבנות מחדש:** המורה מדביק כאן את תוכן השקפים (או מעלה את המצגת), ואתה בונה אותה כקובץ PowerPoint לפי השלבים למעלה.
- **לתקן את הקיימת בקוד:** תן לו את הצעדים ואת הקוד שלמטה.

צעדים למורה:

1. פותחים את המצגת ב-Google Slides.
2. בתפריט למעלה: **תוספים ← Apps Script**. נפתחת לשונית חדשה.
3. מוחקים את מה שכתוב שם, ומדביקים את הקוד שלמטה.
4. לוחצים על **שמירה** (סמל הדיסקט), ואז על **הפעלה** (▶).
5. בפעם הראשונה גוגל מבקש הרשאה: בוחרים את החשבון, "מתקדם", "מעבר לפרויקט", ו"אישור". הקוד נוגע רק במצגת הזו.
6. חוזרים ללשונית של המצגת. כל הטקסט בעברית עכשיו מימין לשמאל.

```javascript
// מיישר מימין לשמאל כל פסקה שיש בה עברית: תיבות טקסט, כותרות, טבלאות, קבוצות והערות הדובר.
function fixRtl() {
  const HEB = /[֐-׿]/;
  const pres = SlidesApp.getActivePresentation();
  let fixed = 0;

  function fixText(textRange) {
    textRange.getParagraphs().forEach(function (p) {
      const range = p.getRange();
      if (!HEB.test(range.asString())) return;            // פסקה באנגלית בלבד נשארת כמו שהיא
      const style = range.getParagraphStyle();
      const align = style.getParagraphAlignment();
      style.setTextDirection(SlidesApp.TextDirection.RIGHT_TO_LEFT);
      if (align !== SlidesApp.ParagraphAlignment.CENTER &&
          align !== SlidesApp.ParagraphAlignment.JUSTIFIED) {
        style.setParagraphAlignment(SlidesApp.ParagraphAlignment.START); // START במשפט מימין לשמאל = ימין
      }
      fixed++;
    });
  }

  function fixElement(el) {
    try {
      switch (el.getPageElementType()) {
        case SlidesApp.PageElementType.SHAPE:
          fixText(el.asShape().getText());
          break;
        case SlidesApp.PageElementType.TABLE: {
          const table = el.asTable();
          for (let r = 0; r < table.getNumRows(); r++) {
            const row = table.getRow(r);
            for (let c = 0; c < row.getNumCells(); c++) {
              try { fixText(row.getCell(c).getText()); } catch (e) {} // תא ממוזג
            }
          }
          break;
        }
        case SlidesApp.PageElementType.GROUP:
          el.asGroup().getChildren().forEach(fixElement);
          break;
      }
    } catch (e) {
      Logger.log('דילגתי על רכיב: ' + e);
    }
  }

  pres.getSlides().forEach(function (slide) {
    slide.getPageElements().forEach(fixElement);
    try { fixText(slide.getNotesPage().getSpeakerNotesShape().getText()); } catch (e) {}
  });

  Logger.log('תוקנו ' + fixed + ' פסקאות ב-' + pres.getSlides().length + ' שקפים.');
}
```

הקוד מיישר את הטקסט בתאי טבלה, אבל לא מחליף את סדר העמודות.

### אם הקוד לא עובד

- **"לא נמצאה פונקציה" או שכפתור ההפעלה אפור:** בתפריט הנפתח ליד ▶ צריך להיות `fixRtl`. בחרו אותה ולחצו שוב.
- **אין "תוספים" בתפריט, או ש-Apps Script חסום:** בחשבון של בית ספר המנהל לפעמים חוסם את זה. אז עדיף לבנות את המצגת מחדש כקובץ PowerPoint.
- **שגיאה אחרת:** בקש מהמורה להדביק כאן את השורה האדומה מהיומן שבתחתית המסך, ותן לו גרסה מתוקנת מלאה של הקוד.
- **חלק מהשקפים עדיין משמאל לימין:** בדרך כלל זה טקסט בתוך תמונה, שאותו הקוד לא יכול לתקן.
