"""One time (2026-11-19): copy the Skills site's lines from nginx's shared log into the site's own log folder,
so the numbers page starts from the first day the shared log still has (8.11.2026), not from today.

The shared log has no site name in it, so only paths that exist only on this site are taken: skill pages
(/skills/<name>/), bundle pages (/bundles/...) and zips (/downloads/<name>.zip). Home page visits before
the site's own log started cannot be told apart from the other sites, so they are not imported.
Omri's own visits are in these old lines too (the old log has no admin cookie).

Run on the VPS:  python3 deploy/import_old_log.py /var/log/nginx /var/log/nginx/skills/history-before-2026-11-19.log
"""
import gzip
import json
import re
import sys
from datetime import datetime
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
LINE = re.compile(r'^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) \S+ "([^"]*)" "([^"]*)"')
KEEP = re.compile(r"^/(?:skills/[a-z0-9-]+/?|bundles/(?:[a-z0-9-]+/?)?|downloads/[a-z0-9-]+\.zip)(?:\?.*)?$")

rows = []
for f in sorted(src.glob("access.log*")):
    opener = gzip.open if f.suffix == ".gz" else open
    with opener(f, "rt", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            m = LINE.match(line)
            if not m or not KEEP.match(m.group(4)):
                continue
            t = datetime.strptime(m.group(2), "%d/%b/%Y:%H:%M:%S %z").isoformat()
            rows.append({"t": t, "ip": m.group(1), "m": m.group(3), "u": m.group(4), "s": int(m.group(5)),
                         "r": "" if m.group(6) == "-" else m.group(6), "ua": m.group(7), "a": ""})
rows.sort(key=lambda r: r["t"])
out.parent.mkdir(parents=True, exist_ok=True)
with open(out, "w", encoding="utf-8") as fh:
    for r in rows:
        fh.write(json.dumps(r, ensure_ascii=False) + "\n")
print(f"{len(rows)} lines, {rows[0]['t'][:10] if rows else '-'} to {rows[-1]['t'][:10] if rows else '-'} -> {out}")
