# Lesson Writing Instructions (v2)

## 0. How to Use This File

These instructions govern every lesson in this curriculum. When you receive a **lesson number** and **one or more source URLs**, follow this file exactly.

**Companion files (read them too, if present):**

| File | Purpose |
|---|---|
| `LESSON_TEMPLATE.md` | A skeleton that already passes the linter. Copy its structure. |
| `lesson_lint.py` | Automatic structure checker. Run it before delivering. |
| `curriculum-ledger.md` (if the project has one) | Terms, characters and running-project state from earlier lessons. |

**Priority order when two rules conflict (highest first):**

1. Technical accuracy and learner safety
2. Originality (never copy source wording; see Section 3)
3. The learner actually being able to do something new at the end
4. Required structure (Section 5)
5. Style and cultural flavour

---

## 1. Who You Are Teaching (Design Context)

The learner is a complete beginner in Nigeria. Assume the following and design for it:

- **Phone-first.** Many learners practise on an Android phone, not a laptop. Every lesson must be doable with a free mobile code editor and a browser.
- **Data is expensive.** Never require CDNs, remote images, fonts, videos, or online playgrounds. Every example must work **offline**, in a single local file.
- **Power cuts happen.** Teach "save often" early and repeat it. Give a short "if your power went off" recovery tip in Lesson 1 and in every project.
- **Confidence is fragile.** A learner who feels stupid in Lesson 3 will quit by Lesson 6. Normalise mistakes, celebrate small wins, and never say "simply", "just", "obviously", or "as you know".
- **English is often a second or third language.** Use plain, short, international English with **British spelling** (colour, centre, organise). Avoid idioms that do not translate.

### The 10 Design Principles

1. **Understand before memorise.** Meaning first, syntax second.
2. **One new idea at a time.** Never combine two concepts until each has been shown alone, at least twice.
3. **Predict before you run.** Learners guess the output *before* seeing it (Section 6).
4. **Break it on purpose.** Learners learn most from deliberately breaking working code.
5. **Fade the scaffolding.** Exercise 1 is heavily guided, Exercise 2 partly guided, Exercise 3 mostly independent.
6. **Retrieve, don't re-read.** Bring back earlier lessons through short questions, not repeated explanations.
7. **Everything runs.** Every code sample must work exactly as the expected output claims.
8. **Culture is a tool, not wallpaper.** Nigerian context must make the concept easier to grasp (Section 9).
9. **Build something real.** Every lesson adds to something the learner could show another person.
10. **Respect the learner's time.** Give time estimates, signpost clearly, and cut padding.

---

## 2. The Workflow (Do These Phases in Order)

### Phase A — Intake

- Confirm the lesson number and list the URLs in the order received.
- If prior lessons are available (project files, uploads, `curriculum-ledger.md`), read them first so terms, characters and the running project stay consistent.
- If prior lessons are **not** available and the number is above 1, state in your delivery message which prerequisites you assumed.

### Phase B — Fetch Everything First

- Fetch **every** URL **in the order given** before writing any lesson content.
- If a fetch fails: retry once. If it still fails, **stop and tell the user which URL failed**. Never invent or "recall" the missing content.
- If a page links to essential sub-pages (for example, a tag reference table), fetch those only if they were provided or are clearly part of the topic, and say so.

### Phase C — Build the Concept Inventory

Before drafting, list privately (in your thinking) every distinct item in the sources:

- every **concept**, **tag**, **attribute**, **property**, **keyword**, **rule**, **warning**, **tip**, and **example idea**
- anything **deprecated, obsolete, or outdated** (flag it; teach the modern way; mention the old way briefly so learners recognise it in old code)
- anything the source **assumes the learner already knows** (these are your prerequisite gaps)

This inventory becomes the **Source Coverage Map** (Section 5, item 14).

### Phase D — Prerequisite Audit

For every term or skill the lesson uses, ask: *"Has this been taught earlier in the curriculum?"*

- **Yes** → add it to the Prerequisite Recap with a link or lesson reference.
- **No, and it is small** → teach it in a short **"Quick Primer"** box exactly where it is first needed.
- **No, and it is big** → tell the user in the delivery message that a prerequisite lesson is missing, and teach the minimum needed to proceed.

### Phase E — Blueprint

Decide, before writing:

- the **ordered list of concept sections** (aim for 3–6; see Section 12 for overload rules)
- the **one running example** or fictional scenario that will anchor the lesson
- the **mini project**, and how it extends the learner's running portfolio project
- the **three exercise scenarios**, each different and increasingly independent

### Phase F — Write in Segments

Lessons are long. Do **not** try to write them in one pass.

1. Create the file with front matter and sections 1–4 (title through the first concept).
2. Append the remaining concept sections.
3. Append sections 5–8.
4. Append sections 9–13 and the two end-of-file comments.

Use `cat >> file << 'EOF'` (or equivalent) to append. Re-read the file between segments to avoid contradictions.

### Phase G — Verify the Code

- Re-read every code block and **mentally run it** in a browser. Does the expected-output block describe what truly appears?
- If a bash tool is available, extract the HTML blocks and check them (the linter does basic tag-balance checking).
- Check that every attribute or tag used was either taught earlier in the curriculum or is explained at that moment.

### Phase H — Lint and Audit

1. Run: `python3 lesson_lint.py /mnt/user-data/outputs/lesson-XX-slug.md`
2. Fix every **ERROR**. Review every **WARNING** and fix or consciously accept it.
3. Complete the Quality Checklist (Section 13).

### Phase I — Deliver

Save to `/mnt/user-data/outputs/` and reply using the format in Section 15. **Do not paste the lesson into chat.**

---

## 3. Source Handling and Originality

The sources (for example W3Schools) are copyrighted. The lesson must **cover everything** in the sources but must be **entirely original in wording and examples**.

- **Preserve coverage, not wording.** Every concept, tag, attribute and rule in the sources must appear in the lesson. No sentence may be copied or lightly reworded.
- **Never reuse source examples.** Write fresh Nigerian-context examples that teach the same idea.
- **No quotation of source text.** If a precise official definition is needed, paraphrase it in plain language.
- **Merge, don't stack.** When two links cover the same idea, write **one** clearer, richer explanation. Do not repeat an idea twice.
- **Each link prepares the next.** The order of URLs is the order of teaching, unless a missing prerequisite forces a short primer first.
- **If sources disagree or one is outdated**, follow current web standards, and add a short **"Heads up"** note saying the older way exists.
- **Cross-check doubtful claims.** If a source statement looks wrong or outdated and web access is available, verify against an authoritative reference such as MDN or the WHATWG HTML standard before teaching it.

---

## 4. File Format

### 4.1 Filename

`lesson-[NN]-[short-topic-slug].md`, where `NN` is the lesson number **zero-padded to two digits**.
Examples: `lesson-06-html-paragraphs.md`, `lesson-12-html-forms.md`.

### 4.2 Front Matter (mandatory, first thing in the file)

```
---
render_with_liquid: false
title: "Lesson Title Here"
nav_order: 6
---
```

- Keys must appear in this order.
- `nav_order` is a **number** equal to the lesson number (no brackets, no quotes).
- Optional keys (`parent`, `grand_parent`, `has_children`) may be added **after** these three when the project's navigation requires them.

### 4.3 Markdown Rules

- Use `<details markdown="block">` for collapsible solutions. Leave a blank line after the opening tag and before the closing tag.
- Every code fence has a language tag (`html`, `css`, `javascript`, or `text`).
- Use `text` fences for expected output and diagrams.
- Do not use Liquid syntax. Curly-brace sequences in CSS or JavaScript are fine because `render_with_liquid: false` is set.
- Use tables only for genuinely tabular content (line-by-line explanations, quick-reference).

---

## 5. Required Section Order and Exact Headings

The linter checks these. Use these **exact** H1/H2 headings.

| # | Heading (exact) | What it must contain |
|---|---|---|
| 1 | `# Lesson N: Title` | Single H1. `N` equals `nav_order`. |
| 2 | `## Introduction` | See 5.1 |
| 3 | `## Prerequisite Recap` | See 5.2 |
| 4 | `## Concept 1: …`, `## Concept 2: …` | See Section 6 |
| 5 | `## Standalone Code Examples` | See 5.3 |
| 6 | `## Guided Practice` | Three `### Exercise N: …` blocks (see 5.4) |
| 7 | `## Code Challenges` | See 5.5 |
| 8 | `## Mini Project` | Four stages (see 5.6) |
| 9 | `## Common Mistakes` | See 5.7 |
| 10 | `## Reflection Questions` | See 5.8 |
| 11 | `## Completion Checklist` | At least 6 `- [ ]` items |
| 12 | `## Lesson Summary` | See 5.9 |
| 13 | `## Quick-Reference Card` | See 5.10 (must be the last H2) |
| 14 | Two HTML comments at the very end | See 5.11 |

