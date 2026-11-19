// Video helper (Omri, 2026-11-19): a side panel on a skill page that only Omri sees, to help him record a
// video about the skill: demo requests, Gemini's answer without and with the skill, what to point at.
// Other visitors get nothing: the script asks the server only when the admin login left the
// skills_admin_seen cookie, and the server sends the content only with the real login cookie
// (admin/server.js, /admin/api/video-help/<name>). The content is not in git: the repo is public.
// Key H (any keyboard language) hides the panel completely for a recording, and it stays hidden after a reload.
(function () {
  var m = location.pathname.match(/^\/skills\/([a-z0-9-]+)\/?$/);
  if (!m || !window.fetch || !/(?:^|;\s*)skills_admin_seen=1/.test(document.cookie)) return;
  var name = m[1];
  var KEY = 'videoHelpHidden';
  function get() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function put(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }

  fetch('/admin/api/video-help/' + name, { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (h) { if (h && h.demos) build(h); })
    .catch(function () {});

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function copy(text, status) {
    var done = function () { status.textContent = 'הועתק'; setTimeout(function () { status.textContent = ''; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
  }

  function build(h) {
    var style = el('style');
    style.textContent = [
      '#vh{position:fixed;top:0;bottom:0;inset-inline-end:0;width:min(420px,100vw);z-index:9999;background:#fff;color:#0f1d2e;',
      'box-shadow:0 0 0 1px #dde3ea,0 10px 40px rgba(0,32,69,.25);display:flex;flex-direction:column;font-family:Rubik,system-ui,sans-serif;line-height:1.5}',
      '#vh[hidden]{display:none}',
      '#vh .vh-top{background:#002045;color:#fff;padding:10px 14px;display:flex;align-items:center;gap:10px}',
      '#vh .vh-top b{flex:1;font-weight:600}',
      '#vh .vh-top button{font:inherit;font-size:.85rem;background:#FFC250;color:#002045;border:0;border-radius:8px;padding:5px 10px;cursor:pointer;font-weight:600}',
      '#vh .vh-body{overflow:auto;padding:12px 14px;flex:1}',
      '#vh .vh-open{background:#e6f4ec;border-radius:10px;padding:8px 12px;margin:0 0 12px}',
      '#vh .vh-demo{border:1px solid #dde3ea;border-radius:12px;padding:10px 12px;margin:0 0 12px}',
      '#vh h3{font-size:.98rem;margin:0 0 6px}',
      '#vh .vh-prompt{background:#fff8e6;border:1px solid #FFC250;border-radius:8px;padding:8px 10px;white-space:pre-wrap;unicode-bidi:plaintext;font-size:.92rem;margin:0 0 6px}',
      '#vh .vh-copy{font:inherit;font-size:.85rem;border:1px solid #002045;background:#fff;color:#002045;border-radius:8px;padding:4px 10px;cursor:pointer}',
      '#vh .vh-st{font-size:.85rem;color:#146c43;margin-inline-start:8px}',
      '#vh .vh-small{font-size:.85rem;color:#4b5a6b;margin:6px 0}',
      '#vh ul{margin:6px 0 8px;padding-inline-start:20px;font-size:.92rem}',
      '#vh details{border:1px solid #dde3ea;border-radius:8px;margin:0 0 6px}',
      '#vh summary{cursor:pointer;padding:6px 10px;font-weight:600;font-size:.92rem}',
      '#vh .vh-ans{white-space:pre-wrap;unicode-bidi:plaintext;padding:0 10px 10px;font-size:.85rem;max-height:50vh;overflow:auto}',
      '#vh .vh-foot{border-top:1px solid #dde3ea;padding:8px 14px;font-size:.85rem;color:#4b5a6b}',
      '#vh a{color:#002045}'
    ].join('');
    document.head.appendChild(style);

    var box = el('aside');
    box.id = 'vh';
    box.setAttribute('aria-label', 'עזרה לסרטון');
    var top = el('div', 'vh-top');
    top.appendChild(el('b', null, '🎬 עזרה לסרטון'));
    var hide = el('button', null, 'להסתיר (H)');
    hide.type = 'button';
    hide.addEventListener('click', function () { set(true); });
    top.appendChild(hide);
    box.appendChild(top);

    var body = el('div', 'vh-body');
    if (h.opening) body.appendChild(el('p', 'vh-open', h.opening));
    (h.demos || []).forEach(function (d, i) {
      var s = el('section', 'vh-demo');
      s.appendChild(el('h3', null, (i + 1) + '. ' + (d.label || 'בקשה לדוגמה')));
      s.appendChild(el('div', 'vh-prompt', d.prompt || ''));
      var row = el('div');
      var b = el('button', 'vh-copy', 'להעתיק את הבקשה');
      b.type = 'button';
      var st = el('span', 'vh-st');
      b.addEventListener('click', function () { copy(d.prompt || '', st); });
      row.appendChild(b); row.appendChild(st);
      s.appendChild(row);
      if (d.followup) s.appendChild(el('p', 'vh-small', 'אם Gemini שואל שאלה, לענות: ' + d.followup));
      if (d.show && d.show.length) {
        s.appendChild(el('b', null, 'מה להראות במצלמה'));
        var ul = el('ul');
        d.show.forEach(function (x) { ul.appendChild(el('li', null, x)); });
        s.appendChild(ul);
      }
      [['Gemini בלי הסקיל', d.without], ['Gemini עם הסקיל', d['with']]].forEach(function (p) {
        var det = el('details');
        det.appendChild(el('summary', null, p[0]));
        det.appendChild(el('div', 'vh-ans', p[1] || ''));
        s.appendChild(det);
      });
      body.appendChild(s);
    });
    box.appendChild(body);

    var foot = el('div', 'vh-foot');
    foot.appendChild(document.createTextNode('רק אתה רואה את החלון הזה. H מסתיר ומחזיר. בטלפון: '));
    var a = el('a', null, location.host + '/admin/video/' + name);
    a.href = '/admin/video/' + name;
    a.target = '_blank';
    a.rel = 'noopener';
    a.dir = 'ltr';
    foot.appendChild(a);
    box.appendChild(foot);
    document.body.appendChild(box);

    function set(hidden) { box.hidden = hidden; put(hidden); }
    set(get());
    document.addEventListener('keydown', function (e) {
      if (e.code !== 'KeyH' || e.ctrlKey || e.altKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      set(!box.hidden);
    });
  }
})();
