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

Every project, including live tools, is a folder nested inside `deploybase`, each with its own distinct colour palette and typography direction so no two feel like reskins of each other. (Earlier versions of this repo held the Educator AI Toolkit under `/toolkit/`; it has since split into two standalone tool folders, `exam-revision-generator` and `lesson-note-generator`, each structured the same way as every `AGENT.0N` project.)

Every card on the hub links straight to that project's own page within this repo (e.g. `https://babatundeawo.github.io/deploybase/classpulse-national/`) rather than to an internal detail page here. Deploybase's root only ever holds the summary card, never the full description — that lives on the project's own page, alongside its exact custom instructions and knowledge files, copyable directly from the page.

The registry data is a plain `.js` file (not `.json`) loaded with a normal `<script>` tag, on purpose — that means the site renders correctly even when opened directly as a local file (double-clicking `index.html`), not just when served over http/GitHub Pages. `fetch()`-ing a local JSON file is blocked by the browser in that case, which is why an earlier version of this site showed an empty grid when opened locally.

## Adding a new project later

1. **Build the project as a new folder here**, e.g. `/<slug>/`, with a distinct colour palette and typography direction — no two project folders should look like reskins of each other. Give it its own `index.html`, `assets/` (stylesheet + script, referenced with relative paths like `assets/style.css`), and `files/` (the exact custom instructions and knowledge file(s), copyable from the page via a "Get this project" section).
2. **Add a card entry.** Open `assets/data/projects.js` and add one object to the `PROJECTS` array with `id`, `status` (`"active"` or `"tool"`), `name`, `role`, `summary`, `stack`, `href` set to the folder's relative path (e.g. `"<slug>/"`), and `"external": true`. The hub grid picks it up automatically — no HTML edit needed on `index.html`.
3. **Status labels.** `"active"` (`AGENT.0N`) is a Claude Project write-up — a case study of an AI system Babatunde runs. `"tool"` (`TOOL.0N`) is a live, self-serve tool meant for someone else to pick up and use directly, like the Exam & Revision Generator or the Weekly Lesson Note Generator.

## Linking rules

Per the standing portfolio-wide convention, this site's footer only ever links to three places: the personal portfolio (babatundeawo.github.io), the personal GitHub profile, and the Techbase org profile. It doesn't cross-link to any sibling project folder, and neither does any individual project page — each of those follows the same three-link footer rule independently.

Project card links (`href` in `assets/data/projects.js`) are kept as relative paths (`"<slug>/"`, not a hardcoded `https://babatundeawo.github.io/...` URL) so they keep working under whatever domain or path this repo is served from — a GitHub Pages user site, a project site at `/deploybase/`, or a custom domain — without needing to be rewritten.

## Hosting

Static site, no build step. Enable GitHub Pages on this repo (root or `/docs`, depending on where it's pushed) and the hub plus all nested project pages go live together at `https://babatundeawo.github.io/deploybase/` — no separate repos or separate Pages setup needed per project.
