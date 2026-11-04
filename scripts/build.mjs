// Deploybase build script. Runs inside GitHub Actions on every deploy.
// No dependencies: it only uses what ships with Node.
//
// What it does:
//   1. Reads data/projects.json (the registry) and data/themes.json (colours and fonts).
//   2. Writes the registry cards, ledger, counts and structured data into index.html.
//   3. Keeps every page's theme-color lines in step with data/themes.json.
//   4. Copies the publishable files into dist/ and generates the files that depend on
//      the build: themes.css, 404.html, offline.html, sitemap.xml, robots.txt and sw.js.
//   5. Checks every internal link, image, script, stylesheet and instruction file, the
//      manifest, the service worker's file list and the colour contrast of every theme.
//      It stops with a plain message if something that would break the site is wrong.
//
// The base path (for example /deploybase/) comes from "site.url" in data/projects.json,
// so the same code works on username.github.io/repo/ and on a custom domain.

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { buildThemes } from "./lib/themes.mjs";
import { CSP, slugOf, syncThemeColor } from "./lib/page.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIST = path.join(ROOT, "dist");
const EXCLUDE = new Set([
  ".git", ".github", ".gitignore", "node_modules", "scripts", "docs", "data", "dist",
  "README.md", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "LICENSE", "lighthouserc.json",
]);

const read = (f) => fs.readFile(path.join(ROOT, f), "utf8");
const data = JSON.parse(await read("data/projects.json"));
const themeConfig = JSON.parse(await read("data/themes.json"));
const { site, projects } = data;

const siteUrl = new URL(site.url);
const BASE = siteUrl.pathname.endsWith("/") ? siteUrl.pathname : siteUrl.pathname + "/";
const SITE = siteUrl.origin + BASE;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const problems = [];
const warnings = [];
const exists = async (f) => !!(await fs.stat(f).catch(() => null));

/* ---------- 1. Validate the registry and themes ---------- */
const seen = new Set();
for (const p of projects) {
  for (const key of ["id", "status", "name", "role", "summary", "stack", "href", "theme"]) {
    if (p[key] === undefined || p[key] === "") problems.push(`data/projects.json: "${p.id || p.name || "an entry"}" is missing "${key}".`);
  }
  if (seen.has(p.id)) problems.push(`data/projects.json: the id "${p.id}" is used twice.`);
  seen.add(p.id);
  if (!["active", "tool"].includes(p.status)) problems.push(`data/projects.json: "${p.id}" has status "${p.status}". Use "active" or "tool".`);
  if (!themeConfig.themes[p.theme]) problems.push(`data/themes.json: there is no theme called "${p.theme}" (used by "${p.id}").`);
  if (!p.external && !(await exists(path.join(ROOT, p.href, "index.html")))) {
    problems.push(`data/projects.json: "${p.id}" points to "${p.href}" but ${p.href}index.html does not exist.`);
  }
}

/* ---------- 2. Themes ---------- */
const themes = buildThemes(themeConfig);
for (const f of themes.failures) {
  warnings.push(`data/themes.json: ${f.label}: ${f.pair} has a contrast ratio of ${f.ratio.toFixed(2)} (needs 4.5). Make that colour darker or lighter.`);
}

/* ---------- 3. Render the hub ---------- */
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

function ledgerRow(p) {
  const attrs = p.external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const note = p.external ? '<span class="sr-only"> (opens in a new tab)</span>' : "";
  return `        <li data-theme="${esc(p.theme)}"><a href="${esc(p.href)}"${attrs}><span class="led" aria-hidden="true"></span><span class="l-name">${esc(p.name)}${note}<small>${esc(p.role)}</small></span><span class="l-id">${esc(p.id)}</span></a></li>`;
}

const agents = projects.filter((p) => p.status === "active").length;
const tools = projects.filter((p) => p.status === "tool").length;
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const countText = `${plural(agents, "agent")} &middot; ${plural(tools, "live tool")}`;

const person = { "@type": "Person", name: "Babatunde Awoyemi", url: "https://babatundeawo.github.io/" };
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": SITE + "#website", name: "Deploybase", url: SITE, inLanguage: "en", publisher: person },
    {
      "@type": "CollectionPage",
      name: "Deploybase - AI Deployment Directory",
      url: SITE,
      inLanguage: "en",
      isPartOf: { "@id": SITE + "#website" },
      author: person,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: p.external ? p.href : new URL(p.href, SITE).href,
        })),
      },
    },
  ],
};

