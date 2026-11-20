// Share links (2026-11-20): admin/stats.js counts, for each share link, who came by it, who downloaded
// after that, and who left an email after that.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-log-'));
process.env.SKILLS_LOG_DIR = dir;
process.env.SHARE_FILE = path.join(dir, 'links.json');
const { stats } = await import('../admin/stats.js');
const { cleanLabel, readShares, checkPage, pageOf } = await import('../admin/share.js');

const UA_A = 'Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile';
const UA_B = 'Mozilla/5.0 (Windows NT 10.0) Chrome/130';
const line = (t, ip, ua, m, u, extra = {}) => JSON.stringify({ t: `2026-11-20T${t}+00:00`, ip, m, u, s: 200, r: '', ua, a: '', ...extra });

test('a share link counts its visitors, their downloads and their sign-ups', () => {
  // Written out of time order on purpose: the rotated files are read in any order.
  const rest = [
    line('10:05:00', '1.1.1.1', UA_A, 'GET', '/downloads/create-test.zip'),
    line('10:06:00', '1.1.1.1', UA_A, 'POST', '/signup'),
    line('10:00:00', '1.1.1.1', UA_A, 'GET', '/skills/create-test/?utm_source=s-abc234'),
    line('10:01:00', '2.2.2.2', UA_B, 'GET', '/skills/create-test/?utm_source=s-abc234'),
    line('10:02:00', '3.3.3.3', UA_B, 'GET', '/skills/create-test/'),
    line('10:03:00', '3.3.3.3', UA_B, 'GET', '/downloads/create-test.zip'),
    line('10:04:00', '4.4.4.4', 'WhatsApp/2.23', 'GET', '/skills/create-test/?utm_source=s-abc234'),
    line('10:07:00', '5.5.5.5', UA_B, 'GET', '/skills/create-test/?utm_source=s-abc234', { a: '1' }),
  ];
  fs.writeFileSync(path.join(dir, 'access.log'), rest.join('\n') + '\n');
  const shares = [
    { id: 'abc234', skill: 'create-test', label: 'קבוצת מורי מתמטיקה', short: 'https://go.omri-iram.co.il/x', created: '2026-11-20T09:00:00Z' },
    { id: 'zzz999', skill: 'create-test', label: 'ניוזלטר', short: 'https://go.omri-iram.co.il/y', created: '2026-11-19T09:00:00Z' },
  ];
  const st = stats({ days: 30, now: new Date('2026-11-21T00:00:00Z'), shares });
  const a = st.shares.find((s) => s.id === 'abc234');
  assert.equal(a.visitors, 2, 'the WhatsApp preview bot and Omri himself are not counted');
  assert.equal(a.downloaders, 1, 'a download without the link does not count for it');
  assert.equal(a.signups, 1);
  assert.equal(st.shares[0].id, 'abc234', 'newest link first');
  assert.equal(st.shares.find((s) => s.id === 'zzz999').visitors, 0);
  assert.ok(st.sources.some((s) => s.source === '🔗 קבוצת מורי מתמטיקה' && s.visitors === 2));
});

test('a label is one clean line', () => {
  assert.equal(cleanLabel('  קבוצה <b>\n  של   מורים '), 'קבוצה b של מורים');
  assert.equal(cleanLabel('x'.repeat(200)).length, 80);
});

test('no list file = no links', () => {
  assert.deepEqual(readShares(), []);
});

test('a share link opens a skill, a bundle, the bundle list or the home page, and nothing else', () => {
  const site = { all: [{ name: 'create-test' }], bundles: [{ id: 'math-pack' }] };
  for (const p of ['/', '/bundles/', '/bundles/math-pack/', '/skills/create-test/']) assert.equal(checkPage(p, site), p);
  for (const p of ['/skills/nope/', '/bundles/nope/', '/admin/', '//evil.com/', '/skills/create-test', 'https://x.com/']) assert.equal(checkPage(p, site), null);
  assert.equal(pageOf({ skill: 'create-test' }), '/skills/create-test/', 'a link made before 2026-11-20 has only skill');
  assert.equal(pageOf({ page: '/' }), '/');
});
