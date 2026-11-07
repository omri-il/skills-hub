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

  function fallback(text) {
    var t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(t);
  }
})();
