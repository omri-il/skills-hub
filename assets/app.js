// Filters and search on the home page, and the copy button on skill pages. The page works without it.
(function () {
  var state = { who: '', subject: '', platform: '', q: [] };
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('.card');
  var empty = document.getElementById('empty');
  var count = document.getElementById('count');
  var input = document.getElementById('q');

  // Hebrew search: no niqqud, no quotes or geresh, final letters as regular ones, lower case.
  function norm(t) {
    return (t || '').toLowerCase()
      .replace(/[֑-ׇ]/g, '')
      .replace(/["'`׳״“”‘’]/g, '')
      .replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ')
      .replace(/[^\wא-ת]+/g, ' ');
  }
  cards.forEach(function (c) { c._text = ' ' + norm(c.dataset.search || c.textContent) + ' '; });

  // A word matches as it is, without one Hebrew prefix letter (ה, ו, ב, ל, מ, ש, כ: "להורים" finds "הורים"),
  // or without a plural or feminine ending (ים, ות, ה, ת: "חומצה" finds "חומצות", "מצגות" finds "מצגת").
  function stem(w) { return w.length > 4 ? w.replace(/(ים|ות|ה|ת)$/, '') : w; }
  function has(text, word) {
    var forms = [word, stem(word)];
    if (word.length > 3 && 'הובלמשכ'.indexOf(word.charAt(0)) !== -1) forms.push(word.slice(1), stem(word.slice(1)));
    return forms.some(function (f) { return f.length > 1 && text.indexOf(f) !== -1; });
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (c) {
      var own = (c.dataset.groups || '').split('|');
      var fits = (c.dataset.fits || '').split('|');
      var who = (c.dataset.who || '').split('|');
      var plats = (c.dataset.platforms || '').split('|');
      // A group button (ריאליים, רב-מלל) shows the skills made for its subjects, then general skills
      // marked as fitting it (`fits` in meta.yaml).
      var isOwn = state.subject && own.indexOf(state.subject) !== -1;
      var ok = (!state.subject || isOwn || fits.indexOf(state.subject) !== -1) &&
               (!state.who || who.indexOf(state.who) !== -1) &&
               (!state.platform || plats.indexOf(state.platform) !== -1) &&
               state.q.every(function (w) { return has(c._text, w); });
      c.hidden = !ok;
      c.style.order = state.subject && !isOwn ? '1' : '';
      if (ok) shown++;
    });
    var filtered = state.who || state.subject || state.platform || state.q.length;
    if (count) count.textContent = filtered && shown ? (shown === 1 ? 'נמצא סקיל אחד' : 'נמצאו ' + shown + ' סקילים') : '';
    document.querySelectorAll('.grid').forEach(function (g) {
      var any = g.querySelector('.card:not([hidden])');
      g.hidden = !any;
      var head = g.previousElementSibling;
      if (head && head.classList.contains('sub-head')) head.hidden = !any;
    });
    if (empty) empty.hidden = shown !== 0;
    // A group button with no skill at all yet: say so, and point to the sign-up.
    var noSkillYet = state.subject && ![].some.call(cards, function (c) {
      return ((c.dataset.groups || '') + '|' + (c.dataset.fits || '')).split('|').indexOf(state.subject) !== -1;
    });
    var et = document.getElementById('empty-text');
    var es = document.getElementById('empty-subject');
    if (et && es) {
      et.hidden = !!noSkillYet;
      es.hidden = !noSkillYet;
      if (noSkillYet) {
        document.getElementById('empty-subject-name').textContent = state.subject;
        document.getElementById('empty-subject-name2').textContent = state.subject;
      }
    }
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

  if (input) {
    input.addEventListener('input', function () {
      state.q = norm(input.value).split(' ').filter(Boolean);
      apply();
    });
  }

  var reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', function () {
      state.who = state.subject = state.platform = '';
      state.q = [];
      if (input) input.value = '';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.value === '' ? 'true' : 'false'); });
      apply();
    });
  }

  // The next-workshop box (workshop.yaml) leaves once its workshop has started, even before the next build.
  document.querySelectorAll('[data-until]').forEach(function (box) {
    var until = Date.parse(box.dataset.until);
    if (!isNaN(until) && Date.now() > until) box.remove();
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
          say('מוריד קובץ ' + i + ' מתוך ' + files.length + '. הדפדפן שואל? מאשרים.');
          setTimeout(next, 900);
        } else {
          say('ירדו ' + files.length + ' קבצים. מעלים כל אחד לג\'מיני, בלי לפתוח.');
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

// The email box after a download (Omri, 2026-11-19, the Hormozi plan): the download is free and starts at
// once; then a small box asks for the email only, so the teacher hears when that skill improves.
// POST /signup with weekly=1 and skill=<names>: list 106, the skill goes into the person's record,
// and the first sign-up gets a welcome email (Listmonk selfservice/skills_mail.py).
(function () {
  if (!window.fetch || !window.URLSearchParams) return;
  var KEY = 'skillsSignedUp';
  function done() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  var shownOnce = false;

  function loadAltcha() {
    if (document.querySelector('script[src="/public/static/altcha.umd.js"]')) return;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = '/public/static/altcha.umd.js';
    document.head.appendChild(s);
  }

  function open(skill) {
    if (done() || shownOnce) return;
    shownOnce = true;
    loadAltcha();
    var many = skill.indexOf('|') !== -1;
    var box = document.createElement('aside');
    box.className = 'after-dl';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'after-dl-h');
    box.innerHTML =
      '<button type="button" class="after-dl-x" aria-label="סגירה">×</button>' +
      '<h2 id="after-dl-h">' + (many ? 'רוצים לדעת כשהסקילים האלה משתפרים?' : 'רוצים לדעת כשהסקיל הזה משתפר?') + '</h2>' +
      '<p>ג\'מיני משתנה כל כמה שבועות, ואני מתקן את הסקילים לפי זה. השאירו מייל, ואשלח לכם את הגרסה החדשה כשהיא יוצאת. ' +
      'פעם בשבוע יגיעו גם הסקילים החדשים. אפשר להסיר את עצמכם בלחיצה.</p>' +
      '<form class="after-dl-form" novalidate>' +
      '<label class="hp" aria-hidden="true">אל תמלאו שדה זה<input type="text" name="nonce" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email" dir="ltr" autocomplete="email" required maxlength="254" placeholder="המייל שלכם" aria-label="המייל שלכם">' +
      '<button type="submit" class="btn btn-cta">שלחו לי את העדכונים</button>' +
      '<altcha-widget auto="onload" hidefooter floating="false" challengeurl="/api/public/captcha/altcha" style="display:none"></altcha-widget>' +
      '</form>' +
      '<p class="after-dl-err" role="alert" hidden></p>';
    document.body.appendChild(box);
    var form = box.querySelector('form');
    var err = box.querySelector('.after-dl-err');
    var btn = form.querySelector('button');
    box.querySelector('.after-dl-x').addEventListener('click', function () { box.remove(); });
    setTimeout(function () { var i = form.querySelector('input[type=email]'); if (i) i.focus({ preventScroll: true }); }, 300);

    function answer() {
      var el = form.querySelector('altcha-widget input[name="altcha"]');
      return el && el.value ? el.value : '';
    }
    function fail(t) { err.textContent = t; err.hidden = false; btn.disabled = false; btn.textContent = 'שלחו לי את העדכונים'; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var email = form.elements.email.value.trim();
      if (email.indexOf('@') < 1 || email.indexOf('.', email.indexOf('@')) < 0) return fail('כתובת המייל לא נראית תקינה. נא לבדוק אותה.');
      btn.disabled = true;
      btn.textContent = 'רגע…';
      var tries = 0;
      (function wait() {
        var a = answer();
        if (!a && tries++ < 40) return setTimeout(wait, 250); // the check runs by itself; up to 10 seconds
        if (!a) return fail('הבדיקה נגד רובוטים לא הסתיימה. נסו שוב בעוד רגע.');
        var body = new URLSearchParams();
        body.append('email', email);
        body.append('weekly', '1');
        body.append('skill', skill);
        body.append('nonce', form.elements.nonce.value);
        body.append('altcha', a);
        fetch('/signup', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (d) {
            if (!d.ok) return fail(d.error || 'משהו השתבש. נסו שוב בעוד רגע.');
            mark();
            box.innerHTML = '<button type="button" class="after-dl-x" aria-label="סגירה">×</button>' +
              '<h2>תודה! נרשמתם.</h2><p>מייל ראשון בדרך אליכם, עם בקשה לדוגמה לנסות בג\'מיני.</p>';
            box.querySelector('.after-dl-x').addEventListener('click', function () { box.remove(); });
          })
          .catch(function () { fail('משהו השתבש. נסו שוב בעוד רגע.'); });
      })();
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-skill]');
    if (!a) return;
    var skill = a.getAttribute('data-skill');
    setTimeout(function () { open(skill); }, 1200); // after the download has started
  });
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
