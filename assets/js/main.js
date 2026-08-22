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

document.addEventListener("DOMContentLoaded", renderGrid);

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
