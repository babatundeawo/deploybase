# Weekly Lesson Note Generator

A free, live setup guide for a Claude Project that generates a complete weekly lesson note booklet, objectives, presentation steps, evaluation and assignments for every period, for any Nigerian secondary school subject and class, from e-notes or a topic list alone.

**Live site:** https://babatundeawo.github.io/lesson-note-generator/

## What this repo contains

This is a small, self-contained site: a setup guide plus the exact custom instructions used to run the tool, included under `files/` and rendered live on the page with a copy button, so any teacher can set up their own copy in minutes.

- `index.html` — the site
- `assets/` — stylesheet and script
- `files/custom-instructions.md` — the original instruction text (edit the `{SCHOOL_NAME}`, `{STATE}` and `{LOCATION_CONTEXT}` placeholders before pasting into a Project)

## Tech stack

Static HTML, CSS, vanilla JavaScript. No build step, no framework.

## Setting it up yourself

1. Create a new Claude Project at [claude.ai](https://claude.ai), named something like "Lesson Note Generator."
2. Copy `files/custom-instructions.md`, replace `{SCHOOL_NAME}`, `{STATE}` and `{LOCATION_CONTEXT}` with your details, and paste it into the Project's **instructions** field.
3. Upload either three e-notes or three weekly topic lists (1st, 2nd, 3rd term) per subject and class.
4. Ask for a week's lesson notes in the chat, stating Subject, Class and Week number.

---

Built by [Babatunde Awoyemi](https://babatundeawo.github.io/) &middot; [GitHub profile](https://github.com/babatundeawo) &middot; [Techbase](https://github.com/techbaseng)
