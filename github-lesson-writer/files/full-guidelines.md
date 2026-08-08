# Lesson Writing Instructions
 
## Purpose
 
These instructions govern how every lesson file in this curriculum is written. When given a lesson number and one or more W3Schools source URLs, follow this document exactly to produce a complete, beginner-friendly Markdown lesson file.
 
---
 
## Step 1 — Fetch All Source Links First
 
Before writing a single word of lesson content, fetch every URL provided. Process them **strictly in the order received**. All fetched content must be merged into one smooth, logically progressive lesson — never written as separate disconnected sections.
 
- If two links cover the same concept, merge the explanations into one clearer, richer version. Do not repeat the same idea twice.
- Each link's content must naturally prepare the learner for what comes next.
---
 
## Step 2 — Required File Format
 
Every lesson file **must** begin with this YAML front matter at the very top — no exceptions:
 
```
---
render_with_liquid: false
title: "Lesson Title Here"
nav_order: [Lesson Number]
---
```
 
Below the front matter, the lesson body must follow this exact section order:
 
1. Lesson Title
2. Lesson Introduction (with explicit learning objectives)
3. Prerequisite Recap (links back to prior lessons)
4. Concept Sections (numbered, each following the **Why → What → How** pattern)
5. Standalone Code Examples (with "Expected output in browser" blocks)
6. Guided Practice Exercises (three, progressively harder, with full solutions)
7. Code Challenges
8. Mini Project (broken into milestone stages)
9. Common Mistakes (error shown, then corrected version shown)
10. Reflection Questions
11. Completion Checklist
12. Lesson Summary
13. Quick-Reference Card
---
 
## Step 3 — How to Teach Each Concept
 
For every concept in the lesson, follow this three-phase pattern:
 
### Phase 1 — Build Understanding First
 
- Define every technical term in plain everyday language before using it.
- Use an analogy, a story, or a relatable real-world comparison.
- Show the concept in isolation with the **simplest possible example first**.
- Immediately follow with a common beginner mistake, then show the corrected version.
- Do not combine two concepts until each one has been shown separately at least twice.
### Phase 2 — Guided Practice
 
- Open each exercise with a short warm-up mini example.
- Use realistic Nigerian scenarios: Lagos traffic, school results, market inventory, Abuja weather, etc.
- Every exercise must include: **Objective → Scenario → Steps → Hints → Expected Output → Self-Check Questions**.
- Add an optional "what-if" variation challenge at the end of each exercise.
### Phase 3 — Mini Project
 
- Build at least one mini project that combines the lesson's concepts.
- Structure it as: **Setup → Core Logic → Enhancements → Final Output**.
- Show a milestone output after each stage.
- End with reflection questions and suggestions for optional extensions.
---
 
## Step 4 — Code Example Rules
 
- Every concept must begin with one isolated, simple example (3–6 lines is ideal).
- Examples must grow in difficulty: very simple → moderate → practical → realistic.
- Every code example **must** include an "Expected output in browser" block immediately after it.
- Explain every line of code — every tag, attribute, keyword, symbol, and value.
- Use thinking prompts throughout: *"What happens if you remove this attribute?"* or *"Why did the output change?"*
---
 
## Step 5 — Language and Style
 
- Write as if the learner has **zero prior knowledge**.
- Never assume anything is "obvious" or "self-explanatory."
- Use short sentences. Avoid jargon. When a technical word is unavoidable, define it immediately.
- Ground all examples in Nigerian cultural context: names (Emeka, Ngozi, Fatima), cities (Lagos, Abuja, Kano), dishes (jollof rice, suya, puff-puff), and institutions where relevant.
- Teach with the warmth and patience of an excellent classroom instructor.
---
 
## Step 6 — Quality Checklist (Verify Before Saving)
 
Before saving any lesson file, confirm every item below is present:
 
- [ ] YAML front matter at top of file
- [ ] All source URL content fetched and preserved
- [ ] Multiple links merged in correct order
- [ ] Missing prerequisite concepts taught before they are used
- [ ] Every concept explained with Why → What → How
- [ ] At least two standalone examples per concept
- [ ] Expected output shown after every code block
- [ ] Three guided exercises with full solutions
- [ ] One mini project with milestone stages
- [ ] Common mistakes section with corrections
- [ ] Reflection questions included
- [ ] Completion checklist included
- [ ] Quick-reference card at the end
- [ ] Nigerian cultural context woven throughout examples
- [ ] Difficulty increases gradually throughout the lesson
---
 
## Output Location
 
Save every completed lesson file to:
 
```
/mnt/user-data/outputs/
```
 
Use the naming convention: `lesson-[number]-[short-topic-slug].md`
Example: `lesson-06-html-paragraphs.md`
 