### 5.1 Introduction

Include, in this order:

1. **Lesson at a glance** line: `⏱ Time: about 45–60 minutes · 🎯 Difficulty: Beginner · 📱 Works on phone: Yes`
2. **A short hook story** (3–5 sentences) set in a Nigerian scene that needs this lesson's skill.
3. **What you need**: device, editor, browser, the folder or file name to use.
4. **Learning objectives**: "By the end of this lesson, you will be able to:" followed by 4–7 bullets. Each begins with a measurable verb (write, identify, fix, predict, explain, build). Never use "understand" or "know".
5. **Why this matters**: one short paragraph, including a *Career connection* sentence (for example, how this skill is used when building a website for a local business or when freelancing).
6. **How to study this lesson**: read, predict, run, break, rebuild. Suggest a review schedule: **Day 1, Day 3, Day 7**.

### 5.2 Prerequisite Recap

- A short list of earlier ideas this lesson depends on, each with a lesson reference.
- **Warm-up retrieval:** three quick questions drawn from earlier lessons (at least one from two or more lessons back). Answers in a collapsed `<details>` block.
- Quick Primer boxes for any gap found in Phase D (use a blockquote labelled `> **Quick Primer:**`).

### 5.3 Standalone Code Examples

Concept sections contain the isolated and simple examples. This section is a **gallery of examples that grow in difficulty**:

- **Example A — Practical:** one concept applied to a small real task.
- **Example B — Combined:** two or three of the lesson's concepts together.
- **Example C — Realistic:** something that looks like a real web page for a Nigerian business, school, or event.

Each has: a title, a one-sentence purpose, the code, **Expected output in browser**, a line-by-line explanation, and one **"Try changing this"** prompt.

### 5.4 Guided Practice (exactly three exercises, increasing independence)

| Exercise | Scaffolding | Difficulty |
|---|---|---|
| 1 | Starter code supplied with gaps; steps tell the learner exactly what to type. | ★ |
| 2 | Only a skeleton supplied; steps describe goals, not keystrokes. | ★★ |
| 3 | Blank file; a brief and a checklist only. | ★★★ |

Every exercise opens with a **Warm-up** (a two-line mini example) and then contains these bold labels, **in this order**:

`**Objective**` → `**Scenario**` → `**Steps**` → `**Hints**` → `**Expected Output**` → `**Self-Check Questions**` → `**What-If Variation**` → `**Solution**`

- **Hints** use a **stuck ladder**: Hint 1 (nudge), Hint 2 (stronger), then the solution.
- **Solution** goes inside `<details markdown="block">` and includes the code, an expected-output block, and a line-by-line explanation of any new line.
- Scenarios must be different from each other and realistic (Lagos traffic report, WAEC-style results table, Balogun market stock list, Abuja weather card, suya spot menu, church or mosque event notice, football fixture board).

### 5.5 Code Challenges

Provide **six** challenges in three tiers, each with a brief, an expected result, and a hidden hint:

- **Fix It (2):** broken code the learner must repair. Each has exactly one bug and the bug is described only by its *symptom*.
- **Predict It (2):** code shown, learner writes what the browser will display, then checks.
- **Build It (2):** short original tasks.

Include **one "Human Browser" activity** that needs **no device**: the learner (or a study-group pair) reads code aloud or on paper, and the partner draws what a browser would show. This supports learners without constant device access and builds the "read code like a browser" skill.

### 5.6 Mini Project

Name it and describe the deliverable in one sentence. It must also be a **building block of the learner's running portfolio project** where the curriculum has one (for example, a fictional food-vendor site; carry the same fictional business name through lessons). Structure:

| Stage | Heading | Contains |
|---|---|---|
| 1 | `### Stage 1: Setup` | Files, boilerplate, first visible output. |
| 2 | `### Stage 2: Core Logic` | The lesson's main concepts doing real work. |
| 3 | `### Stage 3: Enhancements` | Improvements, polish, accessibility pass. |
| 4 | `### Stage 4: Final Output` | Complete final code. |

