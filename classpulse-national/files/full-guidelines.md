# ClassPulse National — Full Project Guidelines
### A Multi-School Classroom Feedback Platform for Nigeria
**Student Developer:** Ivan | **Supervisor:** Mr. Babatunde | **AI Tutor:** Claude

---

## PART 0 — HOW THIS PROJECT WORKS

### Important note on naming
This is a **brand new, separate project** from "ClassPulse Lite" (the offline single-classroom app Ivan already finished). That app stays exactly as it is — untouched, complete, and still his. This project is called **ClassPulse National** and starts completely fresh, with its own files and its own class plan.

### The Class Command System
You never re-upload files or edit anything between sessions. Simply type the next class number in the chat and Claude begins teaching that class immediately.

| Command | What Claude does |
|---|---|
| `class 1` | Teaches Class 1 from start |
| `class 2` | Teaches Class 2 from start |
| `class [N]` | Teaches Class N from start |
| `class notes: [your message]` | Claude reads your note and factors it in before continuing |

Claude always teaches one step at a time and waits for Ivan to confirm it is working before moving to the next step. There is no status file to edit. Progress is tracked purely by the class number typed next.

### Who is in this project
- **Ivan** — the student developer. Young, learning web development, building a real platform. All explanations must be child-friendly and encouraging.
- **Mr. Babatunde** — the supervisor and relay. He shows Ivan what Claude produces and relays Ivan's responses back.
- **Claude** — the AI programming tutor. Speaks directly to Ivan, explains everything clearly, celebrates every win.

---

## PART 1 — WHAT CLASSPULSE NATIONAL IS

### The Core Idea
ClassPulse National is the same simple feedback idea as ClassPulse Lite — students tap 🟢🟡🔴 to say how well they understood a lesson — but built to work for **any school in Nigeria**, with real accounts, real roles, and data safely stored online so nothing is lost and anyone can log in from any device.

### The Big Structural Idea: Class Offerings
The most important concept in this whole project is the **Class Offering**. A Class Offering is one specific combination of:

> **Class/Arm + Subject**

For example: *"Primary 4A — Mathematics"* is one Class Offering. *"Primary 4B — Mathematics"* is a different Class Offering, even though it's the same subject. Class Offerings are now **created automatically** the moment a Class/Arm is set up, because every standard subject for that class level is generated for it immediately (see Part 2 — Auto-Generated Curriculum). A teacher later "claims" one or more of these offerings to teach.

**The golden rule:** one Class Offering (one Class/Arm + Subject pair) can only ever have **one teacher**. If two teachers both teach Math, they are teaching it to two different classes/arms — never the exact same one.

### The Three User Roles & The Three Kinds of Codes

This is the most important part of the whole system to get right, so read it carefully.

| Role | How they enter | What they end up with |
|---|---|---|
| **School Head** | Registers the school from scratch | **School Head Portal Code** — their own personal, permanent code that always takes them straight to their school's admin dashboard |
| **Teacher** | Enters the **Teacher School-Entry Code** to reach the right school, then registers themselves and waits for School Head approval | **Teacher Personal Code** — issued only after approval, always takes them straight to their own subject dashboard |
| **Student** | Enters the **Student School-Entry Code** to reach the right school, then registers themselves and waits for their Teacher's approval | **Student Personal Code** — issued only after approval, always takes them straight to their own subject feedback screen |

So there are **three codes per school**, each with a clear, separate job:

1. **School Head Portal Code** — generated once, when the school is registered. Belongs only to the School Head. Logging in with it always opens the School Head's admin dashboard. Nobody else should ever have this code.
2. **Teacher School-Entry Code** — generated once, when the school is registered. This is a "gate pass," not a personal login. Any teacher joining this school types this code on the landing page to reach this specific school's teacher registration form. Many different teachers can use the same entry code to start registering — it just proves "I belong to this school," nothing more.
3. **Student School-Entry Code** — same idea as the Teacher School-Entry Code, but for students. One shared gate pass per school that lets students reach the right school's student registration form.

**Personal Codes are different and far more important.** Every individual Teacher and every individual Student, once approved, receives their own **Personal Code** — unique to them and nobody else. This is the code they keep and use every day afterwards to go straight to their own dashboard. Personal Codes are deliberately long and randomly generated (not simple words) specifically so they cannot be guessed — see Part 2 for exactly how.

### Why an Approval Step?
Because the School-Entry Codes are shared "gate passes," it would be too easy for someone to register as "a teacher" or "a student" who doesn't actually belong at that school, just by knowing the entry code. To prevent this:

- When a **Teacher** registers using the Teacher School-Entry Code, their registration goes into a **Pending list** that only the **School Head** can see. The School Head reviews the name and either **Approves** (which generates and reveals the Teacher's Personal Code) or **Rejects**.
- When a **Student** registers using the Student School-Entry Code and picks their Class/Arm and subject(s), their registration goes into a **Pending list** that only the **subject's Teacher** can see. The Teacher reviews the name and either **Approves** (generating the Student's Personal Code) or **Rejects**.
- While waiting, the new Teacher or Student sees a **temporary status code** — this only lets them check "Am I approved yet?" It does **not** open any dashboard. The moment they're approved, their real Personal Code is generated and shown to them.

