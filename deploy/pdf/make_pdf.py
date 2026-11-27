"""Build the before/after examples PDF (assets/skills-examples.pdf) from the real shots.

Run: py -3.12 deploy/pdf/make_pdf.py   (needs pyyaml, qrcode, playwright with Edge, pymupdf)
Reads skills/<name>/meta.yaml (simple, uses, fixes) and shots/<name>.json + assets/shots/*.webp.
Run it again after a change to one of the skills in PICK. Omri, 2026-11-27.
"""
import base64, html, io, json, pathlib, sys
import yaml, qrcode, qrcode.image.svg
from playwright.sync_api import sync_playwright

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "assets" / "skills-examples.pdf"
TMP = OUT.with_suffix(".tmp.html")
SITE = "https://skills.omri-iram.co.il"

# skill, rows to show (1-based, order of fixes list), optional text overrides {row: {"with": ...}}
PICK = [
    ("create-math-practice", [1, 2], {1: {"with": "נוצר קובץ Word עם משוואות אמיתיות ומפתח תשובות. ב-24 מתוך 25 בקשות."}}),
    ("create-elementary-math-practice", [2, 3], {}),
    ("create-choice-board", [1, 3], {}),
    ("create-integrated-lesson", [1, 2], {}),
    ("staff-meeting-tasks", [1, 2], {}),
    ("task-triage", [1, 2], {}),
    ("sheet-per-teacher", [3, 1], {}),
]

def esc(s): return html.escape(str(s).strip())

def b64(path):
    return base64.b64encode(path.read_bytes()).decode()

def font(name):
    return f"data:font/woff2;base64,{b64(REPO / 'assets/fonts' / name)}"

def qr(url):
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, border=1)
    buf = io.BytesIO(); img.save(buf)
    svg = buf.getvalue().decode()
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()

def img(name):
    return f"data:image/webp;base64,{b64(REPO / 'assets/shots' / name)}"

pages = []
toc = []
for n, (name, rows, over) in enumerate(PICK, 1):
    meta = yaml.safe_load((REPO / f"skills/{name}/meta.yaml").read_text(encoding="utf-8"))
    shots = json.loads((REPO / f"shots/{name}.json").read_text(encoding="utf-8"))["rows"]
    fixes = meta["fixes"]["list"]
    url = f"{SITE}/skills/{name}/?utm_source=pdf"
    toc.append((n, meta["title"], meta.get("category", "")))
    blocks = []
    for r in rows:
        fx = dict(fixes[r - 1]); fx.update(over.get(r, {}))
        shot = next(s for s in shots if s["quote"] == fx["quote"])
        blocks.append(f"""
      <section class="pair">
        <h3>{esc(shot['label'])}</h3>
        <div class="cols">
          <div class="col bad"><img src="{img(shot['before'])}"><p><b>בלי הסקיל:</b> {esc(fx['without'])}</p></div>
          <div class="col good"><img src="{img(shot['after'])}"><p><b>עם הסקיל:</b> {esc(fx['with'])}</p></div>
        </div>
      </section>""")
    ask = meta["uses"][0]["ask"]
    more = "".join(f"<li><b>{esc(u['when'])}:</b> <q>{esc(u['ask'])}</q><br><span class='get'>מקבלים: {esc(u['get'])}</span></li>" for u in meta["uses"][1:3])
    pages.append(f"""
  <article class="page">
    <header class="sk">
      <span class="num">{n}</span>
      <div>
        <p class="cat">{esc(meta.get('category', ''))}</p>
        <h2>{esc(meta['title'])}</h2>
        <p class="simple">{esc(meta['simple'])}</p>
      </div>
    </header>
    <div class="ask"><span>כותבים לג'מיני:</span> <q>{esc(ask)}</q></div>
    {''.join(blocks)}
    <section class="more"><h3>עוד 2 דרכים להשתמש בזה</h3><ol>{more}</ol></section>
    <footer>
      <img class="qr" src="{qr(url)}">
      <div><p class="src">{esc(meta['fixes']['source'])}</p>
      <p>להורדה חינם: סורקים את הקוד, או נכנסים ל-<bdi dir="ltr">skills.omri-iram.co.il</bdi></p></div>
    </footer>
  </article>""")

toc_html = "".join(f"<li><span class='tn'>{n}</span>{esc(t)}<small>{esc(c)}</small></li>" for n, t, c in toc)
cover = f"""
  <article class="page cover">
    <p class="kicker">סקילים לג'מיני למורים</p>
    <h1>אותה בקשה לג'מיני.<br>פעם בלי סקיל, ופעם עם סקיל.</h1>
    <p class="lead">כל התמונות כאן הן תשובות אמיתיות של Gemini למורים ומנהלים. בצד ימין התשובה בלי הסקיל, בצד שמאל התשובה עם הסקיל. החץ האדום מראה את הבעיה, והחץ הירוק את התיקון.</p>
    <div class="what"><h2>מה זה סקיל?</h2><p>קובץ קטן עם הוראות לג'מיני. מעלים אותו פעם אחת, ומאז ג'מיני יודע לעשות את המשימה הזאת טוב. לא צריך לזכור שום פקודה, מבקשים כרגיל.</p></div>
    <h2 class="toch">7 הסקילים בחוברת</h2>
    <ol class="toc">{toc_html}</ol>
    <div class="install">
      <h2>איך מתקינים, 3 צעדים</h2>
      <ol>
        <li>מורידים את הסקיל מהאתר. <b>לא פותחים את קובץ ה-zip.</b></li>
        <li>בג'מיני, בפאנל הימני: <b>התאמה אישית</b> ← <b>סקילים</b> ← <b>יצירה והעלאה</b>, ובוחרים את הקובץ.</li>
        <li>בצ'אט חדש מבקשים כרגיל, כמו בדוגמאות בחוברת.</li>
      </ol>
      <img class="qr big" src="{qr(SITE + '/?utm_source=pdf')}">
    </div>
  </article>"""

