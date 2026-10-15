# GitHub Repo Directory: babatundeawo / techbaseng

Source of truth for WHAT exists and its current state. Process rules live in `project-instructions.md`. Listing data for the portfolio and profile README lives in `projects.json`.

Last API pull: 2026-07-12. Last manual edit: update this line every time you change the file.

## How to keep this file fresh

- Update a row at the end of every rebuild session using the Handoff Block.
- Every few weeks, or after adding or renaming repos, re-pull from GitHub and paste the output into a chat for reconciliation:
  `gh repo list babatundeawo --limit 100 --json name,homepageUrl,pushedAt,isArchived,description`
  `gh repo list techbaseng --limit 100 --json name,homepageUrl,pushedAt,isArchived,description`
- Claude cannot reach GitHub from the sandbox, so it relies on this file and on what you upload or paste. If a repo is not listed here, treat it as new and ask.

## Status vocabulary (use only these)

| Status | Meaning |
|---|---|
| not-started | Original, untouched |
| in-progress | Being rebuilt in an open chat |
| rebuilt | Files rebuilt, not yet confirmed live |
| live-verified | Pushed, live, footer links and Lighthouse checked |
| stub-ok | Redirect stub verified working |
| n/a | Not a rebuild target |

## Theme registry (prevents two repos looking alike)

Record the final tokens when a repo is rebuilt. Accent hues within the same profile should not collide.

| Repo | Profile | Accent | Display font | Body font | Signature detail |
|---|---|---|---|---|---|
| ai-prompt-library | techbaseng | (record from repo) | (record) | (record) | PromptOS theme |
| career-engine-guide | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-html | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-css | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-python | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-scratch | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-robotics | techbaseng | (record from repo) | (record) | (record) | (record) |
| techbase-js | techbaseng | (record from repo) | (record) | (record) | (record) |

Tip: in the next session that touches any rebuilt repo, ask Claude to extract its tokens from the CSS and fill in this table, so future palettes can be checked against it.

## Personal profile: babatundeawo

| Repo | Type | Live site | Language | Status | Notes |
|---|---|---|---|---|---|
| ai-prompt-library | redirect-stub | https://babatundeawo.github.io/ai-prompt-library/ | HTML | stub-ok (verify) | Redirects to techbaseng canonical. Link already shared publicly |
| ai-studio-android-guide | redirect-stub | https://babatundeawo.github.io/ai-studio-android-guide/ | HTML | stub-ok (verify) | Redirects to techbaseng canonical. Link already shared publicly |
| career-engine-guide | redirect-stub | https://babatundeawo.github.io/career-engine-guide/ | HTML | stub-ok (verify) | Redirects to techbaseng canonical. Link already shared publicly |
| deep-calls | tool-app | https://babatundeawo.github.io/deep-calls/ | HTML | not-started | Purpose and audience to confirm at intake |
| smart-form-validator | tool-app | https://babatundeawo.github.io/smart-form-validator/ | JavaScript | not-started | Needs demo screenshot |
| student-report-card | tool-app | https://babatundeawo.github.io/student-report-card/ | HTML | not-started | Confirm personal vs Techbase at intake |
| babatundeawo.github.io | master-portfolio | https://babatundeawo.github.io/ | HTML | not-started | Needs All Projects section generated from projects.json |
| babatundeawo | master-profile | none (no Pages) | n/a | not-started | Needs the same All Projects list, kept in sync |

## Organisation: techbaseng