### What an Approver Sees
The pending list (for both School Head approving teachers, and Teacher approving students) shows:
- Full name
- Class/Arm (for students) and the Subject(s) selected
- The date and time they registered
- A simple **"🚩 Flag as unfamiliar"** option, in case the name doesn't match anyone the approver recognises — flagged entries are highlighted so the approver remembers to double check before approving

### The Registration Journey, Step by Step

**School Head:**
1. Landing page → choose School Head
2. Register School — name, State (dropdown), LGA (dropdown filtered by State), Address
3. School Type — checkboxes: Creche / Nursery / Primary / Secondary
4. Set Up Classes/Arms — e.g. "Primary 4A", "Primary 4B", "JSS 2B" — the moment each one is added, the system **automatically creates every standard subject for that class level** as unclaimed Class Offerings (School Head or Teachers can still add extra custom subjects later)
5. Done — School Head receives and sees, clearly displayed: their own **School Head Portal Code**, the **Teacher School-Entry Code**, and the **Student School-Entry Code** — ready to share the right one with the right people

**Teacher:**
1. Landing page → choose Teacher
2. Enter the **Teacher School-Entry Code**
3. Register with their full name
4. They see a **temporary status code** and a "waiting for approval" message
5. Once the School Head approves them, they receive their permanent **Teacher Personal Code**
6. They log in with that code and see a list of unclaimed Class Offerings at their school, and pick the one(s) they teach
7. From then on, that one Teacher Personal Code always takes them straight to their dashboard

**Student:**
1. Landing page → choose Student
2. Enter the **Student School-Entry Code**
3. Register with their full name and pick their **Class/Arm**
4. Pick which subject(s) (Class Offerings) they're enrolling in for that class
5. Each chosen subject's **Teacher** must approve them before they get their permanent code
6. They see a **temporary status code** while waiting
7. Once approved (per subject — see note below), they receive their permanent **Student Personal Code**
8. From then on, that one code always takes them to their dashboard, where they pick which of their approved subjects to give feedback for

*Note: if a student enrolls in multiple subjects with different teachers, each teacher approves that student only for their own subject. The student's one Personal Code becomes fully active once at least one subject is approved, and new subjects unlock as their respective teachers approve them.*

### The Scoring Model (unchanged from ClassPulse Lite)

| Colour | Points | What it means |
|---|---|---|
| 🟢 Green | 2 pts | Exceeding Target — 80% to 100% |
| 🟡 Yellow | 1 pt | Meeting Target — 60% to 79% |
| 🔴 Red | 0 pts | Needs Improvement — below 60% |

```
Class Understanding Score = (Total points earned ÷ Maximum possible points) × 100
```

### Privacy Rule: Teachers Never See Individual Student Votes
This is enforced as a hard rule throughout the build, not just a design choice: **a Teacher's dashboard queries only ever return aggregated numbers** (counts and scores), never a row that links a specific colour to a specific student's name. The database itself is structured so that query is never written — not just hidden in the interface. Only the **School Head** can see teacher-level performance summaries; only **students** see their own individual feedback history.

---

## PART 2 — TECHNOLOGY CHOICES (AND WHY)

| Layer | Technology | Why this one |
|---|---|---|
| Frontend | HTML + CSS + JavaScript | Runs in any browser, no install, teaches real fundamentals |
| Charts | Chart.js (via CDN) | Free, professional charts with one `<script>` tag — multiple chart types so results are always easy to read |
| Fonts | Google Fonts (Nunito) | Free, round, friendly, easy to read for children |
| Database + Auth + API | **Supabase** (free tier) | A real hosted PostgreSQL database with an auto-generated API. Everyone's data lives safely online and can be reached from any device, any time. |
| Version control | GitHub Desktop + GitHub | Visual app, no terminal commands, every change tracked |
| Hosting — frontend | GitHub Pages | Free static hosting, connects directly to the GitHub repo |
| Hosting — backend | Supabase (already hosted) | No server for Ivan to manage or pay for |

### Auto-Generated Nigerian Curriculum (2025 NERDC Reform)
Nigeria's curriculum was officially revised by NERDC in September 2025. ClassPulse National uses this current structure as its default subject set, auto-applied the moment a Class/Arm is created. The School Head or a Teacher can still add extra custom subjects on top of this list at any time — this is a helpful starting point, not a locked restriction.

**Primary 1–3 (core subjects, auto-generated):**
English Studies, Mathematics, Nigerian Language (one of Hausa/Igbo/Yoruba), Basic Science, Physical & Health Education, Christian Religious Studies *or* Islamic Studies, Nigerian History, Social and Citizenship Studies

**Primary 4–6 (core subjects, auto-generated):**
English Studies, Mathematics, Nigerian Language, Basic Science and Technology, Physical & Health Education, Basic Digital Literacy, Christian Religious Studies *or* Islamic Studies, Nigerian History, Social and Citizenship Studies, Cultural & Creative Arts, Pre-Vocational Studies