function inject(html, name, content, inline = false) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the <!-- ${name}:start --> and <!-- ${name}:end --> markers.`);
  return html.replace(re, (_, a, b) => (inline ? `${a}${content}${b}` : `${a}\n${content}\n${b}`));
}

let index = await read("index.html");
index = inject(index, "registry", projects.map(card).join("\n"));
index = inject(index, "ledger", projects.map(ledgerRow).join("\n"));
index = inject(index, "count", countText, true);
index = inject(index, "terminal", plural(projects.length, "deployment"), true);
index = inject(index, "ld", `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
await fs.writeFile(path.join(ROOT, "index.html"), index);

/* ---------- 4. Keep theme-color lines in step with the themes ---------- */
async function sourcePages(dir = ROOT) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await sourcePages(full)));
    else if (entry.name === "index.html") out.push(full);
  }
  return out;
}
for (const file of await sourcePages()) {
  const html = await fs.readFile(file, "utf8");
  const slug = slugOf(html);
  const palette = themes.palettes[slug];
  const rel = path.relative(ROOT, file);
  if (!palette) { problems.push(`${rel}: data-theme="${slug}" has no entry in data/themes.json.`); continue; }
  const next = syncThemeColor(html, palette);
  if (next !== html) await fs.writeFile(file, next);
}

/* ---------- 5. Copy to dist and generate ---------- */
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

const write = async (rel, content) => {
  await fs.mkdir(path.dirname(path.join(DIST, rel)), { recursive: true });
  await fs.writeFile(path.join(DIST, rel), content);
};

await write("assets/css/themes.css", themes.css);

const fill = (tpl) => tpl.replaceAll("{{base}}", BASE).replaceAll("{{site}}", SITE).replaceAll("{{csp}}", CSP);
for (const name of ["404.html", "offline.html"]) {
  let html = fill(await read(`scripts/templates/${name}`));
  html = syncThemeColor(html, themes.palettes.deploybase);
  await write(name, html);
}

const urls = ["", ...projects.filter((p) => !p.external).map((p) => p.href), ...(site.extraPages || [])];
await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`);
await write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);

/* ---------- 6. Service worker ---------- */
async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files.sort();
}

// The cache version is a fingerprint of the files, so it only changes when the site changes.
const hash = createHash("sha1");
for (const f of await walk(DIST)) {
  const rel = path.relative(DIST, f);
  if (["sw.js", "sitemap.xml", "robots.txt"].includes(rel)) continue;
  hash.update(rel).update(await fs.readFile(f));
}
const VERSION = hash.digest("hex").slice(0, 10);

const hubFonts = themeConfig.themes.deploybase.fonts;
const fontFile = (n) => n.toLowerCase().replace(/ /g, "-");
const PRECACHE = [
  "./", "offline.html", "manifest.webmanifest", "favicon.svg",
  "assets/css/fonts.css", "assets/css/site.css", "assets/css/themes.css",
  "assets/js/theme-init.js", "assets/js/site.js",
  `assets/fonts/${fontFile(hubFonts.head)}.woff2`, `assets/fonts/${fontFile(hubFonts.body)}.woff2`,
  "assets/img/icon-192.png",
];
const swSource = (await read("scripts/templates/sw.js")).replace("__VERSION__", VERSION).replace("__PRECACHE__", JSON.stringify(PRECACHE));
await write("sw.js", swSource);

/* ---------- 7. Check the built site ---------- */
const htmlFiles = (await walk(DIST)).filter((f) => f.endsWith(".html"));
const ids = new Map();
for (const f of htmlFiles) {
  const html = await fs.readFile(f, "utf8");
  ids.set(f, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const resolveRef = (from, ref) => {
  const [pathPart, hash2] = ref.split("#");
  if (!pathPart) return { target: from, hash: hash2 };
  let target = pathPart.startsWith("/")
    ? path.join(DIST, pathPart.startsWith(BASE) ? pathPart.slice(BASE.length) : pathPart)
    : path.resolve(path.dirname(from), pathPart);
  return { target, hash: hash2, dirLike: pathPart.endsWith("/") };
};

for (const f of htmlFiles) {
  const rel = path.relative(DIST, f);
  const html = await fs.readFile(f, "utf8");
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\sdata-src="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta http-equiv="refresh" content="[^"]*url=([^"]+)"/g)].map((m) => m[1]),
  ];
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    let { target, hash: frag, dirLike } = resolveRef(f, ref);
    if (dirLike || (await fs.stat(target).catch(() => null))?.isDirectory()) target = path.join(target, "index.html");
    if (!(await exists(target))) { problems.push(`${rel}: "${ref}" points to a file that does not exist.`); continue; }
    if (frag && target.endsWith(".html") && !ids.get(target)?.has(frag)) problems.push(`${rel}: "${ref}" points to a section (#${frag}) that does not exist.`);
  }

  // Quality checks. These warn but do not stop the deploy.
  if (!/<title>[^<]+<\/title>/.test(html)) warnings.push(`${rel}: missing <title>.`);
  if (!/name="description"/.test(html)) warnings.push(`${rel}: missing meta description.`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) warnings.push(`${rel}: should have exactly one <h1>.`);
  if (/<img(?![^>]*\balt=)[^>]*>/.test(html)) warnings.push(`${rel}: an <img> has no alt text.`);
  if (/\sstyle="/.test(html)) warnings.push(`${rel}: has an inline style attribute, which the page's Content Security Policy blocks.`);
  if (/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(html)) warnings.push(`${rel}: has an inline script, which the page's Content Security Policy blocks.`);
  if (/on(?:click|load|error)="/i.test(html)) warnings.push(`${rel}: has an inline event handler, which the Content Security Policy blocks.`);
  if (!/theme-init\.js/.test(html)) warnings.push(`${rel}: does not load assets/js/theme-init.js, so the theme may flash on load.`);
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html)) warnings.push(`${rel}: still loads fonts from Google. Use the self-hosted fonts in assets/fonts.`);
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) warnings.push(`${rel}: an external link is missing rel="noopener noreferrer".`);
  }
}