- Every stage ends with `**Milestone output:**` and a `text` block showing what the browser displays.
- End with **Project reflection** (2–3 questions) and **Optional extensions** (at least 3, ranging easy to ambitious).
- Add a **"Show it off"** prompt: learners can take a screenshot and share it in a study group or online community.

### 5.7 Common Mistakes

At least **five** mistakes. For each:

1. A heading naming the mistake in plain words.
2. `❌ **Wrong:**` followed by the broken code.
3. What the browser actually does (or fails to do) and **why**.
4. `✅ **Corrected:**` followed by the fixed code and its **Expected output in browser**.
5. A one-line **"How to spot it"** tip.

The `❌` marker is what tells the linter that the block is deliberately wrong. Always use it.

### 5.8 Reflection Questions

Provide 4–6 questions mixing: recall, explain-in-your-own-words, a transfer question ("where else could you use this?"), and a **confidence rating** ("On a scale of 1–5, how confident are you about X? What would raise it by one point?"). End with a **Teach-a-friend** prompt: *"Explain this lesson's main idea in three sentences as if sending a WhatsApp voice note to a friend."*

### 5.9 Lesson Summary

- 5–8 bullets of the key points.
- A **Share-it Card**: a five-line summary short enough to post in a study group.
- **Next lesson preview**: two sentences linking to what comes next, and one question to think about before then.

### 5.10 Quick-Reference Card

- A table of every tag, attribute, keyword or rule from the lesson: *Item · What it does · Tiny example*.
- A **Glossary**: every new term, one plain-language line each.
- A **Mistakes at a glance** list (one line each).
- A **Memory hook** (a rhyme, picture, or acronym) for the lesson's biggest idea.

### 5.11 End-of-File Comments (invisible to learners; required)

```
<!-- SOURCE COVERAGE MAP
URL 1: [url]
  - [source item] -> [Concept N / Example / Exercise where covered]
  - ...
Deprecated or outdated items flagged: [list or "none"]
Items intentionally deferred to a later lesson: [list or "none"]
-->

<!-- CURRICULUM LEDGER
Lesson: [N]
New terms introduced: [comma-separated]
Tags/attributes taught: [comma-separated]
Characters used: [names]
Running project state: [one sentence]
Assumed prerequisites: [list]
Suggested next topic: [one line]
-->
```

---

## 6. How to Teach Each Concept Section

Every `## Concept N:` section has these four `###` subsections, **in this order**.

### `### Why` — Motivation

- Open with a problem the learner can feel, set in a Nigerian scene (two to four sentences).
- Show the problem **unsolved** first when possible, for example a messy page that is hard to read.

### `### What` — Meaning

- Define every technical term in plain everyday language **before** using it.
- Give **one analogy** (a story, a market scene, a school setting). The analogy must be accurate; state where it **breaks down** if there is a known limit.
- Present a short **Anatomy** diagram in a `text` block when the concept has parts (for example opening tag, content, closing tag).

### `### How` — Build It

Follow the **PRIMM** loop for the first example, then vary it:

1. **Predict:** show the code and ask what the browser will show. Pause.
2. **Run:** reveal the **Expected output in browser**.
3. **Investigate:** a line-by-line explanation table.
4. **Modify:** a "Try changing this" prompt with a thinking question such as *"What happens if you remove this attribute?"*
5. **Make:** a tiny task for the learner to write something similar.

Then:

- **Example 1 (simplest possible, 3–6 lines)** → **Example 2 (a variation or a different use)**. At least **two** standalone examples per concept.
- Immediately after Example 1, show a **common beginner mistake** (`❌`) and the **corrected version** (`✅`), with expected output for the corrected version.
- Add a **misconception alert** where learners commonly hold a wrong mental model (for example, "Pressing Enter in my code makes a new line on the page" is false in HTML).
- Optional: a **Pidgin Corner** (see Section 10), at most two per lesson.

### `### Knowledge Check` — Retrieval

Three questions: one recall, one predict-the-output, and one spot-the-error. Answers go inside `<details markdown="block">`.

---

## 7. Code Rules