**JSS 1–3 (core subjects, auto-generated):**
English Studies, Mathematics, Nigerian Language, Integrated/Intermediate Science, Physical & Health Education, Digital Technologies, Christian Religious Studies *or* Islamic Studies, Nigerian History, Social and Citizenship Studies, Cultural & Creative Arts, Business Studies, one Trade Subject (e.g. Solar PV Installation, Fashion Design, Livestock Farming, Beauty & Cosmetology, Computer Hardware & GSM Repairs, Horticulture & Crop Production)

**SS 1–3 (core subjects, auto-generated):**
English Language, Mathematics, Civic/Citizenship and Heritage Studies, plus stream-based subjects depending on a school's offering (Sciences: Physics/Chemistry/Biology; Humanities/Arts; Business/Commercial), and one Trade subject

*(This is reference data Claude builds directly into the project's code — Ivan does not need to type or memorise this list himself.)*

### Why not just save to a file in GitHub?
GitHub Pages can only serve files — it has no way to run code that writes new data when someone registers. Supabase solves this completely, for free, with built-in safeguards (Row Level Security) so one school can never see another school's data, and so teacher queries are structurally unable to return individual student votes.

### Project Folder Structure
```
classpulse-national/
├── index.html             ← The whole app (all screens, one page)
├── style.css               ← Colours, fonts, layout, child-friendly design
├── app.js                   ← Main JavaScript logic
├── supabase.js             ← Supabase connection (one file, reused everywhere)
├── nigeria-data.js         ← States + LGAs + curriculum subjects by class level
└── README.md               ← What this project is
```

### Database Schema (created in Supabase)

```
schools
  id, name, state, lga, address,
  school_types (text array),
  head_portal_code (unique text),
  teacher_entry_code (unique text),
  student_entry_code (unique text),
  created_at

classes_arms
  id, school_id, name, class_level (e.g. "Primary 4", "JSS 2"), created_at

subjects
  id, school_id, name, created_at

class_offerings
  id, school_id, class_arm_id, subject_id,
  teacher_id (nullable — null means "unclaimed"), created_at

teachers
  id, school_id, full_name, status (pending/approved/rejected),
  personal_code (unique text, null until approved),
  flagged (boolean, default false), created_at

students
  id, school_id, class_arm_id, full_name,
  personal_code (unique text, null until at least one subject approved),
  flagged (boolean, default false), created_at

student_enrollment_requests
  id, student_id, class_offering_id,
  status (pending/approved/rejected), created_at
  -- one row per subject a student wants to join;
  -- each is approved separately by that subject's teacher

feedback_sessions
  id, class_offering_id, date, is_open (boolean), created_at

feedback_entries
  id, session_id, student_id, colour, points, submitted_at
```

### Why this shape works
- **Three codes live directly on the `schools` row** — `head_portal_code`, `teacher_entry_code`, `student_entry_code` — so there's exactly one of each per school, easy to look up and easy to reason about.
- **`personal_code` starts as `null`** for both teachers and students — this is what enforces "no dashboard access until approved." A null personal code simply has nothing to log in with yet.
- **`student_enrollment_requests` separates "wanting to join a subject" from "being approved for it"** — this is what allows one teacher's approval to unlock just their subject, without needing every teacher to agree at once.
- **`feedback_entries` is the only table holding a colour next to a student's identity** — and Teacher-facing queries are written so they `GROUP BY` colour and never `SELECT` a bare student name alongside a colour. This is the privacy rule enforced at the data-access level, not just hidden in the UI.

---

## PART 3 — DESIGN PRINCIPLES (FOR ALL FRONTEND CLASSES)

Because ClassPulse National is used by school children across Nigeria — many on shared or basic devices — every screen must follow these rules.

### Must-have design rules
1. **Big, tappable buttons** — minimum height of 56px on all interactive elements.
2. **High colour contrast** — text must be clearly readable against its background.
3. **Friendly font** — Nunito from Google Fonts throughout.
4. **Clear labels** — every button says exactly what it does. No icon without a text label.
5. **Colour + text together** — never rely on colour alone. Always pair 🟢 with "I understand" and 🔴 with "I need help."
6. **Encouraging language** — "Great job! Your school is registered! 🎉" not just "Success."
7. **Simple navigation** — every screen has a clear title and an obvious way back.
8. **Mobile first, no overflow** — every layout must be tested at 375px width and up. Long text wraps, tables scroll horizontally inside their own container (never the whole page), and nothing is ever cut off or hidden behind another element.
9. **No clutter** — School Heads see School Head things, Teachers see Teacher things, Students see Student things.
10. **Codes are always visible and copyable** — after any step that generates a code, show it large, clearly, with a "Copy" button so it's never lost.
11. **Charts must always be self-explanatory** — every chart has a clear title, axis labels where relevant, a legend if more than one colour is shown, and is never the only way to understand a result (a plain-language summary sentence sits above or below every chart, e.g. "Most students understood this topic well 🌟").

### Colour palette
```css
--green:       #22c55e;
--yellow:      #facc15;
--red:         #ef4444;
--navy:        #1e3a5f;
--card:        #ffffff;
--text-dark:   #1e293b;
--text-light:  #ffffff;
--accent:      #38bdf8;
--success:     #bbf7d0;
--warning:     #fef9c3;
--danger:      #fee2e2;
```

---

## PART 4 — THE COMPLETE CLASS-BY-CLASS BUILD PLAN

---

### CLASS 1 — GitHub Setup & Project Folder

**Steps:**
1. Open **GitHub Desktop** → **File → New Repository**
   - Name: `classpulse-national`
   - Tick "Initialize this repository with a README"
2. Click **Create Repository**, then **Publish repository** (Public)
3. Create five empty files: `index.html`, `style.css`, `app.js`, `supabase.js`, `nigeria-data.js`
4. Commit: `First commit - project setup`. **Commit to main** → **Push origin**

**Confirm before moving on:** Ivan can see the new repository and all five files on github.com.

---

### CLASS 2 — Supabase Project & Database Tables

**The big idea to explain to Ivan:**
We're creating ten labelled drawers in our online filing cabinet. Three special columns — `head_portal_code`, `teacher_entry_code`, `student_entry_code` — live right on the school's own drawer, since every school has exactly one of each.

**Steps:**
1. Create a free Supabase project named `classpulse-national`
2. In **Table Editor**, create each table from the Part 2 schema: `schools`, `classes_arms`, `subjects`, `class_offerings`, `teachers`, `students`, `student_enrollment_requests`, `feedback_sessions`, `feedback_entries`
3. Mark all code/passkey columns **UNIQUE**; mark `class_offerings.teacher_id`, `teachers.personal_code`, and `students.personal_code` as **nullable**
4. Copy the Project URL and `anon` key from **Project Settings → API**
5. Commit and push: `Add Supabase tables`

**Confirm before moving on:** All nine tables exist with the correct unique/nullable settings.

---

### CLASS 3 — Supabase Connection & Nigeria Reference Data

**Steps:**

**In `supabase.js`:**
```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const SUPABASE_URL = 'PASTE_YOUR_PROJECT_URL_HERE'
const SUPABASE_KEY = 'PASTE_YOUR_ANON_KEY_HERE'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

**In `nigeria-data.js`:**
```javascript
// All 36 states + FCT, each with their Local Government Areas
export const statesAndLGAs = {
  "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Eti-Osa", "Ikeja", "Surulere"]
  // Claude provides the complete list for all 36 states + FCT in this step
}