| Repo | Type | Live site | Language | Status | Notes |
|---|---|---|---|---|---|
| techbaseng.github.io | master-org | https://techbaseng.github.io/ | HTML | not-started | Must link to the real company site https://techbasengr.com.ng/ (not STEM Academy pages) |
| techbase-html | course-site | https://techbaseng.github.io/techbase-html/ | HTML | rebuilt | STEM Academy. Run link audit to confirm no sibling links remain |
| techbase-css | course-site | https://techbaseng.github.io/techbase-css/ | HTML | rebuilt | STEM Academy. Run link audit |
| techbase-python | course-site | https://techbaseng.github.io/techbase-python/ | HTML | rebuilt | STEM Academy. Run link audit |
| techbase-scratch | course-site | https://techbaseng.github.io/techbase-scratch/ | HTML | rebuilt | STEM Academy, 35 lesson files. Run link audit |
| techbase-robotics | course-site | https://techbaseng.github.io/techbase-robotics/ | HTML | rebuilt | STEM Academy, 12 lesson files. Check attribution links before stripping |
| techbase-js | course-site | https://techbaseng.github.io/techbase-js/ | HTML | rebuilt | STEM Academy. Run link audit |
| globalwarming | guide | https://techbaseng.github.io/globalwarming/ | HTML | not-started | Confirm data sources and attribution before stripping links |
| educator-ai-toolkit | guide | https://techbaseng.github.io/educator-ai-toolkit/ | HTML | not-started | |
| ai-prompt-library | guide | https://techbaseng.github.io/ai-prompt-library/ | HTML | rebuilt | CANONICAL. PromptOS theme. Verify footer follows three-link rule |
| ai-studio-android-guide | guide | https://techbaseng.github.io/ai-studio-android-guide/ | HTML | not-started | CANONICAL. Next priority: personal stub already points here |
| career-engine-guide | guide | https://techbaseng.github.io/career-engine-guide/ | HTML | rebuilt | CANONICAL. Verify footer |
| .github | config | none (no Pages) | n/a | n/a | Org profile/config repo, not a rebuild target (unless an org profile README is added) |

## Cross-checks to run (found while reviewing this file)

1. The rebuilt STEM Academy repos were finished before the three-link rule was finalised. Their footers and navs may still contain sibling links. Run the link audit on each (batch them in one session) and move their status to `live-verified` only afterwards.
2. `ai-studio-android-guide` is canonical but not rebuilt, while its personal stub is already live. Rebuilding it next removes the most visible gap.
3. Stubs should be tested: open each babatundeawo URL, confirm it redirects, and confirm a deep link (a sub-path) lands correctly via the 404 handler.
4. Descriptions: `projects.json` needs a one-line description for each project. Claude should draft them during each rebuild session rather than inventing them now.

## Suggested rebuild order (reorder freely)

1. ai-studio-android-guide (closes the stub gap)
2. STEM Academy link-audit pass (batch of six, one session)
3. globalwarming and educator-ai-toolkit
4. deep-calls, smart-form-validator, student-report-card (confirm purpose and owner first)
5. techbaseng.github.io (org landing, company site link)
6. babatundeawo.github.io and the profile README last, so All Projects reflects finished work with real screenshots

## Linking rule summary (full detail in `project-instructions.md`)

- Individual repos: footer links only to babatundeawo.github.io, github.com/babatundeawo, github.com/techbaseng. No siblings, no company website.
- babatundeawo.github.io and the babatundeawo profile README: the only two places listing every project, with live and repo links.
- techbaseng.github.io: links out to https://techbasengr.com.ng/.
- Redirect stubs: same three-link footer, plus the single link to their canonical techbaseng target.

## Pending decisions (resolve, then move to the decision log in project-instructions.md)

- [ ] Approve the "BA" monogram and Techbase mark as family identity cues?
- [ ] Should the Techbase org landing page carry a single pointer to the personal portfolio for open-source work?
- [ ] Licence defaults: MIT for code and CC BY 4.0 for educational content?
- [ ] Are deep-calls, smart-form-validator, and student-report-card personal projects, or Techbase work that belongs in the org?
- [ ] Which third-party attribution links (e.g. Raspberry Pi Foundation) must stay, and where?

## Changelog

| Date | Change |
|---|---|
| 2026-07-12 | Initial directory pulled from GitHub API |
| (next) | v2 structure: types, status vocabulary, theme registry, cross-checks, pending decisions |
