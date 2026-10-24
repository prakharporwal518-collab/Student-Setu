// Request handler for Teacher Copilot classrooms (used by netlify/functions/classroom.mts).
// Kept separate from the function entry so it can be tested with an in-memory store.
import { classInsights, cleanNote, cleanQuiz, gradeQuiz, makeCode, makeId, makeKey, publicClass, seedDemoClass, ValidationError } from '../../src/shared/classroom.js'

const json = (body, status = 200) => Response.json(body, { status })
const clip = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n)
const classKey = (code) => `class/${code}`
const subPrefix = (code) => `subs/${code}/`

async function loadClass(store, code) {
  const c = clip(code, 6).toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(c)) return null
  return (await store.get(classKey(c), { type: 'json' })) ?? null
}
async function loadSubs(store, code) {
  const { blobs } = await store.list({ prefix: subPrefix(code) })
  const subs = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
  return subs.filter(Boolean)
}

/** Handles one request against a Blobs-like store ({ get, setJSON, list }). */
export async function handle(req, store) {
  if (req.method === 'GET') {
    const url = new URL(req.url)
    if (url.searchParams.has('ping')) return json({ ok: true })
    const cls = await loadClass(store, url.searchParams.get('code'))
    return cls ? json(publicClass(cls)) : json({ error: 'class_not_found' }, 404)
  }
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let b
  try {
    b = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  try {
    switch (b?.action) {
      case 'create': {
        const subject = clip(b.subject, 100)
        const teacherName = clip(b.teacherName, 60)
        if (!subject || !teacherName) return json({ error: 'Subject and teacher name are required' }, 400)
        const cls = { code: makeCode(), teacherKey: makeKey(), subject, teacherName, course: clip(b.course, 40), semester: clip(b.semester, 4), createdAt: new Date().toISOString(), quizzes: [], notes: [] }
        await store.setJSON(classKey(cls.code), cls)
        return json({ code: cls.code, teacherKey: cls.teacherKey, class: publicClass(cls) })
      }
      case 'createDemo': {
        const { cls, submissions } = seedDemoClass(clip(b.teacherName, 60) || undefined)
        await store.setJSON(classKey(cls.code), cls)
        await Promise.all(submissions.map((s) => store.setJSON(`${subPrefix(cls.code)}${s.id}`, s)))
        return json({ code: cls.code, teacherKey: cls.teacherKey, class: publicClass(cls) })
      }
      case 'addQuiz':
      case 'addNote':
      case 'results': {
        const cls = await loadClass(store, b.code)
        if (!cls) return json({ error: 'class_not_found' }, 404)
        if (!b.teacherKey || b.teacherKey !== cls.teacherKey) return json({ error: 'forbidden' }, 403)
        if (b.action === 'results') return json({ class: publicClass(cls), insights: classInsights(cls, await loadSubs(store, cls.code)) })
        if (b.action === 'addQuiz') {
          if ((cls.quizzes ?? []).length >= 50) return json({ error: 'Too many quizzes in this class' }, 400)
          const quiz = cleanQuiz(b.quiz)
          cls.quizzes = [...(cls.quizzes ?? []), quiz]
          await store.setJSON(classKey(cls.code), cls)
          return json({ quizId: quiz.id, class: publicClass(cls) })
        }
        const note = cleanNote(b.note)
        cls.notes = [note, ...(cls.notes ?? [])].slice(0, 100)
        await store.setJSON(classKey(cls.code), cls)
        return json({ noteId: note.id, class: publicClass(cls) })
      }
      case 'submit': {
        const cls = await loadClass(store, b.code)
        if (!cls) return json({ error: 'class_not_found' }, 404)
        const quiz = (cls.quizzes ?? []).find((q) => q.id === b.quizId)
        if (!quiz) return json({ error: 'quiz_not_found' }, 404)
        const studentName = clip(b.studentName, 60)
        if (studentName.length < 2) return json({ error: 'Please enter your name' }, 400)
        const answers = (Array.isArray(b.answers) ? b.answers : []).slice(0, quiz.questions.length).map((a) => (Number.isInteger(a) ? a : null))
        const graded = gradeQuiz(quiz, answers)
        const sub = { id: makeId(), quizId: quiz.id, studentName, answers, ...graded, at: new Date().toISOString() }
        await store.setJSON(`${subPrefix(cls.code)}${sub.id}`, sub)
        return json(graded)
      }
      default:
        return json({ error: 'unknown_action' }, 400)
    }
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400)
    console.error('Classroom error:', err)
    return json({ error: 'server_error' }, 500)
  }
}