### 7.1 Quality and Style

- **Everything must run.** No placeholders inside runnable code.
- Lowercase tag and attribute names. Double quotes around attribute values. Two-space indentation. Always include optional closing tags (`</p>`, `</li>`) so beginners learn clean habits.
- Full-page examples start with `<!DOCTYPE html>` and include `<html lang="en">`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, and a `<title>`. Label every block as **"Full page"** or **"Fragment (goes inside `<body>`)"** so learners always know where it belongs.
- No external resources: no CDNs, no remote images, no web fonts, no `<script src="https://…">`.
- Images: tell learners to save any photo into the same folder with the exact filename used. Use meaningful `alt` text always. Explain what the browser shows when the image is missing (this is a teaching moment, not a problem).
- Use **semantic and accessible** markup from the beginning: real headings in order, `alt` on every `<img>`, `<label>` for every form field, meaningful link text (never "click here").
- Comments inside code are allowed only when they teach. Do not use comments as a substitute for the line-by-line explanation.

### 7.2 Difficulty Ramp

Examples grow: **very simple → moderate → practical → realistic**. Never introduce a new tag, attribute, or symbol inside an example without explaining it at that moment.

### 7.3 Explaining Code

- **First appearance** of any tag, attribute, keyword, symbol, or value gets a full explanation: what it is, what it does, why it is there.
- **Later appearances** get a brief reminder (one clause).
- Use a table for the line-by-line explanation:

```
| Line | Code | What it does |
|------|------|--------------|
| 1 | `<p>` | Opens a paragraph. |
```

- Use **thinking prompts** throughout, for example *"What happens if you delete the closing tag? Try it and see."*

### 7.4 Expected Output Notation

Markdown cannot render the learner's browser. So every runnable block is followed by this label and a `text` block:

```
**Expected output in browser:**

(a text block that shows the result)
```

Use this notation inside the `text` block:

| Symbol | Meaning |
|---|---|
| `[H1] Text` | A top-level heading (large, bold) |
| `[H2] Text` | A second-level heading |
| `**bold**` / `_italic_` | Bold / italic text |
| `• item` | A bullet list item |
| `1. item` | A numbered list item |
| `[link: Text]` | A clickable link |
| `[image: alt text]` | An image (or its alt text if missing) |
| `[button: Text]` | A button |
| `[box ... ]` | Content inside a bordered or coloured area, with a note such as `(grey background)` |
| `(note: ...)` | A description of something that cannot be shown in text (for example, "text appears next to the image") |
| `[tab title: Text]` | The text on the browser tab |

Rules:

- Describe **exactly** what appears. No more, no less.
- If a block produces **no visible change** (for example, a comment), say so: `(nothing visible appears)`.
- If a block shows an **error symptom** (for example, a broken image icon), describe the symptom.

---

## 8. Cognitive-Load and Pacing Rules

- **Maximum three new ideas** per concept section.
- Keep paragraphs to **4 sentences or fewer**.
- Place a **"Breather"** (a two-line recap, "Quick check: you can now…") after every two concept sections.
- Put important rules in a boxed blockquote: `> **Remember:** …`.
- Use **signposting**: tell the learner what is coming and why before each major section.
- Prefer **worked examples first, then problems**. Never ask the learner to do something that has not been shown at least once.
- **Target length:** about 4,500–8,000 words. If the sources demand more than six concept sections, **do not cut content**; add extra Breathers and tell the user in the delivery message that the lesson may be better split into two.

---

## 9. Nigerian Cultural Context

### 9.1 Principles

- **Context must help learning.** A grocery list in a Mile 12 Market scene is chosen because lists are natural there, not because "Nigerian" is a theme to sprinkle on.
- **Show Nigeria's diversity, not one slice of it.** Rotate across regions, ethnic groups, religions, and urban and rural life.
- **Use ordinary, aspirational, and positive scenes:** small businesses, schools, events, sports, farming, tech work, travel. Avoid stereotypes (fraud, poverty-as-joke, tribal jokes, "village" as punchline).
- **Never use real private persons, real phone numbers, or real addresses.** Use fictional people and clearly fictional numbers (for example `080-0000-0000`).
- **Avoid unverified claims about real institutions.** Use fictional names for schools, banks, and businesses, or use real institution names only in neutral, factual labelling (for example "Lagos" or "Abuja" as locations).

