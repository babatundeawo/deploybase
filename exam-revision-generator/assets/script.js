// Shared site behaviour: mobile nav, footer year, file preview/copy widgets,
// plus the premium layer — scroll progress, back-to-top, header elevation,
// cursor-spotlight cards, and scroll-reveal. Everything here is additive and
// queries generic selectors, so it works unmodified across every project page.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav ---------- */
    var hamburger = document.querySelector('[data-hamburger]');
    var nav = document.querySelector('[data-nav]');
    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ---------- Filebox preview + copy ---------- */
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

    /* ---------- Scroll progress bar ---------- */
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    function updateProgress() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      var pct = height > 0 ? (scrolled / height) * 100 : 0;
      progress.style.width = pct + '%';
    }

    /* ---------- Header elevation on scroll ---------- */
    var topbar = document.querySelector('.topbar');

    /* ---------- Back-to-top button ---------- */
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(backToTop);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        if (topbar) topbar.classList.toggle('is-scrolled', y > 8);
        backToTop.classList.toggle('is-visible', y > 480);
        updateProgress();
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Cursor-spotlight on cards ---------- */
    var spotlightTargets = document.querySelectorAll('.card, .kpi, .filebox, .callout');
    if (!reduceMotion) {
      spotlightTargets.forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
    }

    /* ---------- Scroll-reveal ---------- */
    var revealSelectors = '.card, .list-item, .kpi, .rule, .callout, .table-wrap, .summary-row, .section-head';
    var revealEls = document.querySelectorAll(revealSelectors);
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var seen = new Map();
      revealEls.forEach(function (el) {
        el.classList.add('reveal');
        var parent = el.parentElement;
        var idx = seen.get(parent) || 0;
        el.style.transitionDelay = Math.min(idx * 60, 360) + 'ms';
        seen.set(parent, idx + 1);
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  });
})();
