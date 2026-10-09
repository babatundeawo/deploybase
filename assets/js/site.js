/* Deploybase shared behaviour. Plain JavaScript, no dependencies.
   Everything here is an enhancement: the site stays readable and usable
   without it (navigation links, raw file links and all content are static). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initNav();
    initHeader();
    initSpotlight();
    initFileboxes();
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
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
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
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  /* File boxes: load the instruction file when opened, with loading, error and retry states */
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
            code.textContent = "This file could not be loaded here. Use Open raw file above, or open this section again to retry.";
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
})();
