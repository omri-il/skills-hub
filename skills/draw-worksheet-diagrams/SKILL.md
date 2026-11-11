---
name: draw-worksheet-diagrams
description: משרטט שרטוטים מדויקים לדפי עבודה בעברית בקוד Python ‏(matplotlib) ומכניס אותם לקובץ Word, במקום ליצור תמונה במחולל תמונות. השתמש כאשר דף עבודה, מבחן או מפתח תשובות צריך שרטוט, איור, סקיצה או גרף, למשל משולש, מרובע, מעגל, זוויות, מערכת צירים, גרף של פונקציה, גרף מהירות-זמן, תרשים כוחות, מישור משופע או מעגל חשמלי, בגיאומטריה, במתמטיקה, בפיזיקה או במדעים, וכאשר סקיל אחר מבקש שרטוט.
---

# שרטוטים לדפי עבודה

## הכלל הראשון: לא מחולל תמונות

- **אסור ליצור שרטוט כתמונה במחולל תמונות** (Imagen, "צור תמונה" וכדומה). תמונה כזאת לא מדויקת, הזוויות והאורכים לא מתאימים לנתונים, והכיתוב בה משתבש.
- כל שרטוט מצויר **בקוד Python עם matplotlib** בסביבת הקוד הרגילה, לפי קואורדינטות שחושבו מהנתונים, ונשמר כקובץ PNG שנכנס לקובץ ה-Word.
- גם כשהמורה כותב "תמונה", "איור" או "ציור" של צורה, גרף, כוחות או מעגל, הכוונה לשרטוט כזה.

## הכלל השני: אין עברית בתוך השרטוט

- **תוויות בשרטוט רק באותיות לועזיות, ביוונית, במספרים וביחידות:** ‏A, B, C, ‏α, ‏β, ‏5 cm, ‏30°, ‏F, ‏R₁, ‏12 V.
- עברית בתוך תמונה יוצאת הפוכה ומשובשת. כל הסבר בעברית ("הצלע הארוכה", "הגוף על המישור") נכתב בטקסט השאלה, מעל השרטוט או מתחתיו.
- יוונית, אינדקסים וחזקות נכתבים בתווית כ-mathtext בין סימני דולר: `r"$\alpha$"`, ‏`r"$R_1$"`, ‏`r"$\vec{F}$"`, ‏`r"$m\vec{g}$"`.

## דיוק

- **חשב את הקואורדינטות מהנתונים** ולא "בעין": משולש עם צלעות 5, 7, 8 משורטט עם הצלעות האלה בדיוק (הפונקציה `tri_sides`), וזווית של 30° משורטטת ב-30° (הפונקציה `polar`).
- **אל תשרטט את התשובה.** מה שהתלמיד צריך למצוא מסומן באות (x, ‏α) או ב-?, ולא בערכו.
- כל נתון שמופיע בשרטוט מופיע גם בטקסט השאלה, באותם סימנים בדיוק. אם בשאלה כתוב AB = 6, בשרטוט הקודקודים הם A ו-B והצלע מסומנת 6.
- כשהשרטוט לא בקנה מידה בכוונה (למשל כדי לא לחשוף תשובה), כתוב בשאלה "השרטוט אינו בקנה מידה".
- שחור על לבן, קווים ברורים, בלי צבעים, כדי שהדף יודפס היטב במכונת צילום.

## שלבי העבודה

שרטוטים נוצרים **באותה הרצת קוד אחת** שבה בונים את הקובץ לפי הסקיל format-equations-for-hebrew-worksheets:

1. הגדר את פונקציות העזר שלמטה.
2. שרטט כל שרטוט ושמור אותו ב-`save(fig, "fig1.png")`, ‏`fig2.png` וכן הלאה.
3. ב-Markdown, שים כל שרטוט **בפסקה משלו**, עם שורה ריקה לפניו ואחריו, ובלי טקסט בסוגריים המרובעים:

   ```
   ![](fig1.png){width=8cm}
   ```

   רוחב 6 עד 9 ס"מ מתאים לרוב השרטוטים. שרטוט בשאלה מגיע אחרי הטקסט של השאלה ולפני מקום התשובה.
4. קרא ל-`build(md, ...)` באותה הרצה. pandoc מכניס את התמונות לקובץ בעצמו.

אם שרטוט לא מצליח, אל תחליף אותו בתמונה ממחולל. תקן את הקוד, ואם אין ברירה כתוב בשאלה תיאור מילולי מלא של השרטוט ואמור זאת למורה.

## פונקציות העזר

