# GitHub Portfolio Rebuild: Project Instructions (v2)

Source of truth for HOW rebuilds are done. State (what exists, what is done) lives in `github-repo-directory.md`. Portfolio listing data lives in `projects.json`. Update this file whenever a decision changes, and log the change in section 16.

## 1. Who and what

Babatunde Awoyemi (babatundeawo) is Founder and Lead Consultant at Techbase Consultant Services, which runs the techbaseng GitHub org. Two profiles, one person, one company. The goal of the portfolio is to make two things true at once: any single project clearly says who built it and which org it belongs to, and the full body of work is discoverable in exactly two places.

## 2. Rule precedence

When rules seem to conflict, resolve in this order:
1. Linking architecture (section 3) and redirect-stub exception (section 4)
2. Decision log (section 16), newest entry wins
3. Quality gates (sections 8 to 11)
4. Style notes (section 12)
5. Claude's own judgement, stated as an assumption in the session summary

## 3. Linking architecture (hard rule)

**Individual project repos** (everything except the four "master" repos below) link out to exactly three places:
1. Personal portfolio: https://babatundeawo.github.io/
2. Personal profile: https://github.com/babatundeawo
3. Techbase org profile: https://github.com/techbaseng

No sibling-project links. No related-projects sections. No direct link to the Techbase company website. Strip all of these from READMEs, nav, footers, sitemaps, and JSON-LD.

**The four master repos:**
| Repo | Role | Links |
|---|---|---|
| babatundeawo.github.io | Personal portfolio site | Lists ALL projects (live + repo link each), from projects.json |
| babatundeawo (profile README) | Personal profile | Lists ALL projects, same data, kept in sync |
| techbaseng.github.io | Techbase org landing page | Links to the real company site https://techbasengr.com.ng/ (not the STEM Academy pages). Does not re-list every project unless a later decision says so |
| techbaseng/.github (org profile README, if used) | Org config | Same outbound rules as the org landing page |

**Navigational links vs asset references.** The rule governs navigational links (anything a visitor can click to leave). Asset references (Google Fonts, a CDN script, an image host) are not cross-links but should be minimised, self-hosted where practical, and listed in the exceptions register (section 5).

**Permitted-link allow-list for individual repos:** the three footer links, the repo's own internal pages, and entries in the exceptions register. Anything else gets flagged, not silently kept or deleted.

## 4. Redirect-stub exception

`ai-prompt-library`, `ai-studio-android-guide`, and `career-engine-guide` under babatundeawo are redirect stubs to their canonical techbaseng versions. They are not rebuild targets. Only the techbaseng copies are rebuilt.

A stub contains: `index.html`, `404.html`, `README.md`, `.nojekyll`. Nothing else.

**index.html**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moved: PROJECT NAME</title>
  <meta http-equiv="refresh" content="0; url=TARGET_URL">
  <link rel="canonical" href="TARGET_URL">
  <script>location.replace("TARGET_URL" + location.search + location.hash);</script>
</head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem">
  <h1>This project has moved</h1>
  <p>Taking you to the new home of PROJECT NAME. If nothing happens, <a href="TARGET_URL">open it here</a>.</p>
  <footer><small>Built by <a href="https://babatundeawo.github.io/">Babatunde Awoyemi</a> · <a href="https://github.com/babatundeawo">GitHub profile</a> · <a href="https://github.com/techbaseng">Techbase</a></small></footer>
</body>
</html>
```

**404.html** (preserves deep links that were already shared publicly): same as above, but the script maps the old path to the new one:
```html
<script>
  var base = "https://techbaseng.github.io/PROJECT_SLUG/";
  var path = location.pathname.replace(/^\/PROJECT_SLUG\/?/, "");
  location.replace(base + path + location.search + location.hash);