// The auto-generated curriculum, grouped by class level.
// Claude fills this in fully based on the 2025 NERDC reform (see Part 2).
export const curriculumByLevel = {
  "Primary 1-3": ["English Studies", "Mathematics", "Nigerian Language", "Basic Science", "Physical & Health Education", "Religious Studies", "Nigerian History", "Social and Citizenship Studies"],
  "Primary 4-6": ["English Studies", "Mathematics", "Nigerian Language", "Basic Science and Technology", "Physical & Health Education", "Basic Digital Literacy", "Religious Studies", "Nigerian History", "Social and Citizenship Studies", "Cultural & Creative Arts", "Pre-Vocational Studies"],
  "JSS 1-3": ["English Studies", "Mathematics", "Nigerian Language", "Integrated Science", "Physical & Health Education", "Digital Technologies", "Religious Studies", "Nigerian History", "Social and Citizenship Studies", "Cultural & Creative Arts", "Business Studies", "Trade Subject"],
  "SS 1-3": ["English Language", "Mathematics", "Citizenship and Heritage Studies", "Trade Subject"]
}

// Helper: works out which curriculum group a class name belongs to
export function getCurriculumLevel(classArmName) {
  if (classArmName.match(/Primary [1-3]/i)) return "Primary 1-3"
  if (classArmName.match(/Primary [4-6]/i)) return "Primary 4-6"
  if (classArmName.match(/JSS/i)) return "JSS 1-3"
  if (classArmName.match(/SS[123]/i)) return "SS 1-3"
  return null // unrecognised name — School Head will add subjects manually
}
```

**In `index.html`** — build the skeleton with all hidden screens (landing, school registration steps, school-done, teacher entry/register/pending/claim/dashboard, student entry/register/pending/enroll/dashboard, approval screens)

**Confirm before moving on:** Page opens, landing screen shows, no console errors.

---

### CLASS 4 — Landing Page: Choose Your Role

**Steps:** Three large role cards (School Head / Teacher / Student), each navigating to the correct first screen of that journey.

**Confirm before moving on:** All three cards work correctly.

---

### CLASS 5 — School Registration: Name, State/LGA, Address

**Steps:** Same dependent-dropdown pattern as before — School Name, State dropdown, LGA dropdown (filtered by State), Address.

**Confirm before moving on:** Choosing a State correctly fills the LGA dropdown.

---

### CLASS 6 — School Type Selection (Checkboxes)

**Steps:** Four checkbox cards (Creche/Nursery/Primary/Secondary), stored in temporary `newSchoolData`, requiring at least one.

**Confirm before moving on:** Multiple selections work; at least one is required.

---

### CLASS 7 — Setting Up Classes & Arms (with Auto-Generated Subjects)

**What Ivan learns:** Connecting a new class/arm directly to its curriculum group

**The big idea to explain to Ivan:**
The moment Ivan adds "Primary 4A," the app should immediately know that's a Primary 4-6 level class, and prepare to auto-create all 11 standard subjects for it — without anyone needing to tick them by hand.

**Steps:**

**In `app.js`** — add:
```javascript
document.getElementById('btn-add-class-arm').addEventListener('click', () => {
  const input = document.getElementById('class-arm-input')
  const name = input.value.trim()
  if (!name) return showWarning('Type a class name first, e.g. "Primary 4A"')

  const level = getCurriculumLevel(name)
  if (!level) {
    showWarning('We don\'t recognise that class name — you can still add it, but you\'ll need to add subjects manually later.')
  }

  newSchoolData.classesArms.push({ name, level })
  renderClassArmsList()
  input.value = ''
  input.focus()
})
```

**Confirm before moving on:** Adding "Primary 4A" correctly detects "Primary 4-6"; adding "JSS 2B" correctly detects "JSS 1-3."

---

### CLASS 8 — Generating the Three School Codes

**What Ivan learns:** Generating multiple distinct codes for one record, different code "styles" for different purposes

**The big idea to explain to Ivan:**
Entry codes are meant to be shared, so they can be a friendly word+number like before. But Personal Codes need to be much harder to guess, since they open one specific person's private dashboard — so we make those longer and more random.

**Steps:**

**In `app.js`** — add:
```javascript
const passkeyWords = ['SUNRISE', 'RIVER', 'EAGLE', 'MAPLE', 'COMET', 'GINGER', 'HARBOR', 'METEOR', 'PEBBLE', 'SPARK', 'WILLOW', 'ZEBRA']

