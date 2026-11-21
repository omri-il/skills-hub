"""Before/after pictures for the "איך זה עוזר?" table on each skill page (Omri, 2026-11-21:
"הייתי שמח שזה יהיה בתוך הטבלה ושיהיו המחשות בתוך האתר").

For every row of `fixes.list` in skills/<name>/meta.yaml that has an entry in deploy/shots/anchors.json:
  - finds the demo request in video-help/data/<name>.json whose 'without' answer holds the row's quote
    (the same Gemini answers the quotes were copied from),
  - renders that answer and the 'with' answer with skill-tests/shots.py's own page() and CSS (one look, one tool),
    at phone width, marks the quote / the 'after' text, and crops to that part,
  - writes assets/shots/<name>-<n>-before.webp and -after.webp, and shots/<name>.json (what build.js reads).

Usage (home PC or laptop, Python 3.12 with playwright + Pillow + markdown, installed Chrome):
  py -3.12 deploy/shots/make_row_shots.py [--skills a,b] [--tests ../skill-tests]
Needs video-help/data/*.json (gitignored; scp from root@100.94.153.60:/root/Projects/skills-video-help/).
"""
import io
import json
import sys
from pathlib import Path

import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
args = sys.argv[1:]
TESTS = Path(args[args.index("--tests") + 1]) if "--tests" in args else ROOT.parent / "skill-tests"
ONLY = set(args[args.index("--skills") + 1].split(",")) if "--skills" in args else None
sys.path.insert(0, str(TESTS))
from shots import page  # noqa: E402  (skill-tests: the one shot renderer)

WIDTH = 440          # CSS px: shown at about 340 px on a 375 px phone, so the text stays readable
SCALE = 2
MAX_H = 360          # CSS px of the crop
LABEL = {"before": "✗ בלי הסקיל", "after": "✓ עם הסקיל"}

NARROW = """<style>
.wrap{width:auto!important;padding:14px!important;padding-inline-start:44px!important}.wrap>.tag,.wrap>.meta{display:none}
.teacher{margin-inline-start:28px!important}.msg{font-size:15px}
.msg table{table-layout:fixed;width:100%!important}.msg th,.msg td{overflow-wrap:anywhere;font-size:12.5px;padding:4px 5px;line-height:1.45}
.hl{position:absolute;pointer-events:none;border-radius:3px}
.hl-before{background:rgba(220,53,69,.16);box-shadow:inset 0 -3px 0 #c0392b}
.hl-after{background:rgba(40,167,69,.16);box-shadow:inset 0 -3px 0 #1e7e34}
.cap{position:absolute;z-index:5;height:40px;background:#f3f5f8;display:flex;align-items:center;padding-inline:8px;box-sizing:border-box}
.arrow{position:absolute;z-index:6;pointer-events:none}
.badge{font:700 15px 'Segoe UI',Arial,sans-serif;padding:4px 12px;border-radius:6px}
.badge-before{background:#fbe3e4;color:#a12a35}.badge-after{background:#d4edda;color:#155724}
</style>"""

LOCATE = """([anchor, label, maxH, kind, above]) => {
  const box = [...document.querySelectorAll('.msg.gemini')].pop();
  const nodes = [], walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  let text = '';
  while (walker.nextNode()) { nodes.push([walker.currentNode, text.length]); text += walker.currentNode.data; }
  const at = text.indexOf(anchor);
  if (at < 0) return null;
  const pos = (i) => { let k = nodes.length - 1; while (nodes[k][1] > i) k--; return [nodes[k][0], i - nodes[k][1]]; };
  const range = document.createRange();
  range.setStart(...pos(at)); range.setEnd(...pos(at + anchor.length - 1)); range.setEnd(range.endContainer, range.endOffset + 1);
  const wrap = document.querySelector('.wrap');
  let top = 1e9, bottom = 0;
  for (const r of range.getClientRects()) {
    const d = document.createElement('div'); d.className = 'hl hl-' + kind;
    Object.assign(d.style, { left: (r.left - 2) + 'px', top: (r.top + scrollY - 1) + 'px', width: (r.width + 4) + 'px', height: (r.height + 2) + 'px' });
    document.body.appendChild(d);
    top = Math.min(top, r.top + scrollY); bottom = Math.max(bottom, r.bottom + scrollY);
  }
  const g = box.getBoundingClientRect();
  const gTop = g.top + scrollY, gBottom = g.bottom + scrollY;
  let y = Math.max(gTop - 4, top - above);
  let h = Math.min(maxH, Math.max(bottom - y + 110, 200));
  if (y + h > gBottom + 8) { h = gBottom + 8 - y; }
  const w = wrap.getBoundingClientRect();
  y -= 40; h += 40;
  const cap = document.createElement('div'); cap.className = 'cap';
  Object.assign(cap.style, { left: w.left + 'px', width: w.width + 'px', top: y + 'px' });
  cap.dir = 'rtl';
  const b = document.createElement('span'); b.className = 'badge badge-' + kind; b.textContent = label;
  cap.appendChild(b); document.body.appendChild(cap);
  // Omri, 2026-11-21 (NOTES.md item 40): an arrow in the right margin, from the wrap's edge to the answer box,
  // pointing at the middle of the mark's first line. All mark fragments on that line count (bidi splits a mark).
  {
    const rs = [...document.querySelectorAll('.hl-' + kind)].map(e => e.getBoundingClientRect());
    const top0 = Math.min(...rs.map(r => r.top));
    const line = rs.filter(r => r.top < top0 + 8);
    const cy = (Math.min(...line.map(r => r.top)) + Math.max(...line.map(r => r.bottom))) / 2 + scrollY;
    const color = kind === 'before' ? '#d62828' : '#1e8e3e';
    const tip = g.right - 4, tail = w.right - 1, wd = tail - tip + 4;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', wd); svg.setAttribute('height', 30);
    Object.assign(svg.style, { position: 'absolute', left: (tip - 2) + 'px', top: (cy - 15) + 'px', zIndex: 6, overflow: 'visible' });
    svg.innerHTML = `<line x1="${wd - 3}" y1="15" x2="14" y2="15" stroke="${color}" stroke-width="6" stroke-linecap="round"/><polygon points="2,15 18,4 18,26" fill="${color}"/>`;
    document.body.appendChild(svg);
  }
  return { x: w.left, y, width: w.width, height: h };
}"""