</script>
```

**README.md** is one line: "This project has moved to [live site](TARGET_URL) ([repo](TARGET_REPO_URL)). Built by ... (three-link footer)."

The link to the canonical techbaseng project is the one permitted extra link on a stub, because it is the whole point of the stub. Log it in the exceptions register.

## 5. Exceptions register

Anything outside the three-link rule that is deliberately kept goes here, with a reason. Claude asks before adding to this list.

| Repo | Link | Reason | Approved |
|---|---|---|---|
| 3 redirect stubs | Canonical techbaseng URL | Purpose of the stub | Yes |
| (STEM Academy repos, if any) | Third-party curriculum attribution, e.g. Raspberry Pi Foundation | Licence attribution, not a project cross-link | Pending confirmation per repo |
| All | Fonts (Google Fonts) | Asset reference, not navigation | Yes, self-host when cheap |

## 6. Repo types and playbooks

Every repo gets a type in the directory. The type decides the template.

| Type | Examples | Notes |
|---|---|---|
| course-site | techbase-html, techbase-css, techbase-python, techbase-scratch, techbase-robotics, techbase-js | Shared STEM Academy design system with a distinct accent per course. Lesson nav stays INSIDE the course (previous/next lesson is fine; it is not a cross-project link) |
| tool-app | smart-form-validator, student-report-card, deep-calls | Live demo is the hero. README needs a working demo link, a screenshot, and a short "how it works" |
| guide | ai-prompt-library, ai-studio-android-guide, career-engine-guide, educator-ai-toolkit, globalwarming | Content-first. Strong reading typography, table of contents, search or filter if the content is large |
| redirect-stub | 3 babatundeawo repos | Section 4 |
| master-portfolio | babatundeawo.github.io | Section 13 |
| master-profile | babatundeawo | Section 14 |
| master-org | techbaseng.github.io | Section 15 |
| config | .github | Not a rebuild target |

Check before starting: if a repo's type is not in the directory, ask. If its purpose or audience is unclear from the files, ask.

## 7. Session protocol

**Intake**
1. Confirm repo name, profile, type, and status from the directory. State them in two lines.
2. Inventory the upload: file tree, entry points, external links (run the audit in section 11), dependencies, assets, anything broken.
3. Flag ownership ambiguity (Techbase vs personal), unknown purpose, or undocumented duplicates. Ask all blocking questions in one message, each with a recommended default.

**Plan** (short, one message, approval only if something is a real fork)
- Design direction: palette tokens, type pairing, layout idea, one signature detail that makes this repo recognisable (section 8).
- Structure changes and anything that will be removed.
- Assumptions made.

**Build**
- Modernise structure and design (a full pass, not a cosmetic one).
- Rewrite README to the template in section 10.
- Strip disallowed links; implement the footer.
- Add repo hygiene files (section 9).

**Verify** (mandatory, run on the actual files)
- Link audit, dash check, asset check, and the QA checklist in section 11. Report results as a short pass/fail table. Fix failures before delivering.

**Deliver**
- Package output as a zip of the repo plus a `CHANGES.md` summarising what changed and why (kept out of the repo itself unless asked).
- End with the Handoff Block (section 17).

**Batching.** One repo per chat, or one logical batch (e.g. the STEM Academy courses, which share a design system) per chat. For batches, build a shared component set once, then theme each repo from tokens so identities stay distinct. If asked to do many unrelated repos at once, recommend splitting and say why in one sentence.

## 8. Design system

**Light-theme-first.** Each repo gets its own accent and identity. No two repos should read as reskins.

**Tokens (every repo defines the same variable names so components port cleanly):**
```css
:root {
  --bg: ; --surface: ; --surface-2: ;
  --text: ; --muted: ; --border: ;
  --accent: ; --accent-ink: ;   /* ink = readable text ON the accent */
  --accent-soft: ;              /* tint for backgrounds and chips */
  --radius: ; --shadow: ;
  --font-display: ; --font-body: ; --font-mono: ;
}
```
Record the final hex values in the directory so palettes can be checked for collisions.

**Palette rules**
- Within one profile, no two repos share an accent hue; aim for at least 30 degrees of hue separation, and if the palette is crowded, differentiate by saturation, neutral temperature, and typography as well.
- Text and background pass WCAG AA (4.5:1 body, 3:1 large text and UI). Check `--accent-ink` on `--accent` explicitly.
- Dark mode via `prefers-color-scheme` is optional, added only when cheap and fully tested. Light stays the default.

**Typography.** Pick a distinct display and body pairing per repo from the established stack (Space Grotesk, Manrope, Plus Jakarta Sans, JetBrains Mono, and similar). Avoid system-default fonts. Always `font-display: swap`, subset where possible, and give a real fallback stack.

**Profile identity cue (proposed, awaiting approval).** A tiny, consistent mark that tells you which family a repo belongs to without a banner: personal repos carry a small "BA" monogram in the footer; Techbase repos carry a small Techbase mark. It stays the same across every repo of that family while the rest of the theme varies. Until approved, ask before adding.

**Signature detail.** Each repo gets one memorable, purposeful touch tied to its subject (a terminal-style code block for Python, a pixel grid motif for Scratch, a blueprint grid for Robotics). It should come from the content, not decoration.

## 9. Engineering standards for every rebuilt repo

**Structure and GitHub Pages**
- Relative paths only, so the site works under `/repo-name/`. Mind case sensitivity (Pages is case-sensitive; local machines often are not).
- Add `.nojekyll` unless Jekyll is actually used.
- Include a custom `404.html` in the repo's design, with a way back to the repo's own home page.
- Add a `robots.txt` and `sitemap.xml` for sites with more than a few pages (sitemap lists only the repo's own pages).

**Accessibility**
- One `h1` per page, correct heading order, landmarks (`header`, `nav`, `main`, `footer`), skip link, `lang` attribute.
- Visible `:focus-visible` styles, keyboard-operable everything, 44px minimum tap targets on mobile.
- Meaningful `alt` text; decorative images get `alt=""`.
- Respect `prefers-reduced-motion`.

**Performance**
- Targets: Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO (mobile).
- Images as WebP or AVIF with width/height set, lazy-loaded below the fold.
- No render-blocking third-party scripts; inline critical CSS for simple pages; minimise JS.
- Initial page weight under roughly 300 KB excluding fonts, unless the content genuinely needs more.

**Sharing and SEO** (per page that can be shared)
- Unique `<title>` and meta description, canonical URL, `theme-color`.
- Open Graph and Twitter card tags with a 1200x630 preview image. Generate a simple on-brand OG image per repo.
- Favicon (SVG plus a PNG fallback), consistent with the repo's accent.
- Structured data (`SoftwareApplication`, `Course`, or `Article` as fitting) containing no disallowed outbound links.

**Repo hygiene**
- LICENSE present (ask which licence if unknown; default suggestion: MIT for code, CC BY 4.0 for educational content).
- Sensible `.gitignore`, no leftover build junk, no secrets, no absolute local paths.
- Remove dead files and unreferenced assets.
- GitHub "About" settings to apply manually after push: one-line description, homepage = the live site, topics (3 to 8), and a social preview image. Include these in the Handoff Block.

## 10. README standard

Structure, in this order:
1. Title and a one-line value statement
2. Badges row (Live demo, licence, status), restrained
3. Preview: one screenshot or GIF (alt text included). If no screenshot exists, add a placeholder note in `CHANGES.md` and ask for one
4. What it is and who it is for (2 to 4 sentences, plain language)
5. Features (only real ones)
6. Tech stack
7. Run locally / setup (only if applicable; exact commands)
8. Project structure (short tree, only for non-trivial repos)
9. Licence
10. Standard footer (below)

Tone: direct, specific, human. No filler like "leverage" or "seamless". No em or en dashes anywhere.

**Standard footer (Markdown)**
> Built by [Babatunde Awoyemi](https://babatundeawo.github.io/) · [GitHub profile](https://github.com/babatundeawo) · [Techbase](https://github.com/techbaseng)

Personal, non-Techbase repos may drop or soften the Techbase link only if the repo genuinely is not a Techbase project. If unclear, ask.

**Standard footer (HTML)**
```html
<footer class="site-footer">
  <p>Built by <a href="https://babatundeawo.github.io/">Babatunde Awoyemi</a>
  · <a href="https://github.com/babatundeawo">GitHub profile</a>
  · <a href="https://github.com/techbaseng">Techbase</a></p>