// Entry codes & the School Head's own code: word + 2 digits, e.g. "SUNRISE-42"
function buildEntryCodeCandidate() {
  const word = passkeyWords[Math.floor(Math.random() * passkeyWords.length)]
  const number = Math.floor(Math.random() * 90) + 10
  return word + '-' + number
}

// Personal codes: two random words + a 4-digit number, much harder to guess
// e.g. "EAGLE-WILLOW-8841"
function buildPersonalCodeCandidate() {
  const word1 = passkeyWords[Math.floor(Math.random() * passkeyWords.length)]
  const word2 = passkeyWords[Math.floor(Math.random() * passkeyWords.length)]
  const number = Math.floor(Math.random() * 9000) + 1000
  return word1 + '-' + word2 + '-' + number
}

async function generateUniqueCode(tableName, columnName, isPersonal) {
  let candidate = isPersonal ? buildPersonalCodeCandidate() : buildEntryCodeCandidate()
  let exists = true

  while (exists) {
    const { data } = await supabase.from(tableName).select(columnName).eq(columnName, candidate)
    if (!data || data.length === 0) {
      exists = false
    } else {
      candidate = isPersonal ? buildPersonalCodeCandidate() : buildEntryCodeCandidate()
    }
  }
  return candidate
}
```

**Confirm before moving on:** Generating a personal code in the console produces something like `EAGLE-WILLOW-8841` — visibly longer and harder to guess than an entry code.

---

### CLASS 9 — Saving the School, Classes/Arms & Auto-Generated Class Offerings

**What Ivan learns:** Multi-table inserts, turning curriculum data into real unclaimed offerings

**Steps:**

**In `app.js`** — add:
```javascript
async function finishSchoolRegistration() {

  const headPortalCode    = await generateUniqueCode('schools', 'head_portal_code', false)
  const teacherEntryCode  = await generateUniqueCode('schools', 'teacher_entry_code', false)
  const studentEntryCode  = await generateUniqueCode('schools', 'student_entry_code', false)

  const { data: school, error } = await supabase.from('schools').insert({
    name: newSchoolData.name,
    state: newSchoolData.state,
    lga: newSchoolData.lga,
    address: newSchoolData.address,
    school_types: newSchoolData.schoolTypes,
    head_portal_code: headPortalCode,
    teacher_entry_code: teacherEntryCode,
    student_entry_code: studentEntryCode
  }).select().single()

  if (error) return showError('Could not register school. Please try again.')

  const subjectIdMap = {}

  for (const classArm of newSchoolData.classesArms) {
    const { data: savedClassArm } = await supabase.from('classes_arms').insert({
      school_id: school.id,
      name: classArm.name,
      class_level: classArm.level
    }).select().single()

    // Auto-generate every subject for this class's curriculum level
    const subjectNames = classArm.level ? curriculumByLevel[classArm.level] : []

    for (const subjectName of subjectNames) {
      let subjectId = subjectIdMap[subjectName]
      if (!subjectId) {
        const { data: subject } = await supabase.from('subjects').insert({
          school_id: school.id,
          name: subjectName
        }).select().single()
        subjectId = subject.id
        subjectIdMap[subjectName] = subjectId
      }

      // Create the unclaimed Class Offering
      await supabase.from('class_offerings').insert({
        school_id: school.id,
        class_arm_id: savedClassArm.id,
        subject_id: subjectId,
        teacher_id: null
      })
    }
  }

  showRegistrationComplete(headPortalCode, teacherEntryCode, studentEntryCode)
}
```

**Confirm before moving on:** Registering a school with "Primary 4A" and "JSS 2B" results in 11 unclaimed offerings for Primary 4A and 12 for JSS 2B, visible in Supabase's Table Editor.

---

### CLASS 10 — Registration Complete Screen (Showing All Three Codes)

**Steps:**

**In `index.html`** — build a celebration screen with three clearly separated cards:
- "Your Portal Code (School Head only — keep this private!)" 
- "Teacher Entry Code (share with your teachers)"
- "Student Entry Code (share with your students)"

Each with large monospace text and a Copy button, and a one-line explanation of who that code is for.

**Confirm before moving on:** All three codes display clearly with working Copy buttons, and the explanatory text makes it obvious which code is for whom.

---

### CLASS 11 — Teacher Entry & Self-Registration

**Steps:**

**In `app.js`** — add:
```javascript
async function enterTeacherCode(entryCode) {
  const { data: school, error } = await supabase
    .from('schools')
    .select('id, name')
    .eq('teacher_entry_code', entryCode.toUpperCase().trim())
    .single()

  if (error || !school) return showError('That code wasn\'t found. Check with your School Head!')

  sessionStorage.setItem('pendingSchoolId', school.id)
  showScreen('screen-teacher-register')
}

