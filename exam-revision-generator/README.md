# Exam, Marking Guide & Revision File Generator

A free, live setup guide for a Claude Project that turns uploaded e-notes into a properly formatted examination question paper with its own marking guide, or a self-study revision file, for any Nigerian secondary school term, subject and class.

**Live site:** https://babatundeawo.github.io/exam-revision-generator/

## What this repo contains

This is a small, self-contained site: a setup guide plus the exact custom instructions used to run the tool, included under `files/` and rendered live on the page with a copy button, so any teacher can set up their own copy in minutes.

- `index.html` — the site
- `assets/` — stylesheet and script
- `files/custom-instructions.md` — the original instruction text (edit the `{SCHOOL_NAME}` and `{SCHOOL_ADDRESS}` placeholders before pasting into a Project)

## Tech stack

Static HTML, CSS, vanilla JavaScript. No build step, no framework.

## Setting it up yourself

1. Create a new Claude Project at [claude.ai](https://claude.ai), named something like "Exam & Revision Generator."
2. Copy `files/custom-instructions.md`, replace `{SCHOOL_NAME}` and `{SCHOOL_ADDRESS}` with your school's details, and paste it into the Project's **instructions** field.
3. Upload your e-notes as `.docx` files, named clearly, e.g. `Physics_SS2_FirstTerm.docx`.
4. Ask for an exam or a revision file in the chat, stating Term, Subject and Class.

---

Built by [Babatunde Awoyemi](https://babatundeawo.github.io/) &middot; [GitHub profile](https://github.com/babatundeawo) &middot; [Techbase](https://github.com/techbaseng)
