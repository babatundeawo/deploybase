# GitHub Repo Directory — babatundeawo / techbaseng

Pulled from the GitHub API on 2026-07-12. This is reference material for the "GitHub Portfolio Rebuild" Claude Project — it tells Claude which repo belongs to which profile, whether it has a live GitHub Pages site, and its current rebuild status. Update this file whenever a repo is added, renamed, or completed.

## Personal profile — babatundeawo

| Repo | Live site (GitHub Pages) | Language | Status |
|---|---|---|---|
| ai-prompt-library | https://babatundeawo.github.io/ai-prompt-library/ | HTML | **Redirect stub only** — project moved to techbaseng; kept here because this link was already shared publicly |
| ai-studio-android-guide | https://babatundeawo.github.io/ai-studio-android-guide/ | HTML | **Redirect stub only** — project moved to techbaseng; kept here because this link was already shared publicly |
| career-engine-guide | https://babatundeawo.github.io/career-engine-guide/ | HTML | **Redirect stub only** — project moved to techbaseng; kept here because this link was already shared publicly |
| deep-calls | https://babatundeawo.github.io/deep-calls/ | HTML | Not yet rebuilt |
| smart-form-validator | https://babatundeawo.github.io/smart-form-validator/ | JavaScript | Not yet rebuilt |
| student-report-card | https://babatundeawo.github.io/student-report-card/ | HTML | Not yet rebuilt |
| babatundeawo.github.io | https://babatundeawo.github.io/ | HTML | **Master portfolio** — not yet rebuilt. Needs an "All Projects" section listing every project below (personal + Techbase), each with live link + repo link |
| babatundeawo | — (no Pages) | — | **Profile README** — not yet rebuilt. Needs the same "All Projects" section as the portfolio site, kept in sync with it |

## Organisation — techbaseng

| Repo | Live site (GitHub Pages) | Language | Status |
|---|---|---|---|
| techbaseng.github.io | https://techbaseng.github.io/ | HTML | **Techbase org profile** — not yet rebuilt. Should link out to the real Techbase company website, https://techbasengr.com.ng/ (not the STEM Academy pages) |
| techbase-html | https://techbaseng.github.io/techbase-html/ | HTML | Part of STEM Academy — rebuilt per stem-academy notes |
| techbase-css | https://techbaseng.github.io/techbase-css/ | HTML | Part of STEM Academy — rebuilt |
| techbase-python | https://techbaseng.github.io/techbase-python/ | HTML | Part of STEM Academy — rebuilt |
| techbase-scratch | https://techbaseng.github.io/techbase-scratch/ | HTML | Part of STEM Academy — rebuilt (35 lesson files) |
| techbase-robotics | https://techbaseng.github.io/techbase-robotics/ | HTML | Part of STEM Academy — rebuilt (12 lesson files) |
| techbase-js | https://techbaseng.github.io/techbase-js/ | HTML | Part of STEM Academy — rebuilt |
| globalwarming | https://techbaseng.github.io/globalwarming/ | HTML | Not yet rebuilt |
| educator-ai-toolkit | https://techbaseng.github.io/educator-ai-toolkit/ | HTML | Not yet rebuilt |
| ai-prompt-library | https://techbaseng.github.io/ai-prompt-library/ | HTML | **Canonical** — rebuilt (PromptOS theme) |
| ai-studio-android-guide | https://techbaseng.github.io/ai-studio-android-guide/ | HTML | **Canonical** — not yet rebuilt |
| career-engine-guide | https://techbaseng.github.io/career-engine-guide/ | HTML | **Canonical** — rebuilt |
| .github | — (no Pages) | — | Org profile/config repo — not applicable for rebuild |

## Linking rule summary (full detail in `project-instructions.md`)

- **Every individual repo** (i.e. every row above except the four bolded "master" ones): footer links only to babatundeawo.github.io, github.com/babatundeawo, and github.com/techbaseng. No links to sibling projects, no direct link to the Techbase main website.
- **babatundeawo.github.io + babatundeawo profile README**: the only two places that list every project (personal and Techbase) with live + repo links.
- **techbaseng.github.io (Techbase org profile)**: links out to the real Techbase company website, https://techbasengr.com.ng/.

## Notes / decisions
- `ai-prompt-library`, `ai-studio-android-guide`, and `career-engine-guide` originally lived under babatundeawo. They were moved to techbaseng, but the babatundeawo links had already been shared publicly, so those personal repos stay in place as redirect stubs pointing to the techbaseng (canonical) versions.
- Each repo should carry its own distinct theme/colour palette, while still reading as either "babatundeawo personal work" or "Techbase" depending on which profile it sits under.
- Rebuilds are full modernization passes (structure + design), not just README/theme polish.
