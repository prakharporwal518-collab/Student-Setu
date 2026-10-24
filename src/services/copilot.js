// Teacher Copilot + Skill Bridge coach. Uses Gemini through /.netlify/functions/copilot,
// and falls back to clearly-labelled templates when AI is unavailable, so demos never break.
import { postFn, failReason } from './functions'
import { quizzes } from '../data/exams'

const templates = {
  lesson: ({ topic, subject, minutes = 45 }) => {
    const m = Math.max(20, +minutes || 45)
    const part = (f) => Math.max(3, Math.round(m * f))
    return {
      title: `${topic} — ${subject || 'Lesson'}`,
      objectives: [`Explain the core idea of ${topic} in simple words`, `Solve a basic problem on ${topic}`, `Connect ${topic} to a real-life example`],
      prerequisites: ['Notes from the previous class', `Basic terms used in ${subject || 'this subject'}`],
      timeline: [
        { minutes: part(0.1), activity: 'Recap & hook', details: 'Ask 2 quick questions from the last class; share a real-life situation that needs this topic.' },
        { minutes: part(0.35), activity: 'Concept explanation', details: `Explain ${topic} step by step on the board with one diagram.` },
        { minutes: part(0.2), activity: 'Worked example', details: 'Solve one example together; students suggest each step.' },
        { minutes: part(0.25), activity: 'Pair activity', details: 'Students solve a similar problem in pairs, then 2 pairs explain.' },
        { minutes: part(0.1), activity: 'Summary & exit question', details: 'Summarise in 3 points; one exit question on a slip of paper.' },
      ],
      examples: [`Where ${topic} appears in daily life or in local industry`, 'A previous-year exam question on this topic'],
      activity: `Think–pair–share: each pair writes one question about ${topic} for another pair to answer. Works without projector or internet.`,
      homework: [`Write a one-page summary of ${topic} with one diagram`, 'Attempt two previous-year questions'],
      checkQuestions: [`What is ${topic}?`, `Give one example of ${topic}.`, `Where is ${topic} used?`],
    }
  },
  paper: ({ topic, subject, marks = 70 }) => {
    const units = String(topic).split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
    const u = (i) => units[i % units.length] || 'the syllabus'
    const total = +marks || 70
    const a = Math.round(total * 0.2), b = Math.round(total * 0.4), c = total - a - b
    return {
      title: `${subject || 'Subject'} — Model Question Paper`, duration: total >= 60 ? '3 hours' : '1.5 hours',
      instructions: ['Attempt all sections.', 'Draw neat diagrams wherever necessary.', 'Figures in brackets indicate marks.'],
      sections: [
        { name: 'Section A — Short answers', note: `${a / 2} questions × 2 marks`, questions: Array.from({ length: Math.max(1, a / 2) }, (_, i) => ({ q: `Define ${u(i)}.`, marks: 2, level: 'Remember' })) },
        { name: 'Section B — Medium answers', note: `${Math.max(1, Math.round(b / 7))} questions`, questions: Array.from({ length: Math.max(1, Math.round(b / 7)) }, (_, i) => ({ q: `Explain ${u(i)} with a suitable example.`, marks: Math.round(b / Math.max(1, Math.round(b / 7))), level: 'Understand' })) },
        { name: 'Section C — Long answers', note: `${Math.max(1, Math.round(c / 10))} questions`, questions: Array.from({ length: Math.max(1, Math.round(c / 10)) }, (_, i) => ({ q: `Analyse a real-world problem using ${u(i)}. Justify each step.`, marks: Math.round(c / Math.max(1, Math.round(c / 10))), level: 'Analyse' })) },
      ],
      totalMarks: total,
    }
  },
  quiz: ({ topic }) => {
    // Without AI, offer the closest quiz from the built-in question bank.
    const t = String(topic).toLowerCase()
    const bank = quizzes.find((qz) => t.split(/\s+/).some((w) => w.length > 2 && (qz.title.toLowerCase().includes(w) || qz.tag.toLowerCase().includes(w)))) ?? quizzes[0]
    return { questions: bank.questions.slice(0, 5).map((q) => ({ q: q.question, options: q.options, answer: q.answer, explanation: q.explanation, topic: bank.title })), fromBank: bank.title }
  },
  coach: ({ role, gaps, minutes }) => ({
    summary: `You are on your way to becoming a ${role}. Focus on your top gaps one at a time — consistency beats intensity.`,
    focus: String(gaps).split(',').slice(0, 3).map((g) => `Spend ${minutes} minutes a day on ${g.trim()} and finish one small exercise each day.`),
    tips: ['Study at the same time every day and keep your phone away.', 'Use free NPTEL and SWAYAM courses for theory.', 'Explain what you learnt to a friend — teaching is the fastest way to learn.'],
    project: `Build a small app or report that solves a problem in your college or town using ${String(gaps).split(',')[0] || 'your new skills'}.`,
  }),
}

/**
 * @returns {Promise<{ result: object, ai: boolean, note?: string }>}
 */
export async function generate(task, fields) {
  const r = await postFn('copilot', { task, ...fields })
  if (r.ok && r.data?.result) return { result: r.data.result, ai: true }
  if (r.status === 400) throw new Error(failReason(r))
  return { result: templates[task](fields), ai: false, note: `${failReason(r)} Showing a ready-made template instead.` }
}
