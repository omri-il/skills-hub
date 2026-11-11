// Filters on the home page, and the copy button on skill pages. The page works without it.
(function () {
  var state = { subject: '', platform: '' };
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('.card');
  var empty = document.getElementById('empty');

  function apply() {
    var shown = 0;
    cards.forEach(function (c) {
      var subs = (c.dataset.subjects || '').split('|');
      var plats = (c.dataset.platforms || '').split('|');
      var ok = (!state.subject || subs.indexOf(state.subject) !== -1) &&
               (!state.platform || plats.indexOf(state.platform) !== -1);
      c.hidden = !ok;
      if (ok) shown++;
    });
    document.querySelectorAll('.grid').forEach(function (g) {
      var any = g.querySelector('.card:not([hidden])');
      g.hidden = !any;
      var head = g.previousElementSibling;
      if (head && head.classList.contains('sub-head')) head.hidden = !any;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var group = chip.dataset.filter;
      state[group] = chip.dataset.value;
      document.querySelectorAll('.chip[data-filter="' + group + '"]').forEach(function (c) {
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      apply();
    });
  });

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.dataset.copy);
      var status = btn.parentElement.querySelector('.copy-status');
      var text = src ? src.textContent : '';
      var done = function () { if (status) status.textContent = 'הועתק'; setTimeout(function () { if (status) status.textContent = ''; }, 2500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
      } else { fallback(text); done(); }
    });
  });

  // A bundle button downloads each skill's zip separately, so nobody has to extract anything.
  document.querySelectorAll('[data-files]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (btn.dataset.busy) return;
      btn.dataset.busy = '1';
      var files = btn.dataset.files.split('|');
      var box = btn.closest('.card, .bundle-cta, .dl-box, .side-box');
      var status = box ? box.querySelector('.dl-status') : null;
      var say = function (text) { if (status) status.textContent = text; };
      var i = 0;
      (function next() {
        var a = document.createElement('a');
        a.href = '/downloads/' + files[i] + '.zip';
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        i++;
        if (i < files.length) {
          say('מוריד קובץ ' + i + ' מתוך ' + files.length + '. אם הדפדפן שואל, מאשרים הורדה של כמה קבצים.');
          setTimeout(next, 900);
        } else {
          say('ירדו ' + files.length + ' קבצים. לא פותחים אותם: מעלים כל אחד לג\'מיני כמו שהוא.');
          delete btn.dataset.busy;
        }
      })();
    });
  });

  function fallback(text) {
    var t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
  }
})();

// Sign-up form (home page): POST /signup, which nginx sends to listmonk-selfservice.
(function () {
  var form = document.getElementById('signupForm');
  if (!form || !window.fetch) return;
  var btn = document.getElementById('signupBtn');
  var err = document.getElementById('signupErr');
  var altcha = document.getElementById('altcha');
  // Read the captcha's answer when sending, never earlier: it is single-use and expires.
  function solved() {
    var el = altcha && altcha.querySelector('input[name="altcha"]');
    return el && el.value ? el.value : '';
  }
  function fail(text) {
    err.textContent = text;
    err.hidden = false;
    btn.disabled = false;
    btn.textContent = 'הרשמה';
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    var f = form.elements;
    var email = f.email.value.trim();
    if (!f.name.value.trim()) return fail('נא למלא שם.');
    if (email.indexOf('@') < 1 || email.indexOf('.', email.indexOf('@')) < 0) return fail('כתובת המייל לא נראית תקינה. נא לבדוק אותה.');
    if (!f.weekly.checked && !f.beta.checked) return fail('נא לסמן לפחות אחת משתי האפשרויות.');
    var answer = solved();
    if (!answer) return fail('רגע, עוד מסתיימת בדיקת אבטחה קצרה. נסו שוב בעוד שנייה.');
    var body = new URLSearchParams();
    body.append('name', f.name.value.trim());
    body.append('email', email);
    body.append('subject', f.subject.value.trim());
    if (f.weekly.checked) body.append('weekly', '1');
    if (f.beta.checked) body.append('beta', '1');
    body.append('nonce', f.nonce.value);
    body.append('altcha', answer);
    btn.disabled = true;
    btn.textContent = 'רגע…';
    fetch('/signup', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      .then(function (res) { return res.json().catch(function () { return {}; }); })
      .then(function (data) {
        if (data.ok) {
          document.getElementById('signupFields').hidden = true;
          document.getElementById('signupDone').hidden = false;
        } else {
          fail(data.error || 'משהו השתבש בהרשמה. אפשר לנסות שוב, ואם זה חוזר, לכתוב לי ל-hello@omri-iram.co.il');
        }
      })
      .catch(function () { fail('משהו השתבש בהרשמה. אפשר לנסות שוב, ואם זה חוזר, לכתוב לי ל-hello@omri-iram.co.il'); });
  });
})();
