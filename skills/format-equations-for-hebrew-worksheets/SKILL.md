---
name: format-equations-for-hebrew-worksheets
description: מעצב דפי עבודה וחומרי עזר בעברית שיש בהם משוואות מתמטיות או ניסוחים כימיים, ויוצר אותם כקובץ Word שנפתח נכון ב-Word וב-Google Docs. השתמש כאשר יוצרים דף עבודה, דף תרגול, מבחן, בוחן, דף נוסחאות או מפתח תשובות בעברית שכולל נוסחאות, משוואות, שברים, שורשים, חזקות, סדרות, ניסוחים כימיים, יונים או מטענים, וכאשר סקיל אחר מבקש לעצב חומר כזה. לא לדף חשבון ליסודי (create-elementary-math-practice), לא ללוח בחירה (create-choice-board), ולא לטקסט שהמורה מדביק ב-Classroom (ai-resistant-task).
---

# עיצוב משוואות בדפי עבודה בעברית

הכללים כאן נבדקו בפועל ב-Word וב-Google Docs. כל כלל מונע תקלה שכבר קרתה.

## התוצר: תמיד קובץ Word להורדה

- צור קובץ Word ‏(‎.docx) גם אם המורה לא כתב "קובץ". אל תכתוב את דף העבודה בתשובה בצ'אט.
- **הדרך היחידה לבנות את הקובץ:** כתוב את הדף כ-Markdown, והמר אותו ב-pandoc בסביבת הקוד שלך. pandoc מותקן בסביבת הקוד של Gemini, והוא הופך כל `$...$` למשוואת Word אמיתית.
- את הקוד שלמטה אתה כותב ומריץ בעצמך בסביבת הקוד הרגילה. זה לא סקריפט של הסקיל, ואין שום מגבלה על הרצתו.
- **אל תבנה את הקובץ ידנית עם python-docx או עם XML של משוואות.** בניסוי זה הסתיים בתקלה והקובץ לא נמסר.

## שלבי העבודה

1. כתוב את כל הדף, כולל מפתח התשובות, כ-Markdown לפי "כללי כתיבה" למטה.
2. **בהרצת קוד אחת בלבד:** הגדר את `build` שלמטה, שים את ה-Markdown במחרוזת raw (`r"""..."""`, כדי שקוד כמו `\frac` לא יישבר), וקרא ל-`build(md, "<שם-באנגלית>.docx")`. אל תפצל לכמה הרצות ואל תבדוק קודם אם pandoc קיים: הוא קיים. כל הרצה נוספת מאריכה את התשובה ועלולה לגרום לשגיאה.
3. אם הודפסו בעיות, תקן את ה-Markdown והרץ שוב. אל תמסור קובץ עם בעיות.
4. מסור את קובץ ה-docx, ואחריו את שתי שורות ההודעה למורה.