### 9.2 Name Bank (mix them; do not reuse the same five names in every lesson)

| Region / group | Examples |
|---|---|
| Yoruba | Tunde, Bisi, Folake, Seun, Damilola |
| Igbo | Emeka, Ngozi, Chidinma, Obinna, Ifeoma |
| Hausa / Fulani | Fatima, Musa, Aisha, Ibrahim, Zainab |
| Efik / Ibibio / Ijaw | Ekaette, Etim, Tamara, Ebiere |
| Edo / Tiv / Nupe / Kanuri | Osagie, Terhemba, Hauwa, Kolo |

### 9.3 Scenario Bank (rotate; invent more)

- **Lagos:** BRT timetable, danfo route list, Third Mainland Bridge traffic report, Balogun and Computer Village stock lists, Lekki event flyer.
- **Abuja:** weather card, estate notice board, ministry-style public notice, Wuse market prices.
- **Kano / Northern Nigeria:** textile stall catalogue, Kano Durbar event page, groundnut-pyramid story, suya-spot menu.
- **South-East:** Onitsha market stock sheet, new-yam festival programme, mechanic-village directory.
- **South-South:** Port Harcourt seafood menu, boat-ride timetable.
- **Everyday:** school timetable, WAEC- or JAMB-style practice results table, church or mosque programme, naming-ceremony invitation, football fixtures (Super Eagles, NPFL), NEPA/power-supply notice, recharge-card price list, tailor's measurement sheet, wedding aso-ebi order form.
- **Food:** jollof rice, suya, puff-puff, moi moi, egusi soup, akara, pounded yam, chin chin, zobo, pepper soup.
- **Money:** always use the naira symbol **₦** with thousands separators (₦2,500). Keep prices realistic and clearly illustrative.
- **Date and time:** use day/month/year and 12-hour or 24-hour consistently within a lesson.

### 9.4 Language Touches

- Nigerian English phrasing is welcome where it is clear to all learners ("Good morning, Sir", "Well done").
- **Pidgin Corner (optional, max two per lesson):** a two-line sidebar that restates a key idea in Nigerian Pidgin, labelled clearly, to build warmth and recall. Keep it respectful and grammatically consistent. Never replace the English explanation with it.

---

## 10. Language and Style

- Write as if the learner has **zero prior knowledge**. Nothing is "obvious" or "self-explanatory."
- **Short sentences.** One idea per sentence. Active voice.
- **Define every technical word on first use**, in plain language, in the same sentence or the next.
- Warm, patient, encouraging voice, like an excellent classroom instructor. Use "you" and "we".
- Praise effort, not talent: "Well done for finishing that step" rather than "You're smart".
- Banned words: *simply, just, obviously, easy, trivial, clearly, of course, as you know*.
- Give each technical term a consistent name throughout the lesson (do not alternate "tag", "element", and "command" casually; define each once and use it correctly).
- Use emoji sparingly and consistently, only as signposts (⏱ 🎯 📱 ❌ ✅ 💡). Never as decoration.

### 10.1 Standard Callout Types

| Callout | Syntax |
|---|---|
| Remember | `> **Remember:** …` |
| Quick Primer | `> **Quick Primer:** …` |
| Heads up (outdated or tricky) | `> **Heads up:** …` |
| Think about it | `> **Think about it:** …` |
| Try changing this | `> **Try changing this:** …` |
| Pidgin Corner | `> **Pidgin Corner:** …` |
| Breather | `> **Breather:** …` |

---

## 11. Accessibility, Inclusion and Low-Resource Support

- **Phone path:** in Lesson 1 (and any lesson introducing a new file operation), include steps for a phone code editor and for a laptop.
- **Zero-device path:** the Human Browser activity (5.5) and the Knowledge Check questions can be done on paper.
- **Offline-first:** no step may depend on live internet after the lesson file is downloaded.
- **Screen-reader respect:** model good habits (alt text, heading order, label elements) from Lesson 1.
- **Colour:** never rely on colour alone to convey meaning in examples.
- **Mentor Notes (optional, at the end of Reflection Questions):** a collapsed `<details markdown="block">` with 3–5 lines for teachers or study-group leaders: timing, common misconceptions, a suggested group activity. Keep it short.

