---
name: verify-solutions
description: בודק שאלות ומפתחות תשובות במתמטיקה ובכימיה לפני שהם מגיעים לתלמידים, פותר כל שאלה מחדש בשתי דרכים, ומדווח על טעויות ועל שאלות פגומות. השתמש כאשר נוצר דף עבודה, מבחן או מפתח תשובות, כאשר מורה מבקש לבדוק פתרונות, תשובות, מפתח או חומר קיים שהעלה, או כאשר מורה שואל אם יש טעויות בשאלות או בתשובות. לא למשוב על עבודה של תלמיד, לזה יש את feedback-by-rubric.
---

# בדיקת שאלות ומפתחות תשובות

## עיקרון

טעות במפתח תשובות פוגעת יותר מכל טעות עיצוב. לכן כל שאלה נבדקת בנפרד, **בלי להסתכל קודם על התשובה במפתח**.

## תהליך לכל שאלה

העתק את הרשימה ועקוב אחריה:

- [ ] **בדוק את השאלה עצמה:** יש בה כל הנתונים הדרושים? יש לה תשובה אחת ברורה (או כמה, אם זו הכוונה)? הניסוח לא דו-משמעי?
- [ ] **פתור מחדש** בלי להסתכל במפתח.
- [ ] **אמת בדרך שנייה:**
  - משוואה: הצב את הפתרון במשוואה המקורית.
  - פונקציה או גרף: בדוק נקודה אחת לפחות.
  - חישוב בכימיה: בדיקת יחידות, והערכת סדר גודל.
  - ניסוח כימי: ספירת אטומים בשני הצדדים, ובניסוח יוני גם סכום מטענים.
- [ ] **השווה למפתח.** אם יש הבדל, מצא מי צודק לפני שמשנים משהו.
- [ ] **בדיקה ב-sympy, בקוד:** חובה בכל דף במתמטיקה שאתה יוצר. פרטים בפרק הבא. אם אין אפשרות להריץ קוד, כתוב את זה, ואל תטען שבוצע חישוב.

## בדיקה ב-sympy: בלי בדיקה אין קובץ

"בדקתי" בלי קוד לא מספיק. בבדיקות קודמות Gemini כתב "כל התשובות נבדקו", והמפתח היה שגוי: נקודת פיתול חסרה, וזווית לא נכונה בהוכחה.

1. **באותה הרצת קוד שבונה את הקובץ, לפני הבנייה:** העתק את הקוד למטה, תו בתו.
2. **לכל שאלה ולכל סעיף (א., ב.)** קרא ל-`check(q, key, truth)`:
   - `q` מספר השאלה כטקסט: `"3"`, `"5ב"`. בדף עם 2 גרסאות: `"בסיס 3"`, `"מתקדם 3"`.
   - `key` התשובה שכתובה במפתח.
   - `truth` התשובה ש-sympy חישב **מהנתונים של השאלה**: `sp.solve`, `solutions`, `sp.diff`, `sp.integrate`, הצבה. אף פעם לא מספר שהעתקת מהמפתח.
3. **"מצאו את כל..."** (כל הפתרונות, כל נקודות החיתוך, כל נקודות הקיצון, נקודות פיתול): `key` הוא הרשימה המלאה מהמפתח, ו-`truth` הוא `solutions(...)`, `extrema(...)` או `inflections(...)`. רשימה `[...]` = כל התשובות, בלי חשיבות לסדר. זוג סדור (נקודה) = `( , )`.
4. **אינטגרל לא מסוים:** `check(q, sp.diff(key, x), integrand)`, כי הקבוע C לא משנה את הנגזרת.
5. **שאלת הוכחה:** לכל שוויון של זוויות או קטעים שהמפתח כותב, `check` על נקודות הציור: `check("1", angle(D, C, B), angle(A, C, B))`. השתמש בשיעורים של `[draw geo ...]`.
6. **שאלה מילולית:** בנה את המשוואה מהטקסט ב-sympy, ופתור אותה.
7. **אם הודפס ✗:** תקן את המפתח (או את השאלה) והרץ שוב. הקוד שבונה את הקובץ לא שומר קובץ כשחסרה בדיקה לשאלה, או כשבדיקה נכשלה.

