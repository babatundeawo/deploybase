// Shared site behaviour: mobile nav, footer year, and the file preview/copy widgets.
document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var hamburger = document.querySelector('[data-hamburger]');
  var nav = document.querySelector('[data-nav]');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // File preview + copy widgets: <div class="filebox" data-src="files/whatever.md">
  document.querySelectorAll('.filebox').forEach(function (box) {
    var src = box.getAttribute('data-src');
    var pre = box.querySelector('pre code');
    var copyBtn = box.querySelector('[data-copy]');
    var details = box.closest('details');
    var loaded = false;

    function load() {
      if (loaded || !src || !pre) return;
      loaded = true;
      pre.textContent = 'Loading…';
      fetch(src)
        .then(function (r) {
          if (!r.ok) throw new Error('not found');
          return r.text();
        })
        .then(function (text) {
          pre.textContent = text;
        })
        .catch(function () {
          pre.textContent = 'Could not load this file automatically. Use the "Open raw file" link above to view or copy it directly.';
        });
    }

    if (details) {
      details.addEventListener('toggle', function () {
        if (details.open) load();
      });
      if (details.open) load();
    } else {
      load();
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = pre ? pre.textContent : '';
        if (!text || text === 'Loading…') return;
        navigator.clipboard.writeText(text).then(function () {
          var original = copyBtn.textContent;
          copyBtn.textContent = 'Copied ✓';
          copyBtn.classList.add('is-copied');
          setTimeout(function () {
            copyBtn.textContent = original;
            copyBtn.classList.remove('is-copied');
          }, 1800);
        });
      });
    }
  });
});