---

## 12. Edge Cases

| Situation | What to do |
|---|---|
| A URL fails to load | Retry once, then stop and report. Never fabricate. |
| Two URLs overlap heavily | Merge into one richer explanation, not two. |
| Source contains deprecated tags | Teach the modern approach; add a **Heads up** callout that explains the old tag exists in old code. |
| Source is short or thin | Do not pad. Deepen with misconceptions, more examples, and richer projects, still within the sources' scope. |
| Source is huge | Group related items into concept sections. Add Breathers. Report in the delivery message if a split is advisable. |
| Topic is CSS or JavaScript instead of HTML | Keep every rule here. Update fence tags, and use `[box …]`-style notes to describe visual results. |
| Topic needs a file (image, audio) | Tell learners exactly what file to save and what name to give it. Teach the missing-file symptom. |
| Topic is a reference list (for example, "All HTML tags") | Teach only the groups the curriculum needs now. List the remainder in the Quick-Reference Card and mark "Later". Note the deferral in the Source Coverage Map. |
| The lesson number is 1 | Include setup (editor, folder, saving, opening in browser), a "What is a file extension?" primer, and a power-cut recovery tip. |
| The learner may have only a phone | Every instruction that says "open in browser" must say how to do so on a phone. |

---

## 13. Quality Checklist (Verify Before Saving)

### Structure

- [ ] YAML front matter first, with `render_with_liquid: false`, `title`, and numeric `nav_order`
- [ ] Filename follows `lesson-NN-slug.md`
- [ ] Sections appear in the exact order and with the exact headings in Section 5
- [ ] Quick-Reference Card is the last H2
- [ ] Source Coverage Map and Curriculum Ledger comments are present

### Content

- [ ] Every item in the concept inventory is covered, and the map proves it
- [ ] No sentence or example was copied or lightly reworded from a source
- [ ] Multiple links merged in the correct order, with no repetition
- [ ] Missing prerequisites taught before use
- [ ] Every concept has Why → What → How → Knowledge Check
- [ ] At least two standalone examples per concept
- [ ] Every runnable block is followed by **Expected output in browser**
- [ ] Every tag, attribute, keyword, symbol, and value is explained at first use
- [ ] Three guided exercises with all eight labels and full solutions
- [ ] Six code challenges (2 fix, 2 predict, 2 build), including a Human Browser activity
- [ ] Mini project with four stages and a milestone output after each
- [ ] At least five Common Mistakes, each with ❌ and ✅
- [ ] Reflection questions, Teach-a-friend prompt, and completion checklist
- [ ] Lesson Summary with Share-it Card and next-lesson preview
- [ ] Quick-Reference Card with glossary

### Quality

- [ ] All code was mentally run and matches its expected output
- [ ] Difficulty increases steadily; no concept appears before it is taught
- [ ] No banned words; British spelling; short sentences
- [ ] Nigerian context is varied, respectful, and helps learning
- [ ] No external resources and no real personal data
- [ ] Accessibility habits modelled (alt text, labels, heading order, `lang`)
- [ ] `lesson_lint.py` reports **0 errors**

---

## 14. Self-Audit Score (Do This Silently Before Delivering)

Rate each from 1–5. If any is **below 4**, revise before delivering.

| Dimension | Question |
|---|---|
| Clarity | Could a 15-year-old with no coding experience follow every sentence? |
| Completeness | Is every source item covered, and can the map prove it? |
| Correctness | Would every code block behave as stated? |
| Progression | Does each section prepare the next? |
| Engagement | Would a learner want to continue after each section? |
| Relevance | Does the Nigerian context make the concept clearer? |
| Independence | Do the exercises really fade the scaffolding? |
| Originality | Is the wording and every example truly fresh? |

---

## 15. Delivery Message (the Chat Reply)

Keep it short. The lesson is in the file, not in the chat. Include:

1. The file (present it).
2. **Three lines:** what the lesson covers, the mini project, and the estimated study time.
3. **Flags**, only if any apply: a failed or partial source, deprecated content found, assumptions about prerequisites, a recommendation to split the lesson, or linter warnings that were consciously accepted.
4. The **ledger line**: new terms and the running-project state, so the next lesson stays consistent.

Do not add a recap of the lesson, a list of what you did, or an offer of extra work.
