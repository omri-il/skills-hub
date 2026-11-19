// Serves dist/ on http://localhost:4321 for checking the site by hand.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4321);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.zip': 'application/zip', '.xml': 'application/xml', '.txt': 'text/plain' };

// ADMIN_PORT=5047: send /admin/* to a local admin/server.js (DRY_RUN=1), as nginx does on the VPS,
// so the admin login and the video helper panel can be checked on one origin.
const ADMIN_PORT = Number(process.env.ADMIN_PORT || 0);

http.createServer((req, res) => {
  if (ADMIN_PORT && /^\/admin(\/|$|\?)/.test(req.url)) {
    const up = http.request({ host: '127.0.0.1', port: ADMIN_PORT, path: req.url, method: req.method, headers: req.headers }, (r) => {
      res.writeHead(r.statusCode, r.headers);
      r.pipe(res);
    });
    up.on('error', () => { res.writeHead(502); res.end('admin server not running'); });
    return req.pipe(up);
  }
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIST, path.normalize(p).replace(/^([/\\])+/, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(fs.readFileSync(path.join(DIST, '404.html')));
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