```python
import math
import sympy as sp

x = sp.Symbol("x")
CHECKS = []

def _key(v):
    try:
        return float(sp.re(sp.N(v[0] if isinstance(v, tuple) else v)))
    except Exception:
        return 0.0

def _same(a, b, tol):
    if isinstance(a, (list, set)) or isinstance(b, (list, set)):
        if not (isinstance(a, (list, set)) and isinstance(b, (list, set))):
            return False
        a, b = sorted(a, key=_key), sorted(b, key=_key)
        return len(a) == len(b) and all(_same(p, q, tol) for p, q in zip(a, b))
    if isinstance(a, tuple) or isinstance(b, tuple):
        return isinstance(a, tuple) and isinstance(b, tuple) and len(a) == len(b) and all(_same(p, q, tol) for p, q in zip(a, b))
    if isinstance(a, (str, bool)) or isinstance(b, (str, bool)):
        return str(a) == str(b)
    a, b = sp.sympify(a, locals={"x": x}), sp.sympify(b, locals={"x": x})
    try:
        if sp.simplify(a - b) == 0:
            return True
    except Exception:
        pass
    free = sorted(a.free_symbols | b.free_symbols, key=str)
    for t in ((0.37, 1.3, 2.9) if free else (0,)):
        try:
            va, vb = complex(sp.N(a.subs({s: t for s in free}))), complex(sp.N(b.subs({s: t for s in free})))
        except TypeError:
            return False
        if abs(va - vb) > tol * max(1, abs(vb)):
            return False
    return True

def check(q, key, truth, tol=0.006):
    # q: מספר השאלה. key: מה שכתוב במפתח. truth: מה ש-sympy חישב מהנתונים
    ok = _same(key, truth, tol)
    CHECKS.append({"q": str(q), "ok": ok})
    print("✓" if ok else "✗ טעות במפתח:", "שאלה", q, "| במפתח:", key, "| sympy:", truth)
    return ok

def solutions(eq, var=x, lo=-100, hi=100):
    # כל הפתרונות הממשיים של eq = 0 בין lo ל-hi, ברשימה ממוינת
    if isinstance(eq, sp.Equality):
        eq = eq.lhs - eq.rhs
    s = sp.solveset(eq, var, sp.Interval(lo, hi))
    if s is sp.S.EmptySet:
        return []
    if isinstance(s, sp.FiniteSet):
        return sorted(s, key=_key)
    f = sp.lambdify(var, eq, "math")
    def val(t):
        try:
            v = f(t)
            return v if isinstance(v, (int, float)) and math.isfinite(v) else None
        except (ValueError, ZeroDivisionError, OverflowError):
            return None
    found, xs = [], [lo + (hi - lo) * i / 20000 for i in range(20001)]
    for p, q in zip(xs, xs[1:]):
        fp, fq = val(p), val(q)
        if fp is None or fq is None or fp * fq > 0:
            continue
        r = float(sp.nsolve(eq, var, (p + q) / 2)) if fp * fq < 0 else (p if fp == 0 else q)
        if not any(abs(r - z) < 1e-6 for z in found):
            found.append(r)
    return sorted(found)

def _turns(d, r):
    e = 1e-4 * max(1, abs(float(r)))
    a, b = float(d.subs(x, r - e)), float(d.subs(x, r + e))
    return a * b < 0, a

def extrema(f, lo=-100, hi=100):
    # כל נקודות הקיצון: (x, y, "max" או "min")
    d = sp.diff(f, x)
    out = []
    for r in solutions(d, x, lo, hi):
        turn, left = _turns(d, r)
        if turn:
            out.append((r, sp.simplify(f.subs(x, r)), "max" if left > 0 else "min"))
    return out

def inflections(f, lo=-100, hi=100):
    # כל נקודות הפיתול: f'' = 0 והסימן של f'' מתחלף
    d = sp.diff(f, x, 2)
    return [(r, sp.simplify(f.subs(x, r))) for r in solutions(d, x, lo, hi) if _turns(d, r)[0]]

def angle(P, V, Q):
    # הזווית PVQ במעלות, לפי השיעורים של הנקודות
    u, w = (P[0] - V[0], P[1] - V[1]), (Q[0] - V[0], Q[1] - V[1])
    c = (u[0] * w[0] + u[1] * w[1]) / (math.hypot(*u) * math.hypot(*w))
    return math.degrees(math.acos(max(-1, min(1, c))))

def dist(P, Q):
    return math.hypot(P[0] - Q[0], P[1] - Q[1])
```

דוגמה, דף על חקירת פונקציה:

```
f = x**4 - 4*x**3 + 10
check("6", [(0, 10), (2, -6)], inflections(f))
check("2", sp.Rational(1, 2), sp.solve(sp.Eq(2*x - 1, 0), x)[0])
```

**חשוב:** כל השאלות נבדקות **בהרצת קוד אחת**, יחד עם בניית הקובץ. לא הרצה לכל שאלה.

## מה עושים עם טעות

- **טעות במפתח:** תקן את המפתח.
- **שאלה פגומה** (חסר נתון, אין פתרון, דו-משמעות): תקן את השאלה ואת המפתח יחד, ואל תשנה את רמת הקושי.
- **אם לא ניתן להכריע:** אל תנחש. סמן את השאלה ושאל את המורה.

## דיווח למורה

**כשאתה בונה קובץ לפי סקיל אחר** (דף תרגול, מבחן): אין טבלה בצ'אט. שורות ה-✓ בפלט של הקוד הן הדיווח. בצ'אט כותבים רק מה שהסקיל שבונה את הקובץ אומר.

**כשהמורה ביקש לבדוק חומר:** אחרי הבדיקה, כתוב טבלה קצרה:

| שאלה | מצב | מה תוקן |
|---|---|---|
| 1 | תקין | — |
| 3 | תוקן | התשובה במפתח הייתה x=2, הנכון x=3 |

- אם הכול תקין, כתוב משפט אחד: "כל השאלות והתשובות נבדקו ונמצאו תקינות."
- אל תכתוב "נבדק" על שאלה שלא נבדקה בפועל.

## בדיקת חומר קיים של המורה

כאשר המורה מעלה קובץ משלו:
- בדוק את כל השאלות לפי אותו תהליך.
- החזר את טבלת הדיווח ומפתח תשובות מתוקן.
- אל תשכתב את השאלות של המורה. תקן רק מה שפגום, וציין בטבלה כל שינוי.