```python
import math, re
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, Polygon, Rectangle

plt.rcParams.update({"font.family": "DejaVu Sans", "mathtext.fontset": "dejavusans", "font.size": 14})
_HEB = re.compile(r"[֐-׿]")
K = "black"

def _ok(s):
    if _HEB.search(s or ""): raise ValueError("עברית בתוך שרטוט: " + s)
def dist(P, Q): return math.hypot(Q[0]-P[0], Q[1]-P[1])
def unit(P, Q):
    d = dist(P, Q) or 1
    return ((Q[0]-P[0])/d, (Q[1]-P[1])/d)
def add(P, v, k=1): return (P[0]+k*v[0], P[1]+k*v[1])
def mid(P, Q): return ((P[0]+Q[0])/2, (P[1]+Q[1])/2)
def polar(P, length, deg):
    a = math.radians(deg)
    return (P[0]+length*math.cos(a), P[1]+length*math.sin(a))
def tri_sides(AB, BC, CA):
    """A=(0,0), B=(AB,0), C above AB, so that the sides are exactly AB, BC, CA."""
    x = (AB**2 + CA**2 - BC**2) / (2*AB)
    return (0, 0), (AB, 0), (x, math.sqrt(CA**2 - x**2))
def center(*pts): return (sum(p[0] for p in pts)/len(pts), sum(p[1] for p in pts)/len(pts))

def new_fig(w=5, h=4):
    fig, ax = plt.subplots(figsize=(w, h))
    ax.set_aspect("equal"); ax.axis("off")
    return fig, ax
def _track(ax, *pts):
    ax.update_datalim(pts); ax.autoscale_view()
def save(fig, name):
    for ax in fig.axes: ax.margins(0.12)
    fig.savefig(name, dpi=200, bbox_inches="tight", pad_inches=0.2, facecolor="white")
    plt.close(fig)
def _label(ax, P, text, u, size=14, off=14):
    _ok(text)
    ax.annotate(text, P, xytext=(off*u[0], off*u[1]), textcoords="offset points",
                ha="center", va="center", fontsize=size, annotation_clip=False)

# --- geometry ---
def seg(ax, P, Q, dashed=False, lw=1.8):
    ax.plot([P[0], Q[0]], [P[1], Q[1]], "--" if dashed else "-", color=K, lw=lw)
def poly(ax, *pts):
    ax.add_patch(Polygon(pts, closed=True, fill=False, ec=K, lw=1.8)); _track(ax, *pts)
def point(ax, P, name="", away=None, dot=True):
    """Point with its name, pushed away from `away` (usually the shape's center)."""
    if dot: ax.plot(*P, "o", color=K, ms=3.5)
    if name: _label(ax, P, name, unit(away, P) if away else (0, 1), size=15)
def side(ax, P, Q, text, away):
    """Text (a length, x) next to the middle of PQ, on the side away from `away`."""
    u = unit(P, Q); n = (-u[1], u[0]); M = mid(P, Q)
    if (M[0]-away[0])*n[0] + (M[1]-away[1])*n[1] < 0: n = (-n[0], -n[1])
    _label(ax, M, text, n, size=13, off=13)
def angle(ax, V, A, B, text="", r=None, double=False):
    """Arc for the angle AVB (the one smaller than 180°) with its text."""
    a1 = math.degrees(math.atan2(A[1]-V[1], A[0]-V[0])); a2 = math.degrees(math.atan2(B[1]-V[1], B[0]-V[0]))
    d = (a2 - a1) % 360
    if d > 180: a1, d = a2, 360 - d
    r = r or 0.18*min(dist(V, A), dist(V, B))
    for k in ([1, 1.15] if double else [1]):
        ax.add_patch(Arc(V, 2*r*k, 2*r*k, theta1=a1, theta2=a1+d, color=K, lw=1.2))
    if text:
        _ok(text); m = math.radians(a1 + d/2); rr = r*1.55
        ax.text(V[0]+rr*math.cos(m), V[1]+rr*math.sin(m), text, ha="center", va="center", fontsize=13)
def right_angle(ax, V, A, B, s=None):
    s = s or 0.1*min(dist(V, A), dist(V, B)); ua, ub = unit(V, A), unit(V, B)
    P1, P2 = add(V, ua, s), add(V, ub, s); P3 = add(P1, ub, s)
    ax.plot([P1[0], P3[0], P2[0]], [P1[1], P3[1], P2[1]], color=K, lw=1.2)
def ticks(ax, P, Q, n=1):
    """n small marks on PQ: sides with the same number of marks are equal."""
    u = unit(P, Q); nrm = (-u[1], u[0]); L = 0.05*dist(P, Q); g = 0.035*dist(P, Q); M = mid(P, Q)
    for i in range(n):
        c = add(M, u, (i-(n-1)/2)*g); seg(ax, add(c, nrm, -L), add(c, nrm, L), lw=1.2)
def circle(ax, C, r, dashed=False):
    ax.add_patch(Circle(C, r, fill=False, ec=K, lw=1.8, ls="--" if dashed else "-"))
    _track(ax, (C[0]-r, C[1]-r), (C[0]+r, C[1]+r))

# --- graphs (graph_fig instead of new_fig) ---
def graph_fig(xlabel="x", ylabel="y", xlim=(-5, 5), ylim=(-5, 5), grid=True, w=5, h=4):
    _ok(xlabel); _ok(ylabel)
    fig, ax = plt.subplots(figsize=(w, h))
    for s in ["top", "right"]: ax.spines[s].set_visible(False)
    for s in ["left", "bottom"]: ax.spines[s].set_position("zero")
    ax.set_xlim(*xlim); ax.set_ylim(*ylim)
    ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
    ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)
    ax.annotate(xlabel, (1, 0), xycoords=("axes fraction", "data"), xytext=(0, 8), textcoords="offset points", ha="right", va="bottom")
    ax.annotate(ylabel, (0, 1), xycoords=("data", "axes fraction"), xytext=(8, 0), textcoords="offset points", ha="left", va="top")
    if grid: ax.grid(True, color="0.85", lw=0.6)
    return fig, ax
def plot_fn(ax, f, x1, x2, n=400, dashed=False):
    xs = [x1 + (x2-x1)*i/n for i in range(n+1)]
    ax.plot(xs, [f(x) for x in xs], "--" if dashed else "-", color=K, lw=2)

# --- physics ---
def arrow(ax, P, v, text="", dashed=False):
    """Vector v from point P (a force, a velocity), with its name at the tip."""
    Q = add(P, v)
    ax.annotate("", xy=Q, xytext=P, annotation_clip=False,
                arrowprops=dict(arrowstyle="-|>", color=K, lw=2, ls="--" if dashed else "-", mutation_scale=18, shrinkA=0, shrinkB=0))
    _track(ax, P, Q)
    if text: _label(ax, Q, text, unit(P, Q), size=14, off=15)
def block(ax, C, w=1.0, h=0.7, deg=0, text=""):
    """Body as a rectangle centered at C, turned by deg degrees."""
    u = (math.cos(math.radians(deg)), math.sin(math.radians(deg))); n = (-u[1], u[0])
    pts = [add(add(C, u, sx*w/2), n, sy*h/2) for sx, sy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]
    poly(ax, *pts)
    if text: _ok(text); ax.text(*C, text, ha="center", va="center", fontsize=14)
def ground(ax, P, Q):
    """Floor or wall from P to Q, hatched on its right side going from P to Q."""
    seg(ax, P, Q, lw=2); u = unit(P, Q); n = (u[1], -u[0]); L = dist(P, Q); k = max(4, int(L/0.25))
    for i in range(k+1):
        S = add(P, u, L*i/k); seg(ax, S, add(add(S, n, 0.15), u, -0.12), lw=1)
def incline(ax, length, deg, text=r"$\alpha$"):
    """Incline rising to the right. Returns (point in the middle of the slope, unit along the slope uphill, unit normal out of it)."""
    A = (0, 0); B = (length*math.cos(math.radians(deg)), 0); C = (B[0], length*math.sin(math.radians(deg)))
    poly(ax, A, B, C); angle(ax, A, B, C, text); right_angle(ax, B, A, C)
    u = unit(A, C)
    return mid(A, C), u, (-u[1], u[0])

# --- circuits: each part sits between two points on a wire ---
def wire(ax, *pts):
    ax.plot([p[0] for p in pts], [p[1] for p in pts], color=K, lw=1.8); _track(ax, *pts)
def _part(ax, P, Q, g):
    u = unit(P, Q); M = mid(P, Q); wire(ax, P, add(M, u, -g)); wire(ax, add(M, u, g), Q)
    return M, u, (-u[1], u[0])
def resistor(ax, P, Q, text=""):
    M, u, n = _part(ax, P, Q, 0.4)
    poly(ax, add(add(M, u, -0.4), n, -0.15), add(add(M, u, 0.4), n, -0.15), add(add(M, u, 0.4), n, 0.15), add(add(M, u, -0.4), n, 0.15))
    if text: _label(ax, add(M, n, 0.15), text, n)
def battery(ax, P, Q, text="", plus_at_Q=True):
    """Voltage source: long thin plate (+), short thick plate (-)."""
    M, u, n = _part(ax, P, Q, 0.08)
    s = 1 if plus_at_Q else -1
    seg(ax, add(add(M, u, s*0.08), n, -0.35), add(add(M, u, s*0.08), n, 0.35), lw=1.8)
    seg(ax, add(add(M, u, -s*0.08), n, -0.18), add(add(M, u, -s*0.08), n, 0.18), lw=4)
    if text: _label(ax, add(M, n, 0.35), text, n)
def meter(ax, P, Q, letter="A"):
    """Ammeter (A), voltmeter (V), or a bulb with letter="x"."""
    M, u, n = _part(ax, P, Q, 0.3); circle(ax, M, 0.3)
    if letter == "x":
        for a in (45, 135): seg(ax, polar(M, 0.3, a), polar(M, 0.3, a+180), lw=1.2)
    else: ax.text(*M, letter, ha="center", va="center", fontsize=14)
def switch(ax, P, Q, closed=False, text=""):
    M, u, n = _part(ax, P, Q, 0.35); A = add(M, u, -0.35); B = add(M, u, 0.35)
    point(ax, A); point(ax, B)
    seg(ax, A, B if closed else add(add(M, u, 0.25), n, 0.3))
    if text: _label(ax, add(M, n, 0.3), text, n)
```

