# Content Engine upgrade: v4.0 to v5.0 (owner notes, do not upload to the project)

## What to upload to the Claude Project
Replace the four existing files with: custom-instructions.md, kbi-schools-2026-calendar.md, techbase-2026-calendar.md, instruction.txt (as the project instructions).
Then run SETUP once to create kbi-fact-sheet.md, techbase-fact-sheet.md and brand-kit.md (templates are in Appendix C). Until those exist, the engine uses placeholders instead of inventing facts.

## Your four pain points and the fix for each

| Pain point | Fix in v5.0 |
|---|---|
| Output still sounds AI | Two-pass writing (draft, then cut a fifth and replace abstractions with objects). Expanded banned list. Hook library with logging so the same hook is not repeated. Texture Bank of real Nigerian scene details. Voice DNA with "sounds like / does not sound like" examples per brand. Internal 10 point scorecard, rewrite below 8 |
| Too slow, too many steps | GO skips the theme preview. LITE gives chat-only copy. BATCH writes a whole week in one go. Copy now comes first in the document, visuals last. Fixed weekly platform schedule (v4 never said which day gets which platform). Recommended theme plus one alternate instead of open choice |
| Weak enquiries and enrolments | Weekly keyword magnet (comment HANDS, get a checklist). Source-tagged WhatsApp links so you can see which post produced which lead. CTA ladder (soft, medium, hard). Lead Log. Reply Kit in every document (likely comments, enquiry DM opener, tough comment handler). Four-week campaign arcs. KBI admissions pipeline and FAQ posts. Techbase school partnership windows with outreach scripts. Proof Engine. Google Business Profile posts. Honest review requests. 10 minute daily engagement routine |
| Visual prompts inconsistent | Weekly Style Bible (a locked 40 to 60 word sentence pasted verbatim into every prompt). Style Lock steps (approve slide 1, then use it as a reference image for the rest, one slide at a time). Text-free by default with reserved text space. Safe zones. Visual QA checklist |

## Bigger ideas added
- **Fact Sheets as the single source of truth.** The engine may only state facts about KBI or Techbase that are in the sheets or that you typed. This is the strongest guard against invented fees, dates and results.
- **Nine modes** (added BATCH, REPLY, REPURPOSE, GROWTH, SETUP).
- **Weekly experiments**, one variable at a time, with a small-sample warning.
- **Content Bank and REPURPOSE** so winners are reused after 60 days, not forgotten.
- **Incident protocol and comment moderation.**
- **Connected tools**: Canva, Google Calendar, Drive and Gmail are used only if connected (drafts only, nothing is sent without approval).
- **No live search fallback** so the engine admits when it could not verify.

## Fixes
- KBI calendar: Independence Day 2026 listed as Friday 1 Oct; it fell on Thursday 1 Oct.
- Techbase calendar: August 2027 bootcamp week 2 was missing; restored.
- Weekend public holiday substitutes now flagged for checking.
- All 130 weekly rows verified by script as Mondays.

## Things I need you to decide or supply
1. **Fact Sheets and Brand Kit** (run SETUP). Fees, dates, contacts and colours were never in the files, so I did not invent them.
2. **Keywords**: each keyword in the calendars promises a small free asset. Only promote a keyword when you will really send it. I can draft the assets on request.
3. **Platform schedule**: Section 1.3 is my default. Change the ticks if your capacity differs.
4. **Google Business Profile** is optional and only produced if you say it is set up.
5. **Mid-session entry**: the arcs for January and April entry assume KBI admits mid-session. Confirm.
6. **Posting windows** are hypotheses until REVIEW has your real analytics.

## Not changed on purpose
Brand profiles, content mix, faceless image rule, six word on-image text cap, British English, the Oyo-first calendar rule, and the child safety and data protection rules.
