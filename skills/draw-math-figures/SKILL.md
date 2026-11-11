---
name: draw-math-figures
description: בונה שרטוטים מדויקים למתמטיקה ביסודי (כיתות א'–ו') בהרצת קוד Python, ואף פעם לא בכלי יצירת התמונות. השתמש כאשר מורה ביסודי מבקש לשרטט או לצייר זווית, זוויות צמודות או קודקודיות, משולש או מרובע עם זוויות, ישר מספרים או שבר כעיגול, להמחשה בכיתה או לדף עבודה, וכאשר דף עבודה ליסודי צריך שרטוט כזה. לחטיבה, לתיכון ולפיזיקה השתמש בסקיל draw-worksheet-diagrams אם הוא מותקן.
---

# שרטוטים מדויקים למתמטיקה ביסודי

## חובה, לפני הכול: קוד, לא כלי התמונות

- **אסור להשתמש בכלי יצירת התמונות** (Nano Banana / "יצירת תמונה") לשרטוט מתמטי, גם כשהמורה כותב "צייר", "שרטט" או "תמונה". בתמונה מומצאת הזווית לא באמת בגודל שכתוב, ותלמיד שמודד במד-זווית יקבל תשובה אחרת מהמפתח.
- כל שרטוט נוצר **בהרצת קוד Python** בסביבת הקוד שלך, עם הפונקציות שלמטה. את הקוד אתה כותב ומריץ בעצמך. זה לא סקריפט של הסקיל, ואין מגבלה על הרצתו.
- את הזוויות במפתח כותבים לפי מה שהקוד מדפיס, לא לפי הכוונה.

## איך מוסרים

- **שרטוט להמחשה בכיתה:** הגדר את הקוד, צייר עם `dpi=400`, והצג את התמונה בצ'אט: `plt.imshow(plt.imread("q1.png")); plt.axis("off"); plt.show()`. אפשר להראות את גודל הזווית (`text="65°"`).
- **בתוך דף עבודה:** כל פונקציה מחזירה שורת Markdown כמו `![](q1.png){width=7.87cm}`. שים אותה בפסקה משלה ב-Markdown של הדף, ובנה את הקובץ עם `build` מהסקיל format-equations-for-hebrew-worksheets **באותה הרצת קוד**. השרטוט נכנס ל-Word בגודל אמיתי: יחידה אחת = 1 ס"מ.

## הקוד

```python
import math, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Wedge, Polygon

def _at(p, deg, r):
    return (p[0] + r * math.cos(math.radians(deg)), p[1] + r * math.sin(math.radians(deg)))

def _dir(a, b):
    return math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])) % 360

class D:
    def __init__(self):
        self.fig, self.ax = plt.subplots(); self.ax.axis("off"); self.pts = []
    def line(self, a, b, lw=2):
        self.ax.plot([a[0], b[0]], [a[1], b[1]], color="black", lw=lw); self.pts += [a, b]
    def text(self, p, s, size=15):
        self.ax.text(p[0], p[1], s, ha="center", va="center", fontsize=size); self.pts.append(p)
    def mark(self, v, start, end, text=None, right=True, r=0.8):
        span = (end - start) % 360
        if right and abs(span - 90) < 0.01:
            a, c = _at(v, start, 0.45), _at(v, end, 0.45)
            self.ax.add_patch(Polygon([v, a, (a[0] + c[0] - v[0], a[1] + c[1] - v[1]), c], fill=False, lw=1.3))
        else:
            self.ax.add_patch(Arc(v, 2 * r, 2 * r, theta1=start, theta2=start + span, lw=1.3))
        if text:
            self.text(_at(v, start + span / 2, r + 0.55), text, 13)
    def save(self, name, dpi=200):
        xs = [p[0] for p in self.pts]; ys = [p[1] for p in self.pts]
        x0, x1, y0, y1 = min(xs) - .5, max(xs) + .5, min(ys) - .5, max(ys) + .5
        self.ax.set_xlim(x0, x1); self.ax.set_ylim(y0, y1); self.ax.set_position([0, 0, 1, 1])
        self.fig.set_size_inches((x1 - x0) / 2.54, (y1 - y0) / 2.54)
        self.fig.savefig(name, dpi=dpi); plt.close(self.fig)
        return f"![]({name}){{width={x1 - x0:.2f}cm}}"

def angle(deg, name, rotate=0, letters="אבג", text=None, ray=6, right=True):
    d, v = D(), (0, 0)
    a, c = _at(v, rotate, ray), _at(v, rotate + deg, ray)
    d.line(v, a); d.line(v, c); d.mark(v, rotate, rotate + deg, text, right)
    d.text(_at(a, rotate, .45), letters[0]); d.text(_at(c, rotate + deg, .45), letters[2])
    d.text(_at(v, rotate + deg / 2 + 180, .5), letters[1])
    print(name, "זווית:", deg)
    return d.save(name)

def rays(directions, arcs, name, letters="", center="", ray=5):
    d, v = D(), (0, 0)
    for k, deg in enumerate(directions):
        d.line(v, _at(v, deg, ray))
        if letters: d.text(_at(v, deg, ray + .45), letters[k])
    for k, (i, j, text) in enumerate(arcs):
        d.mark(v, directions[i], directions[j], text, r=.7 + .35 * (k % 2))
        print(name, "זווית", i, "עד", j, "=", (directions[j] - directions[i]) % 360)
    if center: d.text((0, -.5), center)
    return d.save(name)

def shape(angles, sides, name, letters, texts):
    n = len(angles); assert abs(sum(angles) - (n - 2) * 180) < 1e-9, "סכום זוויות שגוי"
    pts, h = [(0.0, 0.0)], 0.0
    for k in range(n - 2):
        pts.append(_at(pts[-1], h, sides[k])); h += 180 - angles[k + 1]
    p, d1, d2 = pts[-1], _at((0, 0), h, 1), _at((0, 0), angles[0], 1)
    det = d2[0] * d1[1] - d1[0] * d2[1]
    t = (p[0] * d2[1] - p[1] * d2[0]) / det
    assert t > .5, "שנה את אורכי הצלעות"
    pts.append((p[0] + t * d1[0], p[1] + t * d1[1]))
    d = D(); cx = sum(q[0] for q in pts) / n; cy = sum(q[1] for q in pts) / n
    real = [round((_dir(pts[i], pts[i - 1]) - _dir(pts[i], pts[(i + 1) % n])) % 360, 1) for i in range(n)]
    for i in range(n):
        d.line(pts[i], pts[(i + 1) % n]); d.text(_at(pts[i], _dir((cx, cy), pts[i]), .5), letters[i])
        if i in texts: d.mark(pts[i], _dir(pts[i], pts[(i + 1) % n]), _dir(pts[i], pts[i - 1]), texts[i], r=.7)
    print(name, "זוויות בשרטוט:", dict(zip(letters, real)))
    return d.save(name)

def number_line(start, end, step, name, marks, length=13):
    from fractions import Fraction as F
    d = D(); start, step = F(start), F(step); n = int((F(end) - start) / step); u = length / n
    d.line((-.4, 0), (length + .4, 0))
    for k in range(n + 1):
        val = start + k * step; big = val.denominator == 1
        d.line((k * u, -.2 - .1 * big), (k * u, .2 + .1 * big), 1.5)
        d.text((k * u, -.75), str(val) if big else rf"$\frac{{{val * step.denominator}}}{{{step.denominator}}}$", 12)
    for val, s in marks.items():
        x = float((F(val) - start) / step) * u; d.ax.plot([x], [0], "ko", ms=5); d.text((x, .75), s, 14)
    return d.save(name)

def fraction_circle(parts, shaded, name, r=2.5):
    d = D()
    for k in range(parts):
        d.ax.add_patch(Wedge((0, 0), r, 90 + k * 360 / parts, 90 + (k + 1) * 360 / parts,
                             fc="#BBBBBB" if k < shaded else "white", ec="black", lw=1.5))
    d.pts += [(-r, -r), (r, r)]
    return d.save(name)
```