async function registerTeacher(fullName) {
  const schoolId = sessionStorage.getItem('pendingSchoolId')

  const { data: teacher } = await supabase.from('teachers').insert({
    school_id: schoolId,
    full_name: fullName,
    status: 'pending'
  }).select().single()

  sessionStorage.setItem('teacherId', teacher.id)
  showPendingScreen('teacher', teacher.id)
}
```

**Confirm before moving on:** Entering a valid Teacher Entry Code reaches the registration form; submitting a name creates a `pending` teacher row.

---

### CLASS 12 — Teacher Pending/Status Screen

**Steps:**

**In `index.html`** — build a simple "Waiting for Approval ⏳" screen showing a temporary status reference and a "Check Status" button

**In `app.js`** — add:
```javascript
async function checkTeacherStatus(teacherId) {
  const { data: teacher } = await supabase
    .from('teachers')
    .select('status, personal_code')
    .eq('id', teacherId)
    .single()

  if (teacher.status === 'approved') {
    showTeacherPersonalCode(teacher.personal_code)
  } else if (teacher.status === 'rejected') {
    showError('Your registration was not approved. Please check with your School Head.')
  } else {
    showInfo('Still waiting for approval — check back soon! ⏳')
  }
}
```

**Confirm before moving on:** Before approval, status correctly shows "waiting"; the teacher has no usable personal code yet.

---

### CLASS 13 — School Head: Approving Teachers

**What Ivan learns:** Building an approval queue, the "flag as unfamiliar" safety feature

**Steps:**

**In `index.html`** — build a "Pending Teachers" list on the School Head dashboard: name, registration date/time, a 🚩 flag toggle, Approve and Reject buttons

**In `app.js`** — add:
```javascript
async function loadPendingTeachers(schoolId) {
  const { data: pending } = await supabase
    .from('teachers')
    .select('*')
    .eq('school_id', schoolId)
    .eq('status', 'pending')

  renderPendingTeachersList(pending)
}

async function approveTeacher(teacherId) {
  const personalCode = await generateUniqueCode('teachers', 'personal_code', true)

  await supabase.from('teachers')
    .update({ status: 'approved', personal_code: personalCode })
    .eq('id', teacherId)

  showSuccess('Teacher approved! ✅')
}

async function rejectTeacher(teacherId) {
  await supabase.from('teachers').update({ status: 'rejected' }).eq('id', teacherId)
  showSuccess('Teacher registration rejected.')
}

async function toggleFlagTeacher(teacherId, currentlyFlagged) {
  await supabase.from('teachers').update({ flagged: !currentlyFlagged }).eq('id', teacherId)
}
```

**Confirm before moving on:** School Head sees pending teachers, can flag one, and Approve generates a real personal code that the teacher's status check then reveals.

---

### CLASS 14 — Teacher: Claiming Class Offerings

**Steps:** Same claiming pattern as before — teacher logs in with their now-active Personal Code, sees a checklist of unclaimed offerings at their school, ticks the ones they teach, each becomes locked to them.

**Confirm before moving on:** Claimed offerings disappear from any future teacher's unclaimed list.

---

### CLASS 15 — Teacher Dashboard Shell & Returning Login

**Steps:** Teacher Personal Code login (for returning teachers) + dashboard listing every claimed offering as a card.

**Confirm before moving on:** A returning teacher logs in with just their Personal Code and sees all their offerings.

---

### CLASS 16 — Teacher: Open & Close Feedback Sessions

**Steps:** Same session pattern as before, scoped to `class_offering_id`.

**Confirm before moving on:** Sessions open/close correctly per offering.

---

### CLASS 17 — Student Entry & Self-Registration (with Class/Arm + Subject Picks)

**Steps:**

**In `app.js`** — add:
```javascript
async function enterStudentCode(entryCode) {
  const { data: school, error } = await supabase
    .from('schools')
    .select('id')
    .eq('student_entry_code', entryCode.toUpperCase().trim())
    .single()

  if (error || !school) return showError('That code wasn\'t found. Check with your school!')

  sessionStorage.setItem('pendingSchoolId', school.id)
  loadClassArmsForRegistration(school.id)
  showScreen('screen-student-register')
}

