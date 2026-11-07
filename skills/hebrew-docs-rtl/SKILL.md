---
name: hebrew-docs-rtl
description: יוצר מסמכים בעברית כקובץ Word מימין לשמאל שנפתח נכון ב-Word וב-Google Docs, בלי טקסט הפוך, מספרים וסוגריים שקופצים, או טבלאות ורשימות שיוצאות משמאל לימין. השתמש כאשר המורה מבקש מסמך, מכתב להורים, סיכום, מערך שיעור, טבלה, מחוון, דף מידע או כל טקסט בעברית "לדוקס", "ל-Google Docs", "לוורד", "כקובץ" או "להדפסה", כאשר הוא מתלונן שהעברית יצאה הפוכה או משמאל לימין אחרי ייצוא ל-Docs, וכאשר סקיל אחר מבקש ליצור מסמך בעברית. למסמך עם משוואות או ניסוחים כימיים השתמש בסקיל format-equations-for-hebrew-worksheets.
---

# מסמכים בעברית ל-Docs ול-Word

כפתור "ייצוא ל-Docs" של ג'מיני לא שומר תמיד את כיוון הכתיבה: פסקאות יוצאות מיושרות לשמאל, טבלאות מתהפכות, ומילים באנגלית או מספרים קופצים לצד הלא נכון. לכן אל תסמוך עליו. צור קובץ Word בעצמך, לפי השלבים כאן.

אם יש במסמך משוואות או ניסוחים כימיים, עבור לסקיל **format-equations-for-hebrew-worksheets** ופעל לפיו במקום הסקיל הזה.

## שלבי העבודה

1. כתוב את כל המסמך כ-Markdown, לפי "כללי כתיבה" למטה.
2. **בהרצת קוד אחת בלבד:** הגדר את `build` שלמטה, שים את ה-Markdown במחרוזת raw (`r"""..."""`), וקרא ל-`build(md, "<שם-באנגלית>.docx")`. pandoc מותקן בסביבת הקוד. אל תבדוק קודם אם הוא קיים, ואל תבנה את הקובץ ידנית ב-python-docx.
3. אם הודפסו בעיות, תקן את ה-Markdown והרץ שוב.
4. מסור את קובץ ה-docx, ואחריו את שתי שורות ההודעה למורה. אל תכתוב את המסמך כולו גם בצ'אט.

```python
import re, subprocess, zipfile, shutil

HEB = re.compile(r"[֐-׿]")

def build(md, out):
    open("doc.md", "w", encoding="utf-8").write(md)
    subprocess.run(["pandoc", "doc.md", "-o", out], check=True)
    problems = []
    tmp = out + ".tmp"
    with zipfile.ZipFile(out) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "word/document.xml":
                xml = data.decode("utf-8")
                # קטע בלי עברית (מילה באנגלית, מספר, כתובת) לא מסומן מימין לשמאל, אחרת Word הופך בו את סדר המילים
                def fix_run(m):
                    run = m.group(0)
                    text = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", run, re.S))
                    if text.strip() and not HEB.search(text):
                        run = re.sub(r"<w:rtl\s*/>", "", run)
                    return run
                xml = re.sub(r"<w:r>.*?</w:r>", fix_run, xml, flags=re.S)
                # טבלה מימין לשמאל: העמודה הראשונה בצד ימין
                xml = re.sub(r"<w:tblPr>(?!(?:(?!</w:tblPr>).)*<w:bidiVisual)", "<w:tblPr><w:bidiVisual />", xml, flags=re.S)
                paras = re.findall(r"<w:p>(?:(?!</w:p>).)*?</w:p>", xml, re.S)
                heb_paras = [p for p in paras if HEB.search("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, re.S)))]
                missing = [p for p in heb_paras if "<w:bidi" not in p]
                if missing:
                    problems.append(f"{len(missing)} פסקאות בעברית בלי כיוון מימין לשמאל: חסר dir: rtl בראש ה-Markdown")
                print("פסקאות בעברית:", len(heb_paras), "| טבלאות:", xml.count("<w:tbl>"))
                data = xml.encode("utf-8")
            elif item.filename == "word/styles.xml":
                data = re.sub(r"<w:rFonts[^>]*/>", '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial" />',
                              data.decode("utf-8")).encode("utf-8")
            zout.writestr(item, data)
    shutil.move(tmp, out)
    print("בעיות:", problems or "אין")
    return problems
```

## כללי כתיבה ב-Markdown

- **בראש הקובץ**, בדיוק כך:
  ```
  ---
  dir: rtl
  lang: he
  ---
  ```
- **שורה ריקה בין כל שתי פסקאות.** שורות צמודות מתאחדות לפסקה אחת.
- כותרות עם `#` ו-`##`. רשימות עם `-` או `1.`, ושורה ריקה לפני הרשימה.
- טבלאות בתחביר Markdown רגיל (`| עמודה | עמודה |`). כתוב את העמודות בסדר הקריאה בעברית: העמודה הראשונה תופיע בצד ימין.
- **פסקה לא מתחילה במילה באנגלית או במספר.** אחרת היא עלולה להתיישר לשמאל. התחל במילה בעברית: "הכלי Gemini", "בשנת 2026", "סעיף 3".
- מילה או ביטוי באנגלית באמצע משפט: בלי סוגריים סביבם אם אפשר. סוגריים עם אנגלית בתוכם הם המקום שבו הכי הרבה דברים מתהפכים.
- טווחים ותאריכים: "בין 8:00 ל-9:30", "7.11.2026". לא "8:00-9:30".
- כתובות אינטרנט ומיילים בשורה משלהם או בסוף משפט, לא באמצע.
- **אל תכתוב בתוך ה-Markdown שלוש גרשיים הפוכים (\`\`\`).** הם שוברים את תצוגת הקוד.

## הודעה למורה אחרי הקובץ

כתוב בדיוק את שתי השורות האלה:

1. לעבודה ב-Google Docs: מעלים את הקובץ ל-Drive, פותחים אותו, ובוחרים קובץ ← שמירה כ-Google Docs.
2. אם שורה יצאה מיושרת לשמאל: מסמנים אותה, לוחצים על כפתור כיוון הטקסט מימין לשמאל ואחר כך על יישור לימין.

## אם המורה כבר ייצא ל-Docs והעברית הפוכה

אל תסביר איך לתקן שורה אחרי שורה. הצע לו אחד משני הדברים:

- להדביק כאן את הטקסט, ואתה תיצור ממנו קובץ Word תקין לפי השלבים למעלה.
- או לתקן בעצמו בבת אחת: Ctrl+A לסימון הכל, ואז כפתור כיוון הטקסט מימין לשמאל, ואז יישור לימין. (אם הכפתורים לא מופיעים: קובץ ← שפה ← עברית, או הגדרות ← הפעלת אמצעי בקרה מימין לשמאל.)
