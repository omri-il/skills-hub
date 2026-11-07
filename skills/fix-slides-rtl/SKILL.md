---
name: fix-slides-rtl
description: מתקן מצגת בעברית שיצאה משמאל לימין אחרי ייצוא מג'מיני ל-Google Slides, בקוד Apps Script מוכן שמיישר את כל השקפים בבת אחת. השתמש כאשר המורה כותב שהמצגת "הפוכה", "משמאל לימין", "יצאה LTR", "הטקסט בצד הלא נכון", "הבולטים בצד שמאל", "ייצאתי לסליידס והכל התהפך", וגם מיד אחרי שאתה יוצר מצגת בעברית שהמורה עומד לייצא ל-Google Slides.
---

# תיקון מצגת עברית שיצאה משמאל לימין

כשמייצאים מצגת בעברית מג'מיני ל-Google Slides, כל הפסקאות הופכות למשמאל לימין: הטקסט מיושר לשמאל, הבולטים בצד שמאל, וסימני פיסוק קופצים. לתקן שקף אחרי שקף לוקח הרבה זמן. הקוד כאן מתקן את כל המצגת בבת אחת.

## מתי להפעיל

- **המורה מתלונן** שהמצגת התהפכה: תן לו מיד את ההוראות ואת הקוד שלמטה. בלי הקדמות.
- **יצרת מצגת בעברית** (למשל ב-Canvas) והמורה עומד לייצא אותה: הוסף בסוף שורה אחת: "אחרי הייצוא ל-Slides הטקסט יופיע משמאל לימין. כתבו לי 'תקן את המצגת' ואתן לכם קוד שמתקן הכל בדקה."

## מה לכתוב למורה

כתוב את הצעדים בדיוק כך, ואחריהם את הקוד בבלוק קוד אחד שאפשר להעתיק:

1. פותחים את המצגת ב-Google Slides.
2. בתפריט למעלה: **תוספים ← Apps Script**. נפתחת לשונית חדשה.
3. מוחקים את מה שכתוב שם, ומדביקים את הקוד שלמטה.
4. לוחצים על **שמירה** (סמל הדיסקט), ואז על **הפעלה** (▶).
5. בפעם הראשונה גוגל מבקש הרשאה: בוחרים את החשבון, "מתקדם", "מעבר לפרויקט", ו"אישור". הקוד נוגע רק במצגת הזו.
6. חוזרים ללשונית של המצגת. כל הטקסט בעברית עכשיו מימין לשמאל.

אחר כך הוסף שתי הערות קצרות:
- אפשר להפעיל את הקוד שוב בכל פעם שמוסיפים שקפים. הוא לא מקלקל שקפים שכבר תוקנו.
- טבלאות: הקוד מיישר את הטקסט בתאים, אבל לא מחליף את סדר העמודות. אם עמודה צריכה לעבור לצד ימין, גוררים אותה ידנית.

## הקוד

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

## אם משהו לא עובד

- **"לא נמצאה פונקציה" או שהכפתור הפעלה אפור:** בתפריט הנפתח ליד ▶ צריך להיות `fixRtl`. בחרו אותה ולחצו שוב.
- **אין "תוספים" בתפריט, או ש-Apps Script חסום:** בחשבון של בית ספר המנהל לפעמים חוסם את זה. אפשר להעתיק את המצגת לחשבון פרטי (קובץ ← יצירת עותק), לתקן שם, ולהחזיר.
- **שגיאה אחרת:** בקש מהמורה להדביק כאן את השורה האדומה מהיומן שבתחתית המסך. תקן את הקוד לפיה ותן לו גרסה מתוקנת מלאה, לא רק את השורה שהשתנתה.
- **חלק מהשקפים עדיין משמאל לימין:** אלה בדרך כלל טקסט בתוך תמונה, או WordArt. אותם הקוד לא יכול לתקן. אמור את זה בפשטות.