// Manifest
try {
  const manifest = JSON.parse(await fs.readFile(path.join(DIST, "manifest.webmanifest"), "utf8"));
  for (const key of ["name", "short_name", "description", "id", "start_url", "scope", "display", "theme_color", "background_color", "icons"]) {
    if (manifest[key] === undefined) problems.push(`manifest.webmanifest: "${key}" is missing.`);
  }
  const sizes = (manifest.icons || []).map((i) => i.sizes + (i.purpose && i.purpose !== "any" ? ":" + i.purpose : ""));
  for (const need of ["192x192", "512x512", "512x512:maskable"]) {
    if (!sizes.includes(need)) problems.push(`manifest.webmanifest: needs an icon of ${need.replace(":", " (")}${need.includes(":") ? ")" : ""}.`);
  }
  const listed = [...(manifest.icons || []), ...(manifest.screenshots || []), ...(manifest.shortcuts || []).flatMap((s) => s.icons || [])];
  for (const item of listed) {
    if (!(await exists(path.join(DIST, item.src)))) problems.push(`manifest.webmanifest: "${item.src}" does not exist.`);
  }
  for (const s of manifest.shortcuts || []) {
    const { target } = resolveRef(path.join(DIST, "manifest.webmanifest"), s.url);
    if (!(await exists(target.endsWith("/") ? path.join(target, "index.html") : (await fs.stat(target).catch(() => null))?.isDirectory() ? path.join(target, "index.html") : target))) {
      problems.push(`manifest.webmanifest: shortcut "${s.name}" points to "${s.url}", which does not exist.`);
    }
  }
} catch (err) {
  problems.push(`manifest.webmanifest could not be read: ${err.message}`);
}

// Service worker file list
for (const item of PRECACHE) {
  const target = item === "./" ? path.join(DIST, "index.html") : path.join(DIST, item);
  if (!(await exists(target))) problems.push(`sw.js: "${item}" is in the offline file list but does not exist.`);
}

for (const w of warnings) console.log(`::warning::${w}`);
if (problems.length) {
  for (const p of problems) console.log(`::error::${p}`);
  console.error(`\nBuild stopped: ${problems.length} problem(s) found. Fix the lines above and commit again.`);
  process.exit(1);
}
console.log(`Build complete: ${htmlFiles.length} pages checked, ${warnings.length} warning(s), offline version ${VERSION}, dist/ is ready.`);
