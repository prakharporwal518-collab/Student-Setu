# 🎓 Student Setu — *Bridging Students, Building Futures*

**An AI-powered learning and skills platform for Bharat.** It gives students a personalised path from their university syllabus to a real job. Teachers in government and local colleges get an AI teaching assistant. Vocational learners get trade skills in Hindi. Everything works on slow internet.

> Problem statement: *platforms and tools that enhance access to quality education, empower teachers and develop skills — covering remote learning, personalised education, vocational training and bridging the skills gap.*

| Problem-statement keyword | How Student Setu answers it |
| --- | --- |
| **Bridging the skills gap** | **Setu Skill Bridge: Curriculum-to-Career Gap Map.** It compares the real syllabus (Course → University → Semester) with what 13 job roles need across 45 skills. It shows *"your syllabus covers X% by graduation"* and the gap skill by skill. |
| **Personalised education** | A **week-by-week learning plan** built from your biggest gaps and your daily study time, using free courses. Self-ratings and finished projects update your readiness score live, and Gemini adds **AI coach tips**. |
| **Skill development** | **Verified Skill Badges**: 5-question tests graded **on the server** (the answers never reach the browser) and HMAC-signed. Anyone can check one at `/verify/<token>`, and edited badges are rejected. There are 15 skills, including trades. |
| **Empowering teachers** | **Teacher Copilot**: AI lesson plans and question papers from the syllabus in **English or Hindi**, a quiz builder (AI or manual), **auto-graded class quizzes** students join with a code, a **weak-topic heatmap**, one-click **re-teach lessons** and shared notes. |
| **Remote learning** | **Lite mode** (no photos or animations for 2G/3G), an **offline-ready installable app** (service worker + manifest), **listen-aloud** text-to-speech for plans, lessons and notes, **WhatsApp sharing**, and the whole site in **Hindi**. |
| **Vocational training** | 7 trade tracks (electrician, mobile repair, solar PV, Tally & GST, digital marketing, office assistant, tailoring) with Hindi modules, verified tests and links to Skill India, Apprenticeship India and ITI. |
| **Access to quality education** | Free notes, PYQs and syllabus, free quizzes, an e-library of legally shareable books, scholarships, internships, SIDF mentorship and peer tutors (seniors teach juniors). |

**Student life support (optional):** hostel/PG finder with an owner portal, tiffin finder with a provider portal, local-student connect and a college directory. These remove the non-academic barriers that stop small-town students from accessing quality education.

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

### Demo accounts

Use the one-click buttons on the Login page, or log in with password **`demo123`**:

| Role | Email | Lands on |
| --- | --- | --- |
| Student | `student@demo.in` | `/dashboard` |
| Hostel owner | `owner@demo.in` | `/owner` |
| Tiffin provider | `provider@demo.in` | `/provider` |
| Teacher (verified) | `teacher@demo.in` | `/teacher` dashboard |
| Mentor | `mentor@demo.in` | `/mentor` |
| Admin | `admin@demo.in` | `/admin` |

**Demo flow for judges (3 minutes):**
1. `/skill-bridge`: pick B.Tech · RGPV · Sem 5 · Web Developer. The gap map shows the syllabus covers 26% by graduation.
2. Rate a few skills. Readiness rises and the plan re-sizes when you change the daily time. Click **Get my coach tips**.
3. **Get verified** on HTML & CSS, then open the badge's verify link.
4. `/teacher`: create a lesson plan (try हिंदी), click **Make a quiz on this**, generate questions, and **Assign** to a new class.
5. On a phone, open `/class` and enter the code. The teacher sees the result and heatmap under **Classes & insights**. **Try a demo class** shows 26 students.

**Teacher login & verification:**
- Anyone can try the lesson planner and question paper generator as a guest (3 free AI tries). The quiz builder needs a teacher login, and classes need a **verified** teacher.
- New teachers sign up with their college, employee ID and subjects. They start as **Verification pending**.
- Log in as admin → **Verify teachers**. Two sample applications are waiting: `rakesh.verma@demo.in` and `sunita.iyer@demo.in` (password `demo123`). Verify or reject (with a reason the teacher sees).
- Verified teachers get a dashboard (classes, submissions, average score, weakest topic), and their class pages show a **Verified teacher** badge with the college name.
- **Copy private link** on the dashboard opens your classes on another device.

> Accounts are a browser-only demo (localStorage). For real use, switch to a real auth provider (Firebase, Supabase or Netlify Identity) and store the verification status on the server.