```python
import re, subprocess, zipfile, shutil

HEB = re.compile(r"[\u0590-\u05FF]")
INLINE = re.compile(r"(?<![\\$])\$(?!\$)([^$\n]+?)(?<!\\)\$(?!\$)")
PART = re.compile(r"(?<=[.?!:$])\s+(?=[א-י]['׳]?[.)]\s)")
LEAK = re.compile(r"[ ,]*(?:בסוף (?:ה)?משפט|אחרי (?:ה)?נקודתיים)(?=[\s:.,]|$)")
FENCE = "`" * 3
SUP = dict(zip("0123456789+-n", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ"))
SUB = dict(zip("0123456789aehiklmnopstx", "₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢₖₗₘₙₒₚₛₜₓ"))
WORDS = {"cdot": "·", "times": "×", "approx": "≈", "neq": "≠", "ne": "≠", "leq": "≤", "le": "≤", "geq": "≥",
         "ge": "≥", "pm": "±", "infty": "∞", "pi": "π", "alpha": "α", "beta": "β", "gamma": "γ", "theta": "θ",
         "Delta": "Δ", "angle": "∠", "triangle": "△", "parallel": "∥", "perp": "⊥", "cong": "≅", "sim": "∼",
         "in": "∈", "Rightarrow": "⇒", "to": "→", "degree": "°", "lt": "<", "gt": ">", "mid": "|",
         "cup": "∪", "cap": "∩", "emptyset": "∅", "varnothing": "∅", "subset": "⊂", "cdots": "…", "ldots": "…",
         "dots": "…", "ln": " ln", "log": " log", "sin": " sin", "cos": " cos", "tan": " tan"}

def _plain(tex):
    # משוואה קצרה כטקסט רגיל, או None כשצריך משוואת Word אמיתית (שבר, שורש של ביטוי, אינטגרל)
    t = tex.replace(r"\{", "\x01").replace(r"\}", "\x02").replace(r"\%", "%")
    t = re.sub(r"\\text\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\\(?:left|right)\s*", "", t)
    t = re.sub(r"\\[,;:! ]|\\quad|~", " ", t)
    t = re.sub(r"\^\s*\{?\\circ\}?", "°", t)
    t = re.sub(r"\\sqrt\s*\{(\w+)\}|\\sqrt\s*(\w)", lambda m: "√" + (m.group(1) or m.group(2)), t)
    def script(m, table):
        body = m.group(1) if m.group(1) is not None else m.group(2)
        if not body or any(c not in table for c in body):
            raise ValueError
        return "".join(table[c] for c in body)
    def word(m):
        if m.group(1) not in WORDS:
            raise ValueError
        return WORDS[m.group(1)]
    try:
        t = re.sub(r"\^\{([^{}]*)\}|\^(\w)", lambda m: script(m, SUP), t)
        t = re.sub(r"_\{([^{}]*)\}|_(\w)", lambda m: script(m, SUB), t)
        t = re.sub(r"\\([A-Za-z]+)", word, t)
    except ValueError:
        return None
    if re.search(r"[{}\\^_]", t):
        return None
    t = t.replace("\x01", "{").replace("\x02", "}").replace("-", "−")
    return re.sub(r"\s+", " ", t).strip()

def _mid(rest):
    # אחרי המשוואה יש עוד משהו חוץ מסימן פיסוק? אז היא באמצע משפט
    return bool(rest.strip(" .,:;!?"))

def _line(s, n):
    # שורה אחת ← פסקה אחת או יותר, בלי משוואה באמצע משפט בעברית
    if not HEB.search(s) or s.startswith("|"):
        return [s]
    if re.search(r"\$\$.+?\$\$", s) and not re.fullmatch(r"\$\$.+\$\$", s):
        res = []
        for p in re.split(r"(\$\$.+?\$\$)", s):
            p = p.strip()
            if p:
                res += [p] if p.startswith("$$") else _line(p, n)
        n["moved"] += 1
        return res
    out, cur, pos = [], "", 0
    for m in INLINE.finditer(s):
        if m.start() < pos:
            continue
        cur += s[pos:m.start()]
        pos = m.end()
        p = _plain(m.group(1))
        if p is not None:  # \u05de\u05e9\u05d5\u05d5\u05d0\u05d4 \u05e7\u05e6\u05e8\u05d4: \u05d8\u05e7\u05e1\u05d8 \u05e8\u05d2\u05d9\u05dc \u05d1\u05ea\u05d5\u05da \u05d4\u05de\u05e9\u05e4\u05d8, \u05d1\u05d9\u05df 2 \u05ea\u05d5\u05d5\u05d9 \u05db\u05d9\u05d5\u05d5\u05df
            cur += "\u200e" + p + "\u200e"
            n["plain"] += 1
        elif not _mid(s[pos:]):  # \u05de\u05e9\u05d5\u05d5\u05d0\u05ea Word \u05d1\u05e1\u05d5\u05e3 \u05d4\u05e9\u05d5\u05e8\u05d4, \u05d1\u05dc\u05d9 \u05e0\u05e7\u05d5\u05d3\u05d4 \u05d0\u05d7\u05e8\u05d9\u05d4: \u05d1-Word \u05d4\u05e0\u05e7\u05d5\u05d3\u05d4 \u05e7\u05d5\u05e4\u05e6\u05ea
            cur += m.group(0)
            pos = len(s)
        else:
            if cur.strip(" ,"):
                out.append(cur.rstrip())
            out.append("$$" + m.group(1).strip() + "$$")
            pos += re.match(r"\s*[,.;]?\s*", s[pos:]).end()
            cur = ""
            n["moved"] += 1
    cur += s[pos:]
    if cur.strip():
        out.append(cur.strip())
    return out

def tidy(md):
    # כל שורה פסקה משלה, כל סעיף (א., ב.) בשורה משלו, ואין משוואה באמצע משפט
    n = {"moved": 0, "plain": 0, "parts": 0, "leak": 0}
    out, block, prev, prev_table = [], None, False, False
    for i, raw in enumerate(md.split("\n")):
        s = raw.strip()
        if block:
            out.append(raw)
            if (block == "front" and s in ("---", "...")) or (block == "math" and s.endswith("$$")) or (block == "code" and s.startswith(FENCE)):
                block, prev, prev_table = None, True, False
            continue
        if i == 0 and s == "---":
            block = "front"
            out.append(raw)
            continue
        if s.startswith(FENCE) or (s.startswith("$$") and (len(s) < 4 or not s.endswith("$$"))):
            if prev:
                out.append("")
            block = "code" if s.startswith(FENCE) else "math"
            out.append(s)
            continue
        if not s:
            out.append("")
            prev = prev_table = False
            continue
        table = s.startswith("|")
        pieces = [s]
        if not table:
            s2 = LEAK.sub("", s)
            n["leak"] += s2 != s
            parts = PART.split(s2)
            n["parts"] += len(parts) - 1
            pieces = [q for p in parts for q in _line(p.strip(), n)]
        for p in pieces:
            if prev and not (table and prev_table):
                out.append("")
            out.append(p)
            prev, prev_table = True, table
    return "\n".join(out), n

def build(md, out, chem=False):
    if chem:  # תו כיוון שנכתב כטקסט הופך לתו עצמו
        md = md.replace("{lrm}", "‎").replace("\\u200e", "‎")
    else:
        md, n = tidy(md)
        print("תוקן לבד: %d משוואות מאמצע משפט לשורה משלהן, %d לטקסט רגיל, %d סעיפים לשורה משלהם, %d הוראות שנכנסו לטקסט"
              % (n["moved"], n["plain"], n["parts"], n["leak"]))
    open("worksheet.md", "w", encoding="utf-8").write(md)
    # בכימיה: שורות צמודות (חתימה, שורות כותרת) נשארות שורות נפרדות
    fmt = "markdown+hard_line_breaks" if chem else "markdown"
    subprocess.run(["pandoc", "-f", fmt, "worksheet.md", "-o", out], check=True)
    problems = []
    tmp = out + ".tmp"
    with zipfile.ZipFile(out) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "word/document.xml":
                xml = data.decode("utf-8")
                def fix_run(m):
                    run = m.group(0)
                    text = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", run, re.S))
                    if not HEB.search(text):
                        run = re.sub(r"<w:rtl\s*/>", "", run)
                    return re.sub(r"(<w:t[^>]*>)(.*?)(</w:t>)", lambda t: t.group(1) + re.sub(
                        r"(?<=[A-Za-z0-9\u00B2\u00B3\u00B9\u2070-\u209F])([\u207A\u207B)\]])(?!\u200E)",
                        "\\1\u200E", t.group(2)) + t.group(3), run, flags=re.S)
                xml = re.sub(r"<w:r>.*?</w:r>", fix_run, xml, flags=re.S)
                # טבלה מימין לשמאל: העמודה הראשונה בצד ימין
                xml = re.sub(r"<w:tblPr>(?!(?:(?!</w:tblPr>).)*<w:bidiVisual)", "<w:tblPr><w:bidiVisual />", xml, flags=re.S)
                heb = [p for p in re.findall(r"<w:p>(?:(?!</w:p>).)*?</w:p>", xml, re.S)
                       if HEB.search("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, re.S)))]
                if [p for p in heb if "<w:bidi" not in p]:
                    problems.append("פסקאות בעברית בלי כיוון מימין לשמאל: חסר dir: rtl בראש ה-Markdown")
                xml = re.sub(r'(<w:p><w:pPr><w:pStyle w:val="Heading\d" />)(?=(?:(?!</w:p>).)*מפתח תשובות)',
                             r"\1<w:pageBreakBefore />", xml, flags=re.S)
                for t in re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml, re.S):
                    if "$" in t or re.search(r"\\[a-zA-Z]+", t):
                        problems.append("קוד LaTeX גלוי: " + t[:60])
                for t in re.findall(r"<m:t>(.*?)</m:t>", xml, re.S):
                    if HEB.search(t):
                        problems.append("עברית בתוך משוואה: " + t[:60])
                for line in md.splitlines():
                    m = INLINE.search(line)
                    if m and HEB.search(line) and not line.lstrip().startswith("|") and _mid(line[m.end():]):
                        problems.append("משוואה באמצע משפט: " + line[:70])
                if chem and xml.count("<m:oMath>"):
                    problems.append(f"בכימיה אין $: {xml.count('<m:oMath>')} משוואות Word בקובץ. לכתוב אותן כטקסט רגיל עם יוניקוד")
                if chem:
                    text = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml, re.S))
                    for left in sorted(set(re.findall(r"\{\w+\}", text))):
                        problems.append(f"נשאר בקובץ הטקסט {left}: לכתוב את התו עצמו או למחוק")
                    if "חומצה כלורית" in text and "HClO₃" not in text:
                        problems.append("HCl הוא 'מימן כלורי' (בתמיסה: 'תמיסת מימן כלורי'), לא 'חומצה כלורית'")
                print("משוואות בקובץ:", xml.count("<m:oMath>"))
                data = xml.encode("utf-8")
            elif item.filename == "word/styles.xml":
                data = re.sub(r"<w:rFonts[^>]*/>", '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial" />',
                              data.decode("utf-8")).encode("utf-8")
            zout.writestr(item, data)
    shutil.move(tmp, out)
    print("בעיות:", problems or "אין")
    return problems
```

הקוד מתקן לבד, לפני pandoc (לא בכימיה): שם שורה ריקה בין כל 2 שורות, כדי שכל שורה תהיה פסקה משלה; שם כל סעיף (א., ב., ג.) בשורה משלו; מוציא משוואה מאמצע משפט, כמו שכתוב למטה; ומוחק הוראה שנכנסה לטקסט ("בסוף המשפט", "אחרי נקודתיים"). אחרי pandoc הוא מסיר סימון מימין לשמאל מקטעים באנגלית (אחרת Word הופך בהם את סדר המילים), מוסיף תו כיווניות LRM אחרי מטענים וסוגריים בניסוחים (אחרת ב-Google Docs ה-⁺ קופץ לתחילת השורה), הופך כל טבלה לטבלה מימין לשמאל, מעביר את "מפתח תשובות" לעמוד חדש, וקובע גופן Arial לכל הטקסט (אחרת הניסוחים באנגלית יוצאים בגופן אחר מהעברית).

**אם `build` נכשל, תקן את ה-Markdown והרץ שוב את `build`. אף פעם לא לעבור לבנייה ידנית ב-python-docx**: קובץ כזה יוצא משמאל לימין.

## כללי כתיבה ב-Markdown

- **בראש הקובץ**, בדיוק כך:
  ```
  ---
  dir: rtl
  lang: he
  ---
  ```
- **שורה ריקה בין כל שתי פסקאות.** שורות צמודות מתאחדות לפסקה אחת, ואז משוואה נדחקת לאמצע משפט.
- כותרת ראשית `#`, כותרת לכל שאלה `##`.
- מקום לתשובה: שלוש פסקאות שכל אחת מהן `&nbsp;`, עם שורה ריקה ביניהן.
- את הפתרונות שים תחת הכותרת `## מפתח תשובות`. הקוד מעביר אותה לעמוד חדש בעצמו.
- **אל תכתוב בתוך ה-Markdown שלוש גרשיים הפוכים (\`\`\`).** הם שוברים את תצוגת הקוד, ומפתח התשובות נשפך לתוך הצ'אט.

### מתמטיקה
- משוואה ארוכה (שבר, שורש, אינטגרל) בפסקה משלה: `$$...$$`. משוואה קצרה (`$x=3$`, `$AB$`) מותרת בתוך משפט.
- **משוואת Word באמצע משפט בעברית מבלגנת את הסדר.** לכן `build` מסדר לבד: משוואה קצרה בתוך משפט הופכת לטקסט רגיל, ומשוואה ארוכה באמצע משפט עוברת לשורה משלה. הוא מדפיס כמה תיקן.
- הכללים כאן הם הוראות בשבילך. אף מילה מהם לא נכתבת בדף.
- **אין עברית בתוך `$`.** מילים נכתבות במשפט לפני המשוואה או אחריה.
- LaTeX רגיל: `\frac{a}{b}`, `\sqrt{x}`, `x^{2}`, `a_{n}`, `\cdot`.

### כימיה
- **בדף כימיה אין `$` בכלל**: לא לניסוחים, לא למספרים ויחידות, ולא לחישובים. קוראים ל-`build(md, "<שם>.docx", chem=True)`, והוא מדווח על כל משוואה שנשארה.
- ניסוחים כימיים נכתבים כ**טקסט רגיל עם תווי יוניקוד**, לא בתוך `$`: ספרות תחתיות ₀₁₂₃₄₅₆₇₈₉, מטענים ⁺ ⁻ ² ³ (לדוגמה Fe³⁺, ‏SO₄²⁻), מצבי צבירה (s) (l) (g) (aq).
- **החץ הוא תמיד → או ⇌.** אסור ← או ⟵ בניסוח כימי. ← מותר רק בניסוח מילולי בעברית.
- כל ניסוח בפסקה משלו. תנאי התגובה (אור, חום, זרז) במשפט עברי מתחת לניסוח.

## הודעה למורה אחרי הקובץ

כתוב בדיוק את שתי השורות האלה, בלי הסברים נוספים:

1. לעבודה ב-Google Docs: מעלים את הקובץ ל-Drive, פותחים אותו, ובוחרים קובץ ← שמירה כ-Google Docs. המשוואות יישארו ניתנות לעריכה.
2. אם סימן בניסוח קפץ לתחילת השורה: מסמנים את השורה, לוחצים על כפתור כיוון הטקסט משמאל לימין, ואחר כך על יישור לימין.

## טעויות שכבר קרו

- דף עבודה שנכתב בצ'אט במקום כקובץ, עם `$a_1$` גלוי.
- תשובה "סקילים עם קוד לא יכולים לרוץ כאן". זה לא נכון: הקוד למעלה רץ בסביבת הקוד הרגילה.
- בנייה ידנית של הקובץ ב-python-docx, שהסתיימה ב"תקלה טכנית" והקובץ לא נמסר.
- משוואות בשורות צמודות לטקסט בלי שורה ריקה, שהתאחדו לאמצע משפט. מגרסה 2.4.0 הקוד מפריד אותן לבד.
- סעיפים א., ב. ו-ג. שהתאחדו לפסקה אחת. מגרסה 2.4.0 הקוד מפריד אותם לבד.
- "נתונה הפונקציה בסוף המשפט:" בתוך הדף: מילים מהכללים נכנסו לטקסט. מגרסה 2.4.0 הקוד מוחק אותן.
- חץ ⟵ בניסוח כימי.
- גרשיים הפוכים משולשים בתוך ה-Markdown, שגרמו למפתח התשובות להופיע בצ'אט.