## דוגמאות

- זווית למדידה (בלי מספר): `angle(65, "q1.png")`
- זווית עם סימן שאלה, מסובבת: `angle(130, "q2.png", rotate=25, letters="דהו", text="?")`
- בשאלת מיון, בלי ריבוע שמסגיר זווית ישרה: `angle(90, "q3.png", right=False)`
- זוויות צמודות: `rays([0, 55, 180], [(0, 1, "55°"), (1, 2, "?")], "q4.png", letters="אבג", center="ד")`
- זוויות קודקודיות: `rays([0, 40, 180, 220], [(0, 1, "40°"), (2, 3, "?")], "q5.png")`
- משולש לפי זוויות (צלע ראשונה 7 ס"מ): `shape([50, 70, 60], [7], "q6.png", "אבג", {0: "50°", 1: "70°", 2: "?"})`
- מרובע לפי זוויות (שתי צלעות ראשונות): `shape([90, 90, 110, 70], [6, 4], "q7.png", "אבגד", {0: "", 1: "", 2: "110°", 3: "?"})`
- ישר מספרים ברבעים: `number_line(0, 2, "1/4", "q8.png", {"3/4": "א", "3/2": "?"})`
- שבר כעיגול: `fraction_circle(8, 3, "q9.png")`

`rays`: כל זוג `(i, j, טקסט)` הוא הזווית מקרן i נגד כיוון השעון עד קרן j. `shape`: הזוויות לפי סדר הקודקודים, `texts` = מספר קודקוד (מ-0) ← טקסט, ו-`""` מסמן קשת בלי טקסט.

## כללים

- בתוך שרטוט רק אותיות בודדות (א, ב, ג), מספרים, ° ו-?. **אף פעם לא מילה בעברית**: היא יוצאת הפוכה. מילים נכתבות בשאלה.
- קודקודים באותיות עבריות. האות האמצעית היא הקודקוד, כמו ב-∢אבג.
- זווית למדידה: בלי המספר, קרניים של 6 ס"מ. בכיתות הצעירות קרן אחת אופקית.
- במפתח של שאלת מדידה: הגודל, טווח מקובל של 2° לכל צד, והטעות הנפוצה (180° פחות התשובה, קריאה בסקאלה השנייה).
- שרטוט רחב מ-15 ס"מ לא נכנס לדף: קצר את `ray` או את `length`.
- בהודעה למורה על דף עם שרטוטים הוסף: "בהדפסה בחרו גודל אמיתי (100%), כדי שהזוויות יימדדו נכון."
