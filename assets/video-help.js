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

  // "בלי הסקיל: X. עם הסקיל: Y." -> Y, cut to 12 words: what to point at on camera.
  function shortPoint(p) {
    var t = String(p);
    var i = t.indexOf('עם הסקיל:');
    if (i !== -1) t = t.slice(i + 'עם הסקיל:'.length);
    t = t.trim().replace(/\.$/, '');
    var words = t.split(/\s+/);
    return words.length > 12 ? words.slice(0, 12).join(' ') + '…' : t;
  }

  function build(h) {
    var style = el('style');
    style.textContent = [
      '#vh{position:fixed;bottom:16px;inset-inline-end:16px;width:min(300px,calc(100vw - 32px));z-index:9999;background:#fff;color:#0f1d2e;border-radius:14px;overflow:hidden;',
      'box-shadow:0 0 0 1px #dde3ea,0 10px 40px rgba(0,32,69,.25);display:flex;flex-direction:column;font-family:Rubik,system-ui,sans-serif;line-height:1.45}',
      '#vh .vh-row{margin:0 0 10px}',
      '.vh-back{position:fixed;bottom:12px;inset-inline-end:12px;z-index:9999;width:40px;height:40px;border-radius:50%;border:0;background:#002045;color:#fff;font-size:18px;cursor:pointer;opacity:0;transition:opacity .2s}',
      '.vh-back:hover,.vh-back:focus-visible{opacity:1}',
      '.vh-back[hidden]{display:none}',
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
    top.appendChild(el('b', null, '🎬 ' + (h.title || 'עזרה לסרטון')));
    var hide = el('button', null, 'להסתיר (H)');
    hide.type = 'button';
    hide.addEventListener('click', function () { set(true); });
    top.appendChild(hide);
    box.appendChild(top);

    // Short on purpose (Omri, 2026-11-19: "90% less"): one request to copy and 3 short things to point at.
    // The full answers stay on the phone page, /admin/video/<name>.
    var body = el('div', 'vh-body');
    var d = (h.demos || [])[0];
    if (d) {
      var row = el('div', 'vh-row');
      var b = el('button', 'vh-copy', 'להעתיק בקשה: ' + (d.label || 'דוגמה'));
      b.type = 'button';
      var st = el('span', 'vh-st');
      b.addEventListener('click', function () { copy(d.prompt || '', st); });
      row.appendChild(b); row.appendChild(st);
      body.appendChild(row);
      if (d.show && d.show.length) {
        body.appendChild(el('b', null, 'להראות:'));
        var ul = el('ul');
        d.show.forEach(function (x) { ul.appendChild(el('li', null, shortPoint(x))); });
        body.appendChild(ul);
      }
    }
    body.appendChild(el('p', 'vh-small', 'H מסתיר ומחזיר'));
    box.appendChild(body);
    document.body.appendChild(box);

    // When the panel is hidden, a small 🎬 button waits in the corner. It is invisible until the mouse
    // reaches it, so it does not show in a recording.
    var back = el('button', 'vh-back', '🎬');
    back.type = 'button';
    back.title = 'להחזיר את העזרה לסרטון';
    back.setAttribute('aria-label', 'להחזיר את העזרה לסרטון');
    back.addEventListener('click', function () { set(false); });
    document.body.appendChild(back);

    function set(hidden) { box.hidden = hidden; back.hidden = !hidden; put(hidden); }
    set(get());
    document.addEventListener('keydown', function (e) {
      if (e.code !== 'KeyH' || e.ctrlKey || e.altKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      set(!box.hidden);
    });
  }
})();
