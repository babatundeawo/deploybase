/* Runs before first paint (loaded without defer) so the saved colour scheme is
   applied immediately and the page never flashes the wrong theme. */
(function () {
  "use strict";
  var KEY = "deploybase-scheme";
  var root = document.documentElement;

  function stored() {
    try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; }
    catch (e) { return null; }
  }

  function syncThemeColor(scheme) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i];
      if (!scheme) { if (m.dataset.media) m.setAttribute("media", m.dataset.media); continue; }
      var wanted = m.dataset.scheme === scheme;
      m.setAttribute("media", wanted ? "all" : "not all");
    }
  }

  window.__deploybaseScheme = {
    key: KEY,
    stored: stored,
    apply: function (scheme) {
      if (scheme) root.setAttribute("data-scheme", scheme); else root.removeAttribute("data-scheme");
      syncThemeColor(scheme);
    },
  };

  var saved = stored();
  if (saved) {
    root.setAttribute("data-scheme", saved);
    document.addEventListener("DOMContentLoaded", function () { syncThemeColor(saved); });
  }
})();