def shoot(pg, kind, demo, name, anchor, out, above=90):
    r = {"request": demo["prompt"], "skill": name, "id": demo["label"], "model": ""}
    html = page(kind, r, [demo["without" if kind == "before" else "with"]]).replace("</head>", NARROW + "</head>")
    pg.set_content(html)
    clip = pg.evaluate(LOCATE, [anchor, LABEL[kind], MAX_H, kind, above])
    if not clip:
        return False
    png = pg.screenshot(clip=clip, full_page=True)
    Image.open(io.BytesIO(png)).convert("RGB").save(out, "WEBP", quality=82, method=6)
    return True


def run_demo(a, name):
    """A row from a skill-tests run (Omri, 2026-11-21: every shown skill gets its pictures): anchors.json gives
    "run" (results/<run>), "case" (the case id) and "label". The 'without' answer is results/<run>/_before/<case>.json
    (shots.py), the 'with' answer is the run's own answer; the turn is the one whose 'without' answer holds the quote."""
    res = TESTS / "results" / a["run"]
    case = a["case"]
    before = json.loads((res / "_before" / f"{case}.json").read_text(encoding="utf-8"))
    after_f = next((f for f in res.rglob(f"{case}.json") if "_before" not in f.parts and "_grades" not in f.parts), None)
    if not after_f:
        return None
    after = json.loads(after_f.read_text(encoding="utf-8"))
    for t, w in enumerate(before["answers"]):
        if a["quote"] in w and t < len(after["answers"]):
            req = before["request"] if t == 0 else (before.get("followup") or before["request"])
            return {"label": a["label"], "prompt": req, "without": w, "with": after["answers"][t],
                    "model": after.get("model"), "made": a.get("made")}
    return None


def main():
    anchors = json.loads((ROOT / "deploy" / "shots" / "anchors.json").read_text(encoding="utf-8"))
    (ROOT / "assets" / "shots").mkdir(parents=True, exist_ok=True)
    (ROOT / "shots").mkdir(exist_ok=True)
    from playwright.sync_api import sync_playwright
    problems = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        pg = b.new_page(viewport={"width": WIDTH, "height": 800}, device_scale_factor=SCALE)
        for name, rows in anchors.items():
            if name.startswith("_") or (ONLY and name not in ONLY):
                continue
            meta = yaml.safe_load((ROOT / "skills" / name / "meta.yaml").read_text(encoding="utf-8"))
            vh = ROOT / "video-help" / "data" / f"{name}.json"
            data = json.loads(vh.read_text(encoding="utf-8")) if vh.exists() else {"demos": []}
            fx_rows = (meta.get("fixes") or {}).get("list") or []
            out_rows = []
            for a in rows:
                if not any(f.get("quote") == a["quote"] for f in fx_rows):
                    problems.append(f"{name}: no fixes row with quote {a['quote']!r}")
                    continue
                demo = run_demo(a, name) if a.get("run") else next(
                    (d for d in data["demos"] if a["quote"] in d["without"]), None)
                if not demo:
                    problems.append(f"{name}: quote not in any 'without' answer: {a['quote']!r}")
                    continue
                n = len(out_rows) + 1
                files = {k: f"{name}-{n}-{k}.webp" for k in ("before", "after")}
                ok_b = shoot(pg, "before", demo, name, a["quote"], ROOT / "assets" / "shots" / files["before"])
                ok_a = shoot(pg, "after", demo, name, a["after"], ROOT / "assets" / "shots" / files["after"],
                             a.get("above", 90))
                if not (ok_b and ok_a):
                    problems.append(f"{name}: text not found on the rendered page ({'before' if not ok_b else 'after'})")
                    continue
                sizes = {}
                for k, f in files.items():
                    with Image.open(ROOT / "assets" / "shots" / f) as im:
                        sizes[k] = [im.width // SCALE, im.height // SCALE]
                out_rows.append({"quote": a["quote"], "label": demo["label"], **files, "size": sizes})
                if demo.get("model"):
                    data.setdefault("model", demo["model"]); data.setdefault("made", demo["made"])
                print(f"{name} row {n}: ok", flush=True)
            (ROOT / "shots" / f"{name}.json").write_text(json.dumps(
                {"model": data.get("model"), "made": data.get("made"), "rows": out_rows}, ensure_ascii=False, indent=1) + "\n",
                encoding="utf-8")
        b.close()
    for line in problems:
        print("PROBLEM:", line)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
