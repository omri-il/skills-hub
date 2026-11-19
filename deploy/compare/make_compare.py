"""Makes the "without the skill / with the skill" picture for a skill page (Omri, 2026-11-19).

Input: the video helper's <name>.json (video-help/make.py; on the VPS in /root/Projects/skills-video-help).
It holds Gemini's real answers to one request, once without the skill and once with it, and Claude's
3 points on what differs. Output, for each skill:
  assets/compare/<name>.png   the picture: the request, then the two answers side by side (the start of each)
  compare/<name>.json         label, request, points and date, read by build.js

Run from the repo root (Python 3.12, playwright, Chrome installed):
  python deploy/compare/make_compare.py <folder with the json files> create-rubric simple-language ...
"""
import html
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
FONTS = (ROOT / "assets" / "fonts").as_uri()


def inline(t: str) -> str:
    t = html.escape(t)
    t = re.sub(r"&lt;br\s*/?&gt;", "<br>", t)  # Gemini writes <br> inside table cells
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<!\*)\*(?!\s)(.+?)\*", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    return t


def md(text: str) -> str:
    """A small Markdown to HTML: headings, bold, lists, tables, rules. Enough for a picture."""
    out, table = [], []

    def flush_table():
        if not table:
            return
        rows = [r for r in table if not re.fullmatch(r"\|?\s*:?-{2,}.*", r.replace(" ", ""))]
        cells = lambda r: [c.strip() for c in r.strip().strip("|").split("|")]
        out.append("<table>" + "".join(
            "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(r)) + "</tr>" for r in rows) + "</table>")
        table.clear()

    for raw in text.splitlines():
        line = raw.rstrip()
        s = line.strip()
        # the run's own notes, not what a teacher sees
        if s.startswith("[פלט הקוד") or s.startswith("בעיות:") or s.startswith("Done with problems"):
            continue
        if s.startswith("|"):
            table.append(s)
            continue
        flush_table()
        if not s:
            continue
        if s.startswith("[") and s.endswith("]"):
            out.append(f'<p class="note">{inline(s[1:-1])}</p>')
        elif re.fullmatch(r"-{3,}|\*{3,}", s):
            out.append("<hr>")
        elif m := re.match(r"(#{1,4})\s+(.*)", s):
            out.append(f"<h4>{inline(m.group(2))}</h4>")
        elif m := re.match(r"(?:[*\-•]|\d+[.)])\s+(.*)", s):
            out.append(f'<p class="li">• {inline(m.group(1))}</p>')
        else:
            out.append(f"<p>{inline(s)}</p>")
    flush_table()
    return "\n".join(out)


PAGE = """<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>
@font-face {{ font-family: Rubik; src: url("{fonts}/Rubik-hebrew.woff2") format("woff2"); font-weight: 300 900; unicode-range: U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F; }}
@font-face {{ font-family: Rubik; src: url("{fonts}/Rubik-latin.woff2") format("woff2"); font-weight: 300 900; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; width: 1200px; font-family: Rubik, sans-serif; background: #F0F3FF; color: #121C2C; padding: 28px; }}
.ask {{ background: #fff; border: 1px solid #C4C6CF; border-radius: 16px; padding: 14px 20px; font-size: 19px; line-height: 1.5; margin-bottom: 20px; }}
.ask-text {{ display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }}
.ask b {{ color: #002045; }}
.cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
.col {{ background: #fff; border-radius: 16px; border: 1px solid #C4C6CF; overflow: hidden; height: 760px; position: relative; }}
.col.with {{ border: 3px solid #002045; }}
.head {{ font-weight: 700; font-size: 22px; padding: 12px 20px; background: #E9ECF4; color: #43474E; }}
.with .head {{ background: #002045; color: #fff; }}
.body {{ padding: 6px 20px; font-size: 16px; line-height: 1.55; }}
.body p {{ margin: 0 0 8px; }}
.body h4 {{ font-size: 18px; margin: 12px 0 6px; }}
.body hr {{ border: 0; border-top: 1px solid #DCDEE6; margin: 10px 0; }}
.body .note {{ color: #43474E; font-size: 14px; background: #F0F3FF; border-radius: 8px; padding: 4px 10px; display: inline-block; }}
.body table {{ border-collapse: collapse; width: 100%; margin: 6px 0 10px; font-size: 14px; }}
.body td {{ border: 1px solid #C4C6CF; padding: 6px 8px; vertical-align: top; }}
.body code {{ direction: ltr; unicode-bidi: isolate; }}
.fade {{ position: absolute; inset-inline: 0; bottom: 0; height: 120px; background: linear-gradient(to bottom, rgba(255,255,255,0), #fff); }}
</style></head><body>
<div class="ask"><div class="ask-text"><b>הבקשה:</b> {ask}</div></div>
<div class="cols">
  <div class="col"><div class="head">בלי הסקיל</div><div class="body">{without}</div><div class="fade"></div></div>
  <div class="col with"><div class="head">עם הסקיל</div><div class="body">{with_}</div><div class="fade"></div></div>
</div>
</body></html>"""


def main():
    src = Path(sys.argv[1])
    names = sys.argv[2:]
    (ROOT / "assets" / "compare").mkdir(parents=True, exist_ok=True)
    (ROOT / "compare").mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1200, "height": 900}, device_scale_factor=1.5)
        for name in names:
            data = json.loads((src / f"{name}.json").read_text(encoding="utf-8"))
            demo = data["demos"][0]
            doc = PAGE.format(fonts=FONTS, ask=html.escape(demo["prompt"]), without=md(demo["without"]), with_=md(demo["with"]))
            tmp = ROOT / "compare" / f".{name}.html"
            tmp.write_text(doc, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="networkidle")
            page.screenshot(path=str(ROOT / "assets" / "compare" / f"{name}.png"), full_page=True)
            tmp.unlink()
            (ROOT / "compare" / f"{name}.json").write_text(json.dumps({
                "label": demo["label"],
                "request": demo["prompt"],
                "points": demo["show"],
                "model": data.get("model", ""),
                "made": data.get("made", ""),
            }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print("made", name)
        browser.close()


if __name__ == "__main__":
    main()
