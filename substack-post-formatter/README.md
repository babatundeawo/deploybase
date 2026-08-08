# Substack Post Formatter

A Claude Project write-up: the instructions behind a publishing assistant that turns a finished writeup into a complete, publish-ready Substack post package.

**Live site:** https://babatundeawo.github.io/substack-post-formatter/

## What this repo contains

This is a small showcase site for a Claude Project: the exact custom instructions and knowledge file(s) used to run it are included under `files/`, and the site itself renders and lets you copy them directly, so anyone can rebuild the same Claude Project from what's here.

- `index.html` — the site
- `assets/` — stylesheet and script
- `files/` — the original instruction and knowledge files, unmodified, as used in the live Claude Project

## Tech stack

Static HTML, CSS, vanilla JavaScript. No build step, no framework.

## Setting it up yourself

1. Create a new Claude Project at [claude.ai](https://claude.ai).
2. Paste the contents of `files/custom-instructions.md` (or `.txt`) into the Project's **instructions** field.
3. Upload any remaining files in `files/` to the Project's **knowledge base**.
4. Start a chat inside the Project.

---

Built by [Babatunde Awoyemi](https://babatundeawo.github.io/) &middot; [GitHub profile](https://github.com/babatundeawo) &middot; [Techbase](https://github.com/techbaseng)
