// Setu Skill Bridge — maps a university syllabus to the skills real jobs ask for.
//
// How the score works (explained to students on the page):
//   • Covered in your syllabus (theory)  → 50% credit for that skill
//   • Your self-rating (basics → confident) → up to 80%
//   • A verified Setu Skill Badge         → 100%
// Each job role weights its skills 1–3. The readiness score is the weighted average.

import { courses } from './resources.js'

const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
const L = (title, url, src) => ({ title, url, src })

/* --------------------------------------------------------------- Skills */
export const skills = {
  html_css: { name: 'HTML & CSS', hours: 15, badge: true, learn: [L('Responsive Web Design', 'https://www.freecodecamp.org/learn', 'freeCodeCamp'), L('Learn web development', 'https://developer.mozilla.org/en-US/docs/Learn', 'MDN')], project: 'Build a responsive portfolio page' },
  js: { name: 'JavaScript', hours: 25, badge: true, learn: [L('JavaScript Algorithms & Data Structures', 'https://www.freecodecamp.org/learn', 'freeCodeCamp'), L('JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'MDN')], project: 'Make a to-do app that saves to local storage' },
  react: { name: 'React', hours: 25, badge: true, learn: [L('Learn React (official)', 'https://react.dev/learn', 'react.dev'), L('Full Stack Open', 'https://fullstackopen.com/en/', 'Univ. of Helsinki')], project: 'Build a weather app using a public API' },
  node: { name: 'Node.js & Express', hours: 20, learn: [L('Full Stack Open — Part 3', 'https://fullstackopen.com/en/part3', 'Univ. of Helsinki'), L('NodeJS course', 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs', 'The Odin Project')], project: 'Create a REST API for notes with Express' },
  rest_api: { name: 'REST APIs & HTTP', hours: 8, learn: [L('An overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', 'MDN')], project: 'Use and document a public API' },
  cpp: { name: 'C++ programming', hours: 25, learn: [L('LearnCpp.com', 'https://www.learncpp.com', 'LearnCpp')], project: 'Console bank-account manager using classes' },
  python: { name: 'Python', hours: 20, badge: true, learn: [L('Python for Everybody', 'https://www.py4e.com', 'Dr. Chuck'), L('Python micro-course', 'https://www.kaggle.com/learn/python', 'Kaggle')], project: 'Automate a boring task (rename files, scrape a page)' },
  dsa: { name: 'Data Structures & Algorithms', hours: 60, badge: true, learn: [L('NeetCode roadmap', 'https://neetcode.io/roadmap', 'NeetCode'), L('Practice problems', 'https://leetcode.com/problemset/', 'LeetCode')], project: 'Solve 100 problems and track them on GitHub' },
  oop: { name: 'Object-oriented design', hours: 10, learn: [L('Classes & OOP chapters', 'https://www.learncpp.com', 'LearnCpp')], project: 'Library management system with classes' },
  sql: { name: 'SQL', hours: 15, badge: true, learn: [L('Intro to SQL', 'https://www.kaggle.com/learn/intro-to-sql', 'Kaggle'), L('Interactive SQL lessons', 'https://sqlbolt.com', 'SQLBolt')], project: 'Analyse a college results dataset with SQL' },
  git: { name: 'Git & GitHub', hours: 6, badge: true, learn: [L('Pro Git book', 'https://git-scm.com/book/en/v2', 'git-scm'), L('GitHub Skills', 'https://skills.github.com', 'GitHub')], project: 'Publish all your projects on GitHub with READMEs' },
  testing: { name: 'Software testing', hours: 8, learn: [L('Testing tutorials', yt('software testing tutorial for beginners'), 'YouTube')], project: 'Add unit tests to one of your projects' },
  linux: { name: 'Linux & shell', hours: 10, learn: [L('Linux Journey', 'https://linuxjourney.com', 'Linux Journey')], project: 'Write 5 useful shell scripts' },
  os_networks: { name: 'OS & networking', hours: 15, learn: [L('NPTEL — Operating Systems', 'https://nptel.ac.in/courses?searchText=operating%20systems', 'NPTEL')], project: 'Explain, step by step, what happens when a URL loads' },
  cloud: { name: 'Cloud fundamentals', hours: 15, learn: [L('AWS Skill Builder', 'https://skillbuilder.aws', 'AWS')], project: 'Deploy a project on a free cloud tier' },
  docker: { name: 'Docker & CI/CD', hours: 10, learn: [L('Docker — Get started', 'https://docs.docker.com/get-started/', 'Docker')], project: 'Containerise your API and add a GitHub Actions build' },
  system_design: { name: 'System design', hours: 20, learn: [L('System Design Primer', 'https://github.com/donnemartin/system-design-primer', 'GitHub')], project: 'Design a URL shortener and explain trade-offs' },
  security: { name: 'Cyber-security basics', hours: 10, learn: [L('Security basics', yt('cyber security basics for beginners'), 'YouTube')], project: 'Secure a login form (hashing, rate limits)' },
  math: { name: 'Linear algebra & probability', hours: 20, learn: [L('Linear algebra', 'https://www.khanacademy.org/math/linear-algebra', 'Khan Academy'), L('Mathematics for ML (free book)', 'https://mml-book.github.io', 'MML Book')], project: 'Implement linear regression from scratch' },
  statistics: { name: 'Statistics', hours: 15, learn: [L('Statistics & probability', 'https://www.khanacademy.org/math/statistics-probability', 'Khan Academy')], project: 'Summarise a dataset: mean, median, spread, correlation' },
  excel: { name: 'Excel / Google Sheets', hours: 10, badge: true, learn: [L('Excel for beginners (Hindi)', yt('excel tutorial for beginners in hindi'), 'YouTube')], project: 'Monthly expense dashboard with pivot tables' },
  pandas: { name: 'Python data analysis (Pandas)', hours: 12, learn: [L('Pandas micro-course', 'https://www.kaggle.com/learn/pandas', 'Kaggle')], project: 'Clean and analyse a Kaggle dataset' },
  dataviz: { name: 'Dashboards (Power BI / Tableau)', hours: 8, learn: [L('Power BI training', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', 'Microsoft Learn')], project: 'Interactive sales dashboard' },
  ml: { name: 'Machine learning', hours: 40, learn: [L('Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'Google'), L('ML Specialization (audit free)', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Coursera')], project: 'Predict house prices with scikit-learn' },
  dl: { name: 'Deep learning', hours: 40, learn: [L('Practical Deep Learning', 'https://course.fast.ai', 'fast.ai'), L('Dive into Deep Learning', 'https://d2l.ai', 'd2l.ai')], project: 'Image classifier for crop diseases' },
  electronics: { name: 'Electronics fundamentals', hours: 15, learn: [L('NPTEL — Basic electronics', 'https://nptel.ac.in/courses?searchText=basic%20electronics', 'NPTEL')], project: 'Build and measure a simple circuit on a breadboard' },
  embedded: { name: 'Embedded C & microcontrollers', hours: 25, learn: [L('Arduino docs', 'https://docs.arduino.cc/learn/', 'Arduino')], project: 'Temperature logger with Arduino / ESP32' },
  iot: { name: 'IoT sensors & protocols', hours: 15, learn: [L('IoT with MQTT', yt('mqtt esp32 tutorial'), 'YouTube')], project: 'Send sensor data to a cloud dashboard' },
  communication: { name: 'Workplace English & communication', hours: 15, badge: true, learn: [L('Improve Your English Communication', 'https://www.coursera.org/specializations/improve-english', 'Coursera'), L('English courses', 'https://swayam.gov.in/explorer?searchText=english', 'SWAYAM')], project: 'Record a 2-minute self-introduction and get feedback' },
  writing: { name: 'Business & content writing', hours: 10, learn: [L('Writing tutorials', yt('business writing skills'), 'YouTube')], project: 'Write 3 blog posts or reports' },
  presentation: { name: 'Presentation skills', hours: 6, learn: [L('How to Speak (MIT)', yt('Patrick Winston how to speak MIT'), 'YouTube')], project: 'Present your project in 5 slides' },
  aptitude: { name: 'Aptitude & reasoning', hours: 20, learn: [L('Free Setu quizzes', '/exams#quizzes', 'Student Setu'), L('Practice questions', 'https://www.indiabix.com', 'IndiaBix')], project: 'Score 80%+ in 3 timed mock tests' },
  accounting: { name: 'Accounting & bookkeeping', hours: 20, badge: true, learn: [L('Accounting basics (Hindi)', yt('financial accounting basics in hindi'), 'YouTube')], project: 'Prepare one month of books for a small shop' },
  tally: { name: 'TallyPrime', hours: 12, learn: [L('TallyPrime tutorials (Hindi)', yt('tally prime full course hindi'), 'YouTube')], project: 'Record vouchers and generate GST reports in Tally' },
  gst: { name: 'GST & tax basics', hours: 10, badge: true, learn: [L('GST portal tutorials', 'https://tutorial.gst.gov.in', 'GST Portal')], project: 'Prepare a mock GSTR-1 for a sample business' },
  finmodel: { name: 'Financial analysis & modelling', hours: 20, learn: [L('Financial modelling', yt('financial modelling in excel for beginners'), 'YouTube')], project: 'Build a 3-statement model in Excel' },
  economics: { name: 'Economics', hours: 10, learn: [L('Principles of Economics (free book)', 'https://openstax.org/details/books/principles-economics-3e', 'OpenStax')], project: 'Write a 1-page note on inflation trends in India' },
  law: { name: 'Business & labour law basics', hours: 8, learn: [L('Business law', 'https://swayam.gov.in/explorer?searchText=business%20law', 'SWAYAM')], project: 'Summarise 5 key clauses of an employment contract' },
  marketing: { name: 'Marketing fundamentals', hours: 10, learn: [L('Marketing basics', yt('marketing fundamentals course'), 'YouTube')], project: 'Marketing plan for a local tiffin service' },
  seo_social: { name: 'SEO & social media marketing', hours: 15, badge: true, learn: [L('SEO Starter Guide', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', 'Google')], project: 'Grow an Instagram page or rank a blog post' },
  analytics: { name: 'Web analytics (GA4)', hours: 8, learn: [L('Google Skillshop', 'https://skillshop.withgoogle.com', 'Google')], project: 'Set up GA4 on your portfolio and report a week of data' },
  business_analysis: { name: 'Business analysis', hours: 15, learn: [L('Business analysis basics', yt('business analyst tutorial for beginners'), 'YouTube')], project: 'Write a requirements document for a college app' },
  management: { name: 'Management & strategy', hours: 8, learn: [L('Management courses', 'https://swayam.gov.in/explorer?searchText=management', 'SWAYAM')], project: 'SWOT analysis of a local business' },
  hr: { name: 'HR fundamentals', hours: 12, learn: [L('HR basics', yt('human resource management basics'), 'YouTube')], project: 'Draft a hiring plan and interview kit' },
  research: { name: 'Research methods', hours: 12, learn: [L('Research methodology', 'https://swayam.gov.in/explorer?searchText=research%20methodology', 'SWAYAM')], project: 'Run a 50-person survey and report the findings' },
}

/* ---------------------------------------------------------------- Roles */
// w = how important the skill is for the role (1–3). tags match Internships & Jobs listings.
const S = (obj) => Object.entries(obj).map(([id, w]) => ({ id, w }))

export const roles = [
  { id: 'web-dev', name: 'Web Developer', emoji: '💻', courses: ['btech', 'bsc'], tags: ['React', 'Tailwind'], blurb: 'Builds websites and web apps (frontend + backend).', needs: S({ html_css: 3, js: 3, react: 3, node: 2, rest_api: 2, git: 3, sql: 2, dsa: 1, testing: 1, communication: 1 }) },
  { id: 'sde', name: 'Software Engineer', emoji: '🧑‍💻', courses: ['btech'], tags: ['DSA', 'Java'], blurb: 'Writes and maintains large software systems at product companies.', needs: S({ dsa: 3, cpp: 2, oop: 3, sql: 2, os_networks: 2, git: 2, system_design: 1, testing: 1, aptitude: 2, communication: 1 }) },
  { id: 'data-analyst', name: 'Data Analyst', emoji: '📊', courses: ['btech', 'bsc', 'bcom', 'ba'], tags: ['SQL', 'Power BI', 'Excel'], blurb: 'Turns data into decisions with SQL, spreadsheets and dashboards.', needs: S({ sql: 3, excel: 3, statistics: 3, python: 2, pandas: 2, dataviz: 2, communication: 2, presentation: 1 }) },
  { id: 'ml-engineer', name: 'ML / AI Engineer', emoji: '🤖', courses: ['btech', 'bsc'], tags: ['Python', 'PyTorch'], blurb: 'Builds and deploys machine-learning models.', needs: S({ python: 3, math: 3, statistics: 2, pandas: 2, ml: 3, dl: 2, git: 2, sql: 1, cloud: 1 }) },
  { id: 'cloud-devops', name: 'Cloud / DevOps Engineer', emoji: '☁️', courses: ['btech'], tags: ['DevOps'], blurb: 'Keeps apps running reliably in the cloud.', needs: S({ linux: 3, os_networks: 3, cloud: 3, docker: 3, git: 2, python: 1, security: 1 }) },
  { id: 'iot-engineer', name: 'IoT / Embedded Engineer', emoji: '🔌', courses: ['btech', 'bsc'], tags: ['IoT', 'Embedded'], blurb: 'Builds smart devices with sensors and microcontrollers.', needs: S({ electronics: 3, embedded: 3, iot: 3, cpp: 2, python: 1, os_networks: 1 }) },
  { id: 'accountant', name: 'Accountant / Tax Assistant', emoji: '🧾', courses: ['bcom', 'bba'], tags: ['Excel'], blurb: 'Keeps books, files GST and prepares financial statements.', needs: S({ accounting: 3, tally: 3, gst: 3, excel: 2, law: 1, communication: 1 }) },
  { id: 'financial-analyst', name: 'Financial Analyst', emoji: '💹', courses: ['bcom', 'bba'], tags: ['Excel'], blurb: 'Analyses company finances and builds forecasts.', needs: S({ accounting: 2, finmodel: 3, excel: 3, statistics: 2, economics: 2, presentation: 2 }) },
  { id: 'digital-marketer', name: 'Digital Marketer', emoji: '📣', courses: ['bba', 'bcom', 'ba'], tags: ['Content', 'Canva', 'Marketing', 'Sales'], blurb: 'Grows brands online with SEO, social media and ads.', needs: S({ marketing: 3, seo_social: 3, analytics: 2, writing: 2, excel: 1, presentation: 1, communication: 2 }) },
  { id: 'business-analyst', name: 'Business Analyst', emoji: '📈', courses: ['bba', 'bcom', 'btech'], tags: ['SQL', 'Excel', 'Aptitude'], blurb: 'Bridges business teams and tech teams with data.', needs: S({ business_analysis: 3, excel: 3, sql: 2, statistics: 2, dataviz: 2, presentation: 2, communication: 2 }) },
  { id: 'hr-executive', name: 'HR Executive', emoji: '🤝', courses: ['bba', 'ba'], tags: [], blurb: 'Hires people and builds healthy workplaces.', needs: S({ hr: 3, communication: 3, excel: 2, law: 2, management: 1, presentation: 1 }) },
  { id: 'content-specialist', name: 'Content & Communication Specialist', emoji: '✍️', courses: ['ba', 'bba'], tags: ['Content'], blurb: 'Writes content that informs, persuades and ranks.', needs: S({ writing: 3, communication: 3, seo_social: 2, research: 2, presentation: 1 }) },
  { id: 'policy-research', name: 'Policy / Research Associate', emoji: '🏛️', courses: ['ba', 'bsc'], tags: [], blurb: 'Researches social and economic issues for NGOs, think-tanks and government.', needs: S({ research: 3, economics: 3, statistics: 2, writing: 3, excel: 2 }) },
]

export const roleById = (id) => roles.find((r) => r.id === id)

/* -------------------------------------------- Syllabus subject → skills */
// Keys match the subject names in data/resources.js exactly.
export const subjectSkills = {
  // B.Tech CSE
  'Mathematics-I': ['math'], 'Mathematics-II': ['math'], 'Mathematics-III': ['math', 'statistics'],
  'English for Communication': ['communication', 'writing'],
  'Basic Electrical & Electronics Engg.': ['electronics'],
  'Basic Computer Engg. (C++)': ['cpp'],
  'Discrete Structures': ['math'],
  'Data Structures': ['dsa', 'cpp'],
  'Digital Systems': ['electronics'],
  'Object Oriented Programming': ['oop', 'cpp'],
  'Analog & Digital Communication': ['electronics'],
  'Analysis & Design of Algorithms': ['dsa'],
  'Software Engineering': ['testing'],
  'Computer Organization & Architecture': ['electronics'],
  'Database Management Systems': ['sql'],
  'Operating Systems': ['os_networks', 'linux'],
  'Cyber Security': ['security'],
  'Data Analytics (Python)': ['python', 'pandas', 'statistics'],
  'Machine Learning': ['ml'],
  'Computer Networks': ['os_networks'],
  'Project Management': ['presentation', 'management'],
  'Web Technology': ['html_css', 'js'],
  'Cloud Computing': ['cloud'],
  'Artificial Intelligence': ['ml'],
  'Major Project-I': ['presentation'], 'Major Project-II': ['presentation'],
  'Internet of Things': ['iot', 'embedded'],
  'Big Data': ['statistics'],
  // B.Sc
  'Calculus': ['math'], 'Differential Equations': ['math'], 'Real Analysis': ['math'], 'Group Theory': ['math'],
  'Mathematical Physics': ['math'], 'Numerical Methods': ['math', 'python'], 'Electronics': ['electronics'],
  'Project / Dissertation': ['research', 'writing'],
  // B.Com
  'Financial Accounting': ['accounting'], 'Corporate Accounting': ['accounting'], 'Cost Accounting': ['accounting'],
  'Management Accounting': ['accounting', 'finmodel'], 'Business Organisation': ['management'],
  'Business Communication': ['communication', 'writing'], 'Business Law': ['law'], 'Company Law': ['law'],
  'Micro Economics': ['economics'], 'Macro Economics': ['economics'], 'Income Tax': ['gst'], 'GST & Indirect Taxes': ['gst'],
  'Business Statistics': ['statistics', 'excel'], 'Banking & Insurance': ['economics'], 'Auditing': ['accounting'],
  'Financial Management': ['finmodel'], 'Entrepreneurship': ['presentation', 'management'], 'E-Commerce': ['marketing'],
  // BBA
  'Principles of Management': ['management'], 'Business Mathematics': ['math'], 'Organisational Behaviour': ['hr'],
  'Business Economics': ['economics'], 'Marketing Management': ['marketing'], 'Human Resource Management': ['hr', 'law'],
  'Research Methodology': ['research'], 'Digital Marketing': ['seo_social', 'marketing'], 'Strategic Management': ['management'],
  'Summer Internship Report': ['writing', 'presentation'], 'Entrepreneurship & Startups': ['presentation', 'business_analysis'],
  'Major Project': ['presentation', 'research'], 'International Business': ['economics', 'management'],
  // BA
  'Indian Political Thought': ['writing'], 'Ancient Indian History': ['research'], 'Introductory Microeconomics': ['economics'],
  'Indian Constitution': ['law'], 'Medieval India': ['research'], 'Introductory Macroeconomics': ['economics'],
  'Comparative Politics': ['writing'], 'Modern India (1757–1857)': ['research'], 'Indian Economy': ['economics'],
  'Public Administration': ['management'], 'Indian National Movement': ['writing'], 'Development Economics': ['economics'],
  'International Relations': ['writing', 'research'], 'World History': ['research'], 'Public Finance': ['economics'],
  'Contemporary Political Issues': ['writing'], 'History of Modern Europe': ['research'], 'Environmental Economics': ['economics', 'research'],
}

/* --------------------------------------------------------- Gap engine */
export const RATING = [
  { value: 0, label: 'New to me', credit: 0 },
  { value: 1, label: 'Know basics', credit: 0.4 },
  { value: 2, label: 'Built something', credit: 0.7 },
  { value: 3, label: 'Confident', credit: 0.8 },
]
export const SYLLABUS_CREDIT = 0.5

export const bridgeCourses = courses.filter((c) => c.id !== 'mbbs')
export const rolesForCourse = (courseId) => roles.filter((r) => r.courses.includes(courseId))

/** Subjects (with semester) that teach each skill, up to and including `uptoSem`. */
export function syllabusSkills(courseId, uptoSem) {
  const course = courses.find((c) => c.id === courseId)
  const map = {}
  if (!course) return map
  Object.entries(course.semesters).forEach(([sem, subjects]) => {
    if (+sem > uptoSem) return
    subjects.forEach((subject) => (subjectSkills[subject] ?? []).forEach((sk) => (map[sk] ??= []).push({ subject, sem: +sem })))
  })
  return map
}

/**
 * Readiness for a role.
 * @param ratings  { skillId: 0..3 } self-ratings
 * @param badges   Set/array of skill ids with a verified badge
 */
export function computeGap({ courseId, sem, roleId, ratings = {}, badges = [] }) {
  const role = roleById(roleId)
  const course = courses.find((c) => c.id === courseId)
  if (!role || !course) return null
  const badgeSet = new Set(badges)
  const now = syllabusSkills(courseId, sem)
  const full = syllabusSkills(courseId, course.years * 2)
  const totalW = role.needs.reduce((a, n) => a + n.w, 0)
  let score = 0
  let syllabusNow = 0
  let syllabusFull = 0
  const items = role.needs.map(({ id, w }) => {
    const inSyllabus = Boolean(now[id])
    const ratingCredit = RATING[ratings[id] ?? 0].credit
    const verified = badgeSet.has(id)
    const credit = Math.max(inSyllabus ? SYLLABUS_CREDIT : 0, ratingCredit, verified ? 1 : 0)
    score += credit * w
    syllabusNow += (inSyllabus ? SYLLABUS_CREDIT : 0) * w
    syllabusFull += (full[id] ? SYLLABUS_CREDIT : 0) * w
    const source = verified ? 'verified' : ratingCredit >= (inSyllabus ? SYLLABUS_CREDIT : 0) && ratingCredit > 0 ? 'self' : inSyllabus ? 'syllabus' : 'missing'
    return { id, w, skill: skills[id], credit, inSyllabus, subjects: now[id] ?? [], laterSubjects: (full[id] ?? []).filter((s) => s.sem > sem), rating: ratings[id] ?? 0, verified, source }
  })
  const pct = (v) => Math.round((v / totalW) * 100)
  return {
    role, course, items,
    readiness: pct(score),
    syllabusNow: pct(syllabusNow),
    // What the full degree would give with zero extra effort — the "skills gap" headline.
    syllabusFull: pct(syllabusFull),
    missing: items.filter((i) => i.source === 'missing').length,
  }
}

/** Week-by-week plan for the biggest gaps. */
export function buildPlan(gap, minutesPerDay = 45, maxSkills = 6) {
  if (!gap) return { weeks: [], totalWeeks: 0, tasks: [] }
  const capacity = Math.max(1, (minutesPerDay * 6) / 60) // hours per week, 6 study days
  const focus = gap.items
    .filter((i) => i.credit < 1)
    .sort((a, b) => b.w * (1 - b.credit) - a.w * (1 - a.credit))
    .slice(0, maxSkills)
  const tasks = []
  focus.forEach((i) => {
    // Remaining effort shrinks as the student already knows more.
    const hours = Math.max(2, Math.round(i.skill.hours * (1 - i.credit)))
    const learnUrl = i.skill.learn[0]
    tasks.push({ id: `${i.id}-learn`, skill: i.id, kind: 'learn', hours: Math.max(1, Math.round(hours * 0.6)), title: `Learn ${i.skill.name}`, detail: learnUrl ? `${learnUrl.title} (${learnUrl.src})` : '', url: learnUrl?.url })
    tasks.push({ id: `${i.id}-build`, skill: i.id, kind: 'build', hours: Math.max(1, Math.round(hours * 0.3)), title: `Build: ${i.skill.project}`, detail: 'Push it to GitHub or your portfolio' })
    tasks.push({ id: `${i.id}-prove`, skill: i.id, kind: 'prove', hours: 1, title: i.skill.badge ? `Earn the ${i.skill.name} badge` : `Self-check: explain ${i.skill.name} to a friend`, detail: i.skill.badge ? '5-question verified test — pass 4/5' : 'Then rate yourself “Confident”' })
  })
  let cum = 0
  tasks.forEach((t) => {
    t.week = Math.floor(cum / capacity) + 1
    cum += t.hours
    t.endWeek = Math.max(t.week, Math.ceil(cum / capacity))
  })
  const totalWeeks = tasks.length ? tasks[tasks.length - 1].endWeek : 0
  const weeks = []
  for (let w = 1; w <= totalWeeks; w++) {
    const list = tasks.filter((t) => t.week === w)
    if (list.length) weeks.push({ week: w, tasks: list })
  }
  return { weeks, totalWeeks, tasks, hoursPerWeek: capacity, focus: focus.map((f) => f.id) }
}

/* ------------------------------------------------------ Peer tutors */
// Seniors who teach juniors and earn Setu Credits (demo data, linked to community students).
export const tutors = [
  { id: 'pt1', studentId: 's1', name: 'Ananya Sharma', college: 'RGPV · B.Tech 3rd yr', skills: ['html_css', 'js', 'react', 'git'], rating: 4.9, sessions: 46, mode: 'Online · Hindi/English' },
  { id: 'pt2', studentId: 's7', name: 'Megha Rathi', college: 'IIT Indore · B.Tech 3rd yr', skills: ['python', 'ml', 'git', 'dsa'], rating: 4.8, sessions: 62, mode: 'Online' },
  { id: 'pt3', studentId: 's11', name: 'Aarav Gupta', college: 'DTU · B.Tech 4th yr', skills: ['dsa', 'system_design', 'cpp', 'oop'], rating: 4.9, sessions: 81, mode: 'Online · weekends' },
  { id: 'pt4', studentId: 's4', name: 'Aditya Singh', college: 'MANIT · B.Tech 4th yr', skills: ['electronics', 'embedded', 'iot', 'aptitude'], rating: 4.7, sessions: 38, mode: 'Bhopal · offline/online' },
  { id: 'pt5', studentId: 's3', name: 'Sneha Patel', college: 'LNCT · BBA 3rd yr', skills: ['marketing', 'seo_social', 'presentation', 'communication'], rating: 4.8, sessions: 29, mode: 'Online · Hindi' },
  { id: 'pt6', studentId: 's13', name: 'Shivam Tripathi', college: 'Lucknow Univ. · B.Com 2nd yr', skills: ['accounting', 'tally', 'gst', 'excel'], rating: 4.6, sessions: 22, mode: 'Online · Hindi' },
  { id: 'pt7', studentId: 's10', name: 'Abhishek Yadav', college: 'DU · BA 3rd yr', skills: ['writing', 'research', 'economics', 'communication'], rating: 4.7, sessions: 54, mode: 'Online' },
  { id: 'pt8', studentId: 's9', name: 'Simran Kaur', college: 'DU · BA Economics 2nd yr', skills: ['economics', 'statistics', 'excel', 'presentation'], rating: 4.8, sessions: 33, mode: 'Online' },
]

/* Badge-enabled skills (server-graded). Vocational trades are listed in data/vocational.js. */
export const badgeSkillIds = Object.entries(skills).filter(([, s]) => s.badge).map(([id]) => id)