## דוגמאות

משולש לפי שלוש צלעות, עם זווית שצריך למצוא:

```python
A, B, C = tri_sides(8, 7, 5)
O = center(A, B, C)
fig, ax = new_fig()
poly(ax, A, B, C)
for P, nm in [(A, "A"), (B, "B"), (C, "C")]: point(ax, P, nm, away=O)
side(ax, A, B, "8", O); side(ax, B, C, "7", O); side(ax, C, A, "5", O)
angle(ax, A, B, C, r"$\alpha$")
save(fig, "fig1.png")
```

גוף על מישור משופע עם הכוחות עליו:

```python
fig, ax = new_fig()
M, u, n = incline(ax, 7, 30)
C = add(add(M, u, 0.8), n, 0.36)          # the body a bit above the middle of the slope
block(ax, C, 1.0, 0.7, deg=30)
arrow(ax, C, (0, -1.3), r"$m\vec{g}$")
arrow(ax, C, (1.3*n[0], 1.3*n[1]), r"$\vec{N}$")
arrow(ax, C, (1.2*u[0], 1.2*u[1]), r"$\vec{f}$")
save(fig, "fig2.png")
```

מעגל חשמלי: מקור, נגד ונורה בטור, ומד זרם:

```python
fig, ax = new_fig(5, 3.5)
P1, P2, P3, P4 = (0, 0), (0, 3), (5, 3), (5, 0)
battery(ax, P1, P2, r"$\varepsilon$")
resistor(ax, P2, (2.5, 3), r"$R_1$"); meter(ax, (2.5, 3), P3, "x")
meter(ax, P3, P4, "A"); wire(ax, P4, P1)
save(fig, "fig3.png")
```

