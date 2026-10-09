// Deploybase build script. Runs inside GitHub Actions on every deploy.
// No dependencies: it only uses what ships with Node.
//
// What it does:
//   1. Reads data/projects.json (the registry).
//   2. Writes the registry cards, counts and structured data into index.html.
//   3. Writes sitemap.xml.
//   4. Copies the publishable files into dist/.
//   5. Checks every internal link, image, script, stylesheet and instruction
//      file, and stops with a clear message if anything is missing.

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIST = path.join(ROOT, "dist");
const EXCLUDE = new Set([".git", ".github", ".gitignore", "node_modules", "scripts", "docs", "data", "dist", "README.md", "CONTRIBUTING.md", "lighthouserc.json"]);

const data = JSON.parse(await fs.readFile(path.join(ROOT, "data/projects.json"), "utf8"));
const { site, projects } = data;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const problems = [];
const warnings = [];

/* ---------- 1. Validate the registry ---------- */
const seen = new Set();
for (const p of projects) {
  for (const key of ["id", "status", "name", "role", "summary", "stack", "href", "theme"]) {
    if (p[key] === undefined || p[key] === "") problems.push(`data/projects.json: "${p.id || p.name || "an entry"}" is missing "${key}".`);
  }
  if (seen.has(p.id)) problems.push(`data/projects.json: the id "${p.id}" is used twice.`);
  seen.add(p.id);
  if (!["active", "tool"].includes(p.status)) problems.push(`data/projects.json: "${p.id}" has status "${p.status}". Use "active" or "tool".`);
  if (!p.external) {
    try { await fs.access(path.join(ROOT, p.href, "index.html")); }
    catch { problems.push(`data/projects.json: "${p.id}" points to "${p.href}" but ${p.href}index.html does not exist.`); }
  }
}

/* ---------- 2. Render the hub ---------- */
const arrow = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const outbound = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';

function card(p) {
  const tool = p.status === "tool";
  const chips = p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("");
  const attrs = p.external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const cta = tool ? "Open tool" : "View deployment";
  const note = p.external ? '<span class="sr-only"> (opens in a new tab)</span>' : "";
  return `        <a class="card${tool ? " is-tool" : ""}" data-theme="${esc(p.theme)}" href="${esc(p.href)}"${attrs}>
          <div class="card-top">
            <span class="status${tool ? " tool" : ""}"><span class="dot" aria-hidden="true"></span>${tool ? "Live tool" : "Active"}</span>
            <span class="card-id">${esc(p.id)}</span>
          </div>
          <div>
            <div class="role">${esc(p.role)}</div>
            <h3>${esc(p.name)}</h3>
          </div>
          <p>${esc(p.summary)}</p>
          <div class="chips">${chips}</div>
          <div class="card-cta">${cta}${note} ${tool ? outbound : arrow}</div>
        </a>`;
}

const agents = projects.filter((p) => p.status === "active").length;
const tools = projects.filter((p) => p.status === "tool").length;
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const countText = `${plural(agents, "agent")} &middot; ${plural(tools, "live tool")}`;

const ld = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Deploybase - AI Deployment Directory",
  url: site.url,
  inLanguage: "en",
  author: { "@type": "Person", name: "Babatunde Awoyemi", url: "https://babatundeawo.github.io/" },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: p.external ? p.href : new URL(p.href, site.url).href,
    })),
  },
};

function inject(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the <!-- ${name}:start --> and <!-- ${name}:end --> markers.`);
  return html.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
}
function injectInline(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the <!-- ${name}:start --> and <!-- ${name}:end --> markers.`);
  return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}

let index = await fs.readFile(path.join(ROOT, "index.html"), "utf8");
index = inject(index, "registry", projects.map(card).join("\n"));
index = injectInline(index, "count", countText);
index = injectInline(index, "terminal", plural(projects.length, "deployment"));
index = inject(index, "ld", `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
await fs.writeFile(path.join(ROOT, "index.html"), index);

/* ---------- 3. Sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = ["", ...projects.filter((p) => !p.external).map((p) => p.href), ...(site.extraPages || [])];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
await fs.writeFile(path.join(ROOT, "sitemap.xml"), sitemap);

/* ---------- 4. Copy to dist ---------- */
async function copy(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copy(from, to);
    else await fs.copyFile(from, to);
  }
}
await fs.rm(DIST, { recursive: true, force: true });
await copy(ROOT, DIST);

/* ---------- 5. Check the built site ---------- */
async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}
const exists = async (f) => !!(await fs.stat(f).catch(() => null));
const ids = new Map();

const htmlFiles = (await walk(DIST)).filter((f) => f.endsWith(".html"));
for (const f of htmlFiles) {
  const html = await fs.readFile(f, "utf8");
  ids.set(f, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

for (const f of htmlFiles) {
  const rel = path.relative(DIST, f);
  const html = await fs.readFile(f, "utf8");
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\sdata-src="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta http-equiv="refresh" content="[^"]*url=([^"]+)"/g)].map((m) => m[1]),
  ];
  for (let ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const [pathPart, hash] = ref.split("#");
    let target = f;
    if (pathPart) {
      target = pathPart.startsWith("/") ? path.join(DIST, pathPart.replace(/^\/deploybase\//, "")) : path.resolve(path.dirname(f), pathPart);
      if (pathPart.endsWith("/") || (await fs.stat(target).catch(() => null))?.isDirectory()) target = path.join(target, "index.html");
      if (!(await exists(target))) { problems.push(`${rel}: "${ref}" points to a file that does not exist.`); continue; }
    }
    if (hash && target.endsWith(".html") && !ids.get(target)?.has(hash)) problems.push(`${rel}: "${ref}" points to a section (#${hash}) that does not exist.`);
  }
  // Light quality checks. These warn but do not stop the deploy.
  if (!/<title>[^<]+<\/title>/.test(html)) warnings.push(`${rel}: missing <title>.`);
  if (!/name="description"/.test(html)) warnings.push(`${rel}: missing meta description.`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) warnings.push(`${rel}: has ${h1s} <h1> headings (expected 1).`);
  if (/<img(?![^>]*\balt=)[^>]*>/.test(html)) warnings.push(`${rel}: an <img> has no alt text.`);
  if (/\sstyle="/.test(html)) warnings.push(`${rel}: has an inline style attribute, which the page's Content Security Policy blocks.`);
}

for (const w of warnings) console.log(`::warning::${w}`);
if (problems.length) {
  for (const p of problems) console.log(`::error::${p}`);
  console.error(`\nBuild stopped: ${problems.length} problem(s) found. Fix the lines above and commit again.`);
  process.exit(1);
}
console.log(`Build complete: ${htmlFiles.length} pages checked, ${warnings.length} warning(s), dist/ is ready.`);
