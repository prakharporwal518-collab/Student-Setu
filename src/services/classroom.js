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

/* Classes created on this device (code + secret teacher key), each tagged with the owner's account id.
 * Classes made before accounts existed (no ownerId) are shown to whichever teacher signs in. */
const allMine = () => read(LS_MINE, [])
export const myClasses = (ownerId) => allMine().filter((c) => !ownerId || !c.ownerId || c.ownerId === ownerId)
function remember(entry) {
  write(LS_MINE, [entry, ...allMine().filter((c) => c.code !== entry.code)])
}
export function forgetClass(code) {
  write(LS_MINE, allMine().filter((c) => c.code !== code))
}
const keyFor = (code) => allMine().find((c) => c.code === code)?.teacherKey

/* -------- moving classes to another device (until real accounts sync this server-side) -------- */
const b64 = (str) => btoa(String.fromCharCode(...new TextEncoder().encode(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64 = (str) => new TextDecoder().decode(Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)))

/** Private link that opens this teacher's online classes on another device. */
export function transferLink(ownerId) {
  const list = myClasses(ownerId).filter((c) => c.mode === 'online').map(({ code, teacherKey, subject }) => ({ code, teacherKey, subject }))
  return list.length ? `${location.origin}/teacher?import=${b64(JSON.stringify(list))}` : null
}
/** Adds classes from a transfer link to this device. Returns how many were added. */
export function importClasses(token, ownerId) {
  const list = JSON.parse(unb64(token))
  if (!Array.isArray(list)) throw new Error('Invalid link')
  const valid = list.filter((c) => /^[A-Z0-9]{6}$/.test(c?.code) && typeof c?.teacherKey === 'string')
  valid.forEach((c) => remember({ code: c.code, teacherKey: c.teacherKey, subject: String(c.subject ?? '').slice(0, 100), mode: 'online', ownerId, createdAt: new Date().toISOString() }))
  return valid.length
}

/* ------------------------------------------------ local implementation */
const local = {
  create(fields) {
    const cls = { code: makeCode(), teacherKey: makeKey(), quizzes: [], notes: [], createdAt: new Date().toISOString(), ...fields }
    write(LS_CLASSES, { ...read(LS_CLASSES, {}), [cls.code]: cls })
    return { code: cls.code, teacherKey: cls.teacherKey, class: publicClass(cls) }
  },
  createDemo(teacherName, college) {
    const { cls, submissions } = seedDemoClass(teacherName, college)
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
/**
 * @param teacher  the signed-in teacher: { id, name, teacherProfile: { college } }
 */
export async function createClass(teacher, { subject, course, semester }) {
  const mode = await detectMode()
  const fields = { teacherName: teacher.name, college: teacher.teacherProfile?.college ?? '', teacherVerified: true, subject, course, semester }
  if (mode === 'online') {
    const r = await postFn('classroom', { action: 'create', ...fields })
    if (!r.ok) fail(r)
    remember({ code: r.data.code, teacherKey: r.data.teacherKey, subject, mode, ownerId: teacher.id, createdAt: new Date().toISOString() })
    return r.data
  }
  if (!subject?.trim()) throw new Error('Subject is required')
  const res = local.create({ ...fields, subject: subject.trim() })
  remember({ code: res.code, teacherKey: res.teacherKey, subject, mode, ownerId: teacher.id, createdAt: new Date().toISOString() })
  return res
}

export async function createDemoClass(teacher) {
  const mode = await detectMode()
  const college = teacher.teacherProfile?.college || undefined
  if (mode === 'online') {
    const r = await postFn('classroom', { action: 'createDemo', teacherName: teacher.name, college })
    if (!r.ok) fail(r)
    remember({ code: r.data.code, teacherKey: r.data.teacherKey, subject: r.data.class.subject, mode, demo: true, ownerId: teacher.id, createdAt: new Date().toISOString() })
    return r.data
  }
  const res = local.createDemo(teacher.name, college)
  remember({ code: res.code, teacherKey: res.teacherKey, subject: res.class.subject, mode, demo: true, ownerId: teacher.id, createdAt: new Date().toISOString() })
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
