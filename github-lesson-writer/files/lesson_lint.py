#!/usr/bin/env python3
"""
lesson_lint.py - structure checker for curriculum lesson files.

Usage:  python3 lesson_lint.py path/to/lesson-06-html-paragraphs.md [more files...]
Exit code: 0 = no errors (warnings allowed), 1 = at least one error.

Checks front matter, filename, section order, concept/exercise/project
structure, expected-output blocks, tag balance in HTML blocks, alt text,
checklist items, end-of-file comments, length, and Nigerian-context density.
Code blocks preceded by a line containing the cross-mark are treated as
deliberately wrong and are skipped for output and tag checks.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

WRONG = "\u274c"  # cross mark used to flag intentionally wrong code
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "source", "track", "wbr"}
CODE_LANGS = {"html", "css", "js", "javascript"}
CONTEXT_WORDS = ["lagos", "abuja", "kano", "enugu", "ibadan", "port harcourt",
                 "naira", "\u20a6", "jollof", "suya", "puff-puff", "moi moi",
                 "egusi", "akara", "emeka", "ngozi", "fatima", "tunde", "bisi",
                 "musa", "aisha", "chidinma", "danfo", "market", "nepa"]
EX_LABELS = ["Objective", "Scenario", "Steps", "Hints", "Expected Output",
             "Self-Check Questions", "What-If Variation", "Solution"]


class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.problems = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.problems.append(f"</{tag}> closes while <{self.stack[-1]}> is still open")
            while self.stack and self.stack.pop() != tag:
                pass
        else:
            self.problems.append(f"stray </{tag}>")

    def result(self):
        self.close()
        return self.problems + [f"<{t}> never closed" for t in self.stack]


def scan(lines):
    """Return (fences, headings) ignoring headings inside fences."""
    fences, headings = [], []
    in_f, mark, lang, start = False, "", "", 0
    for i, line in enumerate(lines):
        if not in_f:
            m = re.match(r"^\s*(`{3,}|~{3,})\s*([\w+-]*)", line)
            if m:
                in_f, mark, lang, start = True, m.group(1), m.group(2).lower(), i
                continue
            h = re.match(r"^(#{1,6})\s+(.*\S)\s*$", line)
            if h:
                headings.append((i, len(h.group(1)), h.group(2)))
        else:
            if re.fullmatch(r"\s*" + re.escape(mark[0]) + "{%d,}\\s*" % len(mark), line):
                fences.append({"lang": lang, "start": start, "end": i,
                               "code": "\n".join(lines[start + 1:i])})
                in_f = False
    return fences, headings, in_f


def lint(path):
    errors, warnings = [], []
    E, W = errors.append, warnings.append
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    lines = text.split("\n")

    # ---- front matter
    nav = None
    if not lines or lines[0].strip() != "---":
        E("File must begin with '---' YAML front matter.")
        body_start = 0
    else:
        try:
            end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
        except StopIteration:
            E("Front matter is never closed with '---'.")
            end = 0
        fm = [l for l in lines[1:end] if l.strip()]
        keys = [l.split(":", 1)[0].strip() for l in fm]
        if keys[:3] != ["render_with_liquid", "title", "nav_order"]:
            E("Front matter must start with render_with_liquid, title, nav_order (in that order).")
        for l in fm:
            if l.startswith("render_with_liquid:") and l.split(":", 1)[1].strip() != "false":
                E("render_with_liquid must be false.")
            if l.startswith("title:") and not re.match(r'title:\s*".+"\s*$', l):
                E('title must be a quoted, non-empty string.')
            if l.startswith("nav_order:"):
                v = l.split(":", 1)[1].strip()
                if v.isdigit():
                    nav = int(v)
                else:
                    E("nav_order must be a plain number (no brackets or quotes).")
        body_start = end + 1

    # ---- filename
    if p.name.startswith("lesson-"):
        m = re.fullmatch(r"lesson-(\d{2,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md", p.name)
        if not m:
            E("Filename must look like lesson-06-topic-slug.md (zero-padded number, lowercase slug).")
        elif nav is not None and int(m.group(1)) != nav:
            E(f"Filename number {m.group(1)} does not match nav_order {nav}.")

    fences, headings, unclosed = scan(lines)
    if unclosed:
        E("A code fence is never closed.")

    # ---- H1
    h1 = [h for h in headings if h[1] == 1]
    if len(h1) != 1:
        E(f"Expected exactly one H1, found {len(h1)}.")
    else:
        m = re.match(r"Lesson (\d+):\s+\S", h1[0][2])
        if not m:
            E("H1 must read '# Lesson N: Title'.")
        elif nav is not None and int(m.group(1)) != nav:
            E(f"H1 lesson number {m.group(1)} does not match nav_order {nav}.")

    # ---- H2 order
    h2 = [(i, t) for i, lvl, t in headings if lvl == 2]
    low = [(i, t.lower()) for i, t in h2]
    required = [("Introduction", r"introduction"),
                ("Prerequisite Recap", r"prerequisite recap"),
                ("Concept N", r"concept \d+\b"),
                ("Standalone Code Examples", r"standalone code examples"),
                ("Guided Practice", r"guided practice"),
                ("Code Challenges", r"code challenges"),
                ("Mini Project", r"mini project"),
                ("Common Mistakes", r"common mistakes"),
                ("Reflection Questions", r"reflection questions"),
                ("Completion Checklist", r"completion checklist"),
                ("Lesson Summary", r"lesson summary"),
                ("Quick-Reference Card", r"quick-reference card")]
    firsts = []
    for name, pat in required:
        idx = [i for i, t in low if re.match(pat, t)]
        if not idx:
            E(f"Missing required section: ## {name}")
            firsts.append(None)
        else:
            firsts.append(idx[0])
            if name != "Concept N" and len(idx) > 1:
                W(f"Section '{name}' appears more than once.")
    present = [f for f in firsts if f is not None]
    if present != sorted(present):
        E("Required sections are out of order.")
    concept_idx = [i for i, t in low if re.match(r"concept \d+\b", t)]
    nums = [int(re.match(r"concept (\d+)", t).group(1)) for i, t in low if re.match(r"concept \d+\b", t)]
    if nums and nums != list(range(1, len(nums) + 1)):
        E(f"Concept sections must be numbered 1..n in order (found {nums}).")
    if not concept_idx:
        pass
    known = [r[1] for r in required]
    for i, t in low:
        if not any(re.match(pat, t) for pat in known):
            W(f"Unexpected extra H2 section: '{h2[[x for x, _ in h2].index(i)][1]}'")
    if h2 and not re.match(r"quick-reference card", h2[-1][1].lower()):
        E("Quick-Reference Card must be the last H2.")

    # ---- section slices
    h2_pos = [i for i, _ in h2] + [len(lines)]

    def section(pattern):
        for n, (i, t) in enumerate(h2):
            if re.match(pattern, t.lower()):
                return lines[i + 1:h2_pos[n + 1]], i
        return None, None

    def subsections(sec_lines, base, level=3):
        """Split a section into (title, text_lines) by ### headings."""
        subs, cur = [], None
        for off, l in enumerate(sec_lines):
            abs_i = base + 1 + off
            hh = [h for h in headings if h[0] == abs_i and h[1] == level]
            if hh:
                cur = [hh[0][2], []]
                subs.append(cur)
            elif cur is not None:
                cur[1].append(l)
        return subs

    # ---- concept internals
    for n, (i, t) in enumerate(h2):
        if re.match(r"concept \d+\b", t.lower()):
            sec = lines[i + 1:h2_pos[n + 1]]
            subs = subsections(sec, i)
            titles = [s[0].lower() for s in subs]
            for need in ["why", "what", "how", "knowledge check"]:
                if not any(x.startswith(need) for x in titles):
                    E(f"'{t}' is missing a '### {need.title()}' subsection.")
            order = [next((k for k, x in enumerate(titles) if x.startswith(w)), -1)
                     for w in ["why", "what", "how", "knowledge check"]]
            if -1 not in order and order != sorted(order):
                E(f"'{t}' subsections must be in order: Why, What, How, Knowledge Check.")
            n_code = sum(1 for f in fences if i < f["start"] < h2_pos[n + 1]
                         and f["lang"] in CODE_LANGS)
            if n_code < 2:
                W(f"'{t}' has fewer than 2 code examples (need at least two per concept).")

    # ---- guided practice
    sec, base = section(r"guided practice")
    if sec is not None:
        subs = subsections(sec, base)
        exs = [s for s in subs if re.match(r"exercise \d", s[0].lower())]
        if len(exs) != 3:
            E(f"Guided Practice needs exactly 3 exercises (found {len(exs)}).")
        for title, body in exs:
            blob = "\n".join(body)
            for lab in EX_LABELS:
                if not re.search(r"\*\*" + re.escape(lab) + r"[:\*]", blob):
                    E(f"'{title}' is missing the label **{lab}**.")
            if "warm-up" not in blob.lower():
                W(f"'{title}' has no Warm-up.")

    # ---- code challenges
    sec, base = section(r"code challenges")
    if sec is not None:
        blob = "\n".join(sec)
        if not re.search(r"human browser", blob, re.I):
            E("Code Challenges must include a 'Human Browser' activity.")
        numbered = len(re.findall(r"^\s*\d+\.\s+\S", blob, re.M))
        if numbered < 6:
            W(f"Code Challenges has {numbered} numbered items; 6 expected.")

    # ---- mini project
    sec, base = section(r"mini project")
    if sec is not None:
        subs = subsections(sec, base)
        need = [("stage 1", "setup"), ("stage 2", "core logic"),
                ("stage 3", "enhancements"), ("stage 4", "final output")]
        for pre, word in need:
            match = [s for s in subs if s[0].lower().startswith(pre)]
            if not match:
                E(f"Mini Project is missing '### {pre.title()}: {word.title()}'.")
                continue
            if word not in match[0][0].lower():
                W(f"'{match[0][0]}' should be titled '{pre.title()}: {word.title()}'.")
            if "milestone output" not in "\n".join(match[0][1]).lower():
                E(f"'{match[0][0]}' is missing a **Milestone output**.")
        blob = "\n".join(sec).lower()
        if "optional extensions" not in blob:
            W("Mini Project has no 'Optional extensions'.")

    # ---- common mistakes
    sec, base = section(r"common mistakes")
    if sec is not None:
        blob = "\n".join(sec)
        n_wrong = blob.count(WRONG)
        n_right = blob.count("\u2705")
        if n_wrong < 5:
            W(f"Common Mistakes has {n_wrong} wrong-code markers; at least 5 expected.")
        if n_right < n_wrong:
            E("Every wrong example needs a corrected example.")

    # ---- reflection / checklist
    sec, _ = section(r"reflection questions")
    if sec is not None and len(re.findall(r"^\s*(?:\d+\.|[-*])\s+\S", "\n".join(sec), re.M)) < 4:
        W("Reflection Questions should contain at least 4 questions.")
    sec, _ = section(r"completion checklist")
    if sec is not None and len(re.findall(r"^\s*-\s\[ \]\s+\S", "\n".join(sec), re.M)) < 6:
        E("Completion Checklist needs at least 6 '- [ ]' items.")

    # ---- code blocks
    for f in fences:
        if f["lang"] == "" :
            W(f"Line {f['start']+1}: code fence has no language tag.")
            continue
        if f["lang"] not in CODE_LANGS:
            continue
        j = f["start"] - 1
        while j >= 0 and not lines[j].strip():
            j -= 1
        deliberately_wrong = j >= 0 and WRONG in lines[j]
        if deliberately_wrong:
            continue
        # expected output must follow
        k, found = f["end"] + 1, False
        seen = 0
        while k < len(lines) and seen < 3:
            if lines[k].strip():
                seen += 1
                if "expected output in browser" in lines[k].lower():
                    found = True
                    break
            k += 1
        if not found:
            E(f"Line {f['start']+1}: {f['lang']} block is not followed by 'Expected output in browser'.")
        if f["lang"] == "html":
            chk = TagChecker()
            try:
                chk.feed(f["code"])
                for prob in chk.result():
                    E(f"Line {f['start']+1}: HTML problem - {prob}")
            except Exception as exc:  # parser trouble is a warning, not fatal
                W(f"Line {f['start']+1}: could not parse HTML ({exc}).")
            for im in re.findall(r"<img\b[^>]*>", f["code"], re.I):
                if not re.search(r"\balt\s*=", im, re.I):
                    E(f"Line {f['start']+1}: <img> without alt text.")
            if re.search(r"<html\b", f["code"], re.I) and not re.search(r"<html[^>]*\blang=", f["code"], re.I):
                W(f"Line {f['start']+1}: full page without lang attribute on <html>.")
            if re.search(r"(?:src|href)\s*=\s*\"https?://", f["code"], re.I) and "<a " not in f["code"].lower():
                W(f"Line {f['start']+1}: external resource found; examples should work offline.")

    # ---- end-of-file comments
    if "<!-- SOURCE COVERAGE MAP" not in text:
        E("Missing <!-- SOURCE COVERAGE MAP ... --> comment.")
    if "<!-- CURRICULUM LEDGER" not in text:
        E("Missing <!-- CURRICULUM LEDGER ... --> comment.")

    # ---- style
    prose = re.sub(r"`{3}.*?`{3}", " ", "\n".join(lines[body_start:]), flags=re.S)
    prose = re.sub(r"<!--.*?-->", " ", prose, flags=re.S)
    words = re.findall(r"[A-Za-z\u20a6'-]+", prose)
    if len(words) < 3000:
        W(f"Only about {len(words)} words of prose; lessons usually run 4,500-8,000.")
    if len(words) > 10000:
        W(f"About {len(words)} words of prose; consider splitting this lesson.")
    lower = prose.lower()
    hits = sum(lower.count(w) for w in CONTEXT_WORDS)
    if hits < 8:
        W(f"Only {hits} Nigerian-context references found; weave more through the examples.")
    for banned in ["simply", "just ", "obviously", "of course", "trivial", "as you know"]:
        c = lower.count(banned)
        if c:
            W(f"Banned word/phrase '{banned.strip()}' used {c} time(s).")
    if re.search(r"\b(color|center|organize|behavior)\b", lower):
        W("American spelling detected (colour, centre, organise, behaviour expected) outside code.")

    return errors, warnings


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    total_err = 0
    for path in argv[1:]:
        errs, warns = lint(path)
        print(f"\n=== {path} ===")
        for e in errs:
            print(f"  ERROR   {e}")
        for w in warns:
            print(f"  WARNING {w}")
        print(f"  -> {len(errs)} error(s), {len(warns)} warning(s)")
        total_err += len(errs)
    return 1 if total_err else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
