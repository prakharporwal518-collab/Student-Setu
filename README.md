# 🎓 Student Setu — *Bridging Students, Building Futures*

India's one-stop student network. Students moving to a new city get genuine guidance from local students, and everything about student life sits on one platform: stays, food, colleges, study material, exams, internships, jobs, scholarships, an e-library, and startup mentorship (SIDF).

Built with **React 18 + Vite + Tailwind CSS + Framer Motion + Lucide**. It runs fully on dummy data, and a small **Express** API is included for when you want a backend.

---

## ✨ Features

| Module | What works |
| --- | --- |
| **Home** | Hero with global search, quick-access cards for all modules, animated stats, How it works, embedded Hostel Finder, testimonials, featured cities |
| **Hostel & Stay Finder** | College / government / private hostels, PGs and rent rooms · filters for city, nearby college, budget (two-handle slider), gender, room type, AC, food and distance · sorting · save (♥) · detail page with gallery, facilities, rules, map, seat availability, yearly savings vs. private-college hostels, reviews, visit requests |
| **Owner portal** (`/owner`) | Register, add/edit/delete listings, update seats, rent and facilities. New listings stay hidden until an admin approves them |
| **Tiffin & Mess** | Filter by city, area, price, veg/non-veg and free trial · weekly menu, reviews · **provider portal** (`/provider`) to manage menu, price and delivery areas |
| **Connect with Local Students** | State → City → Area → College search, verified profiles, Connect requests, city WhatsApp/Telegram communities, area guides written by students |
| **College Directory** | Search by state, city and course · college page with map, official website and contact, courses, hostel availability, nearby stays and tiffin, students from that college |
| **Study Resources** | Course → University → Year → Semester → Subject drill-down · notes, syllabus, PYQs, reference links · bookmarks · contribute notes |
| **Skills & Videos** | Roadmaps, free courses, curated videos, **Premium** badge and placeholder pricing |
| **Internships & Jobs** | Year-wise guidance (1st → final year), listings that always credit and link to the original source, trusted programs |
| **Exams & Quizzes** | GATE, UPSC, SSC, banking, state PSCs, CAT, NEET PG · syllabus and PYQs · **free quizzes**: no registration, timer, instant score with explanations |
| **Scholarships** | Government and private · filter by course, state, category, marks and family income · track applications |
| **E-Library** | Legally shareable content only (NCERT, OpenStax, NPTEL, public domain, permitted student notes) · licence shown on every item · **Report content** |
| **SIDF** | Events in government/local colleges, mentor requests, hackathon prep hub, pitch-deck tips, team-formation board, idea submission with instant feedback |
| **Common** | Login/Signup (email + Google) with role selection · student, owner, provider, mentor and admin dashboards · verified badges · ratings everywhere · Help, About, FAQ, Privacy, Terms · **light/dark mode** · **English/हिंदी** · **Ctrl/⌘ + K global search** · help-chat assistant |

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
| Mentor | `mentor@demo.in` | `/mentor` |
| Admin | `admin@demo.in` | `/admin` |

**Try the full flow:** log in as owner → add a listing → log in as admin → approve it → it now shows in the Hostel Finder with a Verified badge.

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
server/              Optional Express REST API using the same data
```

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