**Owner flow:** log in as owner → add a listing → log in as admin → approve it → it now shows in the Hostel Finder with a Verified badge.

Your changes are saved in the browser (localStorage). Use **Admin → Reset demo data** to start over.

## 🧱 Project structure

```
src/
├── components/
│   ├── layout/      Navbar, Footer, Layout (+ role guard), SearchPalette, ChatWidget
│   ├── home/        Hero, ModuleCards, Stats, HowItWorks, Testimonials, FeaturedCities
│   ├── hostel/      HostelCard, HostelFinder (filters + results)
│   └── ui/          Reusable UI kit (Badge, Rating, Modal, PageHeader, SmartImage…), SVG illustrations, dashboard shell
├── context/         AppContext (theme, language, toasts, auth) · DataContext (listings + user activity)
├── data/            Dummy data for every module
├── hooks/           usePersistentState, useCountUp
├── i18n/            English + Hindi strings
├── pages/           One file per module / page (lazy-loaded)
└── services/        api.js (backend switch) · search.js (global search index)
├── shared/          classroom.js — grading & heatmap logic used by both server and browser
netlify/
├── functions/       chat (help bot) · copilot (Gemini JSON) · badge (graded + signed) · classroom (Blobs)
└── lib/             gemini helper · server-only badge question bank · classroom handler
public/sw.js         Offline service worker · manifest.webmanifest — installable app
server/              Optional Express REST API using the same data
```

## 🤖 Gemini AI assistant (Setu Saathi)

The help chat (bottom-right) uses **Google Gemini** through a Netlify Function (`netlify/functions/chat.mts`). The API key stays on the server and is never sent to the browser.

1. Create a key at https://aistudio.google.com/apikey
2. In Netlify go to **Project configuration → Environment variables → Add a variable**:

| Key | Value | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | your key | ✅ |
| `GEMINI_MODEL` | e.g. `gemini-2.5-flash` (default) | optional |

   Keep the scope set to include **Functions**, and mark the key as a secret.
3. **Trigger a redeploy.** Netlify only picks up environment variables on the next deploy.

> ⚠️ Never name it `VITE_GEMINI_API_KEY`. Anything starting with `VITE_` is bundled into the public JavaScript.

Without a key, or when running plain `npm run dev`, the chat falls back to built-in FAQ answers. To test Gemini locally, install the [Netlify CLI](https://docs.netlify.com/cli/get-started/) and run `netlify dev` with `GEMINI_API_KEY` in a `.env` file.

## 🔐 Environment variables (Netlify)

Set these in **Netlify → Project configuration → Environment variables** (scope must include **Functions**), then redeploy:

| Key | Needed for | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Help chat, Teacher Copilot, AI coach | Recommended. Without it, Copilot uses built-in templates. |
| `GEMINI_MODEL` | Choose the model (default `gemini-2.5-flash`) | Optional |
| `BADGE_SECRET` | Signing Verified Skill Badges (any long random text) | Recommended. Without it, badges use a public demo key and are marked "demo". |

Class quizzes and notes are stored in **Netlify Blobs**, which needs no setup. When the functions aren't reachable (plain `npm run dev`), classes are saved in the browser and badge tests show a message. Use `netlify dev` to run everything locally.

## 🔌 Backend

The app runs without a backend. To use the bundled API:

```bash
npm run server                       # http://localhost:4000/api
echo "VITE_API_URL=http://localhost:4000/api" > .env
npm run dev
```

Endpoints: `GET /api/health`, `GET /api/:collection?field=value`, `GET /api/:collection/:id`, and `POST` / `PATCH` for `hostels` and `tiffins`.

To move to **Firebase / Supabase / MongoDB**, re-implement the functions in `src/services/api.js` and replace the mock auth in `src/context/AppContext.jsx`.

## 📝 Notes on demo data

- Phone numbers are masked, and colleges' official websites are linked so details can be verified.
- Job listings and mentors are samples. The programs, scholarships and e-library books are real and link to their official sites. Amounts and deadlines are indicative.
- Photos load from Unsplash. If one fails, a styled placeholder is shown instead. The hero and city artwork are inline SVG, so they always render.

## 🛣️ Roadmap

Real auth (Firebase/Supabase) · image uploads · in-app chat · payments for premium courses · PWA/offline mode · more cities and universities · translating listing content into Hindi.