css = f"""
@font-face{{font-family:Rubik;src:url({font('Rubik-hebrew.woff2')}) format('woff2');unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F;font-weight:300 900}}
@font-face{{font-family:Rubik;src:url({font('Rubik-latin.woff2')}) format('woff2');font-weight:300 900}}
@page{{size:A4;margin:0}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:Rubik,Arial,sans-serif;color:#1d2433;direction:rtl}}
.page{{width:210mm;height:297mm;padding:12mm 13mm 10mm;page-break-after:always;display:flex;flex-direction:column;overflow:hidden;position:relative}}
.page:last-child{{page-break-after:auto}}
h1,h2,h3,p{{margin:0}}
.cover{{background:#002045;color:#fff;padding:18mm 16mm}}
.kicker{{color:#FFC250;font-weight:700;font-size:13pt}}
.cover h1{{font-size:27pt;line-height:1.25;margin:4mm 0 5mm;font-weight:800}}
.lead{{font-size:12pt;line-height:1.6;max-width:165mm;opacity:.95}}
.what{{background:#fff;color:#1d2433;border-radius:4mm;padding:5mm 6mm;margin:8mm 0 6mm;border-inline-start:3mm solid #FFC250}}
.what h2{{font-size:13pt;margin-bottom:1.5mm;color:#002045}}
.what p{{font-size:11pt;line-height:1.55}}
.toch{{font-size:14pt;color:#FFC250;margin-bottom:3mm}}
.toc{{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:5mm 8mm}}
.toc li{{font-size:13pt;display:flex;align-items:center;gap:2.5mm;line-height:1.3}}
.toc small{{opacity:.7;font-size:8.5pt;margin-inline-start:auto;white-space:nowrap}}
.tn,.num{{background:#FFC250;color:#002045;font-weight:800;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex:none}}
.tn{{width:9mm;height:9mm;font-size:12pt}}
.install{{margin-top:auto;background:rgba(255,255,255,.08);border-radius:4mm;padding:5mm 6mm;position:relative;padding-inline-end:42mm}}
.install h2{{font-size:13pt;color:#FFC250;margin-bottom:2mm}}
.install ol{{margin:0;padding-inline-start:5mm;font-size:10.5pt;line-height:1.6}}
.qr{{background:#fff;padding:1mm;border-radius:1.5mm}}
.qr.big{{position:absolute;inset-inline-end:6mm;top:50%;transform:translateY(-50%);width:32mm;height:32mm}}
.sk{{display:flex;gap:4mm;align-items:flex-start;border-bottom:.6mm solid #002045;padding-bottom:3mm}}
.num{{width:11mm;height:11mm;font-size:15pt;margin-top:1mm}}
.cat{{font-size:9pt;color:#7a6020;font-weight:600}}
.sk h2{{font-size:18pt;color:#002045;line-height:1.25;font-weight:800}}
.simple{{font-size:10.5pt;line-height:1.5;margin-top:1mm}}
.ask{{background:#fff8e6;border:.3mm solid #FFC250;border-radius:2.5mm;padding:2.5mm 4mm;margin:3mm 0 1mm;font-size:10pt;line-height:1.5}}
.ask span{{font-weight:700;color:#002045}}
.ask q{{quotes:"״" "״"}}
.pair{{margin-top:3.5mm}}
.pair h3{{font-size:11pt;color:#002045;margin-bottom:1.5mm}}
.pair h3::before{{content:"הבקשה: ";font-weight:400;color:#555}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:4mm}}
.col img{{width:100%;display:block;border:.3mm solid #d8dce4;border-radius:2mm;max-height:60mm;object-fit:cover;object-position:top}}
.col p{{font-size:10pt;line-height:1.45;margin-top:1.5mm}}
.bad b{{color:#b3261e}} .good b{{color:#1e7b34}}
footer{{margin-top:auto;display:flex;gap:4mm;align-items:center;border-top:.3mm solid #d8dce4;padding-top:2.5mm;font-size:9pt;color:#444}}
footer .qr{{width:18mm;height:18mm;border:.3mm solid #d8dce4}}
.more{{margin-top:4mm;background:#f3f5f9;border-radius:3mm;padding:3mm 5mm}}
.more h3{{font-size:11pt;color:#002045;margin-bottom:1.5mm}}
.more ol{{margin:0;padding-inline-start:5mm;font-size:9.5pt;line-height:1.5}}
.more li+li{{margin-top:1.5mm}}
.more q{{quotes:"״" "״"}}
.get{{color:#555}}
.src{{color:#777;font-size:8.5pt;margin-bottom:.8mm}}
"""

doc = f"<!doctype html><html lang='he' dir='rtl'><meta charset='utf-8'><style>{css}</style><body>{cover}{''.join(pages)}</body></html>"
TMP.write_text(doc, encoding="utf-8")
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge"); pg = b.new_page()
    pg.goto(TMP.resolve().as_uri()); pg.wait_for_timeout(500)
    pg.pdf(path=str(OUT), format="A4", print_background=True, prefer_css_page_size=True)
    b.close()
TMP.unlink()
import pymupdf
d = pymupdf.open(OUT)
d.rewrite_images(dpi_threshold=201, dpi_target=200, quality=82)
d.save(OUT.with_suffix(".small.pdf"), garbage=4, deflate=True); d.close()
OUT.with_suffix(".small.pdf").replace(OUT)
print("ok", OUT.stat().st_size // 1024, "KB")
