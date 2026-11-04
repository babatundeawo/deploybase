/* Deploybase shared behaviour. Plain JavaScript, no dependencies.
   Everything here is an enhancement: the site stays readable and usable
   without it (navigation links, raw file links and all content are static). */
(function () {
  "use strict";

  var SCRIPT_URL = document.currentScript ? document.currentScript.src : "";
  var ROOT_URL = SCRIPT_URL ? new URL("../../", SCRIPT_URL) : new URL("./", location.href);

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { /* private mode or blocked storage: carry on without it */ }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initNav();
    initThemeToggle();
    initHeader();
    initProgress();
    initSpotlight();
    initFileboxes();
    initShare();
    initNetwork();
    initServiceWorker();
    initInstall();
  });

  /* Footer year */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* Mobile menu: toggle, Escape to close, close on link tap or outside tap */
  function initNav() {
    var button = document.querySelector("[data-hamburger]");
    var nav = document.querySelector("[data-nav]");
    if (!button || !nav) return;

    function setOpen(open, returnFocus) {
      nav.classList.toggle("is-open", open);
      button.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open && returnFocus) button.focus();
    }

    button.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"), false);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !button.contains(e.target)) setOpen(false, false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setOpen(false, false);
    });
  }

  /* Light / dark toggle. Follows the system until the visitor chooses. */
  function initThemeToggle() {
    var api = window.__deploybaseScheme;
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!api || !buttons.length) return;
    var query = window.matchMedia("(prefers-color-scheme: dark)");

    function current() {
      return document.documentElement.getAttribute("data-scheme") || (query.matches ? "dark" : "light");
    }
    function label() {
      var next = current() === "dark" ? "light" : "dark";
      buttons.forEach(function (b) { b.setAttribute("aria-label", "Switch to " + next + " theme"); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        api.apply(next);
        store(api.key, next);
        label();
      });
    });
    if (query.addEventListener) query.addEventListener("change", label);
    label();
  }

  /* Header shrink on scroll, back-to-top button, active section highlight */
  function initHeader() {
    var header = document.querySelector(".site-header");

    var toTop = document.createElement("button");
    toTop.className = "back-to-top";
    toTop.type = "button";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    document.body.appendChild(toTop);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        if (header) header.classList.toggle("is-scrolled", y > 8);
        toTop.classList.toggle("is-visible", y > 520);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav] a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) map[target.id] = a;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var active = map[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
  }

  /* Reading progress bar on long pages (CSS drives it where scroll timelines exist) */
  function initProgress() {
    if (document.documentElement.scrollHeight < window.innerHeight * 2.2) return;
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    if (window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
        ticking = false;
      });
    }, { passive: true });
  }

  /* Cursor-aware glow on cards (mouse and trackpad only) */
  function initSpotlight() {
    if (reduceMotion || !canHover) return;
    document.querySelectorAll(".card").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* Toast */
  var toast, toastTimer;
  function showToast(message, isError) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("is-error", !!isError);
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  /* Clipboard with a fallback for browsers or contexts that block the Clipboard API */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.className = "sr-only";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  /* File boxes: load the instruction file when opened, with loading, error, offline and retry states */
  function initFileboxes() {
    document.querySelectorAll(".filebox").forEach(function (box) {
      var src = box.getAttribute("data-src");
      var code = box.querySelector("pre code");
      var copyBtn = box.querySelector("[data-copy]");
      var details = box.closest("details");
      var state = "idle";

      function load() {
        if (!src || !code || state === "loading" || state === "done") return;
        state = "loading";
        box.classList.add("is-loading");
        box.classList.remove("has-error");
        code.textContent = "Loading file";
        fetch(src)
          .then(function (res) {
            if (!res.ok) throw new Error("not found");
            return res.text();
          })
          .then(function (text) {
            code.textContent = text;
            state = "done";
          })
          .catch(function () {
            code.textContent = navigator.onLine === false
              ? "You are offline and this file has not been saved on this device yet. Reconnect, then open this section again."
              : "This file could not be loaded here. Use Open raw file above, or open this section again to retry.";
            box.classList.add("has-error");
            state = "error";
          })
          .then(function () { box.classList.remove("is-loading"); });
      }

      if (details) {
        details.addEventListener("toggle", function () {
          if (details.open) load();
        });
        if (details.open) load();
      } else {
        load();
      }

      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          if (state !== "done") { load(); showToast("File is still loading, try again in a moment", true); return; }
          copyText(code.textContent).then(function () {
            var original = copyBtn.textContent;
            copyBtn.textContent = "Copied";
            copyBtn.classList.add("is-copied");
            showToast("Copied to clipboard");
            if (navigator.vibrate && !reduceMotion) navigator.vibrate(12);
            setTimeout(function () {
              copyBtn.textContent = original;
              copyBtn.classList.remove("is-copied");
            }, 1800);
          }).catch(function () {
            showToast("Copy was blocked. Select the text and copy it manually.", true);
          });
        });
      }
    });
  }

  /* Share button (Web Share API) shown only where the browser supports it */
  function initShare() {
    var slot = document.querySelector("[data-share]");
    if (!slot || !navigator.share) return;
    slot.hidden = false;
    slot.addEventListener("click", function () {
      navigator.share({ title: document.title, url: location.href.split("#")[0] }).catch(function () { /* dismissed */ });
    });
  }

  /* Honest offline state */
  function initNetwork() {
    var banner;
    function show(offline) {
      if (offline && !banner) {
        banner = document.createElement("div");
        banner.className = "net-banner";
        banner.setAttribute("role", "status");
        banner.textContent = "You are offline. Pages you have opened before still work.";
        document.body.appendChild(banner);
      }
      if (banner) banner.hidden = !offline;
    }
    window.addEventListener("offline", function () { show(true); });
    window.addEventListener("online", function () { show(false); });
    show(navigator.onLine === false);
    document.querySelectorAll("[data-reload]").forEach(function (b) {
      b.addEventListener("click", function () { location.reload(); });
    });
  }

  /* Small card used for the update notice and the install prompt */
  function makeCard(opts) {
    var card = document.createElement("section");
    card.className = "app-card" + (opts.className ? " " + opts.className : "");
    card.setAttribute("role", "region");
    card.setAttribute("aria-label", opts.title);
    var h = document.createElement("h2");
    h.textContent = opts.title;
    card.appendChild(h);
    if (opts.text) {
      var p = document.createElement("p");
      p.textContent = opts.text;
      card.appendChild(p);
    }
    if (opts.body) card.appendChild(opts.body);
    var row = document.createElement("div");
    row.className = "row";
    opts.actions.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-sm " + (a.primary ? "btn-primary" : "btn-ghost");
      b.textContent = a.label;
      b.addEventListener("click", function () { a.run(card); });
      row.appendChild(b);
    });
    card.appendChild(row);
    document.body.appendChild(card);
    var first = row.querySelector("button");
    if (first && opts.focus) first.focus();
    return card;
  }

  /* Service worker with a safe update flow: a new version waits until the visitor taps Refresh */
  function initServiceWorker() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    var reloading = false;
    var hadController = !!navigator.serviceWorker.controller;

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (reloading || !hadController) return;
      reloading = true;
      location.reload();
    });

    function offerUpdate(worker) {
      if (document.querySelector(".app-card.is-update")) return;
      makeCard({
        className: "is-update",
        title: "Update available",
        text: "A newer version of Deploybase is ready. Refresh to use it.",
        actions: [
          { label: "Refresh", primary: true, run: function () { worker.postMessage({ type: "SKIP_WAITING" }); } },
          { label: "Later", run: function (card) { card.remove(); } },
        ],
      });
    }

    var swUrl = new URL("sw.js", ROOT_URL).href;
    navigator.serviceWorker.register(swUrl, { scope: ROOT_URL.pathname }).then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener("updatefound", function () {
        var installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", function () {
          if (installing.state === "installed" && navigator.serviceWorker.controller) offerUpdate(installing);
        });
      });
      // Look for a new version whenever the visitor returns to the tab.
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") reg.update().catch(function () { /* offline */ });
      });
    }).catch(function () { /* the site works fine without a service worker */ });
  }

  /* Install prompt: Chrome and Android use the install event, iPhone and iPad get a short guide */
  function initInstall() {
    var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
    var DISMISS = "deploybase-install-dismissed";
    var VISITS = "deploybase-visits";
    var links = document.querySelectorAll("[data-install]");
    var deferred = null;
    var card = null;

    if (standalone) { links.forEach(function (l) { l.hidden = true; }); return; }

    var visits = (parseInt(store(VISITS), 10) || 0) + 1;
    store(VISITS, String(visits));

    function dismissedRecently() {
      var t = parseInt(store(DISMISS), 10);
      return t && Date.now() - t < 14 * 24 * 3600 * 1000;
    }
    function closeCard(remember) {
      if (card) { card.remove(); card = null; }
      if (remember) store(DISMISS, String(Date.now()));
    }

    var ua = navigator.userAgent || "";
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isSafariLike = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);

    function iosGuide() {
      var body = document.createElement("ol");
      body.innerHTML = '<li>Tap the <strong>Share</strong> button <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg> at the bottom of Safari.</li>' +
        '<li>Scroll down and tap <strong>Add to Home Screen</strong>.</li><li>Tap <strong>Add</strong>. Deploybase now opens like an app.</li>';
      closeCard(false);
      card = makeCard({
        title: "Add Deploybase to your Home Screen",
        body: body,
        actions: [{ label: "Got it", primary: true, run: function () { closeCard(true); } }],
        focus: true,
      });
    }

    function chromeInstall() {
      if (!deferred) return;
      closeCard(false);
      card = makeCard({
        title: "Install Deploybase",
        text: "Open the registry from your home screen, even when you are offline.",
        actions: [
          { label: "Install", primary: true, run: function () {
              var ev = deferred; deferred = null; closeCard(false);
              ev.prompt();
              ev.userChoice.then(function (c) { if (c && c.outcome === "dismissed") store(DISMISS, String(Date.now())); });
          } },
          { label: "Not now", run: function () { closeCard(true); } },
        ],
      });
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferred = e;
      links.forEach(function (l) { l.hidden = false; });
      // Wait until the visitor has had a chance to look around.
      if (!dismissedRecently() && visits >= 2) setTimeout(function () { if (deferred && !card) chromeInstall(); }, 20000);
    });
    window.addEventListener("appinstalled", function () {
      deferred = null; closeCard(false);
      links.forEach(function (l) { l.hidden = true; });
      showToast("Deploybase is installed");
    });

    if (isIOS && isSafariLike) {
      links.forEach(function (l) { l.hidden = false; });
      if (!dismissedRecently() && visits >= 2) setTimeout(function () { if (!card) iosGuide(); }, 20000);
    }

    links.forEach(function (l) {
      l.addEventListener("click", function () {
        if (deferred) chromeInstall(); else if (isIOS) iosGuide();
      });
    });
  }
})();
