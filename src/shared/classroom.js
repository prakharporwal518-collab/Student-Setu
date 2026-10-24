// Classroom logic shared by the Netlify Function (online) and the browser (offline demo mode),
// so grading and analytics behave the same everywhere. Plain JS, no browser/Node-only APIs.

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I to avoid confusion

const randomInt = (n) => {
  const a = new Uint32Array(1)
  globalThis.crypto.getRandomValues(a)
  return a[0] % n
}
export const makeCode = () => Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join('')
export const makeKey = () => globalThis.crypto.randomUUID().replace(/-/g, '')
export const makeId = () => globalThis.crypto.randomUUID().slice(0, 8)

/** Input problems a user can fix (shown to them as-is). */
export class ValidationError extends Error {}

const clip = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n)

/** Validates and normalises a quiz coming from a teacher. Throws on bad input. */
export function cleanQuiz(raw) {
  const title = clip(raw?.title, 100)
  if (!title) throw new ValidationError('Quiz title is required')
  const questions = (Array.isArray(raw?.questions) ? raw.questions : []).slice(0, 30).map((q, i) => {
    const options = (Array.isArray(q?.options) ? q.options : []).map((o) => clip(o, 200)).filter(Boolean).slice(0, 6)
    const answer = Number(q?.answer)
    if (!clip(q?.q, 400) || options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) {
      throw new ValidationError(`Question ${i + 1} needs text, at least 2 options and one correct answer`)
    }
    return { q: clip(q.q, 400), options, answer, explanation: clip(q.explanation, 300), topic: clip(q.topic, 60) || 'General' }
  })
  if (!questions.length) throw new ValidationError('Add at least one question')
  return { id: makeId(), title, questions, createdAt: new Date().toISOString() }
}

