/* Soft redirect for pages that have moved. GitHub Pages cannot send real 301 redirects,
   so these pages also carry a meta refresh, a canonical link to the new address and a visible link. */
(function () {
  "use strict";
  var meta = document.querySelector('meta[http-equiv="refresh"]');
  var match = meta && /url=(.+)$/i.exec(meta.getAttribute("content") || "");
  if (match) location.replace(new URL(match[1].trim(), location.href).href);
})();
