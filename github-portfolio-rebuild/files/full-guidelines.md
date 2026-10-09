# Claude Project: GitHub Portfolio Rebuild — Custom Instructions (Detailed)

This is the detailed knowledge-base file referenced by the short Custom Instructions box. Keep it updated as decisions change — it's the source of truth for how rebuilds get done.

## Who this is for

Babatunde Awoyemi (babatundeawo on GitHub) — Founder and Lead Consultant at Techbase Consultant Services, which also runs the techbaseng GitHub organisation. Two profiles, one person, one company.

## Source of truth for what exists

`github-repo-directory.md` (the other knowledge file) lists every repo across both profiles, its live GitHub Pages URL, and its current rebuild status. Always check it before starting work, and treat any repo not listed there as new — ask before assuming where it belongs.

## Linking architecture — read this before touching any README or repo footer

This is the most important structural rule. It overrides any older habit of cross-linking projects to each other.

**Every individual project repo — every course page, tool, guide, app, everything that isn't the personal portfolio, the personal profile, or the Techbase org profile itself — points to exactly three places, and nothing else:**
1. Personal portfolio — https://babatundeawo.github.io/
2. Personal profile README — github.com/babatundeawo
3. Techbase org profile — github.com/techbaseng

No repo links to any other individual project or sibling repo. No repo links directly to the Techbase main website — that link lives one level up, on the Techbase org profile itself (see below). Strip out any existing "check out my other projects," cross-project nav, or related-project sections from every repo's README and site footer/nav.

**Concretely, every individual project's README footer should read like:**

> Built by [Babatunde Awoyemi](https://babatundeawo.github.io/) · [GitHub profile](https://github.com/babatundeawo) · [Techbase](https://github.com/techbaseng)

(Personal, non-Techbase repos can drop or de-emphasize the Techbase line if it genuinely isn't a Techbase project — otherwise keep all three.)

**The two places that DO list every project, with live link and repo link each:**
1. **Personal portfolio** (babatundeawo.github.io website) — gets an "All Projects" section covering everything: every personal project and every Techbase project.
2. **Personal profile README** (github.com/babatundeawo) — same "All Projects" section, kept in sync with the portfolio site.

**The one place that links to the real Techbase company site:**
- **Techbase org profile** (github.com/techbaseng — the org's profile README / techbaseng.github.io landing page) links out to the actual Techbase company website, https://techbasengr.com.ng/. This is the real business website, not the STEM Academy course pages — don't confuse the two. The Techbase org profile does not need to separately re-list every Techbase project the way the personal portfolio does, unless a later decision says otherwise.

The effect: land on any single project and you can only trace back to "who made this" (the author, via portfolio/profile) and "which org it belongs to" (Techbase, via org profile). The full catalogue of work only exists in two places — the personal portfolio site and the personal profile README — and the real company website is reached only by going through the Techbase org profile.

## Redirect-stub exception

`ai-prompt-library`, `ai-studio-android-guide`, and `career-engine-guide` under the personal babatundeawo profile are NOT rebuild targets — they're redirect stubs pointing to the canonical techbaseng versions of the same projects (kept because the babatunde links were already shared publicly before the move). Only rebuild/theme the techbaseng copies. The babatunde copies just need a simple, working redirect page to the techbaseng live site — no README overhaul needed beyond a one-line note that the project has moved. Their footer, if any, follows the same three-link rule as any other repo.

## What "rebuilding a repo" means

- A full modernization pass: refreshed structure and design, not just a cosmetic tweak.
- Each repo gets its own distinct, tailored colour palette and visual identity — no two repos should look like reskins of each other — while still clearly reading as either personal (babatundeawo) work or Techbase (techbaseng) work depending on which profile it belongs to.
- A modern, professional README per repo: clear project description, live demo link, screenshot/preview if relevant, tech stack, setup instructions if applicable — plus the standard three-link footer above, and nothing else linking out.

## Workflow for each rebuild session

1. User uploads a repo's files (a zip is fine — unzip it in the chat) or a small batch of related repos.
2. Confirm which profile it belongs to and check `github-repo-directory.md` for its current status, existing theme, and whether it's a redirect stub.
3. Propose a distinct colour palette / typography direction for that repo before making major changes, unless one is already established.
4. Rebuild the files: modernize structure/design, rewrite the README using the three-link footer rule, strip any other outbound links.
5. Summarize what changed and flag anything needing a decision (new repo type, unclear ownership, etc).
6. Remind the user to update `github-repo-directory.md`'s status column once it's pushed live, and to add this project's live/repo links to the "All Projects" section on both the personal portfolio and profile README if it's a new addition.

## On uploading everything at once

Zipping and uploading *all* repos into a single chat isn't recommended — a genuine modernization pass (new structure, new palette, rewritten README, careful link stripping) per repo needs real attention, and doing a dozen at once in one conversation degrades quality and burns context fast. Better approach: one repo per chat, or a small logical batch (e.g. the STEM Academy repos, since they already share a design system) per chat. Each chat inherits this Project's instructions and knowledge automatically, so nothing needs re-explaining between sessions.

## Style notes carried over from past work (apply unless the user says otherwise for a given repo)

- Clean, modern type stacks (e.g. Space Grotesk, Manrope, Plus Jakarta Sans, JetBrains Mono) rather than default system fonts.
- Light-theme-first design system, distinct accent colour per project.
- Content should read naturally, not "AI-generated" — avoid em/en dashes in written copy; standard hyphens are fine.

## Always ask before assuming

- When a repo's purpose or target audience isn't obvious from its files.
- When a repo appears to be an intentional duplicate/mirror across the two profiles that isn't already documented as a redirect stub.
- When it's unclear whether a repo counts as "Techbase" or "personal" for footer/theme purposes.
- Before removing any existing link that might not fall under the "cross-project link" rule (e.g. attribution to a third-party curriculum source like the Raspberry Pi Foundation) — those aren't project cross-links and can likely stay, but confirm first.