</footer>
```
Use `target="_blank"` only with `rel="noopener"`, and only if the repo already does so; keep behaviour consistent within a repo.

## 11. QA gates (run before saying "done")

Claude runs these in the sandbox against the unzipped files and reports a pass/fail table.

**Link audit: list every external URL, then flag anything not on the allow-list**
```bash
grep -rhoE 'https?://[^"'"'"' )<>]+' --include='*.html' --include='*.md' --include='*.css' --include='*.js' --include='*.json' --include='*.xml' . \
  | sort -u \
  | grep -vE '^https://(babatundeawo\.github\.io/?|github\.com/babatundeawo/?|github\.com/techbaseng/?)$'
```
Every line that remains is either an approved exception, an asset reference to review, or a violation to remove.

**Sibling-link check**
```bash
grep -rnE 'techbaseng\.github\.io/[a-z]|babatundeawo\.github\.io/[a-z]|techbasengr\.com\.ng' . 
```
Should return nothing in individual repos (the company site belongs only on the org landing page).

**Dash check (copy rule)**
```bash
grep -rnP '[\x{2013}\x{2014}]' --include='*.html' --include='*.md' --include='*.json' .
```
Must return nothing. (Also check text inside images and SVGs by eye.)

**Internal integrity**
- Every `href`/`src` resolves to a file that exists, with matching case.
- No `localhost`, `file://`, or absolute local paths.
- No "TODO", "lorem ipsum", or placeholder text left.
- All pages have unique titles and descriptions.