async function registerStudent(fullName, classArmId, chosenOfferingIds) {
  const schoolId = sessionStorage.getItem('pendingSchoolId')

  const { data: student } = await supabase.from('students').insert({
    school_id: schoolId,
    class_arm_id: classArmId,
    full_name: fullName,
    status: 'pending'
  }).select().single()

  // One enrollment REQUEST per chosen subject — each awaits its own teacher's approval
  for (const offeringId of chosenOfferingIds) {
    await supabase.from('student_enrollment_requests').insert({
      student_id: student.id,
      class_offering_id: offeringId,
      status: 'pending'
    })
  }

  sessionStorage.setItem('studentId', student.id)
  showPendingScreen('student', student.id)
}
```

**Confirm before moving on:** Student picks a Class/Arm, sees that class's subjects, ticks several, and registering creates one enrollment request per subject.

---

### CLASS 18 — Teacher: Approving Students for Their Subject

**Steps:**

**In `app.js`** — add:
```javascript
async function loadPendingStudentsForOffering(classOfferingId) {
  const { data: pending } = await supabase
    .from('student_enrollment_requests')
    .select('id, students(id, full_name, flagged, class_offering_id), created_at')
    .eq('class_offering_id', classOfferingId)
    .eq('status', 'pending')

  renderPendingStudentsList(pending)
}

