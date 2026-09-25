// Deployment registry data — edit this to add/remove/reorder cards.
// Loaded as a plain script (not fetch) so the site works even opened directly as a local file.
var PROJECTS = [
  {
    "id": "AGENT.01",
    "status": "active",
    "name": "ClassPulse National — Build Tutor",
    "role": "AI programming tutor",
    "summary": "Walks a student through building a multi-school classroom feedback platform for Nigerian schools, one guided step at a time, from a shared architecture and curriculum spec.",
    "stack": [
      "HTML/CSS/JS",
      "Supabase",
      "Chart.js",
      "GitHub Pages"
    ],
    "href": "classpulse-national/index.html",
    "external": true
  },
  {
    "id": "AGENT.02",
    "status": "active",
    "name": "Social Content Engine",
    "role": "Daily content generator",
    "summary": "Researches the day's live themes and produces platform-ready social posts for two organisations, compiled into a formatted document for each, on command.",
    "stack": [
      "Live research",
      "DOCX output",
      "Multi-brand"
    ],
    "href": "social-content-engine/index.html",
    "external": true
  },
  {
    "id": "AGENT.03",
    "status": "active",
    "name": "GitHub Lesson Writer",
    "role": "Curriculum author",
    "summary": "Turns a set of source links into a single, beginner-friendly Markdown lesson, complete with exercises, a mini project and a fixed front-matter format.",
    "stack": [
      "Markdown",
      "Jekyll front matter",
      "W3Schools sourcing"
    ],
    "href": "github-lesson-writer/index.html",
    "external": true
  },
  {
    "id": "AGENT.04",
    "status": "active",
    "name": "GitHub Portfolio Rebuild",
    "role": "Repo modernization workflow",
    "summary": "A recurring rebuild process across two GitHub profiles — a distinct visual identity per repo, a modern README, and one strict linking architecture kept consistent everywhere.",
    "stack": [
      "Repo audits",
      "README system",
      "Link architecture"
    ],
    "href": "github-portfolio-rebuild/index.html",
    "external": true
  },
  {
    "id": "AGENT.05",
    "status": "active",
    "name": "Nigerian Christian Apologist",
    "role": "Article writing assistant",
    "summary": "Builds sermon notes, transcripts and rough ideas into full, publish-ready theological articles, researched, Scripture-cited and referenced in APA format.",
    "stack": [
      "Markdown output",
      "APA references",
      "Theological research"
    ],
    "href": "nigerian-christian-apologist/index.html",
    "external": true
  },
  {
    "id": "AGENT.06",
    "status": "active",
    "name": "Substack Post Formatter",
    "role": "Publication production assistant",
    "summary": "Takes a raw writeup and returns a complete, publish-ready Substack post package, preserving the author's voice exactly, word for word.",
    "stack": [
      "Substack formatting",
      "Voice preservation"
    ],
    "href": "substack-post-formatter/index.html",
    "external": true
  },
  {
    "id": "AGENT.07",
    "status": "active",
    "name": "Techbase Code Coach",
    "role": "Beginner coding tutor",
    "summary": "Fetches a lesson, breaks it into numbered phases, and coaches STEM Academy students as young as eight through it, one small win at a time.",
    "stack": [
      "Lesson fetch",
      "Phased teaching",
      "Ages 8+"
    ],
    "href": "techbase-code-coach/index.html",
    "external": true
  },
  {
    "id": "TOOL.01",
    "status": "tool",
    "name": "Educator AI Toolkit — Lesson Notes & Exams",
    "role": "Live tool — free for teachers, one unified Project",
    "summary": "One Claude Project now does both jobs: say a Week number for a full lesson note booklet, or a Term alone for a 70-mark exam with marking guide, or a self-study revision file. Ships with a per-subject Scheme of Work picker and a guided setup wizard.",
    "stack": [
      "Live site",
      "Unified Project",
      "Scheme picker",
      "Setup wizard"
    ],
    "href": "https://babatundeawo.github.io/educator-ai-toolkit/",
    "external": true
  }
];