גרף מהירות-זמן:

```python
fig, ax = graph_fig("t (s)", "v (m/s)", xlim=(0, 10), ylim=(0, 25))
ax.plot([0, 4, 10], [0, 20, 20], color="black", lw=2)
save(fig, "fig4.png")
```

## בדיקה לפני מסירה

- כל שרטוט נוצר בקוד ונשמר כקובץ, ואף אחד לא נוצר במחולל תמונות.
- אין עברית באף תווית. אם יש, הפונקציות עוצרות עם השגיאה "עברית בתוך שרטוט": העבר את המילים לטקסט השאלה.
- האורכים והזוויות בשרטוט מתאימים לנתונים בשאלה, והתשובה עצמה לא כתובה בשרטוט.
- השמות בשרטוט (A, ‏B, ‏α, ‏R₁) זהים לשמות בטקסט השאלה ובמפתח התשובות.
- אף תווית לא עולה על קו, על חץ או על תווית אחרת. אם יש חפיפה, הזז את הגוף או קצר את החץ (בתרשים כוחות אל תכתוב אות בתוך הגוף).
- כל שרטוט ב-Markdown בפסקה משלו, בצורה `![](figN.png){width=8cm}`.

## טעויות שמונעים כאן

- "שרטוט" שנוצר במחולל תמונות, עם כיתוב משובש וזוויות שלא מתאימות לנתונים.
- תוויות בעברית בתוך התמונה, שיצאו הפוכות.
- משולש שסומן "ישר זווית" אבל שורטט חד-זווית, כי הקואורדינטות נבחרו בעין.
- הערך של הזווית שצריך למצוא, כתוב בשרטוט.
