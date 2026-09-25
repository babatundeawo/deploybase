const arrowSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const externalSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>`;

function cardTemplate(p) {
  const isTool = p.status === "tool";
  const statusLabel = isTool ? "Live tool" : "Active";
  const chips = p.stack.map(s => `<span class="chip">${s}</span>`).join("");
  const ctaLabel = isTool ? "Open tool" : "View deployment";
  const ctaIcon = isTool ? externalSVG : arrowSVG;
  return `
  <a class="card" href="${p.href}"${p.external ? ' target="_blank" rel="noopener"' : ''}>
    <div class="card-top">
      <span class="status${isTool ? ' tool' : ''}"><span class="dot"></span>${statusLabel}</span>
      <span class="card-id">${p.id}</span>
    </div>
    <div>
      <div class="role">${p.role}</div>
      <h3>${p.name}</h3>
    </div>
    <p>${p.summary}</p>
    <div class="chips">${chips}</div>
    <div class="card-cta">${ctaLabel} ${ctaIcon}</div>
  </a>`;
}

function renderGrid() {
  const grid = document.getElementById("deploy-grid");
  const countEl = document.getElementById("deploy-count");
  if (!grid) return;
  try {
    const projects = window.PROJECTS || [];
    if (!projects.length) throw new Error("empty registry");
    grid.innerHTML = projects.map(cardTemplate).join("");
    const agents = projects.filter(p => p.status === "active").length;
    const tools = projects.filter(p => p.status === "tool").length;
    if (countEl) countEl.textContent = `${agents} agent${agents === 1 ? "" : "s"} · ${tools} live tool${tools === 1 ? "" : "s"}`;
    const termCount = document.getElementById("term-count");
    if (termCount) termCount.textContent = `${projects.length} deployments`;
  } catch (e) {
    grid.innerHTML = `<p>Could not load the deployment registry — check that assets/data/projects.js is linked before assets/js/main.js.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderGrid();
  revealCards();
  attachSpotlight();
});

// Mobile nav toggle (hamburger), same pattern used on the project detail pages.
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector("[data-hamburger]");
  const nav = document.querySelector("[data-nav]");
  if (!hamburger || !nav) return;
  hamburger.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
});

/* =========================================================
   Premium layer — scroll progress, back-to-top, header
   elevation, card spotlight, scroll-reveal
========================================================= */
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", function () {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.body.appendChild(backToTop);

  const header = document.querySelector(".site-header");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      backToTop.classList.toggle("is-visible", y > 480);
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      progress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

function attachSpotlight() {
  if (reduceMotion) return;
  document.querySelectorAll(".card, .note-card").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
}

function revealCards() {
  // Cards render async once PROJECTS loads, so watch the grid for children
  // and reveal them with a staggered fade once they exist and scroll into view.
  const grid = document.getElementById("deploy-grid");
  const targets = document.querySelectorAll(".note-card");
  targets.forEach(function (el) { el.classList.add("reveal"); });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    if (grid) {
      new MutationObserver(function () {
        grid.querySelectorAll(".card").forEach(function (el) { el.classList.add("is-visible"); });
      }).observe(grid, { childList: true });
    }
    return;
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  if (grid) {
    new MutationObserver(function () {
      grid.querySelectorAll(".card").forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.transitionDelay = Math.min(i * 55, 400) + "ms";
        io.observe(el);
      });
    }).observe(grid, { childList: true });
  }
}