export function cleanNote(raw) {
  const title = clip(raw?.title, 120)
  if (!title) throw new ValidationError('Note title is required')
  const url = clip(raw?.url, 500)
  if (url && !/^https?:\/\//i.test(url)) throw new ValidationError('Link must start with http:// or https://')
  return { id: makeId(), title, url, text: clip(raw?.text, 2000), createdAt: new Date().toISOString() }
}

/** What students may see: no answers, no teacher key. */
export function publicClass(cls) {
  return {
    code: cls.code, subject: cls.subject, course: cls.course, semester: cls.semester, teacherName: cls.teacherName, createdAt: cls.createdAt,
    demo: Boolean(cls.demo), notes: cls.notes ?? [],
    quizzes: (cls.quizzes ?? []).map((qz) => ({ id: qz.id, title: qz.title, createdAt: qz.createdAt, questions: qz.questions.map(({ q, options, topic }) => ({ q, options, topic })) })),
  }
}

export function gradeQuiz(quiz, answers = []) {
  const results = quiz.questions.map((q, i) => ({ correct: answers[i] === q.answer, chosen: Number.isInteger(answers[i]) ? answers[i] : null, answer: q.answer, explanation: q.explanation, topic: q.topic }))
  return { score: results.filter((r) => r.correct).length, total: quiz.questions.length, results }
}

/** Per-topic and per-question accuracy for the teacher's heatmap. */
export function classInsights(cls, submissions) {
  const quizzes = cls.quizzes ?? []
  const topics = {}
  const perQuiz = quizzes.map((qz) => {
    const subs = submissions.filter((s) => s.quizId === qz.id)
    const questions = qz.questions.map((q, i) => {
      const correct = subs.filter((s) => s.results[i]?.correct).length
      const t = (topics[q.topic] ??= { topic: q.topic, attempts: 0, correct: 0 })
      t.attempts += subs.length
      t.correct += correct
      return { q: q.q, topic: q.topic, attempts: subs.length, pct: subs.length ? Math.round((correct / subs.length) * 100) : null }
    })
    const avg = subs.length ? Math.round((subs.reduce((a, s) => a + s.score / s.total, 0) / subs.length) * 100) : null
    return { id: qz.id, title: qz.title, submissions: subs.length, avg, questions }
  })
  const topicList = Object.values(topics)
    .map((t) => ({ ...t, pct: t.attempts ? Math.round((t.correct / t.attempts) * 100) : null }))
    .sort((a, b) => (a.pct ?? 101) - (b.pct ?? 101))
  const students = submissions
    .map((s) => ({ name: s.studentName, quiz: quizzes.find((q) => q.id === s.quizId)?.title ?? '—', score: s.score, total: s.total, at: s.at }))
    .sort((a, b) => b.at.localeCompare(a.at))
  return { perQuiz, topics: topicList, students, weakest: topicList.find((t) => t.pct !== null && t.pct < 60) ?? null }
}

/* -------------------------------------------------------- Demo class */
const demoQuestions = [
  { q: 'Which normal form removes partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 1, topic: 'Normalization', explanation: '2NF requires every non-key attribute to depend on the whole primary key.' },
  { q: 'A table is in 3NF if it is in 2NF and has no…', options: ['partial dependency', 'transitive dependency', 'primary key', 'foreign key'], answer: 1, topic: 'Normalization', explanation: '3NF removes transitive dependencies between non-key attributes.' },
  { q: 'INNER JOIN returns…', options: ['all rows from the left table', 'only rows that match in both tables', 'all rows from both tables', 'every combination of rows'], answer: 1, topic: 'SQL Joins', explanation: 'INNER JOIN keeps only matching rows.' },
  { q: 'LEFT JOIN returns…', options: ['only matching rows', 'all rows from the left table plus matches from the right', 'all rows from the right table', 'no rows'], answer: 1, topic: 'SQL Joins', explanation: 'Unmatched right-side columns become NULL.' },
  { q: 'The “A” in ACID stands for…', options: ['Availability', 'Atomicity', 'Accuracy', 'Authorization'], answer: 1, topic: 'Transactions', explanation: 'Atomicity: a transaction happens fully or not at all.' },
  { q: 'An index mainly improves…', options: ['write speed', 'search / read speed', 'storage size', 'security'], answer: 1, topic: 'Indexing', explanation: 'Indexes speed up lookups at some cost to writes and storage.' },
  { q: 'In an ER diagram, a rectangle represents…', options: ['an attribute', 'a relationship', 'an entity', 'a key'], answer: 2, topic: 'ER Model', explanation: 'Entities are rectangles, attributes ovals, relationships diamonds.' },
  { q: 'A foreign key…', options: ['uniquely identifies rows in its own table', 'refers to the primary key of another table', 'must always be NULL', 'is a type of index'], answer: 1, topic: 'ER Model', explanation: 'Foreign keys link tables together.' },
]
const demoNames = ['Aman', 'Riya', 'Karan', 'Pooja', 'Rahul', 'Sneha', 'Vikas', 'Neha', 'Arjun', 'Kavya', 'Rohit', 'Anjali', 'Deepak', 'Priya', 'Saurabh', 'Megha', 'Nikhil', 'Shruti', 'Harsh', 'Tanvi', 'Yash', 'Ishita', 'Mohit', 'Sakshi', 'Varun', 'Nisha']
// How likely an average student is to get each topic right — Normalization is the weak spot.
const topicSkill = { Normalization: 0.34, 'SQL Joins': 0.72, Transactions: 0.81, Indexing: 0.58, 'ER Model': 0.86 }

export function seedDemoClass(teacherName = 'Prof. Meena Joshi') {
  let seed = 7
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  const quiz = { id: 'demo-dbms', title: 'Unit 3 check: Normalization, Joins & Transactions', createdAt: new Date(Date.now() - 2 * 864e5).toISOString(), questions: demoQuestions }
  const cls = {
    code: makeCode(), teacherKey: makeKey(), subject: 'Database Management Systems', course: 'B.Tech CSE', semester: '5', teacherName, demo: true,
    createdAt: new Date(Date.now() - 7 * 864e5).toISOString(), quizzes: [quiz],
    notes: [{ id: 'n1', title: 'Unit 3 — Normalization (1NF to BCNF) with solved examples', url: 'https://nptel.ac.in/courses?searchText=database%20management%20system', text: 'Read before Monday. Focus on finding partial and transitive dependencies.', createdAt: new Date(Date.now() - 3 * 864e5).toISOString() }],
  }
  const submissions = demoNames.map((name, n) => {
    const ability = 0.75 + rnd() * 0.5 // some students stronger than others
    const answers = quiz.questions.map((q) => (rnd() < Math.min(0.97, topicSkill[q.topic] * ability) ? q.answer : (q.answer + 1 + Math.floor(rnd() * 3)) % q.options.length))
    const graded = gradeQuiz(quiz, answers)
    return { id: `demo-${n}`, quizId: quiz.id, studentName: `${name} ${String.fromCharCode(65 + (n % 26))}.`, answers, ...graded, at: new Date(Date.now() - (26 - n) * 36e5).toISOString() }
  })
  return { cls, submissions }
}
