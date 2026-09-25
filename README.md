# Deploybase — AI Deployment Directory

A directory site listing every deployed Claude Project (custom AI system) built and run by Babatunde Awoyemi / Techbase Consultant Services — a one line summary of what each one does, who it serves, and a direct link out to that project's own live page, where the full write-up and the exact instructions/knowledge files live.

Live structure, hosted on GitHub Pages from this single repo:

```
/                              → hub (index.html) — the registry grid
/assets/css/style.css          → design system for the hub
/assets/js/main.js             → renders the hub grid from the PROJECTS array
/assets/data/projects.js       → the registry data — edit this to add/remove/reorder cards
/<project-slug>/index.html     → one live page per project (e.g. /classpulse-national/)
/<project-slug>/assets/        → that project's stylesheet and script
/<project-slug>/files/         → that project's original instruction/knowledge files, unmodified
```

Every project, including live tools, is a folder nested inside `deploybase`, each with its own distinct colour palette and typography direction so no two feel like reskins of each other. (Earlier versions of this repo held the Educator AI Toolkit under `/toolkit/`, then split it into two standalone tool folders, `exam-revision-generator` and `lesson-note-generator`. Those two Claude Projects have since been rewritten and merged back into **one unified Project**, now maintained on its own dedicated site, the Educator AI Toolkit, rather than as two parallel folders here. See "The lesson-note / exam consolidation" below.)

Every card on the hub links straight to that project's own page (e.g. `https://babatundeawo.github.io/deploybase/classpulse-national/`) rather than to an internal detail page here — except a card for a tool that has grown into its own full site, which links straight out to that site instead of a shortcut page inside this repo (see below). Deploybase's root only ever holds the summary card, never the full description — that lives on the project's own page, alongside its exact custom instructions and knowledge files, copyable directly from the page.

## Design system

Every page, the hub and every project folder, shares one small "premium" CSS/JS layer (`_shared/premium.css`, `_shared/script.js`) layered on top of each project's own colour tokens and typography. It's additive, not a rewrite, so it re-skins automatically per project with no extra maintenance: cursor-spotlight cards, scroll-reveal on scroll into view, a scroll-progress bar, a back-to-top button, header elevation on scroll, shine-sweep buttons, and an automatic dark mode that follows the visitor's system setting (`prefers-color-scheme`), all built from CSS custom properties the theme already defines. `prefers-reduced-motion` disables the animated parts for anyone who has that turned on. To carry this layer to a new project folder, copy `_shared/script.js` to `<slug>/assets/script.js` and append `_shared/premium.css` to the end of `<slug>/assets/style.css` — no HTML changes required, since it targets the class names every project page already uses (`.card`, `.kpi`, `.list-item`, `.filebox`, `.callout`, `.topbar`, `.hamburger`).

## The lesson-note / exam consolidation

The Weekly Lesson Note Generator and the Exam & Revision Generator used to be two separate `TOOL.0N` cards, each a standalone Claude Project with its own folder here. Their instructions have since been rewritten into one Master Project Instructions document covering both jobs, packaged as its own site with a setup wizard, an interactive instructions editor, and a Scheme of Work file picker: the **Educator AI Toolkit** (`https://babatundeawo.github.io/educator-ai-toolkit/`).

The registry now carries **one** `TOOL.01` card pointing straight at that external site — `href` there is a full URL rather than a relative folder path, the one deliberate exception to the relative-path convention below, since the tool now genuinely lives outside this repo. The old `lesson-note-generator/` folder has been rewritten into a short explainer page describing the merge and linking out; the old `exam-revision-generator/` folder is now a redirect stub (auto-forwarding, plus a manual link) so any existing bookmark still lands somewhere useful, pointed at `lesson-note-generator/`. Neither folder's old `custom-instructions.md` was deleted; each now opens with a deprecation notice pointing to the current instructions.

The registry data is a plain `.js` file (not `.json`) loaded with a normal `<script>` tag, on purpose — that means the site renders correctly even when opened directly as a local file (double-clicking `index.html`), not just when served over http/GitHub Pages. `fetch()`-ing a local JSON file is blocked by the browser in that case, which is why an earlier version of this site showed an empty grid when opened locally.

## Adding a new project later

1. **Build the project as a new folder here**, e.g. `/<slug>/`, with a distinct colour palette and typography direction — no two project folders should look like reskins of each other. Give it its own `index.html`, `assets/` (stylesheet + script, referenced with relative paths like `assets/style.css`), and `files/` (the exact custom instructions and knowledge file(s), copyable from the page via a "Get this project" section).
2. **Add a card entry.** Open `assets/data/projects.js` and add one object to the `PROJECTS` array with `id`, `status` (`"active"` or `"tool"`), `name`, `role`, `summary`, `stack`, `href` set to the folder's relative path (e.g. `"<slug>/"`), and `"external": true`. The hub grid picks it up automatically — no HTML edit needed on `index.html`.
3. **Status labels.** `"active"` (`AGENT.0N`) is a Claude Project write-up — a case study of an AI system Babatunde runs. `"tool"` (`TOOL.0N`) is a live, self-serve tool meant for someone else to pick up and use directly, like the Educator AI Toolkit.
4. **Apply the design system.** Copy `_shared/script.js` to `<slug>/assets/script.js` and append the contents of `_shared/premium.css` to `<slug>/assets/style.css` so the new page gets scroll-reveal, spotlight cards, dark mode, and the rest of the premium layer for free.

## Linking rules

Per the standing portfolio-wide convention, this site's footer only ever links to three places: the personal portfolio (babatundeawo.github.io), the personal GitHub profile, and the Techbase org profile. It doesn't cross-link to any sibling project folder, and neither does any individual project page — each of those follows the same three-link footer rule independently.

Project card links (`href` in `assets/data/projects.js`) are kept as relative paths (`"<slug>/"`, not a hardcoded `https://babatundeawo.github.io/...` URL) so they keep working under whatever domain or path this repo is served from — a GitHub Pages user site, a project site at `/deploybase/`, or a custom domain — without needing to be rewritten. The one exception is a tool that has outgrown this repo and now lives on its own dedicated site, like the Educator AI Toolkit; that card's `href` is a full external URL on purpose, since there's no in-repo path for it to stay relative to.

## Hosting

Static site, no build step. Enable GitHub Pages on this repo (root or `/docs`, depending on where it's pushed) and the hub plus all nested project pages go live together at `https://babatundeawo.github.io/deploybase/` — no separate repos or separate Pages setup needed per project.
