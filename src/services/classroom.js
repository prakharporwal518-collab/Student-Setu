// Teacher Copilot classrooms.
// Online: Netlify Function + Blobs, so a class code works on every student's phone.
// Offline / local dev: the same logic runs in this browser (localStorage) so the demo still works.
import { getFn, postFn, failReason } from './functions'
import { classInsights, cleanNote, cleanQuiz, gradeQuiz, makeCode, makeId, makeKey, publicClass, seedDemoClass } from '../shared/classroom'

const LS_CLASSES = 'ss-classes-local'
const LS_SUBS = 'ss-class-subs-local'
const LS_MINE = 'ss-my-classes'

const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d
  } catch {
    return d
  }
}
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* storage full or blocked */
  }
}

let modePromise
/** 'online' if the classroom function answers, otherwise 'local'. Checked once per page load. */
export function detectMode() {
  modePromise ??= getFn('classroom', { ping: 1 }).then((r) => (r.ok && r.data?.ok ? 'online' : 'local'))
  return modePromise
}

/* Classes this teacher created on this device (code + secret key). */
export const myClasses = () => read(LS_MINE, [])
function remember(entry) {
  write(LS_MINE, [entry, ...myClasses().filter((c) => c.code !== entry.code)])
}
export function forgetClass(code) {
  write(LS_MINE, myClasses().filter((c) => c.code !== code))
}
const keyFor = (code) => myClasses().find((c) => c.code === code)?.teacherKey

/* ------------------------------------------------ local implementation */
const local = {
  create(fields) {
    const cls = { code: makeCode(), teacherKey: makeKey(), quizzes: [], notes: [], createdAt: new Date().toISOString(), ...fields }
    write(LS_CLASSES, { ...read(LS_CLASSES, {}), [cls.code]: cls })
    return { code: cls.code, teacherKey: cls.teacherKey, class: publicClass(cls) }
  },
  createDemo(teacherName) {
    const { cls, submissions } = seedDemoClass(teacherName)
    write(LS_CLASSES, { ...read(LS_CLASSES, {}), [cls.code]: cls })
    write(LS_SUBS, { ...read(LS_SUBS, {}), [cls.code]: submissions })
    return { code: cls.code, teacherKey: cls.teacherKey, class: publicClass(cls) }
  },
  get(code) {
    const cls = read(LS_CLASSES, {})[code]
    return cls ?? null
  },
  save(cls) {
    write(LS_CLASSES, { ...read(LS_CLASSES, {}), [cls.code]: cls })
  },
  subs(code) {
    return read(LS_SUBS, {})[code] ?? []
  },
  addSub(code, sub) {
    const all = read(LS_SUBS, {})
    write(LS_SUBS, { ...all, [code]: [...(all[code] ?? []), sub] })
  },
}

const fail = (r) => {
  throw new Error(failReason(r))
}

/* ------------------------------------------------------- public API */
export async function createClass({ teacherName, subject, course, semester }) {
  const mode = await detectMode()
  if (mode === 'online') {
    const r = await postFn('classroom', { action: 'create', teacherName, subject, course, semester })
    if (!r.ok) fail(r)
    remember({ code: r.data.code, teacherKey: r.data.teacherKey, subject, mode, createdAt: new Date().toISOString() })
    return r.data
  }
  if (!subject?.trim() || !teacherName?.trim()) throw new Error('Subject and teacher name are required')
  const res = local.create({ teacherName: teacherName.trim(), subject: subject.trim(), course, semester })
  remember({ code: res.code, teacherKey: res.teacherKey, subject, mode, createdAt: new Date().toISOString() })
  return res
}

export async function createDemoClass(teacherName) {
  const mode = await detectMode()
  if (mode === 'online') {
    const r = await postFn('classroom', { action: 'createDemo', teacherName })
    if (!r.ok) fail(r)
    remember({ code: r.data.code, teacherKey: r.data.teacherKey, subject: r.data.class.subject, mode, demo: true, createdAt: new Date().toISOString() })
    return r.data
  }
  const res = local.createDemo(teacherName)
  remember({ code: res.code, teacherKey: res.teacherKey, subject: res.class.subject, mode, demo: true, createdAt: new Date().toISOString() })
  return res
}

export async function getClass(code) {
  const c = String(code).trim().toUpperCase()
  // A class made in offline mode only exists in this browser.
  const cached = local.get(c)
  if (cached) return { class: publicClass(cached), mode: 'local' }
  const r = await getFn('classroom', { code: c })
  if (r.ok) return { class: r.data, mode: 'online' }
  if (r.status === 404) throw new Error('No class found with this code. Check the code with your teacher.')
  fail(r)
}

async function teacherAction(action, code, extra) {
  const cached = local.get(code)
  if (cached) {
    if (action === 'results') return { class: publicClass(cached), insights: classInsights(cached, local.subs(code)) }
    if (action === 'addQuiz') {
      const quiz = cleanQuiz(extra.quiz)
      cached.quizzes = [...(cached.quizzes ?? []), quiz]
      local.save(cached)
      return { quizId: quiz.id, class: publicClass(cached) }
    }
    const note = cleanNote(extra.note)
    cached.notes = [note, ...(cached.notes ?? [])]
    local.save(cached)
    return { noteId: note.id, class: publicClass(cached) }
  }
  const r = await postFn('classroom', { action, code, teacherKey: keyFor(code), ...extra })
  if (!r.ok) fail(r)
  return r.data
}
export const addQuiz = (code, quiz) => teacherAction('addQuiz', code, { quiz })
export const addNote = (code, note) => teacherAction('addNote', code, { note })
export const getResults = (code) => teacherAction('results', code, {})

export async function submitQuiz(code, quizId, studentName, answers) {
  const cached = local.get(code)
  if (cached) {
    const quiz = cached.quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')
    if (studentName.trim().length < 2) throw new Error('Please enter your name')
    const graded = gradeQuiz(quiz, answers)
    local.addSub(code, { id: makeId(), quizId, studentName: studentName.trim(), answers, ...graded, at: new Date().toISOString() })
    return graded
  }
  const r = await postFn('classroom', { action: 'submit', code, quizId, studentName, answers })
  if (!r.ok) fail(r)
  return r.data
}