**Visual and interaction**
- Check at 360px, 768px, and 1280px widths. No horizontal scroll, no clipped text.
- Keyboard-only pass: tab order sensible, focus visible, no traps.
- Contrast check on the accent pair and on muted text.

**Report format**
| Check | Result | Notes |
|---|---|---|
| Link audit | Pass / Fail | ... |
| Sibling links | ... | ... |
| Dash check | ... | ... |
| Integrity | ... | ... |
| Responsive | ... | ... |
| A11y basics | ... | ... |

Claude cannot run Lighthouse or load the live site from the sandbox. Say so plainly and give the user the exact checks to run after pushing (Lighthouse in Chrome DevTools, and a click-through of the three footer links).

## 12. Writing style

- Natural, specific, confident. Read it aloud; if it sounds like a brochure, rewrite it.
- No em or en dashes. Standard hyphens only.
- Prefer concrete claims over adjectives: "40 lessons, each with a live editor" beats "comprehensive learning experience".
- Nigerian and international audiences both matter. Plain English, no idioms that do not travel.

## 13. Master portfolio: babatundeawo.github.io

- Purpose: show who Babatunde is, what he has built, and how to work with him.
- Sections: hero (name, role, one-line positioning), About, Featured work (3 to 6 hand-picked), **All Projects**, Skills or stack, Contact.
- **All Projects** is generated from `projects.json`: filterable by profile (Personal / Techbase), type, and tag; each card shows name, one-line description, Live link, Repo link. A project appears once, labelled by owner.
- Footer: author line and links to the profile and the Techbase org profile. No direct company-site link here (company site is reached via the org profile).
- Strong SEO and sharing basics (section 9) since this is the front door.

## 14. Master profile README: github.com/babatundeawo

- Short intro, current focus, and the same All Projects list as the portfolio, rendered as a Markdown table from `projects.json`.
- Keep it fast to scan: no stat widgets that depend on third-party services unless they are approved and listed in the exceptions register.
- Suggested pinned repos on the profile (set manually on GitHub): the portfolio, plus the 5 strongest personal or Techbase projects.

## 15. Techbase org landing page: techbaseng.github.io

- Purpose: say who Techbase is and send people to the real business site https://techbasengr.com.ng/ as the primary call to action.
- Does not re-list every project unless a later decision changes this. If it shows anything, a single "Open source and education work" pointer to the personal portfolio is the most it should do (confirm before adding).
- Same org profile README approach in `techbaseng/.github` if used.

## 16. Decision log

Add newest at the top. Format: date, decision, reason, who decided.

| Date | Decision | Reason |
|---|---|---|
| 2026-07 | Three-link footer on every individual repo; no sibling links | Clean provenance trail; full catalogue only in two places |
| 2026-07 | Three babatundeawo repos kept as redirect stubs | Links were already shared publicly |
| 2026-07 | Company site linked only from the Techbase org landing page | Keeps business site separate from project pages |
| 2026-07 | One repo (or one logical batch) per chat | Quality and context limits |

## 17. Handoff Block (end of every session)

Claude ends with this, filled in, ready to paste:

```
### HANDOFF: <repo>
Directory row (replace existing):
| <repo> | <live url> | <type> | <profile> | <status> | <theme tokens> | <date> |

projects.json entry (add or replace):
{ ... }

Decisions to add to the log:
- <or "none">

Exceptions register changes:
- <or "none">

Manual steps on GitHub:
1. Push the files (commit message suggestion: "<message>")
2. Confirm Pages is enabled (branch/folder)
3. About: description "<...>", homepage <live url>, topics <...>
4. Upload social preview image
5. Re-sync All Projects on the portfolio site and profile README if this is new or changed
6. Run Lighthouse on the live URL and click all three footer links
```

## 18. Always ask before assuming

- Repo purpose or audience unclear from the files
- An apparent duplicate or mirror across profiles that is not a documented stub
- Unclear whether a repo is Techbase or personal
- Before removing any link that may not be a cross-project link (third-party attribution, licence credits, data sources); these likely stay but get confirmed and logged in the exceptions register
- Before adding the profile identity cue, an org-landing project list, or any new outbound link

When asking: batch the questions, give a recommended default for each, and keep going on everything that is not blocked.

## 19. Things Claude should proactively suggest (briefly, not as scope creep)

- Missing screenshots or demo GIFs for tool-apps
- A real project description where a repo only has a name
- Tags or categories for projects.json so the portfolio filters work
- Obvious bugs found during the audit (flag; fix only if trivial or approved)
- Retiring a repo that is clearly obsolete (ask; never delete)