async function approveStudentEnrollment(requestId, studentId) {
  await supabase.from('student_enrollment_requests').update({ status: 'approved' }).eq('id', requestId)

  // If the student doesn't have a personal code yet, generate one now —
  // this is their FIRST approved subject
  const { data: student } = await supabase.from('students').select('personal_code').eq('id', studentId).single()

  if (!student.personal_code) {
    const personalCode = await generateUniqueCode('students', 'personal_code', true)
    await supabase.from('students').update({ personal_code: personalCode }).eq('id', studentId)
  }

  showSuccess('Student approved! ✅')
}
```

**Confirm before moving on:** A teacher only sees pending requests for their own offering; approving the student's first subject generates their personal code; approving a second subject (from a different teacher) does not generate a second code.

---

### CLASS 19 — Student Pending Screen & Dashboard

**Steps:** Same temporary-status pattern as teachers, plus a dashboard listing only **approved** subjects, with a clear "waiting for approval" badge on any still-pending ones.

**Confirm before moving on:** Approved subjects are selectable for feedback; pending ones are visibly locked with a friendly explanation.

---

### CLASS 20 — Student: Submitting Feedback

**Steps:** Same three-colour-button feedback screen as ClassPulse Lite, scoped to the chosen approved offering's open session, with duplicate-submission protection.

**Confirm before moving on:** Student can submit once per session; a second attempt is blocked.

---

### CLASS 21 — Teacher Dashboard: Live Results (Aggregate Only)

**What Ivan learns:** Writing queries that can never expose an individual student's vote

**The big idea to explain to Ivan:**
This is where the privacy rule becomes real code. Notice the query below only ever counts and sums — it never selects a student's name next to their colour. That's not an accident; it's the whole point.

**Steps:**

**In `app.js`** — add:
```javascript
// Teacher-facing query — deliberately never joins colour to a student name
async function loadAggregateResults(sessionId) {
  const { data: entries } = await supabase
    .from('feedback_entries')
    .select('colour, points') // NOTE: no student_id selected here on purpose

  const counts = { green: 0, yellow: 0, red: 0 }
  let totalPoints = 0
  entries.forEach(e => { counts[e.colour]++; totalPoints += e.points })

  const total = entries.length
  const score = total > 0 ? Math.round((totalPoints / (total * 2)) * 100) : null

  renderScoreCard(score, counts)
  renderBarChart(counts)
}
```

**Confirm before moving on:** The teacher dashboard shows correct counts and score, and Ivan can explain why the query structure makes it impossible to see who submitted what.

---

### CLASS 22 — Multi-Format Charts for Easy Navigation

**What Ivan learns:** Choosing the right chart type for the right question, plain-language chart summaries

**The big idea to explain to Ivan:**
A bar chart is great for "how many of each colour right now," but a line chart is better for "is this class improving over time." Different questions need different chart shapes — and every chart needs a plain sentence near it so nobody has to "read" a chart to understand it.

**Steps:**
- Add a **bar chart** (current session breakdown) — already built in Class 21
- Add a **line chart** (Class Understanding Score across the last 10 sessions for one offering)
- Add a **doughnut chart** option as an alternative view of the same colour breakdown, toggled by a button — useful for people who find circular charts easier to read at a glance
- Above every chart, render one auto-generated plain-language sentence, e.g. *"This class is improving — understanding has gone up over the last 3 lessons! 📈"*

**Confirm before moving on:** All three chart types render correctly from the same data, switching between them is smooth, and every chart has a clear, correct plain-language summary above it.

---

### CLASS 23 — School Head Dashboard: All Teachers' Performance

**Steps:** A summary table/cards showing every teacher's claimed offerings and their aggregate scores (still never showing individual student votes), with a bar chart comparing teachers school-wide.

**Confirm before moving on:** School Head sees accurate, aggregate-only performance data across all teachers.

---

### CLASS 24 — Row Level Security

**Steps:** Enable RLS on every table in Supabase, with policies ensuring: one school's data never leaks to another school; a Teacher's queries can never return individual `feedback_entries` rows joined to a student identity; a Student only ever sees their own history.

**Confirm before moving on:** Verified in the browser console that these boundaries hold.

---

### CLASS 25 — Visual Polish, Mobile Layout & No-Overflow Pass

**Steps:**
1. Apply all design rules from Part 3 across every screen
2. Specifically test every table, every code-display card, and every chart at 375px width — fix anything that overflows, wraps badly, or gets cut off
3. Add empty/loading states throughout
4. Deploy via GitHub Pages

**Confirm before moving on:** No screen overflows or breaks at mobile width; the live site works correctly end-to-end.

---

### CLASS 26 — Full Testing Across All Three Roles

**Checklist:**
- [ ] School registration generates three distinct, correctly-scoped codes
- [ ] Adding a Class/Arm auto-generates the correct curriculum subjects as unclaimed offerings
- [ ] Teacher Entry Code reaches registration; a brand new teacher lands in "pending"
- [ ] School Head can see, flag, approve, and reject pending teachers
- [ ] Approval generates a real, long, hard-to-guess Personal Code
- [ ] An approved teacher can claim multiple offerings and return-login with their code
- [ ] Student Entry Code reaches registration; class/arm and subject picks work correctly
- [ ] Each subject's teacher approves students independently; personal code appears after the first approval only
- [ ] A student with one approved subject and one still-pending subject sees the correct mixed state
- [ ] Student feedback submission is blocked on a second attempt
- [ ] Teacher's live results are 100% aggregate — verified that no query anywhere returns student name + colour together
- [ ] Bar, line, and doughnut charts all render correctly with accurate plain-language summaries
- [ ] School Head dashboard shows accurate teacher performance comparisons
- [ ] No data leaks between schools
- [ ] Nothing overflows or breaks at 375px width

**Confirm:** All checklist items pass. ClassPulse National is complete and live for any school in Nigeria. 🎉🇳🇬

---

### FUTURE CLASSES (Planned, Not Yet Built)

- **CLASS 27** — Bulk student registration via CSV upload
- **CLASS 28** — SMS-based code delivery for schools with limited internet access
- **CLASS 29** — Student personal trend lines and "strongest/weakest subject" badges
- **CLASS 30** — Payment/subscription tier for schools wanting premium analytics

---

## PART 5 — RULES CLAUDE MUST FOLLOW IN EVERY SESSION

1. **Never ask Ivan which class to do.** When Mr. Babatunde types `class N`, begin Class N immediately.
2. **One step at a time.** Show one piece of code, explain it, wait for confirmation before the next piece.
3. **Explain before every code block.** Plain English first, always.
4. **Speak to Ivan directly.**
5. **Never rewrite whole files.** Show only the new code for this step, and say exactly where it goes.
6. **Apply child-friendly design in every frontend step.** Refer to Part 3, including the no-overflow rule.
7. **Teach the why.** Every technology choice and pattern gets a one-sentence reason.
8. **Celebrate milestones.**
9. **Debug together.**
10. **Keep code clean and commented.**
11. **Remember this is a separate project from ClassPulse Lite.**
12. **Always think in terms of Class Offerings.** Every teacher and student action ultimately reads or writes a `class_offerings` row.
13. **Never let a teacher-facing query select a student's identity alongside a colour.** This is a hard rule, not a style preference — flag it explicitly any time a query is written for a teacher view.
14. **Keep the three code types conceptually separate at every step** — entry codes are shared gate passes, personal codes are private and unique. Never conflate them in explanations or code.

---

## PART 6 — CONCEPT GLOSSARY

| Word | Plain English |
|---|---|
| Class Offering | One Class/Arm + Subject pair — the core building block of the system |
| School-Entry Code | A shared "gate pass" code that lets many different teachers or students start registering at the right school |
| Personal Code | A long, hard-to-guess code unique to one person, used for all their future logins |
| Pending / Approval | A new teacher or student waits in a list until the right person confirms they belong, before getting their Personal Code |
| Auto-generated curriculum | The standard Nigerian subjects for a class level, created automatically the moment that class/arm is set up |
| Aggregate data | Totals and counts only — never information about one specific person |
| Supabase | A free toolbox giving us a database, login system, and API all in one |
| Row Level Security | Rules that keep each school's data private from every other school |
| Nullable | A column allowed to be empty — used for `teacher_id` and `personal_code` before they're set |
| async/await | A way to wait for the database to respond without freezing the page |

---

*ClassPulse National Guidelines v3.0 — Auto-curriculum, three-code system, approval workflow*
*Prepared for Ivan's project by Mr. Babatunde via Claude — June 2026*
